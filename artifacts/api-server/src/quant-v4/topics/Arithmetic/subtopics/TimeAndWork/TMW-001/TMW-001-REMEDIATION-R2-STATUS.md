# TMW-001 Remediation R2 Status

## Verdict

`R2_CP001_CP006_MAJOR_FINDINGS_AND_LEARNER_V2_REMEDIATED_AND_REGRESSION_PROVED`

R2 closes the seven audited MAJOR learner-facing findings in `TMW-QL-016, 028, 086, 108, 115, 119, 121` and migrates `TMW-QL-001..127` (CP-001 through CP-006) onto the post-audit learner explanation contract.

This checkpoint does **not** declare the full chapter exam-ready. CP-007 through CP-011 still require the R3 explanation/editorial pass and a final independent exam-readiness audit. Question Studio routing, Question Bank writes, test assembly and public delivery remain disabled.

## Authority and scope

- Chapter: `TMW-001 — Time, Work & Pipes`
- Permanent QL range retained: `TMW-QL-001..TMW-QL-211`
- R2 migrated range: `TMW-QL-001..TMW-QL-127`
- R2 checkpoints: `TMW-CP-001..TMW-CP-006`
- R2 branch: `fix/tmw-001-remediation-r2-cp001-cp006`
- R2 base: `fix/tmw-001-remediation-r1-multilingual`
- Strengthened implementation proof head: `556ef9912eaed7749eeee331a4bb5ffb72f938c0`
- Status-record head: `bcc5027c47d5d6f3398b4c903bcbc295b6315c50`
- Draft PR: `#664`

## Seven MAJOR findings remediated

- `TMW-QL-016`: vague `first`-style conclusion removed; the compared quantity is named directly.
- `TMW-QL-028`: destructive/rework language rewritten into normal exam-style wording without changing the signed-rate mathematics.
- `TMW-QL-086`: the stem now asks for the exact elapsed time, matching the canonical `TIME` answer/options contract instead of asking simultaneously for complete days and a terminal fraction.
- `TMW-QL-108`: duplicated `per day` wording removed from the learner conclusion.
- `TMW-QL-115`: conclusion now answers the requested **additional remaining days**, rather than a generic total-time statement.
- `TMW-QL-119`: duplicated overtime/per-day wording removed.
- `TMW-QL-121`: area/volume ambiguity removed where the solve mode uses the product of the stated dimensions as the work quantity.

The R2 remediation layer is applied at the final chapter boundary so earlier English/localization polish cannot silently restore these audited defects.

## Learner Explanation V2 migration — QL-001..127

Each generated English, Hindi and Punjabi package in CP-001 through CP-006 now receives a separate learner-facing artifact:

1. **Method** — a short solve-mode/family-appropriate exam method;
2. **Solution** — 2 to 5 connected steps with at least one concrete calculation before the final answer;
3. **Answer** — the exact requested quantity.

The legacy explanation object remains available internally for solver/audit compatibility, but the new learner artifact does not make formula, givens, shortcut or common-mistake blocks mandatory.

### Explanation policies enforced

- no generic `10-Second` claim in learner V2;
- no exposed formula block;
- no exposed separate givens block;
- no mandatory shortcut or common-mistake block;
- no unexplained English word-based subscripts;
- no Devanagari/Gurmukhi word-based subscripts;
- no `\\text{...}` phrases left inside learner MathJax;
- display units such as days/hours are moved outside MathJax in the learner copy while canonical option/answer authority remains unchanged;
- unsafe legacy setup equations are not copied blindly;
- numeric-only calculation fragments may be recovered from legacy equations when they are safe for student display;
- each V2 solution must contain at least one concrete numeric calculation before its final answer step.

## Family-level exam methods

The R2 learner method layer selects the natural exam approach rather than one generic formula for every QL:

- CP-001: direct work-rate-time, whole-work-as-1, comparison, or inverse rate-time change as appropriate;
- CP-002: unit-rate addition, pairwise-rate isolation, signed/rework rate, or identical-unit scaling;
- CP-003: efficiency/time inverse relation, efficiency ratios and successive-ratio chaining;
- CP-004: stage timeline / worker-day ledger / backward stage recovery;
- CP-005: cycle table, calendar-cycle handling and terminal-segment calculation;
- CP-006: resource × days × daily-hours × efficiency balance, dimensional work ratio, progress recovery, production scaling, stock/person-days or batch-worker series as appropriate.

