# NUM-CP-014 Wave01 — Synthesis Foundation

Checkpoint: `NUM-CP-014 — Mixed Inverse, Optimisation and Number-Theory Synthesis`

Status: discovery only. No permanent QL is allocated. `NUM-QL-248` remains free.

## Admission rule

A question belongs to CP014 only when at least two proven Number System component engines are independently essential.

For every generated package Wave01 records three exact bounded candidate sets:

1. fullCandidates — both component constraints applied;
2. withoutA — component A removed, so only B remains;
3. withoutB — component B removed, so only A remains.

Wave01 currently admits only states satisfying:

- fullCandidates has exactly one solution;
- withoutA has more than one solution;
- withoutB has more than one solution.

Therefore removing either engine restores ambiguity. A decorative secondary property cannot pass the audit.

## Temporary prototypes

- `NUM-CP014-PROT-001` — hidden digit: divisibility + remainder.
- `NUM-CP014-PROT-002` — hidden integer: HCF + prime structure.
- `NUM-CP014-PROT-003` — divisor count + perfect square.
- `NUM-CP014-PROT-004` — factorial valuation + terminal-digit cycle.
- `NUM-CP014-PROT-005` — positional-base validity + divisibility.
- `NUM-CP014-PROT-006` — perfect square + remainder.

## Explanation standard

Every prototype uses `FULL_DERIVATION_AND_EXAM_SHORTCUT_V1` from its first discovery wave:

- show the candidate domain;
- derive the candidates produced by component A;
- derive the candidates produced by component B;
- intersect the sets and verify the surviving answer;
- then provide a separate faster exam route.

## Independent verifier

The independent audit does not trust runtime candidate arrays. It reconstructs each component from the hidden mathematical state using separate exact routines for gcd, primality, divisor enumeration, factorial valuation, terminal cycles, base validity, perfect-square recognition and modular remainder.

## Ownership locks

- Data Sufficiency remains owned by the dedicated DSF runtime. CP014 does not allocate a DS authority.
- Algebra-primary symbolic systems stay with Algebra.
- P&C/set-counting-primary questions remain outside CP014.
- A two-topic-looking question is rejected if ablation shows one component is decorative.

## Lifecycle

All downstream gates remain closed during discovery:

- Question Studio: OFF
- Question Bank: OFF
- test eligibility: OFF
- mock-test eligibility: OFF
- public publication: OFF
- automatic student publication: OFF
