import assert from "node:assert/strict";
import {
  generateIntCp001QuestionStudioBatch,
  listIntCp001QuestionStudioPackages,
} from "./cp001-question-studio-integration-v1";
import {
  generateIntCp002QuestionStudioBatch,
  listIntCp002QuestionStudioPackages,
} from "./cp002-question-studio-integration-v1";
import {
  generateIntCp003QuestionStudioBatch,
  listIntCp003QuestionStudioPackages,
} from "./cp003-question-studio-integration-v1";
import {
  INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp004QuestionStudioReview,
} from "./cp004-question-studio-review-adapter";
import {
  generateIntCp005QuestionStudioBatch,
  listIntCp005QuestionStudioPackages,
} from "./cp005-question-studio-integration-v1";
import {
  generateIntCp006QuestionStudioBatch,
  listIntCp006QuestionStudioPackages,
} from "./cp006-question-studio-integration-v1";
import {
  INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE,
  previewIntCp007QuestionStudioReview,
} from "./cp007-question-studio-review-adapter";
import {
  generateIntCp008QuestionStudioBatch,
  listIntCp008QuestionStudioPackages,
} from "./cp008-question-studio-integration-v1";
import {
  generateIntCp009QuestionStudioBatch,
  listIntCp009QuestionStudioPackages,
} from "./cp009-question-studio-integration-v2";
import {
  generateIntCp010QuestionStudioBatch,
  listIntCp010QuestionStudioPackages,
} from "./cp010-question-studio-integration-v1";
import { generateInt001Wave04EnglishCandidate } from "./int-001-wave04-english-authority-v1";

const SEEDS_PER_QL_LANGUAGE = 8;
const EXPECTED_BASE_QL_COUNT = 130;
const NEW_QL_IDS = Object.freeze(["INT-QL-132", "INT-QL-133", "INT-QL-134"] as const);

const FORBIDDEN_ABSTRACT_NARRATION = /\b(multiplier|combined\s+factor|amount\s+factor|return[-\s]difference\s+factor|multiplication\s+factor)\b|गुणक|ਗੁਣਕ/iu;
const NUMERIC_TOKEN = /[0-9०-९੦-੯]/u;

type Generated = Readonly<{ question: any; pkg?: any }>;
type Surface = Readonly<{
  cpId: string;
  qlIds: readonly string[];
  languages: readonly string[];
  generate: (qlId: string, language: string, seed: string) => Promise<Generated>;
}>;

function firstPackage(list: readonly any[]) {
  assert.equal(list.length, 1, "Interest checkpoint integration must expose one package descriptor.");
  return list[0];
}

function qlIdsFromPackage(pkg: any): readonly string[] {
  const qlIds = pkg.permanentQlIds ?? pkg.qlIds;
  assert.ok(Array.isArray(qlIds) && qlIds.length > 0, "Question Studio package is missing permanent QL IDs.");
  return Object.freeze([...qlIds].map(String));
}

function languagesFromPackage(pkg: any): readonly string[] {
  assert.ok(Array.isArray(pkg.supportedLanguages) && pkg.supportedLanguages.length > 0, "Question Studio package is missing supported languages.");
  return Object.freeze([...pkg.supportedLanguages].map(String));
}

async function fromBatch(generator: (request: any) => Promise<any>, qlId: string, language: string, seed: string): Promise<Generated> {
  const result = await generator({ qlId, questionLanguageId: qlId, language, seed, count: 1 });
  assert.equal(result?.questions?.length, 1, `${qlId}/${language}: expected one Question Studio preview.`);
  return Object.freeze({ question: result.questions[0], pkg: result.questionPackages?.[0] });
}

const cp001 = firstPackage(listIntCp001QuestionStudioPackages());
const cp002 = firstPackage(listIntCp002QuestionStudioPackages());
const cp003 = firstPackage(listIntCp003QuestionStudioPackages());
const cp005 = firstPackage(listIntCp005QuestionStudioPackages());
const cp006 = firstPackage(listIntCp006QuestionStudioPackages());
const cp008 = firstPackage(listIntCp008QuestionStudioPackages());
const cp009 = firstPackage(listIntCp009QuestionStudioPackages());
const cp010 = firstPackage(listIntCp010QuestionStudioPackages());

