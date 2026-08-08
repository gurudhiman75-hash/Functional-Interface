# RNK-001 Manifest Amendment — CP-005

Status: **accepted into RNK-001 English discovery inventory after reasoning and option-quality remediation**

## Permanent allocation

```text
RNK-QL-036  SHARED_ENDPOINT_ENTITY
RNK-QL-037  SHARED_ENTITY_AT_POSITION
RNK-QL-038  SHARED_RANK_OF_ENTITY
RNK-QL-039  SHARED_PAIR_RELATION
RNK-QL-040  SHARED_RANK_GAP
RNK-QL-041  SHARED_IMMEDIATE_NEIGHBOUR
RNK-QL-042  SHARED_COMPLETE_ORDER
RNK-QL-043  SHARED_TRUE_STATEMENT
```

Next available RNK identity: `RNK-QL-044`.

## Ownership amendment

CP-005 owns reusable shared ranking evidence. A question belongs here only when:

- the runtime contract includes a stable shared-set identity;
- one evidence block supports multiple linked questions;
- the learner must reconstruct the common order;
- the complete rank sequence is not already displayed.

Complete rank tables and already ordered ledgers followed by direct lookup questions are explicitly excluded. Standalone exact-order reconstruction remains CP-004.

## Runtime amendment

```text
reasoning remodel:      RNK_CP005_REASONING_REMODEL_V2
language layer:         RNK_CP005_EXAM_LANGUAGE_V2
runtime:                RNK_CP005_PERMANENT_RUNTIME_V2
freeze:                 RNK_CP005_ENGLISH_REASONING_REMODEL_FREEZE_V2
permanent questions:    1,536
shared sets:            192
direct-rank exposure:   0
unrelated pair options: 0
target-own-neighbour:   0
projection SHA-256:     8ab6d6ab6965aec6be32753bec5d7f083f2b1b03810609b1b2bb40ea02ae8822
```

Every shared set is solved independently from learner-visible fixed-rank, comparison, immediate-position and rank-gap clues. A set is rejected unless those clues determine exactly one order.

## Cumulative registered projection

```text
CP-004 projection:      39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
CP-005 projection:      8ab6d6ab6965aec6be32753bec5d7f083f2b1b03810609b1b2bb40ea02ae8822
combined projection:    ef24476ee421e6c8de926a2a02d68f5e9a76333a10289ef66ae83dc97d78c0de
```

## Cumulative chapter inventory

```text
CP-001: RNK-QL-001..009
CP-002: RNK-QL-010..017
CP-003: RNK-QL-018..026
CP-004: RNK-QL-027..035
CP-005: RNK-QL-036..043

cumulative permanent range: RNK-QL-001..043
```

## Lifecycle

This amendment changes chapter discovery inventory only. It does not enable generation, persistence, Question Bank conversion, test eligibility, public publication or localisation.