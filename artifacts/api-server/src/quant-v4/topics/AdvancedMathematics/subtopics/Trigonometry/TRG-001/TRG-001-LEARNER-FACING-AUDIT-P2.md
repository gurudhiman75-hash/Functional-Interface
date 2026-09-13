# TRG-001 Learner-Facing Audit P2

Status: **AUDIT CANDIDATE — NOT REBOUND TO QUESTION STUDIO — EXECUTION EVIDENCE PENDING**

## Scope

This checkpoint audits what a Question Studio reviewer or learner actually sees, rather than only checking QL counts, authority-family coverage or mathematical verification.

The current approved TRG-001 source remains the post-Final5 frozen lineage. This audit does not invalidate that freeze or silently mutate approved content.

## Finding 1 — explanation clutter at the Question Studio presentation layer

The current `question-studio-runtime.ts` formatter renders all of the following whenever present:

1. key/core rule;
2. solution steps;
3. shortcut;
4. common trap(s).

That presentation is mechanically complete but unnecessarily busy for routine Quant explanations. Examtree's Quant V4 editorial rule is that explanations should be simple and coherent, with the necessary calculation/identity steps shown directly. Shortcut/trap material should not be forced into every learner-facing explanation.

### Remediation candidate

Added:

- `learner-explanation-p2.ts`
- `learner-explanation-p2.test.ts`

The candidate learner formatter renders only:

- the governing rule;
- the actual solution steps.

It deliberately retains `shortcut` and `traps` on the structured `packageExplanation` object for QA/editorial inspection. No source explanation data is deleted.

The same default presentation rule is defined for English, Hindi and Punjabi.

## Finding 2 — CP-006 QL-121 is over-labelled as Hard

`TRG-001-QL-121` is currently labelled Hard, but an active source form is:

`sin²30° + tan45°·cos60°`

The source explanation itself evaluates `sin²30°=1/4` and `tan45°·cos60°=1/2`, then adds the two values. This is direct standard-value substitution plus arithmetic.

The TRG authority defines Medium as two linked transformations/evaluation work and Hard as requiring a non-obvious identity choice, algebraic reconstruction, reduction plus evaluation, or multiple exact transformations. On that authority, QL-121 fits Medium more closely than Hard.

### Remediation candidate

Added:

- `learner-facing-quality-p2.ts`
- `learner-facing-quality-p2.test.ts`

The audit overlay changes only the learner-facing difficulty of `QL-121` from Hard to Medium. It does not alter:

- stem;
- options;
- correct index;
- answer;
- exact answer;
- structured explanation;
- QL/CP identity.

`QL-122`, `QL-136` and `QL-142` are explicit control roles and retain their existing difficulty. This is therefore a targeted calibration, not a package-wide downgrade.

The same overlay uses the clean learner explanation formatter from Finding 1 and keeps all activation/publication boundaries closed.

## Why these are audit remediations, not silent content changes

The mathematical source question and approved/frozen Question Studio lineage remain untouched. The candidate layer exists only to make the learner-facing policy and difficulty correction explicit and testable before any later authority amendment or rebinding.

Shortcut/trap data is retained for internal QA. QL-121's mathematical content is unchanged; only its audit difficulty label is recalibrated.

## Stem-quality checkpoint

The inspected CP-001 active diversity surface uses compact forms such as direct right-triangle ratios and two-step side recovery. These are appropriately simple for Easy/Medium fundamentals; a wholesale attempt to make them more verbose would make them less exam-like, not more exam-like.

The earlier final editorial pass already corrected a synthetic orientation phrase in `QL-009`, replacing wording equivalent to 'theta faces the leg' with an explicit opposite-leg statement. This audit therefore does not reopen CP-001 merely for stylistic variation.

Within CP-006, direct exact-evaluation stems are acceptable when the difficulty reflects their actual transformation depth. The problem found in QL-121 is therefore difficulty calibration, not the concise stem itself.

## Distractor checkpoint

The inspected fundamental ratio roles use misconception-linked alternatives such as reciprocal-function swaps, sine/cosine swaps and tangent/cotangent swaps. These are materially related to the question and are preferable to arbitrary numeric distractors.

No package-wide distractor rewrite is justified from the current evidence. Distractors should be changed only where a specific real-PYQ comparison or generated review sample exposes a weak option set.

## Difficulty checkpoint

The final editorial layer already recalibrates `QL-094`, `QL-099` and `QL-100` from Hard to Medium. The audit-remediated runtime also already treats `QL-136` and `QL-137` as Medium rather than preserving older Hard registry labels.

The new learner-facing candidate adds `QL-121` to the concrete over-labelled set.

Difficulty should continue to be judged by the transformation chain required, not by expression length, notation density, or simply being located in CP-006.

## Governance boundary

This checkpoint does **not** yet change `question-studio-runtime.ts` because that runtime is tied to a human-approved/frozen content lineage. The learner formatter and QL-121 recalibration remain audit candidates until a deliberate review/rebind step.

It also does not merge the separate PYQ-coverage remediation branch. The two audit tracks are intentionally isolated:

- `audit/quant-v4-trg-real-exam-remediation-p2` — structural/PYQ coverage;
- `audit/quant-v4-trg-learner-facing-p2` — presentation/editorial quality.

## Execution evidence

The added regression sources have **not been executed in this chat environment**.

No claim is made for:

- TypeScript compile pass;
- runtime test pass;
- CI pass;
- refreshed human approval;
- Question Studio rebinding.

## Next learner-facing audit step

Continue targeted CP-004/005/006 inspection for:

- stem construction that is technically valid but unlike SSC wording;
- distractors that are mathematically unrelated or too easy to reject;
- explanations that skip a necessary transformation;
- Hard labels driven mainly by notation rather than reasoning depth;
- seed variation that changes wording but not meaningful mathematics.

Do not rewrite already-good questions merely to create churn.
