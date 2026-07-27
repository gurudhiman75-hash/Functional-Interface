# TMW-CP-005 Editorial Review

**Review stage:** post-user-review correction and critical re-audit  
**Sample:** 24 QLs × 3 seeds = 72 generated candidate questions

## Original review verdict

The 72-row English review pack was judged mathematically correct and strongly aligned with SSC, Banking, Railway and other competitive-exam Time and Work patterns. The review identified two visible ordinal defects:

- `TMW-QL-093:1`: `3th` → `3rd`;
- `TMW-QL-094:2`: `3th` → `3rd`.

It also requested simpler first-step guidance and more explicit derivation of the final partial turn.

## Critical re-audit findings

The follow-up source review confirmed the two ordinal defects and found that the explanation weakness was shared across several solve modes rather than limited to two sample rows:

1. cycle work was often stated without substituting the actual rates and durations;
2. work completed by full cycles and remaining work were omitted;
3. the final-turn duration was shown without deriving `remaining work ÷ active rate`;
4. inverse-rate and inverse-time questions skipped known-work and remaining-work algebra;
5. terminal-agent questions named the worker without showing why the remaining work fits that turn;
6. exact-boundary questions reused the ordinary final-segment template even though no extra partial turn is required;
7. completion-within-block questions did not explicitly show the fraction of the final block;
8. some openings used internal terms such as `terminal segment`, `phase` and `reconstruct`, which are less accessible to students.

## Corrections applied

- introduced a proper ordinal formatter covering `1st`, `2nd`, `3rd`, `11th`, `12th`, `13th` and general suffix rules;
- replaced shorthand actor references such as `A, B, C` with the generated actor names where useful;
- rewrote every explanation opening in simpler student-facing language;
- added actual rate × duration substitutions for one complete schedule pattern;
- added full-pattern work, remaining work, final-worker rate and final-turn duration;
- added explicit known-work and remaining-work equations for inverse questions;
- named both candidate starters in starting-agent comparisons;
- added a dedicated exact-boundary derivation using only whole cycles;
- added the explicit fraction of the final work block for `TMW-QL-103`;
- expanded machine-output working to show each machine's contribution;
- added regression guards for bad ordinals, jargon-heavy openings and missing completion/inverse derivations.

## Product boundary

Approval of the 72-row review pack approves the English CP-005 generator at runtime-proof maturity. The 72 rows are generated review samples, not Question Bank records. Question Studio registration, Question Bank approval/write, localisation, test assembly and public student delivery remain separate future gates.

## Current verdict

**Conditionally approved for merge into the isolated TMW chapter base, subject to the regenerated exact-head CI and artifact passing the strengthened audits.**
