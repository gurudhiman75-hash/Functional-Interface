import {
  getPct001ActiveCanonicalProblemIds,
  runPct001Pipeline,
  type Pct001CanonicalProblemId,
  type Pct001QuestionPackage,
} from "./topics/Arithmetic/subtopics/Percentage/PCT-001";
import {
  getPct002ActiveCanonicalProblemIds,
  runPct002Pipeline,
  type Pct002CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/Percentage/PCT-002";
import {
  getPct003ActiveCanonicalProblemIds,
  runPct003Pipeline,
  type Pct003CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/Percentage/PCT-003";
import {
  getPct004ActiveCanonicalProblemIds,
  runPct004Pipeline,
  type Pct004CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/Percentage/PCT-004";
import {
  getPct005ActiveCanonicalProblemIds,
  runPct005Pipeline,
  type Pct005CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/Percentage/PCT-005";
import {
  getPct006ActiveCanonicalProblemIds,
  runPct006Pipeline,
  type Pct006CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/Percentage/PCT-006";
import {
  getRap001ActiveCanonicalProblemIds,
  runRap001Pipeline,
  type Rap001CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/RatioAndProportion/RAP-001";
import {
  existsSync,
  readFileSync,
  readdirSync,
} from "node:fs";
import {
  basename,
  dirname,
  join,
} from "node:path";
import { fileURLToPath } from "node:url";
import { buildQuantV4AnswerOptions } from "./shared/answers/option-generation";
import { isArchivedQuantV4PackageDir } from "./shared/packages/archive";

export type QuantV4Language = "en" | "hi" | "pa";
export type QuantV4Difficulty = "Easy" | "Medium" | "Hard";

export type QuantV4PackageId = "PCT-001" | "PCT-002" | "PCT-003" | "PCT-004" | "PCT-005" | "PCT-006" | "RAP-001";

export type QuantV4GenerationRequest = {
  packageId?: QuantV4PackageId;
  archetypeId?: QuantV4PackageId;
  patternId?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: QuantV4Difficulty | string | number;
  language?: QuantV4Language;
  questionLanguageId?: string;
  seed?: string;
  count?: number;
};

export interface QuantV4PackageDefinition {
  packageId: string;
  topic: string;
  subtopic: string;
  label: string;
  cpIds: readonly string[];
  run: (
    cpId: string,
    input: {
      difficulty?: QuantV4Difficulty;
      language?: QuantV4Language;
      questionLanguageId?: string;
      seed?: string;
    },
  ) => Promise<any> | any;
}

const RUNTIME_PACKAGES: readonly QuantV4PackageDefinition[] = [
  {
    packageId: "PCT-001",
    topic: "Percentage",
    subtopic: "Percentage",
    label: "Percentage Fundamentals",
    cpIds: getPct001ActiveCanonicalProblemIds(),
    run: (cpId, input) =>
      runPct001Pipeline(cpId as Pct001CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "PCT-002",
    topic: "Percentage",
    subtopic: "Percentage",
    label: "Percentage Transformations",
    cpIds: getPct002ActiveCanonicalProblemIds(),
    run: (cpId, input) =>
      runPct002Pipeline(cpId as Pct002CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "PCT-003",
    topic: "Percentage",
    subtopic: "Percentage",
    label: "Percentage Increase",
    cpIds: getPct003ActiveCanonicalProblemIds(),
    run: (cpId, input) =>
      runPct003Pipeline(cpId as Pct003CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "PCT-004",
    topic: "Percentage",
    subtopic: "Percentage",
    label: "Percentage Decrease",
    cpIds: getPct004ActiveCanonicalProblemIds(),
    run: (cpId, input) =>
      runPct004Pipeline(cpId as Pct004CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "PCT-005",
    topic: "Percentage",
    subtopic: "Percentage",
    label: "Successive Percentage Change",
    cpIds: getPct005ActiveCanonicalProblemIds(),
    run: (cpId, input) =>
      runPct005Pipeline(cpId as Pct005CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "PCT-006",
    topic: "Percentage",
    subtopic: "Percentage",
    label: "Percentage Comparison & Comparative Change",
    cpIds: getPct006ActiveCanonicalProblemIds(),
    run: (cpId, input) =>
      runPct006Pipeline(cpId as Pct006CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "RAP-001",
    topic: "Ratio & Proportion",
    subtopic: "Ratio & Proportion",
    label: "Ratio & Proportion Fundamentals",
    cpIds: getRap001ActiveCanonicalProblemIds(),
    run: (cpId, input) =>
      runRap001Pipeline(cpId as Rap001CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
];

function normalizeDifficulty(value: any): QuantV4Difficulty | undefined {
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower === "easy") return "Easy";
    if (lower === "medium") return "Medium";
    if (lower === "hard") return "Hard";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function resolvePackage(request: QuantV4GenerationRequest) {
  const requested = request.packageId ?? request.archetypeId;
  if (requested) {
    const byId = RUNTIME_PACKAGES.find((pkg) => pkg.packageId === requested);
    if (byId) return byId;
  }
  const patternText = String(request.patternId ?? "").toUpperCase();
  return RUNTIME_PACKAGES.find((pkg) => patternText.includes(pkg.packageId)) ?? RUNTIME_PACKAGES[0]!;
}

function resolveCpId(
  pkg: QuantV4PackageDefinition,
  request: QuantV4GenerationRequest,
) {
  const explicit = request.canonicalProblemId ?? request.cpId;
  if (explicit && pkg.cpIds.includes(explicit)) return explicit;
  const patternText = String(request.patternId ?? "").toUpperCase();
  const fromPattern = pkg.cpIds.find((cpId) => patternText.includes(cpId));
  return fromPattern ?? pkg.cpIds[0]!;
}

export function listQuantV4Packages() {
  return discoverQuantV4Packages().map((pkg) => ({
    id: pkg.packageId,
    packageId: pkg.packageId,
    type: "quant-v4",
    section: "Quant",
    domain: "quant",
    topic: pkg.topic,
    subtopic: pkg.subtopic,
    name: `${pkg.packageId} ${pkg.label}`,
    label: pkg.label,
    generationDomain: "quant-v4",
    canonicalProblems: pkg.cpIds.map((cpId) => ({
      id: cpId,
      label: cpId,
    })),
    supportedDifficulties: ["easy", "medium", "hard"],
    supportedLanguages: ["en", "hi", "pa"],
    enabled: pkg.enabled,
  }));
}

type DiscoveredQuantV4Package = {
  packageId: string;
  topic: string;
  subtopic: string;
  label: string;
  cpIds: readonly string[];
  enabled: boolean;
};

const quantV4Root = dirname(fileURLToPath(import.meta.url));
const quantV4TopicRoots = [
  join(quantV4Root, "topics"),
  join(process.cwd(), "src", "quant-v4", "topics"),
];

function readPackageLabel(packageDir: string, packageId: string) {
  const archetypePath = join(packageDir, "archetype.md");
  if (!existsSync(archetypePath)) return packageId;

  const text = readFileSync(archetypePath, "utf8");
  const nameLine = text
    .split(/\r?\n/)
    .find((line) => /^#\s+/.test(line) || /^Name\s*:/i.test(line));

  return nameLine
    ? nameLine.replace(/^#\s+/, "").replace(/^Name\s*:\s*/i, "").trim() || packageId
    : packageId;
}

function readCpIds(packageDir: string, fallback: readonly string[]) {
  const registryPath = join(packageDir, "task-registry.library.json");
  if (!existsSync(registryPath)) return fallback;

  try {
    const registry = JSON.parse(readFileSync(registryPath, "utf8"));
    const ids = new Set<string>();
    const entries = Array.isArray(registry)
      ? registry
      : Object.values(registry).flatMap((value: any) =>
          Array.isArray(value) ? value : [value],
        );

    for (const entry of entries as any[]) {
      const cpId =
        entry?.canonicalProblemId ??
        entry?.cpId ??
        entry?.canonicalProblem ??
        entry?.cp;
      if (typeof cpId === "string") ids.add(cpId);
    }

    return ids.size ? [...ids] : fallback;
  } catch {
    return fallback;
  }
}

function discoverPackageDirs(root: string) {
  const found: string[] = [];
  const visit = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const child = join(dir, entry.name);
      if (isArchivedQuantV4PackageDir(child)) continue;
      const hasQuestionLibrary =
        existsSync(join(child, "question-language.en.json")) ||
        existsSync(join(child, "question-language.library.json"));

      if (hasQuestionLibrary) {
        found.push(child);
      } else {
        visit(child);
      }
    }
  };

  if (existsSync(root)) visit(root);
  return found;
}

function discoverQuantV4Packages(): DiscoveredQuantV4Package[] {
  const runtimeById = new Map(
    RUNTIME_PACKAGES.map((pkg) => [pkg.packageId, pkg]),
  );
  const packageDirs = [
    ...new Set(
      quantV4TopicRoots.flatMap((root) =>
        discoverPackageDirs(root),
      ),
    ),
  ];
  const discovered = packageDirs.map((packageDir) => {
    const packageId = basename(packageDir);
    const runtime = runtimeById.get(packageId);
    const normalized = packageDir.replace(/\\/g, "/");
    const match = normalized.match(/\/topics\/([^/]+)\/subtopics\/([^/]+)\//);

    return {
      packageId,
      topic: runtime?.topic ?? match?.[1] ?? "Quant",
      subtopic: runtime?.subtopic ?? match?.[2] ?? packageId,
      label: runtime?.label ?? readPackageLabel(packageDir, packageId),
      cpIds: readCpIds(packageDir, runtime?.cpIds ?? []),
      enabled: Boolean(runtime),
    };
  });

  for (const runtime of RUNTIME_PACKAGES) {
    if (!discovered.some((pkg) => pkg.packageId === runtime.packageId)) {
      discovered.push({
        ...runtime,
        enabled: true,
      });
    }
  }

  return discovered.sort((left, right) =>
    left.packageId.localeCompare(right.packageId),
  );
}

export function toQuestionStudioPreview(
  pkg: any,
  context: {
    packageDefinition?: QuantV4PackageDefinition;
    questionIndex?: number;
    questionCount?: number;
    seed?: string;
  } = {},
) {
  const explanationLines = Array.isArray(pkg.explanation?.lines)
    ? pkg.explanation.lines
    : [];
  const packageDefinition =
    context.packageDefinition ??
    RUNTIME_PACKAGES.find((entry) => entry.packageId === pkg.archetypeId);
  const traceability = pkg.traceability ?? {};
  const parameters = pkg.parameters ?? {};
  const scenarioId =
    traceability.scenarioId ??
    traceability.scenario ??
    parameters.scenarioId ??
    parameters.semanticContext?.scenario;
  const taskKind = traceability.taskKind ?? parameters.taskKind;
  const packageOptions = Array.isArray(pkg.options)
    ? pkg.options.map((option: unknown) => String(option ?? ""))
    : [];
  const optionResult = buildQuantV4AnswerOptions(pkg.answer, {
    existingOptions: packageOptions,
    seed: context.seed ?? pkg.questionId ?? pkg.stem ?? "quant-v4",
  });
  const options = optionResult.options;
  const correct = optionResult.correct;
  return {
    text: pkg.stem,
    options,
    correct,
    explanation: explanationLines.join("\n"),
    packageExplanation: pkg.explanation,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: pkg.archetypeId,
    section: "Quant",
    topic: packageDefinition?.topic ?? "Quant V4",
    subtopic: packageDefinition?.subtopic ?? pkg.archetypeId,
    generationBackend: "quant-v4",
    debugSource: "quant-v4-package-runtime",
    reasoningGraph: pkg.reasoningGraph,
    semanticMetadata: pkg.traceability,
    traceability: pkg.traceability,
    validation: pkg.validation,
    questionId: pkg.questionId,
    seed: context.seed ?? pkg.questionId,
    answer: pkg.answer,
    canonicalAnswer: optionResult.canonicalAnswer,
    packageSource: "quant-v4-package-runtime",
    packageId: pkg.archetypeId,
    taskKind,
    scenarioId,
    questionIndex: context.questionIndex,
    questionCount: context.questionCount,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    explanationId: pkg.explanationId,
    proceduralLogic: pkg.parameters,
    logic: pkg.parameters,
    debugMetadata: {
      generationDomain: "quant-v4",
      selectedPattern: pkg.archetypeId,
      selectedArchetype: pkg.archetypeId,
      selectedMotif: pkg.canonicalProblemId,
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind,
      scenarioId,
      questionIndex: context.questionIndex,
      questionCount: context.questionCount,
      questionId: pkg.questionId,
      packageSource: "quant-v4-package-runtime",
      seed: context.seed ?? pkg.questionId,
      reasoningGraph: pkg.reasoningGraph,
      semanticMetadata: pkg.traceability,
      validatorReports: pkg.validation,
    },
  };
}

/**
 * Single public entry point for Quant V4 generation.
 * Question Studio calls only this.
 */
export async function generateQuestion(
  request: QuantV4GenerationRequest = {},
) {
  const pkg = resolvePackage(request);
  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const language = request.language ?? "en";
  const difficultyBand = normalizeDifficulty(request.difficulty);
  const canonicalProblemId = resolveCpId(pkg, request);
  const batchSeed =
    request.seed ??
    [
      "quant-v4",
      pkg.packageId,
      canonicalProblemId,
      Date.now(),
      Math.random().toString(36).slice(2),
    ].join(":");

  const results = [];
  for (let i = 0; i < count; i++) {
    if (i > 0 && i % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const seed = `${batchSeed}:${i}`;
    const questionPackage = await pkg.run(canonicalProblemId, {
      language,
      seed,
      questionLanguageId: request.questionLanguageId,
      difficulty: difficultyBand,
    });
    const explanationLines = Array.isArray(questionPackage.explanation?.lines)
      ? questionPackage.explanation.lines
      : [];
    const traceability = questionPackage.traceability ?? {};
    const parameters = questionPackage.parameters ?? {};
    const scenarioId =
      traceability.scenarioId ??
      traceability.scenario ??
      parameters.scenarioId ??
      parameters.semanticContext?.scenario;
    const taskKind = traceability.taskKind ?? parameters.taskKind;

    console.info("[quant-v4:batch-item]", {
      index: i + 1,
      count,
      packageId: pkg.packageId,
      questionId: questionPackage.questionId,
      canonicalProblemId: questionPackage.canonicalProblemId,
      questionLanguageId: questionPackage.questionLanguageId,
      explanationId: questionPackage.explanationId,
      taskKind,
      seed,
      scenarioId,
      stem: questionPackage.stem,
      answer: questionPackage.answer,
      explanation: explanationLines.join("\n"),
    });

    results.push({
      packageId: pkg.packageId,
      questionPackage,
      question: toQuestionStudioPreview(questionPackage, {
        packageDefinition: pkg,
        questionIndex: i + 1,
        questionCount: count,
        seed,
      }),
    });
  }

  return {
    generationContext: {
      generationDomain: "quant-v4",
      seed: batchSeed,
      timestamp: Date.now(),
    },
    questionPackages: results.map((item) => item.questionPackage),
    questions: results.map((item) => item.question),
  };
}
