# PNL-001 Editorial V2 Status

Status: CONCISE STEM REVIEW CANDIDATE

Branch: `feat/pnl-001-editorial-structured-review`

Draft pull request: #173

## Scope

Editorial V2 covers all 186 Profit & Loss QLs in English, Hindi and Punjabi while preserving the validated mathematical solvers, answer semantics, independent verifiers and runtime proofs.

Packages covered:

- CP-001: 36 entries per language, `PNL-QL-001` through `PNL-QL-036`
- CP-002: 34 entries per language, `PNL-QL-037` through `PNL-QL-070`
- CP-003: 24 entries per language, `PNL-QL-071` through `PNL-QL-094`
- CP-004: 26 entries per language, `PNL-QL-095` through `PNL-QL-120`
- CP-005: 29 entries per language, `PNL-QL-121` through `PNL-QL-149`
- CP-006: 37 entries per language, `PNL-QL-150` through `PNL-QL-186`

Total Editorial V2 entries:

- English: 186
- Hindi: 186
- Punjabi: 186
- Chapter total: 558

## Binding stem policy

Routine questions must look like competitive-exam questions rather than generated teaching prompts.

1. A direct question begins immediately with the person, item, price, quantity, rate or transaction facts.
2. Routine stems must not begin with phrases such as “consider this situation”, “the records show”, “use the following information” or their Hindi/Punjabi equivalents.
3. A short introduction is permitted only when it is necessary to read a genuine table, caselet, statement set, ledger, algebraic model or data-sufficiency item.
4. Context must support the mathematical relation; it must not act as decorative storytelling.
5. English, Hindi and Punjabi follow the same concision rule.

The source generators apply this policy, so removed openings cannot reappear during regeneration.

## Concise stem correction

The user reopened the complete stem layer after finding unnecessary contextual introductions in English, Hindi and Punjabi.

The correction removed synthetic introductions from direct questions while preserving:

- all registered runtime variables;
- question meaning and answer semantics;
- difficulty tags;
- real table, caselet, statement, equation and data-sufficiency blocks;
- approved explanations and misconception guidance;
- validated mathematical runtimes.

Examples:

- Before: `During this kitchen-appliance resale decision, the following information is available. The appliance retailer purchased ...`
- After: `The appliance retailer purchased ...`

- Before: `उपभोक्ता वस्तु बिक्री के एक वास्तविक व्यावसायिक रिकॉर्ड पर विचार कीजिए। एक विक्रेता ने ...`
- After: `एक विक्रेता ने ...`

- Before: `ਖਪਤਕਾਰ ਵਸਤੂ ਵਿਕਰੀ ਦੇ ਇੱਕ ਅਸਲ ਵਪਾਰਕ ਰਿਕਾਰਡ ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ। ਇੱਕ ਵਿਕਰੇਤਾ ਨੇ ...`
- After: `ਇੱਕ ਵਿਕਰੇਤਾ ਨੇ ...`

A genuine offer-table introduction remains because it helps the student interpret the structured data.

## Explanation status

The friendly explanation layer remains unchanged and retains:

1. a natural opening;
2. a short key idea;
3. ordered reasoning steps;
4. a clear conclusion;
5. a learner-facing common mistake;
6. an optional quick check where useful.

Localized student-facing headings include:

- Hindi: `मुख्य विचार`, `चरण`, `निष्कर्ष`, `सामान्य गलती से बचें`, `त्वरित जाँच`;
- Punjabi: `ਮੁੱਖ ਵਿਚਾਰ`, `ਪੜਾਅ`, `ਨਤੀਜਾ`, `ਆਮ ਗਲਤੀ ਤੋਂ ਬਚੋ`, `ਤੁਰੰਤ ਜਾਂਚ`.

## Previous English explanation approval

The user approved the English Editorial V2 explanation and difficulty work before the stem-concision correction.

CP-001 through CP-003:

- QL count: 94
- Hard questions before migration: 42
- Hard questions after migration: 19
- difficulty recalibrations: 23
- old average explanation length: 15.3 words
- new average explanation length: 115.6 words

CP-004 through CP-006:

- QL count: 92
- Hard questions before migration: 59
- Hard questions after migration: 45
- difficulty recalibrations: 15
- old average explanation length: 20.4 words
- new average explanation length: 102.7 words

The English stem layer is reopened only for review of the concise wording.

## Multilingual implementation

Hindi and Punjabi are authored from native-language question libraries and teaching profiles while using the approved English structure, mathematics, equations and difficulty tags as the semantic contract.

The multilingual layer provides:

- native question wording rather than sentence-by-sentence translation;
- real structured representation parity with English;
- exact registry placeholder equality;
- localized explanation headings;
- localized prose inside LaTeX text labels without changing runtime variable names;
- friendly solve-family explanations;
- explicit corrections for legacy native stems that implied but did not visibly expose required variables.

## Validation results

The permanent `Validate PNL Exam Stems` workflow checks all 558 committed entries.

Current concise-stem result:

- total entries: 558
- synthetic opening violations: 0
- empty stem entries: 0
- direct stems begin with commercial facts
- structured introductions are retained only where required by the representation

The focused `Validate PNL Editorial V2` workflow also passes:

- English CP-001 through CP-003 audit and renderer proof;
- English CP-004 through CP-006 audit and renderer proof;
- multilingual 372-entry audit;
- localized Hindi/Punjabi renderer proof;
- exact committed-source parity;
- placeholder and structured-representation parity.

The original CP-006 runtime proof and structural audit continue to pass unchanged.

## Current review state

- Mathematics and answer semantics: VALIDATED
- English explanations: APPROVED
- Difficulty recalibration: APPROVED
- English concise stems: REVIEW_CANDIDATE
- Hindi concise stems and explanations: REVIEW_CANDIDATE
- Punjabi concise stems and explanations: REVIEW_CANDIDATE

Review artifact:

`pnl001_concise_exam_stems_review.xlsx`

## Merge rule

PR #173 must remain draft until:

1. the concise English, Hindi and Punjabi stem workbook is reviewed;
2. requested stem corrections are applied;
3. all three stem layers are explicitly approved;
4. Hindi and Punjabi explanation wording is approved;
5. the final chapter-wide freeze-readiness audit passes.

The PR must not be merged merely because automated checks pass.
