# BTD-001 CP010 — Multilingual Question Studio Authority v1

Status: **QUESTION STUDIO MULTILINGUAL REVIEW-ONLY — CERTIFICATION CANDIDATE**

## Scope

CP010 exposes the already-frozen BTD-001 learner authorities inside Question Studio for admin review generation:

- English from CP005/CP006
- Hindi + Punjabi from CP009
- 20 permanent QLs
- one additive `BTD-001` package
- supported Studio languages: `en`, `hi`, `pa`

No content mutation is authorized. Question Bank, tests, mocks and public delivery remain closed.

## Architecture

`shared-generation-engine-btd.ts` continues to add exactly one `BTD-001` package to the stack-local CP014 aggregate, but now routes BTD requests through CP010.

`admin-question-studio-btd.ts` uses the CP010 request classifier and persists generated packages only into the existing review/unreviewed generation workspace. Its persistence guard still requires:

- `questionStudioDiscoverable = true`
- `questionStudioGenerationEnabled = true`
- `questionBankWritable = false`
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`

## Frozen authorities

English:
- freeze version: `BTD-001-CP005-ENGLISH-FREEZE-v1`
- chapter fingerprint: `63e9ea9e1199cf5f0f987482649bb8264e35607fb7701e0a4dc3b2f030480659`

Hindi/Punjabi:
- freeze version: `BTD-001-CP009-HI-PA-FREEZE-v1`
- CP009 certified head: `233f9d0dcbd3bacb2f9fc034e06b506d1fe5e02d`
- chapter fingerprint: `43f0f013d562f7e31382d14dda4fe1db4300566cd91592290dfc7b1f518a0a87`
- 120-review fingerprint: `ed36555d23de2e6f764bbc95c4b9a3ea490e260f6415b14ca14d1cc0224fe48b`

## Initial CP010 certification

Head: `475456258462e4e2d5d08f3551b0ae4b3e281a34`

Workflow run `33295250003`, job `99213677195`: **SUCCESS**

The workflow first re-proved:
- CP009 Hindi/Punjabi freeze: PASS
- CP006 English Question Studio baseline: PASS

CP010 audit:
- Studio previews: 6,000 (`20 QLs × 3 languages × 100 seeds`)
- language counts: `en 2000 / hi 2000 / pa 2000`
- frozen learner-equality checks: 30,000
- frozen fingerprint checks: 10,000
- deterministic replay checks: 6,000
- English CP006 compatibility checks: 10,000
- Hindi/Punjabi native-language checks: 8,000
- option checks: 24,000
- explanation checks: 36,000
- lifecycle checks: 72,000
- native JSON checks: 12,000
- unique Studio question IDs: 6,000
- previous packages: 36
- aggregate packages after BTD: 37
- duplicate BTD package IDs: 0
- CP/QL/difficulty/language routing: PASS
- canonical route mount: PASS
- API build: PASS
- exact-head assertion: PASS

Answer positions:
- English: `521 / 498 / 487 / 494`
- Hindi: `500 / 495 / 510 / 495`
- Punjabi: `512 / 485 / 521 / 482`

Artifact: `9727215571`
Digest: `sha256:c50a65d2652768fbccd8ed12facc8457732c08f72b199449022e2eb36ff4d9bf`

## Lifecycle after CP010

- `questionStudioDiscoverable = true`
- `questionStudioGenerationEnabled = true`
- `contentMutationAuthorized = false`
- `questionBankWritable = false`
- `testEligible = false`
- `mockTestEligible = false`
- `publiclyPublishable = false`
- `automaticStudentPublication = false`

A final exact-head rerun after this authority record is required before CP010 is treated as closure-ready.
