import type {
  CanonicalProfitLossProblem,
  ProfitLossFamilyId,
  ProfitLossMotifFactory,
  ProfitLossSemanticAnswer,
  ProfitLossStep,
} from "./profit-loss-types";

type ObjectLabel = CanonicalProfitLossProblem["object"];

const RETAIL_OBJECTS: readonly ObjectLabel[] = [
  { en: "shirt", pluralEn: "shirts", hi: "कमीज", pluralHi: "कमीजें", pa: "ਕਮੀਜ਼", pluralPa: "ਕਮੀਜ਼ਾਂ" },
  { en: "pair of shoes", pluralEn: "pairs of shoes", hi: "जूते की जोड़ी", pluralHi: "जूते की जोड़ियाँ", pa: "ਜੁੱਤਿਆਂ ਦੀ ਜੋੜੀ", pluralPa: "ਜੁੱਤਿਆਂ ਦੀਆਂ ਜੋੜੀਆਂ" },
  { en: "bag", pluralEn: "bags", hi: "बैग", pluralHi: "बैग", pa: "ਬੈਗ", pluralPa: "ਬੈਗ" },
  { en: "watch", pluralEn: "watches", hi: "घड़ी", pluralHi: "घड़ियाँ", pa: "ਘੜੀ", pluralPa: "ਘੜੀਆਂ" },
  { en: "table fan", pluralEn: "table fans", hi: "टेबल फैन", pluralHi: "टेबल फैन", pa: "ਟੇਬਲ ਫੈਨ", pluralPa: "ਟੇਬਲ ਫੈਨ" },
  { en: "phone", pluralEn: "phones", hi: "फोन", pluralHi: "फोन", pa: "ਫੋਨ", pluralPa: "ਫੋਨ" },
  { en: "book set", pluralEn: "book sets", hi: "पुस्तक सेट", pluralHi: "पुस्तक सेट", pa: "ਕਿਤਾਬਾਂ ਦਾ ਸੈੱਟ", pluralPa: "ਕਿਤਾਬਾਂ ਦੇ ਸੈੱਟ" },
  { en: "chair", pluralEn: "chairs", hi: "कुर्सी", pluralHi: "कुर्सियाँ", pa: "ਕੁਰਸੀ", pluralPa: "ਕੁਰਸੀਆਂ" },
  { en: "bicycle", pluralEn: "bicycles", hi: "साइकिल", pluralHi: "साइकिलें", pa: "ਸਾਈਕਲ", pluralPa: "ਸਾਈਕਲਾਂ" },
  { en: "laptop", pluralEn: "laptops", hi: "लैपटॉप", pluralHi: "लैपटॉप", pa: "ਲੈਪਟਾਪ", pluralPa: "ਲੈਪਟਾਪ" },
  { en: "utensil set", pluralEn: "utensil sets", hi: "बर्तन सेट", pluralHi: "बर्तन सेट", pa: "ਬਰਤਨ ਸੈੱਟ", pluralPa: "ਬਰਤਨ ਸੈੱਟ" },
];

const GROCERY_OBJECTS: readonly ObjectLabel[] = [
  { en: "rice", pluralEn: "rice packets", hi: "चावल", pluralHi: "चावल के पैकेट", pa: "ਚਾਵਲ", pluralPa: "ਚਾਵਲ ਦੇ ਪੈਕਟ" },
  { en: "wheat", pluralEn: "wheat bags", hi: "गेहूं", pluralHi: "गेहूं की बोरियाँ", pa: "ਕਣਕ", pluralPa: "ਕਣਕ ਦੀਆਂ ਬੋਰੀਆਂ" },
  { en: "sugar", pluralEn: "sugar packets", hi: "चीनी", pluralHi: "चीनी के पैकेट", pa: "ਚੀਨੀ", pluralPa: "ਚੀਨੀ ਦੇ ਪੈਕਟ" },
  { en: "pulses", pluralEn: "pulse packets", hi: "दाल", pluralHi: "दाल के पैकेट", pa: "ਦਾਲ", pluralPa: "ਦਾਲ ਦੇ ਪੈਕਟ" },
  { en: "flour", pluralEn: "flour bags", hi: "आटा", pluralHi: "आटे की बोरियाँ", pa: "ਆਟਾ", pluralPa: "ਆਟੇ ਦੀਆਂ ਬੋਰੀਆਂ" },
  { en: "oil tin", pluralEn: "oil tins", hi: "तेल का डिब्बा", pluralHi: "तेल के डिब्बे", pa: "ਤੇਲ ਦਾ ਡੱਬਾ", pluralPa: "ਤੇਲ ਦੇ ਡੱਬੇ" },
  { en: "tea packet", pluralEn: "tea packets", hi: "चाय का पैकेट", pluralHi: "चाय के पैकेट", pa: "ਚਾਹ ਦਾ ਪੈਕਟ", pluralPa: "ਚਾਹ ਦੇ ਪੈਕਟ" },
  { en: "coffee jar", pluralEn: "coffee jars", hi: "कॉफी जार", pluralHi: "कॉफी जार", pa: "ਕੌਫੀ ਜਾਰ", pluralPa: "ਕੌਫੀ ਜਾਰ" },
  { en: "dry fruit box", pluralEn: "dry fruit boxes", hi: "मेवे का डिब्बा", pluralHi: "मेवे के डिब्बे", pa: "ਸੁੱਕੇ ਮੇਵਿਆਂ ਦਾ ਡੱਬਾ", pluralPa: "ਸੁੱਕੇ ਮੇਵਿਆਂ ਦੇ ਡੱਬੇ" },
];

const REPAIR_OBJECTS: readonly ObjectLabel[] = [
  { en: "second-hand phone", pluralEn: "second-hand phones", hi: "पुराना फोन", pluralHi: "पुराने फोन", pa: "ਪੁਰਾਣਾ ਫੋਨ", pluralPa: "ਪੁਰਾਣੇ ਫੋਨ" },
  { en: "used bicycle", pluralEn: "used bicycles", hi: "पुरानी साइकिल", pluralHi: "पुरानी साइकिलें", pa: "ਪੁਰਾਣੀ ਸਾਈਕਲ", pluralPa: "ਪੁਰਾਣੀਆਂ ਸਾਈਕਲਾਂ" },
  { en: "machine", pluralEn: "machines", hi: "मशीन", pluralHi: "मशीनें", pa: "ਮਸ਼ੀਨ", pluralPa: "ਮਸ਼ੀਨਾਂ" },
  { en: "laptop", pluralEn: "laptops", hi: "लैपटॉप", pluralHi: "लैपटॉप", pa: "ਲੈਪਟਾਪ", pluralPa: "ਲੈਪਟਾਪ" },
  { en: "scooter", pluralEn: "scooters", hi: "स्कूटर", pluralHi: "स्कूटर", pa: "ਸਕੂਟਰ", pluralPa: "ਸਕੂਟਰ" },
  { en: "furniture item", pluralEn: "furniture items", hi: "फर्नीचर वस्तु", pluralHi: "फर्नीचर वस्तुएँ", pa: "ਫਰਨੀਚਰ ਵਸਤੂ", pluralPa: "ਫਰਨੀਚਰ ਵਸਤੂਆਂ" },
  { en: "appliance", pluralEn: "appliances", hi: "उपकरण", pluralHi: "उपकरण", pa: "ਉਪਕਰਣ", pluralPa: "ਉਪਕਰਣ" },
];

const BUSINESS_ROLES = [
  ["manufacturer", "wholesaler", "retailer", "customer"],
  ["producer", "distributor", "dealer", "buyer"],
  ["factory", "agent", "shopkeeper", "customer"],
] as const;

export const ADDITIONAL_PROFIT_LOSS_FAMILY_IDS = [
  "pl_no_profit_no_loss",
  "pl_asymmetric_item_equivalence",
  "pl_fractional_value_shift",
  "pl_markup_discount_triangle",
  "pl_target_profit_discount_calibration",
  "pl_target_profit_mp_calibration",
  "pl_successive_discount_equivalent",
  "pl_dual_item_identical_sp",
  "pl_dual_item_mixed_baseline",
  "pl_partial_inventory_allocation",
  "pl_sequential_supply_chain",
  "pl_supply_chain_mixed_profit_loss",
  "pl_compound_error_baseline_shift",
  "pl_dishonest_dealer_weight_fraud",
  "pl_dishonest_dealer_dual_fraud",
  "pl_dishonest_dealer_absolute_hybrid",
  "pl_buy_get_free_discount",
  "pl_hybrid_promotion_scaling",
  "pl_cashback_coupon_discount",
  "pl_gst_after_discount",
  "pl_tax_inclusive_back_calc",
  "pl_profit_after_commission_tax",
  "pl_repair_overhead_cost",
  "pl_required_sp_after_overhead",
  "pl_manufacturing_breakdown",
  "pl_loss_recovery_cp_from_difference",
  "pl_required_sp_after_loss",
  "pl_sp_difference_two_rates",
  "pl_equal_profit_loss_amount",
  "pl_same_profit_amount_different_rates",
  "pl_inverse_cp_from_mp_discount_profit",
  "pl_inverse_discount_from_cp_mp_profit",
  "pl_inverse_markup_from_cp_discount_profit",
  "pl_multi_condition_inverse_absolute",
] as const satisfies readonly ProfitLossFamilyId[];

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

