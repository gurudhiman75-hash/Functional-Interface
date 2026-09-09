export interface DefaultQuestionLanguageMetadata {
  taskKind: string;
  answerType: string;
  requiredVariables: readonly string[];
  difficulty: string;
  template: string;
}

export interface DefaultQuestionLanguagePoolOptions {
  maxPerMathematicalContract?: number;
}

export const DEFAULT_MAX_QLS_PER_MATHEMATICAL_CONTRACT = 4;

export const SYNTHETIC_DOCUMENTARY_WRAPPER_PATTERN =
  /\b(?:memo|notice|register|report|record|schedule|ledger|sheet|circular|bulletin|log|timetable)\b/i;

function numericQlSuffix(questionLanguageId: string) {
  const match = questionLanguageId.match(/(\d+)$/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

function isBaseBankQl(questionLanguageId: string) {
  const suffix = numericQlSuffix(questionLanguageId);
  return Number.isFinite(suffix) && suffix > 0 && suffix < 100;
}

export function mathematicalContractSignature(metadata: DefaultQuestionLanguageMetadata) {
  return [
    metadata.taskKind,
    metadata.answerType,
    [...metadata.requiredVariables].map(String).sort().join(","),
    metadata.difficulty,
  ].join("|");
}

/**
 * Curates the IDs used by random/default generation while leaving the full
 * Question Language registry untouched for explicit legacy requests.
 *
 * Selection intentionally prefers the original/base bank when it contains a
 * clean learner-facing form. Clone waves are not used merely to fill the
 * four-slot allowance: if one strong base QL covers a contract, one is enough.
 */
export function curateDefaultQuestionLanguageIds(
  questionLanguageIds: readonly string[],
  getMetadata: (questionLanguageId: string) => DefaultQuestionLanguageMetadata,
  options: DefaultQuestionLanguagePoolOptions = {},
) {
  const maxPerContract =
    options.maxPerMathematicalContract ?? DEFAULT_MAX_QLS_PER_MATHEMATICAL_CONTRACT;
  if (!Number.isInteger(maxPerContract) || maxPerContract < 1) {
    throw new Error(`maxPerMathematicalContract must be a positive integer, received ${maxPerContract}.`);
  }

  const metadataById = new Map<string, DefaultQuestionLanguageMetadata>();
  const groups = new Map<string, string[]>();

  for (const questionLanguageId of questionLanguageIds) {
    const metadata = getMetadata(questionLanguageId);
    metadataById.set(questionLanguageId, metadata);
    const signature = mathematicalContractSignature(metadata);
    const members = groups.get(signature) ?? [];
    members.push(questionLanguageId);
    groups.set(signature, members);
  }

  const selected = new Set<string>();

  for (const members of groups.values()) {
    const baseClean = members.filter((id) => {
      const metadata = metadataById.get(id)!;
      return isBaseBankQl(id) && !SYNTHETIC_DOCUMENTARY_WRAPPER_PATTERN.test(metadata.template);
    });
    const allClean = members.filter(
      (id) => !SYNTHETIC_DOCUMENTARY_WRAPPER_PATTERN.test(metadataById.get(id)!.template),
    );
    const baseAny = members.filter(isBaseBankQl);

    // Do not fill unused slots with clone-wave paraphrases. The first non-empty
    // tier is the default source for this mathematical contract.
    const preferredSource =
      baseClean.length > 0
        ? baseClean
        : allClean.length > 0
          ? allClean
          : baseAny.length > 0
            ? baseAny
            : members;

    for (const questionLanguageId of preferredSource.slice(0, maxPerContract)) {
      selected.add(questionLanguageId);
    }
  }

  // Preserve registry order so seeded selection remains deterministic.
  return questionLanguageIds.filter((questionLanguageId) => selected.has(questionLanguageId));
}
