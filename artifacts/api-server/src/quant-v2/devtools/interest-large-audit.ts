import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2InterestQuestionCandidate } from "../../lib/quant-v2/interest-admin-adapter";
import { INTEREST_FAMILY_IDS } from "../canonical/interest-motif-factories";
import type { InterestFamilyId } from "../canonical/interest-types";
import {
  createCorpusSchedulerState,
  extractCorpusSchedulerMetadata,
  interleaveScheduledPreviewQuestions,
  summarizeCorpusScheduler,
} from "../corpus-scheduler/corpus-scheduler";
import {
  interestDegenerateReasons,
  validateInterestIndependentSolver,
} from "../validators/interest-independent-solver";

const interestPattern: Pattern = {
  id: "interest-large-audit",
  type: "formula",
  section: "Quant",
  topic: "interest",
  subtopic: "interest",
  difficulty: "Medium",
  templateVariants: ["Interest V2 large audit pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-interest",
};

const BANNED_OPENERS = [
  "in a bank calculation",
  "for a finance-company record",
  "for a finance company record",
  "in an exam-style interest case",
  "in an exam style interest case",
  "a clerk records that",
  "एक बैंक गणना में",
  "एक वित्त कंपनी के रिकॉर्ड में",
  "एक परीक्षा-शैली ब्याज प्रश्न में",
  "एक क्लर्क लिखता है",
  "ਇੱਕ ਬੈਂਕ ਗਿਣਤੀ ਵਿੱਚ",
  "ਇੱਕ ਫਾਇਨੈਂਸ ਕੰਪਨੀ ਦੇ ਰਿਕਾਰਡ ਵਿੱਚ",
  "ਇੱਕ ਪ੍ਰੀਖਿਆ-ਸ਼ੈਲੀ ਵਿਆਜ ਪ੍ਰਸ਼ਨ ਵਿੱਚ",
  "ਇੱਕ ਕਲਰਕ ਲਿਖਦਾ ਹੈ",
] as const;

type AuditExample = {
  index: number;
  family: string;
  topology: string;
  realism: number;
  issue: string;
  question: string;
  answer: string;
  details?: Record<string, unknown>;
};

function argValue(name: string) {
  const eqPrefix = `--${name}=`;
  const eqMatch = process.argv.find((arg) => arg.startsWith(eqPrefix));
  if (eqMatch) return eqMatch.slice(eqPrefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseCount() {
  const raw = Number(argValue("count") ?? "500");
  if (!Number.isFinite(raw)) return 500;
  return Math.max(1, Math.min(2000, Math.floor(raw)));
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[₹,]/gu, "")
    .replace(/[^\p{L}\p{N}.%]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function duplicateFingerprint(question: FormulaQuestion) {
  return [
    normalizeText(question.text),
    normalizeText(answerText(question)),
    [...(question.options ?? [])].map(normalizeText).sort().join("|"),
  ].join("::");
}

function topologyNumericAnswerFingerprint(question: FormulaQuestion) {
  const problem = problemOf(question);
  const values = Object.entries(problem?.variables ?? {})
    .filter(([key, value]) =>
      typeof value === "number" &&
      Number.isFinite(value) &&
      !/trap|distractor/u.test(key),
    )
    .map(([key, value]) => `${key}:${Number((value as number).toFixed(6))}`)
    .sort()
    .join("|");
  return `${topologyOf(question)}::${values}::${normalizeText(answerText(question))}`;
}

function explanationText(question: FormulaQuestion) {
  return `${question.explanation ?? ""}\n${question.explanationHi ?? ""}\n${question.explanationPa ?? ""}`;
}

function malformedMathJax(question: FormulaQuestion) {
  const text = explanationText(question);
  const inlineOpen = (text.match(/\\\(/gu) ?? []).length;
  const inlineClose = (text.match(/\\\)/gu) ?? []).length;
  const displayOpen = (text.match(/\\\[/gu) ?? []).length;
  const displayClose = (text.match(/\\\]/gu) ?? []).length;
  if (inlineOpen !== inlineClose || displayOpen !== displayClose) return true;
  return /(?:P\s*[×x*]\s*R\s*[×x*]\s*T\s*\/\s*100|\(1\s*\+\s*r\)\^n|final index|first interest \+ balance interest|Compound multiplier|Interest equation)/u.test(text);
}

function directFormulaHard(question: FormulaQuestion) {
  const family = familyOf(question);
  return /^(?:int_si_from_prt|int_si_amount_from_prt|int_si_principal_from_si_rt|int_si_rate_from_si_pt|int_si_time_from_si_pr|int_ci_amount_annual|int_ci_from_amount|int_ci_principal_from_amount|int_ci_rate_from_amount|int_ci_time_from_amount|int_ci_two_year_formula|int_ci_three_year_formula)$/u.test(family) &&
    String(question.difficulty ?? "").toLowerCase() === "hard";
}

function bareEquationFragment(question: FormulaQuestion) {
  const lines = explanationText(question).split(/\r?\n/u).map((line) => line.trim()).filter(Boolean);
  return lines.some((line) => /^=\s*-?(?:â‚¹|₹)?\d/u.test(line)) ||
    lines.some((line, index) => /:$/u.test(line) && /^=\s*-?(?:â‚¹|₹)?\d/u.test(lines[index + 1] ?? "")) ||
    /using\s+the\s+[^.\n]*formula:\s*\n\s*=/iu.test(explanationText(question));
}

function missingRequiredFormula(question: FormulaQuestion) {
  const family = familyOf(question);
  const text = explanationText(question);
  if (/(?:ci_si|hybrid_si_ci|si_ci_amount_difference|rate_from_ci|principal_from_ci)/u.test(family)) {
    return !/SI\s*=\s*\\frac/u.test(text) || !/CI\s*=\s*P\\left/u.test(text) || !/\\text\{Difference\}/u.test(text);
  }
  if (/partial.*(?:discharge|payment)|discharge.*timeline/u.test(family)) {
    return !/I_1\s*=\s*\\frac/u.test(text) || !/\\text\{Balance\}/u.test(text) || !/I_2\s*=\s*\\frac/u.test(text);
  }
  if (/(?:installment|loan_repayment|find_installment|principal_from_installments)/u.test(family)) {
    return !/A\s*=\s*P\\left/u.test(text) || !/X\s*=\s*\\frac\{A\}/u.test(text);
  }
  if (/^(?:int_si_from_prt|int_si_amount_from_prt|int_si_principal_from_si_rt|int_si_rate_from_si_pt|int_si_time_from_si_pr)$/u.test(family)) {
    return !/SI\s*=\s*\\frac\{P \\times R \\times T\}\{100\}/u.test(text);
  }
  if (/^(?:int_ci_amount_annual|int_ci_from_amount|int_ci_principal_from_amount|int_ci_rate_from_amount|int_ci_time_from_amount|int_ci_two_year_formula|int_ci_three_year_formula|int_ci_half_yearly|int_ci_quarterly|int_ci_monthly|int_ci_fractional_time_boundary)$/u.test(family)) {
    return !/A\s*=\s*P\\left\(1\+\\frac\{R\}\{100\}\\right\)\^T/u.test(text);
  }
  return false;
}

function basicFormulaRealismTooHigh(question: FormulaQuestion) {
  const family = familyOf(question);
  return /^(?:int_si_from_prt|int_si_amount_from_prt|int_ci_amount_annual|int_ci_from_amount)$/u.test(family) &&
    realismOf(question) > 80;
}

function familyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).familyKey;
}

function topologyOf(question: FormulaQuestion) {
  return extractCorpusSchedulerMetadata(question).topologyKey;
}

function macroFamily(family: string) {
  if (/^int_si_/u.test(family)) return "si_basic";
  if (/^int_ci_/u.test(family)) return "ci_basic";
  if (/bankers|present_worth|true_discount/u.test(family)) return "banker_discount";
  if (/installment|loan|partial_payment|discharge/u.test(family)) return "repayment";
  return family;
}

function problemOf(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 as any)?.canonicalProblem ??
    (question.semanticMetadata as any)?.problem;
}

function realismOf(question: FormulaQuestion) {
  return Number(question.examRealismMetadata?.realismScore ?? 0);
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toRecord(map: Map<string, number>) {
  return Object.fromEntries([...map.entries()].sort((a, b) => b[1] - a[1]));
}

function addExample(
  examples: AuditExample[],
  question: FormulaQuestion,
  index: number,
  issue: string,
  details?: Record<string, unknown>,
) {
  if (examples.length >= 80) return;
  examples.push({
    index,
    family: familyOf(question),
    topology: topologyOf(question),
    realism: realismOf(question),
    issue,
    question: question.text,
    answer: answerText(question),
    details,
  });
}

function configuredFamilyCap(family: string, count: number) {
  if (count >= 500) {
    if (/from_prt|amount_from_prt|principal_from_si|rate_from_si|time_from_si/u.test(family)) return 35;
    if (/bankers|installment|partial|alligation|mixed|specific_year|nominal/u.test(family)) return 35;
    return 35;
  }
  return 3;
}

function validateQuestion(question: FormulaQuestion) {
  const problem = problemOf(question);
  const solver = validateInterestIndependentSolver({
    problem,
    explanation: question.explanation,
    options: question.options,
    correct: question.correct,
  });
  return [...solver.issues, ...interestDegenerateReasons(problem)];
}

function generateQuestions(count: number, seed: string) {
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: "interest_pyq",
  });
  const questions: FormulaQuestion[] = [];
  const keptFingerprints = new Set<string>();
  const keptTopologyNumericFingerprints = new Set<string>();
  const keptFamilyCounts = new Map<string, number>();
  const keptFullOpenings = new Map<string, number>();
  const generationStats = {
    totalAttempts: 0,
    skippedCandidates: 0,
    replacementRegenerations: 0,
    localRejectReasons: {} as Record<string, number>,
  };
  const reject = (reason: string) => {
    generationStats.skippedCandidates += 1;
    generationStats.localRejectReasons[reason] =
      (generationStats.localRejectReasons[reason] ?? 0) + 1;
  };
  const maxAttempts = Math.max(count * 30, count + 2000);
  for (let attempt = 0; questions.length < count && attempt < maxAttempts; attempt += 1) {
    generationStats.totalAttempts += 1;
    const slot = questions.length + attempt;
    const family = INTEREST_FAMILY_IDS[slot % INTEREST_FAMILY_IDS.length]! as InterestFamilyId;
    if ((keptFamilyCounts.get(family) ?? 0) >= configuredFamilyCap(family, count)) {
      continue;
    }
    let question: FormulaQuestion;
    try {
      question = createQuantV2InterestQuestionCandidate(interestPattern, {
        seed: `${seed}:${attempt}:${family}`,
        forcedMotifId: family,
        targetDifficulty: attempt % 4 === 0 ? "Hard" : attempt % 3 === 0 ? "Easy" : "Medium",
        useCorpusScheduler: true,
      });
    } catch (error) {
      reject(`generation-error:${family}:${String((error as Error).message).slice(0, 80)}`);
      continue;
    }
    const issues = validateQuestion(question);
    if (issues.length) {
      reject(`validation:${issues[0]}`);
      continue;
    }
    const fingerprint = duplicateFingerprint(question);
    if (keptFingerprints.has(fingerprint)) {
      generationStats.replacementRegenerations += 1;
      reject("duplicate fingerprint");
      continue;
    }
    const topologyNumericFingerprint = topologyNumericAnswerFingerprint(question);
    if (keptTopologyNumericFingerprints.has(topologyNumericFingerprint)) {
      generationStats.replacementRegenerations += 1;
      reject("same topology numeric tuple answer");
      continue;
    }
    const openingKey = fullOpening(question);
    if ((keptFullOpenings.get(openingKey) ?? 0) >= 5) {
      generationStats.replacementRegenerations += 1;
      reject("full opening repetition cap");
      continue;
    }
    keptFingerprints.add(fingerprint);
    keptTopologyNumericFingerprints.add(topologyNumericFingerprint);
    keptFullOpenings.set(openingKey, (keptFullOpenings.get(openingKey) ?? 0) + 1);
    keptFamilyCounts.set(family, (keptFamilyCounts.get(family) ?? 0) + 1);
    questions.push(question);
  }
  const ordered = interleaveScheduledPreviewQuestions(questions, seed, familyOf);
  for (const question of ordered) {
    const metadata = extractCorpusSchedulerMetadata(question);
    state.acceptedCount += 1;
    state.familyCounts[metadata.familyKey] = (state.familyCounts[metadata.familyKey] ?? 0) + 1;
    state.topologyCounts[metadata.topologyKey] = (state.topologyCounts[metadata.topologyKey] ?? 0) + 1;
    state.topologyGroupCounts[metadata.topologyGroup] = (state.topologyGroupCounts[metadata.topologyGroup] ?? 0) + 1;
    state.difficultyCounts[metadata.difficulty] = (state.difficultyCounts[metadata.difficulty] ?? 0) + 1;
  }
  return { questions: ordered, generationStats, schedulerSummary: summarizeCorpusScheduler(state) };
}

