import { INT_CP001_FINAL_REGISTRY } from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import { generateIntCp001ApprovedV2LocalizedQuestion } from "./cp001-localized-runtime-v2-approved";
import {
  generateIntCp001ReadableEnglishQuestion,
  generateIntCp001ReadableLocalizedQuestion,
} from "./cp001-readable-stem-runtime";
import { getIntCp001CashFlowContextV2 } from "./cp001-cash-flow-context-v2";
import { stableBigIntJson, stripMath } from "./cp001-localization-foundation";
import {
  INT_CP001_ENGLISH_READABLE_RELEASE_ID,
  INT_CP001_HINDI_READABLE_RELEASE_ID,
  INT_CP001_PUNJABI_READABLE_RELEASE_ID,
  INT_CP001_READABLE_STEM_STANDARD,
  type IntCp001ReadableLanguage,
} from "./cp001-readable-stem-release";

function fail(message: string): never {
  throw new Error(message);
}

function invariantContent(value: Record<string, unknown>): string {
  const {
    releaseId: _releaseId,
    maturity: _maturity,
    reviewStatus: _reviewStatus,
    localeReviewStatus: _localeReviewStatus,
    stem: _stem,
    validation: _validation,
    stemPresentation: _stemPresentation,
    readabilityEditorialTrace: _readabilityEditorialTrace,
    ...content
  } = value;
  return stableBigIntJson(content);
}

function wordCount(value: string): number {
  return stripMath(value).trim().split(/\s+/u).filter(Boolean).length;
}

const languages: readonly IntCp001ReadableLanguage[] = ["en", "hi", "pa"];
const expectedReleases = {
  en: INT_CP001_ENGLISH_READABLE_RELEASE_ID,
  hi: INT_CP001_HINDI_READABLE_RELEASE_ID,
  pa: INT_CP001_PUNJABI_READABLE_RELEASE_ID,
} as const;

const stats = Object.fromEntries(languages.map((language) => [language, {
  generated: 0,
  changedStems: 0,
  distinctStems: new Set<string>(),
  approvedWords: 0,
  candidateWords: 0,
  approvedCharacters: 0,
  candidateCharacters: 0,
  maxWords: 0,
  maxCharacters: 0,
  answerPositions: [0, 0, 0, 0],
  qls: new Set<string>(),
  scenarios: new Set<string>(),
  directions: { BORROWER_PAYS: 0, INVESTOR_EARNS: 0, NEUTRAL_MATH: 0 },
}])) as Record<IntCp001ReadableLanguage, {
  generated: number;
  changedStems: number;
  distinctStems: Set<string>;
  approvedWords: number;
  candidateWords: number;
  approvedCharacters: number;
  candidateCharacters: number;
  maxWords: number;
  maxCharacters: number;
  answerPositions: number[];
  qls: Set<string>;
  scenarios: Set<string>;
  directions: Record<"BORROWER_PAYS" | "INVESTOR_EARNS" | "NEUTRAL_MATH", number>;
}>;

let invariantChecks = 0;
let deterministicChecks = 0;
let presentationChecks = 0;
let cashFlowTraceChecks = 0;
let lifecycleChecks = 0;
let distractorChecks = 0;
let loadChecks = 0;
let crossLocaleCollisions = 0;

