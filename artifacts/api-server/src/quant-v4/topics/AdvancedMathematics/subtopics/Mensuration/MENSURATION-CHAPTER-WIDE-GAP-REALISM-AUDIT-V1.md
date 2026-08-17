# Mensuration Chapter-Wide Gap & Exam-Realism Audit V1

**Authority:** `MENSURATION-CHAPTER-WIDE-GAP-REALISM-AUDIT-V1`  
**Scope:** MEN-001 CP001–006 + MEN-002 CP007–013  
**Question Studio surface audited:** 399 selectable patterns  
**Audit corpora:** 1,596 editorial/review generations + 6,384 saturation/seed-sensitivity generations  
**Runtime/content remediation in this PR:** none; this is an evidence-only audit.

## Executive verdict

Mensuration is now **broadly complete and mathematically strong**, but the full Question Studio chapter still needs **one focused remediation pass before it should be treated as fully exam-profile-ready**.

The chapter is not suffering from a major syllabus-coverage hole. Its stronger remaining weaknesses are product-facing realism and integration quality:

1. unfiltered generation samples all 399 patterns uniformly instead of following SSC / Banking / Punjab exam profiles;
2. MEN-001's rich `EXAM_SHORTCUT` and `COMMON_TRAPS` tiers are not preserved by the unified adapter, causing generic shortcut fallback on CP001–006;
3. CP013 uses a trailing-index/block scheduler, so changing the seed namespace at the same numeric index does not change content and the first four generations of every CP013 QL repeat one content state while rotating answer position;
4. product-facing difficulty is badly calibrated in several CPs, especially CP008 and CP010/12/13;
5. CP008 QL070 has a real learner-visible TeX defect in its explanation;
6. a small number of stems still use setter/probe notation rather than polished exam prose;
7. MEN-001 CP006 contains a duplicate distractor-strategy object key and therefore silently overwrites one definition.

These are material but bounded issues. They do **not** require rebuilding the chapter or reallocating its QLs.

## 1. Audit method

### Editorial corpus

For every one of the 399 registered Question Studio patterns, four deterministic questions were generated.

- Questions generated: **1,596**
- Structural critical failures: **0**
- Distinct stems: **1,359**
- Distinct stem+option states: **1,593**
- Exact repeated stem+option states: **3**

The audit checked:

- four-option integrity and answer parity;
- duplicate state/stem behaviour;
- visible internal-code leakage;
- malformed TeX;
- setter/probe-style wording;
- unit and numerical presentation;
- worked explanation depth;
- shortcut/trap preservation;
- distractor provenance;
- difficulty distribution;
- answer-position distribution.

### Saturation corpus

Every pattern was then generated 16 times, plus same-index generation with two unrelated seed namespaces.

- Questions generated: **6,384**
- Patterns exercising all A/B/C/D positions: **393 / 399**
- Patterns with fewer than four distinct content states across 16: **1 / 399**
- Patterns with all 16 content states distinct: **53 / 399**
- Patterns insensitive to seed namespace at the same trailing index: **20 / 399**
- Patterns whose first four generations contain only one content state: **15 / 399**, all CP013

This second pass prevents four-state answer-position scheduling from being mistaken for genuine low entropy.

## 2. Coverage verdict

### SSC core syllabus

The bank covers the current mainstream SSC mensuration spine very strongly:

- triangles and Heron/inverse triangle forms;
- quadrilaterals;
- regular-plane/composite figures;
- circles, arcs and sectors;
- prisms;
- cubes/cuboids/rectangular parallelepipeds;
- cylinders;
- cones;
- spheres and hemispheres;
- pyramids;
- surface area and volume;
- scaling/similarity;
- paths, borders, flooring, fencing and cost;
- unit conversion;
- open/closed/hollow solids;
- recasting/melting/volume conservation;
- composite/inscribed solids;
- tanks, capacity, displacement and overflow.

No major SSC-style Mensuration family is missing at chapter level.

### Enrichment versus core

CP010–013 contain useful advanced/extended patterns that are legitimate competitive-exam material, but they should not be sampled at the same frequency as basic triangle, quadrilateral, circle, cylinder, cone, sphere and cuboid questions.

