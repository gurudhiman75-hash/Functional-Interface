# WOR-CP-005 — Banking Word/Cluster Sequence Composites

Status: `IMPLEMENTED_REVIEW_ONLY`

## Purpose

CP-005 closes the Banking content gap identified by the full WOR-001 audit: five three-letter groups with dictionary ordering embedded in an explicit multi-stage pipeline.

## Implemented prototypes

| Prototype | Contract | QL posture |
| --- | --- | --- |
| `WOR-PROT-020` | plain five-cluster sort → positional cluster | merge into classic kth-position root |
| `WOR-PROT-021` | sort → concatenate → global character | new root candidate |
| `WOR-PROT-022` | sort → ranked cluster → local character / alphabet offset | new root candidate |
| `WOR-PROT-023` | explicit transform each → sort → positional original/transformed cluster | new root candidate |
| `WOR-PROT-024` | explicit transform each → sort → local character | new root candidate |

All five are `PYQ_SUPPORTED` in the registry and use a five-option Banking profile.

## Object model

- exactly five unique A–Z groups;
- exactly three letters per group;
- deterministic generation;
- Easy/Medium/Hard shared-prefix structure;
- logic tokens unchanged across EN/HI/PA;
- current structural generator is a prototype pool, not the final curated large cluster bank.

## Explicit transformation operators

- swap first/second;
- swap first/last;
- sort letters inside each cluster alphabetically;
- shift first letter to immediately preceding alphabet letter;
- shift first letter to immediately following alphabet letter.

Transformation collisions are rejected/resampled. The original ↔ transformed mapping is preserved.

## Independent verification

The Banking verifier does not call the generator transformation functions. It independently:

1. reconstructs each transformation;
2. independently sorts transformed tokens;
3. rebuilds source/transformed mapping;
4. performs the positional/local/global character query;
5. requires exact answer agreement.

## First full automated proof

GitHub Actions run `31802942207`, head `49977d468bae830e3dd2d2c81fd36ec08eefc28d`:

```text
prototypes: 5
retained new roots: 4
localized generations: 1980
five-option answer positions: [129, 130, 134, 131, 136]
task kinds covered: 5 / 5
explicit transforms covered: 5 / 5 plus NONE
API build: PASS
```

The same workflow also passed the unchanged 6,840-generation classic audit, source governance, 360-word corpus audit and generated 12 review files across classic/Banking EN/HI/PA Markdown+JSON packs.

## Remaining gates

- expand/review the Banking cluster content pool;
- chapter-wide real-word pool expansion;
- human English editorial review;
- native Hindi/Punjabi review;
- permanent QL allocation;
- Question Studio/public activation.
