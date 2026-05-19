import fs from "node:fs";
import path from "node:path";
import type {
  CanonicalPercentageProblem,
  Difficulty,
  PercentageSubtype,
} from "../canonical/percentage-types";
import {
  PERCENTAGE_MOTIF_FACTORIES,
  PERCENTAGE_MOTIF_FACTORY_LIST,
  type PercentageMotifFactory,
} from "../canonical/percentage-motif-factories";
import type { EditorialRealization } from "../editorial/editorial-types";
import { realizeEditorialProblem } from "../editorial/stem-realizer";
import type {
  LanguageCode,
  LocalizedRealization,
} from "../localization/contracts/language-contracts";
import { renderLocalizedRealization } from "../localization/renderers/language-renderer";
import {
  type LocalizationMetrics,
  validateLocalization,
} from "../localization/validators/localization-validator";
import type { ReasoningGraph } from "../reasoning/reasoning-graph-types";
import { buildReasoningGraph } from "../reasoning/reasoning-registry";
import { createProblemSignature } from "../utils/problem-signature";

type InspectorOptions = {
  count: number;
  seed: number;
  random: boolean;
  subtype?: PercentageSubtype;
  difficulty?: Difficulty;
  detailLimit: number;
  out?: string;
};

type FactoryEntry = {
  factory: PercentageMotifFactory;
  subtype: PercentageSubtype;
};

type LocalizedInspection = {
  language: LanguageCode;
  localized: LocalizedRealization;
  metrics: LocalizationMetrics;
  valid: boolean;
  issues: string[];
};

type SampleInspection = {
  index: number;
  problem: CanonicalPercentageProblem;
  graph: ReasoningGraph;
  editorial: EditorialRealization;
  signature: string;
  localized: LocalizedInspection[];
};

const DEFAULT_COUNT = 20;
const DEFAULT_SEED = 1;
const MAX_COUNT = 5000;
const LINE = "========================================";
const SUBTYPE_VALUES = new Set(
  Object.values(PERCENTAGE_MOTIF_FACTORIES).map(
    (factory) => factory(1).subtype,
  ),
);
const DIFFICULTY_VALUES = new Set<Difficulty>([
  "easy",
  "medium",
  "hard",
]);

function parseIntegerOption(
  value: string | undefined,
  fallback: number,
  label: string,
) {
  if (!value) {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) {
    throw new Error(`${label} must be an integer.`);
  }
  return parsed;
}

function parseArgs(args: string[]): InspectorOptions {
  const raw: Record<string, string | boolean> = {};

  for (const arg of args) {
    if (!arg.startsWith("--")) {
      throw new Error(`Unexpected positional argument: ${arg}`);
    }

    const [key, value] = arg.slice(2).split("=", 2);
    raw[key] = value ?? true;
  }

  const subtype = raw.subtype;
  if (
    typeof subtype === "string" &&
    !SUBTYPE_VALUES.has(subtype as PercentageSubtype)
  ) {
    throw new Error(`Unsupported subtype: ${subtype}`);
  }

  const difficulty = raw.difficulty;
  if (
    typeof difficulty === "string" &&
    !DIFFICULTY_VALUES.has(difficulty as Difficulty)
  ) {
    throw new Error(`Unsupported difficulty: ${difficulty}`);
  }

  const count = Math.min(
    Math.max(
      parseIntegerOption(
        typeof raw.count === "string" ? raw.count : undefined,
        DEFAULT_COUNT,
        "--count",
      ),
      1,
    ),
    MAX_COUNT,
  );
  const detailLimit = Math.min(
    count,
    Math.max(
      0,
      parseIntegerOption(
        typeof raw["detail-limit"] === "string"
          ? raw["detail-limit"]
          : undefined,
        Math.min(20, count),
        "--detail-limit",
      ),
    ),
  );
  const seed = parseIntegerOption(
    typeof raw.seed === "string" ? raw.seed : undefined,
    DEFAULT_SEED,
    "--seed",
  );

  return {
    count,
    seed,
    detailLimit,
    random: raw.random === true,
    subtype:
      typeof subtype === "string"
        ? (subtype as PercentageSubtype)
        : undefined,
    difficulty:
      typeof difficulty === "string"
        ? (difficulty as Difficulty)
        : undefined,
    out: typeof raw.out === "string" ? raw.out : undefined,
  };
}

