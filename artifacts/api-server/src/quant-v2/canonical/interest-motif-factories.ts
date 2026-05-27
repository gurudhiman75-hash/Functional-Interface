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
  { en: "education loan", hi: "शिक्षा ऋण", pa: "ਸਿੱਖਿਆ ਕਰਜ਼ਾ" },
  { en: "crop loan", hi: "फसल ऋण", pa: "ਫਸਲੀ ਕਰਜ਼ਾ" },
  { en: "post office deposit", hi: "डाकघर जमा", pa: "ਡਾਕਘਰ ਜਮ੍ਹਾਂ" },
  { en: "monthly saving account", hi: "मासिक बचत खाता", pa: "ਮਾਸਿਕ ਬਚਤ ਖਾਤਾ" },
  { en: "business advance", hi: "व्यापार अग्रिम", pa: "ਕਾਰੋਬਾਰੀ ਅਡਵਾਂਸ" },
];

const ASSET_CONTEXTS: readonly InterestContext[] = [
  { en: "machine", hi: "मशीन", pa: "ਮਸ਼ੀਨ" },
  { en: "car", hi: "कार", pa: "ਕਾਰ" },
  { en: "scooter", hi: "स्कूटर", pa: "ਸਕੂਟਰ" },
  { en: "laptop", hi: "लैपटॉप", pa: "ਲੈਪਟਾਪ" },
  { en: "equipment", hi: "उपकरण", pa: "ਉਪਕਰਣ" },
  { en: "furniture", hi: "फर्नीचर", pa: "ਫਰਨੀਚਰ" },
  { en: "delivery van", hi: "डिलीवरी वैन", pa: "ਡਿਲਿਵਰੀ ਵੈਨ" },
  { en: "printing press", hi: "प्रिंटिंग प्रेस", pa: "ਪ੍ਰਿੰਟਿੰਗ ਪ੍ਰੈੱਸ" },
  { en: "solar unit", hi: "सौर इकाई", pa: "ਸੌਰ ਯੂਨਿਟ" },
];

const BILL_CONTEXTS: readonly InterestContext[] = [
  { en: "bill of exchange", hi: "विनिमय बिल", pa: "ਵਿਨਿਮਯ ਬਿੱਲ" },
  { en: "invoice", hi: "चालान", pa: "ਚਲਾਨ" },
  { en: "due amount", hi: "देय राशि", pa: "ਦੇਣਯੋਗ ਰਕਮ" },
  { en: "trade bill", hi: "व्यापार बिल", pa: "ਵਪਾਰਕ ਬਿੱਲ" },
  { en: "present-worth case", hi: "वर्तमान मूल्य प्रश्न", pa: "ਮੌਜੂਦਾ ਮੁੱਲ ਪ੍ਰਸ਼ਨ" },
  { en: "promissory note", hi: "प्रतिज्ञा पत्र", pa: "ਵਚਨ ਪੱਤਰ" },
  { en: "merchant bill", hi: "व्यापारी बिल", pa: "ਵਪਾਰੀ ਬਿੱਲ" },
];

const SPLIT_CONTEXTS: readonly InterestContext[] = [
  { en: "two funds", hi: "दो फंड", pa: "ਦੋ ਫੰਡ" },
  { en: "two schemes", hi: "दो योजनाएँ", pa: "ਦੋ ਯੋਜਨਾਵਾਂ" },
  { en: "two borrowers", hi: "दो उधारकर्ता", pa: "ਦੋ ਕਰਜ਼ਦਾਰ" },
  { en: "two parts of a loan", hi: "ऋण के दो भाग", pa: "ਕਰਜ਼ੇ ਦੇ ਦੋ ਹਿੱਸੇ" },
  { en: "two deposits", hi: "दो जमाएँ", pa: "ਦੋ ਜਮ੍ਹਾਂ ਰਕਮਾਂ" },
  { en: "two partner investments", hi: "दो साझेदार निवेश", pa: "ਦੋ ਸਾਂਝੇਦਾਰ ਨਿਵੇਸ਼" },
  { en: "two savings plans", hi: "दो बचत योजनाएँ", pa: "ਦੋ ਬਚਤ ਯੋਜਨਾਵਾਂ" },
  { en: "two business advances", hi: "दो व्यापार अग्रिम", pa: "ਦੋ ਕਾਰੋਬਾਰੀ ਅਡਵਾਂਸ" },
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
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(2));
}

