# ENG-001 — Exhaustive Closure Audit V1

Status: `REMEDIATION_COMPLETE__HUMAN_REAPPROVAL_PENDING__REVIEW_ONLY`

## Scope

This is the chapter-closing audit for ENG-001 after CP001–CP013. It goes beyond individual checkpoint validation and uses both large deterministic generation audits and a final learner-facing review pack.

The audit covers:

- all 13 implemented checkpoints;
- all 131 registered grammar rules;
- Easy / Medium / Hard generation;
- QL001 / QL002 / QL007 contracts;
- single-defensible-error quality and no-error validity;
- natural exam-style wording;
- explanation usefulness and corrected-sentence accuracy;
- answer-position predictability;
- learner-facing part segmentation;
- deterministic generation and rule/candidate/surface breadth;
- cumulative Question Studio integration;
- review-only lifecycle locks.

## Final exact-head evidence

Final audited content head before this record update: `5c2bffdf957a2bdc727dc02c23cd94416ab8a624`.

### 117-question master review

The deterministic master pack samples every `CP × difficulty × permanent QL` combination:

- 13 checkpoints;
- 117 questions;
- 131 registered rules in the chapter;
- 82 distinct rules represented in the review sample;
- QL001 / QL002 / QL007 at Easy / Medium / Hard;
- lifecycle remains review-only.

The master pack itself passed its structural audit and was regenerated after the final CP003 article-family remediation.

### 7,020-question exhaustive closure soak

`eng-001-closure-soak-v1.test.ts` passed on the exact audited head.

It generated `13 CPs × 3 difficulties × 3 QLs × 60 seeds = 7,020` questions and checked:

- exact package/lifecycle identity;
- all 131 registered rules exercised chapter-wide;
- complete rule exercise through both error-producing QLs across applicable difficulties;
- calibrated QL007 no-error breadth;
- candidate and learner-surface breadth;
- answer bounds and option uniqueness;
- QL contracts;
- corrected-sentence presence in explanations;
- no internal metadata leakage;
- no option-by-option analysis;
- explanation Part references matching the keyed answer;
- authored and normalized part-length guardrails;
- deterministic replay.

Result: **PASS**.

### 3,900-question answer-position audit

The chapter-level answer-position diagnostic passed on the exact audited head after the constrained Question Studio normalization layer was applied.

The earlier exploitable Part-B bias is no longer present, while the normalizer still preserves the authored grammatical mutation and rejects poor generated segmentations.

Result: **PASS**.

### Cumulative integration/build evidence

The exact-head final-audit workflow also passed:

- latest cumulative CP013 Question Studio regression;
- API server build;
- admin app typecheck.

CI hygiene and pull-request branch topology checks also pass.

## Closure blockers found and resolved

### CP004 — reflexive-pronoun ambiguity

The original reflexive family allowed ordinary object pronouns such as `reminded her`, `blamed her`, or `reminded him` to survive under an alternative referent.

Resolution: ambiguous reflexive/object-pronoun scenes were redesigned so the intended correction no longer depends on unstated coreference.

Status: **resolved**.

### CP007 — coordinator-choice ambiguity

The original coordinator items could make alternatives such as `so` versus `but/yet` depend on an intended discourse relation rather than a uniquely defensible error.

Resolution: coordinator contexts were strengthened/reworked so contrast/result logic is explicit and the learner-facing error is defensible.

Status: **resolved**.

### CP010 — modifier/relative-clause attachment ambiguity

The original relative-clause attachment item allowed a second grammatically possible antecedent.

Resolution: the attachment scenes now include explicit contradiction/antecedent guards; later soak-driven edits also tightened authored part lengths without changing the grammar targets.

Status: **resolved**.

### Hard calibration — CP005 / CP008 / CP009 / CP012 / CP013

Several Hard pools originally relied too heavily on longer sentences around locally obvious substitutions.

