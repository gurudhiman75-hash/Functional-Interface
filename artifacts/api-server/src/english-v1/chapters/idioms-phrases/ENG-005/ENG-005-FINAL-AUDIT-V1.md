# ENG-005 — Idioms & Phrases — Final Audit V1

Status: `HUMAN_APPROVED__QUESTION_STUDIO_REGISTERED_REVIEW_ONLY`

## Final coverage

| Checkpoint | Unique expressions | Easy | Medium | Hard |
|---|---:|---:|---:|---:|
| CP001 — Core high-frequency idioms | 180 | 60 | 84 | 36 |
| CP002 — Standard competitive idioms | 240 | 72 | 96 | 72 |
| CP003 — Advanced/classical expressions | 240 | 48 | 96 | 96 |
| CP004 — Confusable/usage-sensitive expressions | 180 | 36 | 72 | 72 |
| **Total** | **840** | **216** | **348** | **276** |

## Coverage and quality invariants

The final audit verifies:

- exactly **840 unique phrase keys** across all four checkpoints;
- no exact phrase overlap between checkpoints;
- every record has a non-empty meaning and category;
- every CP supports Easy / Medium / Hard;
- every CP supports expression → meaning and meaning → expression;
- four unique options per generated question;
- deterministic generation;
- known near-equivalent families are never allowed to compete as distractors;
- CP004 stores 180 usage/context templates, all with an explicit idiom placeholder;
- those templates remain editorial source material and are **not** exposed by runtime generation yet.

## Why CP004 contexts are gated

A context QA pass found that mechanically inserting canonical dictionary forms such as `one's` can create unnatural surface grammar. Examtree therefore keeps the context templates but does not publish them in questions until a separate surface-realisation pass is complete.

This is intentional quality control, not missing lexical coverage.

## Lifecycle

ENG-005 is **human-approved** and registered in Question Studio in **review-only** mode.

Implementation completion does not authorize:
- Question Studio registration;
- Question Bank persistence;
- test/mock-test eligibility;
- learner/public exposure;
- automatic publication;
- production release.

Question Bank persistence, test/mock eligibility, learner/public exposure, automatic publication, and production release remain separately blocked. CP004 context templates also remain runtime-disabled pending their separate surface-realisation review.
