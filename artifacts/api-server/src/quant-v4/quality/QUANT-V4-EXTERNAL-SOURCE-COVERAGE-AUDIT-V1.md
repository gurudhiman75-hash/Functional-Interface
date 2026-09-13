# Quant V4 External-Source Coverage Audit V1

Status: **AUDIT INFRASTRUCTURE CANDIDATE — NO PRODUCTION AUTHORITY**

## Purpose

Make uploaded books, PDFs, chapter notes and other reference material a permanent part of Quant V4 coverage auditing instead of using them only in ad-hoc review chats.

The system answers a narrower question than production QA:

> Does our current package generate the materially distinct question forms that appear in relevant external material?

It does **not** automatically authorize production content, alter exam-frequency weights or make an external book the mathematical authority.

## Evidence tiers

### A — Real-exam PYQ

Highest external evidence tier. Real SSC/Banking/Punjab exam questions belong here.

Report independently from every book-derived score.

### B — Target-exam book

Books materially aimed at the same exam family. Examples include SSC mathematics/PYQ/practice books.

These are the primary uploaded-book saturation sources.

### C — Adjacent-exam book

Material from another exam family, e.g. CAT-oriented Quant. It is useful for novelty, harder variants and cross-exam reasoning patterns but must **not** lower SSC completeness merely because CAT tests something outside SSC scope.

### D — Internal reference

Blueprints, old motif maps, internal audits and design notes. Useful for ownership and expected scope, but not external evidence that a market question form exists.

### E — Unqualified

Poorly identified, irrelevant or unusable material. It is excluded until qualified.

## Per-question dispositions

Every external question/archetype receives exactly one disposition:

- `DIRECTLY_COVERED` — current QL/runtime can produce the same material reasoning form.
- `COVERED_WITH_VARIATION` — current system covers the underlying exam form but uses a controlled variation in representation/stem/data.
- `MISSING_ARCHETYPE` — relevant target-exam form with no adequate current generation home.
- `OWNED_BY_OTHER_PACKAGE` — valid form, but belongs to another canonical package; this is not a failure for the package being audited.
- `OUT_OF_TARGET_SCOPE` — mathematically valid but not part of the target exam profile.
- `AMBIGUOUS_SOURCE_ITEM` — source question itself is unclear/defective or cannot be classified confidently.
- `EXTRACTION_FAILURE` — PDF/index/rendering prevents reliable inspection; this is an ingestion defect, not a mathematical gap.

## Scoring rule

Only these dispositions enter the target-package coverage denominator:

- `DIRECTLY_COVERED`
- `COVERED_WITH_VARIATION`
- `MISSING_ARCHETYPE`

Coverage rate:

`(DIRECTLY_COVERED + COVERED_WITH_VARIATION) / eligible observations`

Important:

- Tier A and Tier B must be reported separately.
- Tier C is never blended into the SSC/Banking target score.
- `OWNED_BY_OTHER_PACKAGE` is reported as an ownership/routing result, not a miss.
- `EXTRACTION_FAILURE` is reported as audit debt, not non-coverage.
- No fixed percentage alone authorizes freeze/promotion.

## Initial uploaded-source registry

### BOOK-RAKESH-YADAV-MATHS-7300

**Tier:** B — Target-exam book  
**Target:** SSC/Railway-style mathematics  
**Audit value:** High  
**Current ingestion:** Page extraction/visual inspection required.

The Project copy is highly scan/image dominated. Literal text/index search is weak, so zero search matches must never be interpreted as absence of a topic. Page-level inspection is required for reliable section/question harvesting.

For Trigonometry, harvested questions must be routed between:

- `TRG-001` — ratios, exact values, identities, symbolic/mixed expressions;
- `TRG-002` — Heights & Distances / line-of-sight applications.

### BOOK-ARUN-SHARMA-QA-CAT-2018

**Tier:** C — Adjacent-exam book  
**Target:** CAT/MBA Quant and general aptitude  
**TRG target-score contribution:** None unless a clearly matching target-exam archetype is separately justified.

This source remains useful for novelty/harder-reasoning checks in chapters it materially covers, but it must not define SSC trigonometry completeness.

### INTERNAL-MENSURATION-TRIG-SPATIAL-DESIGN

**Tier:** D — Internal reference  
**Purpose:** package ownership/boundary authority.

This reference explicitly separates core trigonometry (`TRG-001`) from Heights & Distances (`TRG-002`). External-book audit observations must preserve that boundary.

## TRG-001 external-book audit protocol

For each qualified source wave:

1. Locate a contiguous trigonometry section or a reproducible source sample.
2. Capture a stable source locator (book + PDF page + printed question number where available).
3. Classify the mathematical task, not merely the wording.
4. Route it to `TRG-001`, `TRG-002` or another package before checking coverage.
5. For `TRG-001`, map to one or more current permanent QLs when possible.
6. Record `DIRECTLY_COVERED`, `COVERED_WITH_VARIATION` or `MISSING_ARCHETYPE`.
7. If missing, prove the gap against the active runtime before adding a candidate remediation.
8. Re-sample until additional waves stop producing materially new target-exam archetypes.
9. Keep source-saturation evidence separate from production freeze/activation authorization.

## Minimum saturation report per package

A package-level report should show:

- source inventory and tier;
- total inspected questions/items;
- distinct external archetypes;
- directly covered;
- covered with variation;
- missing archetypes;
- routed to other packages;
- out-of-scope forms;
- ambiguous items;
- extraction failures;
- mapped QL IDs;
- unresolved high-confidence target-exam gaps;
- new-archetype yield by audit wave.

The last item is important: saturation should be supported by a declining yield of genuinely new archetypes, not by an arbitrary raw question count alone.

## Relationship to existing Quant audit

This layer complements, rather than replaces:

- real-paper whole-section frequency evidence;
- package authority/ownership audits;
- generated-sample editorial review;
- difficulty calibration;
- localization review;
- runtime verification;
- explicit freeze/rebind authorization.

A package can therefore be mathematically implemented yet still fail external-source saturation, or can be externally saturated yet remain unfit for production because of explanations, distractors, localization or runtime defects.

## Current TRG-001 status

TRG-001 already has strong real-PYQ evidence and recently gained targeted remediation for acute sine/cosine interval comparison, a higher-power relation sibling, and cubic trig factorization. The uploaded-book layer is now the next independent completeness check.

Do **not** refreeze TRG-001 solely on the basis of this infrastructure file. Complete at least one qualified Tier-B trigonometry extraction wave first, reconcile any genuine gaps, execute relevant regression gates, and then obtain explicit human approval.
