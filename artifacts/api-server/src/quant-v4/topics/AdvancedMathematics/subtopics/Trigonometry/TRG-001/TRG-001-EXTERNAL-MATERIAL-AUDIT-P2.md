# TRG-001 External Material Audit P2

Status: **ACTIVE AUDIT SOURCE — REVIEW CORPUS, NOT PRODUCTION AUTHORITY**

## Purpose

TRG-001 must not be judged only by its internal QL count or by a small PYQ set. This audit layer uses uploaded books, coaching material and other user-provided exam sources as an external challenge corpus.

The external corpus is used to answer a stronger question:

> Can the current TRG-001/TRG-002 system reproduce the materially recurring constructions found in real SSC-oriented books and practice material without inventing a new QL for every surface form?

External material is evidence for coverage and realism. It does **not** automatically become production authority or frequency weight.

## Registered source 1

### RY7300-TRG-2017

- Source: `Rakesh Yadav Maths 7300 Book PDF.pdf`
- Format: scanned/image-heavy PDF
- Scope: SSC Mathematics, chapterwise/typewise questions with detailed solutions
- Trigonometry chapter: printed pages **676–713**
- Height & Distance chapter: printed pages **714–727**
- TRG ownership boundary:
  - printed 676–713 -> audit primarily against **TRG-001 Core Trigonometry**
  - printed 714–727 -> audit against **TRG-002 Heights & Distances**
- Source role: external challenge corpus
- Production promotion authority: **NO**
- Frequency authority: **NO**

The chapter separation is important: a tower/elevation/shadow question must not be counted as evidence that TRG-001 itself covers Heights & Distances.

## Coverage labels

Every audited external question or materially distinct construction receives exactly one of these labels:

### DIRECT_COVERAGE
The current runtime already has the same mathematical construction, with only normal variable/value/stem variation required.

### COVERED_WITH_VARIATION
The existing family can generate the construction without changing the package boundary, but an additional controlled surface or algebraic sibling may be needed.

### MISSING_RECURRING_ARCHETYPE
The external material exposes a materially distinct recurring exam construction that the current package cannot generate. This is a remediation candidate.

### OUT_OF_SCOPE
The question belongs to another package, a deliberately excluded syllabus level, proof-heavy material, or a non-target exam construction.

## What does not count as a gap

Do **not** add a QL merely because a book changes:

- numbers;
- variable letters;
- option order;
- one algebraically equivalent surface;
- wording only;
- `sin`/`cos` mirror when the same family already owns the symmetry;
- a direct replacement of one standard angle with another;
- a question that belongs to TRG-002, Geometry, Mensuration or another established package.

A gap must be mathematical/constructional, not cosmetic.

## Whole-chapter first-pass family map — RY7300

The uploaded Trigonometry chapter contains a broad mix of the following recurring blocks. The first pass maps them to current TRG authority as follows.

| External construction family | Current home | First-pass status |
|---|---|---|
| maxima/minima of elementary trig expressions | TRG-001 CP006 | COVERED_WITH_VARIATION |
| acute-angle ordering / inequality comparisons | TRG-001 CP001/CP006 | DIRECT_COVERAGE after QL-024 P2 |
| direct ratio/value questions | TRG-001 CP001/CP002 | DIRECT_COVERAGE |
| standard-angle evaluation | TRG-001 CP002/CP006 | DIRECT_COVERAGE |
| reciprocal-function relations | TRG-001 CP001/CP004/CP005 | DIRECT_COVERAGE |
| Pythagorean identities | TRG-001 CP004 | DIRECT_COVERAGE |
| sec-tan and cosec-cot identities | TRG-001 CP004/CP005 | DIRECT_COVERAGE |
| complementary-angle/cofunction expressions | TRG-001 CP003/CP006 | DIRECT_COVERAGE |
| mixed algebraic identity simplification | TRG-001 CP004/CP005/CP006 | DIRECT_COVERAGE / VARIATION by form |
| powers of sine/cosine from a relation | TRG-001 CP006 | DIRECT_COVERAGE after QL-126 P2 sibling |
| cubic factorization with trig expressions | TRG-001 CP006 | DIRECT_COVERAGE after QL-143 P2 |
| trig equations / solve for angle | TRG-001 CP003/CP005/CP006 | COVERED_WITH_VARIATION pending sampled proof |
| triangle side-to-ratio reconstruction | TRG-001 CP001/CP005 | DIRECT_COVERAGE |
| triangle area using trig | TRG-001 CP006 | DIRECT_COVERAGE |
| compound/double-angle style transformations | TRG-001 CP006 | DIRECT_COVERAGE |
| pure geometry/Pythagoras without trig as decisive method | GEO package | OUT_OF_SCOPE |
| elevation/depression/shadow/tower/observer applications | TRG-002 | OUT_OF_SCOPE for TRG-001; in-scope for TRG-002 audit |

This table is a family-level first pass. It does not replace sampled question-level evidence.

## Sampling protocol

For each registered external source:

1. identify the exact chapter/page boundary;
2. identify type blocks or visibly distinct construction clusters;
3. sample at least one question from every distinct cluster;
4. oversample high-frequency or algebraically diverse clusters;
5. map each sample to package, CP, QL/family and coverage label;
6. record the reason, not only the label;
7. if `MISSING_RECURRING_ARCHETYPE`, test whether the gap is already covered by another package before adding a TRG role;
8. if remediation is needed, add a candidate sibling/overlay first; never silently mutate frozen production;
9. rerun the same external probes before a later refreeze.

## Question-level audit record shape

Each probe should record:

```ts
{
  sourceId,
  printedPage,
  sourceQuestionNumber,
  observedConstruction,
  targetPackage,
  targetCp,
  targetQlOrFamily,
  coverageLabel,
  evidenceNote,
  remediationRequired,
}
```

## Refreeze gate added by this audit

TRG-001 should not be refrozen solely because its internal tests pass.

Before refreeze, require:

- no unresolved **high-frequency** `MISSING_RECURRING_ARCHETYPE` in the registered external corpus;
- all new remediation candidates reviewed for exam realism;
- package-boundary errors resolved (especially TRG-001 vs TRG-002);
- representative book/PYQ probes still reproducible after the candidate changes;
- execution tests and human review remain separate gates.

A rare, proof-oriented or clearly out-of-syllabus book question does not automatically block refreeze.

## Current RY7300 observations relevant to P2

The uploaded chapter independently supports the importance of several families already identified from PYQs:

- comparison/ordering of trig functions for acute angles;
- dense identity simplification rather than only direct values;
- algebraic relations involving powers;
- equation-solving and triangle reconstruction;
- mixed exact-value/identity expressions.

The P2 additions for QL-024, QL-126 and QL-143 therefore improve not only PYQ matching but also compatibility with broader SSC book material.

## Next audit wave

Perform question-level sampling across the full printed 676–713 Trigonometry chapter and create a coverage ledger. Then repeat separately for printed 714–727 against TRG-002.

The ledger should be cumulative and reusable in future Quant V4 audits.