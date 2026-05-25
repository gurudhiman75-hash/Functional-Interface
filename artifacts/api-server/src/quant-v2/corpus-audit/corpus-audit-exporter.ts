import { createWriteStream } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { finished } from "node:stream/promises";

import type { FormulaQuestion, GeneratorOptions, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import { createQuantV2ProfitLossQuestionCandidate } from "../../lib/quant-v2/profit-loss-admin-adapter";
import { COMMERCIAL_OBJECT_POOL } from "../editorial/commercial-object-pools";
import { validateCorpusAuditBatch } from "../validators/corpus-audit-validator";
import {
  createCorpusSchedulerState,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
  extractCorpusSchedulerMetadata,
  summarizeCorpusScheduler,
  type CorpusSchedulerState,
  type CorpusSchedulerSummary,
} from "../corpus-scheduler/corpus-scheduler";
import { evaluateCorpusQuality } from "../corpus-scheduler/corpus-quality-evaluator";
import { getCorpusAuditPreset } from "./corpus-audit-presets";
import {
  estimateCorpusAuditExportSizeMb,
  getCorpusAuditExportProfile,
  shouldIncludeMultilingualExplanations,
} from "./corpus-audit-profiles";
import type {
  CorpusAuditExportItem,
  CorpusAuditExportOptions,
  CorpusAuditExportResult,
  CorpusAuditJobSnapshot,
  CorpusAuditSummary,
  CorpusAuditStatus,
} from "./corpus-audit-types";

const DEFAULT_BATCH_SIZE = 250;
const MAX_AUDIT_COUNT = 20_000;
const PREVIEW_SAMPLE_COUNT = 25;

const PERCENTAGE_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-percentage",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit percentage pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

const PROFIT_LOSS_AUDIT_PATTERN: Pattern = {
  id: "quant-v2-corpus-audit-profit-loss",
  type: "formula",
  section: "Quant",
  topic: "profit_loss_discount",
  subtopic: "profit_loss_discount",
  difficulty: "Medium",
  templateVariants: ["Quant-v2 corpus audit profit loss discount pattern"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-profit-loss",
};

function auditPatternForPreset(presetId: string): Pattern {
  return presetId === "profit_loss_audit"
    ? PROFIT_LOSS_AUDIT_PATTERN
    : PERCENTAGE_AUDIT_PATTERN;
}

function generateForPreset(presetId: string, pattern: Pattern, options: GeneratorOptions) {
  return presetId === "profit_loss_audit"
    ? createQuantV2ProfitLossQuestionCandidate(pattern, options)
    : createQuantV2PercentageQuestionCandidate(pattern, options);
}

type RunningSummary = CorpusAuditSummary & {
  scoreTotal: number;
  hindiPresent: number;
  punjabiPresent: number;
  hindiScriptOk: number;
  punjabiScriptOk: number;
  hindiExplanationPresent: number;
  punjabiExplanationPresent: number;
  fallbackCount: number;
  englishExplanationLines: number;
  hindiExplanationLines: number;
  punjabiExplanationLines: number;
  openings: Map<string, number>;
  scheduler?: CorpusSchedulerSummary;
};

function sanitizeCount(count: number) {
  return Math.min(MAX_AUDIT_COUNT, Math.max(1, Math.floor(Number(count) || 1)));
}

function increment(map: Record<string, number>, key: unknown) {
  const normalized = String(key ?? "unknown").trim() || "unknown";
  map[normalized] = (map[normalized] ?? 0) + 1;
}

function exportRoot() {
  return path.resolve(process.cwd(), "exports");
}

function timestampSlug(date = new Date()) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join("-") + `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function createSummary(): RunningSummary {
  return {
    generatedCount: 0,
    topologyDistribution: {},
    subtypeDistribution: {},
    difficultyDistribution: {},
    compactnessDistribution: {},
    domainDistribution: {},
    objectFrequency: {},
    realismScores: {
      min: 100,
      max: 0,
      average: 0,
    },
    validatorFailureCounts: {},
    repeatedStructureWarnings: [],
    multilingualConsistency: {
      hindiCoverage: 0,
      punjabiCoverage: 0,
      hindiScriptConsistency: 0,
      punjabiScriptConsistency: 0,
      hindiExplanationCoverage: 0,
      punjabiExplanationCoverage: 0,
      localizationCompleteness: 0,
      fallbackCount: 0,
    },
    explanationCompactness: {
      englishAverageLines: 0,
      hindiAverageLines: 0,
      punjabiAverageLines: 0,
    },
    exportProfile: "audit_light",
    includeMultilingualExplanations: false,
    estimatedSizeMb: 0,
    exportWarnings: [],
    scoreTotal: 0,
    hindiPresent: 0,
    punjabiPresent: 0,
    hindiScriptOk: 0,
    punjabiScriptOk: 0,
    hindiExplanationPresent: 0,
    punjabiExplanationPresent: 0,
    fallbackCount: 0,
    englishExplanationLines: 0,
    hindiExplanationLines: 0,
    punjabiExplanationLines: 0,
    openings: new Map(),
  };
}

function forcedMotifsForTopology(selection: CorpusAuditExportOptions["topologySelection"]) {
  if (selection === "relational") {
    return [
      "perc_relational_chain",
      "perc_reverse_relation",
      "perc_ratio_percentage_hybrid",
    ];
  }

  return undefined;
}

function quantV2Payload(question: FormulaQuestion) {
  return (question.debugMetadata?.quantV2 ?? {}) as Record<string, any>;
}

function validatorReports(question: FormulaQuestion) {
  return (
    quantV2Payload(question).validatorReports ??
    (question.proceduralLogic as any)?.validatorReports ??
    {}
  ) as Record<string, any>;
}

function topologyKey(topology: any, fallbackSubtype: string) {
  if (!topology) return `none:${fallbackSubtype}`;
  return [
    topology.family ?? "none",
    topology.variant ?? fallbackSubtype,
  ].join(":");
}

function hasHindiScript(value: string) {
  return /[\u0900-\u097F]/.test(value);
}

function hasPunjabiScript(value: string) {
  return /[\u0A00-\u0A7F]/.test(value);
}

function updateObjectFrequency(summary: RunningSummary, text: string) {
  const lower = text.toLowerCase();
  for (const object of COMMERCIAL_OBJECT_POOL) {
    if (lower.includes(object.en.toLowerCase())) {
      increment(summary.objectFrequency, object.en);
    }
  }
}

function explanationLineCount(value: string | undefined) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean).length;
}

function itemFromQuestion(input: {
  index: number;
  question: FormulaQuestion;
  includeSvg: boolean;
  includeFullQuestion: boolean;
  includeMultilingualExplanations: boolean;
  includeReasoningGraph: boolean;
  includeValidatorReports: boolean;
  includeRealismMetadata: boolean;
  includeLocalizationMetadata: boolean;
}): CorpusAuditExportItem {
  const quantV2 = quantV2Payload(input.question);
  const reports = validatorReports(input.question);
  const problem = quantV2.canonicalProblem ?? (input.question.semanticMetadata as any)?.problem;
  const correct = input.question.correct ?? 0;
  const answer = input.question.options?.[correct] ?? String(problem?.answer ?? "");

  const explanationHi = input.includeMultilingualExplanations
    ? input.question.explanationHi ?? ""
    : undefined;
  const explanationPa = input.includeMultilingualExplanations
    ? input.question.explanationPa ?? ""
    : undefined;

  return {
    index: input.index,
    id: String(quantV2.signature ?? `sample-${input.index}`),
    question: input.question.text,
    options: input.question.options,
    correct,
    answer,
    explanation: input.question.explanation,
    ...(explanationHi ? { explanationHi } : {}),
    ...(explanationPa ? { explanationPa } : {}),
    multilingual: {
      en: {
        question: input.question.text,
        options: input.question.options,
        explanation: input.question.explanation,
      },
      hi: input.question.textHi
        ? {
            question: input.question.textHi,
            options: input.question.optionsHi ?? input.question.options,
            ...(explanationHi ? { explanation: explanationHi } : {}),
          }
        : undefined,
      pa: input.question.textPa
        ? {
            question: input.question.textPa,
            options: input.question.optionsPa ?? input.question.options,
            ...(explanationPa ? { explanation: explanationPa } : {}),
          }
        : undefined,
    },
    difficulty: input.question.difficultyLabel ?? input.question.difficulty ?? "Medium",
    topology: quantV2.topology ?? problem?.topology ?? null,
    reasoningGraph: input.includeReasoningGraph
      ? quantV2.reasoningGraph ?? input.question.reasoningGraph ?? null
      : null,
    semanticMetadata: quantV2.semanticMetadata ?? input.question.semanticMetadata ?? null,
    validatorReports: input.includeValidatorReports ? reports : null,
    traps: problem?.traps ?? input.question.examRealismMetadata?.reasoningTraps ?? [],
    qualityMetrics: quantV2.qualityMetrics ?? input.question.qualityMetrics ?? null,
    realismMetadata: input.includeRealismMetadata
      ? input.question.examRealismMetadata ?? null
      : null,
    difficultyMetadata: input.question.difficultyMetadata ?? null,
    compactnessProfile:
      quantV2.realizationCompactness ??
      (quantV2.editorial?.naturalization?.rhythmProfile as string | undefined) ??
      "unknown",
    semanticAnchors: {
      scenario: quantV2.scenario,
      category: quantV2.category,
      subtype: quantV2.subtype,
      reasoningPattern: quantV2.reasoningPattern,
      canonicalScenario:
        quantV2.canonicalScenario ??
        quantV2.semanticMetadata?.canonicalScenario ??
        (input.question.semanticMetadata as any)?.canonicalScenario ??
        null,
      semanticConsistency: reports.semanticConsistency ?? null,
      ...(input.includeLocalizationMetadata
        ? {
            localizationCoverage: input.question.nativeCoverage ?? null,
          }
        : {}),
    },
    corpusRealism: reports.corpusRealism ?? null,
    ...(input.includeSvg
      ? {
          svgRendering: quantV2.svgRendering ?? input.question.svgRendering ?? null,
        }
      : {}),
    ...(input.includeFullQuestion ? { sourceQuestion: input.question } : {}),
  };
}

function updateSummary(summary: RunningSummary, item: CorpusAuditExportItem) {
  summary.generatedCount += 1;

  const problem = (item.semanticMetadata as any)?.problem ?? (item.semanticMetadata as any);
  const subtype = String((item.semanticAnchors as any)?.subtype ?? problem?.subtype ?? "unknown");
  const category = String((item.semanticAnchors as any)?.category ?? problem?.category ?? "unknown");
  increment(summary.topologyDistribution, topologyKey(item.topology as any, subtype));
  increment(summary.subtypeDistribution, subtype);
  increment(summary.difficultyDistribution, item.difficulty);
  increment(summary.compactnessDistribution, item.compactnessProfile);
  increment(summary.domainDistribution, category);
  updateObjectFrequency(summary, item.question);

  const score =
    Number((item.qualityMetrics as any)?.metrics?.editorialRealismScore) ||
    Number((item.realismMetadata as any)?.realismScore) ||
    0;
  if (score > 0) {
    summary.realismScores.min = Math.min(summary.realismScores.min, score);
    summary.realismScores.max = Math.max(summary.realismScores.max, score);
    summary.scoreTotal += score;
  }

  for (const [name, report] of Object.entries((item.validatorReports as any) ?? {})) {
    if (report && typeof report === "object" && "valid" in report && report.valid === false) {
      increment(summary.validatorFailureCounts, name);
    }
  }

  const opening = item.question.split(/\s+/).slice(0, 7).join(" ").toLowerCase();
  summary.openings.set(opening, (summary.openings.get(opening) ?? 0) + 1);

  if (item.multilingual.hi?.question) {
    summary.hindiPresent += 1;
    if (hasHindiScript(item.multilingual.hi.question)) summary.hindiScriptOk += 1;
    if (item.multilingual.hi.explanation || item.explanationHi) {
      summary.hindiExplanationPresent += 1;
      summary.hindiExplanationLines += explanationLineCount(
        item.multilingual.hi.explanation ?? item.explanationHi,
      );
    }
  }
  if (item.multilingual.pa?.question) {
    summary.punjabiPresent += 1;
    if (hasPunjabiScript(item.multilingual.pa.question)) summary.punjabiScriptOk += 1;
    if (item.multilingual.pa.explanation || item.explanationPa) {
      summary.punjabiExplanationPresent += 1;
      summary.punjabiExplanationLines += explanationLineCount(
        item.multilingual.pa.explanation ?? item.explanationPa,
      );
    }
  }
  summary.englishExplanationLines += explanationLineCount(item.explanation);

  if (
    item.multilingual.hi?.question &&
    item.multilingual.hi.question === item.question
  ) {
    summary.fallbackCount += 1;
  }
  if (
    item.multilingual.pa?.question &&
    item.multilingual.pa.question === item.question
  ) {
    summary.fallbackCount += 1;
  }
}

function finalizeSummary(
  summary: RunningSummary,
  options: {
    exportProfile: CorpusAuditSummary["exportProfile"];
    includeMultilingualExplanations: boolean;
    estimatedSizeMb: number;
  },
): CorpusAuditSummary {
  const total = Math.max(summary.generatedCount, 1);
  const repeated = [...summary.openings.entries()]
    .filter(([, count]) => count > Math.max(5, total * 0.02))
    .slice(0, 20)
    .map(([opening, count]) => `Opening repeated ${count} times: ${opening}`);

  const finalized: CorpusAuditSummary = {
    generatedCount: summary.generatedCount,
    topologyDistribution: summary.topologyDistribution,
    subtypeDistribution: summary.subtypeDistribution,
    difficultyDistribution: summary.difficultyDistribution,
    compactnessDistribution: summary.compactnessDistribution,
    domainDistribution: summary.domainDistribution,
    objectFrequency: summary.objectFrequency,
    realismScores: {
      min: summary.realismScores.min === 100 ? 0 : summary.realismScores.min,
      max: summary.realismScores.max,
      average: Number((summary.scoreTotal / total).toFixed(2)),
    },
    validatorFailureCounts: summary.validatorFailureCounts,
    repeatedStructureWarnings: repeated,
    multilingualConsistency: {
      hindiCoverage: Number((summary.hindiPresent / total).toFixed(4)),
      punjabiCoverage: Number((summary.punjabiPresent / total).toFixed(4)),
      hindiScriptConsistency: Number((summary.hindiScriptOk / total).toFixed(4)),
      punjabiScriptConsistency: Number((summary.punjabiScriptOk / total).toFixed(4)),
      hindiExplanationCoverage: Number((summary.hindiExplanationPresent / total).toFixed(4)),
      punjabiExplanationCoverage: Number((summary.punjabiExplanationPresent / total).toFixed(4)),
      localizationCompleteness: Number(
        ((
          summary.hindiPresent +
          summary.punjabiPresent +
          summary.hindiExplanationPresent +
          summary.punjabiExplanationPresent
        ) / (total * 4)).toFixed(4),
      ),
      fallbackCount: summary.fallbackCount,
    },
    explanationCompactness: {
      englishAverageLines: Number((summary.englishExplanationLines / total).toFixed(2)),
      hindiAverageLines: Number((summary.hindiExplanationLines / total).toFixed(2)),
      punjabiAverageLines: Number((summary.punjabiExplanationLines / total).toFixed(2)),
    },
    exportProfile: options.exportProfile,
    includeMultilingualExplanations: options.includeMultilingualExplanations,
    estimatedSizeMb: options.estimatedSizeMb,
    exportWarnings: summary.exportWarnings,
    ...(summary.scheduler ? { scheduler: summary.scheduler } : {}),
    ...(summary.scheduler
      ? { corpusQuality: evaluateCorpusQuality(summary.scheduler) }
      : {}),
  };

  const validation = validateCorpusAuditBatch({
    samples: [],
    summary: finalized,
  });
  for (const issue of validation.issues) {
    finalized.exportWarnings.push(issue);
  }
  for (const warning of validation.warnings) {
    finalized.exportWarnings.push(warning);
  }

  return finalized;
}

function writeTxtItem(
  item: CorpusAuditExportItem,
  includeMultilingualExplanations: boolean,
) {
  const lines = [
    `[Q${item.index + 1}]`,
    "EN:",
    item.question,
    "",
    "HI:",
    item.multilingual.hi?.question ?? "missing",
    "",
    "PA:",
    item.multilingual.pa?.question ?? "missing",
    "",
    `Options: ${item.options.join(" | ")}`,
    `Answer: ${item.answer}`,
    `Difficulty: ${item.difficulty}`,
    `Topology: ${topologyKey(item.topology as any, String((item.semanticAnchors as any)?.subtype ?? "unknown"))}`,
    `Realism: ${Number((item.qualityMetrics as any)?.metrics?.editorialRealismScore ?? 0)}`,
    "",
    "Explanation EN:",
    item.explanation,
    "",
  ];

  if (includeMultilingualExplanations) {
    lines.push(
      "Explanation HI:",
      item.explanationHi ?? item.multilingual.hi?.explanation ?? "missing",
      "",
      "Explanation PA:",
      item.explanationPa ?? item.multilingual.pa?.explanation ?? "missing",
      "",
    );
  }

  return `${lines.join("\n")}\n`;
}

function previewItem(item: CorpusAuditExportItem) {
  return {
    index: item.index,
    question: item.question,
    options: item.options,
    answer: item.answer,
    difficulty: item.difficulty,
    topology: item.topology,
    semanticAnchors: item.semanticAnchors,
    multilingual: item.multilingual,
    realismScore: Number((item.qualityMetrics as any)?.metrics?.editorialRealismScore ?? 0),
  };
}

export async function runCorpusAuditExport(
  options: CorpusAuditExportOptions,
  onProgress?: (snapshot: { generatedCount: number; outputDir: string }) => void,
): Promise<CorpusAuditExportResult> {
  const startedAt = Date.now();
  const preset = getCorpusAuditPreset(options.presetId);
  const auditPattern = auditPatternForPreset(preset.id);
  const exportProfile = getCorpusAuditExportProfile(options.exportProfile);
  const count = sanitizeCount(options.count || preset.defaultCount);
  const batchSize = Math.min(1000, Math.max(1, options.batchSize ?? DEFAULT_BATCH_SIZE));
  const exportId = `corpus-${timestampSlug()}`;
  const outputDir = path.resolve(options.outDir ?? path.join(exportRoot(), exportId));
  const files = {
    json: path.join(outputDir, "corpus.json"),
    txt: path.join(outputDir, "corpus.txt"),
    summary: path.join(outputDir, "audit-summary.json"),
    preview: path.join(outputDir, "sample-preview.json"),
  };

  await mkdir(outputDir, { recursive: true });

  const jsonStream = createWriteStream(files.json, { encoding: "utf8" });
  const txtStream = createWriteStream(files.txt, { encoding: "utf8" });
  const summary = createSummary();
  const forcedMotifIds =
    options.forcedMotifIds?.length
      ? options.forcedMotifIds
      : forcedMotifsForTopology(options.topologySelection) ?? preset.forcedMotifIds;
  const seedPrefix = options.seed ?? preset.seedPrefix;
  const examProfile = options.examProfile ?? preset.examProfile;
  const includeSvg = options.includeSvg ?? exportProfile.includeSvgByDefault;
  const includeFullQuestion = options.includeFullQuestion ?? false;
  const includeMultilingualExplanations =
    shouldIncludeMultilingualExplanations(options);
  const estimatedSizeMb = estimateCorpusAuditExportSizeMb({
    count,
    exportProfile: exportProfile.id,
    includeSvg,
    includeMultilingualExplanations,
  });

  jsonStream.write("[\n");
  txtStream.write(
    `# Quant V2 Corpus Audit Export\n\nExport: ${exportId}\nPreset: ${preset.id}\nProfile: ${exportProfile.id}\nCount: ${count}\nEstimated Size: ~${estimatedSizeMb} MB\nMultilingual explanations: ${includeMultilingualExplanations ? "yes" : "no"}\n\n`,
  );

  let first = true;
  let generatedCount = 0;
  const previewItems: ReturnType<typeof previewItem>[] = [];
  const schedulerState: CorpusSchedulerState | undefined = options.useScheduler
    ? createCorpusSchedulerState({
        targetCount: count,
        profileId: options.schedulerProfile ?? "balanced_mock",
      })
    : undefined;
  const scheduledQuestions: FormulaQuestion[] = [];

  for (let start = 0; start < count; start += batchSize) {
    const end = Math.min(count, start + batchSize);
    for (let index = start; index < end; index += 1) {
      const forcedMotifId = forcedMotifIds?.[index % forcedMotifIds.length];
      const question = schedulerState
        ? generateScheduledQuestion({
            state: schedulerState,
            index,
            seedPrefix,
            examProfile,
            forcedMotifId,
            generate: (generatorOptions: GeneratorOptions) =>
              generateForPreset(preset.id, auditPattern, generatorOptions),
          }).question
        : generateForPreset(
            preset.id,
            auditPattern,
            {
              seed: `${seedPrefix}:${index}`,
              examProfile,
              ...(forcedMotifId ? { forcedMotifId } : {}),
            },
          );
      if (schedulerState && count <= 200) {
        scheduledQuestions.push(question);
        continue;
      }

      const item = itemFromQuestion({
        index,
        question,
        includeSvg,
        includeFullQuestion,
        includeMultilingualExplanations,
        includeReasoningGraph: exportProfile.includeReasoningGraph,
        includeValidatorReports: exportProfile.includeValidatorReports,
        includeRealismMetadata: exportProfile.includeRealismMetadata,
        includeLocalizationMetadata: exportProfile.includeLocalizationMetadata,
      });

      jsonStream.write(`${first ? "" : ",\n"}${JSON.stringify(item)}`);
      txtStream.write(writeTxtItem(item, includeMultilingualExplanations));
      first = false;
      generatedCount += 1;
      updateSummary(summary, item);
      if (previewItems.length < PREVIEW_SAMPLE_COUNT) {
        previewItems.push(previewItem(item));
      }
    }

    if (!(schedulerState && count <= 200)) {
      onProgress?.({
        generatedCount,
        outputDir,
      });
    }
  }

  if (schedulerState && count <= 200) {
    const orderedQuestions = interleaveScheduledPreviewQuestions(
      scheduledQuestions,
      seedPrefix,
      (question) => extractCorpusSchedulerMetadata(question).familyKey,
    );
    for (const [index, question] of orderedQuestions.entries()) {
      const item = itemFromQuestion({
        index,
        question,
        includeSvg,
        includeFullQuestion,
        includeMultilingualExplanations,
        includeReasoningGraph: exportProfile.includeReasoningGraph,
        includeValidatorReports: exportProfile.includeValidatorReports,
        includeRealismMetadata: exportProfile.includeRealismMetadata,
        includeLocalizationMetadata: exportProfile.includeLocalizationMetadata,
      });

      jsonStream.write(`${first ? "" : ",\n"}${JSON.stringify(item)}`);
      txtStream.write(writeTxtItem(item, includeMultilingualExplanations));
      first = false;
      generatedCount += 1;
      updateSummary(summary, item);
      if (previewItems.length < PREVIEW_SAMPLE_COUNT) {
        previewItems.push(previewItem(item));
      }
    }
    onProgress?.({
      generatedCount,
      outputDir,
    });
  }

  jsonStream.write("\n]\n");
  jsonStream.end();
  txtStream.end();

  await Promise.all([finished(jsonStream), finished(txtStream)]);

  const finalizedSummary = finalizeSummary(summary, {
    exportProfile: exportProfile.id,
    includeMultilingualExplanations,
    estimatedSizeMb,
  });
  if (schedulerState) {
    finalizedSummary.scheduler = summarizeCorpusScheduler(schedulerState);
    finalizedSummary.corpusQuality = evaluateCorpusQuality(
      finalizedSummary.scheduler,
    );
  }
  await writeFile(files.summary, `${JSON.stringify(finalizedSummary, null, 2)}\n`, "utf8");
  await writeFile(files.preview, `${JSON.stringify(previewItems, null, 2)}\n`, "utf8");

  return {
    exportId,
    status: "completed",
    count,
    outputDir,
    files,
    summary: finalizedSummary,
    durationMs: Date.now() - startedAt,
  };
}

