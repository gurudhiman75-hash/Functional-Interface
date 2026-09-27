import {
  REASONING_V1_NOVELTY_PROVIDERS_V1,
  type ReasoningNoveltyProviderDescriptorV1,
} from "./reasoning-novelty-provider-registry-v1";
import {
  generateReasoningNoveltyReviewBatchV1,
  type ReasoningNoveltyReviewLanguageV1,
} from "./reasoning-novelty-review-runtime-v1";

export const REASONING_V1_NOVELTY_REVIEW_PACK_VERSION =
  "REASONING_V1_NOVELTY_REVIEW_PACK_2026_09_26_V1" as const;

export interface ReasoningNoveltyReviewPackRequestV1 {
  readonly samplesPerProvider?: number;
  readonly seed?: number;
}

function text(value: unknown): string {
  return String(value ?? "").trim();
}

function arrayOfText(value: unknown): string[] {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function learnerQuestion(candidate: Record<string, unknown>): string {
  const shared = text(candidate.sharedPrompt);
  const stem = text(candidate.stem);
  if (shared && stem) return shared + "\n\n" + stem;
  if (stem) return stem;
  const clues = arrayOfText(candidate.clueTexts);
  if (clues.length) {
    return clues.map((clue, index) => `${index + 1}. ${clue}`).join("\n");
  }
  return "(No learner question surface found.)";
}

function optionLines(candidate: Record<string, unknown>): string[] {
  const options = arrayOfText(candidate.options);
  return options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`);
}

function answerText(candidate: Record<string, unknown>): string {
  const direct = text(candidate.answer);
  if (direct) return direct;

  const uniqueSolution = Array.isArray(candidate.uniqueSolution)
    ? candidate.uniqueSolution.map(text).filter(Boolean)
    : [];
  if (uniqueSolution.length) return uniqueSolution.join(" > ");

  return "(Answer stored in structured candidate state.)";
}

function providerLanguage(provider: ReasoningNoveltyProviderDescriptorV1): ReasoningNoveltyReviewLanguageV1 {
  return provider.supportedLanguages.includes("en") ? "en" : provider.supportedLanguages[0]!;
}

export async function buildReasoningNoveltyReviewPackV1(
  request: ReasoningNoveltyReviewPackRequestV1 = {},
): Promise<string> {
  const samplesPerProvider = request.samplesPerProvider ?? 4;
  if (!Number.isInteger(samplesPerProvider) || samplesPerProvider < 1 || samplesPerProvider > 8) {
    throw new Error("Novelty review pack samplesPerProvider must be an integer from 1 to 8.");
  }
  const seed = request.seed ?? 7000;
  if (!Number.isSafeInteger(seed)) throw new Error("Novelty review pack seed must be a safe integer.");

  const providers = REASONING_V1_NOVELTY_PROVIDERS_V1.filter(
    (provider) => provider.status === "DISCOVERY_REVIEW_ONLY",
  );

  const lines: string[] = [
    "# Reasoning V1 — Controlled Novelty Human Review Pack",
    "",
    `Pack version: \`${REASONING_V1_NOVELTY_REVIEW_PACK_VERSION}\``,
    "",
    "## Review rule",
    "",
    "A candidate should be approved only if it is genuinely different in reasoning structure, remains natural for competitive exams, has one defensible answer, uses plausible distractors where applicable, and does not feel artificially complicated.",
    "",
    "**Important:** all candidates in this pack are review-only. Approval of a sample does not by itself activate production mixing.",
    "",
  ];

  for (let providerIndex = 0; providerIndex < providers.length; providerIndex += 1) {
    const provider = providers[providerIndex]!;
    const language = providerLanguage(provider);
    const batch = await generateReasoningNoveltyReviewBatchV1({
      providerId: provider.providerId,
      count: samplesPerProvider,
      seed: seed + providerIndex * 100,
      language,
    });

    lines.push(
      `## ${provider.chapterId} — ${provider.providerId}`,
      "",
      `- Status: \`${provider.status}\``,
      `- Parent QLs: ${provider.parentQlIds.map((qlId) => `\`${qlId}\``).join(", ")}`,
      `- Novelty axes: ${provider.noveltyAxes.map((axis) => `\`${axis}\``).join(", ")}`,
      `- Review language: \`${language}\``,
      "- Production novelty mixing: **disabled**",
      "",
    );

    batch.candidates.forEach((candidate, index) => {
      lines.push(
        `### Sample ${index + 1}`,
        "",
        learnerQuestion(candidate),
        "",
      );
      const options = optionLines(candidate);
      if (options.length) lines.push(...options, "");
      lines.push(
        `**Answer:** ${answerText(candidate)}`,
        "",
        `**Semantic fingerprint:** \`${text(candidate.semanticFingerprint) || "(structured)"}\``,
        "",
        "**Human review:** ☐ Approve  ☐ Reject  ☐ Revise",
        "",
        "**Reviewer note:**",
        "",
        "---",
        "",
      );
    });
  }

  return lines.join("\n");
}
