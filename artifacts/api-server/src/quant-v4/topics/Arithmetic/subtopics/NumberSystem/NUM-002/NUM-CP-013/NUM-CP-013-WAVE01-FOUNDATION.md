# NUM-CP-013 — Wave 01 Positional-Base Foundation

**Checkpoint:** `NUM-CP-013 — Positional Bases and Numeral Conversion`  
**Package:** `NUM-002`  
**Stage:** discovery only  
**Permanent QL allocation:** **not opened** (`NUM-QL-237` remains free)  
**Question Studio:** OFF  
**Question Bank / test / mock / public publication:** OFF

## Authority source

Wave 01 follows the current Number System design authority:

- `NUM-002-COMPLETE-CHECKPOINT-DESIGN.md`, CP013 sections 56–64;
- `NUMBER-SYSTEM-DESIGN-COMPLETION-AUTHORITY.md`;
- `NUMBER-SYSTEM-OPEN-QL-DISCOVERY-AND-FREEZE-PROTOCOL.md`.

The design requires positional expansion, repeated division, numeral validity/minimum-base reasoning, inverse digit/base states, arithmetic with carry/borrow, grouping methods, hexadecimal consistency and later advanced-disposition work.

## Wave 01 temporary prototypes

| Temporary prototype | Discovery authority | Answer semantic | Primary representation |
|---|---|---|---|
| `NUM-CP013-PROT-001` | base `b` → decimal | `DECIMAL_INTEGER` | positional expansion |
| `NUM-CP013-PROT-002` | decimal integer → base `b` | `BASE_NUMERAL` | repeated-division ladder |
| `NUM-CP013-PROT-003` | non-decimal base → another base | `BASE_NUMERAL` | two-stage base conversion |
| `NUM-CP013-PROT-004` | minimum valid base | `BASE` | digit-validity scan |
| `NUM-CP013-PROT-005` | unknown digit in numeral equality | `DIGIT` | positional equation |
| `NUM-CP013-PROT-006` | unknown base from decimal equality | `BASE` | bounded base candidate equation |
| `NUM-CP013-PROT-007` | addition in a base | `BASE_NUMERAL` | base column arithmetic |
| `NUM-CP013-PROT-008` | subtraction in a base | `BASE_NUMERAL` | base column arithmetic |

These are **temporary discovery prototypes**, not learner QLs.

## Explanation standard

Wave 01 adopts the current approved Number System review standard immediately:

`FULL_DERIVATION_AND_EXAM_SHORTCUT_V1`

Every package contains:

1. a full derivation that explains the source of place-value terms, quotient/remainder steps, base constraints, carry or borrow transformations and final arithmetic;
2. a separate shorter exam route/check;
3. the final answer bound to the verifier and correct option.

No hidden calculation jump is allowed to be justified only by a generic rule label.

## Independent verification

The canonical route and verification route are deliberately separated where practical:

- base-to-decimal: explicit positional expansion vs independent Horner reconstruction;
- decimal-to-base: repeated division vs largest-place reconstruction;
- cross-base: source expansion + target conversion vs independent source reconstruction + target conversion;
- minimum base: largest-digit rule vs exhaustive lower-base rejection;
- unknown digit: positional equation vs complete digit enumeration;
- unknown base: positional equation/monotonicity vs bounded valid-base enumeration;
- base addition: column carry algorithm vs decimal reconstruction and reconversion;
- base subtraction: column borrow algorithm vs decimal reconstruction and reconversion.

## Wave 01 certification target

The runtime audit covers **640 generated packages** (`8 prototypes × 80 seeds`). The independent minimality/uniqueness audit adds **1,280 checks** (`8 prototypes × 160 seeds`).

Certification requires:

- deterministic replay;
- four distinct options and one correct answer;
- canonical/verifier equality;
- all four answer positions reached per prototype;
- at least two normalized stem forms per prototype;
- carry forced for every P007 seed;
- borrow forced for every P008 seed;
- complete bounded uniqueness for unknown digit/base;
- detailed derivation + exam shortcut present;
- all downstream lifecycle gates closed;
- no `permanentQlId` / `questionLanguageId` emitted.

## Deliberately not closed in Wave 01

Wave 01 does **not** claim source saturation or permanent merge/split closure. Later discovery must still cover at minimum:

- binary/octal/hex direct grouping;
- hexadecimal `A–F` digit mapping and terminology;
- numeral validity / possible-impossible states beyond simple minimum-base projection;
- place value and number-of-digits in base `b`;
- largest/smallest `n`-digit numeral in base `b`;
- count/set of valid bases under a bound;
- unknown base from an arithmetic statement;
- multiplication in a base and multi-carry cases;
- deeper carry/borrow chains;
- compare numerals across different bases;
- fractional terminating conversion disposition;
- recurring fractional-base / large symbolic-base advanced holds;
- statement/data-sufficiency/representation disposition;
- CP010 / CP009 ownership boundary audit;
- source-backed saturation, generated-corpus gap audit, and final merge/split proposal.

Only after those gates close may permanent allocation begin at the then-current next free Number System QL.
