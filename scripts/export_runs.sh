#!/bin/bash
# Export eval_runs from D1 to JSONL format
# Usage: ./scripts/export_runs.sh

set -e

OUTPUT_DIR="artifacts/runs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="$OUTPUT_DIR/runs_$TIMESTAMP.jsonl"

echo "📤 Exporting eval_runs to JSONL..."

# Export from D1 using wrangler
npx wrangler d1 execute edge-jury-db --command "
SELECT 
    run_id, timestamp, colo, user_id, session_id,
    question, council_size, enable_cross_review, verification_mode,
    stages_json, stage1_json, stage2_json, stage3_json, stage4_json,
    total_latency_ms, total_tokens, cache_hit, error
FROM eval_runs 
ORDER BY timestamp DESC
" --json > "$OUTPUT_FILE.tmp"

# Convert to JSONL format (one JSON object per line)
cat "$OUTPUT_FILE.tmp" | jq -c '.[] | {
    run_id,
    timestamp,
    colo,
    user_id,
    session_id,
    question,
    council_size,
    enable_cross_review: (.enable_cross_review == 1),
    verification_mode,
    stages: (.stages_json | fromjson),
    stage1_results: (.stage1_json | fromjson),
    stage2_results: (.stage2_json | fromjson),
    stage3_result: (.stage3_json | fromjson),
    stage4_result: (.stage4_json | fromjson),
    total_latency_ms,
    total_tokens,
    cache_hit: (.cache_hit == 1),
    error
}' > "$OUTPUT_FILE"

rm "$OUTPUT_FILE.tmp"

# Generate metadata
TOTAL_RUNS=$(wc -l < "$OUTPUT_FILE")
echo "{
  \"export_timestamp\": \"$(date -Iseconds)\",
  \"total_runs\": $TOTAL_RUNS,
  \"output_file\": \"$OUTPUT_FILE\"
}" > "$OUTPUT_DIR/metadata.json"

echo "✅ Exported $TOTAL_RUNS runs to $OUTPUT_FILE"
echo "📋 Metadata saved to $OUTPUT_DIR/metadata.json"
