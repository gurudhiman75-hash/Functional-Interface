# PNC-CP-011 Distribution Wave 1 — Implementation Report

## Verdict

`REVIEWED RUNTIME-PROOF CHECKPOINT COMPLETE — DISTINCT OBJECTS ONLY`

This checkpoint adds the first CP-011 distribution inventory after Grouping Wave 1. It covers distinct objects distributed to labelled or identical receivers. It does not claim identical-object distribution completion, CP-011 saturation, localization, shared-composer integration or publication readiness.

## Inventory

- QL range: `PNC-QL-219` through `PNC-QL-228`;
- active English QLs: 10;
- materially distinct solve modes: 10;
- difficulty: 1 Easy / 5 Medium / 4 Hard;
- next immutable PNC family ID: `PNC-QL-229`.

The ten modes remain separate because each changes at least one authoritative equation, evidence payload, independent predicate, explanation flow or misconception contract.

## Covered contracts

1. unrestricted assignment of distinct objects to labelled receivers;
2. every labelled receiver non-empty;
3. exactly `k` labelled receivers used;
4. at least one labelled receiver empty;
5. exact occupancy vector across labelled receivers;
6. exact occupancy of one specified receiver with all others unrestricted;
7. exact occupancy of one specified receiver with all others non-empty;
8. exactly `k` identical non-empty receivers;
9. at most `k` identical non-empty receivers;
10. any positive number of unnamed non-empty groups.

## Exact authorities

The runtime uses:

- independent receiver choice, `r^n`;
- onto assignment, `r! S(n,r)`;
- exact receiver use, `C(r,k) k! S(n,k)`;
- complement against onto assignments;
- multinomial occupancy counts;
- specified-receiver selection followed by unrestricted or onto assignment;
- Stirling numbers of the second kind for exact unlabelled partitions;
- bounded Stirling sums;
- Bell numbers for all unlabelled set partitions.

## Independent verification

Production formulas are checked against small-state exhaustive enumerators that do not call the production answer functions:

- every assignment of each distinct object to each labelled receiver;
- occupancy predicates for non-empty, exact-use and specified-receiver conditions;
- restricted-growth enumeration of unlabelled set partitions;
- exact, bounded and unrestricted partition-block predicates.

## Runtime proof

The reviewed workflow passed on implementation head `ca349d93c6c56cc133e6416edb6fbca667dfb0ad` before documentation reconciliation.

Proof results:

- strict TypeScript: pass;
- esbuild bundle: pass;
- 10 contiguous QLs: pass;
- 10 solve modes: pass;
- exact 1/5/4 difficulty snapshot: pass;
- 10 direct formula spot checks: pass;
- 120 deterministic mathematical cases: pass;
- every mathematical case generated twice: pass;
- production and independent answers agree: pass;
- four unique positive options: pass;
- all four correct-answer positions represented: pass;
- 39 distinct rendered stems: pass;
- 40 additional reviewed-TeX cases: pass;
- 10 mode-specific TeX command contracts: pass;
- unresolved placeholders: 0;
- duplicate templates: 0;
- invalid audit samples: 0;
- review rows: 10.

The grouping and executable-discovery regression workflows also passed on the same head.

## Defects found and repaired

### Missing receiver alias

The first runtime attempt exposed that two identical-receiver parameter pools did not carry the shared `boxCount` alias expected by the runtime evidence layer. The pools were repaired without changing any formula or weakening validation.

### JavaScript TeX escaping

The first mathematically green review artifact exposed collapsed JavaScript escapes:

- `\binom` produced a backspace control character;
- `\frac` produced a form-feed control character;
- `\sum` lost its leading backslash;
- `\,` spacing collapsed to a comma.

A reviewed runtime layer now normalizes the authored commands and enforces:

- no control characters in learner-visible output;
- no collapsed `sum_` or factorial-comma sequences;
- required `\binom`, `\frac`, `\sum` and `\,S` commands by QL contract.

The corrected review export was inspected and contains valid TeX for all ten QLs.

## Remaining CP-011 families

The next audit begins at `PNC-QL-229` and covers:

- identical objects to labelled receivers with empty receivers allowed;
- all receivers non-empty;
- exactly `k` receivers used;
- at least one receiver empty;
- common minimum occupancy;
- specified-recipient minimum occupancy;
- all non-empty plus a specified-recipient minimum;
- controlled uniform capacity;
- identical objects to identical receivers through integer partitions;
- bounded inverse recovery after forward-family maturity.

Final CP-011 QL and solve-mode totals remain need-based.

## Release safety

- English only;
- runtime remains outside the shared PNC-002 composer;
- no generation-engine registration;
- no Question Studio or Question Bank discovery;
- no test/public routing;
- every generated package remains `publiclyPublishable: false`.
