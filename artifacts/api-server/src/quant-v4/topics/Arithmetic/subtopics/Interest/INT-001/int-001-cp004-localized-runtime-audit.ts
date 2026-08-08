import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP004_QL_IDS,
  eq,
} from "./cp004-frequency-math";
import { generateIntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  INT_CP004_LOCALIZED_LOCALES,
  assertCp004LocalizedText,
} from "./cp004-localization-language-pack";
import {
  generateIntCp004LocalizedQuestion,
  localizeIntCp004EnglishFrozenQuestion,
} from "./cp004-localized-runtime";

function fail(message: string): never {
  throw new Error(message);
}

function assertFrozen(value: unknown, label: string, seen = new WeakSet<object>()): number {
  if (typeof value !== "object" || value === null) return 0;
  const objectValue = value as object;
  if (seen.has(objectValue)) return 0;
  seen.add(objectValue);
  if (!Object.isFrozen(value)) fail(`${label}: object is not frozen.`);
  let checks = 1;
  for (const key of Reflect.ownKeys(objectValue)) {
    checks += assertFrozen((objectValue as Record<PropertyKey, unknown>)[key], `${label}.${String(key)}`, seen);
  }
  return checks;
}

let questionCases = 0;
let deterministicChecks = 0;
let identityChecks = 0;
let mathematicalStateChecks = 0;
let solutionChecks = 0;
let registryChecks = 0;
let presentationParityChecks = 0;
let optionParityChecks = 0;
let correctIndexChecks = 0;
let explanationChecks = 0;
let localizationMetadataChecks = 0;
let lifecycleChecks = 0;
let frozenObjectChecks = 0;
let scriptChecks = 0;
const localeCounts: Record<string, number> = {};
const qlCounts: Record<string, number> = {};
const representationCoverage: Record<string, Set<string>> = {};
const answerPositions = [0, 0, 0, 0];

for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  representationCoverage[locale] = new Set<string>();
  for (const qlId of INT_CP004_QL_IDS) {
    for (let index = 0; index < 100; index += 1) {
      const seed = `int-cp004-localized-runtime:${qlId}:${index}`;
      const source = generateIntCp004EnglishFrozenQuestion(qlId, seed);
      const localized = localizeIntCp004EnglishFrozenQuestion(source, locale);
      const replay = generateIntCp004LocalizedQuestion({ qlId, seed, locale });
      questionCases += 1;
      localeCounts[locale] = (localeCounts[locale] ?? 0) + 1;
      qlCounts[`${locale}/${qlId}`] = (qlCounts[`${locale}/${qlId}`] ?? 0) + 1;

      deterministicChecks += 1;
      if (JSON.stringify(localized, (_, value) => typeof value === "bigint" ? value.toString() : value)
        !== JSON.stringify(replay, (_, value) => typeof value === "bigint" ? value.toString() : value)) {
        fail(`${qlId}/${seed}/${locale}: localized runtime is not deterministic.`);
      }

      identityChecks += 6;
      if (
        localized.packageId !== source.packageId
        || localized.canonicalProblemId !== source.canonicalProblemId
        || localized.permanentQlId !== source.permanentQlId
        || localized.qlId !== source.qlId
        || localized.seed !== source.seed
        || localized.freezeId !== source.freezeId
      ) {
        fail(`${qlId}/${seed}/${locale}: frozen identity changed.`);
      }

      mathematicalStateChecks += 1;
      if (localized.mathematicalState !== source.mathematicalState) {
        fail(`${qlId}/${seed}/${locale}: mathematical state was copied or changed instead of preserved.`);
      }

      solutionChecks += 1;
      if (!eq(localized.solution, source.solution)) fail(`${qlId}/${seed}/${locale}: canonical solution changed.`);

      registryChecks += 3;
      if (
        localized.solveContract !== source.solveContract
        || localized.answerSemantic !== source.answerSemantic
        || localized.difficulty !== source.difficulty
      ) {
        fail(`${qlId}/${seed}/${locale}: frozen registry contract changed.`);
      }

      presentationParityChecks += 2;
      if (
        localized.representation !== source.representation
        || localized.stemFamilyId !== source.stemFamilyId
      ) {
        fail(`${qlId}/${seed}/${locale}: frozen presentation ownership changed.`);
      }
      representationCoverage[locale]!.add(localized.representation);

      if (localized.options.length !== source.options.length) {
        fail(`${qlId}/${seed}/${locale}: option count changed.`);
      }
      for (let optionIndex = 0; optionIndex < source.options.length; optionIndex += 1) {
        const canonical = source.options[optionIndex]!;
        const option = localized.options[optionIndex]!;
        optionParityChecks += 4;
        if (
          option.id !== canonical.id
          || !eq(option.value, canonical.value)
          || option.isCorrect !== canonical.isCorrect
          || option.misconceptionId !== canonical.misconceptionId
        ) {
          fail(`${qlId}/${seed}/${locale}/${option.id}: option parity changed.`);
        }
      }

      correctIndexChecks += 2;
      if (localized.correctIndex !== source.correctIndex || localized.correctAnswer !== localized.options[localized.correctIndex]!.text) {
        fail(`${qlId}/${seed}/${locale}: correct-answer ownership changed.`);
      }
      answerPositions[localized.correctIndex] = (answerPositions[localized.correctIndex] ?? 0) + 1;

      explanationChecks += 4;
      if (
        !localized.explanation.whatAsked
        || localized.explanation.steps.length < 2
        || !localized.explanation.finalAnswer.includes(localized.correctAnswer)
        || !localized.explanation.commonMistake
      ) {
        fail(`${qlId}/${seed}/${locale}: localized explanation structure is incomplete.`);
      }

      localizationMetadataChecks += 15;
      const metadata = localized.localization;
      if (
        metadata.canonicalFreezeId !== source.freezeId
        || metadata.canonicalSeed !== source.seed
        || metadata.canonicalQlId !== source.qlId
        || metadata.locale !== locale
        || metadata.status !== "EXECUTABLE_REVIEW_REQUIRED"
        || !metadata.mathematicalStatePreserved
        || !metadata.solutionPreserved
        || !metadata.optionValuesPreserved
        || !metadata.optionOrderPreserved
        || !metadata.correctIndexPreserved
        || !metadata.misconceptionIdsPreserved
        || !metadata.representationPreserved
        || !metadata.stemFamilyPreserved
        || !metadata.explanationStructurePreserved
        || !metadata.lifecycleLocked
      ) {
        fail(`${qlId}/${seed}/${locale}: localization metadata contract is incomplete.`);
      }

      lifecycleChecks += 12;
      if (
        localized.editorialStatus !== "MULTILINGUAL_LOCALISATION_REVIEW"
        || localized.approvalStatus !== "LOCALIZED_REVIEW_REQUIRED"
        || localized.allocationStatus !== "INACTIVE_LOCALISATION_REVIEW"
        || localized.enabled
        || localized.stagingStatus !== "NOT_STAGED"
        || localized.registrationStatus !== "NOT_REGISTERED"
        || localized.questionStudioDiscoverable
        || localized.questionBankStatus !== "NOT_STORED"
        || localized.testEligibility !== "INELIGIBLE"
        || localized.publiclyPublishable
        || localized.lifecycle.maturity !== "MULTILINGUAL_LOCALISATION_REVIEW"
        || localized.lifecycle.reviewStatus !== "LOCALIZED_REVIEW_REQUIRED"
      ) {
        fail(`${qlId}/${seed}/${locale}: inactive lifecycle boundary changed.`);
      }

      scriptChecks += 4 + localized.options.length + localized.explanation.steps.length;
      assertCp004LocalizedText(locale, localized.stem, `${qlId}/${seed}/${locale}/stem`);
      for (const option of localized.options) {
        assertCp004LocalizedText(locale, option.feedback, `${qlId}/${seed}/${locale}/${option.id}/feedback`);
      }
      assertCp004LocalizedText(locale, localized.explanation.whatAsked, `${qlId}/${seed}/${locale}/what-asked`);
      for (const [stepIndex, step] of localized.explanation.steps.entries()) {
        assertCp004LocalizedText(locale, step, `${qlId}/${seed}/${locale}/step-${stepIndex + 1}`);
      }
      assertCp004LocalizedText(locale, localized.explanation.finalAnswer, `${qlId}/${seed}/${locale}/final-answer`);
      assertCp004LocalizedText(locale, localized.explanation.commonMistake, `${qlId}/${seed}/${locale}/common-mistake`);

      frozenObjectChecks += assertFrozen(localized, `${qlId}/${seed}/${locale}`);
    }
  }
}