function gcd(left: number, right: number): number {
  let a = Math.abs(Math.trunc(left));
  let b = Math.abs(Math.trunc(right));
  while (b) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function money(value: number) {
  return `₹${fmt(value)}`;
}

function pct(value: number) {
  return `${fmt(value)}%`;
}

function objectFor(seed: string, family: ProfitLossFamilyId) {
  if (/weight|fraud|dishonest|buy_get|promotion/u.test(family)) return pick(GROCERY_OBJECTS, `${seed}:grocery`);
  if (/repair|overhead|manufacturing|compound_error/u.test(family)) return pick(REPAIR_OBJECTS, `${seed}:repair`);
  return pick(RETAIL_OBJECTS, `${seed}:retail`);
}

function semanticFromSigned(value: number, overall = false): ProfitLossSemanticAnswer {
  if (round2(value) === 0) return "no_profit_no_loss";
  if (overall) return value > 0 ? "overall_profit_percent" : "overall_loss_percent";
  return value > 0 ? "profit_percent" : "loss_percent";
}

function answerValueSigned(value: number) {
  return round2(Math.abs(value));
}

function traps(...items: string[]) {
  return items;
}

function optionDeltas(answer: number, kind: "amount" | "percent") {
  const base =
    kind === "amount"
      ? [answer * 0.8, answer * 1.2, answer * 1.1, answer * 0.9, answer + 100, Math.max(1, answer - 100)]
      : [answer + 5, Math.abs(answer - 5), answer + 10, Math.max(1, answer - 10), answer * 1.2, answer * 0.8];
  return base.map(round2).filter((value) => Number.isFinite(value) && value > 0 && value !== answer);
}

function makeDistractors(answer: number, kind: "amount" | "percent", extras: number[] = []) {
  const values: number[] = [];
  for (const value of [...extras, ...optionDeltas(answer, kind)]) {
    const rounded = round2(value);
    if (rounded > 0 && rounded !== answer && !values.includes(rounded)) values.push(rounded);
    if (values.length >= 3) break;
  }
  return values.slice(0, 3);
}

function mk(input: Omit<CanonicalProfitLossProblem, "topic" | "subtype" | "category" | "topology" | "distractors"> & {
  distractorExtras?: number[];
}): CanonicalProfitLossProblem {
  const { distractorExtras, ...problem } = input;
  return {
    ...problem,
    topic: "profit_loss_discount",
    subtype: problem.family,
    category: "profit_loss_discount",
    topology: { family: "profit_loss_discount", variant: problem.family },
    distractors: makeDistractors(problem.answer, problem.answerKind, distractorExtras),
  };
}

function step(key: string, en: string, hi: string, pa: string, expression: string, value: number): ProfitLossStep {
  return { key, en, hi, pa, expression, value: round2(value) };
}

function finalStem(seed: string, variants: readonly string[]) {
  return pick(variants, `${seed}:phrase`);
}

type BuildInput = {
  seed: string;
  difficulty: "easy" | "medium" | "hard";
  family: ProfitLossFamilyId;
  object: ObjectLabel;
};

const amountPool = [200, 240, 300, 400, 500, 600, 720, 800, 900, 1000, 1200, 1500, 1600, 2000, 2400, 2500, 3000, 4000, 5000, 6000, 8000];
const ratePool = [5, 10, 12.5, 15, 20, 25, 30, 40, 50];

function familyFactory(builder: (input: BuildInput) => CanonicalProfitLossProblem): ProfitLossMotifFactory {
  return ({ seed, difficulty, family }) => builder({ seed, difficulty, family, object: objectFor(seed, family) });
}

const noProfitNoLoss = familyFactory(({ seed, difficulty, family, object }) => {
  const price = pick(amountPool, `${seed}:price`);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cp: price, sp: price },
    answer: 0,
    answerKind: "percent",
    answerSemantic: "no_profit_no_loss",
    difficulty,
    object,
    traps: traps("calls equal CP and SP profit", "calls equal CP and SP loss"),
    customStem: {
      en: finalStem(seed, [
        `A ${object.en} is bought and sold for ${money(price)}. What is the result?`,
        `The cost price and selling price of a ${object.en} are both ${money(price)}. Find the profit or loss.`,
        `A shopkeeper sells a ${object.en} at the same price at which it was bought, ${money(price)}. What is the outcome?`,
        `For a ${object.en}, CP = SP = ${money(price)}. State the result.`,
      ]),
      hi: `एक ${object.hi} का खरीद मूल्य और विक्रय मूल्य दोनों ${money(price)} हैं। परिणाम ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਖਰੀਦ ਮੁੱਲ ਅਤੇ ਵਿਕਰੀ ਮੁੱਲ ਦੋਵੇਂ ${money(price)} ਹਨ। ਨਤੀਜਾ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("difference", "Difference between SP and CP", "विक्रय मूल्य और खरीद मूल्य का अंतर", "ਵਿਕਰੀ ਮੁੱਲ ਅਤੇ ਖਰੀਦ ਮੁੱਲ ਦਾ ਅੰਤਰ", `${price} - ${price}`, 0),
    ],
    distractorExtras: [5, 10, 2.5],
  });
});

const asymmetricItemEquivalence = familyFactory(({ seed, difficulty, family, object }) => {
  const pair = pick([{ x: 12, y: 10 }, { x: 15, y: 12 }, { x: 8, y: 10 }, { x: 18, y: 15 }, { x: 20, y: 25 }], `${seed}:pair`);
  const signed = round2((pair.x - pair.y) * 100 / pair.y);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cpArticles: pair.x, spArticles: pair.y },
    answer: answerValueSigned(signed),
    answerKind: "percent",
    answerSemantic: semanticFromSigned(signed),
    difficulty,
    object,
    traps: traps("divides by cost article count", "reverses profit/loss sign", "uses article difference as percent"),
    customStem: {
      en: finalStem(seed, [
        `The cost price of ${pair.x} ${object.pluralEn} is equal to the selling price of ${pair.y} ${object.pluralEn}. Find the profit or loss percentage.`,
        `A trader says CP of ${pair.x} ${object.pluralEn} equals SP of ${pair.y} ${object.pluralEn}. What is the profit or loss percent?`,
        `If ${pair.x} ${object.pluralEn} at cost equal ${pair.y} ${object.pluralEn} at selling price, find the gain or loss percent.`,
        `For ${object.pluralEn}, CP of ${pair.x} pieces is the same as SP of ${pair.y} pieces. Find the result percentage.`,
      ]),
      hi: `${pair.x} ${object.pluralHi} का खरीद मूल्य ${pair.y} ${object.pluralHi} के विक्रय मूल्य के बराबर है। लाभ या हानि प्रतिशत ज्ञात कीजिए।`,
      pa: `${pair.x} ${object.pluralPa} ਦਾ ਖਰੀਦ ਮੁੱਲ ${pair.y} ${object.pluralPa} ਦੇ ਵਿਕਰੀ ਮੁੱਲ ਦੇ ਬਰਾਬਰ ਹੈ। ਲਾਭ ਜਾਂ ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("perUnit", "Profit/loss percentage from article equivalence", "वस्तु-समानता से लाभ/हानि प्रतिशत", "ਵਸਤੂ-ਸਮਾਨਤਾ ਤੋਂ ਲਾਭ/ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ", `(${pair.x} - ${pair.y}) x 100 / ${pair.y}`, signed),
      step("absolute", "Required percentage magnitude", "आवश्यक प्रतिशत", "ਲੋੜੀਂਦਾ ਪ੍ਰਤੀਸ਼ਤ", `|${fmt(signed)}|`, Math.abs(signed)),
    ],
    distractorExtras: [Math.abs((pair.x - pair.y) * 100 / pair.x), Math.abs(pair.x - pair.y), Math.abs(signed) + 5],
  });
});

const fractionalValueShift = familyFactory(({ seed, difficulty, family, object }) => {
  const lossRate = pick([10, 15, 20, 25], `${seed}:loss`);
  const profitRate = pick([5, 10, 15, 20], `${seed}:profit`);
  const cp = pick([800, 1000, 1200, 1500, 2000, 2400, 3000], `${seed}:cp`);
  const difference = round2(cp * (lossRate + profitRate) / 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { lossRate, profitRate, difference },
    answer: cp,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: traps("subtracts rates", "uses selling price as base", "uses only one rate"),
    customStem: {
      en: finalStem(seed, [
        `A ${object.en} is sold at ${pct(lossRate)} loss. If it were sold for ${money(difference)} more, there would be ${pct(profitRate)} profit. Find the cost price.`,
        `Selling a ${object.en} gives ${pct(lossRate)} loss; ${money(difference)} extra would give ${pct(profitRate)} profit. What is CP?`,
        `A trader loses ${pct(lossRate)} on a ${object.en}. By increasing SP by ${money(difference)}, he gains ${pct(profitRate)}. Find CP.`,
        `For a ${object.en}, a ${money(difference)} rise in selling price changes ${pct(lossRate)} loss to ${pct(profitRate)} profit. Find CP.`,
      ]),
      hi: `एक ${object.hi} को ${pct(lossRate)} हानि पर बेचा गया। यदि ${money(difference)} अधिक में बेचा जाता, तो ${pct(profitRate)} लाभ होता। खरीद मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਨੂੰ ${pct(lossRate)} ਨੁਕਸਾਨ ਤੇ ਵੇਚਿਆ ਗਿਆ। ਜੇ ${money(difference)} ਵੱਧ ਵਿੱਚ ਵੇਚਿਆ ਜਾਂਦਾ, ਤਾਂ ${pct(profitRate)} ਲਾਭ ਹੁੰਦਾ। ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("rateDifference", "Difference between the two selling-price rates", "दो विक्रय-मूल्य दरों का अंतर", "ਦੋ ਵਿਕਰੀ-ਮੁੱਲ ਦਰਾਂ ਦਾ ਅੰਤਰ", `${lossRate} + ${profitRate}`, lossRate + profitRate),
      step("cp", "Cost price", "खरीद मूल्य", "ਖਰੀਦ ਮੁੱਲ", `${fmt(difference)} x 100 / ${fmt(lossRate + profitRate)}`, cp),
    ],
    distractorExtras: [difference * 100 / Math.abs(profitRate - lossRate || 1), difference * 100 / profitRate],
  });
});

function markupDiscountNet(markup: number, discount: number) {
  return round2((100 + markup) * (100 - discount) / 100 - 100);
}

const markupDiscountTriangle = familyFactory(({ seed, difficulty, family, object }) => {
  const [markup, discount] = pick([[40, 20], [50, 20], [25, 10], [60, 25], [30, 15], [20, 10]], `${seed}:pair`);
  const signed = markupDiscountNet(markup, discount);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { markup, discount },
    answer: answerValueSigned(signed),
    answerKind: "percent",
    answerSemantic: semanticFromSigned(signed),
    difficulty,
    object,
    traps: traps("subtracts markup and discount directly", "applies discount on CP", "uses wrong base"),
    customStem: {
      en: finalStem(seed, [
        `A ${object.en} is marked ${pct(markup)} above cost price and sold at ${pct(discount)} discount. Find the profit or loss percent.`,
        `The marked price of a ${object.en} is ${pct(markup)} above CP. After ${pct(discount)} discount, what is the result percent?`,
        `A shopkeeper marks a ${object.en} up by ${pct(markup)} and then allows ${pct(discount)} discount. Find profit or loss percent.`,
        `For a ${object.en}, markup is ${pct(markup)} and discount is ${pct(discount)}. Find the net profit or loss percentage.`,
      ]),
      hi: `एक ${object.hi} को खरीद मूल्य से ${pct(markup)} अधिक अंकित किया गया और ${pct(discount)} छूट पर बेचा गया। लाभ या हानि प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਨੂੰ ਖਰੀਦ ਮੁੱਲ ਤੋਂ ${pct(markup)} ਵੱਧ ਅੰਕਿਤ ਕੀਤਾ ਗਿਆ ਅਤੇ ${pct(discount)} ਛੂਟ ਤੇ ਵੇਚਿਆ ਗਿਆ। ਲਾਭ ਜਾਂ ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("spIndex", "Selling price index", "विक्रय मूल्य सूचकांक", "ਵਿਕਰੀ ਮੁੱਲ ਸੂਚਕਾਂਕ", `(100 + ${markup}) x (100 - ${discount}) / 100`, signed + 100),
      step("net", "Net change from cost price", "खरीद मूल्य से शुद्ध परिवर्तन", "ਖਰੀਦ ਮੁੱਲ ਤੋਂ ਸ਼ੁੱਧ ਬਦਲਾਅ", `${fmt(signed + 100)} - 100`, signed),
    ],
    distractorExtras: [Math.abs(markup - discount), Math.abs(markup - discount - (markup * discount / 100)), markup + discount],
  });
});

