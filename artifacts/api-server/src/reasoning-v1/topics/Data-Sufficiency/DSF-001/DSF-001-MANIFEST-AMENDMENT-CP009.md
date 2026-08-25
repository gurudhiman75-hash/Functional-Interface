# DSF-001 Manifest Amendment — CP-009 Hindi/Punjabi Localization Approval + Release

## Checkpoint

- Checkpoint: `DSF-CP-009`
- Authority: `DSF_CP009_HI_PA_LOCALIZATION_APPROVAL_RELEASE_V1`
- Approval status: `PRODUCT_OWNER_APPROVED`
- Release status: `LOCALIZED_PRODUCTION_RELEASED`
- Approval date: `2026-08-24`
- Approved review pack: `DSF-CP008-HI-PA-REVIEW-62-2026-08-23`
- Review pack size: 62 questions = 31 Hindi + 31 Punjabi
- Permanent QL: `DSF-QL-001`
- Next available QL: `DSF-QL-002`

## Product-owner decision

The CP-008 Hindi/Punjabi paired human-review pack is approved. CP-009 removes the CP-008 language-review blocker for `hi-IN` and `pa-IN` without reopening the frozen Data Sufficiency semantic engine or rewriting any exam answer-profile order.

## Production languages

- English: `en` / `en-IN`
- Hindi: `hi` / `hi-IN`
- Punjabi: `pa` / `pa-IN`

All three languages now use the same controlled downstream production lifecycle.

## Preserved authorities

CP-009 does not rewrite:

- CP-001 canonical sufficiency semantics
- CP-002 Question Studio integration
- CP-002 approved English editorial surface
- CP-003 Banking/SSC answer-profile contracts
- CP-004 Question Bank acceptance
- CP-005 scored-test release
- CP-006 mock-test release
- CP-007 English production-readiness freeze
- CP-008 executable Hindi/Punjabi semantic-parity/localization authority

The CP-008 review artifacts and review-only payload semantics remain historical and immutable. CP-009 is a later release overlay.

## Released localized lifecycle

For newly generated Hindi/Punjabi CP-009 items:

- Question Studio discoverable: yes
- review-run persistence: yes
- human language review blocker: cleared
- manual generation approval required: yes
- Question Bank status: `READY_FOR_STORAGE`
- Question Bank writable after manual approval: yes
- Question Bank acceptance mode: `FULL_RELEASE`
- explicit Question Bank publication required: yes
- scored-test eligible after canonical publication/validation: yes
- mock-test eligible after canonical test/test-series QA release: yes
- publicly publishable through canonical manual lifecycle: yes
- automatic student publication: **no**

No DSF-specific Question Bank, publish, test, mock, or student endpoint is added.

## Semantic invariants

Localization approval cannot change:

- `DSF-QL-001`
- source question identity
- source generation identity
- source/profile ancestry
- canonical sufficiency class
- correct option index
- option semantic order
- represented/omitted profile classes
- domain
- solve mode
- difficulty

SSC four-option profiles continue to reject `EACH_STATEMENT_ALONE`; no remapping is permitted.

## Historical payload boundary

Existing CP-008 localized review payloads remain:

- review-only
- Question Bank locked
- test/mock/publication locked

They are not retroactively upgraded. New generation after CP-009 uses the approved localized release overlay.

## Still deferred

- Punjab-specific Data Sufficiency answer-profile contract
- three-statement Data Sufficiency
- deferred reasoning complete-world adapters
- automatic generated-question/student publication

No new permanent QL is allocated by CP-009.
