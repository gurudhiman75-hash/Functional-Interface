# Quant V4 — TRG Live Question Studio Quality Audit, Checkpoint 3 (P2)

Authority: `QUANT-V4-TRG-LIVE-QUESTION-STUDIO-QUALITY-AUDIT-CHECKPOINT3-P2`

## Purpose

This checkpoint continues the TRG-001 external-realism audit after the runtime-role audit. It inspects the **currently active internal Question Studio path**, not merely the package ledger or frozen review metadata.

Audit dimensions:

- real SSC-style stem quality;
- distractor plausibility;
- beginner-readable explanation quality;
- difficulty calibration;
- semantic novelty / duplicate resistance;
- ability to reproduce observed real-exam surface forms;
- governance safety of any future remediation.

No production-frequency weights are changed here.

## Live path verified

Current `New-main` / Wave-12 branch contains the post-Final5 TRG-001 Question Studio integration.

English Question Studio generation resolves through:

1. `question-studio-runtime.ts`;
2. `generatePostFreezeRemediatedTrg001Question(...)`;
3. the post-Final5 English remediation overlay;
4. the human-approved/final editorial runtime chain underneath it.

The post-Final5 lifecycle is already internally active for Question Studio and related internal assembly surfaces. Public release remains separately disabled. Therefore this audit must **not mutate the frozen authority in place**. Any learner-facing content change needs a new reviewed candidate/freeze lifecycle.

## Finding A — learner-facing explanation is still cluttered by Shortcut / Common trap

Severity: **BLOCKER FOR PUBLIC EXAM-READINESS**

The Question Studio `explanationText(...)` renderer currently concatenates all of the following into the learner-facing explanation string:

1. core rule;
2. worked steps;
3. `Shortcut`;
4. `Common trap`.

This is not merely metadata. `questionStudioPreview(...)` assigns the concatenated result to the top-level `explanation` field returned to Question Studio.

That conflicts with the Quant V4 editorial standard established during the audit:

- explanations should be simple and coherent;
- beginner reasoning should be shown step by step;
- no unnecessary shortcut/trap boilerplate should be forced into every explanation.

### Why this matters

The underlying TRG worked steps are generally good. For example, the active oriented QL-094 path explains tangent-to-`sinθ cosθ` by reconstructing the right triangle and then multiplying sine and cosine. The learner-facing renderer then adds a shortcut/trap section after those already-sufficient steps.

That makes a sound explanation feel template-heavy and longer than required.

### Required remediation

Default learner-facing explanation should contain only:

- the useful key rule when it adds information;
- ordered worked steps;
- the final answer where needed.

Retain `shortcut` and `traps` inside package/editorial metadata if useful for QA, but **do not append them automatically to the default learner explanation**.

An optional hint/mistake-learning mode can expose them later if product design deliberately asks for it.

## Finding B — Question Studio batch generation has no semantic de-duplication

Severity: **BLOCKER FOR LARGE-POOL GENERATION QUALITY**

`generateTrg001QuestionStudioBatch(...)`:

- allows a requested count up to 1000;
- shuffles the selected QL pool once;
- chooses `order[index % order.length]` for each generated question;
- changes the seed on later cycles;
- performs no batch-level semantic fingerprint check before accepting the question.

This means the generator can repeat the same mathematical question when the requested count exceeds the available distinct states for a QL/pool.

### Why a new seed is not enough

Several permanent roles intentionally have fixed or very small semantic state spaces. The production candidate layer itself lists fixed-stem/fixed-form roles such as standard-value questions and controlled identities. Some have only two wording surfaces while the underlying mathematical task is unchanged.

Therefore a later seed can produce:

- the same mathematical state;
- the same answer;
- the same effective question;
- possibly only a different stem wording or option order.

That is not a genuinely new mock-test question.

### Required remediation

Question Studio needs a batch semantic-uniqueness gate.

Recommended fingerprint inputs:

- package / QL role;
- normalized canonical mathematical state;
- solve mode / target;
- canonical answer;
- any material expression coefficients or angle state.

Do **not** include seed or option order in the semantic identity.

Generation behavior should be:

1. generate candidate;
2. compute semantic fingerprint;
3. reject if already present in current batch;
4. retry with another seed/state up to a bounded attempt budget;
5. if unique capacity is exhausted, return/raise an explicit capacity condition instead of filling the batch with duplicates.

Add regression tests that request counts beyond one QL cycle and prove that accepted questions remain semantically unique.

## Finding C — core archetype coverage is not always exact surface coverage

Severity: **REMEDIATION REQUIRED, NOT A NEW PERMANENT FAMILY BY ITSELF**

The prior runtime-role checkpoint correctly proved that QL-094 covers the mathematical core of the 17 Sep 2024 Shift 1 form:

- given tangent;
- reconstruct sine/cosine;
- evaluate `sin A cos A`.

However the observed PYQ asks for `4 sin A cos A`, while the active QL-094 role asks directly for `sinθ cosθ` and does not expose an outer scalar coefficient parameter.

Likewise, the observed 17 Sep 2024 Shift 1 secant question asks for a scaled combined expression (`3 cosecθ + 3 cotθ`) after reconstruction. Current authority has the necessary ratio-reconstruction and cosecant/cotangent relation components, but repository search did not locate an exact permanent role matching that scaled surface.

### Decision

Use a more granular coverage vocabulary:

