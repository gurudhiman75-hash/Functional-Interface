import type {
  CanonicalPercentageProblem,
  PercentageSubtype,
} from "../canonical/percentage-types";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import type { TopologyVariant } from "../reasoning/topology-types";
import type { RealizationProfile } from "./realization-profiles";

export type EditorialStyle =
  | "exam_standard"
  | "coaching"
  | "compact"
  | "shortcut_first";

export type EditorialRhythmProfile =
  | "coaching_rhythm"
  | "compact_exam_rhythm"
  | "shortcut_first_rhythm"
  | "equation_first_rhythm";

export type ScenarioFamily =
  | "constituency_election"
  | "municipal_voting"
  | "student_union_voting"
  | "college_union_voting"
  | "village_council_election"
  | "employee_union_voting"
  | "recruitment_test"
  | "scholarship_exam"
  | "qualifying_marks"
  | "screening_test"
  | "census_report"
  | "district_population_survey"
  | "migration_report"
  | "urban_rural_growth"
  | "salary_revision"
  | "warehouse_stock_audit"
  | "petroleum_consumption_survey"
  | "coaching_institute_test"
  | "inventory_record"
  | "industrial_production_log"
  | "school_result_analysis"
  | "product_pricing"
  | "retailer_discount"
  | "online_sales_growth"
  | "mixture_container"
  | "sales_commission_report"
  | "income_tax_return"
  | "class_subject_survey"
  | "general_percentage";

export interface ScenarioContext {
  family: ScenarioFamily;
  opening: string;
  entityLabel: string;
  domainNoun: string;
}

export interface EditorialPlan {
  style: EditorialStyle;
  scenario: ScenarioContext;
  informationOrder: string[];
  askVariable: string;
  revealStructure:
    | "direct"
    | "filtered"
    | "layered"
    | "remaining"
    | "component";
  targetLength: "short" | "balanced" | "expanded";
}

export interface EditorialRealization {
  scenario: ScenarioContext;
  style: EditorialStyle;
  stem: string;
  explanation: string;
  naturalization: NaturalizationTrace;
}

export interface NaturalizationTrace {
  rhythmProfile: EditorialRhythmProfile;
  phraseVariants: string[];
  shortcutSurfaced: boolean;
  stemPatternId: string;
  explanationPatternIds: string[];
  naturalizationScore: number;
}

export type EditorialInput = {
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  style?: EditorialStyle;
  seed?: number | string;
  realizationProfile?: RealizationProfile;
};

export type ScenarioRegistryKey =
  | PercentageSubtype
  | TopologyVariant;
