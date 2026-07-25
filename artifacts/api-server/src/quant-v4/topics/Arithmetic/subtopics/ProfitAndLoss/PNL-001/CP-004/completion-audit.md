# PNL-CP-004 Completion Audit

Status: FREEZE CANDIDATE

## Discovered scope

Stable QL range: `PNL-QL-095` through `PNL-QL-120`.

- Task registry: 26 entries
- English: 26 entries
- Hindi: 26 entries
- Punjabi: 26 entries
- Count policy: discovered, not quota-driven

## Solve-mode coverage

The CP covers forward and reverse two-stage and three-stage transaction chains, intermediate prices, overall chain percentage, missing profit or loss rates, repeated equal-rate stages, stage-wise ledgers, selected-stage amounts, largest stage amount, buyer expenses, commission deductions, inverse gross receipts and middle-trader net results.

## Representation coverage

The library includes direct, inverse, mixed-direction, table, caselet, statement, algebraic and data-sufficiency forms. Representation entries reuse the appropriate mathematical solver and do not create duplicate mathematics.

## Placeholder audit

- Required placeholder gaps: 0
- Unregistered template placeholders: 0
- English/Hindi/Punjabi placeholder parity gaps: 0
- Registry IDs and language IDs are contiguous and identical from 095 through 120.
- Structured values such as `{stages}`, `{knownStages}`, `{transactionTable}` and `{caseletData}` are explicit in the stems rather than hidden behind phrases such as “the stated rates”.

## Editorial audit

- Each successive rate is tied to the current trader's purchase or effective cost.
- Stems distinguish original cost, intermediate purchase price, gross selling price and net receipt.
- Questions use direct exam-style asks rather than classroom prompts.
- Profit/loss direction is not revealed when the task is to determine it.
- Distractors are restricted to identifiable chain, base, direction, expense or commission misconceptions.
- Arbitrary plus/minus numerical offsets are prohibited.

## Runtime proof

`pnl-cp-004.test.ts` contains representative checks for:

- two-stage forward pricing;
- reverse recovery of the original cost;
- missing-stage percentage;
- repeated equal-rate stages;
- stage-wise gain/loss ledger;
- buyer expense added to effective cost;
- commission deducted from gross selling price;
- gross selling price recovered from a net-receipt target;
- middle-trader net profit percentage.

`cp004-independent-verifier.ts` independently recomputes forward-chain, reverse-chain and commission results and enforces the exact-paise money contract.

## Ownership boundary

Included:

- the same article changing hands through successive traders;
- chain-level and stage-level commercial results;
- expenses or commission attached directly to a trader in the chain.

Excluded:

- marked price, coupon and cashback promotions owned by CP-002;
- multi-lot inventory and damaged stock owned by CP-003;
- dishonest weights or quantities;
- general business overhead and break-even analysis not attached to a stated chain transaction;
- partnership profit distribution and tax/GST.

## Deferred execution gate

Repository TypeScript, Node and esbuild execution remains deferred to the consolidated PNL integration pass. CP-004 must reopen if that pass reveals a runtime, type or import defect.

## Freeze decision

No meaningful uncovered successive-transaction transformation remains after the direct/reverse, missing-stage, ledger, fee/commission, representation, placeholder and QL-depth audits. Reopen only for a failing execution gate or a genuinely distinct source-backed PYQ mode.
