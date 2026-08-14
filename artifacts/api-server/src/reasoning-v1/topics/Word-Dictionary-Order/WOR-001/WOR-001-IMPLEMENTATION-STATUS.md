# WOR-001 Implementation Status — Post CP-005

## Current implementation

- five-checkpoint review-only runtime;
- **24 prototypes / 20 executable task kinds**;
- **16 retained executable contracts**;
- **8 recommended permanent QL roots** after compression;
- **8 classic source-deferred retained contracts** that remain review/research only;
- **8 instance variants** that reserve no separate QL;
- 30 real-word families / 360 globally unique `PROVISIONAL_REVIEW` words;
- deterministic Banking five × three-letter cluster constructor for CP-005, with large curated cluster-pool expansion still pending;
- classic explicit A–Z comparator plus independent lexical verifier;
- independent Banking transformation/sort/answer verifier;
- state-derived difficulty for classic and Banking states;
- EN/HI/PA stems and explanations;
- classic four-option and Banking five-option profiles;
- Question Studio review adapter exposes all five checkpoints internally while public visibility remains disabled.

## Recommended permanent QL architecture

```text
CLASSIC
1. Complete dictionary order
2. Endpoint after ordering
3. Word/cluster at a specified position
4. Position of a specified word

BANKING COMPOSITES
5. Sort -> concatenate -> global character
6. Sort -> ranked cluster -> local character / alphabet offset
7. Transform each -> sort -> positional word query
8. Transform each -> sort -> local character query
```

`WOR-PROT-020` (plain Banking three-letter clusters with positional query) merges into classic root 3 because its answer/solver contract is the same kth-position contract with a different object mode.

Permanent IDs remain unallocated.

## CP-005 implemented prototypes

| Prototype | Task | Allocation | Options | Difficulty |
| --- | --- | --- | ---: | --- |
| `WOR-PROT-020` | plain three-letter clusters → positional word query | instance variant of root 3 | 5 | E/M/H |
| `WOR-PROT-021` | sort → concatenate → global character | new root candidate | 5 | M/H |
| `WOR-PROT-022` | sort → ranked cluster → local character/offset | new root candidate | 5 | M/H |
| `WOR-PROT-023` | transform each → sort → position | new root candidate | 5 | M/H |
| `WOR-PROT-024` | transform each → sort → local character | new root candidate | 5 | M/H |

All five are tagged `PYQ_SUPPORTED` in the implementation registry based on the chapter content-gap/source audit.

## Banking transformation library

- `SWAP_FIRST_SECOND`;
- `SWAP_FIRST_LAST`;
- `SORT_LETTERS_ASC`;
- `SHIFT_FIRST_PREVIOUS`;
- `SHIFT_FIRST_NEXT`;
- `NONE` for non-transform composite forms.

Transformation results are required to remain unique; collisions trigger deterministic bounded resampling. Original ↔ transformed token mapping is preserved so a question can correctly ask for either representation.

## Automated evidence

### Classic audit

- 19 classic prototypes;
- 6,840 localized generations;
- answer positions `[570, 570, 570, 570]`;
- all 30 real-word families reached;
- independent solver parity maintained.

### CP-005 Banking audit

- 5 prototypes;
- **1,980 localized generations**;
- five-option answer-position counts `[129, 130, 134, 131, 136]`;
- all five Banking task kinds covered;
- all five explicit transformation operators plus `NONE` covered;
- Easy/Medium/Hard coverage where each prototype permits it;
- deterministic EN/HI/PA parity;
- independent transformation, ordering and answer agreement.

The CI run on commit `49977d468bae830e3dd2d2c81fd36ec08eefc28d` passed the classic audit, CP-005 Banking audit, source governance, corpus audit, 12-file review export and API production build.

## Content-model status

`ARCHITECTURE_COMPLETE_POOL_EXPANSION_PENDING`

The major Banking taxonomy gap found in `WOR-001-CONTENT-GAP-AUDIT-V1.md` is now implemented. The remaining major content work is **object-pool breadth and editorial approval**, not another known solve-family gap.

## Next phase

1. expand real-word pool beyond 360 while preserving familiarity and structural tiering;
2. build a large reviewed Banking three-letter cluster pool instead of relying only on the structural generator;
3. remodel Easy pool so a meaningful fraction requires second-letter comparison;
4. add repetition/saturation gates across both object modes;
5. regenerate classic + Banking review packs;
6. English editorial review;
7. native Hindi/Punjabi review;
8. allocate the eight permanent QL IDs only after those gates pass.

Lifecycle remains `REVIEW_ONLY`; permanent QLs remain 0; public Question Studio/mock-test release remains disabled.