const jobs = new Map<string, CorpusAuditJobSnapshot>();

function createJobId() {
  return `corpusaudit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function setJobStatus(
  job: CorpusAuditJobSnapshot,
  status: CorpusAuditStatus,
  patch: Partial<CorpusAuditJobSnapshot> = {},
) {
  const next = {
    ...job,
    ...patch,
    status,
    updatedAt: new Date().toISOString(),
  };
  jobs.set(job.id, next);
  return next;
}

export function startCorpusAuditExportJob(options: CorpusAuditExportOptions) {
  const preset = getCorpusAuditPreset(options.presetId);
  const job: CorpusAuditJobSnapshot = {
    id: createJobId(),
    status: "queued",
    requestedCount: sanitizeCount(options.count || preset.defaultCount),
    generatedCount: 0,
    progress: 0,
    presetId: preset.id,
    queuedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  jobs.set(job.id, job);

  setTimeout(() => {
    const running = setJobStatus(job, "running", {
      startedAt: new Date().toISOString(),
    });
    void runCorpusAuditExport(options, (progress) => {
      const current = jobs.get(job.id) ?? running;
      setJobStatus(current, "running", {
        generatedCount: progress.generatedCount,
        progress: Number((progress.generatedCount / job.requestedCount).toFixed(4)),
        outputDir: progress.outputDir,
      });
    })
      .then((result) => {
        const current = jobs.get(job.id) ?? running;
        setJobStatus(current, "completed", {
          generatedCount: result.count,
          progress: 1,
          outputDir: result.outputDir,
          files: result.files,
          summary: result.summary,
          completedAt: new Date().toISOString(),
        });
      })
      .catch((error) => {
        const current = jobs.get(job.id) ?? running;
        setJobStatus(current, "failed", {
          errorMessage:
            error instanceof Error ? error.message : "Unknown corpus audit export failure",
          completedAt: new Date().toISOString(),
        });
      });
  }, 0);

  return job;
}

export function getCorpusAuditJob(id: string) {
  return jobs.get(id) ?? null;
}

export function listCorpusAuditJobs() {
  return [...jobs.values()].sort((a, b) => b.queuedAt.localeCompare(a.queuedAt));
}
