# BLR-CP-003 — Competitive-Exam Quality Gate V4

Status: **competitive-exam remediation implemented; V4 is the active English human-review candidate; no discovery freeze or permanent QL allocation**.

## Purpose

V3 solved the visual and explanation problems, but its 208-record review pack still contained questions that repeated facts directly stated in the passage or required only one family edge. V4 separates technical discovery coverage from competitive-exam delivery quality.

The technical source inventory remains intact for audit and solver coverage. The active V4 learner pack contains only derived questions that satisfy the rules below.

## Mandatory engine rules

```text
MIN_GRAPH_DISTANCE       = 2
MAX_DIRECT_TEXT_MATCH    = 0
HAS_ASCII_FAMILY_TREE    = true
HAS_FOUR_TIER_TEACHING   = true
```

Learner-visible output also rejects internal phrases including:

```text
PAIR:
QueryRoleDepth
NON_SPOUSE
NON_SIBLING
NON_PARENT_CHILD
PERSON_SET:
CLAIM:
supported family path
shortest supported path
reconstructed family graph
subject-to-reference
```

## Rule 1 — Derived reasoning only

Every active item must identify at least one semantic target pair and prove that its shortest supported family path contains two or more edges.

Examples:

```text
parent -> sibling -> child       aunt or uncle
child -> child                   grandparent
spouse -> parent                 son-in-law or daughter-in-law
parent -> sibling -> child       cousin
```

Items are rejected when:

- the target pair has a one-edge spouse, parent, child or sibling relationship;
- the question merely asks for an explicitly stated gender or marital fact;
- the task has no relational target under CP-003's ownership;
- a true/false option itself relies on a direct one-edge fact.

## Rule 2 — Semantic premise-leak detection

V4 does not use naive name matching. Names must appear in the passage, so rejecting every repeated name would make all questions impossible.

The gate instead constructs the complete answer proposition, normalises it and compares it with every passage statement.

Example:

```text
Passage statement: Pooja is the daughter of Rohit.
Question answer:   Pooja is the aunt of Ritu.
Result:            allowed; the answer proposition is not stated directly.
```

```text
Passage statement: Harjit is the husband of Divya.
Question answer:   Harjit and Divya are married.
Result:            rejected; the answer premise is stated directly.
```

The same check applies to all claim options, not only the correct option. This prevents a true/false question from offering passage sentences as zero-reasoning options.

## Rule 3 — Weak passage supplementation

Filtering the 208 V3 source records initially produced 116 eligible derived questions but left the sibling-set passage with only one active item and the explicit-marital passage with two.

V4 therefore adds twelve deterministic derived replacements across four seeds:

```text
Sibling-set passage:
  identify the derived uncle
  identify the derived aunt

Explicit-marital passage:
  identify the derived uncle
```

Each replacement:

- uses an existing discovery solve authority;
- has a solver-verified path of at least two edges;
- has no direct answer-premise match;
- contains four deterministic options;
- includes the existing visual tree and full teacher explanation;
- creates no new permanent QL identity.

## Rule 4 — Mandatory visual solution

Every active record contains a standard family-tree grid with:

```text
(+)       male, when established by the displayed passage
(-)       female, when established by the displayed passage
========  married couple
│         parent-child lineage
──        siblings
```

An unstated gender is left unmarked rather than copied from hidden graph data.

Publication is blocked when `hasAsciiFamilyTree !== true` or the expected visual-tree header and lineage symbols are missing.

## Rule 5 — Four-tier teacher voice

Every active question exposes:

```text
📌 Core Concept
📝 Step-by-Step Solution & Family Tree
⚡ 10-Second Speed Shortcut
⚠️ Common Trap & Student Warning
```

Every correct option explanation begins with:

```text
✅ Option X is correct.
```

Every distractor explanation begins with:

```text
⚠️ Don't fall for Option X!
```

Raw semantic keys and developer error labels remain internal.

## Direction and reverse-option contract

For every question of the form:

```text
How is X related to Y?
```

V4 enforces:

```text
direction line: Keep the direction fixed: X -> Y.
conclusion:     X is the [relation] of Y.
```

When the reverse relation is present among the options, both the option analysis and the trap section explicitly identify it as the answer to the reverse question.

Example:

```text
Question: How is Vikas related to Rohit?
Correct:  Son-in-law
Reverse option: Father-in-law
Warning: Father-in-law describes how Rohit is related to Vikas, not how Vikas is related to Rohit.
```

## V4 inventory

```text
V3 technical source records                 208
Source records passing competitive gate     116
Rejected source records                      92
Derived supplemental replacements            12
------------------------------------------------
Active V4 competitive questions             128
Passage sets                                 32
Minimum active questions per passage          3
Maximum active questions per passage          6
Answer positions                [35, 33, 29, 31]
```

Rejection reasons are non-exclusive because one record may violate more than one rule:

```text
GRAPH_DISTANCE_BELOW_TWO             60
NO_RELATIONAL_TARGET                 28
DIRECT_PREMISE_REPEATED              16
CLAIM_OPTION_DISTANCE_BELOW_TWO       8
CLAIM_OPTION_REPEATS_PREMISE          6
```

## Artifact structure

The V4 exporter produces:

### Active competitive pack

- `blr-cp003-competitive-review-v4.html`
- `blr-cp003-competitive-review-v4.md`
- `blr-cp003-competitive-review-v4.csv`
- `blr-cp003-competitive-review-v4.jsonl`
- `blr-cp003-competitive-review-v4-summary.json`

### Rejected source-item audit

- `blr-cp003-competitive-rejected-v4.html`
- `blr-cp003-competitive-rejected-v4.csv`
- `blr-cp003-competitive-rejected-v4.jsonl`

Rejected records are not deleted. They remain visible to maintainers as technical-discovery evidence and as examples of patterns that must not enter learner delivery.

## Scope boundary: CP-003 versus CP-004

The request included derived properties such as total females. Such questions are valuable, but they belong to the already established checkpoint boundary:

```text
indirect relation, exact lineage,
generation comparison and relation claims   -> BLR-CP-003

family counts, gender composition,
number of males/females and family size      -> BLR-CP-004
```

V4 therefore does not silently move female-count questions into CP-003. The competitive gate prepares the same visual graph and validation principles for later CP-004 implementation while preserving clean solve-authority ownership.

## Deterministic validation

The V4 gate checks:

- source inventory remains 208;
- source eligible inventory is 116;
- rejected source inventory is 92;
- supplemental inventory is 12;
- active inventory is 128;
- all 32 passage groups remain represented;
- every passage has at least three active derived questions;
- every active target path is at least two edges;
- every direct answer-premise count is zero;
- claim-option premise matches are zero;
- every record contains a family-tree grid;
- every distractor uses friendly warning language;
- every available reverse-relation trap is explained;
- no permanent QL or delivery flag is enabled.

## Current decision

V4 supersedes V3 as the active English human-review candidate.

The mandatory remaining sequence is unchanged:

```text
human review of V4
  -> accepted follow-up remediation, if any
  -> affected deterministic reruns
  -> post-human source-gap confirmation
  -> final discovery freeze
  -> sequential QL allocation
```

## Release boundary

- `BLR-QL-009`: unclaimed;
- permanent CP-003 QLs: `0`;
- Question Studio visibility: disabled;
- Question Bank eligibility: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled;
- draft PR remains unmerged.