function opening(question: FormulaQuestion, words: number) {
  return normalizeText(question.text).split(/\s+/u).slice(0, words).join(" ");
}

function fullOpening(question: FormulaQuestion) {
  return normalizeText(String(question.text ?? "").split(/[.?!]/u)[0] ?? "");
}

function hasReverseValueLeak(question: FormulaQuestion) {
  const problem = problemOf(question);
  const family = String(problem?.family ?? familyOf(question));
  if (!/(?:principal_from|rate_from|time_from|amount_ratio_find_rate|amount_ratio_find_time|investment_ratio)/u.test(family)) {
    return false;
  }
  if (problem?.answerKind === "ratio") return false;
  const answer = Number(problem?.answer);
  if (!Number.isFinite(answer)) return false;
  const exact = Number.isInteger(answer) ? String(answer) : String(Number(answer.toFixed(2)));
  const escaped = exact.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const rawStem = String(question.text ?? "").normalize("NFKC").toLowerCase();
  if (problem?.answerKind === "rate") {
    return new RegExp(`${escaped}\\s*%`, "u").test(rawStem);
  }
  if (problem?.answerKind === "time") {
    return new RegExp(`${escaped}\\s*(?:years?|वर्ष|ਸਾਲ)`, "u").test(rawStem);
  }
  return new RegExp(`₹\\s*${escaped}(?:\\D|$)`, "u").test(rawStem);
}

