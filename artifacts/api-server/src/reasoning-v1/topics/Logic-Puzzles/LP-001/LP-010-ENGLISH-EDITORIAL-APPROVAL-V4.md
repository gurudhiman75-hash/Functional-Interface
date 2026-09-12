# LP-010 English Editorial Approval V4

Status: **APPROVED AND FROZEN**

Approved on: 2026-09-10

## Authority

- Package: `LP-010`
- Checkpoint: `LP-CP-010`
- English implementation: `lp-010.ts`
- Review pack: `LP-010 Generated Review V4`
- Permanent QLs: `LP-QL-037` through `LP-QL-040`
- Freeze authority: `LP_010_ENGLISH_FREEZE_V1`

## Human approval basis

The English review was approved after iterative review of the generated question pack. The final accepted version includes the following editorial and structural requirements:

- simple, standard competitive-exam wording;
- all six people, all three days and the complete six day-time slots explicitly stated in every standalone question;
- no hidden city/centre/object-domain information;
- Easy questions require a small deduction rather than five direct placements;
- Medium and Hard use progressively more relational deduction structure;
- progressive step-by-step tables in explanations;
- clock-time diversity within the chapter, including caselets with 2, 4, 5 and 6 unique times across the six slots;
- no single explicit clock time dominating the clue list;
- both whole-hour and half-hour exam-style time formats;
- solver-backed unique assignments and balanced answer positions.

## Frozen English contract

The approved English package owns these permanent question-logical identities:

| QL | Authority | Task |
|---|---|---|
| `LP-QL-037` | `PERSON_TO_DAY_TIME_LOOKUP` | Identify the day-time slot assigned to a stated person. |
| `LP-QL-038` | `DAY_TIME_TO_PERSON_LOOKUP` | Identify the person assigned to a stated day-time slot. |
| `LP-QL-039` | `DAY_TIME_PAIR_MATCH` | Identify the option that correctly matches two people with their day-time slots. |
| `LP-QL-040` | `IMMEDIATE_NEXT_PERSON_LOOKUP` | Identify the person scheduled in the immediately following chronological slot. |

English wording, QL ownership, solver semantics, difficulty structure and the approved explanation contract are frozen at this checkpoint. Hindi/Punjabi localization may rebuild learner-facing wording semantically, but must preserve the same underlying assignment, QL, correct option index and solving semantics.

## Downstream handling

This approval does not introduce a separate LP-010 admission or publication pipeline. After localization approval, LP-010 should be connected to the existing shared Logic Puzzle Question Studio, which owns the normal generation/review/downstream workflow.
