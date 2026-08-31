import { ARG_CP003_OPTIONS, scheduleArgCp003Surface } from "./cp003-generator.ts";
import { renderArgCp003Template, reverseArgAnswerClass } from "./cp003-saturation-helpers.ts";
import {
  ARG_CP009_CHECKPOINT_ID,
  ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
  ARG_CP009_ENGLISH_TEMPLATES_BY_QL,
} from "./cp009-english-remediated-templates.ts";
import type { ArgAnswerClass, ArgQlId } from "./types.ts";

function indexForAnswer(answerClass: ArgAnswerClass): number {
  switch (answerClass) {
    case "ONLY_I": return 0;
    case "ONLY_II": return 1;
    case "BOTH": return 2;
    case "NEITHER": return 3;
  }
}

export function generateArgCp009EnglishQuestion(input: {
  readonly qlId: ArgQlId;
  readonly seed: number;
}) {
  const templates = ARG_CP009_ENGLISH_TEMPLATES_BY_QL[input.qlId];
  if (templates.length !== 8) throw new Error(`${input.qlId}: CP009 requires exactly eight remediated English templates`);

  const schedule = scheduleArgCp003Surface(input);
  const rendered = renderArgCp003Template(templates[schedule.templateIndex]!, schedule.variantIndex);
  const orderedArguments = schedule.reverseArguments
    ? [rendered.arguments[1], rendered.arguments[0]] as const
    : rendered.arguments;
  const answerClass = schedule.reverseArguments ? reverseArgAnswerClass(rendered.answerClass) : rendered.answerClass;
  const explanation = orderedArguments.map((argument, index) => {
    const label = index === 0 ? "I" : "II";
    return `Argument ${label} is ${argument.strength.toLowerCase()}: ${argument.explanation}`;
  }).join(" ");

  return Object.freeze({
    chapterId: "ARG-001" as const,
    checkpointId: ARG_CP009_CHECKPOINT_ID,
    version: "CP009-EN-V1" as const,
    authority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
    supersedesForEnglishReview: Object.freeze([
      "ARG_CP006_IMMUTABLE_FREEZE_V1",
      "ARG_CP008_REAL_PAPER_CLOSURE_V1",
    ] as const),
    qlId: input.qlId,
    scenarioId: `${rendered.templateId}-CP009-V${rendered.variantIndex.toString(16).padStart(2, "0")}`,
    templateId: rendered.templateId,
    variantIndex: rendered.variantIndex,
    variantKey: rendered.variantKey,
    locale: "en-IN" as const,
    seed: input.seed,
    difficulty: rendered.difficulty,
    archetype: rendered.archetype,
    statement: rendered.statement,
    arguments: [orderedArguments[0].text, orderedArguments[1].text] as const,
    argumentStrengths: [orderedArguments[0].strength, orderedArguments[1].strength] as const,
    options: ARG_CP003_OPTIONS,
    correctIndex: indexForAnswer(answerClass),
    answerClass,
    explanation,
    metadata: Object.freeze({
      authority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
      historicalCoreAuthority: "ARG_CP006_IMMUTABLE_FREEZE_V1" as const,
      historicalRealPaperAuthority: "ARG_CP008_REAL_PAPER_CLOSURE_V1" as const,
      sourceScheduler: "ARG_CP003_BIJECTIVE_2048_SURFACE" as const,
      semanticSurfaceCapacityPerQl: 2048 as const,
      editorialRemediation: true as const,
      englishExhaustiveAuditRequired: true as const,
      localizationStatus: "HI_PA_REMEDIATION_PENDING" as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}
