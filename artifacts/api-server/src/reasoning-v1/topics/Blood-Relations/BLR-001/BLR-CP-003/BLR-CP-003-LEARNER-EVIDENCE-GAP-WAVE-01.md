# BLR-CP-003 — Learner-Evidence Gap Wave 01

Status: **IMPLEMENTATION SCOPE FROZEN; V6 CANDIDATE GENERATION PENDING; NO PERMANENT QL ALLOCATION**.

Wave version: `BLR_CP003_LEARNER_EVIDENCE_GAP_WAVE_01`

## Goal

Preserve the approved 128-record V5 pack and add a separate V6 candidate layer that supplies competitive, learner-facing evidence for the five provisional authorities currently represented only in rejected source records.

The wave does not assume that all five authorities will survive. Each must either produce reviewable evidence or receive an explicit remove/delegate disposition before final freeze.

## Required candidate coverage

| Authority | Current active records | Minimum V6 candidates | Candidate pattern |
|---|---:|---:|---|
| `DETERMINE_MEMBER_GENDER` | 0 | 4 | identify a relation-qualified member, then return the entailed gender label |
| `SELECT_UNORDERED_FAMILY_PAIR` | 0 | 4 | select a derived multi-edge pair such as cousins, grandparent–grandchild or uncle/aunt–nephew/niece |
| `IDENTIFY_ALL_MEMBERS_BY_RELATION` | 0 | 4 | return a complete derived set such as all cousins or grandchildren |
| `DETERMINE_MEMBER_MARITAL_STATUS` | 0 | 4 | identify a relation-qualified member, then determine proved married or explicitly unmarried status |
| `IDENTIFY_MEMBER_BY_MARITAL_STATUS` | 0 | 4 | combine a derived relation branch with a status predicate to identify one person |

Minimum wave size: **20 V6 candidate records**, subject to generation and uniqueness audits. Counts are a minimum evidence floor, not a final fixed QL count.

## Quality rules

Every candidate must:

- require reconstruction of the shared family graph;
- avoid copying the final answer proposition from one clue;
- have four semantically unique options and exactly one correct answer;
- include a native SVG family tree and ASCII fallback;
- expose the decisive target path or target set;
- provide four-tier teacher explanation and option-specific trap rejection;
- preserve the answer shape of its proposed authority;
- remain review-only and inaccessible to Question Studio, Question Bank and mock tests.

## Authority-specific boundaries

### Gender

The relation-qualified target must require at least two links. The answer remains `MALE` or `FEMALE`. Names alone never establish gender.

### Unordered pair

The correct answer is an unordered pair. Pair order is not part of the answer. Direct married, sibling and parent-child clues remain source evidence but are not sufficient V6 candidates under the competitive gate.

### Complete member set

Every included member must satisfy the requested derived relation, and every omitted or extra member must make an option wrong. This remains distinct from one-person identification.

### Marital-status label

The target member must first be located through a derived relation. Married status needs a spouse edge or explicit fact; unmarried status needs an explicit unmarried fact. Missing spouse information proves nothing.

### Person by marital status

The final person must uniquely satisfy both the relation-domain condition and the marital-status condition. Distractor explanations must state which condition fails.

## Implementation order

```text
wave registry and release lock
  -> V6 deterministic candidate generators
  -> independent answer verification
  -> competitive and premise-leak audit
  -> native SVG path/set rendering
  -> V6 export pack
  -> machine editorial gate
  -> human review
  -> accepted remediation
  -> final-freeze readiness rerun
```

## Machine scope

The current wave boundary is encoded in:

- `cp003-learner-evidence-gap-wave-01.ts`;
- `cp003-learner-evidence-gap-wave-01.test.ts`.

The contract enforces five blocked authorities, at least four candidates per authority, preservation of V5, required human review, zero permanent QLs and all release locks.

## Release lock

```text
approved V5 pack             preserved
candidate pack               V6
human review                 required
final freeze                 disabled
permanent allocation         disabled
BLR-QL-009                   unclaimed
Question Studio              disabled
Question Bank                disabled
mock tests                   disabled
Hindi/Punjabi                not started
public publication           disabled
PR merge                     not authorised
```
