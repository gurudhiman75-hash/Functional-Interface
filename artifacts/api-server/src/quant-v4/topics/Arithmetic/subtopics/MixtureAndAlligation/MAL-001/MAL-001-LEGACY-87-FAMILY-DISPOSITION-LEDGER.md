# MAL-001 Legacy 87-Family Disposition Ledger

Status: **provisional Phase 0 migration ledger**  
Source authority: current `New-main` Quant V2 type and factory registries  
Permanent QLs created: **0**

## 1. Count correction

The older chapter-planning PDF discussed 78 motifs. The current repository declares 87 family IDs in both:

```text
quant-v2/canonical/mixture-alligation-types.ts
quant-v2/canonical/mixture-alligation-motif-factories.ts
```

This ledger accounts for all 87 current families exactly once.

## 2. Disposition vocabulary

```text
CP00X                    clear prototype candidate for the stated working domain
CP00X_SCENARIO           scenario skin to consolidate; not a distinct contract by itself
CP00X_CP00Y_BOUNDARY     executable ownership/merge-split audit required
CP00X_AVG/PNL_BOUNDARY   cross-chapter collision audit required
REASSIGN_*               migrate out of MAL unless contrary direct source evidence appears
DECOMPOSE_SOURCE_EVIDENCE delivery/difficulty label, not a mathematical contract
SOURCE_EVIDENCE_REQUIRED likely exclude unless direct target-exam evidence supports it
INTERNAL_TEST_ONLY       retain only as engineering stress coverage
```

## 3. Complete ledger

