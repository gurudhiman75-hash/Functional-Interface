# PUN-001 CP011 Retrofit — ਮੁਹਾਵਰੇ

Status: **REVIEW_ONLY / HUMAN_REVIEW_PENDING**

## Why this retrofit exists
The earlier forward-port intentionally retained 64 idiom authorities. The historical donor contained 252 rows / 177 unique idiom strings. This retrofit removes the cap and audits the full donor corpus.

## Final audited surface
- **170 distinct idiom concepts**
- **28,344 semantically safe ordered pairs**
- **170,914 governed semantic combinations**
- all 64 previously approved idioms retained

Seven spelling/inflection duplicates were collapsed, including nukta, ਆਸਮਾਨ/ਅਸਮਾਨ, ਦਿਖਾਉਣਾ/ਵਿਖਾਉਣਾ, ਚੱਟਣੀ/ਚੱਟਣਾ and ਪੀਹਣਾ/ਪੀਸਣਾ variants.

Distinct idioms with similar meanings remain separate. Six exact-meaning collisions were rewritten more precisely so reverse meaning→idiom questions have one defensible answer.

Named historical/national donor contexts were generalized while preserving the idiom.

## Families
- F01 idiom → meaning — Easy
- F02 meaning → idiom — Easy
- F03 authored context → idiom — Medium
- F04 figurative precision — Medium
- F05 correct idiom–meaning pair — Medium
- F06 incorrect idiom–meaning pair — Medium
- F07 ordered two-meaning → idiom mapping — Hard
- F08 two-statement idiom verification — Hard

Wrong-option pairing is similarity-aware. Near-equivalent meanings are never used as false alternatives.

## Lifecycle
The previous 64-authority approval does not cover this retrofit head. Fresh owner approval is required.
