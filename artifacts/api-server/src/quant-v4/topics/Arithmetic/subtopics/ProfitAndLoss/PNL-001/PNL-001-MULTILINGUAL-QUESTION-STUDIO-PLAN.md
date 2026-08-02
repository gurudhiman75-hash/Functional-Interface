# PNL-001 Multilingual Question Studio Review Plan

Status: **IMPLEMENTATION IN PROGRESS — REVIEW ONLY**

## Goal

Expose the approved PNL-001 canonical review authority in English, Hindi and Punjabi through the existing single Question Studio package.

The phase does not enable generated content for Question Bank storage, test assembly or public publication.

## Frozen scope

- package: `PNL-001`;
- canonical problems: `PNL-CP-001` through `PNL-CP-006`;
- question languages: `PNL-QL-001` through `PNL-QL-186`;
- supported canonical-review languages: `en`, `hi`, `pa`;
- runtime mode: `CANONICAL_REVIEW`;
- native editorial authority: multilingual reconstruction Wave 03 merged through PR #428.

## Authority composition

The multilingual adapter will preserve distinct authorities instead of copying or translating runtime packages ad hoc:

1. the existing canonical review library remains authoritative for QL ownership, CP ownership, solve mode, representation, difficulty, four-option order, correct index and keyed answer;
2. the merged Wave 03 libraries remain authoritative for Hindi and Punjabi structured stems and explanations;
3. English continues to use the existing canonical review fixture unchanged;
4. textual option and answer values must pass through an explicit audited localization map; numeric, currency, percentage, fraction and algebraic choices remain unchanged;
5. the selected option at `correctIndex` must equal the localized answer in every language.

## Runtime contract

Canonical review output must carry:

```text
reviewStatus: APPROVED_EDITORIAL_CANONICAL
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
runtimeMode: CANONICAL_REVIEW
```

The requested language must be preserved in package parameters, traceability and preview metadata.

## Dynamic-candidate boundary

`DYNAMIC_CANDIDATE` remains English-only in this phase. Native dynamic generation requires a separate audit of generated variables, entity grammar, localized options, answer semantics and value-specific explanations. A Hindi or Punjabi dynamic request must fail explicitly rather than falling back to English.

## Required proof

The implementation must verify:

- one discoverable `PNL-001` package with `en/hi/pa` canonical support;
- all 186 QLs in all three languages;
- exact CP counts `36 / 34 / 24 / 26 / 29 / 37` per language;
- native script in Hindi and Punjabi stems and explanations;
- zero unresolved prose placeholders;
- four unique options and one exact keyed answer per package;
- complete coverage of every textual option/answer source value by the localization map;
- deterministic QL selection in all languages;
- mixed six-CP batches in all canonical languages;
- explicit rejection of Hindi/Punjabi dynamic-candidate requests;
- unchanged Question Bank, test and publication safety flags.

## Non-goals

This phase does not:

- change any solver or QL ownership;
- create new QLs;
- alter difficulty or representation;
- approve dynamic candidates;
- write to the Question Bank;
- make PNL test-eligible;
- enable public routing.
