import type {
  CanonicalPercentageProblem,
} from "../canonical/percentage-types";
import { createProblemSignature } from "../utils/problem-signature";
import type {
  ScenarioContext,
  ScenarioFamily,
} from "./editorial-types";
import { scenarioFamiliesFor } from "./scenario-registry";

const SCENARIO_TEXT = {
  constituency_election: {
    opening: "In a constituency election",
    entityLabel: "candidate",
    domainNoun: "votes",
  },
  municipal_voting: {
    opening: "In a municipal election",
    entityLabel: "candidate",
    domainNoun: "votes",
  },
  student_union_voting: {
    opening: "In a student union election",
    entityLabel: "candidate",
    domainNoun: "votes",
  },
  college_union_voting: {
    opening: "In a college union election",
    entityLabel: "candidate",
    domainNoun: "votes",
  },
  village_council_election: {
    opening: "In a village council election",
    entityLabel: "candidate",
    domainNoun: "votes",
  },
  employee_union_voting: {
    opening: "In an employee union election",
    entityLabel: "candidate",
    domainNoun: "votes",
  },
  recruitment_test: {
    opening: "In a recruitment test",
    entityLabel: "candidate",
    domainNoun: "marks",
  },
  scholarship_exam: {
    opening: "In a scholarship exam",
    entityLabel: "student",
    domainNoun: "marks",
  },
  qualifying_marks: {
    opening: "In a qualifying test",
    entityLabel: "student",
    domainNoun: "marks",
  },
  screening_test: {
    opening: "In a screening test",
    entityLabel: "candidate",
    domainNoun: "marks",
  },
  census_report: {
    opening: "According to a census report",
    entityLabel: "population",
    domainNoun: "people",
  },
  district_population_survey: {
    opening: "In a district population survey",
    entityLabel: "population",
    domainNoun: "people",
  },
  migration_report: {
    opening: "In a migration report",
    entityLabel: "population",
    domainNoun: "people",
  },
  urban_rural_growth: {
    opening: "In an urban-rural population report",
    entityLabel: "population",
    domainNoun: "people",
  },
  salary_revision: {
    opening: "After a salary revision",
    entityLabel: "employee",
    domainNoun: "salary",
  },
  warehouse_stock_audit: {
    opening: "In a warehouse stock audit",
    entityLabel: "stock",
    domainNoun: "quantity",
  },
  petroleum_consumption_survey: {
    opening: "In a petroleum consumption survey",
    entityLabel: "fuel",
    domainNoun: "consumption",
  },
  coaching_institute_test: {
    opening: "In a coaching institute test",
    entityLabel: "student",
    domainNoun: "marks",
  },
  inventory_record: {
    opening: "In an inventory record",
    entityLabel: "stock",
    domainNoun: "quantity",
  },
  industrial_production_log: {
    opening: "In an industrial production log",
    entityLabel: "production",
    domainNoun: "quantity",
  },
  school_result_analysis: {
    opening: "In a school result analysis",
    entityLabel: "student",
    domainNoun: "marks",
  },
  product_pricing: {
    opening: "For a product",
    entityLabel: "price",
    domainNoun: "price",
  },
  retailer_discount: {
    opening: "A retailer sold an item",
    entityLabel: "item",
    domainNoun: "price",
  },
  online_sales_growth: {
    opening: "During an online sale",
    entityLabel: "value",
    domainNoun: "value",
  },
  mixture_container: {
    opening: "In a mixture container",
    entityLabel: "mixture",
    domainNoun: "quantity",
  },
  sales_commission_report: {
    opening: "In a sales commission report",
    entityLabel: "agent",
    domainNoun: "sales",
  },
  income_tax_return: {
    opening: "In an income tax return",
    entityLabel: "taxpayer",
    domainNoun: "income",
  },
  class_subject_survey: {
    opening: "In a class subject survey",
    entityLabel: "student",
    domainNoun: "students",
  },
  general_percentage: {
    opening: "In a percentage problem",
    entityLabel: "value",
    domainNoun: "value",
  },
} as const satisfies Record<
  ScenarioFamily,
  Omit<ScenarioContext, "family">
>;

function hashText(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function selectScenario(
  problem: CanonicalPercentageProblem,
  seed?: number | string,
): ScenarioContext {
  const families = scenarioFamiliesFor(
    problem.subtype,
    problem.topology?.variant,
  );
  const hash = hashText(
    `${seed ?? ""}|${createProblemSignature(problem)}`,
  );
  const family = families[hash % families.length]!;

  return {
    family,
    ...SCENARIO_TEXT[family],
  };
}
