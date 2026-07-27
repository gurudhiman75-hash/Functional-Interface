# PNL-001 Editorial V2 Status

Status: **FREEZE_CANDIDATE**

Branch: `feat/pnl-001-editorial-structured-review`

Pull request: #173

Final freeze report: `PNL-001-FREEZE-READINESS-REPORT.md`

## Scope

Editorial V2 covers all 186 Profit & Loss QLs in English, Hindi and Punjabi while preserving the validated mathematical solvers and answer semantics.

| CP | QL range | QLs per language |
|---|---|---:|
| CP-001 | PNL-QL-001–036 | 36 |
| CP-002 | PNL-QL-037–070 | 34 |
| CP-003 | PNL-QL-071–094 | 24 |
| CP-004 | PNL-QL-095–120 | 26 |
| CP-005 | PNL-QL-121–149 | 29 |
| CP-006 | PNL-QL-150–186 | 37 |
| **Total** | **PNL-QL-001–186** | **186** |

Editorial entry totals:

- English: 186
- Hindi: 186
- Punjabi: 186
- Chapter total: 558

## Binding stem policy

1. Direct questions begin immediately with the person, item, price, quantity, rate or transaction facts.
2. Routine stems must not begin with generated phrases such as “consider this situation”, “the records show” or “use the following information”, including Hindi and Punjabi equivalents.
3. A short introduction is permitted only where needed to read a genuine table, caselet, statement set, algebraic model or data-sufficiency item.
4. Context must support the mathematics rather than add decorative storytelling.
5. English, Hindi and Punjabi follow the same concision standard.

The generators and permanent audit enforce this policy.

## Explanation policy

Every language uses friendly, misconception-aware explanations containing:

1. a natural opening;
2. a short key idea;
3. difficulty-appropriate reasoning steps;
4. a clear conclusion;
5. a learner-facing common mistake;
6. an optional quick check where useful.

Easy questions may use one complete reasoning step when a second step would be artificial padding. Medium and Hard questions require at least two steps.

Localized headings include:

- Hindi: `मुख्य विचार`, `चरण`, `निष्कर्ष`, `सामान्य गलती से बचें`, `त्वरित जाँच`;
- Punjabi: `ਮੁੱਖ ਵਿਚਾਰ`, `ਪੜਾਅ`, `ਨਤੀਜਾ`, `ਆਮ ਗਲਤੀ ਤੋਂ ਬਚੋ`, `ਤੁਰੰਤ ਜਾਂਚ`.

## Final review state

- Mathematics and answer semantics: **VALIDATED**
- Runtime proof coverage: **VALIDATED FOR CP-001 THROUGH CP-006**
- English explanations: **APPROVED**
- Difficulty recalibration: **APPROVED**
- English concise stems: **APPROVED FOR FREEZE**
- Hindi concise stems and explanations: **APPROVED FOR FREEZE**
- Punjabi concise stems and explanations: **APPROVED FOR FREEZE**
- Structured representations: **VALIDATED**
- Source reconciliation: **COMPLETE**

The user's continuation after the concise-stem review is recorded as approval to proceed through the final freeze gate.

## Final audit metrics

- QLs: 186 contiguous IDs
- Registry entries: 186
- Editorial entries: 558
- Structured QLs: 36
- Explanation steps: 1,393
- Exact duplicate structured-stem groups: 0 in each language
- Cross-CP ownership overlaps: 0
- Synthetic opening violations: 0
- Fallback prompts: 0
- Empty stems: 0
- CP proof files executed: 11
- CPs with at least one proof: 6 of 6

CP-001 now has a comprehensive runtime proof covering all 18 unique fundamental solve modes and verifying exact registry-mode coverage.

## Passing focused workflows

- `Validate PNL Freeze Readiness`
- `Validate PNL Editorial V2`
- `Validate PNL Exam Stems`
- `Validate PNL Native Prompts`
- `Validate PNL CP-006`
- `Validate Render production build`

The integrated admin-panel workflow retains an unrelated pre-existing failure outside PNL-001. It is not part of the chapter freeze decision.

## Merge rule

PR #173 may be marked ready for final merge review.

After merge, PNL-001 may reopen only for:

1. a mathematically distinct solve mode;
2. a source-backed exam pattern not represented by the registry;
3. a verified runtime defect;
4. a material language or rendering defect;
5. a platform contract change requiring structured-content migration.

Cosmetic variation, arbitrary count expansion and wording-only duplicates must not reopen the chapter.
