import { generateArgCp004Question } from "./cp004-generator.ts";
import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import { ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE } from "./cp004-localized-templates.ts";
import { assertArgCp004LocalizedTemplateContract } from "./cp004-localization-helpers.ts";
import { ARG_QL_IDS, type ArgAnswerClass, type ArgLocale } from "./types.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function surfaceKey(question: ReturnType<typeof generateArgCp004Question>): string {
  return `${question.statement}\n${question.arguments[0]}\n${question.arguments[1]}`.toLowerCase().replace(/\s+/g, " ").trim();
}

function scriptCount(value: string, locale: ArgLocale): number {
  if (locale === "hi-IN") return (value.match(/[\u0900-\u097F]/g) ?? []).length;
  if (locale === "pa-IN") return (value.match(/[\u0A00-\u0A7F]/g) ?? []).length;
  return value.length;
}

const globalSurfaces: Record<ArgLocale, Set<string>> = {
  "en-IN": new Set<string>(),
  "hi-IN": new Set<string>(),
  "pa-IN": new Set<string>(),
};

for (const locale of ["hi-IN", "pa-IN"] as const) {
  let count = 0;
  for (const qlId of ARG_QL_IDS) {
    const localizedTemplates = ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE[locale][qlId];
    const englishTemplates = ARG_CP003_TEMPLATES_BY_QL[qlId];
    assert(localizedTemplates.length === 8, `${locale}/${qlId}: expected eight localized templates`);
    assert(englishTemplates.length === 8, `${qlId}: certified English template count drifted`);

    const localIds = new Set(localizedTemplates.map((entry) => entry.id));
    const englishIds = new Set(englishTemplates.map((entry) => entry.id));
    assert(localIds.size === 8, `${locale}/${qlId}: duplicate localized template IDs`);
    for (const id of englishIds) assert(localIds.has(id), `${locale}/${qlId}: missing localized template ${id}`);

    for (const template of localizedTemplates) {
      assertArgCp004LocalizedTemplateContract(template);
      count += 1;
    }
  }
  assert(count === 48, `${locale}: expected 48 localized templates, got ${count}`);
}