if (questionCases !== 3800) fail(`Expected 3,800 localized runtime cases, received ${questionCases}.`);
for (const locale of INT_CP004_LOCALIZED_LOCALES) {
  if (localeCounts[locale] !== 1900) fail(`${locale}: expected 1,900 runtime cases.`);
  if (representationCoverage[locale]!.size !== 4) fail(`${locale}: expected all four representations.`);
}
for (const [key, count] of Object.entries(qlCounts)) {
  if (count !== 100) fail(`${key}: expected 100 runtime cases, received ${count}.`);
}

const outputDirectory = join(process.cwd(), "dist", "quant-v4", "int-cp004-localized-runtime");
mkdirSync(outputDirectory, { recursive: true });
const summary = {
  status: "CP004_EXECUTABLE_LOCALIZED_RUNTIME_READY",
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: INT_CP004_QL_IDS.length,
  locales: INT_CP004_LOCALIZED_LOCALES,
  questionCases,
  localeCounts,
  deterministicChecks,
  identityChecks,
  mathematicalStateChecks,
  solutionChecks,
  registryChecks,
  presentationParityChecks,
  optionParityChecks,
  correctIndexChecks,
  explanationChecks,
  localizationMetadataChecks,
  lifecycleChecks,
  frozenObjectChecks,
  scriptChecks,
  answerPositions,
  representationCoverage: Object.fromEntries(
    INT_CP004_LOCALIZED_LOCALES.map((locale) => [locale, representationCoverage[locale]!.size]),
  ),
  lifecycle: {
    maturity: "MULTILINGUAL_LOCALISATION_REVIEW",
    reviewStatus: "LOCALIZED_REVIEW_REQUIRED",
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
writeFileSync(
  join(outputDirectory, "int-cp004-localized-runtime-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
console.log(JSON.stringify(summary, null, 2));
console.log("PASS_INT_CP004_EXECUTABLE_LOCALIZED_RUNTIME");
