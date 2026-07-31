# CLS-CP-001 — Semantic Word and Entity Classification: Executable Discovery Plan

Status: `SUPERSEDED_BY_FINAL_MULTILINGUAL_FREEZE`

This document records the initial checkpoint-discovery intent. Its non-QL assumptions and candidate list are no longer current authority.

Current authority:

- `CLS-CP-001-SOURCE-SATURATION-AND-BOUNDARY-CLOSURE.md`
- `CLS-CP-001-FINAL-MULTILINGUAL-FREEZE.md`
- `CLS-CP-001-HIERARCHY-AND-MERGE-SPLIT-AUDIT.md`
- `CLS-CP-001-INSTANCE-DIFFICULTY-AND-EDITORIAL-REMEDIATION.md`

---

## Original objective

The first wave was created to answer whether ExamTree could:

1. construct a semantic classification state from curated facts;
2. prove a unique answer;
3. reject competing semantic rules;
4. independently re-solve the displayed state;
5. discover permanent learner tasks without fixing QL totals in advance.

Temporary controls were deliberately non-permanent and were allowed to merge, split or be rejected.

---

## Discovery result

The executable and source-saturation passes retained eight provenance controls:

```text
CLS-CP001-PROT-001  direct semantic-category outlier
CLS-CP001-PROT-002  primary-function outlier
CLS-CP001-PROT-003  part/system-membership outlier
CLS-CP001-PROT-004  select another class member
CLS-CP001-PROT-005  narrower class inside a shared parent
CLS-CP001-PROT-006  cross-cutting multi-membership outlier
CLS-CP001-PROT-007  narrowest-shared-class member selection
CLS-CP001-PROT-008  internally coherent semantic word-group
```

These controls resolved into three permanent student contracts:

```text
CLS-QL-001  FIND_SEMANTIC_OUTLIER
CLS-QL-002  SELECT_MEMBER_OF_SHARED_SEMANTIC_CLASS
CLS-QL-003  SELECT_COHERENT_SEMANTIC_GROUP
```

Category, function, part/whole, hierarchy, cross-cutting membership, four/five option count and locale remain generated-instance properties rather than separate QLs.

---

## Final state

```text
Permanent QLs:                 3
Frozen solve contracts:        3
Locales:                       en-IN, hi-IN, pa-IN
Question Studio exposure:      disabled
Question Bank storage:         disabled
Test eligibility:              disabled
Public publication:            disabled
```

The checkpoint is complete as a multilingual review-only runtime proof.
