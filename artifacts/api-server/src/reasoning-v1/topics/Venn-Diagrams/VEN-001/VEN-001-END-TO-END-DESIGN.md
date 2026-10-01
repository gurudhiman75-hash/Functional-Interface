# VEN-001 — Logical Venn Diagrams: End-to-End Design

Status: **11 live review-only checkpoints; 10 permanent QLs allocated and wired; final localization/source closure still pending**

Product code: `REAS-VEN`  
Chapter ID: `VEN-001`  
Family: `Reasoning V1 / Family C — Logic and deduction`  
Primary locales: English (`en-IN`), Hindi (`hi-IN`), Punjabi (`pa-IN`)

## 1. Chapter purpose

VEN-001 covers direct Venn relationship recognition, category-to-diagram mapping, region identification, numerical set questions, overlap bounds, and geometric-region counting.

The chapter is distinct from Syllogism. Syllogism evaluates logical conclusions from quantified premises; VEN-001 asks the learner to represent, read, or calculate from an explicit set structure.

## 2. Live checkpoint surface

| Checkpoint | Learner operation | Permanent QL |
|---|---|---|
| VEN-CP001 | two-set relation → diagram | VEN-QL-001 |
| VEN-CP002 | three-set relation → diagram | VEN-QL-001 |
| VEN-CP003 | categories → diagram | VEN-QL-002 |
| VEN-CP003 reverse | diagram → categories | VEN-QL-003 |
| VEN-CP004 | numbered region identification | VEN-QL-004 |
| VEN-CP005 | two-set numerical set/region count | VEN-QL-005 |
| VEN-CP006 | three-set numerical set/region count | VEN-QL-005 |
| VEN-CP007 | percentage / ratio | VEN-QL-006 |
| VEN-CP008 | solve unknown | VEN-QL-007 |
| VEN-CP009 | shared caselet count | VEN-QL-008 |
| VEN-CP010 | overlap bounds | VEN-QL-009 |
| VEN-CP011 | geometric region count | VEN-QL-010 |

There are eleven implementation checkpoints but ten learner-contract QLs. CP001+CP002 and CP005+CP006 are intentionally compressed because set count and relation-to-diagram remain the same semantic operation across two-set and three-set variants.

`VEN-QL-011` is the next unallocated permanent QL ID.

## 3. Permanent QL authority

Authority: `VEN_001_PERMANENT_QL_REGISTRY_V1`.

Every live generation path emits both `qlId` and `permanentQlId`. The registry is tested separately from the generators so checkpoint growth cannot silently create an unmapped learner operation.

## 4. Source and authority model

VEN-CP003 uses curated, versioned category authorities. The current live authority library contains 34 signed-off trilingual category records across animal classification, geometry, number classification, general classification, astronomy, food, and language domains.

Source-pattern evidence and scenario-authority correctness are deliberately separate:

- attributed previous-paper reproductions establish that three-class category→diagram and diagram→category operations occur in SSC-family exams;
- curated canonical facts may broaden safe category coverage where the set relationship is stable;
- context-dependent or disputed classifications are excluded;
- the supplemental source census has **not** independently confirmed standalone two-class category→diagram as a recurring exam pattern.

Therefore VEN-CP001 remains a supported structural/basic-practice layer. Its presence must not be described as separately source-proven exam frequency.

## 5. Relation-to-diagram breadth

Current review pools after Wave 05:

- VEN-CP001: 20 fixed scenarios
  - 8 containment
  - 5 disjoint
  - 7 partial overlap
- VEN-CP002: 27 fixed scenarios across all 11 supported three-set topologies
  - every topology has at least two reviewed scenarios
- VEN-CP004: 21 distinct numbered-region candidates

The generator refuses counts above the distinct fixed candidate pool rather than silently duplicating a candidate.

## 6. Numerical breadth

VEN-CP005–CP010 use a 20-context scenario library with deterministic seeded numeric variation.

The numerical surface includes:

