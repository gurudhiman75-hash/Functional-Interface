# PNL-001 Editorial V2 Status

Status: MULTILINGUAL REVIEW CANDIDATE

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

## Editorial V2 model

The content model supports:

- contextual paragraph blocks;
- real tables with runtime row binding;
- multi-paragraph caselets with runtime paragraph binding;
- statement sets;
- two-statement data sufficiency;
- display and inline LaTeX equations;
- friendly structured explanations;
- explicit difficulty rationale;
- localized Hindi and Punjabi renderer headings.

Each friendly explanation contains:

1. a natural opening;
2. a short key idea;
3. ordered reasoning steps;
4. a clear conclusion;
5. a learner-facing common mistake;
6. an optional quick check where useful.

Localized student-facing headings include:

- Hindi: `मुख्य विचार`, `चरण`, `निष्कर्ष`, `सामान्य गलती से बचें`, `त्वरित जाँच`;
- Punjabi: `ਮੁੱਖ ਵਿਚਾਰ`, `ਪੜਾਅ`, `ਨਤੀਜਾ`, `ਆਮ ਗਲਤੀ ਤੋਂ ਬਚੋ`, `ਤੁਰੰਤ ਜਾਂਚ`.

## English approval

The user reviewed and approved both English comparison workbooks.

CP-001 through CP-003 results:

- QL count: 94
- distinct context families: 94
- generic article/dealer/trader openings: 2
- Hard questions before migration: 42
- Hard questions after migration: 19
- difficulty recalibrations: 23
- old average explanation length in the rendered review set: 15.3 words
- new average explanation length: 115.6 words
- committed JSON parity with normalized generator output: passed

CP-004 through CP-006 results:

- QL count: 92
- distinct context families: 92
- generic article/dealer/trader openings: 10
- Hard questions before migration: 59
- Hard questions after migration: 45
- difficulty recalibrations: 15
- old average explanation length: 20.4 words
- new average explanation length: 102.7 words

English status: APPROVED.

## Hindi and Punjabi implementation

Hindi and Punjabi were authored from native-language question libraries and native teaching profiles while using the approved English Editorial V2 structure, mathematics, equations and difficulty tags as the semantic contract.

The multilingual migration provides:

- native commercial contexts rather than literal sentence-by-sentence translation;
- real structured representation parity with English;
- exact registry placeholder equality;
- localized explanation headings;
- localized prose inside LaTeX text labels without changing runtime variable names;
- friendly solve-family explanations for fundamental relations, reverse price, base conversion, successive changes, promotions, inventory, dishonest trade, effective cost, break-even, recovery and data reasoning;
- QL-sensitive contextual teaching notes;
- explicit corrections for legacy native stems that implied but did not visibly expose required variables.

Multilingual audit results:

- Hindi entries: 186
- Punjabi entries: 186
- total multilingual entries: 372
- unique language-context keys: 372
- distinct Hindi concept paragraphs: 183
- distinct Punjabi concept paragraphs: 183
- fallback prompts: 0
- required-placeholder gaps: 0
- structured-representation parity gaps: 0
- English renderer-heading leakage: 0
- English text-label leakage inside LaTeX: 0
- raw calculation glyphs in student render: 0
- committed generator-to-source parity: passed for all 12 Hindi/Punjabi libraries

Hindi status: EDITORIAL_REVIEW_CANDIDATE.

Punjabi status: EDITORIAL_REVIEW_CANDIDATE.

## Validation gates

The focused `Validate PNL Editorial V2` workflow validates all 558 entries and includes:

- English CP-001 through CP-003 audit and renderer proof;
- English CP-004 through CP-006 audit and renderer proof;
- multilingual 372-entry audit;
- localized Hindi/Punjabi renderer proof;
- multilingual source export;
- exact committed-source parity for all six Hindi and all six Punjabi libraries.

The original CP-006 runtime proof and structural audit continue to pass unchanged.

## Rendering policy

- Ordinary prose retains readable forms such as `₹10,000`, `20%` and native-language unit labels.
- Equations and final mathematical results use LaTeX blocks.
- Legacy raw calculation glyphs are normalized before student display.
- Representation labels must correspond to real structured blocks.
- Runtime variable names remain language-neutral and must never be translated.

## Merge rule

PR #173 must remain draft until:

1. the Hindi/Punjabi comparison workbook is reviewed;
2. requested native-language wording or pedagogy corrections are applied;
3. the Hindi and Punjabi Editorial V2 layers are explicitly approved;
4. the final chapter-wide freeze-readiness audit passes.

The PR must not be merged merely because automated checks pass.