const targetProfitDiscountCalibration = familyFactory(({ seed, difficulty, family, object }) => {
  const [markup, profit] = pick([[50, 20], [40, 12], [60, 20], [25, 10], [80, 35]], `${seed}:pair`);
  const discount = round2(((100 + markup) - (100 + profit)) * 100 / (100 + markup));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { markup, targetProfit: profit },
    answer: discount,
    answerKind: "percent",
    answerSemantic: "discount_percent",
    difficulty,
    object,
    traps: traps("uses markup minus profit directly", "calculates discount on CP", "reverses ratio"),
    customStem: {
      en: `A ${object.en} is marked ${pct(markup)} above cost price. What discount should be allowed to gain ${pct(profit)}?`,
      hi: `एक ${object.hi} को खरीद मूल्य से ${pct(markup)} अधिक अंकित किया गया। ${pct(profit)} लाभ पाने के लिए कितनी छूट देनी चाहिए?`,
      pa: `ਇੱਕ ${object.pa} ਨੂੰ ਖਰੀਦ ਮੁੱਲ ਤੋਂ ${pct(markup)} ਵੱਧ ਅੰਕਿਤ ਕੀਤਾ ਗਿਆ। ${pct(profit)} ਲਾਭ ਲਈ ਕਿੰਨੀ ਛੂਟ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?`,
    },
    customSteps: [
      step("mpIndex", "Marked price index", "अंकित मूल्य सूचकांक", "ਅੰਕਿਤ ਮੁੱਲ ਸੂਚਕਾਂਕ", `100 + ${markup}`, 100 + markup),
      step("requiredSpIndex", "Required selling price index", "आवश्यक विक्रय मूल्य सूचकांक", "ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ ਸੂਚਕਾਂਕ", `100 + ${profit}`, 100 + profit),
      step("discount", "Discount percentage", "छूट प्रतिशत", "ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ", `(${100 + markup} - ${100 + profit}) x 100 / ${100 + markup}`, discount),
    ],
    distractorExtras: [markup - profit, discount + 5, Math.max(1, discount - 5)],
  });
});

const targetProfitMpCalibration = familyFactory(({ seed, difficulty, family, object }) => {
  const cp = pick(amountPool, `${seed}:cp`);
  const profit = pick([10, 15, 20, 25, 30], `${seed}:profit`);
  const discount = pick([10, 20, 25], `${seed}:discount`);
  const requiredSp = cp * (100 + profit) / 100;
  const mp = round2(requiredSp * 100 / (100 - discount));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cp, targetProfit: profit, discount },
    answer: mp,
    answerKind: "amount",
    answerSemantic: "marked_price",
    difficulty,
    object,
    traps: traps("ignores discount", "applies discount before target profit", "uses CP as MP"),
    customStem: {
      en: `CP of a ${object.en} is ${money(cp)}. What should be the marked price so that after ${pct(discount)} discount there is ${pct(profit)} profit?`,
      hi: `एक ${object.hi} का खरीद मूल्य ${money(cp)} है। ${pct(discount)} छूट के बाद ${pct(profit)} लाभ पाने के लिए अंकित मूल्य कितना होना चाहिए?`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਖਰੀਦ ਮੁੱਲ ${money(cp)} ਹੈ। ${pct(discount)} ਛੂਟ ਤੋਂ ਬਾਅਦ ${pct(profit)} ਲਾਭ ਲਈ ਅੰਕਿਤ ਮੁੱਲ ਕਿੰਨਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?`,
    },
    customSteps: [
      step("requiredSp", "Required selling price", "आवश्यक विक्रय मूल्य", "ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ", `${cp} x ${100 + profit} / 100`, requiredSp),
      step("mp", "Marked price", "अंकित मूल्य", "ਅੰਕਿਤ ਮੁੱਲ", `${fmt(requiredSp)} x 100 / ${100 - discount}`, mp),
    ],
    distractorExtras: [requiredSp, cp * (100 + profit + discount) / 100],
  });
});

const successiveDiscountEquivalent = familyFactory(({ seed, difficulty, family, object }) => {
  const ds = pick([[10, 20], [20, 25], [10, 10, 10], [15, 20], [12.5, 20], [25, 20, 10]], `${seed}:discounts`);
  const finalIndex = round2(ds.reduce((value, discount) => value * (100 - discount) / 100, 100));
  const eq = round2(100 - finalIndex);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: Object.fromEntries(ds.map((discount, index) => [`discount${index + 1}`, discount])),
    answer: eq,
    answerKind: "percent",
    answerSemantic: "effective_discount_percent",
    difficulty,
    object,
    traps: traps("adds discounts directly", "averages discounts", "uses one discount only"),
    customStem: {
      en: `A ${object.en} is offered successive discounts of ${ds.map(pct).join(" and ")}. Find the equivalent discount.`,
      hi: `एक ${object.hi} पर क्रमिक छूट ${ds.map(pct).join(" और ")} दी गई। समतुल्य छूट ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਤੇ ਲਗਾਤਾਰ ਛੂਟ ${ds.map(pct).join(" ਅਤੇ ")} ਦਿੱਤੀ ਗਈ। ਸਮਤੁਲ ਛੂਟ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("finalIndex", "Final payable index", "अंतिम देय सूचकांक", "ਅੰਤਿਮ ਦੇਣਯੋਗ ਸੂਚਕਾਂਕ", ds.map((discount) => `(100 - ${discount})`).join(" x ") + ` / ${10 ** (2 * Math.max(1, ds.length - 1))}`, finalIndex),
      step("discount", "Equivalent discount", "समतुल्य छूट", "ਸਮਤੁਲ ਛੂਟ", `100 - ${fmt(finalIndex)}`, eq),
    ],
    distractorExtras: [ds.reduce((sum, discount) => sum + discount, 0), ds.reduce((sum, discount) => sum + discount, 0) / ds.length],
  });
});

const dualItemIdenticalSp = familyFactory(({ seed, difficulty, family, object }) => {
  const sp = pick([400, 500, 600, 800, 1000, 1200], `${seed}:sp`);
  const profit = pick([10, 20, 25, 30], `${seed}:profit`);
  const loss = profit;
  const cp1 = sp * 100 / (100 + profit);
  const cp2 = sp * 100 / (100 - loss);
  const signed = round2((2 * sp - cp1 - cp2) * 100 / (cp1 + cp2));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { sp, profitPercent: profit, lossPercent: loss },
    answer: answerValueSigned(signed),
    answerKind: "percent",
    answerSemantic: semanticFromSigned(signed, true),
    difficulty,
    object,
    traps: traps("assumes no profit no loss", "averages profit and loss", "uses x squared blindly"),
    customStem: {
      en: `Two ${object.pluralEn} are sold for ${money(sp)} each. One is sold at ${pct(profit)} profit and the other at ${pct(loss)} loss. Find the overall profit or loss percentage.`,
      hi: `दो ${object.pluralHi} प्रत्येक ${money(sp)} में बेचे गए। एक पर ${pct(profit)} लाभ और दूसरे पर ${pct(loss)} हानि हुई। कुल लाभ या हानि प्रतिशत ज्ञात कीजिए।`,
      pa: `ਦੋ ${object.pluralPa} ਹਰ ਇੱਕ ${money(sp)} ਵਿੱਚ ਵੇਚੇ ਗਏ। ਇੱਕ ਤੇ ${pct(profit)} ਲਾਭ ਅਤੇ ਦੂਜੇ ਤੇ ${pct(loss)} ਨੁਕਸਾਨ ਹੋਇਆ। ਕੁੱਲ ਲਾਭ ਜਾਂ ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("cp1", "Cost price of first item", "पहली वस्तु का खरीद मूल्य", "ਪਹਿਲੀ ਵਸਤੂ ਦਾ ਖਰੀਦ ਮੁੱਲ", `${sp} x 100 / ${100 + profit}`, cp1),
      step("cp2", "Cost price of second item", "दूसरी वस्तु का खरीद मूल्य", "ਦੂਜੀ ਵਸਤੂ ਦਾ ਖਰੀਦ ਮੁੱਲ", `${sp} x 100 / ${100 - loss}`, cp2),
      step("overall", "Overall percentage", "कुल प्रतिशत", "ਕੁੱਲ ਪ੍ਰਤੀਸ਼ਤ", `|${2 * sp} - ${fmt(cp1 + cp2)}| x 100 / ${fmt(cp1 + cp2)}`, Math.abs(signed)),
    ],
    distractorExtras: [Math.abs(profit - loss), (profit + loss) / 2, profit * loss / 100],
  });
});

const dualItemMixedBaseline = familyFactory(({ seed, difficulty, family, object }) => {
  const totalCp = pick([3000, 4000, 5000, 6000, 8000], `${seed}:total`);
  const [profit, loss] = pick([[10, 20], [20, 10], [25, 25], [10, 10], [20, 20]], `${seed}:rates`);
  const cp1 = round2(totalCp * loss / (profit + loss));
  const cp2 = totalCp - cp1;
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { totalCp, profitPercent: profit, lossPercent: loss, cp1, cp2 },
    answer: cp1,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: traps("splits equally", "uses profit:loss instead of loss:profit", "applies rates on total CP"),
    customStem: {
      en: `Total CP of two ${object.pluralEn} is ${money(totalCp)}. One is sold at ${pct(profit)} profit and the other at ${pct(loss)} loss, giving no overall profit or loss. Find the CP of the first item.`,
      hi: `दो ${object.pluralHi} का कुल खरीद मूल्य ${money(totalCp)} है। एक ${pct(profit)} लाभ पर और दूसरा ${pct(loss)} हानि पर बेचा गया, जिससे कुल न लाभ न हानि हुई। पहली वस्तु का खरीद मूल्य ज्ञात कीजिए।`,
      pa: `ਦੋ ${object.pluralPa} ਦਾ ਕੁੱਲ ਖਰੀਦ ਮੁੱਲ ${money(totalCp)} ਹੈ। ਇੱਕ ${pct(profit)} ਲਾਭ ਤੇ ਅਤੇ ਦੂਜਾ ${pct(loss)} ਨੁਕਸਾਨ ਤੇ ਵੇਚਿਆ ਗਿਆ, ਜਿਸ ਨਾਲ ਕੁੱਲ ਨਾ ਲਾਭ ਨਾ ਨੁਕਸਾਨ ਹੋਇਆ। ਪਹਿਲੀ ਵਸਤੂ ਦਾ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      {
        key: "ratio",
        en: "CP ratio for no overall gain/loss",
        hi: "न लाभ-न हानि के लिए खरीद मूल्य अनुपात",
        pa: "ਨਾ ਲਾਭ-ਨਾ ਨੁਕਸਾਨ ਲਈ ਖਰੀਦ ਮੁੱਲ ਅਨੁਪਾਤ",
        expression: `${loss / gcd(loss, profit)} : ${profit / gcd(loss, profit)}`,
      },
      step("cp1", "Cost price of first item", "पहली वस्तु का खरीद मूल्य", "ਪਹਿਲੀ ਵਸਤੂ ਦਾ ਖਰੀਦ ਮੁੱਲ", `${totalCp} x ${loss} / (${loss} + ${profit})`, cp1),
    ],
    distractorExtras: [totalCp / 2, totalCp * profit / (profit + loss), cp2],
  });
});

