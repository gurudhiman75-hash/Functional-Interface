# MAL-CP-003 Wave 14 — Editorial Remediation V2

Status: **editorial remediation implemented; permanent mathematical identities retained; English product surfaces reauthorised only after the V2 audit passes**.

## Release-status history

The Wave 13 mathematical release was not discarded. Its student-facing approval was placed behind the following remediation status:

```text
CONDITIONAL_PASS_MAL_CP003_EDITORIAL_REMEDIATION_REQUIRED
```

After the remediation corpus and Question Studio gates pass, the superseding release is:

```text
release: MAL-CP003-EN-v2
runtime: MAL-CP003-EN-PERMANENT-RUNTIME-V2
status: FROZEN
editorial status: APPROVED_AFTER_EDITORIAL_REMEDIATION
```

The QL range remains `MAL-QL-029..MAL-QL-037`. No mathematical route or permanent identity is renumbered.

## Student-facing changes

### Natural stems

Wave 14 removes artificial openers such as:

- “In a competitive-exam mixture problem…”
- “Consider this repeated remove-and-refill process…”
- “A storekeeper records this repeated operation…”
- “A technician performs the same replacement repeatedly…”

Questions now begin directly with the vessel, liquids and operation. The remediation layer also:

- replaces internal expressions such as “homogeneous sample” and “exact operation root”;
- uses remove, draw out, replace, refill, remain and contain;
- names every initial liquid when the vessel is not initially pure;
- corrects articles, operation singular/plural and root wording;
- fixes unequal-stage list punctuation.

### Numerical quality

The generator rejects candidates containing unnecessarily difficult mixed-number denominators. It prefers:

1. whole-number answers;
2. simple fractions;
3. manageable mixed numbers;
4. reduced ratios;
5. operation counts.

Candidate regeneration occurs before permanent packaging. Reasoning difficulty is retained; ugly arithmetic is not used as a substitute for difficulty.

### Misconception-based distractors

Every option now carries a defined misconception authority. Approved examples include:

```text
correct
linear_subtraction_error
one_stage_short
one_stage_extra
ratio_reversal
removed_fraction_error
ignored_mixture_change
stage_skipped
component_order_swapped
initial_state_reported
stops_before_strict_crossing
```

Generic `ARITHMETIC_SLIP`, fallback and arbitrary ±1 distractors are rejected. Options are canonicalised before release so equivalent ratios and equivalent numeric forms cannot coexist.

### Explanation structure

The student-facing explanation uses only the sections that add value:

```text
Concept
Calculation
Check
Answer
Fast Method      (only when genuinely useful)
Common Mistake
```

The old “10-Second Exam Shortcut”, duplicate quick-check/final-answer wording and unsupported stage-strip references are removed. Explanations retain the actual question values and contain three to five calculation steps.

### Three-component questions

`MAL-QL-034` now uses a stage table rather than indicator-function notation. Its generated outputs rotate among:

- final three-liquid quantities;
- one final component quantity;
- a requested two-component ratio;
- total replacement-liquid quantity;
- difference between two final components.

## QL-specific remediation

| QL | Editorial V2 change |
|---|---|
| `MAL-QL-029` | Clean final values, direct wording and one-stage/linear/complement distractors |
| `MAL-QL-030` | Both initial liquids identified; clean reverse values and reverse-direction distractors |
| `MAL-QL-031` | Square/cube/fourth-root wording and removal-specific misconceptions |
| `MAL-QL-032` | Complete initial composition and clean exact-count values |
| `MAL-QL-033` | Natural successive-removal punctuation and skip/average/reuse-stage distractors |
| `MAL-QL-034` | Student-friendly stage table and five requested-output forms |
| `MAL-QL-035` | Strict requested ratio order and mandatory ratio-reversal distractor |
| `MAL-QL-036` | Explicit ratio-to-fraction conversion and natural root wording |
| `MAL-QL-037` | Singular/plural correction and mandatory previous-operation/final-operation proof |

## Executable gates

The Wave 14 audit generates:

```text
9 QLs × 200 seeds = 1,800 permanent English questions
10 review questions per QL = 90 review questions
9 explicit Question Studio QL routes
100-question mixed diversity set
```

Every question must pass:

1. mathematical and deterministic release validation;
2. physical and option consistency inherited from the source runtime;
3. natural-language and grammar checks;
4. numerical-quality checks;
5. misconception-authority and equivalent-option checks;
6. number-specific explanation checks;
7. QL-specific checks, including QL-034 tables and QL-037 strict-threshold proof;
8. corpus diversity caps for opening patterns, retained fractions, distractor patterns and exact mathematical skeletons.

Hindi and Punjabi remain outside this release.
