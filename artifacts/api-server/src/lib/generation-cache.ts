import { createHash } from "node:crypto";
import {
  eq,
  sql,
} from "drizzle-orm";
import {
  reasoningScenarioCache,
} from "@workspace/db";
import { db } from "./db";
import { logger } from "./logger";
import {
  type GeneratedQuestion,
  type GeneratorOptions,
  type GeneratorResult,
  type Pattern,
} from "./core/generator-engine";

const GENERATOR_CACHE_VERSION =
  "reasoning-generator-v1";
const MOTIF_CACHE_VERSION =
  "motif-registry-v1";
const TOPOLOGY_CACHE_VERSION =
  "topology-contract-v1";

type CacheArtifactMetadata = {
  cachedQuestionCount: number;
  selectedMotifs: string[];
  hasSolverTraces: boolean;
  hasSvgSnapshots: boolean;
  hasExplanationFlow: boolean;
};

function stableStringify(
  value: unknown,
): string {
  if (
    value === null ||
    typeof value !== "object"
  ) {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value
      .map(stableStringify)
      .join(",")}]`;
  }

  const entries = Object.entries(
    value as Record<
      string,
      unknown
    >,
  ).sort(([left], [right]) =>
    left.localeCompare(right),
  );

  return `{${entries
    .map(
      ([key, entryValue]) =>
        `${JSON.stringify(key)}:${stableStringify(entryValue)}`,
    )
    .join(",")}}`;
}

function hashText(
  value: string,
) {
  return createHash("sha256")
    .update(value)
    .digest("hex");
}

function buildPatternFingerprint(
  pattern: Pattern,
) {
  return hashText(
    stableStringify({
      id: pattern.id,
      type: pattern.type,
      topic: pattern.topic,
      subtopic: pattern.subtopic,
      difficulty:
        pattern.difficulty,
      generationDomain:
        pattern.generationDomain,
      arrangementType:
        pattern.arrangementType,
      arrangementTypes:
        pattern.arrangementTypes,
      orientationType:
        pattern.orientationType,
      orientationTypes:
        pattern.orientationTypes,
      participantCount:
        pattern.participantCount,
      clueTypes:
        pattern.clueTypes,
      inferenceDepth:
        pattern.inferenceDepth,
      formula:
        pattern.formula,
      templateVariants:
        pattern.templateVariants,
      variables:
        pattern.variables,
      distractorStrategy:
        pattern.distractorStrategy,
      explanationTemplate:
        pattern.explanationTemplate,
    }),
  );
}

function getRelevantMotifIds(
  pattern: Pattern,
) {
  const supportedMotifs =
    (
      pattern as Pattern &
        Record<string, unknown>
    )["supportedMotifs"];

  if (
    Array.isArray(
      supportedMotifs,
    ) &&
    supportedMotifs.length > 0
  ) {
    return supportedMotifs
      .map(String)
      .sort();
  }

  return [
    pattern.topic,
    pattern.subtopic,
  ]
    .filter(Boolean)
    .map((value) =>
      value.toLowerCase(),
    )
    .sort();
}

function inferCacheGenerationDomain(
  pattern: Pattern,
) {
  if (pattern.generationDomain) {
    return pattern.generationDomain;
  }

  if (pattern.type === "di") {
    return "di";
  }

  const combinedText =
    `${pattern.topic} ${pattern.subtopic}`.toLowerCase();

  if (
    combinedText.includes(
      "seating",
    )
  ) {
    return "seating-arrangement";
  }

  if (pattern.type === "logic") {
    return "reasoning";
  }

  return "quant";
}

function buildVersionBundle(
  pattern: Pattern,
) {
  const generationDomain =
    inferCacheGenerationDomain(
      pattern,
    );
  const motifVersion =
    `${MOTIF_CACHE_VERSION}:${hashText(
      getRelevantMotifIds(pattern).join(
        "|",
      ),
    )}`;
  const topologyVersion =
    `${TOPOLOGY_CACHE_VERSION}:${hashText(
      stableStringify({
        generationDomain,
        arrangementType:
          pattern.arrangementType,
        arrangementTypes:
          pattern.arrangementTypes,
        orientationType:
          pattern.orientationType,
        orientationTypes:
          pattern.orientationTypes,
        participantCount:
          pattern.participantCount,
        clueTypes:
          pattern.clueTypes,
        inferenceDepth:
          pattern.inferenceDepth,
      }),
    )}`;

  return {
    generationDomain,
    generatorVersion:
      GENERATOR_CACHE_VERSION,
    motifVersion,
    topologyVersion,
  };
}

function buildRequestFingerprint(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
) {
  return hashText(
    stableStringify({
      patternFingerprint:
        buildPatternFingerprint(
          pattern,
        ),
      count,
      options: options ?? {},
    }),
  );
}

function buildCacheKey(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
) {
  const versions =
    buildVersionBundle(pattern);
  const requestFingerprint =
    buildRequestFingerprint(
      pattern,
      count,
      options,
    );

  return {
    ...versions,
    requestFingerprint,
    key: hashText(
      [
        versions.generatorVersion,
        versions.motifVersion,
        versions.topologyVersion,
        requestFingerprint,
      ].join("|"),
    ),
  };
}

function buildArtifactMetadata(
  result: GeneratorResult,
) : CacheArtifactMetadata {
  const questions =
    result.questions as GeneratedQuestion[];

  return {
    cachedQuestionCount:
      questions.length,
    selectedMotifs: [
      ...new Set(
        questions
          .map(
            (question) =>
              question
                ?.debugMetadata
                ?.selectedMotif,
          )
          .filter(
            (
              value,
            ): value is string =>
              Boolean(value),
          ),
      ),
    ],
    hasSolverTraces:
      questions.some(
        (question) =>
          Array.isArray(
            question
              ?.debugMetadata
              ?.solverTrace,
          ) &&
          question.debugMetadata
            .solverTrace.length > 0,
      ),
    hasSvgSnapshots:
      questions.some(
        (question) =>
          Boolean(
            question.seatingDiagram ??
              question
                ?.debugMetadata
                ?.seatingDiagram,
          ),
      ),
    hasExplanationFlow:
      questions.some(
        (question) =>
          Boolean(
            question.seatingExplanationFlow ??
              question
                ?.debugMetadata
                ?.seatingExplanationFlow,
          ),
      ),
  };
}

export async function getCachedGenerationResult(
  pattern: Pattern,
  count: number,
  options?: GeneratorOptions,
) {
  const cacheIdentity =
    buildCacheKey(
      pattern,
      count,
      options,
    );

  try {
    const rows = await db
      .select()
      .from(
        reasoningScenarioCache,
      )
      .where(
        eq(
          reasoningScenarioCache.key,
          cacheIdentity.key,
        ),
      )
      .limit(1);
    const row = rows[0];

    if (!row) {
      return null;
    }

    await db
      .update(
        reasoningScenarioCache,
      )
      .set({
        lastAccessedAt:
          new Date(),
        hitCount: sql`${reasoningScenarioCache.hitCount} + 1`,
      })
      .where(
        eq(
          reasoningScenarioCache.key,
          cacheIdentity.key,
        ),
      );

    logger.info(
      {
        patternId: pattern.id,
        generationDomain:
          cacheIdentity.generationDomain,
        cacheKey:
          cacheIdentity.key,
      },
      "Generation cache hit",
    );

    return row.payload as GeneratorResult;
  } catch (error) {
    logger.warn(
      {
        patternId: pattern.id,
        error,
      },
      "Generation cache lookup failed; falling back to live generation",
    );
    return null;
  }
}

export async function cacheGenerationResult(
  pattern: Pattern,
  count: number,
  options: GeneratorOptions | undefined,
  result: GeneratorResult,
) {
  const cacheIdentity =
    buildCacheKey(
      pattern,
      count,
      options,
    );
  const artifactMetadata =
    buildArtifactMetadata(result);

  try {
    await db
      .insert(reasoningScenarioCache)
      .values({
        key: cacheIdentity.key,
        patternId: pattern.id,
        generationDomain:
          cacheIdentity.generationDomain,
        generatorVersion:
          cacheIdentity.generatorVersion,
        motifVersion:
          cacheIdentity.motifVersion,
        topologyVersion:
          cacheIdentity.topologyVersion,
        requestFingerprint:
          cacheIdentity.requestFingerprint,
        payload: result,
        artifactMetadata,
      })
      .onConflictDoUpdate({
        target:
          reasoningScenarioCache.key,
        set: {
          payload: result,
          artifactMetadata,
          generatorVersion:
            cacheIdentity.generatorVersion,
          motifVersion:
            cacheIdentity.motifVersion,
          topologyVersion:
            cacheIdentity.topologyVersion,
          lastAccessedAt:
            new Date(),
        },
      });

    logger.info(
      {
        patternId: pattern.id,
        generationDomain:
          cacheIdentity.generationDomain,
        cacheKey:
          cacheIdentity.key,
        artifactMetadata,
      },
      "Generation cache stored",
    );
  } catch (error) {
    logger.warn(
      {
        patternId: pattern.id,
        error,
      },
      "Generation cache store failed; continuing without cache persistence",
    );
  }
}