const partialInventoryAllocation = familyFactory(({ seed, difficulty, family, object }) => {
  const fraction = pick([{ n: 1, d: 3 }, { n: 1, d: 4 }, { n: 2, d: 5 }, { n: 3, d: 5 }], `${seed}:fraction`);
  const firstRate = pick([10, 15, 20, 25], `${seed}:first`);
  const target = pick([12, 14, 16, 18, 20], `${seed}:target`);
  const remainingRate = round2((target - (fraction.n / fraction.d) * firstRate) / (1 - fraction.n / fraction.d));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { soldNumerator: fraction.n, soldDenominator: fraction.d, firstRate, targetRate: target },
    answer: Math.abs(remainingRate),
    answerKind: "percent",
    answerSemantic: remainingRate >= 0 ? "profit_percent" : "loss_percent",
    difficulty,
    object,
    traps: traps("takes simple average", "ignores fraction sold", "uses wrong remaining denominator"),
    customStem: {
      en: `A trader sells ${fraction.n}/${fraction.d} of a stock of ${object.pluralEn} at ${pct(firstRate)} profit. At what rate should the rest be sold to gain ${pct(target)} overall?`,
      hi: `एक व्यापारी ${object.pluralHi} के स्टॉक का ${fraction.n}/${fraction.d} भाग ${pct(firstRate)} लाभ पर बेचता है। कुल ${pct(target)} लाभ पाने के लिए शेष किस दर पर बेचना चाहिए?`,
      pa: `ਇੱਕ ਵਪਾਰੀ ${object.pluralPa} ਦੇ ਸਟਾਕ ਦਾ ${fraction.n}/${fraction.d} ਹਿੱਸਾ ${pct(firstRate)} ਲਾਭ ਤੇ ਵੇਚਦਾ ਹੈ। ਕੁੱਲ ${pct(target)} ਲਾਭ ਲਈ ਬਾਕੀ ਕਿਸ ਦਰ ਤੇ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?`,
    },
    customSteps: [
      step("equation", "Weighted overall rate equation", "भारित कुल दर समीकरण", "ਭਾਰਿਤ ਕੁੱਲ ਦਰ ਸਮੀਕਰਨ", `${fraction.n}/${fraction.d} x ${firstRate} + ${fraction.d - fraction.n}/${fraction.d} x x = ${target}`, remainingRate),
    ],
    distractorExtras: [(target + firstRate) / 2, target - firstRate, target + firstRate],
  });
});

const sequentialSupplyChain = familyFactory(({ seed, difficulty, family, object }) => {
  const base = pick([500, 800, 1000, 1200, 2000], `${seed}:base`);
  const rates = pick([[20, 10, 15], [10, 20, 25], [15, 10, 20], [25, 20, 10]], `${seed}:rates`);
  const [r1, r2, r3] = rates;
  const final = round2(base * (100 + r1) * (100 + r2) * (100 + r3) / 1000000);
  const roles = pick(BUSINESS_ROLES, `${seed}:roles`);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cp: base, rate1: r1, rate2: r2, rate3: r3 },
    answer: final,
    answerKind: "amount",
    answerSemantic: "selling_price",
    difficulty,
    object,
    traps: traps("adds all rates", "applies each rate on initial CP", "ignores one tier"),
    customStem: {
      en: `A ${roles[0]} sells a ${object.en} for ${money(base)} cost base through a chain: ${roles[0]} to ${roles[1]} at ${pct(r1)} profit, then ${roles[1]} to ${roles[2]} at ${pct(r2)} profit, and ${roles[2]} to ${roles[3]} at ${pct(r3)} profit. Find the final price.`,
      hi: `एक ${object.hi} की आधार खरीद कीमत ${money(base)} है। श्रृंखला में पहले ${pct(r1)} लाभ, फिर ${pct(r2)} लाभ और फिर ${pct(r3)} लाभ लगाया गया। अंतिम मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦੀ ਆਧਾਰ ਖਰੀਦ ਕੀਮਤ ${money(base)} ਹੈ। ਲੜੀ ਵਿੱਚ ਪਹਿਲਾਂ ${pct(r1)} ਲਾਭ, ਫਿਰ ${pct(r2)} ਲਾਭ ਅਤੇ ਫਿਰ ${pct(r3)} ਲਾਭ ਲਾਇਆ ਗਿਆ। ਅੰਤਿਮ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("final", "Customer payment after chain", "श्रृंखला के बाद ग्राहक भुगतान", "ਲੜੀ ਤੋਂ ਬਾਅਦ ਗਾਹਕ ਭੁਗਤਾਨ", `${base} x ${100 + r1} x ${100 + r2} x ${100 + r3} / 1000000`, final),
    ],
    distractorExtras: [base * (100 + r1 + r2 + r3) / 100, base * (100 + r1) / 100],
  });
});

const supplyChainMixed = familyFactory(({ seed, difficulty, family, object }) => {
  const rates = pick([[20, -10, 25], [25, -20, 10], [-10, 30, 20], [40, -25, 20]], `${seed}:rates`);
  const finalIndex = round2(rates.reduce((value, rate) => value * (100 + rate) / 100, 100));
  const signed = finalIndex - 100;
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { rate1: rates[0], rate2: rates[1], rate3: rates[2] },
    answer: answerValueSigned(signed),
    answerKind: "percent",
    answerSemantic: semanticFromSigned(signed),
    difficulty,
    object,
    traps: traps("adds signed rates", "ignores loss tier", "uses simple average"),
    customStem: {
      en: `In a wholesale-retail chain for a ${object.en}, the successive changes are ${rates.map(pct).join(", ")} where negative means loss. Find the net profit or loss percentage.`,
      hi: `एक ${object.hi} की व्यापार श्रृंखला में क्रमिक परिवर्तन ${rates.map(pct).join(", ")} हैं, जहाँ ऋणात्मक का अर्थ हानि है। शुद्ध लाभ या हानि प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦੀ ਵਪਾਰ ਲੜੀ ਵਿੱਚ ਲਗਾਤਾਰ ਬਦਲਾਅ ${rates.map(pct).join(", ")} ਹਨ, ਜਿੱਥੇ ਰਿਣਾਤਮਕ ਦਾ ਅਰਥ ਨੁਕਸਾਨ ਹੈ। ਸ਼ੁੱਧ ਲਾਭ ਜਾਂ ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("index", "Chain price index", "श्रृंखला मूल्य सूचकांक", "ਲੜੀ ਮੁੱਲ ਸੂਚਕਾਂਕ", rates.map((rate) => `(100 ${rate >= 0 ? "+" : "-"} ${Math.abs(rate)})`).join(" x ") + " / 10000", finalIndex),
      step("net", "Net change", "शुद्ध परिवर्तन", "ਸ਼ੁੱਧ ਬਦਲਾਅ", `${fmt(finalIndex)} - 100`, signed),
    ],
    distractorExtras: [Math.abs(rates.reduce((s, r) => s + r, 0)), Math.abs(rates[0] + rates[1])],
  });
});

const compoundErrorBaseline = familyFactory(({ seed, difficulty, family, object }) => {
  const reduction = pick([10, 20, 25], `${seed}:reduction`);
  const profit = pick([20, 25, 30], `${seed}:profit`);
  const usualCp = pick([1000, 1500, 2000, 3000, 4000], `${seed}:usual`);
  const newCp = usualCp * (100 - reduction) / 100;
  const newSp = newCp * (100 + profit) / 100;
  const usualSp = usualCp * (100 + profit) / 100;
  const difference = round2(usualSp - newSp);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { reduction, profit, difference },
    answer: usualCp,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: traps("applies profit on reduced CP only", "subtracts amount from CP", "uses wrong baseline"),
    customStem: {
      en: `A trader bought a ${object.en} at ${pct(reduction)} less than the usual CP and sold it at ${pct(profit)} profit. The selling price was ${money(difference)} less than it would be on the usual CP. Find the usual CP.`,
      hi: `एक व्यापारी ने ${object.hi} को सामान्य खरीद मूल्य से ${pct(reduction)} कम में खरीदा और ${pct(profit)} लाभ पर बेचा। विक्रय मूल्य सामान्य खरीद मूल्य पर होने वाले विक्रय मूल्य से ${money(difference)} कम था। सामान्य खरीद मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਵਪਾਰੀ ਨੇ ${object.pa} ਨੂੰ ਆਮ ਖਰੀਦ ਮੁੱਲ ਤੋਂ ${pct(reduction)} ਘੱਟ ਵਿੱਚ ਖਰੀਦਿਆ ਅਤੇ ${pct(profit)} ਲਾਭ ਤੇ ਵੇਚਿਆ। ਵਿਕਰੀ ਮੁੱਲ ਆਮ ਖਰੀਦ ਮੁੱਲ ਵਾਲੇ ਵਿਕਰੀ ਮੁੱਲ ਤੋਂ ${money(difference)} ਘੱਟ ਸੀ। ਆਮ ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("differenceRate", "SP difference rate on usual CP", "सामान्य खरीद मूल्य पर विक्रय-मूल्य अंतर दर", "ਆਮ ਖਰੀਦ ਮੁੱਲ ਤੇ ਵਿਕਰੀ-ਮੁੱਲ ਅੰਤਰ ਦਰ", `${reduction} x ${100 + profit} / 100`, reduction * (100 + profit) / 100),
      step("usualCp", "Usual cost price", "सामान्य खरीद मूल्य", "ਆਮ ਖਰੀਦ ਮੁੱਲ", `${fmt(difference)} x 100 / ${fmt(reduction * (100 + profit) / 100)}`, usualCp),
    ],
    distractorExtras: [newCp, difference * 100 / reduction],
  });
});

const dishonestWeightFraud = familyFactory(({ seed, difficulty, family, object }) => {
  const { falseWeight, markup } = pick([
    { falseWeight: 800, markup: 0 },
    { falseWeight: 800, markup: 20 },
    { falseWeight: 900, markup: 20 },
  ], `${seed}:weight`);
  const profit = round2((100 + markup) * 1000 / falseWeight - 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { trueWeight: 1000, falseWeight, markup },
    answer: profit,
    answerKind: "percent",
    answerSemantic: "profit_percent",
    difficulty,
    object,
    traps: traps("divides by true weight", "ignores markup", "uses weight difference as direct percent"),
    customStem: {
      en: `A shopkeeper sells ${object.en} using ${falseWeight} g instead of 1 kg${markup ? ` and marks price ${pct(markup)} above cost` : " while claiming cost price"}. Find the profit percentage.`,
      hi: `एक दुकानदार ${object.hi} बेचते समय 1 kg के स्थान पर ${falseWeight} g देता है${markup ? ` और कीमत खरीद मूल्य से ${pct(markup)} अधिक रखता है` : " और खरीद मूल्य पर बेचने का दावा करता है"}। लाभ प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਦੁਕਾਨਦਾਰ ${object.pa} ਵੇਚਦੇ ਸਮੇਂ 1 kg ਦੀ ਥਾਂ ${falseWeight} g ਦਿੰਦਾ ਹੈ${markup ? ` ਅਤੇ ਕੀਮਤ ਖਰੀਦ ਮੁੱਲ ਤੋਂ ${pct(markup)} ਵੱਧ ਰੱਖਦਾ ਹੈ` : " ਅਤੇ ਖਰੀਦ ਮੁੱਲ ਤੇ ਵੇਚਣ ਦਾ ਦਾਅਵਾ ਕਰਦਾ ਹੈ"}। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("factor", "Effective sale factor", "प्रभावी विक्रय गुणक", "ਪ੍ਰਭਾਵੀ ਵਿਕਰੀ ਗੁਣਕ", `(${100 + markup}) x 1000 / ${falseWeight}`, profit + 100),
      step("profit", "Profit percentage", "लाभ प्रतिशत", "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ", `${fmt(profit + 100)} - 100`, profit),
    ],
    distractorExtras: [(1000 - falseWeight) * 100 / 1000, (1000 - falseWeight) * 100 / falseWeight],
  });
});

