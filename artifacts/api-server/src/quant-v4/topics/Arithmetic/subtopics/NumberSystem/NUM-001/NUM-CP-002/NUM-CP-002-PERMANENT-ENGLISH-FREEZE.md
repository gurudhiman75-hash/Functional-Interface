# NUM-CP-002 — Permanent English Implementation Freeze

**Checkpoint:** Fractions, Decimals and Recurring Representations  
**Permanent QLs:** `NUM-QL-145..NUM-QL-165`  
**Permanent QL count:** 21  
**Retained discovery prototypes:** 30  
**Delegated prototypes:** P027, P028 → Algebra  
**Runtime package:** `NUM-001`  
**Language at this gate:** English (`en-IN`)  
**Question Studio exposure:** disabled

## Freeze decision

The approved 21-authority merge/split result is implemented as permanent English runtime identities `NUM-QL-145..NUM-QL-165`.

The permanent runtime preserves the proven discovery mathematics and independent verifiers while remodelling the learner-facing surface for competitive-exam use. Discovery difficulty labels are not inherited blindly.

## Editorial rules enforced

1. Difficulty is assigned by permanent authority reasoning burden rather than larger values or discovery-seed rotation.
2. Foundation conversion authorities do not receive cosmetic Hard labels.
3. Learner explanations use a compact `Concept → Solution → Answer` structure with one to three working lines.
4. Mathematical expressions use inline MathJax/LaTeX; raw slash fractions, Unicode radicals/superscripts, denominator-one rendering artefacts and raw long floating-point output are rejected by audit.
5. Learner-facing generator/meta language and technical jargon such as `In this question`, `admissible`, `topology`, `candidate-set`, `residue condition`, `universal guarantee` and `sharpness check` are rejected.
6. P013/P014 explain termination through the unwanted reduced-denominator prime factors instead of the phrase `non-2,5 part`.
7. P014 uses natural exam wording for the denominator-division inverse.
8. P017/P018 teach the cancellation/factor condition before showing the bounded valid denominator set or count.
9. P031 uses normal statement-combination phrasing.
10. P032 uses a standard multiline Data Sufficiency surface and keeps its separate sufficiency-class proof burden.

## Permanent difficulty policy

The checkpoint uses authority-level allowed bands rather than requiring every QL to reach every difficulty:

- foundational direct representation: Easy/Medium;
- recurring reconstruction, ordering, inverse termination and missing-component work: Medium/Hard where appropriate;
- bounded denominator count/set and Data Sufficiency: Hard floor;
- no authority is promoted to Hard solely through larger numeric values.

The exact per-QL bands are frozen in `permanent/runtime.ts` and exhaustively checked.

## Proof gates

The permanent runtime proof generates 21 QLs × 120 seeds = 2,520 questions and checks:

- deterministic replay;
- canonical/independent-verifier agreement;
- four distinct options with exactly one correct answer;
- misconception ownership on all distractors;
- all four correct-answer positions per QL;
- configured permanent difficulty-band reach;
- reachability of all 30 retained prototypes and exclusion of delegated P027/P028;
- permanent identity and solve-mode freeze;
- closed lifecycle gates.

The editorial audit separately scans 21 QLs × 60 seeds = 1,260 learner questions for wording, MathJax, rendering artefacts, explanation size, repeated-surface conflicts and cross-QL collisions. It also exports a human review pack covering all permanent QLs, retained prototypes, answer positions and configured difficulty bands.

## Lifecycle

This is an implementation freeze, not a delivery release.

Every CP002 permanent QL remains:

```text
active: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
reviewStatus: AWAITING_PRODUCT_OWNER_EDITORIAL_REVIEW
```

No CP002 Question Studio registration is created. Number System will be integrated into the existing Question Studio workflow once at whole-chapter completion.

## Next gate

After the generated English corpus is reviewed and remains acceptable, Hindi and Punjabi localisation may be implemented as semantic adapters over the same frozen mathematical states, option order, correct index and permanent identities. Multilingual implementation does not open any delivery gate.
