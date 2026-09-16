# CLS-CP-004 Multilingual Review Freeze

Status: `MULTILINGUAL_REVIEW_FROZEN`

Date: 2026-09-15

Scope: `CLS-QL-007` — number-property classification / odd-one-out.

## Frozen review authority

- canonical mathematical state remains `cls-cp004-english-runtime-v2`;
- Hindi/Punjabi review surface is `cls-cp004-multilingual-review-v3` with the final native-language cleanup applied on PR #1735;
- exact reviewed PR head before this freeze record: `d5dd35c41eb690abdd36cfcc8ff6d07580dc4a46`;
- exact-head workflow: `Validate CLS-001 CP-004 Number-Property Discovery`, run `34919216432`;
- final localization artifact: `cls-001-cp004-hi-pa-localisation-review`, artifact id `10377492233`;
- artifact digest: `sha256:0149056a1619bda96668da5bea43a6265f402eec0dc01a5353080a72ff9c9f46`.

## Executable proof

The frozen review surface passed:

- the existing English CP004 regression;
- 2,000 canonical seeds × 2 native locales = 4,000 Hindi/Punjabi parity questions;
- all 22 admitted number-property rules;
- 4-option and 5-option forms;
- Easy / Medium / Hard generated states;
- deterministic replay;
- preserved QL/prototype/rule/value/numbers/options/answer/index/ambiguity proof/difficulty;
- Hindi/Punjabi script and English-instruction leakage checks;
- native terminology/editorial regression across 2,000 Hindi and 2,000 Punjabi generated states.

The final 88-question review corpus contains two examples per admitted rule in each native locale and was manually checked across all 22 rule families.

## Editorial decisions frozen for review

- Punjabi parity terminology uses `ਜਿਸਤ` / `ਟਾਂਕ`.
- Hindi odd-one-out stems do not use the ambiguous instruction `विषम संख्या चुनिए`; they use `अलग संख्या` wording.
- learner explanations use the short progression: common property → why the outlier differs → answer.
- forced shortcut/trap boilerplate is absent from the native learner explanation surface.
- duplicate native grammar such as `में अंकों में` / `ਵਿੱਚ ਅੰਕਾਂ ਵਿੱਚ` is rejected.
- repeated causal wording in one explanation sentence is rejected.

## Lifecycle lock

This is a **review freeze only**. It does not authorize:

- Question Studio discoverability;
- Question Bank writes;
- internal or public test eligibility;
- mock-test eligibility;
- student delivery;
- public publication;
- any new QL allocation.

Those downstream gates remain closed until separately and explicitly authorized.
