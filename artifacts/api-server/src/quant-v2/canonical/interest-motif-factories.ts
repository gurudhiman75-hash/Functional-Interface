import type {
  CanonicalInterestProblem,
  InterestAnswerKind,
  InterestAnswerSemantic,
  InterestContext,
  InterestFamilyId,
  InterestMotifFactory,
  InterestStep,
} from "./interest-types";

export const INTEREST_FAMILY_IDS: readonly InterestFamilyId[] = [
  "int_si_from_prt",
  "int_si_amount_from_prt",
  "int_si_principal_from_si_rt",
  "int_si_rate_from_si_pt",
  "int_si_time_from_si_pr",
  "int_si_difference_two_cases",
  "int_si_sum_doubles",
  "int_si_sum_triples",
  "int_si_amount_ratio_time_gap",
  "int_si_temporal_amount_gap",
  "int_ci_amount_annual",
  "int_ci_from_amount",
  "int_ci_principal_from_amount",
  "int_ci_rate_from_amount",
  "int_ci_time_from_amount",
  "int_ci_two_year_formula",
  "int_ci_three_year_formula",
  "int_ci_sum_doubles",
  "int_ci_amount_multiplier_gap",
  "int_ci_si_difference_2_years",
  "int_ci_si_difference_3_years",
  "int_rate_from_ci_si_diff_2y",
  "int_principal_from_ci_si_diff_2y",
  "int_hybrid_si_ci_crossover",
  "int_si_ci_amount_difference",
  "int_ci_half_yearly",
  "int_ci_quarterly",
  "int_ci_monthly",
  "int_ci_annual_vs_half_yearly",
  "int_ci_fractional_time_boundary",
  "int_ci_specific_year_isolation",
  "int_ci_nth_year_interest_from_principal",
  "int_population_growth_ci",
  "int_depreciation_ci",
  "int_price_appreciation",
  "int_machine_car_depreciation",
  "int_successive_growth",
  "int_successive_reduction",
  "int_equal_annual_installments_ci",
  "int_equal_half_yearly_installments_ci",
  "int_loan_repayment_si",
  "int_loan_repayment_ci",
  "int_find_installment_amount",
  "int_find_principal_from_installments",
  "int_si_partial_discharge_timeline",
  "int_different_rates_different_years_si",
  "int_different_rates_different_years_ci",
  "int_part_principal_two_rates_si",
  "int_si_alligation_mixture",
  "int_two_sums_same_interest",
  "int_weighted_average_rate",
  "int_true_discount",
  "int_present_worth",
  "int_bankers_discount",
  "int_bankers_gain",
  "int_bd_td_difference",
  "int_bill_due_after_time",
  "int_amount_ratio_find_rate_si",
  "int_amount_ratio_find_time_si",
  "int_amount_ratio_find_rate_ci",
  "int_amount_ratio_find_time_ci",
  "int_interest_more_by_rate_change",
  "int_interest_more_by_time_change",
  "int_si_calculated_on_amount_trap",
  "int_ci_simple_addition_trap",
  "int_wrong_period_conversion_trap",
  "int_nominal_vs_effective_rate",
  "int_interest_included_excluded_amount",
  "int_compound_depreciation_repair_sale",
  "int_partial_payment_before_final_amount",
  "int_two_people_invest_same_rate",
  "int_same_interest_different_sums_rates_times",
  "int_divide_total_interest_between_investments",
  "int_investment_ratio_from_interest",
  "int_weighted_interest_income",
  "int_ci_specific_year_rate_principal",
  "int_si_ci_mixed_condition_inverse",
];

const BANKING_CONTEXTS: readonly InterestContext[] = [
  { en: "loan", hi: "ऋण", pa: "ਕਰਜ਼ਾ" },
  { en: "fixed deposit", hi: "सावधि जमा", pa: "ਮਿਆਦੀ ਜਮ੍ਹਾਂ" },
  { en: "investment scheme", hi: "निवेश योजना", pa: "ਨਿਵੇਸ਼ ਯੋਜਨਾ" },
  { en: "cooperative society loan", hi: "सहकारी समिति ऋण", pa: "ਸਹਿਕਾਰੀ ਸਭਾ ਕਰਜ਼ਾ" },
  { en: "term deposit", hi: "टर्म डिपॉजिट", pa: "ਟਰਮ ਡਿਪਾਜ਼ਿਟ" },
  { en: "shop expansion loan", hi: "दुकान विस्तार ऋण", pa: "ਦੁਕਾਨ ਵਧਾਉਣ ਦਾ ਕਰਜ਼ਾ" },
];

