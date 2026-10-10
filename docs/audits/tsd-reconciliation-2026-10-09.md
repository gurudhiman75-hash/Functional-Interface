# TSD reconciliation against New-main — 2026-10-09

Status: **Local integration gates pass / final-head CI pending / DO NOT MERGE OR RELEASE**

## Source and target
- Target: `New-main` at initial review head `dc6ed1b4bc525847740cdd4e69e1367758d19596`.
- Source: `audit/tsd-reconcile-complete-20261004` (PR #3148).
- Comparison: source branch is 47 commits ahead and 84 commits behind target, merge base `6f449b1716b0eeb1858a3310ef90e1d90414b8c5`.
- The comparison endpoint returned **300 file entries**; this is *not* a complete safely audited changed-file inventory. DO NOT treat the list as exhaustive.

## Current verified hazards
1. New-main carries newer Question Studio worker and routing/deployment changes. Do not bulk merge source or overwrite these shared paths.
2. CP003 implementation exists on the source but not New-main. Partial transplantation of CP003 files is not a coherent chapter integration.
3. TSD current-main-closure workflow only exists on source; adding the workflow without all imports/authorities may create misleading failed CI.
4. TSD editorial corrections remain **unapproved review candidates**. CP010–CP012 registration, production routing, Question Bank/test/mock/publication activation are NOT authorised.
5. PR #3148 records a prior SAP Hindi/Punjabi two-seed parity gate failure (QL007/QL037). Its status must be re-proven on the exact integrated commit, not assumed fixed.

## Safe reconciliation requirements
- Establish a complete source tree manifest of the TSD-owned files, including CP003–CP012, all quality-audit exports and closure proof modules.
- Port as a dependency-closed set onto a fresh New-main base, keeping source provenance metadata, frozen corpus and lifecycle locks.
- Resolve shared-file edits individually against current main, especially admin Question Studio quality and SAP runtime/gates.
- Only after integration: run full frozen proof suite, editorial candidate proof, two-seed SAP parity audit, API production build, Question Studio adapter regression, MathJax/UI rendering and scenario/source evidence review.
- Record actual pass/fail results and exact integration head. A passing mathematical suite alone does not upgrade release status.

## Current actions
- Created a separate reconciliation branch from New-main.
- Confirmed branch divergence and missing CP003 and CI files.
- On 2026-10-09 recovered untruncated recursive trees: source TSD file count 662, target 150. Ported all 513 differences (512 additions, one modified TSD-001 barrel file) by Git object SHA onto this branch. Integration commit `525cf05d72f2cda9a129119885620867dbe7be1e`.
- Verified CP003 README and this audit document remain readable on integration branch.
- **Shared changes outside TimeSpeedDistance not yet reconciled**, no suite run, no merge or activation.

## Continuation — 2026-10-10

- Diagnosed closure run `38030248516` on head `b2764fca`: bundling passed after the bridge restoration, but unified package registration failed (`0 !== 1`).
- Restored TSD-001/TSD-002 package listing and generation dispatch in the current unified Quant adapter, preserving the newer TRG, TMW, SAP and NUM handlers.
- Strengthened the closure gate to generate all 171 registered multilingual cases through the unified adapter and reject CP010–CP012 through that same entry point. Together with the 84 locked previews, all 255 cases pass locally.
- CP003–CP012 frozen proof suite and the full editorial candidate proof suite pass locally. Candidates remain unapproved and frozen corpus is unchanged.
- API production build passed after the TSD routing restoration.
- Reproduced all four previously reported SAP QL007/QL037 Hindi/Punjabi parity failures across the full 844-state gate. QL007 now handles parenthesized multiplication groups; QL037 reconstructs its numeric expression from all four English frames instead of retaining malformed translated instructions.
- Added localization path coverage and the full SAP two-seed quality gate to the closure workflow. Shared-adapter coverage belongs to the central adapter workflow under repository fanout policy.
- Closure remains **NO-GO / DRAFT**: external foundation source provenance, semantic breadth/scenario review, MathJax/UI evidence and editorial promotion are still outstanding. CP010–CP012 and all TSD public/test/bank release locks are preserved.

## Shared compatibility and source review — 2026-10-10

- Prior head `3d660009` passed GitHub TSD closure, but CI exposed forbidden chapter workflow path filters, a SAP CP006 duplicate fractional option, and conflicting shared registry lifecycle metadata.
- Removed forbidden self/shared-adapter workflow triggers without a policy exception. Fraction options now compare rational equivalence and choose three distinct misconceptions; CP006 300-question review and the SAP 833-case chapter acceptance gate pass locally.
- Reconciled legacy package declarations with current shared registry validation. Named lifecycle authorities still require matching stages; explicit review-only locks remain enforced. Removed inherited lifecycle labels that contradicted already-approved PRB/TRG/PGK/COA gates, explicitly marked BLR/CAE review stages, and excluded PCT aggregate/CAL legacy proxy cards from executable Quant registrations. No release permission was added.
- Shared registry regression passes; 20 integration tests covering SAP Banking, AVG, NUM, TRG and TMW pass, and Punjab GK adapter proof passes. Final API production build passes.
- Added 18 English/Hindi/Punjabi slowdown-observation editorial candidates across six numerical states, using the existing CP012 coupled inverse solver. Source: Arun Sharma (2018), PDF page 423, printed III.179, Review Test 2 Q1. The source case independently resolves to 20 km/h and 78 km; five other states are explicitly authored parameter variants. Text extraction was reviewed; visual layout and authenticated PYQ provenance were not established.
- All 18 independent journey reconstructions and candidate-lock checks pass. Full editorial suite and 255-case unified TSD closure pass. These are one additional observation structure within an existing model, not six new semantic models. The frozen 3,846-question corpus remains unchanged; supplemental editorial rows total 54.
- Remaining blockers: wider source provenance and semantic breadth audit, learner/Studio MathJax rendering evidence, human multilingual editorial approval, and final-head CI verification. TSD remains NO-GO; CP010–CP012 remain unregistered and every release lock remains intact.
