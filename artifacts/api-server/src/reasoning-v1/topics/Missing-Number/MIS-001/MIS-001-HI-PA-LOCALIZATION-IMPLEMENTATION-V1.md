# MIS-001 Hindi / Punjabi Localization Implementation V1

Status: **IMPLEMENTED — EDITORIAL REVIEW PENDING**

## Frozen identity basis

Localization is implemented against the frozen permanent identity registry:

- permanent QLs: **MIS-QL-001..MIS-QL-073**
- promotion-ready canonical authorities: **73**
- source-thin holds without permanent QLs: **2**
  - MIS-CAND-034 SMALL_FACTORIAL
  - MIS-CAND-095 a+4b+1

No localization wave creates, renumbers, splits or merges permanent QLs.

## Coverage

Hindi and Punjabi learner-facing generation now covers **all MIS-CP-001..MIS-CP-028 runtime patterns**.

Wave coverage:

- Wave 1 — CP001..CP004: 34 runtime patterns / 31 permanent QLs represented
- Wave 2 — CP005..CP009: 34 runtime patterns / 15 permanent QLs represented
- Wave 3 — CP010..CP015: 21 runtime patterns / 19 permanent QLs represented
- Wave 4 — CP016..CP028: 23 runtime patterns / 22 permanent QLs represented, plus source-thin MIS-CAND-095 review runtime

Across waves, aliases intentionally overlap the same permanent QL. The complete permanent localized identity set remains **73**.

## Parity contract

For the same seed and runtime pattern, EN / HI / PA must preserve:

- identical generated numbers;
- identical correct answer and correct option position;
- identical options;
- identical structural and numeric fingerprints;
- identical figure payloads;
- identical hidden complete structure;
- identical canonical semantic authority;
- identical permanent QL mapping.

Only learner-facing stem and explanation prose may differ by language.

## Language contract

Hindi and Punjabi wording is direct exam-style language. Learner-facing text must not expose:

- MIS-CAND / MIS-CP internal IDs;
- rule enum names;
- source provenance;
- engine terminology.

Mathematical notation remains unchanged where that is clearer than verbal rewriting.

## Lifecycle

Localization implementation is complete, but multilingual editorial freeze is **not yet claimed**.

Still blocked:

- Question Bank writes;
- mock/scored-test eligibility;
- public/student publication;
- production release authorization.

## Next gate

Run human/editorial Hindi-Punjabi review and the final three-language parity / difficulty / large-corpus readiness pass. Only after that may multilingual freeze and production activation be considered.