const dishonestDualFraud = familyFactory(({ seed, difficulty, family, object }) => {
  const buyExtra = pick([5, 10, 20], `${seed}:buy`);
  const sellLess = pick([5, 10, 20], `${seed}:sell`);
  const factor = (100 + buyExtra) / 100 * (100 / (100 - sellLess));
  const profit = round2((factor - 1) * 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { buyExtra, sellLess },
    answer: profit,
    answerKind: "percent",
    answerSemantic: "profit_percent",
    difficulty,
    object,
    traps: traps("adds fraud percentages", "inverts both factors", "ignores buying advantage"),
    customStem: {
      en: `A dealer takes ${pct(buyExtra)} extra ${object.en} while buying and gives ${pct(sellLess)} less while selling. Find the profit percentage.`,
      hi: `एक व्यापारी खरीदते समय ${pct(buyExtra)} अतिरिक्त ${object.hi} लेता है और बेचते समय ${pct(sellLess)} कम देता है। लाभ प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਵਪਾਰੀ ਖਰੀਦਦੇ ਸਮੇਂ ${pct(buyExtra)} ਵਾਧੂ ${object.pa} ਲੈਂਦਾ ਹੈ ਅਤੇ ਵੇਚਦੇ ਸਮੇਂ ${pct(sellLess)} ਘੱਟ ਦਿੰਦਾ ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("factor", "Overall fraud factor", "कुल धोखाधड़ी गुणक", "ਕੁੱਲ ਧੋਖਾਧੜੀ ਗੁਣਕ", `(${100 + buyExtra}/100) x (100/${100 - sellLess}) x 100`, profit + 100),
      step("profit", "Profit percentage", "लाभ प्रतिशत", "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ", `${fmt(profit + 100)} - 100`, profit),
    ],
    distractorExtras: [buyExtra + sellLess, buyExtra + sellLess + buyExtra * sellLess / 100],
  });
});

const dishonestHybrid = familyFactory(({ seed, difficulty, family, object }) => {
  const markup = pick([20, 25, 30], `${seed}:markup`);
  const discount = pick([5, 10, 20], `${seed}:discount`);
  const falseWeight = pick([800, 900], `${seed}:weight`);
  const factor = (100 + markup) * (100 - discount) / 10000 * 1000 / falseWeight;
  const profit = round2((factor - 1) * 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { markup, discount, trueWeight: 1000, falseWeight },
    answer: profit,
    answerKind: "percent",
    answerSemantic: "profit_percent",
    difficulty,
    object,
    traps: traps("ignores false weight", "only computes markup-discount", "divides by true weight"),
    customStem: {
      en: `A shopkeeper marks ${object.en} ${pct(markup)} above CP, gives ${pct(discount)} discount, and gives ${falseWeight} g instead of 1 kg. Find the profit percentage.`,
      hi: `एक दुकानदार ${object.hi} को खरीद मूल्य से ${pct(markup)} अधिक अंकित करता है, ${pct(discount)} छूट देता है और 1 kg के स्थान पर ${falseWeight} g देता है। लाभ प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਦੁਕਾਨਦਾਰ ${object.pa} ਨੂੰ ਖਰੀਦ ਮੁੱਲ ਤੋਂ ${pct(markup)} ਵੱਧ ਅੰਕਿਤ ਕਰਦਾ ਹੈ, ${pct(discount)} ਛੂਟ ਦਿੰਦਾ ਹੈ ਅਤੇ 1 kg ਦੀ ਥਾਂ ${falseWeight} g ਦਿੰਦਾ ਹੈ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("factor", "Price and weight factor", "मूल्य और वजन गुणक", "ਕੀਮਤ ਅਤੇ ਵਜ਼ਨ ਗੁਣਕ", `(${100 + markup} x ${100 - discount} / 10000) x 1000 / ${falseWeight} x 100`, profit + 100),
      step("profit", "Profit percentage", "लाभ प्रतिशत", "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ", `${fmt(profit + 100)} - 100`, profit),
    ],
    distractorExtras: [markup - discount - markup * discount / 100, markup + (1000 - falseWeight) * 100 / falseWeight],
  });
});

const buyGetFree = familyFactory(({ seed, difficulty, family, object }) => {
  const offer = pick([{ paid: 4, free: 1 }, { paid: 3, free: 1 }, { paid: 2, free: 1 }], `${seed}:offer`);
  const discount = round2(offer.free * 100 / (offer.paid + offer.free));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { paidQty: offer.paid, freeQty: offer.free },
    answer: discount,
    answerKind: "percent",
    answerSemantic: "effective_discount_percent",
    difficulty,
    object,
    traps: traps("uses free quantity over paid quantity", "ignores free item cost", "treats offer as simple discount"),
    customStem: {
      en: `In a promotion on ${object.pluralEn}, the offer is buy ${offer.paid} get ${offer.free} free. Find the effective discount percentage.`,
      hi: `${object.pluralHi} पर प्रस्ताव है: ${offer.paid} खरीदें, ${offer.free} मुफ्त पाएं। प्रभावी छूट प्रतिशत ज्ञात कीजिए।`,
      pa: `${object.pluralPa} ਤੇ ਪੇਸ਼ਕਸ਼ ਹੈ: ${offer.paid} ਖਰੀਦੋ, ${offer.free} ਮੁਫ਼ਤ ਪਾਓ। ਪ੍ਰਭਾਵੀ ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("discount", "Effective discount", "प्रभावी छूट", "ਪ੍ਰਭਾਵੀ ਛੂਟ", `${offer.free} x 100 / (${offer.paid} + ${offer.free})`, discount),
    ],
    distractorExtras: [offer.free * 100 / offer.paid, offer.free * 10],
  });
});

const hybridPromotion = familyFactory(({ seed, difficulty, family, object }) => {
  const { paid, free, cashDiscount } = pick([
    { paid: 3, free: 1, cashDiscount: 20 },
    { paid: 4, free: 1, cashDiscount: 25 },
    { paid: 2, free: 1, cashDiscount: 10 },
  ], `${seed}:offer`);
  const offer = { paid, free };
  const finalFactor = offer.paid / (offer.paid + offer.free) * (100 - cashDiscount) / 100;
  const effective = round2((1 - finalFactor) * 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { paidQty: offer.paid, freeQty: offer.free, discount: cashDiscount },
    answer: effective,
    answerKind: "percent",
    answerSemantic: "effective_discount_percent",
    difficulty,
    object,
    traps: traps("adds promotion and cash discount", "uses free over paid", "ignores successive nature"),
    customStem: {
      en: `An offer on ${object.pluralEn} is buy ${offer.paid} get ${offer.free} free, plus ${pct(cashDiscount)} extra discount. Find the effective discount percentage.`,
      hi: `${object.pluralHi} पर प्रस्ताव है: ${offer.paid} खरीदें, ${offer.free} मुफ्त पाएं, साथ में ${pct(cashDiscount)} अतिरिक्त छूट। प्रभावी छूट प्रतिशत ज्ञात कीजिए।`,
      pa: `${object.pluralPa} ਤੇ ਪੇਸ਼ਕਸ਼ ਹੈ: ${offer.paid} ਖਰੀਦੋ, ${offer.free} ਮੁਫ਼ਤ ਪਾਓ, ਨਾਲ ${pct(cashDiscount)} ਵਾਧੂ ਛੂਟ। ਪ੍ਰਭਾਵੀ ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("factor", "Final payable factor", "अंतिम देय गुणक", "ਅੰਤਿਮ ਦੇਣਯੋਗ ਗੁਣਕ", `${offer.paid}/(${offer.paid}+${offer.free}) x ${100 - cashDiscount}/100 x 100`, finalFactor * 100),
      step("effective", "Effective discount", "प्रभावी छूट", "ਪ੍ਰਭਾਵੀ ਛੂਟ", `100 - ${fmt(finalFactor * 100)}`, effective),
    ],
    distractorExtras: [offer.free * 100 / (offer.paid + offer.free) + cashDiscount, offer.free * 100 / offer.paid],
  });
});

