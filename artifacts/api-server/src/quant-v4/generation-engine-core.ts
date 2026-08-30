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
  getRap002ActiveCanonicalProblemIds,
  runRap002Pipeline,
  type Rap002CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/RatioAndProportion/RAP-002";
import {
  getRap003ActiveCanonicalProblemIds,
  runRap003Pipeline,
  type Rap003CanonicalProblemId,
} from "./topics/Arithmetic/subtopics/RatioAndProportion/RAP-003";
import {
  getPrt001ActiveCanonicalProblemIds,
  runPrt001Pipeline,
  type Prt001PilotCanonicalProblemId,
} from "./topics/Arithmetic/subtopics/Partnership/PRT-001";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, join } from "node:path";
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
  | "RAP-001"
  | "RAP-002"
  | "RAP-003"
  | "PRT-001";

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

const MULTILINGUAL_PREVIEW_LANGUAGES: readonly QuantV4Language[] = [
  "en",
  "hi",
  "pa",
];
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
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
    run: (cpId, input) =>
      runRap001Pipeline(cpId as Rap001CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "RAP-002",
    topic: "Arithmetic",
    subtopic: "Ratio & Proportion",
    label: "Compound Proportions & Linked Ratios",
    cpIds: getRap002ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
    run: (cpId, input) =>
      runRap002Pipeline(cpId as Rap002CanonicalProblemId, {
        difficultyBand:
          input.difficulty === "Medium" || input.difficulty === "Hard"
            ? input.difficulty
            : undefined,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "RAP-003",
    topic: "Arithmetic",
    subtopic: "Ratio & Proportion",
    label: "Advanced Ratio & Proportion Applications",
    cpIds: getRap003ActiveCanonicalProblemIds(),
    supportedLanguages: ENGLISH_ONLY_PREVIEW_LANGUAGES,
    run: (cpId, input) =>
      runRap003Pipeline(cpId as Rap003CanonicalProblemId, {
        difficultyBand: input.difficulty,
        language: input.language,
        questionLanguageId: input.questionLanguageId,
        seed: input.seed,
      }),
  },
  {
    packageId: "PRT-001",
    topic: "Arithmetic",
    subtopic: "Partnership",
    label: "Partnership",
    cpIds: getPrt001ActiveCanonicalProblemIds(),
    supportedLanguages: MULTILINGUAL_PREVIEW_LANGUAGES,
    run: (cpId, input) =>
      runPrt001Pipeline(cpId as Prt001PilotCanonicalProblemId, {
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
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex]!,
      shuffled[index]!,
    ];
  }
  return shuffled;
}

function isPercentageChapterRequest(request: QuantV4GenerationRequest) {
  const topic = normalizeSelectorText(request.topic);
  const subtopic = normalizeSelectorText(request.subtopic);
  const pattern = normalizeSelectorText(request.patternId);
  const requestedPackage = normalizeSelectorText(
    request.packageId ?? request.archetypeId,
  );

  return (
    pattern === normalizeSelectorText(QUANT_V4_PERCENTAGE_ALL_PATTERN_ID) ||
    requestedPackage ===
      normalizeSelectorText(QUANT_V4_PERCENTAGE_ALL_PATTERN_ID) ||
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
    supportedLanguages: [
      ...(pkg.supportedLanguages ?? MULTILINGUAL_PREVIEW_LANGUAGES),
    ],
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
    ? nameLine
        .replace(/^#\s+/, "")
        .replace(/^Name\s*:\s*/i, "")
        .trim() || packageId
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
    ...new Set(quantV4TopicRoots.flatMap((root) => discoverPackageDirs(root))),
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
  let normalized = String(value ?? "").trim();
  for (let pass = 0; pass < 3; pass++) {
    normalized = normalized
      .replace(/^\$\$\s*/, "")
      .replace(/\s*\$\$$/, "")
      .replace(/^\\\(\s*/, "")
      .replace(/\s*\\\)$/, "")
      .replace(/^\\\[\s*/, "")
      .replace(/\s*\\\]$/, "")
      .trim();
  }
  return normalized
    .replace(/\$\$/g, "")
    .replace(/\\\(|\\\)|\\\[|\\\]/g, "")
    .replace(/^=\s*/, "")
    .trim();
}

function toDisplayMath(value: string) {
  const normalized = normalizeMathBody(value).replace(/%/g, "\\%");
  return normalized ? `$$${normalized}$$` : "";
}

function formatPreviewNumber(value: number) {
  const rounded = Math.round(value * 10000) / 10000;
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded)
        .replace(/(\.\d*?)0+$/, "$1")
        .replace(/\.$/, "");
}

function polishGeneratedEnglishText(value: string) {
  return String(value ?? "")
    .replace(/\b-?\d+\.\d{10,}\b/g, (rawValue: string) => {
      const numericValue = Number(rawValue);
      return Number.isFinite(numericValue)
        ? formatPreviewNumber(numericValue)
        : rawValue;
    })
    .replace(/([A-Za-z0-9%])\.{2,}/g, "$1.")
    .replace(/\b([A-Za-z]+)\s+\1\b/gi, "$1")
    .replace(/\bmonthly monthly\b/gi, "monthly")
    .replace(/\bA investment\b/g, "An investment")
    .replace(/\ba investment\b/g, "an investment")
    .replace(/\bA income\b/g, "An income")
    .replace(/\ba income\b/g, "an income")
    .replace(/\bThe Unit A output was\b/g, "Unit A's output was")
    .replace(/\bUnit A output\b/g, "Unit A's output")
    .replace(/\bUnit B output\b/g, "Unit B's output")
    .replace(/\bSchool An attendance\b/g, "School A's attendance")
    .replace(/\bSchool B attendance\b/g, "School B's attendance")
    .replace(/\bFor a output\b/g, "For an output")
    .replace(/\bA output\b/g, "An output")
    .replace(/\ba output\b/g, "an output")
    .replace(/\bA output level\b/g, "An output level")
    .replace(/\ba output level\b/g, "an output level")
    .replace(/\bA investment value\b/g, "An investment value")
    .replace(/\ba investment value\b/g, "an investment value")
    .replace(/\bA asset value\b/g, "An asset value")
    .replace(/\ba asset value\b/g, "an asset value")
    .replace(/\bhas a asset value\b/g, "has an asset value")
    .replace(/\bA inventory is\b/g, "An inventory is")
    .replace(/\ba inventory is\b/g, "an inventory is")
    .replace(
      /\bFrom A (vessel|container|tank)\b/g,
      (_match, noun: string) => `From a ${noun}`,
    )
    .replace(/\bA rent is\b/g, "The rent is")
    .replace(/\ba rent is\b/g, "the rent is")
    .replace(/\bA sales of\b/g, "Sales of")
    .replace(/\bA sales is\b/g, "Sales are")
    .replace(
      /\b(A|a)\s+(Product|Warehouse|Branch|Fund|Asset|Unit|Machine)\s+([A-Z])\b/g,
      (_match, _article: string, entity: string, suffix: string) =>
        `${entity} ${suffix}`,
    )
    .replace(
      /\b(salary|production|product|warehouse|branch|fund|asset|unit|machine)\s+([A-Z])\b/g,
      (_match, entity: string, suffix: string) =>
        `${entity.charAt(0).toUpperCase()}${entity.slice(1)} ${suffix}`,
    )
    .replace(/\bSchool A attendance\b/g, "School A's attendance")
    .replace(/\bschool A attendance\b/g, "school A's attendance")
    .replace(/\bA train has (\d+) students\b/gi, "A school has $1 students")
    .replace(
      /\bThe current internet users is\b/g,
      "The current number of internet users is",
    )
    .replace(/\bthe internet users\b/gi, "the number of internet users")
    .replace(
      /\boriginal internet users\b/gi,
      "original number of internet users",
    )
    .replace(/\bNew internet users\b/g, "New number of internet users")
    .replace(
      /\bthe new internet users is\b/gi,
      "the new number of internet users is",
    )
    .replace(/\bnew internet users is\b/gi, "new number of internet users is")
    .replace(
      /\bextra internet users is needed\b/gi,
      "extra internet users are needed",
    )
    .replace(
      /\bhow much extra (applicants|students|passengers|residents|voters|cartons|boxes|units|bags|accounts) is needed\b/gi,
      (_match, noun: string) => `how many extra ${noun} are needed`,
    )
    .replace(/\bSection A attendance\b/g, "Section A's attendance")
    .replace(/\bSection B attendance\b/g, "Section B's attendance")
    .replace(/\bRoute A passengers starts\b/g, "Route A passenger count starts")
    .replace(/\bRoute B passengers starts\b/g, "Route B passenger count starts")
    .replace(/\bthere are (\d+) population\b/gi, "the population is $1")
    .replace(/\bproduction production\b/gi, "production batch")
    .replace(
      /\bThe whole (students|employees|passengers|respondents|applicants|users|people|books|cartons|boxes|bags|patients|voters|accounts|forms|invoices|seats|items|units|residents)\b/gi,
      (_match, noun: string) => `The total number of ${noun}`,
    )
    .replace(
      /\b(employees|students|residents|passengers|workers) was\b/gi,
      (_match, noun: string) => `${noun} were`,
    )
    .replace(
      /\b(students|employees|passengers|respondents|applicants|users|people|books|cartons|boxes|bags|patients|voters|accounts|forms|invoices|seats|items|units|residents) represents\b/gi,
      (_match, noun: string) => `${noun} represent`,
    )
    .replace(
      /\bthe (units|cartons|boxes|bags|students|passengers|residents|employees) becomes\b/gi,
      (_match, noun: string) => `the ${noun} become`,
    )
    .replace(
      /\b(the|Therefore the|So the) total (students|employees|passengers|respondents|applicants|users|people|books|cartons|boxes|bags|patients|voters|accounts|forms|invoices|seats|items|units|residents) is\b/gi,
      (_match, prefix: string, noun: string) =>
        `${prefix} total number of ${noun} is`,
    )
    .replace(
      /\b(the|So the|Therefore the) new (households|passengers|users|active users|students|residents|employees|workers|applicants|cartons|boxes|bags|units) is\b/gi,
      (_match, prefix: string, noun: string) =>
        `${prefix} new number of ${noun} is`,
    )
    .replace(
      /\b(the|So the) (units|cartons|boxes|bags|students|passengers|residents|employees) after both (increases|decreases) is\b/gi,
      (_match, prefix: string, noun: string, change: string) =>
        `${prefix} ${noun} after both ${change} are`,
    )
    .replace(
      /\bSo the final (units|cartons|boxes|bags|students|passengers|residents|employees) is\b/gi,
      (_match, noun: string) => `So the final number of ${noun} is`,
    )
    .replace(
      /\bthe final (units|cartons|boxes|bags|students|passengers|residents|employees) is\b/gi,
      (_match, noun: string) => `the final number of ${noun} is`,
    )
    .replace(/\bnew marks is\b/g, "new marks are")
    .replace(/\bfinal marks is\b/g, "final marks are")
    .replace(/\bfinal residents is\b/gi, "final number of residents is");
}

function extractExplanationBlock(line: string): {
  label?: string;
  math?: string;
  text?: string;
} {
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
    ? ((explanation as { lines: unknown[] }).lines.map((line) =>
        String(line ?? ""),
      ) as string[])
    : typeof explanation === "string"
      ? explanation.split(/\r?\n/)
      : [];

  const formatted: string[] = [];
  for (let index = 0; index < lines.length; index++) {
    const current = extractExplanationBlock(lines[index] ?? "");
    const next =
      index + 1 < lines.length
        ? extractExplanationBlock(lines[index + 1] ?? "")
        : undefined;

    if (current.label && current.math) {
      if (
        current.label.toLowerCase() === "calculation" &&
        next?.text === "=" &&
        next.math
      ) {
        formatted.push(
          `${current.label}:`,
          toDisplayMath(
            `${normalizeMathBody(current.math)}=${normalizeMathBody(next.math)}`,
          ),
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
  const language = pkg.language ?? "en";
  const runtimeMode = parameters.runtimeMode ?? traceability.generationMode;
  const reviewStatus = parameters.reviewStatus ?? traceability.reviewStatus;
  const questionBankStatus =
    parameters.questionBankStatus ?? traceability.questionBankStatus;
  const testEligibility = parameters.testEligibility ?? traceability.testEligibility;
  const publiclyPublishable =
    parameters.publiclyPublishable ?? traceability.publiclyPublishable;
  const packageOptions = Array.isArray(pkg.options)
    ? pkg.options.map((option: unknown) => String(option ?? ""))
    : [];
  const optionResult = buildQuantV4AnswerOptions(pkg.answer, {
    existingOptions: packageOptions,
    seed: context.seed ?? pkg.questionId ?? pkg.stem ?? "quant-v4",
    context: {
      packageId: pkg.archetypeId,
      archetypeId: pkg.archetypeId,
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      taskKind,
      answerType: traceability.answerType ?? parameters.answerType,
      difficulty: pkg.difficultyBand,
      stem: pkg.stem,
      variables: parameters,
      traceability,
    },
  });
  const options = optionResult.options;
  const correct = optionResult.correct;
  return {
    text: polishGeneratedEnglishText(pkg.stem),
    options: options.map((option) => polishGeneratedEnglishText(option)),
    correct,
    correctIndex: correct,
    explanation: polishGeneratedEnglishText(
      formatExplanationForQuestionStudio(pkg.explanation),
    ),
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
    runtimeMode,
    reviewStatus,
    questionBankStatus,
    testEligibility,
    publiclyPublishable,
    packageSource: "quant-v4-package-runtime",
    packageId: pkg.archetypeId,
    taskKind,
    scenarioId,
    language,
    metadata: {
      language,
      packageId: pkg.archetypeId,
      canonicalProblemId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind,
      scenarioId,
      runtimeMode,
      reviewStatus,
      questionBankStatus,
      testEligibility,
      publiclyPublishable,
    },
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
export async function generateQuestion(request: QuantV4GenerationRequest = {}) {
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
    !(
      request.packageId &&
      request.packageId !== QUANT_V4_PERCENTAGE_ALL_PATTERN_ID
    ) &&
    !(
      request.archetypeId &&
      request.archetypeId !== QUANT_V4_PERCENTAGE_ALL_PATTERN_ID
    )
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
      const canonicalProblemId =
        explicitCp ?? cpOrder[packageUsage % cpOrder.length]!;
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
  if (pkg.supportedLanguages && !pkg.supportedLanguages.includes(language)) {
    throw new QuantV4RequestError(
      `${pkg.packageId} supports English generation only in Question Studio.`,
    );
  }
  const explicitCanonicalProblemId = request.canonicalProblemId ?? request.cpId;
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
    const currentCanonicalProblemId = cpOrder[i % cpOrder.length]!;
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
