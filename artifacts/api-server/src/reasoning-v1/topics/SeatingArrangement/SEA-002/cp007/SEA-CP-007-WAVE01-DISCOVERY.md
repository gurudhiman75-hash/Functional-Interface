# SEA-CP-007 — Wave 01 non-uniform facing discovery

Status: **DISCOVERY ONLY — NO PERMANENT QL ALLOCATION**

## Ownership

SEA-CP-007 owns parallel-row seating where the CP006 fixed-facing invariant does not hold.

In scope for this first executable wave:

1. both rows facing the same direction;
2. individually mixed north/south facing with person-relative left/right;
3. facing-direction inference for physically opposite positions.

Held for later CP007 waves until source saturation proves independent solve authority:

- partial facing information combined with longer positional chains;
- row membership and facing jointly inferred;
- mixed-facing gap/equal-gap chains;
- diagonal relations whose interpretation depends on inferred facing;
- statement/assumption or data-sufficiency wrappers;
- hypothetical exchange/rotation questions.

CP006 remains owner of two equal rows with upper row uniformly south and lower row uniformly north. CP007 must not mutate or reinterpret the frozen CP006 authority.

## Temporary prototypes

- `SEA-CP007-PROT-001` — same-direction parallel rows, person-relative immediate left/right;
- `SEA-CP007-PROT-002` — mixed individual facing explicitly supplied, person-relative immediate left/right;
- `SEA-CP007-PROT-003` — facing inference across physically opposite positions.

Prototype IDs are temporary discovery identities and are **not** permanent QLs. `SEA-QL-025` remains next-free only.

## Coordinate convention

Internal positions run left-to-right from the observer. Facing north means a person's right is the next higher internal position; facing south reverses left/right. Learner-facing prose uses **position**, never `column`.

## Wave 01 proof target

The executable audit must cover all three prototypes across widths 3+3 through 6+6 and require:

- deterministic replay;
- valid full occupancy with unique participants;
- independent relation self-checks;
- exactly four unique options and one correct option;
- all four answer positions over the corpus;
- state diversity per prototype;
- same-direction direction reversal represented;
- mixed-facing north and south references represented;
- all product lifecycle gates closed;
- zero permanent QL allocation.

This wave is intentionally not a permanent merge/split decision. Source saturation and deeper chain composition come next.
