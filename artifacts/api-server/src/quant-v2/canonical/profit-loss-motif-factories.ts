import type {
  CanonicalProfitLossProblem,
  ProfitLossFamilyId,
  ProfitLossMotifFactory,
} from "./profit-loss-types";
import {
  ADDITIONAL_PROFIT_LOSS_FAMILY_IDS,
  ADDITIONAL_PROFIT_LOSS_FACTORIES,
} from "./profit-loss-comprehensive-families";

type ObjectLabel = CanonicalProfitLossProblem["object"];

const OBJECTS: readonly ObjectLabel[] = [
  { en: "watch", pluralEn: "watches", hi: "घड़ी", pluralHi: "घड़ियाँ", pa: "ਘੜੀ", pluralPa: "ਘੜੀਆਂ" },
  { en: "bag", pluralEn: "bags", hi: "बैग", pluralHi: "बैग", pa: "ਬੈਗ", pluralPa: "ਬੈਗ" },
  { en: "book set", pluralEn: "book sets", hi: "पुस्तक सेट", pluralHi: "पुस्तक सेट", pa: "ਕਿਤਾਬਾਂ ਦਾ ਸੈੱਟ", pluralPa: "ਕਿਤਾਬਾਂ ਦੇ ਸੈੱਟ" },
  { en: "chair", pluralEn: "chairs", hi: "कुर्सी", pluralHi: "कुर्सियाँ", pa: "ਕੁਰਸੀ", pluralPa: "ਕੁਰਸੀਆਂ" },
  { en: "mixer", pluralEn: "mixers", hi: "मिक्सर", pluralHi: "मिक्सर", pa: "ਮਿਕਸਰ", pluralPa: "ਮਿਕਸਰ" },
  { en: "shirt", pluralEn: "shirts", hi: "कमीज", pluralHi: "कमीजें", pa: "ਕਮੀਜ਼", pluralPa: "ਕਮੀਜ਼ਾਂ" },
  { en: "calculator", pluralEn: "calculators", hi: "कैलकुलेटर", pluralHi: "कैलकुलेटर", pa: "ਕੈਲਕੂਲੇਟਰ", pluralPa: "ਕੈਲਕੂਲੇਟਰ" },
  { en: "table fan", pluralEn: "table fans", hi: "टेबल फैन", pluralHi: "टेबल फैन", pa: "ਟੇਬਲ ਫੈਨ", pluralPa: "ਟੇਬਲ ਫੈਨ" },
];

export const PROFIT_LOSS_FAMILY_IDS: readonly ProfitLossFamilyId[] = [
  "pl_cp_sp_percent",
  "pl_cp_percent_to_sp",
  "pl_sp_percent_to_cp",
  "pl_mp_discount_to_sp",
  "pl_mp_sp_discount_percent",
  "pl_cp_mp_discount_to_percent",
  "pl_successive_discounts",
  "pl_mp_for_target_profit",
  "pl_equal_sp_profit_loss",
  "pl_two_article_overall",
  ...ADDITIONAL_PROFIT_LOSS_FAMILY_IDS,
];

const PERCENT_SETS: Partial<Record<ProfitLossFamilyId, readonly number[]>> = {
  pl_cp_sp_percent: [5, 8, 10, 12.5, 15, 20, 25, 30, 35, 40],
  pl_cp_percent_to_sp: [5, 10, 12.5, 15, 20, 25, 30, 35, 40],
  pl_sp_percent_to_cp: [10, 12.5, 20, 25, 30, 40],
  pl_mp_discount_to_sp: [5, 10, 12.5, 15, 20, 25, 30, 35, 40],
  pl_mp_sp_discount_percent: [5, 10, 12.5, 15, 20, 25, 30, 35, 40],
  pl_cp_mp_discount_to_percent: [5, 10, 12.5, 15, 20, 25, 30],
  pl_successive_discounts: [5, 10, 12.5, 15, 20, 25, 30],
  pl_mp_for_target_profit: [10, 12.5, 15, 20, 25, 30],
  pl_equal_sp_profit_loss: [10, 20, 25, 30, 40],
  pl_two_article_overall: [10, 15, 20, 25, 30],
};

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

function base(seed: string, family: ProfitLossFamilyId, difficulty: string) {
  const object = pick(OBJECTS, `${seed}:object`);
  const percent = pick(PERCENT_SETS[family] ?? [10, 15, 20, 25], `${seed}:percent`);
  const amountBase =
    difficulty === "hard"
      ? [700, 800, 900, 1000, 1200, 1500, 1600, 1800, 2000, 2400, 2500, 3000]
      : difficulty === "medium"
        ? [300, 360, 400, 500, 600, 720, 800, 900, 1000, 1200, 1500]
        : [100, 150, 200, 240, 250, 300, 360, 400, 500, 600];
  const amount = pick(amountBase, `${seed}:amount`);
  return { object, percent, amount };
}

