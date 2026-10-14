# DI novelty and edge audit V2

Status: **TECHNICAL AUDIT COMPLETE FOR THE EXISTING ENGLISH CONTROLLED-REVIEW MIX**

Date: 2026-10-14. The 338 existing DI source files were compared with `New-main` at `85cd05c641893246ec7bb3d33fd0faaf0fccf95c`; every file matched before remediation. This audit covers the 23 existing selection modes, three declared exam profiles, mixed and explicit difficulty, and integer batch counts 1–1000. It completes the previously deferred technical novelty/edge pass for this implemented delivery contract. It does not certify arbitrary new publisher patterns, novel solving topologies that have not been authored, chapter-wide human native approval or public release.

## Demonstrated defects and fixes

1. **Valid requests failed.** The initial 216-request boundary sweep failed 44 times. SSC and Banking Prelims all-Hard requests used a source cap that assumed equal capacity in every novelty tier, despite unequal quotas. The runtime now finds the tightest feasible cap from actual eligible slots and retains round-robin source breadth. Banking Mains keeps its four-source depth and concentration requirements.
2. **Different charts were called duplicate questions.** A repeated question stem could exhaust 12 retries even when it referred to different data. Stem diversity remains preferred. Exact learner-item uniqueness is now enforced using normalized stem plus canonical stimulus, independent of seed, object-key order and generation metadata. If stem alternatives are exhausted, a distinct data stimulus may be retained. `uniqueLearnerItems`, `uniqueStems` and `repeatedStemDifferentStimulus` report that distinction; numerical variation is not relabelled as new mathematical topology. Discarded repair attempts no longer accumulate source packages.
3. **Quota ties depended on floating roundoff.** For example, the SSC 90-question difficulty allocation previously produced 31 Easy / 36 Medium / 23 Hard rather than the deterministic priority result 32 / 36 / 22. Integer percentage remainders now break ties in the declared tier/band order. An independent integer oracle checks every count 1–1000 in every profile.
4. **Mixed-chart category answers could be ambiguous.** A 1,000-seed DI-011 probe found 149 tied maximum-category questions among 534 such questions. In the representative `DI-EDGE-CROSS:2` set, Course A/C/E all totalled 500, while only Course A was marked correct. Construction now raises one deterministically chosen tied maximum by one existing 20-unit grid step before questions, graphics and localization are derived. It preserves integer arithmetic and the existing topology. Direct English question wording replaces residual procedural openings in the affected mixed-chart authority.
5. **Invalid requests silently changed intent.** Count zero/fractions/out-of-range/non-numeric values, unknown exam profiles, invalid difficulty values and conflicting package/checkpoint selectors now fail explicitly. Supported aliases and omitted-filter defaults remain available. The mix stays English-only until its separate native review contract is completed.

## Verification

- 6,000 independent allocation checks: both allocators × 1,000 counts × three profiles.
- 276 delivered batches, including the full 216 boundary requests and 60 independently seeded mock-sized batches; 27,960 selected questions across all 23 source modes and all five higher-novelty modes.
- 36 complete learner-surface replays covering small, mock-sized and maximum-sized requests; 12,252 replayed questions. Stem, stimulus, SVGs, options, answer, explanation, difficulty and source ownership are compared, excluding operational timestamps.
- 39 malformed requests/helper calls are rejected.
- 10,000 independent linked-chart answers: 5,000 DI-011 questions across all five representation pairs and ten task forms, and 5,000 radar/pie questions across all fourteen task forms. The oracle reads displayed data and stem category references; it does not read hidden rate selections or the generator's stored approved-count answers.
- 1,000 unique-maximum states and 1,000 Hindi/Punjabi parity cases for the corrected DI-011 source.
- Existing mix, shared-adapter, mixed-chart, native, advanced-missing, radar and radar/pie proofs remain regression gates. The new CI workflow records executable evidence.

The proof JSON reports per-mode raw stem/frame/stimulus/task breadth and answer positions. Those measured counts are evidence of coverage in this sweep, not an invented novelty score or a count of independently authored problems. Large batches can reuse a question frame with different visible data.

Standalone type traversal retains three diagnostics in the pre-existing DI-001/DI-004 import graph; the same file/line/code diagnostics occur when checking the original runtime. No new diagnostics are introduced by the changed runtime or new audits. Global type checking is not represented as clean. Production bundle and integration behavior are covered by hosted checks.

## Freeze and lifecycle

The technical novelty/edge scope above is frozen. Existing permanent QLs, topic ownership, mainstream representation coverage and novelty percentages remain in force. This is a selection/edge correction, with one demonstrated source-answerability repair; it does not start another baseline expansion pass.

Question Studio continues to expose a controlled-review candidate. Question Bank writes, test/mock eligibility, automatic student delivery and public publication remain disabled. Manual approval remains required. Human/live verification is deferred to the user. Wider native mix approval or a materially new solving topology must identify its own scope instead of silently widening this closure.
