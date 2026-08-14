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

1. Difficulty is assigned from actual permanent reasoning burden, not seed rotation or larger values.
2. Foundation conversions remain Easy rather than receiving cosmetic Medium/Hard labels.
3. Recurring-decimal difficulty depends on actual cycle/repetend burden; short cycles are not labelled Hard.
4. Learner explanations use a compact `Concept → Solution → Answer` structure with one to three working lines.
5. Mathematical expressions use inline MathJax/LaTeX; raw slash fractions, Unicode radicals/superscripts, denominator-one rendering artefacts and raw long floating-point output are rejected by audit.
6. Learner-facing generator/meta language and technical jargon such as `In this question`, `admissible`, `topology`, `candidate-set`, `residue condition`, `universal guarantee` and `sharpness check` are rejected.
7. P013/P014 explain termination through the unwanted reduced-denominator prime factors instead of the phrase `non-2,5 part`; P014 uses natural exam wording.
8. P017/P018 teach the cancellation/factor condition before giving the bounded denominator count/set, and the complete set is not repeated unnecessarily.
9. P019/P030 explain exactly which forbidden denominator factor must be cancelled.
10. P031 gives a reason for each statement rather than only listing True/False verdicts.
11. P032 explains Data Sufficiency through the exact denominator factor that the statements must force the numerator to cancel.
12. P009 permanent generation filters the trivial state where both sides reduce to the same displayed fraction.

## Permanent difficulty policy

The checkpoint uses authority/state-level bands rather than requiring every QL to reach every difficulty:

- direct reduction and ordinary terminating conversions: Easy;
- ordinary comparison, termination structure and most inverse reconstruction: Medium;
- longer recurring cycles/repetends, four-value mixed ordering and multi-prime termination intervention: Hard only when the generated state genuinely creates that extra burden;
- bounded denominator count/set and Data Sufficiency: Hard floor;
- no authority is promoted to Hard solely through larger numeric values.

The exact per-QL/state policy is frozen in `permanent/runtime.ts` and exhaustively checked.

## Final proof gates

Final validated runtime head before this documentation pin: `499b1524e17e9107bc87638743ccd220728107b3`.

Workflow run `31785610456`: **PASS**.

The permanent runtime proof generates 21 QLs × 120 seeds = **2,520 questions** and checks:

- deterministic replay;
- canonical/independent-verifier agreement;
- four distinct options with exactly one correct answer;
- misconception ownership on all distractors;
- all four correct-answer positions per QL;
- configured reasoning-based difficulty-band reach;
- reachability of all 30 retained prototypes and exclusion of delegated P027/P028;
- permanent identity and solve-mode freeze;
- closed lifecycle gates.

The editorial audit separately scans 21 QLs × 60 seeds = **1,260 learner questions**. Final results:

```text
unique stems:                  271
unique full question surfaces:470
unique explanations:          269
ambiguous repeated surfaces:    0
cross-QL stem collisions:       0
max stem:                     288 chars / 41 words
max explanation:              350 chars
review questions:             120
retained prototype reach:      30 / 30
```

The 120-question human review pack covers all 21 permanent QLs, all retained prototypes, all answer positions and all configured difficulty bands. Finite QLs contribute at least four covered review questions rather than being forced to manufacture duplicate surfaces merely to hit an arbitrary quota.

Final evidence artifact:

```text
artifact: 9213385643
SHA-256: eec5a42c3aa69f118967acf4c35f7a1bc0a9bac34be83df8a18c31951a199939
```

Human spot review specifically confirmed the hardened surfaces for QL-151, QL-157, QL-159, QL-160, QL-161, QL-162, QL-164 and QL-165.

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

Hindi and Punjabi localisation may now be implemented as semantic adapters over the same frozen mathematical states, option order, correct index and permanent identities. Multilingual implementation does not open any delivery gate.
