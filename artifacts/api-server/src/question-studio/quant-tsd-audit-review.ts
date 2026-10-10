import { optionSet as cp008Options } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp008/question-studio-review-adapter";
import { optionTexts as cp009Options } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp009/question-studio-review-adapter";
import { optionsFor as cp010Options } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp010/question-studio-candidate-adapter-final";
import { optionsFor as cp011Options } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp011/question-studio-candidate";
import { optionsFor as cp012Options } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/TSD-002/cp012/question-studio-candidate";
import { buildTsdIntegratedReviewCorpus } from "../quant-v4/topics/Arithmetic/subtopics/TimeSpeedDistance/quality-audit/studio-integrated-review-corpus";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as standardLifecycle } from "./standard-lifecycle";
import type {
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioPackageDefinition,
  QuestionStudioGeneratedQuestion,
} from "./engine-types";
const {
  questionBankAcceptanceMode: _acceptanceMode,
  questionBankAcceptanceAuthority: _acceptanceAuthority,
  ...lifecycle
} = standardLifecycle;
export const TSD_AUDIT_REVIEW_PACKAGE_ID = "TSD-AUDIT-REVIEW";
const record = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};
function flatten(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(String).join("\n\n");
  const e = record(v),
    s = e.steps ?? e.stepByStepSolution;
  return [
    e.method ?? e.keyRule,
    ...(Array.isArray(s) ? s : []),
    e.conclusion ?? e.finalAnswer,
  ]
    .filter((x) => typeof x === "string" && x.trim())
    .join("\n\n");
}
function attachOptions(
  row: Record<string, unknown>,
  cp: string,
  index: number,
): Record<string, unknown> {
  if (Array.isArray(row.options)) return row;
  const language = String(row.language ?? row.locale ?? "en").split("-")[0] as
    | "en"
    | "hi"
    | "pa";
  const seed = `tsd-audit-options:${index}`;
  if (cp === "TSD-CP-008") {
    const sol = row.sourceSolution as {
      value: Parameters<typeof cp008Options>[0];
      unit: Parameters<typeof cp008Options>[1];
    };
    return {
      ...row,
      ...cp008Options(
        sol.value,
        sol.unit,
        String(row.familyId),
        language,
        index,
      ),
    };
  }
  if (cp === "TSD-CP-009") {
    const options = [
        ...cp009Options(
          row.sourceSolution as Parameters<typeof cp009Options>[0],
          language,
        ),
      ],
      shift = index % 4;
    return {
      ...row,
      options: [...options.slice(shift), ...options.slice(0, shift)],
      correctIndex: (4 - shift) % 4,
    };
  }
  if (cp === "TSD-CP-010")
    return {
      ...row,
      ...cp010Options(
        row.solution as Parameters<typeof cp010Options>[0],
        language,
        seed,
      ),
    };
  if (cp === "TSD-CP-011")
    return {
      ...row,
      ...cp011Options(
        row.input as Parameters<typeof cp011Options>[0],
        row.solution as Parameters<typeof cp011Options>[1],
        language,
        seed,
      ),
    };
  if (cp === "TSD-CP-012")
    return {
      ...row,
      ...cp012Options(
        row as unknown as Parameters<typeof cp012Options>[0],
        language,
        seed,
      ),
    };
  throw new Error(`No option authority for ${cp}`);
}
const rows: QuestionStudioGeneratedQuestion[] =
  buildTsdIntegratedReviewCorpus().map((original, index) => {
    const source = record(original.source),
      raw = { ...source, ...original, ...record(original.presentation) },
      group = String(original.reviewGroup ?? "");
    const supplemental: Record<string, string> = {
      twoWalker: "011",
      signedCycle: "012",
      slowdown: "012",
      headstarts: "010",
    };
    const cp = original.checkpoint
      ? `TSD-CP-${String(original.checkpoint).replace(/^CP/, "")}`
      : group === "motionExtensions"
        ? "TSD-SOURCE-EXTENSIONS"
        : `TSD-CP-${supplemental[group] ?? group.match(/^cp(\d{3})/)?.[1]}`;
    const row = attachOptions(raw, cp, index);
    const language = String(row.language ?? row.locale ?? "en").split("-")[0],
      options = Array.isArray(row.options) ? row.options.map(String) : [],
      correctIndex = Number(row.correctIndex ?? row.correct ?? -1),
      stem = String(row.stem ?? row.text ?? ""),
      explanation = flatten(row.explanation);
    const qlId = String(
        row.qlId ?? row.permanentQlId ?? source.permanentQlId ?? "",
      ),
      band = String(
        row.difficultyBand ?? row.difficulty ?? "Medium",
      ).toLowerCase(),
      difficulty =
        row.advancedSourceOnly === true
          ? "Hard"
          : band === "easy"
            ? "Easy"
            : band === "hard"
              ? "Hard"
              : "Medium";
    if (
      cp.includes("undefined") ||
      !["en", "hi", "pa"].includes(language) ||
      !stem ||
      !explanation ||
      options.length !== 4 ||
      new Set(options).size !== 4 ||
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex > 3
    )
      throw new Error(`Invalid integrated TSD row ${index}/${cp}/${language}`);
    return {
      questionId: `tsd-audit-${index}-${language}`,
      text: stem,
      stem,
      options,
      correct: correctIndex,
      correctIndex,
      answer: options[correctIndex],
      answerText: options[correctIndex],
      explanation,
      difficulty,
      difficultyLabel: difficulty,
      language,
      packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
      patternId: TSD_AUDIT_REVIEW_PACKAGE_ID,
      canonicalProblemId: cp,
      qlId: qlId || undefined,
      questionLanguageId: qlId || undefined,
      familyId: row.familyId,
      section: "Quant",
      topic: "Arithmetic",
      subtopic: "Time, Speed & Distance",
      generationBackend: "quant-v4",
      ...lifecycle,
      lifecycleStage: "REVIEW_ONLY",
      reviewOnly: true,
      productOwnerApprovalRecorded: false,
      reviewStatus: "AUDITED_REVIEW_PENDING_USER_LIVE_VERIFICATION",
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
      routeMounted: true,
      productionSelectorVisible: true,
      persistenceAllowed: false,
      publicReleaseAuthorized: false,
      advancedSourceOnly: row.advancedSourceOnly === true,
      sourceObservation: row.sourceObservation,
      metadata: {
        reviewGroup: original.reviewGroup ?? original.authoritySource,
        sourcePackageId: row.packageId,
        liveVerificationOwner: "PRODUCT_OWNER",
        liveVerificationStatus: "DEFERRED_BY_USER",
        sourceApprovalUnchanged: true,
      },
    };
  });
