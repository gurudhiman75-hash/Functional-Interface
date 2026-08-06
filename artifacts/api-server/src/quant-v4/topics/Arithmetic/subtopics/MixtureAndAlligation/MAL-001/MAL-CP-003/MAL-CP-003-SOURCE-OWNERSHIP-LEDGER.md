# MAL-CP-003 Source and Ownership Ledger

Status: **initial source recovery for open discovery**  
Permanent QLs: **0**

| Candidate surface | Legacy/source evidence | Current executable status | Ownership verdict | Notes |
|---|---|---|---|---|
| Equal repeated removal and refill → final original quantity | `replacement_repeated_operation` | Executable | `MAL-CP-003` | Direct geometric-retention core. |
| Final original fraction/purity | `replacement_final_purity` | Executable | `MAL-CP-003` | May later merge with quantity form if representation does not change the learner contract. |
| Final refill quantity | forward closure of repeated replacement and complement state | Executable | `MAL-CP-003` | Must distinguish total refill present from total volume poured across stages. |
| Initial original quantity from final state | `replacement_find_original_quantity` | Executable | `MAL-CP-003` | Inverse of the retention relation; uniqueness is linear once stage factors are known. |
| Equal removal quantity from final state | `replacement_find_replaced_quantity` | Executable only for exact rational roots | `MAL-CP-003` | Approximate/non-exact evidence remains excluded from the current learner frontier. |
| Number of operations | `dilution_find_number_of_operations` | Executable only for a unique exact integer count | `MAL-CP-003` | No approximate logarithmic answer without explicit rounding instructions and source support. |
| Unequal removed quantities | `replacement_asymmetric_removal_fractions` | Executable | `MAL-CP-003` | Uses product of stage-specific retained fractions. |
| Sequential refill with a third liquid | `replacement_double_replacement_third_liquid` | Executable discovery | `MAL-CP-003` | Requires full A/B/C stage ledger; merge/split by answer semantic remains open. |
| Successive dilution stated as concentration/percentage | `dilution_successive_replacement` | Pending boundary | `MAL-CP-003_CP004_BOUNDARY` | Repetition suggests CP-003; concentration semantics may justify CP-004 ownership. |
| Single replacement | `replacement_single_operation`, `mix_ratio_change_after_replacement` | Excluded from CP-003 frontier | `MAL-CP-002` | No geometric repetition; already implemented under one-step ratio adjustment. |
| Inter-vessel transfer | vessel transfer families | Excluded | `MAL-CP-006` | Requires multiple vessel ledgers, not one-vessel repeated retention. |

## Evidence limits

The current Quant V2 factory routes several named replacement families through one generic repeated-replacement generator. Therefore:

- family names are not treated as proof of distinct QLs;
- inverse and third-liquid surfaces require their own executable construction;
- source labels remain provisional until direct question fixtures and merge/split audits confirm the exact evidence contract;
- no family count is converted into a permanent QL count.

## Protected ambiguity cases

The following are deliberately excluded from execution until source and uniqueness evidence is available:

- final amount without enough information to identify the initial original quantity;
- unknown removal amount when the retained fraction has no exact rational stage root;
- unknown operation count with no unique integer solution;
- partial refill where vessel volume changes between stages;
- removal from a non-homogeneous or stratified liquid;
- concentration wording whose ownership between CP-003 and CP-004 is unresolved;
- transfer between separate vessels.

## Current conclusion

The repeated-retention domain is mathematically distinct enough to continue as MAL-CP-003 discovery. Freeze is not permitted because representation, concentration-boundary, edge, source and merge/split audits remain open.