function round2(value: number) {
  return Number(value.toFixed(2));
}

function distractors(answer: number, kind: "amount" | "percent") {
  const deltas =
    kind === "percent"
      ? [answer + 5, Math.abs(answer - 5), answer * 2]
      : [answer * 0.8, answer * 1.2, answer + 100];
  const unique = deltas
    .map(round2)
    .filter((value, index, all) => value > 0 && value !== answer && all.indexOf(value) === index)
    .slice(0, 3);

  for (const multiplier of [1.5, 0.5, 1.25, 0.75, 2.5]) {
    if (unique.length >= 3) break;
    const value = round2(
      kind === "percent"
        ? answer + multiplier * 10
        : answer * multiplier,
    );
    if (value > 0 && value !== answer && !unique.includes(value)) {
      unique.push(value);
    }
  }

  return unique.slice(0, 3);
}

function problem(
  input: Omit<CanonicalProfitLossProblem, "topic" | "subtype" | "category" | "topology" | "distractors">,
): CanonicalProfitLossProblem {
  return {
    ...input,
    topic: "profit_loss_discount",
    subtype: input.family,
    category: "profit_loss_discount",
    topology: {
      family: "profit_loss_discount",
      variant: input.family,
    },
    distractors: distractors(input.answer, input.answerKind),
  };
}

const cpSpPercent: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  const profit = hashText(seed) % 2 === 0;
  const sp = round2(amount * (profit ? (100 + percent) : (100 - percent)) / 100);
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { cp: amount, sp, percent },
    answer: percent,
    answerKind: "percent",
    answerSemantic: profit ? "profit_percent" : "loss_percent",
    difficulty,
    object,
    traps: ["uses selling price as base", "confuses profit with loss"],
  });
};

const cpPercentToSp: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  const profit = hashText(`${seed}:mode`) % 2 === 0;
  const sp = round2(amount * (profit ? (100 + percent) : (100 - percent)) / 100);
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { cp: amount, percent, mode: profit ? 1 : -1 },
    answer: sp,
    answerKind: "amount",
    answerSemantic: "selling_price",
    difficulty,
    object,
    traps: ["adds discount instead of profit", "uses 100 as the amount"],
  });
};

const spPercentToCp: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  const profit = hashText(`${seed}:mode`) % 2 === 0;
  const cp = amount;
  const sp = round2(cp * (profit ? 100 + percent : 100 - percent) / 100);
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { sp, percent, mode: profit ? 1 : -1 },
    answer: cp,
    answerKind: "amount",
    answerSemantic: "cost_price",
    difficulty,
    object,
    traps: ["takes percentage on selling price", "inverts the base incorrectly"],
  });
};

const mpDiscountToSp: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  const sp = round2(amount * (100 - percent) / 100);
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { mp: amount, discount: percent },
    answer: sp,
    answerKind: "amount",
    answerSemantic: "selling_price",
    difficulty,
    object,
    traps: ["adds discount to marked price", "uses discount amount as answer"],
  });
};

const mpSpDiscountPercent: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  const sp = round2(amount * (100 - percent) / 100);
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { mp: amount, sp, discount: percent },
    answer: percent,
    answerKind: "percent",
    answerSemantic: "discount_percent",
    difficulty,
    object,
    traps: ["uses selling price as discount base", "finds remaining percent"],
  });
};

const cpMpDiscountToPercent: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  let markup = pick([25, 40, 50, 60, 80], `${seed}:markup`);
  let mp = round2(amount * (100 + markup) / 100);
  let sp = round2(mp * (100 - percent) / 100);
  if (sp === amount) {
    markup = markup === 50 ? 60 : 50;
    mp = round2(amount * (100 + markup) / 100);
    sp = round2(mp * (100 - percent) / 100);
  }
  const result = round2(Math.abs(sp - amount) * 100 / amount);
  const semantic =
    result === 0
      ? "no_profit_no_loss"
      : sp > amount
        ? "profit_percent"
        : "loss_percent";
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { cp: amount, mp, discount: percent },
    answer: result,
    answerKind: "percent",
    answerSemantic: semantic,
    difficulty,
    object,
    traps: ["calculates discount percent only", "uses marked price as profit base"],
  });
};

const successiveDiscounts: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  const discount2 = pick([5, 10, 15, 20, 25], `${seed}:d2`);
  const sp = round2(amount * (100 - percent) * (100 - discount2) / 10000);
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { mp: amount, discount1: percent, discount2 },
    answer: sp,
    answerKind: "amount",
    answerSemantic: "selling_price",
    difficulty,
    object,
    traps: ["adds successive discounts directly", "applies both discounts on original twice"],
  });
};