const ASSET_CONTEXTS: readonly InterestContext[] = [
  { en: "machine", hi: "मशीन", pa: "ਮਸ਼ੀਨ" },
  { en: "car", hi: "कार", pa: "ਕਾਰ" },
  { en: "scooter", hi: "स्कूटर", pa: "ਸਕੂਟਰ" },
  { en: "laptop", hi: "लैपटॉप", pa: "ਲੈਪਟਾਪ" },
  { en: "equipment", hi: "उपकरण", pa: "ਉਪਕਰਣ" },
  { en: "furniture", hi: "फर्नीचर", pa: "ਫਰਨੀਚਰ" },
];

const BILL_CONTEXTS: readonly InterestContext[] = [
  { en: "bill of exchange", hi: "विनिमय बिल", pa: "ਵਿਨਿਮਯ ਬਿੱਲ" },
  { en: "invoice", hi: "चालान", pa: "ਚਲਾਨ" },
  { en: "due amount", hi: "देय राशि", pa: "ਦੇਣਯੋਗ ਰਕਮ" },
  { en: "trade bill", hi: "व्यापार बिल", pa: "ਵਪਾਰਕ ਬਿੱਲ" },
  { en: "present-worth case", hi: "वर्तमान मूल्य प्रश्न", pa: "ਮੌਜੂਦਾ ਮੁੱਲ ਪ੍ਰਸ਼ਨ" },
];

const SPLIT_CONTEXTS: readonly InterestContext[] = [
  { en: "two funds", hi: "दो फंड", pa: "ਦੋ ਫੰਡ" },
  { en: "two schemes", hi: "दो योजनाएँ", pa: "ਦੋ ਯੋਜਨਾਵਾਂ" },
  { en: "two borrowers", hi: "दो उधारकर्ता", pa: "ਦੋ ਕਰਜ਼ਦਾਰ" },
  { en: "two parts of a loan", hi: "ऋण के दो भाग", pa: "ਕਰਜ਼ੇ ਦੇ ਦੋ ਹਿੱਸੇ" },
  { en: "two deposits", hi: "दो जमाएँ", pa: "ਦੋ ਜਮ੍ਹਾਂ ਰਕਮਾਂ" },
];

const RATES = [4, 5, 6, 8, 10, 12, 15, 20, 25];
const PRINCIPALS = [1200, 1500, 1600, 2000, 2400, 2500, 3000, 4000, 5000, 6000, 8000, 10000, 12000, 15000, 20000];
const YEARS = [1, 2, 3, 4, 5];

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length]!;
}

function round2(value: number) {
  return Number(value.toFixed(2));
}

