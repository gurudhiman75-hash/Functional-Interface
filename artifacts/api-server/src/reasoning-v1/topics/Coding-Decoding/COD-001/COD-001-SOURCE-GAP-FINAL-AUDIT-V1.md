# COD-001 — Source-Gap Final Audit V1

Status: **HOLD — SOURCE/OWNERSHIP/MERGE-SPLIT CLEARED; PRODUCTION-QUALITY REMEDIATION REQUIRED; NO PERMANENT QL ALLOCATION**

Date: 2026-09-13

Current audit base: `New-main@890fd06668bde4e3ea3f075bbd09ceb9468b1ff6`

This checkpoint continues the Reasoning V1 final audit from the earlier guarded source-gap prototype. The executable prototype evidence from the closed, unmerged PR #1570 is carried onto the current audit base so the audit is no longer tied to its stale branch.

No existing `COD-QL-001..199` identity is changed. This checkpoint does not reserve `COD-QL-200`, does not create a manifest amendment, and does not enable Question Studio, Question Bank conversion, mock-test delivery or public publication.

## 1. Source-backed gaps confirmed

The following four rule authorities remain genuine gaps in the current 199-QL Coding-Decoding runtime:

1. `ALPHABETICAL_ASCENDING_SORT` — CP-005;
2. `INDEXED_SHIFT_THEN_REVERSE` — CP-006;
3. `REVERSE_THEN_UNIFORM_SHIFT` — CP-006;
4. `MIXED_CLASS_CODE` — CP-007, with two source-backed mapping contexts:
   - `VOWEL_INDEX_CONSONANT_PREVIOUS`;
   - `REVERSE_VOWEL_INDEX_CONSONANT_OPPOSITE`.

The carried prototype reproduces the audited SSC/CPO fixtures exactly and generates 4 rule authorities × 120 seeds = 480 deterministic review-only English questions.

## 2. Merge / split decision

### 2.1 `ALPHABETICAL_ASCENDING_SORT` — RETAIN as one solve contract

This is not a fixed position permutation. The output order depends on the actual letter values in the source word. Existing CP-005 QLs 113–136 therefore cannot represent it by selecting another fixed permutation context.

The same mechanical operation exists as an explicit transformation in Word/Dictionary Order and Alphabet Test, but those chapters ask ordering/position questions after an explicitly stated operation. Here the operation must be inferred from hidden word→code evidence. The task semantics, ambiguity conditions, distractors and explanation path therefore belong to Coding-Decoding.

### 2.2 `INDEXED_SHIFT_THEN_REVERSE` — RETAIN as one solve contract

Existing CP-006 contains `REVERSE_THEN_INDEXED_SHIFT`. The two stages do not commute. Applying indexed shifts before reversal changes which source letter receives each positional shift, so the existing QL family cannot absorb this as a cosmetic parameter.

Wrong-stage-order is also a real misconception and must remain a first-class distractor.

### 2.3 `REVERSE_THEN_UNIFORM_SHIFT` — RETAIN as one solve contract

Existing CP-006 does not contain the composition of full reversal followed by one uniform alphabet movement. Reversal-only and shift-only are partial-stage misconceptions, not equivalent existing contracts.

Uniform shift amount and direction remain generated-instance parameters; they do not create separate QLs.

### 2.4 `MIXED_CLASS_CODE` — RETAIN as one solve contract, MERGE the two mapping variants as instance contexts

Both source-backed variants use the same solve architecture:

1. classify each input letter as vowel or consonant;
2. apply one mapping to vowels;
3. apply another mapping to consonants;
4. concatenate the mixed letter/digit output in source order.

The exact vowel numbering and consonant transform change, but answer semantics, validity logic, renderer, dominant misconceptions and teaching path remain the same. They therefore do **not** justify two permanent QLs.

The current CP-007 permanent contracts (`COD-QL-169..172`) cover only uniform modular digit translation, so this mixed letter/digit contract is not a duplicate of the existing CP-007 runtime.

## 3. Task-direction audit

The present source evidence and prototype prove only **infer the hidden rule and encode a target word forward**.

Do not manufacture additional QLs for:

- inverse decoding;
- recover-one-missing-token;
- choose-matching-code as a separate identity;
- explicit-rule forward application;
- rule naming/classification.

Those directions require their own recurring source evidence and ambiguity proof before allocation.

If eventually approved, the current source gap therefore implies **four candidate solve contracts**, not four rule families multiplied by task templates.

No numeric permanent IDs are allocated by this audit.

## 4. Answer / ambiguity / renderer audit

