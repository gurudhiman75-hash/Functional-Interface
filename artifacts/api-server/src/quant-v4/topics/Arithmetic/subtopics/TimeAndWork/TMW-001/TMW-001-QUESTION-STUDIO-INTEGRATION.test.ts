import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../../question-studio-review-engine";
import {
  TMW_001_QUESTION_STUDIO_CP_IDS,
  TMW_001_QUESTION_STUDIO_LANGUAGES,
  TMW_001_QUESTION_STUDIO_QLS,
  inferTmw001QuestionStudioCpFromQl,
  runTmw001QuestionStudioPipeline,
} from "./question-studio-adapter";
import { TMW_001_FINAL_FREEZE_AUTHORITY } from "./foundation/final-freeze-authority";

function ok(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const card = listQuantV4Packages().find((pkg: any) => pkg.packageId === "TMW-001") as any;
ok(card, "TMW-001 missing from shared Question Studio capabilities");
ok(card.label === "Time & Work", "TMW package label drift");
ok(card.enabled === true, "TMW package must be enabled in Question Studio");
ok(card.runtimeMode === "QUESTION_STUDIO_ACTIVE", "TMW Question Studio runtime mode drift");
ok(card.cpIds.length === 14, `expected 14 TMW checkpoints, got ${card.cpIds.length}`);
ok(card.supportedLanguages.join(",") === "en,hi,pa", "TMW multilingual capability drift");
ok(card.questionBankStatus === "NOT_STORED", "TMW Question Bank must remain locked");
ok(card.testEligibility === "INELIGIBLE", "TMW test eligibility must remain locked");
ok(card.publiclyPublishable === false, "TMW public publication must remain locked");

ok(TMW_001_QUESTION_STUDIO_QLS.length === 228, "TMW adapter must register exactly 228 frozen QLs");
ok(new Set(TMW_001_QUESTION_STUDIO_QLS.map((entry) => entry.qlId)).size === 228, "TMW QL registration contains duplicates");
for (let index = 0; index < 228; index += 1) {
  const expected = `TMW-QL-${String(index + 1).padStart(3, "0")}`;
  const descriptor = TMW_001_QUESTION_STUDIO_QLS[index]!;
  ok(descriptor.qlId === expected, `non-contiguous TMW registration at ${expected}`);
  ok(inferTmw001QuestionStudioCpFromQl(expected) === descriptor.checkpointId, `${expected}: QL -> CP ownership drift`);
}
ok(new Set(TMW_001_QUESTION_STUDIO_QLS.map((entry) => entry.checkpointId)).size === 14, "TMW adapter must cover all 14 checkpoints");
ok(TMW_001_QUESTION_STUDIO_CP_IDS.length === 14, "TMW CP capability count drift");
ok(TMW_001_QUESTION_STUDIO_LANGUAGES.length === 3, "TMW language capability count drift");

let frozenPackages = 0;
for (const descriptor of TMW_001_QUESTION_STUDIO_QLS) {
  for (const language of TMW_001_QUESTION_STUDIO_LANGUAGES) {
    const pkg = runTmw001QuestionStudioPipeline({
      questionLanguageId: descriptor.qlId,
      canonicalProblemId: descriptor.checkpointId,
      language,
      seed: `tmw-question-studio-proof:${descriptor.qlId}:${language}`,
    });
    ok(pkg.questionLanguageId === descriptor.qlId, `${descriptor.qlId}:${language}: identity mismatch`);
    ok(pkg.canonicalProblemId === descriptor.checkpointId, `${descriptor.qlId}:${language}: checkpoint mismatch`);
    ok(pkg.language === language, `${descriptor.qlId}:${language}: language mismatch`);
    ok(pkg.validation?.ok === true, `${descriptor.qlId}:${language}: invalid normalized package`);
    ok(pkg.options[pkg.correctIndex] === pkg.answer, `${descriptor.qlId}:${language}: answer binding mismatch`);
    ok(pkg.explanation?.lines?.length > 0, `${descriptor.qlId}:${language}: learner explanation missing`);
    ok(pkg.questionBankStatus === "NOT_STORED", `${descriptor.qlId}:${language}: Question Bank lock opened`);
    ok(pkg.testEligibility === "INELIGIBLE", `${descriptor.qlId}:${language}: test lock opened`);
    ok(pkg.publiclyPublishable === false, `${descriptor.qlId}:${language}: publication lock opened`);
    ok(pkg.traceability?.sourceAuthorityHead === TMW_001_FINAL_FREEZE_AUTHORITY.sourceAuthorityHead, `${descriptor.qlId}:${language}: freeze authority mismatch`);
    frozenPackages += 1;
  }
}
ok(frozenPackages === 684, `expected 684 adapter packages, got ${frozenPackages}`);

let sharedGenerated = 0;
for (const language of TMW_001_QUESTION_STUDIO_LANGUAGES) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateQuestion({
      packageId: "TMW-001",
      topic: "Arithmetic",
      subtopic: "Time & Work",
      language,
      difficulty,
      count: 8,
      seed: `tmw-shared-engine:${language}:${difficulty}`,
    });
    ok(result.questions.length === 8, `${language}:${difficulty}: shared engine batch size mismatch`);
    ok(result.generationContext.runtimeMode === "QUESTION_STUDIO_ACTIVE", `${language}:${difficulty}: shared runtime mode mismatch`);
    ok(result.generationContext.questionBankStatus === "NOT_STORED", `${language}:${difficulty}: generation context Question Bank lock drift`);
    ok(result.generationContext.testEligibility === "INELIGIBLE", `${language}:${difficulty}: generation context test lock drift`);
    ok(result.generationContext.publiclyPublishable === false, `${language}:${difficulty}: generation context publication lock drift`);
    for (const question of result.questions as any[]) {
      ok(question.packageId === "TMW-001", `${language}:${difficulty}: wrong package routed through shared engine`);
      ok(question.language === language, `${language}:${difficulty}: wrong generated language`);
      ok(question.difficulty === difficulty, `${language}:${difficulty}: difficulty selector not honored`);
      ok(question.options[question.correctIndex] === question.answer, `${language}:${difficulty}: preview answer binding mismatch`);
      ok(question.questionBankStatus === "NOT_STORED", `${language}:${difficulty}: preview Question Bank lock opened`);
      ok(question.testEligibility === "INELIGIBLE", `${language}:${difficulty}: preview test lock opened`);
      ok(question.publiclyPublishable === false, `${language}:${difficulty}: preview publication lock opened`);
      sharedGenerated += 1;
    }
  }
}

