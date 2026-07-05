import { getQuantV4EntityResolver } from "./entity-context-map";
import { EntityReference } from "./entity-types";

type QuantV4Language = "en" | "hi" | "pa";

const LABEL_ENTITY_REFS: Record<string, EntityReference> = {
  "a": { categoryId: "percentage-label", entityId: "a" },
  "accounts": { categoryId: "percentage-label", entityId: "accounts" },
  "active users": { categoryId: "percentage-label", entityId: "active_users" },
  "admissions": { categoryId: "percentage-label", entityId: "admissions" },
  "adult passengers": { categoryId: "percentage-label", entityId: "adult_passengers" },
  "amount": { categoryId: "financial-concept", entityId: "amount" },
  "annual turnover": { categoryId: "percentage-label", entityId: "annual_turnover" },
  "applicants": { categoryId: "percentage-label", entityId: "applicants" },
  "assessed value": { categoryId: "percentage-label", entityId: "assessed_value" },
  "assessment score": { categoryId: "percentage-label", entityId: "assessment_score" },
  "asset a value": { categoryId: "percentage-label", entityId: "asset_a_value" },
  "asset b value": { categoryId: "percentage-label", entityId: "asset_b_value" },
  "asset value": { categoryId: "percentage-label", entityId: "asset_value" },
  "attendance": { categoryId: "unit", entityId: "attendance" },
  "attendance in school a": { categoryId: "percentage-label", entityId: "attendance_in_school_a" },
  "attendance in school b": { categoryId: "percentage-label", entityId: "attendance_in_school_b" },
  "b": { categoryId: "percentage-label", entityId: "b" },
  "bags": { categoryId: "percentage-label", entityId: "bags" },
  "bags of cement": { categoryId: "percentage-label", entityId: "bags_of_cement" },
  "bill": { categoryId: "percentage-label", entityId: "bill" },
  "bill amount": { categoryId: "percentage-label", entityId: "bill_amount" },
  "bonus fund": { categoryId: "percentage-label", entityId: "bonus_fund" },
  "books": { categoryId: "percentage-label", entityId: "books" },
  "boxes": { categoryId: "percentage-label", entityId: "boxes" },
  "boys": { categoryId: "group", entityId: "boys" },
  "branch a sales": { categoryId: "percentage-label", entityId: "branch_a_sales" },
  "branch a stock": { categoryId: "percentage-label", entityId: "branch_a_stock" },
  "branch b sales": { categoryId: "percentage-label", entityId: "branch_b_sales" },
  "branch b stock": { categoryId: "percentage-label", entityId: "branch_b_stock" },
  "budget": { categoryId: "financial-concept", entityId: "budget" },
  "budget allocation": { categoryId: "percentage-label", entityId: "budget_allocation" },
  "budget amount": { categoryId: "percentage-label", entityId: "budget_amount" },
  "cartons": { categoryId: "percentage-label", entityId: "cartons" },
  "cattle population": { categoryId: "percentage-label", entityId: "cattle_population" },
  "child passengers": { categoryId: "percentage-label", entityId: "child_passengers" },
  "commission income": { categoryId: "percentage-label", entityId: "commission_income" },
  "consumption": { categoryId: "percentage-label", entityId: "consumption" },
  "contract employees": { categoryId: "percentage-label", entityId: "contract_employees" },
  "contract value": { categoryId: "percentage-label", entityId: "contract_value" },
  "cost index": { categoryId: "percentage-label", entityId: "cost_index" },
  "crates": { categoryId: "percentage-label", entityId: "crates" },
  "crop production": { categoryId: "percentage-label", entityId: "crop_production" },
  "crop yield": { categoryId: "percentage-label", entityId: "crop_yield" },
  "damaged items": { categoryId: "percentage-label", entityId: "damaged_items" },
  "day scholars": { categoryId: "percentage-label", entityId: "day_scholars" },
  "electricity consumption": { categoryId: "percentage-label", entityId: "electricity_consumption" },
  "electricity usage": { categoryId: "percentage-label", entityId: "electricity_usage" },
  "employees": { categoryId: "group", entityId: "employees" },
  "expenditure": { categoryId: "financial-concept", entityId: "expenditure" },
  "expenses": { categoryId: "percentage-label", entityId: "expenses" },
  "female voters": { categoryId: "percentage-label", entityId: "female_voters" },
  "female workers": { categoryId: "percentage-label", entityId: "female_workers" },
  "fixed deposit": { categoryId: "percentage-label", entityId: "fixed_deposit" },
  "fund a value": { categoryId: "percentage-label", entityId: "fund_a_value" },
  "fund b value": { categoryId: "percentage-label", entityId: "fund_b_value" },
  "fund value": { categoryId: "percentage-label", entityId: "fund_value" },
  "girls": { categoryId: "percentage-label", entityId: "girls" },
  "good items": { categoryId: "percentage-label", entityId: "good_items" },
  "good units": { categoryId: "percentage-label", entityId: "good_units" },
  "hostellers": { categoryId: "percentage-label", entityId: "hostellers" },
  "households": { categoryId: "percentage-label", entityId: "households" },
  "illiterate residents": { categoryId: "percentage-label", entityId: "illiterate_residents" },
  "income": { categoryId: "financial-concept", entityId: "income" },
  "index value": { categoryId: "percentage-label", entityId: "index_value" },
  "internet users": { categoryId: "percentage-label", entityId: "internet_users" },
  "inventory": { categoryId: "percentage-label", entityId: "inventory" },
  "investment": { categoryId: "business", entityId: "biz_12" },
  "investment value": { categoryId: "percentage-label", entityId: "investment_value" },
  "items": { categoryId: "percentage-label", entityId: "items" },
  "kg": { categoryId: "percentage-label", entityId: "kg" },
  "literate residents": { categoryId: "percentage-label", entityId: "literate_residents" },
  "litres": { categoryId: "percentage-label", entityId: "litres" },
  "machine a value": { categoryId: "percentage-label", entityId: "machine_a_value" },
  "machine b value": { categoryId: "percentage-label", entityId: "machine_b_value" },
  "machine output": { categoryId: "percentage-label", entityId: "machine_output" },
  "machine value": { categoryId: "percentage-label", entityId: "machine_value" },
  "male voters": { categoryId: "percentage-label", entityId: "male_voters" },
  "male workers": { categoryId: "percentage-label", entityId: "male_workers" },
  "marked price": { categoryId: "percentage-label", entityId: "marked_price" },
  "market demand": { categoryId: "percentage-label", entityId: "market_demand" },
  "market value": { categoryId: "percentage-label", entityId: "market_value" },
  "marks": { categoryId: "education", entityId: "edu_19" },
  "milk production": { categoryId: "percentage-label", entityId: "milk_production" },
  "mixture": { categoryId: "percentage-label", entityId: "mixture" },
  "monthly income": { categoryId: "financial-concept", entityId: "monthly_income" },
  "monthly salary": { categoryId: "percentage-label", entityId: "monthly_salary" },
  "monthly turnover": { categoryId: "percentage-label", entityId: "monthly_turnover" },
  "monthly usage": { categoryId: "percentage-label", entityId: "monthly_usage" },
  "no responses": { categoryId: "percentage-label", entityId: "no_responses" },
  "number of internet users": { categoryId: "percentage-label", entityId: "number_of_internet_users" },
  "number of mobile users": { categoryId: "percentage-label", entityId: "number_of_mobile_users" },
  "number of students": { categoryId: "percentage-label", entityId: "number_of_students" },
  "number of users": { categoryId: "percentage-label", entityId: "number_of_users" },
  "number of visitors": { categoryId: "percentage-label", entityId: "number_of_visitors" },
  "offline respondents": { categoryId: "percentage-label", entityId: "offline_respondents" },
  "online respondents": { categoryId: "percentage-label", entityId: "online_respondents" },
  "output": { categoryId: "unit", entityId: "output" },
  "output level": { categoryId: "percentage-label", entityId: "output_level" },
  "passenger count": { categoryId: "percentage-label", entityId: "passenger_count" },
  "passengers": { categoryId: "group", entityId: "passengers" },
  "patients": { categoryId: "group", entityId: "patients" },
  "people": { categoryId: "unit", entityId: "people" },
  "permanent employees": { categoryId: "percentage-label", entityId: "permanent_employees" },
  "population": { categoryId: "group", entityId: "population" },
  "population of town a": { categoryId: "percentage-label", entityId: "population_of_town_a" },
  "population of town b": { categoryId: "percentage-label", entityId: "population_of_town_b" },
  "portfolio value": { categoryId: "percentage-label", entityId: "portfolio_value" },
  "premium amount": { categoryId: "percentage-label", entityId: "premium_amount" },
  "premium collection": { categoryId: "percentage-label", entityId: "premium_collection" },
  "price": { categoryId: "percentage-label", entityId: "price" },
  "price of product a": { categoryId: "percentage-label", entityId: "price_of_product_a" },
  "price of product b": { categoryId: "percentage-label", entityId: "price_of_product_b" },
  "product a price": { categoryId: "percentage-label", entityId: "product_a_price" },
  "product b price": { categoryId: "percentage-label", entityId: "product_b_price" },
  "production": { categoryId: "subject", entityId: "production" },
  "production a": { categoryId: "percentage-label", entityId: "production_a" },
  "production b": { categoryId: "percentage-label", entityId: "production_b" },
  "production level": { categoryId: "percentage-label", entityId: "production_level" },
  "production value": { categoryId: "percentage-label", entityId: "production_value" },
  "productivity index": { categoryId: "percentage-label", entityId: "productivity_index" },
  "profit": { categoryId: "financial-concept", entityId: "profit" },
  "quantity": { categoryId: "unit", entityId: "quantity" },
  "quintals": { categoryId: "percentage-label", entityId: "quintals" },
  "rainfall": { categoryId: "percentage-label", entityId: "rainfall" },
  "reams": { categoryId: "percentage-label", entityId: "reams" },
  "rent": { categoryId: "financial-concept", entityId: "rent" },
  "rent collection": { categoryId: "percentage-label", entityId: "rent_collection" },
  "residents": { categoryId: "percentage-label", entityId: "residents" },
  "respondents": { categoryId: "unit", entityId: "respondents" },
  "revenue": { categoryId: "percentage-label", entityId: "revenue" },
  "route a passengers": { categoryId: "percentage-label", entityId: "route_a_passengers" },
  "route b passengers": { categoryId: "percentage-label", entityId: "route_b_passengers" },
  "rural workers": { categoryId: "percentage-label", entityId: "rural_workers" },
  "salary": { categoryId: "financial-concept", entityId: "salary" },
  "salary a": { categoryId: "percentage-label", entityId: "salary_a" },
  "salary b": { categoryId: "percentage-label", entityId: "salary_b" },
  "sales": { categoryId: "percentage-label", entityId: "sales" },
  "sales figure": { categoryId: "percentage-label", entityId: "sales_figure" },
  "sales target": { categoryId: "percentage-label", entityId: "sales_target" },
  "school a's attendance": { categoryId: "percentage-label", entityId: "school_a_s_attendance" },
  "school b's attendance": { categoryId: "percentage-label", entityId: "school_b_s_attendance" },
  "seating capacity": { categoryId: "percentage-label", entityId: "seating_capacity" },
  "section a attendance": { categoryId: "percentage-label", entityId: "section_a_attendance" },
  "section b attendance": { categoryId: "percentage-label", entityId: "section_b_attendance" },
  "selling price": { categoryId: "percentage-label", entityId: "selling_price" },
  "shop a revenue": { categoryId: "percentage-label", entityId: "shop_a_revenue" },
  "shop b revenue": { categoryId: "percentage-label", entityId: "shop_b_revenue" },
  "skilled workers": { categoryId: "percentage-label", entityId: "skilled_workers" },
  "solution": { categoryId: "percentage-label", entityId: "solution" },
  "stock": { categoryId: "unit", entityId: "stock" },
  "stock in branch a": { categoryId: "percentage-label", entityId: "stock_in_branch_a" },
  "stock in branch b": { categoryId: "percentage-label", entityId: "stock_in_branch_b" },
  "store a sales": { categoryId: "percentage-label", entityId: "store_a_sales" },
  "store a turnover": { categoryId: "percentage-label", entityId: "store_a_turnover" },
  "store b sales": { categoryId: "percentage-label", entityId: "store_b_sales" },
  "store b turnover": { categoryId: "percentage-label", entityId: "store_b_turnover" },
  "strength": { categoryId: "percentage-label", entityId: "strength" },
  "student passengers": { categoryId: "percentage-label", entityId: "student_passengers" },
  "students": { categoryId: "group", entityId: "students" },
  "subscriber count": { categoryId: "percentage-label", entityId: "subscriber_count" },
  "supply": { categoryId: "percentage-label", entityId: "supply" },
  "tax collection": { categoryId: "percentage-label", entityId: "tax_collection" },
  "town a population": { categoryId: "percentage-label", entityId: "town_a_population" },
  "town b population": { categoryId: "percentage-label", entityId: "town_b_population" },
  "traffic volume": { categoryId: "percentage-label", entityId: "traffic_volume" },
  "trained employees": { categoryId: "percentage-label", entityId: "trained_employees" },
  "turnout": { categoryId: "percentage-label", entityId: "turnout" },
  "turnover": { categoryId: "percentage-label", entityId: "turnover" },
  "unit a output": { categoryId: "percentage-label", entityId: "unit_a_output" },
  "unit b output": { categoryId: "percentage-label", entityId: "unit_b_output" },
  "units": { categoryId: "percentage-label", entityId: "units" },
  "unskilled workers": { categoryId: "percentage-label", entityId: "unskilled_workers" },
  "untrained employees": { categoryId: "percentage-label", entityId: "untrained_employees" },
  "urban workers": { categoryId: "percentage-label", entityId: "urban_workers" },
  "usage": { categoryId: "unit", entityId: "usage" },
  "usage index": { categoryId: "percentage-label", entityId: "usage_index" },
  "value": { categoryId: "unit", entityId: "value" },
  "voter turnout": { categoryId: "percentage-label", entityId: "voter_turnout" },
  "voters": { categoryId: "percentage-label", entityId: "voters" },
  "votes": { categoryId: "percentage-label", entityId: "votes" },
  "warehouse a stock": { categoryId: "percentage-label", entityId: "warehouse_a_stock" },
  "warehouse b stock": { categoryId: "percentage-label", entityId: "warehouse_b_stock" },
  "weight": { categoryId: "percentage-label", entityId: "weight" },
  "wildlife population": { categoryId: "percentage-label", entityId: "wildlife_population" },
  "workers": { categoryId: "group", entityId: "workers" },
  "yes responses": { categoryId: "percentage-label", entityId: "yes_responses" },
};

