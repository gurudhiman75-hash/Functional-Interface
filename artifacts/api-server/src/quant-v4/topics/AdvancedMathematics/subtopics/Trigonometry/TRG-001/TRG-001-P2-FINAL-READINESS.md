# TRG-001 P2 Final Readiness

Status: **MULTILINGUAL AMENDMENT CANDIDATE READY FOR EXECUTION/HUMAN REVIEW — NOT REFROZEN — NOT ACTIVATED**

Branch: `audit/quant-v4-trg-final-candidate-p2-current`

## Candidate scope

The P2 candidate consolidates only evidence-backed TRG-001 corrections:

1. `TRG-001-QL-024` — direct acute-interval sine/cosine ordering around 45°, anchored to SSC CGL 2024-09-10 Shift 1.
2. `TRG-001-QL-126` — retains its legacy mixed-identity role and adds the SSC quadratic-trig-relation to higher-power sibling anchored to SSC CGL 2023-07-26 Shift 1.
3. `TRG-001-QL-143` — cubic trigonometric factorization family anchored to SSC CGL 2024-09-09 Shift 2, without increasing the 144-QL envelope.
4. `TRG-001-QL-121` — learner-facing difficulty recalibrated from Hard to Medium because the active standard-value construction is direct substitution plus arithmetic.
5. Learner explanation presentation — default flattened explanation shows the governing rule and actual solution steps; shortcut/trap metadata remains available structurally for QA but is not forced into the learner-facing text.
6. Native Hindi/Punjabi remediation — the three new PYQ constructions now have native stems and stepwise explanations. Unchanged QLs continue through the existing V5 pedagogic localization stack rather than a duplicated translator.
7. Uploaded-book/material challenge audit — external books and solved-paper PDFs are now a separate non-authoritative coverage layer that can block refreeze when an exam-relevant missing archetype remains unresolved.

## Branch hygiene

P2 changes remain isolated under TRG-001 audit/remediation files; no Question Studio production binding, test-builder eligibility, public-release path or whole-section frequency weighting is intentionally changed.

## Localization boundary

The consolidated audit runtime declares:

- `contentLanguages: ["en", "hi", "pa"]`;
- `localizationStatus: "NATIVE_HI_PA_REMEDIATION_CANDIDATE"`;
- `humanLanguageReviewRequired: true`.

For the P2 PYQ constructions:

- `QL-024` has native Hindi/Punjabi acute-angle comparison wording and explanation;
- the new `QL-126` higher-power sibling has native Hindi/Punjabi wording and explanation;
- `QL-143` has native Hindi/Punjabi cubic-factorization wording and explanation.

The legacy `QL-126` branch and other unchanged QLs delegate to the existing TRG V5 pedagogic localization authority. This keeps the historical multilingual system intact and limits the new overlay to genuinely new mathematical constructions.

This is an **editorial/localization candidate**, not a multilingual freeze. Native Hindi/Punjabi output still requires human language review before approval.

## Uploaded material / external challenge gate

Authority:

- `TRG-001-EXTERNAL-MATERIAL-COVERAGE-AUDIT-P2.md`
- `external-material-coverage-audit-p2.ts`

Uploaded books and solved papers are challenge evidence only. They are **not** a source of wording/options/explanations and do not become production content authority.

Initial P2 corpus includes:

- Disha SSC Mathematics Guide — Trigonometry and Its Applications;
- SSC CGL solved-paper PDFs for 2022, 2023 and 2024;
- Arun Sharma Quantitative Aptitude as a boundary/stretch source only.

Initial 14-observation material profile:

- `DIRECTLY_COVERED`: 8
- `COVERED_WITH_VARIATION`: 2
- `MISSING_EXAM_RELEVANT`: 0
- `NEEDS_RUNTIME_PROOF`: 1
- `TRG_002_APPLICATION`: 1
- `OUT_OF_SCOPE_NON_MCQ_OR_OFF_PROFILE`: 2

Current unresolved material checkpoint:

- Disha-style `tan x + cot x` relation leading to a derived `sec²/cosec²` expression requires explicit runtime proof before refreeze.
- Dense complementary-angle square expressions and broader high-even-power identities remain coverage-with-variation regression challenges and should receive generated parity samples before final approval.

Refreeze is blocked if any sampled SSC-relevant observation remains `MISSING_EXAM_RELEVANT`. `COVERED_WITH_VARIATION` observations require either a demonstrated runtime sample or an explicit bounded-gap acceptance. Heights & Distances material must remain owned by TRG-002. Proof-style textbook exercises and CAT-only stretch forms are excluded from the SSC mock completeness denominator unless independent SSC/Punjab/Banking recurrence is demonstrated.

## Activation boundary

The P2 candidate remains audit-only:

- Question Studio rebind: **NO**
- Question Studio discoverability: **OFF**
- test eligibility: **INELIGIBLE**
- question-bank writing: **NOT AUTHORIZED**
- public publication: **NOT AUTHORIZED**
- production frequency promotion: **NOT AUTHORIZED**

The previous approved/frozen TRG-001 runtime remains the active lineage until an explicit new review/freeze/rebind decision is made.

## Regression source coverage

The consolidated P2 regression source checks:

- English/Hindi/Punjabi availability;
- native-script presence for Hindi and Punjabi;
- semantic answer and correct-index parity with English for QL-024, the new QL-126 sibling and QL-143;
- reachability of both QL-126 legacy and PYQ sibling branches;
- QL-121 Medium recalibration in all three languages;
- simplified learner explanations;
- discoverability/publication/test locks in all three languages.

The external-material audit additionally requires runtime parity evidence for unresolved/variation observations before freeze approval.

These are committed test/audit sources only. They are not execution evidence until actually run.

## Execution evidence

No TypeScript/runtime suite or GitHub Actions workflow is claimed as executed for this candidate in this audit session unless a later checkpoint records an actual run.

Therefore this document does **not** claim:

- TypeScript compile pass;
- runtime regression pass;
- external-material runtime parity completion;
- CI pass;
- human language approval;
- English refreeze;
- multilingual refreeze;
- Question Studio activation.

## Readiness decision

### English

**READY FOR EXECUTION + HUMAN REVIEW AS AN AMENDMENT CANDIDATE, BUT NOT YET REFREEZE-READY UNTIL THE EXTERNAL-MATERIAL RUNTIME-PROOF CHECKPOINT IS CLOSED.**

### Hindi/Punjabi

**NATIVE REMEDIATION AUTHORED — READY FOR EXECUTION + HUMAN LANGUAGE REVIEW AS AN AMENDMENT CANDIDATE.**

The earlier localization implementation blocker is removed, but human review, execution evidence and the uploaded-material regression checkpoint remain mandatory before refreeze.

## Next required sequence

1. Generate runtime parity samples for the remaining uploaded-material challenge forms:
   - `tan+cot` → derived sec/cosec expression;
   - dense complementary-angle square expression;
   - high even-power trig identity.
2. Classify each parity sample as direct coverage, bounded variation or genuine missing family.
3. Execute targeted P2 regression/TypeScript checks.
4. Review English/Hindi/Punjabi generated samples together for exam-natural wording and semantic parity.
5. Correct any localization/editorial defects found in that review.
6. Re-run relevant TRG regression/authority/external-material gates.
7. Obtain explicit human amendment approval.
8. Create a new freeze artifact bound to the approved bytes.
9. Only then deliberately rebind Question Studio.

Do not inherit the previous freeze automatically for these changed surfaces.
