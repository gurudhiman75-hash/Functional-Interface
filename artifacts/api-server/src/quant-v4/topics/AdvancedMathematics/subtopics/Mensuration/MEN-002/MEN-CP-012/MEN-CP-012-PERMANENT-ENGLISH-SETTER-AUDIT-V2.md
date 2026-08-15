# MEN-CP-012 — Permanent English Setter Audit & Remediation V2

Authority: `MEN-CP012-PERMANENT-EDITORIAL-V2`

## Why V1 was not frozen

The V1 permanent runtime passed mathematical/source/lifecycle proof, but the 59-question human artifact exposed learner-facing issues that machine validity alone did not detect.

The V1 candidate therefore remains historical evidence and is **not** the freeze authority.

## Setter findings

### 1. Synthetic count distractors

Several inherited Wave-01 count questions still produced adjacent-number distractors such as:

```text
27, 28, 54, 81
1000, 1001, 2000, 3000
```

Those choices are mathematically distinct but do not resemble genuine mensuration misconceptions.

**V2 remediation:** count distractors are rebuilt from plausible volume-ratio mistakes such as `1/2`, `1/3`, `1/4`, `2×`, `3×`, or `4×` when integral.

### 2. Generic Wave-02 / Wave-03 explanation filler

Wave-02-derived questions repeated lines such as:

```text
Write total usable source volume equal to total target volume.
Convert linear units before applying powers...
```

and Wave-03-derived questions could retain generic unit-check prose even when no conversion was involved.

**V2 remediation:** the source's actual numeric work is preserved, but the surrounding explanation is rebuilt as:

1. permanent-family conservation rule;
2. source-state numeric substitution/work;
3. family-specific interpretation of the recovered count/dimension/percentage;
4. explicit final check.

Generic Wave-02 trap text is removed in favor of the permanent family's misconception model.

### 3. Percentage typography

Loss/yield answers could display as `10 %` rather than natural competitive-exam notation `10%`.

**V2 remediation:** answer, option and explanation percentage displays are normalized.

### 4. Permanent answer-semantic metadata

The identity map itself was correct, but two metadata labels were too narrow:

```text
QL-157 LOSS_AWARE_RECAST_GIVEN
  can ask a target count OR an inverse length/dimension

QL-159 HOLLOW_SOURCE_MATERIAL_RECAST
  can ask a target count OR target length/height
```

**V2 remediation:** effective answer semantic for both becomes `COUNT_OR_LENGTH`. Permanent QL, template and solve-mode identities remain unchanged.

### 5. Low entropy in QL-162

The Wave-03 source for `RECAST_THEN_SECONDARY_MEASURE` used only scaled copies of the classic:

```text
3³ + 4³ + 5³ = 6³
```

So stems changed numerically but the surface-area decrease stayed the same.

**V2 remediation:** the permanent presentation cycles through four genuine unequal-sphere identities:

```text
3³ + 4³ + 5³   = 6³
1³ + 6³ + 8³   = 9³
3³ + 10³ + 18³ = 19³
7³ + 14³ + 17³ = 20³
```

with scaled states and explicit two-decimal percentage requests. This preserves the same permanent reasoning identity while providing multiple genuine percentage outcomes.

## Identity policy

No permanent QL is added or removed.

```text
MEN-002-QL-150 .. MEN-002-QL-162
```

remain the authoritative 13 identities.

## V2 machine proof

The setter-hardened runtime must re-prove:

```text
13 QLs × 128 forced-source states = 1,664 questions
```

including:

- 42/42 source coverage;
- A/B/C/D per QL;
- ratio-based count distractor contract;
- no spaced percentage signs;
- no generic Wave-02/03 filler steps;
- no generic Wave-02 source traps;
- at least 8 distinct QL-162 stems and 4 distinct QL-162 percentage answers;
- metadata correction without identity drift;
- product lifecycle still locked.

## V2 human review

The source-complete review remains 59 questions:

- all 42 sources exposed;
- all 13 QLs expose A/B/C/D;
- global answer-position spread at most one;
- distinct stems;
- QL-162 must show four distinct percentage answers;
- no English freeze or product activation.

## Freeze boundary

Even after V2 becomes green, English freeze should occur only after inspecting the exported V2 artifact itself.

Required state remains:

```text
englishImplementationFrozen: false
active: false
questionStudioDiscoverable: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
```