- `COVERED_EXACT` — runtime can generate the observed surface family, allowing normal parameter changes;
- `COVERED_CORE` — runtime contains the required mathematics but cannot yet generate a material wrapper seen in the exam, such as an outer coefficient or requested combined expression;
- `MISSING_ARCHETYPE` — the reasoning structure itself is absent.

Under this stricter standard:

- `tan -> sin cos` is **COVERED_CORE**, not fully exact, until scalar-wrapped variants are supported;
- the secant -> scaled cosecant/cotangent expression is also **COVERED_CORE** pending exact role/surface verification;
- cubic trig factorisation remains **MISSING_ARCHETYPE**;
- imposed cosine relation -> higher trig powers remains **MISSING_ARCHETYPE**.

This distinction prevents an engine from being declared exhaustive simply because it can solve the ingredients of a PYQ.

### Preferred remediation

Do not add a separate permanent QL for every harmless outer scalar.

Instead, where mathematically safe, parameterize existing expression roles with controlled exam-style coefficients, for example:

- `k sinθ cosθ` with small non-zero integer `k`;
- `k(cosecθ + cotθ)` or equivalent coefficient-distributed form;
- distractors must propagate the coefficient through realistic failure modes.

These are surface-depth improvements, not independent reasoning families.

## Finding D — sampled stem and distractor quality is generally sound

Severity: **PASS WITH SMALL EDITORIAL WATCHLIST**

Representative live roles inspected include:

- direct right-triangle ratios;
- Pythagorean side recovery;
- standard values / mixed standard expressions;
- complementary-angle relations;
- expression reconstruction from tangent/sine ratios;
- double-angle reconstruction;
- terminal composite/equivalence roles.

### Positive findings

1. Stems are short and mostly SSC-like: direct condition + requested value.
2. The oriented right-triangle remediation removed one-sided `tanθ<1` assumptions.
3. QL-094 distractors are mathematically plausible: double-angle factor, sine-square and cosine-square confusions.
4. Standard-value questions use neighboring function/value mistakes rather than random numbers.
5. Harder expression questions generally explain the reconstruction before substitution.
6. Explanations already contain enough worked steps for beginners; the problem is the extra renderer-added shortcut/trap text, not missing reasoning.

### Editorial watchlist

- repeated phrases such as `Evaluate exactly`, `For acute θ`, and domain clauses like `where defined` are acceptable individually but should be monitored at batch level for synthetic repetition;
- some relation roles are mathematically precise beyond what SSC stems usually state. Remove a domain clause when it is logically redundant and not needed to avoid an invalid problem;
- wording variation alone must never be counted as mathematical novelty.

No package-wide stem rewrite is justified from this sample.

## Finding E — terminal difficulty needs targeted recalibration, not blanket change

Severity: **TARGETED REVIEW**

The final editorial layer already corrected several inflated Hard labels (including the tangent-to-`sinθ cosθ` reconstruction role).

One remaining candidate for re-check is the terminal QL-143 authority mapping, which inherits the old composite reciprocal identity role equivalent to:

`(tanθ + cotθ)² − sec²θ − cosec²θ`.

Its algebra collapses using standard identities and may behave more like an SSC Medium item than a genuine Hard item, depending on distractor and solution depth.

QL-142 is more defensibly Hard because it combines reciprocal/quotient rewriting with a conjugate/Pythagorean reduction. QL-144 is a separate double-angle equivalence role and should be calibrated independently.

Decision: do **not** blanket-demote CP-006. Add a targeted difficulty evidence pass for QL-143 and any other role whose Hard label comes mostly from expression length rather than reasoning depth.

## Updated TRG-001 blocker list after Checkpoint 3

### Externally demonstrated missing reasoning archetypes

1. cubic trigonometric difference-of-cubes factorisation;
2. higher-power trig expression derived from an imposed relation such as `cos A + cos²A = 1`.

### Live Question Studio system defects

3. Shortcut/Common-trap sections are forcibly appended to the default learner explanation;
4. no semantic batch de-duplication / unique-capacity enforcement.

### Surface-depth gaps

5. outer coefficient/composite wrappers seen in real PYQs are not consistently generatable even when the mathematical core is covered.

### Targeted calibration

6. QL-143 Hard label requires evidence-based re-check.

## What is *not* a blocker

- direct ratio stem quality is not broadly broken;
- distractors are not broadly trivial/random;
- explanations do not need a wholesale rewrite;
- QL-142...144 are not spare duplicate slots;
- the package should not be replaced wholesale;
- frequency weighting must still not be changed as part of these content fixes.

## Remediation order from here

1. fix the learner-facing explanation composition at the Question Studio boundary, while preserving editorial metadata;
2. add semantic de-duplication / capacity handling to Question Studio batches;
3. finish exact-surface mapping of the remaining real TRG PYQs using `COVERED_EXACT / COVERED_CORE / MISSING_ARCHETYPE`;
4. parameterize controlled scalar/composite wrappers where this closes a real observed surface gap without creating cosmetic QLs;
5. finish targeted difficulty recalibration;
6. only then make the one-time permanent authority amendment for all truly missing reasoning archetypes;
7. run a new review/freeze lifecycle because the current internal authority is already frozen/activated and learner-facing output will change.

## Gate state

This checkpoint itself authorizes **no mutation or release**.

Current repository governance is respected:

- TRG-001 is internally active under the post-Final5 lifecycle;
- public publication remains disabled;
- frozen authority must not be silently overwritten;
- remediation must be content-addressed, reviewed and re-frozen before replacement activation;
- Quant frequency calibration remains independent and audit-only.