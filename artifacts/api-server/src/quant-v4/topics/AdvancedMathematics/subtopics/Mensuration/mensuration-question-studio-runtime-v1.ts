import { getMen001QuestionEntries } from "./MEN-001/library";
import { runMen001Pipeline } from "./MEN-001/pipeline";
import { MEN_CP_007_FROZEN_QLS } from "./MEN-002/MEN-CP-007/final-freeze/registry";
import { generateMenCp007ApprovedEnglishQuestion } from "./MEN-002/MEN-CP-007/approved/english";
import { MEN_CP_008_FROZEN_QLS } from "./MEN-002/MEN-CP-008/final-freeze/registry";
import { generateMenCp008PermanentQuestion } from "./MEN-002/MEN-CP-008/permanent/runtime-base";
import { MEN_CP_009_FROZEN_QLS_V2 } from "./MEN-002/MEN-CP-009/coverage-v2/registry";
import { previewMenCp009QuestionStudioReview } from "./MEN-002/MEN-CP-009/question-studio-review-adapter";
import { MEN_CP_010_PERMANENT_ALLOCATION } from "./MEN-002/MEN-CP-010/permanent/allocation";
import { generateMenCp010FrozenEnglishQuestion } from "./MEN-002/MEN-CP-010/permanent/frozen-runtime-v1";
import { MEN_CP011_RUNTIME_PROTOTYPE_IDS } from "./MEN-002/cp011-foundation/implementation-closeout";
import { getMenCp011FoundationPrototypeIds } from "./MEN-002/cp011-foundation/registry";
import { generateMenCp011FoundationPrototype } from "./MEN-002/cp011-foundation/runtime";
import { getMenCp011SurfacePrototypeIds, generateMenCp011SurfaceQuestion } from "./MEN-002/cp011-foundation/surface-area-runtime";
import { getMenCp011OpenContainerPrototypeIds, generateMenCp011OpenContainerQuestion } from "./MEN-002/cp011-foundation/open-containers-runtime";
import { getMenCp011InversePrototypeIds, generateMenCp011InverseQuestion } from "./MEN-002/cp011-foundation/inverse-thickness-length";
import { getMenCp011HollowBoxPrototypeIds, generateMenCp011HollowBoxQuestion } from "./MEN-002/cp011-foundation/hollow-boxes";
import { getMenCp011ShellPrototypeIds, generateMenCp011ShellQuestion } from "./MEN-002/cp011-foundation/spherical-shells-canonical";
import { getMenCp011HiddenFacePrototypeIds, generateMenCp011HiddenFaceQuestion } from "./MEN-002/cp011-foundation/hidden-face-exposure";
import { getMenCp011CostPrototypeIds, generateMenCp011CostQuestion } from "./MEN-002/cp011-foundation/cost-lining";
import { getMenCp011RatioPercentPrototypeIds, generateMenCp011RatioPercentQuestion } from "./MEN-002/cp011-foundation/ratio-percent";
import { getMenCp011ConicalMaterialPrototypeIds, generateMenCp011ConicalMaterialQuestion } from "./MEN-002/cp011-foundation/conical-material";
import { getMenCp011ConicalSurfaceCostPrototypeIds, generateMenCp011ConicalSurfaceCostQuestion } from "./MEN-002/cp011-foundation/conical-surface-cost";
import { MEN_CP_012_PERMANENT_ALLOCATION } from "./MEN-002/MEN-CP-012/permanent/allocation";
import { generateMenCp012PermanentEnglishQuestionV2 } from "./MEN-002/MEN-CP-012/permanent/runtime-v2";
import { MEN_CP_013_PERMANENT_ALLOCATION } from "./MEN-002/MEN-CP-013/permanent/allocation";
import { generateMenCp013FrozenEnglishQuestion } from "./MEN-002/MEN-CP-013/permanent/frozen-runtime-v1";

export const MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY =
  "MENSURATION-FULL-CHAPTER-QUESTION-STUDIO-V1" as const;
export const MENSURATION_QUESTION_STUDIO_PACKAGE_ID = "MENSURATION" as const;
export const MENSURATION_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const MENSURATION_QUESTION_STUDIO_LANGUAGES = ["en"] as const;

export type MensurationQuestionStudioCpId = `MEN-CP-${string}`;
export type MensurationQuestionStudioDifficulty = (typeof MENSURATION_QUESTION_STUDIO_DIFFICULTIES)[number];
export type MensurationQuestionStudioPatternKind = "QL" | "PROTOTYPE";

