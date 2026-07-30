# BLR-001 — Blood Relations

Status: **BLR-CP-001 and BLR-CP-002 English discovery frozen; BLR-CP-003 V5 human review approved but final freeze blocked by five learner-evidence gaps; stable range `BLR-QL-001..008`**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `BLR-001-END-TO-END-DESIGN.md`;
4. `blr-001-open-ql-discovery.md`;
5. checkpoint-specific source, merge/split, freeze, implementation and review records;
6. `BLR-001-MANIFEST-AMENDMENT-CP001.md` and `BLR-001-MANIFEST-AMENDMENT-CP002.md` for permanent identity.

## Shared implemented foundation

- typed family graph with parent, spouse and sibling edges;
- family validity and ancestry-cycle rejection;
- graph reconstruction from displayed relation clues;
- hidden-graph versus clue-only answer agreement;
- shared family-passage groups with multiple independently solved items;
- explicit marital facts without closed-world unmarried inference;
- compact joint-parent rendering with explicitly represented parent edges;
- inferred sibling closure for children sharing a modelled parent;
- deterministic seeded Indian names;
- broad kinship and in-law closure;
- generation propagation and comparison through three levels;
- exact paternal/maternal lineage resolution reused inside shared passages;
- great-generation relation closure;
- deterministic generation-row explanation data;
- blood and affinal uncle/aunt with inverse nephew/niece closure;
- broad role vocabulary for parent, child, sibling and spouse;
- union-cardinality semantics for exact `ONLY_CHILD`;
- zero-cardinality validation for negative relation facts;
- independent clue-only solvers;
- misconception-labelled four-option construction;
- four-tier learner-facing editorial layer;
- native SVG family trees with highlighted answer paths and ASCII fallback;
- lazy client rendering with no external graph library or main-bundle leakage;
- structured speaker/listener/pointed-person anchors;
- one-, two- and three-anchor dialogue contexts;
- nested role-chain reduction with formal `ONLY` checks;
- direct, reverse and both-derived query endpoints;
- pictured and derived self-identity resolution;
- semantic and possessive photograph/portrait option rendering.

## Frozen permanent range

```text
BLR-QL-001  resolve named-person relation
BLR-QL-002  identify person by relation
BLR-QL-003  identify person by gender
BLR-QL-004  identify ordered relation pair
BLR-QL-005  select relation claim
BLR-QL-006  compare generations
BLR-QL-007  resolve exact maternal/paternal relation
BLR-QL-008  resolve anchored pointer/photo/conversation role-chain relation
```

Freeze versions:

```text
BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1
```

## CP-002 freeze result

Six exploratory prototypes and forty-five canonical source scenarios were compressed into:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

Presentation context, question renderer, anchor count, direct/reverse direction, one or both derived endpoints, one- through four-step depth, broad roles, `ONLY` and `NONE` constraints, blood/affinal output, relation value, `SELF`, names and difficulty remain instance properties of `BLR-QL-008`.

## Current executable proof

```text
BLR-CP-001 frozen workflow                    3,556 questions
BLR-CP-002 technical proof                    3,492 questions
BLR-CP-002 permanent runtime audit              900 questions
-----------------------------------------------------------
Frozen deterministic proof                   7,948 questions
BLR-CP-003 technical discovery proof          4,940 questions
BLR-CP-003 active V5 human-review records       128 questions
BLR-CP-003 rejected source records               92 records
```

The CP-003 technical number is not a frozen inventory. It covers eight executable scenarios, 760 generated groups, eighteen temporary item handles plus one assembly handle, hidden-graph agreement, input-contribution checks and complete release locks. The approved V5 layer contains only competitive derived questions with native SVG explanations.

## CP-003 technical compression

```text
Temporary item handles                   18
Handles merged into frozen QLs           10
Provisional new handles                   8
Provisional new solve authorities         6
Assembly-only handles                     1
Permanent CP-003 QLs                      0
```

The grouped person-by-gender item merges into frozen `BLR-QL-003`. The passage assembly itself has no student answer and remains an assembly-only contract.

