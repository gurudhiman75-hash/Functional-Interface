import { createHash } from "node:crypto";

import {
  generateCubesDiceQuestionStudioSeededV1,
  type CubesDiceStudioLanguageV1,
} from "./cubes-dice-question-studio-seeded-runtime-v1";
import {
  generateCubesDicePermanentEnglishQuestionV1,
} from "./cubes-dice-permanent-english-runtime-v1";
import type {
  CubesDiceCp004TaskKindV1,
  CubesDicePermanentQlIdV1,
} from "./cubes-dice-cp004-distractors-allocation-v1";
import {
  buildCubesDicePermanentStudentSolutionV1,
  buildCubesDiceVoxelStudentSolutionV1,
  CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1,
  type CubesDiceStudentSolutionV1,
} from "./cubes-dice-student-solution-v1";
import {
  generateCubesDiceVoxelPermanentEnglishQuestionV1,
  CND_001_VOXEL_PROJECTION_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
} from "./cubes-dice-voxel-projection-permanent-english-runtime-v1";
import type { CubesDiceVoxelRuntimeTaskKindV2 } from "./cubes-dice-voxel-projection-runtime-v2";
import {
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8,
  type CubesDicePermanentQlIdV8,
} from "./spatial-permanent-ql-allocation-v8";

export type CubesDiceQuestionStudioQlIdV2 = CubesDicePermanentQlIdV1 | CubesDicePermanentQlIdV8;
export type CubesDiceQuestionStudioLanguageV2 = CubesDiceStudioLanguageV1;
export type CubesDiceQuestionStudioAnswerLabelV2 = "A" | "B" | "C" | "D";

const OPTION_LABELS = Object.freeze(["A", "B", "C", "D"] as const);
const ALL_QLS = Object.freeze(["SPA-QL-043", "SPA-QL-044", "SPA-QL-045", "SPA-QL-046", "SPA-QL-047"] as const);
const OLD_TASK_BY_QL: Readonly<Record<CubesDicePermanentQlIdV1, CubesDiceCp004TaskKindV1>> = Object.freeze({
  "SPA-QL-043": "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "SPA-QL-044": "CUBE_NET_OPPOSITE_FACE",
  "SPA-QL-045": "PAINTED_CUBE_EXACT_FACE_COUNT",
});
const VOXEL_TASKS_BY_QL: Readonly<Record<CubesDicePermanentQlIdV8, readonly CubesDiceVoxelRuntimeTaskKindV2[]>> = Object.freeze({
  "SPA-QL-046": Object.freeze(["STACK_TOTAL_CUBES", "STACK_EXPOSED_FACES", "STACK_MISSING_TO_COMPLETE_CUBOID"]),
  "SPA-QL-047": Object.freeze(["ORTHOGRAPHIC_TOP_CELL_COUNT", "ORTHOGRAPHIC_FRONT_CELL_COUNT", "ORTHOGRAPHIC_RIGHT_CELL_COUNT"]),
});

