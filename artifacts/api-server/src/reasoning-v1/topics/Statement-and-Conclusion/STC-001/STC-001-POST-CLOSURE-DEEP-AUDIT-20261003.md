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
5. **Historical V1 certification path defect** — the V1 freeze correctly stored original Git blob hashes, but three lock paths pointed at live governance/design files later intentionally advanced to the V2.2 frozen lifecycle. This made the V1 certificate fail even though the original V1 bytes still existed in Git history.

## Remediation

### Independent answer proof

`editorial-v2-2-independent-proof.ts` is now a separate 48-template semantic proof registry.

- The registry does not read `template.answerClass` to decide the answer.
- Generation asks the proof registry for the expected answer class.
- Authored template metadata is checked against the independent proof and generation fails closed on disagreement.
- Every reviewed English statement/conclusion/archetype skeleton is signature-locked to the proof authority, so semantic-text drift fails closed even if `answerClass` is left unchanged.
- Numeric/order cross-product invariants are tested separately for variable families whose values could change entailment.
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

- notice continuation wording made sentence-safe and localized through fixed visitor-entry/service constructions;
- `afternoon refreshments continues` removed and the breakfast/meal family normalized to service nouns;
- duplicated `surveyed ... surveyed` wording removed and Hindi/Punjabi survey case structure normalized through group/respondent constructions;
- event/venue wording rewritten to avoid Hindi/Punjabi noun-gender variation;
- Hindi/Punjabi `चुका/चुकी` / `ਚੁੱਕਾ/ਚੁੱਕੀ` placeholders removed;
- variable-gender trend wording rewritten through stable `level/count/process` constructions;
- `improved downward` / intransitive `reduced` English removed;
- Hindi/Punjabi month/cycle oblique forms corrected where used with postpositions;
- forecast wording rewritten to avoid variable gender/number agreement failures.
- QL002 variable event triggers no longer hard-code “lighting work”, and battery comparison wording is valid across all duration substitutions;
- QL002 event-sequence Hindi/Punjabi wording now uses gender-neutral “preparation” constructions across result/list/order/report variants;
- QL003 conditional families no longer depend on candidate, machine, event, server/node/system, or late-submission noun gender;
- QL004 modal families were rewritten around possibility/change nouns so weather events, schedules, digital aggregates, disruption subjects, and bridge/tunnel variants remain grammatical across the full cross-product;
- QL005 queue/comparative/process wording no longer depends on branch/zone/unit or queue/line noun gender.

No semantic answer class or permanent QL contract was intentionally changed.

## Post-closure regression authority

`stc-001-post-closure-audit-20261003.test.ts` now verifies:

- all 48 V2.2 templates have independent proof coverage;
- deliberate answer-class drift fails closed;
- deliberate semantic statement/conclusion/archetype drift fails closed even when the answer metadata is unchanged;
- all 6 × 2,048 × 3 = **36,864** EN/HI/PA generated surfaces pass the known learner-surface regression gate;
- answer authority metadata is present on every generated instance;
- key numeric cross-product invariants cannot flip answer semantics;
- the current standard Reasoning Question Studio adapter exposes STC exactly once;
- review generation works through the standard adapter, including checkpoint and difficulty filtering;
- Question Bank/test/mock/public/automatic publication remain locked.

The V2.2 workflow is extended to run the new proof, integration and post-closure gate.

### V1 certification preservation

The original V1 certificate is preserved without re-certifying changed bytes.

Three historical blobs whose live paths legitimately evolved are now stored byte-for-byte under `v1-certified-snapshots/`:

- `STC-001-END-TO-END-DESIGN.md.snapshot` → original blob `fc3feecffcd3fe25565c9d09a3c314529dc34d7e`
- `chapter-manifest.ts.snapshot` → original blob `c17c1eda4a405088e6aa876f48959fe82ff00ed0`
- `chapter-proof.test.ts.snapshot` → original blob `70a6cb8e4ad87eca7dde96c4e8d040d25189d2c0`

The V1 freeze manifest now locks those immutable snapshots. All other V1-certified content remains locked at its original live path. Static verification after remediation reports **36/36 V1 content locks matching**. This keeps the August V1 certification historically truthful while allowing the live chapter design/manifest/proof to represent the approved V2.2 lifecycle.

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

`STC_001_POST_CLOSURE_DEEP_AUDIT_20261003__SIX_QL_SCOPE_PRESERVED__INDEPENDENT_ANSWER_PROOF_ADDED__48_SEMANTIC_SKELETONS_LOCKED__V1_CERTIFICATION_SNAPSHOTS_PRESERVED__CURRENT_QUESTION_STUDIO_ADAPTER_REGISTERED__TRILINGUAL_CROSS_PRODUCTS_REMEDIATED__REVIEW_ONLY`
