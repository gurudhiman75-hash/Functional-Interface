import {
  buildRnkCp006EqualityEditorialV2,
  type RnkCp006EditorialQuestion,
} from "./cp006-equality-ranking-editorial-v2";

export const RNK_CP006_EQUALITY_EDITORIAL_RELEASE_VERSION =
  "RNK_CP006_EQUALITY_EDITORIAL_V2_RELEASE" as const;

export type RnkCp006EditorialReleaseQuestion = Omit<
  RnkCp006EditorialQuestion,
  "editorialVersion" | "explanation" | "mathematicalFingerprint"
> & {
  readonly editorialVersion: typeof RNK_CP006_EQUALITY_EDITORIAL_RELEASE_VERSION;
  readonly explanation: readonly string[];
  readonly mathematicalFingerprint: string;
};

const REPLACEMENTS: readonly Readonly<{ from: string; to: string }>[] = [
  {
    from: "The symbol “=” marks one shared comparison level; it does not mean the two people are uncomparable.",
    to: "The symbol “=” means the two people share one comparison level.",
  },
];

function cleanLearnerLine(line: string): string {
  let output = line;
  for (const replacement of REPLACEMENTS) {
    output = output.replace(replacement.from, replacement.to);
  }
  return output;
}

function releaseFingerprint(question: RnkCp006EditorialQuestion, explanation: readonly string[]): string {
  return [
    RNK_CP006_EQUALITY_EDITORIAL_RELEASE_VERSION,
    question.sourceForm,
    question.context,
    question.seed,
    question.state.orderedGroups.map((group) => group.join("=")).join(">"),
    question.stem,
    question.options.join("||"),
    question.correctIndex,
    explanation.join("||"),
  ].join("|");
}

export function buildRnkCp006EqualityEditorialV2Release(): readonly RnkCp006EditorialReleaseQuestion[] {
  return buildRnkCp006EqualityEditorialV2().map((question) => {
    const explanation = question.explanation.map(cleanLearnerLine);
    return {
      ...question,
      editorialVersion: RNK_CP006_EQUALITY_EDITORIAL_RELEASE_VERSION,
      explanation,
      mathematicalFingerprint: releaseFingerprint(question, explanation),
    };
  });
}
