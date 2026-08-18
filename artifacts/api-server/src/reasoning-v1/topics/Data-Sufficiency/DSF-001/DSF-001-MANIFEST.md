# DSF-001 Data Sufficiency — Chapter Manifest

Status: `IMPLEMENTATION_STARTED / CP-000`

## Identity

- Product chapter: Data Sufficiency
- Chapter code: `REAS-DSF`
- Implementation package: `DSF-001`
- Current checkpoint: `DSF-CP-000`
- Permanent QL allocation: **LOCKED / NOT YET AUTHORIZED**

## Product boundary

Data Sufficiency remains one learner-facing chapter. Internally it is a shared sufficiency engine over Quant and Reasoning domain adapters.

Statement & Assumption, Statement & Conclusion, Statement & Argument, Cause & Effect, Course of Action, Assertion & Reason, and Decision Making remain separate Logic/Deduction chapters.

## CP-000 purpose

Build and prove the chapter-level semantics before domain content generation:

1. evaluate Statement I from the base problem;
2. evaluate Statement II independently from the same base problem;
3. evaluate their conjunction;
4. determine sufficiency from uniqueness of the **asked target answer**;
5. reject inconsistent statement sets;
6. classify one of five canonical sufficiency classes;
7. compute minimal sufficient statement subsets;
8. keep answer-contract rendering separate from semantic truth;
9. keep permanent QLs and Question Studio publication locked during discovery.

## Canonical classes

- `STATEMENT_I_ONLY`
- `STATEMENT_II_ONLY`
- `EACH_STATEMENT_ALONE`
- `BOTH_TOGETHER_ONLY`
- `INSUFFICIENT_EVEN_TOGETHER`

## Core semantic invariant

A statement set is sufficient when it leaves at least one valid world and every surviving valid world gives the same normalized answer to the target question. Complete-world uniqueness is not required.

## CP-000 lifecycle locks

Until CP-000 discovery is reviewed:

- permanent QL IDs: disabled;
- Question Studio learner discovery: disabled;
- question-bank writes: disabled;
- mock-test eligibility: disabled;
- public publication: disabled.

## Exit gate

CP-000 may advance only when:

- all five canonical classes pass executable tests;
- target-projection semantics are proven with multiple-world examples;
- statement-independence tests pass;
- contradiction/inconsistency tests pass;
- monotonicity and answer-agreement invariants pass;
- the standard five-option semantic contract is exclusive and exhaustive;
- discovery inventory has been reviewed before permanent QL allocation.
