# TSD reconciliation against New-main — 2026-10-09

Status: **TSD-owned file transplant committed / validation pending / DO NOT MERGE OR RELEASE**

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