function clean(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function money(value: number) {
  return `₹${clean(value)}`;
}

function pct(value: number) {
  return `${clean(value)}%`;
}

function yearText(value: number) {
  return `${clean(value)} ${Math.abs(value - 1) < 0.001 ? "year" : "years"}`;
}

function monthText(value: number) {
  return `${clean(value)} ${Math.abs(value - 1) < 0.001 ? "month" : "months"}`;
}

function ordinal(value: number) {
  if (value === 1) return "1st";
  if (value === 2) return "2nd";
  if (value === 3) return "3rd";
  return `${value}th`;
}

function withArticle(context: InterestContext) {
  if (/^two\b/iu.test(context.en)) return context.en;
  return /^[aeiou]/iu.test(context.en) ? `an ${context.en}` : `a ${context.en}`;
}

function capitalizedArticle(context: InterestContext) {
  const phrase = withArticle(context);
  return `${phrase[0]?.toUpperCase() ?? ""}${phrase.slice(1)}`;
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
  if (/temporal|specific_year|nth_year|fractional|installment|partial|bankers|true_discount|present_worth|alligation|mixed|amount_multiplier_gap/u.test(family)) return "advanced" as const;
  if (/ci_si_difference_2_years|rate_from_ci_si_diff_2y|principal_from_ci_si_diff_2y|half|quarter|monthly|growth|depreciation|appreciation|successive|part_principal|two_sums|investment|weighted|nominal|annual_vs_half/u.test(family)) return "medium" as const;
  if (/difference|ratio/u.test(family)) return "hard" as const;
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
  if (kind === "ratio") {
    const values = [
      answer,
      answer > 0 ? 1 / answer : 2,
      answer + 0.25,
      Math.max(0.2, answer - 0.25),
      answer * 2,
    ].map(round2).filter((value) => Number.isFinite(value) && value > 0);
    const unique: number[] = [];
    for (const value of values) {
      if (!unique.some((existing) => Math.abs(existing - value) < 0.01)) unique.push(value);
      if (unique.length >= 4) break;
    }
    return unique.slice(1, 4);
  }
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
  let p = pick(PRINCIPALS, `${seed}:p`);
  let r = pick(RATES, `${seed}:r`);
  let t = pick(YEARS, `${seed}:t`);
  if (family === "int_si_principal_from_si_rt" && round2((p * r * t) / 100) === p) {
    r = 10;
  }
  const si = round2((p * r * t) / 100);
  const amount = p + si;
  const context = contextFor(family, seed);
  let answer = si;
  let kind: InterestAnswerKind = "amount";
  let semantic: InterestAnswerSemantic = "simple_interest";
  let askEn = "Find the simple interest.";
  let askHi = "साधारण ब्याज ज्ञात कीजिए।";
  let askPa = "ਸਧਾਰਣ ਵਿਆਜ ਪਤਾ ਕਰੋ।";
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
  const stem = family === "int_si_principal_from_si_rt"
    ? {
        en: `The simple interest on ${withArticle(context)} at ${pct(r)} per annum for ${yearText(t)} is ${money(si)}. ${askEn}`,
        hi: `${context.hi} पर ${pct(r)} वार्षिक दर से ${t} वर्ष का साधारण ब्याज ${money(si)} है। ${askHi}`,
        pa: `${context.pa} ਤੇ ${pct(r)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${t} ਸਾਲ ਦਾ ਸਧਾਰਣ ਵਿਆਜ ${money(si)} ਹੈ। ${askPa}`,
      }
    : family === "int_si_rate_from_si_pt"
      ? {
          en: `${money(p)} earns ${money(si)} simple interest in ${yearText(t)}. ${askEn}`,
          hi: `${money(p)} के ${context.hi} पर ${t} वर्ष में ${money(si)} साधारण ब्याज मिलता है। ${askHi}`,
          pa: `${money(p)} ਦੇ ${context.pa} ਤੇ ${t} ਸਾਲ ਵਿੱਚ ${money(si)} ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ${askPa}`,
        }
      : family === "int_si_time_from_si_pr"
        ? {
            en: `${money(p)} earns ${money(si)} simple interest at ${pct(r)} per annum. ${askEn}`,
            hi: `${money(p)} के ${context.hi} पर ${pct(r)} वार्षिक दर से ${money(si)} साधारण ब्याज मिलता है। ${askHi}`,
            pa: `${money(p)} ਦੇ ${context.pa} ਤੇ ${pct(r)} ਸਾਲਾਨਾ ਦਰ ਨਾਲ ${money(si)} ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ${askPa}`,
          }
        : {
            en: `${money(p)} is invested at ${pct(r)} per annum simple interest for ${yearText(t)}. ${askEn}`,
            hi: `${money(p)} का ${context.hi} ${pct(r)} प्रतिवर्ष की दर से ${t} वर्ष के लिए साधारण ब्याज पर है। ${askHi}`,
            pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਦੀ ਦਰ ਨਾਲ ${t} ਸਾਲ ਲਈ ਸਧਾਰਣ ਵਿਆਜ ਤੇ ਹੈ। ${askPa}`,
          };

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
    customStem: stem,
    customSteps: [
      step("si", "Simple interest", "साधारण ब्याज", "ਸਧਾਰਣ ਵਿਆਜ", `${p} x ${r} x ${t} / 100`, si),
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
  let askPa = "ਮਿਸ਼ਰਿਤ ਕੁੱਲ ਰਕਮ ਪਤਾ ਕਰੋ।";
  const variables: Record<string, number> = { p, r, t, amount, ci };

  if (family === "int_ci_from_amount" || family === "int_ci_two_year_formula" || family === "int_ci_three_year_formula") {
    answer = ci; semantic = "compound_interest"; askEn = "Find the compound interest."; askHi = "चक्रवृद्धि ब्याज ज्ञात कीजिए।"; askPa = "ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_ci_principal_from_amount") {
    answer = p; semantic = "principal"; askEn = "Find the principal."; askHi = "मूलधन ज्ञात कीजिए।"; askPa = "ਮੂਲਧਨ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_ci_rate_from_amount") {
    answer = r; kind = "rate"; semantic = "rate"; askEn = "Find the annual rate."; askHi = "वार्षिक दर ज्ञात कीजिए।"; askPa = "ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।";
  } else if (family === "int_ci_time_from_amount") {
    answer = t; kind = "time"; semantic = "time"; askEn = "Find the time."; askHi = "समय ज्ञात कीजिए।"; askPa = "ਸਮਾਂ ਪਤਾ ਕਰੋ।";
  }
  const stem = family === "int_ci_principal_from_amount"
    ? {
        en: `A sum amounts to ${money(amount)} at ${pct(r)} compound interest for ${yearText(t)}. ${askEn}`,
        hi: `${context.hi} ${pct(r)} चक्रवृद्धि ब्याज पर ${t} वर्ष में ${money(amount)} हो जाता है। ${askHi}`,
        pa: `${context.pa} ${pct(r)} ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਤੇ ${t} ਸਾਲ ਵਿੱਚ ${money(amount)} ਹੋ ਜਾਂਦਾ ਹੈ। ${askPa}`,
      }
    : family === "int_ci_rate_from_amount"
      ? {
          en: `${money(p)} amounts to ${money(amount)} in ${yearText(t)} at compound interest. ${askEn}`,
          hi: `${money(p)} का ${context.hi} चक्रवृद्धि ब्याज पर ${t} वर्ष में ${money(amount)} हो जाता है। ${askHi}`,
          pa: `${money(p)} ਦਾ ${context.pa} ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਤੇ ${t} ਸਾਲ ਵਿੱਚ ${money(amount)} ਹੋ ਜਾਂਦਾ ਹੈ। ${askPa}`,
        }
      : family === "int_ci_time_from_amount"
        ? {
            en: `${money(p)} amounts to ${money(amount)} at ${pct(r)} compound interest. ${askEn}`,
            hi: `${money(p)} का ${context.hi} ${pct(r)} चक्रवृद्धि ब्याज पर ${money(amount)} हो जाता है। ${askHi}`,
            pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਤੇ ${money(amount)} ਹੋ ਜਾਂਦਾ ਹੈ। ${askPa}`,
          }
        : {
            en: `${money(p)} is invested at ${pct(r)} per annum, compounded annually, for ${yearText(t)}. ${askEn}`,
            hi: `${context.hi} ${money(p)} है, दर ${pct(r)} प्रतिवर्ष है और ब्याज ${t} वर्ष तक वार्षिक चक्रवृद्धि है। ${askHi}`,
            pa: `${context.pa} ${money(p)} ਹੈ, ਦਰ ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਹੈ ਅਤੇ ਵਿਆਜ ${t} ਸਾਲ ਲਈ ਸਾਲਾਨਾ ਮਿਸ਼ਰਿਤ ਹੈ। ${askPa}`,
          };

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
    customStem: stem,
    customSteps: [
      step("amount", "Compound amount", "चक्रवृद्धि कुल राशि", "ਮਿਸ਼ਰਿਤ ਕੁੱਲ ਰਕਮ", `${p} x (1 + ${r}/100)^${t}`, amount),
      step("ci", "Compound interest", "चक्रवृद्धि ब्याज", "ਮਿਸ਼ਰਿਤ ਵਿਆਜ", `${amount} - ${p}`, ci),
      step("answer", labelFor(semantic, "en"), labelFor(semantic, "hi"), labelFor(semantic, "pa"), answerFormula(semantic, variables), answer),
    ],
    trapsNumeric: [round2((p * r * t) / 100), amount, ci],
  });
}

