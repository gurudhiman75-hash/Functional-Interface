# CLS-001 — Classification / Odd One Out

Status: `CP001_TO_CP007_MULTILINGUAL_REVIEW_FROZEN__CP008_ZERO_QL_CLOSED`

## Product identity

- Reasoning family: `SYMBOLIC_SEQUENCE`
- Product code: `REAS-CLS`
- Chapter ID: `CLS-001`
- Student title: Classification / Odd One Out
- Target examinations: SSC, Banking and Punjab state examinations
- Primary locales: English (`en-IN`), Hindi (`hi-IN`) and Punjabi (`pa-IN`)
- Question Studio: disabled pending separate review-only integration checkpoint
- Question Bank: disabled
- Test eligibility: disabled
- Mock-test eligibility: disabled
- Student delivery: disabled
- Public publication: disabled

## Governing rule

Classification asks the learner to identify the item, pair, tuple, cluster or complete option-group that differs from—or uniquely belongs to—the intended class, property or relation.

Every admitted question must define a bounded rule universe, construct a valid state, prove one unique answer, reject competing-answer ambiguity and be independently re-solved. Four and five answer options are presentation/difficulty properties rather than separate QLs.

## Permanent inventory

| QL | Checkpoint | Student task | Current locale authority |
|---|---|---|---|
| `CLS-QL-001` | `CLS-CP-001` | Find the semantic outlier among four or five items | Multilingual review-frozen |
| `CLS-QL-002` | `CLS-CP-001` | Select another member of the shared semantic class | Multilingual review-frozen |
| `CLS-QL-003` | `CLS-CP-001` | Select the only internally coherent semantic word-group | Multilingual review-frozen |
| `CLS-QL-004` | `CLS-CP-002` | Find the word-pair whose internal semantic relationship differs | Multilingual review-frozen |
| `CLS-QL-005` | `CLS-CP-003` | Find the word whose visible spelling or structural property differs | Multilingual review-frozen |
| `CLS-QL-006` | `CLS-CP-003` | Resolve controlled jumbles, then find the semantic outlier | Multilingual review-frozen |
| `CLS-QL-007` | `CLS-CP-004` | Find the number whose conventional arithmetic or digit property differs | Multilingual review-frozen |
| `CLS-QL-008` | `CLS-CP-005` | Find the number tuple whose internal rule differs | Multilingual review-frozen |
| `CLS-QL-009` | `CLS-CP-005` | Select the number tuple following the same rule as a reference tuple | Multilingual review-frozen |
| `CLS-QL-010` | `CLS-CP-006` | Find the single letter whose bounded alphabet property differs | Multilingual review-frozen |
| `CLS-QL-011` | `CLS-CP-006` | Find the complete ordered letter-pair whose internal alphabet relation differs | Multilingual review-frozen |
| `CLS-QL-012` | `CLS-CP-007` | Find the complete three-, four- or five-letter cluster whose internal alphabet structure differs | Multilingual review-frozen |
| `CLS-QL-013` | `CLS-CP-007` | Find the complete letter-cluster pair whose position-wise transformation differs | Multilingual review-frozen |

`CLS-CP-008` allocated zero new QLs. No `CLS-QL-014` identity is reserved.

## Checkpoint status

