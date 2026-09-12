import { createHash } from "node:crypto";
import type { Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave06FrozenQuestion } from "./int-001-wave06-localized-freeze-v1";

export const INT_001_WAVE06_QS_VERSION = "INT-001-WAVE06-QS-v1" as const;
export const INT_001_WAVE06_QS_QL_IDS = Object.freeze(["INT-QL-132", "INT-QL-133", "INT-QL-134"] as const);
export const INT_001_WAVE06_QS_LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
export type Int001Wave06QsLanguage = (typeof INT_001_WAVE06_QS_LANGUAGES)[number];

function stableSeed(text: string) { return createHash("sha256").update(text).digest().readUInt32BE(0); }
function isQl(value: string): value is Int001Wave03QlId { return (INT_001_WAVE06_QS_QL_IDS as readonly string[]).includes(value); }
function qlCheckpoint(qlId: Int001Wave03QlId) { return qlId === "INT-QL-134" ? "INT-CP-007" : "INT-CP-010"; }
function optionText(option: any) { return String(option?.text ?? option ?? ""); }
function toJsonSafe(value: unknown): any {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return Object.freeze(value.map(toJsonSafe));
  if (value && typeof value === "object") return Object.freeze(Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, toJsonSafe(v)])));
  return value;
}

export function listInt001Wave06QuestionStudioPackages() {
  return [Object.freeze({
    id: "INT-001",
    packageId: "INT-001",
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    subject: "Quantitative Aptitude",
    topic: "Arithmetic",
    subtopic: "Interest",
    name: "INT-001 Interest — Sequential SI/CI and Scheme Difference",
    label: "Interest — New permanent authorities",
    generationDomain: "quant-v4",
    cpIds: Object.freeze(["INT-CP-007", "INT-CP-010"] as const),
    permanentQlCount: 3,
    permanentQlIds: INT_001_WAVE06_QS_QL_IDS,
    supportedLanguages: INT_001_WAVE06_QS_LANGUAGES,
    enabled: true,
    runtimeMode: "QUESTION_STUDIO_ACTIVE",
    reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
    questionStudioDiscoverable: true,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    integrationVersion: INT_001_WAVE06_QS_VERSION,
  })];
}

export async function generateInt001Wave06QuestionStudioBatch(request: Readonly<{ qlId?: string; questionLanguageId?: string; language?: string; seed?: string; count?: number }> = {}) {
  const language = String(request.language ?? "en") as Int001Wave06QsLanguage;
  if (!(INT_001_WAVE06_QS_LANGUAGES as readonly string[]).includes(language)) throw new Error(`Unsupported language ${language}`);
  const explicit = String(request.qlId ?? request.questionLanguageId ?? "");
  if (explicit && !isQl(explicit)) throw new Error(`Unsupported Wave06 Interest QL ${explicit}`);
  const pool = explicit ? [explicit as Int001Wave03QlId] : [...INT_001_WAVE06_QS_QL_IDS];
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed?.trim() || `question-studio:INT-001:WAVE06:${language}`;
  const offset = stableSeed(`${batchSeed}:offset`) % pool.length;
  const questions: any[] = [];
  for (let index = 0; index < count; index += 1) {
    const qlId = pool[(offset + index) % pool.length]!;
    const itemSeed = `${batchSeed}:${qlId}:${index}`;
    const source = generateInt001Wave06FrozenQuestion(qlId, itemSeed, language) as any;
    const options = source.options.map(optionText);
    const correctIndex = Number(source.correctIndex);
    const answer = options[correctIndex]!;
    if (!source.lifecycle?.learnerContentFrozen || !source.lifecycle?.questionStudioDiscoverable) throw new Error(`${qlId}/${language}: source not registered for Question Studio`);
    if (source.lifecycle?.questionBankWritable || source.lifecycle?.testEligible || source.lifecycle?.publiclyPublishable) throw new Error(`${qlId}/${language}: downstream lifecycle opened`);
    questions.push(Object.freeze({
      text: String(source.stem),
      stem: String(source.stem),
      options: Object.freeze(options),
      correct: correctIndex,
      correctIndex,
      answer,
      canonicalAnswer: Object.freeze({ kind: "symbolic", value: answer, display: answer, rendered: answer, rounding: "exact" }),
      explanation: (source.explanation.steps as readonly string[]).join("\n\n"),
      packageExplanation: Object.freeze({ lines: Object.freeze([...(source.explanation.steps as readonly string[])]) }),
      difficulty: qlId === "INT-QL-134" ? "Hard" : "Medium",
      difficultyLabel: qlId === "INT-QL-134" ? "Hard" : "Medium",
      patternId: "INT-001",
      section: "Quant",
      topic: "Arithmetic",
      subtopic: "Interest",
      generationBackend: "quant-v4",
      packageId: "INT-001",
      canonicalProblemId: qlCheckpoint(qlId),
      questionLanguageId: qlId,
      qlId,
      questionId: `INT-W06-${qlId.slice(-3)}-${language.toUpperCase()}-${stableSeed(itemSeed).toString(16)}`,
      seed: itemSeed,
      language,
      locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
      runtimeMode: "QUESTION_STUDIO_ACTIVE",
      reviewStatus: "FROZEN_MULTILINGUAL_CONTENT_AUTHORITY",
      questionStudioDiscoverable: true,
      questionBankStatus: "NOT_STORED",
      questionBankWritable: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      integrationAuthority: INT_001_WAVE06_QS_VERSION,
      validation: Object.freeze({ ok: true, valid: true, errors: Object.freeze([] as string[]) }),
      proceduralLogic: toJsonSafe(source.mathematicalState),
      logic: toJsonSafe(source.mathematicalState),
      traceability: Object.freeze({ permanentQlId: qlId, sourcePrototypeId: source.sourcePrototypeId, mathematicalFingerprint: source.mathematicalFingerprint }),
    }));
  }
  const result = Object.freeze({ ok: true, packageId: "INT-001", language, count, integrationVersion: INT_001_WAVE06_QS_VERSION, questions: Object.freeze(questions) });
  JSON.stringify(result);
  return result;
}
