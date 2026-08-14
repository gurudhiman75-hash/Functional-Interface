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
| Options | Exactly 4 |
| Question Studio | Adapter implemented; visibility disabled |
| Public release | Disabled |

## Checkpoints

| Checkpoint | Scope | Prototypes |
| --- | --- | ---: |
| `WOR-CP-001` | Complete ordering and endpoints | 4 |
| `WOR-CP-002` | Position and neighbours | 5 |
| `WOR-CP-003` | Insertion, correction and partial order | 6 |
| `WOR-CP-004` | Advanced structural discrimination | 4 |

The four CP-004 prototypes are executable hard-structure variants. Their allocation decision is `MERGE_AS_INSTANCE_VARIANT`; they do not reserve permanent QLs. The other 15 prototypes are retained solve-contract candidates pending source and editorial review.

## Release gates

1. external competitive-exam source audit;
2. English editorial approval;
3. native Hindi editorial approval;
4. native Punjabi editorial approval;
5. permanent QL merge/split decision;
6. explicit Question Studio activation;
7. explicit public-release approval.
