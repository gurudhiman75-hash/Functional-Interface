# MAL-CP-005 Wave 01 — Dishonest Mixing & Adulteration Profit Executable Discovery

Status: **open executable discovery**  
Canonical problem: **MAL-CP-005 — Commercial outcomes caused by mixture composition**  
Permanent QLs allocated: **0**  
Question Studio exposure: **disabled**

## Ownership rule

CP-005 owns a question only when the learner must use the composition of a mixture to determine a commercial result or reconstruct a composition from a commercial target. The essential bridge is:

```text
mixture composition → actual batch cost → selling receipt → profit percentage
```

False weight, false measure, short quantity and price fraud without mixture composition remain in `PNL-CP-005`.

## Wave 01 executable prototypes

| Prototype | Task | Core relation |
|---|---|---|
| `MAL-CP005-PROT-PROFIT-FROM-FREE-ADULTERANT-QUANTITIES` | Find gain from known pure and free-adulterant quantities when sold at pure cost | `gain% = adulterant/pure × 100` |
| `MAL-CP005-PROT-RATIO-FROM-TARGET-PROFIT-AT-PURE-COST` | Find pure:adulterant ratio for a target gain at pure cost | `pure:adulterant = 100:gain` |
| `MAL-CP005-PROT-ADULTERANT-QUANTITY-FROM-PURE-AND-TARGET-PROFIT` | Find free adulterant to add | direct scale from target gain |
| `MAL-CP005-PROT-PURE-QUANTITY-FROM-ADULTERANT-AND-TARGET-PROFIT` | Recover the paid pure quantity | inverse scale from target gain |
| `MAL-CP005-PROT-ADULTERANT-PERCENT-FROM-TARGET-PROFIT` | Convert gain on cost into adulterant share of final mix | base conversion |
| `MAL-CP005-PROT-PROFIT-FROM-ADULTERANT-PERCENT` | Convert final-mixture share into gain on cost | inverse base conversion |
| `MAL-CP005-PROT-PROFIT-FROM-FREE-BLEND-AND-SELLING-RATE` | Find gain when selling rate differs from pure-product cost | batch cost/revenue |
| `MAL-CP005-PROT-FREE-BLEND-RATIO-FROM-COST-SELLING-RATE-AND-TARGET-PROFIT` | Find pure:free-adulterant ratio from cost, selling rate and target gain | target average cost, then zero-cost blend |
| `MAL-CP005-PROT-FREE-BLEND-SELLING-RATE-FROM-RATIO-AND-TARGET-PROFIT` | Find required selling rate for a known free-adulterant ratio | average cost × commercial multiplier |
| `MAL-CP005-PROT-PROFIT-FROM-CHEAPER-IMPURITY-BLEND` | Find gain where the adulterant has a non-zero cost | weighted batch cost/revenue |
| `MAL-CP005-PROT-CHEAPER-IMPURITY-RATIO-FROM-TARGET-PROFIT` | Find higher-cost:cheaper ratio for target gain | target average cost and opposite differences |
| `MAL-CP005-PROT-CHEAPER-IMPURITY-SELLING-RATE-FROM-TARGET-PROFIT` | Find selling rate for a known two-cost blend | weighted cost × commercial multiplier |

These are checkpoint-local prototypes, not permanent QLs. Merge/split decisions remain open.

## Direct source recovery used for discovery

Wave 01 is grounded in the uploaded reference corpus, including:

- Disha SSC Mathematics Guide, Alligations chapter;
- Arun Sharma, *How to Prepare for Quantitative Aptitude*, alligation/dealer examples;
- the uploaded R.S. Aggarwal quantitative-aptitude material containing dairyman, water-addition and dishonest-milkman questions;
- the recovered quant-v2 dealer families and MAL-001 legacy disposition ledger.

Repository-normalized source fixtures and exact source-to-contract matrices remain a Wave 02 gate. Source maturity is therefore recorded as `REFERENCE_AND_LEGACY_RECOVERED_PENDING_FIXTURE_NORMALIZATION`, not as a permanent release authority.

## Explicit boundaries

1. `dealer_false_weight_alligation` is reassigned to `PNL-CP-005`.
2. Plain missing source price or ordinary blend-value reconstruction remains a CP-001/CP-005 boundary.
3. Target-loss and markup/discount compositions remain CP-005/PNL boundaries until mixture composition is proven indispensable.
4. Repeated replacement followed by sale remains a CP-003/CP-005 boundary.
5. No question is retained merely because its story mentions a dishonest seller.

## Runtime and editorial policy

Every generated question:

- uses exact rational arithmetic;
- is checked by an independent commercial-equation verifier;
- has four unique, method-derived options;
- maps every wrong option to a named misconception;
- shows actual cost and revenue through a commercial mixture ledger;
- uses a number-specific, solution-first English explanation;
- remains inactive, unpublished and unavailable to Question Studio, Question Bank and tests;
- carries no permanent `MAL-QL-*` identity;
- excludes PNL-owned false-weight and short-measure logic.

## Wave 01 proof target

```text
12 prototypes × 200 seeds = 2,400 generated questions
2,400 deterministic repeat checks
2,400 independent commercial-equation checks
60 human-review rows
```

The audit also checks prototype diversity, answer-position balance, source maturity, boundary preservation, delivery flags, option provenance and absence of generic nearby-value distractors.

## Exit criteria for Wave 02

Wave 02 should not allocate permanent QLs. It should:

1. normalize exact source fixtures and page-level evidence;
2. audit each forward/inverse pair for merge or split;
3. test the missing-component-cost family against CP-001 ownership;
4. audit target-loss and markup/discount variants against Profit & Loss;
5. add impossibility and boundary-state rules;
6. produce a source-normalized human review pack before any freeze recommendation.
