# PNL-CP-005 Completion Audit

Status: FREEZE CANDIDATE

## Discovered scope

Stable range: `PNL-QL-121` through `PNL-QL-149`.

- Task registry: 29
- English: 29
- Hindi: 29
- Punjabi: 29
- Count policy: discovered, not quota-driven

## Mathematical coverage audit

The CP covers the direct economic relation between quoted revenue and the cost of quantity actually delivered, together with all meaningful reverse forms found during discovery:

- actual result from price and false quantity;
- actual result from declared rate and false quantity;
- required false quantity for a target actual rate;
- required charge for a target actual rate;
- buying heavy and selling light;
- received-quantity and delivered-quantity inverses;
- markup/discount combined with false quantity;
- inverse markup and inverse discount;
- price change combined with short delivery;
- customer overcharge and effective true-quantity price;
- recovery of declared rate;
- recovery of true cost price;
- comparison of two deceptive schemes.

No meaningful direct/reverse gap remains within the stated ownership boundary.

## Structural audit

`cp-005-structural-audit.ts` verifies:

- contiguous IDs from 121 through 149;
- 29/29/29 language parity;
- registry count parity;
- exact required-placeholder parity in English, Hindi and Punjabi.

Repeated placeholders in a stem are deduplicated before contract comparison.

## Runtime proof audit

`pnl-cp-005.test.ts` includes representative cases for:

- selling at nominal cost with 20% short delivery;
- declared profit plus short delivery;
- target profit to false weight;
- buying 1,100 units and selling 900-unit measures;
- markup and discount with false quantity;
- price reduction combined with short delivery;
- customer effective overcharge;
- declared-rate inverse;
- true-cost inverse;
- effective full-measure customer price;
- comparison of two dishonest schemes.

`cp005-independent-verifier.ts` independently recomputes false-quantity rates, dual-cheating rates and customer-overcharge rates without calling the production solvers.

## Editorial and distractor audit

- Stems are exam-style and state the actual price and quantity relation.
- Dealer gain and customer overcharge are not conflated.
- False count and false metre are represented without new duplicate solvers.
- Distractors are tied to wrong bases, additive percentages, ignored buying advantage, ignored selling shortage, reversed inverse operations, or quoted-price-only comparisons.
- Arbitrary numerical offsets are prohibited.

## Explanation audit

`explanation-patterns.multilingual.json` contains one reasoning path for every QL in English, Hindi and Punjabi. The paths distinguish:

- cost of delivered quantity;
- declared versus actual rate;
- target inverses;
- dual buying/selling deception;
- markup/discount composition;
- customer effective price;
- comparison, table, caselet, statement, data-sufficiency and algebraic tasks.

## Ownership boundary

Included:

- false weight, false measure and false count;
- short delivery;
- buying heavy and selling light;
- combined price and quantity deception;
- markup/discount when false quantity is the defining feature;
- dealer actual result and customer effective overcharge.

Excluded:

- ordinary marked price and discount without quantity deception, owned by CP-002;
- inventory spoilage or free stock, owned by CP-003;
- successive trader chains, owned by CP-004;
- adulteration and mixture/alligation;
- tax and GST;
- overhead and break-even operating-cost questions.

## Deferred execution gate

The consolidated PNL TypeScript, Node and esbuild pass has not yet been run through this connector workflow. CP-005 must reopen if that pass exposes a defect.

## Freeze decision

No meaningful uncovered CP-005 mode remains after direct/reverse, dual-cheating, customer-impact, representation, placeholder, explanation and distractor audits. Reopen only for an execution failure or a genuinely distinct source-backed dishonest-trade pattern.