function topologyStemMismatch(question: FormulaQuestion) {
  const family = familyOf(question);
  const text = normalizeText(`${question.text} ${question.textHi ?? ""} ${question.textPa ?? ""}`);
  if (/(?:ci_si|rate_from_ci|principal_from_ci|hybrid_si_ci|si_ci_amount_difference)/u.test(family) && !/(?:ci|compound|चक्रवृद्धि|ਮਿਸ਼ਰਿਤ).*?(?:si|simple|साधारण|ਸਧਾਰਣ)|(?:si|simple|साधारण|ਸਧਾਰਣ).*?(?:ci|compound|चक्रवृद्धि|ਮਿਸ਼ਰਿਤ)/u.test(text)) {
    return "SI-CI family stem does not show both systems";
  }
  if (/amount_multiplier_gap/u.test(family) && !/(?:amounts? to|हो जाती|ਹੋ ਜਾਂਦੀ).*?(?:and|और|ਅਤੇ).*?(?:amounts? to|हो जाती|ਹੋ ਜਾਂਦੀ)/u.test(text)) {
    return "amount multiplier gap does not show two amounts at two times";
  }
  if (/specific_year|nth_year/u.test(family) && !/(?:year only|that year|only|केवल|ਸਿਰਫ਼)/u.test(text)) {
    return "specific-year CI does not ask for one year's interest";
  }
  if (/fractional_time_boundary/u.test(family) && !/(?:months?|days?|माह|दिन|ਮਹੀਨੇ|ਦਿਨ)/u.test(text)) {
    return "fractional-time CI lacks fractional time wording";
  }
  if (/(?:installment|loan_repayment)/u.test(family) && !/(?:installment|payment|किस्त|ਕਿਸ਼ਤ)/u.test(text)) {
    return "installment family stem lacks installment/payment context";
  }
  if (/(?:bankers|true_discount|present_worth|bill_due|bd_td)/u.test(family) && !/(?:due|discount|bill|worth|maturity|देय|छूट|मूल्य|ਬਿੱਲ|ਛੂਟ|ਮੁੱਲ|ਦੇਣਯੋਗ)/u.test(text)) {
    return "discount family stem lacks bill/discount/present-worth context";
  }
  if (/(?:part_principal|alligation|two_sums|weighted|investment|divide_total|same_interest|two_people)/u.test(family) && !/(?:split|divided|two|दो|ਦੋ|ਵੰਡ|बाँट)/u.test(text)) {
    return "split-investment family stem lacks split/two-part context";
  }
  return undefined;
}

