# COD-CP-008 — Source and Boundary Audit

Status: **open English discovery; no permanent QLs; no fixed count**.

## 1. Sources inspected

The source pass inspected:

- the uploaded `reasoning_aggarwal.pdf` Coding–Decoding chapter, especially Type 4 Substitution Coding and questions 233–239;
- recurring competitive-exam mirrors for renamed colours, objects, professions, body parts, time units and functional-use questions;
- the implemented `COD-CP-001..007` ownership surface;
- the frozen CP-009 sentence-coding boundary and the planned CP-010 conditional-table boundary.

The book explicitly defines substitution coding as assigning substituted names to words. Its worked example asks who treats a patient after professions are renamed. The exercise set repeats colour, object-use, category and function questions.

## 2. Observed source forms

### 2.1 Direct renamed-label query

The target referent is supplied directly:

```text
second is called minute
minute is called hour
hour is called day
What is an hour called?
```

This requires one lookup and no outside semantic fact.

### 2.2 Semantic referent followed by renaming

The question first requires a stable ordinary fact:

```text
doctor treats patients
soap washes clothes
ear is used for hearing
blood is red
moon is Earth's natural satellite
```

The true referent is then replaced by the label assigned in the mapping. This is a two-stage student operation:

```text
resolve ordinary referent -> apply one renaming edge
```

### 2.3 Mapping topology

Sources use both open chains and cycles. Topology affects distractors but not the correctness operation. A student must not follow the mapping repeatedly after reaching the assigned label.

### 2.4 Context families

Observed contexts include:

- colours and visible properties;
- professions and roles;
- objects and their uses;
- body parts and functions;
- animals and category membership;
- foods and ordinary properties;
- time units and direct labels.

Context changes the curated dataset, not the solver contract.

## 3. Ownership matrix

| Candidate form | Owner | CP-008 decision |
|---|---|---|
| fixed character/letter substitution | COD-CP-001 | exclude |
| word-to-number or alphabet arithmetic | COD-CP-002 | exclude |
| letter transforms and permutations | COD-CP-003..006 | exclude |
| digit-string transform | COD-CP-007 | exclude |
| renamed real-world referent | COD-CP-008 | include |
| sentence/artificial-language overlap | COD-CP-009 | exclude |
| conditional mapping table | COD-CP-010 | exclude |
| fact/property question without renaming | GK, Analogy or Classification | exclude |

The material distinction from CP-001 is semantic: CP-001 maps visible characters or tokens position by position. CP-008 preserves the real referent and changes the name used for that referent.

## 4. Provisional merge/split decision

The old manifest proposed four families: one-step, cyclic, role/function and two-layer renaming. Source and solver comparison reduces them to two provisional solve contracts:

1. `DIRECT_RENAMED_LABEL`;
2. `SEMANTIC_REFERENT_THEN_RENAME`.

Reasons:

- chain versus cycle does not change the lookup operation;
- role, colour, use, category and property questions all share one fact-resolution-plus-renaming proof;
- option selection versus free phrasing is presentation only;
- there is insufficient recurring evidence for an inverse task asking for the original referent from a renamed label;
- repeated chaining is a misconception, not a valid rule.

## 5. Data-governance requirements

Semantic facts must be:

- elementary and stable;
- single-answer under the exact wording;
- culturally neutral or locale-adapted;
- free from current office holders, brands, politics and changing technology claims;
- reviewed separately in English, Hindi and Punjabi.

Ambiguous source-style facts such as the generic colour of sea water or variable hair colour are not admitted merely because they appeared in a legacy question.

## 6. Required executable proof

Before freeze, prototypes must prove:

- deterministic generation;
- one-step mapping only;
- unique true referent for every semantic prompt;
- independent solver agreement;
- open-chain and cycle coverage;
- four unique options with one correct answer;
- distractors for no-renaming, repeated-chain, inverse-direction and wrong-fact errors;
- answer-position balance;
- Easy, Medium and Hard reach across the checkpoint;
- natural English stems and complete two-stage explanations;
- no permanent IDs or public exposure.

## 7. Current verdict

Proceed with two non-permanent English prototype contracts. Permanent allocation remains forbidden until the executable corpus confirms the merge/split decision and no source-backed inverse or materially different semantic contract remains uncovered.
