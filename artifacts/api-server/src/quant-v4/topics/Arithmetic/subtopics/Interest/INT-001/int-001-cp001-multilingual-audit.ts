import {
  INT_CP001_FINAL_QL_IDS,
  INT_CP001_FINAL_REGISTRY,
} from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import {
  assertIntCp001LocaleParity,
  generateIntCp001LocalizedQuestion,
} from "./cp001-localized-runtime";
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

const locales: readonly IntCp001Locale[] = ["hi", "pa"];
const perLocale = new Map<IntCp001Locale, {
  generated: number;
  stems: Set<string>;
  answers: Set<string>;
  positions: number[];
  sourceAdapters: Set<string>;
  qlStemCounts: Map<string, Set<string>>;
}>();

for (const locale of locales) {
  perLocale.set(locale, {
    generated: 0,
    stems: new Set(),
    answers: new Set(),
    positions: [0, 0, 0, 0],
    sourceAdapters: new Set(),
    qlStemCounts: new Map(),
  });
}

let parityChecks = 0;
let localizedValidationFailures = 0;
let publicLeaks = 0;
let optionFailures = 0;
let identityFailures = 0;

for (const entry of INT_CP001_FINAL_REGISTRY) {
  for (let index = 0; index < 80; index += 1) {
    const seed = `locale-${index}`;
    const english = generateIntCp001FinalEditorialV3Question(entry.qlId, seed);
    if (!english.validation.ok) fail(`${entry.qlId}/${seed}/en: ${english.validation.errors.join(" | ")}`);

    for (const locale of locales) {
      const item = generateIntCp001LocalizedQuestion(entry.qlId, seed, locale);
      const repeat = generateIntCp001LocalizedQuestion(entry.qlId, seed, locale);
      const stats = perLocale.get(locale)!;
      stats.generated += 1;

      if (stableBigIntJson(item) !== stableBigIntJson(repeat)) {
        fail(`${entry.qlId}/${seed}/${locale} is not deterministic.`);
      }
      assertIntCp001LocaleParity(english, item);
      parityChecks += 1;

      if (!item.validation.ok) {
        localizedValidationFailures += 1;
        fail(`${entry.qlId}/${seed}/${locale}: ${item.validation.errors.join(" | ")}`);
      }
      if (item.qlId !== entry.qlId || item.permanentQlId !== entry.qlId || item.solveContract !== entry.solveContract) {
        identityFailures += 1;
        fail(`${entry.qlId}/${seed}/${locale} lost permanent identity or solve-contract parity.`);
      }
      const expectedRelease = locale === "hi" ? INT_CP001_HINDI_RELEASE_ID : INT_CP001_PUNJABI_RELEASE_ID;
      if (item.releaseId !== expectedRelease) fail(`${entry.qlId}/${seed}/${locale} has the wrong locale release ID.`);
      if (item.options.length !== 4 || new Set(item.options).size !== 4) {
        optionFailures += 1;
        fail(`${entry.qlId}/${seed}/${locale} does not have four unique localized options.`);
      }
      if (item.optionAudit.filter((option) => option.misconceptionId === "CORRECT").length !== 1) {
        optionFailures += 1;
        fail(`${entry.qlId}/${seed}/${locale} has invalid correct-option metadata.`);
      }
      if (item.optionAudit[item.correctIndex]?.text !== item.options[item.correctIndex]) {
        optionFailures += 1;
        fail(`${entry.qlId}/${seed}/${locale} option audit is out of display order.`);
      }
      if (item.explanation.trapAnalysis.items.length !== 3) {
        fail(`${entry.qlId}/${seed}/${locale} does not analyse all distractors.`);
      }
      if (!item.explanation.stepByStep.conclusion.includes(item.options[item.correctIndex]!)) {
        fail(`${entry.qlId}/${seed}/${locale} conclusion does not state the localized answer.`);
      }
      if (item.publiclyPublishable || item.questionStudioDiscoverable) {
        publicLeaks += 1;
        fail(`${entry.qlId}/${seed}/${locale} breached publication safety.`);
      }
      if (item.questionBankStatus !== "NOT_STORED" || item.testEligibility !== "INELIGIBLE") {
        publicLeaks += 1;
        fail(`${entry.qlId}/${seed}/${locale} breached storage/test safety.`);
      }
      if (item.reviewStatus !== "PENDING_MULTILINGUAL_REVIEW" || item.localeReviewStatus !== "PENDING_HUMAN_REVIEW") {
        fail(`${entry.qlId}/${seed}/${locale} lost locale review-state safety.`);
      }

      stats.stems.add(item.stem);
      stats.answers.add(item.options[item.correctIndex]!);
      stats.positions[item.correctIndex] += 1;
      stats.sourceAdapters.add(`${item.internalProvenance.sourceKind}:${item.internalProvenance.sourcePrototypeId}`);
      const qlStems = stats.qlStemCounts.get(entry.qlId) ?? new Set<string>();
      qlStems.add(item.stem);
      stats.qlStemCounts.set(entry.qlId, qlStems);
    }
  }
}

for (const locale of locales) {
  const stats = perLocale.get(locale)!;
  if (stats.generated !== INT_CP001_FINAL_QL_IDS.length * 80) {
    fail(`${locale} generated ${stats.generated} questions instead of ${INT_CP001_FINAL_QL_IDS.length * 80}.`);
  }
  if (stats.positions.some((count) => count === 0)) fail(`${locale} does not reach all four answer positions.`);
  for (const entry of INT_CP001_FINAL_REGISTRY) {
    const count = stats.qlStemCounts.get(entry.qlId)?.size ?? 0;
    if (count < 20) fail(`${entry.qlId}/${locale} has insufficient localized stem diversity: ${count}.`);
    for (const source of entry.sourceAdapters) {
      const key = `${source.kind}:${source.prototypeId}`;
      if (!stats.sourceAdapters.has(key)) fail(`${entry.qlId}/${locale} did not exercise source adapter ${key}.`);
    }
  }
}

const hi = perLocale.get("hi")!;
const pa = perLocale.get("pa")!;
const crossLocaleStemCollisions = [...hi.stems].filter((stem) => pa.stems.has(stem)).length;
if (crossLocaleStemCollisions !== 0) fail(`Hindi/Punjabi exact stem collisions: ${crossLocaleStemCollisions}.`);

console.log(JSON.stringify({
  status: "PASS",
  editorialStandard: INT_CP001_MULTILINGUAL_STANDARD,
  cpId: "INT-CP-001",
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  seedsPerQl: 80,
  localizedQuestions: hi.generated + pa.generated,
  parityChecks,
  releases: {
    hi: INT_CP001_HINDI_RELEASE_ID,
    pa: INT_CP001_PUNJABI_RELEASE_ID,
  },
  locales: {
    hi: {
      generated: hi.generated,
      distinctStems: hi.stems.size,
      distinctAnswers: hi.answers.size,
      answerPositions: hi.positions,
      sourceAdapters: hi.sourceAdapters.size,
    },
    pa: {
      generated: pa.generated,
      distinctStems: pa.stems.size,
      distinctAnswers: pa.answers.size,
      answerPositions: pa.positions,
      sourceAdapters: pa.sourceAdapters.size,
    },
  },
  crossLocaleStemCollisions,
  localizedValidationFailures,
  optionFailures,
  identityFailures,
  publicLeaks,
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
  localeReviewStatus: "PENDING_HUMAN_REVIEW",
}, null, 2));