function randomIndex(seed: number, offset: number, length: number) {
  let state = (seed + offset * 2654435761) >>> 0;
  state = Math.imul(1664525, state) + 1013904223;
  return (state >>> 0) % length;
}

function factoryEntries(): FactoryEntry[] {
  return PERCENTAGE_MOTIF_FACTORY_LIST.map((factory) => ({
    factory,
    subtype: factory(1).subtype,
  }));
}

function generateProblems(options: InspectorOptions) {
  const entries = factoryEntries().filter((entry) =>
    options.subtype ? entry.subtype === options.subtype : true,
  );
  if (entries.length === 0) {
    throw new Error("No motif factories match the requested filters.");
  }

  const problems: CanonicalPercentageProblem[] = [];
  let attempt = 0;
  while (
    problems.length < options.count &&
    attempt < options.count * entries.length * 50
  ) {
    const entry = options.random
      ? entries[randomIndex(options.seed, attempt, entries.length)]!
      : entries[attempt % entries.length]!;
    const sampleSeed =
      options.seed + Math.floor(attempt / entries.length);
    const problem = entry.factory(sampleSeed);

    if (
      !options.difficulty ||
      problem.difficulty === options.difficulty
    ) {
      problems.push(problem);
    }

    attempt += 1;
  }

  if (problems.length === 0) {
    throw new Error("No canonical problems matched the requested filters.");
  }

  return problems;
}

function inspectSample(
  problem: CanonicalPercentageProblem,
  index: number,
): SampleInspection {
  const graph = buildReasoningGraph(problem);
  const signature = createProblemSignature(problem);
  const editorial = realizeEditorialProblem({
    problem,
    graph,
    seed: `localization-inspect:${index}:${signature}`,
  });
  const localized = (["en", "hi", "pa"] as const).map((language) => {
    const rendered = renderLocalizedRealization({
      language,
      problem,
      graph,
      editorial,
    });
    const validation = validateLocalization({
      source: editorial,
      localized: rendered,
    });
    return {
      language,
      localized: rendered,
      metrics: validation.metrics,
      valid: validation.valid,
      issues: validation.issues.map((issue) => issue.message),
    };
  });

  return {
    index,
    problem,
    graph,
    editorial,
    signature,
    localized,
  };
}

function average(values: number[]) {
  return Math.round(
    values.reduce((sum, value) => sum + value, 0) /
      Math.max(1, values.length),
  );
}

function truncate(text: string, maxLength = 160) {
  const compact = text.replace(/\s+/gu, " ").trim();
  return compact.length <= maxLength
    ? compact
    : `${compact.slice(0, maxLength - 3)}...`;
}

function languageSummary(
  samples: SampleInspection[],
  language: LanguageCode,
) {
  const inspections = samples.map(
    (sample) =>
      sample.localized.find((item) => item.language === language)!,
  );
  const missingIntentCounts = new Map<string, number>();
  for (const inspection of inspections) {
    for (const intent of inspection.localized.coverage.missingIntents) {
      missingIntentCounts.set(
        intent,
        (missingIntentCounts.get(intent) ?? 0) + 1,
      );
    }
  }

  return {
    language,
    sampleCount: inspections.length,
    validCount: inspections.filter((inspection) => inspection.valid).length,
    averageCoverage: average(
      inspections.map(
        (inspection) => inspection.metrics.localizationCoverage,
      ),
    ),
    fallbackUsage: inspections.reduce(
      (sum, inspection) => sum + inspection.metrics.fallbackCount,
      0,
    ),
    averageScriptConsistency: average(
      inspections.map(
        (inspection) => inspection.metrics.scriptConsistencyScore,
      ),
    ),
    equationPreservedCount: inspections.filter(
      (inspection) =>
        inspection.metrics.equationPreservationScore === 100,
    ).length,
    averageReadiness: average(
      inspections.map(
        (inspection) => inspection.metrics.multilingualReadinessScore,
      ),
    ),
    missingIntents: [...missingIntentCounts.entries()].sort(
      (left, right) => right[1] - left[1] || left[0].localeCompare(right[0]),
    ),
  };
}

