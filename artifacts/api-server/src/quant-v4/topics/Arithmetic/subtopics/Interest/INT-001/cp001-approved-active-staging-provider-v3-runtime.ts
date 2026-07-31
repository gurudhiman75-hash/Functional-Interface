import type { IntCp001FinalQlId } from "./cp001-final-registry";
import {
  INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3,
  generateIntCp001ActiveStagingEnvelope as generateRawEnvelope,
  toIntCp001ActiveStagingPreview as toRawPreview,
  type IntCp001ActiveStagingEnvelope as RawEnvelope,
  type IntCp001ActiveStagingLanguage,
} from "./cp001-approved-active-staging-provider-v3";

export {
  INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3,
  type IntCp001ActiveStagingLanguage,
} from "./cp001-approved-active-staging-provider-v3";

export interface IntCp001ActiveStagingEnvelope extends Omit<RawEnvelope, "trace"> {
  trace: RawEnvelope["trace"] & {
    requestedSeed: string;
    effectiveSeed: string;
    generationAttempts: number;
    deterministicSeedRecovery: boolean;
  };
}

function assertSeed(seed: string): string {
  const normalized = String(seed ?? "").trim();
  if (!normalized) {
    throw new Error("INT-CP-001 active staging provider requires an explicit deterministic seed.");
  }
  return normalized;
}

function effectiveSeed(requestedSeed: string, attempt: number): string {
  return attempt === 1
    ? requestedSeed
    : `${requestedSeed}:active-staging-retry:${attempt - 1}`;
}

export function generateIntCp001ActiveStagingEnvelope(request: {
  qlId: IntCp001FinalQlId;
  language: IntCp001ActiveStagingLanguage;
  seed: string;
}): IntCp001ActiveStagingEnvelope {
  const requestedSeed = assertSeed(request.seed);
  const failures: string[] = [];

  for (let attempt = 1; attempt <= 32; attempt += 1) {
    const candidateSeed = effectiveSeed(requestedSeed, attempt);
    try {
      const envelope = generateRawEnvelope({
        qlId: request.qlId,
        language: request.language,
        seed: candidateSeed,
      });
      return {
        ...envelope,
        trace: {
          ...envelope.trace,
          seed: requestedSeed,
          requestedSeed,
          effectiveSeed: candidateSeed,
          generationAttempts: attempt,
          deterministicSeedRecovery: attempt > 1,
        },
      };
    } catch (error) {
      failures.push(error instanceof Error ? error.message : String(error));
    }
  }

  throw new Error(
    `${request.qlId}/${requestedSeed}/${request.language}: active staging generation failed after 32 deterministic attempts: ${failures.at(-1) ?? "unknown failure"}`,
  );
}

export function toIntCp001ActiveStagingPreview(
  envelope: IntCp001ActiveStagingEnvelope,
  context: { questionIndex?: number; questionCount?: number } = {},
) {
  const preview = toRawPreview(envelope, context);
  return {
    ...preview,
    requestedSeed: envelope.trace.requestedSeed,
    effectiveSeed: envelope.trace.effectiveSeed,
    generationAttempts: envelope.trace.generationAttempts,
    deterministicSeedRecovery: envelope.trace.deterministicSeedRecovery,
    metadata: {
      ...preview.metadata,
      requestedSeed: envelope.trace.requestedSeed,
      effectiveSeed: envelope.trace.effectiveSeed,
      generationAttempts: envelope.trace.generationAttempts,
      deterministicSeedRecovery: envelope.trace.deterministicSeedRecovery,
    },
  };
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  let state = hash(seed) || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function generateIntCp001ActiveStagingBatch(request: {
  language: IntCp001ActiveStagingLanguage;
  seed: string;
  count?: number;
  qlId?: IntCp001FinalQlId;
}) {
  const batchSeed = assertSeed(request.seed);
  const count = Math.min(1000, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const qlOrder = request.qlId
    ? [request.qlId]
    : shuffled(
      INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.qlIds,
      `${batchSeed}:INT-001:active-staging-v3:ql-order`,
    );

  const envelopes = Array.from({ length: count }, (_unused, index) => {
    const qlId = qlOrder[index % qlOrder.length]!;
    return generateIntCp001ActiveStagingEnvelope({
      qlId,
      language: request.language,
      seed: `${batchSeed}:${qlId}:${index}`,
    });
  });

  return {
    generationContext: {
      providerId: INT_CP001_APPROVED_ACTIVE_STAGING_PROVIDER_V3.providerId,
      packageId: "INT-001",
      canonicalProblemId: "INT-CP-001",
      seed: batchSeed,
      language: request.language,
      runtimeMode: "APPROVED_CALCULATION_RICH_ACTIVE_STAGING_V3",
      stagingStatus: "ACTIVE_STAGING",
      registrationStatus: "NOT_REGISTERED",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
    questionPackages: envelopes.map((item) => item.question),
    questions: envelopes.map((item, index) =>
      toIntCp001ActiveStagingPreview(item, {
        questionIndex: index + 1,
        questionCount: count,
      })
    ),
    envelopes,
  };
}
