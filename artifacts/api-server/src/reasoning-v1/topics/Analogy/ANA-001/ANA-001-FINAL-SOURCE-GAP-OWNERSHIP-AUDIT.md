# ANA-001 Final Source-Gap and Ownership Audit

Status: `AUDITED_FOR_REMEDIATION — PERMANENT ALLOCATION PENDING REVIEW`

This audit is the authority for the final post-V1 source-gap remediation. It supersedes any earlier assumption that `ANA-QL-001..250` alone proves source saturation. Existing permanent identities remain unchanged.

## 1. Principle

A source example is not automatically a new QL. A new permanent identity is justified only when the student-facing solve contract is materially different after parameter, presentation and wording variants are compressed.

The target is not to reproduce every historical preparation-book taxonomy label. The target is to cover recurring, exam-natural reasoning contracts across SSC, Banking and Punjab exams without importing unstable Static-GK trivia as artificial reasoning depth.

## 2. Semantic source audit

### 2.1 Already covered or mergeable into existing authorities

- country/state → capital;
- country → currency;
- animal → young/sound/movement;
- male ↔ female;
- worker → workplace/tool/product;
- instrument → measurement;
- quantity → unit;
- object/device → function;
- part → whole;
- member → class;
- individual → group;
- product → material;
- place → purpose;
- synonym/antonym and several lexical-strength relations under CP-002.

`Phone : Talk :: Television : View` is not a new relation family. It is a source fixture of the existing object/function authority, so the CP-001 dataset should contain equivalent modern device/function facts.

### 2.2 Admit as stable semantic expansion families

The following are sufficiently distinct, stable and exam-natural to warrant a governed expansion registry:

1. **institution/place → collection/content** — e.g. library → books, museum → artefacts;
2. **entity/animal/person → dwelling/home**;
3. **activity/game → venue/place of play**;
4. **paired/companion objects**;
5. **cause → effect**;
6. **problem/state → remedy/action**;
7. **sport/activity → equipment**;
8. **disease/condition → affected organ/body system**;
9. **author/creator → work/product**, provided only stable canonical works are admitted.

These families should be exposed through a compact semantic-expansion QL rather than two new permanent QLs per relation. The relation ID remains runtime metadata so Question Studio can still filter/weight it.

### 2.3 Merge rather than allocate

- performer → action and tool → action are manifestations of function/action transfer and can share the existing object/function or worker/function semantics after the datasets are widened carefully;
- shape → side-count belongs primarily to Classification when the task is odd-one-out; if used as a direct analogy, it may be served from shared semantic infrastructure without creating a dedicated Analogy QL;
- study → subject remains CP-002 lexical/conceptual authority.

### 2.4 Defer from Reasoning semantic expansion

Traditional preparation books contain many factual analogy lists such as country → national fruit/flower/emblem/game, country → parliament name, award → field, revolution → production area, person → cremation ground and religion → book/place of worship.

These are **not rejected as facts**, but they are deferred from the Reasoning generator because:

- several are volatile, jurisdiction-sensitive or convention-dependent;
- success depends more on Static-GK recall than analogy reasoning;
- including them would make `Hard` mean obscure trivia rather than deeper reasoning;
- they can be reconsidered only if modern target-exam frequency justifies a stable, separately governed GK-backed semantic pool.

Verb-tense analogy is similarly deferred to English-language ownership unless modern Reasoning evidence establishes recurrence.

## 3. Numeric pair-transfer audit

### 3.1 Admit

The source corpus proves recurring pair-transfer families not fully present in CP-003:

- **higher fixed power** (`x^k`, with bounded source-backed exponents beyond existing square/cube);
- **exact square root**;
- **cube root with small fixed adjustment**;
- **cube with subtraction of a small fixed constant**;
- **digit quotient** where divisibility is exact;
- **sum of all digits of a three-digit input**;
- **product of all digits of a three-digit input**.

These should remain bounded rule trees, not unrestricted expression synthesis.

### 3.2 Compression

- higher powers use one rule with exponent as a bounded parameter;
- root families separate exact square root from cube-root-plus/minus-adjust only if the displayed operation chain differs materially;
- two-digit and three-digit digit-sum/product should share the same conceptual operation where answer behaviour is identical, but generation domains must expose both lengths so source-style three-digit questions are reachable;
- missing-term and equivalent-pair are presentation contracts over each admitted rule, as in existing CP-003.

### 3.3 Defer arbitrary one-off formulas

The exercise corpus contains many isolated polynomial or mixed formulas. They are not admitted merely because one worked answer can be reverse-engineered. A new formula family requires either recurrence across source fixtures or a bounded general rule family that is already exam-native and can be validated against simpler competing explanations.

## 4. Number-set audit

### 4.1 Admit

Two source-native set properties remain materially distinct from the existing arithmetic-third-member rules:

- **all-members-prime set equivalence**;
- **fixed-ratio multiplicative progression set equivalence** such as `a, ar, ar²`.

These are primarily equivalent-set selection tasks. A missing-member form is not allocated unless the visible information uniquely determines one value without relying on answer-option guessing.

### 4.2 Reject fake inversion

A set-property QL must not manufacture a missing member when infinitely many values could satisfy the property. The generator may use only task forms with option-independent single-correctness.

## 5. Multi-reference presentation

Forms such as:

`A : B :: C : D :: E : ?`

remain owned by the underlying stable pair-transfer rule. An extra complete pair is additional evidence, not a meta-rule. CP-003 remediation therefore adds this as a presentation/state variant with no new QL identity.

## 6. Advanced/meta boundary

Earlier CP-009 research found changing-vector and coupled-invariant examples whose published option set selected an answer even though the visible anchors did not uniquely determine it under a bounded grammar. Those fixtures remain quarantined.

The final source-gap closure must not weaken the core requirement that ExamTree questions be option-independently solvable.

## 7. Permanent-allocation recommendation

Because no `ANA-QL-251..274` identity was ever implemented, that range may be replanned safely after review. The preferred compressed allocation is:

- 14 numeric QLs: seven admitted pair-rule families × two presentation contracts;
- 2 set-property QLs: prime-set equivalence and multiplicative-progression equivalence;
- 2 semantic-expansion QLs: missing-term and equivalent-pair over a governed relation registry.

Total recommended new identities: **18**, provisionally `ANA-QL-251..268`.

`ANA-QL-269..274` remain unallocated. Advanced/meta research receives no permanent identity until a source family passes option-independent uniqueness.

## 8. Release requirements

Before `251..268` become permanent, the executable prototypes must prove deterministic generation, independent solver agreement, four unique options, one correct answer, misconception-grounded distractors, source-style examples, structural difficulty, EN/HI/PA parity, answer-position balance and large-batch non-repetition.
