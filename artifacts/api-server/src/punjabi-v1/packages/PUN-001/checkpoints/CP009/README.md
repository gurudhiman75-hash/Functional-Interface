# PUN-001 CP009 Retrofit — ਸਮਾਨਾਰਥਕ ਅਤੇ ਵਿਰੋਧੀ ਸ਼ਬਦ

Status: **REVIEW_ONLY / HUMAN_REVIEW_PENDING**

## Why this retrofit exists
The earlier forward-port deliberately capped CP009 at 64 atomic authorities. That cap is now removed.

The historical donor was re-audited exhaustively instead of sampling to a target number. A later breadth pass expands contextual application without altering the direct synonym/antonym banks.

## Exhaustive audited authority surface
Raw donor:
- 135 synonym rows
- 155 antonym rows
- 10 authored near-synonym contexts
- 300 total rows

After duplicate collapse and semantic audit:
- **98 unique synonym headword authorities**
- **110 unambiguous antonym concept authorities**
- **60 authored context authorities** (10 retained donor contexts + 50 new exam-grade contextual distinctions)
- **268 total authorities**

Additional lexical breadth:
- **378 validated synonym edges**
- **86 deep synonym authorities** with at least three strong synonyms, used by set/discrimination families

## Editorial cleanup
Duplicate synonym headwords were merged rather than counted repeatedly.

Antonym pairs were collapsed by unordered concept. Weak, relational or strongly context-dependent pairs were removed. Several obvious donor defects were repaired, including:
- ਸੂਖ਼ਮ — ਸਥੂਲ
- ਤਕੜਾ — ਕਮਜ਼ੋਰ
- ਸਵਦੇਸ਼ — ਵਿਦੇਸ਼
- ਧਰਮੀ — ਅਧਰਮੀ
- ਚੜ੍ਹਨਾ — ਉਤਰਨਾ
- ਤੇਜ਼ — ਹੌਲਾ

A remaining ambiguous source mapping, ਵਿਦਵਾਨ → ਮੂਰਖ, was removed; ਵਿਦਵਾਨ → ਅਨਪੜ੍ਹ remains the governed direct pair.

Weak synonym members are removed without deleting otherwise valid headword authorities. Headwords with fewer than three strong synonyms remain eligible for direct recognition, but are not padded into deep set families.

## Families
- F01 direct synonym — Easy
- F02 direct antonym — Easy
- F03 synonym/antonym pair recognition — Easy
- F04 authored context precision — Medium
- F05 synonym outsider — Medium
- F06 synonym-set completion — Medium
- F07 dual relation diagnosis — Hard
- F08 dual statement verification — Hard

## Governed semantic breadth
**66,463 combinations** before answer-order permutations.

All 60 contextual authorities are reachable through F04. Every retained authority is reachable by its applicable families. Every validated synonym edge is exercised by F01/F03. All four F08 truth outcomes are governed.

## Lifecycle
This retrofit materially changes learner-facing authorities and generation breadth, so the previous CP009 approval does not cover this head.

No runtime/publication promotion is authorized.
