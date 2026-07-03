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
  getPct007ActiveCanonicalProblemIds,
  runPct007Pipeline,
  type Pct007CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/Percentage/PCT-007";
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

export type QuantV4PackageId =
  | "PCT-001"
  | "PCT-002"
  | "PCT-003"
  | "PCT-004"
  | "PCT-005"
  | "PCT-006"
  | "PCT-007"
  | "RAP-001";

export type QuantV4GenerationRequest = {
  packageId?: QuantV4PackageId;
  archetypeId?: QuantV4PackageId;
  patternId?: string;
  domain?: string;
  topic?: string;
  subtopic?: string;
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
  supportedLanguages?: readonly QuantV4Language[];
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

class QuantV4RequestError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "QuantV4RequestError";
    this.statusCode = statusCode;
  }
}

const MULTILINGUAL_PREVIEW_LANGUAGES: readonly QuantV4Language[] = ["en", "hi", "pa"];
const ENGLISH_ONLY_PREVIEW_LANGUAGES: readonly QuantV4Language[] = ["en"];
export const QUANT_V4_PERCENTAGE_ALL_PATTERN_ID = "PCT-ALL";
const QUANT_V4_PERCENTAGE_ALL_PATTERN_LABEL = "All Percentage Packages";

const RUNTIME_PACKAGES: readonly QuantV4PackageDefinition[] = [
  {
    packageId: "PCT-001",
    topic: "Arithmetic",
    subtopic: "Percentage",
    label: "Percentage Fundamentals",
    cpIds: getPct001ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
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
    topic: "Arithmetic",
    subtopic: "Percentage",
    label: "Percentage Transformations",
    cpIds: getPct002ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
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
    topic: "Arithmetic",
    subtopic: "Percentage",
    label: "Percentage Increase",
    cpIds: getPct003ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
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
    topic: "Arithmetic",
    subtopic: "Percentage",
    label: "Percentage Decrease",
    cpIds: getPct004ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
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
    topic: "Arithmetic",
    subtopic: "Percentage",
    label: "Successive Percentage Change",
    cpIds: getPct005ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
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
    topic: "Arithmetic",
    subtopic: "Percentage",
    label: "Percentage Comparison & Comparative Change",
    cpIds: getPct006ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
    run: (cpId, input) =>
      runPct006Pipeline(cpId as Pct006CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "PCT-007",
    topic: "Arithmetic",
    subtopic: "Percentage",
    label: "Mixed Applications of Percentage",
    cpIds: getPct007ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
    run: (cpId, input) =>
      runPct007Pipeline(cpId as Pct007CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "RAP-001",
    topic: "Arithmetic",
    subtopic: "Ratio & Proportion",
    label: "Ratio & Proportion Fundamentals",
    cpIds: getRap001ActiveCanonicalProblemIds(),
    supportedLanguages: MULTILINGUAL_PREVIEW_LANGUAGES,
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

function normalizeSelectorText(value: unknown) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function seededHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function shuffleDeterministically<T>(items: readonly T[], seed: string) {
  const shuffled = [...items];
  let state = seededHash(seed) || 1;
  for (let index = shuffled.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!];
  }
  return shuffled;
}

function isPercentageChapterRequest(request: QuantV4GenerationRequest) {
  const topic = normalizeSelectorText(request.topic);
  const subtopic = normalizeSelectorText(request.subtopic);
  const pattern = normalizeSelectorText(request.patternId);
  const requestedPackage = normalizeSelectorText(request.packageId ?? request.archetypeId);

  return (
    pattern === normalizeSelectorText(QUANT_V4_PERCENTAGE_ALL_PATTERN_ID) ||
    requestedPackage === normalizeSelectorText(QUANT_V4_PERCENTAGE_ALL_PATTERN_ID) ||
    (topic === "percentage" && !subtopic) ||
    (topic === "arithmetic" && subtopic === "percentage")
  );
}

function getPercentageRuntimePackages() {
  return RUNTIME_PACKAGES.filter(
    (pkg) =>
      pkg.packageId.startsWith("PCT-") &&
      pkg.topic === "Arithmetic" &&
      pkg.subtopic === "Percentage",
  );
}

function resolvePackage(request: QuantV4GenerationRequest) {
  const requested = request.packageId ?? request.archetypeId;
  if (requested) {
    if (requested === QUANT_V4_PERCENTAGE_ALL_PATTERN_ID) {
      throw new QuantV4RequestError(
        "Use mixed Percentage generation for the aggregate Percentage selector.",
      );
    }
    const byId = RUNTIME_PACKAGES.find((pkg) => pkg.packageId === requested);
    if (byId) return byId;
    throw new QuantV4RequestError(`Unknown Quant V4 package: ${requested}`);
  }
  const patternText = String(request.patternId ?? "").toUpperCase();
  if (patternText) {
    if (patternText === QUANT_V4_PERCENTAGE_ALL_PATTERN_ID) {
      throw new QuantV4RequestError(
        "Use mixed Percentage generation for the aggregate Percentage selector.",
      );
    }
    const byPattern =
      RUNTIME_PACKAGES.find((pkg) => pkg.packageId === patternText) ??
      RUNTIME_PACKAGES.find((pkg) => patternText.includes(pkg.packageId));
    if (byPattern) return byPattern;
    throw new QuantV4RequestError(
      `Unknown Quant V4 package or pattern: ${String(request.patternId ?? "")}`,
    );
  }
  return RUNTIME_PACKAGES[0]!;
}

function resolveCpId(
  pkg: QuantV4PackageDefinition,
  request: QuantV4GenerationRequest,
) {
  const explicit = request.canonicalProblemId ?? request.cpId;
  if (explicit) {
    if (pkg.cpIds.includes(explicit)) return explicit;
    throw new QuantV4RequestError(
      `Unknown canonical problem '${explicit}' for package ${pkg.packageId}`,
    );
  }
  const patternText = String(request.patternId ?? "").toUpperCase();
  const fromPattern = pkg.cpIds.find((cpId) => patternText.includes(cpId));
  return fromPattern ?? pkg.cpIds[0]!;
}

export function listQuantV4Packages() {
  const discovered = discoverQuantV4Packages().map((pkg) => ({
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
    supportedLanguages: [...(pkg.supportedLanguages ?? MULTILINGUAL_PREVIEW_LANGUAGES)],
    enabled: pkg.enabled,
  }));

  const percentagePackages = discovered.filter(
    (pkg) => pkg.packageId.startsWith("PCT-") && pkg.subtopic === "Percentage",
  );
  if (!percentagePackages.length) {
    return discovered;
  }

  return [
    {
      id: QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
      packageId: QUANT_V4_PERCENTAGE_ALL_PATTERN_ID,
      type: "quant-v4",
      section: "Quant",
      domain: "quant",
      topic: "Arithmetic",
      subtopic: "Percentage",
      name: `${QUANT_V4_PERCENTAGE_ALL_PATTERN_ID} ${QUANT_V4_PERCENTAGE_ALL_PATTERN_LABEL}`,
      label: QUANT_V4_PERCENTAGE_ALL_PATTERN_LABEL,
      generationDomain: "quant-v4",
      canonicalProblems: [],
      supportedDifficulties: ["easy", "medium", "hard"],
      supportedLanguages: [...ENGLISH_ONLY_PREVIEW_LANGUAGES],
      enabled: true,
    },
    ...discovered,
  ];
}

type DiscoveredQuantV4Package = {
  packageId: string;
  topic: string;
  subtopic: string;
  label: string;
  cpIds: readonly string[];
  supportedLanguages?: readonly QuantV4Language[];
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
      supportedLanguages: runtime?.supportedLanguages,
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

function normalizeMathBody(value: string) {
  return value
    .trim()
    .replace(/^\$\$([\s\S]*)\$\$$/, "$1")
    .replace(/^\\\(([\s\S]*)\\\)$/, "$1")
    .replace(/^\\\[([\s\S]*)\\\]$/, "$1")
    .replace(/^=\s*/, "")
    .trim();
}

function toDisplayMath(value: string) {
  const normalized = normalizeMathBody(value).replace(/%/g, "\\%");
  return normalized ? `$$${normalized}$$` : "";
}

function extractExplanationBlock(
  line: string,
): { label?: string; math?: string; text?: string } {
  const trimmed = String(line ?? "").trim();
  if (!trimmed) {
    return { text: "" };
  }

  const blockMatch = trimmed.match(
    /^(?<label>[A-Za-z= ]+)?\s*\[\s*\\Rightarrow\s*(?<math>[\s\S]*?)\s*\]$/m,
  );
  if (blockMatch?.groups?.math) {
    const rawLabel = blockMatch.groups.label?.trim();
    return {
      label: rawLabel && rawLabel !== "=" ? rawLabel : undefined,
      math: blockMatch.groups.math.trim(),
      text: rawLabel === "=" ? "=" : undefined,
    };
  }

  return { text: trimmed };
}

function formatExplanationForQuestionStudio(explanation: unknown) {
  const lines = Array.isArray((explanation as { lines?: unknown[] })?.lines)
    ? ((explanation as { lines: unknown[] }).lines.map((line) => String(line ?? "")) as string[])
    : typeof explanation === "string"
      ? explanation.split(/\r?\n/)
      : [];

  const formatted: string[] = [];
  for (let index = 0; index < lines.length; index++) {
    const current = extractExplanationBlock(lines[index] ?? "");
    const next = index + 1 < lines.length ? extractExplanationBlock(lines[index + 1] ?? "") : undefined;

    if (current.label && current.math) {
      if (
        current.label.toLowerCase() === "calculation" &&
        next?.text === "=" &&
        next.math
      ) {
        formatted.push(
          `${current.label}:`,
          toDisplayMath(`${normalizeMathBody(current.math)} = ${normalizeMathBody(next.math)}`),
        );
        index++;
        continue;
      }

      formatted.push(`${current.label}:`, toDisplayMath(current.math));
      continue;
    }

    if (current.text === "=" && current.math) {
      formatted.push(toDisplayMath(current.math));
      continue;
    }

    if (current.math) {
      formatted.push(toDisplayMath(current.math));
      continue;
    }

    if (current.text) {
      formatted.push(current.text);
    }
  }

  return formatted
    .filter(Boolean)
    .join("\n\n")
    .replace(
      /\\\[\s*\\Rightarrow\s*([\s\S]*?)\s*\\\]/g,
      (_match, math) => `\n\n${toDisplayMath(String(math ?? ""))}`,
    )
    .replace(
      /\\\[\s*([\s\S]*?)\s*\\\]/g,
      (_match, math) => `\n\n${toDisplayMath(String(math ?? ""))}`,
    )
    .replace(/\$\$\s*=\s*/g, "$$")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildQuestionStudioResult(
  pkg: QuantV4PackageDefinition,
  questionPackage: any,
  context: {
    questionIndex: number;
    questionCount: number;
    seed: string;
  },
) {
  const traceability = questionPackage.traceability ?? {};
  const parameters = questionPackage.parameters ?? {};
  const scenarioId =
    traceability.scenarioId ??
    traceability.scenario ??
    parameters.scenarioId ??
    parameters.semanticContext?.scenario;
  const taskKind = traceability.taskKind ?? parameters.taskKind;
  const explanationLines = Array.isArray(questionPackage.explanation?.lines)
    ? questionPackage.explanation.lines
    : [];

  console.info("[quant-v4:batch-item]", {
    index: context.questionIndex,
    count: context.questionCount,
    packageId: pkg.packageId,
    questionId: questionPackage.questionId,
    canonicalProblemId: questionPackage.canonicalProblemId,
    questionLanguageId: questionPackage.questionLanguageId,
    explanationId: questionPackage.explanationId,
    taskKind,
    seed: context.seed,
    scenarioId,
    stem: questionPackage.stem,
    answer: questionPackage.answer,
    explanation: explanationLines.join("\n"),
  });

  return {
    packageId: pkg.packageId,
    questionPackage,
    question: toQuestionStudioPreview(questionPackage, {
      packageDefinition: pkg,
      questionIndex: context.questionIndex,
      questionCount: context.questionCount,
      seed: context.seed,
    }),
  };
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
    explanation: formatExplanationForQuestionStudio(pkg.explanation),
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
  const count = Math.min(
    1000,
    Math.max(1, Math.floor(Number(request.count ?? 1) || 1)),
  );
  const language = request.language ?? "en";
  const difficultyBand = normalizeDifficulty(request.difficulty);
  const batchSeed =
    request.seed ??
    [
      "quant-v4",
      request.packageId ??
        request.archetypeId ??
        request.patternId ??
        request.subtopic ??
        "mixed",
      request.canonicalProblemId ?? request.cpId ?? "mixed",
      Date.now(),
      Math.random().toString(36).slice(2),
    ].join(":");

  if (
    isPercentageChapterRequest(request) &&
    !(request.packageId && request.packageId !== QUANT_V4_PERCENTAGE_ALL_PATTERN_ID) &&
    !(request.archetypeId && request.archetypeId !== QUANT_V4_PERCENTAGE_ALL_PATTERN_ID)
  ) {
    const explicitCp = request.canonicalProblemId ?? request.cpId;
    const eligiblePackages = getPercentageRuntimePackages().filter(
      (pkg) => !explicitCp || pkg.cpIds.includes(explicitCp),
    );

    if (!eligiblePackages.length) {
      throw new QuantV4RequestError(
        explicitCp
          ? `Unknown canonical problem '${explicitCp}' for mixed Percentage generation`
          : "No active Percentage packages are available for mixed generation.",
      );
    }

    const packageOrder = shuffleDeterministically(
      eligiblePackages,
      `${batchSeed}:package-order`,
    );
    const usageByPackage = new Map<string, number>();
    const results = [];

    for (let i = 0; i < count; i++) {
      if (i > 0 && i % 100 === 0) {
        await new Promise((resolve) => setImmediate(resolve));
      }

      const pkg = packageOrder[i % packageOrder.length]!;
      const packageUsage = usageByPackage.get(pkg.packageId) ?? 0;
      usageByPackage.set(pkg.packageId, packageUsage + 1);
      const cpOrder = shuffleDeterministically(
        pkg.cpIds,
        `${batchSeed}:${pkg.packageId}:cp-order`,
      );
      const canonicalProblemId = explicitCp ?? cpOrder[packageUsage % cpOrder.length]!;
      const seed = `${batchSeed}:${pkg.packageId}:${canonicalProblemId}:${packageUsage}:${i}`;
      const questionPackage = await pkg.run(canonicalProblemId, {
        language,
        seed,
        questionLanguageId: request.questionLanguageId,
        difficulty: difficultyBand,
      });

      results.push(
        buildQuestionStudioResult(pkg, questionPackage, {
          questionIndex: i + 1,
          questionCount: count,
          seed,
        }),
      );
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

  const pkg = resolvePackage(request);
  const explicitCanonicalProblemId =
    request.canonicalProblemId ?? request.cpId;
  const canonicalProblemId = resolveCpId(pkg, request);
  const cpOrder = explicitCanonicalProblemId
    ? [canonicalProblemId]
    : shuffleDeterministically(
        pkg.cpIds,
        `${batchSeed}:${pkg.packageId}:cp-order`,
      );

  const results = [];
  for (let i = 0; i < count; i++) {
    if (i > 0 && i % 100 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
    const currentCanonicalProblemId =
      cpOrder[i % cpOrder.length]!;
    const seed = `${batchSeed}:${currentCanonicalProblemId}:${i}`;
    const questionPackage = await pkg.run(currentCanonicalProblemId, {
      language,
      seed,
      questionLanguageId: request.questionLanguageId,
      difficulty: difficultyBand,
    });
    results.push(
      buildQuestionStudioResult(pkg, questionPackage, {
        questionIndex: i + 1,
        questionCount: count,
        seed,
      }),
    );
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
