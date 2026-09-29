import { generateStat005QuestionStudioBatch, stat005QuestionStudioPackageCard } from "./partition-dispersion";

export const STAT005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID = "STAT-CP-005" as const;
export type Stat005QuestionStudioRequest = Readonly<{
  packageId?: string; archetypeId?: string; patternId?: string; topic?: string; subtopic?: string;
  canonicalProblemId?: string; cpId?: string; questionLanguageId?: string; language?: string;
  count?: number; seed?: string; examProfile?: string; difficulty?: unknown;
}>;
function norm(value: unknown) { return String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim(); }
export function isStat005QuestionStudioRequest(request: Stat005QuestionStudioRequest) {
  const pkg = norm(request.packageId ?? request.archetypeId);
  const pattern = norm(request.patternId);
  const topic = norm(request.topic);
  const subtopic = norm(request.subtopic);
  const cp = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  return pkg === "stat 005" || pattern === "stat 005" || cp === STAT005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID
    || (topic === "statistics" && (subtopic === "partition values dispersion" || subtopic === "quartiles deciles percentiles dispersion"));
}
export function generateStat005QuestionStudioBatchForAdapter(request: Stat005QuestionStudioRequest = {}) {
  const cp = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
  if (cp && cp !== STAT005_QUESTION_STUDIO_CANONICAL_PROBLEM_ID) throw new Error(`Unknown canonical problem '${cp}' for STAT-005.`);
  const language = String(request.language ?? "en").trim().toLowerCase();
  if (language !== "en") throw new Error("STAT-005 controlled review is English-only; localization has not started.");
  const profile = String(request.examProfile ?? "SSC_CGL_TIER_II").toUpperCase();
  if (profile !== "SSC_CGL_JSO" && profile !== "SSC_CGL_TIER_II") throw new Error(`STAT-005 does not support exam profile '${profile}'.`);
  return generateStat005QuestionStudioBatch({ packageId: "STAT-005", seed: request.seed, count: request.count,
    language, examProfile: profile, questionLanguageId: request.questionLanguageId });
}
export function stat005QuestionStudioCard() { return stat005QuestionStudioPackageCard(); }
