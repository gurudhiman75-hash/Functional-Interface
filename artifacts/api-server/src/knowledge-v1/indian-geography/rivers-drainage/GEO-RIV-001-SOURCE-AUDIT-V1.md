# GEO-RIV-001 — Source Audit & Coverage Matrix V1

Status: SOURCE-AUDIT FOUNDATION
Chapter: `GEO-RIV-001` — Indian Rivers & Drainage System

## 1. Audit purpose

The source audit separates two different responsibilities:

- **truth authority** — determines whether a geography fact is correct and generation-eligible;
- **exam evidence** — determines whether the fact/relation and learner task are relevant to competitive exams.

A source can serve both roles, but exam-preparation material does not outrank an official source for factual truth.

## 2. Primary truth authorities

### SRC-GEO-NCERT-001 — NCERT Geography

Use for:

- drainage terminology;
- major river systems;
- Himalayan vs Peninsular characteristics;
- drainage patterns;
- broad source/course/mouth descriptions;
- standard school-level geographic conventions.

Relevant NCERT scope includes Class IX drainage coverage and senior-secondary Indian physical geography where applicable.

Authority class: `PRIMARY_EDUCATIONAL_AUTHORITY`

### SRC-GEO-CWC-001 — Central Water Commission Basin Material

Use for:

- official basin descriptions;
- major tributary membership;
- basin/sub-basin relationships;
- basin extent and official river-system description;
- project/basin context where current documentation is required.

Authority class: `PRIMARY_HYDROLOGICAL_AUTHORITY`

### SRC-GEO-WRIS-001 — India-WRIS / River Basin Atlas

Use for:

- basin and sub-basin structure;
- river-network relationships;
- water-resource project associations;
- river-basin spatial context;
- cross-checking official hydrological relationships.

Authority class: `PRIMARY_HYDROLOGICAL_SPATIAL_AUTHORITY`

## 3. Secondary official authorities

Use only where required and record exact source ownership:

- Ministry of Jal Shakti;
- National Mission for Clean Ganga for Ganga-specific institutional facts;
- state water-resource departments for state-specific projects after cross-checking;
- Survey of India / official map products for spatial conventions where accessible;
- official project/dam authorities for project naming or status.

## 4. Exam-evidence sources

### EXAM-GEO-SSC-001 — SSC previous-year material

Use for:

- recurring river facts;
- common question wording;
- city-river and dam-river associations;
- tributary/system classification;
- difficulty and distractor analysis.

The user's available SSC solved-paper corpus is suitable as an exam-evidence sample, but explanations/factual notes inside such books require verification against the primary truth authorities.

### EXAM-GEO-OTHER-001 — Railway / Banking / State-exam PYQs

To be expanded during later audit passes.

Use for:

- cross-exam recurrence;
- learner-task diversity;
- regional geography emphasis;
- rare but valid question families.

## 5. Evidence policy

Every fact candidate should record:

```text
factId
canonicalClaim
relationType
primarySourceId
sourceLocator
crossCheckSourceIds[]
examEvidenceIds[]
reviewStatus
confidence
freshnessClass
validFrom/validTo if applicable
ambiguityNotes
```

Generation eligibility requires:

- at least one accepted primary authority;
- no unresolved contradiction affecting the answer;
- reviewed canonical wording;
- correct freshness treatment;
- learner-task compatibility.

Exam evidence is recommended for prioritization but is not required for every foundational relation if the relation is necessary to support tested composite questions.

## 6. Coverage matrix

| Coverage area | Primary authority | Exam evidence | Target CP | Priority |
| --- | --- | --- | --- | --- |
| Drainage definition | NCERT | SSC/state | CP001 | P0 |
| Drainage basin / water divide | NCERT + CWC | SSC/state | CP001/CP011 | P0 |
| Drainage patterns | NCERT | SSC/state | CP001/CP011 | P0 |
| Himalayan vs Peninsular rivers | NCERT | SSC | CP001/CP013 | P0 |
| Perennial/seasonal tendency | NCERT | SSC | CP001 | P0 |
| East vs west flowing | NCERT + WRIS | SSC | CP001/CP013 | P0 |
| Inland drainage | NCERT | SSC/state | CP001 | P1 |
| Indus system | NCERT + CWC | SSC | CP002 | P0 |
| Ganga system | NCERT + CWC + WRIS | SSC | CP003 | P0 |
| Brahmaputra system | NCERT + CWC | SSC | CP004 | P0 |
| Godavari | NCERT + WRIS/CWC | SSC | CP005 | P0 |
| Krishna | NCERT + WRIS/CWC | SSC | CP005 | P0 |
| Mahanadi | NCERT + WRIS/CWC | SSC | CP005 | P0 |
| Cauvery | NCERT + WRIS/CWC | SSC | CP005 | P0 |
| Narmada | NCERT + WRIS/CWC | SSC | CP006 | P0 |
| Tapi | NCERT + WRIS/CWC | SSC | CP006 | P0 |
| Mahi/Sabarmati | NCERT + WRIS/CWC | SSC/state | CP006 | P1 |
| Tributary-parent relations | CWC + NCERT | SSC | CP002-007 | P0 |
| Source/origin relations | NCERT + CWC | SSC | CP002-008 | P0 |
| Mouth/sea/bay relations | NCERT + WRIS | SSC | CP005/006/008 | P0 |
| Delta/estuary classification | NCERT + WRIS | SSC | CP008/013 | P0 |
| River-state relations | CWC/WRIS | SSC/state | CP009 | P0 |
| Dam/project-river relations | CWC/WRIS + official project source | SSC | CP010 | P0 |
| Reservoir-river relations | CWC/WRIS | SSC | CP010 | P1 |
| Basin membership | CWC/WRIS | SSC/state | CP011 | P0 |
| City-river relations | Official/state + cross-check | SSC | CP012 | P0 |
| Upstream/downstream ordering | CWC/WRIS/maps | SSC/state | CP007/014 | P1 |
| Multi-statement tasks | Derived from qualified facts | SSC | CP014 | P0 |
| Matching tasks | Derived from qualified facts | SSC | CP014 | P0 |
| Map/spatial tasks | WRIS/official map authority | Future exam evidence | later visual phase | P1 |

