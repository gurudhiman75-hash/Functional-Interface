# DSF-001 Manifest Amendment — CP-001 Production Wave 1

Amendment: `DSF_001_MANIFEST_AMENDMENT_CP001_WAVE1_V1`  
Applies to: `DSF-CP-001 — Production Generation for DSF-QL-001`  
Permanent QL: `DSF-QL-001 / TWO_STATEMENT_TARGET_DETERMINACY`

## Wave 1 scope

First production-generation adapter: `NUM-001 / Number System`.

Implemented solve modes:

- `DSF-SM-NUM-MISSING-DIGIT`
- `DSF-SM-NUM-DIGIT-PARITY`

Both remain the same permanent QL because the learner task is unchanged: decide which statement subset uniquely determines the asked target answer.

## Generator contract

For each deterministic seed the runtime:

1. creates a valid three-digit `ABX` base problem;
2. enumerates all ten possible digit worlds;
3. builds a source-backed statement pool using Number System divisibility plus digit-property constraints;
4. chooses a target canonical sufficiency class deterministically;
5. searches statement pairs and independently evaluates I, II and I+II through the shared DSF evaluator;
6. rejects empty/inconsistent combinations;
7. selects a high-quality valid pair;
8. renders the frozen `DS_STANDARD_5` answer contract;
9. builds a question-specific human explanation from the actual surviving digits/target answers;
10. emits hidden proof metadata and source ancestry.

No `Math.random()` is used in the production path.

## Correctness requirements

Every accepted question must prove:

- `DSF-QL-001` identity;
- one of the five canonical classes;
- Statement I and Statement II are each independently consistent;
- their conjunction is consistent;
- exactly one rendered option is correct;
- target-answer uniqueness is used instead of complete-world uniqueness;
- no learner-facing internal DSF/NUM IDs leak into the stem;
- source ancestry points to `NUM-001`;
- generation is deterministic for the same seed/runtime version.

## Stress gate

Dedicated CP-001 proof generates 500 seeds and audits:

- all five canonical classes;
- class-distribution floor;
- both solve modes;
- multi-world / unique-target projection cases;
- deterministic repeat generation;
- high generation-identity diversity;
- lifecycle locks;
- option-contract exclusivity.

Expected status: `PASS_DSF_CP_001_NUMBER_SYSTEM_PRODUCTION`.

## Editorial status

English packages are `ENGLISH_REVIEW_CANDIDATE`, not frozen content.

Explanations follow:

```text
What is asked
→ Statement I alone
→ Statement II alone
→ both together only when needed
→ exclusive sufficiency conclusion
```

## Product lifecycle

```text
Question Studio discoverable: false
Question Bank writable:       false
test eligible:                 false
publicly publishable:          false
```

Question Studio integration requires a later explicit adapter and review gate.

## Next CP-001 work after Wave 1 proof

- inspect generated English review pack;
- refine statement-quality/difficulty distribution if required;
- add another source-backed Quant solve mode without creating a new QL;
- then add the first production Reasoning solve mode using a source-owned complete-world interface.
