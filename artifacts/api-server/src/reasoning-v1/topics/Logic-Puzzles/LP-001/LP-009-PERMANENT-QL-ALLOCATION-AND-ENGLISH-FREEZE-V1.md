# LP-009 — Permanent QL Allocation and English Freeze V1

Status: **PERMANENT QL ALLOCATION APPLIED / ENGLISH FROZEN V1. Runtime remains `REVIEW_ONLY`; localization and every delivery gate remain locked.**

Date: **2026-09-10**

This checkpoint follows the approved `LP-009-ENGLISH-EDITORIAL-APPROVAL-V2.md` learner surface. It converts the four reviewed LP-009 candidate identities into permanent QL ownership without changing the generator, solver, question wording, answers, difficulty model or approved explanation style.

## Permanent allocation

| Permanent QL | Solve authority | Learner task |
|---|---|---|
| `LP-QL-033` | `VALUE_TO_ENTITY_LOOKUP` | Given a stated month or year, identify the person/entity assigned to it. |
| `LP-QL-034` | `ENTITY_TO_VALUE_LOOKUP` | Given a stated person/entity, identify the assigned month or year. |
| `LP-QL-035` | `ORDERED_PAIR_MATCH` | Identify the correct ordered pair of values for two stated people/entities. |
| `LP-QL-036` | `ORDERED_POSITION_ENTITY_LOOKUP` | Identify the entity occupying a position derived from the completed ordered schedule. |

Permanent range after this checkpoint: **`LP-QL-033..036`**.  
Next available LP identity after this checkpoint: **`LP-QL-037`**.

## Merge/split decision

The four authorities remain separate because their answer contracts are materially different:

- `LP-QL-033` reverses the completed mapping from a named value to its entity;
- `LP-QL-034` reads the completed mapping from a named entity to its value;
- `LP-QL-035` returns an ordered two-value match and therefore owns a different option/distractor contract from a one-value lookup;
- `LP-QL-036` first derives an ordered position from the question and then identifies the entity occupying that position.

Month and year scenarios do **not** receive separate QLs. They share the same six-position one-to-one scheduling model, clue semantics and completed-table reasoning. Birth/interview/course/review contexts are presentation parameters rather than solve identities.

For `LP-QL-036`, the month surface may derive the requested position as the next listed month after a named entity, while the year surface may name an absolute ordered position such as second-oldest. Both are retained inside one ordered-position entity-lookup authority because the answer operation is the same after the requested position is resolved: read the entity occupying that position from the unique completed schedule.

## Frozen English authority

English learner content is frozen to the already approved V2 editorial contract. Every LP-009 explanation must continue to:

1. record direct entries first;
2. process every remaining clue explicitly;
3. state the concrete effect of that clue on the named entities;
4. show progressively narrowed tables after meaningful deductions;
5. show the unique completed schedule;
6. answer the exact child question from the relevant row or rows.

The freeze forbids regressions to generic filler such as “use all the clues”, “apply all the clues”, “simply choose” or an answer-only final table.

The approved wording principles remain unchanged: simple exam-like English, no unnecessary shortcut/trap section, no machine-facing IDs in learner explanations, no local city/centre objects, calendar-order interpretation for month questions, and ordered-year reasoning without age arithmetic.

## Executable freeze guard

`lp-009-permanent-freeze.test.ts` re-proves a deterministic freeze corpus of **100 caselets / 400 child questions** and requires:

- exactly the four permanent QLs above;
- all eight LP-009 scenario profiles;
- both month and year modes;
- Easy, Medium and Hard structural bands;
- one unique schedule for every caselet;
- exactly 100 questions per permanent QL;
- answer positions exactly balanced `25 / 25 / 25 / 25` for every permanent QL;
- approved V2 direct-entry, clue-by-clue and progressive-table explanation behavior;
- no localization or product-delivery unlock.

The existing `lp-009.test.ts`, `lp-009-explanation-quality-v2.test.ts`, `difficulty-calibration.test.ts` and `lp-009-question-studio.test.ts` remain supporting regression authorities.

## Lifecycle after freeze

```text
LP-009 permanent QLs:          LP-QL-033..036
Permanent QL count:            4
English editorial authority:   V2 APPROVED
English freeze:                FROZEN V1
Question Studio:               REVIEW_ONLY
Hindi/Punjabi localization:    NOT_STARTED
Question Bank:                 NOT_STORED
Question Bank writable:        false
Test eligibility:              INELIGIBLE
Mock-test eligibility:         false
Public publication:            false
Automatic student publication: false
```

Permanent QL allocation and English freeze are content-identity gates only. They do not authorize persistence, Question Bank admission, test/mock use or student publication.

## Next gate

The next LP-009 content checkpoint is **Hindi/Punjabi localization against the frozen English semantic and explanation authority**. Localization must preserve the same schedule state, clues, options, correct answer, permanent QL identity and deduction path before any multilingual freeze or downstream release gate can be considered.