for (const entry of INT_CP001_FINAL_REGISTRY) {
  for (let index = 0; index < 80; index += 1) {
    const seed = `readable-stem-${index}`;
    const approved = {
      en: generateIntCp001FinalEditorialV3Question(entry.qlId, seed),
      hi: generateIntCp001ApprovedV2LocalizedQuestion(entry.qlId, seed, "hi"),
      pa: generateIntCp001ApprovedV2LocalizedQuestion(entry.qlId, seed, "pa"),
    } as const;
    const candidates = {
      en: generateIntCp001ReadableEnglishQuestion(entry.qlId, seed),
      hi: generateIntCp001ReadableLocalizedQuestion(entry.qlId, seed, "hi"),
      pa: generateIntCp001ReadableLocalizedQuestion(entry.qlId, seed, "pa"),
    } as const;

    if (candidates.hi.stem === candidates.pa.stem) crossLocaleCollisions += 1;

    for (const language of languages) {
      const previous = approved[language];
      const item = candidates[language];
      const repeat = language === "en"
        ? generateIntCp001ReadableEnglishQuestion(entry.qlId, seed)
        : generateIntCp001ReadableLocalizedQuestion(entry.qlId, seed, language);
      const localeStats = stats[language];

      if (!previous.validation.ok) fail(`${entry.qlId}/${seed}/${language} approved source is invalid.`);
      if (!item.validation.ok) fail(`${entry.qlId}/${seed}/${language}: ${item.validation.errors.join(" | ")}`);
      if (stableBigIntJson(item) !== stableBigIntJson(repeat)) fail(`${entry.qlId}/${seed}/${language} is not deterministic.`);
      deterministicChecks += 1;

      if (invariantContent(previous as unknown as Record<string, unknown>) !== invariantContent(item as unknown as Record<string, unknown>)) {
        fail(`${entry.qlId}/${seed}/${language} changed content outside the readable-stem boundary.`);
      }
      invariantChecks += 1;

      if (item.releaseId !== expectedReleases[language]) fail(`${entry.qlId}/${seed}/${language} has wrong readable release ID.`);
      if (item.maturity !== "READABLE_STEM_EDITORIAL_CANDIDATE") fail(`${entry.qlId}/${seed}/${language} bypassed candidate maturity.`);
      if (item.reviewStatus !== "PENDING_MULTILINGUAL_READABILITY_REVIEW" || item.localeReviewStatus !== "PENDING_HUMAN_REVIEW") {
        fail(`${entry.qlId}/${seed}/${language} bypassed human review.`);
      }
      if (item.questionBankStatus !== "NOT_STORED" || item.testEligibility !== "INELIGIBLE") {
        fail(`${entry.qlId}/${seed}/${language} breached storage/test locks.`);
      }
      if (item.publiclyPublishable || item.questionStudioDiscoverable) {
        fail(`${entry.qlId}/${seed}/${language} breached publication/routing locks.`);
      }
      lifecycleChecks += 1;

      if (item.stemPresentation.plainText !== item.stem) fail(`${entry.qlId}/${seed}/${language} plain stem presentation drifted.`);
      if (!item.stemPresentation.richTextHtml.startsWith("<p>") || !item.stemPresentation.richTextHtml.includes("<strong")) {
        fail(`${entry.qlId}/${seed}/${language} lacks safe rich-text scan anchors.`);
      }
      if (item.stem.includes("**") || item.stemPresentation.richTextHtml.includes("**")) {
        fail(`${entry.qlId}/${seed}/${language} contains raw Markdown emphasis.`);
      }
      if (item.stemPresentation.emphasisSpans.length < 2) fail(`${entry.qlId}/${seed}/${language} lacks at least two scan anchors.`);
      for (const span of item.stemPresentation.emphasisSpans) {
        if (item.stem.slice(span.start, span.end) !== span.text) fail(`${entry.qlId}/${seed}/${language} has an invalid emphasis span.`);
      }
      presentationChecks += 1;

      const cashFlow = getIntCp001CashFlowContextV2(item.internalProvenance.sourceParameters);
      if (
        item.readabilityEditorialTrace.scenarioId !== cashFlow.scenarioId
        || item.readabilityEditorialTrace.cashFlowDirection !== cashFlow.direction
      ) {
        fail(`${entry.qlId}/${seed}/${language} has incorrect cash-flow traceability.`);
      }
      cashFlowTraceChecks += 1;

      if (item.options.length !== 4 || new Set(item.options).size !== 4) fail(`${entry.qlId}/${seed}/${language} lacks four unique options.`);
      if (item.optionAudit[item.correctIndex]?.misconceptionId !== "CORRECT") fail(`${entry.qlId}/${seed}/${language} lost answer ownership.`);
      if (item.explanation.trapAnalysis.items.length !== 3) fail(`${entry.qlId}/${seed}/${language} lacks three distractor explanations.`);
      for (const trap of item.explanation.trapAnalysis.items) {
        distractorChecks += 1;
        if (trap.optionNumber - 1 === item.correctIndex) fail(`${entry.qlId}/${seed}/${language} analyses the correct option as a trap.`);
        if (trap.optionText !== item.options[trap.optionNumber - 1]) fail(`${entry.qlId}/${seed}/${language} has an out-of-sync trap.`);
      }

      const candidateWords = wordCount(item.stem);
      if (candidateWords > 45) fail(`${entry.qlId}/${seed}/${language} exceeds the 45-word stem ceiling (${candidateWords}).`);
      if (item.stem.length > 260) fail(`${entry.qlId}/${seed}/${language} exceeds the 260-character stem ceiling (${item.stem.length}).`);
      loadChecks += 1;

      localeStats.generated += 1;
      localeStats.changedStems += item.stem !== previous.stem ? 1 : 0;
      localeStats.distinctStems.add(item.stem);
      localeStats.approvedWords += wordCount(previous.stem);
      localeStats.candidateWords += candidateWords;
      localeStats.approvedCharacters += previous.stem.length;
      localeStats.candidateCharacters += item.stem.length;
      localeStats.maxWords = Math.max(localeStats.maxWords, candidateWords);
      localeStats.maxCharacters = Math.max(localeStats.maxCharacters, item.stem.length);
      localeStats.answerPositions[item.correctIndex] += 1;
      localeStats.qls.add(entry.qlId);
      localeStats.scenarios.add(cashFlow.scenarioId);
      localeStats.directions[cashFlow.direction] += 1;
    }
  }
}

