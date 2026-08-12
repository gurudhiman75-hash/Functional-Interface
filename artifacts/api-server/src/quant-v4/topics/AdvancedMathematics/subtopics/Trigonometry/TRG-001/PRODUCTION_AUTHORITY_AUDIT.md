# TRG-001 Production Authority Allocation Audit

Status: **BLOCKER FOUND — CORRECTION REQUIRED BEFORE 144-QL EDITORIAL FREEZE**

## Why this audit was run

The 144-QL engineering surface reaches the correct package total and CP totals, but Phase 0 also contains a detailed `TRG-001/ql-ledger.md` that binds contiguous QL ranges to mathematical families. The production review therefore checked not only count/range membership, but whether each QL's actual mathematical role still belongs to its locked family.

## Finding

The engineering surface is **CP-correct but not fully QL-family-correct**.

Examples:

- `TRG-001-QL-013...016` are locked for **side recovery from a given trig ratio**, while the current engineering implementations are ratio-derivation questions.
- `TRG-001-QL-049...052` are locked for **degree ↔ radian conversion**, while only part of that range currently performs conversion and the remaining conversion QLs appear later in the CP.
- `TRG-001-QL-101...104` are locked for **sec(theta) ± tan(theta)** relations, but the current range mixes linear sine/cosine and other derived-ratio work.
- `TRG-001-QL-131...133` are locked for **controlled double-angle applications**, while the current range includes maximum/area/mixed-angle work.
- `TRG-001-QL-134...137` are locked for **standard-value series/products**, but the current engineering surface does not provide four dedicated roles there.

The issue exists in both the previously reviewed 72-QL MVP and the new 72-QL production expansion. It is therefore not safe to treat the old 72-row editorial result as a final row-level freeze after authority reconciliation.

## Decision

Do **not** amend Phase 0 merely to match implementation drift.

Instead, add an authority-aligned candidate layer that:

1. preserves the existing proof/MVP/production generators as trace evidence;
2. reassigns reusable mathematical templates to their correct permanent QL IDs;
3. replaces missing families with new generator roles rather than padding with cosmetic variants;
4. enforces the exact Phase 0 family range for every `TRG-001-QL-001...144`;
5. resets AI/human row-level review to pending on the reconciled 144 surface;
6. retains all activation locks.

## Locked family ranges to enforce

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

## Review consequence

Until the authority-aligned candidate is generated and re-audited:

- 144-QL engineering count: **complete**
- Phase-0 row-family compliance: **not yet complete**
- full AI editorial freeze: **not valid yet**
- human review: **0/144**
- Question Studio/Test Builder/public activation: **OFF**

This audit is intentionally conservative: an internally convenient QL ordering is not allowed to override the locked production design.