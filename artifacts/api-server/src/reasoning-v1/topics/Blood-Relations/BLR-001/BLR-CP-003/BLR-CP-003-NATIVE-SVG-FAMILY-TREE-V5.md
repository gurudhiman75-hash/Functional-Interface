# BLR-CP-003 — Native SVG Family Tree V5

Status: **native SVG solution renderer implemented in the canonical student result page; human review pending; zero permanent QLs**.

## Objective

Replace the ASCII family tree as the primary student-facing visual without adding a heavy graph library or slowing the ExamTree application.

V5 keeps the ASCII tree as a plain-text/export fallback and introduces a structured, responsive SVG renderer for the web application and HTML review pack.

## Student experience

Every active V5 question carries a compact `proceduralLogic` payload:

```text
nodes
  -> person ID
  -> display name
  -> stated gender
  -> generation level

edges
  -> marriage
  -> parent-child
  -> sibling

query
  -> subject
  -> reference
  -> correct answer label
  -> highlighted reasoning path
```

The canonical result page renders this payload after the text explanation.

The student can switch between:

```text
Answer path
Full family
```

The SVG includes:

- generation bands;
- person cards;
- `M` and `F` badges that do not depend on special-font glyph support;
- marriage connectors;
- parent-child branches;
- highlighted sibling links;
- `Start` and `Target` labels;
- highlighted multi-step answer path;
- accessible summary text;
- horizontally scrollable mobile layout;
- collapsible ASCII fallback.

## Layout correction

The first SVG artifact used alphabetical ordering within each generation. Manual visual review showed that this could place a child under the wrong branch and create crossing connectors.

V5 now uses parent-anchored layout:

1. place the oldest displayed generation;
2. calculate each lower family unit's parent anchor;
3. order child/couple units by that anchor;
4. keep the blood-family member nearest the sibling branch;
5. place an external spouse away from the branch;
6. draw the sibling step explicitly when it forms part of the answer path.

The corrected layout was manually inspected across all eight CP-003 scenario families:

- three-generation two-branch;
- affinal child branch;
- two-couple cousin branch;
- sibling-set branch;
- explicit unmarried branch;
- dual maternal/paternal branch;
- four-generation direct line;
- compact joint-parent passage.

## Performance architecture

The SVG renderer uses native React and SVG only.

```text
D3 dependency                 no
Mermaid dependency            no
general graph library         no
database migration            no
stored SVG markup             no
stored image asset            no
```

The existing `proceduralLogic` JSON column stores the compact semantic payload. The browser generates SVG markup only when the structured solution is rendered.

The renderer is lazy-loaded from the canonical result page.

Production build evidence:

```text
chunk                     FamilyTreeDiagram-uTfQ5TwS.js
raw size                  11.83 KB
gzip size                  4.25 KB
main-bundle leakage        false
external graph library     false
```

The dedicated CI gate fails when:

- the renderer is absent from the production output;
- more than one renderer chunk is produced;
- the renderer enters the main bundle;
- the raw renderer chunk exceeds 35 KB.

## Structured payload budget

Across all active V5 records:

```text
active questions                       128
SVG diagrams                           128
highlighted answer paths               128
average structured payload           2,276 bytes
hard per-record payload limit        12,000 bytes
ASCII fallbacks                        128
```

Each answer path contains at least three people, preserving the V4 requirement of two or more relationship edges.

## Active review inventory

```text
V3 technical source records             208
Source records passing V4 gate          116
Rejected source records                  92
Derived supplemental replacements        12
------------------------------------------------
Active V5 learner-review records         128
Passage sets                              32
Questions per passage                    3–6
Answer positions             [35, 33, 29, 31]
```

V5 changes only the structured visual solution layer. It does not reopen the competitive-exam selection rules or create a new solve authority.

## Implementation files

Server/review layer:

- `cp003-svg-family-tree.ts`;
- `cp003-svg-family-tree-markup-v2.ts`;
- `cp003-competitive-svg-review.ts`;
- `cp003-competitive-svg-review.test.ts`;
- `export-cp003-review-v5-svg.ts`.

Student application:

- `src/components/blood-relations/family-tree-types.ts`;
- `src/components/blood-relations/FamilyTreeDiagram.tsx`;
- `src/components/learning/LogicPlaybackRouter.tsx`;
- `src/pages/canonical-result.tsx`;
- `scripts/verify-family-tree-chunk.mjs`.

## Validation evidence

Validated implementation head:

```text
5e18a343d49e1f27d19af162cb75f306754db22f
```

Successful CP-003 workflow:

```text
Reasoning BLR-001 CP-003 Runtime   30441595849
```

The workflow passed:

- all existing CP-003 deterministic proofs;
- V3 teacher-editorial regression;
- V4 competitive-exam gate;
- V5 structured SVG payload gate;
- V5 export;
- ExamTree TypeScript check;
- ExamTree production build;
- standalone lazy SVG chunk verification.

Exact-head review artifact:

```text
name:     blr-001-cp003-competitive-svg-review-v5
ID:       8719691559
digest:   sha256:a70cb7a08f4da41affefb10442d7c295d15eb634a141ac0be4a0ca8054de607f
```

Exact-head runtime diagnostics:

```text
name:     blr-001-cp003-runtime-logs
ID:       8719690973
digest:   sha256:9df4963d8d19888c96cd7b91f499a290a774a95d4c9edb802c292453223d89d7
```

Other successful exact-head checks:

```text
Reasoning BLR-001 CP-001 Runtime        30441600018
Reasoning BLR-001 CP-002 Runtime        30441596230
Validate Render production build       30441595846
Validate student TypeScript baseline   30441596013
Validate student reliability E2E       30441596906
Validate attempt reliability           30441595842
```

## Release boundary

This implementation does not constitute human approval or final discovery freeze.

- `BLR-QL-009`: unclaimed;
- permanent CP-003 QLs: `0`;
- Question Studio visibility: disabled;
- Question Bank eligibility: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled;
- draft PR remains unmerged.
