import type {
  CanonicalMixtureAlligationProblem,
  MixtureAlligationAnswerKind,
  MixtureAlligationAnswerUnit,
  MixtureExplanationBlock,
  MixtureAlligationFamilyId,
  MixtureAlligationMotifFactory,
  MixtureExplanationStep,
  MixtureLocalizedText,
  MixturePreferredSolutionMethod,
  MixtureSolverModel,
} from "./mixture-alligation-types";

export const MIXTURE_ALLIGATION_FAMILY_IDS = [
  "mix_two_price_blend_ratio",
  "mix_two_items_find_ratio",
  "mix_two_items_find_mean_price",
  "mix_two_items_find_quantity",
  "mix_two_items_find_missing_price",
  "mix_three_items_weighted_average",
  "mix_average_value_quantity_given",
  "mix_average_value_ratio_given",
  "mix_average_value_missing_quantity",
  "mix_average_value_missing_rate",
  "alligation_cheaper_dearer_ratio",
  "alligation_mean_price_given",
  "alligation_find_cost_price",
  "alligation_find_selling_price",
  "alligation_equal_quantity_average",
  "alligation_unequal_quantity_average",
  "alligation_successive_mixing",
  "alligation_two_stage_mean",
  "alligation_target_mean_quantity_added",
  "alligation_remove_high_value_add_low_value",
  "mix_milk_water_basic_ratio",
  "mix_milk_water_find_water_added",
  "mix_milk_water_find_milk_added",
  "mix_milk_water_target_ratio",
  "mix_milk_water_quantity_removed",
  "replacement_single_operation",
  "replacement_repeated_operation",
  "replacement_find_original_quantity",
  "replacement_find_replaced_quantity",
  "replacement_final_purity",
  "replacement_asymmetric_removal_fractions",
  "replacement_double_replacement_third_liquid",
  "dilution_water_added_to_solution",
  "dilution_solution_removed_water_added",
  "dilution_successive_replacement",
  "dilution_find_number_of_operations",
  "concentration_basic_percent",
  "concentration_target_percent_by_adding_water",
  "concentration_target_percent_by_adding_pure_substance",
  "concentration_mixing_two_solutions",
  "concentration_mixing_three_solutions",
  "concentration_evaporation_increase_percent",
  "concentration_water_evaporation",
  "concentration_fresh_dry_weight_shift",
  "mix_price_profit_basic",
  "mix_price_profit_target_gain",
  "mix_price_profit_target_loss",
  "mix_cost_selling_price_alligation",
  "mix_two_grades_of_rice",
  "mix_two_grades_of_wheat",
  "mix_tea_blend_average_price",
  "mix_fuel_blend_average_price",
  "dealer_dishonest_milk_water",
  "dealer_false_weight_alligation",
  "dealer_profit_by_mixing_water",
  "dealer_profit_with_impurity",
  "dealer_sells_mixture_at_cost_price",
  "dealer_target_profit_after_adulteration",
  "vessel_two_vessels_same_ratio",
  "vessel_two_vessels_different_ratio",
  "vessel_transfer_between_vessels",
  "vessel_equalization_after_transfer",
  "vessel_three_vessel_mixing",
  "vessel_chain_mixing",
  "vessel_chemical_concentration_equilibrium",
  "mix_reverse_alligation",
  "mix_difference_based_quantity",
  "mix_ratio_change_after_addition",
  "mix_ratio_change_after_removal",
  "mix_ratio_change_after_replacement",
  "mix_pure_component_extraction",
  "mix_final_component_quantity",
  "mix_compound_alligation_two_steps",
  "mix_pyq_style_nested_mixture",
  "mix_high_difficulty_constraint_system",
  "mix_alligation_three_way_blend",
  "alloy_metal_ratio_basic",
  "alloy_metal_added_removed",
  "alloy_mean_price_blend",
  "alloy_density_matrix",
  "mix_speed_distance_time_alligation",
  "mix_partnership_capital_labor_alligation",
  "mix_taxation_gst_bracket_blending",
  "mix_geometric_density_fluid_strata",
  "mix_average_score_weight_distribution",
  "mix_symbolic_alligation_numeric",
  "mix_clonable_boundary_edge_alligation",
] as const satisfies readonly MixtureAlligationFamilyId[];

export const MIXTURE_ALLIGATION_TODO_FAMILY_IDS = { phaseA: [], phaseB: [], phaseC: [], phaseD: [] } as const;

export const MIXTURE_ALLIGATION_STEM_TEMPLATE_COVERAGE: Record<string, number> = {
  alligation: 8,
  weighted: 8,
  target: 8,
  replacement: 8,
  concentration: 8,
  dealer: 8,
  vessel: 8,
  premium: 8,
};

export const MIXTURE_ALLIGATION_FAMILY_STEM_BANK = Object.fromEntries(
  MIXTURE_ALLIGATION_FAMILY_IDS.map((family) => [family, family.includes("replacement") ? "replacement" : family.includes("dealer") ? "dealer" : family.includes("vessel") ? "vessel" : family.includes("concentration") || family.includes("dilution") ? "concentration" : family.includes("alloy") || family.includes("density") || family.includes("taxation") || family.includes("score") || family.includes("speed") || family.includes("partnership") ? "premium" : family.includes("target") || family.includes("added") || family.includes("removed") ? "target" : family.includes("average") || family.includes("three") ? "weighted" : "alligation"]),
) as Record<MixtureAlligationFamilyId, string>;

type Locale = "en" | "hi" | "pa";
type Group = "alligation" | "weighted" | "target" | "replacement" | "concentration" | "dealer" | "vessel" | "premium";
type Spec = {
  id: MixtureAlligationFamilyId;
  group: Group;
  difficulty: "easy" | "medium" | "hard";
  complexity: "easy" | "medium" | "hard" | "advanced";
  principle: MixtureLocalizedText;
  formula: string;
  shortcut: MixtureLocalizedText;
  traps: string[];
};
type Draft = {
  stem: MixtureLocalizedText;
  model: MixtureSolverModel;
  variables: Record<string, unknown>;
  answerKind: MixtureAlligationAnswerKind;
  answerUnit: MixtureAlligationAnswerUnit;
  steps: MixtureExplanationStep[];
  shortcutMath: string;
};

const text = (en: string, hi: string, pa: string): MixtureLocalizedText => ({ en, hi, pa });
function stemContext(group: Group, seed: string): MixtureLocalizedText {
  const shared = [
    text("Two quantities are mixed. ", "एक किराना दुकान में, ", "ਇੱਕ ਕਰਿਆਨੇ ਦੀ ਦੁਕਾਨ ਵਿੱਚ, "),
    text("Two lots are available. ", "थोक ऑर्डर के लिए, ", "ਥੋਕ ਆਰਡਰ ਲਈ, "),
    text("Two qualities are mixed. ", "बाज़ार की दुकान पर, ", "ਬਾਜ਼ਾਰ ਦੀ ਦੁਕਾਨ ਤੇ, "),
    text("The given quantities are mixed. ", "स्टॉक तैयार करते समय, ", "ਸਟਾਕ ਤਿਆਰ ਕਰਦੇ ਸਮੇਂ, "),
    text("A required mixture is made. ", "ग्राहक के ऑर्डर के लिए, ", "ਗਾਹਕ ਦੇ ਆਰਡਰ ਲਈ, "),
    text("In a retail shop, ", "खुदरा दुकान में, ", "ਖੁਦਰਾ ਦੁਕਾਨ ਵਿੱਚ, "),
    text("Two lots are mixed where ", "एक व्यापारी मिश्रण तैयार करता है जिसमें ", "ਇੱਕ ਵਪਾਰੀ ਮਿਸ਼ਰਣ ਤਿਆਰ ਕਰਦਾ ਹੈ ਜਿਸ ਵਿੱਚ "),
    text("A store manager notes that ", "एक स्टोर प्रबंधक नोट करता है कि ", "ਇੱਕ ਸਟੋਰ ਮੈਨੇਜਰ ਨੋਟ ਕਰਦਾ ਹੈ ਕਿ "),
    text("For a monthly stock blend, ", "मासिक स्टॉक मिश्रण के लिए, ", "ਮਹੀਨਾਵਾਰ ਸਟਾਕ ਮਿਸ਼ਰਣ ਲਈ, "),
    text("At a ration store, ", "राशन दुकान पर, ", "ਰਾਸ਼ਨ ਦੀ ਦੁਕਾਨ ਤੇ, "),
  ];
  const liquid = [
    text("In a laboratory vessel, ", "प्रयोगशाला के बर्तन में, ", "ਲੈਬ ਦੇ ਬਰਤਨ ਵਿੱਚ, "),
    text("For a solution kept in a tank, ", "टंकी में रखे घोल के लिए, ", "ਟੈਂਕੀ ਵਿੱਚ ਰੱਖੇ ਘੋਲ ਲਈ, "),
    text("In a dairy container, ", "डेयरी के बर्तन में, ", "ਡੇਅਰੀ ਦੇ ਬਰਤਨ ਵਿੱਚ, "),
    text("A vessel is being adjusted where ", "एक बर्तन में अनुपात बदला जा रहा है जहाँ ", "ਇੱਕ ਬਰਤਨ ਵਿੱਚ ਅਨੁਪਾਤ ਬਦਲਿਆ ਜਾ ਰਿਹਾ ਹੈ ਜਿੱਥੇ "),
    text("During mixture correction, ", "मिश्रण सुधारते समय, ", "ਮਿਸ਼ਰਣ ਠੀਕ ਕਰਦੇ ਸਮੇਂ, "),
    text("In a storage can, ", "भंडारण के कनस्तर में, ", "ਸਟੋਰੇਜ ਦੇ ਡੱਬੇ ਵਿੱਚ, "),
    text("For a prepared liquid mix, ", "तैयार तरल मिश्रण के लिए, ", "ਤਿਆਰ ਤਰਲ ਮਿਸ਼ਰਣ ਲਈ, "),
    text("A technician handles a solution where ", "एक तकनीशियन एक घोल संभालता है जहाँ ", "ਇੱਕ ਤਕਨੀਸ਼ੀਅਨ ਇੱਕ ਘੋਲ ਸੰਭਾਲਦਾ ਹੈ ਜਿੱਥੇ "),
    text("At a dairy plant, ", "डेयरी संयंत्र में, ", "ਡੇਅਰੀ ਪਲਾਂਟ ਵਿੱਚ, "),
    text("For a tank correction, ", "टंकी सुधारने के लिए, ", "ਟੈਂਕੀ ਠੀਕ ਕਰਨ ਲਈ, "),
  ];
  const dealer = [
    text("At a milk booth, ", "दूध की दुकान पर, ", "ਦੁੱਧ ਦੀ ਦੁਕਾਨ ਤੇ, "),
    text("A milk seller does this: ", "एक दूधवाला ऐसा करता है: ", "ਇੱਕ ਦੁੱਧ ਵਾਲਾ ਇਹ ਕਰਦਾ ਹੈ: "),
    text("In a market sale, ", "बाज़ार की बिक्री में, ", "ਬਾਜ਼ਾਰ ਦੀ ਵਿਕਰੀ ਵਿੱਚ, "),
    text("While selling milk, ", "दूध बेचते समय, ", "ਦੁੱਧ ਵੇਚਦੇ ਸਮੇਂ, "),
    text("A shopkeeper uses this practice: ", "एक दुकानदार यह तरीका अपनाता है: ", "ਇੱਕ ਦੁਕਾਨਦਾਰ ਇਹ ਤਰੀਕਾ ਵਰਤਦਾ ਹੈ: "),
    text("For a sale at cost price, ", "लागत मूल्य पर बिक्री के लिए, ", "ਲਾਗਤ ਮੁੱਲ ਤੇ ਵਿਕਰੀ ਲਈ, "),
    text("During a shop sale, ", "दुकान की बिक्री के दौरान, ", "ਦੁਕਾਨ ਦੀ ਵਿਕਰੀ ਦੌਰਾਨ, "),
    text("At a dairy counter, ", "डेयरी काउंटर पर, ", "ਡੇਅਰੀ ਕਾਊਂਟਰ ਤੇ, "),
  ];
  const premium = [
    text("In a workshop calculation, ", "वर्कशॉप की गणना में, ", "ਵਰਕਸ਼ਾਪ ਦੀ ਗਿਣਤੀ ਵਿੱਚ, "),
    text("For an alloy mixture, ", "मिश्रधातु के मिश्रण के लिए, ", "ਮਿਸ਼ਰ ਧਾਤ ਦੇ ਮਿਸ਼ਰਣ ਲਈ, "),
    text("During a quality check, ", "गुणवत्ता जाँच के दौरान, ", "ਗੁਣਵੱਤਾ ਜਾਂਚ ਦੌਰਾਨ, "),
    text("In a factory mixture, ", "फैक्टरी के मिश्रण में, ", "ਫੈਕਟਰੀ ਦੇ ਮਿਸ਼ਰਣ ਵਿੱਚ, "),
    text("For a material blend, ", "सामग्री के मिश्रण के लिए, ", "ਸਮੱਗਰੀ ਦੇ ਮਿਸ਼ਰਣ ਲਈ, "),
    text("A production team records that ", "उत्पादन टीम दर्ज करती है कि ", "ਉਤਪਾਦਨ ਟੀਮ ਦਰਜ ਕਰਦੀ ਹੈ ਕਿ "),
    text("For a testing sample, ", "परीक्षण नमूने के लिए, ", "ਟੈਸਟਿੰਗ ਨਮੂਨੇ ਲਈ, "),
    text("In a materials lab, ", "सामग्री प्रयोगशाला में, ", "ਸਮੱਗਰੀ ਲੈਬ ਵਿੱਚ, "),
  ];
  const bank = group === "dealer" ? dealer : group === "replacement" || group === "concentration" || group === "vessel" ? liquid : group === "premium" ? premium : shared;
  return pick(bank, `${seed}:context`);
}
function diversifyStem(stemValue: MixtureLocalizedText, group: Group, seed: string): MixtureLocalizedText {
  void group;
  void seed;
  return stemValue;
}
const PRINCIPLES = {
  alligation: text("Compare each price with the required mean and use the alligation cross.", "औसत से दोनों मूल्यों का अंतर लेकर मिश्रण विधि लगाएं।", "ਔਸਤ ਨਾਲ ਦੋਵੇਂ ਮੁੱਲਾਂ ਦਾ ਫਰਕ ਲੈ ਕੇ ਐਲੀਗੇਸ਼ਨ ਤਰੀਕਾ ਲਗਾਓ।"),
  weighted: text("Use weighted average: total value divided by total quantity.", "भारित औसत में कुल मूल्य को मिश्रण की मात्रा से भाग दें।", "ਭਾਰਿਤ ਔਸਤ ਵਿੱਚ ਕੁੱਲ ਮੁੱਲ ਨੂੰ ਮਿਸ਼ਰਣ ਦੀ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦਿਓ।"),
  target: text("Keep the existing component fixed and form the target-ratio equation.", "मौजूदा घटक को स्थिर रखकर लक्ष्य अनुपात का समीकरण बनाएं।", "ਮੌਜੂਦਾ ਹਿੱਸੇ ਨੂੰ ਸਥਿਰ ਰੱਖ ਕੇ ਟੀਚਾ ਅਨੁਪਾਤ ਦਾ ਸਮੀਕਰਨ ਬਣਾਓ।"),
  replacement: text("In replacement, the same fraction of original liquid remains after each operation.", "निकालकर बदलने में हर बार मूल द्रव का वही अंश बचता है।", "ਕੱਢ ਕੇ ਬਦਲਣ ਵਿੱਚ ਹਰ ਵਾਰ ਮੂਲ ਦ੍ਰਵ ਦਾ ਉਹੀ ਹਿੱਸਾ ਬਚਦਾ ਹੈ।"),
  concentration: text("When water is added or evaporated, solute amount is conserved.", "पानी जोड़ने या उड़ने पर घुले पदार्थ की मात्रा स्थिर रहती है।", "ਪਾਣੀ ਜੋੜਨ ਜਾਂ ਉੱਡਣ ਤੇ ਘੁੱਲੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਸਥਿਰ ਰਹਿੰਦੀ ਹੈ।"),
  dealer: text("Adulteration profit comes from selling unpaid impurity as the pure item.", "मिलावट का लाभ बिना लागत की मिलावट बेचने से आता है।", "ਮਿਲਾਵਟ ਦਾ ਲਾਭ ਬਿਨਾ ਲਾਗਤ ਵਾਲੀ ਮਿਲਾਵਟ ਵੇਚਣ ਨਾਲ ਆਉਂਦਾ ਹੈ।"),
  vessel: text("After transfer, the moved liquid has the current ratio of that vessel.", "स्थानांतरण के बाद निकला मिश्रण उसी पात्र के वर्तमान अनुपात में होता है।", "ਤਬਾਦਲੇ ਤੋਂ ਬਾਅਦ ਕੱਢਿਆ ਮਿਸ਼ਰਣ ਉਸੇ ਬਰਤਨ ਦੇ ਮੌਜੂਦਾ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।"),
  premium: text("Use conservation of component value, mass, or weighted rate.", "घटक मूल्य, द्रव्यमान या भारित दर का संरक्षण लगाएं।", "ਘਟਕ ਮੁੱਲ, ਭਾਰ ਜਾਂ ਭਾਰਿਤ ਦਰ ਦਾ ਸੰਰੱਖਣ ਲਗਾਓ।"),
} as const;