const cashbackCoupon = familyFactory(({ seed, difficulty, family, object }) => {
  const mp = pick([1000, 2000, 3000, 4000, 5000], `${seed}:mp`);
  const discount = pick([10, 15, 20, 25], `${seed}:discount`);
  const cashback = pick([100, 200, 300, 400], `${seed}:cashback`);
  const afterDiscount = mp * (100 - discount) / 100;
  const finalPaid = afterDiscount - cashback;
  const effective = round2((mp - finalPaid) * 100 / mp);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { mp, discount, cashback },
    answer: effective,
    answerKind: "percent",
    answerSemantic: "effective_discount_percent",
    difficulty,
    object,
    traps: traps("treats cashback as percent", "ignores discount", "uses discounted price as base"),
    customStem: {
      en: `A ${object.en} has marked price ${money(mp)}, discount ${pct(discount)}, and cashback ${money(cashback)}. Find the effective discount percentage.`,
      hi: `एक ${object.hi} का अंकित मूल्य ${money(mp)} है, छूट ${pct(discount)} है और कैशबैक ${money(cashback)} है। प्रभावी छूट प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ${money(mp)} ਹੈ, ਛੂਟ ${pct(discount)} ਹੈ ਅਤੇ ਕੈਸ਼ਬੈਕ ${money(cashback)} ਹੈ। ਪ੍ਰਭਾਵੀ ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("afterDiscount", "Price after discount", "छूट के बाद मूल्य", "ਛੂਟ ਤੋਂ ਬਾਅਦ ਮੁੱਲ", `${mp} x ${100 - discount} / 100`, afterDiscount),
      step("effective", "Effective discount percentage", "प्रभावी छूट प्रतिशत", "ਪ੍ਰਭਾਵੀ ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ", `(${mp} - (${fmt(afterDiscount)} - ${cashback})) x 100 / ${mp}`, effective),
    ],
    distractorExtras: [discount + cashback * 100 / afterDiscount, discount],
  });
});

const gstAfterDiscount = familyFactory(({ seed, difficulty, family, object }) => {
  const mp = pick([1000, 1500, 2000, 2500, 5000], `${seed}:mp`);
  const discount = pick([10, 20, 25, 30], `${seed}:discount`);
  const tax = pick([5, 12, 18], `${seed}:tax`);
  const discounted = mp * (100 - discount) / 100;
  const finalBill = round2(discounted * (100 + tax) / 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { mp, discount, tax },
    answer: finalBill,
    answerKind: "amount",
    answerSemantic: "final_bill",
    difficulty,
    object,
    traps: traps("calculates tax before discount", "adds percentages directly", "charges GST on MP"),
    customStem: {
      en: `A ${object.en} has marked price ${money(mp)}. After ${pct(discount)} discount, ${pct(tax)} GST is charged on the discounted price. Find the final bill.`,
      hi: `एक ${object.hi} का अंकित मूल्य ${money(mp)} है। ${pct(discount)} छूट के बाद छूट वाले मूल्य पर ${pct(tax)} GST लगता है। अंतिम बिल ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ${money(mp)} ਹੈ। ${pct(discount)} ਛੂਟ ਤੋਂ ਬਾਅਦ ਛੂਟ ਵਾਲੇ ਮੁੱਲ ਤੇ ${pct(tax)} GST ਲੱਗਦਾ ਹੈ। ਅੰਤਿਮ ਬਿੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("discounted", "Discounted price", "छूट वाला मूल्य", "ਛੂਟ ਵਾਲਾ ਮੁੱਲ", `${mp} x ${100 - discount} / 100`, discounted),
      step("bill", "Final bill", "अंतिम बिल", "ਅੰਤਿਮ ਬਿੱਲ", `${fmt(discounted)} x ${100 + tax} / 100`, finalBill),
    ],
    distractorExtras: [mp * (100 + tax - discount) / 100, mp * (100 + tax) * (100 - discount) / 10000],
  });
});

const taxInclusiveBackCalc = familyFactory(({ seed, difficulty, family, object }) => {
  const tax = pick([5, 12, 18], `${seed}:tax`);
  const base = pick([500, 1000, 1500, 2000, 2500, 4000], `${seed}:base`);
  const inclusive = round2(base * (100 + tax) / 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { inclusivePrice: inclusive, tax },
    answer: base,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: traps("subtracts tax percent directly", "takes tax on inclusive price", "uses wrong base"),
    customStem: {
      en: `The listed price of a ${object.en} is ${money(inclusive)} including ${pct(tax)} GST. Find the base price before GST.`,
      hi: `एक ${object.hi} का सूची मूल्य ${money(inclusive)} है जिसमें ${pct(tax)} GST शामिल है। GST से पहले आधार मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਸੂਚੀ ਮੁੱਲ ${money(inclusive)} ਹੈ ਜਿਸ ਵਿੱਚ ${pct(tax)} GST ਸ਼ਾਮਲ ਹੈ। GST ਤੋਂ ਪਹਿਲਾਂ ਆਧਾਰ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("base", "Base price before GST", "GST से पहले आधार मूल्य", "GST ਤੋਂ ਪਹਿਲਾਂ ਆਧਾਰ ਮੁੱਲ", `${fmt(inclusive)} x 100 / ${100 + tax}`, base),
    ],
    distractorExtras: [inclusive * (100 - tax) / 100, inclusive * tax / 100],
  });
});

const profitAfterCommissionTax = familyFactory(({ seed, difficulty, family, object }) => {
  const cp = pick([800, 1000, 1200, 1500, 2000], `${seed}:cp`);
  const sp = cp * pick([125, 150, 160, 180], `${seed}:spIndex`) / 100;
  const commission = pick([5, 10, 12.5, 15], `${seed}:commission`);
  const netReceipt = sp * (100 - commission) / 100;
  const profit = round2((netReceipt - cp) * 100 / cp);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cp, sp, commission },
    answer: answerValueSigned(profit),
    answerKind: "percent",
    answerSemantic: semanticFromSigned(profit),
    difficulty,
    object,
    traps: traps("commission on CP", "ignores commission", "uses gross SP"),
    customStem: {
      en: `A ${object.en} costing ${money(cp)} is sold for ${money(sp)}. A selling commission of ${pct(commission)} of SP is paid. Find the net profit or loss percentage.`,
      hi: `एक ${object.hi} का खरीद मूल्य ${money(cp)} है और उसे ${money(sp)} में बेचा गया। विक्रय मूल्य का ${pct(commission)} कमीशन दिया गया। शुद्ध लाभ या हानि प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਖਰੀਦ ਮੁੱਲ ${money(cp)} ਹੈ ਅਤੇ ਇਸਨੂੰ ${money(sp)} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ। ਵਿਕਰੀ ਮੁੱਲ ਦਾ ${pct(commission)} ਕਮਿਸ਼ਨ ਦਿੱਤਾ ਗਿਆ। ਸ਼ੁੱਧ ਲਾਭ ਜਾਂ ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("netReceipt", "Net receipt after commission", "कमीशन के बाद शुद्ध प्राप्ति", "ਕਮਿਸ਼ਨ ਤੋਂ ਬਾਅਦ ਸ਼ੁੱਧ ਪ੍ਰਾਪਤੀ", `${fmt(sp)} x ${100 - commission} / 100`, netReceipt),
      step("profit", "Net percentage", "शुद्ध प्रतिशत", "ਸ਼ੁੱਧ ਪ੍ਰਤੀਸ਼ਤ", `(${fmt(netReceipt)} - ${cp}) x 100 / ${cp}`, profit),
    ],
    distractorExtras: [(sp - cp) * 100 / cp, (sp * commission / 100) * 100 / cp],
  });
});

const repairOverheadCost = familyFactory(({ seed, difficulty, family, object }) => {
  const purchase = pick([5000, 8000, 10000, 12000, 15000], `${seed}:purchase`);
  const overhead = pick([500, 1000, 1500, 2000], `${seed}:overhead`);
  const profitRate = pick([10, 15, 20, 25], `${seed}:profit`);
  const effectiveCp = purchase + overhead;
  const sp = round2(effectiveCp * (100 + profitRate) / 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { purchase, overhead, sp },
    answer: profitRate,
    answerKind: "percent",
    answerSemantic: "profit_percent",
    difficulty,
    object,
    traps: traps("ignores repair/overhead", "uses purchase price only", "subtracts overhead from SP"),
    customStem: {
      en: `A ${object.en} is bought for ${money(purchase)}, repaired for ${money(overhead)}, and sold for ${money(sp)}. Find the profit percentage.`,
      hi: `एक ${object.hi} ${money(purchase)} में खरीदा गया, उस पर ${money(overhead)} अतिरिक्त खर्च हुआ और उसे ${money(sp)} में बेचा गया। लाभ प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ${money(purchase)} ਵਿੱਚ ਖਰੀਦਿਆ ਗਿਆ, ਇਸ ਤੇ ${money(overhead)} ਵਾਧੂ ਖਰਚ ਹੋਇਆ ਅਤੇ ਇਸਨੂੰ ${money(sp)} ਵਿੱਚ ਵੇਚਿਆ ਗਿਆ। ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("effectiveCp", "Effective cost price", "प्रभावी खरीद मूल्य", "ਪ੍ਰਭਾਵੀ ਖਰੀਦ ਮੁੱਲ", `${purchase} + ${overhead}`, effectiveCp),
      step("profit", "Profit percentage", "लाभ प्रतिशत", "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ", `(${fmt(sp)} - ${effectiveCp}) x 100 / ${effectiveCp}`, profitRate),
    ],
    distractorExtras: [(sp - purchase) * 100 / purchase, overhead * 100 / purchase],
  });
});

const requiredSpAfterOverhead = familyFactory(({ seed, difficulty, family, object }) => {
  const purchase = pick([5000, 8000, 10000, 12000, 15000], `${seed}:purchase`);
  const overhead = pick([500, 1000, 1500, 2000], `${seed}:overhead`);
  const target = pick([10, 15, 20, 25, 30], `${seed}:target`);
  const effectiveCp = purchase + overhead;
  const sp = round2(effectiveCp * (100 + target) / 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { purchase, overhead, targetProfit: target },
    answer: sp,
    answerKind: "amount",
    answerSemantic: "selling_price",
    difficulty,
    object,
    traps: traps("ignores overhead", "uses purchase price only", "adds target to overhead only"),
    customStem: {
      en: `A ${object.en} is bought for ${money(purchase)} and needs ${money(overhead)} overhead cost. At what price should it be sold for ${pct(target)} profit?`,
      hi: `एक ${object.hi} ${money(purchase)} में खरीदा गया और उस पर ${money(overhead)} अतिरिक्त खर्च हुआ। ${pct(target)} लाभ के लिए उसे किस मूल्य पर बेचना चाहिए?`,
      pa: `ਇੱਕ ${object.pa} ${money(purchase)} ਵਿੱਚ ਖਰੀਦਿਆ ਗਿਆ ਅਤੇ ਇਸ ਤੇ ${money(overhead)} ਵਾਧੂ ਖਰਚ ਹੋਇਆ। ${pct(target)} ਲਾਭ ਲਈ ਇਸਨੂੰ ਕਿਸ ਮੁੱਲ ਤੇ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?`,
    },
    customSteps: [
      step("effectiveCp", "Effective cost price", "प्रभावी खरीद मूल्य", "ਪ੍ਰਭਾਵੀ ਖਰੀਦ ਮੁੱਲ", `${purchase} + ${overhead}`, effectiveCp),
      step("sp", "Required selling price", "आवश्यक विक्रय मूल्य", "ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ", `${effectiveCp} x ${100 + target} / 100`, sp),
    ],
    distractorExtras: [purchase * (100 + target) / 100, effectiveCp + target],
  });
});

const manufacturingBreakdown = familyFactory(({ seed, difficulty, family, object }) => {
  const oldCost = pick([1000, 2000, 3000, 5000], `${seed}:cost`);
  const ratio = pick([[3, 2], [2, 3], [4, 1], [5, 3]], `${seed}:ratio`);
  const materialRise = pick([10, 20, 25], `${seed}:material`);
  const labourRise = pick([5, 10, 15, 20], `${seed}:labour`);
  const newIndex = round2((ratio[0] * (100 + materialRise) + ratio[1] * (100 + labourRise)) / (ratio[0] + ratio[1]));
  const newCost = round2(oldCost * (ratio[0] * (100 + materialRise) + ratio[1] * (100 + labourRise)) / ((ratio[0] + ratio[1]) * 100));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { oldCost, materialRatio: ratio[0], labourRatio: ratio[1], materialRise, labourRise },
    answer: newCost,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: traps("simple average of rises", "ignores ratio", "uses old cost directly"),
    customStem: {
      en: `Manufacturing cost of a ${object.en} is ${money(oldCost)}, split between material and labour in ratio ${ratio[0]}:${ratio[1]}. Material rises ${pct(materialRise)} and labour rises ${pct(labourRise)}. Find the new cost.`,
      hi: `एक ${object.hi} की निर्माण लागत ${money(oldCost)} है, जिसमें सामग्री और श्रम का अनुपात ${ratio[0]}:${ratio[1]} है। सामग्री ${pct(materialRise)} और श्रम ${pct(labourRise)} बढ़ते हैं। नई लागत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦੀ ਬਣਾਉਣ ਲਾਗਤ ${money(oldCost)} ਹੈ, ਜਿਸ ਵਿੱਚ ਸਮੱਗਰੀ ਅਤੇ ਮਜ਼ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ ${ratio[0]}:${ratio[1]} ਹੈ। ਸਮੱਗਰੀ ${pct(materialRise)} ਅਤੇ ਮਜ਼ਦੂਰੀ ${pct(labourRise)} ਵਧਦੀ ਹੈ। ਨਵੀਂ ਲਾਗਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("index", "Weighted new cost index", "भारित नई लागत सूचकांक", "ਭਾਰਿਤ ਨਵੀਂ ਲਾਗਤ ਸੂਚਕਾਂਕ", `(${ratio[0]} x ${100 + materialRise} + ${ratio[1]} x ${100 + labourRise}) / ${ratio[0] + ratio[1]}`, newIndex),
      step("cost", "New cost", "नई लागत", "ਨਵੀਂ ਲਾਗਤ", `${oldCost} x ${fmt(newIndex)} / 100`, newCost),
    ],
    distractorExtras: [oldCost * (100 + (materialRise + labourRise) / 2) / 100, oldCost * (100 + materialRise + labourRise) / 100],
  });
});

