# TRG-001 Production Authority Allocation Audit

Status: **BLOCKER FOUND AND RESOLVED IN THE AUTHORITY-ALIGNED 144-QL CANDIDATE**

## Why this audit was run

The first 144-QL engineering surface reached the correct package total and CP totals, but Phase 0 also contains a detailed `TRG-001/ql-ledger.md` that binds contiguous permanent QL ranges to mathematical families. The production review therefore checked not only count/CP membership, but whether each QL's actual mathematical role belonged to its locked family.

## Original finding

The engineering surface was **CP-correct but not fully QL-family-correct**.

Examples included:

- `TRG-001-QL-013...016` were locked for **side recovery from a given trig ratio**, while the first engineering implementations were ratio-derivation questions.
- `TRG-001-QL-049...052` were locked for **degree ↔ radian conversion**, while conversion roles had drifted outside that permanent range.
- `TRG-001-QL-101...104` were locked for **sec(theta) ± tan(theta)** relations, but the first surface mixed other algebra/derived-ratio work into that range.
- `TRG-001-QL-131...133` were locked for **controlled double-angle applications**, while the first surface included maximum/area/mixed-angle work.
- `TRG-001-QL-134...137` were locked for **standard-value series/products**, but the first engineering surface did not provide four dedicated roles there.

The issue affected both previously built MVP rows and newly added production rows. The earlier row-level editorial result was therefore not treated as a final freeze after permanent-ID reconciliation.

## Decision

Phase 0 was **not amended merely to match implementation drift**.

Instead, the branch now contains an authority-aligned candidate that:

1. preserves proof/MVP/production generators as trace evidence;
2. reassigns sound reusable templates to the correct permanent QL family positions;
3. authors missing roles instead of padding with cosmetic variants;
4. enforces the Phase 0 family range for every `TRG-001-QL-001...144`;
5. resets row-level review after reconciliation;
6. retains all activation locks.

## Locked family ranges enforced

### TRG-CP-001
- `001...004`: side-role recognition
- `005...008`: direct trig ratio from given sides
- `009...012`: Pythagorean recovery then target ratio
- `013...016`: side recovery from a given trig ratio
- `017...022`: derive selected ratios from one known ratio
- `023...024`: reciprocal/comparison forms

### TRG-CP-002
- `025...028`: single standard exact value
- `029...032`: reciprocal-function standard values
- `033...037`: products/quotients
- `038...040`: powers/squared standard values
- `041...044`: sums/differences
- `045...046`: mixed exact standard-value expressions
- `047...048`: finite equation/comparison/domain forms

### TRG-CP-003
- `049...052`: degree ↔ radian conversion
- `053...058`: complementary-function relations
- `059...063`: 90°/180° reductions
- `064...066`: 270°/360° reductions
- `067...069`: quadrant sign/reference-angle reasoning
- `070...072`: mixed periodic/reduction exact evaluation

### TRG-CP-004
- `073...076`: sin²+cos² family
- `077...079`: sec²−tan² family
- `080...082`: cosec²−cot² family
- `083...086`: reciprocal/quotient identities
- `087...091`: rational-expression simplification
- `092...095`: evaluate expression from one given ratio
- `096`: equivalence/identity recognition

### TRG-CP-005
- `097...100`: derived ratio/expression from known sin/cos/tan
- `101...104`: sec(theta) ± tan(theta)
- `105...108`: cosec(theta) ± cot(theta)
- `109...112`: sin(theta) ± cos(theta)
- `113...116`: a sin(theta)=b cos(theta) ratio relations
- `117...120`: controlled finite standard-angle equations

### TRG-CP-006
- `121...126`: mixed identity expressions
- `127...130`: controlled angle-sum/difference applications
- `131...133`: controlled double-angle applications
- `134...137`: standard-value series/products
- `138...139`: simple maximum/minimum forms
- `140...141`: triangle area through 1/2 ab sin C
- `142...144`: equivalence/verification/composite exam forms

## Resolution

The active authority candidate now records:

- engineering QL coverage: **144 / 144**
- Phase 0 permanent-family allocation: **144 / 144 aligned by construction**
- locked detailed subfamilies: **39 / 39 at exact counts**
- unique trace-template reuses: **112**
- custom authority roles: **32**
- AI editorial review after reconciliation: **144 / 144 PASS**
- unresolved AI semantic/editorial blockers: **0**
- human review: **0 / 144 PENDING**
- execution evidence for the final authority gates: **PENDING / NOT CLAIMED**
- Question Studio/Test Builder/question bank/public activation: **OFF**

Additional semantic hardening during resolution corrected `QL-066`, `QL-095`, `QL-098` and the equivalent-option defect in `QL-135`. The earlier exact `QL-062` half-degree hardening is preserved.

This audit remains in the repository as evidence of why the final candidate differs from the first count-correct engineering surface.