function hashText(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length]!;
}
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function ratioText(a: number, b: number) {
  const g = gcd(a, b);
  return `${a / g}:${b / g}`;
}
function round2(value: number) {
  return Number(value.toFixed(2));
}
function numericSignature(values: Record<string, unknown>) {
  return Object.entries(values).sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => `${k}:${Array.isArray(v) ? v.join(",") : String(v)}`).join("|");
}
function ensureQuestionStem(stem: string) {
  const trimmed = stem.trim();
  if (/[?]\s*$/u.test(trimmed)) return trimmed;
  return `${trimmed.replace(/[।.]\s*$/u, "")}?`;
}
function lowerFirst(textValue: string) {
  return textValue.length ? `${textValue[0]!.toLocaleLowerCase("en-US")}${textValue.slice(1)}` : textValue;
}
function displayMath(value: string) {
  return `\\[\n${value}\n\\]`;
}
function step(key: string, en: string, hi: string, pa: string, math?: string, value?: number | string): MixtureExplanationStep {
  return { key, text: { en, hi, pa }, math, value };
}

export function evaluateMixtureSolverModel(model: MixtureSolverModel): number | string {
  const i = model.inputs as any;
  switch (model.kind) {
    case "alligation_ratio":
      return ratioText(Number(i.dearer) - Number(i.mean), Number(i.mean) - Number(i.cheaper));
    case "weighted_mean":
      return round2((i.quantities as number[]).reduce((sum, q, idx) => sum + q * (i.rates as number[])[idx]!, 0) / (i.quantities as number[]).reduce((a, b) => a + b, 0));
    case "target_add_quantity":
      return round2((Number(i.targetB) * Number(i.a) - Number(i.targetA) * Number(i.b)) / Number(i.targetA));
    case "replacement_left":
      return round2(Number(i.volume) * (i.fractions as number[]).reduce((left, f) => left * (1 - f), 1));
    case "concentration_add_water": {
      const finalVolume = Number(i.c1) * Number(i.volume) / Number(i.c2);
      return round2(finalVolume - Number(i.volume));
    }
    case "concentration_add_pure":
      return round2(Number(i.volume) * (Number(i.c2) - Number(i.c1)) / (1 - Number(i.c2)));
    case "evaporation": {
      const finalVolume = Number(i.c1) * Number(i.volume) / Number(i.c2);
      return round2(Number(i.volume) - finalVolume);
    }
    case "fresh_dry":
      return round2(Number(i.freshWeight) * (1 - Number(i.freshWater)) / (1 - Number(i.dryWater)));
    case "dealer_profit_ratio":
      return ratioText(100, Number(i.profit));
    case "false_weight_profit":
      return round2((1000 - Number(i.weight)) * 100 / Number(i.weight));
    case "vessel_transfer": {
      const movedPure = Number(i.transfer) * Number(i.a) / (Number(i.a) + Number(i.b));
      return round2(Number(i.aQty) - movedPure);
    }
    case "density_blend": {
      const m1 = Number(i.m1), m2 = Number(i.m2), d1 = Number(i.d1), d2 = Number(i.d2);
      return round2((m1 + m2) / (m1 / d1 + m2 / d2));
    }
    default:
      throw new Error(`Unsupported mixture solver kind: ${model.kind}`);
  }
}

function answerText(answer: number | string, unit: MixtureAlligationAnswerUnit, language: Locale) {
  if (typeof answer === "string") return answer;
  const value = Number.isInteger(answer) ? String(answer) : String(answer);
  const units = {
    kg: { en: "kg", hi: "किग्रा", pa: "ਕਿਲੋ" },
    litres: { en: "litres", hi: "लीटर", pa: "ਲੀਟਰ" },
    rupees: { en: "₹", hi: "₹", pa: "₹" },
    percent: { en: "%", hi: "%", pa: "%" },
    density: { en: "kg/litre", hi: "किग्रा/लीटर", pa: "ਕਿਲੋ/ਲੀਟਰ" },
    ratio: { en: "", hi: "", pa: "" },
    none: { en: "", hi: "", pa: "" },
  }[unit][language];
  if (unit === "rupees") return `₹${value}`;
  if (unit === "percent") return `${value}%`;
  return units ? `${value} ${units}` : value;
}

function makeOptions(answer: number | string, unit: MixtureAlligationAnswerUnit, seed: string) {
  if (typeof answer === "string") {
    const [a, b] = answer.split(":").map(Number);
    const pool = [answer, `${b}:${a}`, ratioText(a + 1, b), ratioText(a, b + 1), ratioText(a + b, b)].filter(Boolean);
    return uniqueOptions(pool).slice(0, 4);
  }
  const stepSize = unit === "percent" ? 5 : answer < 10 ? 1 : 5;
  const deltas = [0, stepSize, -stepSize, stepSize * 2, -stepSize * 2, stepSize * 3];
  return uniqueOptions(deltas.map((delta) => answerText(Math.max(stepSize, round2(answer + delta)), unit, "en"))).slice(0, 4);
}
function uniqueOptions(options: string[]) {
  const seen = new Set<string>();
  return options.filter((option) => {
    if (seen.has(option)) return false;
    seen.add(option);
    return true;
  });
}