| # | Legacy family | Provisional disposition | Reason |
|---:|---|---|---|
| 1 | `mix_two_price_blend_ratio` | `CP001` | Core two-source target-mean ratio. |
| 2 | `mix_two_items_find_ratio` | `CP001` | Same weighted-blend state; ratio answer candidate. |
| 3 | `mix_two_items_find_mean_price` | `CP001` | Mean from source values and quantities/ratio. |
| 4 | `mix_two_items_find_quantity` | `CP001` | Quantity inverse from blend relation. |
| 5 | `mix_two_items_find_missing_price` | `CP001` | Missing source-value inverse. |
| 6 | `mix_three_items_weighted_average` | `CP001_AVG_BOUNDARY` | Retain only when mixture composition is essential; otherwise AVG. |
| 7 | `mix_average_value_quantity_given` | `CP001_AVG_BOUNDARY` | Generic weighted-average naming requires ownership proof. |
| 8 | `mix_average_value_ratio_given` | `CP001_AVG_BOUNDARY` | Generic weighted-average naming requires ownership proof. |
| 9 | `mix_average_value_missing_quantity` | `CP001_AVG_BOUNDARY` | Retain only with genuine blend/component semantics. |
| 10 | `mix_average_value_missing_rate` | `CP001_AVG_BOUNDARY` | Retain only with genuine blend/component semantics. |
| 11 | `alligation_cheaper_dearer_ratio` | `CP001` | Canonical alligation cross. |
| 12 | `alligation_mean_price_given` | `CP001` | Forward mean reconstruction. |
| 13 | `alligation_find_cost_price` | `CP001` | Reverse source-value reconstruction. |
| 14 | `alligation_find_selling_price` | `CP001_PNL_BOUNDARY` | MAL only if this is a blend value; PNL if transaction profit drives the answer. |
| 15 | `alligation_equal_quantity_average` | `REASSIGN_AVG` | Equal-quantity averaging is AVG unless composition adds a distinct task. |
| 16 | `alligation_unequal_quantity_average` | `CP001_AVG_BOUNDARY` | Weighted blend if mixture is essential; otherwise AVG. |
| 17 | `alligation_successive_mixing` | `CP001` | Successive blend topology. |
| 18 | `alligation_two_stage_mean` | `CP001` | Two-stage blend topology. |
| 19 | `alligation_target_mean_quantity_added` | `CP001` | Add a source component to reach a target mean. |
| 20 | `alligation_remove_high_value_add_low_value` | `CP001_CP002_BOUNDARY` | Target-mean replacement versus two-substance adjustment must be split by state. |
| 21 | `mix_milk_water_basic_ratio` | `CP002` | Two-substance composition/ratio state. |
| 22 | `mix_milk_water_find_water_added` | `CP002` | Conserve milk and solve added water. |
| 23 | `mix_milk_water_find_milk_added` | `CP002` | Conserve water and solve added milk. |
| 24 | `mix_milk_water_target_ratio` | `CP002` | Target composition ratio. |
| 25 | `mix_milk_water_quantity_removed` | `CP002` | Single-step quantity removal; uniqueness audit required. |
| 26 | `replacement_single_operation` | `CP002_CP003_BOUNDARY` | Single replacement may reduce to CP002; CP003 is expected to own repeated decay. |
| 27 | `replacement_repeated_operation` | `CP003` | Repeated fractional replacement. |
| 28 | `replacement_find_original_quantity` | `CP003` | Inverse repeated-replacement contract. |
| 29 | `replacement_find_replaced_quantity` | `CP003` | Inverse removed-fraction/quantity contract. |
| 30 | `replacement_final_purity` | `CP003` | Final retained fraction/concentration after repeats. |
| 31 | `replacement_asymmetric_removal_fractions` | `CP003` | Different fraction per stage. |
| 32 | `replacement_double_replacement_third_liquid` | `CP003` | Multi-stage replacement with a third component. |
| 33 | `dilution_water_added_to_solution` | `CP004` | Concentration dilution by conserved solute. |
| 34 | `dilution_solution_removed_water_added` | `CP003_CP004_BOUNDARY` | Replacement topology plus concentration semantic; executable split audit needed. |
| 35 | `dilution_successive_replacement` | `CP003` | Repeated dilution. |
| 36 | `dilution_find_number_of_operations` | `CP003` | Inverse repetition count. |
| 37 | `concentration_basic_percent` | `CP004` | Concentration/component-percent state. |
| 38 | `concentration_target_percent_by_adding_water` | `CP004` | Conserved solute, added solvent. |
| 39 | `concentration_target_percent_by_adding_pure_substance` | `CP004` | Conserved solvent/total reconstruction. |
| 40 | `concentration_mixing_two_solutions` | `CP001_CP004_BOUNDARY` | Mathematically CP001; domain may belong CP004. Duplicate QLs are prohibited. |
| 41 | `concentration_mixing_three_solutions` | `CP001_CP004_BOUNDARY` | Multi-component blend versus concentration-domain ownership. |
| 42 | `concentration_evaporation_increase_percent` | `CP004` | Evaporation with conserved solute. |
| 43 | `concentration_water_evaporation` | `CP004` | Solve evaporated water. |
| 44 | `concentration_fresh_dry_weight_shift` | `CP004` | Conserved dry matter. |
| 45 | `mix_price_profit_basic` | `CP005` | Mixture composition feeds the profit calculation. |
| 46 | `mix_price_profit_target_gain` | `CP005` | Target gain from blend/adulteration. |
| 47 | `mix_price_profit_target_loss` | `CP005_PNL_BOUNDARY` | Retain only if mixture composition is essential; otherwise PNL. |
| 48 | `mix_cost_selling_price_alligation` | `CP001_CP005_BOUNDARY` | Blend-value alligation versus profit objective. |
| 49 | `mix_two_grades_of_rice` | `CP001_SCENARIO` | Scenario skin; must not survive as a distinct contract by noun alone. |
| 50 | `mix_two_grades_of_wheat` | `CP001_SCENARIO` | Scenario skin; consolidate with the generic grade blend. |
| 51 | `mix_tea_blend_average_price` | `CP001_SCENARIO` | Scenario skin; consolidate with the price-blend state. |
| 52 | `mix_fuel_blend_average_price` | `CP001_SCENARIO` | Scenario skin; retain only if realistic and safe. |
| 53 | `dealer_dishonest_milk_water` | `CP005` | Adulteration by mixing. |
| 54 | `dealer_false_weight_alligation` | `REASSIGN_PNL` | False weight and short measure belong to PNL. |
| 55 | `dealer_profit_by_mixing_water` | `CP005` | Free adulterant sold at product price. |
| 56 | `dealer_profit_with_impurity` | `CP005` | Cheaper impurity/adulterant profit. |
| 57 | `dealer_sells_mixture_at_cost_price` | `CP005` | Mixture-created effective profit. |
| 58 | `dealer_target_profit_after_adulteration` | `CP005` | Inverse adulteration ratio for target profit. |
| 59 | `vessel_two_vessels_same_ratio` | `CP006_EDGE` | Likely trivial/no-change edge; retain only if a distinct task survives. |
| 60 | `vessel_two_vessels_different_ratio` | `CP001_CP006_BOUNDARY` | Combining vessels may be a direct weighted blend; CP006 only if a vessel ledger matters. |
| 61 | `vessel_transfer_between_vessels` | `CP006` | Inter-vessel transfer ledger. |
| 62 | `vessel_equalization_after_transfer` | `CP006` | Transfer and equalisation. |
| 63 | `vessel_three_vessel_mixing` | `CP001_CP006_BOUNDARY` | Simple combination is CP001; vessel state or stages may justify CP006. |
| 64 | `vessel_chain_mixing` | `CP006` | Sequential vessel ledger. |
| 65 | `vessel_chemical_concentration_equilibrium` | `CP004_CP006_BOUNDARY` | Concentration versus transfer/equilibrium ownership. |
| 66 | `mix_reverse_alligation` | `CP001` | Reverse source/mean/ratio reconstruction. |
| 67 | `mix_difference_based_quantity` | `CP001` | Quantity from the cross-difference relation. |
| 68 | `mix_ratio_change_after_addition` | `CP002` | Single-component addition with the counterpart conserved. |
| 69 | `mix_ratio_change_after_removal` | `CP002` | Single-component removal with the counterpart conserved. |
| 70 | `mix_ratio_change_after_replacement` | `CP002_CP003_BOUNDARY` | Single replacement versus repeated replacement. |
| 71 | `mix_pure_component_extraction` | `CP002_CP004_BOUNDARY` | Component amount from ratio/concentration; classify by state and task. |
| 72 | `mix_final_component_quantity` | `CP002_CP004_BOUNDARY` | Final component amount; classify by ratio versus solute model. |
| 73 | `mix_compound_alligation_two_steps` | `CP001` | Two-stage blend. |
| 74 | `mix_pyq_style_nested_mixture` | `DECOMPOSE_SOURCE_EVIDENCE` | Delivery style is not a contract; decompose into underlying states. |
| 75 | `mix_high_difficulty_constraint_system` | `DECOMPOSE_SOURCE_EVIDENCE` | A difficulty label is not ownership; split by exact equations/topology. |
| 76 | `mix_alligation_three_way_blend` | `CP001` | Three-component target blend. |
| 77 | `alloy_metal_ratio_basic` | `CP001_SCENARIO` | Alloy scenario for the component-blend state. |
| 78 | `alloy_metal_added_removed` | `CP002_SCENARIO` | Single-component alloy adjustment. |
| 79 | `alloy_mean_price_blend` | `CP001_SCENARIO` | Alloy price blend; same core state. |
| 80 | `alloy_density_matrix` | `PHYSICS_BOUNDARY` | Retain only if mixture conservation is primary and the density law is simple. |
| 81 | `mix_speed_distance_time_alligation` | `REASSIGN_AVG_TSD` | Average speed or journey reconstruction belongs elsewhere. |
| 82 | `mix_partnership_capital_labor_alligation` | `REASSIGN_RAP` | Partnership contribution/profit distribution belongs to RAP. |
| 83 | `mix_taxation_gst_bracket_blending` | `REASSIGN_PCT_PNL` | Tax/commercial arithmetic belongs to Percentage or PNL. |
| 84 | `mix_geometric_density_fluid_strata` | `REASSIGN_MEN_PHYSICS` | Geometry or physical strata is not a core MAL contract. |
| 85 | `mix_average_score_weight_distribution` | `REASSIGN_AVG` | Weighted score distribution belongs to Average. |
| 86 | `mix_symbolic_alligation_numeric` | `SOURCE_EVIDENCE_REQUIRED` | Likely artificial dressing; retain only with direct exam evidence. |
| 87 | `mix_clonable_boundary_edge_alligation` | `INTERNAL_TEST_ONLY` | Use as an engineering stress fixture, not a student-facing contract. |

