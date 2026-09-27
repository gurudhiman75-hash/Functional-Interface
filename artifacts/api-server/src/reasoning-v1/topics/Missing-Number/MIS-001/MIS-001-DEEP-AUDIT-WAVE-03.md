# MIS-001 — Deep Audit Wave 03 — Formula → Learner-Skill Merge/Split

Date: 2026-09-27  
Status: **9 PROPOSED LEARNER-SKILL CONTRACTS / PERMANENT QL FREEZE STILL PENDING**

## Why 69 semantic-authority IDs are too many

The implementation originally uses exact formulas as semantic-authority candidates. That is useful for deterministic generation and ambiguity testing, but it is too granular for permanent QL identity.

A learner does not acquire a fundamentally new Missing Number skill every time:

- addition becomes subtraction;
- a constant changes;
- row pairing becomes a different numeric instance;
- the blank moves from result to input;
- a triangle is redrawn with different values;
- three evidence examples are shown instead of two.

Permanent identities should represent stable **reasoning topology**, while formula choice stays parameterized.

## Proposed skill contracts

1. **MIS-SKILL-001 — Basic two-input arithmetic relation**
2. **MIS-SKILL-002 — Two-input compound arithmetic relation**
3. **MIS-SKILL-003 — Three-input arithmetic relation**
4. **MIS-SKILL-004 — Power-derived relation**
5. **MIS-SKILL-005 — Consecutive or special-number property relation**
6. **MIS-SKILL-006 — Triangle positional relation**
7. **MIS-SKILL-007 — Circle/sector positional relation**
8. **MIS-SKILL-008 — Box/matrix positional-pairing relation**
9. **MIS-SKILL-009 — Digit-property relation**

All 82 valid runtime patterns map to exactly one of these proposed skills.

## Non-splitting parameters

The following remain generator parameters, not separate skills:

- exact formula within the same topology;
- renderer/shape variation where solve topology is unchanged;
- which position is missing;
- number of completed evidence groups;
- rule-competition presentation used to raise difficulty;
- specific row/column/diagonal numeric values.

## Held and excluded patterns

- `MIS-CAND-034` factorial: remains source-thin; mapped to Skill 005 only for review, not permanent coverage.
- `MIS-CAND-072` number + reverse: remains source-thin; mapped to Skill 009 only for review.
- `MIS-CAND-078`: removed from runtime because one displayed input did not participate.

## Permanent QLs

No `MIS-QL-*` IDs are allocated in this wave.

Before a 9-QL freeze can be accepted, Wave 04 must test the learner-facing output for:

- real-exam stem form;
- explanation simplicity;
- distractor plausibility;
- non-triviality;
- correct difficulty;
- diagram/rendering clarity;
- representative coverage of every proposed skill.

If learner-surface evidence proves that one proposed skill actually contains two materially different reasoning actions, it may split there—not because two formulas look different.