function clean(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function money(value: number) {
  return `₹${clean(value)}`;
}

function pct(value: number) {
  return `${clean(value)}%`;
}

function contextFor(family: InterestFamilyId, seed: string) {
  if (/depreciation|machine|asset|appreciation|growth|reduction|population/u.test(family)) {
    return pick([...ASSET_CONTEXTS, { en: "population", hi: "जनसंख्या", pa: "ਆਬਾਦੀ" }], `${seed}:context`);
  }
  if (/bankers|discount|present_worth|bill/u.test(family)) {
    return pick(BILL_CONTEXTS, `${seed}:context`);
  }
  if (/part|two_sums|weighted|investment|alligation|people|divide/u.test(family)) {
    return pick(SPLIT_CONTEXTS, `${seed}:context`);
  }
  return pick(BANKING_CONTEXTS, `${seed}:context`);
}

function complexityFor(family: InterestFamilyId) {
  if (/direct|from_prt|amount_from_prt|ci_amount_annual|ci_from_amount/u.test(family)) return "easy" as const;
  if (/installment|bankers|alligation|partial|specific_year|mixed|nominal|compound_depreciation/u.test(family)) return "advanced" as const;
  if (/difference|half|quarter|fractional|ratio|temporal|split|weighted|frequency|growth|depreciation/u.test(family)) return "hard" as const;
  return "medium" as const;
}

function answerSemanticFor(family: InterestFamilyId, fallback: InterestAnswerSemantic): InterestAnswerSemantic {
  if (/principal|present_worth/u.test(family)) return family.includes("present_worth") ? "present_worth" : "principal";
  if (/rate|effective/u.test(family)) return family.includes("effective") ? "effective_rate" : "rate";
  if (/time/u.test(family)) return "time";
  if (/installment/u.test(family)) return "installment";
  if (/bankers_gain/u.test(family)) return "bankers_gain";
  if (/bankers_discount/u.test(family)) return "bankers_discount";
  if (/true_discount/u.test(family)) return "true_discount";
  if (/ratio/u.test(family)) return "investment_ratio";
  if (/ci_/u.test(family) && /from|difference|crossover|mixed/u.test(family)) return "compound_interest";
  return fallback;
}

function makeOptions(answer: number, kind: InterestAnswerKind, traps: number[]) {
  const scaledTraps = traps.filter((value) => {
    if (kind === "percent" || kind === "rate") return value > 0 && value <= 100;
    if (kind === "time") return value > 0 && value <= 50;
    return value > 0;
  });
  const values = [
    answer,
    ...scaledTraps,
    kind === "percent" || kind === "rate" ? answer + 5 : answer * 1.1,
    kind === "percent" || kind === "rate" ? Math.abs(answer - 5) : answer * 0.9,
    kind === "time" ? answer + 1 : answer * 1.25,
  ]
    .map(round2)
    .filter((value) => Number.isFinite(value) && value > 0);
  const unique: number[] = [];
  for (const value of values) {
    if (!unique.some((existing) => Math.abs(existing - value) < 0.01)) unique.push(value);
    if (unique.length >= 4) break;
  }
  while (unique.length < 4) {
    const next = round2(answer + (unique.length + 1) * (kind === "amount" ? 100 : 2));
    if (next > 0 && !unique.includes(next)) unique.push(next);
  }
  return unique.slice(1, 4);
}

function step(key: string, en: string, hi: string, pa: string, expression: string, value: number): InterestStep {
  return { key, en, hi, pa, expression, value: round2(value) };
}

function createProblem(input: Omit<CanonicalInterestProblem, "topic" | "subtype" | "category" | "topology" | "distractors" | "complexity"> & { trapsNumeric?: number[] }): CanonicalInterestProblem {
  const complexity = complexityFor(input.family);
  return {
    ...input,
    topic: "interest",
    subtype: input.family,
    category: "interest",
    complexity,
    topology: { family: "interest", variant: input.family },
    distractors: makeOptions(input.answer, input.answerKind, input.trapsNumeric ?? []),
  };
}

function directSi(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const p = pick(PRINCIPALS, `${seed}:p`);
  const r = pick(RATES, `${seed}:r`);
  const t = pick(YEARS, `${seed}:t`);
  const si = round2((p * r * t) / 100);
  const amount = p + si;
  const context = contextFor(family, seed);
  let answer = si;
  let kind: InterestAnswerKind = "amount";
  let semantic: InterestAnswerSemantic = "simple_interest";
  let askEn = "Find the simple interest.";
  let askHi = "साधारण ब्याज ज्ञात कीजिए।";
  let askPa = "ਸਧਾਰਣ ਬਿਆਜ ਪਤਾ ਕਰੋ।";
  const variables: Record<string, number> = { p, r, t, si, amount };

  if (family === "int_si_amount_from_prt") {
    answer = amount; semantic = "amount"; askEn = "Find the amount."; askHi = "कुल राशि ज्ञात कीजिए।"; askPa = "ਕੁੱਲ ਰਕਮ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_si_principal_from_si_rt") {
    answer = p; semantic = "principal"; variables.si = si; askEn = "Find the principal."; askHi = "मूलधन ज्ञात कीजिए।"; askPa = "ਮੂਲਧਨ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_si_rate_from_si_pt") {
    answer = r; kind = "rate"; semantic = "rate"; askEn = "Find the rate."; askHi = "दर ज्ञात कीजिए।"; askPa = "ਦਰ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_si_time_from_si_pr") {
    answer = t; kind = "time"; semantic = "time"; askEn = "Find the time."; askHi = "समय ज्ञात कीजिए।"; askPa = "ਸਮਾਂ ਪਤਾ ਕਰੋ।";
  }

  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables,
    answer: round2(answer),
    answerKind: kind,
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["uses amount as principal", "divides by 100 at the wrong step", "confuses rate and time"],
    customStem: {
      en: `A ${context.en} of ${money(p)} is taken at ${pct(r)} per annum for ${t} years under simple interest. ${askEn}`,
      hi: `${money(p)} का ${context.hi} ${pct(r)} प्रतिवर्ष की दर से ${t} वर्ष के लिए साधारण ब्याज पर है। ${askHi}`,
      pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਦੀ ਦਰ ਨਾਲ ${t} ਸਾਲ ਲਈ ਸਧਾਰਣ ਬਿਆਜ ਤੇ ਹੈ। ${askPa}`,
    },
    customSteps: [
      step("si", "Simple interest", "साधारण ब्याज", "ਸਧਾਰਣ ਬਿਆਜ", `${p} x ${r} x ${t} / 100`, si),
      step("amount", "Amount", "कुल राशि", "ਕੁੱਲ ਰਕਮ", `${p} + ${si}`, amount),
      step("answer", labelFor(semantic, "en"), labelFor(semantic, "hi"), labelFor(semantic, "pa"), answerFormula(semantic, variables), answer),
    ],
    trapsNumeric: [si, amount, round2((amount * r * t) / 100)],
  });
}

function ciBase(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const p = pick([1000, 1600, 2000, 2500, 4000, 5000, 8000, 10000, 12000], `${seed}:p`);
  const r = pick([5, 10, 20, 25], `${seed}:r`);
  const t = pick([2, 3], `${seed}:t`);
  const factor = Math.pow(1 + r / 100, t);
  const amount = round2(p * factor);
  const ci = round2(amount - p);
  const context = contextFor(family, seed);
  let answer = amount;
  let kind: InterestAnswerKind = "amount";
  let semantic: InterestAnswerSemantic = "amount";
  let askEn = "Find the compound amount.";
  let askHi = "चक्रवृद्धि कुल राशि ज्ञात कीजिए।";
  let askPa = "ਚੱਕਰਵ੍ਰਿੱਧੀ ਕੁੱਲ ਰਕਮ ਪਤਾ ਕਰੋ।";
  const variables: Record<string, number> = { p, r, t, amount, ci };

  if (family === "int_ci_from_amount" || family === "int_ci_two_year_formula" || family === "int_ci_three_year_formula") {
    answer = ci; semantic = "compound_interest"; askEn = "Find the compound interest."; askHi = "चक्रवृद्धि ब्याज ज्ञात कीजिए।"; askPa = "ਚੱਕਰਵ੍ਰਿੱਧੀ ਬਿਆਜ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_ci_principal_from_amount") {
    answer = p; semantic = "principal"; askEn = "Find the principal."; askHi = "मूलधन ज्ञात कीजिए।"; askPa = "ਮੂਲਧਨ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_ci_rate_from_amount") {
    answer = r; kind = "rate"; semantic = "rate"; askEn = "Find the annual rate."; askHi = "वार्षिक दर ज्ञात कीजिए।"; askPa = "ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_ci_time_from_amount") {
    answer = t; kind = "time"; semantic = "time"; askEn = "Find the time."; askHi = "समय ज्ञात कीजिए।"; askPa = "ਸਮਾਂ ਪਤਾ ਕਰੋ।";
  }

  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables,
    answer: round2(answer),
    answerKind: kind,
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["uses simple interest instead of compound interest", "adds rates linearly", "uses interest as amount"],
    customStem: {
      en: `A ${context.en} is ${money(p)} at ${pct(r)} per annum compounded annually for ${t} years. ${askEn}`,
      hi: `${context.hi} ${money(p)} है, दर ${pct(r)} प्रतिवर्ष है और ब्याज ${t} वर्ष तक वार्षिक चक्रवृद्धि है। ${askHi}`,
      pa: `${context.pa} ${money(p)} ਹੈ, ਦਰ ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਹੈ ਅਤੇ ਬਿਆਜ ${t} ਸਾਲ ਲਈ ਸਾਲਾਨਾ ਚੱਕਰਵ੍ਰਿੱਧੀ ਹੈ। ${askPa}`,
    },
    customSteps: [
      step("amount", "Compound amount", "चक्रवृद्धि कुल राशि", "ਚੱਕਰਵ੍ਰਿੱਧੀ ਕੁੱਲ ਰਕਮ", `${p} x (1 + ${r}/100)^${t}`, amount),
      step("ci", "Compound interest", "चक्रवृद्धि ब्याज", "ਚੱਕਰਵ੍ਰਿੱਧੀ ਬਿਆਜ", `${amount} - ${p}`, ci),
      step("answer", labelFor(semantic, "en"), labelFor(semantic, "hi"), labelFor(semantic, "pa"), answerFormula(semantic, variables), answer),
    ],
    trapsNumeric: [round2((p * r * t) / 100), amount, ci],
  });
}

function labelFor(semantic: InterestAnswerSemantic, language: "en" | "hi" | "pa") {
  const labels: Record<InterestAnswerSemantic, Record<"en" | "hi" | "pa", string>> = {
    simple_interest: { en: "Simple interest", hi: "साधारण ब्याज", pa: "ਸਧਾਰਣ ਬਿਆਜ" },
    compound_interest: { en: "Compound interest", hi: "चक्रवृद्धि ब्याज", pa: "ਚੱਕਰਵ੍ਰਿੱਧੀ ਬਿਆਜ" },
    amount: { en: "Amount", hi: "कुल राशि", pa: "ਕੁੱਲ ਰਕਮ" },
    principal: { en: "Principal", hi: "मूलधन", pa: "ਮੂਲਧਨ" },
    rate: { en: "Rate", hi: "दर", pa: "ਦਰ" },
    time: { en: "Time", hi: "समय", pa: "ਸਮਾਂ" },
    difference: { en: "Difference", hi: "अंतर", pa: "ਅੰਤਰ" },
    installment: { en: "Installment", hi: "किस्त", pa: "ਕਿਸ਼ਤ" },
    present_worth: { en: "Present worth", hi: "वर्तमान मूल्य", pa: "ਮੌਜੂਦਾ ਮੁੱਲ" },
    bankers_discount: { en: "Banker's discount", hi: "बैंकर्स डिस्काउंट", pa: "ਬੈਂਕਰ ਛੂਟ" },
    true_discount: { en: "True discount", hi: "सच्ची छूट", pa: "ਅਸਲ ਛੂਟ" },
    bankers_gain: { en: "Banker's gain", hi: "बैंकर्स लाभ", pa: "ਬੈਂਕਰ ਲਾਭ" },
    final_value: { en: "Final value", hi: "अंतिम मूल्य", pa: "ਅੰਤਿਮ ਮੁੱਲ" },
    effective_rate: { en: "Effective annual rate", hi: "प्रभावी वार्षिक दर", pa: "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ" },
    investment_ratio: { en: "Investment ratio", hi: "निवेश अनुपात", pa: "ਨਿਵੇਸ਼ ਅਨੁਪਾਤ" },
  };
  return labels[semantic][language];
}

function answerFormula(semantic: InterestAnswerSemantic, v: Record<string, number>) {
  switch (semantic) {
    case "principal": return `${v.si ?? v.amount} x 100 / (${v.r} x ${v.t})`;
    case "rate": return `${v.si ?? v.diff ?? v.amount} x 100 / (${v.p} x ${v.t ?? 1})`;
    case "time": return `${v.si ?? v.amount} x 100 / (${v.p} x ${v.r})`;
    default: return `${round2(v.answer ?? 0) || ""}`.trim();
  }
}

function siDifference(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const p = pick(PRINCIPALS, `${seed}:p`);
  const r1 = pick([5, 6, 8, 10], `${seed}:r1`);
  const r2 = r1 + pick([2, 4, 5], `${seed}:r2`);
  const t = pick([2, 3, 4], `${seed}:t`);
  const diff = round2((p * (r2 - r1) * t) / 100);
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r1, r2, t, diff },
    answer: diff,
    answerKind: "amount",
    answerSemantic: "difference",
    difficulty,
    context,
    traps: ["uses only one rate", "subtracts rates but forgets time", "uses amount instead of principal"],
    customStem: {
      en: `On a ${context.en} of ${money(p)}, simple interest is compared for ${t} years at ${pct(r1)} and ${pct(r2)} per annum. Find the difference in interest.`,
      hi: `${money(p)} के ${context.hi} पर ${t} वर्ष के लिए ${pct(r1)} और ${pct(r2)} प्रतिवर्ष की दरों पर साधारण ब्याज की तुलना की गई। ब्याज का अंतर ज्ञात कीजिए।`,
      pa: `${money(p)} ਦੇ ${context.pa} ਤੇ ${t} ਸਾਲ ਲਈ ${pct(r1)} ਅਤੇ ${pct(r2)} ਪ੍ਰਤੀ ਸਾਲ ਦਰਾਂ ਉੱਤੇ ਸਧਾਰਣ ਬਿਆਜ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਗਈ। ਬਿਆਜ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("rate-gap", "Rate difference", "दर का अंतर", "ਦਰ ਦਾ ਅੰਤਰ", `${r2} - ${r1}`, r2 - r1),
      step("diff", "Interest difference", "ब्याज का अंतर", "ਬਿਆਜ ਦਾ ਅੰਤਰ", `${p} x ${r2 - r1} x ${t} / 100`, diff),
    ],
    trapsNumeric: [round2((p * (r2 - r1)) / 100), round2((p * r2 * t) / 100), round2((p * r1 * t) / 100)],
  });
}

