# PNL-CP-003 Implementation Status

Status: FREEZE CANDIDATE
Count policy: DISCOVERED, NOT QUOTA-DRIVEN
Stable QL range: PNL-QL-071 through PNL-QL-094

## Structural parity

- Task registry: 24
- English: 24
- Hindi: 24
- Punjabi: 24

## Runtime coverage

CP-003 covers multiple inventory lots, weighted overall profit/loss, equal-selling-price and equal-cost-price article pairs, equal-SP special identities, unknown group rate and quantity inverses, partial and unsold stock, required selling price/rate on remaining stock, damaged and spoiled stock recovery, free-unit inventory, total CP/SP inverses, recovery fractions and break-even recovery.

## Representation coverage

Direct word problems, inverse problems, table, caselet, statement, algebraic and data-sufficiency forms are included. Representation QLs reuse existing runtime modes and do not inflate the solve-mode count.

## Editorial contract

- Use direct exam-style asks.
- Ask for profit or loss when direction should not be disclosed.
- Avoid generic classroom phrasing.
- Distractors must map to the misconception contract in `distractor-contract.json`; arbitrary plus/minus offsets are prohibited.
- Explanations must aggregate total cost and total recovery explicitly and identify the percentage base.

## Verification

- `pnl-cp-003.test.ts` covers representative multiple-lot, equal-SP identity, unsold-stock inverse, spoilage recovery and recovered-fraction cases.
- `cp003-independent-verifier.ts` independently recomputes multiple-lot totals and rates.

## Ownership boundary

Included: multiple articles, lots, equal-SP/equal-CP structures, partial inventory, unsold/damaged/spoiled/free stock, salvage and recovery.

Excluded: sequential trader chains, dishonest quantity/weight, overhead and break-even business expenses, marked-price retail promotion ownership and pure tax/GST.

## Deferred gate

Node/esbuild execution and repository TypeScript/build checks remain deferred to the consolidated PNL integration pass. Reopen CP-003 if those checks expose a defect.

## Reopen rule

Reopen only for a runtime/test defect or a genuinely distinct reference-book/PYQ mode. Otherwise CP-003 is complete for implementation sequencing.