const surfaces: readonly Surface[] = Object.freeze([
  { cpId: "INT-CP-001", qlIds: qlIdsFromPackage(cp001), languages: languagesFromPackage(cp001), generate: (qlId, language, seed) => fromBatch(generateIntCp001QuestionStudioBatch, qlId, language, seed) },
  { cpId: "INT-CP-002", qlIds: qlIdsFromPackage(cp002), languages: languagesFromPackage(cp002), generate: (qlId, language, seed) => fromBatch(generateIntCp002QuestionStudioBatch, qlId, language, seed) },
  { cpId: "INT-CP-003", qlIds: qlIdsFromPackage(cp003), languages: languagesFromPackage(cp003), generate: (qlId, language, seed) => fromBatch(generateIntCp003QuestionStudioBatch, qlId, language, seed) },
  {
    cpId: "INT-CP-004",
    qlIds: qlIdsFromPackage(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE),
    languages: languagesFromPackage(INT_CP004_QUESTION_STUDIO_REVIEW_PACKAGE),
    generate: async (qlId, language, seed) => {
      const result = previewIntCp004QuestionStudioReview({ qlId: qlId as any, language: language as any, seed, count: 1 });
      assert.equal(result.questions.length, 1, `${qlId}/${language}: expected one CP004 preview.`);
      return Object.freeze({ question: result.questions[0] });
    },
  },
  { cpId: "INT-CP-005", qlIds: qlIdsFromPackage(cp005), languages: languagesFromPackage(cp005), generate: (qlId, language, seed) => fromBatch(generateIntCp005QuestionStudioBatch, qlId, language, seed) },
  { cpId: "INT-CP-006", qlIds: qlIdsFromPackage(cp006), languages: languagesFromPackage(cp006), generate: (qlId, language, seed) => fromBatch(generateIntCp006QuestionStudioBatch, qlId, language, seed) },
  {
    cpId: "INT-CP-007",
    qlIds: qlIdsFromPackage(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE),
    languages: languagesFromPackage(INT_CP007_QUESTION_STUDIO_REVIEW_PACKAGE),
    generate: async (qlId, language, seed) => {
      const result = previewIntCp007QuestionStudioReview({ qlId: qlId as any, language: language as any, seed, count: 1 });
      assert.equal(result.questions.length, 1, `${qlId}/${language}: expected one CP007 preview.`);
      return Object.freeze({ question: result.questions[0] });
    },
  },
  { cpId: "INT-CP-008", qlIds: qlIdsFromPackage(cp008), languages: languagesFromPackage(cp008), generate: (qlId, language, seed) => fromBatch(generateIntCp008QuestionStudioBatch, qlId, language, seed) },
  { cpId: "INT-CP-009", qlIds: qlIdsFromPackage(cp009), languages: languagesFromPackage(cp009), generate: (qlId, language, seed) => fromBatch(generateIntCp009QuestionStudioBatch, qlId, language, seed) },
  { cpId: "INT-CP-010", qlIds: qlIdsFromPackage(cp010), languages: languagesFromPackage(cp010), generate: (qlId, language, seed) => fromBatch(generateIntCp010QuestionStudioBatch, qlId, language, seed) },
]);

function collectExplanationLines(question: any, pkg: any): readonly string[] {
  const values: string[] = [];
  const push = (value: unknown) => {
    if (value === undefined || value === null) return;
    const text = String(value).trim();
    if (!text) return;
    for (const line of text.split(/\n+/u)) if (line.trim()) values.push(line.trim());
  };
  const direct = question?.explanation;
  if (typeof direct === "string") push(direct);
  else if (direct && typeof direct === "object") {
    push(direct.whatAsked);
    push(direct.keyIdea);
    for (const line of direct.lines ?? []) push(line);
    for (const line of direct.steps ?? []) push(line);
    push(direct.conclusion);
    push(direct.finalAnswer);
    push(direct.shortcut);
    push(direct.commonTrap);
  }
  for (const line of question?.packageExplanation?.lines ?? []) push(line);
  for (const line of pkg?.explanation?.lines ?? []) push(line);
  return Object.freeze(values);
}

function workingLines(lines: readonly string[]) {
  return lines.filter((line) => !/^(what\s+asked|key\s+idea|shortcut|common\s+trap|answer|final\s+answer)\s*:/iu.test(line));
}

const baseQls = surfaces.flatMap((surface) => surface.qlIds);
assert.equal(new Set(baseQls).size, EXPECTED_BASE_QL_COUNT, "Expected the certified 130 permanent base QLs.");