For all four candidates:

- answer semantics are one coded string;
- the current exam surface is two example word→code rows plus one target word;
- the independent candidate solver must find exactly one rule/context from the displayed evidence;
- the target must materially exercise the inferred rule;
- options must be unique and contain exactly one correct code;
- wrong options should come from wrong stage order, wrong direction/parameter, partial-stage application or wrong class mapping rather than arbitrary mutations wherever possible.

The 480-question prototype gate already proves determinism, unique options, all four answer positions, unique inferred rule/context and at least 80 visible variants per rule authority.

## 5. Final-audit blockers discovered after the prototype gate

The old prototype is **not ready for permanent allocation** despite its green executable gate.

### P1 — Difficulty is rule-labelled, not instance-derived

`generateSourceGapPrototype` currently returns:

```text
INDEXED_SHIFT_THEN_REVERSE -> HARD
all other source-gap rules -> MEDIUM
```

That violates the Reasoning V1 policy that difficulty must come from the generated solve state rather than rule identity, seed or a fixed quota.

Required remediation:

- introduce a shared source-gap difficulty scorer;
- score evidence burden, target length, wraparound count, repeated-letter interference, parameter ambiguity pressure and mixed-class switching;
- prove Easy/Medium/Hard only where the generated state genuinely supports them;
- add tests showing the same rule can reach more than one legitimate difficulty where source structure permits it.

### P1 — Vocabulary / surface pool is too small for production use

The prototype uses one 32-word `GENERAL_WORDS` pool for all four authorities. The current 80/120 visible-fingerprint gate proves short review variation, but it does not prove production fatigue resistance.

Required remediation:

- replace the single tiny pool with governed, exam-neutral source pools;
- target at least 180 unique usable source words after rule-specific eligibility filtering;
- reject awkward proper nouns, local place names and obscure vocabulary;
- add rolling-window source-word and evidence-pair fatigue gates;
- ensure mixed-class instances visibly exercise both vowel and consonant channels.

### P1 — Explanation contract forces unnecessary shortcut/trap boilerplate

The prototype structurally requires `examShortcut` and `commonTrap` for every question, and the review exporter prints both every time. That encourages repetitive coaching text even when the direct step-by-step solution is already sufficient.

Required remediation:

- make the explanation beginner-first and problem-specific;
- keep the actual transformation steps and compact visual working;
- remove mandatory shortcut/trap sections from the student-facing contract;
- allow a short caution only when a concrete displayed distractor demonstrates a meaningful misconception;
- do not omit intermediate transformations merely to make the explanation shorter.

### P2 — Generic fallback distractors must be bounded

`fallbackMutation` is currently allowed to invent a one-token mutation when misconception-derived options collide. This is acceptable as a prototype safety fallback but not as a normal production distractor source.

Required remediation:

- record distractor provenance;
- require all advanced/normal production distractors to come from explicit misconception models;
- permit a bounded fallback only when the gate proves that the generated instance cannot supply three distinct misconception outputs, or regenerate the instance instead;
- add a gate on fallback rate and reject any authority that relies on it materially.

## 6. Candidate identity decision after remediation

If the P1/P2 gates are repaired and the whole-chapter regression remains green, the manifest-amendment proposal should contain exactly four new permanent solve contracts in this order:

1. CP-005 — infer alphabetical ascending sort and encode target;
2. CP-006 — infer indexed shift then reverse and encode target;
3. CP-006 — infer reverse then uniform shift and encode target;
4. CP-007 — infer mixed vowel/consonant class coding and encode target.

The two mixed-class source variants remain contexts of contract 4.

This document intentionally does **not** assign `COD-QL-200..203`; the open-discovery policy requires the remediation proof and an explicit manifest amendment before any numeric identity exists.

## 7. Exit gate for this HOLD

COD-001 source-gap HOLD can be lifted only after all of the following are green on a branch rebased/current with `New-main`:

1. source fixtures still reproduce exactly;
2. 480+ deterministic prototype/adversarial generation passes;
3. instance-derived difficulty gate passes;
4. governed vocabulary and rolling fatigue gate passes;
5. misconception-provenance distractor gate passes;
6. beginner-first explanation/editorial gate passes;
7. existing `COD-QL-001..199` runtime and closure regressions pass unchanged;
8. ownership/collision checks against ALP/WOR and current COD registries remain green;
9. lifecycle locks remain review-only;
10. product review explicitly approves the four-contract split before a manifest amendment allocates permanent IDs.

Until then, the old 199 permanent QLs remain the only Coding-Decoding identities.