Recommendation: **keep the breadth; change the selection policy.**

### Minor possible enrichment

`Regular Polygons` in the plane bank is strongest around regular hexagon/composite constructions. A future source-led check can decide whether a generic apothem/perimeter regular-polygon family is worthwhile. This is an enrichment opportunity, not a current release blocker.

## 3. Question Studio weighting is the biggest realism gap

The chapter runtime currently chooses an eligible pattern by hashing into the complete eligible list. With no CP/pattern filter, that gives each registered pattern effectively the same selection status.

The chapter contains:

| CP | Patterns | Share of unfiltered pool |
|---|---:|---:|
| CP001 | 29 | 7.3% |
| CP002 | 32 | 8.0% |
| CP003 | 30 | 7.5% |
| CP004 | 34 | 8.5% |
| CP005 | 33 | 8.3% |
| CP006 | 36 | 9.0% |
| CP007 | 43 | 10.8% |
| CP008 | 52 | 13.0% |
| CP009 | 28 | 7.0% |
| CP010 | 26 | 6.5% |
| CP011 | 28 | 7.0% |
| CP012 | 13 | 3.3% |
| CP013 | 15 | 3.8% |

This is a coverage inventory, not a realistic exam blueprint.

### Required remediation

Add product-facing exam profiles without changing frozen mathematical identities:

- `SSC_CORE`
- `SSC_ADVANCED`
- `BANKING`
- `PUNJAB_STATE`

Each pattern should carry a selection weight or frequency band such as:

- `CORE_HIGH`
- `STANDARD`
- `LOW_FREQUENCY`
- `ENRICHMENT`

Unfiltered chapter generation should require/default to an exam profile and use weighted sampling. Explicit CP/pattern selection should remain unrestricted.

## 4. Difficulty calibration is not yet trustworthy

The 1,596-question corpus produced:

- Easy: **249 (15.6%)**
- Medium: **812 (50.9%)**
- Hard: **535 (33.5%)**

The problem is not only the global ratio; several CPs have clearly unhelpful product-facing labels.

### Notable cases

- **CP008:** only **3 Easy** out of 208 sampled questions, despite many direct cylinder/cone core forms.
- **CP010:** **104/104 Medium**.
- **CP012:** **52/52 Medium**.
- **CP013:** **60/60 Medium**.

A direct one-formula tank capacity question and a multi-stage composite/displacement problem should not be indistinguishable to the Question Studio difficulty filter.

### Required remediation

Calibrate **product-facing difficulty** independently of frozen QL identity:

- Easy: direct formula / one conceptual step / clean arithmetic;
- Medium: inverse form, unit conversion, two-stage relation, moderate ratio/similarity;
- Hard: multi-stage conservation/composite geometry, non-obvious containment, multiple transformations, harder computation.

No permanent QL IDs need to change.

## 5. MEN-001 explanation quality is being lost in integration

The source MEN-001 explanation model explicitly stores:

1. Key Rule & Formula;
2. Step-by-Step Solution;
3. **Exam Speed Shortcut**;
4. **Common Traps**.

The full chapter adapter correctly receives the worked explanation lines, but its normalized `shortcut` field only checks `learnerSolution.shortcut` and `explanation.shortcut`. MEN-001 stores the shortcut as an `EXAM_SHORTCUT` structured section, so the adapter falls back to:

> Use the governing mensuration relation and keep units consistent.

Result in the four-state corpus:

- **776 generic shortcut fallbacks** = all four samples across the 194 MEN-001 patterns in CP001–006.

This is an **integration regression**, not weak source content.

### Required remediation

For MEN-001 normalization:

- extract `EXAM_SHORTCUT` paragraphs into `question.explanation.shortcut`;
- extract `COMMON_TRAPS` paragraphs into `question.explanation.traps`;
- keep the worked steps as currently preserved.

This should make Question Studio visibly as strong as the underlying MEN-001 source bank.

## 6. CP013 seed/state entropy needs remediation