export interface MensurationQuestionStudioPattern {
  packageId: "MEN-001" | "MEN-002";
  cpId: MensurationQuestionStudioCpId;
  patternId: string;
  patternKind: MensurationQuestionStudioPatternKind;
  qlId: string | null;
  title: string;
}

export interface MensurationQuestionStudioQuestion {
  packageId: "MEN-001" | "MEN-002";
  cpId: MensurationQuestionStudioCpId;
  patternId: string;
  patternKind: MensurationQuestionStudioPatternKind;
  qlId: string | null;
  questionId: string;
  canonicalItemId: string;
  questionLanguageId: string;
  language: "en";
  locale: "en-IN";
  difficultyBand: MensurationQuestionStudioDifficulty;
  stem: string;
  options: string[];
  optionDetails: Array<{ label: "A" | "B" | "C" | "D"; text: string; isCorrect: boolean; misconceptionId: string | null }>;
  correctIndex: number;
  answer: string;
  explanation: { steps: string[]; shortcut: string; traps: string[] };
  solveMode: string;
  renderer: "TEXT_MATH";
  integrationAuthority: typeof MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY;
  validation: {
    valid: boolean;
    fourDistinctOptions: boolean;
    exactlyOneCorrect: boolean;
    answerParity: boolean;
    teachingStepsPresent: boolean;
    sourceLifecycleLocked: boolean;
  };
  sourceAuthority: string;
  sourceReviewStatus: string;
  sourceMaturity: string;
  seed: string;
}

const CP_TITLES: Record<string, string> = {
  "MEN-CP-001": "Triangle Measurement Systems",
  "MEN-CP-002": "Quadrilateral Measurement Systems",
  "MEN-CP-003": "Circles, Arcs, Sectors & Annular Regions",
  "MEN-CP-004": "Paths, Borders, Flooring, Fencing & Cost",
  "MEN-CP-005": "Composite, Inscribed & Regular Plane Figures",
  "MEN-CP-006": "Boundary Conservation, Scaling & Unit Transformation",
  "MEN-CP-007": "Cubes, Cuboids & Prisms",
  "MEN-CP-008": "Cylinders & Cones",
  "MEN-CP-009": "Spheres & Hemispheres",
  "MEN-CP-010": "Pyramids & Frustums",
  "MEN-CP-011": "Surface Exposure, Open/Closed & Hollow Solids",
  "MEN-CP-012": "Recasting, Melting & Volume Conservation",
  "MEN-CP-013": "Composite/Inscribed Solids, Tanks & Displacement",
};

function qlPattern(packageId: "MEN-001" | "MEN-002", cpId: string, qlId: string, title: string): MensurationQuestionStudioPattern {
  return { packageId, cpId: cpId as MensurationQuestionStudioCpId, patternId: qlId, patternKind: "QL", qlId, title };
}
function prototypePattern(prototypeId: string): MensurationQuestionStudioPattern {
  return { packageId: "MEN-002", cpId: "MEN-CP-011", patternId: prototypeId, patternKind: "PROTOTYPE", qlId: null, title: prototypeId.replace("MEN-CP011-PROT-", "").replaceAll("-", " ") };
}

const MEN001_PATTERNS = getMen001QuestionEntries().map((row) =>
  qlPattern("MEN-001", row.cpId, row.qlId, `${row.solveMode} · ${row.difficulty}`),
);
const CP007_PATTERNS = MEN_CP_007_FROZEN_QLS.map((row) => qlPattern("MEN-002", "MEN-CP-007", row.qlId, row.title));
const CP008_PATTERNS = MEN_CP_008_FROZEN_QLS.map((row) => qlPattern("MEN-002", "MEN-CP-008", row.qlId, row.title));
const CP009_PATTERNS = MEN_CP_009_FROZEN_QLS_V2.map((row: any) => qlPattern("MEN-002", "MEN-CP-009", row.qlId, row.title ?? row.qlId));
const CP010_PATTERNS = MEN_CP_010_PERMANENT_ALLOCATION.map((row) => qlPattern("MEN-002", "MEN-CP-010", row.qlId, row.title));
const CP011_PATTERNS = MEN_CP011_RUNTIME_PROTOTYPE_IDS.map((id) => prototypePattern(id));
const CP012_PATTERNS = MEN_CP_012_PERMANENT_ALLOCATION.map((row: any) => qlPattern("MEN-002", "MEN-CP-012", row.qlId, row.title ?? row.clusterId));
const CP013_PATTERNS = MEN_CP_013_PERMANENT_ALLOCATION.map((row: any) => qlPattern("MEN-002", "MEN-CP-013", row.qlId, row.title ?? row.clusterId));

