# PUN-001 CP007 Retrofit — ਕਾਰਕ, ਸੰਬੰਧਕ, ਯੋਜਕ ਅਤੇ ਵਿਸਮਿਕ

Status: **REVIEW_ONLY / HUMAN_REVIEW_PENDING**

## Final audited surface
- **95 sentence-grounded ਕਾਰਕ authorities**
- **39 sentence-grounded ਸੰਬੰਧਕ authorities** — 13 ਪੂਰਨ + 13 ਅਪੂਰਨ + 13 ਦੁਬਾਜਰਾ
- **23 sentence-grounded ਯੋਜਕ authorities**
- **37 contextual ਵਿਸਮਿਕ authorities**
- **194 total atomic authorities**
- **9 reviewed operation families**
- **6,180 governed semantic combinations**

## Donor audit
Historical donor:
- 80 ਕਾਰਕ rows
- 28 mixed connector-category rows
- 8 sentence-grounded conjunction-type rows

### ਕਾਰਕ
The donor is expanded after:
- exact duplicate collapse;
- normalization of the marker actually present in the target phrase;
- removal of weak/implicit marker examples such as `ਸਕੂਲੋਂ`, bare `ਕਿਨਾਰੇ`, and non-marker vocative forms;
- replacement of personal/local/religious examples with neutral exam-grade contexts where the authority itself is sound;
- sentence-derived distractors for context-to-ਕਾਰਕ operations.

### ਸੰਬੰਧਕ
The approved `ਪੂਰਨ / ਅਪੂਰਨ / ਦੁਬਾਜਰਾ` taxonomy is retained and expanded from 9 to 39 sentence-grounded authorities, balanced at 13 per class. The pass also corrects the inherited `ਸਾਹਮਣੇ` authority to ਅਪੂਰਨ because the governed sentence requires the supporting `ਦੇ` relation.

The breadth pass is deliberately conservative: new ਪੂਰਨ examples use forms directly supported as complete ਸੰਬੰਧਕ; new ਅਪੂਰਨ examples stay with ਪਰੇ / ਉਰੇ / ਦੂਰ patterns; new ਦੁਬਾਜਰਾ examples stay with the explicitly paired ਉੱਤੇ / ਦੇ ਉੱਤੇ and ਬਗੈਰ / ਦੇ ਬਗੈਰ patterns.

The donor also contains `ਵਿਕਾਰੀ / ਅਵਿਕਾਰੀ / ਸਥਾਨ-ਵਾਚਕ / ਦਿਸ਼ਾ-ਵਾਚਕ / ਸਾਧਨ-ਵਾਚਕ / ਕਾਰਨ-ਵਾਚਕ` labels. Those are a different classification dimension and are **not mixed** into the approved three-way family.

### ਯੋਜਕ
Seven additional donor sentence contexts are retained, including `ਇਸ ਲਈ`, `ਜੇਕਰ ... ਤਾਂ`, and `ਤਾਂ ਜੋ`, without changing the approved two-way `ਸਮਾਨ / ਅਧੀਨ` classification.

### ਵਿਸਮਿਕ
Donor marker inventories are promoted only after being grounded in natural contextual sentences. No new abstract subtype-classification family is invented.

## Families
The previously reviewed nine-family architecture is retained:
F01–F03 ਕਾਰਕ, F04 ਸੰਬੰਧਕ, F05–F06 ਯੋਜਕ, F07 contextual ਵਿਸਮਿਕ, F08 combined ਕਾਰਕ+ਯੋਜਕ diagnosis, F09 dual-statement verification.

## Lifecycle
The previous CP007 approval does not cover this material retrofit. Fresh owner approval is required on the exact reviewed SHA.

No Question Bank, Question Studio, test/mock or public delivery promotion is authorized.
