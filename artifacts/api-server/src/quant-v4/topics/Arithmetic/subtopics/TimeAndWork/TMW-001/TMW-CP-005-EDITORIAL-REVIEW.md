# TMW-CP-005 Editorial Review

**Review stage:** completed post-user-review correction and critical re-audit  
**Sample:** 24 QLs × 3 seeds = 72 generated candidate questions

## Original review verdict

The 72-row English review pack was judged mathematically correct and strongly aligned with SSC, Banking, Railway and other competitive-exam Time and Work patterns. The review identified two visible ordinal defects:

- `TMW-QL-093:1`: `3th` → `3rd`;
- `TMW-QL-094:2`: `3th` → `3rd`.

It also requested simpler first-step guidance and more explicit derivation of the final partial turn.

## Critical re-audit findings

The source review confirmed the two ordinal defects and found that the explanation weakness was shared across several solve modes rather than limited to two sample rows:

1. cycle work was often stated without substituting the actual rates and durations;
2. work completed by full cycles and remaining work were omitted;
3. the final-turn duration was shown without deriving `remaining work ÷ active rate`;
4. inverse-rate and inverse-time questions skipped known-work and remaining-work algebra;
5. terminal-agent questions named the worker without showing why the remaining work fits that turn;
6. exact-boundary questions reused the ordinary final-segment template even though no extra partial turn is required;
7. completion-within-block questions did not explicitly show the fraction of the final block;
8. some openings used internal terms such as `terminal segment`, `phase` and `reconstruct`, which are less accessible to students.

A second manual audit of the first regenerated artifact found one further systemic explanation defect: when completion occurred in the second or later segment of the last incomplete cycle, the displayed explanation initially divided all work remaining after full cycles by the final worker's rate. It omitted the work completed by earlier segments of that same last cycle. Final answers remained correct because the canonical solver used an exact event trace, but the displayed algebra was inconsistent in representative weekday, unequal-shift, repeated solo/joint and arbitrary-start questions.

## Corrections applied

- introduced a proper ordinal formatter covering `1st`, `2nd`, `3rd`, `11th`, `12th`, `13th` and general suffix rules;
- replaced shorthand actor references such as `A, B, C` with the generated actor names where useful;
- rewrote every explanation opening in simpler student-facing language;
- added actual rate × duration substitutions for one complete schedule pattern;
- added full-pattern work and work remaining after full patterns;
- added the work completed before the final turn inside the last incomplete pattern;
- subtracted that pre-final work before calculating the final worker's partial turn;
- added explicit known-work and remaining-work equations for inverse questions;
- named both candidate starters in starting-agent comparisons;
- added a dedicated exact-boundary derivation using only whole cycles;
- added the explicit fraction of the final work block for `TMW-QL-103`;
- expanded machine-output working to show each machine's contribution;
- added regression guards for bad ordinals, jargon-heavy openings, missing derivations, incorrect final-turn division and omitted pre-final work.

## Final validation evidence

- reviewed code head: `80b069f2f188b72dc9b738fcd860d7a823e27933`;
- CP-005 workflow run: `30254623992` — PASS;
- evidence artifact: `8648353015`;
- artifact digest: `sha256:568062a2f9b21b84738d7c614f2d86c6bd5a0f68d5daf920754107abefbc6d5b`;
- deterministic proof: 24 QLs × 50 seeds = 1,200 cases — PASS;
- structural/editorial audit: 24 QLs × 12 seeds = 288 cases — PASS;
- invalid packages: 0;
- ordinal hits: 0;
- jargon-heavy opening hits: 0;
- missing completion derivations: 0;
- missing inverse derivations: 0;
- incorrect final-turn arithmetic: 0;
- missing pre-final-work derivations: 0;
- exact-boundary explanation defects: 0;
- missing final-block fractions: 0;
- missing next-day fractions: 0;
- CP-001, CP-002 and CP-003 regression workflows: PASS.

Manual artifact checks confirmed corrected output for `TMW-QL-086`, `093`, `094`, `095`, `096`, `098`, `099`, `101`, `102`, `103` and `105`.

## Product boundary

Approval of the 72-row review pack approves the English CP-005 generator at runtime-proof maturity. The 72 rows are generated review samples, not Question Bank records. Question Studio registration, Question Bank approval/write, localisation, test assembly and public student delivery remain separate future gates.

## Final verdict

**Approved for merge into the isolated TMW chapter base at English runtime-proof maturity.**