function labelFor(semantic: InterestAnswerSemantic, language: "en" | "hi" | "pa") {
  const labels: Record<InterestAnswerSemantic, Record<"en" | "hi" | "pa", string>> = {
    simple_interest: { en: "Simple interest", hi: "साधारण ब्याज", pa: "ਸਧਾਰਣ ਵਿਆਜ" },
    compound_interest: { en: "Compound interest", hi: "चक्रवृद्धि ब्याज", pa: "ਮਿਸ਼ਰਿਤ ਵਿਆਜ" },
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
      pa: `${money(p)} ਦੇ ${context.pa} ਤੇ ${t} ਸਾਲ ਲਈ ${pct(r1)} ਅਤੇ ${pct(r2)} ਪ੍ਰਤੀ ਸਾਲ ਦਰਾਂ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਤੁਲਨਾ ਕੀਤੀ ਗਈ। ਵਿਆਜ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("rate-gap", "Rate difference", "दर का अंतर", "ਦਰ ਦਾ ਅੰਤਰ", `${r2} - ${r1}`, r2 - r1),
      step("diff", "Interest difference", "ब्याज का अंतर", "ਵਿਆਜ ਦਾ ਅੰਤਰ", `${p} x ${r2 - r1} x ${t} / 100`, diff),
    ],
    trapsNumeric: [round2((p * (r2 - r1)) / 100), round2((p * r2 * t) / 100), round2((p * r1 * t) / 100)],
  });
}

function ratioSi(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const asksTriple = family.includes("triple");
  const numerator = asksTriple ? 3 : family.includes("double") ? 2 : pick([5, 6, 3], `${seed}:n`);
  const denominator = family.includes("double") || asksTriple ? 1 : numerator - 1;
  const t = pick(asksTriple ? [8, 10, 12] : [4, 5, 8, 10], `${seed}:t`);
  const r = round2(((numerator / denominator - 1) * 100) / t);
  const context = contextFor(family, seed);
  const answer = /time/u.test(family) ? t : r;
  const kind: InterestAnswerKind = /time/u.test(family) ? "time" : "rate";
  const semantic: InterestAnswerSemantic = /time/u.test(family) ? "time" : "rate";
  const stem = /time/u.test(family)
    ? {
        en: `A sum becomes ${numerator === 2 && denominator === 1 ? "twice" : numerator === 3 && denominator === 1 ? "thrice" : `${numerator}/${denominator} of`} itself at ${pct(r)} simple interest. Find the time.`,
        hi: `एक ${context.hi} ${pct(r)} साधारण ब्याज पर अपने का ${numerator}/${denominator} हो जाता है। समय ज्ञात कीजिए।`,
        pa: `ਇੱਕ ${context.pa} ${pct(r)} ਸਧਾਰਣ ਵਿਆਜ ਤੇ ਆਪਣੇ ਦਾ ${numerator}/${denominator} ਹੋ ਜਾਂਦਾ ਹੈ। ਸਮਾਂ ਪਤਾ ਕਰੋ।`,
      }
    : {
        en: `A sum becomes ${numerator === 2 && denominator === 1 ? "twice" : numerator === 3 && denominator === 1 ? "thrice" : `${numerator}/${denominator} of`} itself in ${yearText(t)} at simple interest. Find the ${semantic}.`,
        hi: `एक ${context.hi} साधारण ब्याज पर ${t} वर्ष में अपने का ${numerator}/${denominator} हो जाता है। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
        pa: `ਇੱਕ ${context.pa} ਸਧਾਰਣ ਵਿਆਜ ਤੇ ${t} ਸਾਲ ਵਿੱਚ ਆਪਣੇ ਦਾ ${numerator}/${denominator} ਹੋ ਜਾਂਦਾ ਹੈ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
      };
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
    customStem: stem,
    customSteps: [
      step("growth", "Interest part of principal", "मूलधन का ब्याज भाग", "ਮੂਲਧਨ ਦਾ ਵਿਆਜ ਹਿੱਸਾ", `${numerator}/${denominator} - 1`, round2(numerator / denominator - 1)),
      step("rate", "Rate", "दर", "ਦਰ", `(${numerator}/${denominator} - 1) x 100 / ${t}`, r),
    ],
    trapsNumeric: [round2((numerator * 100) / denominator / t), round2((numerator - denominator) * 100), round2(r * t)],
  });
}

function ratioCi(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const multiplier = family.includes("triple") ? 3 : 2;
  const r = pick([10, 20, 25], `${seed}:r`);
  const baseYears = r === 10 ? 8 : r === 20 ? 4 : 3;
  const t = multiplier === 2 ? baseYears : baseYears * 2;
  const p = pick([1000, 2000, 5000, 10000], `${seed}:p`);
  const amount = round2(p * Math.pow(1 + r / 100, t));
  if (family === "int_ci_amount_multiplier_gap") {
    const t1 = pick([2, 3], `${seed}:t1`);
    const t2 = t1 + pick([1, 2], `${seed}:t2`);
    const p2 = pick([2000, 4000, 5000, 8000], `${seed}:p2`);
    const a1 = round2(p2 * Math.pow(1 + r / 100, t1));
    const a2 = round2(p2 * Math.pow(1 + r / 100, t2));
    return createProblem({
      id: `${family}:${seed}`,
      family,
      variables: { p: p2, r, t1, t2, a1, a2 },
      answer: r,
      answerKind: "rate",
      answerSemantic: "rate",
      difficulty,
      context: contextFor(family, seed),
      traps: ["uses total amount ratio as rate", "uses simple interest gap", "ignores the time gap"],
      customStem: {
        en: `A sum amounts to ${money(a1)} in ${yearText(t1)} and amounts to ${money(a2)} in ${yearText(t2)} at compound interest. Find the annual rate.`,
        hi: `एक राशि चक्रवृद्धि ब्याज पर ${t1} वर्ष में ${money(a1)} और ${t2} वर्ष में ${money(a2)} हो जाती है। वार्षिक दर ज्ञात कीजिए।`,
        pa: `ਇੱਕ ਰਕਮ ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਤੇ ${t1} ਸਾਲ ਵਿੱਚ ${money(a1)} ਅਤੇ ${t2} ਸਾਲ ਵਿੱਚ ${money(a2)} ਹੋ ਜਾਂਦੀ ਹੈ। ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`,
      },
      customSteps: [
        step("amount-ratio", "Amount ratio for the gap", "अंतराल के लिए राशि अनुपात", "ਅੰਤਰਾਲ ਲਈ ਰਕਮ ਅਨੁਪਾਤ", `${a2} / ${a1}`, round2(a2 / a1)),
        step("rate", "Annual rate", "वार्षिक दर", "ਸਾਲਾਨਾ ਦਰ", `(( ${a2} / ${a1} )^(1 / ${t2 - t1}) - 1) x 100`, r),
      ],
      trapsNumeric: [round2(((a2 - a1) * 100) / a1), round2((a2 / a1) * 10), round2(r * (t2 - t1))],
    });
  }
  const askTime = /time/u.test(family) || family.includes("sum_doubles") || family.includes("multiplier_gap");
  const answer = askTime ? t : r;
  const kind: InterestAnswerKind = askTime ? "time" : "rate";
  const semantic: InterestAnswerSemantic = askTime ? "time" : "rate";
  const context = contextFor(family, seed);
  const stem = askTime
    ? {
        en: family.includes("sum_doubles")
          ? `A sum becomes twice itself at ${pct(r)} compound interest. Find the time.`
          : `${money(p)} amounts to ${money(amount)} at ${pct(r)} compound interest. Find the ${semantic}.`,
        hi: `${money(p)} का ${context.hi} ${pct(r)} चक्रवृद्धि ब्याज पर ${money(amount)} हो जाता है। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
        pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਤੇ ${money(amount)} ਹੋ ਜਾਂਦਾ ਹੈ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
      }
    : {
        en: `${money(p)} amounts to ${money(amount)} in ${yearText(t)} at compound interest. Find the ${semantic}.`,
        hi: `${money(p)} का ${context.hi} चक्रवृद्धि ब्याज पर ${t} वर्ष में ${money(amount)} हो जाता है। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
        pa: `${money(p)} ਦਾ ${context.pa} ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਤੇ ${t} ਸਾਲ ਵਿੱਚ ${money(amount)} ਹੋ ਜਾਂਦਾ ਹੈ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
      };
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r, t, amount, multiplier },
    answer,
    answerKind: kind,
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["uses simple interest ratio", "forgets compound multiplier", "treats amount as interest"],
    customStem: stem,
    customSteps: [
      step("multiplier", "Amount multiplier", "राशि गुणक", "ਰਕਮ ਗੁਣਕ", `${amount} / ${p}`, round2(amount / p)),
      step("answer", labelFor(semantic, "en"), labelFor(semantic, "hi"), labelFor(semantic, "pa"), String(answer), answer),
    ],
    trapsNumeric: [round2((multiplier - 1) * 100 / t), round2(r * t), amount],
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
      en: `At simple interest, ${withArticle(context)} amounts to ${money(a1)} in ${t1} years and ${money(a2)} in ${t2} years. Find the principal.`,
      hi: `साधारण ब्याज पर एक ${context.hi} ${t1} वर्ष में ${money(a1)} और ${t2} वर्ष में ${money(a2)} हो जाता है। मूलधन ज्ञात कीजिए।`,
      pa: `ਸਧਾਰਣ ਵਿਆਜ ਤੇ ਇੱਕ ${context.pa} ${t1} ਸਾਲ ਵਿੱਚ ${money(a1)} ਅਤੇ ${t2} ਸਾਲ ਵਿੱਚ ${money(a2)} ਹੋ ਜਾਂਦਾ ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("one-year", "One-year interest", "एक वर्ष का ब्याज", "ਇੱਕ ਸਾਲ ਦਾ ਵਿਆਜ", `(${a2} - ${a1}) / (${t2} - ${t1})`, oneYear),
      step("principal", "Principal", "मूलधन", "ਮੂਲਧਨ", `${a1} - ${oneYear} x ${t1}`, p),
    ],
    trapsNumeric: [a1, a2, round2(a1 - oneYear)],
  });
}

function splitSi(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const total = pick([6000, 8000, 10000, 12000, 15000, 20000], `${seed}:total`);
  const r1 = pick([5, 6, 8, 10], `${seed}:r1`);
  const r2 = r1 + pick([2, 4, 5], `${seed}:r2`);
  const t = pick([2, 3, 4], `${seed}:t`);
  const part1 = pick([total * 0.25, total * 0.4, total * 0.6], `${seed}:part`);
  const part2 = total - part1;
  const interest = round2((part1 * r1 * t + part2 * r2 * t) / 100);
  const averageRate = round2((interest * 100) / (total * t));
  const askRate = /weighted_average_rate/u.test(family);
  const askInterest = /weighted_interest_income/u.test(family);
  const askRatio = /ratio/u.test(family);
  const answer = askRate ? averageRate : askInterest ? interest : askRatio ? round2(part1 / part2) : part1;
  const kind: InterestAnswerKind = askRate ? "rate" : askRatio ? "ratio" : "amount";
  const semantic: InterestAnswerSemantic = askRate ? "rate" : askRatio ? "investment_ratio" : askInterest ? "simple_interest" : "principal";
  const context = contextFor(family, seed);
  const askEn = askRate ? "Find the average annual rate." : askInterest ? "Find the total interest." : askRatio ? "Find the ratio of the two investments." : `Find the amount invested at ${pct(r1)}.`;
  const askHi = askRate ? "औसत वार्षिक दर ज्ञात कीजिए।" : askInterest ? "कुल ब्याज ज्ञात कीजिए।" : askRatio ? "दोनों निवेशों का अनुपात ज्ञात कीजिए।" : `${pct(r1)} पर लगाई गई राशि ज्ञात कीजिए।`;
  const askPa = askRate ? "ਔਸਤ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।" : askInterest ? "ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਕਰੋ।" : askRatio ? "ਦੋਵੇਂ ਨਿਵੇਸ਼ਾਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।" : `${pct(r1)} ਤੇ ਲਗਾਈ ਰਕਮ ਪਤਾ ਕਰੋ।`;
  const stemVariants = [
    {
      en: `A total of ${money(total)} is split between two simple-interest schemes at ${pct(r1)} and ${pct(r2)} per annum for ${t} years. The total interest is ${money(interest)}. ${askEn}`,
      hi: `${money(total)} को दो साधारण ब्याज योजनाओं में ${pct(r1)} और ${pct(r2)} वार्षिक दर पर ${t} वर्ष के लिए लगाया गया। कुल ब्याज ${money(interest)} है। ${askHi}`,
      pa: `${money(total)} ਨੂੰ ਦੋ ਸਧਾਰਣ ਵਿਆਜ ਯੋਜਨਾਵਾਂ ਵਿੱਚ ${pct(r1)} ਅਤੇ ${pct(r2)} ਸਾਲਾਨਾ ਦਰ ਤੇ ${t} ਸਾਲ ਲਈ ਲਗਾਇਆ ਗਿਆ। ਕੁੱਲ ਵਿਆਜ ${money(interest)} ਹੈ। ${askPa}`,
    },
    {
      en: `${money(total)} is divided into two parts. The two parts earn simple interest at ${pct(r1)} and ${pct(r2)} per annum. After ${t} years, the combined interest is ${money(interest)}. ${askEn}`,
      hi: `${money(total)} को दो भागों में बाँटा गया जिन पर ${pct(r1)} और ${pct(r2)} वार्षिक साधारण ब्याज मिलता है। ${t} वर्ष बाद कुल ब्याज ${money(interest)} है। ${askHi}`,
      pa: `${money(total)} ਨੂੰ ਦੋ ਹਿੱਸਿਆਂ ਵਿੱਚ ਵੰਡਿਆ ਗਿਆ ਜਿਨ੍ਹਾਂ ਤੇ ${pct(r1)} ਅਤੇ ${pct(r2)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਮਿਲਦਾ ਹੈ। ${t} ਸਾਲ ਬਾਅਦ ਕੁੱਲ ਵਿਆਜ ${money(interest)} ਹੈ। ${askPa}`,
    },
    {
      en: `Two deposits together make ${money(total)}. They earn simple interest at ${pct(r1)} and ${pct(r2)} per annum for ${t} years, giving ${money(interest)} in all. ${askEn}`,
      hi: `दो जमाओं का योग ${money(total)} है। वे ${t} वर्ष के लिए ${pct(r1)} और ${pct(r2)} वार्षिक साधारण ब्याज पर कुल ${money(interest)} कमाती हैं। ${askHi}`,
      pa: `ਦੋ ਜਮ੍ਹਾਂ ਰਕਮਾਂ ਦਾ ਜੋੜ ${money(total)} ਹੈ। ਉਹ ${t} ਸਾਲ ਲਈ ${pct(r1)} ਅਤੇ ${pct(r2)} ਸਾਲਾਨਾ ਸਧਾਰਣ ਵਿਆਜ ਤੇ ਕੁੱਲ ${money(interest)} ਕਮਾਉਂਦੀਆਂ ਹਨ। ${askPa}`,
    },
  ];
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { total, r1, r2, t, part1, part2, interest, averageRate },
    answer,
    answerKind: kind,
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["uses simple average rate", "splits the principal equally", "uses total interest as one part"],
    customStem: stemVariants[hashText(`${seed}:split-stem`) % stemVariants.length]!,
    customSteps: [
      step("equation", "Total interest condition", "कुल ब्याज की शर्त", "ਕੁੱਲ ਵਿਆਜ ਦੀ ਸ਼ਰਤ", `x x ${r1} x ${t}/100 + (${total} - x) x ${r2} x ${t}/100 = ${interest}`, interest),
      step("part1", "Amount at lower rate", "कम दर पर राशि", "ਘੱਟ ਦਰ ਵਾਲੀ ਰਕਮ", String(part1), part1),
    ],
    trapsNumeric: [round2(total / 2), round2((interest * 100) / (r1 * t)), round2(total - part1)],
  });
}

function installment(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const principal = pick([6000, 8000, 10000, 12000], `${seed}:p`);
  const r = pick([5, 10, 12], `${seed}:r`);
  const n = family.includes("half_yearly") ? 2 : pick([2, 3], `${seed}:n`);
  const compound = /ci|compound/u.test(family);
  const periodRate = family.includes("half_yearly") ? r / 2 : r;
  const compoundDenominator = Array.from({ length: n }, (_, index) =>
    Math.pow(1 + periodRate / 100, index),
  ).reduce((sum, value) => sum + value, 0);
  const simpleDenominator = Array.from({ length: n }, (_, index) =>
    1 / (1 + (r * (index + 1)) / 100),
  ).reduce((sum, value) => sum + value, 0);
  const installmentValue = round2(
    compound
      ? principal * Math.pow(1 + periodRate / 100, n) / compoundDenominator
      : principal / simpleDenominator,
  );
  const amount = round2(installmentValue * n);
  const askPrincipal = family.includes("principal_from");
  const answer = askPrincipal ? principal : installmentValue;
  const semantic: InterestAnswerSemantic = askPrincipal ? "principal" : "installment";
  const context = contextFor(family, seed);
  const askEn = askPrincipal ? "Find the loan amount." : "Find each installment.";
  const askHi = askPrincipal ? "ऋण राशि ज्ञात कीजिए।" : "प्रत्येक किस्त ज्ञात कीजिए।";
  const askPa = askPrincipal ? "ਕਰਜ਼ੇ ਦੀ ਰਕਮ ਪਤਾ ਕਰੋ।" : "ਹਰ ਕਿਸ਼ਤ ਪਤਾ ਕਰੋ।";
  const installmentPeriodEn = family.includes("half_yearly") ? "half-yearly" : "yearly";
  const installmentPeriodHi = family.includes("half_yearly") ? "अर्धवार्षिक" : "वार्षिक";
  const installmentPeriodPa = family.includes("half_yearly") ? "ਅੱਧ-ਸਾਲਾਨਾ" : "ਸਾਲਾਨਾ";
  const stemVariants = askPrincipal
    ? [
        {
          en: `A loan is repaid in ${n} equal ${installmentPeriodEn} installments of ${money(installmentValue)} at ${pct(r)} ${compound ? "compound" : "simple"} interest. ${askEn}`,
          hi: `एक ऋण ${money(installmentValue)} की ${n} बराबर ${installmentPeriodHi} किस्तों में ${pct(r)} ${compound ? "चक्रवृद्धि" : "साधारण"} ब्याज पर चुकाया जाता है। ${askHi}`,
          pa: `ਇੱਕ ਕਰਜ਼ਾ ${money(installmentValue)} ਦੀਆਂ ${n} ਬਰਾਬਰ ${installmentPeriodPa} ਕਿਸ਼ਤਾਂ ਵਿੱਚ ${pct(r)} ${compound ? "ਮਿਸ਼ਰਿਤ" : "ਸਧਾਰਣ"} ਵਿਆਜ ਤੇ ਚੁਕਾਇਆ ਜਾਂਦਾ ਹੈ। ${askPa}`,
        },
        {
          en: `${n} equal ${installmentPeriodEn} payments of ${money(installmentValue)} clear a debt carrying ${pct(r)} ${compound ? "compound" : "simple"} interest. ${askEn}`,
          hi: `${money(installmentValue)} की ${n} बराबर ${installmentPeriodHi} किस्तें ${pct(r)} ${compound ? "चक्रवृद्धि" : "साधारण"} ब्याज वाले ऋण को पूरा चुका देती हैं। ${askHi}`,
          pa: `${money(installmentValue)} ਦੀਆਂ ${n} ਬਰਾਬਰ ${installmentPeriodPa} ਕਿਸ਼ਤਾਂ ${pct(r)} ${compound ? "ਮਿਸ਼ਰਿਤ" : "ਸਧਾਰਣ"} ਵਿਆਜ ਵਾਲਾ ਕਰਜ਼ਾ ਪੂਰਾ ਚੁਕਾ ਦਿੰਦੀਆਂ ਹਨ। ${askPa}`,
        },
      ]
    : [
        {
          en: `${money(principal)} is borrowed at ${pct(r)} ${compound ? "compound" : "simple"} interest and repaid in ${n} equal ${installmentPeriodEn} installments. ${askEn}`,
          hi: `${money(principal)} का ऋण ${pct(r)} ${compound ? "चक्रवृद्धि" : "साधारण"} ब्याज पर ${n} बराबर ${installmentPeriodHi} किस्तों में चुकाना है। ${askHi}`,
          pa: `${money(principal)} ਦਾ ਕਰਜ਼ਾ ${pct(r)} ${compound ? "ਮਿਸ਼ਰਿਤ" : "ਸਧਾਰਣ"} ਵਿਆਜ ਤੇ ${n} ਬਰਾਬਰ ${installmentPeriodPa} ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਚੁਕਾਉਣਾ ਹੈ। ${askPa}`,
        },
        {
          en: `${money(principal)} is to be cleared by ${n} equal ${installmentPeriodEn} payments at ${pct(r)} ${compound ? "compound" : "simple"} interest. ${askEn}`,
          hi: `${money(principal)} ${pct(r)} ${compound ? "चक्रवृद्धि" : "साधारण"} ब्याज पर लिया गया है और इसे ${n} बराबर ${installmentPeriodHi} किस्तों में चुकाना है। ${askHi}`,
          pa: `${money(principal)} ${pct(r)} ${compound ? "ਮਿਸ਼ਰਿਤ" : "ਸਧਾਰਣ"} ਵਿਆਜ ਤੇ ਲਿਆ ਗਿਆ ਹੈ ਅਤੇ ਇਸ ਨੂੰ ${n} ਬਰਾਬਰ ${installmentPeriodPa} ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਚੁਕਾਉਣਾ ਹੈ। ${askPa}`,
        },
      ];
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { principal, r, n, amount, installment: installmentValue, compound: compound ? 1 : 0 },
    answer,
    answerKind: "amount",
    answerSemantic: semantic,
    difficulty,
    context,
    traps: ["divides principal before adding interest", "uses simple interest for compound case", "ignores one installment"],
    customStem: stemVariants[hashText(`${seed}:installment-stem`) % stemVariants.length]!,
    customSteps: [
      step("amount", "Amount payable", "देय राशि", "ਦੇਣਯੋਗ ਰਕਮ", compound ? `${principal} x (1 + ${r}/100)^${n}` : `${principal} x (100 + ${r} x ${n}) / 100`, amount),
      step("installment", "Each installment", "प्रत्येक किस्त", "ਹਰ ਕਿਸ਼ਤ", compound ? `${principal} x (1 + ${periodRate}/100)^${n} / ((1 + ${periodRate}/100)^${n - 1} + ... + 1)` : `${principal} / (1/(1 + ${r}/100) + ... + 1/(1 + ${r * n}/100))`, installmentValue),
    ],
    trapsNumeric: [round2(principal / n), round2((principal + principal * r / 100) / n), amount],
  });
}

function partialPayment(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const principal = pick([5000, 8000, 10000, 12000], `${seed}:p`);
  const r = pick([5, 8, 10], `${seed}:r`);
  const firstYears = pick([1, 2], `${seed}:first`);
  const secondYears = pick([2, 3], `${seed}:second`);
  const repaid = pick([1000, 2000, 3000, 4000], `${seed}:repaid`);
  const balance = principal - repaid;
  const interest = round2((principal * r * firstYears + balance * r * secondYears) / 100);
  const context = contextFor(family, seed);
  const stemVariants = [
    {
      en: `${money(principal)} is borrowed at ${pct(r)} simple interest. After ${yearText(firstYears)}, ${money(repaid)} is repaid. The balance remains for ${secondYears} more ${secondYears === 1 ? "year" : "years"}. Find the total interest.`,
      hi: `एक उधारकर्ता ${money(principal)} ${pct(r)} साधारण ब्याज पर लेता है। ${firstYears} वर्ष बाद मूलधन में से ${money(repaid)} चुका देता है। कुल ${firstYears + secondYears} वर्षों का ब्याज ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਕਰਜ਼ਦਾਰ ${money(principal)} ${pct(r)} ਸਧਾਰਣ ਵਿਆਜ ਤੇ ਲੈਂਦਾ ਹੈ। ${firstYears} ਸਾਲ ਬਾਅਦ ਮੂਲਧਨ ਵਿੱਚੋਂ ${money(repaid)} ਵਾਪਸ ਕਰਦਾ ਹੈ। ਕੁੱਲ ${firstYears + secondYears} ਸਾਲਾਂ ਦਾ ਵਿਆਜ ਪਤਾ ਕਰੋ।`,
    },
    {
      en: `${money(principal)} is borrowed at ${pct(r)} simple interest. ${money(repaid)} is repaid after ${yearText(firstYears)}. The remaining principal stays for ${yearText(secondYears)} more. Find the total interest.`,
      hi: `${money(principal)} का ${context.hi} ${pct(r)} साधारण ब्याज पर है। ${firstYears} वर्ष बाद ${money(repaid)} चुका दिया जाता है और शेष ${secondYears} वर्ष और रहता है। कुल ब्याज ज्ञात कीजिए।`,
      pa: `${money(principal)} ਦਾ ${context.pa} ${pct(r)} ਸਧਾਰਣ ਵਿਆਜ ਤੇ ਹੈ। ${firstYears} ਸਾਲ ਬਾਅਦ ${money(repaid)} ਵਾਪਸ ਕੀਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਬਕਾਇਆ ਹੋਰ ${secondYears} ਸਾਲ ਰਹਿੰਦਾ ਹੈ। ਕੁੱਲ ਵਿਆਜ ਪਤਾ ਕਰੋ।`,
    },
  ];
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { principal, r, firstYears, secondYears, repaid, balance, interest },
    answer: interest,
    answerKind: "amount",
    answerSemantic: "simple_interest",
    difficulty,
    context,
    traps: ["charges interest on full principal throughout", "ignores first period", "subtracts repayment from interest"],
    customStem: stemVariants[hashText(`${seed}:partial-stem`) % stemVariants.length]!,
    customSteps: [
      step("first-interest", "Interest before repayment", "भुगतान से पहले ब्याज", "ਭੁਗਤਾਨ ਤੋਂ ਪਹਿਲਾਂ ਵਿਆਜ", `${principal} x ${r} x ${firstYears} / 100`, round2((principal * r * firstYears) / 100)),
      step("balance-interest", "Interest on balance", "शेष पर ब्याज", "ਬਕਾਇਆ ਤੇ ਵਿਆਜ", `${balance} x ${r} x ${secondYears} / 100`, round2((balance * r * secondYears) / 100)),
      step("total-interest", "Total interest", "कुल ब्याज", "ਕੁੱਲ ਵਿਆਜ", `${round2((principal * r * firstYears) / 100)} + ${round2((balance * r * secondYears) / 100)}`, interest),
    ],
    trapsNumeric: [round2((principal * r * (firstYears + secondYears)) / 100), round2((balance * r * (firstYears + secondYears)) / 100), round2(interest - repaid)],
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
  const years = family.includes("3_year") ? 3 : 2;
  const shownDiff = family.includes("3_year") ? threeYearDiff : twoYearDiff;
  const stem = family.includes("principal")
    ? {
        en: `The difference between compound interest and simple interest for ${years} years at ${pct(r)} per annum is ${money(shownDiff)}. Find the principal.`,
        hi: `${years} वर्ष के लिए ${pct(r)} वार्षिक दर पर चक्रवृद्धि और साधारण ब्याज का अंतर ${money(shownDiff)} है। मूलधन ज्ञात कीजिए।`,
        pa: `${years} ਸਾਲ ਲਈ ${pct(r)} ਸਾਲਾਨਾ ਦਰ ਤੇ ਮਿਸ਼ਰਿਤ ਅਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਅੰਤਰ ${money(shownDiff)} ਹੈ। ਮੂਲਧਨ ਪਤਾ ਕਰੋ।`,
      }
    : family.includes("rate_from")
      ? {
          en: `For 2 years, the difference between compound interest and simple interest on ${money(p)} is ${money(twoYearDiff)}. Find the annual rate.`,
          hi: `${money(p)} पर 2 वर्ष के लिए चक्रवृद्धि और साधारण ब्याज का अंतर ${money(twoYearDiff)} है। वार्षिक दर ज्ञात कीजिए।`,
          pa: `${money(p)} ਤੇ 2 ਸਾਲ ਲਈ ਮਿਸ਼ਰਿਤ ਅਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਅੰਤਰ ${money(twoYearDiff)} ਹੈ। ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`,
        }
      : {
          en: `On ${money(p)}, the compound interest and simple interest are compared at ${pct(r)} per annum for ${yearText(years)}. Find the difference.`,
          hi: `${money(p)} पर ${pct(r)} प्रतिवर्ष की दर से ${years} वर्ष के लिए चक्रवृद्धि और साधारण ब्याज की तुलना करें। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
          pa: `${money(p)} ਤੇ ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਦੀ ਦਰ ਨਾਲ ${years} ਸਾਲ ਲਈ ਮਿਸ਼ਰਿਤ ਅਤੇ ਸਧਾਰਣ ਵਿਆਜ ਦੀ ਤੁਲਨਾ ਕਰੋ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
        };
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
    customStem: stem,
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
  const periods = m;
  const periodRate = r / m;
  const amount = round2(p * Math.pow(1 + periodRate / 100, periods));
  const context = contextFor(family, seed);
  const frequency = m === 2 ? "half-yearly" : m === 4 ? "quarterly" : "monthly";
  const timePhrase = family === "int_ci_fractional_time_boundary"
    ? (m === 12 ? `2 years ${monthText(4)}` : "2 years 6 months")
    : "1 year";
  const shownPeriods = family === "int_ci_fractional_time_boundary"
    ? (m === 12 ? 28 : 5)
    : periods;
  const shownAmount = family === "int_ci_fractional_time_boundary"
    ? round2(p * Math.pow(1 + periodRate / 100, shownPeriods))
    : amount;
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r, m, periods: shownPeriods, periodRate, amount: shownAmount },
    answer: shownAmount,
    answerKind: "amount",
    answerSemantic: "amount",
    difficulty,
    context,
    traps: ["uses annual rate for each period", "uses SI instead of CI", "uses wrong number of periods"],
    customStem: {
      en: `${money(p)} is lent at ${pct(r)} p.a., compounded ${frequency}, for ${timePhrase}. Find the amount.`,
      hi: `${money(p)} का ${context.hi} ${pct(r)} नाममात्र वार्षिक दर पर ${m === 2 ? "अर्धवार्षिक" : m === 4 ? "त्रैमासिक" : "मासिक"} चक्रवृद्धि है। कुल राशि ज्ञात कीजिए।`,
      pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਨਾਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਤੇ ${m === 2 ? "ਅੱਧ-ਸਾਲਾਨਾ" : m === 4 ? "ਤਿਮਾਹੀ" : "ਮਾਸਿਕ"} ਮਿਸ਼ਰਿਤ ਹੈ। ਕੁੱਲ ਰਕਮ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("period-rate", "Rate per period", "प्रति अवधि दर", "ਪ੍ਰਤੀ ਅਵਧੀ ਦਰ", `${r} / ${m}`, periodRate),
      step("amount", "Amount", "कुल राशि", "ਕੁੱਲ ਰਕਮ", `${p} x (1 + ${periodRate}/100)^${shownPeriods}`, shownAmount),
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
      en: `A ${context.en} is worth ${money(initial)}. Its value ${term} by ${pct(r1)} each year for 2 years. Find the final value.`,
      hi: `एक ${context.hi} का मूल्य ${money(initial)} है और यह 2 वर्षों तक हर वर्ष ${pct(r1)} ${reduce ? "घटता" : "बढ़ता"} है। अंतिम मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${context.pa} ਦਾ ਮੁੱਲ ${money(initial)} ਹੈ ਅਤੇ ਇਹ 2 ਸਾਲਾਂ ਲਈ ਹਰ ਸਾਲ ${pct(r1)} ${reduce ? "ਘਟਦਾ" : "ਵਧਦਾ"} ਹੈ। ਅੰਤਿਮ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("index", "Value index", "मूल्य सूचकांक", "ਮੁੱਲ ਸੂਚਕ", `100 x (${100 + (reduce ? -r1 : r1)}/100)^2`, round2(100 * Math.pow((100 + (reduce ? -r1 : r1)) / 100, 2))),
      step("final", "Final value", "अंतिम मूल्य", "ਅੰਤਿਮ ਮੁੱਲ", `${initial} x ${round2(100 * Math.pow((100 + (reduce ? -r1 : r1)) / 100, 2))} / 100`, finalValue),
    ],
    trapsNumeric: [round2(initial * (100 + (reduce ? -2 * r1 : 2 * r1)) / 100), round2(initial * (100 + (reduce ? -r1 : r1)) / 100), round2(initial)],
  });
}