const requiredSpAfterLoss = familyFactory(({ seed, difficulty, family, object }) => {
  const lossRate = pick([10, 20, 25], `${seed}:loss`);
  const profitRate = pick([10, 15, 20, 25], `${seed}:profit`);
  const cp = pick([500, 800, 1000, 1200, 1600, 2000], `${seed}:cp`);
  const lossSp = round2(cp * (100 - lossRate) / 100);
  const targetSp = round2(cp * (100 + profitRate) / 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { lossSp, lossRate, profitRate },
    answer: targetSp,
    answerKind: "amount",
    answerSemantic: "selling_price",
    difficulty,
    object,
    traps: traps("uses loss SP as base", "adds rates directly to loss SP", "ignores CP recovery"),
    customStem: {
      en: `A ${object.en} was sold for ${money(lossSp)} at ${pct(lossRate)} loss. At what price should it be sold for ${pct(profitRate)} profit?`,
      hi: `एक ${object.hi} ${money(lossSp)} में ${pct(lossRate)} हानि पर बेचा गया। ${pct(profitRate)} लाभ के लिए उसे किस मूल्य पर बेचना चाहिए?`,
      pa: `ਇੱਕ ${object.pa} ${money(lossSp)} ਵਿੱਚ ${pct(lossRate)} ਨੁਕਸਾਨ ਤੇ ਵੇਚਿਆ ਗਿਆ। ${pct(profitRate)} ਲਾਭ ਲਈ ਇਸਨੂੰ ਕਿਸ ਮੁੱਲ ਤੇ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ?`,
    },
    customSteps: [
      step("cp", "Cost price", "खरीद मूल्य", "ਖਰੀਦ ਮੁੱਲ", `${fmt(lossSp)} x 100 / ${100 - lossRate}`, cp),
      step("targetSp", "Target selling price", "लक्ष्य विक्रय मूल्य", "ਲਕਸ਼ ਵਿਕਰੀ ਮੁੱਲ", `${cp} x ${100 + profitRate} / 100`, targetSp),
    ],
    distractorExtras: [lossSp * (100 + profitRate) / 100, lossSp + cp * profitRate / 100],
  });
});

const spDifferenceTwoRates = familyFactory(({ seed, difficulty, family, object }) => {
  const rate1 = pick([10, 15, 20], `${seed}:r1`);
  const rate2 = pick([25, 30, 40], `${seed}:r2`);
  const cp = pick([800, 1000, 1200, 1500, 2000], `${seed}:cp`);
  const difference = round2(cp * (rate2 - rate1) / 100);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { rate1, rate2, difference },
    answer: cp,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: traps("uses sum of rates", "uses SP as base", "uses only one rate"),
    customStem: {
      en: `The difference between selling a ${object.en} at ${pct(rate2)} profit and at ${pct(rate1)} profit is ${money(difference)}. Find the cost price.`,
      hi: `एक ${object.hi} को ${pct(rate2)} लाभ और ${pct(rate1)} लाभ पर बेचने के विक्रय मूल्यों का अंतर ${money(difference)} है। खरीद मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਨੂੰ ${pct(rate2)} ਲਾਭ ਅਤੇ ${pct(rate1)} ਲਾਭ ਤੇ ਵੇਚਣ ਦੇ ਵਿਕਰੀ ਮੁੱਲਾਂ ਦਾ ਅੰਤਰ ${money(difference)} ਹੈ। ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("cp", "Cost price", "खरीद मूल्य", "ਖਰੀਦ ਮੁੱਲ", `${fmt(difference)} x 100 / (${rate2} - ${rate1})`, cp),
    ],
    distractorExtras: [difference * 100 / (rate1 + rate2), difference * 100 / rate2],
  });
});

const equalProfitLossAmount = familyFactory(({ seed, difficulty, family, object }) => {
  const cp1 = pick([800, 1000, 1200, 1500], `${seed}:cp1`);
  const cp2 = pick([600, 900, 1100, 1400], `${seed}:cp2`);
  const amount = pick([100, 150, 200, 250], `${seed}:amount`);
  const signed = round2((amount - amount) * 100 / (cp1 + cp2));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cp1, cp2, profitAmount: amount, lossAmount: amount },
    answer: 0,
    answerKind: "percent",
    answerSemantic: "no_profit_no_loss",
    difficulty,
    object,
    traps: traps("compares rates instead of amounts", "uses one CP only", "calls equal amounts a percentage loss"),
    customStem: {
      en: `A trader gains ${money(amount)} on one ${object.en} costing ${money(cp1)} and loses ${money(amount)} on another costing ${money(cp2)}. Find the overall result.`,
      hi: `एक व्यापारी ${money(cp1)} की एक ${object.hi} पर ${money(amount)} लाभ और ${money(cp2)} की दूसरी वस्तु पर ${money(amount)} हानि करता है। कुल परिणाम ज्ञात कीजिए।`,
      pa: `ਇੱਕ ਵਪਾਰੀ ${money(cp1)} ਦੀ ਇੱਕ ${object.pa} ਤੇ ${money(amount)} ਲਾਭ ਅਤੇ ${money(cp2)} ਦੀ ਦੂਜੀ ਵਸਤੂ ਤੇ ${money(amount)} ਨੁਕਸਾਨ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਨਤੀਜਾ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("net", "Net rupee result", "शुद्ध रुपये का परिणाम", "ਸ਼ੁੱਧ ਰੁਪਏ ਦਾ ਨਤੀਜਾ", `${amount} - ${amount}`, signed),
    ],
    distractorExtras: [amount * 100 / cp1, amount * 100 / cp2, 5],
  });
});

const sameProfitAmountDifferentRates = familyFactory(({ seed, difficulty, family, object }) => {
  const r1 = pick([10, 15, 20], `${seed}:r1`);
  const r2 = pick([25, 30, 40], `${seed}:r2`);
  const divisor = gcd(r2, r1);
  const cp1 = r2 / divisor;
  const cp2 = r1 / divisor;
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { rate1: r1, rate2: r2, cp1, cp2 },
    answer: cp1,
    answerKind: "amount",
    answerSemantic: "ratio",
    difficulty,
    object,
    traps: traps("uses direct rate ratio", "reverses ratio", "compares selling prices"),
    customStem: {
      en: `Two ${object.pluralEn} give the same profit amount. Their profit rates are ${pct(r1)} and ${pct(r2)}. If their CP ratio is written as a:b, find a.`,
      hi: `दो ${object.pluralHi} पर समान लाभ राशि मिलती है। उनकी लाभ दरें ${pct(r1)} और ${pct(r2)} हैं। यदि खरीद मूल्य अनुपात a:b है, तो a ज्ञात कीजिए।`,
      pa: `ਦੋ ${object.pluralPa} ਤੇ ਇੱਕੋ ਲਾਭ ਰਕਮ ਮਿਲਦੀ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਲਾਭ ਦਰਾਂ ${pct(r1)} ਅਤੇ ${pct(r2)} ਹਨ। ਜੇ ਖਰੀਦ ਮੁੱਲ ਅਨੁਪਾਤ a:b ਹੈ, ਤਾਂ a ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("ratio", "CP ratio is reverse of rates", "खरीद मूल्य अनुपात दरों का उल्टा है", "ਖਰੀਦ ਮੁੱਲ ਅਨੁਪਾਤ ਦਰਾਂ ਦਾ ਉਲਟ ਹੈ", `${cp1} : ${cp2}`, cp1),
    ],
    distractorExtras: [cp2, Math.abs(cp1 - cp2), cp1 + cp2],
  });
});

const inverseCpFromMpDiscountProfit = familyFactory(({ seed, difficulty, family, object }) => {
  const cp = pick([500, 800, 1000, 1200, 1500, 2000], `${seed}:cp`);
  const profit = pick([10, 20, 25], `${seed}:profit`);
  const discount = pick([10, 20, 25], `${seed}:discount`);
  const sp = cp * (100 + profit) / 100;
  const mp = round2(sp * 100 / (100 - discount));
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { mp, discount, profit },
    answer: cp,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: traps("stops at SP", "takes profit on MP", "ignores discount"),
    customStem: {
      en: `A ${object.en} marked at ${money(mp)} is sold after ${pct(discount)} discount for ${pct(profit)} profit. Find the cost price.`,
      hi: `एक ${object.hi} का अंकित मूल्य ${money(mp)} है। ${pct(discount)} छूट के बाद ${pct(profit)} लाभ होता है। खरीद मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਅੰਕਿਤ ਮੁੱਲ ${money(mp)} ਹੈ। ${pct(discount)} ਛੂਟ ਤੋਂ ਬਾਅਦ ${pct(profit)} ਲਾਭ ਹੁੰਦਾ ਹੈ। ਖਰੀਦ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("sp", "Selling price", "विक्रय मूल्य", "ਵਿਕਰੀ ਮੁੱਲ", `${fmt(mp)} x ${100 - discount} / 100`, sp),
      step("cp", "Cost price", "खरीद मूल्य", "ਖਰੀਦ ਮੁੱਲ", `${fmt(sp)} x 100 / ${100 + profit}`, cp),
    ],
    distractorExtras: [sp, mp * 100 / (100 + profit)],
  });
});