Resolution: affected Hard scenes now include nearby competing correct patterns, longer dependency/scope, or contrastive cues while keeping vocabulary simple. Authored answer-position spreads were also rebalanced where remediation clustered the keyed part.

Status: **resolved to review standard**. Some Hard samples remain locally accessible once the decisive rule is recognized, but they no longer rely on sentence length alone and are acceptable for final human review.

## Secondary findings resolved

- CP001 SVA item no longer introduces a secondary tense dispute.
- CP003 `much water` wording was naturalized.
- CP005 awkward guideline/personification wording was removed during Hard remediation.
- CP006 final-review sampling now prefers distinct rules across QLs where the eligible pool allows it.
- CP011 `unless + not` scenes now state the positive requirement explicitly, preventing the wrong form from surviving under an unintended reading.
- CP013 learner explanations no longer use internal/editorial wording such as `controlled exam surface`.
- Soak-discovered overlong authored parts in CP005, CP009, CP010, CP011, CP012 and CP013 were tightened at source rather than weakening the audit threshold.

## Final human-review finding — CP003 definite-article specificity

After the automated gates first turned green, the human 117-pack review found a remaining ambiguity in `GR-ART-004`: forms such as `an application submitted yesterday` or `a computer that had stopped responding` can still be grammatical under a different reference, even when the intended answer is `the`.

Resolution: all six `GR-ART-004` specificity scenes were remediated so the error surface omits the determiner on the explicitly identified singular count noun. The error is now genuinely grammatical (for example, `signed application submitted yesterday`), while the context still explains why the correction is specifically `the application`.

The 117 audit, 7,020 soak, cumulative regression/build/typecheck, and 3,900 answer-position audit were rerun after this change and all passed.

Status: **resolved**.

## Final manual review result

The regenerated 117-question master pack was reviewed across CP001–CP013 after the final semantic remediation.

Findings:

- sampled QL007 no-error questions are grammatical;
- sampled error items have a defensible keyed error;
- explanations remain simple, question-specific, and include the full corrected sentence;
- no option-by-option analysis is present;
- no Question Studio/runtime/candidate metadata leaks into learner-facing text;
- standardized instruction repetition is intentional and acceptable;
- Easy / Medium / Hard progression is acceptable for final re-approval;
- no remaining closure-level ambiguity comparable to the original CP003/CP004/CP007/CP010 blockers was found.

## Approval hashes and checkpoint workflow state

Learner-facing remediation intentionally invalidates historical frozen review artifacts. The approval boundary is therefore being preserved rather than bypassed.

On the exact audited head:

- CP003 generation/validation passes; its frozen review/freeze check fails because the reviewed artifact changed.
- CP009 generation/validation passes; its previously approved review artifact no longer matches.
- CP010 generation/validation passes; its previously approved SHA-256 no longer matches.
- CP011 generation/validation passes; its previously approved SHA-256 no longer matches.
- CP012 generation/validation passes; its previously approved SHA-256 no longer matches.
- CP013 generation/validation passes; its previously approved SHA-256 no longer matches.

These are **human re-approval gates**, not unresolved content defects. The old hashes must not be updated merely to make CI green.

## Closure decision

ENG-001 is now a **remediation-complete closure candidate**, but it is **not yet `CONTENT_CLOSED_V1`** because the changed learner-facing review artifacts require explicit project-owner approval.

Before final closure:

1. present the regenerated 117-question master pack for final owner review;
2. receive explicit approval for the remediated ENG-001 content;
3. intentionally refreeze/update the affected approved review artifacts/hashes;
4. rerun the affected checkpoint workflows so approval gates are green;
5. rerun/confirm the chapter-wide final audit and answer-position gates on the post-approval head;
6. merge only after explicit closure approval.

Question Bank/test/mock/public/automatic learner release remains locked throughout this process.

Current chapter state:

`CP001–CP013_IMPLEMENTED__REMEDIATION_COMPLETE__FINAL_HUMAN_REAPPROVAL_PENDING__REVIEW_ONLY__NOT_CONTENT_CLOSED`