## CP-003 freeze-readiness result

```text
provisional authorities                         6
learner-supported provisional authorities       1
blocked provisional authorities                 5
final discovery freeze ready                 false
permanent CP-003 QLs                             0
next available chapter identity        BLR-QL-009
```

`IDENTIFY_PERSON_BY_EXACT_LINEAGE` has eight active V5 records. The following five proposed authorities currently occur only in rejected records and are under learner-evidence gap wave 01:

```text
DETERMINE_MEMBER_GENDER
SELECT_UNORDERED_FAMILY_PAIR
IDENTIFY_ALL_MEMBERS_BY_RELATION
DETERMINE_MEMBER_MARITAL_STATUS
IDENTIFY_MEMBER_BY_MARITAL_STATUS
```

## Checkpoint state

| Checkpoint | Ownership | State |
|---|---|---|
| `BLR-CP-001` | direct declarative named-person relations | frozen; `BLR-QL-001..007` |
| `BLR-CP-002` | pointer/photo/portrait/conversation/nested self-reference | frozen; `BLR-QL-008` |
| `BLR-CP-003` | shared family passages | V5 human-approved; visual polish closed; five-authority V6 evidence wave scoped; 0 permanent QLs |
| `BLR-CP-004` | counts and family composition | open |
| `BLR-CP-005` | possible/impossible/one-of-two/indeterminate semantics | open |
| `BLR-CP-006` | coded relation decoding | open |
| `BLR-CP-007` | coded construction and validation | open |

The next available chapter identity is `BLR-QL-009`. It remains unclaimed. The final chapter total remains open.

## Authoritative freeze and readiness records

### CP-001

- `BLR-CP-001/BLR-CP-001-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP001.md`;
- `BLR-CP-001/cp001-final-discovery-freeze.ts`;
- `BLR-CP-001/cp001-runtime.ts`.

### CP-002

- `BLR-CP-002/BLR-CP-002-SECOND-SOURCE-GAP-AUDIT.md`;
- `BLR-CP-002/BLR-CP-002-HUMAN-REVIEW-APPROVAL.md`;
- `BLR-CP-002/BLR-CP-002-POST-HUMAN-GAP-CONFIRMATION.md`;
- `BLR-CP-002/BLR-CP-002-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP002.md`;
- `BLR-CP-002/cp002-final-discovery-freeze.ts`;
- `BLR-CP-002/cp002-runtime.ts`.

### CP-003

- `BLR-CP-003/BLR-CP-003-HUMAN-REVIEW-APPROVAL-V5.md`;
- `BLR-CP-003/BLR-CP-003-NATIVE-SVG-FAMILY-TREE-V5.md`;
- `BLR-CP-003/BLR-CP-003-MERGE-SPLIT-AUDIT-V1.md`;
- `BLR-CP-003/BLR-CP-003-FINAL-FREEZE-READINESS-AUDIT.md`;
- `BLR-CP-003/BLR-CP-003-LEARNER-EVIDENCE-GAP-WAVE-01.md`;
- `BLR-CP-003/cp003-final-freeze-readiness.ts`;
- `BLR-CP-003/cp003-final-freeze-readiness.test.ts`;
- `BLR-CP-003/cp003-learner-evidence-gap-wave-01.ts`;
- `BLR-CP-003/cp003-learner-evidence-gap-wave-01.test.ts`.

## Remaining CP-003 sequence

```text
V6 candidate generation for five blocked authorities
  -> deterministic and independent-answer proof
  -> competitive, premise-leak, editorial and SVG gates
  -> V6 human review
  -> accepted remediation
  -> final-freeze readiness rerun
  -> final discovery freeze only if supported
  -> sequential permanent allocation only after freeze
```

## Release boundary

Permanent identity does not enable delivery:

- English review-only: true;
- final discovery freeze: blocked;
- permanent CP-003 QLs: 0;
- `BLR-QL-009`: unclaimed;
- Question Studio: disabled;
- Question Bank: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled;
- PR merge: not authorised.
