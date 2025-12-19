# EdgeJury Evaluation Harness

This directory contains evaluation scripts to benchmark EdgeJury against baselines for the research paper.

## Setup

```bash
cd eval
pip install -r requirements.txt
```

## Running Evaluations

### Quick test (5 samples)
```bash
python run_eval.py --samples 5
```

### Full TruthfulQA evaluation (30 samples)
```bash
python run_eval.py --benchmark truthfulqa --samples 30
```

### Ablation study only
```bash
python run_eval.py --benchmark ablation --samples 15
```

### Full evaluation (all benchmarks)
```bash
python run_eval.py --benchmark all --samples 30
```

## Output

Results are saved to `results/results.md` with:
- Accuracy comparison (EdgeJury vs baseline)
- Latency breakdown by stage
- Verification statistics
- Ablation study tables
- Detailed per-question results

## Benchmarks

### TruthfulQA Subset
30 questions covering:
- Misconceptions (10)
- Factual knowledge (10)
- Health myths (5)
- Science (5)

### Ablation Configurations
1. **Full Pipeline** - All 4 stages enabled
2. **No Verification** - Stage 4 disabled
3. **No Cross-Review** - Stage 2 disabled
4. **Minimal** - Only Stage 1 + Stage 3

## Estimated Time

- 5 samples: ~2 minutes
- 30 samples: ~15 minutes
- Full with ablation: ~30 minutes

## API Endpoint

By default, queries go to:
```
https://edge-jury-worker.aayushakumars.workers.dev
```

To test locally, modify `API_URL` in `run_eval.py`.
