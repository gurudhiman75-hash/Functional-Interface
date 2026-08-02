import {
  listPnlCp001DynamicQlIds,
  runPnlCp001DynamicPipeline,
} from "./CP-001/cp001-dynamic-runtime";
import {
  listPnlCp002DynamicQlIds,
  runPnlCp002DynamicPipeline,
} from "./CP-002/cp002-dynamic-runtime";
import {
  listPnlCp003DynamicQlIds,
  runPnlCp003DynamicPipeline,
} from "./CP-003/cp003-dynamic-runtime";
import {
  listPnlCp004DynamicQlIds,
  runPnlCp004DynamicPipeline,
} from "./CP-004/cp004-dynamic-runtime";
import {
  listPnlCp005DynamicQlIds,
  runPnlCp005DynamicPipeline,
} from "./CP-005/cp005-dynamic-runtime";
import {
  listPnlCp006DynamicQlIds,
  runPnlCp006DynamicPipeline,
} from "./CP-006/cp006-dynamic-runtime";

type RuntimeInput = Readonly<{
  questionLanguageId?: string;
  language?: "en";
  seed?: string;
}>;

type RuntimePackage = Readonly<{
  questionLanguageId: string;
  answer: string;
  options: readonly string[];
  parameters: Readonly<{
    variables: Readonly<Record<string, unknown>>;
  }>;
}>;

type RuntimeAuthority = Readonly<{
  cpId: string;
  listQlIds: () => readonly string[];
  run: (input: RuntimeInput) => RuntimePackage;
}>;

const runtimes: readonly RuntimeAuthority[] = [
  {
    cpId: "PNL-CP-001",
    listQlIds: listPnlCp001DynamicQlIds,
    run: runPnlCp001DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-002",
    listQlIds: listPnlCp002DynamicQlIds,
    run: runPnlCp002DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-003",
    listQlIds: listPnlCp003DynamicQlIds,
    run: runPnlCp003DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-004",
    listQlIds: listPnlCp004DynamicQlIds,
    run: runPnlCp004DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-005",
    listQlIds: listPnlCp005DynamicQlIds,
    run: runPnlCp005DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-006",
    listQlIds: listPnlCp006DynamicQlIds,
    run: runPnlCp006DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
];

const seeds = Array.from(
  { length: 24 },
  (_, index) => `pnl-native-surface-inventory-${index + 1}`,
);

function hasLatinText(value: string): boolean {
  return /[A-Za-z]/.test(value);
}

function normalizePattern(value: string): string {
  return value
    .replace(/\d{1,3}(?:,\d{2,3})+(?:\.\d+)?/g, "{n}")
    .replace(/\d+(?:\.\d+)?/g, "{n}")
    .replace(/\s+/g, " ")
    .trim();
}

function collectTextValues(
  value: unknown,
  path: string,
  qlId: string,
  target: Map<string, Set<string>>,
): void {
  if (typeof value === "string") {
    if (hasLatinText(value)) {
      const pattern = normalizePattern(value);
      const owners = target.get(pattern) ?? new Set<string>();
      owners.add(`${qlId}:${path}:${value}`);
      target.set(pattern, owners);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectTextValues(item, `${path}[${index}]`, qlId, target),
    );
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      collectTextValues(item, `${path}.${key}`, qlId, target);
    }
  }
}

const choicePatterns = new Map<string, Set<string>>();
const contextPatterns = new Map<string, Set<string>>();
const exactChoices = new Set<string>();
let generatedPackages = 0;

for (const runtime of runtimes) {
  for (const qlId of runtime.listQlIds()) {
    for (const seed of seeds) {
      const pkg = runtime.run({
        questionLanguageId: qlId,
        language: "en",
        seed,
      });
      generatedPackages += 1;

      for (const choice of [...pkg.options, pkg.answer]) {
        exactChoices.add(choice);
        if (!hasLatinText(choice)) continue;
        const pattern = normalizePattern(choice);
        const owners = choicePatterns.get(pattern) ?? new Set<string>();
        owners.add(`${runtime.cpId}:${qlId}:${choice}`);
        choicePatterns.set(pattern, owners);
      }

      collectTextValues(
        pkg.parameters.variables,
        "variables",
        qlId,
        contextPatterns,
      );
    }
  }
}

function serializePatterns(source: Map<string, Set<string>>) {
  return [...source.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([pattern, owners]) => ({
      pattern,
      ownerCount: owners.size,
      examples: [...owners].slice(0, 8),
    }));
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      qlCount: runtimes.reduce(
        (total, runtime) => total + runtime.listQlIds().length,
        0,
      ),
      seedsPerQl: seeds.length,
      generatedPackages,
      exactChoiceCount: exactChoices.size,
      textualChoicePatternCount: choicePatterns.size,
      textualContextPatternCount: contextPatterns.size,
      choicePatterns: serializePatterns(choicePatterns),
      contextPatterns: serializePatterns(contextPatterns),
    },
    null,
    2,
  ),
);
