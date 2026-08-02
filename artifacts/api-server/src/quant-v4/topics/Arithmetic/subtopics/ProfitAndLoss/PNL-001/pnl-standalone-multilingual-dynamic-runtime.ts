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
import {
  buildAllWave03MultilingualEditorialLibraries,
  renderLocalizedFriendlyExplanationMarkdown,
  renderLocalizedStructuredStemMarkdown,
  type StructuredEditorialEntry,
} from "./foundation";
import {
  localizePnl001StandaloneChoice,
  localizePnl001StandaloneContext,
} from "./pnl-standalone-native-localizer-v2";
import {
  PNL_001_STANDALONE_DYNAMIC_LANGUAGES,
  type Pnl001NativeDynamicLanguage,
  type Pnl001StandaloneDynamicLanguage,
} from "./pnl-standalone-multilingual-dynamic-types";

export const PNL_001_STANDALONE_DYNAMIC_CP_IDS = [
  "PNL-CP-001",
  "PNL-CP-002",
  "PNL-CP-003",
  "PNL-CP-004",
  "PNL-CP-005",
  "PNL-CP-006",
] as const;

export type Pnl001StandaloneDynamicCpId =
  (typeof PNL_001_STANDALONE_DYNAMIC_CP_IDS)[number];
export type Pnl001StandaloneDynamicDifficulty = "Easy" | "Medium" | "Hard";

export type Pnl001StandaloneDynamicInput = Readonly<{
  canonicalProblemId?: Pnl001StandaloneDynamicCpId;
  difficultyBand?: Pnl001StandaloneDynamicDifficulty;
  language?: Pnl001StandaloneDynamicLanguage;
  questionLanguageId?: string;
  seed?: string;
}>;

type EnglishRuntimeInput = Readonly<{
  difficultyBand?: Pnl001StandaloneDynamicDifficulty;
  language?: "en";
  questionLanguageId?: string;
  seed?: string;
}>;

type EnglishRuntimeAuthority = Readonly<{
  cpId: Pnl001StandaloneDynamicCpId;
  listQlIds: () => readonly string[];
  run: (input: EnglishRuntimeInput) => any;
}>;

const authorities: readonly EnglishRuntimeAuthority[] = [
  {
    cpId: "PNL-CP-001",
    listQlIds: listPnlCp001DynamicQlIds,
    run: runPnlCp001DynamicPipeline,
  },
  {
    cpId: "PNL-CP-002",
    listQlIds: listPnlCp002DynamicQlIds,
    run: runPnlCp002DynamicPipeline,
  },
  {
    cpId: "PNL-CP-003",
    listQlIds: listPnlCp003DynamicQlIds,
    run: runPnlCp003DynamicPipeline,
  },
  {
    cpId: "PNL-CP-004",
    listQlIds: listPnlCp004DynamicQlIds,
    run: runPnlCp004DynamicPipeline,
  },
  {
    cpId: "PNL-CP-005",
    listQlIds: listPnlCp005DynamicQlIds,
    run: runPnlCp005DynamicPipeline,
  },
  {
    cpId: "PNL-CP-006",
    listQlIds: listPnlCp006DynamicQlIds,
    run: runPnlCp006DynamicPipeline,
  },
];

const authorityByCpId = new Map(authorities.map((authority) => [authority.cpId, authority]));
const authorityByQlId = new Map(
  authorities.flatMap((authority) =>
    authority.listQlIds().map((qlId) => [qlId, authority] as const),
  ),
);

const nativeLibraryByKey = new Map(
  buildAllWave03MultilingualEditorialLibraries().map((library) => [
    `${library.cpId}:${library.language}`,
    library,
  ]),
);

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function resolveAuthority(input: Pnl001StandaloneDynamicInput): EnglishRuntimeAuthority {
  if (input.questionLanguageId) {
    const owner = authorityByQlId.get(input.questionLanguageId);
    if (!owner) {
      throw new Error(`Unknown PNL-001 question-language ID: ${input.questionLanguageId}`);
    }
    if (input.canonicalProblemId && owner.cpId !== input.canonicalProblemId) {
      throw new Error(
        `${input.questionLanguageId} belongs to ${owner.cpId}, not ${input.canonicalProblemId}.`,
      );
    }
    return owner;
  }
  if (input.canonicalProblemId) {
    const authority = authorityByCpId.get(input.canonicalProblemId);
    if (!authority) {
      throw new Error(`Unknown PNL-001 canonical problem: ${input.canonicalProblemId}`);
    }
    return authority;
  }
  const seed = input.seed ?? "PNL-001:standalone-dynamic";
  return authorities[hashSeed(seed) % authorities.length]!;
}

function nativeFinalAnswerLabel(language: Pnl001NativeDynamicLanguage): string {
  return language === "hi" ? "अंतिम उत्तर" : "ਅੰਤਿਮ ਉੱਤਰ";
}

function nativeScriptPattern(language: Pnl001NativeDynamicLanguage): RegExp {
  return language === "hi" ? /[\u0900-\u097F]/u : /[\u0A00-\u0A7F]/u;
}

function unresolvedProsePlaceholders(value: string): readonly string[] {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return [
    ...new Set(
      [...proseOnly.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/g)].map(
        (match) => match[1]!,
      ),
    ),
  ].sort();
}

