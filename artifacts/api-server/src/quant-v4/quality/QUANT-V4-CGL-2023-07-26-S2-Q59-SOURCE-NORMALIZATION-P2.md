# Quant V4 — CGL 2023-07-26 Shift 2 Q59 Source Normalization (P2)

Authority: `QUANT-V4-CGL-2023-07-26-S2-Q59-SOURCE-NORMALIZATION-P2`

## Why this record is necessary

The Wave-5 observation correctly assigns this question to `TRG-001`, but its solution note does not reliably preserve the exact question surface.

Exact-surface auditing requires stronger evidence than frequency counting, so the conflicting secondary transcriptions are recorded instead of silently choosing one.

## Evidence compared

### Existing corpus source — Cracku

The current Cracku page renders the question with a right triangle `ABC`, `∠B=90°`, a tangent value, and a target rendered as:

`sin A cos A + cos A sin C`.

The tangent value shown by that page is also inconsistent with the two companion mirrors below.

That rendered expression does not align cleanly with the listed answer set under the stated tangent value and is therefore not reliable enough to define the exact-surface archetype.

Source:

`https://cracku.in/59-triangle-abc-is-a-right-triangle-if-angle-b-90circ-x-ssc-cgl-tier-1-26th-july-2023-shift-2`

### Companion mirror — Testbook

Testbook identifies the item as SSC CGL 2023 Tier-I Official Paper, 26 Jul 2023 Shift 2 and renders:

- `∠B = 90°`;
- `tan A = 1/√2`;
- target `sin A cos C + cos A sin C`;
- answer `1`.

Its solution uses:

`A + C = 90°`

and

`sin A cos C + cos A sin C = sin(A+C) = sin90° = 1`.

Source:

`https://testbook.com/question-answer/bn/abc-is-a-right-triangle-ifb-9--64cba3cb6446df1ffadb451a`

### Companion mirror — ExamSIDE

ExamSIDE independently renders the same structural form:

- right triangle `ABC`;
- `∠B = 90°`;
- `tan A = 1/√2`;
- target `sin A cos C + cos A sin C`;
- answer option `1`.

Source:

`https://questions.examside.com/past-years/year-wise/ssc/ssc-cgl-tier-i/ssc-cgl-tier-i-26th-july-2023-shift-2/tlm0bggwv9`

## Normalized audit form

For exact-surface coverage analysis, use:

**Given:** `ABC` is right-angled at `B`.

**Target:** `sin A cos C + cos A sin C`.

**Required reasoning:**

1. `A+C=90°` because `B=90°`;
2. recognize the sine angle-addition identity;
3. `sin A cos C + cos A sin C = sin(A+C)`;
4. evaluate `sin90°=1`.

The tangent datum is non-essential to the shortest solution and should not define the archetype.

## Coverage implication

The old matrix called this `COVERED` by combining CP-003 complementary relations with CP-001 ratio recovery.

That rationale is incorrect for the normalized surface:

- ratio recovery is not required;
- the essential composition is a right-triangle complementary-angle fact plus a sine angle-sum expression;
- no single active permanent role was located that generates this exact triangle-context composition.

Revised status: **`COVERED_CORE`**.

TRG-001 contains the mathematical ingredients, but cross-QL composability is not itself Question Studio coverage.

## Evidence-governance rule

The original Wave-5 observation should remain historically traceable until a deliberate evidence-file amendment is made.

This normalization record supersedes its Q59 solution note for **exact-surface audit purposes only**. It does not change:

- package frequency count;
- paper count;
- package ownership (`TRG-001`);
- production-frequency authorization.

## Gate state

Audit evidence correction only. No runtime, Question Studio, production or frequency activation is authorized.