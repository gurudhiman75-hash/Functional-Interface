# FLR-001 — Final Content Deep-Audit Closure

Date: 2026-10-03

Status: `CONTENT_DEEP_AUDIT_CLOSED__4_QLS__EXACT_FINITE_ENUMERATION__EN_HI_PA__REVIEW_ONLY`

## Chapter boundary

`FLR-001` is the standalone Reasoning V1 implementation of:

`REAS-FLR — Floor and Flat Arrangement`

It owns vertical building puzzles and two-dimensional floor/flat grids.

It does **not** belong to:
- `LP-001` general assignment/grouping puzzles;
- `SEA-001` row/circular seating;
- box-stack puzzles merely because they are vertical;
- `DSF-001` when floor information is only wrapped in a sufficiency task;
- `REAS-GAM` games/tournament reasoning.

The earlier global reconciliation omitted this still-unimplemented blueprint chapter from its frontier. This closure repairs that implementation gap rather than reclassifying Logic Puzzles or Seating Arrangement.

## Permanent QL architecture

### FLR-QL-001 — Single-column floor arrangement

One person per floor.

Owned clue families:
- fixed floor;
- above/below;
- immediately above/below;
- exact floor gap;
- even/odd floor;
- floor exclusion.

Query projection may ask a person's floor or the occupant of a floor. Those are presentation/query projections over the same solved vertical assignment and do not justify separate QLs.

### FLR-QL-002 — Floor + secondary variable

One person per floor plus one bijective secondary attribute.

Current reviewed attribute surface uses study areas, while the solve contract supports the source-backed "floor + variable" family.

This is a separate QL because the learner must jointly solve two linked permutations rather than only one vertical order.

### FLR-QL-003 — Two-flat-per-floor grid

Every flat has exactly one occupant.

The learner must preserve:
- floor number;
- flat number;
- west/east relation on the same floor;
- same-numbered-flat vertical alignment;
- same-floor and different-flat relations;
- vertical gap and parity constraints.

This is materially two-dimensional and must not be collapsed into a one-column floor puzzle.

### FLR-QL-004 — Non-bijective floor-flat capacity

Exactly one flat contains two persons while every other flat contains one.

This requires a different state space because the ordinary one-person-per-flat bijection is false. It has direct previous-year precedent in LIC AAO 2023 and is therefore retained as a separate permanent contract rather than a novelty lane.

Next available permanent identity: `FLR-QL-005`.

## Source evidence reviewed

Repository evidence:
- `lib/motifs/seating-arrangement.ts` already contains floor fixed/gap/parity motifs;
- the shared legacy seating engine already models a `floor` vertical topology;
- `LP-001-SOURCE-SATURATION-AUDIT.md` records uploaded reasoning-reference floor families and explicitly keeps floor/flat ownership outside Logic Puzzles;
- the master blueprint assigns the family to `REAS-FLR`.

External format evidence:
- Oliveboard, 2026: basic floor sets, high-level floor sets and Floor + City variable sets;
- Oliveboard LIC AAO Prelims, 17 Feb 2023 Shift 3: four floors × two flats, one person per flat;
- Oliveboard LIC AAO Prelims, 17 Feb 2023 Shift 2: floor/flat arrangement with one flat containing two people;
- IBPS Guide: recurring Floor with Flat puzzle practice for PO/Clerk prelims.

The runtime copies no source wording. Source evidence is used only to freeze topology, clue and query contracts.

No unsupported claim is made that the family appears at a fixed frequency in SSC, Banking or Punjab examinations.

## Exact solver model

Every emitted question is solved by finite enumeration before delivery.

Closure state spaces:
- simple five-floor arrangement: `5! = 120` worlds;
- five-floor + five-attribute arrangement: `5! × 5! = 14,400` worlds;
- four floors × two flats, bijective occupancy: `8! = 40,320` worlds;
- three floors × two flats with seven people and exactly one shared flat: `6 × C(7,2) × 5! = 15,120` worlds.

A candidate is rejected unless:
- every generated clue is true in the hidden target;
- filtering by all clues leaves exactly one world;
- the surviving world's canonical fingerprint equals the hidden target fingerprint;
- options are distinct;
- the keyed option matches the solved semantic answer.

## Stem and explanation standard

The generic legacy lead `Directions: Study the information...` is not used.

Each stem directly states:
- the building geometry;
- floor numbering convention;
- flat orientation where relevant;
- occupancy rule;
- natural clue sentences;
- the actual query.

Explanations:
- state the appropriate solving frame (vertical stack or floor/flat grid);
- preserve west/east separately from above/below;
- show the solved table;
- identify the requested answer from that solved state.

## Language and difficulty

Languages:
- English;
- Hindi;
- Punjabi.

Difficulty:
- QL001: Easy / Medium;
- QL002: Medium / Hard;
- QL003: Medium / Hard;
- QL004: Hard.

Hindi and Punjabi are rendered from the same canonical solved state, not independently re-solved translations.

## Source holds

The following are **not** silently promoted into permanent core:
- vacant-flat puzzles;
- three-or-more-flats-per-floor grids;
- multiple simultaneous secondary-variable columns beyond the current source-backed core;
- mixed floor + box-stack ownership;
- data-sufficiency wrappers.

These may reopen source discovery later if recurring evidence justifies a new learner contract.

## Lifecycle

Question Studio:
- discoverable: yes;
- deterministic review generation: yes;
- Question Bank writes: no;
- scored-test eligibility: no;
- mock-test eligibility: no;
- public publication: no;
- automatic student publication: no.

Manual editorial/product approval remains a separate release gate.

## Result

`FLR_001_CONTENT_DEEP_AUDIT_CLOSED__4_NON_INFLATED_QLS__EXACT_SOLVER__TRILINGUAL__REVIEW_ONLY`
