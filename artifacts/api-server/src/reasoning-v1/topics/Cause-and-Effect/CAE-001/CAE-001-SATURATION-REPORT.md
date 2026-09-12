# CAE-001 semantic saturation report — V3 quality hardening

Run: 240 deterministic seeds for each current provisional generation plan (`2,160` semantic-generation requests; each checked in EN, HI, and PA).

## Before / after

| Measure | Prior V2 | V3 checkpoint result |
| --- | ---: | ---: |
| Authored causal worlds / scenario variants | 7 fixed worlds | 27 composable variants in 9 scenario families |
| Finished projection records | 12 | 0; 9 provisional generation plans |
| Seed variation proof | Option position only | Semantic instance, family, variant, causal structure, difficulty, and distractor-mechanism coverage |
| Unique causal structures across run | Not measured | 23 |
| Derived difficulty states | Authored per projection | EASY, MEDIUM, HARD, derived from graph state and candidate burden |
| Distractor mechanisms observed | Static per record | 9: common-cause confusion, correlation, indirectness confusion, magnitude mismatch, reverse causation, temporal violation, unrelated event, weak cause, wrong scope |
| Target-relative candidate checks | None | 2,880 calculated timing/scope/magnitude/severity/distance checks |
| Candidate-set variation | Static first-three selection | 108 repeatedly visited family/variant/target groups; all have more than one valid misconception mix |
| Semantic versus option-order proof | Not measured | 327 semantic instances retain their semantic ID while option order varies |

## Per-plan evidence

| Current provisional QL / CP | Semantic instances | Structures | Families | Variants | Difficulty states | Distractor mechanisms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| QL-001 / CP-001 | 52 | 6 | 3 | 9 | 2 | 3 |
| QL-002 / CP-002 | 15 | 3 | 3 | 9 | 2 | 3 |
| QL-003 / CP-003 | 187 | 9 | 5 | 15 | 2 | 8 |
| QL-004 / CP-004 | 182 | 8 | 4 | 12 | 2 | 8 |
| QL-005 / CP-005 | 108 | 3 | 4 | 12 | 1 | 8 |
| QL-006 / CP-006 | 12 | 2 | 4 | 12 | 2 | 3 |
| QL-007 / CP-007 | 24 | 4 | 2 | 6 | 1 | 3 |
| QL-008 / CP-008 | 12 | 2 | 4 | 12 | 2 | 3 |
| QL-009 / CP-009 | 152 | 4 | 4 | 12 | 2 | 8 |

The differing semantic-instance counts are expected: a plan can choose family, variant, graph substructure, direction, target, or missing bridge. Option order is deliberately excluded from the semantic-instance identifier, so these counts cannot be inflated by shuffling.

## QA assertions exercised

- exact seed replay;
- exactly one answer and four unique default-profile options;
- locale-shared semantic instance, answer, option ordering, difficulty, causal trace, and visible node set;
- no hidden canonical event text in the stem;
- no English renderer or explanatory fragment in Hindi or Punjabi output;
- no automatic setting line in normal exam-form questions;
- scenario-local target-aware rule rendering, no unresolved render tokens, and no generic/meta distractor wording;
- graph-cycle, temporal-order, duplicate-slot, target-relative candidate ambiguity, answer-leakage, and independence-cue gates;
- within-QL difficulty coverage for every pedagogically appropriate difficulty state;
- semantic identity stays stable when only option order changes;
- current provisional QL allocation, review-only package visibility, and persistence lock.

The green proof command is:

```powershell
cd "C:\Users\gurbaj\Documents\ChatGPT\web app\artifacts\api-server"
.\node_modules\.bin\esbuild.cmd src/reasoning-v1/topics/Cause-and-Effect/CAE-001/cae-001.test.ts --bundle --platform=node --format=esm --outfile=dist/reasoning-v1/cae-001-generative.test.mjs
node dist/reasoning-v1/cae-001-generative.test.mjs
```

Expected tail: `PASS_CAE_001_GENERATIVE_CAUSAL_STATE_V3`.
