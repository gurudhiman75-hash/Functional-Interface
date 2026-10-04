# STC-001 — Statement & Conclusion — End-to-End Design

Status: IMPLEMENTATION AUTHORITY V1
Chapter code: REAS-STC
Chapter ID: STC-001
Target exams: SSC, Banking, Punjab state exams
Languages: en-IN, hi-IN, pa-IN

## 1. Chapter boundary

STC asks whether a proposed conclusion is logically entailed by the supplied statement(s). It is not an assumption test, argument-strength test, course-of-action test, cause/effect classification, decision/eligibility caselet, or syllogistic set-relation chapter.

A conclusion follows only when every model consistent with the statement(s) also makes that conclusion true. Plausibility, common knowledge, desirability and likely real-world outcomes are not enough.

## 2. Permanent semantic inventory

The chapter reserves six permanent QLs grouped by solving architecture, not by superficial wording.

| CP | QL | Semantic contract |
|---|---|---|
| STC-CP-001 | STC-QL-001 | Direct explicit entailment / safe paraphrase |
| STC-CP-001 | STC-QL-002 | Multi-clause conjunction/disjunction entailment |
| STC-CP-002 | STC-QL-003 | Conditional rule entailment; reject converse/inverse |
| STC-CP-002 | STC-QL-004 | Modal-strength entailment; reject stronger unsupported certainty |
| STC-CP-003 | STC-QL-005 | Comparative/order entailment including transitive chains |
| STC-CP-003 | STC-QL-006 | Temporal/change/trend entailment from explicit before/after facts |

The six QLs are semantic families. Presentation cardinality is orthogonal: one conclusion, conclusions I/II, and profile-specific answer labels are render profiles, not separate QLs.

## 3. Exam presentation profiles

Minimum supported profiles:

1. SINGLE_CONCLUSION_YES_NO
2. TWO_CONCLUSIONS_ONLY_I_ONLY_II
3. TWO_CONCLUSIONS_BOTH_NEITHER
4. TWO_CONCLUSIONS_FIVE_WAY_WITH_EITHER
5. BANKING_VERBOSE_INSTRUCTION
6. SSC_COMPACT_INSTRUCTION
7. PUNJAB_STATE_COMPACT

The engine must avoid answer-cardinality leakage. Conclusion order and option order are independently seeded.

## 4. Core semantic rule

Entailment is model-theoretic:

`statements |= conclusion`

For propositional/conditional authorities, an independent truth-model solver evaluates all assignments consistent with the premises. For comparison and temporal authorities, a dedicated relation solver computes closure and validates the conclusion. The text generator never decides correctness.

## 5. Controlled natural-language authority

Production content is built from curated scenario authorities. Runtime free-form wording is forbidden.

Each authority contains:

- stable scenario ID;
- QL ID;
- semantic premises in structured form;
- a curated English surface family;
- Hindi/Punjabi adapted surface families;
- genuine entailed conclusions;
- plausible non-entailed transforms (converse, inverse, overclaim, unsupported cause, scope expansion, polarity flip, order reversal, temporal reversal);
- provenance/editorial metadata.

## 6. Anti-overlap rules

- Formal all/some/no set relations belong to SYL-001 unless embedded only as ordinary controlled propositions without set-diagram reasoning.
- Hidden prerequisites belong to STA-001.
- Strong/weak support belongs to ARG.
- Recommended responses belong to COA.
- Identifying causal direction belongs to CAE; STC may only infer a causal statement when that causal relation is itself explicitly asserted as a premise.
- Rule-table eligibility caselets belong to DCS.

## 7. Explanation contract

Every explanation must say what the statement establishes and why each tested conclusion does or does not necessarily follow. It must not merely say "Conclusion I follows". For invalid conclusions, name the logical defect: unsupported extra fact, converse, inverse, stronger modality, reversed comparison, reversed time direction, or unsupported combination.

## 8. Localization

Hindi and Punjabi are semantic adaptations, not word substitution. QL/scenario identity, correct-answer set and difficulty must remain identical across EN/HI/PA. Internal logical tokens never appear in learner text.

## 9. Difficulty

EASY: direct one-step entailment, obvious polarity.
MEDIUM: two-premise combination, conditional chain, one strong distractor.
HARD: multi-hop relation closure, modal-strength distinction, tightly plausible non-entailments.

## 10. Checkpoint rollout

STC-CP-001 establishes the chapter foundation and truth-model solver for QL001-002.
STC-CP-002 adds conditional and modal semantics.
STC-CP-003 adds ordered/comparative and temporal closure.

Every CP must pass determinism, exactly-one-answer, solver/generator independence, ambiguity rejection, answer-position distribution, multilingual parity and learner-language audits before freeze.

## 11. Freeze and release boundary

A semantic freeze does not grant learner delivery. Question Studio registration is review-only until separately approved. Question Bank writes, tests, mocks, public publication and automatic publication remain closed until a later release authorization.
