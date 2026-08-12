# NUM-CP-001 Wave 02 — Inverse, Bound and Count Expansion

**Checkpoint:** Number Sets, Order, Parity and Integer Structure  
**Status:** executable discovery expansion  
**Permanent QLs:** 0

## 1. Purpose

Wave 1 proved the CP-001 architecture foundation. Wave 2 expands the directions that were deliberately left open: inverse membership/order states, exact non-integer bounds, filtered integer counts, inverse distance, parity reconstruction and same-parity consecutive blocks.

Wave 2 remains discovery-only. It does not claim source saturation and does not allocate `NUM-QL-*` identities.

## 2. Temporary prototype inventory

| Temporary ID | Discovery contract | Answer semantic | Governing inference |
|---|---|---|---|
| NUM-CP001-PROT-009 | select the only value outside a declared number set | RATIONAL_VALUE | exact set membership and smallest-set hierarchy |
| NUM-CP001-PROT-010 | least/greatest integer satisfying a strict/non-strict exact bound | INTEGER | floor/ceiling logic with endpoint strictness |
| NUM-CP001-PROT-011 | count integers between exact rational bounds | COUNT | first/last admissible integer without decimal approximation |
| NUM-CP001-PROT-012 | recover an integer interval endpoint from count evidence | INTEGER | inverse endpoint-count formula plus verification |
| NUM-CP001-PROT-013 | count positive/negative/even/odd integers in an interval | COUNT | interval membership intersected with one integer property |
| NUM-CP001-PROT-014 | recover the two integer points at a fixed distance from a centre | NUMBER_TUPLE | inverse absolute distance `|x-a|=d` |
| NUM-CP001-PROT-015 | recover missing parity from sum/product evidence | PARITY_CLASS | inverse parity algebra |
| NUM-CP001-PROT-016 | reconstruct consecutive odd/even integers from their sum | NUMBER_TUPLE | same-parity spacing by 2 and feasibility |

## 3. Ownership guardrails

- Fractions in P010/P011 are already-given exact bounds. No decimal/recurring representation conversion is required, so CP-002 is not the governing inference.
- P014 is restricted to inverse number-line distance. General absolute-value equations remain Algebra.
- P015 owns integer parity reconstruction only; generic algebraic solving is excluded.
- P016 requires consecutive odd/even structure. A plain linear equation without that structure remains Algebra.
- Prime/composite classification remains CP-004.
- Number-line drawing is a representation, not a separate prototype.

## 4. Difficulty policy

Difficulty is state-driven:

- integer versus non-integer bounds and strict versus non-strict endpoint effects;
- positive-only versus signed/cross-zero counting;
- one parity clue versus linked sum/product parity evidence;
- shorter versus longer same-parity consecutive blocks;
- direct inverse distance versus signed centre values.

Number magnitude alone must not determine difficulty.

## 5. Proof requirements

At least 100 deterministic seeds per prototype must prove:

- canonical/verifier agreement;
- deterministic replay;
- exactly four unique options and one correct answer;
- misconception ownership for every wrong option;
- all four answer positions;
- EASY/MEDIUM/HARD in every prototype;
- multiple genuine mathematical fingerprints;
- all strict/non-strict and least/greatest bound topologies;
- rational-bound counting without floating authority;
- positive/negative/even/odd filtered counts;
- both-side inverse-distance candidates;
- sum/product parity inverse states;
- odd and even consecutive-block reconstruction;
- zero permanent IDs and zero delivery leakage.

## 6. Remaining gaps after Wave 2

Wave 3 still owns the edge/representation expansion, including:

```text
mixed exact rational ordering without representation conversion
empty/singleton/multiple interval topology
possible/impossible consecutive block states
inverse consecutive feasibility with no integer solution
statement combination
data sufficiency
number-line/table evidence topology
rational-versus-irrational compound expression
representation equivalence audit across prose/number-line/interval notation
```

Wave 4 then performs source saturation and legacy recovery before Wave 5 merge/split.