CP013's source scheduler derives its state index from the trailing numeric part of the seed. Correct option is `index % 4`; many state variants advance by `floor(index / 4)`.

The saturation proof confirms the product effect across all 15 CP013 QLs:

- first four generations: **1 distinct content state per QL**;
- 16 generations: median **4 distinct content states**;
- all 15 CP013 QLs are **namespace-insensitive at the same index**;
- all four answer positions are nevertheless covered.

The content bank itself is not empty. Across 16 calls, QLs cycle through meaningful variants. The problem is how Question Studio seeds address them.

### Why this matters

For an explicitly selected CP013 pattern:

- generating 1–4 questions tends to show the same mathematical state with answer-position movement;
- changing the user seed namespace but retaining the same trailing index can return the same content;
- this makes the generator look synthetic and much smaller than it really is.

### Required remediation

Preserve deterministic answer-position scheduling, but select the **content/state variant from a stable hash of the full seed namespace plus block index**, rather than from the trailing integer alone.

Target after remediation:

- different seed namespaces can yield different content at index 0;
- a short 4-question batch should have multiple mathematical states unless a QL intentionally has one fixed state;
- answer positions still demonstrate balanced scheduling across a larger proof set.

## 7. Specific real editorial/runtime defects

### High priority — CP008 QL070 malformed explanation TeX

`MEN-002-QL-070` (cone slant height from curved surface area) produced malformed learner explanation fragments in all four audit samples, for example an equation ending `15π$` without a matching opening delimiter.

The question stem and answer logic are valid. The **explanation renderer text** needs repair and a regression test for balanced delimiters.

### Medium priority — setter-style stems

Observed examples:

- CP008 QL084: `A cylinder has r:h=2:3 ...`
  - Prefer: `The radius and height of a cylinder are in the ratio 2:3 ...`
- CP010 QL143: `larger radius = ..., smaller radius = ..., vertical height = ...`
  - Prefer a normal sentence rather than assignment-style notation.

### Medium priority — duplicate MEN-001 CP006 distractor key

The build warns that `cp006-square-area-use-wire-square-over-eight` occurs twice in the same object literal in `distractor-strategies.cp006.ts`. JavaScript keeps the later definition, silently shadowing the earlier one.

This does not break generated correctness, but it can discard an intended distractor strategy and should be resolved before claiming final distractor-authority cleanliness.

### Low/medium entropy refinements

Four-state audit found only three exact state repetitions:

- CP007 QL040;
- CP007 QL043;
- CP008 QL083.

The 16-state pass shows these are not systemic low-entropy families. They are refinement candidates, not blockers.

### Low-priority CP009 QL119 breadth

QL119 has only two content representations across the 16-state proof:

- sphere-volume : hemisphere-volume;
- sphere-surface-area : hemisphere-total-area.

That can be acceptable for a deliberately narrow comparison family. Expansion is optional.

## 8. Findings that were manually cleared as false positives / non-blockers

### “Missing answer units”

Machine detector initially flagged 20 records. Manual inspection showed the answers already carried appropriate semantics:

- degrees (`45°`, `90°`);
- `times` for scale factor;
- `blocks` for block count.

**Verdict: no real missing-unit defect.**

### Large plain numbers

Most flagged large values came from legitimate map-scale, capacity or mixed-unit conversion states. Their size followed naturally from the problem context.

**Verdict: not a systemic realism defect.**

### Long decimals

Most were natural capacity / π=3.14 / percentage surfaces. No evidence of a chapter-wide ugly-decimal problem.

**Verdict: low concern.**

### Missing normalized misconception IDs

Many MEN-001/CP009 sources use rich distractor strategies or learner trap prose without exposing `misconceptionId` in the unified option shape.

**Verdict: metadata-normalization limitation, not proof that distractors are poor.** Distractors should still be inspected family-by-family during remediation, but the raw count is not a quality-failure count.

## 9. Per-CP readiness summary