## 4. Immediate findings

1. **The six-domain hypothesis remains plausible, but many family names are not contracts.** At least seven explicit commodity/alloy families are scenario skins that should consolidate into broader mathematical contracts.
2. **Average is the largest ownership collision.** Generic weighted-average and equal-quantity families must not be duplicated merely because they use prices or blend nouns.
3. **CP-001/CP-004 and CP-001/CP-006 require executable split audits.** Mixing solutions or combining vessels can be the same weighted-state problem unless concentration invariants or transfer bookkeeping materially change the solve.
4. **Single replacement is not automatically CP-003.** If no repetition or geometric retention occurs, it may belong with one-step ratio adjustment.
5. **False weight is removed from MAL.** The corresponding legacy family is reassigned to PNL.
6. **Two legacy labels are not mathematical content.** `mix_pyq_style_nested_mixture` and `mix_high_difficulty_constraint_system` must be decomposed into underlying contracts.
7. **Two families are not presently student-content candidates.** One requires direct source evidence; one is suitable only as an internal edge fixture.

## 5. Next audit

For every row not marked as a clear CP candidate, recover at least one generated legacy instance or direct source fixture and record:

```text
displayed givens
hidden mathematical state
requested unknown
answer semantic
canonical equation
independent verification route
candidate owner
merge/split verdict
source evidence
```

Only then may the provisional disposition be promoted to a final authority decision.