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

## Exact-head CI follow-up — 2026-10-10

- Head `f2249697300d60f079485b3f143dadd70e3e8b45`: all three TSD workflows pass, including closure run `38032950697`; workflow hygiene and central engine adapters also pass. At the final inspection, 47 repository workflows passed, nine failed and one simulation remained running.
- The nine failures resolve to six causes: stale Probability BANK_ONLY assertion (three workflows); stale Trigonometry shared-engine BANK_ONLY assertion; obsolete CP008 language renderer selection; two Blood Relations tests reading the retired route or expecting disabled persistence to be enabled; valid SAP QL050 `p`/`q` symbols omitted from the language-audit allowlist; an extra EOF blank line in the foundation audit document.
- Restored the missing source-branch test reconciliations, CP008 compatibility review-bank helper, mathematical symbol allowlist and whitespace cleanup. Existing runtime permissions and release locks were not changed. Compatibility rendering preserves canonical GUY_WIRE_ANCHOR identity and its semantic fingerprint.
- Local corrected Probability profile, Trigonometry route contract, 192-question native leakage, Blood Relations standard/CP007 production proofs, and all 422 SAP Hindi/Punjabi authored release cases pass; six 50-question SAP cockpit runs pass. Full patch whitespace against the original New-main base passes.
- These follow-up fixes require their own exact-head CI run. TSD source breadth, UI rendering and human editorial blockers remain open; passing CI does not close the chapter.

## Source breadth continuation — 2026-10-10

- Exact head `1b639dc6`: 68 workflow successes, no failures, one cancelled run and one simulation still running at inspection. All TSD gates and the central adapter gate passed.
- Read Arun Sharma PDF413–416 text and compared the source observations to executable input contracts. Confirmed CP010 lacks an inverse form for two different time headstarts and a first-race distance margin. Added a separate 18-row trilingual review candidate; the source case yields an exact faster speed of 50/3 m/s and slower speed of 10 m/s.
- Both races reconstruct independently for all six numerical states; invalid observations, option uniqueness, worked calculations and release locks pass. The complete editorial candidate suite passes with this added proof. Frozen content and live registrations are unchanged.
- Recorded scoped circular-track, tangent-track, clock ownership and contradictory source-wording follow-ups in `CP010-TIME-HEADSTARTS-SOURCE-20261010.md`. These are triage findings, not whole-source or UI closure claims. Supplemental source-review rows total 72, separate from V4.

## Scoped source semantic proofs — 2026-10-10

- Head `0e0b9bab`: 69 successful workflows, no failures and one simulation still running at inspection.
- Closed the scoped delayed-departure Q22 follow-up: unsigned separation permits both 50 and 10 km/h for the earlier car, with all four positions inside the 800 km route. The existing CP012 inverse solver and CP004 pursuit authority reconstruct both cases. No extra learner batch or permanent QL was needed.
- Closed the scoped tangent-track Q6 maximum-distance follow-up: 240 m requires simultaneous outermost-point positions, but the exact lap phases give incompatible odd/even doubled-time classes. Existing CP011 rate translation verifies lap periods without approximating pi. Arbitrary two-track geometry remains unverified.
- Added both regression proofs to the full editorial suite; all pass locally. Supplemental review counts remain 72 and frozen V4 remains unchanged. Whole-source completeness, foundation provenance, UI evidence and human editorial promotion remain pending.

## Studio review presentation reconciliation — 2026-10-10

- Exact previous head `c97fe172`: 69 workflows passed, none failed, one simulation still running at inspection.
- Recovered the missing shared Studio explanation helper change. Structured authored steps and string arrays are now accepted without serializing arbitrary objects; legacy strings remain supported.
- Added a durable full-corpus presentation proof for 3,918 rows (V4 3,846 plus 72 supplemental source-review rows). All retain stems and every authored calculation line through the actual Studio helpers. Full editorial suite, six focused Studio quality tests and Admin TypeScript pass locally.
- Added helper/test path coverage and focused Studio tests to the existing TSD workflow, retaining the central adapter workflow ownership policy.
- UI status remains partial: visual fonts, mobile/desktop overflow and real MathJax rendering evidence remain unverified. No live registration or release approval is implied by extraction compatibility.

## Source audit and reflection correction — 10 October

The full26-question Applications exercise on PDF415–420 is now adjudicated. Ten clock cases execute existing exact CLK foundations; other cases use existing source candidates or independent reconstruction/counterexamples. Source key errors Q18/Q19, missing directions Q25, ratio reversal Q21, and nonunique Q22 are explicitly retained rather than copied into learner content. The wider PDF401–405 and421–438 review has a model-level gap ledger; this does not claim every mixed-block question belongs to TSD or that all source cases have executed learner models.

A genuine CP005 defect was fixed: reflected nth meeting/count used only head-on odd multiples of L/(u+v), missing same-direction catches. Solver merges both exact congruence streams with endpoint deduplication; verifier independently advances piecewise endpoint trajectories. New regression passes2,997 checks across81 speed pairs, including points/counts/itineraries. CP005 proof, full revision/editorial/frozen/current-main closure suite255, and API build pass locally. Build retains pre-existing unrelated duplicate-key warnings. Source candidates remain unapproved, CP010–012 unregistered, and all Bank/test/mock/public locks remain unchanged.

Broader coverage still requires state-transition models such as both-runner speed exchange, queued dispatch and diagram-grounded geometry; actual visual UI evidence and human multilingual approval remain open. New source image retrieval returned403; no new image inspection is claimed.

## Final source inventory and mathematical continuation —10 October

The prior source-image403 was resolved by materializing the original PDF. Every195LOD question now has an individual inventory entry;26Applications questions retain their full adjudication. The12new locked motion solvers, prior two state-transition models, visually grounded diagram proof and mixed-review reconstructions are now imported into the full editorial proof suite. CP005 gap and repeated-meeting route inverse were corrected and independently swept across81speed pairs; generator time windows and claims now use the full reflected event sequence. Unsupported rest inverse phases are rejected rather than silently assigned a value.

The exact final status is recorded in `docs/audits/tsd-chapter-result-2026-10-10.md`. Mathematical review extensions have not become authored/registered learner content. Actual browser rendering could not be certified after the Chromium download failed and the cloud browser's URL security policy rejected an isolated render page. No human multilingual approval, source-wide learner answer certification, final closure receipt or release permission is fabricated.
