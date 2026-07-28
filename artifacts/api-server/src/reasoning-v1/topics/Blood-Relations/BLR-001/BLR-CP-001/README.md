# BLR-CP-001 — Direct Named-Person Relations

Status: **English discovery frozen; seven permanent review-only QLs allocated; release surfaces locked**.

Freeze version: `BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1`

Permanent range: `BLR-QL-001..007`

## Frozen solve authorities

| QL | Authority |
|---|---|
| `BLR-QL-001` | resolve a named person's relation to another named person |
| `BLR-QL-002` | identify the unique person having a requested relation |
| `BLR-QL-003` | identify the unique male or female from relation evidence |
| `BLR-QL-004` | identify an ordered pair having a requested relation |
| `BLR-QL-005` | select a relation claim matching the requested truth value |
| `BLR-QL-006` | compare generation positions |
| `BLR-QL-007` | resolve an exact maternal or paternal relation |

The seven identities are frozen from eleven exploratory prototypes. Direct/reverse direction, path length, linear/branching topology, claim polarity, target gender, maternal/paternal side, names, clue order, renderer and difficulty remain generated-instance properties.

## Relation coverage

The shared graph runtime supports:

- father, mother, son, daughter;
- brother, sister, husband, wife;
- grandfather, grandmother, grandson, granddaughter;
- great-grandfather, great-grandmother, great-grandson, great-granddaughter;
- uncle, aunt, nephew, niece and cousin;
- father-in-law, mother-in-law, son-in-law and daughter-in-law;
- brother-in-law and sister-in-law through both spouse/sibling path orders;
- exact paternal/maternal grandfather, grandmother, uncle and aunt.

## Runtime contract

Low-level generators construct valid family graphs, deterministic Indian names, structured prompts and four misconception-labelled options. Independent solvers reconstruct the graph only from displayed clues and must agree before a question is emitted.

The canonical learner-facing layer then adds:

1. compact exam-authentic stems;
2. gender and generation concepts;
3. ASCII family-tree grids;
4. explicit `ΔGen` arithmetic;
5. maternal/paternal branch teaching;
6. ten-second shortcuts;
7. option-specific distractor explanations.

The permanent wrapper exposes `qlId` and `permanentQlId`, removes prototype identity from the top level and retains source-prototype provenance only in review metadata.

## Completed audit sequence

- first source and boundary audit;
- eleven executable exploratory prototypes;
- deterministic and independent-solver proofs;
- merge/split and inverse-contract audit;
- 440-question machine editorial gate;
- external review of the 88-record English pack;
- 440-question human-audit remediation gate;
- second source and gap audit;
- great-generation gap closure;
- final discovery-freeze gate;
- 1,024-question permanent-runtime proof.

## Current executable surface

```text
prototype.test.ts                         400 questions
advanced-prototype.test.ts                500 questions
lineage-prototype.test.ts                 240 questions
cp001-editorial-review.test.ts            440 questions
cp001-human-audit-remediation.test.ts     440 questions
cp001-second-source-gap.test.ts           512 questions
cp001-runtime.test.ts                   1,024 questions
-------------------------------------------------------
current deterministic workflow          3,556 questions
```

The final freeze test additionally verifies the exact prototype, authority, ownership and identity snapshots.

## Review artifacts

The workflow exports one frozen artifact containing:

- the 88-record exploratory/remediated review pack;
- the sixteen-record great-generation appendix;
- the 56-record permanent `BLR-QL-001..007` review pack;
- HTML, CSV, JSONL and summary JSON files.

## Authoritative records

1. `BLR-CP-001-SOURCE-SATURATION-AUDIT.md`;
2. `BLR-CP-001-MERGE-SPLIT-AUDIT-V1.md`;
3. `BLR-CP-001-HUMAN-AUDIT-REMEDIATION-V2.md`;
4. `BLR-CP-001-SECOND-SOURCE-GAP-AUDIT.md`;
5. `BLR-CP-001-FINAL-DISCOVERY-FREEZE.md`;
6. `../BLR-001-MANIFEST-AMENDMENT-CP001.md`.

## Ownership boundary

- CP-001: direct declarative named-person relations;
- CP-002: pointer, photograph, conversation and nested self-reference;
- CP-003: shared family passages;
- CP-004: counts and family composition;
- CP-005: possible, impossible, one-of-two and indeterminate answers;
- CP-006/007: coded relation decoding and construction;
- Puzzle/Data Sufficiency: excluded wrappers.

## Release lock

- permanent QLs: `BLR-QL-001..007`;
- next available BLR-001 ID: `BLR-QL-008`;
- English review-only: true;
- Question Studio: disabled;
- Question Bank: disabled;
- mock-test eligibility: disabled;
- public publication: disabled;
- Hindi and Punjabi: not started.
