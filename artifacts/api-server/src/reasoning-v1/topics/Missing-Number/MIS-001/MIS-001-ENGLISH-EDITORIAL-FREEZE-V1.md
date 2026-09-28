# MIS-001 English Editorial Freeze V1

Status: **COMPLETE**

## 1. Preconditions

Passed before freeze:

- practical SSC / Banking / Punjab source saturation;
- final chapter-wide merge/split recheck;
- 112 runtime-pattern audit;
- 75 canonical semantic-authority audit;
- 37 alias / reuse-variant audit;
- independent solver / ambiguity checks for CP001–CP028.

## 2. Frozen English stem contract

Production-facing English stems use only concise exam-standard instruction forms:

- `Find the number that will replace the question mark (?).`
- `Find the missing value in the following figure.`
- `Find the missing value in the following figures.`
- `Find the missing number.`
- `Find the missing number in the following figures.`

Source-discovered wording such as `Study the pattern...` / `Study the figure...` is not permitted in learner-facing stems.

## 3. Frozen explanation contract

Learner-facing explanations must:

- describe the arithmetic relation in plain English;
- show the completed examples before the target where useful;
- show the target calculation explicitly;
- end with the solved missing value;
- use exact whole-number arithmetic unless the source-backed family explicitly requires another supported representation;
- avoid internal engine identifiers.

Learner-facing text must not expose:

- `MIS-CAND-*` IDs;
- `MIS-CP-*` IDs;
- rule-enum identifiers such as `ROW_PRODUCTS_SUM`;
- `semantic authority`, `candidate id` or `checkpoint id` terminology;
- SSC / PSPCL / PSSSB / RRB / IBPS / SBI source provenance;
- `source-backed` metadata.

Source provenance and engine metadata remain available only in review / traceability metadata.

## 4. Editorial corrections included

### Source-discovered stem normalization

CP017–CP026 and CP028 source-discovered / enrichment stems were normalized from mechanical `Study the...` wording to the direct exam-standard forms.

### CP012 rule-competition explanation

Internal rule IDs were replaced with learner-friendly descriptions such as:

- add the two numbers;
- multiply the two numbers;
- square the first number, then add the second;
- multiply each row pair and add the two products.

### CP024 affine semantic correction

The source row shows the same `×3+1` transform between adjacent values, but the missing final value only requires:

`result = 3 × second + 1`

The first-to-second relation is retained as source-form consistency rather than incorrectly claiming that recursive application is required to solve the blank.

## 5. Executable freeze guard

`english-editorial-freeze.test.ts` generates all runtime patterns and verifies:

- 112 runtime questions are reachable;
- approved first-line stem forms only;
- no `Study the pattern/figure(s)` wording;
- no MIS internal IDs in stem/explanation;
- no engine enum tokens in learner text;
- no source provenance leakage;
- every explanation contains its generated answer;
- Question Studio emits `ENGLISH_EDITORIAL_FROZEN`;
- localization state is `ENGLISH_FROZEN_LOCALIZATION_NOT_STARTED`.

The dedicated MIS workflow executes this guard.

## 6. Frozen inventory

- runtime patterns: **112**
- canonical semantic authorities: **75**
- aliases / reuse variants: **37**
- promotion-ready canonical authorities: **73**
- source-thin canonical holds: **2**
  - MIS-CAND-034 SMALL_FACTORIAL
  - MIS-CAND-095 `a+4b+1`
- permanent QLs allocated: **0**

## 7. Next lifecycle gate

Proceed to **PERMANENT QL ALLOCATION**.

Allocation rules:

- renderer, role map, missing position, inverse direction and rule-competition presentation must not create separate QLs;
- aliases must point to the permanent QL of their canonical semantic authority;
- the two source-thin canonical holds must remain unallocated / non-production-promoted unless their evidence status is deliberately changed.

Hindi and Punjabi localization start only after permanent QL identities are frozen.
