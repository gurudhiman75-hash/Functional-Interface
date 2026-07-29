# BLR-CP-003 — Family-Set Passages and Shared Graphs

Status: **native SVG competitive review V5 implemented; human review pending; zero permanent QLs**.

## Ownership

This checkpoint owns pure-kinship shared passages. One hidden family graph yields one clue block, and clue-only reconstruction supports independently solved relation, lineage, generation and claim questions.

The technical discovery layer covers:

- eight graph-first family scenarios;
- eighteen temporary item handles plus one group-assembly handle;
- relation and person identification;
- pair, gender, generation, status, claim and member-set tasks;
- paternal and maternal exact lineage;
- great-grandparent and great-grandchild paths;
- hidden-graph versus clue-only answer agreement;
- per-clue and per-status-fact contribution rejection;
- deterministic names, prompts, answers and option order;
- complete release locks.

## Technical discovery inventory

```text
Base graph-first scenarios                    3
Extended sibling/set scenarios                1
Explicit marital-status scenarios             1
Lineage and four-generation scenarios         2
Compact joint-parent source-gap scenarios     1
---------------------------------------------------
Executable discovery scenarios                8
Temporary item handles                       18
Temporary group-assembly handles              1
Deterministic groups                        760
Independently solved items                4,940
Hidden-graph agreement checks               760
Per-group input-contribution checks         760
Permanent QLs                                 0
```

These figures remain technical discovery evidence. They are not the active learner-review inventory and are not frozen.

## Active English review candidate — V5

V5 retains the V4 competitive selection gate and replaces ASCII as the primary web visual with a responsive native SVG family tree.

```text
V3 source records                         208
Source records passing V4 gate            116
Rejected source records                    92
Derived supplemental replacements          12
------------------------------------------------
Active V5 learner-review records           128
Shared-family passage sets                  32
Minimum questions per passage                3
Maximum questions per passage                6
Answer positions              [35, 33, 29, 31]
Native SVG diagrams                        128
Highlighted answer paths                  128
ASCII fallbacks                            128
```

Every active item must satisfy:

```text
shortest target graph path       >= 2 edges
complete answer-premise matches   = 0
claim-option premise matches      = 0
native SVG family tree            required
ASCII fallback                    required
four-tier teacher voice           required
friendly distractor warnings      required
reverse trap explanation          required when available
```

Direct husband-wife, parent-child, sibling, gender and explicit-status questions remain in technical discovery but are excluded from the active competitive pack.

## Native SVG student experience

The canonical student result page renders a compact structured family-tree payload stored in the existing `proceduralLogic` field.

The primary visual includes:

- generation bands;
- person cards with reliable `M` and `F` badges;
- marriage connectors;
- parent-child branches;
- highlighted sibling steps;
- `Start` and `Target` labels;
- highlighted multi-step answer path;
- `Answer path` and `Full family` views;
- horizontally scrollable mobile layout;
- accessible summary text;
- collapsible ASCII fallback.

The layout is parent-anchored rather than alphabetically arranged. Children remain beneath their family branch, and external spouses are positioned away from the core sibling branch to prevent crossing connectors.

## Performance contract

```text
external graph library          no
D3 or Mermaid runtime           no
database migration              no
stored image                    no
renderer chunk                  11.83 KB raw
renderer chunk                   4.25 KB gzip
main-bundle leakage             false
average diagram payload         2,276 bytes
hard payload limit             12,000 bytes
```

The renderer is lazy-loaded only when a structured family-tree solution is shown.

CI rejects the build when:

- the compiled SVG renderer is missing;
- multiple renderer chunks are produced;
- the renderer leaks into the main bundle;
- the raw renderer chunk exceeds 35 KB;
- any active payload exceeds 12 KB;
- any active question lacks a highlighted two-edge-or-more answer path.

## Learner explanation standard

Every active question contains:

```text
📌 Core Concept
📝 Step-by-Step Solution & Visual Family Tree
⚡ 10-Second Speed Shortcut
⚠️ Common Trap & Student Warning
```

Every correct-option analysis begins with:

```text
✅ Option X is correct.
```

Every distractor analysis begins with:

```text
⚠️ Don't fall for Option X!
```

## Direction contract

For:

```text
How is X related to Y?
```

V5 enforces:

```text
Keep the direction fixed: X -> Y.
X is the [relation] of Y.
```

When the reverse relation appears as an option, its option analysis and common-trap block explicitly explain that it answers how `Y` is related to `X`.

## Rejection audit

The V5 artifact retains the separate rejected-source report. Rejection reasons are non-exclusive:

```text
GRAPH_DISTANCE_BELOW_TWO             60
NO_RELATIONAL_TARGET                 28
DIRECT_PREMISE_REPEATED              16
CLAIM_OPTION_DISTANCE_BELOW_TWO       8
CLAIM_OPTION_REPEATS_PREMISE          6
```

Rejected records remain available for solver and editorial audit; they are not silently deleted.

