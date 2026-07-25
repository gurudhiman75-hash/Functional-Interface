# PNL-CP-003 Completion Audit

Status: FREEZE CANDIDATE
Stable QL range: PNL-QL-071 through PNL-QL-094

## Scope discovery

The final count of 24 QLs was reached after auditing concept, inverse, edge-case, recovery, representation and exam-pattern coverage. It was not selected as a quota.

## Solve-mode audit

Covered families:

- multiple lots with different quantities, costs and selling prices;
- cost-weighted aggregation of group profit/loss rates;
- equal-selling-price and equal-cost-price pairs;
- equal-SP equal-rate special loss identity;
- reverse equal-SP rate reconstruction;
- unknown group rate and unknown group quantity for a target result;
- partial inventory and unsold-stock recovery;
- required unit price or rate on remaining stock;
- damaged/spoiled stock with salvage or recovery;
- supplier free units and effective inventory cost;
- total CP/SP forward and inverse relations;
- recovered-fraction and break-even recovery forms.

No remaining item in the CP-003 ownership boundary requires a distinct mathematical solver.

## Representation audit

Direct, inverse, table, caselet, statement, algebraic and data-sufficiency forms are present. Representation entries reuse the underlying solver rather than duplicating mathematics.

## Structural audit

- Registry IDs are contiguous from PNL-QL-071 to PNL-QL-094.
- Registry, English, Hindi and Punjabi counts are 24 each.
- Placeholder names are preserved across language companions.
- Every QL declares its required variables and answer semantic.
- Difficulty labels cover easy, medium and hard tasks.

## Editorial audit

- Questions use examination-style asks.
- Direction-neutral prompts ask for profit or loss where appropriate.
- Generic wording such as “What was the result of the transaction?” is prohibited.
- Distractors are misconception-driven and must follow `distractor-contract.json`.
- Explanations must show total cost, total recovery, absolute difference, direction and the correct percentage base.

## Runtime and verifier audit

- `inventory-solver.ts` contains the stable core forward modes.
- `inventory-advanced-solver.ts` contains inverse, weighted-group, recovery and special-identity modes.
- `cp003-independent-verifier.ts` independently recomputes multiple-lot results.
- `pnl-cp-003.test.ts` exercises representative core and advanced cases.

## Ownership audit

Included: multi-article inventory, equal-SP/equal-CP structures, unsold/damaged/spoiled/free stock and recovery.

Excluded: sequential trader chains, dishonest trade, overhead/recovery business accounting, retail promotion ownership and tax/GST.

## Deferred execution gate

Repository TypeScript, Node and esbuild execution is deferred to the consolidated PNL integration pass. A failure at that gate reopens CP-003.

## Freeze decision

No meaningful uncovered CP-003 solve mode remains after direct/reverse symmetry, inventory reconciliation, recovery, representation, multilingual and distractor audits. Reopen only for a test defect or a genuinely distinct book/PYQ pattern.
