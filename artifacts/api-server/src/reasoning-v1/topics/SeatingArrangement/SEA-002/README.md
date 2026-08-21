# SEA-002 — Parallel Rows, Polygonal and Multi-Ring Seating

Status: **CP006 TECHNICALLY COMPLETE / SIGNED ENGLISH FREEZE PENDING; CP007–CP010 NOT STARTED HERE**

SEA-002 is the advanced-topology package in `REAS-SEA`.

## Approved V3 checkpoint boundary

| Checkpoint | Ownership | Current status |
|---|---|---|
| `SEA-CP-006` | Two parallel rows facing each other | technically complete; pinned English review awaiting signed approval |
| `SEA-CP-007` | Parallel rows with mixed, same-direction or otherwise non-uniform facing | not implemented in this branch |
| `SEA-CP-008` | Square seating | not implemented in this branch |
| `SEA-CP-009` | Rectangular and regular-polygon seating | not implemented in this branch |
| `SEA-CP-010` | Concentric circles and dual-group seating | not implemented in this branch |

## CP006 retained solve authorities

- `SEA-PBA-021` — fixed row membership with opposites
- `SEA-PBA-022` — row membership partly inferred
- `SEA-PBA-023` — same-row chains linked by opposite seats
- `SEA-PBA-024` — opposite/not-opposite/diagonal/endpoint mix

No merge or split is justified by the completed CP006 saturation and source audit. These remain provisional authority IDs until the signed English-review gate permits permanent QL allocation.

## CP006 topology and source contract

- two equal rows of 3–6 seats;
- upper row faces south; lower row faces north;
- observer-column coordinates with exact corresponding/opposite seats;
- person-relative left/right from the reference person's facing;
- diagonal = other row plus one adjacent column;
- exact gap/adjacency, minimum gap, equal-gap comparison and not-adjacent;
- endpoint and nth-from-either-end domains;
- nested `person facing X` relative composition;
- scalable production solver plus independently implemented audit oracle;
- unique-arrangement enforcement;
- compact source-essential exam generation separated from the all-semantics audit bundle;
- white-background dynamic solved-row SVG for 3–6 columns.

## CP006 retained query inventory

No new query IDs are introduced:

`SEA-QC-003`, `SEA-QC-006`, `SEA-QC-008`, `SEA-QC-010`, `SEA-QC-011`, `SEA-QC-012`, `SEA-QC-014`, `SEA-QC-015`.

`SEA-QC-008` is the ordinary linear persons-between count. `SEA-QC-009` is cyclic directional counting and is intentionally excluded from CP006.

## Completion evidence

The CI gate requires all of the following:

- baseline 3+3 discovery proof;
- 4+4 / 5+5 / 6+6 width proof;
- source-semantic proof including equal-gap and source query families;
- 320-caselet saturation, inverse and metamorphic completion proof;
- 320-caselet compact source-essential exam-real proof;
- deterministic balanced 100-caselet English review-corpus proof;
- export and successful upload of the pinned English review artifact.

The pinned review fingerprint is:

`58b48161ce40f9fff38b0d36b855659bc99eeca8163de287e219f3e9875dbfa2`

See `cp006/CP006-SOURCE-REALNESS-AUDIT.md` for the detailed closure evidence.

## Lifecycle locks

Technical implementation is complete, but permanent allocation remains gated by signed review of the exact pinned English artifact.

```text
permanent QLs              none
English freeze             false
Hindi/Punjabi freeze       false
Question Studio registered false
Question Bank writable     false
mock-test eligible         false
production staging         false
public delivery            false
```

After signed approval of the pinned English artifact, permanent QL allocation/freeze can proceed as a separate governance commit. Localisation and product activation remain separate downstream gates.