function ratioSi(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const t = pick([4, 5, 8, 10], `${seed}:t`);
  const numerator = pick([5, 6, 3], `${seed}:n`);
  const denominator = numerator - 1;
  const r = round2(((numerator / denominator - 1) * 100) / t);
  const context = contextFor(family, seed);
  const answer = /time/u.test(family) ? t : r;
  const kind: InterestAnswerKind = /time/u.test(family) ? "time" : "rate";
  const semantic: InterestAnswerSemantic = /time/u.test(family) ? "time" : "rate";
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { ratioNum: numerator, ratioDen: denominator, t, r },
    answer,
    answerKind: kind,
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["uses amount ratio as interest ratio", "forgets to subtract 1 from amount ratio", "treats time as rate"],
    customStem: {
      en: `A ${context.en} becomes ${numerator}/${denominator} of itself in ${t} years at simple interest. Find the ${semantic}.`,
      hi: `एक ${context.hi} साधारण ब्याज पर ${t} वर्ष में अपने का ${numerator}/${denominator} हो जाता है। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${context.pa} ਸਧਾਰਣ ਬਿਆਜ ਤੇ ${t} ਸਾਲ ਵਿੱਚ ਆਪਣੇ ਦਾ ${numerator}/${denominator} ਹੋ ਜਾਂਦਾ ਹੈ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("growth", "Interest part of principal", "मूलधन का ब्याज भाग", "ਮੂਲਧਨ ਦਾ ਬਿਆਜ ਹਿੱਸਾ", `${numerator}/${denominator} - 1`, round2(numerator / denominator - 1)),
      step("rate", "Rate", "दर", "ਦਰ", `(${numerator}/${denominator} - 1) x 100 / ${t}`, r),
    ],
    trapsNumeric: [round2((numerator * 100) / denominator / t), round2((numerator - denominator) * 100), round2(r * t)],
  });
}

function temporalSi(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const p = pick(PRINCIPALS, `${seed}:p`);
  const r = pick([5, 8, 10, 12], `${seed}:r`);
  const t1 = pick([2, 3], `${seed}:t1`);
  const t2 = t1 + pick([2, 3], `${seed}:t2`);
  const a1 = p + (p * r * t1) / 100;
  const a2 = p + (p * r * t2) / 100;
  const oneYear = round2((a2 - a1) / (t2 - t1));
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r, t1, t2, a1, a2, oneYear },
    answer: p,
    answerKind: "amount",
    answerSemantic: "principal",
    difficulty,
    context,
    traps: ["uses amount as principal", "uses total gap as one-year interest", "ignores the first time period"],
    customStem: {
      en: `At simple interest, a ${context.en} amounts to ${money(a1)} in ${t1} years and ${money(a2)} in ${t2} years. Find the principal.`,
      hi: `साधारण ब्याज पर एक ${context.hi} ${t1} वर्ष में ${money(a1)} और ${t2} वर्ष में ${money(a2)} हो जाता है। मूलधन ज्ञात कीजिए।`,
      pa: `ਸਧਾਰਣ ਬਿਆਜ ਤੇ ਇੱਕ ${context.pa} ${t1} ਸਾਲ ਵਿੱਚ ${money(a1)} ਅਤੇ ${t2} ਸਾਲ ਵਿੱਚ ${money(a2)} ਹੋ ਜਾਂਦਾ ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("one-year", "One-year interest", "एक वर्ष का ब्याज", "ਇੱਕ ਸਾਲ ਦਾ ਬਿਆਜ", `(${a2} - ${a1}) / (${t2} - ${t1})`, oneYear),
      step("principal", "Principal", "मूलधन", "ਮੂਲਧਨ", `${a1} - ${oneYear} x ${t1}`, p),
    ],
    trapsNumeric: [a1, a2, round2(a1 - oneYear)],
  });
}

