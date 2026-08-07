# MAL-CP-004 Wave 04 — Source-Backed Unified Discovery Runtime

Status: **source-backed unified discovery**  
Runtime: `MAL-CP004-EN-SOURCE-BACKED-UNIFIED-DISCOVERY-V1`  
Permanent QLs allocated: **0**  
Question Studio / Question Bank / test / publication: **disabled**

## Purpose

Wave 03 reduced twenty legacy, source-gap and Percentage authorities to ten effective mathematical contracts. Wave 04 converts those decisions into one learner-facing English runtime.

The runtime is not a permanent release. It provides the corpus required for editorial review, diversity measurement and later QL allocation.

## Effective contracts

1. Component amount from total and concentration.
2. Concentration from component and total quantities.
3. Total quantity from a component amount and rate.
4. Solvent addition required for a target concentration.
5. Pure-solute addition required for a target concentration.
6. Evaporation required for a target concentration.
7. Final concentration after a known solvent addition or evaporation.
8. Initial total quantity from known evaporation and initial/final concentrations.
9. Forward moisture shift with unchanged dry matter.
10. Inverse moisture shift with unchanged dry matter.

## Representation variants

The runtime exposes fifteen learner-facing variants without treating each variant as a separate QL:

```text
TRACKED_COMPONENT_AMOUNT
OTHER_COMPONENT_AMOUNT
TRACKED_COMPONENT_PERCENT
TOTAL_FROM_TRACKED_COMPONENT
TOTAL_FROM_OTHER_COMPONENT
SOLVENT_ADDED
PURE_SOLUTE_ADDED
EVAPORATED_AMOUNT
FINAL_TOTAL_AFTER_EVAPORATION
FINAL_CONCENTRATION_AFTER_SOLVENT_ADDITION
FINAL_CONCENTRATION_AFTER_SOLVENT_EVAPORATION
INITIAL_TOTAL_BEFORE_EVAPORATION
FINAL_MASS
MOISTURE_LOST
INITIAL_MASS
```

Approved merges from Wave 03 are therefore implemented as output variants of shared exact states.

## Student-facing policy

Every question:

- uses natural SSC/banking-style wording;
- identifies both components where the initial total is known;
- uses exam-friendly whole numbers and manageable fractions;
- contains four exactly distinct options;
- assigns each wrong option to a named student misconception;
- explains the actual numerical values in the question;
- shows a conserved-quantity table;
- includes a genuine numerical verification;
- avoids artificial openings, alligation language and internal solver terminology.

## Conservation rules

### Component projection

The total is split completely between the tracked component and its complement.

### Solvent addition or evaporation

The tracked solute remains unchanged while total quantity and solvent quantity change.

### Pure-solute addition

The solvent amount remains unchanged while the tracked solute and total quantity both increase.

### Moisture shift

Dry matter remains unchanged while moisture and total mass change.

These distinct invariants prevent incorrect merging of pure-solute and solvent-only transformations.

## Source authority

The runtime attaches source evidence from:

- R.S. Aggarwal Percentage examples and exercises;
- SSC, RRB, MAT, SNAP and CAT-labelled questions recovered in Wave 02;
- Arun Sharma’s CAT fresh/dry grapes problem;
- exact PCT-007 CP-005 and CP-006 collision authorities closed in Wave 03.

Source matches remain classified as:

- direct task match;
- formula-equivalent direction;
- internal collision authority.

## Independent verification

The verifier does not trust the generator’s stored answer. It recomputes the answer from the minimal exact state for each contract:

- component multiplication or complement;
- component/total rate;
- total reconstruction by division;
- conserved-solute dilution and evaporation equations;
- conserved-solvent pure-addition equation;
- known solvent-change concentration;
- initial-total evaporation inverse;
- forward and inverse dry-matter equations.

## Wave 04 proof

The dedicated audit executes:

```text
10 contracts × 200 seeds = 2,000 questions
2,000 deterministic repeat checks
2,000 independent exact recomputations
50 review rows
15 representation variants
100-question mixed anti-clone set
```

It additionally checks:

- all ten Wave 03 contracts are routed;
- all approved multi-variant contracts expose both variants in balanced counts;
- exact-state, stem and answer diversity per contract;
- chapter-wide fingerprint, stem and answer diversity;
- balanced correct-answer positions;
- source-evidence and misconception-authority diversity;
- no generic arithmetic or arbitrary ±1 distractors;
- manageable answer denominators;
- natural language and number-specific explanations;
- opening-pattern and distractor-pattern caps in a mixed set;
- zero permanent QLs and zero enabled product flags.

## Next phase

Wave 05 should perform the full editorial release review over the 2,000-question corpus, including:

- at least ten questions from each effective contract;
- all representation variants;
- easy, moderate and difficult levels;
- direct, inverse and output-projection tasks;
- stem and explanation similarity measurement;
- numerical-value balance;
- option misconception balance;
- explicit review of the Percentage alias/migration policy.

Permanent `MAL-QL-038+` allocation must remain blocked until that editorial review passes.
