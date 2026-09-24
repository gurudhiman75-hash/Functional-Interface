# PUN-001 CP013 — ਵਾਕ-ਵਟਾਂਦਰਾ ਅਤੇ ਸ਼ੁੱਧੀ

Status: **REVIEW_ONLY / HUMAN_REVIEW_PENDING**

## Exhaustive audited authority surface
- 89 sentence-classification authorities
- 63 meaning-preserving transformation authorities
- 71 high-confidence sentence-correction authorities
- 223 total retained authorities

The donor exposed 245 raw records:
- 90 classification
- 75 transformation
- 80 correction

The forward-port removes clear semantic duplicates and excludes correction claims that are prescriptive, debatable, or not reliably wrong in standard Punjabi. No fixed authority count is targeted.

## Excluded donor records
Duplicate or near-duplicate:
- CLS-083
- TRF-044
- TRF-057\n- TRF-009\n- TRF-010\n- TRF-023\n- TRF-030\n- TRF-037\n- TRF-060\n- TRF-063\n- TRF-066\n- TRF-074\n- TRF-075

Debatable correction authorities:
- COR-006
- COR-011
- COR-012
- COR-018
- COR-019
- COR-046
- COR-055
- COR-070
- COR-075

COR-048 is retained with a meaning-preserving minimal correction.

## Families
- F01 Combined structure + function classification — Medium
- F02 Function classification — Easy
- F03 Forward meaning-preserving transformation — Easy
- F04 Reverse transformation — Medium
- F05 Sentence correction — Easy
- F06 Grammatical error diagnosis — Medium
- F07 Valid transformation-pair discrimination — Hard
- F08 Dual structural analysis — Hard
- F09 No-error / correct-sentence selection — Easy
- F10 Controlled grammatical blank completion — Easy
- F11 Mixed-rule verification (sentence classification + correction) — Hard

## Governed semantic breadth
The original eight families contribute 8,341 combinations before answer-order permutations. The blueprint-gap pass adds:
- 71 no-error sentence decisions;
- 8 strict grammatical-blank surfaces derived from the correction bank; 63 broader cases are excluded because they would require oversized or position-unstable blanks;
- 25,276 mixed-rule verification cases (89 classification × 71 correction × 4 truth patterns).\n\nTotal governed semantic breadth after gap closure: **33,696 combinations** before answer-order permutations.

F08 still exhaustively enumerates every ordered pair of distinct classification authorities: 89 × 88 = 7,832 hard dual-analysis cases.

## Editorial controls
- Punjabi-only learner stems and explanations
- city-specific donor wording removed
- no “ਟਕਸਾਲੀ”, trick, shortcut, or option-analysis filler
- every retained authority must be exercised as a target by every applicable family
- Easy/Medium/Hard are structurally different tasks, not cosmetic wording changes
- grammatical blanks are derived only when the reviewed correction alternatives yield at least four distinct governed fills
- no-error and mixed-rule families reuse the existing audited CP013 authorities; no unreviewed grammar truth is introduced

## Lifecycle
No permanent QL allocation, Question Studio registration, Question Bank write, test/mock eligibility, or public/student publication is authorized by this checkpoint.
