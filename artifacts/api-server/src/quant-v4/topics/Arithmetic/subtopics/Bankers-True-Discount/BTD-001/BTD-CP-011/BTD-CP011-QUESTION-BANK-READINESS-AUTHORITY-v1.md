# BTD-001 CP011 — Question Bank Admission Readiness Authority v1

Status: **READY FOR EXPLICIT QUESTION BANK ADMISSION APPROVAL — NO WRITE PATH ENABLED**

## Purpose

CP011 validates the technical contract for eventually admitting reviewed BTD-001 Question Studio items into a Question Bank. It does not write, admit, publish, or make any BTD item test-eligible.

Upstream authority: CP010 multilingual Question Studio exact head `9a3b3f3d6487180d9f4e5351095f0bef4c8bf655`.

## Candidate contract

Each readiness candidate is derived only from the frozen CP010 Studio package and contains:

- permanent QL / CP identity
- language and locale
- difficulty
- frozen stem and options
- correct option ownership
- learner explanation
- semantic signature and answer semantic
- frozen content fingerprint
- frozen chapter fingerprint
- freeze version
- deterministic `admissionKey`
- deterministic admission-payload fingerprint
- required manual Studio review status: `approved`

The admission key is derived from package + QL + language + frozen content fingerprint. Repeated generation of identical frozen content therefore resolves to the same bank identity rather than creating duplicate bank records.

## Initial certification

Head: `fa7e0ac7b7b0be31325f91765bddb192be513759`

Workflow run `33295640196`, job `99214703289`: **SUCCESS**

The workflow first re-proved the complete CP010 multilingual Studio audit, then certified CP011 over 6,000 candidates (`20 QLs × 3 languages × 100 seeds`).

CP011 metrics:
- candidates validated: 6,000
- Studio-to-bank parity checks: 96,000
- deterministic replay checks: 6,000
- identity checks: 30,000
- schema checks: 72,000
- manual-review gate checks: 18,000
- lifecycle-lock checks: 66,000
- deep-freeze checks: 36,000
- native JSON checks: 12,000
- unique admission keys: 5,914
- safe dedup collisions: 86
- minimum unique admission identities in any QL × language 100-seed scope: 94
- unsafe dedup collisions: 0
- no CP011 executable import in routes/shared Studio engines: PASS
- API build: PASS
- exact-head assertion: PASS

The 86 duplicate identities are expected finite-pool repeats: every repeated admission key was proven to map to the exact same QL, language, frozen content fingerprint and admission-payload fingerprint.

Artifact: `9727329381`
Digest: `sha256:573195b5cfcfeecd34b21209a38395a4e8d39fb34df136a7e9276a7501356197`

## Lifecycle boundary

CP011 remains non-executable with respect to Question Bank writes:

- `questionBankAdmissionApproved = false`
- `requiresManualStudioReview = true`
- required Studio item status = `approved`
- `questionBankWritable = false`
- `questionBankWriteRouteEnabled = false`
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`
- `contentMutationAuthorized = false`

A later admission checkpoint requires explicit operator approval and must preserve this candidate identity/content contract. Admission to Question Bank must remain separate from test/mock/public eligibility.

A final exact-head rerun after this authority record is required before CP011 is closure-ready.