const inverseDiscountFromCpMpProfit = familyFactory(({ seed, difficulty, family, object }) => {
  const cp = pick([500, 800, 1000, 1200, 1500], `${seed}:cp`);
  const profit = pick([10, 20, 25], `${seed}:profit`);
  const markup = pick([40, 50, 60, 80], `${seed}:markup`);
  const mp = cp * (100 + markup) / 100;
  const targetSp = cp * (100 + profit) / 100;
  const discount = round2((mp - targetSp) * 100 / mp);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cp, mp, profit },
    answer: discount,
    answerKind: "percent",
    answerSemantic: "discount_percent",
    difficulty,
    object,
    traps: traps("discount on CP", "markup minus profit", "reverse ratio"),
    customStem: {
      en: `CP of a ${object.en} is ${money(cp)} and MP is ${money(mp)}. What discount gives ${pct(profit)} profit?`,
      hi: `एक ${object.hi} का खरीद मूल्य ${money(cp)} और अंकित मूल्य ${money(mp)} है। ${pct(profit)} लाभ के लिए कितनी छूट देनी होगी?`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਖਰੀਦ ਮੁੱਲ ${money(cp)} ਅਤੇ ਅੰਕਿਤ ਮੁੱਲ ${money(mp)} ਹੈ। ${pct(profit)} ਲਾਭ ਲਈ ਕਿੰਨੀ ਛੂਟ ਦੇਣੀ ਹੋਵੇਗੀ?`,
    },
    customSteps: [
      step("targetSp", "Target selling price", "लक्ष्य विक्रय मूल्य", "ਲਕਸ਼ ਵਿਕਰੀ ਮੁੱਲ", `${cp} x ${100 + profit} / 100`, targetSp),
      step("discount", "Discount percentage", "छूट प्रतिशत", "ਛੂਟ ਪ੍ਰਤੀਸ਼ਤ", `(${fmt(mp)} - ${fmt(targetSp)}) x 100 / ${fmt(mp)}`, discount),
    ],
    distractorExtras: [markup - profit, discount + 5],
  });
});

const inverseMarkupFromCpDiscountProfit = familyFactory(({ seed, difficulty, family, object }) => {
  const cp = pick([500, 800, 1000, 1200], `${seed}:cp`);
  const discount = pick([10, 20, 25], `${seed}:discount`);
  const profit = pick([10, 20, 25], `${seed}:profit`);
  const requiredSp = cp * (100 + profit) / 100;
  const mp = requiredSp * 100 / (100 - discount);
  const markup = round2((mp - cp) * 100 / cp);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { cp, discount, profit },
    answer: markup,
    answerKind: "percent",
    answerSemantic: "markup_percent",
    difficulty,
    object,
    traps: traps("adds profit and discount", "uses discount on CP", "ignores markup base"),
    customStem: {
      en: `A ${object.en} costs ${money(cp)}. By allowing ${pct(discount)} discount, the seller wants ${pct(profit)} profit. Find the required markup percentage.`,
      hi: `एक ${object.hi} का खरीद मूल्य ${money(cp)} है। ${pct(discount)} छूट देकर विक्रेता ${pct(profit)} लाभ चाहता है। आवश्यक मार्कअप प्रतिशत ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਦਾ ਖਰੀਦ ਮੁੱਲ ${money(cp)} ਹੈ। ${pct(discount)} ਛੂਟ ਦੇ ਕੇ ਵਿਕਰੇਤਾ ${pct(profit)} ਲਾਭ ਚਾਹੁੰਦਾ ਹੈ। ਲੋੜੀਂਦਾ ਮਾਰਕਅਪ ਪ੍ਰਤੀਸ਼ਤ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("sp", "Required selling price", "आवश्यक विक्रय मूल्य", "ਲੋੜੀਂਦਾ ਵਿਕਰੀ ਮੁੱਲ", `${cp} x ${100 + profit} / 100`, requiredSp),
      step("mp", "Required marked price", "आवश्यक अंकित मूल्य", "ਲੋੜੀਂਦਾ ਅੰਕਿਤ ਮੁੱਲ", `${fmt(requiredSp)} x 100 / ${100 - discount}`, mp),
      step("markup", "Markup percentage", "मार्कअप प्रतिशत", "ਮਾਰਕਅਪ ਪ੍ਰਤੀਸ਼ਤ", `(${fmt(mp)} - ${cp}) x 100 / ${cp}`, markup),
    ],
    distractorExtras: [profit + discount, markup - 5],
  });
});

const multiConditionInverse = familyFactory(({ seed, difficulty, family, object }) => {
  const mp = pick([1000, 1500, 2000, 2500], `${seed}:mp`);
  const d1 = pick([20, 25], `${seed}:d1`);
  const d2 = pick([10, 15], `${seed}:d2`);
  const cp = pick([600, 900, 1200, 1500], `${seed}:cp`);
  const p1 = round2(mp * (100 - d1) / 100 - cp);
  const p2 = round2(mp * (100 - d2) / 100 - cp);
  return mk({
    id: `${family}:${seed}`,
    family,
    variables: { discount1: d1, profitAmount1: p1, discount2: d2, profitAmount2: p2 },
    answer: mp,
    answerKind: "amount",
    answerSemantic: "marked_price",
    difficulty,
    object,
    traps: traps("uses one condition only", "subtracts profit amounts from MP", "ignores discount difference"),
    customStem: {
      en: `After ${pct(d1)} discount on a ${object.en}, profit is ${money(p1)}. If discount were ${pct(d2)}, profit would be ${money(p2)}. Find the marked price.`,
      hi: `एक ${object.hi} पर ${pct(d1)} छूट के बाद लाभ ${money(p1)} है। यदि छूट ${pct(d2)} होती, तो लाभ ${money(p2)} होता। अंकित मूल्य ज्ञात कीजिए।`,
      pa: `ਇੱਕ ${object.pa} ਤੇ ${pct(d1)} ਛੂਟ ਤੋਂ ਬਾਅਦ ਲਾਭ ${money(p1)} ਹੈ। ਜੇ ਛੂਟ ${pct(d2)} ਹੁੰਦੀ, ਤਾਂ ਲਾਭ ${money(p2)} ਹੁੰਦਾ। ਅੰਕਿਤ ਮੁੱਲ ਪਤਾ ਕਰੋ।`,
    },
    customSteps: [
      step("difference", "Profit difference due to discount difference", "छूट अंतर से लाभ अंतर", "ਛੂਟ ਅੰਤਰ ਨਾਲ ਲਾਭ ਅੰਤਰ", `${fmt(p2)} - ${fmt(p1)}`, p2 - p1),
      step("mp", "Marked price", "अंकित मूल्य", "ਅੰਕਿਤ ਮੁੱਲ", `${fmt(p2 - p1)} x 100 / (${d1} - ${d2})`, mp),
    ],
    distractorExtras: [cp, mp * (100 - d1) / 100],
  });
});

export const ADDITIONAL_PROFIT_LOSS_FACTORIES: Record<
  (typeof ADDITIONAL_PROFIT_LOSS_FAMILY_IDS)[number],
  ProfitLossMotifFactory
> = {
  pl_no_profit_no_loss: noProfitNoLoss,
  pl_asymmetric_item_equivalence: asymmetricItemEquivalence,
  pl_fractional_value_shift: fractionalValueShift,
  pl_loss_recovery_cp_from_difference: fractionalValueShift,
  pl_markup_discount_triangle: markupDiscountTriangle,
  pl_target_profit_discount_calibration: targetProfitDiscountCalibration,
  pl_target_profit_mp_calibration: targetProfitMpCalibration,
  pl_successive_discount_equivalent: successiveDiscountEquivalent,
  pl_dual_item_identical_sp: dualItemIdenticalSp,
  pl_dual_item_mixed_baseline: dualItemMixedBaseline,
  pl_partial_inventory_allocation: partialInventoryAllocation,
  pl_sequential_supply_chain: sequentialSupplyChain,
  pl_supply_chain_mixed_profit_loss: supplyChainMixed,
  pl_compound_error_baseline_shift: compoundErrorBaseline,
  pl_dishonest_dealer_weight_fraud: dishonestWeightFraud,
  pl_dishonest_dealer_dual_fraud: dishonestDualFraud,
  pl_dishonest_dealer_absolute_hybrid: dishonestHybrid,
  pl_buy_get_free_discount: buyGetFree,
  pl_hybrid_promotion_scaling: hybridPromotion,
  pl_cashback_coupon_discount: cashbackCoupon,
  pl_gst_after_discount: gstAfterDiscount,
  pl_tax_inclusive_back_calc: taxInclusiveBackCalc,
  pl_profit_after_commission_tax: profitAfterCommissionTax,
  pl_repair_overhead_cost: repairOverheadCost,
  pl_required_sp_after_overhead: requiredSpAfterOverhead,
  pl_manufacturing_breakdown: manufacturingBreakdown,
  pl_required_sp_after_loss: requiredSpAfterLoss,
  pl_sp_difference_two_rates: spDifferenceTwoRates,
  pl_equal_profit_loss_amount: equalProfitLossAmount,
  pl_same_profit_amount_different_rates: sameProfitAmountDifferentRates,
  pl_inverse_cp_from_mp_discount_profit: inverseCpFromMpDiscountProfit,
  pl_inverse_discount_from_cp_mp_profit: inverseDiscountFromCpMpProfit,
  pl_inverse_markup_from_cp_discount_profit: inverseMarkupFromCpDiscountProfit,
  pl_multi_condition_inverse_absolute: multiConditionInverse,
};