function compoundAssetRepair(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const initial = pick([40000, 50000, 80000, 100000], `${seed}:initial`);
  const r = pick([10, 12, 20], `${seed}:r`);
  const repair = pick([1000, 2000, 4000, 5000], `${seed}:repair`);
  const years = 2;
  const depreciated = round2(initial * Math.pow(1 - r / 100, years));
  const finalValue = round2(depreciated + repair);
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { initial, r, repair, years, depreciated, finalValue },
    answer: finalValue,
    answerKind: "amount",
    answerSemantic: "final_value",
    difficulty,
    context,
    traps: ["adds depreciation rates directly", "ignores repair cost", "adds repair before depreciation"],
    customStem: {
      en: `A ${context.en} valued at ${money(initial)} depreciates by ${pct(r)} each year for 2 years. After that, ${money(repair)} is spent on repairs before sale. Find the effective sale value.`,
      hi: `एक ${context.hi} का मूल्य ${money(initial)} है और यह 2 वर्षों तक हर वर्ष ${pct(r)} घटता है। इसके बाद बिक्री से पहले मरम्मत पर ${money(repair)} खर्च होते हैं। प्रभावी विक्रय मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${context.pa} ਦਾ ਮੁੱਲ ${money(initial)} ਹੈ ਅਤੇ ਇਹ 2 ਸਾਲਾਂ ਤੱਕ ਹਰ ਸਾਲ ${pct(r)} ਘਟਦਾ ਹੈ। ਫਿਰ ਵਿਕਰੀ ਤੋਂ ਪਹਿਲਾਂ ਮੁਰੰਮਤ ਤੇ ${money(repair)} ਖਰਚ ਹੁੰਦੇ ਹਨ। ਪ੍ਰਭਾਵੀ ਵਿਕਰੀ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("depreciated", "Value after depreciation", "ह्रास के बाद मूल्य", "ਘਟਾਓ ਤੋਂ ਬਾਅਦ ਮੁੱਲ", `${initial} x (1 - ${r}/100)^2`, depreciated),
      step("final", "Effective sale value", "प्रभावी विक्रय मूल्य", "ਪ੍ਰਭਾਵੀ ਵਿਕਰੀ ਮੁੱਲ", `${depreciated} + ${repair}`, finalValue),
    ],
    trapsNumeric: [round2(initial * (100 - 2 * r) / 100 + repair), depreciated, round2((initial + repair) * Math.pow(1 - r / 100, years))],
  });
}

function annualVsHalfYearly(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const p = pick([8000, 10000, 12000, 16000], `${seed}:p`);
  const r = pick([8, 10, 12], `${seed}:r`);
  const annualAmount = round2(p * (1 + r / 100));
  const halfYearlyAmount = round2(p * Math.pow(1 + r / 200, 2));
  const diff = round2(halfYearlyAmount - annualAmount);
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r, annualAmount, halfYearlyAmount, diff },
    answer: diff,
    answerKind: "amount",
    answerSemantic: "difference",
    difficulty,
    context,
    traps: ["uses same amount for both frequencies", "uses annual rate each half-year", "subtracts in the wrong order"],
    customStem: {
      en: `${capitalizedArticle(context)} of ${money(p)} is offered at ${pct(r)} per annum. Find how much more the amount is in one year when compounded half-yearly instead of annually.`,
      hi: `${money(p)} का ${context.hi} ${pct(r)} वार्षिक दर पर है। वार्षिक के स्थान पर अर्धवार्षिक चक्रवृद्धि करने पर 1 वर्ष में राशि कितनी अधिक होगी?`,
      pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਸਾਲਾਨਾ ਦਰ ਤੇ ਹੈ। ਸਾਲਾਨਾ ਦੀ ਥਾਂ ਅੱਧ-ਸਾਲਾਨਾ ਮਿਸ਼ਰਿਤ ਕਰਨ ਤੇ 1 ਸਾਲ ਵਿੱਚ ਰਕਮ ਕਿੰਨੀ ਵੱਧ ਹੋਵੇਗੀ?`,
    },
    customSteps: [
      step("annual", "Annual compounding amount", "वार्षिक चक्रवृद्धि राशि", "ਸਾਲਾਨਾ ਮਿਸ਼ਰਿਤ ਰਕਮ", `${p} x (1 + ${r}/100)`, annualAmount),
      step("half-yearly", "Half-yearly compounding amount", "अर्धवार्षिक चक्रवृद्धि राशि", "ਅੱਧ-ਸਾਲਾਨਾ ਮਿਸ਼ਰਿਤ ਰਕਮ", `${p} x (1 + ${r}/200)^2`, halfYearlyAmount),
      step("difference", "Extra amount", "अधिक राशि", "ਵਾਧੂ ਰਕਮ", `${halfYearlyAmount} - ${annualAmount}`, diff),
    ],
    trapsNumeric: [annualAmount, round2(p * (1 + r / 100) ** 2 - annualAmount), round2(diff * 2)],
  });
}

