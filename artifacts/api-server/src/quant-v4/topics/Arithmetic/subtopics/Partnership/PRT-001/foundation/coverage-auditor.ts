import {
  getPrt001QuestionLanguageIds,
  getPrt001TaskEntries,
  validatePrt001PilotLibraries,
} from "./library";
import { runPrt001PilotPipeline } from "./pipeline";
import { PRT_001_CP_IDS, type Prt001Language } from "./types";

export interface Prt001AuditReport {
  readonly audit: string;
  readonly cases: number;
  readonly metrics: Readonly<Record<string, unknown>>;
}

function requireAudit(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function auditPrt001Coverage(): Prt001AuditReport {
  const libraryFailures = validatePrt001PilotLibraries();
  requireAudit(libraryFailures.length === 0, libraryFailures.join("\n"));
  const entries = getPrt001TaskEntries();
  const byCp = Object.fromEntries(
    PRT_001_CP_IDS.map((cpId) => [
      cpId,
      entries.filter(({ entry }) => entry.cpId === cpId).length,
    ]),
  );
  const expectedByCp: Record<string, number> = {
    "PRT-CP-001": 6,
    "PRT-CP-002": 6,
    "PRT-CP-003": 4,
    "PRT-CP-004": 4,
    "PRT-CP-005": 4,
    "PRT-CP-006": 4,
    "PRT-CP-007": 4,
  };
  requireAudit(entries.length === 32, `expected 32 active QLs, got ${entries.length}`);
  requireAudit(JSON.stringify(byCp) === JSON.stringify(expectedByCp), "CP coverage changed");
  requireAudit(new Set(entries.map(({ entry }) => entry.solveMode)).size === 28, "solve-mode coverage changed");
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    requireAudit(entries.some(({ entry }) => entry.difficulty === difficulty), `missing ${difficulty}`);
  }
  return {
    audit: "coverage",
    cases: entries.length,
    metrics: { byCp, solveModes: 28, languages: 3 },
  };
}

export function auditPrt001ContextRealism(): Prt001AuditReport {
  let cases = 0;
  const contexts = new Set<string>();
  for (const questionLanguageId of getPrt001QuestionLanguageIds()) {
    for (let index = 0; index < 8; index += 1) {
      const pkg = runPrt001PilotPipeline({
        questionLanguageId,
        seed: `prt-001:realism:${questionLanguageId}:${index}`,
      });
      requireAudit(pkg.stem.length >= 45, `${questionLanguageId} stem is too short`);
      requireAudit(pkg.stem.length <= 520, `${questionLanguageId} stem is too long`);
      requireAudit(!/[{}]|undefined|NaN/.test(pkg.stem), `${questionLanguageId} leaked a token`);
      requireAudit(/[₹0-9]/.test(pkg.stem), `${questionLanguageId} lacks a quantitative given`);
      contexts.add(String(pkg.traceability.scenarioFamily));
      cases += 1;
    }
  }
  requireAudit(contexts.size >= 20, `expected at least 20 context families, got ${contexts.size}`);
  return { audit: "context-realism", cases, metrics: { contextFamilies: contexts.size } };
}

export function auditPrt001Multilingual(): Prt001AuditReport {
  const scripts: Record<Exclude<Prt001Language, "en">, RegExp> = {
    hi: /[\u0900-\u097f]/,
    pa: /[\u0a00-\u0a7f]/,
  };
  let cases = 0;
  for (const questionLanguageId of getPrt001QuestionLanguageIds()) {
    for (let index = 0; index < 6; index += 1) {
      const seed = `prt-001:locale:${questionLanguageId}:${index}`;
      const english = runPrt001PilotPipeline({ questionLanguageId, seed, language: "en" });
      for (const language of ["hi", "pa"] as const) {
        const localized = runPrt001PilotPipeline({ questionLanguageId, seed, language });
        requireAudit(scripts[language].test(localized.stem), `${language}:${questionLanguageId} has no native script`);
        requireAudit(scripts[language].test(localized.explanation.lines.join(" ")), `${language}:${questionLanguageId} explanation has no native script`);
        requireAudit(localized.answerType === english.answerType, `${language}:${questionLanguageId} answer-type drift`);
        requireAudit(localized.solveMode === english.solveMode, `${language}:${questionLanguageId} solve-mode drift`);
        requireAudit(JSON.stringify(localized.traceability.exactWeights) === JSON.stringify(english.traceability.exactWeights), `${language}:${questionLanguageId} math drift`);
        cases += 1;
      }
    }
  }
  return { audit: "multilingual", cases, metrics: { languages: ["en", "hi", "pa"], parity: true } };
}

export function auditPrt001OptionQuality(): Prt001AuditReport {
  const positions = [0, 0, 0, 0];
  let cases = 0;
  for (const questionLanguageId of getPrt001QuestionLanguageIds()) {
    for (let index = 0; index < 16; index += 1) {
      const pkg = runPrt001PilotPipeline({
        questionLanguageId,
        seed: `prt-001:options:${questionLanguageId}:${index}`,
      });
      requireAudit(pkg.options.length === 4, `${questionLanguageId} does not have four options`);
      requireAudit(new Set(pkg.options).size === 4, `${questionLanguageId} has duplicate options`);
      requireAudit(pkg.options[pkg.correctIndex] === pkg.answer, `${questionLanguageId} correctIndex mismatch`);
      requireAudit(pkg.options.every((option) => option.trim().length > 0), `${questionLanguageId} has an empty option`);
      positions[pkg.correctIndex] += 1;
      cases += 1;
    }
  }
  for (const [index, count] of positions.entries()) {
    requireAudit(count / cases >= 0.18, `answer position ${index} is underrepresented (${count}/${cases})`);
  }
  return { audit: "option-quality", cases, metrics: { answerPositions: positions } };
}
