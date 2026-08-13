# NUM-CP-001 Hindi/Punjabi Multilingual Freeze

## Scope

- Checkpoint: `NUM-CP-001` — Number Sets, Order, Parity and Integer Structure
- Permanent QLs: `NUM-QL-124..NUM-QL-144`
- Permanent authority count: 21
- Frozen solve modes: 21
- Represented runtime prototypes: 26
- Canonical mathematical runtime: English (`en-IN`)
- Frozen translated learner locales: Hindi (`hi-IN`) and Punjabi (`pa-IN`)
- Next permanent Number System QL remains `NUM-QL-145`

## Localisation architecture

The English permanent runtime remains the sole mathematical authority. Hindi and Punjabi learner surfaces are deterministic adapters rebuilt from the frozen runtime prototype and hidden mathematical state. Localisation does not change permanent QL identity, solve mode, proposal, seed, source seed, runtime prototype, authority ancestry, hidden state, mathematical fingerprint, option order, correct index, misconception mapping, verifier truth or delivery lifecycle.

## Executable pre-promotion evidence

Dedicated workflow: `Validate NUM-CP-001 Hindi Punjabi localization`

- Run: `31688594933`
- Source head: `b13f65f89f0d064b334aca2daa2ee1b69c19143a`
- Result: PASS
- Artifact ID: `9176445487`
- Artifact SHA-256: `eec24b5d9a20e135fddcbf78cd79c62c508f183ebe9af89b47b9989751524e1e`

### Canonical English regression

- 21 permanent QLs
- 26 represented prototypes
- 2,520 runtime questions
- 2,520 deterministic replay checks
- 2,520 independent verifier checks
- 2,520 four-option checks
- 0 Question Studio exposure
- 0 Question Bank writes
- 0 test eligibility
- 0 public publication

### Hindi/Punjabi mathematical parity

- 2 translated locales
- 21 permanent QLs per locale
- 26 represented runtime prototypes per locale
- 120 seeds per QL per locale
- 5,040 localised questions
- 5,040 deterministic replays
- 5,040 mathematical parity checks
- all four answer positions reachable per QL
- state-derived difficulty variation retained
- 0 Question Studio exposure
- 0 Question Bank writes
- 0 test eligibility
- 0 public publication

### Hindi/Punjabi editorial audit

- 36 seeds per QL per locale
- 1,512 audited localised questions
- exact Hindi stems: 384
- exact Punjabi stems: 384
- exact Hindi explanations: 456
- exact Punjabi explanations: 456
- Hindi answer-position counts: 192 / 192 / 186 / 186
- Punjabi answer-position counts: 192 / 192 / 186 / 186
- maximum stem length: 238 characters / 48 words
- maximum explanation JSON length: 647 characters
- 0 cross-QL stem collisions
- 0 conflicting repeated learner surfaces
- 0 option violations
- 0 verifier violations
- 0 lifecycle violations
- 0 English prose leaks
- 0 internal-ID leaks
- 0 invalid values

### Bilingual review export

- 4 questions per QL per locale
- 168 total review questions
- 21 permanent QLs
- 26 represented runtime prototypes

## Frozen lifecycle after promotion

- maturity: `MULTILINGUAL_IMPLEMENTATION_FROZEN`
- allocation status: `PRODUCT_OWNER_APPROVED_INACTIVE_MULTILINGUAL_IMPLEMENTATION`
- permanent identity frozen: true
- solve mode frozen: true
- English implementation frozen: true
- active: false
- Question Studio discoverable: false
- Question Bank writable: false
- test eligible: false
- publicly publishable: false
- Question Bank status: `NOT_STORED`
- test eligibility status: `INELIGIBLE`

The promotion is metadata/lifecycle-only. It does not authorize Question Studio review routing, Question Bank persistence, scored/mock-test use, or public publication. A separate guarded delivery gate is required for any such exposure.
