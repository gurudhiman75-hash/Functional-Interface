# CP009 Retrofit Source and Donor Boundary

## Donor reference
- Historical CP009 authority corpus at semantic V2 head `0f958f25cca1c0f90c9902a40d831cbef4f26729`
- Historical semantic V2 PR #1628
- Earlier forward-port PR #1844 is the source of the reviewed family architecture, not a numerical authority target

## Donor audit
Raw rows:
- 135 synonym sets
- 155 antonym rows
- 10 near-synonym contexts

Distinct retained authorities after audit:
- 98 synonym headwords
- 110 antonym concepts
- 10 contexts
- 218 total

## Deduplication rules
- repeated synonym headwords are merged and retain donor provenance IDs;
- antonyms are deduplicated as unordered lexical concepts, including reversed duplicates;
- same-source competing antonyms are not allowed in F02;
- spelling/wording variants do not inflate authority count.

## Quality rules
Weak synonym members are removed at member level where the headword remains valid.

The following donor antonym concepts were excluded as insufficiently strict for context-free direct testing:
- ਦੇਵਤਾ — ਰਾਖ਼ਸ਼
- ਚੇਲਾ — ਗੁਰੂ
- ਫਿੱਕਾ — ਮਿੱਠਾ
- ਛਾਂਟਣਾ — ਜੋੜਨਾ
- ਘਰੇਲੂ — ਜੰਗਲੀ
- ਟਿਕਾਊ — ਅਸਥਿਰ
- ਫਿੱਕਾ — ਗੂੜ੍ਹਾ
- ਪਤਲਾ — ਗਾੜ੍ਹਾ
- ਵਿਦਵਾਨ — ਮੂਰਖ

Obvious lexical defects were repaired rather than counted as separate authorities.

No fixed numerical cap is used. Retained count is determined by the audit.
