import type { PercentageSubtype } from "../canonical/percentage-types";
import type { TopologyVariant } from "../reasoning/topology-types";
import type {
  ScenarioFamily,
  ScenarioRegistryKey,
} from "./editorial-types";

export const SCENARIO_FAMILIES = {
  direct_margin: [
    "municipal_voting",
    "constituency_election",
    "student_union_voting",
  ],
  invalid_vote_margin: [
    "constituency_election",
    "municipal_voting",
    "village_council_election",
  ],
  turnout_margin: [
    "village_council_election",
    "municipal_voting",
    "student_union_voting",
  ],
  multi_candidate_margin: [
    "student_union_voting",
    "constituency_election",
    "employee_union_voting",
  ],
  remaining_vote_margin: [
    "employee_union_voting",
    "college_union_voting",
    "municipal_voting",
  ],
  filtered_valid_vote_margin: [
    "employee_union_voting",
    "municipal_voting",
    "constituency_election",
  ],
  simple_shortfall: [
    "recruitment_test",
    "qualifying_marks",
    "scholarship_exam",
  ],
  pass_fail_gap: [
    "screening_test",
    "recruitment_test",
    "qualifying_marks",
  ],
  successive_mark_adjustment: [
    "scholarship_exam",
    "recruitment_test",
    "screening_test",
  ],
  remaining_marks_required: [
    "qualifying_marks",
    "screening_test",
    "scholarship_exam",
  ],
  single_growth: [
    "census_report",
    "district_population_survey",
    "urban_rural_growth",
  ],
  growth_then_decay: [
    "district_population_survey",
    "census_report",
    "urban_rural_growth",
  ],
  migration_adjusted_population: [
    "migration_report",
    "district_population_survey",
    "census_report",
  ],
  male_female_population_shift: [
    "census_report",
    "district_population_survey",
    "urban_rural_growth",
  ],
  election_margin: [
    "municipal_voting",
    "constituency_election",
    "student_union_voting",
  ],
  pass_fail: [
    "recruitment_test",
    "qualifying_marks",
    "screening_test",
  ],
  population_growth: [
    "census_report",
    "district_population_survey",
    "migration_report",
  ],
  salary_revision: ["salary_revision"],
  price_consumption: [
    "petroleum_consumption_survey",
    "product_pricing",
  ],
  profit_loss: ["retailer_discount", "product_pricing"],
  mixture_percentage: ["mixture_container"],
  reverse_percentage: [
    "coaching_institute_test",
    "warehouse_stock_audit",
    "inventory_record",
  ],
  restore_original: [
    "warehouse_stock_audit",
    "salary_revision",
    "product_pricing",
  ],
  increase_then_decrease: [
    "warehouse_stock_audit",
    "industrial_production_log",
    "online_sales_growth",
    "product_pricing",
  ],
  commission: ["sales_commission_report"],
  taxation: ["income_tax_return"],
  venn_diagram: ["class_subject_survey"],
} as const satisfies Partial<
  Record<ScenarioRegistryKey, readonly ScenarioFamily[]>
>;

const SCENARIO_FAMILY_REGISTRY: Partial<
  Record<ScenarioRegistryKey, readonly ScenarioFamily[]>
> = SCENARIO_FAMILIES;

const FALLBACK_SCENARIOS = [
  "warehouse_stock_audit",
  "coaching_institute_test",
  "inventory_record",
] as const satisfies readonly ScenarioFamily[];

export function scenarioFamiliesFor(
  subtype: PercentageSubtype,
  topology?: TopologyVariant,
): readonly ScenarioFamily[] {
  if (topology && topology in SCENARIO_FAMILY_REGISTRY) {
    return SCENARIO_FAMILY_REGISTRY[topology] ?? FALLBACK_SCENARIOS;
  }

  return SCENARIO_FAMILY_REGISTRY[subtype] ?? FALLBACK_SCENARIOS;
}
