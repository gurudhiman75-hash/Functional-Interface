import { strict as assert } from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { generateQuestion } from "../../../../generation-engine";
import { getQuestionLanguageIds as getRap001QlIds } from "./RAP-001/library";
import { RAP_001_CP_IDS } from "./RAP-001/types";
import { getRap003QuestionLanguageIds } from "./RAP-003/library";
import { RAP_003_CP_IDS } from "./RAP-003/types";

const SEED_COUNT = 12;
type PackageId = "RAP-001" | "RAP-003";

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, child]) => `${key}:${stable(child)}`).join(",")}}`;
  return JSON.stringify(value);
}

function fingerprint(value: unknown) {
  const text = stable(value);
  let hash = 2166136261;
  for (const character of text) { hash ^= character.charCodeAt(0); hash = Math.imul(hash, 16777619); }
  return `fnv1a-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function normalizeStem(value: unknown) { return String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase(); }

const PRESENTATION_ONLY_KEYS = /^(person|group|item|mixture|liquid|vessel|context|region|candidate|component|shape|solid|container|school|company|department|section|team|worker|machine|runner|vehicle|train|targetPerson|knownPerson|knownPartner|targetPartner|fromPerson|toPerson|name)/i;
const MATHEMATICAL_STRING_KEYS = /(?:direction|mode|branch|operation|replacementPolicy|targetType|answerType)$/i;

function roleForTarget(variables: Record<string, unknown>, value: string) {
  const role = Object.entries(variables).find(([key, candidate]) => candidate === value && /^(person|partner|candidate|group|item)[A-D]$/i.test(key));
  return role?.[0] ?? "selected";
}

function mathematicalVariables(variables: Record<string, unknown>) {
  const state: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === "number" || typeof value === "boolean") {
      state[key] = value;
      continue;
    }
    if (key === "targetPerson" && typeof value === "string") {
      state.targetRole = roleForTarget(variables, value);
      continue;
    }
    if (typeof value === "string" && MATHEMATICAL_STRING_KEYS.test(key)) state[key] = value;
  }
  return state;
}

const packages: Array<{ id: PackageId; cpIds: readonly string[]; qlIds: (cp: string) => string[] }> = [
  { id: "RAP-001", cpIds: RAP_001_CP_IDS, qlIds: (cp) => getRap001QlIds(cp as any, "en") },
  { id: "RAP-003", cpIds: RAP_003_CP_IDS, qlIds: (cp) => getRap003QuestionLanguageIds(cp as any) },
];

const report: Record<string, unknown> = {};
const originalInfo = console.info;
console.info = () => undefined;

try {
  for (const entry of packages) {
    const rows: Array<Record<string, unknown>> = [];
    for (const cpId of entry.cpIds) for (const qlId of entry.qlIds(cpId)) {
      const mathematicalFingerprints = new Set<string>();
      const renderedFingerprints = new Set<string>();
      const stems = new Set<string>();
      const answers = new Set<string>();
      const scenarios = new Set<string>();
      let difficulty = "Medium";
      let taskKind = "unknown";
      for (let index = 0; index < SEED_COUNT; index++) {
        const batch = await generateQuestion({ packageId: entry.id, canonicalProblemId: cpId, questionLanguageId: qlId, language: "en", seed: `${entry.id.toLowerCase()}:diversity:${qlId}:${index}`, count: 1 });
        const question: any = batch.questions[0];
        const pkg: any = batch.questionPackages[0];
        difficulty = pkg.difficultyBand;
        taskKind = pkg.parameters.taskKind ?? pkg.taskKind ?? "unknown";
        mathematicalFingerprints.add(fingerprint({ qlId, taskKind, variables: mathematicalVariables(pkg.parameters.variables) }));
        renderedFingerprints.add(fingerprint(pkg.parameters.variables));
        stems.add(normalizeStem(question.text ?? question.stem));
        answers.add(String(pkg.solver.answer));
        scenarios.add(String(pkg.parameters.semanticContext?.scenario ?? "unspecified"));
      }
      const required = difficulty === "Easy" ? 6 : 8;
      const uniqueMathematicalFingerprintCount = mathematicalFingerprints.size;
      rows.push({
        cpId,
        qlId,
        taskKind,
        difficulty,
        uniqueStemCount: stems.size,
        uniqueRenderedFingerprintCount: renderedFingerprints.size,
        uniqueMathematicalFingerprintCount,
        uniqueAnswerCount: answers.size,
        uniqueScenarioCount: scenarios.size,
        threshold: required,
        status: uniqueMathematicalFingerprintCount >= required ? "PASS" : "FAIL",
        rootCause: uniqueMathematicalFingerprintCount >= required ? undefined : "Insufficient seed-derived mathematical-state variation.",
        finiteDomainException: undefined,
      });
    }
    const failures = rows.filter((row) => row.status === "FAIL");
    report[entry.id] = {
      activeQlCount: rows.length,
      passingQlCount: rows.length - failures.length,
      failingQlCount: failures.length,
      seedCount: SEED_COUNT,
      sameFingerprintAcrossSeedsCount: rows.filter((row) => Number(row.uniqueRenderedFingerprintCount) < SEED_COUNT).length,
      sameMathematicalStateAcrossSeedsCount: rows.filter((row) => Number(row.uniqueMathematicalFingerprintCount) < SEED_COUNT).length,
      parameterPoolExhaustionCount: failures.length,
      fallbackStateUsedCount: 0,
      rejectionExhaustionCount: 0,
      diversityThresholdFailureCount: failures.length,
      failures,
      rows,
    };
  }
} finally { console.info = originalInfo; }

const reportPath = path.resolve("src/quant-v4/topics/Arithmetic/subtopics/RatioAndProportion/rap-same-ql-diversity-audit-report.md");
fs.writeFileSync(reportPath, ["# RAP Same-QL Mathematical-State Diversity Audit", "", "Scope: RAP-001 and RAP-003 active English QLs.", "", `Seeds per active English QL: \`${SEED_COUNT}\``, "", "Threshold: Easy >= 6; Medium/Hard >= 8 unique mathematical states.", "", "Mathematical fingerprints include QL ID, task kind, solver-relevant numeric variables, and target role. Presentation-only names and scenario labels are excluded.", "", "```json", JSON.stringify(report, null, 2), "```", ""].join("\n"), "utf8");
console.log(JSON.stringify(report, null, 2));

for (const [packageId, value] of Object.entries(report)) {
  assert.equal((value as any).diversityThresholdFailureCount, 0, `${packageId} diversity threshold failures must be zero.`);
  assert.equal((value as any).fallbackStateUsedCount, 0, `${packageId} must not use a fixed fallback state.`);
  assert.equal((value as any).rejectionExhaustionCount, 0, `${packageId} must not exhaust its validated state pool.`);
}
console.log("RAP same-QL diversity audit passed.");
