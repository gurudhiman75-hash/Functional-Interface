# SYL-001 — Structured-Proof and Combined-Diagram Remodel V3

**Chapter:** `SYL-001 — Syllogism`  
**Governing review:** `SYL-001 Proposed Corrections and Remodelling Specification`  
**Runtime authority:** `SYL_001_STRUCTURED_PROOF_REMODEL_V3`  
**Immutable review version:** `SYL_001_REMODEL_V3`  
**Human review state:** `REVISE`  
**Delivery state:** inactive

## 1. Decision

The symbolic solver, premise normalization, QL identities, source-pattern authorities and multilingual term mapping remain the logical foundation.

The previous student-facing explanation and diagram surface is superseded for future review by a structured proof object. V3 does not activate the chapter. It creates a safer immutable review surface that must pass automated and human review before freeze.

## 2. Explicit existence policy

V3 declares:

```text
EXAM_NON_EMPTY_PREMISE_TERMS_V1
```

The contract is:

- every class named in the premises is treated as non-empty;
- conclusion-only terms do not receive automatic existence;
- synthetic or renderer-only terms do not receive automatic existence;
- the policy is shown to students and stored in review metadata;
- English, Hindi and Punjabi use the same policy version.

## 3. Logical status and task disposition

V3 separates logical truth from task correctness.

Logical status:

```text
ENTAILED
POSSIBLE_NOT_ENTAILED
IMPOSSIBLE
INCONSISTENT_PREMISES
```

Task disposition:

```text
CORRECT_FOR_TASK
WRONG_FOR_TASK
TRUE_BUT_NOT_REQUESTED
INVALID_OPTION_FORM
```

This prevents a conclusion from being described as logically false merely because it is not the response requested by the task.

## 4. Option-specific proof evidence

Every visible option stores:

- final display index and label;
- exact visible text;
- semantic value;
- logical status;
- task disposition;
- student-facing verdict;
- decisive premise IDs;
- reason code;
- question-dependent reason;
- proof type;
- required, blocked or free relation;
- witness IDs and witness-identity policy;
- satisfying model and/or countermodel when required.

The option text, explanation order, correct index, final answer and diagram reference are rebuilt after final option shuffling.

## 5. Explanation order

Every V3 explanation follows this student sequence:

1. Understand the statements.
2. Combine the statements.
3. Check each visible option.
4. Show why the correct option is right.
5. Give one exam-useful rule.
6. Show one combined diagram for the correct option.
7. State the final answer.

Generic verdict-only explanations are rejected by validation.

## 6. One combined diagram

Each question contains exactly one SVG artifact.

The SVG:

- includes every relevant premise in one relation map;
- highlights and names only the keyed option;
- carries one accessible title and description;
- uses IDs containing locale, QL, seed, scenario and diagram version;
- carries correct `lang` and `aria-labelledby` metadata;
- renders satisfying and falsifying states inside one canvas when both are required;
- never renders separate premise cards or wrong-option diagrams.

Supported modes:

```text
DEFINITE_PROOF_MODEL
IMPOSSIBILITY_BLOCK_MODEL
NON_FOLLOWING_COUNTERMODEL
POSSIBILITY_WITNESS_MODEL
POSSIBLE_NOT_DEFINITE_TWO_STATE_MODEL
FOLLOW_MASK_MODEL
EITHER_OR_COMPLEMENT_MODEL
PAIR_CLASSIFICATION_MODEL
```

## 7. Multilingual parity

English, Hindi and Punjabi share the same:

- scenario;
- premises and normalized constraints;
- option semantic order;
- correct index;
- option logical statuses;
- decisive premise IDs;
- proof models;
- diagram mode;
- lifecycle state.

Only natural-language realization and diagram labels differ.

## 8. Option security

V3 performs a final deterministic shuffle using an immutable versioned salt after all option content is complete.

Authority gates reject:

- perfect local answer-position periods up to length eight;
- excessive repeated answer-position n-grams;
- starved local answer positions;
- unsynchronized option, explanation and diagram references.

## 9. Semantic difficulty

Difficulty is recalculated from logical features:

- premise count;
- term count;
- topology;
- existential witness obligations;
- only/few/not-all/identity transformations;
- conclusion count;
- modal, countermodel, pair or either-or proof burden;
- direct contradiction and short-chain reductions.

The score does not depend on locale, wording length, SVG layout or answer position.

## 10. Immutable review package

The V3 exporter generates:

```text
syl-001-remodel-v3-review.html
syl-001-remodel-v3-review.jsonl
summary.json
```

The current review export samples six seeds per QL in all three languages:

```text
18 QLs × 6 logical seeds = 108 logical review payloads
108 payloads × 3 locales = 324 localized review records
```

Each record remains `REVISE` and includes a human review table.

## 11. Automated authority

The V3 authority sweeps:

```text
18 QLs × 80 seeds × 3 locales = 4,320 localized questions
```

It validates:

- exact option synchronization;
- structured evidence for every option;
- one integrated SVG;
- complete premise coverage;
- unique accessible SVG IDs;
- explicit existence policy;
- multilingual semantic parity;
- answer-position sequence security;
- semantic difficulty invariance;
- inactive lifecycle.

## 12. Lifecycle boundary

Until human review and final refreeze:

```text
humanReviewStatus = REVISE
questionStudioVisible = false
questionBankWritable = false
testEligible = false
publiclyPublishable = false
```

No V3 automated pass is itself permission to activate the chapter.
