# STC-001 CP001 Review Boundary

This checkpoint implements only `STC-QL-001` and `STC-QL-002` as review-candidate content.

Implemented now:
- direct entailment / safe paraphrase;
- multi-clause conjunction/disjunction entailment;
- independent truth-model solver;
- curated EN/HI/PA scenario authorities;
- deterministic I/II presentation with all four answer classes;
- multilingual semantic parity proof;
- Question Bank/test/mock/public locks.

Reserved, not yet implemented:
- `STC-QL-003` conditional rule entailment;
- `STC-QL-004` modal-strength entailment;
- `STC-QL-005` comparative/order entailment;
- `STC-QL-006` temporal/change/trend entailment.

This file is not a freeze record. It is an explicit checkpoint boundary so later CPs cannot silently rewrite CP001 semantics.