## 7. CP001 source-audit gate

Before CP001 generation is implemented, the following must be frozen:

### Concepts

- drainage;
- drainage basin;
- water divide;
- river system;
- tributary;
- distributary;
- perennial river;
- seasonal/non-perennial river;
- delta;
- estuary;
- inland drainage.

### Drainage patterns

At minimum, audit:

- dendritic;
- trellis;
- rectangular;
- radial.

Other terms should be added only if source-backed and exam-relevant.

### Broad classifications

Audit:

- Himalayan vs Peninsular systems;
- east-flowing vs west-flowing Peninsular rivers;
- Bay of Bengal vs Arabian Sea drainage;
- delta-forming vs estuary-forming broad examples;
- inland drainage examples where standard and unambiguous.

## 8. Ambiguity watchlist

The following categories are high risk and must be explicitly reviewed before generation:

1. **Exact river length** — values vary by measurement convention and source edition. Avoid as a core relation unless one official convention is frozen.
2. **'Largest'/'longest' claims** — must specify scope: India, entirely within India, basin area, discharge, etc.
3. **River origin wording** — glacier, spring, hill, lake or broader source region may be stated differently across sources.
4. **City on river** — urban area may span multiple channels/tributaries; use established exam conventions only.
5. **State traversal vs basin drainage** — never treat these as equivalent.
6. **Left-bank/right-bank tributary** — relation depends on looking downstream; source must explicitly support it.
7. **Delta vs estuary** — broad school-level generalizations must not override source-specific morphology.
8. **Project status** — planned/under-construction/completed is mutable and must not be stored as immutable.
9. **Administrative names** — state/UT/city renaming requires validity-aware labels.
10. **International course facts** — wording must distinguish India-only segments from full international course.

## 9. Fact priority model

Assign each candidate relation a priority:

### P0 — Core exam relation

Repeatedly tested or necessary for major learner tasks.

Examples:

- tributary of a major river;
- source of a major river;
- river-system membership;
- east/west flow;
- major dam-river association.

### P1 — Supporting relation

Useful for medium/hard questions and explanations.

### P2 — Enrichment only

May be educationally useful but should not dilute exam-focused pools.

P2 facts should not enter generation until P0/P1 coverage is healthy.

## 10. Distractor-audit requirements

For each relation type, maintain a confusion neighborhood.

Examples:

### `TRIBUTARY_OF`

Group by:

- same physiographic region;
- neighboring major systems;
- frequently confused tributaries;
- similar-name rivers.

### `ORIGINATES_AT`

Group by:

- Himalayan glacier/source region;
- Western Ghats source region;
- plateau/highland source region.

### `PROJECT_ON_RIVER`

Group by real projects on other major rivers. Do not fabricate project names.

### `CITY_ON_RIVER`

Group by real city-river pairs to create plausible but false pairings.

## 11. Explanation-audit requirements

An explanation is acceptable only if:

- the relation is stated correctly;
- the source fact supports it;
- no extra unsourced claim is introduced;
- alternatives are discussed only when useful;
- terminology matches the chosen authority convention;
- the explanation remains simple and coherent.

## 12. Exam-fidelity audit dimensions

Review generated batches for:

- real-exam stem shape;
- factual density;
- direct vs reverse recall balance;
- correct/incorrect pair balance;
- statement question quality;
- match-the-following quality;
- distractor plausibility;
- no invented geography;
- answer-position balance;
- difficulty separation;
- duplicate relation frequency;
- explanation usefulness.

## 13. Source-audit result for foundation V1

Foundation decision: **GO for CP001 design, NOT YET GO for generation freeze.**

Reason:

- the authoritative source hierarchy is clear;
- the shared `knowledge-v1` contract is appropriate;
- the chapter scope and ambiguity risks are known;
- CP001 can now be specified in detail;
- individual fact records still require extraction/review before they become generation-eligible.

## 14. Next action

Implement `GEO-RIV-001-CP001` as a small, deep pilot with:

- audited concepts;
- audited drainage-pattern examples;
- broad river classifications;
- relation-aware distractors;
- multiple learner tasks;
- source provenance;
- deterministic replay;
- review-ready output.