const cpIds = [
  ...new Set(rows.map((r) => String(r.canonicalProblemId))),
].sort();
export function tsdAuditReviewEnginePackage(): QuestionStudioPackageDefinition {
  return {
    engineId: "quant-v4",
    packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
    topic: "Arithmetic",
    subtopic: "Time, Speed & Distance",
    label: "Time, Speed & Distance — audited chapter review",
    enabled: true,
    cpIds,
    supportedLanguages: ["en", "hi", "pa"],
    supportedDifficulties: ["Easy", "Medium", "Hard"],
    difficultyFilterSupported: true,
    runtimeMode: "TSD-AUDITED-CHAPTER-REVIEW",
    ...lifecycle,
    lifecycleStage: "REVIEW_ONLY",
    metadata: {
      authoredRows: rows.length,
      sourceExtensionModels: 14,
      liveVerification: "USER_DEFERRED",
    },
  };
}
function hash(s: string): number {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}
export function generateTsdAuditReviewBatch(
  request: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult | null {
  if (
    String(request.packageId ?? "").toUpperCase() !==
    TSD_AUDIT_REVIEW_PACKAGE_ID
  )
    return null;
  const language = request.language ?? "en",
    count = request.count ?? 1,
    difficulty = String(request.difficulty ?? "mixed").toLowerCase(),
    seed = String(request.seed ?? "TSD-AUDIT-REVIEW");
  if (!["en", "hi", "pa"].includes(language))
    throw new Error("Unsupported TSD review language");
  if (!Number.isInteger(count) || count < 1 || count > 50)
    throw new Error("TSD review count must be 1..50");
  if (!["mixed", "easy", "medium", "moderate", "hard"].includes(difficulty))
    throw new Error("Unsupported TSD review difficulty");
  const candidates = rows.filter(
    (r) =>
      r.language === language &&
      (!request.canonicalProblemId ||
        r.canonicalProblemId === request.canonicalProblemId) &&
      (!request.questionLanguageId || r.qlId === request.questionLanguageId) &&
      (difficulty === "mixed" ||
        String(r.difficulty).toLowerCase() ===
          (difficulty === "moderate" ? "medium" : difficulty)),
  );
  const ordered = candidates
    .map((row) => ({ row, rank: hash(`${seed}:${row.questionId}`) }))
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        String(a.row.questionId).localeCompare(String(b.row.questionId)),
    );
  const seen = new Set<string>(),
    questions: QuestionStudioGeneratedQuestion[] = [];
  for (const { row } of ordered) {
    const key = JSON.stringify([row.canonicalProblemId, row.stem, row.options]);
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push({ ...row, options: [...row.options!] });
    if (questions.length === count) break;
  }
  if (questions.length !== count)
    throw new Error(
      `TSD audit has ${questions.length} unique questions matching these filters; requested ${count}`,
    );
  return {
    questions,
    generationContext: {
      engineId: "quant-v4",
      generationDomain: "quant-v4",
      packageId: TSD_AUDIT_REVIEW_PACKAGE_ID,
      seed,
      ...lifecycle,
      lifecycleStage: "REVIEW_ONLY",
      reviewOnly: true,
      liveVerificationStatus: "DEFERRED_BY_USER",
      publicReleaseAuthorized: false,
    },
  };
}

/** Copy of transport-safe review rows for exhaustive integration validation. */
export function getTsdIntegratedReviewRowsForAudit(): readonly QuestionStudioGeneratedQuestion[] {
  return rows.map((row) => ({ ...row, options: [...row.options!] }));
}