function renderReport(
  options: InspectorOptions,
  samples: SampleInspection[],
) {
  const lines: string[] = [];
  const push = (line = "") => lines.push(line);

  push(LINE);
  push("Localization Inspector");
  push(LINE);
  push(`count = ${samples.length}`);
  push(`seed = ${options.seed}`);
  push(`random = ${options.random ? "yes" : "no"}`);
  push(`subtype = ${options.subtype ?? "all"}`);
  push(`difficulty = ${options.difficulty ?? "all"}`);
  push(`detailLimit = ${options.detailLimit}`);
  push("");

  push("Language Summary:");
  for (const language of ["en", "hi", "pa"] as const) {
    const summary = languageSummary(samples, language);
    push(`  ${language}:`);
    push(`    valid = ${summary.validCount}/${summary.sampleCount}`);
    push(`    localizationCoverage = ${summary.averageCoverage}`);
    push(`    fallbackUsage = ${summary.fallbackUsage}`);
    push(
      `    scriptConsistency = ${summary.averageScriptConsistency}`,
    );
    push(
      `    equationPreservation = ${summary.equationPreservedCount}/${summary.sampleCount}`,
    );
    push(
      `    multilingualReadiness = ${summary.averageReadiness}`,
    );
    push(
      `    missingIntents = ${
        summary.missingIntents.length === 0
          ? "none"
          : summary.missingIntents
              .slice(0, 12)
              .map(([intent, count]) => `${intent}:${count}`)
              .join(", ")
      }`,
    );
  }
  push("");

  const issueSamples = samples.filter((sample) =>
    sample.localized.some((item) => !item.valid),
  );
  push(`Samples With Validator Warnings: ${issueSamples.length}`);
  for (const sample of issueSamples.slice(0, 20)) {
    push(
      `  #${sample.index} ${sample.problem.subtype} ${sample.signature}`,
    );
    for (const item of sample.localized.filter((entry) => !entry.valid)) {
      push(
        `    ${item.language}: ${item.issues.join(" | ") || "warning"}`,
      );
      push(
        `      missing = ${
          item.localized.coverage.missingIntents.join(", ") || "none"
        }`,
      );
    }
  }
  push("");

  push("Sample Preview:");
  for (const sample of samples.slice(0, options.detailLimit)) {
    push(LINE);
    push(`Sample: ${sample.index}`);
    push(`Subtype: ${sample.problem.subtype}`);
    push(`Category: ${sample.problem.category}`);
    push(`Difficulty: ${sample.problem.difficulty}`);
    push(`Signature: ${sample.signature}`);
    push(
      `Topology: ${sample.problem.topology?.family ?? "none"} / ${
        sample.problem.topology?.variant ?? "none"
      }`,
    );
    push("");
    push(`English Stem: ${sample.editorial.stem}`);
    push(`English Explanation: ${truncate(sample.editorial.explanation)}`);
    for (const item of sample.localized) {
      push("");
      push(`  ${item.language}:`);
      push(
        `    coverage = ${item.metrics.localizationCoverage}`,
      );
      push(`    fallbackUsage = ${item.metrics.fallbackCount}`);
      push(
        `    missingIntents = ${
          item.localized.coverage.missingIntents.join(", ") || "none"
        }`,
      );
      push(
        `    scriptConsistency = ${item.metrics.scriptConsistencyScore}`,
      );
      push(
        `    equationPreservation = ${item.metrics.equationPreservationScore}`,
      );
      push(
        `    readiness = ${item.metrics.multilingualReadinessScore}`,
      );
      push(`    stem = ${truncate(item.localized.stem)}`);
      push(
        `    explanation = ${truncate(item.localized.explanation)}`,
      );
    }
    push("");
  }

  return `${lines.join("\n")}\n`;
}

function writeReport(output: string, outPath: string) {
  const resolved = path.resolve(process.cwd(), outPath);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  fs.writeFileSync(resolved, output, "utf8");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const samples = generateProblems(options).map((problem, index) =>
    inspectSample(problem, index + 1),
  );
  const output = renderReport(options, samples);

  process.stdout.write(output);
  if (options.out) {
    writeReport(output, options.out);
    console.log(`Localization inspection exported to ${options.out}`);
  }
}

try {
  main();
} catch (error) {
  console.error(
    error instanceof Error
      ? error.message
      : String(error),
  );
  console.error("");
  console.error(
    "Usage: pnpm localization:inspect --count=1000 --seed=1",
  );
  console.error(
    "       pnpm localization:inspect --count=200 --out=localization-qa.txt",
  );
  process.exitCode = 1;
}
