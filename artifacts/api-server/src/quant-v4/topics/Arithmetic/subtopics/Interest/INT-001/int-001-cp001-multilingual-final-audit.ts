import { INT_CP001_FINAL_REGISTRY } from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import {
  assertIntCp001ApprovedLocaleParity,
  generateIntCp001ApprovedLocalizedQuestion,
} from "./cp001-localized-runtime-approved";
import { generateIntCp001ReleaseLocalizedQuestion } from "./cp001-localized-runtime-release";
import {
  INT_CP001_HINDI_RELEASE_ID,
  INT_CP001_MULTILINGUAL_STANDARD,
  INT_CP001_PUNJABI_RELEASE_ID,
  type IntCp001Locale,
} from "./cp001-multilingual-release";
import { stableBigIntJson } from "./cp001-localization-foundation";

function fail(message: string): never {
  throw new Error(message);
}

function approvalContentIdentity(value: Record<string, unknown>): string {
  const {
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    ...content
  } = value;
  return stableBigIntJson(content);
}

const locales: readonly IntCp001Locale[] = ["hi", "pa"];
const stats = Object.fromEntries(locales.map((locale) => [locale, {
  generated: 0,
  distinctStems: new Set<string>(),
  distinctAnswers: new Set<string>(),
  positions: [0, 0, 0, 0],
  adapters: new Set<string>(),
  stemsByQl: new Map<string, Set<string>>(),
}])) as Record<IntCp001Locale, {
  generated: number;
  distinctStems: Set<string>;
  distinctAnswers: Set<string>;
  positions: number[];
  adapters: Set<string>;
  stemsByQl: Map<string, Set<string>>;
}>;

let parityChecks = 0;
let approvalIdentityChecks = 0;
let trapChecks = 0;

for (const entry of INT_CP001_FINAL_REGISTRY) {
  for (let index = 0; index < 80; index += 1) {
    const seed = `locale-${index}`;
    const english = generateIntCp001FinalEditorialV3Question(entry.qlId, seed);
    if (!english.validation.ok) fail(`${entry.qlId}/${seed}/en: ${english.validation.errors.join(" | ")}`);

    for (const locale of locales) {
      const candidate = generateIntCp001ReleaseLocalizedQuestion(entry.qlId, seed, locale);
      const item = generateIntCp001ApprovedLocalizedQuestion(entry.qlId, seed, locale);
      const repeat = generateIntCp001ApprovedLocalizedQuestion(entry.qlId, seed, locale);
      const localeStats = stats[locale];

      if (stableBigIntJson(item) !== stableBigIntJson(repeat)) fail(`${entry.qlId}/${seed}/${locale} is not deterministic.`);
      assertIntCp001ApprovedLocaleParity(english, item);
      parityChecks += 1;

      if (
        approvalContentIdentity(item as unknown as Record<string, unknown>)
        !== approvalContentIdentity(candidate as unknown as Record<string, unknown>)
      ) {
        fail(`${entry.qlId}/${seed}/${locale} approval changed reviewed learner content or mathematics.`);
      }
      approvalIdentityChecks += 1;

      if (!item.validation.ok) fail(`${entry.qlId}/${seed}/${locale}: ${item.validation.errors.join(" | ")}`);
      if (item.qlId !== entry.qlId || item.solveContract !== entry.solveContract) fail(`${entry.qlId}/${seed}/${locale} lost identity.`);
      const expectedRelease = locale === "hi" ? INT_CP001_HINDI_RELEASE_ID : INT_CP001_PUNJABI_RELEASE_ID;
      if (item.releaseId !== expectedRelease) fail(`${entry.qlId}/${seed}/${locale} has incorrect release traceability.`);
      if (item.options.length !== 4 || new Set(item.options).size !== 4) fail(`${entry.qlId}/${seed}/${locale} lacks four unique options.`);
      if (item.optionAudit[item.correctIndex]?.misconceptionId !== "CORRECT") fail(`${entry.qlId}/${seed}/${locale} lost correct-index parity.`);
      if (item.optionAudit[item.correctIndex]?.text !== item.options[item.correctIndex]) fail(`${entry.qlId}/${seed}/${locale} option audit is out of display order.`);
      if (item.explanation.trapAnalysis.items.length !== 3) fail(`${entry.qlId}/${seed}/${locale} lacks three trap explanations.`);
      if (new Set(item.explanation.trapAnalysis.items.map((trap) => trap.explanation)).size !== 3) {
        fail(`${entry.qlId}/${seed}/${locale} has repeated distractor explanations.`);
      }
      for (const trap of item.explanation.trapAnalysis.items) {
        trapChecks += 1;
        if (trap.optionNumber - 1 === item.correctIndex) fail(`${entry.qlId}/${seed}/${locale} analyses the correct option as a trap.`);
        if (trap.optionText !== item.options[trap.optionNumber - 1]) fail(`${entry.qlId}/${seed}/${locale} trap option is out of sync.`);
        if (!trap.explanation.trim()) fail(`${entry.qlId}/${seed}/${locale} contains an empty trap explanation.`);
      }
      if (!item.explanation.stepByStep.conclusion.includes(item.options[item.correctIndex]!)) {
        fail(`${entry.qlId}/${seed}/${locale} conclusion omits the displayed answer.`);
      }
      if (/%%|%\\%/u.test([item.stem, ...item.options, ...item.explanation.stepByStep.steps].join(" "))) {
        fail(`${entry.qlId}/${seed}/${locale} contains malformed percentage notation.`);
      }
      if (
        item.maturity !== "APPROVED_MULTILINGUAL_CONTRACT"
        || item.reviewStatus !== "APPROVED_MULTILINGUAL_CONTRACT"
        || item.localeReviewStatus !== "APPROVED_HUMAN_REVIEW"
      ) {
        fail(`${entry.qlId}/${seed}/${locale} has incorrect approval status.`);
      }
      if (
        candidate.reviewStatus !== "PENDING_MULTILINGUAL_REVIEW"
        || candidate.localeReviewStatus !== "PENDING_HUMAN_REVIEW"
      ) {
        fail(`${entry.qlId}/${seed}/${locale} candidate evidence was mutated during approval.`);
      }
      if (item.questionBankStatus !== "NOT_STORED" || item.testEligibility !== "INELIGIBLE") {
        fail(`${entry.qlId}/${seed}/${locale} breached storage/test safety.`);
      }
      if (item.publiclyPublishable || item.questionStudioDiscoverable) fail(`${entry.qlId}/${seed}/${locale} breached publication safety.`);

      localeStats.generated += 1;
      localeStats.distinctStems.add(item.stem);
      localeStats.distinctAnswers.add(item.options[item.correctIndex]!);
      localeStats.positions[item.correctIndex] += 1;
      localeStats.adapters.add(`${item.internalProvenance.sourceKind}:${item.internalProvenance.sourcePrototypeId}`);
      const qlStems = localeStats.stemsByQl.get(entry.qlId) ?? new Set<string>();
      qlStems.add(item.stem);
      localeStats.stemsByQl.set(entry.qlId, qlStems);
    }
  }
}