for (const language of languages) {
  const localeStats = stats[language];
  if (localeStats.generated !== 1680) fail(`${language} generated ${localeStats.generated}/1680 candidates.`);
  if (localeStats.changedStems !== 1680) fail(`${language} did not replace every approved stem.`);
  if (localeStats.qls.size !== 21) fail(`${language} did not cover all 21 QLs.`);
  if (localeStats.directions.BORROWER_PAYS === 0 || localeStats.directions.INVESTOR_EARNS === 0) {
    fail(`${language} did not exercise both cash-flow directions.`);
  }
  if (localeStats.directions.NEUTRAL_MATH !== 0) fail(`${language} encountered an unclassified source scenario.`);
  if (localeStats.answerPositions.some((count) => count === 0)) fail(`${language} did not cover every answer position.`);
  if (localeStats.distinctStems.size < 1200) fail(`${language} has insufficient stem diversity: ${localeStats.distinctStems.size}.`);

  const averageWords = localeStats.candidateWords / localeStats.generated;
  const averageCharacters = localeStats.candidateCharacters / localeStats.generated;
  if (averageWords > 30) fail(`${language} exceeds the 30-word average ceiling (${averageWords.toFixed(2)}).`);
  if (averageCharacters > 175) fail(`${language} exceeds the 175-character average ceiling (${averageCharacters.toFixed(2)}).`);
  if (language !== "en" && localeStats.candidateWords > localeStats.approvedWords) {
    fail(`${language} readable stems are longer in aggregate than the approved locale stems.`);
  }
}
if (crossLocaleCollisions !== 0) fail(`Hindi/Punjabi exact stem collisions: ${crossLocaleCollisions}.`);

console.log(JSON.stringify({
  status: "PASS_INT_CP001_READABLE_STEM_RELEASE_CANDIDATES",
  cpId: "INT-CP-001",
  editorialStandard: INT_CP001_READABLE_STEM_STANDARD,
  qlCount: 21,
  seedsPerQl: 80,
  totalCandidates: stats.en.generated + stats.hi.generated + stats.pa.generated,
  invariantChecks,
  deterministicChecks,
  presentationChecks,
  cashFlowTraceChecks,
  lifecycleChecks,
  distractorChecks,
  loadChecks,
  crossLocaleCollisions,
  releases: expectedReleases,
  loadPolicy: {
    maximumWordsPerStem: 45,
    maximumCharactersPerStem: 260,
    maximumAverageWordsPerLanguage: 30,
    maximumAverageCharactersPerLanguage: 175,
  },
  locales: Object.fromEntries(languages.map((language) => [language, {
    generated: stats[language].generated,
    changedStems: stats[language].changedStems,
    distinctStems: stats[language].distinctStems.size,
    approvedWords: stats[language].approvedWords,
    candidateWords: stats[language].candidateWords,
    wordChangePercent: Number((((stats[language].candidateWords / stats[language].approvedWords) - 1) * 100).toFixed(2)),
    averageCandidateWords: Number((stats[language].candidateWords / stats[language].generated).toFixed(2)),
    approvedCharacters: stats[language].approvedCharacters,
    candidateCharacters: stats[language].candidateCharacters,
    characterChangePercent: Number((((stats[language].candidateCharacters / stats[language].approvedCharacters) - 1) * 100).toFixed(2)),
    averageCandidateCharacters: Number((stats[language].candidateCharacters / stats[language].generated).toFixed(2)),
    maxWords: stats[language].maxWords,
    maxCharacters: stats[language].maxCharacters,
    answerPositions: stats[language].answerPositions,
    qlCoverage: stats[language].qls.size,
    scenarios: [...stats[language].scenarios].sort(),
    directions: stats[language].directions,
  }])),
  maturity: "READABLE_STEM_EDITORIAL_CANDIDATE",
  reviewStatus: "PENDING_MULTILINGUAL_READABILITY_REVIEW",
  localeReviewStatus: "PENDING_HUMAN_REVIEW",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
}, null, 2));
