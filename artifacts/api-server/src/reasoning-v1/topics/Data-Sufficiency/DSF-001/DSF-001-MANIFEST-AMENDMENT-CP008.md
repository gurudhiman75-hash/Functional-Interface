# DSF-001 Manifest Amendment — CP-008 Hindi/Punjabi Localization Review

## Checkpoint

- Checkpoint: `DSF-CP-008`
- Authority: `DSF_CP008_HI_PA_LOCALIZATION_REVIEW_CANDIDATE_V1`
- Status: `EXECUTABLE_REVIEW_REQUIRED`
- Permanent QL: `DSF-QL-001`
- Next available QL: `DSF-QL-002`

## Source authorities preserved

CP-008 is a localization overlay on the already frozen production scope. It does not reopen or rewrite:

- CP-001 canonical sufficiency semantics
- CP-002 approved English editorial surface
- CP-003 Banking/SSC answer-profile semantic order
- CP-004 Question Bank acceptance authority
- CP-005 scored-test release authority
- CP-006 mock-test release authority
- CP-007 English production-readiness freeze

## Localized languages

- Hindi: `hi` / `hi-IN`
- Punjabi: `pa` / `pa-IN`

English (`en` / `en-IN`) remains the only production-approved language at this checkpoint.

## Localization contract

The localizer changes learner-facing text only:

- stem
- question prompt
- Statement I / Statement II learner wording
- semantic answer-option text
- question-specific explanation text

The following must remain byte/semantic equivalent to the canonical English source projection:

- `DSF-QL-001`
- source generation identity
- source/profile ancestry
- answer profile ID
- represented/omitted semantic classes
- option semantic order
- canonical sufficiency class
- correct option index
- difficulty
- domain and solve mode

Any learner sentence or statement shape not explicitly recognized by the CP-008 translator is a generation error. English fallback inside localized learner text is not permitted. Pure mathematical notation (for example `A:B = 2:3`, `P = 20%`, or an algebraic equation) is language-neutral and may remain unchanged, but statement prose is explicitly checked for untranslated English leakage.

## Review lifecycle

Hindi/Punjabi localized items are executable review candidates only:

- Question Studio discoverable: yes
- review-run persistence: yes
- human language review required: yes
- Question Bank writable: **no**
- test eligible: **no**
- mock-test eligible: **no**
- publicly publishable: **no**
- automatic student publication: **no**

English retains the CP-007 frozen production lifecycle unchanged.

## Human review packs

The CP-008 workflow builds two representations of the same 62-question review corpus:

1. Machine-oriented localization review pack (`HTML` + `JSON`).
2. Paired human-review pack (`HTML` + `JSON`) showing the exact canonical English profile question beside its Hindi/Punjabi localization.

The corpus contains:

- 31 Hindi
- 31 Punjabi
- every one of the 8 solve modes in each language
- every approved answer profile in each language
- every semantic class representable by each profile
- SSC four-option profiles continue to reject `EACH_STATEMENT_ALONE`; no remapping is allowed

For every paired item, the gate asserts equality of source identity, canonical sufficiency class, option semantic order, and correct option index before writing the review artifact.

Human approval of this corpus is required before a later checkpoint may unlock localized Question Bank/test/mock/publication lifecycle flags.

## Deferred scope

Still outside CP-008:

- Punjab-specific Data Sufficiency answer-profile contract
- three-statement Data Sufficiency
- deferred reasoning complete-world adapters
- automatic generated-question publication

No new permanent QL is allocated by CP-008.
