# NUM-CP-009 — Post-Wave02 Source / Gap Saturation Audit

**Checkpoint:** `NUM-CP-009 — Cyclicity, Unit Digit and Terminal Digits`  
**Implemented discovery prototypes audited:** `PROT-001..014`  
**Permanent QLs allocated:** 0  
**Next available Number System identity:** `NUM-QL-185`

## Source basis

The chapter source/ownership audit recovers the routine CP009 V2 families:

```text
ns_unit_digit_cycle
ns_last_two_digits
ns_last_three_digits
ns_expression_last_digit
ns_power_tower_digit
ns_cycle_length_detection
```

It also directs terminal-answer power remainders into CP009, while factorial last-non-zero work remains a CP009/CP011 ownership boundary.

The complete CP009 design additionally requires direct/inverse/count/range coverage, zero-cycle and leading-zero edges, last-non-zero disposition, representation merge discipline and a CP008/CP011 overlap audit.

## Coverage after Wave 02

Covered executable contracts:

- single-power unit digit;
- product and sum/difference unit-digit composition;
- bounded power tower / nested exponent;
- cycle length;
- inverse exponent residue class;
- bounded exponent count;
- single and multi-term last-two digits;
- single and multi-term last-three digits;
- complete bounded exponent set;
- possible/impossible terminal digit;
- structured triangular and square-sum exponents.

Wave 01 + Wave 02 therefore cover the main V2 routine terminal families and the major inverse extensions.

## Three material gaps that remain

### `NUM-CP009-PROT-015` — non-coprime terminal blocks / zero creation

Why material:

- existing terminal-block generation mostly uses bases coprime to 100/1000;
- CP009 explicitly requires factors two/five and answers such as `00` / `000`;
- non-coprime powers can have a preperiod and then stabilise, so a coprime multiplicative-order shortcut is not universally valid.

Target: last-two/last-three block under non-coprime power/product states with explicit zero creation and fixed-width answers.

### `NUM-CP009-PROT-016` — composite terminal condition with several exponent classes

Why material:

- current inverse tasks use one target digit and therefore one cycle position/class;
- the design explicitly requires several exponent residue classes for a composite terminal condition;
- conditions such as “unit digit belongs to a stated set” can produce more than one valid class and alter count/set reasoning.

Target: identify or use the complete exponent-class set under a composite terminal condition.

### `NUM-CP009-PROT-017` — long geometric / repeated-power terminal sum

Why material:

- current composition handles a few explicit terms;
- the design calls out repeated/geometric terminal expressions;
- a long sum requires period aggregation rather than simply evaluating two or three displayed powers.

Target: terminal digit of a long cyclic power sum using cycle-block aggregation, independently verified by bounded direct summation.

## Dispositions that do not justify new QLs now

- structured repeated block: adapter when only its suffix matters; CP010 when arbitrary digit construction is essential;
- CRT decomposition: solver route for terminal blocks, not a learner contract; general CRT stays CP008;
- claim/statement/cycle-table forms: representation adapters over existing semantics unless direct source evidence shows a new inference contract;
- terminal-digit Data Sufficiency: representation hold pending direct source evidence;
- factorial/product last non-zero digit: CP011 when valuation/trailing-zero structure is primary; CP014 only if valuation and terminal cycle both pass necessity ablation.

## Next gate

Implement only `PROT-015..017` as Wave 03, rerun Wave 01/02 regressions, then perform the final source saturation + representation merge/split proposal.

No permanent QL identity is reserved or consumed by this audit.