export interface CubesDiceQuestionStudioQuestionV2 {
  version: "CND-001-QUESTION-STUDIO-QUESTION-V2";
  packageId: "SPA-001";
  qlId: CubesDiceQuestionStudioQlIdV2;
  permanentQlId: CubesDiceQuestionStudioQlIdV2;
  chapterCode: "CND-001";
  qlName: string;
  language: CubesDiceQuestionStudioLanguageV2;
  locale: "en-IN" | "hi-IN" | "pa-IN";
  difficultyBand: "Easy" | "Medium" | "Hard";
  seed: string;
  taskKind: CubesDiceCp004TaskKindV1 | CubesDiceVoxelRuntimeTaskKindV2;
  stemVariantId: string;
  stem: string;
  stimulusSvgs: readonly [string];
  options: readonly [string | number, string | number, string | number, string | number];
  optionLabels: typeof OPTION_LABELS;
  correctIndex: number;
  answer: CubesDiceQuestionStudioAnswerLabelV2;
  canonicalAnswer: string | number;
  solution: CubesDiceStudentSolutionV1;
  legacyExplanationSuppressed: true;
  canonicalItemId: string;
  questionLanguageId: string;
  contentFingerprint: string;
  validation: Readonly<{
    valid: true;
    exactSolverBacked: true;
    uniqueOptions: true;
    uniqueAnswer: true;
    deterministicReplay: true;
    studentSolutionV4: true;
  }>;
  lifecycle: Readonly<{
    reviewOnly: true;
    questionStudioDiscoverable: false;
    registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED";
    persistenceAllowed: false;
    questionBankStatus: "NOT_STORED";
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}

export const CND_001_QUESTION_STUDIO_SEEDED_RUNTIME_AUTHORITY_V2 = Object.freeze({
  authorityId: "CND-001-QUESTION-STUDIO-SEEDED-RUNTIME-V2" as const,
  chapterCode: "CND-001" as const,
  allocationAuthorityId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V8.authorityId,
  voxelPermanentEnglishRuntimeAuthorityId: CND_001_VOXEL_PROJECTION_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId,
  studentSolutionAuthorityId: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.authorityId,
  permanentQlIds: ALL_QLS,
  supportedLanguages: Object.freeze(["en", "hi", "pa"] as const),
  explanationPolicy: "STUDENT_SOLUTION_V4_RULE_EXACT_WORKING_TABLE_ANSWER" as const,
  languageReviewStatus: CND_001_STUDENT_SOLUTION_V4_AUTHORITY_V1.languageReviewStatus,
  status: "SEEDED_RUNTIME_V2_IMPLEMENTED_OPERATOR_REVIEW_REQUIRED" as const,
  questionStudioDiscoverable: false,
  registrationAuthorized: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticPublication: false,
  nextGate: "CND_001_QUESTION_STUDIO_V2_OPERATOR_REVIEW" as const,
});

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function locale(language: CubesDiceQuestionStudioLanguageV2): "en-IN" | "hi-IN" | "pa-IN" {
  return language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
}

function voxelQlName(qlId: CubesDicePermanentQlIdV8, language: CubesDiceQuestionStudioLanguageV2): string {
  if (qlId === "SPA-QL-046") {
    if (language === "hi") return "इकाई घनों के ढेर पर गिनती और सतह संबंधी प्रश्न";
    if (language === "pa") return "ਇਕਾਈ ਘਣਾਂ ਦੇ ਢੇਰ ਦੀ ਗਿਣਤੀ ਅਤੇ ਸਤ੍ਹਾ ਸੰਬੰਧੀ ਪ੍ਰਸ਼ਨ";
    return "Reason about stable unit-cube stacks";
  }
  if (language === "hi") return "इकाई घनों के ढेर के ऊपर, सामने और दाएँ दृश्य";
  if (language === "pa") return "ਇਕਾਈ ਘਣਾਂ ਦੇ ਢੇਰ ਦੇ ਉੱਪਰ, ਸਾਹਮਣੇ ਅਤੇ ਸੱਜੇ ਦ੍ਰਿਸ਼";
  return "Infer top, front and right views of unit-cube stacks";
}

const VOXEL_STEMS_HI: Readonly<Record<CubesDiceVoxelRuntimeTaskKindV2, readonly string[]>> = Object.freeze({
  STACK_TOTAL_CUBES: Object.freeze(["दिए गए ढेर में कुल कितने इकाई घन हैं?", "इस आकृति को बनाने में कुल कितने छोटे घन लगे हैं?", "छिपे हुए सहायक घनों सहित कुल इकाई घनों की संख्या ज्ञात कीजिए।", "दिए गए ठोस विन्यास में कुल इकाई घन कितने हैं?"]),
  STACK_EXPOSED_FACES: Object.freeze(["दिए गए विन्यास में कितने इकाई-वर्ग फलक बाहर की ओर खुले हैं?", "घनों के इस ढेर के कुल खुले फलकों की संख्या ज्ञात कीजिए।", "इस घन विन्यास में कितने छोटे वर्गाकार फलक ढके हुए नहीं हैं?", "ढेर में बाहर की ओर दिखने वाले इकाई-वर्ग फलकों की संख्या ज्ञात कीजिए।"]),
  STACK_MISSING_TO_COMPLETE_CUBOID: Object.freeze(["सबसे छोटा पूरा घनाभ बनाने के लिए और कितने इकाई घन चाहिए?", "इसी बाहरी माप का पूरा घनाभ बनाने के लिए कितने घन जोड़ने होंगे?", "इस ढेर को घेरने वाले सबसे छोटे पूरे घनाभ में कितने इकाई घन कम हैं?", "सीमाबद्ध घनाभ पूरा करने के लिए कितने अतिरिक्त घन चाहिए?"]),
  ORTHOGRAPHIC_TOP_CELL_COUNT: Object.freeze(["ठीक ऊपर से देखने पर कितने इकाई वर्ग दिखाई देंगे?", "घनों के ढेर के ऊपरी दृश्य में कितने इकाई वर्ग होंगे?", "ऊपरी दृश्य में भरे हुए इकाई-वर्ग स्थानों की संख्या ज्ञात कीजिए।", "सीधे ऊपर से नीचे देखने पर ऊपरी दृश्य में कितने वर्ग होंगे?"]),
  ORTHOGRAPHIC_FRONT_CELL_COUNT: Object.freeze(["ठीक सामने से देखने पर कितने इकाई वर्ग दिखाई देंगे?", "घनों के ढेर के सामने वाले दृश्य में कितने इकाई वर्ग होंगे?", "विन्यास के सामने वाले दृश्य में इकाई वर्गों की संख्या ज्ञात कीजिए।", "गहराई को अनदेखा करने पर सामने से कितने इकाई-वर्ग स्थान दिखाई देंगे?"]),
  ORTHOGRAPHIC_RIGHT_CELL_COUNT: Object.freeze(["ठीक दाएँ से देखने पर कितने इकाई वर्ग दिखाई देंगे?", "घनों के ढेर के दाएँ दृश्य में कितने इकाई वर्ग होंगे?", "विन्यास के दाएँ दृश्य में इकाई वर्गों की संख्या ज्ञात कीजिए।", "चौड़ाई को अनदेखा करने पर दाएँ से कितने इकाई-वर्ग स्थान दिखाई देंगे?"]),
});

const VOXEL_STEMS_PA: Readonly<Record<CubesDiceVoxelRuntimeTaskKindV2, readonly string[]>> = Object.freeze({
  STACK_TOTAL_CUBES: Object.freeze(["ਦਿੱਤੇ ਢੇਰ ਵਿੱਚ ਕੁੱਲ ਕਿੰਨੇ ਇਕਾਈ ਘਣ ਹਨ?", "ਇਸ ਬਣਤਰ ਨੂੰ ਬਣਾਉਣ ਲਈ ਕੁੱਲ ਕਿੰਨੇ ਛੋਟੇ ਘਣ ਵਰਤੇ ਗਏ ਹਨ?", "ਲੁਕੇ ਹੋਏ ਸਹਾਇਕ ਘਣਾਂ ਸਮੇਤ ਕੁੱਲ ਇਕਾਈ ਘਣਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।", "ਦਿੱਤੀ ਠੋਸ ਬਣਤਰ ਵਿੱਚ ਕੁੱਲ ਇਕਾਈ ਘਣ ਕਿੰਨੇ ਹਨ?"]),
  STACK_EXPOSED_FACES: Object.freeze(["ਦਿੱਤੀ ਬਣਤਰ ਵਿੱਚ ਕਿੰਨੇ ਇਕਾਈ-ਵਰਗ ਫਲਕ ਬਾਹਰ ਵੱਲ ਖੁੱਲ੍ਹੇ ਹਨ?", "ਘਣਾਂ ਦੇ ਇਸ ਢੇਰ ਦੇ ਕੁੱਲ ਖੁੱਲ੍ਹੇ ਫਲਕ ਗਿਣੋ।", "ਇਸ ਘਣ ਬਣਤਰ ਵਿੱਚ ਕਿੰਨੇ ਛੋਟੇ ਵਰਗਾਕਾਰ ਫਲਕ ਢੱਕੇ ਹੋਏ ਨਹੀਂ ਹਨ?", "ਢੇਰ ਵਿੱਚ ਬਾਹਰ ਵੱਲ ਦਿਖਣ ਵਾਲੇ ਇਕਾਈ-ਵਰਗ ਫਲਕਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।"]),
  STACK_MISSING_TO_COMPLETE_CUBOID: Object.freeze(["ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਾ ਘਣਾਭ ਬਣਾਉਣ ਲਈ ਹੋਰ ਕਿੰਨੇ ਇਕਾਈ ਘਣ ਚਾਹੀਦੇ ਹਨ?", "ਇਹੀ ਬਾਹਰੀ ਮਾਪ ਵਾਲਾ ਪੂਰਾ ਘਣਾਭ ਬਣਾਉਣ ਲਈ ਕਿੰਨੇ ਘਣ ਜੋੜਣੇ ਪੈਣਗੇ?", "ਇਸ ਢੇਰ ਨੂੰ ਘੇਰਨ ਵਾਲੇ ਸਭ ਤੋਂ ਛੋਟੇ ਪੂਰੇ ਘਣਾਭ ਵਿੱਚ ਕਿੰਨੇ ਇਕਾਈ ਘਣ ਘੱਟ ਹਨ?", "ਸੀਮਾਬੱਧ ਘਣਾਭ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਵਾਧੂ ਘਣ ਚਾਹੀਦੇ ਹਨ?"]),
  ORTHOGRAPHIC_TOP_CELL_COUNT: Object.freeze(["ਬਿਲਕੁਲ ਉੱਪਰੋਂ ਵੇਖਣ ਤੇ ਕਿੰਨੇ ਇਕਾਈ ਵਰਗ ਦਿਖਣਗੇ?", "ਘਣਾਂ ਦੇ ਢੇਰ ਦੇ ਉੱਪਰਲੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਕਿੰਨੇ ਇਕਾਈ ਵਰਗ ਹੋਣਗੇ?", "ਉੱਪਰਲੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਭਰੇ ਹੋਏ ਇਕਾਈ-ਵਰਗ ਖਾਣਿਆਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।", "ਸਿੱਧਾ ਉੱਪਰੋਂ ਹੇਠਾਂ ਵੇਖਣ ਤੇ ਉੱਪਰਲੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਕਿੰਨੇ ਵਰਗ ਹੋਣਗੇ?"]),
  ORTHOGRAPHIC_FRONT_CELL_COUNT: Object.freeze(["ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਤੋਂ ਵੇਖਣ ਤੇ ਕਿੰਨੇ ਇਕਾਈ ਵਰਗ ਦਿਖਣਗੇ?", "ਘਣਾਂ ਦੇ ਢੇਰ ਦੇ ਸਾਹਮਣੇ ਵਾਲੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਕਿੰਨੇ ਇਕਾਈ ਵਰਗ ਹੋਣਗੇ?", "ਬਣਤਰ ਦੇ ਸਾਹਮਣੇ ਵਾਲੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਇਕਾਈ ਵਰਗਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।", "ਡੂੰਘਾਈ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨ ਤੇ ਸਾਹਮਣੇ ਤੋਂ ਕਿੰਨੇ ਇਕਾਈ-ਵਰਗ ਖਾਣੇ ਦਿਖਣਗੇ?"]),
  ORTHOGRAPHIC_RIGHT_CELL_COUNT: Object.freeze(["ਬਿਲਕੁਲ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ਵੇਖਣ ਤੇ ਕਿੰਨੇ ਇਕਾਈ ਵਰਗ ਦਿਖਣਗੇ?", "ਘਣਾਂ ਦੇ ਢੇਰ ਦੇ ਸੱਜੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਕਿੰਨੇ ਇਕਾਈ ਵਰਗ ਹੋਣਗੇ?", "ਬਣਤਰ ਦੇ ਸੱਜੇ ਦ੍ਰਿਸ਼ ਵਿੱਚ ਇਕਾਈ ਵਰਗਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।", "ਚੌੜਾਈ ਨੂੰ ਅਣਡਿੱਠਾ ਕਰਨ ਤੇ ਸੱਜੇ ਪਾਸੇ ਤੋਂ ਕਿੰਨੇ ਇਕਾਈ-ਵਰਗ ਖਾਣੇ ਦਿਖਣਗੇ?"]),
});

function localizedVoxelStem(taskKind: CubesDiceVoxelRuntimeTaskKindV2, stemVariantId: string, englishStem: string, language: CubesDiceQuestionStudioLanguageV2): string {
  if (language === "en") return englishStem;
  const match = stemVariantId.match(/-(\d+)$/);
  const index = Math.max(0, Math.min(3, Number(match?.[1] ?? 1) - 1));
  return language === "hi" ? VOXEL_STEMS_HI[taskKind][index]! : VOXEL_STEMS_PA[taskKind][index]!;
}

function fingerprint(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function oldQuestion(input: Readonly<{ seed: string; qlId: CubesDicePermanentQlIdV1; language: CubesDiceQuestionStudioLanguageV2 }>): CubesDiceQuestionStudioQuestionV2 {
  const surface = generateCubesDiceQuestionStudioSeededV1(input);
  const taskKind = OLD_TASK_BY_QL[input.qlId];
  const canonical = generateCubesDicePermanentEnglishQuestionV1({ seed: input.seed, taskKind });
  const richSolution = buildCubesDicePermanentStudentSolutionV1(canonical, input.language);
  const contentFingerprint = surface.contentFingerprint;
  return Object.freeze({
    version: "CND-001-QUESTION-STUDIO-QUESTION-V2",
    packageId: "SPA-001",
    qlId: input.qlId,
    permanentQlId: input.qlId,
    chapterCode: "CND-001",
    qlName: surface.qlName,
    language: input.language,
    locale: surface.locale,
    difficultyBand: surface.difficultyBand,
    seed: input.seed,
    taskKind,
    stemVariantId: surface.stemVariantId,
    stem: surface.stem,
    stimulusSvgs: surface.stimulusSvgs,
    options: surface.options,
    optionLabels: OPTION_LABELS,
    correctIndex: surface.correctIndex,
    answer: surface.answer,
    canonicalAnswer: surface.canonicalAnswer,
    solution: richSolution,
    legacyExplanationSuppressed: true,
    canonicalItemId: `cnd-001:${input.qlId}:${contentFingerprint}`,
    questionLanguageId: `cnd-001:${input.qlId}:${contentFingerprint}:${input.language}`,
    contentFingerprint,
    validation: Object.freeze({ valid: true as const, exactSolverBacked: true as const, uniqueOptions: true as const, uniqueAnswer: true as const, deterministicReplay: true as const, studentSolutionV4: true as const }),
    lifecycle: Object.freeze({ reviewOnly: true as const, questionStudioDiscoverable: false as const, registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED" as const, persistenceAllowed: false as const, questionBankStatus: "NOT_STORED" as const, questionBankWritable: false as const, testEligible: false as const, publiclyPublishable: false as const, automaticStudentPublication: false as const }),
  });
}

function voxelQuestion(input: Readonly<{ seed: string; qlId: CubesDicePermanentQlIdV8; language: CubesDiceQuestionStudioLanguageV2; voxelTaskKind?: CubesDiceVoxelRuntimeTaskKindV2 }>): CubesDiceQuestionStudioQuestionV2 {
  const allowed = VOXEL_TASKS_BY_QL[input.qlId];
  const taskKind = input.voxelTaskKind ?? allowed[hash32(`${input.seed}:task`) % allowed.length]!;
  if (!allowed.includes(taskKind)) throw new Error(`${input.qlId}: task ${taskKind} does not belong to this permanent QL.`);
  const canonical = generateCubesDiceVoxelPermanentEnglishQuestionV1({ seed: input.seed, taskKind });
  if (canonical.permanentQlId !== input.qlId) throw new Error(`${input.seed}: CND voxel Question Studio QL mismatch.`);
  const stem = localizedVoxelStem(taskKind, canonical.stemVariantId, canonical.stem, input.language);
  const richSolution = buildCubesDiceVoxelStudentSolutionV1(canonical, input.language);
  const contentFingerprint = fingerprint({ qlId: input.qlId, taskKind, templateId: canonical.templateId, heights: canonical.heights, options: canonical.options, correctIndex: canonical.correctIndex });
  const options = Object.freeze([...canonical.options]) as readonly [number, number, number, number];
  return Object.freeze({
    version: "CND-001-QUESTION-STUDIO-QUESTION-V2",
    packageId: "SPA-001",
    qlId: input.qlId,
    permanentQlId: input.qlId,
    chapterCode: "CND-001",
    qlName: voxelQlName(input.qlId, input.language),
    language: input.language,
    locale: locale(input.language),
    difficultyBand: canonical.difficultyBand,
    seed: input.seed,
    taskKind,
    stemVariantId: canonical.stemVariantId,
    stem,
    stimulusSvgs: Object.freeze([canonical.stimulusSvg]) as readonly [string],
    options,
    optionLabels: OPTION_LABELS,
    correctIndex: canonical.correctIndex,
    answer: OPTION_LABELS[canonical.correctIndex]!,
    canonicalAnswer: canonical.answer,
    solution: richSolution,
    legacyExplanationSuppressed: true,
    canonicalItemId: `cnd-001:${input.qlId}:${contentFingerprint}`,
    questionLanguageId: `cnd-001:${input.qlId}:${contentFingerprint}:${input.language}`,
    contentFingerprint,
    validation: Object.freeze({ valid: true as const, exactSolverBacked: true as const, uniqueOptions: true as const, uniqueAnswer: true as const, deterministicReplay: true as const, studentSolutionV4: true as const }),
    lifecycle: Object.freeze({ reviewOnly: true as const, questionStudioDiscoverable: false as const, registrationStatus: "CANDIDATE_OPERATOR_REVIEW_REQUIRED" as const, persistenceAllowed: false as const, questionBankStatus: "NOT_STORED" as const, questionBankWritable: false as const, testEligible: false as const, publiclyPublishable: false as const, automaticStudentPublication: false as const }),
  });
}

export function generateCubesDiceQuestionStudioSeededV2(input: Readonly<{
  seed: string;
  qlId: CubesDiceQuestionStudioQlIdV2;
  language: CubesDiceQuestionStudioLanguageV2;
  voxelTaskKind?: CubesDiceVoxelRuntimeTaskKindV2;
}>): CubesDiceQuestionStudioQuestionV2 {
  if (!input.seed.trim()) throw new Error("CND Question Studio V2 requires an explicit seed.");
  if (input.qlId === "SPA-QL-043" || input.qlId === "SPA-QL-044" || input.qlId === "SPA-QL-045") {
    if (input.voxelTaskKind) throw new Error(`${input.qlId}: voxelTaskKind is not valid for this QL.`);
    return oldQuestion({ seed: input.seed, qlId: input.qlId, language: input.language });
  }
  return voxelQuestion({ seed: input.seed, qlId: input.qlId, language: input.language, voxelTaskKind: input.voxelTaskKind });
}

export function generateCubesDiceQuestionStudioBatchV2(input: Readonly<{
  seed: string;
  language: CubesDiceQuestionStudioLanguageV2;
  count: number;
  qlId?: CubesDiceQuestionStudioQlIdV2;
}>): readonly CubesDiceQuestionStudioQuestionV2[] {
  if (!input.seed.trim()) throw new Error("CND Question Studio V2 batch requires an explicit seed.");
  if (!Number.isInteger(input.count) || input.count < 1 || input.count > 50) throw new Error("CND Question Studio V2 count must be an integer from 1 to 50.");
  const qls: readonly CubesDiceQuestionStudioQlIdV2[] = input.qlId ? [input.qlId] : ALL_QLS;
  const output: CubesDiceQuestionStudioQuestionV2[] = [];
  const seen = new Set<string>();
  for (let index = 0; index < input.count; index += 1) {
    const qlId = qls[index % qls.length]!;
    let accepted: CubesDiceQuestionStudioQuestionV2 | null = null;
    for (let retry = 0; retry < 80 && !accepted; retry += 1) {
      const candidate = generateCubesDiceQuestionStudioSeededV2({ seed: `${input.seed}:${index}:R${retry}`, qlId, language: input.language });
      if (seen.has(candidate.contentFingerprint)) continue;
      accepted = candidate;
    }
    if (!accepted) throw new Error(`${qlId}: unable to produce a unique CND Question Studio V2 item at index ${index}.`);
    seen.add(accepted.contentFingerprint);
    output.push(accepted);
  }
  return Object.freeze(output);
}
