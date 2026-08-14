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
| Permanent QLs | 0 allocated |
| Recommended permanent QL roots | 4 |
| Provisional prototypes | 19 |
| Executable task kinds | 15 |
| Retained executable contracts | 12 |
| Freeze-eligible QL roots | 4, after human editorial gates |
| Retained contracts deferred for source gap | 8 |
| Instance variants with no separate QL | 7 |
| Corpus | 30 families / 360 globally unique words |
| Corpus editorial state | `PROVISIONAL_REVIEW` |
| Source evidence | Mixed: `PYQ_SUPPORTED`, `PLATFORM_SUPPORTED`, `EXPLORATORY_SOURCE_GAP` |
| Options | Exactly 4 |
| Review packs | Generated per tested commit as CI artifact |
| Question Studio | Adapter implemented; visibility disabled |
| Public release | Disabled |

## Recommended permanent QL roots

| Root | Authority prototype | Included instance variants | Freeze basis |
| --- | --- | --- | --- |
| Complete dictionary order | `WOR-PROT-001` | reverse order (`002`), hard full-order (`016`) | direct PYQ support for full ordering; reverse is the same comparator with direction reversed |
| Endpoint after ordering | `WOR-PROT-003` | last word (`004`) | direct PYQ support for first/last selection; both are endpoint queries on one sorted sequence |
| Word at a specified position | `WOR-PROT-005` | middle word (`009`), hard kth (`017`) | direct PYQ support for kth-position and middle-word forms |
| Position of a specified word | `WOR-PROT-006` | hard rank (`018`) | established platform pattern; distinct input-output direction from kth-position |

No permanent IDs are assigned yet. These four roots are the recommended freeze architecture after source and editorial remediation; allocation remains blocked until human English/Hindi/Punjabi review is accepted.

## Checkpoints

| Checkpoint | Scope | Prototypes | Freeze posture |
| --- | --- | ---: | --- |
| `WOR-CP-001` | Complete ordering and endpoints | 4 | 2 QL roots + 2 instance variants |
| `WOR-CP-002` | Position and neighbours | 5 | 2 QL roots + 1 instance variant + 2 source-deferred contracts |
| `WOR-CP-003` | Insertion, correction and partial order | 6 | all six `DEFER_SOURCE_GAP` |
| `WOR-CP-004` | Advanced structural discrimination | 4 | all four `INSTANCE_VARIANT_NO_QL` |

`RETAIN` means the solve contract remains executable in the discovery taxonomy; it does **not** by itself grant permanent-QL eligibility. Freeze posture is derived from source evidence and instance-variant status.

## Release gates

1. keep the 8 `DEFER_SOURCE_GAP` contracts out of permanent allocation unless new recurring exam evidence is established;
2. human editorial approval of the 360-word provisional corpus;
3. human English editorial approval of generated review packs;
4. native Hindi editorial approval;
5. native Punjabi editorial approval;
6. allocate permanent IDs only to the four recommended QL roots after those editorial gates pass;
7. explicit Question Studio activation;
8. explicit public-release approval.
