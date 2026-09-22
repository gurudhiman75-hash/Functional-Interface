# ENG-006 — One-word Substitution — Final Audit V2

Status: `IMPLEMENTATION_COMPLETE__1400_TERMS__HUMAN_EDITORIAL_REVIEW_PENDING__REVIEW_ONLY`

## Final coverage

| Checkpoint | Unique substitutions | Easy | Medium | Hard |
|---|---:|---:|---:|---:|
| CP001 — Core high-frequency substitutions | 180 | 60 | 84 | 36 |
| CP002 — Standard competitive substitutions | 240 | 72 | 96 | 72 |
| CP003 — Advanced substitutions | 240 | 48 | 96 | 96 |
| CP004 — Confusable/context-sensitive substitutions | 180 | 36 | 72 | 72 |
| CP005 — Extended competitive substitutions | 320 | 80 | 128 | 112 |
| CP006 — Long-tail/high-confusion substitutions | 240 | 60 | 96 | 84 |
| **Total** | **1,400** | **356** | **572** | **472** |

## Final quality invariants

The expanded chapter-wide audit verifies:

- exactly **1,400 unique answer keys** across all six checkpoints;
- no exact answer overlap between checkpoints;
- no exact duplicate normalized definitions;
- every entry has a non-empty definition and semantic category;
- every checkpoint supports Easy / Medium / Hard;
- each generated question has four unique options;
- all correct answers are deterministic and replayable;
- distractors remain within the same broad semantic domain;
- dedicated near-confusable families are blocked from appearing as alternate correct answers;
- every one of the 1,400 entries is exercised by the final soak;
- CP005 and CP006 add genuine new breadth rather than trivial morphological variants.

## Expanded breadth

The six-checkpoint bank now reaches substantially beyond the original core into people/personality, specialist roles, medicine, law, government, rhetoric, geography, environment, economics, physics, chemistry, biology, botany, architecture, military terminology, computing, astronomy, navigation, collective/social terminology, geometry and selected long-tail phobias.

## Lifecycle

ENG-006 remains **review-only**.

Implementation completion does not authorize:
- Question Studio registration;
- Question Bank persistence;
- test/mock-test eligibility;
- learner/public exposure;
- automatic publication;
- production release.

Explicit human editorial approval is required before Question Studio review-only registration.
