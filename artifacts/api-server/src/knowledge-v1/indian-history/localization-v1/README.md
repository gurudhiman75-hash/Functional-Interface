# History Multilingual V1

Lifecycle: **REVIEW_ONLY**

Semantic authority: `HIS-001-ENGLISH-FREEZE-V1` on `New-main`.

Implemented scope:
- `HIS-CP-001` Prehistory & Harappan Civilization
- 54 questions per locale
- 162 English/Hindi/Punjabi learner surfaces

Hindi and Punjabi are human-written learner-facing overlays. They may change wording only; they must preserve frozen English CP, QL, difficulty, source provenance, option order, correct-index and answer semantics.

Quality gates:
- exact English no-drift
- 54/54 overlay completeness per native locale
- four unique options per question
- sourceFactIds and sourceIds parity
- correct-index parity
- Devanagari required for Hindi
- Gurmukhi required for Punjabi
- unauthorized Latin-script leakage blocked in native learner text
- minimum two-sentence native explanations
- reviewOnly=true and runtimeRegistered=false preserved

Review export:
- `dist/history-review/HIS-MULTILINGUAL-V1/HIS-MULTILINGUAL-V1-CP001-REVIEW.md`

This checkpoint does not enable Question Studio runtime registration, Question Bank persistence, test/mock eligibility, publication, or automatic learner release.
