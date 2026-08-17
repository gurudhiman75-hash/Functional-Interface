# WOR-001 Chapter Manifest

| Field | Value |
| --- | --- |
| Product code | `REAS-WOR` |
| Chapter | `WOR-001` |
| Title | Word & Dictionary Order |
| Runtime | classic `WOR-001-RUNTIME-V1` + Banking `WOR-001-RUNTIME-V2-BANKING` |
| Locales | `en-IN`, `hi-IN`, `pa-IN` |
| Lifecycle | `REVIEW_ONLY` |
| Permanent QLs | 0 allocated |
| Recommended permanent QL roots | **8** |
| Provisional prototypes | **24** |
| Executable task kinds | **20** |
| Source-deferred retained contracts | **8** |
| Instance variants with no separate QL | **8** |
| Real-word corpus | **60 families / 720 globally unique provisional words** |
| Real-word tier split | **18 Easy / 20 Medium / 22 Hard families** |
| Banking cluster corpus | **60 families / 720 globally unique three-letter clusters** |
| Banking tier split | **20 Easy / 20 Medium / 20 Hard families** |
| Classic option profile | 4 |
| Banking CP-005 option profile | 5 |
| Content-model status | `ARCHITECTURE_COMPLETE_EXPANDED_POOLS_REVIEW_ONLY` |
| Question Studio | review adapter implemented; visibility disabled |
| Public release | Disabled |

## Permanent-root recommendation

1. complete dictionary order;
2. endpoint after ordering;
3. word/cluster at a specified position;
4. position of a specified word;
5. sort → concatenate → global character;
6. sort → ranked cluster → local character/alphabet offset;
7. transform each → sort → positional word/cluster;
8. transform each → sort → local character.

`WOR-PROT-020` remains an instance of root 3 because changing from real words to three-letter clusters does not change the solve contract.

## Pool-expansion contract

### Real words

The authoritative registry now contains 720 unique A–Z words in 60 twelve-word families. The original 360-word corpus remains intact as the baseline; 360 additional objects are layered on top. Easy expansion deliberately adds paired first-letter groups so the tier is no longer dominated by trivial first-character sorting. Medium additions use moderate shared prefixes. Hard additions use dense root/prefix families with familiar vocabulary rather than obscure padding.

CI evidence on the expansion head records an Easy shared-prefix question rate of **32.2%** while keeping all generated questions inside the state-derived Easy band.

### Banking clusters

The Banking reservoir contains 720 globally unique, shift-safe (`B`–`Y`) three-letter clusters in 60 twelve-token families. Generation samples five objects from one difficulty-matched family.

Structural family rules are explicit:

- Easy: selected groups have distinct first letters;
- Medium: selected groups contain first-letter ties;
- Hard: selected groups share the first letter and require deeper comparison.

The existing deterministic retry path rejects any transformed five-token set that collides after a transformation such as `SORT_LETTERS_ASC`.

## Saturation evidence

The expanded real-word audit checks exact counts, global token/ID uniqueness, all-family reachability, >90% visible-set uniqueness over 900 seeds per tier, bounded single-word exposure, and Easy shared-prefix realism.

The Banking pool audit checks exact counts, shift safety, all-family reachability and >=95% visible-set uniqueness over 1,000 seeds per tier. Observed unique visible sets were:

- Easy: **974 / 1000**;
- Medium: **963 / 1000**;
- Hard: **975 / 1000**.

Classic multilingual generation, Banking composite generation, source governance, review-pack export and the API production build all pass with the expanded pools.

## Release gates

1. human editorial review of the 720 real-word objects, with removal/replacement of any vocabulary judged awkward for student-facing use;
2. human English review of generated classic + Banking packs;
3. native Hindi review;
4. native Punjabi review;
5. allocate permanent IDs only to the eight recommended roots after editorial acceptance;
6. explicit Question Studio activation;
7. explicit public-release approval.

The eight classic source-deferred insertion/correction/neighbour contracts remain executable for research/review but do not reserve permanent QLs.
