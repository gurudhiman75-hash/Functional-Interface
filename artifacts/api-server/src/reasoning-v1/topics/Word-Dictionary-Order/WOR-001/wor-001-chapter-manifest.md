# WOR-001 Chapter Manifest

| Field | Value |
| --- | --- |
| Product code | `REAS-WOR` |
| Chapter | `WOR-001` |
| Title | Word & Dictionary Order |
| Family | Relational / Positional Reasoning |
| Runtime | classic `WOR-001-RUNTIME-V1` + Banking `WOR-001-RUNTIME-V2-BANKING` |
| Renderer | `STRUCTURED_TEXT` |
| Locales | `en-IN`, `hi-IN`, `pa-IN` |
| Locale mode | `TRANSLATABLE` |
| Lifecycle | `REVIEW_ONLY` |
| Permanent QLs | 0 allocated |
| Recommended permanent QL roots | **8** |
| Provisional prototypes | **24** |
| Executable task kinds | **20** |
| Retained executable contracts | **16** |
| Source-deferred retained contracts | **8** |
| Instance variants with no separate QL | **8** |
| Real-word corpus | 30 families / 360 globally unique provisional words |
| Banking cluster mode | deterministic five × three-letter `LETTER_CLUSTER` builder; curated expansion pending |
| Classic option profile | 4 |
| Banking CP-005 option profile | 5 |
| Content-model status | `ARCHITECTURE_COMPLETE_POOL_EXPANSION_PENDING` |
| Question Studio | review adapter implemented; visibility disabled |
| Public release | Disabled |

## Recommended permanent QL roots

### Classic lexical core

| Root | Authority prototype | Included variants |
| --- | --- | --- |
| Complete dictionary order | `WOR-PROT-001` | reverse order (`002`), hard full-order (`016`) |
| Endpoint after ordering | `WOR-PROT-003` | last word (`004`) |
| Word/cluster at a specified position | `WOR-PROT-005` | middle (`009`), hard kth (`017`), Banking plain-cluster position (`020`) |
| Position of a specified word | `WOR-PROT-006` | hard rank (`018`) |

### Banking composite core

| Root | Authority prototype | Solve contract |
| --- | --- | --- |
| Sort → concatenate → global character | `WOR-PROT-021` | dictionary sort five clusters, concatenate, index a character from left/right |
| Sort → ranked cluster → local character | `WOR-PROT-022` | normal/reverse sort, choose ranked cluster, read local character, optional alphabet offset |
| Transform each → sort → position | `WOR-PROT-023` | explicit per-cluster transformation, dictionary sort, answer original/transformed cluster at a position |
| Transform each → sort → local character | `WOR-PROT-024` | explicit per-cluster transformation, dictionary sort, then local character query |

No permanent IDs are assigned yet. `WOR-PROT-020` is deliberately merged into the existing kth-position root because the learner contract is unchanged; only the object mode changes from meaningful words to three-letter clusters.

## Checkpoints

| Checkpoint | Scope | Prototypes | Freeze posture |
| --- | --- | ---: | --- |
| `WOR-CP-001` | Complete ordering and endpoints | 4 | 2 roots + 2 instance variants |
| `WOR-CP-002` | Position and neighbours | 5 | 2 roots + 1 instance variant + 2 source-deferred contracts |
| `WOR-CP-003` | Insertion, correction and partial order | 6 | all six `DEFER_SOURCE_GAP` |
| `WOR-CP-004` | Advanced common-prefix discrimination | 4 | all four instance variants |
| `WOR-CP-005` | Banking word/cluster sequence composites | 5 | 4 new root candidates + 1 instance variant |

## CP-005 transformation operators

The implemented explicit transformation library currently proves the composite architecture with:

- `SWAP_FIRST_SECOND`;
- `SWAP_FIRST_LAST`;
- `SORT_LETTERS_ASC`;
- `SHIFT_FIRST_PREVIOUS`;
- `SHIFT_FIRST_NEXT`.

The generator preserves original-token ↔ transformed-token mapping and verifies transformation, sort order and final answer through an independent composite solver.

## Release gates

1. expand and editorially review the real-word pool and Banking cluster pool;
2. improve Easy real-word sets so a meaningful share requires second-letter comparison rather than first-letter-only sorting;
3. run repetition/saturation audits on the expanded pools;
4. human English editorial approval of classic + Banking review packs;
5. native Hindi editorial approval;
6. native Punjabi editorial approval;
7. allocate permanent IDs only to the eight recommended roots after editorial acceptance;
8. explicit Question Studio activation;
9. explicit public-release approval.

The eight classic source-deferred insertion/correction/neighbour contracts remain executable for research/review but do not reserve permanent QLs.
