# NUM-CP-009 — Wave 01 Discovery Record

**Checkpoint:** `NUM-CP-009 — Cyclicity, Unit Digit and Terminal Digits`  
**Wave:** 01 — terminal cyclicity foundation  
**Permanent QLs:** 0  
**Next available QL:** `NUM-QL-185`

## Temporary prototype set

1. `NUM-CP009-PROT-001` — unit digit of a single power;
2. `NUM-CP009-PROT-002` — unit digit of a product of powers;
3. `NUM-CP009-PROT-003` — unit digit of a sum/difference of powers;
4. `NUM-CP009-PROT-004` — unit digit of a bounded power tower;
5. `NUM-CP009-PROT-005` — identify unit-digit cycle length;
6. `NUM-CP009-PROT-006` — recover the exponent residue class from a target unit digit;
7. `NUM-CP009-PROT-007` — count bounded exponents producing a target unit digit;
8. `NUM-CP009-PROT-008` — last two digits of a single power, preserving leading zeroes.

## Independent proof strategy

- unit-digit canonical route: explicit base-ending cycle;
- unit-digit verifier: direct repeated modular multiplication;
- cycle-length canonical route: known base-ending cycle;
- cycle-length verifier: brute period check across repeated powers;
- inverse exponent class verifier: direct test of all residue positions;
- bounded count verifier: direct enumeration across the displayed interval;
- last-two-digit canonical route: multiplicative-order cycle modulo 100 for source-safe coprime bases;
- last-two-digit verifier: direct repeated multiplication modulo 100.

## Learner-facing contract

Every generated package uses concise human-facing structure:

- one clear question stem;
- one concept sentence;
- one strategy sentence;
- explicit working using the actual generated values;
- one final answer.

No generator metadata, hidden-state labels, permanent QL claims, generic option analysis or forced exam-trick sections are learner-facing.

Three stem families are exercised per prototype: direct, imperative and exam-style.

## Edge states deliberately exercised

- exponent zero;
- cycle length 1, 2 and 4;
- exponent divisible by cycle length;
- negative difference normalised to a valid unit digit;
- bounded ranges with no matching exponent;
- bounded ranges with several matching exponents;
- fixed-width last-two answer with leading zero.

## Deferred to later gap waves

Wave 01 does not claim checkpoint saturation. Still open:

- last two digits of multi-term sums/products/structured expressions;
- last three digits;
- structured repeated blocks;
- inverse bounded exponent set/unique-recovery variants;
- possible/impossible terminal digit;
- claim/statement-combination forms;
- Data Sufficiency;
- last non-zero digit source disposition;
- representation merge/split audit;
- final CP008/CP011 overlap audit.

## Lifecycle

All generated packages remain:

```text
permanentQlId:              null
maturity:                   EXECUTABLE_DISCOVERY_PROOF
reviewStatus:               UNREVIEWED_DISCOVERY_CANDIDATE
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
active:                     false
questionStudioDiscoverable: false
questionBankWritable:       false
testEligible:               false
publiclyPublishable:        false
```

Wave 01 is evidence for later source/gap saturation only; it does not reserve or consume `NUM-QL-185`.