## Permanent R2 proof

Workflow: `Validate TMW-001 remediation R2 CP001-CP006`

Strengthened implementation proof:

- head: `556ef9912eaed7749eeee331a4bb5ffb72f938c0`
- run: `31365050400` — **PASS**
- evidence artifact: `9053810306`
- artifact digest: `sha256:e4d3afc978d026c1708b0138bdc1f061c7cdbbff4ead82a84cf4655e76c3be46`

Exact status-record head regression:

- head: `bcc5027c47d5d6f3398b4c903bcbc295b6315c50`
- run: `31365208972` — **PASS**
- evidence artifact: `9053869567`
- artifact digest: `sha256:1d9358d6e29ff74d0acbf220e0c5b6acd582a2749181d27a1c3255ceb78728d5`

### Seven-finding proof

- 7 audited MAJOR QLs;
- 3 languages;
- 3 deterministic seeds per QL/language;
- 63 learner-facing cases;
- publication lock retained.

### Learner V2 proof

- 127 QLs (`001..127`);
- 3 languages;
- 3 deterministic seeds per QL/language;
- **1,143 / 1,143 cases PASS**;
- V2 contract valid;
- 2–5 solution steps;
- exact normalized solved answer present;
- four unique options and correct-option agreement retained;
- no legacy formula/givens/mandatory shortcut blocks in V2;
- no generic `10-Second` claim;
- no unsafe word/localized subscripts or `\\text{...}` learner math;
- at least one concrete calculation before the final answer in every case;
- Hindi/Punjabi script presence checked;
- `publiclyPublishable: false` checked.

### R1 regression retained

The same strengthened run re-executes the R1 blocker proof:

- 7 critical QLs;
- 20 deterministic seeds per QL;
- 280 localized critical rows checked;
- verdict: **PASS**.

### Whole-chapter multilingual parity retained

The same run also re-executes the full chapter parity suite:

- 211 QLs across 11 checkpoints;
- 12 deterministic states per QL;
- 2,532 English packages;
- 5,064 localized packages;
- 5,064 parity checks;
- 0 invalid localized packages;
- 0 publishable localized packages;
- 211 Hindi QLs retained;
- 211 Punjabi QLs retained;
- verdict: **PASS**.

## Self-review findings closed during R2

The R2 gate was deliberately strengthened while implementation was in progress. It caught several issues that a superficial green contract would have missed:

1. a `Givens` policy regex initially matched the ordinary English word `given`; the guard was narrowed to the actual legacy section label;
2. an answer-line assertion initially required exact canonical display text even when a semantically stronger named conclusion used a different display form; the proof now requires the normalized solved answer in the complete learner explanation;
3. QL-008 exposed units such as `days` inside `\\text{...}` MathJax and an unsafe partially recovered setup fragment; learner units are now outside math and unsafe setup lines are not blindly copied;
4. CP-001 percent-completed modes were initially over-classified as inverse rate-time problems; method selection was corrected;
5. QL-106 exposed unsafe `\\text{constant}` in a legacy method opening; unsafe inherited openings are now excluded;
6. a stronger requirement for a real calculation exposed QL-019 as `setup + answer` only; the extractor was upgraded to recover safe numeric-only arithmetic without reintroducing named subscripts.

The final strengthened implementation run and the subsequent exact-head regression both passed after these corrections.

## Remaining gate — R3

R2 is complete for CP-001 through CP-006, but the chapter remains **NO-GO for publication**.

R3 must cover `TMW-QL-128..211` / CP-007 through CP-011, including the remaining audited editorial issues such as QL-130/136/140 localized conclusion grammar, QL-150 contribution-factor wording, QL-160 fragmentary conclusion, QL-174 phrasing, QL-189 agreement, QL-192 time labeling, QL-195/199 rate-vs-output conclusion alignment and QL-208 additional-quantity wording.

After R3, regenerate/finalize multilingual learner output and perform a fresh independent full-chapter exam-readiness audit before any manual freeze or publication decision.

## Safety boundary

- `publiclyPublishable: false` remains mandatory.
- No Question Studio route is enabled.
- No Question Bank persistence is enabled.
- No test assembly or public student delivery is enabled.
- No permanent QL ID is renumbered or replaced.
