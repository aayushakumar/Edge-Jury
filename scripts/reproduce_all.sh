#!/bin/bash
# Reproduce All EdgeJury Evaluation Results
# ==========================================
# This script runs the complete evaluation suite used in the research paper.
#
# Prerequisites:
# - Python 3.9+
# - pip install aiohttp numpy scipy
# - Access to EdgeJury API (or local deployment)
#
# Usage:
#   ./scripts/reproduce_all.sh [--samples N] [--quick]

set -e

# Configuration
SAMPLES=${SAMPLES:-50}
OUTPUT_DIR="paper/figures"
RESULTS_DIR="eval/results"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --samples)
            SAMPLES="$2"
            shift 2
            ;;
        --quick)
            SAMPLES=10
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

echo "🔬 EdgeJury Reproduction Suite"
echo "=============================="
echo "Samples per benchmark: $SAMPLES"
echo ""

# Create directories
mkdir -p "$OUTPUT_DIR" "$RESULTS_DIR"

# Step 1: Run TruthfulQA baseline evaluation
echo "📊 Step 1: TruthfulQA Baseline Evaluation"
echo "-----------------------------------------"
python3 eval/baselines/run_baselines.py \
    --dataset truthfulqa \
    --samples "$SAMPLES" \
    --baselines single_model,edgejury_full,edgejury_no_stage2,edgejury_no_stage4 \
    --output "$RESULTS_DIR/truthfulqa_baselines.md"

# Step 2: Run EdgeCases evaluation  
echo ""
echo "📊 Step 2: EdgeCases Adversarial Evaluation"
echo "-------------------------------------------"
python3 eval/baselines/run_baselines.py \
    --dataset edge_cases \
    --samples "$SAMPLES" \
    --baselines single_model,edgejury_full,edgejury_no_stage2,edgejury_no_stage4 \
    --output "$RESULTS_DIR/edgecases_baselines.md"

# Step 3: Statistical analysis
echo ""
echo "📈 Step 3: Statistical Analysis"
echo "-------------------------------"
if [ -f "$RESULTS_DIR/truthfulqa_baselines.json" ]; then
    python3 eval/stats/stats_analysis.py \
        "$RESULTS_DIR/truthfulqa_baselines.json" \
        "$RESULTS_DIR/stats_report.md"
fi

# Step 4: Generate combined report
echo ""
echo "📝 Step 4: Generate Combined Report"
echo "-----------------------------------"

cat > "$RESULTS_DIR/combined_results.md" << EOF
# EdgeJury Evaluation Results

Generated: $(date -Iseconds)
Samples per benchmark: $SAMPLES

## TruthfulQA Results

$(cat "$RESULTS_DIR/truthfulqa_baselines.md" 2>/dev/null || echo "Not available")

---

## EdgeCases Results

$(cat "$RESULTS_DIR/edgecases_baselines.md" 2>/dev/null || echo "Not available")

---

## Statistical Analysis

$(cat "$RESULTS_DIR/stats_report.md" 2>/dev/null || echo "Not available")
EOF

echo ""
echo "✅ Reproduction Complete!"
echo "========================="
echo ""
echo "Results saved to:"
echo "  - $RESULTS_DIR/truthfulqa_baselines.md"
echo "  - $RESULTS_DIR/edgecases_baselines.md" 
echo "  - $RESULTS_DIR/stats_report.md"
echo "  - $RESULTS_DIR/combined_results.md"
echo ""
echo "To generate paper figures, run:"
echo "  python3 eval/generate_figures.py"