function ciSiDiff(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const r = pick([5, 10, 20], `${seed}:r`);
  const diff = pick([40, 50, 100, 160, 200, 250, 400], `${seed}:diff`);
  const p = round2((diff * 10000) / (r * r));
  const twoYearDiff = round2((p * r * r) / 10000);
  const threeYearDiff = round2(p * (3 * (r / 100) ** 2 + (r / 100) ** 3));
  const answer = family.includes("3_year") ? threeYearDiff : family.includes("rate_from") ? r : family.includes("principal") ? p : twoYearDiff;
  const kind: InterestAnswerKind = family.includes("rate_from") ? "rate" : "amount";
  const semantic: InterestAnswerSemantic = family.includes("principal") ? "principal" : family.includes("rate_from") ? "rate" : "difference";
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r, diff: twoYearDiff, diff3: threeYearDiff },
    answer,
    answerKind: kind,
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["uses SI as CI", "forgets interest-on-interest", "uses rate instead of rate squared"],
    customStem: {
      en: `For a ${context.en}, compare CI and SI at ${pct(r)} per annum for ${family.includes("3_year") ? 3 : 2} years. Find ${labelFor(semantic, "en").toLowerCase()}.`,
      hi: `एक ${context.hi} पर ${pct(r)} प्रतिवर्ष की दर से ${family.includes("3_year") ? 3 : 2} वर्ष के लिए चक्रवृद्धि और साधारण ब्याज की तुलना करें। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${context.pa} ਤੇ ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਦੀ ਦਰ ਨਾਲ ${family.includes("3_year") ? 3 : 2} ਸਾਲ ਲਈ ਚੱਕਰਵ੍ਰਿੱਧੀ ਅਤੇ ਸਧਾਰਣ ਬਿਆਜ ਦੀ ਤੁਲਨਾ ਕਰੋ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("diff2", "Difference for 2 years", "2 वर्ष का अंतर", "2 ਸਾਲ ਦਾ ਅੰਤਰ", `${p} x (${r}/100)^2`, twoYearDiff),
      step("answer", labelFor(semantic, "en"), labelFor(semantic, "hi"), labelFor(semantic, "pa"), String(answer), answer),
    ],
    trapsNumeric: [round2((p * r * 2) / 100), round2(twoYearDiff * 2), round2((p * r) / 100)],
  });
}

function frequencyCi(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const p = pick([4000, 8000, 10000, 12000], `${seed}:p`);
  const m = family.includes("quarter") ? 4 : family.includes("monthly") ? 12 : 2;
  const r = m === 12 ? 12 : m === 4 ? 8 : 10;
  const periods = m === 12 ? 1 : m;
  const periodRate = r / m;
  const amount = round2(p * Math.pow(1 + periodRate / 100, periods));
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r, m, periods, periodRate, amount },
    answer: amount,
    answerKind: "amount",
    answerSemantic: "amount",
    difficulty,
    context,
    traps: ["uses annual rate for each period", "uses SI instead of CI", "uses wrong number of periods"],
    customStem: {
      en: `A ${context.en} of ${money(p)} is compounded ${m === 2 ? "half-yearly" : m === 4 ? "quarterly" : "monthly"} at ${pct(r)} nominal annual rate for ${periods} periods. Find the amount.`,
      hi: `${money(p)} का ${context.hi} ${pct(r)} नाममात्र वार्षिक दर पर ${m === 2 ? "अर्धवार्षिक" : m === 4 ? "त्रैमासिक" : "मासिक"} चक्रवृद्धि है। कुल राशि ज्ञात कीजिए।`,
      pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਨਾਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਤੇ ${m === 2 ? "ਅੱਧ-ਸਾਲਾਨਾ" : m === 4 ? "ਤਿਮਾਹੀ" : "ਮਾਸਿਕ"} ਚੱਕਰਵ੍ਰਿੱਧੀ ਹੈ। ਕੁੱਲ ਰਕਮ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("period-rate", "Rate per period", "प्रति अवधि दर", "ਪ੍ਰਤੀ ਅਵਧੀ ਦਰ", `${r} / ${m}`, periodRate),
      step("amount", "Amount", "कुल राशि", "ਕੁੱਲ ਰਕਮ", `${p} x (1 + ${periodRate}/100)^${periods}`, amount),
    ],
    trapsNumeric: [round2(p * (1 + r / 100)), round2(p + (p * r * periods) / (100 * m)), round2(p * (1 + periodRate / 100))],
  });
}

function growth(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const initial = pick([5000, 10000, 20000, 50000, 80000], `${seed}:initial`);
  const r1 = pick([5, 10, 20], `${seed}:r1`);
  const r2 = pick([5, 10, 15], `${seed}:r2`);
  const reduce = /depreciation|reduction|machine_car/u.test(family);
  const finalValue = round2(initial * (100 + (reduce ? -r1 : r1)) * (100 + (family.includes("successive") ? (reduce ? -r2 : r2) : reduce ? -r1 : r1)) / 10000);
  const context = contextFor(family, seed);
  const term = reduce ? "depreciates" : "grows";
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { initial, r1, r2, finalValue, reduce: reduce ? 1 : 0 },
    answer: finalValue,
    answerKind: "amount",
    answerSemantic: "final_value",
    difficulty,
    context,
    traps: ["adds rates directly", "uses simple percentage once", "uses wrong sign for reduction"],
    customStem: {
      en: `The value of a ${context.en} is ${money(initial)} and it ${term} by ${pct(r1)} each year for 2 years. Find the final value.`,
      hi: `एक ${context.hi} का मूल्य ${money(initial)} है और यह 2 वर्षों तक हर वर्ष ${pct(r1)} ${reduce ? "घटता" : "बढ़ता"} है। अंतिम मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${context.pa} ਦਾ ਮੁੱਲ ${money(initial)} ਹੈ ਅਤੇ ਇਹ 2 ਸਾਲਾਂ ਲਈ ਹਰ ਸਾਲ ${pct(r1)} ${reduce ? "ਘਟਦਾ" : "ਵਧਦਾ"} ਹੈ। ਅੰਤਿਮ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("index", "Final index", "अंतिम सूचकांक", "ਅੰਤਿਮ ਸੂਚਕ", `100 x (${100 + (reduce ? -r1 : r1)}/100)^2`, round2(100 * Math.pow((100 + (reduce ? -r1 : r1)) / 100, 2))),
      step("final", "Final value", "अंतिम मूल्य", "ਅੰਤਿਮ ਮੁੱਲ", `${initial} x final index / 100`, finalValue),
    ],
    trapsNumeric: [round2(initial * (100 + (reduce ? -2 * r1 : 2 * r1)) / 100), round2(initial * (100 + (reduce ? -r1 : r1)) / 100), round2(initial)],
  });
}

