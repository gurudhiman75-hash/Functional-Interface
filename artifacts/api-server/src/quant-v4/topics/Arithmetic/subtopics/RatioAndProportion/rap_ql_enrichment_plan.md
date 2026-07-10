# RAP QL Enrichment Record

Reviewed commit/date: `8450deef2e06cc9e031b6d3221b7e54d226199b1`, `2026-07-10`

This file records the completed three-phase enrichment and the post-enrichment correction pass. It is no longer a forward plan.

## Phase Status

| Phase | Scope | Result |
|---|---|---|
| 1 | RAP-001 fundamentals enrichment and explanation refactor | Implemented, deduplicated, automated-QA clean |
| 2 | RAP-002 linked-ratio breadth and runtime support | Implemented, deduplicated, automated-QA clean |
| 3 | RAP-003 application breadth and task-kind support | Implemented, deduplicated, automated-QA clean |

## Planned, Implemented, Removed

| Package | Post-enrichment planned/implemented pool | Removed or rejected | Final active |
|---|---:|---:|---:|
| RAP-001 | 169 | 102 | 67 |
| RAP-002 | 161 | 53 | 108 |
| RAP-003 | 223 | 1 | 222 |
| **Total** | **553** | **156** | **397** |

Removed QLs were exact or low-value structural wording clones whose solve structure remained represented by a canonical active QL.

## Removed QL Ledger

**RAP-001 (102):** RAP-QL-1007, RAP-QL-106, RAP-QL-108, RAP-QL-109, RAP-QL-1107, RAP-QL-111, RAP-QL-112, RAP-QL-114, RAP-QL-115, RAP-QL-116, RAP-QL-117, RAP-QL-118, RAP-QL-119, RAP-QL-120, RAP-QL-1207, RAP-QL-121, RAP-QL-122, RAP-QL-123, RAP-QL-124, RAP-QL-126, RAP-QL-127, RAP-QL-128, RAP-QL-129, RAP-QL-130, RAP-QL-1307, RAP-QL-132, RAP-QL-1407, RAP-QL-1507, RAP-QL-1607, RAP-QL-1707, RAP-QL-1807, RAP-QL-1907, RAP-QL-207, RAP-QL-208, RAP-QL-209, RAP-QL-211, RAP-QL-212, RAP-QL-213, RAP-QL-215, RAP-QL-216, RAP-QL-218, RAP-QL-220, RAP-QL-221, RAP-QL-222, RAP-QL-223, RAP-QL-224, RAP-QL-226, RAP-QL-227, RAP-QL-228, RAP-QL-306, RAP-QL-307, RAP-QL-308, RAP-QL-309, RAP-QL-311, RAP-QL-312, RAP-QL-313, RAP-QL-314, RAP-QL-315, RAP-QL-316, RAP-QL-317, RAP-QL-318, RAP-QL-319, RAP-QL-320, RAP-QL-321, RAP-QL-322, RAP-QL-323, RAP-QL-324, RAP-QL-326, RAP-QL-327, RAP-QL-328, RAP-QL-329, RAP-QL-330, RAP-QL-332, RAP-QL-406, RAP-QL-407, RAP-QL-408, RAP-QL-409, RAP-QL-411, RAP-QL-412, RAP-QL-413, RAP-QL-414, RAP-QL-415, RAP-QL-416, RAP-QL-417, RAP-QL-418, RAP-QL-419, RAP-QL-420, RAP-QL-421, RAP-QL-422, RAP-QL-423, RAP-QL-424, RAP-QL-426, RAP-QL-427, RAP-QL-428, RAP-QL-429, RAP-QL-430, RAP-QL-432, RAP-QL-507, RAP-QL-607, RAP-QL-707, RAP-QL-807, RAP-QL-907.

**RAP-002 (53):** RAP-QL-215, RAP-QL-216, RAP-QL-220, RAP-QL-221, RAP-QL-222, RAP-QL-223, RAP-QL-224, RAP-QL-225, RAP-QL-226, RAP-QL-227, RAP-QL-228, RAP-QL-312, RAP-QL-313, RAP-QL-314, RAP-QL-315, RAP-QL-316, RAP-QL-317, RAP-QL-318, RAP-QL-319, RAP-QL-320, RAP-QL-321, RAP-QL-322, RAP-QL-323, RAP-QL-324, RAP-QL-510, RAP-QL-511, RAP-QL-513, RAP-QL-514, RAP-QL-515, RAP-QL-516, RAP-QL-517, RAP-QL-519, RAP-QL-520, RAP-QL-521, RAP-QL-522, RAP-QL-523, RAP-QL-524, RAP-QL-525, RAP-QL-526, RAP-QL-708, RAP-QL-710, RAP-QL-712, RAP-QL-713, RAP-QL-714, RAP-QL-715, RAP-QL-716, RAP-QL-717, RAP-QL-719, RAP-QL-720, RAP-QL-721, RAP-QL-722, RAP-QL-723, RAP-QL-724.

**RAP-003 (1):** RAP-QL-956.

## Rewritten Active QLs

- RAP-001: RAP-QL-403, RAP-QL-008, RAP-QL-011, plus renderer-level capitalization/entity compatibility fixes.
- RAP-002: RAP-QL-709; generator scenario pools, integer-safe inverse/election cases, tie/equivalence handling, and task-group explanations.
- RAP-003: RAP-QL-1325, RAP-QL-1420, RAP-QL-1617; replacement-round diversification and `givenOneSpendsMore` explanation correction.

## Final Active QLs by CP

| Package | CP counts |
|---|---|
| RAP-001 | CP-001 `37`, CP-002 `4`, CP-003 `7`, CP-004 `7`, CP-005 `4`, CP-006 `8` |
| RAP-002 | CP-007 `17`, CP-008 `11`, CP-009 `29`, CP-010 `11`, CP-011 `30`, CP-012 `10` |
| RAP-003 | CP-013 `16`, CP-014 `30`, CP-015 `23`, CP-016 `29`, CP-017 `19`, CP-018 `18`, CP-019 `25`, CP-020 `20`, CP-021 `25`, CP-022 `17` |

## Remaining Gaps

- Human editorial decisions are pending for 30/60/100 English review rows.
- Same-QL repeated-stem diversity debt remains documented in package residual reports.
- RAP-002 has no active Easy QL band.
- Hindi/Punjabi publication remains blocked pending separate human localization and editorial QA.
