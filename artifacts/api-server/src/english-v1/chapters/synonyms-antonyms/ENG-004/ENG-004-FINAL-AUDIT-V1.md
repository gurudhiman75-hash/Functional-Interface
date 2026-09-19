# ENG-004 — Synonyms & Antonyms — Final Expansion Audit V1

Status: `EXPANSION_COMPLETE__HUMAN_EDITORIAL_REVIEW_PENDING__REVIEW_ONLY`

## Final lexical coverage

| Checkpoint | Unique/new headwords | Additional senses | Synonym links | Antonym links |
|---|---:|---:|---:|---:|
| CP001 — Core high-frequency vocabulary | 500 | 500 | 748 | 216 |
| CP002 — Standard competitive vocabulary | 600 | 600 | 1,245 | 375 |
| CP003 — Advanced competitive vocabulary | 450 | 450 | 870 | 158 |
| CP004 — Context-sensitive alternate senses | 0 new | 300 | 751 | 84 |
| CP005 — Confusable & near-meaning sets | 550 | 550 | 1,910 | 152 |
| **Total** | **2,100 unique headwords** | **2,400 headword-senses** | **5,524** | **985** |

## Why antonym links are lower than synonym links

The engine does **not** force every word to have an antonym. Many English words have several defensible synonyms but no clean lexical opposite.

A WordNet adjective-satellite closure experiment could mechanically raise the antonym count much higher, but it also surfaced remote or context-dependent "opposites". That enrichment was therefore rejected. The final count above retains explicit, defensible stored relations instead of chasing a numerical target.

## Coverage invariants

The final automated audit must verify:

- CP001 = 500 unique headwords.
- CP002 = 600 unique headwords with zero CP001 overlap.
- CP003 = 450 unique headwords with zero CP001/CP002 overlap.
- CP004 = 300 alternate senses and every CP004 headword belongs to the first 1,550 curated words.
- CP005 = 550 unique headwords with zero CP001–CP003 overlap.
- Combined unique headwords = 2,100.
- Combined headword-senses = 2,400.
- Stored synonym links = 5,524.
- Stored antonym links = 985.
- Every stored sense has at least one answer relation.
- Every multi-sense CP005 entry has context.
- CP004 always has context and all original-sense relations remain blocked from distractors.

## Lifecycle

ENG-004 remains **review-only**.

Expansion completion does not authorize:
- Question Studio registration;
- Question Bank writes;
- learner/test/mock/public exposure;
- automatic production promotion.

Those gates require explicit human editorial approval.
