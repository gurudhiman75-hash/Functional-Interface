# CAE-001 semantic saturation report — V3 editorial-realness checkpoint

Run: 240 deterministic English seeds for every current provisional plan. Each generated state is also replayed in Hindi and Punjabi to verify locale-shared semantics and renderer isolation.

## Before / after

| Measure | Before V3 | Current quality checkpoint |
| --- | ---: | ---: |
| Authored worlds / variants | 7 fixed worlds | 27 composable variants in 9 scenario families |
| Fixed question records | 12 | 0; 9 provisional generation plans |
| Causal-state identity | Not measured | `family + variant + graph/substructure + direction + target/source/bridge`; excludes candidates and option order |
| Item identity | Not measured | causal state plus selected distractors, profile, and presentation |
| Unique causal structures | Not measured | 23 |
| Target/reference-relative validation checks | None | 2,880 |
| Explicit target/reference/relation applicability checks (CP-003/004/005/009) | None | 2,880 across every saturated candidate-producing state |
| Revisited causal states with a different valid candidate mix | Not measured | 90 |
| Causal states with multiple item presentations | Not measured | 227 |

## Per-plan evidence

| QL / CP | Causal states | Item variants | Structures | Families | Variants | Difficulty states | Mechanisms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| QL-001 / CP-001 | 52 | 218 | 6 | 3 | 9 | 1 | 3 |
| QL-002 / CP-002 | 15 | 185 | 3 | 3 | 9 | 1 | 3 |
| QL-003 / CP-003 | 45 | 236 | 9 | 5 | 15 | 2 | 5 |
| QL-004 / CP-004 | 33 | 226 | 8 | 4 | 12 | 2 | 4 |
| QL-005 / CP-005 | 12 | 160 | 3 | 4 | 12 | 1 | 3 |
| QL-006 / CP-006 | 12 | 154 | 2 | 4 | 12 | 1 | 3 |
| QL-007 / CP-007 | 24 | 201 | 4 | 2 | 6 | 1 | 3 |
| QL-008 / CP-008 | 12 | 161 | 2 | 4 | 12 | 1 | 3 |
| QL-009 / CP-009 | 24 | 222 | 4 | 4 | 12 | 2 | 5 |

The differing totals demonstrate new graph states and candidate sets separately. In particular, changing distractors or option order cannot inflate the causal-state figure.

## Quality gates exercised

- semantic candidates are either canonical-world events or complete variant-authored events; retired noun-substitution templates cannot render;
- timing, scope, magnitude, severity, and causal distance are checked against both the observation and graph-supported answer;
- every selected candidate in CP-003, CP-004, CP-005, and CP-009 is explicitly authorised for its projection, target semantic slot, reference semantic slot, and causal relation before target-relative scoring; a scenario-local event cannot gain credibility from variant membership alone;
- every CP-009 state is replayed in English, Hindi, and Punjabi with both visible endpoints excluded from canonical candidates; no option can repeat endpoint text, exactly one direct bridge remains, and target/reference applicability still holds;
- medium/hard candidate questions require two initially credible alternatives; CP-005 enforces this explicitly;
- target text cannot be inserted into a scenario-authored option, and template-like repeated openings are rejected;
- no answer/context leakage, hidden canonical facts, unresolved rendering tokens, or English fragments in Hindi/Punjabi;
- the materialized review pack has 10 samples per current CP/QL (90 total), multiple families, and every difficulty band the engine actually derives for that QL;
- QL allocation remains provisional and Question Studio stays review-only.

Run the verification:

```powershell
cd "C:\Users\gurbaj\Documents\ChatGPT\web app\artifacts\api-server"
.\node_modules\.bin\esbuild.cmd src/reasoning-v1/topics/Cause-and-Effect/CAE-001/cae-001.test.ts --bundle --platform=node --format=esm --outfile=dist/reasoning-v1/cae-001-realness.test.mjs
node dist/reasoning-v1/cae-001-realness.test.mjs
```

Expected tail: `PASS_CAE_001_GENERATIVE_CAUSAL_STATE_V3`.