for (const locale of locales) {
  const localeStats = stats[locale];
  if (localeStats.generated !== 1680) fail(`${locale} generated ${localeStats.generated}/1680 questions.`);
  if (localeStats.positions.some((count) => count === 0)) fail(`${locale} did not reach every answer position.`);
  for (const entry of INT_CP001_FINAL_REGISTRY) {
    const stemCount = localeStats.stemsByQl.get(entry.qlId)?.size ?? 0;
    if (stemCount < 20) fail(`${entry.qlId}/${locale} has only ${stemCount} distinct stems.`);
    for (const source of entry.sourceAdapters) {
      const key = `${source.kind}:${source.prototypeId}`;
      if (!localeStats.adapters.has(key)) fail(`${entry.qlId}/${locale} did not exercise ${key}.`);
    }
  }
}

const exactCrossLocaleCollisions = [...stats.hi.distinctStems].filter((stem) => stats.pa.distinctStems.has(stem)).length;
if (exactCrossLocaleCollisions !== 0) fail(`Hindi/Punjabi exact stem collisions: ${exactCrossLocaleCollisions}.`);

console.log(JSON.stringify({
  status: "PASS",
  cpId: "INT-CP-001",
  editorialStandard: INT_CP001_MULTILINGUAL_STANDARD,
  qlCount: 21,
  seedsPerQl: 80,
  localizedQuestions: stats.hi.generated + stats.pa.generated,
  parityChecks,
  approvalIdentityChecks,
  trapChecks,
  exactCrossLocaleCollisions,
  releases: { hi: INT_CP001_HINDI_RELEASE_ID, pa: INT_CP001_PUNJABI_RELEASE_ID },
  locales: {
    hi: {
      generated: stats.hi.generated,
      distinctStems: stats.hi.distinctStems.size,
      distinctAnswers: stats.hi.distinctAnswers.size,
      answerPositions: stats.hi.positions,
      adapters: stats.hi.adapters.size,
    },
    pa: {
      generated: stats.pa.generated,
      distinctStems: stats.pa.distinctStems.size,
      distinctAnswers: stats.pa.distinctAnswers.size,
      answerPositions: stats.pa.positions,
      adapters: stats.pa.adapters.size,
    },
  },
  maturity: "APPROVED_MULTILINGUAL_CONTRACT",
  reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT",
  localeReviewStatus: "APPROVED_HUMAN_REVIEW",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));