function replaceAnswerNodeValues(
  reasoningGraph: any,
  englishAnswer: string,
  nativeAnswer: string,
): any {
  if (!reasoningGraph || typeof reasoningGraph !== "object") return reasoningGraph;
  return {
    ...reasoningGraph,
    nodes: Array.isArray(reasoningGraph.nodes)
      ? reasoningGraph.nodes.map((node: any) => ({
          ...node,
          value: node?.value === englishAnswer ? nativeAnswer : node?.value,
        }))
      : reasoningGraph.nodes,
  };
}

function buildNativePackage(
  englishPackage: any,
  language: Pnl001NativeDynamicLanguage,
): any {
  const cpId = englishPackage.canonicalProblemId as Pnl001StandaloneDynamicCpId;
  const qlId = englishPackage.questionLanguageId as string;
  const nativeLibrary = nativeLibraryByKey.get(`${cpId}:${language}`);
  const nativeEntry = nativeLibrary?.entries[qlId] as StructuredEditorialEntry | undefined;
  if (!nativeEntry) {
    throw new Error(`${cpId}/${qlId}/${language}: Wave 03 native editorial entry is missing.`);
  }

  const englishContext = englishPackage.parameters?.variables;
  if (!englishContext || typeof englishContext !== "object") {
    throw new Error(`${qlId}: English dynamic package does not expose variables.`);
  }
  const nativeContext = localizePnl001StandaloneContext(
    englishContext,
    language,
  ) as Readonly<Record<string, unknown>>;
  const stem = renderLocalizedStructuredStemMarkdown(
    nativeEntry.stem,
    language,
    nativeContext,
  );
  const nativeEditorialExplanation = renderLocalizedFriendlyExplanationMarkdown(
    nativeEntry.explanation,
    language,
    nativeContext,
  );
  const options = englishPackage.options.map((option: string) =>
    localizePnl001StandaloneChoice(option, language),
  ) as [string, string, string, string];
  const answer = localizePnl001StandaloneChoice(englishPackage.answer, language);
  const explanationText = `${nativeEditorialExplanation}\n\n**${nativeFinalAnswerLabel(language)}:** ${answer}`;
  const unresolved = unresolvedProsePlaceholders(`${stem}\n${explanationText}`);
  const scriptPattern = nativeScriptPattern(language);
  const questionId = `${englishPackage.questionId}:${language}`;
  const explanationId = `${englishPackage.explanationId}:${language}`;
  const checks = [
    ...(englishPackage.validation?.checks ?? []),
    {
      name: "standalone-native-wave03-authority",
      passed: true,
      message: "Native stem and explanation use the merged Wave 03 authority.",
    },
    {
      name: "standalone-native-context-binding",
      passed: unresolved.length === 0,
      message:
        unresolved.length === 0
          ? "Generated variables bind without unresolved prose placeholders."
          : `Unresolved placeholders: ${unresolved.join(", ")}.`,
    },
    {
      name: "standalone-native-script",
      passed: scriptPattern.test(stem) && scriptPattern.test(explanationText),
      message: "Stem and explanation contain the requested native script.",
    },
    {
      name: "standalone-native-answer-key",
      passed:
        options.length === 4 &&
        new Set(options).size === 4 &&
        options[englishPackage.correctIndex] === answer,
      message: "Localized options preserve four unique choices and the solver key.",
    },
  ];
  const validation = {
    valid: checks.every((check: any) => check.passed),
    checks,
  };
  if (!validation.valid) {
    throw new Error(
      `${qlId}/${language}: standalone native package validation failed: ${checks
        .filter((check: any) => !check.passed)
        .map((check: any) => check.message)
        .join(" | ")}`,
    );
  }

  return {
    ...englishPackage,
    questionId,
    explanationId,
    language,
    stem,
    answer,
    options,
    parameters: {
      ...englishPackage.parameters,
      questionId,
      explanationId,
      language,
      variables: nativeContext,
      sourceLanguage: "en",
      localizationAuthority: "PNL-001-WAVE03-STANDALONE-DYNAMIC",
    },
    solver: {
      ...englishPackage.solver,
      answer,
      evidence: {
        ...englishPackage.solver?.evidence,
        sourceLanguage: "en",
        localizedLanguage: language,
      },
    },
    reasoningGraph: replaceAnswerNodeValues(
      englishPackage.reasoningGraph,
      englishPackage.answer,
      answer,
    ),
    explanation: {
      ...englishPackage.explanation,
      explanationId,
      lines: explanationText.split(/\n{2,}/),
    },
    traceability: {
      ...englishPackage.traceability,
      questionId,
      explanationId,
      language,
      sourceLanguage: "en",
      localizationAuthority: "PNL-001-WAVE03-STANDALONE-DYNAMIC",
    },
    validation,
  };
}

export function listPnl001StandaloneDynamicQlIds(): readonly string[] {
  return [...authorityByQlId.keys()].sort();
}

export function getPnl001StandaloneDynamicCpIds(): readonly Pnl001StandaloneDynamicCpId[] {
  return [...PNL_001_STANDALONE_DYNAMIC_CP_IDS];
}

export function runPnl001StandaloneDynamicPipeline(
  input: Pnl001StandaloneDynamicInput = {},
): any {
  const language = input.language ?? "en";
  if (!PNL_001_STANDALONE_DYNAMIC_LANGUAGES.includes(language)) {
    throw new Error(`Unsupported PNL-001 standalone dynamic language: ${language}`);
  }
  const authority = resolveAuthority(input);
  const englishPackage = authority.run({
    difficultyBand: input.difficultyBand,
    language: "en",
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
  });
  if (language === "en") return englishPackage;
  return buildNativePackage(englishPackage, language);
}
