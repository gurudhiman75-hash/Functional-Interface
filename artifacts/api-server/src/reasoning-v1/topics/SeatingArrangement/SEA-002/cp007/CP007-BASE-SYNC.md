# SEA-CP-007 base synchronization

CP007 remains stacked on `feature/sea-002-cp006-question-studio-v1`.

The CP006 base advanced after hosted CI exposed a stale Question Studio lifecycle assertion: the immutable source adapter remains Bank-inactive, while the shared production facade is intentionally manual `BANK_ONLY`. The base proof was corrected without changing frozen content, Question Bank conversion semantics, or downstream test/public locks.

CP007 must inherit the corrected CP006 base before any permanent QL allocation. This marker documents that dependency; it grants no CP007 product activation and allocates no permanent identity.