const ds = await generateQuestion({
  packageId: "TMW-001",
  canonicalProblemId: "TMW-CP-013",
  questionLanguageId: "TMW-QL-216",
  language: "hi",
  count: 1,
  seed: "tmw-ds-shared-proof",
});
ok((ds.questions[0] as any).options.length === 5, "CP013 five-option Data Sufficiency contract lost in Question Studio");

const presentation = await generateQuestion({
  packageId: "TMW-001",
  canonicalProblemId: "TMW-CP-014",
  questionLanguageId: "TMW-QL-227",
  language: "pa",
  count: 1,
  seed: "tmw-caselet-shared-proof",
});
ok(Array.isArray((presentation.questions[0] as any).presentationBlocks), "CP014 structured presentation lost in Question Studio preview");
ok((presentation.questions[0] as any).caseletGroupId === "TMW-CASELET-001", "CP014 caselet grouping lost in Question Studio preview");

console.log(JSON.stringify({
  chapter: "TMW-001",
  freezeAuthority: TMW_001_FINAL_FREEZE_AUTHORITY.sourceAuthorityHead,
  qls: TMW_001_QUESTION_STUDIO_QLS.length,
  checkpoints: TMW_001_QUESTION_STUDIO_CP_IDS.length,
  languages: [...TMW_001_QUESTION_STUDIO_LANGUAGES],
  frozenAdapterPackages: frozenPackages,
  sharedGenerated,
  dataSufficiencyBridge: "PASS",
  structuredPresentationBridge: "PASS",
  questionBankStatus: card.questionBankStatus,
  testEligibility: card.testEligibility,
  publiclyPublishable: card.publiclyPublishable,
  verdict: "PASS",
}, null, 2));
