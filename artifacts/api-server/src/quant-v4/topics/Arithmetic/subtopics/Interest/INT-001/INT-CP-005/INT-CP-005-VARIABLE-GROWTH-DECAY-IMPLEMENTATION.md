# INT-CP-005 — Variable Compound Rates, Growth & Decay

Status: **multilingual executable review candidate**  
Permanent QLs: **INT-QL-086..INT-QL-095 (10)**  
Runtime: `INT-CP-005-VARIABLE-GROWTH-DECAY-v1`  
Languages: English, Hindi, Punjabi  
Delivery: **closed**

## Permanent task contracts

| QL | Contract | Core burden |
|---|---|---|
| INT-QL-086 | Variable periodic rates — final value | multiply successive growth factors |
| INT-QL-087 | Variable periodic rates — net compound gain | final value then subtract initial value |
| INT-QL-088 | Reverse initial value | divide final value by full factor product |
| INT-QL-089 | Missing periodic rate | isolate one unknown annual factor |
| INT-QL-090 | Periodic depreciation — final value | multiply remaining-value factors |
| INT-QL-091 | Reverse depreciation — original value | reverse remaining-value factors |
| INT-QL-092 | Mixed appreciation/depreciation | preserve signed factor order |
| INT-QL-093 | Threshold crossing period | bounded first-crossing proof |
| INT-QL-094 | Growth plus fixed migration/event order | recurrence with explicit order |
| INT-QL-095 | Compare two variable growth plans | independently accumulate two ledgers and compare |

## Merge/split decision

The 10-authority count is intentionally smaller than the raw source-family inventory.

Merged as context variants rather than separate QLs:

- population growth;
- salary escalation;
- production-capacity growth;
- price appreciation;
- machine/vehicle depreciation.

These contexts do not change the accumulation law or inverse. They remain available as learner-facing surfaces inside the governing QL.

Kept separate where the governing inference changes:

- final value versus net gain answer semantic;
- forward versus reverse accumulation;
- unknown rate versus unknown starting value;
- growth factors `1+r` versus depreciation factors `1-d`;
- mixed signed factors;
- first-threshold crossing;
- fixed-event order relative to percentage growth;
- comparison of two independent variable-rate plans.

## Legacy recovery

Covered legacy leads:

- `int_population_growth_ci`;
- `int_depreciation_ci`;
- `int_price_appreciation`;
- `int_machine_car_depreciation`;
- `int_successive_growth`;
- `int_successive_reduction`;
- `int_different_rates_different_years_ci`;
- depreciation-only portion of `int_compound_depreciation_repair_sale`.

## Protected ownership boundaries

- one-off successive percentage change without historical/future periodic value remains Percentage;
- variable conversion frequency remains INT-CP-004;
- heterogeneous dated money cash flows remain INT-CP-009;
- repair/sale/profit tails remain outside CP-005;
- no unrestricted logarithmic inversion is introduced.

## Learner-surface standard

- natural SSC/Banking/Punjab-state wording;
- context-specific growth/depreciation language;
- Examtree MathJax `\(...\)` / `\[...\]` wrappers;
- formula-first explanations;
- exact rational mathematical state;
- independent recurrence/relation verification;
- misconception-owned distractors;
- maximum two visible decimal places;
- no whole-rupee `.00`;
- Punjabi compound interest terminology uses `ਮਿਸ਼ਰਤ ਵਿਆਜ`;
- tables are used only where period rates or plan comparison materially benefit from them.

## Lifecycle

Every generated record remains:

- `enabled: false`;
- `stagingStatus: NOT_STAGED`;
- `registrationStatus: NOT_REGISTERED`;
- `questionStudioDiscoverable: false`;
- `questionBankStatus: NOT_STORED`;
- `testEligibility: INELIGIBLE`;
- `publiclyPublishable: false`.

No Question Studio provider/registry/route change is part of CP-005 implementation.
