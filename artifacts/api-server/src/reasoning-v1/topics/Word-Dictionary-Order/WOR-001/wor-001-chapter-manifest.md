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
| Freeze-eligible retained contracts | 7, after editorial gates |
| Retained contracts deferred for source gap | 8 |
| Instance variants with no separate QL | 4 |
| Corpus | 30 families / 360 globally unique words |
| Corpus editorial state | `PROVISIONAL_REVIEW` |
| Source evidence | Mixed: `PYQ_SUPPORTED`, `PLATFORM_SUPPORTED`, `EXPLORATORY_SOURCE_GAP` |
| Options | Exactly 4 |
| Review packs | Generated per tested commit as CI artifact |
| Question Studio | Adapter implemented; visibility disabled |
| Public release | Disabled |

## Checkpoints

| Checkpoint | Scope | Prototypes | Freeze posture |
| --- | --- | ---: | --- |
| `WOR-CP-001` | Complete ordering and endpoints | 4 | retained source-backed candidates |
| `WOR-CP-002` | Position and neighbours | 5 | 3 retained candidates; predecessor/successor source-deferred |
| `WOR-CP-003` | Insertion, correction and partial order | 6 | all six `DEFER_SOURCE_GAP` |
| `WOR-CP-004` | Advanced structural discrimination | 4 | `INSTANCE_VARIANT_NO_QL` |

`RETAIN` means the solve contract remains executable in the discovery taxonomy; it does **not** by itself grant permanent-QL eligibility. Freeze posture is derived from source evidence and instance-variant status. The four CP-004 prototypes never reserve separate QLs.

## Release gates

1. saturate source evidence for `DEFER_SOURCE_GAP` contracts or merge/remove them;
2. editorial approval of the 360-word provisional corpus;
3. English editorial approval of generated review packs;
4. native Hindi editorial approval;
5. native Punjabi editorial approval;
6. permanent QL merge/split decision for the 7 currently eligible retained contracts;
7. explicit Question Studio activation;
8. explicit public-release approval.