| CP | Area | Audit judgement | Main action |
|---|---|---|---|
| CP001 | Triangles | Strong | Preserve source shortcuts/traps; profile weighting |
| CP002 | Quadrilaterals | Strong | Same; minor answer-position/short-stem refinement |
| CP003 | Circles/arcs/sectors | Strong | Same; no real unit defect |
| CP004 | Paths/flooring/fencing | Strong | Preserve rich explanation tiers; weighting |
| CP005 | Composite/regular plane | Strong | Preserve rich explanation tiers; optional regular-polygon enrichment |
| CP006 | Scaling/unit/wire | Strong with source hygiene issue | Remove duplicate distractor key; preserve shortcut/traps |
| CP007 | Cube/cuboid/prism | Strong | Minor QL040/043 diversity refinement; weighting |
| CP008 | Cylinder/cone | Strong breadth, needs polish | Fix QL070 TeX; difficulty recalibration; QL084 wording; minor entropy |
| CP009 | Sphere/hemisphere | Strong | QL119 optional breadth expansion; weighting |
| CP010 | Pyramid/frustum | Strong after prior realism remediation | Product difficulty calibration; QL143 wording |
| CP011 | Hollow/open/exposed solids | Strong | Product weighting; small prose cleanup sweep |
| CP012 | Recasting/melting | Strong after setter remediation | Product difficulty calibration; downweight for non-SSC profiles where appropriate |
| CP013 | Composite/tanks/displacement | Strong content, weak short-batch entropy | Fix seed/state scheduler; difficulty calibration; profile weighting |

## 10. External exam-reality benchmark

The current SSC CGL syllabus continues to name the standard mensuration set: triangle, quadrilaterals, regular polygons, circle, right prism, right circular cone, right circular cylinder, sphere, hemispheres, rectangular parallelepiped, and regular right pyramid with triangular or square base.

Recent SSC question patterns also include composite/inscribed space calculations, supporting the decision to retain CP012/13-style extensions rather than delete them. The correct product response is weighting, not contraction.

For banking, current IBPS PO preparation syllabi include Mensuration within Quantitative Aptitude, but the official IBPS recruitment material does not provide a trustworthy fine-grained Mensuration family-frequency blueprint. Therefore Banking weights should be set from validated question-history evidence, not invented as an “official” distribution.

A Punjab-state weighting profile should likewise be treated as a separate empirical blueprint. This audit found no authoritative current topic-level Punjab source that justifies assigning exact subfamily percentages today.

## 11. Remediation order

### P0 — before declaring full chapter exam-profile-ready

1. Add exam-profile-aware weighted selection.
2. Preserve MEN-001 `EXAM_SHORTCUT` and `COMMON_TRAPS` in the unified adapter.
3. Repair CP013 full-seed state selection / short-batch entropy.
4. Recalibrate product-facing difficulty, especially CP008 and CP010/12/13.
5. Repair CP008 QL070 explanation TeX and add regression proof.

### P1 — editorial/source hygiene

6. Rewrite CP008 QL084 and CP010 QL143 setter-style stems.
7. Remove the duplicate CP006 distractor-strategy key and prove intended distractor coverage.
8. Sweep CP011 for duplicated trap phrases.
9. Recheck CP007 QL040/043 and CP008 QL083 short-run diversity.

### P2 — optional enrichment

10. Decide whether generic regular-polygon/apothem coverage adds real value.
11. Decide whether CP009 QL119 deserves more representations.

## 12. Final readiness judgement

### What is already at-par

- coverage breadth;
- mathematical integrity;
- option correctness;
- worked-calculation presence;
- most stems;
- source-level explanations in mature CPs;
- source-based application variety;
- overall generator state breadth outside the identified scheduler issue.

### What still prevents an unqualified “fully ready” verdict

The connected chapter currently behaves more like a **very broad content library** than a calibrated SSC/Banking/Punjab exam generator. Equal-pattern selection, inconsistent difficulty metadata, lost MEN-001 shortcut/trap tiers and CP013's index-based state scheduler are visible product-level realism issues.

**Decision:** `ONE_FOCUSED_REMEDIATION_PASS_REQUIRED_BEFORE_FULL_EXAM_PROFILE_SIGNOFF`.

The correct next step is remediation in a separate PR, preserving all permanent QL identities and all existing mathematical authorities.
