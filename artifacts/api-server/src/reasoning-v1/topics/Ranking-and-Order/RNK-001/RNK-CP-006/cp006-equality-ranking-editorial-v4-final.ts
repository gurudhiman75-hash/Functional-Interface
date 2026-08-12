import {
  buildRnkCp006EqualityEditorialV4Release,
  type RnkCp006EditorialV4Question,
} from "./cp006-equality-ranking-editorial-v4-release";

export const RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL_VERSION =
  "RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL" as const;

export type RnkCp006EditorialV4FinalQuestion = Omit<
  RnkCp006EditorialV4Question,
  "editorialVersion" | "explanation" | "mathematicalFingerprint"
> & {
  readonly editorialVersion: typeof RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL_VERSION;
  readonly explanation: readonly string[];
  readonly mathematicalFingerprint: string;
};

function fingerprint(question: Omit<RnkCp006EditorialV4FinalQuestion, "mathematicalFingerprint">): string {
  return [
    RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL_VERSION,
    question.sourceForm,
    question.seed,
    question.context,
    question.state.orderedGroups.map((group) => group.join("=")).join(">"),
    question.clues.join("||"),
    question.stem,
    question.options.join("||"),
    question.correctIndex,
    question.answer,
    question.explanation.join("||"),
  ].join("|");
}

export function buildRnkCp006EqualityEditorialV4Final(): readonly RnkCp006EditorialV4FinalQuestion[] {
  return buildRnkCp006EqualityEditorialV4Release().map((source) => {
    const explanation =
      source.sourceForm === "PAIR_RELATION_THROUGH_EQUALITY" &&
      source.reasoningProfile.pairSpan === "LOCAL_BRIDGE"
        ? [source.explanation[0]!]
        : source.explanation;

    const output: Omit<RnkCp006EditorialV4FinalQuestion, "mathematicalFingerprint"> = {
      ...source,
      editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_V4_FINAL_VERSION,
      explanation,
    };

    return {
      ...output,
      mathematicalFingerprint: fingerprint(output),
    };
  });
}