function shortcutNarrative(shortcutMath: string, language: Locale) {
  if (/C_q:D_q/u.test(shortcutMath)) {
    return {
      en: "The mean lies between the two values. The farther value must be used in the smaller quantity, so we take the opposite differences.",
      hi: "औसत दोनों मानों के बीच होता है। जो मान औसत से जितना दूर है, उसकी मात्रा उतनी कम रखी जाती है, इसलिए विपरीत अंतर लिए जाते हैं।",
      pa: "ਔਸਤ ਦੋਵੇਂ ਮੁੱਲਾਂ ਦੇ ਵਿਚਕਾਰ ਹੁੰਦੀ ਹੈ। ਜੋ ਮੁੱਲ ਔਸਤ ਤੋਂ ਜਿੰਨਾ ਦੂਰ ਹੈ, ਉਸ ਦੀ ਮਾਤਰਾ ਉੱਨੀ ਘੱਟ ਰੱਖੀ ਜਾਂਦੀ ਹੈ, ਇਸ ਲਈ ਉਲਟੇ ਫਰਕ ਲਏ ਜਾਂਦੇ ਹਨ।",
    }[language];
  }
  if (/\\rho/u.test(shortcutMath)) {
    return {
      en: "Density is mass per unit volume. When masses and densities are given, first convert each mass into volume, then divide total mass by total volume.",
      hi: "घनत्व प्रति इकाई आयतन द्रव्यमान है। जब द्रव्यमान और घनत्व दिए हों, पहले हर द्रव्यमान को आयतन में बदलें, फिर कुल द्रव्यमान को कुल आयतन से भाग दें।",
      pa: "ਘਣਤਾ ਇਕਾਈ ਆਇਤਨ ਦਾ ਭਾਰ ਹੈ। ਜਦੋਂ ਭਾਰ ਅਤੇ ਘਣਤਾ ਦਿੱਤੇ ਹੋਣ, ਪਹਿਲਾਂ ਹਰ ਭਾਰ ਨੂੰ ਆਇਤਨ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਕੁੱਲ ਭਾਰ ਨੂੰ ਕੁੱਲ ਆਇਤਨ ਨਾਲ ਭਾਗ ਦਿਓ।",
    }[language];
  }
  if (/\\left\(1-\\frac\{x\}\{V\}/u.test(shortcutMath)) {
    return {
      en: "Each replacement removes the same fraction of the original liquid. Therefore the original part is multiplied by the remaining fraction each time.",
      hi: "हर बार मूल द्रव का वही अंश निकलता है। इसलिए मूल भाग हर क्रिया के बाद बचे हुए अंश से गुणा होता है।",
      pa: "ਹਰ ਵਾਰ ਮੂਲ ਦ੍ਰਵ ਦਾ ਉਹੀ ਹਿੱਸਾ ਨਿਕਲਦਾ ਹੈ। ਇਸ ਲਈ ਮੂਲ ਹਿੱਸਾ ਹਰ ਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਬਚੇ ਹਿੱਸੇ ਨਾਲ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।",
    }[language];
  }
  if (/C_1V_1=C_2V_2/u.test(shortcutMath)) {
    return {
      en: "When only water changes, the solute amount remains fixed. Equate initial solute and final solute.",
      hi: "जब केवल पानी बदलता है, घुला पदार्थ स्थिर रहता है। प्रारंभिक और अंतिम घुले पदार्थ को बराबर रखें।",
      pa: "ਜਦੋਂ ਸਿਰਫ਼ ਪਾਣੀ ਬਦਲਦਾ ਹੈ, ਘੁੱਲਿਆ ਪਦਾਰਥ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਅੰਤਿਮ ਘੁੱਲੇ ਪਦਾਰਥ ਨੂੰ ਬਰਾਬਰ ਰੱਖੋ।",
    }[language];
  }
  return {
    en: "Keep the conserved quantity fixed and write the relation around it. This avoids using a simple arithmetic average blindly.",
    hi: "जो मात्रा स्थिर रहती है, उसे आधार बनाकर संबंध लिखें। इससे साधारण औसत लगाने की गलती नहीं होती।",
    pa: "ਜੋ ਮਾਤਰਾ ਸਥਿਰ ਰਹਿੰਦੀ ਹੈ, ਉਸ ਨੂੰ ਆਧਾਰ ਬਣਾ ਕੇ ਸੰਬੰਧ ਲਿਖੋ। ਇਸ ਨਾਲ ਸਧਾਰਣ ਔਸਤ ਲਗਾਉਣ ਦੀ ਗਲਤੀ ਨਹੀਂ ਹੁੰਦੀ।",
  }[language];
}

function conceptNarrative(steps: readonly MixtureExplanationStep[], shortcutMath: string, language: Locale) {
  if (/C_q:D_q/u.test(shortcutMath)) {
    return {
      en: "This is an alligation question. The required mean lies between the lower and higher values, so the quantities must balance the two gaps from the mean.",
      hi: "यह मिश्रण-विधि का प्रश्न है। आवश्यक औसत कम और अधिक मान के बीच है, इसलिए मात्राएँ औसत से बने दोनों अंतरों को संतुलित करती हैं।",
      pa: "ਇਹ ਐਲੀਗੇਸ਼ਨ ਤਰੀਕੇ ਦਾ ਪ੍ਰਸ਼ਨ ਹੈ। ਲੋੜੀਂਦਾ ਔਸਤ ਘੱਟ ਅਤੇ ਵੱਧ ਮੁੱਲਾਂ ਦੇ ਵਿਚਕਾਰ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਮਾਤਰਾਵਾਂ ਔਸਤ ਤੋਂ ਬਣੇ ਦੋਵੇਂ ਫਰਕ ਸੰਤੁਲਿਤ ਕਰਦੀਆਂ ਹਨ।",
    }[language];
  }
  if (/\\rho/u.test(shortcutMath)) {
    return {
      en: "This is not a simple average of densities. Density means mass divided by volume, so masses must first be converted into volumes.",
      hi: "यह घनत्वों का साधारण औसत नहीं है। घनत्व का अर्थ द्रव्यमान को आयतन से भाग देना है, इसलिए पहले द्रव्यमानों को आयतन में बदलना होगा।",
      pa: "ਇਹ ਘਣਤਾਵਾਂ ਦਾ ਸਧਾਰਣ ਔਸਤ ਨਹੀਂ ਹੈ। ਘਣਤਾ ਦਾ ਅਰਥ ਭਾਰ ਨੂੰ ਆਇਤਨ ਨਾਲ ਭਾਗ ਦੇਣਾ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਭਾਰਾਂ ਨੂੰ ਆਇਤਨ ਵਿੱਚ ਬਦਲਣਾ ਪਵੇਗਾ।",
    }[language];
  }
  if (/\\left\(1-\\frac\{x\}\{V\}/u.test(shortcutMath)) {
    return {
      en: "This is a repeated replacement question. After each operation, the same fraction of the original liquid remains in the vessel.",
      hi: "यह बार-बार निकालकर बदलने का प्रश्न है। हर क्रिया के बाद मूल द्रव का वही अंश बर्तन में बचता है।",
      pa: "ਇਹ ਵਾਰ-ਵਾਰ ਕੱਢ ਕੇ ਬਦਲਣ ਵਾਲਾ ਪ੍ਰਸ਼ਨ ਹੈ। ਹਰ ਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਮੂਲ ਦ੍ਰਵ ਦਾ ਉਹੀ ਹਿੱਸਾ ਬਰਤਨ ਵਿੱਚ ਬਚਦਾ ਹੈ।",
    }[language];
  }
  if (/C_1V_1=C_2V_2/u.test(shortcutMath)) {
    return {
      en: "This is a concentration question. Since only water changes, the amount of solute stays fixed throughout.",
      hi: "यह सांद्रता का प्रश्न है। क्योंकि केवल पानी बदलता है, घुले पदार्थ की मात्रा पूरी प्रक्रिया में स्थिर रहती है।",
      pa: "ਇਹ ਗਾੜ੍ਹਾਪਣ ਦਾ ਪ੍ਰਸ਼ਨ ਹੈ। ਕਿਉਂਕਿ ਸਿਰਫ਼ ਪਾਣੀ ਬਦਲਦਾ ਹੈ, ਘੁੱਲੇ ਪਦਾਰਥ ਦੀ ਮਾਤਰਾ ਪੂਰੀ ਕਿਰਿਆ ਵਿੱਚ ਸਥਿਰ ਰਹਿੰਦੀ ਹੈ।",
    }[language];
  }
  if (/\\sum q_ir_i/u.test(shortcutMath)) {
    return {
      en: "This is a weighted-average mixture. The average depends on total value, not on a simple average of the rates.",
      hi: "यह भारित औसत का मिश्रण है। औसत कुल मूल्य पर निर्भर करता है, दरों के साधारण औसत पर नहीं।",
      pa: "ਇਹ ਭਾਰਿਤ ਔਸਤ ਵਾਲਾ ਮਿਸ਼ਰਣ ਹੈ। ਔਸਤ ਕੁੱਲ ਮੁੱਲ 'ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ, ਦਰਾਂ ਦੇ ਸਧਾਰਣ ਔਸਤ 'ਤੇ ਨਹੀਂ।",
    }[language];
  }
  return steps[0]?.text[language] ?? shortcutNarrative(shortcutMath, language);
}

function escapeHtml(value: string) {
  return value.replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/"/gu, "&quot;");
}

function blockTitle(title: string) {
  return `<div class="mix-block-title">${escapeHtml(title)}</div>`;
}

function paragraph(value: string) {
  return `<p>${escapeHtml(value)}</p>`;
}

function mathBlock(value: string) {
  return `<div class="mix-math">\\[\n${value}\n\\]</div>`;
}

function titleFor(type: MixtureExplanationBlock["type"], language: Locale) {
  const labels = {
    concept: text("Concept", "विचार", "ਵਿਚਾਰ"),
    given: text("Given", "दिया गया", "ਦਿੱਤਾ ਗਿਆ"),
    diagram: text("Alligation Diagram", "मिश्रण आरेख", "ਐਲੀਗੇਸ਼ਨ ਚਿੱਤਰ"),
    working: text("Working", "हल", "ਹੱਲ"),
    shortcut: text("Shortcut / Exam Method", "शॉर्टकट / परीक्षा विधि", "ਛੋਟਾ ਤਰੀਕਾ / ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ"),
    answer: text("Final Answer", "अंतिम उत्तर", "ਅੰਤਿਮ ਉੱਤਰ"),
  } satisfies Record<MixtureExplanationBlock["type"], MixtureLocalizedText>;
  return labels[type][language];
}

function flowTitle(key: string, language: Locale) {
  const labels: Record<string, MixtureLocalizedText> = {
    alligationCross: text("Cross Differences", "क्रॉस अंतर", "ਕ੍ਰਾਸ ਫਰਕ"),
    interpretRatio: text("Interpret Ratio", "अनुपात का अर्थ", "ਅਨੁਪਾਤ ਦਾ ਅਰਥ"),
    valueTable: text("Value Table", "मूल्य तालिका", "ਮੁੱਲ ਸਾਰਣੀ"),
    averageCalculation: text("Average Calculation", "औसत की गणना", "ਔਸਤ ਦੀ ਗਿਣਤੀ"),
    solutePrinciple: text("Constant Solute Principle", "स्थिर घुला पदार्थ", "ਸਥਿਰ ਘੁੱਲਿਆ ਪਦਾਰਥ"),
    equation: text("Equation Formation", "समीकरण बनाना", "ਸਮੀਕਰਨ ਬਣਾਉਣਾ"),
    replacementLogic: text("Remaining Fraction Logic", "बचे हुए अंश का विचार", "ਬਚੇ ਹਿੱਸੇ ਦਾ ਵਿਚਾਰ"),
    repeatedReplacement: text("Repeated Replacement Logic", "बार-बार बदलने का विचार", "ਦੁਹਰਾਏ ਬਦਲਣ ਦਾ ਵਿਚਾਰ"),
    densityVolume: text("Volume Calculation", "आयतन की गणना", "ਆਇਤਨ ਦੀ ਗਿਣਤੀ"),
    densityTotals: text("Total Volume and Mass", "कुल आयतन और द्रव्यमान", "ਕੁੱਲ ਆਇਤਨ ਅਤੇ ਭਾਰ"),
    densityFinal: text("Density Calculation", "घनत्व की गणना", "ਘਣਤਾ ਦੀ ਗਿਣਤੀ"),
    working: text("Working", "हल", "ਹੱਲ"),
    shortcut: text("Shortcut / Exam Method", "शॉर्टकट / परीक्षा विधि", "ਛੋਟਾ ਤਰੀਕਾ / ਇਮਤਿਹਾਨੀ ਤਰੀਕਾ"),
    answer: text("Final Answer", "अंतिम उत्तर", "ਅੰਤਿਮ ਉੱਤਰ"),
  };
  return (labels[key] ?? labels.working)![language];
}

function finalAnswerText(answerValue: string, optionLetter: string, language: Locale) {
  return {
    en: `Therefore, the required answer is ${answerValue}. Hence, the correct answer is Option (${optionLetter}).`,
    hi: `इसलिए आवश्यक उत्तर ${answerValue} है। अतः सही उत्तर विकल्प (${optionLetter}) है।`,
    pa: `ਇਸ ਲਈ ਲੋੜੀਂਦਾ ਜਵਾਬ ${answerValue} ਹੈ। ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਵਿਕਲਪ (${optionLetter}) ਹੈ।`,
  }[language];
}

function buildWorkingText(steps: readonly MixtureExplanationStep[], answerValue: string, language: Locale) {
  const lines: string[] = [];
  for (const item of steps) {
    if (item.key === "visual-alligation" || item.key === "cross") continue;
    lines.push(item.text[language]);
    if (item.math) lines.push(displayMath(item.math));
  }
  lines.push({
    en: `So the value asked in the question is ${answerValue}.`,
    hi: `इससे प्रश्न में पूछा गया मान ${answerValue} मिलता है।`,
    pa: `ਇਸ ਨਾਲ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਪੁੱਛਿਆ ਮੁੱਲ ${answerValue} ਮਿਲਦਾ ਹੈ।`,
  }[language]);
  return lines.join("\n");
}

function shortcutText(shortcutMath: string, answerValue: string, optionLetter: string, language: Locale, cross?: { c: number; d: number; m: number }, steps: readonly MixtureExplanationStep[] = []) {
  const answerLine = finalAnswerText(answerValue, optionLetter, language);
  if (cross) {
    const highGap = round2(cross.d - cross.m);
    const lowGap = round2(cross.m - cross.c);
    const ratio = ratioText(highGap, lowGap);
    return {
      en: [
        "Write the opposite differences directly.",
        displayMath(`(D-M):(M-C)`),
        displayMath(`(${cross.d}-${cross.m}):(${cross.m}-${cross.c})=${highGap}:${lowGap}=${ratio}`),
        answerLine,
      ].join("\n"),
      hi: [
        "विपरीत अंतर सीधे लिखें।",
        displayMath(`(D-M):(M-C)`),
        displayMath(`(${cross.d}-${cross.m}):(${cross.m}-${cross.c})=${highGap}:${lowGap}=${ratio}`),
        answerLine,
      ].join("\n"),
      pa: [
        "ਉਲਟੇ ਫਰਕਾਂ ਤੋਂ ਮਾਤਰਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ਸਿੱਧਾ ਮਿਲਦਾ ਹੈ।",
        displayMath(`(D-M):(M-C)`),
        displayMath(`(${cross.d}-${cross.m}):(${cross.m}-${cross.c})=${highGap}:${lowGap}=${ratio}`),
        answerLine,
      ].join("\n"),
    }[language];
  }
  const usefulMath = steps
    .filter((stepItem) => stepItem.math && !/\\begin\{array\}/u.test(stepItem.math))
    .slice(-2)
    .map((stepItem) => displayMath(stepItem.math!));
  return [shortcutNarrative(shortcutMath, language), displayMath(shortcutMath), ...usefulMath, answerLine].join("\n");
}

function stepBlock(titleKey: string, steps: MixtureExplanationStep[]): MixtureExplanationBlock {
  return {
    type: "working",
    title: text(flowTitle(titleKey, "en"), flowTitle(titleKey, "hi"), flowTitle(titleKey, "pa")),
    steps,
  };
}

function teachingFlowBlocks(group: Group, steps: readonly MixtureExplanationStep[], shortcutMath: string, answerValue: string, optionLetter: string, diagramHtml: MixtureLocalizedText | undefined, cross: { c: number; d: number; m: number } | undefined): MixtureExplanationBlock[] {
  const filtered = steps.filter((stepItem) => stepItem.key !== "visual-alligation" && stepItem.key !== "cross");
  const isDensity = /\\rho/u.test(shortcutMath);
  const blocks: MixtureExplanationBlock[] = [];
  if (cross && diagramHtml) {
    const diffSteps = filtered.filter((stepItem) => /^cross-difference/u.test(stepItem.key));
    const ratioSteps = filtered.filter((stepItem) => stepItem.key === "cross-ratio");
    const applicationSteps = filtered.filter((stepItem) => !/^cross-difference/u.test(stepItem.key) && stepItem.key !== "cross-ratio");
    blocks.push({ type: "diagram", title: text(titleFor("diagram", "en"), titleFor("diagram", "hi"), titleFor("diagram", "pa")), html: diagramHtml });
    blocks.push(stepBlock("alligationCross", diffSteps));
    blocks.push(stepBlock("interpretRatio", ratioSteps));
    if (applicationSteps.length) blocks.push(stepBlock("working", applicationSteps));
    return blocks;
  }
  if (isDensity) {
    blocks.push(stepBlock("densityVolume", filtered.filter((stepItem) => /concept|volume/u.test(stepItem.key))));
    blocks.push(stepBlock("densityTotals", filtered.filter((stepItem) => stepItem.key === "totals")));
    blocks.push(stepBlock("densityFinal", filtered.filter((stepItem) => stepItem.key === "density")));
    return blocks.filter((block) => block.type !== "working" || block.steps.length > 0);
  }
  if (group === "weighted") {
    blocks.push(stepBlock("valueTable", filtered.filter((stepItem) => stepItem.key === "value")));
    blocks.push(stepBlock("averageCalculation", filtered.filter((stepItem) => stepItem.key !== "value")));
    return blocks.filter((block) => block.type !== "working" || block.steps.length > 0);
  }
  if (group === "concentration" || /C_1V_1=C_2V_2|C_1V\+x/u.test(shortcutMath)) {
    blocks.push(stepBlock("solutePrinciple", filtered.filter((stepItem) => stepItem.key === "fixed" || stepItem.key === "solid")));
    blocks.push(stepBlock("equation", filtered.filter((stepItem) => stepItem.key !== "fixed" && stepItem.key !== "solid")));
    return blocks.filter((block) => block.type !== "working" || block.steps.length > 0);
  }
  if (group === "replacement" || /\\left\(1-\\frac\{x\}\{V\}/u.test(shortcutMath)) {
    blocks.push(stepBlock("replacementLogic", filtered.filter((stepItem) => stepItem.key === "fraction")));
    blocks.push(stepBlock("repeatedReplacement", filtered.filter((stepItem) => stepItem.key !== "fraction")));
    return blocks.filter((block) => block.type !== "working" || block.steps.length > 0);
  }
  blocks.push(stepBlock("working", filtered));
  return blocks;
}

function renderTextWithMath(value: string) {
  const pieces: string[] = [];
  let cursor = 0;
  const pattern = /\\\[([\s\S]*?)\\\]/gu;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(value)) !== null) {
    const before = value.slice(cursor, match.index).trim();
    if (before) pieces.push(...before.split(/\n+/u).map((line) => paragraph(line.trim())).filter(Boolean));
    pieces.push(mathBlock((match[1] ?? "").trim()));
    cursor = match.index + match[0].length;
  }
  const rest = value.slice(cursor).trim();
  if (rest) pieces.push(...rest.split(/\n+/u).map((line) => paragraph(line.trim())).filter(Boolean));
  return pieces.join("");
}

function renderExplanationBlocks(blocks: readonly MixtureExplanationBlock[], language: Locale) {
  return `<div class="mix-explanation-page">${blocks.map((block) => {
    if (block.type === "concept") {
      return `<div class="mix-explanation-block mix-concept">${blockTitle(block.title[language])}${paragraph(block.body[language])}</div>`;
    }
    if (block.type === "given") {
      const items = block.items.map((item) => `<div>${escapeHtml(item[language])}</div>`).join("");
      return `<div class="mix-explanation-block mix-given">${blockTitle(block.title[language])}<div class="mix-given-list">${items}</div></div>`;
    }
    if (block.type === "diagram") {
      return `<div class="mix-explanation-block mix-diagram-block">${blockTitle(block.title[language])}${block.html[language]}</div>`;
    }
    if (block.type === "working") {
      const body = block.steps
        .filter((stepItem) => stepItem.key !== "visual-alligation" && stepItem.key !== "cross")
        .map((stepItem) => `${paragraph(stepItem.text[language])}${stepItem.math ? mathBlock(stepItem.math) : ""}`)
        .join("");
      return `<div class="mix-explanation-block mix-working">${blockTitle(block.title[language])}${body}</div>`;
    }
    if (block.type === "shortcut") {
      return `<div class="mix-explanation-block mix-shortcut">${blockTitle(block.title[language])}${renderTextWithMath(block.body[language])}${block.math ? mathBlock(block.math) : ""}</div>`;
    }
    return `<div class="mix-explanation-block mix-answer">${blockTitle(block.title[language])}${paragraph(block.body[language])}</div>`;
  }).join("")}</div>`;
}

function buildExplanationParts(
  steps: readonly MixtureExplanationStep[],
  answerValue: string,
  shortcutMath: string,
  language: Locale,
  optionLetter: string,
  group: Group,
  diagramHtml?: MixtureLocalizedText,
  cross?: { c: number; d: number; m: number },
) {
  const concept = conceptNarrative(steps, shortcutMath, language);
  const givenItems = cross
    ? [
        text(`Higher value = ${cross.d}`, `अधिक मान = ${cross.d}`, `ਵੱਧ ਮੁੱਲ = ${cross.d}`),
        text(`Lower value = ${cross.c}`, `कम मान = ${cross.c}`, `ਘੱਟ ਮੁੱਲ = ${cross.c}`),
        text(`Mean value = ${cross.m}`, `औसत मान = ${cross.m}`, `ਔਸਤ ਮੁੱਲ = ${cross.m}`),
      ]
    : [text("The useful values are shown in the calculation below.", "उपयोगी मान नीचे की गणना में लिखे गए हैं।", "ਲੋੜੀਂਦੇ ਮੁੱਲ ਹੇਠਾਂ ਦੀ ਗਿਣਤੀ ਵਿੱਚ ਲਿਖੇ ਹਨ।")];
  const flowBlocks = teachingFlowBlocks(group, steps, shortcutMath, answerValue, optionLetter, diagramHtml, cross);
  const blocks: MixtureExplanationBlock[] = [
    { type: "concept", title: text(titleFor("concept", "en"), titleFor("concept", "hi"), titleFor("concept", "pa")), body: { en: conceptNarrative(steps, shortcutMath, "en"), hi: conceptNarrative(steps, shortcutMath, "hi"), pa: conceptNarrative(steps, shortcutMath, "pa") } },
    { type: "given", title: text(titleFor("given", "en"), titleFor("given", "hi"), titleFor("given", "pa")), items: givenItems },
    ...flowBlocks,
    { type: "shortcut", title: text(titleFor("shortcut", "en"), titleFor("shortcut", "hi"), titleFor("shortcut", "pa")), body: { en: shortcutText(shortcutMath, answerValue, optionLetter, "en", cross, steps), hi: shortcutText(shortcutMath, answerValue, optionLetter, "hi", cross, steps), pa: shortcutText(shortcutMath, answerValue, optionLetter, "pa", cross, steps) } },
    { type: "answer", title: text(titleFor("answer", "en"), titleFor("answer", "hi"), titleFor("answer", "pa")), body: { en: finalAnswerText(answerValue, optionLetter, "en"), hi: finalAnswerText(answerValue, optionLetter, "hi"), pa: finalAnswerText(answerValue, optionLetter, "pa") } },
  ];
  const stepwise = buildWorkingText(steps, answerValue, language);
  const shortcut = shortcutText(shortcutMath, answerValue, optionLetter, language, cross, steps);
  return { concept, stepwise, shortcut, answer: finalAnswerText(answerValue, optionLetter, language), blocks, full: renderExplanationBlocks(blocks, language) };
}

function groupFor(family: MixtureAlligationFamilyId): Group {
  if (/replacement/u.test(family)) return "replacement";
  if (/dealer|false_weight/u.test(family)) return "dealer";
  if (/vessel/u.test(family)) return "vessel";
  if (/concentration|dilution|evaporation|fresh_dry/u.test(family)) return "concentration";
  if (/alloy|density|taxation|score|speed_distance|partnership|geometric|symbolic|clonable/u.test(family)) return "premium";
  if (/target|added|removed|addition|removal|ratio_change|extraction|final_component/u.test(family)) return "target";
  if (/average|three|weighted|mean_price|equal_quantity|unequal_quantity/u.test(family)) return "weighted";
  return "alligation";
}
function difficultyFor(family: MixtureAlligationFamilyId): "easy" | "medium" | "hard" {
  if (/nested|constraint|density|chain|three_vessel|double|asymmetric|pyq|compound|taxation|geometric|clonable/u.test(family)) return "hard";
  if (/replacement|dealer|target|missing|profit|evaporation|transfer|alloy|concentration_mixing/u.test(family)) return "medium";
  return "easy";
}
const TRAPS = {
  alligation: ["ratio reversed", "used price ratio directly", "used total difference instead of mean differences"],
  weighted: ["simple average instead of weighted average", "wrong total quantity", "forgot one component"],
  target: ["added to wrong component", "used final ratio as initial ratio", "ignored existing quantity"],
  replacement: ["used V-nx", "forgot repeated operation", "gave impurity left instead of original left"],
  concentration: ["changed solute while adding water", "confused final volume with added volume", "treated evaporation as solution removal"],
  dealer: ["reversed milk-water ratio", "profit on mixture base", "false weight formula inverted"],
  vessel: ["transferred pure component", "ignored changed ratio", "used initial ratio after transfer"],
  premium: ["averaged densities directly", "mixed mass and volume ratio", "used simple average"],
} as const;
const FORMULA = {
  alligation: "C_q:D_q=(D-M):(M-C)",
  weighted: "M=\\frac{\\sum q_ir_i}{\\sum q_i}",
  target: "\\frac{A}{B+x}=\\frac{m}{n}",
  replacement: "L=V\\prod(1-f_i)",
  concentration: "C_1V_1=C_2V_2",
  dealer: "M:W=100:P",
  vessel: "m=x\\times\\frac{M}{M+W}",
  premium: "\\frac{M}{\\rho}=\\frac{M_1}{\\rho_1}+\\frac{M_2}{\\rho_2}",
} as const;

function preferredMethodForDraft(draft: Draft): MixturePreferredSolutionMethod {
  switch (draft.model.kind) {
    case "alligation_ratio":
      return "alligation_cross";
    case "weighted_mean":
      return "weighted_average";
    case "target_add_quantity":
      return "direct_ratio_balancing";
    case "replacement_left":
      return "replacement_formula";
    case "concentration_add_water":
    case "concentration_add_pure":
    case "evaporation":
    case "fresh_dry":
      return "conserved_solute";
    case "dealer_profit_ratio":
    case "false_weight_profit":
      return "dealer_profit";
    case "vessel_transfer":
      return "vessel_transfer";
    case "density_blend":
      return "density_volume";
  }
}

function reasoningStepsForMethod(method: MixturePreferredSolutionMethod) {
  const steps: Record<MixturePreferredSolutionMethod, number> = {
    alligation_cross: 4,
    direct_ratio_balancing: 3,
    weighted_average: 4,
    replacement_formula: 4,
    conserved_solute: 4,
    density_volume: 5,
    dealer_profit: 3,
    vessel_transfer: 4,
  };
  return steps[method];
}

function questionTrivialityScore(draft: Draft, method: MixturePreferredSolutionMethod) {
  if (method === "alligation_cross" || method === "density_volume" || method === "replacement_formula") return 0.05;
  if (method === "weighted_average" || method === "conserved_solute" || method === "vessel_transfer") return 0.08;
  if (method === "dealer_profit") return 0.1;
  const values = draft.variables as Record<string, any>;
  if (method === "direct_ratio_balancing") {
    const initialRatioSameAsTarget =
      typeof values.a === "number" &&
      typeof values.b === "number" &&
      typeof values.ta === "number" &&
      typeof values.tb === "number" &&
      values.a / values.b === values.ta / values.tb;
    const visualOneStep =
      typeof values.a === "number" &&
      typeof values.b === "number" &&
      typeof values.ta === "number" &&
      typeof values.tb === "number" &&
      values.ta === values.tb &&
      Math.abs(values.a - values.b) <= 40;
    return initialRatioSameAsTarget || visualOneStep ? 0.4 : 0.12;
  }
  return 0.12;
}

function shouldUseAlligationDiagram(draft: Draft, method: MixturePreferredSolutionMethod) {
  return method === "alligation_cross" && draft.model.kind === "alligation_ratio";
}

const SPECS: Record<MixtureAlligationFamilyId, Spec> = Object.fromEntries(MIXTURE_ALLIGATION_FAMILY_IDS.map((id) => {
  const group = groupFor(id);
  const difficulty = difficultyFor(id);
  return [id, {
    id,
    group,
    difficulty,
    complexity: difficulty === "hard" ? "hard" : difficulty === "medium" ? "medium" : "easy",
    principle: PRINCIPLES[group],
    formula: FORMULA[group],
    shortcut: PRINCIPLES[group],
    traps: [...TRAPS[group]],
  }];
})) as Record<MixtureAlligationFamilyId, Spec>;

function draftAlligation(family: MixtureAlligationFamilyId, seed: string): Draft {
  const pair = pick([
    { c: 40, d: 60, m: 48, item: "rice" },
    { c: 30, d: 50, m: 38, item: "wheat" },
    { c: 80, d: 120, m: 95, item: "tea" },
    { c: 45, d: 75, m: 55, item: "fuel" },
    { c: 24, d: 40, m: 30, item: "grain" },
    { c: 50, d: 90, m: 65, item: "coffee" },
    { c: 20, d: 30, m: 24, item: "sugar" },
    { c: 25, d: 45, m: 32, item: "pulses" },
    { c: 32, d: 48, m: 38, item: "flour" },
    { c: 36, d: 60, m: 45, item: "spices" },
    { c: 54, d: 90, m: 66, item: "oil" },
    { c: 64, d: 100, m: 76, item: "dry fruit" },
    { c: 72, d: 120, m: 90, item: "cashew" },
    { c: 30, d: 72, m: 48, item: "lentils" },
    { c: 48, d: 80, m: 60, item: "paint" },
    { c: 60, d: 100, m: 75, item: "fertilizer" },
    { c: 25, d: 85, m: 50, item: "rice" },
    { c: 40, d: 100, m: 64, item: "tea" },
  ], `${seed}:allig`);
  const model: MixtureSolverModel = { kind: "alligation_ratio", inputs: { cheaper: pair.c, dearer: pair.d, mean: pair.m } };
  return {
    stem: text(
      pick([
        `A shopkeeper mixes ${pair.item} costing ₹${pair.c} per kg with ${pair.item} costing ₹${pair.d} per kg to make a mixture worth ₹${pair.m} per kg. In what ratio should the two types be mixed?`,
        `${pair.item[0]!.toUpperCase()}${pair.item.slice(1)} costing ₹${pair.c}/kg and ₹${pair.d}/kg are mixed so that the average cost becomes ₹${pair.m}/kg. What is the mixing ratio?`,
        `Two grades of ${pair.item} cost ₹${pair.c}/kg and ₹${pair.d}/kg. To get a blend worth ₹${pair.m}/kg, in what ratio should they be mixed?`,
        `Two grades of ${pair.item} are priced at ₹${pair.c}/kg and ₹${pair.d}/kg. The mixture must cost ₹${pair.m}/kg. In what ratio should the lower-priced and higher-priced grades be mixed?`,
        `${pair.item[0]!.toUpperCase()}${pair.item.slice(1)} at ₹${pair.c}/kg is mixed with dearer ${pair.item} at ₹${pair.d}/kg. If the blend is worth ₹${pair.m}/kg, what should be the cheaper:dearer mixing ratio?`,
        `Two lots of ${pair.item} costing ₹${pair.c}/kg and ₹${pair.d}/kg are used to obtain a mixture worth ₹${pair.m}/kg. In what ratio are the lots mixed?`,
      ], `${seed}:stem`),
      `₹${pair.c} और ₹${pair.d} प्रति किग्रा वाले ${pair.item} को मिलाकर औसत मूल्य ₹${pair.m} प्रति किग्रा करना है। दोनों को किस अनुपात में मिलाना चाहिए?`,
      `₹${pair.c} ਅਤੇ ₹${pair.d} ਪ੍ਰਤੀ ਕਿਲੋ ਵਾਲੇ ${pair.item} ਨੂੰ ਮਿਲਾ ਕੇ ਔਸਤ ਮੁੱਲ ₹${pair.m} ਪ੍ਰਤੀ ਕਿਲੋ ਕਰਨਾ ਹੈ। ਦੋਵੇਂ ਨੂੰ ਕਿਹੜੇ ਅਨੁਪਾਤ ਵਿੱਚ ਮਿਲਾਇਆ ਜਾਵੇ?`,
    ),
    model,
    variables: { family, cheaper: pair.c, dearer: pair.d, mean: pair.m },
    answerKind: "ratio",
    answerUnit: "ratio",
    steps: [
      step("cross", "Place the lower value, mean value and higher value in the alligation cross.", "कम मान, औसत मान और अधिक मान को मिश्रण क्रॉस में रखें।", "ਘੱਟ ਮੁੱਲ, ਔਸਤ ਮੁੱਲ ਅਤੇ ਵੱਧ ਮੁੱਲ ਨੂੰ ਐਲੀਗੇਸ਼ਨ ਕ੍ਰਾਸ ਵਿੱਚ ਰੱਖੋ।", `\\begin{array}{ccc}
C=${pair.c} & & D=${pair.d} \\\\
& M=${pair.m} & \\\\
D-M=${pair.d - pair.m} & & M-C=${pair.m - pair.c}
\\end{array}`),
      step("compare", "The mean lies between the two prices, so compare each price with the mean.", "औसत दोनों मूल्यों के बीच है, इसलिए औसत से अंतर लें।", "ਔਸਤ ਦੋਵੇਂ ਮੁੱਲਾਂ ਦੇ ਵਿਚਕਾਰ ਹੈ, ਇਸ ਲਈ ਔਸਤ ਨਾਲ ਫਰਕ ਲਵੋ।", `C:D=(${pair.d}-${pair.m}):(${pair.m}-${pair.c})`),
      step("ratio", "Simplify the alligation ratio.", "मिश्रण अनुपात सरल करें।", "ਮਿਸ਼ਰਣ ਅਨੁਪਾਤ ਸਰਲ ਕਰੋ।", `C:D=${pair.d - pair.m}:${pair.m - pair.c}=${evaluateMixtureSolverModel(model)}`),
    ],
    shortcutMath: "C_q:D_q=(D-M):(M-C)",
  };
}

function draftWeighted(family: MixtureAlligationFamilyId, seed: string): Draft {
  const data = pick([
    { q: [10, 20, 30], r: [30, 45, 60], item: "rice", unit: "kg" },
    { q: [12, 18, 30], r: [50, 70, 80], item: "tea", unit: "kg" },
    { q: [15, 25, 20], r: [36, 48, 60], item: "wheat", unit: "kg" },
    { q: [24, 16, 40], r: [10, 20, 25], item: "solution", unit: "litres" },
    { q: [20, 30, 50], r: [40, 60, 80], item: "rice", unit: "kg" },
    { q: [20, 30, 50], r: [32, 48, 64], item: "paint", unit: "litres" },
    { q: [30, 20, 10], r: [24, 36, 48], item: "grain", unit: "kg" },
    { q: [16, 24, 40], r: [45, 60, 72], item: "tea", unit: "kg" },
    { q: [18, 30, 42], r: [50, 65, 80], item: "coffee", unit: "kg" },
    { q: [40, 20, 20], r: [25, 45, 65], item: "solution", unit: "litres" },
    { q: [20, 20, 40], r: [30, 50, 70], item: "flour", unit: "kg" },
    { q: [30, 30, 40], r: [40, 50, 75], item: "oil", unit: "litres" },
  ], `${seed}:weighted`);
  const model: MixtureSolverModel = { kind: "weighted_mean", inputs: { quantities: data.q, rates: data.r } };
  const answer = evaluateMixtureSolverModel(model);
  return {
    stem: text(
      `${data.q[0]} ${data.unit}, ${data.q[1]} ${data.unit} and ${data.q[2]} ${data.unit} of ${data.item} priced at ₹${data.r[0]}, ₹${data.r[1]} and ₹${data.r[2]} per unit are mixed. At what price per unit should the mixture be sold to recover exactly the total cost?`,
      `${data.q[0]}, ${data.q[1]} और ${data.q[2]} ${data.unit} मात्रा को ₹${data.r[0]}, ₹${data.r[1]} और ₹${data.r[2]} प्रति इकाई पर मिलाया गया। मिश्रण का औसत मूल्य कितना है?`,
      `${data.q[0]}, ${data.q[1]} ਅਤੇ ${data.q[2]} ${data.unit} ਮਾਤਰਾ ਨੂੰ ₹${data.r[0]}, ₹${data.r[1]} ਅਤੇ ₹${data.r[2]} ਪ੍ਰਤੀ ਇਕਾਈ ਤੇ ਮਿਲਾਇਆ ਗਿਆ। ਮਿਸ਼ਰਣ ਦਾ ਔਸਤ ਮੁੱਲ ਕਿੰਨਾ ਹੈ?`,
    ),
    model,
    variables: { family, quantities: data.q, rates: data.r },
    answerKind: "price",
    answerUnit: "rupees",
    steps: [
      step("value", "Find total value by multiplying each quantity with its rate.", "हर मात्रा को उसकी दर से गुणा कर कुल मूल्य निकालें।", "ਹਰ ਮਾਤਰਾ ਨੂੰ ਉਸ ਦੀ ਦਰ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਕੁੱਲ ਮੁੱਲ ਕੱਢੋ।", `V=${data.q.map((q, i) => `${q}\\times ${data.r[i]}`).join("+")}`),
      step("mean", "Divide total value by total quantity.", "कुल मूल्य को मिश्रण की मात्रा से भाग दें।", "ਕੁੱਲ ਮੁੱਲ ਨੂੰ ਮਿਸ਼ਰਣ ਦੀ ਮਾਤਰਾ ਨਾਲ ਭਾਗ ਦਿਓ।", `M=\\frac{${data.q.map((q, i) => `${q}\\times ${data.r[i]}`).join("+")}}{${data.q.join("+")}}=${answer}`),
    ],
    shortcutMath: "M=\\frac{\\sum q_ir_i}{\\sum q_i}",
  };
}

function draftTarget(family: MixtureAlligationFamilyId, seed: string): Draft {
  const data = pick([
    { a: 84, b: 36, ta: 1, tb: 1, add: "water", ask: "water", unit: "litres" },
    { a: 96, b: 24, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 108, b: 36, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 90, b: 30, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 120, b: 30, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 105, b: 45, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 150, b: 50, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 112, b: 48, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 72, b: 24, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
    { a: 135, b: 45, ta: 3, tb: 2, add: "water", ask: "water", unit: "litres" },
  ], `${seed}:target`);
  const model: MixtureSolverModel = { kind: "target_add_quantity", inputs: { a: data.a, b: data.b, targetA: data.ta, targetB: data.tb } };
  const total = data.a + data.b;
  const initialRatio = ratioText(data.a, data.b);
  const targetMilkPercent = round2((data.ta / (data.ta + data.tb)) * 100);
  return {
    stem: text(
      `A vessel contains ${total} litres of milk-water mixture in the ratio ${initialRatio}. How many litres of ${data.add} must be added so that milk becomes ${targetMilkPercent}% of the final mixture?`,
      `एक बर्तन में दूध ${data.a} लीटर और पानी ${data.b} लीटर है। अनुपात ${data.ta}:${data.tb} करने के लिए कितने लीटर ${data.add} मिलाना होगा?`,
      `ਇੱਕ ਬਰਤਨ ਵਿੱਚ ਦੁੱਧ ${data.a} ਲੀਟਰ ਅਤੇ ਪਾਣੀ ${data.b} ਲੀਟਰ ਹੈ। ਅਨੁਪਾਤ ${data.ta}:${data.tb} ਕਰਨ ਲਈ ਕਿੰਨੇ ਲੀਟਰ ${data.add} ਮਿਲਾਉਣਾ ਪਵੇਗਾ?`,
    ),
    model,
    variables: { family, ...data, total, initialRatio, targetMilkPercent },
    answerKind: "quantity",
    answerUnit: "litres",
    steps: [
      step("equation", "Milk remains fixed and only the added component changes the other side.", "दूध स्थिर रहता है और जोड़ी गई मात्रा दूसरी तरफ बदलती है।", "ਦੁੱਧ ਸਥਿਰ ਰਹਿੰਦਾ ਹੈ ਅਤੇ ਜੋੜੀ ਮਾਤਰਾ ਦੂਜੇ ਪਾਸੇ ਨੂੰ ਬਦਲਦੀ ਹੈ।", `\\frac{${data.a}}{${data.b}+x}=\\frac{${data.ta}}{${data.tb}}`),
      step("solve", "Solve the target-ratio equation for the added quantity.", "लक्ष्य अनुपात के समीकरण से जोड़ी गई मात्रा निकालें।", "ਟੀਚਾ ਅਨੁਪਾਤ ਦੇ ਸਮੀਕਰਨ ਤੋਂ ਜੋੜੀ ਮਾਤਰਾ ਕੱਢੋ।", `x=\\frac{${data.tb}\\times ${data.a}-${data.ta}\\times ${data.b}}{${data.ta}}=${evaluateMixtureSolverModel(model)}`),
    ],
    shortcutMath: "\\frac{A}{B+x}=\\frac{m}{n}",
  };
}

function draftReplacement(family: MixtureAlligationFamilyId, seed: string): Draft {
  const data = pick([
    { v: 80, x: 20, n: 2 },
    { v: 100, x: 20, n: 2 },
    { v: 81, x: 27, n: 2 },
    { v: 64, x: 16, n: 2 },
    { v: 125, x: 25, n: 3 },
    { v: 96, x: 24, n: 2 },
    { v: 120, x: 30, n: 2 },
    { v: 72, x: 18, n: 2 },
    { v: 90, x: 30, n: 2 },
    { v: 160, x: 40, n: 2 },
  ], `${seed}:replacement`);
  const fractions = Array.from({ length: data.n }, () => data.x / data.v);
  const model: MixtureSolverModel = { kind: "replacement_left", inputs: { volume: data.v, fractions } };
  return {
    stem: text(
      `A vessel contains ${data.v} litres of milk. ${data.x} litres are taken out and replaced with water, and this operation is repeated ${data.n} times. What quantity of the original milk remains?`,
      `एक बर्तन में ${data.v} लीटर दूध है। ${data.x} लीटर निकालकर पानी से बदला जाता है और यह क्रिया ${data.n} बार होती है। कितना दूध बचेगा?`,
      `ਇੱਕ ਬਰਤਨ ਵਿੱਚ ${data.v} ਲੀਟਰ ਦੁੱਧ ਹੈ। ${data.x} ਲੀਟਰ ਕੱਢ ਕੇ ਪਾਣੀ ਨਾਲ ਬਦਲਿਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਇਹ ਕਿਰਿਆ ${data.n} ਵਾਰ ਹੁੰਦੀ ਹੈ। ਕਿੰਨਾ ਦੁੱਧ ਬਚੇਗਾ?`,
    ),
    model,
    variables: { family, volume: data.v, removed: data.x, operations: data.n },
    answerKind: "quantity",
    answerUnit: "litres",
    steps: [
      step("fraction", "Each operation leaves the same fraction of original milk.", "हर क्रिया मूल दूध का वही अंश छोड़ती है।", "ਹਰ ਕਿਰਿਆ ਮੂਲ ਦੁੱਧ ਦਾ ਉਹੀ ਹਿੱਸਾ ਛੱਡਦੀ ਹੈ।", `1-\\frac{${data.x}}{${data.v}}`),
      step("left", "Apply the repeated-replacement formula.", "दोहराए गए बदलने का सूत्र लगाएं।", "ਦੁਹਰਾਏ ਬਦਲਣ ਦਾ ਸੂਤਰ ਲਗਾਓ।", `L=${data.v}\\left(1-\\frac{${data.x}}{${data.v}}\\right)^${data.n}=${evaluateMixtureSolverModel(model)}`),
    ],
    shortcutMath: "L=V\\left(1-\\frac{x}{V}\\right)^n",
  };
}

function draftConcentration(family: MixtureAlligationFamilyId, seed: string): Draft {
  if (/fresh_dry/u.test(family)) {
    const data = pick([{ f: 100, fw: 0.8, dw: 0.2 }, { f: 80, fw: 0.75, dw: 0.5 }, { f: 120, fw: 0.6, dw: 0.2 }, { f: 90, fw: 0.6, dw: 0.4 }, { f: 150, fw: 0.8, dw: 0.5 }, { f: 200, fw: 0.75, dw: 0.5 }], `${seed}:fresh`);
    const model: MixtureSolverModel = { kind: "fresh_dry", inputs: { freshWeight: data.f, freshWater: data.fw, dryWater: data.dw } };
    return {
      stem: text(`Fresh grapes contain ${data.fw * 100}% water and dry grapes contain ${data.dw * 100}% water. How many kg of dry grapes can be obtained from ${data.f} kg of fresh grapes?`, `ताजे अंगूर में ${data.fw * 100}% पानी और सूखे अंगूर में ${data.dw * 100}% पानी है। ${data.f} किग्रा ताजे अंगूर से कितने किग्रा सूखे अंगूर मिलेंगे?`, `ਤਾਜ਼ੇ ਅੰਗੂਰਾਂ ਵਿੱਚ ${data.fw * 100}% ਪਾਣੀ ਅਤੇ ਸੁੱਕੇ ਅੰਗੂਰਾਂ ਵਿੱਚ ${data.dw * 100}% ਪਾਣੀ ਹੈ। ${data.f} ਕਿਲੋ ਤਾਜ਼ੇ ਅੰਗੂਰਾਂ ਤੋਂ ਕਿੰਨੇ ਕਿਲੋ ਸੁੱਕੇ ਅੰਗੂਰ ਮਿਲਣਗੇ?`),
      model, variables: { family, ...data }, answerKind: "quantity", answerUnit: "kg",
      steps: [step("solid", "The solid part remains the same.", "ठोस भाग समान रहता है।", "ਠੋਸ ਹਿੱਸਾ ਇੱਕੋ ਰਹਿੰਦਾ ਹੈ।", `${data.f}\\times ${round2((1 - data.fw) * 100)}\\%=D\\times ${round2((1 - data.dw) * 100)}\\%`), step("value", "Solve for dry weight.", "सूखा वजन निकालें।", "ਸੁੱਕਾ ਭਾਰ ਕੱਢੋ।", `D=${evaluateMixtureSolverModel(model)}`)],
      shortcutMath: "F(1-W_f)=D(1-W_d)",
    };
  }
  const data = pick([{ v: 60, c1: 0.4, c2: 0.3 }, { v: 80, c1: 0.5, c2: 0.4 }, { v: 100, c1: 0.3, c2: 0.25 }, { v: 72, c1: 0.5, c2: 0.375 }, { v: 120, c1: 0.4, c2: 0.3 }, { v: 64, c1: 0.5, c2: 0.4 }, { v: 90, c1: 0.4, c2: 0.3 }, { v: 96, c1: 0.5, c2: 0.4 }, { v: 150, c1: 0.4, c2: 0.3 }, { v: 160, c1: 0.5, c2: 0.4 }], `${seed}:conc`);
  const kind = /pure_substance/u.test(family) ? "concentration_add_pure" : /evaporation|water_evaporation/u.test(family) ? "evaporation" : "concentration_add_water";
  const target = kind === "evaporation" ? data.c1 === 0.5 ? 0.8 : 0.6 : kind === "concentration_add_pure" ? data.c1 === 0.5 ? 0.75 : 0.6 : data.c2;
  const model: MixtureSolverModel = { kind, inputs: { volume: data.v, c1: data.c1, c2: target } };
  return {
    stem: text(kind === "evaporation" ? `A solution contains ${data.c1 * 100}% acid. How much water must evaporate from ${data.v} litres of this solution so that the acid becomes ${target * 100}%?` : kind === "concentration_add_pure" ? `How many litres of pure acid should be added to ${data.v} litres of a ${data.c1 * 100}% acid solution to make it ${target * 100}% acid?` : `How many litres of water should be added to ${data.v} litres of a ${data.c1 * 100}% acid solution to make it a ${target * 100}% solution?`, `घोल में ${data.c1 * 100}% तेजाब है। ${data.v} लीटर घोल को ${target * 100}% करने के लिए कितनी मात्रा बदलनी होगी?`, `ਘੋਲ ਵਿੱਚ ${data.c1 * 100}% ਤੇਜ਼ਾਬ ਹੈ। ${data.v} ਲੀਟਰ ਘੋਲ ਨੂੰ ${target * 100}% ਕਰਨ ਲਈ ਕਿੰਨੀ ਮਾਤਰਾ ਬਦਲਣੀ ਪਵੇਗੀ?`),
    model, variables: { family, volume: data.v, c1: data.c1, c2: target, kind }, answerKind: "quantity", answerUnit: "litres",
    steps: [step("fixed", "The amount of acid stays fixed unless pure acid is added.", "शुद्ध तेजाब न जोड़ने पर तेजाब की मात्रा स्थिर रहती है।", "ਖ਼ਾਲਿਸ ਤੇਜ਼ਾਬ ਨਾ ਜੋੜਿਆਂ ਤੇਜ਼ਾਬ ਦੀ ਮਾਤਰਾ ਸਥਿਰ ਰਹਿੰਦੀ ਹੈ।", kind === "concentration_add_pure" ? `\\frac{${data.c1}\\times ${data.v}+x}{${data.v}+x}=${target}` : `${data.c1}\\times ${data.v}=${target}\\times V`), step("solve", "Solve for the changed quantity.", "बदली हुई मात्रा निकालें।", "ਬਦਲੀ ਮਾਤਰਾ ਕੱਢੋ।", `x=${evaluateMixtureSolverModel(model)}`)],
    shortcutMath: kind === "concentration_add_pure" ? "\\frac{C_1V+x}{V+x}=C_2" : "C_1V_1=C_2V_2",
  };
}

function draftDealer(family: MixtureAlligationFamilyId, seed: string): Draft {
  if (/false_weight/u.test(family)) {
    const weight = pick([800, 625, 500, 400, 640, 320], `${seed}:w`);
    const model: MixtureSolverModel = { kind: "false_weight_profit", inputs: { weight } };
    return {
      stem: text(`A dealer uses a false weight of ${weight} g instead of 1 kg but charges for 1 kg. What is his profit percentage?`, `एक दुकानदार 1 किग्रा की जगह ${weight} ग्राम का बाट इस्तेमाल करता है। उसका लाभ प्रतिशत कितना है?`, `ਇੱਕ ਦੁਕਾਨਦਾਰ 1 ਕਿਲੋ ਦੀ ਥਾਂ ${weight} ਗ੍ਰਾਮ ਦਾ ਵੱਟ ਵਰਤਦਾ ਹੈ। ਉਸ ਦਾ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਕਿੰਨਾ ਹੈ?`),
      model, variables: { family, weight }, answerKind: "percent", answerUnit: "percent",
      steps: [step("loss", "The customer receives less than 1 kg while paying for 1 kg.", "ग्राहक 1 किग्रा का पैसा देकर कम मात्रा पाता है।", "ਗਾਹਕ 1 ਕਿਲੋ ਦਾ ਪੈਸਾ ਦੇ ਕੇ ਘੱਟ ਮਾਤਰਾ ਲੈਂਦਾ ਹੈ।", `P=\\frac{1000-${weight}}{${weight}}\\times 100`), step("value", "Apply the false-weight profit formula.", "झूठे बाट का लाभ सूत्र लगाएं।", "ਝੂਠੇ ਵੱਟ ਦਾ ਲਾਭ ਸੂਤਰ ਲਗਾਓ।", `P=${evaluateMixtureSolverModel(model)}`)],
      shortcutMath: "P=\\frac{1000-w}{w}\\times100",
    };
  }
  const profit = pick([20, 25, 40, 50, 60, 75, 80, 100], `${seed}:profit`);
  const model: MixtureSolverModel = { kind: "dealer_profit_ratio", inputs: { profit } };
  return {
    stem: text(`A milkman mixes water with milk and sells the mixture at the cost price of milk. If he gains ${profit}%, what should be the ratio of milk to water in the mixture?`, `एक दूधवाला दूध में पानी मिलाकर मिश्रण को दूध के लागत मूल्य पर बेचता है। यदि उसे ${profit}% लाभ होता है, तो दूध और पानी का अनुपात क्या है?`, `ਇੱਕ ਦੁੱਧ ਵਾਲਾ ਦੁੱਧ ਵਿੱਚ ਪਾਣੀ ਮਿਲਾ ਕੇ ਮਿਸ਼ਰਣ ਨੂੰ ਦੁੱਧ ਦੇ ਲਾਗਤ ਮੁੱਲ ਤੇ ਵੇਚਦਾ ਹੈ। ਜੇ ਉਸ ਨੂੰ ${profit}% ਲਾਭ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਦੁੱਧ ਅਤੇ ਪਾਣੀ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`),
    model, variables: { family, profit }, answerKind: "ratio", answerUnit: "ratio",
    steps: [step("profit", "Water is unpaid, so profit percent equals water as a percent of milk.", "पानी मुफ्त है, इसलिए लाभ प्रतिशत दूध के मुकाबले पानी का प्रतिशत है।", "ਪਾਣੀ ਮੁਫ਼ਤ ਹੈ, ਇਸ ਲਈ ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਦੁੱਧ ਦੇ ਮੁਕਾਬਲੇ ਪਾਣੀ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ।", `\\frac{W}{M}\\times100=${profit}`), step("ratio", "Convert the percent relation into milk-water ratio.", "प्रतिशत संबंध को दूध-पानी अनुपात में बदलें।", "ਪ੍ਰਤੀਸ਼ਤ ਸੰਬੰਧ ਨੂੰ ਦੁੱਧ-ਪਾਣੀ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲੋ।", `M:W=${evaluateMixtureSolverModel(model)}`)],
    shortcutMath: "M:W=100:P",
  };
}

function draftVessel(family: MixtureAlligationFamilyId, seed: string): Draft {
  const data = pick([{ a: 30, b: 20, t: 10 }, { a: 48, b: 32, t: 20 }, { a: 45, b: 30, t: 15 }, { a: 60, b: 40, t: 20 }, { a: 72, b: 48, t: 30 }, { a: 54, b: 36, t: 15 }, { a: 80, b: 40, t: 24 }, { a: 90, b: 60, t: 25 }, { a: 64, b: 48, t: 28 }, { a: 100, b: 50, t: 30 }], `${seed}:vessel`);
  const model: MixtureSolverModel = { kind: "vessel_transfer", inputs: { aQty: data.a, a: data.a, b: data.b, transfer: data.t } };
  return {
    stem: text(`A vessel has ${data.a} litres of milk and ${data.b} litres of water. ${data.t} litres of the mixture is transferred out. How many litres of milk remain in the vessel?`, `एक बर्तन में ${data.a} लीटर दूध और ${data.b} लीटर पानी है। मिश्रण के ${data.t} लीटर बाहर निकाले गए। बर्तन में कितना दूध बचेगा?`, `ਇੱਕ ਬਰਤਨ ਵਿੱਚ ${data.a} ਲੀਟਰ ਦੁੱਧ ਅਤੇ ${data.b} ਲੀਟਰ ਪਾਣੀ ਹੈ। ਮਿਸ਼ਰਣ ਦੇ ${data.t} ਲੀਟਰ ਬਾਹਰ ਕੱਢੇ ਗਏ। ਬਰਤਨ ਵਿੱਚ ਕਿੰਨਾ ਦੁੱਧ ਬਚੇਗਾ?`),
    model, variables: { family, ...data }, answerKind: "quantity", answerUnit: "litres",
    steps: [step("fraction", "The transferred mixture has the same milk fraction as the vessel.", "निकाले गए मिश्रण में दूध का अंश बर्तन जैसा ही है।", "ਕੱਢੇ ਮਿਸ਼ਰਣ ਵਿੱਚ ਦੁੱਧ ਦਾ ਹਿੱਸਾ ਬਰਤਨ ਵਰਗਾ ਹੀ ਹੈ।", `m=${data.t}\\times\\frac{${data.a}}{${data.a}+${data.b}}`), step("remain", "Subtract transferred milk from initial milk.", "निकले दूध को प्रारंभिक दूध से घटाएं।", "ਕੱਢੇ ਦੁੱਧ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਦੁੱਧ ਤੋਂ ਘਟਾਓ।", `M=${data.a}-${data.t}\\times\\frac{${data.a}}{${data.a}+${data.b}}=${evaluateMixtureSolverModel(model)}`)],
    shortcutMath: "M_{left}=M-x\\frac{M}{M+W}",
  };
}

function draftPremium(family: MixtureAlligationFamilyId, seed: string): Draft {
  if (/density/u.test(family)) {
    const data = pick([{ m1: 60, m2: 40, d1: 2, d2: 4 }, { m1: 80, m2: 40, d1: 4, d2: 8 }, { m1: 90, m2: 30, d1: 3, d2: 6 }, { m1: 60, m2: 120, d1: 3, d2: 6 }, { m1: 120, m2: 80, d1: 4, d2: 8 }, { m1: 100, m2: 200, d1: 5, d2: 10 }, { m1: 75, m2: 25, d1: 3, d2: 5 }, { m1: 140, m2: 70, d1: 7, d2: 14 }], `${seed}:density`);
    const model: MixtureSolverModel = { kind: "density_blend", inputs: data };
    const volume1 = round2(data.m1 / data.d1);
    const volume2 = round2(data.m2 / data.d2);
    const totalMass = data.m1 + data.m2;
    const totalVolume = round2(volume1 + volume2);
    const density = evaluateMixtureSolverModel(model);
    return {
      stem: text(`A chemist mixes ${data.m1} kg of one liquid of density ${data.d1} kg/litre with ${data.m2} kg of another liquid of density ${data.d2} kg/litre. Find the density of the resulting mixture?`, `एक रसायनज्ञ ${data.d1} किग्रा/लीटर घनत्व वाले एक द्रव के ${data.m1} किग्रा को ${data.d2} किग्रा/लीटर घनत्व वाले दूसरे द्रव के ${data.m2} किग्रा के साथ मिलाता है। बने मिश्रण का घनत्व कितना होगा?`, `ਇੱਕ ਰਸਾਇਣ ਵਿਦਵਾਨ ${data.d1} ਕਿਲੋ/ਲੀਟਰ ਘਣਤਾ ਵਾਲੇ ਇੱਕ ਦ੍ਰਵ ਦੇ ${data.m1} ਕਿਲੋ ਨੂੰ ${data.d2} ਕਿਲੋ/ਲੀਟਰ ਘਣਤਾ ਵਾਲੇ ਦੂਜੇ ਦ੍ਰਵ ਦੇ ${data.m2} ਕਿਲੋ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ। ਬਣੇ ਮਿਸ਼ਰਣ ਦੀ ਘਣਤਾ ਕਿੰਨੀ ਹੋਵੇਗੀ?`),
      model, variables: { family, ...data }, answerKind: "number", answerUnit: "density",
      steps: [
        step("concept", "Density is mass divided by volume, so first convert each given mass into volume.", "घनत्व द्रव्यमान को आयतन से भाग देने पर मिलता है, इसलिए पहले दिए गए द्रव्यमान को आयतन में बदलें।", "ਘਣਤਾ ਭਾਰ ਨੂੰ ਆਇਤਨ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਮਿਲਦੀ ਹੈ, ਇਸ ਲਈ ਪਹਿਲਾਂ ਦਿੱਤੇ ਭਾਰ ਨੂੰ ਆਇਤਨ ਵਿੱਚ ਬਦਲੋ।"),
        step("volume1", "Volume of the first liquid is mass divided by its density.", "पहले द्रव का आयतन उसके द्रव्यमान को घनत्व से भाग देकर मिलेगा।", "ਪਹਿਲੇ ਦ੍ਰਵ ਦਾ ਆਇਤਨ ਉਸ ਦੇ ਭਾਰ ਨੂੰ ਘਣਤਾ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲੇਗਾ।", `V_1=\\frac{${data.m1}}{${data.d1}}=${volume1}`),
        step("volume2", "Volume of the second liquid is found in the same way.", "दूसरे द्रव का आयतन भी इसी तरह निकलेगा।", "ਦੂਜੇ ਦ੍ਰਵ ਦਾ ਆਇਤਨ ਵੀ ਇਸੇ ਤਰ੍ਹਾਂ ਨਿਕਲੇਗਾ।", `V_2=\\frac{${data.m2}}{${data.d2}}=${volume2}`),
        step("totals", "Now add masses and volumes separately.", "अब द्रव्यमान और आयतन अलग-अलग जोड़ें।", "ਹੁਣ ਭਾਰ ਅਤੇ ਆਇਤਨ ਵੱਖ-ਵੱਖ ਜੋੜੋ।", `M=${data.m1}+${data.m2}=${totalMass},\\quad V=${volume1}+${volume2}=${totalVolume}`),
        step("density", "Density of the mixture is total mass divided by total volume.", "मिश्रण का घनत्व कुल द्रव्यमान को कुल आयतन से भाग देने पर मिलेगा।", "ਮਿਸ਼ਰਣ ਦੀ ਘਣਤਾ ਕੁੱਲ ਭਾਰ ਨੂੰ ਕੁੱਲ ਆਇਤਨ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਮਿਲੇਗੀ।", `\\rho=\\frac{${totalMass}}{${totalVolume}}=${density}`),
      ],
      shortcutMath: "\\rho=\\frac{M_1+M_2}{M_1/\\rho_1+M_2/\\rho_2}",
    };
  }
  return /alloy/u.test(family) ? draftWeighted(family, seed) : draftAlligation(family, seed);
}

function draftFor(spec: Spec, seed: string): Draft {
  if (spec.group === "weighted") return draftWeighted(spec.id, seed);
  if (spec.group === "target") return draftTarget(spec.id, seed);
  if (spec.group === "replacement") return draftReplacement(spec.id, seed);
  if (spec.group === "concentration") return draftConcentration(spec.id, seed);
  if (spec.group === "dealer") return draftDealer(spec.id, seed);
  if (spec.group === "vessel") return draftVessel(spec.id, seed);
  if (spec.group === "premium") return draftPremium(spec.id, seed);
  return draftAlligation(spec.id, seed);
}

const ALLIGATION_CROSS_REQUIRED = new Set<MixtureAlligationFamilyId>([
  "alligation_cheaper_dearer_ratio",
  "mix_two_price_blend_ratio",
  "mix_two_items_find_ratio",
  "concentration_mixing_two_solutions",
  "concentration_mixing_three_solutions",
  "mix_tea_blend_average_price",
  "mix_two_grades_of_rice",
  "mix_two_grades_of_wheat",
  "alloy_mean_price_blend",
  "mix_reverse_alligation",
  "mix_price_profit_target_gain",
  "mix_cost_selling_price_alligation",
]);

function crossNumbers(draft: Draft, answer: number | string) {
  const values = draft.variables as Record<string, any>;
  if (typeof values.cheaper === "number" && typeof values.dearer === "number" && typeof values.mean === "number") {
    return { c: values.cheaper, d: values.dearer, m: values.mean };
  }
  if (Array.isArray(values.rates) && typeof answer === "number") {
    const rates = values.rates.map(Number);
    return { c: Math.min(...rates), d: Math.max(...rates), m: answer };
  }
  if (typeof values.c1 === "number" && typeof values.c2 === "number") {
    const high = Math.max(values.c1, values.c2) * 100;
    const mean = Math.min(values.c1, values.c2) * 100;
    return { c: 0, d: round2(high), m: round2(mean) };
  }
  if (typeof values.a === "number" && typeof values.b === "number" && typeof values.ta === "number" && typeof values.tb === "number") {
    const current = round2((values.a / (values.a + values.b)) * 100);
    const target = round2((values.ta / (values.ta + values.tb)) * 100);
    return { c: 0, d: Math.max(current, target), m: Math.min(current, target) };
  }
  return undefined;
}

function visualAlligationBlock(cross: { c: number; d: number; m: number }) {
  const bottomLeft = round2(cross.m - cross.c);
  const bottomRight = round2(cross.d - cross.m);
  const html = `<div class="mix-alligation-diagram"><div class="mix-alligation-top-left">${cross.d}</div><div class="mix-alligation-top-right">${cross.c}</div><div class="mix-alligation-center">${cross.m}</div><div class="mix-alligation-bottom-left">${bottomLeft}</div><div class="mix-alligation-bottom-right">${bottomRight}</div><div class="mix-alligation-line mix-alligation-line-a"></div><div class="mix-alligation-line mix-alligation-line-b"></div><div class="mix-alligation-line mix-alligation-line-c"></div><div class="mix-alligation-line mix-alligation-line-d"></div></div>`;
  return html;
}

function withTeachingSteps(family: MixtureAlligationFamilyId, draft: Draft, answer: number | string, method: MixturePreferredSolutionMethod) {
  const hasCross = draft.steps.some((item) => item.key === "visual-alligation" || item.math?.includes("C_q:D_q"));
  void family;
  if (method !== "alligation_cross" || hasCross) return draft.steps;
  const cross = crossNumbers(draft, answer);
  if (!cross || !(cross.c <= cross.m && cross.m <= cross.d)) return draft.steps;
  const left = round2(cross.d - cross.m);
  const right = round2(cross.m - cross.c);
  const ratio = typeof answer === "string" ? answer : ratioText(left, right);
  return [
    step("visual-alligation", `Lower value = ${cross.c}. Higher value = ${cross.d}. Mean value = ${cross.m}.`, `कम मान ${cross.c}, अधिक मान ${cross.d} और औसत मान ${cross.m} है।`, `ਘੱਟ ਮੁੱਲ ${cross.c}, ਵੱਧ ਮੁੱਲ ${cross.d} ਅਤੇ ਔਸਤ ਮੁੱਲ ${cross.m} ਹੈ।`),
    step("cross-difference-low", `Difference between ${cross.m} and ${cross.c}:`, `${cross.m} और ${cross.c} का अंतर:`, `${cross.m} ਅਤੇ ${cross.c} ਦਾ ਫਰਕ:`, `${cross.m}-${cross.c}=${right}`),
    step("cross-difference-high", `Difference between ${cross.d} and ${cross.m}:`, `${cross.d} और ${cross.m} का अंतर:`, `${cross.d} ਅਤੇ ${cross.m} ਦਾ ਫਰਕ:`, `${cross.d}-${cross.m}=${left}`),
    step("cross-ratio", "Opposite differences give the required quantity ratio.", "उलटे अंतर आवश्यक मात्राओं का अनुपात देते हैं।", "ਉਲਟੇ ਫਰਕਾਂ ਤੋਂ ਮਾਤਰਾਵਾਂ ਦਾ ਅਨੁਪਾਤ ਮਿਲਦਾ ਹੈ।", `C_q:D_q=${left}:${right}=${ratio}`),
    ...draft.steps,
  ];
}

function varyEnglishStemOpening(stemValue: string, family: MixtureAlligationFamilyId, seed: string) {
  const index = hashText(`${seed}:opening:${family}`) % 6;
  if (/^A vessel contains milk and water in quantities/u.test(stemValue)) {
    const variants = [
      stemValue,
      stemValue.replace(/^A vessel contains/u, "A container holds"),
      stemValue.replace(/^A vessel contains milk and water in quantities/u, "In a vessel, the quantities of milk and water are"),
      stemValue.replace(/^A vessel contains/u, "A milk container has"),
      stemValue.replace(/^A vessel contains/u, "A jar contains"),
      stemValue.replace(/^A vessel contains milk and water in quantities/u, "A can has milk and water measuring"),
    ];
    return variants[index] ?? stemValue;
  }
  if (/^A vessel has/u.test(stemValue)) {
    const variants = [
      stemValue,
      stemValue.replace(/^A vessel has/u, "A container has"),
      stemValue.replace(/^A vessel has/u, "A milk vessel contains"),
      stemValue.replace(/^A vessel has/u, "A jar has"),
      stemValue.replace(/^A vessel has/u, "A can contains"),
      stemValue.replace(/^A vessel has/u, "A dairy container has"),
    ];
    return variants[index] ?? stemValue;
  }
  if (/^A milkman mixes/u.test(stemValue)) {
    const variants = [
      stemValue,
      stemValue.replace(/^A milkman mixes/u, "A milk seller mixes"),
      stemValue.replace(/^A milkman mixes/u, "A dairy seller mixes"),
      stemValue.replace(/^A milkman mixes/u, "A seller mixes"),
      stemValue.replace(/^A milkman mixes/u, "While selling milk, a milkman mixes"),
      stemValue.replace(/^A milkman mixes/u, "A shopkeeper mixes"),
    ];
    return variants[index] ?? stemValue;
  }
  if (/^A dealer uses/u.test(stemValue)) {
    const variants = [
      stemValue,
      stemValue.replace(/^A dealer uses/u, "A shopkeeper uses"),
      stemValue.replace(/^A dealer uses/u, "A trader uses"),
      stemValue.replace(/^A dealer uses/u, "During a sale, a dealer uses"),
      stemValue.replace(/^A dealer uses/u, "A dishonest seller uses"),
      stemValue.replace(/^A dealer uses/u, "In a shop, the dealer uses"),
    ];
    return variants[index] ?? stemValue;
  }
  if (/^A solution contains/u.test(stemValue)) {
    const variants = [
      stemValue,
      stemValue.replace(/^A solution contains/u, "A chemical solution contains"),
      stemValue.replace(/^A solution contains/u, "In a container, a solution contains"),
      stemValue.replace(/^A solution contains/u, "A lab solution contains"),
      stemValue.replace(/^A solution contains/u, "A tank has a solution containing"),
      stemValue.replace(/^A solution contains/u, "A vessel has a solution containing"),
    ];
    return variants[index] ?? stemValue;
  }
  if (/^How many litres of water should be added/u.test(stemValue)) {
    return stemValue;
  }
  if (/^Fresh grapes contain/u.test(stemValue)) {
    const variants = [
      stemValue,
      stemValue.replace(/^Fresh grapes contain/u, "Fresh grapes are given with"),
      stemValue.replace(/^Fresh grapes contain/u, "A fruit seller has fresh grapes containing"),
      stemValue.replace(/^Fresh grapes contain/u, "A trader has grapes containing"),
      stemValue.replace(/^Fresh grapes contain/u, "Some fresh grapes contain"),
      stemValue.replace(/^Fresh grapes contain/u, "A shop has fresh grapes containing"),
    ];
    return variants[index] ?? stemValue;
  }
  return stemValue;
}

function realismFor(spec: Spec, seed: string) {
  const base = spec.complexity === "hard" ? 86 : spec.complexity === "medium" ? 82 : 78;
  return base + (hashText(`${seed}:realism`) % 5);
}

export function createMixtureAlligationProblem(input: {
  seed: string;
  runId: string;
  difficulty: "easy" | "medium" | "hard";
  family?: MixtureAlligationFamilyId;
}): CanonicalMixtureAlligationProblem {
  const family = input.family ?? pick(MIXTURE_ALLIGATION_FAMILY_IDS.filter((candidate) => SPECS[candidate].difficulty === input.difficulty), `${input.seed}:family`);
  const spec = SPECS[family];
  const draft = draftFor(spec, input.seed);
  const answer = evaluateMixtureSolverModel(draft.model);
  const preferredSolutionMethod = preferredMethodForDraft(draft);
  const reasoningStepCount = reasoningStepsForMethod(preferredSolutionMethod);
  const trivialityScore = questionTrivialityScore(draft, preferredSolutionMethod);
  const explanationSteps = withTeachingSteps(family, draft, answer, preferredSolutionMethod);
  const cross = crossNumbers(draft, answer);
  const useAlligationDiagram = shouldUseAlligationDiagram(draft, preferredSolutionMethod);
  const diagramHtml = useAlligationDiagram && cross
    ? text(visualAlligationBlock(cross), visualAlligationBlock(cross), visualAlligationBlock(cross))
    : undefined;
  const answerString = answerText(answer, draft.answerUnit, "en");
  let options = makeOptions(answer, draft.answerUnit, `${input.seed}:options`);
  if (!options.includes(answerString)) options = [answerString, ...options].slice(0, 4);
  options = uniqueOptions(options);
  if (!options.includes(answerString)) options.unshift(answerString);
  let optionOffset = 1;
  while (options.length < 4) {
    const candidate = answerText(typeof answer === "number" ? answer + optionOffset * 3 : optionOffset + 1, draft.answerUnit, "en");
    if (!options.includes(candidate)) options.push(candidate);
    optionOffset += 1;
  }
  options = options.slice(0, 4);
  if (options.length < 4) throw new Error("mixture option generation failed");
  const correct = options.indexOf(answerString);
  if (correct < 0) throw new Error("mixture answer missing from options");
  const optionLetter = String.fromCharCode(65 + correct);
  const renderedStem = draft.model.kind === "density_blend"
    ? draft.stem
    : diversifyStem(draft.stem, spec.group, `${input.seed}:${family}`);
  const stems = {
    en: ensureQuestionStem(varyEnglishStemOpening(renderedStem.en, family, input.seed)),
    hi: ensureQuestionStem(renderedStem.hi),
    pa: ensureQuestionStem(renderedStem.pa),
  };
  const optionsHi = options.map((option) => option.replace(/kg\/litre/gu, "किग्रा/लीटर").replace(/kg/gu, "किग्रा").replace(/litres/gu, "लीटर"));
  const optionsPa = options.map((option) => option.replace(/kg\/litre/gu, "ਕਿਲੋ/ਲੀਟਰ").replace(/kg/gu, "ਕਿਲੋ").replace(/litres/gu, "ਲੀਟਰ"));
  const explanationCross = useAlligationDiagram ? cross : undefined;
  const explanationEn = buildExplanationParts(explanationSteps, answerString, draft.shortcutMath, "en", optionLetter, spec.group, diagramHtml, explanationCross);
  const explanationHi = buildExplanationParts(explanationSteps, answerText(answer, draft.answerUnit, "hi"), draft.shortcutMath, "hi", optionLetter, spec.group, diagramHtml, explanationCross);
  const explanationPa = buildExplanationParts(explanationSteps, answerText(answer, draft.answerUnit, "pa"), draft.shortcutMath, "pa", optionLetter, spec.group, diagramHtml, explanationCross);
  const explanation = { en: explanationEn.full, hi: explanationHi.full, pa: explanationPa.full };
  const realismScore = realismFor(spec, input.seed);
  const signature = numericSignature(draft.variables);
  return {
    id: `mix:${family}:${hashText(input.seed)}`,
    topic: "mixture-alligation",
    motifId: family,
    family,
    topologyId: family,
    subtype: family,
    category: "mixture_alligation",
    principle: spec.principle,
    formulaModel: spec.formula,
    preferredSolutionMethod,
    questionTrivialityScore: trivialityScore,
    reasoningStepCount,
    shortcut: spec.shortcut,
    commonTraps: spec.traps,
    variables: draft.variables,
    stemData: draft.variables,
    solverModel: draft.model,
    answer,
    answerText: answerString,
    answerKind: draft.answerKind,
    answerUnit: draft.answerUnit,
    options,
    correct,
    difficulty: spec.difficulty,
    complexity: spec.complexity,
    topology: { family: "mixture_alligation", variant: family },
    traps: spec.traps,
    distractors: options.filter((_, index) => index !== correct),
    explanationSteps,
    explanationBlocks: explanationEn.blocks,
    conceptExplanation: { en: explanationEn.concept, hi: explanationHi.concept, pa: explanationPa.concept },
    stepwiseExplanation: { en: explanationEn.stepwise, hi: explanationHi.stepwise, pa: explanationPa.stepwise },
    shortcutExplanation: { en: explanationEn.shortcut, hi: explanationHi.shortcut, pa: explanationPa.shortcut },
    localizationData: { stem: stems, explanation, options: { en: options, hi: optionsHi, pa: optionsPa } },
    auditMeta: {
      seed: input.seed,
      runId: input.runId,
      motifId: family,
      topologyId: family,
      stemSkeleton: stems.en.replace(/\d+(?:\.\d+)?/gu, "#"),
      numericSignature: signature,
      solverAnswer: answerString,
      explanationFinalAnswer: answerString,
      difficultyReason: `${spec.group} ${spec.complexity}`,
      realismScore,
      trapTypes: spec.traps,
      preferredSolutionMethod,
      questionTrivialityScore: trivialityScore,
      reasoningStepCount,
    },
  };
}

export const createMixtureAlligationMotifFactory: MixtureAlligationMotifFactory = (input) =>
  createMixtureAlligationProblem(input);