function banker(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const amount = pick([1200, 1500, 2000, 2400, 3000, 5000, 6000], `${seed}:amount`);
  const r = pick([5, 8, 10, 12], `${seed}:r`);
  const t = pick([1, 2, 3], `${seed}:t`);
  const pw = round2((amount * 100) / (100 + r * t));
  const td = round2(amount - pw);
  const bd = round2((amount * r * t) / 100);
  const bg = round2(bd - td);
  let answer = td;
  let semantic: InterestAnswerSemantic = "true_discount";
  if (/present_worth|bill_due/u.test(family)) { answer = pw; semantic = "present_worth"; }
  else if (/bankers_discount/u.test(family)) { answer = bd; semantic = "bankers_discount"; }
  else if (/bankers_gain|bd_td_difference/u.test(family)) { answer = bg; semantic = "bankers_gain"; }
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { amount, r, t, pw, td, bd, bg },
    answer,
    answerKind: "amount",
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["confuses banker discount with true discount", "uses present worth as amount", "subtracts in the wrong order"],
    customStem: {
      en: `A ${context.en} of ${money(amount)} is due after ${t} years at ${pct(r)} per annum. Find the ${labelFor(semantic, "en").toLowerCase()}.`,
      hi: `${money(amount)} का ${context.hi} ${t} वर्ष बाद देय है और दर ${pct(r)} प्रतिवर्ष है। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
      pa: `${money(amount)} ਦਾ ${context.pa} ${t} ਸਾਲ ਬਾਅਦ ਦੇਣਯੋਗ ਹੈ ਅਤੇ ਦਰ ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਹੈ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("pw", "Present worth", "वर्तमान मूल्य", "ਮੌਜੂਦਾ ਮੁੱਲ", `${amount} x 100 / (100 + ${r} x ${t})`, pw),
      step("td", "True discount", "सच्ची छूट", "ਅਸਲ ਛੂਟ", `${amount} - ${pw}`, td),
      step("bd", "Banker's discount", "बैंकर्स डिस्काउंट", "ਬੈਂਕਰ ਛੂਟ", `${amount} x ${r} x ${t} / 100`, bd),
      step("answer", labelFor(semantic, "en"), labelFor(semantic, "hi"), labelFor(semantic, "pa"), String(answer), answer),
    ],
    trapsNumeric: [td, bd, pw],
  });
}