async function writeProductionExport(questions: FormulaQuestion[]) {
  const folder = path.resolve("exports/interest-production-50");
  await mkdir(folder, { recursive: true });
  const corpus = [
    "# Interest V2 Production Export",
    "",
    ...questions.slice(0, 50).map((question, index) => [
      `[Q${index + 1}]`,
      `Family: ${familyOf(question)}`,
      `EN: ${question.text}`,
      `HI: ${question.textHi ?? ""}`,
      `PA: ${question.textPa ?? ""}`,
      `Options: ${(question.options ?? []).join(" | ")}`,
      `Answer: ${answerText(question)}`,
      `Explanation EN:\n${question.explanation}`,
      "",
    ].join("\n")),
  ].join("\n");
  await writeFile(path.join(folder, "corpus.txt"), corpus, "utf8");
  return folder;
}

async function writeReviewExport(questions: FormulaQuestion[]) {
  const folder = path.resolve("exports/interest-review-100");
  await mkdir(folder, { recursive: true });
  const corpus = [
    "# Interest V2 Review Export",
    "",
    ...questions.slice(0, 100).map((question, index) => [
      `[Q${index + 1}]`,
      `Family: ${familyOf(question)}`,
      `Difficulty: ${question.difficulty ?? ""}`,
      `Realism: ${realismOf(question)}`,
      `EN: ${question.text}`,
      `HI: ${question.textHi ?? ""}`,
      `PA: ${question.textPa ?? ""}`,
      `Options: ${(question.options ?? []).join(" | ")}`,
      `Answer: ${answerText(question)}`,
      `Explanation EN:\n${question.explanation}`,
      `Explanation HI:\n${question.explanationHi ?? ""}`,
      `Explanation PA:\n${question.explanationPa ?? ""}`,
      "",
    ].join("\n")),
  ].join("\n");
  await writeFile(path.join(folder, "corpus.txt"), corpus, "utf8");
  return folder;
}

