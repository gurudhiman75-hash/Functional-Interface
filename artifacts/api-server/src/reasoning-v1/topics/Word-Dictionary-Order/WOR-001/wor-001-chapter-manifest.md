# WOR-001 Chapter Manifest

| Field | Value |
| --- | --- |
| Product code | `REAS-WOR` |
| Chapter | `WOR-001` |
| Title | Word & Dictionary Order |
| Family | Relational / Positional Reasoning |
| Runtime | `WOR-001-RUNTIME-V1` |
| Renderer | `STRUCTURED_TEXT` |
| Locales | `en-IN`, `hi-IN`, `pa-IN` |
| Locale mode | `TRANSLATABLE` |
| Lifecycle | `REVIEW_ONLY` |
| Permanent QLs | 0 |
| Provisional prototypes | 19 |
| Distinct solve contracts | 15 |
| Corpus | 30 families / 360 globally unique words |
| Corpus editorial state | `PROVISIONAL_REVIEW` |
| Source evidence | Mixed: `PYQ_SUPPORTED`, `PLATFORM_SUPPORTED`, `EXPLORATORY_SOURCE_GAP` |
| Options | Exactly 4 |
| Review packs | Generated per tested commit as CI artifact |
| Question Studio | Adapter implemented; visibility disabled |
| Public release | Disabled |

## Checkpoints

| Checkpoint | Scope | Prototypes | Source status |
| --- | --- | ---: | --- |
| `WOR-CP-001` | Complete ordering and endpoints | 4 | core patterns source-backed |
| `WOR-CP-002` | Position and neighbours | 5 | mixed support; predecessor/successor remain source gaps |
| `WOR-CP-003` | Insertion, correction and partial order | 6 | all six remain `EXPLORATORY_SOURCE_GAP` |
| `WOR-CP-004` | Advanced structural discrimination | 4 | merge-as-instance variants; inherited source status |

The four CP-004 prototypes are executable hard-structure variants. Their allocation decision is `MERGE_AS_INSTANCE_VARIANT`; they do not reserve permanent QLs. The other 15 prototypes are retained solve-contract candidates, but `EXPLORATORY_SOURCE_GAP` contracts are not freeze-ready.

## Release gates

1. saturate source evidence for `EXPLORATORY_SOURCE_GAP` contracts or merge/remove them;
2. editorial approval of the 360-word provisional corpus;
3. English editorial approval of generated review packs;
4. native Hindi editorial approval;
5. native Punjabi editorial approval;
6. permanent QL merge/split decision;
7. explicit Question Studio activation;
8. explicit public-release approval.