function advancedGeneric(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  if (/bankers|true_discount|present_worth|bill_due/u.test(family)) return banker(seed, family, difficulty);
  if (/ci_half|ci_quarter|ci_month|wrong_period|nominal/u.test(family)) return frequencyCi(seed, family, difficulty);
  if (/growth|depreciation|appreciation|successive|machine_car|compound_depreciation/u.test(family)) return growth(seed, family, difficulty);
  if (/ci_si|rate_from_ci|principal_from_ci|hybrid_si_ci/u.test(family)) return ciSiDiff(seed, family, difficulty);
  if (/temporal/u.test(family)) return temporalSi(seed, family, difficulty);
  if (/ratio_find|amount_ratio/u.test(family)) return ratioSi(seed, family, difficulty);
  if (/si_difference|interest_more/u.test(family)) return siDifference(seed, family, difficulty);
  if (/ci_|compound/u.test(family)) return ciBase(seed, family, difficulty);
  return directSi(seed, family, difficulty);
}

export const INTEREST_MOTIF_FACTORIES: Record<InterestFamilyId, InterestMotifFactory> =
  Object.fromEntries(
    INTEREST_FAMILY_IDS.map((family) => [
      family,
      ({ seed, difficulty }) => advancedGeneric(seed, family, difficulty),
    ]),
  ) as Record<InterestFamilyId, InterestMotifFactory>;

export function createInterestProblem(input: {
  seed: string;
  difficulty: Lowercase<"easy" | "medium" | "hard">;
  family?: InterestFamilyId;
}) {
  const family = input.family ?? pick(INTEREST_FAMILY_IDS, `${input.seed}:family`);
  return INTEREST_MOTIF_FACTORIES[family]({
    seed: input.seed,
    difficulty: input.difficulty,
    family,
  });
}
