#!/bin/bash
# Sanitize JSONL files before public release
# Removes PII and sensitive data

set -e

INPUT_FILE="${1:-artifacts/runs/*.jsonl}"
OUTPUT_DIR="artifacts/runs/sanitized"

mkdir -p "$OUTPUT_DIR"

echo "🔒 Sanitizing JSONL files..."

for file in $INPUT_FILE; do
    if [ -f "$file" ]; then
        filename=$(basename "$file")
        output_file="$OUTPUT_DIR/sanitized_$filename"
        
        # Remove sensitive fields, hash user IDs
        cat "$file" | jq -c '
            .user_id = (if .user_id then (.user_id | @base64) else null end) |
            .session_id = (if .session_id then (.session_id | @base64) else null end) |
            del(.stage1_results[].response) |  # Keep structure, remove raw outputs for size
            del(.stage2_results[].rankings) |
            .question = (.question | .[0:100] + if length > 100 then "..." else "" end)
        ' > "$output_file"
        
        echo "  ✅ $filename → sanitized_$filename"
    fi
done

echo "✅ Sanitization complete. Files saved to $OUTPUT_DIR/"