export class MissingLabelLocalizationError extends Error {
  constructor(
    public readonly label: string,
    public readonly language: Exclude<QuantV4Language, "en">,
    public readonly reason: "empty-label" | "missing-localization",
  ) {
    super(
      reason === "empty-label"
        ? `Empty percentage label cannot be localized in ${language}.`
        : `Missing percentage label localization for "${label}" in ${language}.`,
    );
    this.name = "MissingLabelLocalizationError";
  }
}

export function localizePercentageLabel(label: string, language: QuantV4Language) {
  if (language === "en") return label;
  const normalizedLabel = label.trim().toLowerCase();
  if (!normalizedLabel) {
    throw new MissingLabelLocalizationError(label, language, "empty-label");
  }
  const reference = LABEL_ENTITY_REFS[normalizedLabel];
  if (!reference) {
    throw new MissingLabelLocalizationError(label, language, "missing-localization");
  }
  const localized = getQuantV4EntityResolver().resolveEntity(reference.categoryId, reference.entityId, language);
  if (localized.startsWith("[[MISSING_ENTITY:")) {
    throw new MissingLabelLocalizationError(label, language, "missing-localization");
  }
  return localized;
}

export function localizePercentageLabelFields<
  TVariables extends Record<string, string | number>,
>(
  variables: TVariables,
  language: QuantV4Language,
  labelFields: readonly string[],
) {
  if (language === "en") return variables;
  const localized = { ...variables };
  for (const field of labelFields) {
    const value = localized[field];
    if (typeof value !== "string") continue;
    localized[field] = localizePercentageLabel(value, language) as TVariables[keyof TVariables];
  }
  return localized;
}
