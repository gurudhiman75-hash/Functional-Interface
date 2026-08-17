# WOR-001 — Word & Dictionary Order

WOR-001 is a deterministic, multilingual, review-only Reasoning chapter covering classic SSC/Punjab dictionary ordering and recurring Banking five-cluster composite patterns.

## Implemented checkpoints

- `WOR-CP-001` — complete ascending/descending order and endpoints;
- `WOR-CP-002` — kth position, rank, predecessor, successor and middle;
- `WOR-CP-003` — insertion/correction/partial-order research contracts, source-deferred for permanent allocation;
- `WOR-CP-004` — hard common-prefix instances of existing classic contracts;
- `WOR-CP-005` — Banking Word/Cluster Sequence Composites.

The runtime supports `en-IN`, `hi-IN` and `pa-IN`. English A–Z words/clusters remain logic tokens in every locale; instructions and explanations are localized.

## Content architecture

The chapter now contains **24 prototypes / 20 executable task kinds**. The recommended permanent architecture is **8 QL roots**:

1. complete dictionary order;
2. endpoint after ordering;
3. word/cluster at a specified position;
4. position of a specified word;
5. sort → concatenate → global character query;
6. sort → ranked cluster → local character/alphabet-offset query;
7. transform each cluster → sort → positional word query;
8. transform each cluster → sort → local character query.

Plain Banking three-letter-cluster position (`WOR-PROT-020`) is an instance of root 3, not a ninth root.

## Object modes

### Real words

- 30 curated structural families;
- 360 globally unique provisional words;
- Easy/Medium/Hard structural tiers;
- corpus expansion and human approval still pending.

### Banking letter clusters

CP-005 currently uses a deterministic five × three-letter `LETTER_CLUSTER` constructor to prove the architecture. Difficulty changes the shared-prefix structure of the cluster set. This is intentionally **not yet the final large reviewed Banking pool**; that expansion is the next content phase.

## Banking composite operators

CP-005 supports:

- ordinary/reverse dictionary ordering;
- sort then concatenate and index globally;
- sort then select a ranked cluster and local character;
- optional local alphabet offset;
- swap first/second letters;
- swap first/last letters;
- alphabetically sort letters inside each cluster;
- shift first letter to previous/next alphabet letter;
- answer either the original or transformed cluster where the source pattern requires it.

Original-to-transformed mapping is preserved and independently reconstructed during validation.

## Option profiles

- classic CP-001–004 questions: **4 options**;
- Banking CP-005 questions: **5 options**.

The option layer supports both profiles without creating separate QLs merely for option count.

## Runtime guarantees

- explicit case-insensitive A–Z comparator; no `localeCompare()` correctness dependency;
- independent classic lexical solver;
- separate independent Banking transformation + sort + answer solver;
- deterministic seeded generation;
- state-derived difficulty;
- exactly one marked answer and unique options;
- misconception-labelled distractors;
- multilingual logic parity;
- review packs generated from the exact CI-tested commit;
- lifecycle remains `REVIEW_ONLY` with 0 permanent IDs and no public activation.

## Verification

The CI gate runs:

1. classic WOR deterministic/multilingual audit;
2. CP-005 Banking composite audit;
3. source-governance audit;
4. real-word corpus audit;
5. classic + Banking EN/HI/PA review-pack export;
6. API production build.

Latest CP-005 proof run generated **1,980 localized Banking questions** across all five Banking task kinds, all five explicit transform operators plus no-transform cases, and all five answer positions while preserving independent solver agreement.

## Next phase

The content model is now `ARCHITECTURE_COMPLETE_POOL_EXPANSION_PENDING`. The next work is pool expansion rather than new taxonomy discovery: enlarge the 360-word real-word corpus, create a large reviewed Banking cluster pool, improve Easy second-letter discrimination, and then run chapter-wide repetition/editorial audits before permanent QL allocation.
