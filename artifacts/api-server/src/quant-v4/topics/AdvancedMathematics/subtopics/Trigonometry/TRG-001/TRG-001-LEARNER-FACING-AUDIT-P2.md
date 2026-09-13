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

## Why this is presentation remediation, not a content rewrite

The mathematical source question, answer, options, difficulty, QL role, localization and structured explanation remain unchanged.

Only the default flattened explanation string is simplified. This avoids reopening 144 English QLs and 288 localized surfaces merely to remove repeated learner-facing labels that are useful internally but not required in every explanation.

## Stem-quality checkpoint

The inspected CP-001 active diversity surface uses compact forms such as direct right-triangle ratios and two-step side recovery. These are appropriately simple for Easy/Medium fundamentals; a wholesale attempt to make them more verbose would make them less exam-like, not more exam-like.

The earlier final editorial pass already corrected a synthetic orientation phrase in `QL-009`, replacing wording equivalent to 'theta faces the leg' with an explicit opposite-leg statement. This audit therefore does not reopen CP-001 merely for stylistic variation.

## Distractor checkpoint

The inspected fundamental ratio roles use misconception-linked alternatives such as reciprocal-function swaps, sine/cosine swaps and tangent/cotangent swaps. These are materially related to the question and are preferable to arbitrary numeric distractors.

No package-wide distractor rewrite is justified from the current evidence. Distractors should be changed only where a specific real-PYQ comparison or generated review sample exposes a weak option set.

## Difficulty checkpoint

The final editorial layer already recalibrates `QL-094`, `QL-099` and `QL-100` from Hard to Medium. The current audit found no basis to reverse that decision.

Difficulty should continue to be judged by the transformation chain required, not by expression length or notation density.

## Governance boundary

This checkpoint does **not** yet change `question-studio-runtime.ts` because that runtime is tied to a human-approved/frozen content lineage. The learner formatter is an audit candidate until the Question Studio presentation change is deliberately rebound/reviewed.

It also does not merge the separate PYQ-coverage remediation branch. The two audit tracks are intentionally isolated:

- `audit/quant-v4-trg-real-exam-remediation-p2` — structural/PYQ coverage;
- `audit/quant-v4-trg-learner-facing-p2` — presentation/editorial quality.

## Execution evidence

The added regression source has **not been executed in this chat environment**.

No claim is made for:

- TypeScript compile pass;
- runtime test pass;
- CI pass;
- refreshed human approval;
- Question Studio rebinding.

## Next learner-facing audit step

Continue with targeted high-value samples from CP-004, CP-005 and CP-006 and classify defects by:

- stem construction too direct or synthetic;
- distractor weakness;
- explanation missing a required transformation;
- unnecessary explanation clutter;
- incorrect difficulty calibration;
- seed variation that changes wording but not meaningful mathematics.

Do not rewrite already-good questions merely to create churn.