## Current compression hypothesis

```text
Handles merged into frozen QLs        10
Provisional new handles                 8
Provisional new solve authorities       6
Assembly-only handles                   1
Permanent CP-003 QLs                    0
```

Frozen QLs reused by grouped items:

```text
BLR-QL-001
BLR-QL-002
BLR-QL-003
BLR-QL-005
BLR-QL-006
BLR-QL-007
```

Provisional new authorities:

```text
DETERMINE_MEMBER_GENDER
SELECT_UNORDERED_FAMILY_PAIR
IDENTIFY_ALL_MEMBERS_BY_RELATION
DETERMINE_MEMBER_MARITAL_STATUS
IDENTIFY_MEMBER_BY_MARITAL_STATUS
IDENTIFY_PERSON_BY_EXACT_LINEAGE
```

## Main audit records

- `BLR-CP-003-SOURCE-AND-BOUNDARY-AUDIT.md`
- `BLR-CP-003-MARITAL-STATUS-AUDIT-V1.md`
- `BLR-CP-003-LINEAGE-SATURATION-AUDIT-V1.md`
- `BLR-CP-003-MERGE-SPLIT-AUDIT-V1.md`
- `BLR-CP-003-INVERSE-AUDIT-V1.md`
- `BLR-CP-003-SECOND-SOURCE-GAP-PRE-HUMAN.md`
- `BLR-CP-003-ENGLISH-EDITORIAL-READINESS-V2.md`
- `BLR-CP-003-HUMAN-EDITORIAL-REMEDIATION-V3.md`
- `BLR-CP-003-COMPETITIVE-EXAM-QUALITY-GATE-V4.md`
- `BLR-CP-003-NATIVE-SVG-FAMILY-TREE-V5.md`

## Main V5 files

Server and review:

- `cp003-svg-family-tree.ts`
- `cp003-svg-family-tree-markup-v2.ts`
- `cp003-competitive-svg-review.ts`
- `cp003-competitive-svg-review.test.ts`
- `export-cp003-review-v5-svg.ts`

Student application:

- `src/components/blood-relations/family-tree-types.ts`
- `src/components/blood-relations/FamilyTreeDiagram.tsx`
- `src/components/learning/LogicPlaybackRouter.tsx`
- `src/pages/canonical-result.tsx`
- `scripts/verify-family-tree-chunk.mjs`

## Current temporary item handles

```text
BLR-CP003-PROT-SHARED-RELATION
BLR-CP003-PROT-SHARED-IDENTIFY-PERSON
BLR-CP003-PROT-SHARED-IDENTIFY-BY-RELATION
BLR-CP003-PROT-SHARED-IDENTIFY-PERSON-BY-GENDER
BLR-CP003-PROT-SHARED-MARRIED-PAIR
BLR-CP003-PROT-SHARED-SIBLING-PAIR
BLR-CP003-PROT-SHARED-PARENT-CHILD-PAIR
BLR-CP003-PROT-SHARED-GENDER
BLR-CP003-PROT-SHARED-GENERATION
BLR-CP003-PROT-SHARED-THREE-GENERATION-COMPARE
BLR-CP003-PROT-SHARED-TRUE-CLAIM
BLR-CP003-PROT-SHARED-FALSE-CLAIM
BLR-CP003-PROT-SHARED-MEMBER-SET
BLR-CP003-PROT-SHARED-MARITAL-STATUS
BLR-CP003-PROT-SHARED-IDENTIFY-BY-MARITAL-STATUS
BLR-CP003-PROT-SHARED-EXACT-LINEAGE
BLR-CP003-PROT-SHARED-IDENTIFY-BY-EXACT-LINEAGE
BLR-CP003-PROT-SHARED-GREAT-RELATION
```

Assembly handle:

```text
BLR-CP003-PROT-MULTI-ITEM-GROUP
```

The twelve derived replacements reuse existing identify-person authority and create no permanent identity. `BLR-QL-009` remains unclaimed.

## Semantic boundaries

```text
named spouse edge or explicit married fact -> MARRIED
explicit unmarried fact                    -> UNMARRIED
missing spouse edge alone                  -> no status conclusion
marriage alone                              -> no co-parent conclusion
joint-parent wording                        -> both parent edges required
unstated gender                             -> no hidden learner inference
```

```text
indirect relation, exact lineage,
generation comparison and relation claims  -> BLR-CP-003

family counts, number of males/females,
family size and composition                 -> BLR-CP-004
```

Female-count questions remain in CP-004. Possible, impossible and cannot-determine semantics remain in CP-005.

## Remaining mandatory work

- human review of the 128-record V5 pack;
- accepted follow-up remediation, if any;
- rerun of affected deterministic gates;
- post-human source-gap confirmation;
- final discovery freeze;
- sequential QL allocation only after freeze.

## Release boundary

- English review-only: true;
- Question Studio visibility: disabled;
- Question Bank eligibility: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled.