- 7 two-set query forms;
- 17 three-set region/query forms;
- percentage and ratio questions;
- unknown-value solving;
- five-question shared caselets;
- mathematically verified overlap minima/maxima and union/intersection bounds.

The numerical solver stores exclusive region counts and derives the displayed totals from those regions. Tests independently reconstruct membership and validate the keyed answer.

## 7. Geometric region breadth

VEN-CP011 currently uses:

- 20 activity/scenario contexts;
- 9 geometric layout families;
- circle, ellipse, rectangle, square, triangle, right triangle, diamond, trapezoid and pentagon primitives;
- 10 query keys spanning single-region, pair-only, all-three, exactly-one, at-least-two and at-least-one operations.

The learner stem and explanation name the actual activities. Ordinal wording such as “first/second/third activity” is not permitted in learner-facing text.

## 8. Solver and rendering contract

Every item carries structured semantic metadata sufficient to validate its answer independently of surface wording.

For topology questions:

1. derive the intended set signature;
2. derive each option signature;
3. require exactly one semantic match;
4. reject duplicate-equivalent options;
5. render from the same typed topology/order data used by validation.

For numerical questions:

1. generate a feasible exclusive-region state;
2. derive membership totals and overlap totals from that state;
3. solve the requested operation;
4. generate distractors from nearby valid-looking values;
5. verify the answer independently in property tests.

For geometric-region questions, numeric labels are placed in actual geometric membership regions and tested against the shape-membership mask.

## 9. Distractor rules

Distractors must correspond to plausible reasoning errors, not visual tricks.

Typical topology errors include:

- reversed containment;
- overlap treated as disjoint;
- partial overlap treated as containment;
- false three-way intersection;
- missing three-way intersection;
- wrong nested group;
- incorrect excluded region.

Numerical distractors may use nearby arithmetic results, but exactly one option must equal the independently solved value.

## 10. Difficulty

Difficulty is structure-based, not driven by obscure labels.

Current rules include:

- VEN-CP001 direct two-set relations: Easy;
- VEN-CP002 straightforward nested/disjoint structures: Easy;
- VEN-CP002 mixed overlap/crossed structures: Medium;
- VEN-CP003 uses authority/structure features;
- numerical checkpoints span Easy/Medium/Hard according to operation and number of derivation steps;
- VEN-CP011 single/all-three region reads: Easy; exclusion/union/exactly-one combinations: Medium.

No artificial Hard label is added merely to populate a difficulty tier.

## 11. Localization

Set logic is language-neutral; stems and explanations are localized.

Required guarantees:

- identical semantic state and keyed answer across EN/HI/PA;
- actual activity/category names instead of ordinal placeholders;
- natural exam-standard Hindi and Punjabi;
- simple question-specific explanations;
- no translation that changes inclusion, exclusion, overlap, or numerical meaning.

CP001, CP002, CP003 and CP004 are already marked signed-off for trilingual review in runtime metadata. CP005–CP011 remain review candidates where `localeParityPendingHumanReview` is still true and must not be silently promoted.

## 12. Review and release gates

Before final chapter closure:

- all registered QLs must remain wired to every live generator path;
- all topology/solver/property tests must pass;
- fixed pools must meet breadth minimums;
- review artifacts must match current generator output;
- source claims must stay within documented evidence;
- pending EN/HI/PA review flags for CP005–CP011 must be resolved by actual review;
- lifecycle must remain review-only until an explicit learner-release decision is made.

Current lifecycle:

- review-only: true
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false

## 13. Question Studio integration

VEN-001 is wired into normal Question Studio with checkpoint/QL/language/difficulty/seed selection and deterministic review generation.

Question Studio integration does **not** authorize learner publication. Canonical learner persistence and production release remain disabled until the chapter passes the remaining review gates.

## 14. Closure state

The old four-checkpoint provisional design is retired. The live architecture is the authority.

Wave 05 closes the stale-documentation gap, expands the thin direct-relation pools, and fixes the CP005 `none` explanation path. Final deep-audit closure is still blocked by the pending human localization review on CP005–CP011. The numerical review V2 artifacts were refreshed after the Wave 05 generator change.
