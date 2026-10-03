# STC-001 — Post-Closure Deep Audit — 2026-10-03

Status: `POST_CLOSURE_DEEP_AUDIT_REMEDIATED__V2_2_REVIEW_ONLY`

## Scope

This authority supersedes the September 29 closure as the current-head audit authority for `STC-001` without changing the approved V2.2 semantic scope.

Permanent QLs remain unchanged:

- `STC-QL-001` — direct explicit entailment / safe paraphrase
- `STC-QL-002` — multi-clause conjunction/disjunction entailment
- `STC-QL-003` — conditional rule entailment; reject converse/inverse
- `STC-QL-004` — modal-strength entailment
- `STC-QL-005` — comparative/metric entailment
- `STC-QL-006` — temporal/change/trend entailment

No new QL was added. Matrix and Games/Tournament are outside this audit.

## Defects found

The September closure was materially correct on scope and saturation, but the post-closure audit found four implementation defects.

1. **Current Question Studio adapter gap** — V2.2 was available through the legacy Reasoning review registry but was not registered in the current standard `reasoning-v1` Question Studio adapter.
2. **Answer-authority coupling** — the V2.2 saturated generator read the authored template `answerClass` directly. That did not satisfy the chapter design rule that learner answer authority must be independently validated from the text-generation metadata.
3. **Learner-surface defects inside certified pools** — concrete EN/HI/PA combinations contained grammar or editorial defects, including lowercase notice continuation, duplicate survey wording, English subject-verb mismatch, Hindi/Punjabi gender placeholders, and variable-agreement/case defects in temporal templates.
4. **Regression-proof defect** — `chapter-freeze-v2-2-proof.test.ts` compared the non-existent `correctOptionIndex` field instead of `correctIndex`.

## Remediation

### Independent answer proof

`editorial-v2-2-independent-proof.ts` is now a separate 48-template semantic proof registry.

- The registry does not read `template.answerClass`.
- Generation asks the proof registry for the expected answer class.
- Authored template metadata is checked against the independent proof and generation fails closed on disagreement.
- Conclusion reversal is applied only after the independent canonical answer is established.
- Generated metadata records the independent proof authority and mechanism.

The original truth-model, modal, order and temporal solvers remain preserved for their structured authorities. The V2.2 natural-language saturation layer now has an independent template proof authority appropriate to its controlled editorial architecture rather than silently trusting generator metadata.

### Question Studio migration

`question-studio-integration.ts` registers `STC-001-V2-2-SATURATED-REVIEW` in the current standard `reasoning-v1` adapter with:

- all three checkpoints;
- all six permanent QLs;
- EN/HI/PA;
- Easy/Medium/Hard filtering;
- deterministic review batches;
- standard review-only lifecycle;
- Question Bank/test/mock/public/automatic publication locked.

The legacy V2.2/V2.1/V1 Reasoning review-registry snapshots remain available for audit compatibility.

### Learner-surface remediation

The V2.2 breadth model remains 8 templates × 256 variants = 2,048 semantic surfaces per QL.

Remediated defects include:

- notice continuation wording made sentence-safe and gender-neutral;
- `afternoon refreshments continues` removed;
- duplicated `surveyed ... surveyed` wording removed;
- Hindi/Punjabi `चुका/चुकी` / `ਚੁੱਕਾ/ਚੁੱਕੀ` placeholders removed;
- variable-gender trend wording rewritten through stable `level/count` constructions;
- `improved downward` / intransitive `reduced` English removed;
- Hindi/Punjabi month/cycle oblique forms corrected where used with postpositions;
- forecast wording rewritten to avoid variable gender/number agreement failures.

No semantic answer class or permanent QL contract was intentionally changed.

## Post-closure regression authority

`stc-001-post-closure-audit-20261003.test.ts` now verifies:

- all 48 V2.2 templates have independent proof coverage;
- deliberate answer-class drift fails closed;
- all 6 × 2,048 × 3 = **36,864** EN/HI/PA generated surfaces pass the known learner-surface regression gate;
- answer authority metadata is present on every generated instance;
- key numeric cross-product invariants cannot flip answer semantics;
- the current standard Reasoning Question Studio adapter exposes STC exactly once;
- review generation works through the standard adapter, including checkpoint and difficulty filtering;
- Question Bank/test/mock/public/automatic publication remain locked.

The V2.2 workflow is extended to run the new proof, integration and post-closure gate.

## Lifecycle after remediation

- Content/solver/proof scope: **closed for approved V2.2**
- Question Studio: **current standard adapter, generation-ready review-only**
- Question Bank writable: **no**
- Test eligible: **no**
- Mock eligible: **no**
- Public/student delivery: **no**
- Automatic publication: **no**
- Source-frequency weighting: downstream
- Learner-data difficulty calibration: downstream
- Learner release: separate explicit approval

## Final result

`STC_001_POST_CLOSURE_DEEP_AUDIT_20261003__SIX_QL_SCOPE_PRESERVED__INDEPENDENT_ANSWER_PROOF_ADDED__CURRENT_QUESTION_STUDIO_ADAPTER_REGISTERED__TRILINGUAL_SURFACES_REMEDIATED__REVIEW_ONLY`
