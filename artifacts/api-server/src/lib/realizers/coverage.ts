import type {
  FormulaQuestion,
} from "../core/generator-engine";
import type {
  NativeRealizationCoverage,
  NativeRealizationValidation,
  RealizationCoverageCategory,
  RealizedLanguageBundle,
  RealizerLanguage,
} from "./types";

const COVERAGE: Record<
  RealizerLanguage,
  Record<RealizationCoverageCategory, number>
> = {
  en: {
    seating: 100,
    bloodRelation: 100,
    directionSense: 100,
    pattern: 100,
    temporal: 100,
    boolean: 100,
    critical: 100,
    quant: 100,
    knowledge: 100,
    english: 100,
    unknown: 100,
  },
  hi: {
    seating: 100,
    bloodRelation: 0,
    directionSense: 0,
    pattern: 0,
    temporal: 0,
    boolean: 0,
    critical: 0,
    quant: 0,
    knowledge: 0,
    english: 0,
    unknown: 0,
  },
  pa: {
    seating: 100,
    bloodRelation: 0,
    directionSense: 0,
    pattern: 0,
    temporal: 0,
    boolean: 0,
    critical: 0,
    quant: 0,
    knowledge: 0,
    english: 0,
    unknown: 0,
  },
};

const CATEGORY_ALIASES: Array<{
  category: RealizationCoverageCategory;
  needles: string[];
}> = [
  {
    category: "seating",
    needles: [
      "seating",
      "arrangement",
      "constraint",
      "puzzle",
      "floor",
      "box",
      "scheduling",
      "ranking",
    ],
  },
  {
    category: "bloodRelation",
    needles: [
      "blood",
      "relation",
      "kinship",
      "family",
    ],
  },
  {
    category: "directionSense",
    needles: [
      "direction",
      "spatial",
      "dice",
      "mirror",
      "cube",
    ],
  },
  {
    category: "pattern",
    needles: [
      "coding",
      "series",
      "analogy",
      "pattern",
    ],
  },
  {
    category: "temporal",
    needles: [
      "clock",
      "calendar",
      "temporal",
    ],
  },
  {
    category: "boolean",
    needles: [
      "syllogism",
      "inequality",
      "venn",
      "boolean",
    ],
  },
  {
    category: "critical",
    needles: [
      "assumption",
      "conclusion",
      "course",
      "cause",
      "critical",
    ],
  },
  {
    category: "knowledge",
    needles: [
      "knowledge",
      "computer",
      "gk",
    ],
  },
  {
    category: "quant",
    needles: [
      "quant",
      "math",
      "algebra",
      "geometry",
      "mensuration",
      "averages",
      "number",
      "probability",
      "functions",
      "equations",
      "interest",
      "ratio",
      "percentage",
    ],
  },
];

function textOf(...values: unknown[]) {
  return values
    .filter(
      (value) => value !== undefined && value !== null,
    )
    .map((value) => String(value).toLowerCase())
    .join(" ");
}

function isSeatingLogic(logic: unknown) {
  return Boolean(
    logic &&
      typeof logic === "object" &&
      ((Array.isArray((logic as any).clues) &&
        Array.isArray(
          (logic as any).arrangement,
        ) &&
        (logic as any).prompt) ||
        (Array.isArray((logic as any).nodes) &&
          Array.isArray(
            (logic as any).edges,
          )) ||
        Array.isArray(
          (logic as any).generatedClues,
        ) ||
        Boolean(
          (logic as any).arrangementType,
        )),
  );
}

export function detectCoverageCategory(
  input: {
    question?: FormulaQuestion;
    logic?: unknown;
    patternId?: string;
  },
): RealizationCoverageCategory {
  if (isSeatingLogic(input.logic)) {
    return "seating";
  }

  const haystack = textOf(
    input.patternId,
    input.question?.section,
    input.question?.topic,
    input.question?.subtopic,
    input.question?.debugMetadata?.patternId,
    input.question?.debugMetadata?.topic,
    input.question?.debugMetadata?.subtopic,
    (input.logic as any)?.domain,
    (input.logic as any)?.subtype,
  );

  for (const alias of CATEGORY_ALIASES) {
    if (
      alias.needles.some((needle) =>
        haystack.includes(needle),
      )
    ) {
      return alias.category;
    }
  }

  return "unknown";
}

export function getCoveragePercent(
  language: RealizerLanguage,
  category: RealizationCoverageCategory,
) {
  return COVERAGE[language][category] ?? 0;
}

export function getNativeRealizationCoverage(
  language: RealizerLanguage,
): NativeRealizationCoverage {
  return {
    language,
    coverage: { ...COVERAGE[language] },
  };
}

function hasScript(
  value: string,
  language: RealizerLanguage,
) {
  if (language === "hi") {
    return /[\u0900-\u097F]/u.test(value);
  }

  if (language === "pa") {
    return /[\u0A00-\u0A7F]/u.test(value);
  }

  return true;
}

export function validateNativeBundle(
  language: RealizerLanguage,
  bundle: RealizedLanguageBundle,
  primitiveDiagnostics?: {
    unsupported?: string[];
    missingTemplates?: string[];
  },
): NativeRealizationValidation {
  const diagnostics: string[] = [];
  const unsupportedPrimitives =
    primitiveDiagnostics?.unsupported ?? [];
  const missingTemplates =
    primitiveDiagnostics?.missingTemplates ?? [];
  const combined = [
    bundle.question,
    bundle.explanation,
    ...bundle.options,
  ].join("\n");

  if (!bundle.question.trim()) {
    diagnostics.push(
      "Question text is empty.",
    );
  }

  if (!bundle.explanation.trim()) {
    diagnostics.push(
      "Explanation text is empty.",
    );
  }

  if (bundle.options.length !== 4) {
    diagnostics.push(
      "Options must contain exactly four entries.",
    );
  }

  if (
    language !== "en" &&
    /[ÃÀÁÂÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/u.test(
      combined,
    )
  ) {
    diagnostics.push(
      "Text appears to contain mojibake instead of native Unicode.",
    );
  }

  if (
    (language === "hi" || language === "pa") &&
    !hasScript(
      `${bundle.question}\n${bundle.explanation}`,
      language,
    )
  ) {
    diagnostics.push(
      `No native ${language} script was detected in question or explanation.`,
    );
  }

  diagnostics.push(
    ...unsupportedPrimitives.map(
      (primitive) => `⚠ ${primitive}`,
    ),
    ...missingTemplates.map(
      (template) => `⚠ ${template}`,
    ),
  );

  return {
    passed: diagnostics.length === 0,
    diagnostics,
    unsupportedPrimitives,
    missingTemplates,
  };
}