function nthYearInterest(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const p = pick([5000, 8000, 10000, 12000], `${seed}:p`);
  const r = pick([5, 10, 20], `${seed}:r`);
  const year = pick([2, 3, 4], `${seed}:year`);
  const opening = round2(p * Math.pow(1 + r / 100, year - 1));
  const nthInterest = round2((opening * r) / 100);
  const context = contextFor(family, seed);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { p, r, year, opening, nthInterest },
    answer: nthInterest,
    answerKind: "amount",
    answerSemantic: "compound_interest",
    difficulty,
    context,
    traps: ["finds total CI instead of nth-year interest", "uses simple interest for the year", "uses closing amount as interest"],
    customStem: {
      en: `${capitalizedArticle(context)} of ${money(p)} is invested at ${pct(r)} compound interest. Find the interest earned in the ${year}${year === 2 ? "nd" : year === 3 ? "rd" : "th"} year only.`,
      hi: `${money(p)} का ${context.hi} ${pct(r)} चक्रवृद्धि ब्याज पर लगाया गया। केवल ${year}वें वर्ष में मिला ब्याज ज्ञात कीजिए।`,
      pa: `${money(p)} ਦਾ ${context.pa} ${pct(r)} ਮਿਸ਼ਰਿਤ ਵਿਆਜ ਤੇ ਲਗਾਇਆ ਗਿਆ। ਸਿਰਫ਼ ${year}ਵੇਂ ਸਾਲ ਦਾ ਵਿਆਜ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("opening", `Opening amount before year ${year}`, `${year}वें वर्ष से पहले राशि`, `${year}ਵੇਂ ਸਾਲ ਤੋਂ ਪਹਿਲਾਂ ਰਕਮ`, `${p} x (1 + ${r}/100)^${year - 1}`, opening),
      step("nth-interest", "Interest for that year", "उस वर्ष का ब्याज", "ਉਸ ਸਾਲ ਦਾ ਵਿਆਜ", `${opening} x ${r} / 100`, nthInterest),
    ],
    trapsNumeric: [round2((p * r * year) / 100), round2(p * Math.pow(1 + r / 100, year) - p), opening],
  });
}

function effectiveRate(seed: string, family: InterestFamilyId, difficulty: Lowercase<"easy" | "medium" | "hard">) {
  const nominal = pick([8, 10, 12, 16], `${seed}:nominal`);
  const m = family.includes("quarter") || hashText(seed) % 2 === 0 ? 4 : 2;
  const effective = round2((Math.pow(1 + nominal / (100 * m), m) - 1) * 100);
  return createProblem({
    id: `${family}:${seed}`,
    family,
    variables: { nominal, m, effective },
    answer: effective,
    answerKind: "rate",
    answerSemantic: "effective_rate",
    difficulty,
    context: contextFor(family, seed),
    traps: ["quotes nominal rate as effective rate", "divides rate but does not compound", "adds period rates linearly"],
    customStem: {
      en: `A scheme quotes ${pct(nominal)} nominal annual interest compounded ${m === 4 ? "quarterly" : "half-yearly"}. Find the effective annual rate.`,
      hi: `एक योजना ${pct(nominal)} नाममात्र वार्षिक ब्याज बताती है, जिसकी चक्रवृद्धि ${m === 4 ? "त्रैमासिक" : "अर्धवार्षिक"} है। प्रभावी वार्षिक दर ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਯੋਜਨਾ ${pct(nominal)} ਨਾਮਾਤਰ ਸਾਲਾਨਾ ਵਿਆਜ ਦਿੰਦੀ ਹੈ, ਜਿਸ ਦੀ ਮਿਸ਼ਰਿਤ ${m === 4 ? "ਤਿਮਾਹੀ" : "ਅੱਧ-ਸਾਲਾਨਾ"} ਹੈ। ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("period-rate", "Rate per period", "प्रति अवधि दर", "ਪ੍ਰਤੀ ਅਵਧੀ ਦਰ", `${nominal} / ${m}`, nominal / m),
      step("effective", "Effective annual rate", "प्रभावी वार्षिक दर", "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ", `(1 + ${nominal}/${100 * m})^${m} - 1`, effective),
    ],
    trapsNumeric: [nominal, round2(nominal / m), round2(nominal + nominal / m)],
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
  const stemVariants = [
    {
      en: `${capitalizedArticle(context)} of ${money(amount)} is due after ${t} years at ${pct(r)} per annum. Find the ${labelFor(semantic, "en").toLowerCase()}.`,
      hi: `${money(amount)} का ${context.hi} ${t} वर्ष बाद देय है और दर ${pct(r)} प्रतिवर्ष है। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
      pa: `${money(amount)} ਦਾ ${context.pa} ${t} ਸਾਲ ਬਾਅਦ ਦੇਣਯੋਗ ਹੈ ਅਤੇ ਦਰ ${pct(r)} ਪ੍ਰਤੀ ਸਾਲ ਹੈ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
    },
    {
      en: `A merchant discounts ${withArticle(context)} worth ${money(amount)} ${t} years before maturity at ${pct(r)} per annum. Find the ${labelFor(semantic, "en").toLowerCase()}.`,
      hi: `एक व्यापारी ${money(amount)} के ${context.hi} को परिपक्वता से ${t} वर्ष पहले ${pct(r)} वार्षिक दर पर भुनाता है। ${labelFor(semantic, "hi")} ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਵਪਾਰੀ ${money(amount)} ਦੇ ${context.pa} ਨੂੰ ਮਿਆਦ ਤੋਂ ${t} ਸਾਲ ਪਹਿਲਾਂ ${pct(r)} ਸਾਲਾਨਾ ਦਰ ਤੇ ਭੁਨਾਉਂਦਾ ਹੈ। ${labelFor(semantic, "pa")} ਪਤਾ ਕਰੋ।`,
    },
  ];
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
    customStem: stemVariants[hashText(`${seed}:banker-stem`) % stemVariants.length]!,
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
  if (/bankers|true_discount|present_worth|bill_due|bd_td_difference/u.test(family)) return banker(seed, family, difficulty);
  if (/installment|loan_repayment|find_installment|principal_from_installments/u.test(family)) return installment(seed, family, difficulty);
  if (/partial_payment|partial_discharge/u.test(family)) return partialPayment(seed, family, difficulty);
  if (/compound_depreciation_repair_sale/u.test(family)) return compoundAssetRepair(seed, family, difficulty);
  if (/annual_vs_half_yearly/u.test(family)) return annualVsHalfYearly(seed, family, difficulty);
  if (/specific_year|nth_year/u.test(family)) return nthYearInterest(seed, family, difficulty);
  if (/nominal_vs_effective/u.test(family)) return effectiveRate(seed, family, difficulty);
  if (/ci_half|ci_quarter|ci_month|wrong_period|nominal|fractional_time/u.test(family)) return frequencyCi(seed, family, difficulty);
  if (/growth|depreciation|appreciation|successive|machine_car|compound_depreciation/u.test(family)) return growth(seed, family, difficulty);
  if (/ci_si|si_ci|rate_from_ci|principal_from_ci|hybrid_si_ci/u.test(family)) return ciSiDiff(seed, family, difficulty);
  if (/temporal/u.test(family)) return temporalSi(seed, family, difficulty);
  if (/part_principal|alligation|two_sums|weighted|investment|divide_total|same_interest|two_people/u.test(family)) return splitSi(seed, family, difficulty);
  if (/amount_ratio_find_(?:rate|time)_ci|ci_sum_doubles|ci_amount_multiplier_gap/u.test(family)) return ratioCi(seed, family, difficulty);
  if (/si_sum_doubles|si_sum_triples/u.test(family)) return ratioSi(seed, family, difficulty);
  if (/ratio_find|amount_ratio/u.test(family)) return ratioSi(seed, family, difficulty);
  if (/si_difference|interest_more|different_rates_different_years/u.test(family)) return siDifference(seed, family, difficulty);
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
