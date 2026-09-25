# PUN-001 CP004 Retrofit — ਲਿੰਗ ਅਤੇ ਵਚਨ

Status: **REVIEW_ONLY / HUMAN_APPROVED**

## Why this retrofit exists
The earlier forward-port retained 26 gender pairs, 32 number pairs and 12 agreement contexts. This pass re-audits the complete donor without using a target count.

## Exhaustive audited authority surface
- **58 distinct gender concepts**
- **66 distinct number concepts**
- **12 reviewed agreement contexts**
- **136 total atomic authorities**
- **39 direct-transform-safe gender pairs**
- **59 direct-transform-safe number pairs**
- **1,862 governed semantic combinations**

Raw donor:
- 90 gender rows
- 70 number rows
- 8 oblique-case records

The oblique-case records remain outside CP004 because they belong to case grammar.

## Quality filtering
Duplicate donor rows are collapsed by lexical concept rather than counted repeatedly.

Excluded gender mappings include ambiguous or non-gender relations such as:
- ਵਰ — ਕੰਨਿਆ / ਵਧੂ
- ਜਵਾਈ — ਧੀ
- ਤੋਤਾ — ਮੈਨਾ
- ਸੁਨਿਆਰ — ਸੁਨਿਆਰੀ / ਸੁਨਿਆਰਨ ambiguity
- ਸੰਤ — ਸੰਤਣੀ
- ਊਠ — ਊਠਣੀ where the audited lexical counterpart ਊਠ — ਡਾਚੀ is retained

Excluded weak number mappings:
- ਮੇਜ਼ — ਮੇਜ਼ਾਂ
- ਬਾਤ — ਬਾਤਾਂ
- ਬਲਾ — ਬਲਾਵਾਂ

Invariable number authorities are retained as valid grammatical authorities but are excluded from direct change-form families.

## Families
The previously reviewed nine-family architecture is retained:
F01 gender change; F02 correct gender pair; F03 mismatched gender pair; F04 singular→plural; F05 plural→singular; F06 correct number pair; F07 contextual agreement; F08 agreement correction; F09 two-statement agreement verification.

## Approval
Owner approval basis: PR #2009 chapter integration on 2026-09-20. Runtime remains REVIEW_ONLY.

## Lifecycle
This material retrofit was subsequently included in owner-approved chapter integration PR #2009 on 2026-09-20.

No Question Bank, Question Studio, test/mock or public delivery promotion is authorized.
