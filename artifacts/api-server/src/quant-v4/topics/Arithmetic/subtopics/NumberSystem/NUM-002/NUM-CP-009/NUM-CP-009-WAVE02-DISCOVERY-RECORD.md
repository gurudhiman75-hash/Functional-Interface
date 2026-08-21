# NUM-CP-009 — Wave 02 Discovery Record

**Checkpoint:** `NUM-CP-009 — Cyclicity, Unit Digit and Terminal Digits`  
**Wave:** 02 — terminal blocks and inverse gap expansion  
**Parent:** Wave 01 exact-head green  
**Permanent QLs:** 0  
**Next available QL:** `NUM-QL-185`

## Temporary prototype set

9. `NUM-CP009-PROT-009` — last two digits of a multi-term power expression;
10. `NUM-CP009-PROT-010` — last three digits of a single power;
11. `NUM-CP009-PROT-011` — last three digits of a multi-term power expression;
12. `NUM-CP009-PROT-012` — complete bounded exponent set from a target unit digit;
13. `NUM-CP009-PROT-013` — possible/impossible terminal-digit selection;
14. `NUM-CP009-PROT-014` — structured exponent followed by unit-digit cyclicity.

## Why these are material gaps

Wave 01 established direct unit-digit cyclicity, product/sum composition, bounded power towers, cycle length, inverse residue class, bounded counts and direct last-two digits. It did not yet establish:

- multi-term modulo-100 terminal blocks;
- any modulo-1000 learner target;
- complete bounded exponent sets distinct from counts;
- terminal-digit feasibility as an inverse reasoning contract;
- structured exponents that must be simplified before cycle reduction.

Wave 02 adds only those missing contracts; it does not multiply representations merely to raise prototype count.

## Independent proof paths

- P009/P011 canonical: repeated-squaring residues for each term, then terminal composition;
- P009/P011 verifier: direct repeated multiplication for every power before composition;
- P010 canonical: repeated squaring modulo 1000;
- P010 verifier: direct repeated multiplication modulo 1000;
- P012 canonical: explicit unit-digit cycle positions;
- P012 verifier: direct enumeration of each bounded exponent against actual modular powers;
- P013 canonical: known unit-digit cycle membership;
- P013 verifier: direct reachability scan of positive powers;
- P014 canonical: exact triangular/square-sum exponent then cycle lookup;
- P014 verifier: direct repeated multiplication to the computed exponent.

## Boundaries / learner hygiene

- two-digit and three-digit outputs are fixed-width strings, so `01`, `009`, etc. are preserved;
- bounded exponent sets return the complete set, including the empty set `∅` when appropriate;
- feasibility questions select a reachable or unreachable terminal digit rather than using vague truth labels;
- structured exponent questions explicitly show the exponent calculation before the cycle step;
- learner explanations remain concise and generated-value-specific.

## Still deferred

Wave 02 still does not claim saturation. Remaining source/gap questions include:

- structured repeated blocks / repdigits where structure materially affects the terminal computation;
- claim / statement-combination representation if it adds a distinct reasoning contract;
- terminal-digit Data Sufficiency if source-backed and non-duplicative;
- last non-zero digit source decision;
- final cross-wave merge/split;
- final CP008 / CP011 overlap audit.

## Lifecycle

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

Wave 02 does not allocate or reserve `NUM-QL-185`.
