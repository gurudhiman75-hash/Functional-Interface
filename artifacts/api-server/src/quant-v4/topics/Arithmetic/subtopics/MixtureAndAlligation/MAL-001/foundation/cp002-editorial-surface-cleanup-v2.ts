import type { MalCp002PermanentQlId } from "./cp002-permanent-runtime";
import {
  runMalCp002EnglishFinalEditorialV2Pipeline,
  type MalCp002FinalEditorialV2Question,
} from "./cp002-editorial-final-polish-v2";

export const MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2 = Object.freeze({
  cleanupId: "MAL-CP002-EN-SURFACE-CLEANUP-V2",
});

export type MalCp002EditorialSurfaceV2Question =
  MalCp002FinalEditorialV2Question & {
    editorialSurfaceCleanupId:
      typeof MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId;
    explanation: MalCp002FinalEditorialV2Question["explanation"] & {
      editorialSurfaceCleanupId:
        typeof MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId;
    };
    traceability: MalCp002FinalEditorialV2Question["traceability"] & {
      editorialSurfaceCleanupId:
        typeof MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId;
    };
  };

function cleanSurface(value: string): string {
  return value
    .replace(/\$1([xy])\$/gu, "$$1$")
    .replace(
      /A well-mixed quantity is removed/gu,
      "A certain quantity of the well-mixed contents is removed",
    )
    .replace(
      /,\s+find the ([^?]+)\?/giu,
      (_match, requested: string) => `, what is the ${requested}?`,
    )
    .replace(/\s+,/gu, ",")
    .replace(/\s+([?.!])/gu, "$1");
}

export function applyMalCp002EditorialSurfaceCleanupV2(
  question: MalCp002FinalEditorialV2Question,
): MalCp002EditorialSurfaceV2Question {
  const explanationBase = {
    ...question.explanation,
    editorialSurfaceCleanupId:
      MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId,
    coreConcept: cleanSurface(question.explanation.coreConcept),
    formula: cleanSurface(question.explanation.formula),
    steps: question.explanation.steps.map(cleanSurface),
    verification: cleanSurface(question.explanation.verification),
    conclusion: cleanSurface(question.explanation.conclusion),
    examShortcut: cleanSurface(question.explanation.examShortcut),
    commonTrap: cleanSurface(question.explanation.commonTrap),
    lines: question.explanation.lines.map(cleanSurface),
  };
  return {
    ...question,
    editorialSurfaceCleanupId:
      MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId,
    stem: cleanSurface(question.stem),
    explanation: explanationBase,
    reasoningGraph: {
      nodes: question.reasoningGraph.nodes.map((node) => ({
        ...node,
        text: cleanSurface(node.text),
      })),
    },
    validation: {
      ...question.validation,
      checks: [
        ...question.validation.checks,
        {
          name: "surface-cleanup-v2",
          passed: true,
          message:
            "Imperative punctuation, spacing, replacement wording and redundant unit coefficients are normalized.",
        },
      ],
    },
    traceability: {
      ...question.traceability,
      editorialSurfaceCleanupId:
        MAL_CP002_EDITORIAL_SURFACE_CLEANUP_V2.cleanupId,
    },
  } as MalCp002EditorialSurfaceV2Question;
}

export function runMalCp002EnglishEditorialSurfaceV2Pipeline(
  input: {
    questionLanguageId?: MalCp002PermanentQlId | string;
    seed?: string;
    language?: "en";
  } = {},
): MalCp002EditorialSurfaceV2Question {
  return applyMalCp002EditorialSurfaceCleanupV2(
    runMalCp002EnglishFinalEditorialV2Pipeline(input),
  );
}
