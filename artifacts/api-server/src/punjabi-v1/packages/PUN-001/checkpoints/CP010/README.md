# PUN-001 CP010 — ਬਹੁਤੇ ਸ਼ਬਦਾਂ ਦੀ ਥਾਂ ਇੱਕ ਸ਼ਬਦ

Status: **REVIEW_ONLY / HUMAN_REVIEW_PENDING**

## Audited authority surface
- 64 high-confidence phrase → one-word authorities
- 8 balanced semantic domains
- 8 authorities per domain
- no duplicate answer word
- no duplicate source phrase

The older CP010 V2 implementation and donor pool were inspected as reference material only. The forward port does not automatically carry the full legacy pool, category drift, duplicate concepts, synthetic sentence shells, or English glosses.

## Families
- F01 Direct phrase → word — Easy
- F02 Direct word → phrase — Easy
- F03 Same-domain phrase precision — Medium
- F04 Same-domain definition precision — Medium
- F05 Identify incorrect mapping — Medium
- F06 Identify correct mapping — Medium
- F07 Ordered two-phrase mapping — Hard
- F08 Two-statement substitution verification — Hard

## Governed semantic breadth
3,008 semantic combinations before option-order permutations.

Difficulty is structural:
- Easy uses a single authority with cross-domain alternatives.
- Medium requires discrimination inside the same semantic domain.
- Hard requires two independent one-word substitution decisions.

## Lifecycle
No permanent QL allocation, Question Studio registration, Question Bank write, test/mock eligibility, or public/student publication is authorized by this checkpoint.