export const MENSURATION_QUESTION_STUDIO_PATTERNS: readonly MensurationQuestionStudioPattern[] = [
  ...MEN001_PATTERNS, ...CP007_PATTERNS, ...CP008_PATTERNS, ...CP009_PATTERNS,
  ...CP010_PATTERNS, ...CP011_PATTERNS, ...CP012_PATTERNS, ...CP013_PATTERNS,
];

export const MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS = Array.from({ length: 13 }, (_, index) => {
  const cpId = `MEN-CP-${String(index + 1).padStart(3, "0")}` as MensurationQuestionStudioCpId;
  const packageId = index < 6 ? "MEN-001" as const : "MEN-002" as const;
  const patterns = MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => row.cpId === cpId);
  return { cpId, packageId, title: CP_TITLES[cpId]!, patternCount: patterns.length, qlCount: patterns.filter((row) => row.patternKind === "QL").length, prototypeCount: patterns.filter((row) => row.patternKind === "PROTOTYPE").length };
});

export const MENSURATION_QUESTION_STUDIO_PACKAGE_V1 = {
  packageId: MENSURATION_QUESTION_STUDIO_PACKAGE_ID,
  label: "Mensuration · Full Chapter",
  integrationAuthority: MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
  canonicalProblems: MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  patterns: MENSURATION_QUESTION_STUDIO_PATTERNS,
  canonicalProblemCount: 13,
  patternCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  qlCount: MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => row.patternKind === "QL").length,
  prototypeCount: MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => row.patternKind === "PROTOTYPE").length,
  supportedLanguages: MENSURATION_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  runtimeMode: "APPROVED_CHAPTER_RUNTIME" as const,
  reviewStatus: "QUESTION_STUDIO_CONNECTED" as const,
  questionStudioDiscoverable: true as const,
  persistenceAllowed: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  publiclyPublishable: false as const,
} as const;

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

const cp011Sets = {
  foundation: new Set<string>(getMenCp011FoundationPrototypeIds()),
  surface: new Set<string>(getMenCp011SurfacePrototypeIds()),
  open: new Set<string>(getMenCp011OpenContainerPrototypeIds()),
  inverse: new Set<string>(getMenCp011InversePrototypeIds()),
  hollow: new Set<string>(getMenCp011HollowBoxPrototypeIds()),
  shell: new Set<string>(getMenCp011ShellPrototypeIds()),
  hidden: new Set<string>(getMenCp011HiddenFacePrototypeIds()),
  cost: new Set<string>(getMenCp011CostPrototypeIds()),
  ratio: new Set<string>(getMenCp011RatioPercentPrototypeIds()),
  conicalMaterial: new Set<string>(getMenCp011ConicalMaterialPrototypeIds()),
  conicalSurface: new Set<string>(getMenCp011ConicalSurfaceCostPrototypeIds()),
};

function generateCp011(prototypeId: string, seed: string): any {
  if (cp011Sets.foundation.has(prototypeId)) return generateMenCp011FoundationPrototype(prototypeId as any, seed);
  if (cp011Sets.surface.has(prototypeId)) return generateMenCp011SurfaceQuestion(prototypeId as any, seed);
  if (cp011Sets.open.has(prototypeId)) return generateMenCp011OpenContainerQuestion(prototypeId as any, seed);
  if (cp011Sets.inverse.has(prototypeId)) return generateMenCp011InverseQuestion(prototypeId as any, seed);
  if (cp011Sets.hollow.has(prototypeId)) return generateMenCp011HollowBoxQuestion(prototypeId as any, seed);
  if (cp011Sets.shell.has(prototypeId)) return generateMenCp011ShellQuestion(prototypeId as any, seed);
  if (cp011Sets.hidden.has(prototypeId)) return generateMenCp011HiddenFaceQuestion(prototypeId as any, seed);
  if (cp011Sets.cost.has(prototypeId)) return generateMenCp011CostQuestion(prototypeId as any, seed);
  if (cp011Sets.ratio.has(prototypeId)) return generateMenCp011RatioPercentQuestion(prototypeId as any, seed);
  if (cp011Sets.conicalMaterial.has(prototypeId)) return generateMenCp011ConicalMaterialQuestion(prototypeId as any, seed);
  if (cp011Sets.conicalSurface.has(prototypeId)) return generateMenCp011ConicalSurfaceCostQuestion(prototypeId as any, seed);
  throw new Error(`Unknown MEN-CP-011 verified prototype '${prototypeId}'.`);
}

