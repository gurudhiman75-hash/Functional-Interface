# PNL-CP-004 Implementation Status

Status: FREEZE CANDIDATE

Count policy: DISCOVERED, NOT QUOTA-DRIVEN

Stable QL range: PNL-QL-095 through PNL-QL-120

## Structural parity

- Task registry: 26
- English: 26
- Hindi: 26
- Punjabi: 26

## Runtime ownership

CP-004 covers successive trader chains in which the same article changes hands two or more times. It includes:

- forward two-stage and three-stage pricing;
- reverse recovery of the first seller's cost price;
- intermediate transaction prices;
- overall chain profit or loss percentage;
- missing profit or loss rate at one stage;
- repeated equal-rate chains;
- stage-wise price and gain/loss ledgers;
- buyer expenses that alter effective cost;
- commission deducted from gross selling price;
- gross selling price required for a target net receipt;
- middle-trader net profit or loss after expense and commission;
- direct, inverse, table, caselet, statement, algebraic and data-sufficiency forms.

## Editorial contract

- Questions must identify who bought and sold the article clearly enough to establish each percentage base.
- Each stage rate applies to that trader's purchase or effective cost, not the original owner's cost.
- Direct exam-style asks are required.
- Distractors must map to named chain misconceptions; arbitrary plus/minus offsets are prohibited.
- Profit, loss, gross receipt, net receipt, expense and commission must remain semantically distinct.

## Runtime proof

`pnl-cp-004.test.ts` covers representative forward/reverse chains, a missing stage rate, equal-rate stages, stage-wise ledger values, expense-adjusted resale, commission, inverse gross receipt and a middle-trader net result.

`cp004-independent-verifier.ts` independently recomputes forward-chain values, reverse-chain values and commission-adjusted net receipts under the exact-paise contract.

## Deferred execution gate

Repository TypeScript, Node and esbuild execution remains deferred to the consolidated PNL integration pass. Reopen CP-004 if those checks expose a defect.

## Reopen rule

Reopen only for a runtime or test defect, a placeholder/parity failure, or a genuinely distinct source-backed successive-transaction pattern. Cosmetic stem variation does not justify reopening the CP.
