# PNC-001 Runtime Stress Audit

Date: 2026-07-24  
Status: **PASS**

## Runtime-proof sweep

- Active QLs: 106.
- Seeds per QL: 12.
- Generated cases: 1,272.
- Every seed generated twice.
- Strict targeted TypeScript compilation: PASS.
- Proof-test bundling: PASS.

## Package stress sweep

- Seeds per QL: 50.
- Generated cases: 5,300.
- Repeatability checks: first 10 seeds per QL, 1,060 checks total.

## Results

| Gate | Failures |
|---|---:|
| Parameter/domain validation | 0 |
| Solver versus independent verifier | 0 |
| Four-option uniqueness/correct-index contract | 0 |
| Explanation line/answer/placeholder contract | 0 |
| Exact English template duplicate groups | 0 |
| Rendered explanation duplicate groups | 0 |
| Registry/language parity | 0 |
| Required-placeholder parity | 0 |

## Dictionary-rank proof

- `PNC-QL-105`: RAHUL rank = 74; preceding arrangements = 73.
- `PNC-QL-106`: NAAGI rank among distinct arrangements of AGAIN = 49; preceding arrangements = 48.
- Production authority: multiset-corrected lexicographic block counting.
- Independent verifier: recursive generation of every distinct word in dictionary order.
- Solver/verifier disagreements: 0.

## Determinism

For repeatability seeds, the following were identical across both generations:

- rendered stem;
- generated parameters;
- four options and correct index;
- answer;
- explanation;
- mathematical fingerprint.

## Safety

The package remains English-only, unpublished and disconnected from generation-engine and Question Studio production routing.

## Verdict

Runtime and stress evidence support eligibility for English freeze review.