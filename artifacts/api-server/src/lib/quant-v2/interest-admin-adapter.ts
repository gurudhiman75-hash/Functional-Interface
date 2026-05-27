import { randomUUID } from "node:crypto";

import type {
  DifficultyLabel,
  ExamProfileId,
  FormulaQuestion,
  GeneratorOptions,
  Pattern,
} from "../core/generator-engine";
import {
  createInterestProblem,
  INTEREST_FAMILY_IDS,
} from "../../quant-v2/canonical/interest-motif-factories";
import type {
  CanonicalInterestProblem,
  InterestAnswerKind,
  InterestAnswerSemantic,
  InterestFamilyId,
  InterestRealization,
  InterestStep,
} from "../../quant-v2/canonical/interest-types";
import { validateInterestIndependentSolver } from "../../quant-v2/validators/interest-independent-solver";

function titleDifficulty(value: Lowercase<DifficultyLabel>): DifficultyLabel {
  if (value === "easy") return "Easy";
  if (value === "hard") return "Hard";
  return "Medium";
}

function requestedDifficulty(pattern: Pattern, options?: GeneratorOptions): Lowercase<DifficultyLabel> {
  const raw = String(options?.targetDifficulty ?? pattern.difficulty ?? "Medium").toLowerCase();
  if (/easy|1|2|3/u.test(raw)) return "easy";
  if (/hard|7|8|9|10/u.test(raw)) return "hard";
  return "medium";
}

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function amount(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function money(value: number) {
  return `₹${amount(value)}`;
}

function percent(value: number) {
  return `${amount(value)}%`;
}

function ratioText(value: number) {
  const candidates = [2, 3, 4, 5, 8, 10, 12, 15, 20];
  for (const denominator of candidates) {
    const numerator = Math.round(value * denominator);
    if (numerator > 0 && Math.abs(numerator / denominator - value) < 0.015) {
      const gcd = (left: number, right: number): number => right === 0 ? left : gcd(right, left % right);
      const divisor = gcd(numerator, denominator);
      return `${numerator / divisor}:${denominator / divisor}`;
    }
  }
  return amount(value);
}

function answerText(problem: CanonicalInterestProblem, language: "en" | "hi" | "pa" = "en") {
  const label = (semantic: InterestAnswerSemantic) => {
    const labels: Record<InterestAnswerSemantic, Record<"en" | "hi" | "pa", string>> = {
      simple_interest: { en: "simple interest", hi: "साधारण ब्याज", pa: "ਸਧਾਰਣ ਵਿਆਜ" },
      compound_interest: { en: "compound interest", hi: "चक्रवृद्धि ब्याज", pa: "ਮਿਸ਼ਰਿਤ ਵਿਆਜ" },
      amount: { en: "amount", hi: "कुल राशि", pa: "ਕੁੱਲ ਰਕਮ" },
      principal: { en: "principal", hi: "मूलधन", pa: "ਮੂਲਧਨ" },
      rate: { en: "rate", hi: "दर", pa: "ਦਰ" },
      time: { en: "years", hi: "वर्ष", pa: "ਸਾਲ" },
      difference: { en: "difference", hi: "अंतर", pa: "ਅੰਤਰ" },
      installment: { en: "installment", hi: "किस्त", pa: "ਕਿਸ਼ਤ" },
      present_worth: { en: "present worth", hi: "वर्तमान मूल्य", pa: "ਮੌਜੂਦਾ ਮੁੱਲ" },
      bankers_discount: { en: "banker's discount", hi: "बैंकर्स डिस्काउंट", pa: "ਬੈਂਕਰ ਛੂਟ" },
      true_discount: { en: "true discount", hi: "सच्ची छूट", pa: "ਅਸਲ ਛੂਟ" },
      bankers_gain: { en: "banker's gain", hi: "बैंकर्स लाभ", pa: "ਬੈਂਕਰ ਲਾਭ" },
      final_value: { en: "final value", hi: "अंतिम मूल्य", pa: "ਅੰਤਿਮ ਮੁੱਲ" },
      effective_rate: { en: "effective annual rate", hi: "प्रभावी वार्षिक दर", pa: "ਪ੍ਰਭਾਵੀ ਸਾਲਾਨਾ ਦਰ" },
      investment_ratio: { en: "investment ratio", hi: "निवेश अनुपात", pa: "ਨਿਵੇਸ਼ ਅਨੁਪਾਤ" },
    };
    return labels[semantic][language];
  };
  if (problem.answerKind === "amount") return `${money(problem.answer)}`;
  if (problem.answerKind === "percent" || problem.answerKind === "rate") return `${percent(problem.answer)} ${label(problem.answerSemantic)}`;
  if (problem.answerKind === "time") return `${amount(problem.answer)} ${label(problem.answerSemantic)}`;
  if (problem.answerKind === "ratio") return ratioText(problem.answer);
  return amount(problem.answer);
}

function optionText(value: number, kind: InterestAnswerKind, semantic: InterestAnswerSemantic, language: "en" | "hi" | "pa") {
  const clone: CanonicalInterestProblem = {
    id: "option",
    topic: "interest",
    family: "int_si_from_prt",
    subtype: "int_si_from_prt",
    category: "interest",
    variables: {},
    answer: value,
    answerKind: kind,
    answerSemantic: semantic,
    difficulty: "easy",
    complexity: "easy",
    topology: { family: "interest", variant: "int_si_from_prt" },
    traps: [],
    distractors: [],
    context: { en: "", hi: "", pa: "" },
    customStem: { en: "", hi: "", pa: "" },
    customSteps: [],
  };
  return answerText(clone, language);
}

function mathExpression(expression: string) {
  const trimmed = expression.trim();
  if (!trimmed) return "";
  const normalized = trimmed
    .replace(/\.\.\./gu, "\\cdots")
    .replace(/\s+x\s+/giu, " \\times ")
    .replace(/\*/gu, "\\times")
    .replace(/\^(\d+)/gu, "^{$1}");
  return `\\(${normalized}\\)`;
}

function displayMath(expression: string) {
  return `\\[\n${expression}\n\\]`;
}

function timesFormula(expression: string) {
  return expression
    .replace(/\.\.\./gu, "\\cdots")
    .replace(/\s+x\s+/giu, " \\times ")
    .replace(/\*/gu, "\\times")
    .replace(/\^(\d+)/gu, "^{$1}");
}

function localizedSentence(language: "en" | "hi" | "pa", en: string, hi: string, pa: string) {
  if (language === "hi") return hi;
  if (language === "pa") return pa;
  return en;
}

function finalSentence(problem: CanonicalInterestProblem, language: "en" | "hi" | "pa") {
  const answer = answerText(problem, language);
  if (language === "hi") return `अतः उत्तर ${answer} है।`;
  if (language === "pa") return `ਇਸ ਲਈ ਉੱਤਰ ${answer} ਹੈ।`;
  if (problem.answerSemantic === "installment") return `Therefore, each installment is ${answer}.`;
  if (problem.answerSemantic === "simple_interest") return `Therefore, the simple interest is ${answer}.`;
  if (problem.answerSemantic === "compound_interest") return `Therefore, the compound interest is ${answer}.`;
  if (problem.answerSemantic === "difference") return `Therefore, the required difference is ${answer}.`;
  return `Therefore, the answer is ${answer}.`;
}

function formulaExplanation(problem: CanonicalInterestProblem, language: "en" | "hi" | "pa") {
  const v = problem.variables;
  const family = problem.family;
  const blocks: string[] = [];

  if (family === "int_si_partial_discharge_timeline" || family === "int_partial_payment_before_final_amount") {
    const p = v.principal;
    const r = v.r;
    const t1 = v.firstYears;
    const t2 = v.secondYears;
    const i1 = Number(((p * r * t1) / 100).toFixed(2));
    const balance = v.balance;
    const i2 = Number(((balance * r * t2) / 100).toFixed(2));
    blocks.push(localizedSentence(language, "First-period interest:", "पहली अवधि का ब्याज:", "ਪਹਿਲੀ ਮਿਆਦ ਦਾ ਵਿਆਜ:"));
    blocks.push(displayMath(`I_1 = \\frac{${amount(p)} \\times ${r} \\times ${t1}}{100} = ${amount(i1)}`));
    blocks.push(localizedSentence(language, "Balance after repayment:", "भुगतान के बाद शेष राशि:", "ਭੁਗਤਾਨ ਤੋਂ ਬਾਅਦ ਬਕਾਇਆ ਰਕਮ:"));
    blocks.push(displayMath(`\\text{Balance} = ${amount(p)} - ${amount(v.repaid)} = ${amount(balance)}`));
    blocks.push(localizedSentence(language, "Interest on the balance:", "शेष राशि पर ब्याज:", "ਬਕਾਇਆ ਰਕਮ ਤੇ ਵਿਆਜ:"));
    blocks.push(displayMath(`I_2 = \\frac{${amount(balance)} \\times ${r} \\times ${t2}}{100} = ${amount(i2)}`));
    blocks.push(displayMath(`\\text{Total interest} = I_1 + I_2 = ${amount(i1)} + ${amount(i2)} = ${amount(problem.answer)}`));
    blocks.push(finalSentence(problem, language));
    return blocks.join("\n\n");
  }

  if (/installment|loan_repayment|find_installment|principal_from_installments/u.test(family)) {
    const p = v.principal;
    const r = v.r;
    const n = v.n;
    const periodRate = family.includes("half_yearly") ? r / 2 : r;
    const growth = 1 + periodRate / 100;
    const denominator = Array.from({ length: n }, (_, index) =>
      amount(Number(Math.pow(growth, n - 1 - index).toFixed(4))),
    ).join(" + ");
    blocks.push(localizedSentence(language, "Amount payable at the end:", "अंत में देय राशि:", "ਅੰਤ ਵਿੱਚ ਦੇਣਯੋਗ ਰਕਮ:"));
    blocks.push(displayMath(`A = P\\left(1+\\frac{R}{100}\\right)^n`));
    blocks.push(displayMath(`A = ${amount(p)}\\left(1+\\frac{${amount(periodRate)}}{100}\\right)^${n} = ${amount(v.amount)}`));
    blocks.push(localizedSentence(language, "Equal installment:", "बराबर किस्त:", "ਬਰਾਬਰ ਕਿਸ਼ਤ:"));
    blocks.push(displayMath(`X = \\frac{A}{(1+r)^{n-1} + (1+r)^{n-2} + \\cdots + 1}`));
    blocks.push(displayMath(`X = \\frac{${amount(v.amount)}}{${denominator}} = ${amount(problem.answer)}`));
    blocks.push(finalSentence(problem, language));
    return blocks.join("\n\n");
  }

  if (/ci_si|si_ci|hybrid_si_ci|rate_from_ci|principal_from_ci|si_ci_amount_difference/u.test(family)) {
    const p = v.p;
    const r = v.r;
    const t = family.includes("3_year") ? 3 : 2;
    const si = Number(((p * r * t) / 100).toFixed(2));
    const ci = Number((p * (Math.pow(1 + r / 100, t) - 1)).toFixed(2));
    blocks.push(localizedSentence(language, "Simple interest:", "साधारण ब्याज:", "ਸਧਾਰਣ ਵਿਆਜ:"));
    blocks.push(displayMath(`SI = \\frac{P \\times R \\times T}{100}`));
    blocks.push(displayMath(`SI = \\frac{${amount(p)} \\times ${r} \\times ${t}}{100} = ${amount(si)}`));
    blocks.push(localizedSentence(language, "Compound interest:", "चक्रवृद्धि ब्याज:", "ਮਿਸ਼ਰਿਤ ਵਿਆਜ:"));
    blocks.push(displayMath(`CI = P\\left[\\left(1+\\frac{R}{100}\\right)^T - 1\\right]`));
    blocks.push(displayMath(`CI = ${amount(p)}\\left[\\left(1+\\frac{${r}}{100}\\right)^${t} - 1\\right] = ${amount(ci)}`));
    blocks.push(displayMath(`\\text{Difference} = CI - SI = ${amount(ci)} - ${amount(si)} = ${amount(ci - si)}`));
    blocks.push(finalSentence(problem, language));
    return blocks.join("\n\n");
  }

  if (/^(?:int_ci_half_yearly|int_ci_quarterly|int_ci_monthly|int_ci_fractional_time_boundary)$/u.test(family)) {
    const p = v.p;
    const periodRate = v.periodRate;
    const periods = v.periods;
    blocks.push(localizedSentence(language, "First find the rate per compounding period:", "प्रति अवधि दर निकालें:", "ਪ੍ਰਤੀ ਅਵਧੀ ਦਰ ਕੱਢੋ:"));
    blocks.push(displayMath(`R_{\\text{period}} = \\frac{${v.r}}{${v.m}} = ${amount(periodRate)}`));
    blocks.push(localizedSentence(language, "Now use the compound amount formula:", "अब चक्रवृद्धि राशि का सूत्र लगाएँ:", "ਹੁਣ ਮਿਸ਼ਰਿਤ ਰਕਮ ਦਾ ਸੂਤਰ ਲਗਾਓ:"));
    blocks.push(displayMath(`A = P\\left(1+\\frac{R}{100}\\right)^T`));
    blocks.push(displayMath(`A = ${amount(p)}\\left(1+\\frac{${amount(periodRate)}}{100}\\right)^${periods} = ${amount(v.amount)}`));
    if (problem.answerSemantic === "compound_interest") {
      blocks.push(displayMath(`CI = A - P = ${amount(v.amount)} - ${amount(p)} = ${amount(problem.answer)}`));
    }
    blocks.push(finalSentence(problem, language));
    return blocks.join("\n\n");
  }

  if ((/^int_si_/u.test(family) || /interest_more|different_rates_different_years_si|calculated_on_amount/u.test(family)) && v.p !== undefined && v.r !== undefined && v.t !== undefined) {
    const si = Number(((v.p * v.r * v.t) / 100).toFixed(2));
    blocks.push(localizedSentence(language, "Use the simple interest formula:", "साधारण ब्याज का सूत्र लगाएँ:", "ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਸੂਤਰ ਲਗਾਓ:"));
    blocks.push(displayMath(`SI = \\frac{P \\times R \\times T}{100}`));
    blocks.push(displayMath(`SI = \\frac{${amount(v.p)} \\times ${v.r} \\times ${v.t}}{100} = ${amount(si)}`));
    if (problem.answerSemantic === "amount") {
      blocks.push(displayMath(`A = P + SI = ${amount(v.p)} + ${amount(si)} = ${amount(problem.answer)}`));
    } else if (problem.answerSemantic === "principal") {
      blocks.push(displayMath(`P = \\frac{SI \\times 100}{R \\times T} = \\frac{${amount(v.si ?? si)} \\times 100}{${v.r} \\times ${v.t}} = ${amount(problem.answer)}`));
    } else if (problem.answerSemantic === "rate") {
      blocks.push(displayMath(`R = \\frac{SI \\times 100}{P \\times T} = \\frac{${amount(v.si ?? si)} \\times 100}{${amount(v.p)} \\times ${v.t}} = ${amount(problem.answer)}`));
    } else if (problem.answerSemantic === "time") {
      blocks.push(displayMath(`T = \\frac{SI \\times 100}{P \\times R} = \\frac{${amount(v.si ?? si)} \\times 100}{${amount(v.p)} \\times ${v.r}} = ${amount(problem.answer)}`));
    }
    blocks.push(finalSentence(problem, language));
    return blocks.join("\n\n");
  }

  if ((/^int_ci_/u.test(family) || /compound|growth|depreciation|appreciation|successive/u.test(family)) && v.p !== undefined && v.r !== undefined && v.t !== undefined) {
    const a = Number((v.p * Math.pow(1 + v.r / 100, v.t)).toFixed(2));
    const ci = Number((a - v.p).toFixed(2));
    blocks.push(localizedSentence(language, "Use the compound amount formula:", "चक्रवृद्धि राशि का सूत्र लगाएँ:", "ਮਿਸ਼ਰਿਤ ਰਕਮ ਦਾ ਸੂਤਰ ਲਗਾਓ:"));
    blocks.push(displayMath(`A = P\\left(1+\\frac{R}{100}\\right)^T`));
    blocks.push(displayMath(`A = ${amount(v.p)}\\left(1+\\frac{${v.r}}{100}\\right)^${v.t} = ${amount(a)}`));
    blocks.push(displayMath(`CI = A - P = ${amount(a)} - ${amount(v.p)} = ${amount(ci)}`));
    blocks.push(finalSentence(problem, language));
    return blocks.join("\n\n");
  }

  return undefined;
}

function solutionLine(step: InterestStep, language: "en" | "hi" | "pa") {
  if (language !== "en") return step[language];
  const label = step.en.toLowerCase();
  if (step.key === "equation") return "Let the first part be \\(x\\); then the second part is the balance.";
  if (/simple interest/u.test(label)) return "Use the simple interest formula:";
  if (/compound amount|amount$/u.test(label)) return "Use the compound amount formula:";
  if (/present worth/u.test(label)) return "Present worth is:";
  if (/true discount/u.test(label)) return "True discount is:";
  if (/banker/u.test(label)) return `${step.en} is:`;
  if (/total interest/u.test(label)) return "The total interest is:";
  if (/rate per period/u.test(label)) return "First find the rate per compounding period:";
  if (/amount multiplier|amount ratio/u.test(label)) return "Compare the two amounts:";
  if (/opening amount/u.test(label)) return `${step.en} is:`;
  if (/difference/u.test(label)) return `${step.en} is:`;
  if (/installment/u.test(label)) return "Using the equal-installment formula:";
  return `${step.en}:`;
}

function stepLines(steps: InterestStep[], language: "en" | "hi" | "pa") {
  return steps
    .map((step) => {
      const label = solutionLine(step, language);
      if (!step.expression) return label;
      const value = step.value === undefined ? "" : ` = ${amount(step.value)}`;
      return `${label}\n${displayMath(`${timesFormula(step.expression)}${value}`)}`;
    })
    .join("\n\n");
}

function rotateStem(stem: CanonicalInterestProblem["customStem"], problem: CanonicalInterestProblem) {
  void problem;
  return {
    en: stem.en
      .replace(/\bA investment scheme\b/gu, "An investment scheme")
      .replace(/\bA invoice\b/gu, "An invoice")
      .replace(/\bA two\b/gu, "Two")
      .replace(/\bOn a investment scheme\b/gu, "On an investment scheme")
      .replace(/\byear\(s\)/gu, "year")
      .replace(/\b1 years\b/gu, "1 year")
      .replace(/\b1 periods\b/gu, "1 period")
      .replace(/\bOn a monthly saving account of\s+/gu, "On ")
      .replace(/\bA monthly saving account of\s+/gu, "")
      .replace(/\bof a monthly saving account\b/gu, "")
      .replace(/\bThe value of a furniture is\b/gu, "A furniture item is worth")
      .replace(/\bA equipment is\b/gu, "An equipment item is")
      .replace(/\bdue amount is due\b/gu, "amount is due"),
    hi: stem.hi,
    pa: stem.pa,
  };
}

function buildRealization(problem: CanonicalInterestProblem): InterestRealization {
  const stem = rotateStem(problem.customStem, problem);
  const finalEn = `Answer = ${answerText(problem, "en")}`;
  const finalHi = `उत्तर = ${answerText(problem, "hi")}`;
  const finalPa = `ਉੱਤਰ = ${answerText(problem, "pa")}`;
  const explanationEn =
    formulaExplanation(problem, "en") ??
    `${stepLines(problem.customSteps, "en")}\n\n${finalEn}`;
  const explanationHi =
    formulaExplanation(problem, "hi") ??
    `${stepLines(problem.customSteps, "hi")}\n\n${finalHi}`;
  const explanationPa =
    formulaExplanation(problem, "pa") ??
    `${stepLines(problem.customSteps, "pa")}\n\n${finalPa}`;
  return {
    stem,
    steps: problem.customSteps,
    explanation: {
      en: explanationEn,
      hi: explanationHi,
      pa: explanationPa,
    },
  };
}

function buildGraph(problem: CanonicalInterestProblem, realization: InterestRealization) {
  return {
    id: `${problem.id}:graph`,
    topology: problem.topology,
    steps: realization.steps.map((item, index) => ({
      id: item.key,
      order: index + 1,
      label: item.en,
      expression: item.expression,
      value: item.value,
    })),
  };
}

function realismScore(problem: CanonicalInterestProblem) {
  const base = problem.complexity === "advanced" ? 90 : problem.complexity === "hard" ? 86 : problem.complexity === "medium" ? 82 : 74;
  const trapBonus = problem.traps.length >= 3 ? 2 : 0;
  const cleanNumberBonus = Object.values(problem.variables).every((value) => Number.isInteger(value) || Math.abs(value * 4 - Math.round(value * 4)) < 0.001) ? 1 : -1;
  const spread = (hashText(problem.id) % 5) - 2;
  const raw = Math.max(68, Math.min(94, base + trapBonus + cleanNumberBonus + spread));
  const formulaShell = /^(?:int_si_from_prt|int_si_amount_from_prt|int_si_principal_from_si_rt|int_si_rate_from_si_pt|int_si_time_from_si_pr|int_ci_amount_annual|int_ci_from_amount|int_ci_principal_from_amount|int_ci_rate_from_amount|int_ci_time_from_amount|int_ci_two_year_formula|int_ci_three_year_formula)$/u.test(problem.family);
  return formulaShell ? Math.min(raw, 80) : raw;
}

function difficultyMetadata(problem: CanonicalInterestProblem) {
  const actualDifficulty = problem.complexity === "easy" ? "Easy" : problem.complexity === "medium" ? "Medium" : "Hard";
  const score = problem.complexity === "advanced" ? 8 : problem.complexity === "hard" ? 7 : problem.complexity === "medium" ? 5 : 3;
  return {
    difficulty: actualDifficulty,
    difficultyMetadata: {
      difficultyScore: score,
      difficultyLabel: actualDifficulty,
      reasoningDepth: problem.complexity === "advanced" ? 4 : problem.complexity === "hard" ? 3 : problem.complexity === "medium" ? 2 : 1,
      calculationComplexity: score,
      distractorComplexity: problem.traps.length,
      ambiguityScore: 0,
      solvingTimeEstimate: 45 + score * 12,
      cognitiveLoad: score,
      metrics: {},
    },
  };
}

function qualityMetrics(problem: CanonicalInterestProblem, graph: ReturnType<typeof buildGraph>) {
  const realism = realismScore(problem);
  return {
    valid: true,
    score: realism,
    metrics: {
      overallQualityScore: realism,
      editorialRealismScore: realism,
      stemNaturalness: Math.min(96, realism + 2),
      optionQuality: 90,
      explanationQuality: graph.steps.length >= 2 ? 88 : 80,
    },
  };
}

export function isQuantV2InterestPattern(pattern: Pattern) {
  const text = `${pattern.generationDomain ?? ""} ${pattern.topic ?? ""} ${pattern.subtopic ?? ""} ${pattern.id ?? ""} ${pattern.name ?? ""}`.toLowerCase();
  return /quant-v2-interest|simple[-_\s]*interest|compound[-_\s]*interest|\bsi[-_\s]*ci\b|\binterest\b|ब्याज|ਸਧਾਰਣ ਵਿਆਜ|ਮਿਸ਼ਰਿਤ ਵਿਆਜ/u.test(text);
}

export function createQuantV2InterestQuestionCandidate(
  pattern: Pattern,
  options?: GeneratorOptions,
): FormulaQuestion {
  const seed =
    options?.seed ??
    options?.generationContext?.seed ??
    `${pattern.id}:interest:${randomUUID()}`;
  const difficulty = requestedDifficulty(pattern, options);
  const forced = String(options?.forcedMotifId ?? "");
  const family = INTEREST_FAMILY_IDS.includes(forced as InterestFamilyId)
    ? forced as InterestFamilyId
    : undefined;
  const problem = createInterestProblem({ seed, difficulty, family });
  const realization = buildRealization(problem);
  const graph = buildGraph(problem, realization);
  const quality = qualityMetrics(problem, graph);
  const values = [problem.answer, ...problem.distractors].slice(0, 4);
  const optionsEn = values.map((value) => optionText(value, problem.answerKind, problem.answerSemantic, "en"));
  const optionsHi = values.map((value) => optionText(value, problem.answerKind, problem.answerSemantic, "hi"));
  const optionsPa = values.map((value) => optionText(value, problem.answerKind, problem.answerSemantic, "pa"));
  const solverValidation = validateInterestIndependentSolver({
    problem,
    explanation: realization.explanation.en,
    options: optionsEn,
    correct: 0,
  });
  if (!solverValidation.valid) {
    throw new Error(`Interest V2 solver validation failed: ${solverValidation.issues.join("; ")}`);
  }
  const semanticMetadata = {
    problem,
    examinerIntent: { primaryIntent: problem.family },
    canonicalScenario: {
      domain: "interest",
      object: problem.context.en,
    },
    corpusFingerprints: {
      topologyFingerprint: `${problem.topology.family}:${problem.topology.variant}`,
      operationFingerprint: graph.steps.map((step) => step.id).join(">"),
      percentageVectorFingerprint: Object.entries(problem.variables)
        .filter(([key]) => /r|rate|percent/u.test(key))
        .map(([, value]) => String(value))
        .join("|"),
      semanticIntentFingerprint: problem.family,
      distractorPatternFingerprint: problem.traps.join("|"),
      compositeFingerprint: `${problem.family}:${Object.values(problem.variables).join(":")}`,
    },
  };
  const nativeRealization = {
    en: { language: "en", stem: realization.stem.en, explanation: realization.explanation.en, lines: realization.explanation.en.split(/\n/u) },
    hi: { language: "hi", stem: realization.stem.hi, explanation: realization.explanation.hi, lines: realization.explanation.hi.split(/\n/u) },
    pa: { language: "pa", stem: realization.stem.pa, explanation: realization.explanation.pa, lines: realization.explanation.pa.split(/\n/u) },
  };
  const realism = quality.metrics.editorialRealismScore;
  const difficultyPack = difficultyMetadata(problem);
  const examProfile = options?.examProfile ?? "ssc";

  return {
    text: realization.stem.en,
    textHi: realization.stem.hi,
    textPa: realization.stem.pa,
    options: optionsEn,
    optionsHi,
    optionsPa,
    correct: 0,
    explanation: realization.explanation.en,
    explanationHi: realization.explanation.hi,
    explanationPa: realization.explanation.pa,
    nativeRealization,
    nativeCoverage: { en: 1, hi: 1, pa: 1 },
    generationBackend: "quant-v2-interest",
    debugSource: "quant-v2-interest",
    proceduralLogic: { quantV2: { problem, reasoningGraph: graph }, validatorReports: { solverValidation } },
    languages: ["en", "hi", "pa"],
    reasoningGraph: graph,
    semanticMetadata,
    qualityMetrics: quality,
    localizationMetadata: { languages: ["en", "hi", "pa"], fallbackCount: 0 },
    pedagogicalMetrics: { explanationStepCount: graph.steps.length, directness: "clean" },
    section: pattern.section,
    topic: "interest",
    subtopic: problem.family,
    optionMetadata: optionsEn.map((value, index) => ({
      value,
      isCorrect: index === 0,
      ...(index === 0 ? {} : {
        distractorType: "interestTrap" as const,
        likelyMistake: problem.traps[index % problem.traps.length] ?? "interest base confusion",
        reasoningTrap: problem.traps[index % problem.traps.length] ?? "interest base confusion",
      }),
    })),
    examRealismMetadata: {
      examProfile: examProfile as ExamProfileId,
      wordingStyle: problem.complexity === "advanced" ? "inference-heavy" : "balanced",
      reasoningTraps: problem.traps,
      weightingSummary: ["Interest V2"],
      realismScore: realism,
      realismBand: realism >= 85 ? "strong" : "moderate",
      realismSignals: ["banking arithmetic", "exam-style interest base"],
      realismPenalties: [],
    },
    generationMetrics: {
      generationDurationMs: 0,
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: 1,
      clueDensity: 1,
      inferenceDepth: difficultyPack.difficultyMetadata.reasoningDepth,
      redundancyScore: 0,
      realismScore: realism,
    },
    debugMetadata: {
      selectedPattern: pattern.id,
      seed,
      generationId: problem.id,
      generationTimestamp: Date.now(),
      generationDomain: "quant-v2-interest",
      selectedMotif: problem.family,
      compatibilityWarnings: [],
      inferenceDepth: difficultyPack.difficultyMetadata.reasoningDepth,
      clueCount: graph.steps.length,
      validationRetries: 0,
      uniquenessFailures: 0,
      branchingFactor: 1,
      clueDensity: 1,
      redundancyScore: 0,
      generationMetrics: {
        generationDurationMs: 0,
        validationRetries: 0,
        uniquenessFailures: 0,
        branchingFactor: 1,
        clueDensity: 1,
        inferenceDepth: difficultyPack.difficultyMetadata.reasoningDepth,
        redundancyScore: 0,
        realismScore: realism,
      },
      quantV2: {
        canonicalProblem: problem,
        topology: problem.topology,
        signature: `${problem.family}|${Object.values(problem.variables).join("|")}`,
        reasoningGraph: graph,
        semanticMetadata,
        validatorReports: { solverValidation },
        solverValidation,
        localized: nativeRealization,
        category: problem.category,
        subtype: problem.subtype,
        scenario: problem.context.en,
        reasoningPattern: "interest",
        corpusFingerprints: semanticMetadata.corpusFingerprints,
        qualityMetrics: quality,
      },
      reasoningGraph: graph,
      semanticMetadata,
      localizationMetadata: { languages: ["en", "hi", "pa"] },
      pedagogicalMetrics: { explanationStepCount: graph.steps.length },
      validatorReports: { solverValidation },
      debugSource: "quant-v2-interest",
    },
    ...difficultyPack,
  };
}