const issueByQlLanguage = new Map<string, { cpId: string; qlId: string; language: string; generated: number; noNumericWorking: number; abstractNarration: number; lowArithmeticDensity: number; samples: string[] }>();
let generated = 0;
let linesReviewed = 0;
let numericWorkingLines = 0;
let abstractNarrationHits = 0;
let lowArithmeticDensityQuestions = 0;

async function inspect(cpId: string, qlId: string, language: string, seed: string, producer: () => Promise<Generated>) {
  const { question, pkg } = await producer();
  const lines = collectExplanationLines(question, pkg);
  assert.ok(lines.length > 0, `${qlId}/${language}: explanation is empty.`);
  const working = workingLines(lines);
  const numeric = working.filter((line) => NUMERIC_TOKEN.test(line));
  const abstract = lines.filter((line) => FORBIDDEN_ABSTRACT_NARRATION.test(line));
  const density = working.length === 0 ? 0 : numeric.length / working.length;
  const key = `${qlId}|${language}`;
  const row = issueByQlLanguage.get(key) ?? { cpId, qlId, language, generated: 0, noNumericWorking: 0, abstractNarration: 0, lowArithmeticDensity: 0, samples: [] };
  row.generated += 1;
  if (numeric.length === 0) row.noNumericWorking += 1;
  if (abstract.length > 0) row.abstractNarration += 1;
  if (density < 0.6) row.lowArithmeticDensity += 1;
  if ((numeric.length === 0 || abstract.length > 0 || density < 0.6) && row.samples.length < 2) {
    row.samples.push(`${seed}: ${lines.join(" | ")}`);
  }
  issueByQlLanguage.set(key, row);
  generated += 1;
  linesReviewed += working.length;
  numericWorkingLines += numeric.length;
  abstractNarrationHits += abstract.length;
  if (density < 0.6) lowArithmeticDensityQuestions += 1;
}

for (const surface of surfaces) {
  for (const qlId of surface.qlIds) {
    for (const language of surface.languages) {
      for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
        const seed = `INT-001-EXPLANATION-DISCOVERY:${surface.cpId}:${qlId}:${language}:${index}`;
        await inspect(surface.cpId, qlId, language, seed, () => surface.generate(qlId, language, seed));
      }
    }
  }
}

for (const qlId of NEW_QL_IDS) {
  for (let index = 0; index < SEEDS_PER_QL_LANGUAGE; index += 1) {
    const seed = `INT-001-EXPLANATION-DISCOVERY:WAVE04:${qlId}:en:${index}`;
    await inspect("WAVE04", qlId, "en", seed, async () => Object.freeze({ question: generateInt001Wave04EnglishCandidate(qlId, seed) }));
  }
}

const issues = [...issueByQlLanguage.values()]
  .filter((row) => row.noNumericWorking > 0 || row.abstractNarration > 0 || row.lowArithmeticDensity > 0)
  .sort((a, b) => a.qlId.localeCompare(b.qlId) || a.language.localeCompare(b.language));
const issueQls = new Set(issues.map((row) => row.qlId));
const issueByCp = Object.fromEntries([...new Set(issues.map((row) => row.cpId))].sort().map((cpId) => [
  cpId,
  Object.freeze({
    qlLanguageSurfaces: issues.filter((row) => row.cpId === cpId).length,
    qls: [...new Set(issues.filter((row) => row.cpId === cpId).map((row) => row.qlId))].sort(),
  }),
]));

console.log(JSON.stringify({
  version: "INT-001-CHAPTER-WIDE-EXPLANATION-STYLE-DISCOVERY-v1",
  explanationTarget: "DIRECT_CALCULATION",
  basePermanentQls: EXPECTED_BASE_QL_COUNT,
  newEnglishCandidateQls: NEW_QL_IDS,
  seedsPerQlLanguage: SEEDS_PER_QL_LANGUAGE,
  generatedQuestions: generated,
  workingLinesReviewed: linesReviewed,
  numericWorkingLines,
  arithmeticLineDensity: linesReviewed === 0 ? 0 : Number((numericWorkingLines / linesReviewed).toFixed(4)),
  abstractNarrationHits,
  lowArithmeticDensityQuestions,
  issueQlCount: issueQls.size,
  issueQlLanguageSurfaceCount: issues.length,
  issueByCp,
  issues,
}, null, 2));
console.log("PASS_INT_001_CHAPTER_WIDE_EXPLANATION_STYLE_DISCOVERY_V1");