function optionText(option: any) { return typeof option === "string" ? option : String(option?.display ?? option?.text ?? option); }
function optionCorrect(option: any, index: number, correctIndex: number) { return typeof option === "object" && option !== null && "isCorrect" in option ? option.isCorrect === true : index === correctIndex; }
function explanationSteps(source: any): string[] {
  if (Array.isArray(source?.learnerSolution?.steps) && source.learnerSolution.steps.length) return source.learnerSolution.steps.map(String);
  if (Array.isArray(source?.explanation?.lines) && source.explanation.lines.length) return source.explanation.lines.map(String);
  if (Array.isArray(source?.explanation?.steps) && source.explanation.steps.length) {
    return source.explanation.steps.map((step: any) => typeof step === "string" ? step : [step.title, step.body, step.equation].filter(Boolean).join(" — "));
  }
  return [];
}
function normalizeDifficulty(value: unknown): MensurationQuestionStudioDifficulty {
  return value === "Easy" || value === "Hard" ? value : "Medium";
}
function lifecycleLocked(source: any) {
  return source?.active !== true && source?.questionStudioDiscoverable !== true && source?.questionBankWritable !== true && source?.testEligible !== true && source?.publiclyPublishable !== true && source?.questionBankStatus !== "STORED" && source?.testEligibility !== "ELIGIBLE";
}

function normalize(pattern: MensurationQuestionStudioPattern, source: any, seed: string): MensurationQuestionStudioQuestion {
  const options = (source.options ?? []).map(optionText);
  const correctIndex = Number(source.correctIndex);
  const details = options.map((text: string, index: number) => ({
    label: ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D",
    text,
    isCorrect: optionCorrect(source.options?.[index], index, correctIndex),
    misconceptionId: typeof source.options?.[index] === "object" ? source.options[index]?.misconceptionId ?? null : null,
  }));
  const answer = String(source.answer ?? options[correctIndex] ?? "");
  const steps = explanationSteps(source);
  const sourceValid = source.validation?.valid !== false && source.verification?.valid !== false && source.sourceValidation?.valid !== false && source.approvalValidation?.valid !== false;
  const fourDistinctOptions = options.length === 4 && new Set(options).size === 4;
  const exactlyOneCorrect = details.filter((row) => row.isCorrect).length === 1;
  const answerParity = options[correctIndex] === answer;
  const sourceLifecycleLocked = lifecycleLocked(source);
  const valid = sourceValid && fourDistinctOptions && exactlyOneCorrect && answerParity && steps.length > 0 && sourceLifecycleLocked;
  const qlId = pattern.qlId;
  return {
    packageId: pattern.packageId,
    cpId: pattern.cpId,
    patternId: pattern.patternId,
    patternKind: pattern.patternKind,
    qlId,
    questionId: `${pattern.packageId}:${pattern.cpId}:${pattern.patternId}:${hashText(seed).toString(16)}`,
    canonicalItemId: `${pattern.cpId}:${pattern.patternId}`,
    questionLanguageId: String(source.questionLanguageId ?? source.qlId ?? source.permanentQlId ?? pattern.patternId),
    language: "en",
    locale: "en-IN",
    difficultyBand: normalizeDifficulty(source.difficultyBand ?? source.difficulty),
    stem: String(source.stem),
    options,
    optionDetails: details,
    correctIndex,
    answer,
    explanation: {
      steps,
      shortcut: String(source.learnerSolution?.shortcut ?? source.explanation?.shortcut ?? "Use the governing mensuration relation and keep units consistent."),
      traps: Array.isArray(source.explanation?.traps) ? source.explanation.traps.map(String) : Array.isArray(source.learnerSolution?.wrongOptionAnalysis) ? source.learnerSolution.wrongOptionAnalysis.map(String) : [],
    },
    solveMode: String(source.solveMode ?? source.canonicalSolveMode ?? source.solveModeId ?? "mensuration"),
    renderer: "TEXT_MATH",
    integrationAuthority: MENSURATION_QUESTION_STUDIO_INTEGRATION_AUTHORITY,
    validation: { valid, fourDistinctOptions, exactlyOneCorrect, answerParity, teachingStepsPresent: steps.length > 0, sourceLifecycleLocked },
    sourceAuthority: String(source.authority ?? source.integrationAuthority ?? source.releaseId ?? source.sourceAuthority ?? pattern.packageId),
    sourceReviewStatus: String(source.reviewStatus ?? source.editorialStatus ?? "RUNTIME_PROOF"),
    sourceMaturity: String(source.maturity ?? "RUNTIME_PROOF"),
    seed,
  };
}