const mpForTargetProfit: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, percent, amount } = base(seed, family, difficulty);
  const discount = pick([20, 25], `${seed}:discount`);
  const targetSp = amount * (100 + percent) / 100;
  const mp = round2(targetSp * 100 / (100 - discount));
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { cp: amount, targetProfit: percent, discount },
    answer: mp,
    answerKind: "amount",
    answerSemantic: "marked_price",
    difficulty,
    object,
    traps: ["ignores discount while setting marked price", "uses cost price as selling price"],
  });
};

const equalSpProfitLoss: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object, amount } = base(seed, family, difficulty);
  const percent = pick([10, 20, 25, 30], `${seed}:equal`);
  const lossPercent = percent;
  const sp = amount;
  const cp1 = round2(sp * 100 / (100 + percent));
  const cp2 = round2(sp * 100 / (100 - lossPercent));
  const result = round2(Math.abs((2 * sp - cp1 - cp2) * 100 / (cp1 + cp2)));
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { sp, profitPercent: percent, lossPercent, cp1, cp2 },
    answer: result,
    answerKind: "percent",
    answerSemantic: (2 * sp) >= (cp1 + cp2) ? "overall_profit_percent" : "overall_loss_percent",
    difficulty,
    object,
    traps: ["cancels profit and loss percentages directly", "averages the two percentages"],
  });
};

const twoArticleOverall: ProfitLossMotifFactory = ({ seed, difficulty, family }) => {
  const { object } = base(seed, family, difficulty);
  const scenarios = [
    { cp1: 400, profitPercent: 25, cp2: 600, lossPercent: 10 },
    { cp1: 600, profitPercent: 20, cp2: 400, lossPercent: 15 },
    { cp1: 500, profitPercent: 10, cp2: 1000, lossPercent: 20 },
    { cp1: 800, profitPercent: 25, cp2: 400, lossPercent: 10 },
    { cp1: 1000, profitPercent: 15, cp2: 500, lossPercent: 30 },
    { cp1: 300, profitPercent: 20, cp2: 700, lossPercent: 10 },
    { cp1: 1200, profitPercent: 25, cp2: 800, lossPercent: 15 },
    { cp1: 750, profitPercent: 20, cp2: 250, lossPercent: 10 },
    { cp1: 900, profitPercent: 10, cp2: 600, lossPercent: 20 },
    { cp1: 450, profitPercent: 30, cp2: 1050, lossPercent: 10 },
  ] as const;
  const scenario = pick(scenarios, `${seed}:scenario`);
  const { cp1, profitPercent, cp2 } = scenario;
  let secondLoss = scenario.lossPercent;
  const sp1 = round2(cp1 * (100 + profitPercent) / 100);
  let sp2 = round2(cp2 * (100 - secondLoss) / 100);
  if (round2(sp1 + sp2) === cp1 + cp2) {
    secondLoss = secondLoss >= 30 ? 20 : secondLoss + 5;
    sp2 = round2(cp2 * (100 - secondLoss) / 100);
  }
  const totalCp = cp1 + cp2;
  const totalSp = sp1 + sp2;
  const result = round2(Math.abs(totalSp - totalCp) * 100 / totalCp);
  const semantic =
    result === 0
      ? "no_profit_no_loss"
      : totalSp > totalCp
        ? "overall_profit_percent"
        : "overall_loss_percent";
  return problem({
    id: `${family}:${seed}`,
    family,
    variables: { cp1, profitPercent, cp2, lossPercent: secondLoss, sp1, sp2 },
    answer: result,
    answerKind: "percent",
    answerSemantic: semantic,
    difficulty,
    object,
    traps: ["subtracts percentages without weighting cost prices", "uses selling price as overall base"],
  });
};

export const PROFIT_LOSS_MOTIF_FACTORIES: Record<ProfitLossFamilyId, ProfitLossMotifFactory> = {
  pl_cp_sp_percent: cpSpPercent,
  pl_cp_percent_to_sp: cpPercentToSp,
  pl_sp_percent_to_cp: spPercentToCp,
  pl_mp_discount_to_sp: mpDiscountToSp,
  pl_mp_sp_discount_percent: mpSpDiscountPercent,
  pl_cp_mp_discount_to_percent: cpMpDiscountToPercent,
  pl_successive_discounts: successiveDiscounts,
  pl_mp_for_target_profit: mpForTargetProfit,
  pl_equal_sp_profit_loss: equalSpProfitLoss,
  pl_two_article_overall: twoArticleOverall,
  ...ADDITIONAL_PROFIT_LOSS_FACTORIES,
};
