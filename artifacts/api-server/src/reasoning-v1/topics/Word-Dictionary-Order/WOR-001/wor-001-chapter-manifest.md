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
| Implemented classic permanent-root recommendation | 4 |
| Full-chapter permanent-root estimate after CP-005 | 7–8, pending executable compression |
| Provisional prototypes | 19 implemented + CP-005 discovery pending |
| Executable task kinds | 15 implemented |
| Corpus | 30 families / 360 globally unique real words |
| Corpus editorial state | `PROVISIONAL_REVIEW` |
| Content completeness | `INCOMPLETE_FOR_BANKING` |
| Options | Exactly 4 in current runtime; banking 5-option parity unresolved |
| Review packs | Generated per tested commit as CI artifact |
| Question Studio | Adapter implemented; visibility disabled |
| Public release | Disabled |

## Full-chapter audit conclusion

The implemented runtime is strong for classic SSC/Punjab Word & Dictionary Order, but the 2026-08-14 full content-gap audit found a material Banking gap. Banking papers repeatedly use five three-letter word/cluster sets with dictionary ordering embedded in explicit multi-stage operations.

Therefore the four classic roots below remain valid, but they are **not the complete chapter architecture**. Object-pool expansion and final QL freeze are blocked until `WOR-CP-005 — Banking Word/Cluster Sequence Composites` is prototyped and compressed.

See `WOR-001-CONTENT-GAP-AUDIT-V1.md`.

## Implemented classic permanent QL roots

| Root | Authority prototype | Included instance variants | Freeze basis |
| --- | --- | --- | --- |
| Complete dictionary order | `WOR-PROT-001` | reverse order (`002`), hard full-order (`016`) | direct PYQ support for full ordering; reverse is the same comparator with direction reversed |
| Endpoint after ordering | `WOR-PROT-003` | last word (`004`) | direct PYQ support for first/last selection; both are endpoint queries on one sorted sequence |
| Word at a specified position | `WOR-PROT-005` | middle word (`009`), hard kth (`017`) | direct PYQ support for kth-position and middle-word forms |
| Position of a specified word | `WOR-PROT-006` | hard rank (`018`) | direct official-paper reproduction exists; inverse answer semantic from kth-position |

No permanent IDs are assigned yet.

## Missing checkpoint required before chapter freeze

### `WOR-CP-005 — Banking Word/Cluster Sequence Composites`

Required discovery/runtime families:

1. plain five-cluster dictionary sorting with left/right positional queries — merge into existing kth root after adding `LETTER_CLUSTER` object mode;
2. sort -> concatenate -> global character index — new QL candidate;
3. sort -> select ranked word -> local character/alphabet-offset query — new QL candidate;
4. explicit transform-each-word -> dictionary sort -> positional source/transformed-word query — new QL candidate;
5. transform-each-word -> dictionary sort -> local character query — new QL candidate unless executable compression proves safe merge with root 4.

Expected full-chapter permanent QL count after prototype compression: approximately 7–8, not 15+.

## Existing checkpoints

| Checkpoint | Scope | Prototypes | Freeze posture |
| --- | --- | ---: | --- |
| `WOR-CP-001` | Complete ordering and endpoints | 4 | 2 classic QL roots + 2 instance variants |
| `WOR-CP-002` | Position and neighbours | 5 | 2 classic QL roots + 1 instance variant + 2 source-deferred contracts |
| `WOR-CP-003` | Insertion, correction and partial order | 6 | all six `DEFER_SOURCE_GAP` |
| `WOR-CP-004` | Advanced structural discrimination | 4 | all four `INSTANCE_VARIANT_NO_QL` |
| `WOR-CP-005` | Banking word/cluster sequence composites | not implemented yet | **required before full-chapter freeze** |

`RETAIN` means the solve contract remains executable in the discovery taxonomy; it does **not** by itself grant permanent-QL eligibility.

## Content-structure gap to fix during later pool expansion

The current Easy real-word pool is too often solvable by first-letter comparison alone. Pool expansion must add Easy sets with controlled first-letter ties so a meaningful share requires second-letter comparison without becoming Medium/Hard.

## Release gates

1. implement and source-audit `WOR-CP-005`;
2. perform executable QL compression across classic + banking roots;
3. resolve Banking 4-vs-5 option-count parity at exam-profile level;
4. only then expand the real-word and new letter-cluster object pools;
5. human editorial approval of the expanded corpus;
6. human English editorial approval of generated review packs;
7. native Hindi editorial approval;
8. native Punjabi editorial approval;
9. allocate permanent IDs only after the full chapter architecture is frozen;
10. explicit Question Studio activation and public-release approval.
