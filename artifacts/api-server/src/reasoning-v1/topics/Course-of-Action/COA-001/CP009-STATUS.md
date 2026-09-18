# COA-001 / COA-CP-009 — Status

Status: **LANGUAGE CALIBRATION APPROVED / FROZEN**

## Purpose

CP009 starts Hindi/Punjabi localization only after the English COA taxonomy became final-frozen.

This checkpoint deliberately uses a calibration gate before mass rollout. It does **not** yet claim that all English authorities have been localized.

## Calibration scope

Ten semantic authorities are localized into both Hindi and Punjabi:

- QL001 direct remedy — `COA-SC-001`
- QL002 prevention — `COA-SC-005`
- QL003 verification before irreversible action — `COA-SC-007`
- QL004 administrative response — `COA-SC-011`
- QL005 constraint-aware action — `COA-SC-013`
- QL006 proportionality — `COA-SC-017`
- QL008 ordered response — `COA-SC-022`
- QL009 integrated reasoning — `COA-SC-023`
- CP008 five-code exclusive Either profile — `COA-EITHER-002`
- CP008 three-action combination profile — `COA-3A-003`

Total localized calibration surfaces: **20** (10 Hindi + 10 Punjabi).

## Localization policy

- English semantic authority remains immutable.
- Scenario ID, QL, difficulty, domain, action identity/order, answer class/mask and correct option index must remain identical.
- Hindi and Punjabi use short, natural exam-prep language rather than literal English syntax.
- Core English instructional leakage is blocked.
- Cross-script leakage between Devanagari and Gurmukhi is blocked.
- Familiar technical loanwords may be transliterated into native script where a forced formal translation would make the question harder.
- Explanations remain simple and directly state why each course is or is not suitable.

## Why calibration comes before full rollout

The current English authority contains more than one hundred reviewed semantic states plus the CP008 profile authorities. A poor terminology choice repeated across that whole corpus would be expensive to undo and would reduce learner clarity.

The product owner approved this calibration on **2026-09-18**. The approved terminology and sentence-style rules are now the mandatory baseline for the full Hindi/Punjabi rollout.

## Files

- `cp009-localization-calibration.ts`
- `cp009-localization-generator.ts`
- `cp009-localization-proof.test.ts`
- `COA-CP-009-LOCALIZATION-REVIEW.md`
- dedicated CP009 CI gate

## Lifecycle

- CP001–CP008 English: **APPROVED / FROZEN**
- English taxonomy: **FINAL-FROZEN**
- CP009 localization calibration: **APPROVED / FROZEN**
- full Hindi/Punjabi authority rollout: **AUTHORIZED AS NEXT IMPLEMENTATION STEP / NOT YET COMPLETE**
- Question Studio: **CLOSED**
- Question Bank writes: **CLOSED**
- test/mock eligibility: **CLOSED**
- public/student delivery: **CLOSED**

Human language approval is recorded for the calibration pack only. Full-corpus localization must still pass exhaustive semantic-parity, script/leakage and editorial checks before downstream integration.