| Checkpoint | Working scope | Current status |
|---|---|---|
| `CLS-CP-001` | Semantic word/entity classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-002` | Semantic pair/relationship classification | `FROZEN_MULTILINGUAL_RUNTIME_PROOF` |
| `CLS-CP-003` | Lexical, spelling and word-structure classification | `MULTILINGUAL_REVIEW_FROZEN` |
| `CLS-CP-004` | Number-property classification | `MULTILINGUAL_REVIEW_FROZEN` |
| `CLS-CP-005` | Number-pair, triple and set classification | `MULTILINGUAL_LEARNER_REVIEW_FROZEN` |
| `CLS-CP-006` | Alphabet, letter-pair and letter-class classification | `MULTILINGUAL_LEARNER_REVIEW_FROZEN` |
| `CLS-CP-007` | Letter-cluster and complete cluster-pair classification | `MULTILINGUAL_REVIEW_FROZEN` |
| `CLS-CP-008` | Mixed-token and bounded-synthesis ownership audit | `CLOSED_ZERO_NEW_QL` |

The distinction between `FROZEN_MULTILINGUAL_RUNTIME_PROOF` and `MULTILINGUAL_REVIEW_FROZEN` is intentional. It records the historical implementation path, not a learner-content gap. All 13 permanent QLs now have approved English plus Hindi/Punjabi learner review authority.

## Final content authority

### CP001–CP002

These checkpoints retain their original frozen multilingual runtime proofs. Their English/Hindi/Punjabi states and learner surfaces remain the canonical authority.

### CP003

- QLs: `CLS-QL-005`, `CLS-QL-006`
- English remains the sole structural/canonical state authority.
- Hindi/Punjabi V5 preserves QL, prototype, options, answer/index, ambiguity proof and difficulty while removing forced Shortcut/Trap learner boilerplate.
- Review authority: `CLS-CP-003-MULTILINGUAL-REVIEW-FREEZE.md`.

### CP004

- QL: `CLS-QL-007`
- 22 admitted number-property rules.
- English remains the mathematical-state authority.
- Hindi/Punjabi review surface preserves all canonical state while using beginner-first native explanations and consistent terminology.
- Review authority: `CLS-CP-004-MULTILINGUAL-REVIEW-FREEZE.md`.

### CP005

- QLs: `CLS-QL-008`, `CLS-QL-009`
- 35-rule competing universe across pair/triple/four-number tuple forms.
- The approved learner projection removes internal QA notation, option-by-option diagnostic clutter, Shortcut/Trap sections and status badges while preserving the frozen tuple/question state.
- Review authority: `CLS-CP-005-LEARNER-REVIEW-V2-FREEZE.md`.

### CP006

- QLs: `CLS-QL-010`, `CLS-QL-011`
- Single-letter and ordered letter-pair classification remain separate answer contracts.
- The approved learner projection keeps compact explanations and consistent Punjabi parity terminology (`ਜਿਸਤ` / `ਟਾਂਕ`) while preserving the frozen state.
- Review authority: `CLS-CP-006-LEARNER-REVIEW-V2-FREEZE.md`.

### CP007

- QLs: `CLS-QL-012`, `CLS-QL-013`
- `CLS-QL-012` covers 13 complete-cluster structural families.
- `CLS-QL-013` covers complete cluster-pair transformation classification.
- Native learner explanations are compact: common rule → one confirming example → outlier evidence → conclusion; full per-option evidence remains internal QA data.
- Review authority: `CLS-CP-007-FINAL-MULTILINGUAL-REVIEW-FREEZE.md`.

### CP008

- Candidate families audited: 11.
- New permanent QLs: 0.
- New runtime generators: 0.
- Mixed-token families that actually belong to Figure Classification, Coding-Decoding, Mathematical Operations, Series or Matrix remain outside CLS-001.

## Strict ownership boundary

CLS-001 owns questions whose final learner action is classification by a visible/inferable common property or by an option-local relation.

It excludes:

- source-to-target rule transfer — Analogy;
- next/missing/wrong term in ordered progression — Series;
- direct alphabet operations — Alphabet Test;
- hidden encoding/decoding — Coding-Decoding;
- operator replacement/equation evaluation — Mathematical Operations;
- row-column synthesis — Matrix;
- dictionary ordering — Word and Dictionary Order;
- visual letter-number/symbol layouts — Figure Classification;
- source-thin free-form mixed-token synthesis;
- unstable general-knowledge grouping without a governed dataset;
- open-ended generation;
- states with multiple defensible grouping rules producing different answers.

## Learner-facing explanation standard

Across the current approved multilingual surfaces:

- explanations must be simple and beginner-readable;
- internal QA notation stays out of the learner surface;
- routine option-by-option analysis is not shown unless it is genuinely needed to explain the reasoning;
- forced Shortcut / Trap boilerplate is not part of the learner explanation contract;
- evidence used to prove uniqueness remains available internally even when the learner explanation is compact;
- English instructional leakage into Hindi/Punjabi surfaces is rejected by localization gates.

## Authority documents

Chapter-level:

- `CLS-001-END-TO-END-DESIGN.md`
- `CLS-001-SOURCE-AND-OWNERSHIP-AUDIT.md`
- `CLS-001-ENGLISH-EDITORIAL-APPROVAL.md`

Checkpoint authority:

- `CLS-CP-001/CLS-CP-001-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-002/CLS-CP-002-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-003/CLS-CP-003-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-003/CLS-CP-003-MULTILINGUAL-REVIEW-FREEZE.md`
- `CLS-CP-004/CLS-CP-004-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-004/CLS-CP-004-MULTILINGUAL-REVIEW-FREEZE.md`
- `CLS-CP-005/CLS-CP-005-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-005/CLS-CP-005-LEARNER-REVIEW-V2-FREEZE.md`
- `CLS-CP-006/CLS-CP-006-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-006/CLS-CP-006-LEARNER-REVIEW-V2-FREEZE.md`
- `CLS-CP-007/CLS-CP-007-FINAL-ENGLISH-FREEZE.md`
- `CLS-CP-007/CLS-CP-007-FINAL-MULTILINGUAL-REVIEW-FREEZE.md`
- `CLS-CP-008/CLS-CP-008-SOURCE-AND-OWNERSHIP-AUDIT.md`
- `CLS-CP-008/CLS-CP-008-FINAL-CLOSURE.md`

## Lifecycle boundary

Content/readiness status and product-delivery status are intentionally separate.

Current chapter content state:

```text
Permanent QLs:                    13
English learner authority:        approved/frozen
Hindi learner authority:          approved/review-frozen
Punjabi learner authority:        approved/review-frozen
CP008 new QLs:                     0
Chapter ownership:                closed
```

Product delivery remains closed:

```text
Question Studio discoverability:  disabled
Question Bank writes:             disabled
Internal test eligibility:        disabled
Mock-test eligibility:            disabled
Student delivery:                 disabled
Public publication:               disabled
Automatic promotion:              disabled
```

The next allowed chapter step is a separate **Question Studio review-only integration**. It must not open Question Bank, mock/test, student-delivery or public-publication gates without a later explicit authorization.