async function main() {
  const count = parseCount();
  const seed = String(argValue("seed") ?? `interest-large:${count}`);
  const { questions, generationStats, schedulerSummary } = generateQuestions(count, seed);
  const familyDistribution = new Map<string, number>();
  const topologyDistribution = new Map<string, number>();
  const opening8 = new Map<string, number>();
  const openingFull = new Map<string, number>();
  const explanationIntro = new Map<string, number>();
  const worst: AuditExample[] = [];
  let solverMismatch = 0;
  let explanationMismatch = 0;
  let duplicateCount = 0;
  let undefinedCount = 0;
  let leakageCount = 0;
  let optionIssues = 0;
  let degenerateCount = 0;
  let bannedOpenerCount = 0;
  let reverseValueLeakage = 0;
  let topologyStemMismatchCount = 0;
  let malformedMathJaxCount = 0;
  let bareEquationFragmentCount = 0;
  let missingFormulaCount = 0;
  let awkwardGrammarCount = 0;
  let repeatedCiVsSiShellCount = 0;
  let directFormulaHardCount = 0;
  let basicFormulaRealismTooHighCount = 0;
  let topologyNumericDuplicateCount = 0;
  let lowRealism = 0;
  let realismMin = Number.POSITIVE_INFINITY;
  let realismMax = 0;
  let realismTotal = 0;
  const fingerprints = new Set<string>();
  const topologyNumericFingerprints = new Set<string>();

  questions.forEach((question, index) => {
    const family = familyOf(question);
    increment(familyDistribution, family);
    increment(topologyDistribution, topologyOf(question));
    increment(opening8, opening(question, 8));
    increment(openingFull, fullOpening(question));
    const intro = normalizeText(String(question.explanation ?? "").split(/\r?\n/u).find(Boolean) ?? "");
    increment(explanationIntro, intro);
    const realism = realismOf(question);
    realismTotal += realism;
    realismMin = Math.min(realismMin, realism);
    realismMax = Math.max(realismMax, realism);
    if (realism < 70) {
      lowRealism += 1;
      addExample(worst, question, index + 1, "low realism");
    }
    const fp = duplicateFingerprint(question);
    if (fingerprints.has(fp)) {
      duplicateCount += 1;
      addExample(worst, question, index + 1, "duplicate fingerprint");
    }
    fingerprints.add(fp);
    const textBlob = `${question.text} ${question.textHi} ${question.textPa} ${question.explanation} ${question.explanationHi} ${question.explanationPa} ${(question.options ?? []).join(" ")}`;
    if (/(?:year\(s\)|\b1 periods\b|\b2\/1 of itself\b|due amount is due|monthly saving account of|value of a furniture)/iu.test(textBlob)) {
      awkwardGrammarCount += 1;
      addExample(worst, question, index + 1, "awkward grammar shell");
    }
    if (/On ₹[\d,.]+, compare CI and SI/iu.test(String(question.text ?? ""))) {
      repeatedCiVsSiShellCount += 1;
      addExample(worst, question, index + 1, "repeated CI-vs-SI shell");
    }
    if (malformedMathJax(question)) {
      malformedMathJaxCount += 1;
      addExample(worst, question, index + 1, "malformed MathJax/raw formula");
    }
    if (bareEquationFragment(question)) {
      bareEquationFragmentCount += 1;
      addExample(worst, question, index + 1, "bare equation fragment");
    }
    if (missingRequiredFormula(question)) {
      missingFormulaCount += 1;
      addExample(worst, question, index + 1, "missing required formula");
    }
    if (directFormulaHard(question)) {
      directFormulaHardCount += 1;
      addExample(worst, question, index + 1, "direct formula marked Hard");
    }
    if (basicFormulaRealismTooHigh(question)) {
      basicFormulaRealismTooHighCount += 1;
      addExample(worst, question, index + 1, "basic formula realism too high");
    }
    const topologyNumericFingerprint = topologyNumericAnswerFingerprint(question);
    if (topologyNumericFingerprints.has(topologyNumericFingerprint)) {
      topologyNumericDuplicateCount += 1;
      addExample(worst, question, index + 1, "same topology/numeric tuple/answer");
    }
    topologyNumericFingerprints.add(topologyNumericFingerprint);
    if (/\b(?:undefined|null|NaN)\b/u.test(textBlob)) {
      undefinedCount += 1;
      addExample(worst, question, index + 1, "undefined/null/NaN");
    }
    const openerBlob = `${question.text ?? ""} ${question.textHi ?? ""} ${question.textPa ?? ""}`.normalize("NFKC").toLowerCase();
    const banned = BANNED_OPENERS.filter((phrase) => openerBlob.includes(phrase.toLowerCase()));
    if (banned.length) {
      bannedOpenerCount += 1;
      addExample(worst, question, index + 1, "banned artificial opener", { banned });
    }
    if (hasReverseValueLeak(question)) {
      reverseValueLeakage += 1;
      addExample(worst, question, index + 1, "reverse-value leakage");
    }
    const mismatch = topologyStemMismatch(question);
    if (mismatch) {
      topologyStemMismatchCount += 1;
      addExample(worst, question, index + 1, "topology/stem mismatch", { mismatch });
    }
    if (/\b(?:principal|compound interest|simple interest|Find|The)\b/u.test(`${question.textHi} ${question.textPa}`)) {
      leakageCount += 1;
      addExample(worst, question, index + 1, "HI/PA English leakage");
    }
    if (!question.options?.includes(answerText(question)) || new Set(question.options).size !== question.options.length) {
      optionIssues += 1;
      addExample(worst, question, index + 1, "option quality issue");
    }
    const problem = problemOf(question);
    const solver = validateInterestIndependentSolver({ problem, explanation: question.explanation, options: question.options, correct: question.correct });
    if (solver.issues.some((issue) => /answer mismatch/u.test(issue))) solverMismatch += 1;
    if (solver.issues.some((issue) => /explanation final/u.test(issue))) explanationMismatch += 1;
    const degenerate = interestDegenerateReasons(problem);
    if (degenerate.length) {
      degenerateCount += 1;
      addExample(worst, question, index + 1, "degenerate", { degenerate });
    }
  });

  const familyCapViolations = [...familyDistribution.entries()]
    .filter(([family, actual]) => actual > configuredFamilyCap(family, count))
    .map(([family, actual]) => ({ family, actual, cap: configuredFamilyCap(family, count) }));
  const repeatedOpeningViolations = [...opening8.entries()].filter(([, value]) => value > 15).length +
    [...openingFull.entries()].filter(([, value]) => value > 5).length;
  const firstWindows = [0, 1, 2, 3, 4].map((seedIndex) => {
    const sample = generateQuestions(Math.min(60, count), `${seed}:preview:${seedIndex}`).questions.slice(0, 6);
    return sample.map(familyOf);
  });
  const previewPass = firstWindows.every((families) => new Set(families).size >= 4 && new Set(families.slice(0, 3).map(macroFamily)).size > 1);
  const averageRealism = questions.length ? realismTotal / questions.length : 0;
  const status =
    questions.length === count &&
    solverMismatch === 0 &&
    explanationMismatch === 0 &&
    duplicateCount === 0 &&
    undefinedCount === 0 &&
    leakageCount === 0 &&
    optionIssues === 0 &&
    degenerateCount === 0 &&
    bannedOpenerCount === 0 &&
    reverseValueLeakage === 0 &&
    topologyStemMismatchCount === 0 &&
    malformedMathJaxCount === 0 &&
    bareEquationFragmentCount === 0 &&
    missingFormulaCount === 0 &&
    awkwardGrammarCount === 0 &&
    repeatedCiVsSiShellCount === 0 &&
    directFormulaHardCount === 0 &&
    basicFormulaRealismTooHighCount === 0 &&
    topologyNumericDuplicateCount === 0 &&
    familyCapViolations.length === 0 &&
    previewPass &&
    repeatedOpeningViolations === 0 &&
    averageRealism >= 80 &&
    lowRealism / Math.max(1, questions.length) < 0.05
      ? "PASS"
      : "FAIL";
  const exportFolder = await writeProductionExport(questions);
  const reviewExportFolder = await writeReviewExport(questions);
  const report = {
    status,
    totalGenerated: questions.length,
    requestedCount: count,
    averageRealism: Number(averageRealism.toFixed(2)),
    realismMin: Number((Number.isFinite(realismMin) ? realismMin : 0).toFixed(2)),
    realismMax: Number(realismMax.toFixed(2)),
    solverMismatch,
    explanationMismatch,
    duplicateFingerprint: duplicateCount,
    undefinedNullNaN: undefinedCount,
    hiPaEnglishLeakage: leakageCount,
    optionQualityIssues: optionIssues,
    degenerateCases: degenerateCount,
    bannedArtificialOpeners: bannedOpenerCount,
    reverseValueLeakage,
    topologyStemMismatch: topologyStemMismatchCount,
    malformedMathJax: malformedMathJaxCount,
    bareEquationFragments: bareEquationFragmentCount,
    missingRequiredFormula: missingFormulaCount,
    awkwardGrammar: awkwardGrammarCount,
    repeatedCiVsSiShell: repeatedCiVsSiShellCount,
    directFormulaHard: directFormulaHardCount,
    basicFormulaRealismTooHigh: basicFormulaRealismTooHighCount,
    topologyNumericDuplicate: topologyNumericDuplicateCount,
    lowRealism,
    familyCapViolations,
    firstWindowPreview: { pass: previewPass, firstWindows },
    repeatedOpening: {
      violations: repeatedOpeningViolations,
      topFirst8: [...opening8.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
      topFullOpening: [...openingFull.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
      topExplanationIntro: [...explanationIntro.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
    },
    familyDistribution: toRecord(familyDistribution),
    topologyDistribution: toRecord(topologyDistribution),
    difficultyDistribution: schedulerSummary.difficultyDistribution,
    generationStats,
    productionExportFolder: exportFolder,
    reviewExportFolder,
    worst20: worst.slice(0, 20),
  };
  console.log(JSON.stringify(report, null, 2));
  if (status !== "PASS") process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
