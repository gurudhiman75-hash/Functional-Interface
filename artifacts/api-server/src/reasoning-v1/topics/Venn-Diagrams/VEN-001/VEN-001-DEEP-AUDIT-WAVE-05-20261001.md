# VEN-001 — Deep Audit Wave 05: Breadth, Explanations and Closure State

Date: 2026-10-01

Status: `BREADTH_HARDENED__CP005_NONE_PATH_FIXED__ARCHITECTURE_SYNCED__LOCALIZATION_SIGNOFF_PENDING`

## Scope

Wave 05 audits the live chapter for:

- fixed-pool breadth;
- topology distribution;
- numerical scenario/query breadth;
- geometric-shape breadth;
- learner-facing explanation quality;
- stale architecture documentation;
- source claims versus actual evidence;
- remaining closure blockers.

## Findings and changes

### 1. VEN-CP001 fixed pool was thin

Before Wave 05:

- 12 total scenarios;
- containment: 5;
- disjoint: 2;
- partial overlap: 5.

After Wave 05:

- 20 total scenarios;
- containment: 8;
- disjoint: 5;
- partial overlap: 7.

The new items broaden geometry, number classification, device, animal, calendar, reading and workplace-use contexts.

Source caveat: the supplemental source census still does not independently establish standalone two-class relation→diagram as a recurring previous-paper operation. CP001 remains a structural/basic-practice layer and must not be described as separately source-proven exam frequency.

### 2. VEN-CP002 topology breadth was complete but shallow

Before Wave 05, all 11 supported three-set topologies were present, but several topology families had only one scenario.

After Wave 05:

- 27 total scenarios;
- all 11 supported topology families remain represented;
- every topology has at least two fixed scenarios.

Current distribution:

- THREE_NESTED: 3
- THREE_TWO_DISJOINT_SUBSETS: 4
- THREE_TWO_OVERLAP_ONE_SEPARATE: 2
- THREE_PAIRWISE_OVERLAP_WITH_TRIPLE: 3
- THREE_PAIRWISE_OVERLAP_WITHOUT_TRIPLE: 2
- THREE_PARTIAL_OVERLAP_INSIDE_SUPERSET: 3
- THREE_TWO_DISJOINT_OVERLAP_THIRD: 2
- THREE_ALL_DISJOINT: 2
- THREE_NESTED_PAIR_CROSSED_BY_THIRD: 2
- THREE_NESTED_PAIR_OUTER_ONLY_OVERLAP: 2
- THREE_ONE_NESTED_PAIR_ONE_SEPARATE: 2

Tests now enforce the minimum so future edits cannot silently collapse a topology back to a single example.

### 3. VEN-CP003 authority breadth is healthy

Live CP003 authority library:

- 34 signed-off trilingual category authorities.

Observed domains include animal classification, geometry, number classification, general classification, astronomy, food and language.

Previous-paper reproductions establish source-pattern evidence; curated canonical authorities broaden stable scenario coverage. These two evidence types remain explicitly separated.

### 4. VEN-CP004 region breadth is complete for the current contract

- 21 distinct fixed region candidates.
- Tests require coverage across numbered region targets.
- Requests above the distinct fixed pool are rejected rather than duplicated.

### 5. Numerical breadth is much larger than the review sample alone suggests

VEN-CP005–CP010 use:

- 20 scenario contexts;
- deterministic seeded numeric variation;
- 7 two-set query forms;
- 17 three-set query forms;
- percentage/ratio, unknown solving, shared caselets and overlap bounds.

The numerical property suite generates large multilingual batches and independently reconstructs membership from the exclusive-region state.

### 6. VEN-CP005 explanation path bug fixed

The two-set “none” query key is `none`, but the dedicated explanation branch checked `neither`. The intended explanation path was therefore unreachable.

Wave 05 changes the condition to `q === "none"` and adds a regression assertion requiring the dedicated two-set derivation.

English region labels used inside explanations are also normalized to sentence/formula case:

- `Only ...`
- `None of the activities`
- `All three activities`

This removes awkward fragments such as `only literacy drives = ...`.

### 7. Direct-relation explanations are more category-aware

Remaining letter-only explanation wording was removed from mixed-topology cases where the explanation used generic `A/B/C` instead of the actual categories.

Examples now name the real groups, including:

- French speakers / German speakers / people who speak neither;
- multiples of 6 / multiples of 3 / multiples of 4;
- multiples of 10 / multiples of 5 / odd numbers.

### 8. VEN-CP011 breadth remains strong

Live geometric-region surface:

- 20 scenario contexts;
- 9 layout families;
- 9 geometric primitive types;
- 10 query keys.

Supported primitives include circle, ellipse, rectangle, square, triangle, right triangle, diamond, trapezoid and pentagon.

Earlier follow-up work already removed ordinal learner wording and made CP011 explanations activity-aware.

### 9. Architecture document was stale

`VEN-001-END-TO-END-DESIGN.md` still described only CP001–CP004 and claimed permanent QLs had not been assigned.

Wave 05 replaces that provisional state with the live architecture:

- 11 live checkpoints;
- 10 permanent QLs;
- current breadth metrics;
- current difficulty model;
- current lifecycle;
- explicit remaining review blockers.

## Regression gates added or strengthened

Wave 05 enforces:

- CP001 count = 20;
- each CP001 topology family has at least five scenarios;
- CP002 count = 27;
- every CP002 topology has at least two scenarios;
- CP005 `none` uses the dedicated derivation;
- the identified lower-case English region-fragment regression does not return in CP005 `none`.

## Remaining blockers before final deep-audit closure

1. **Human localization review is still pending for CP005–CP011.**  
   Runtime metadata correctly keeps `localeParityPendingHumanReview: true` on numerical and geometric-region paths. This audit does not falsely clear those flags.

2. **Generated numerical review artifacts must be refreshed after the Wave 05 explanation change.**  
   The saved review snapshot must match current generator output before final closure.

3. **CP001 source claims must remain limited.**  
   The current evidence supports the structural practice layer, not a claim that standalone two-class relation→diagram is independently source-proven recurring exam frequency.

## Lifecycle

No release authority changes in Wave 05.

- review-only: true
- Question Bank writable: false
- test eligible: false
- mock-test eligible: false
- publicly publishable: false
- automatic student publication: false