for (const qlId of ARG_QL_IDS) {
  const surfaces: Record<ArgLocale, Set<string>> = {
    "en-IN": new Set<string>(),
    "hi-IN": new Set<string>(),
    "pa-IN": new Set<string>(),
  };
  const answerCounts: Record<ArgLocale, Map<ArgAnswerClass, number>> = {
    "en-IN": new Map([["ONLY_I", 0], ["ONLY_II", 0], ["BOTH", 0], ["NEITHER", 0]]),
    "hi-IN": new Map([["ONLY_I", 0], ["ONLY_II", 0], ["BOTH", 0], ["NEITHER", 0]]),
    "pa-IN": new Map([["ONLY_I", 0], ["ONLY_II", 0], ["BOTH", 0], ["NEITHER", 0]]),
  };

  for (let seed = 0; seed < 2048; seed += 1) {
    const en = generateArgCp004Question({ qlId, locale: "en-IN", seed });
    const hi = generateArgCp004Question({ qlId, locale: "hi-IN", seed });
    const pa = generateArgCp004Question({ qlId, locale: "pa-IN", seed });

    for (const localized of [hi, pa]) {
      assert(localized.qlId === en.qlId, `${localized.locale}/${qlId}/${seed}: QL drift`);
      assert(localized.templateId === en.templateId, `${localized.locale}/${qlId}/${seed}: template drift`);
      assert(localized.variantIndex === en.variantIndex, `${localized.locale}/${qlId}/${seed}: variant-index drift`);
      assert(localized.variantKey === en.variantKey, `${localized.locale}/${qlId}/${seed}: variant-key drift`);
      assert(localized.scenarioId === en.scenarioId, `${localized.locale}/${qlId}/${seed}: scenario drift`);
      assert(localized.difficulty === en.difficulty, `${localized.locale}/${qlId}/${seed}: difficulty drift`);
      assert(localized.archetype === en.archetype, `${localized.locale}/${qlId}/${seed}: archetype drift`);
      assert(localized.correctIndex === en.correctIndex, `${localized.locale}/${qlId}/${seed}: correct-index drift`);
      assert(localized.answerClass === en.answerClass, `${localized.locale}/${qlId}/${seed}: answer-class drift`);
      assert(localized.argumentStrengths[0] === en.argumentStrengths[0] && localized.argumentStrengths[1] === en.argumentStrengths[1], `${localized.locale}/${qlId}/${seed}: strength authority drift`);
      assert(localized.metadata.semanticSlot === en.metadata.semanticSlot, `${localized.locale}/${qlId}/${seed}: scheduler slot drift`);
      assert(localized.metadata.argumentsReversed === en.metadata.argumentsReversed, `${localized.locale}/${qlId}/${seed}: argument-order drift`);
      assert(localized.metadata.presentationBlock === en.metadata.presentationBlock, `${localized.locale}/${qlId}/${seed}: presentation-block drift`);
      assert(localized.metadata.localizationStatus === "TRILINGUAL_TEMPLATE_PARITY_CP004", `${localized.locale}/${qlId}/${seed}: localization status wrong`);
      assert(localized.statement !== en.statement, `${localized.locale}/${qlId}/${seed}: untranslated statement`);
      assert(scriptCount(`${localized.statement} ${localized.arguments.join(" ")} ${localized.explanation}`, localized.locale) >= 30, `${localized.locale}/${qlId}/${seed}: insufficient localized-script content`);
    }

    for (const question of [en, hi, pa]) {
      assert(question.checkpointId === "ARG-CP-004", `${question.locale}/${qlId}/${seed}: wrong checkpoint`);
      assert(question.version === "CP004", `${question.locale}/${qlId}/${seed}: wrong version`);
      assert(question.metadata.reviewOnly === true, `${question.locale}/${qlId}/${seed}: review-only lock opened`);
      assert(question.metadata.questionStudioRegistered === false, `${question.locale}/${qlId}/${seed}: Question Studio registered before CP005`);
      assert(question.metadata.questionBankWritable === false, `${question.locale}/${qlId}/${seed}: Question Bank gate opened`);
      assert(question.metadata.testEligible === false && question.metadata.mockEligible === false, `${question.locale}/${qlId}/${seed}: learner test gate opened`);
      assert(question.metadata.publicEligible === false && question.metadata.automaticStudentPublication === false, `${question.locale}/${qlId}/${seed}: public gate opened`);
      assert(!/\{[abcd]\}/.test(`${question.statement} ${question.arguments.join(" ")} ${question.explanation}`), `${question.locale}/${qlId}/${seed}: unresolved placeholder`);

      const key = surfaceKey(question);
      assert(!surfaces[question.locale].has(key), `${question.locale}/${qlId}: duplicate localized learner surface at seed ${seed}`);
      surfaces[question.locale].add(key);
      const globalKey = `${qlId}|${key}`;
      assert(!globalSurfaces[question.locale].has(globalKey), `${question.locale}/${qlId}: global surface collision`);
      globalSurfaces[question.locale].add(globalKey);
      answerCounts[question.locale].set(question.answerClass, (answerCounts[question.locale].get(question.answerClass) ?? 0) + 1);
    }
  }

  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    assert(surfaces[locale].size === 2048, `${locale}/${qlId}: expected 2048 unique learner surfaces, got ${surfaces[locale].size}`);
    for (const answerClass of ["ONLY_I", "ONLY_II", "BOTH", "NEITHER"] as const) {
      assert(answerCounts[locale].get(answerClass) === 512, `${locale}/${qlId}: ${answerClass} must occur 512 times`);
    }
  }
}

for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  assert(globalSurfaces[locale].size === 12288, `${locale}: expected 12,288 unique surfaces, got ${globalSurfaces[locale].size}`);
}

console.log(JSON.stringify({
  chapter: "ARG-001",
  checkpoint: "ARG-CP-004",
  locales: ["en-IN", "hi-IN", "pa-IN"],
  localizedTemplatesPerLocale: 48,
  templatesPerQl: 8,
  variantsPerTemplate: 256,
  semanticSurfacesPerQlPerLocale: 2048,
  semanticSurfacesPerLocale: 12288,
  generatedSurfacesAuditedAcrossLocales: 36864,
  answerClassPerQlPerLocale: { ONLY_I: 512, ONLY_II: 512, BOTH: 512, NEITHER: 512 },
  templateVariantSchedulerParity: true,
  argumentOrderParity: true,
  semanticAnswerParity: true,
  questionStudioRegistration: "CLOSED_UNTIL_CP005",
  learnerRelease: "LOCKED",
}, null, 2));
