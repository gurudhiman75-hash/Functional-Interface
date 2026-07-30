# BLR-CP-003 — Family-Set Passages and Shared Graphs

Status: **native SVG competitive review V5 approved and validated; final discovery freeze blocked by five learner-evidence gaps; zero permanent QLs**.

## Ownership

This checkpoint owns pure-kinship shared passages. One hidden family graph yields one clue block, and clue-only reconstruction supports independently solved relation, lineage, generation and claim questions.

## Technical discovery inventory

```text
Executable discovery scenarios                8
Temporary item handles                       18
Temporary group-assembly handles              1
Deterministic groups                        760
Independently solved items                4,940
Permanent QLs                                 0
```

These figures remain technical discovery evidence. They are not frozen.

## Approved English review candidate — V5

```text
V3 source records                         208
Source records passing V4 gate            116
Rejected source records                    92
Derived supplemental replacements          12
------------------------------------------------
Active V5 learner-review records           128
Shared-family passage sets                  32
Questions per passage                      3–6
Answer positions              [35, 33, 29, 31]
Native SVG diagrams                        128
Highlighted answer paths                  128
ASCII fallbacks                            128
```

Every active question requires a two-edge-or-more derivation, zero answer-premise repetition, a native SVG family tree, ASCII fallback, four-tier teacher voice, friendly distractor warnings and reverse-direction explanation where applicable.

## Accepted sibling-arrow route

The original marker-only horizontal line did not point clearly to the sibling cards. It was replaced with a dotted bracket:

```text
          ↑ sibling A                  sibling B ↑
          └·········· SIBLINGS ··········┘
```

The accepted route:

- targets the inner bottom edge of each sibling card;
- stays away from central parent-child lineage lines;
- fixes both arrowheads upward with `orient="-90"`;
- leaves an 8-pixel visible clearance beneath each card;
- contains 56 routed sibling segments;
- contains zero legacy horizontal dotted sibling lines.

The corrected HTML and exact-head geometry gate are accepted. The visual-polish condition is closed.

## Performance contract

```text
external graph library          no
D3 or Mermaid runtime           no
database migration              no
stored image                    no
main-bundle leakage             false
average diagram payload         2,276 bytes
hard payload limit             12,000 bytes
```

The renderer is lazy-loaded only when a structured family-tree solution is shown. CI rejects missing or main-bundle renderers, oversized chunks and any drift in inner-card targeting, upward arrow orientation or visible clearance.

## Compression hypothesis

```text
Handles merged into frozen QLs        10
Provisional new handles                 8
Provisional new solve authorities       6
Assembly-only handles                   1
Permanent CP-003 QLs                    0
```

Provisional new authorities:

```text
DETERMINE_MEMBER_GENDER
SELECT_UNORDERED_FAMILY_PAIR
IDENTIFY_ALL_MEMBERS_BY_RELATION
DETERMINE_MEMBER_MARITAL_STATUS
IDENTIFY_MEMBER_BY_MARITAL_STATUS
IDENTIFY_PERSON_BY_EXACT_LINEAGE
```

## Final-freeze readiness result

The V5 active learner pack does not support all six provisional authorities:

```text
learner-supported provisional authorities      1
blocked provisional authorities                5
final discovery freeze ready                false
```

`IDENTIFY_PERSON_BY_EXACT_LINEAGE` has eight active V5 records. The other five provisional authorities occur only in rejected source records and therefore cannot receive permanent QLs yet.

The machine-enforced decision is recorded in:

- `BLR-CP-003-FINAL-FREEZE-READINESS-AUDIT.md`;
- `cp003-final-freeze-readiness.ts`;
- `cp003-final-freeze-readiness.test.ts`.

## Semantic boundaries

```text
named spouse edge or explicit married fact -> MARRIED
explicit unmarried fact                    -> UNMARRIED
missing spouse edge alone                  -> no status conclusion
marriage alone                              -> no co-parent conclusion
joint-parent wording                        -> both parent edges required
unstated gender                             -> no hidden learner inference
```

Family counts and composition remain owned by BLR-CP-004. Possibility and cannot-determine semantics remain owned by BLR-CP-005.

## Remaining mandatory work

- run a targeted learner-evidence gap wave for the five blocked authorities;
- retain each authority with competitive reviewed evidence, or remove/delegate it explicitly;
- rerun all affected deterministic, editorial, SVG and source-gap gates;
- obtain human review for every added learner-facing record;
- rerun the final-freeze readiness audit;
- allocate sequential QLs only after the audit reports ready.

## Release boundary

- English review-only: true;
- human review: approved for V5;
- visual-polish condition: closed;
- final discovery freeze: blocked;
- permanent CP-003 QLs: 0;
- `BLR-QL-009`: unclaimed;
- Question Studio visibility: disabled;
- Question Bank eligibility: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled;
- PR merge: not authorised.