function sourceFor(pattern: MensurationQuestionStudioPattern, seed: string): any {
  switch (pattern.cpId) {
    case "MEN-CP-001": case "MEN-CP-002": case "MEN-CP-003": case "MEN-CP-004": case "MEN-CP-005": case "MEN-CP-006":
      return runMen001Pipeline(pattern.cpId as any, { language: "en", questionLanguageId: pattern.patternId, seed });
    case "MEN-CP-007": return generateMenCp007ApprovedEnglishQuestion(pattern.patternId, seed);
    case "MEN-CP-008": return generateMenCp008PermanentQuestion(pattern.patternId, seed);
    case "MEN-CP-009": {
      const result = previewMenCp009QuestionStudioReview({ language: "en", qlId: pattern.patternId as any, seed, count: 1 });
      if (!result.questions.length) throw new Error(`${pattern.patternId}: CP009 adapter produced no question.`);
      return result.questions[0]!;
    }
    case "MEN-CP-010": return generateMenCp010FrozenEnglishQuestion(pattern.patternId as any, seed);
    case "MEN-CP-011": return generateCp011(pattern.patternId, seed);
    case "MEN-CP-012": return generateMenCp012PermanentEnglishQuestionV2(pattern.patternId as any, seed);
    case "MEN-CP-013": return generateMenCp013FrozenEnglishQuestion(pattern.patternId as any, seed);
    default: throw new Error(`Unsupported Mensuration canonical problem '${pattern.cpId}'.`);
  }
}

export function generateMensurationStudioQuestionV1(input: { patternId: string; seed: string }): MensurationQuestionStudioQuestion {
  const pattern = MENSURATION_QUESTION_STUDIO_PATTERNS.find((row) => row.patternId === input.patternId);
  if (!pattern) throw new Error(`Unknown Mensuration Question Studio pattern '${input.patternId}'.`);
  const question = normalize(pattern, sourceFor(pattern, input.seed), input.seed);
  if (!question.validation.valid) throw new Error(`${pattern.patternId}/${input.seed}: Question Studio normalization failed.`);
  return question;
}

export function generateMensurationStudioBatchV1(input: {
  cpId?: MensurationQuestionStudioCpId;
  patternId?: string;
  difficulty?: MensurationQuestionStudioDifficulty;
  seed?: string;
  count?: number;
}) {
  const count = Math.max(1, Math.min(50, Math.floor(input.count ?? 5)));
  const seed = input.seed?.trim() || "mensuration-question-studio";
  let eligible = MENSURATION_QUESTION_STUDIO_PATTERNS.filter((row) => !input.cpId || row.cpId === input.cpId);
  if (input.patternId) eligible = eligible.filter((row) => row.patternId === input.patternId);
  if (!eligible.length) throw new Error("No Mensuration patterns matched the requested filters.");
  const questions: MensurationQuestionStudioQuestion[] = [];
  for (let attempt = 0; questions.length < count && attempt < count * 512; attempt += 1) {
    const pattern = eligible[hashText(`${seed}:pattern:${attempt}`) % eligible.length]!;
    const question = generateMensurationStudioQuestionV1({ patternId: pattern.patternId, seed: `${seed}:${attempt}` });
    if (input.difficulty && question.difficultyBand !== input.difficulty) continue;
    questions.push(question);
  }
  if (questions.length !== count) throw new Error(`Unable to construct ${count} Mensuration questions for the requested filters.`);
  return { package: MENSURATION_QUESTION_STUDIO_PACKAGE_V1, questions, filters: { cpId: input.cpId ?? null, patternId: input.patternId ?? null, difficulty: input.difficulty ?? null }, seed };
}
