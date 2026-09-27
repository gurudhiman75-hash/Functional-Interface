# MIS-CP-011 / MIS-CP-012 Implementation Status

Status: **EXECUTABLE PROTOTYPE / ENGLISH REVIEW CANDIDATE**

## CP011 — mixed two-stage relations

The blueprint example `(a+b)×c` is already owned by CP002 and is intentionally not duplicated.

New provisional semantic authorities:

- MIS-CAND-075: `ab − c²`
- MIS-CAND-076: `a² + bc`
- MIS-CAND-077: `(a+b)² − c`
- MIS-CAND-078: `ab + |a−b|`

Each uses controlled small values, independent recomputation, ambiguity rejection and misconception-driven distractors.

## CP012 — advanced repeated-group inference

CP012 adds **no new semantic authorities**.

Runtime review variants MIS-CAND-079..083 deliberately create a first completed example where two existing rules fit. The second and third evidence groups must eliminate the competing rule so exactly one semantic authority survives before the target is solved.

Profiles:

- 079: SUM vs PRODUCT → canonical authority MIS-CAND-001
- 080: a²+b vs PRODUCT → MIS-CAND-017
- 081: row-product sum vs column-product sum → MIS-CAND-051
- 082: ab−c² vs a²+bc → MIS-CAND-075
- 083: row-product sum vs diagonal-product sum → MIS-CAND-051

Every accepted item requires:

- at least 2 rules after Example 1;
- exactly 1 rule after all three evidence groups;
- three completed evidence groups plus one target;
- small exam-friendly values;
- Hard difficulty from rule competition, not large arithmetic.

## Chapter totals after this wave

- Runtime review patterns: 83
- Distinct semantic authorities: 70
- Reuse-only variants: 13
- Permanent QLs: 0 pending source saturation / merge-split audit
