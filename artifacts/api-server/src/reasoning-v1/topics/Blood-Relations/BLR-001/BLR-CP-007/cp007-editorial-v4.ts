import "./cp007-editorial-v3-scenario-corrections";
import "./cp007-editorial-v3-endpoint-compatibility";
import "./cp007-editorial-v3-gender-evidence";
import { relationDisplay } from "../BLR-CP-006/cp006-model";
import type { BlrCp006Relation } from "../BLR-CP-006/cp006-model";
import type { BlrCp007PrototypeId } from "./cp007-model";
import { generateBlrCp007EditorialV3FinalBank } from "./cp007-editorial-v3-final";
import type {
  BlrCp007V3Difficulty,
  GeneratedBlrCp007EditorialV3Question,
} from "./cp007-editorial-v3-model";
import {
  BLR_CP007_EDITORIAL_V4_REVIEW_VERSION,
  BLR_CP007_EDITORIAL_V4_RUNTIME_VERSION,
  type BlrCp007EditorialV4Telemetry,
  type BlrCp007V4Disposition,
  type BlrCp007V4RecommendedUse,
  type GeneratedBlrCp007EditorialV4Question,
} from "./cp007-editorial-v4-model";

const FOUNDATION_PROTOTYPES = new Set<BlrCp007PrototypeId>([
  "BLR-CP007-PROT-SELECT-DIRECT-FORWARD",
  "BLR-CP007-PROT-SELECT-DIRECT-REVERSE",
  "BLR-CP007-PROT-MISSING-TOKEN-DIRECT",
  "BLR-CP007-PROT-MISSING-TOKEN-REVERSE",
]);

const COLOUR_TOKENS = /\b(?:red|blue|green|white|black|amber|silver|gold)\b/gi;
const SYMBOL_POOL = ["@", "#", "$", "%", "&", "*", "+", "~", "^", "="] as const;

function hashText(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function fingerprint(value: unknown): string {
  const text = JSON.stringify(value);
  const first = hashText(text).toString(16).padStart(8, "0");
  const second = hashText(`${text}::v4`).toString(16).padStart(8, "0");
  return `${first}${second}${second}${first}`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function remapNeutralWordCodes(
  source: GeneratedBlrCp007EditorialV3Question,
): GeneratedBlrCp007EditorialV3Question {
  if (source.keyStyle !== "NEUTRAL_WORD") return source;
  const anchor = source.delivery.mode === "SHARED_SET"
    ? source.delivery.setId ?? source.sourcePrototypeId
    : source.itemId;
  const offset = hashText(anchor) % SYMBOL_POOL.length;
  const replacements = source.codeKey.map((entry, index) => ({
    from: entry.token,
    to: SYMBOL_POOL[(offset + index) % SYMBOL_POOL.length]!,
  }));
  let serialized = JSON.stringify(source);
  for (const replacement of replacements) {
    serialized = serialized.replace(
      new RegExp(`\\b${escapeRegExp(replacement.from)}\\b`, "g"),
      replacement.to,
    );
  }
  const remapped = JSON.parse(serialized) as GeneratedBlrCp007EditorialV3Question;
  return { ...remapped, keyStyle: "SYMBOL" };
}

function relationText(relationId: BlrCp006Relation | undefined): string {
  if (!relationId) return "required relation";
  return relationDisplay(relationId).toLocaleLowerCase("en-IN");
}

function targetOf(question: GeneratedBlrCp007EditorialV3Question): {
  subjectId?: string;
  relationId?: BlrCp006Relation;
  referenceId?: string;
} {
  if ("target" in question.query) return question.query.target;
  return {};
}

function targetSentence(question: GeneratedBlrCp007EditorialV3Question): string {
  const target = targetOf(question);
  if (!target.subjectId || !target.referenceId || !target.relationId) return "the required interpretation";
  return `${target.subjectId} is the ${relationText(target.relationId)} of ${target.referenceId}`;
}

function ensurePeriod(value: string): string {
  const text = value.trim();
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function unique(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function decisiveSteps(question: GeneratedBlrCp007EditorialV3Question): string[] {
  const highlighted = question.explanation.diagramProof.edges
    .filter((edge) => edge.highlighted)
    .map((edge) => ensurePeriod(edge.label));
  return unique(highlighted.length > 0 ? highlighted : question.decodedStatements.map(ensurePeriod));
}

function expressionLines(question: GeneratedBlrCp007EditorialV3Question): string {
  if ("expressionLines" in question.query) return question.query.expressionLines.join("\n");
  return "";
}

function stemFor(question: GeneratedBlrCp007EditorialV3Question): string {
  const target = targetSentence(question);
  const lines = expressionLines(question);
  const variant = question.seed % 4;
  switch (question.query.kind) {
    case "SELECT_EXPRESSION": {
      const lead = question.sourcePrototypeId.includes("DIRECT-FORWARD")
        ? [
            `Choose the expression that directly codes: ${target}.`,
            `Which option correctly represents the statement “${target}”?`,
            `Select the coded form of the statement: ${target}.`,
            `Identify the expression in which ${target}.`,
          ]
        : question.sourcePrototypeId.includes("DIRECT-REVERSE")
          ? [
              `Which expression proves, after reading the relation in reverse, that ${target}?`,
              `Select the code whose inverse relation establishes that ${target}.`,
              `Read each option from left to right. Which one implies that ${target}?`,
              `Choose the expression that yields the reverse relation: ${target}.`,
            ]
          : question.sourcePrototypeId.includes("AFFINAL")
            ? [
                `Which coded family chain establishes that ${target}?`,
                `Select the expression that produces the required relation by marriage: ${target}.`,
                `Which option correctly builds the affinal path showing that ${target}?`,
                `Choose the coded chain that proves the in-law relation: ${target}.`,
              ]
            : [
                `Which coded chain establishes that ${target}?`,
                `Select the expression whose linked statements show that ${target}.`,
                `Follow the coded links and choose the option proving that ${target}.`,
                `Which option forms the required family path: ${target}?`,
              ];
      return lead[variant]!;
    }
    case "MISSING_TOKEN": {
      const leads = [
        `Choose the token that completes the expression and makes ${target}.`,
        `Which code should replace ? to establish that ${target}?`,
        `Fill the blank with the token that makes ${target}.`,
        `Select the missing token required to prove that ${target}.`,
      ];
      return `${leads[variant]!}\n\n${lines}`;
    }
    case "MISSING_TOKEN_PAIR": {
      const leads = [
        `Choose the two tokens, in blank order, that make ${target}.`,
        `Which ordered token pair completes the path showing that ${target}?`,
        `Fill both blanks so that the coded chain establishes that ${target}. Give the tokens in statement order.`,
        `Select the token pair that completes the two blanks and proves that ${target}.`,
      ];
      return `${leads[variant]!}\n\n${lines}`;
    }
    case "MISSING_PERSON": {
      const candidates = question.query.candidatePersonIds.join(", ");
      const leads = [
        `Which candidate should replace ? to make ${target}?`,
        `Select the person who completes the coded path and establishes that ${target}.`,
        `Who must replace ? for the statements to show that ${target}?`,
        `Choose the candidate that connects the family chain so that ${target}.`,
      ];
      return `${leads[variant]!}\nCandidates: ${candidates}\n\n${lines}`;
    }
    case "SELECT_VALIDITY": {
      const correct = question.query.desiredStatus === "VALID";
      const derived = question.sourcePrototypeId.includes("DERIVED");
      const leads = correct
        ? derived
          ? [
              "After combining the coded links, which written interpretation is correct?",
              "Which option correctly interprets the relation obtained from the coded chain?",
              "Decode each multi-link expression. Which stated relation matches the result?",
              "Which interpretation agrees with the final relation produced by its code chain?",
              "Trace the linked statements and select the interpretation that is proved.",
              "Which option gives a correct interpretation after the full family path is decoded?",
              "Select the claim that matches the relation derived from the coded links.",
              "Which coded chain and written interpretation are consistent with each other?",
            ]
          : [
              "Which option contains a correctly interpreted coded statement?",
              "Select the coded statement whose written interpretation is correct.",
              "After decoding each direct statement, which interpretation matches?",
              "Which direct coded statement and interpretation agree with each other?",
              "Decode the single relation in each option and select the matching interpretation.",
              "Which option states the correct meaning of its direct code?",
              "Select the direct coded pair whose written relation is accurate.",
              "Which single-link code and interpretation are consistent?",
            ]
        : derived
          ? [
              "After combining the coded links, which written interpretation is incorrect?",
              "Which option misinterprets the relation obtained from the coded chain?",
              "Decode each multi-link expression. Which stated relation does not match the result?",
              "Which interpretation disagrees with the final relation produced by its code chain?",
              "Trace the linked statements and select the interpretation that is not proved.",
              "Which option gives a wrong interpretation after the full family path is decoded?",
              "Select the claim that conflicts with the relation derived from the coded links.",
              "Which coded chain and written interpretation are inconsistent with each other?",
            ]
          : [
              "Which option contains an incorrectly interpreted coded statement?",
              "Select the coded statement whose written interpretation is wrong.",
              "After decoding each direct statement, which interpretation does not match?",
              "Which direct coded statement and interpretation disagree with each other?",
              "Decode the single relation in each option and select the mismatched interpretation.",
              "Which option states an incorrect meaning for its direct code?",
              "Select the direct coded pair whose written relation is inaccurate.",
              "Which single-link code and interpretation are inconsistent?",
            ];
      return leads[question.seed % 8]!;
    }
  }
  throw new Error(`Unsupported BLR-CP-007 query kind: ${(question.query as { kind?: string }).kind ?? "unknown"}`);
}

function optionExplanation(
  question: GeneratedBlrCp007EditorialV3Question,
  option: GeneratedBlrCp007EditorialV3Question["options"][number],
): string {
  const target = targetSentence(question);
  const targetRelation = relationText(targetOf(question).relationId);
  const decoded = unique(option.decodedAssertions.map(ensurePeriod)).join(" ");

  if (question.qlId === "BLR-QL-035") {
    const desired = question.query.kind === "SELECT_VALIDITY" ? question.query.desiredStatus : "VALID";
    if (option.statementValidity === "VALID") {
      return `${decoded} The written interpretation matches the code, so this option is ${desired === "VALID" ? "the required correct statement" : "not the required incorrect statement"}.`;
    }
    const actual = relationText(option.actualRelation);
    const claimed = relationText(option.claimedRelation);
    return `${decoded} The code gives ${actual}, whereas the written interpretation claims ${claimed}; this option is ${desired === "INVALID" ? "the required incorrect statement" : "not a correct statement"}.`;
  }

  if (option.isCorrectAnswerForTask) {
    if (question.qlId === "BLR-QL-034") {
      return `Using ${option.text} completes the decisive path, so ${target}.`;
    }
    return `${decoded || option.text} This matches the required ${targetRelation}.`;
  }

  if (option.actualRelation) {
    return `${decoded} This gives ${relationText(option.actualRelation)}, not ${targetRelation}.`;
  }
  if (option.failureCode === "BROKEN_CHAIN") {
    return "The coded links do not form a continuous family path between the required people.";
  }
  if (question.qlId === "BLR-QL-034") {
    return `Using ${option.text} does not connect the required people as ${targetRelation}.`;
  }
  if (question.qlId === "BLR-QL-033") {
    return `This ordered pair does not create the required ${targetRelation} path.`;
  }
  return `${decoded || option.text} This does not produce the required ${targetRelation}.`;
}

function shortcutFor(question: GeneratedBlrCp007EditorialV3Question): string | undefined {
  const variant = question.seed % 4;
  const values: Record<string, readonly string[]> = {
    "BLR-QL-031": [
      "Decode each option from left to right and keep only the chain joining the two named people.",
      "Work from the subject in the question toward the reference person; reject any broken chain.",
      "Translate the symbols first, then compare the final relation with the question.",
      "For multi-link options, trace only the continuous path between the required endpoints.",
    ],
    "BLR-QL-032": [
      "Find the relation needed at the blank, then select its token from the key.",
      "Complete the family path in words before converting the missing link back into code.",
      "Read the visible link first; it tells you which relation the missing token must supply.",
      "Determine the missing relation, not merely a token that looks familiar.",
    ],
    "BLR-QL-033": [
      "Solve the two missing relations first and enter their tokens in statement order.",
      "Keep the blank order fixed; a correct pair in reverse order is still wrong.",
      "Build the target family path in words, then map its two links to tokens.",
      "Check both links together because one correct token is not sufficient.",
    ],
    "BLR-QL-034": [
      "Substitute each candidate in the blank and keep the one that completes the decisive path.",
      "Ignore disconnected clues only after checking how each candidate joins the target pair.",
      "Test candidates against the required relation rather than matching repeated letters.",
      "Use the blank statement as the bridge between the candidate and the target family chain.",
    ],
    "BLR-QL-035": [
      "Decode the code first; judge the written interpretation only after finding the actual relation.",
      "Separate two questions: what the code means, and whether the written claim matches it.",
      "Do not choose by wording alone—compare the decoded relation with the stated relation.",
      "For an incorrect-statement task, select the mismatch rather than a merely unusual relation.",
    ],
  };
  return values[question.qlId]?.[variant];
}

function trapFor(question: GeneratedBlrCp007EditorialV3Question): string | undefined {
  const variant = question.seed % 4;
  const values: Record<string, readonly string[]> = {
    "BLR-QL-031": [
      "Do not reverse the two people while translating a coded pair.",
      "A valid relation inside an option is not enough; the complete chain must reach the required endpoint.",
      "Do not treat symbols as arithmetic operators.",
      "An in-law relation must be supported by the exact marriage link shown in the code.",
    ],
    "BLR-QL-032": [
      "Do not choose the inverse relation when the blank direction is left to right.",
      "A token may be correct elsewhere in the chain but wrong at the blank position.",
      "Do not infer gender from a letter used as a person's name.",
      "Check the complete target relation after inserting the token.",
    ],
    "BLR-QL-033": [
      "Do not swap the first and second blank tokens.",
      "One correct link cannot compensate for an incorrect second link.",
      "Do not stop after decoding the first statement; combine both links.",
      "Check whether the pair gives the required generation and gender.",
    ],
    "BLR-QL-034": [
      "Do not choose a candidate merely because the letter appears fewer times.",
      "Every candidate may form a valid statement; only one creates the required final relation.",
      "Do not use name letters to assume gender.",
      "A candidate connected to the graph can still produce the wrong relation.",
    ],
    "BLR-QL-035": [
      "A true decoded relation can still be the wrong answer when the question asks for the incorrect statement.",
      "Do not confuse statement validity with whether the option is requested by the question.",
      "A gender mismatch makes a written claim invalid even when the generation is correct.",
      "Read the requested polarity—correct or incorrect—before selecting the option.",
    ],
  };
  return values[question.qlId]?.[variant];
}

function conclusionFor(question: GeneratedBlrCp007EditorialV3Question): string {
  const letter = "ABCD"[question.correctIndex] ?? "?";
  switch (question.qlId) {
    case "BLR-QL-031": return `${question.answer} is the required coded expression.`;
    case "BLR-QL-032": return `${question.answer} is the missing token.`;
    case "BLR-QL-033": return `${question.answer} is the ordered token pair.`;
    case "BLR-QL-034": return `${question.answer} must replace the question mark.`;
    case "BLR-QL-035": {
      const desired = question.query.kind === "SELECT_VALIDITY" && question.query.desiredStatus === "INVALID"
        ? "incorrect"
        : "correct";
      return `Option ${letter} is the required ${desired} statement.`;
    }
  }
  throw new Error(`Unsupported BLR-CP-007 QL: ${question.qlId}`);
}

function explanationSteps(question: GeneratedBlrCp007EditorialV3Question): string[] {
  const target = targetSentence(question);
  const decisive = decisiveSteps(question);
  const relation = relationText(targetOf(question).relationId);
  if (question.qlId === "BLR-QL-031" && decisive.length === 1) {
    return [decisive[0]!, `The option therefore represents ${relation}.`];
  }
  if (question.qlId === "BLR-QL-032") {
    return [...decisive, `The blank must use the token for ${relation}.`];
  }
  if (question.qlId === "BLR-QL-033") {
    return [...decisive, `Combining the links gives: ${target}.`];
  }
  if (question.qlId === "BLR-QL-034") {
    return [...decisive, `${question.answer} is the candidate that completes this path.`];
  }
  if (question.qlId === "BLR-QL-035") {
    const correct = question.options[question.correctIndex]!;
    const decoded = unique(correct.decodedAssertions.map(ensurePeriod));
    if (correct.statementValidity === "VALID") {
      return [...decoded, "The written interpretation matches the decoded relation."];
    }
    return [...decoded, `The written interpretation claims ${relationText(correct.claimedRelation)}, but the code gives ${relationText(correct.actualRelation)}.`];
  }
  return decisive;
}

function componentCount(question: GeneratedBlrCp007EditorialV3Question): number | undefined {
  if (question.query.kind !== "MISSING_PERSON") return undefined;
  const adjacency = new Map<string, Set<string>>();
  for (const statement of question.query.completeStatements) {
    if (!adjacency.has(statement.leftId)) adjacency.set(statement.leftId, new Set());
    if (!adjacency.has(statement.rightId)) adjacency.set(statement.rightId, new Set());
    adjacency.get(statement.leftId)!.add(statement.rightId);
    adjacency.get(statement.rightId)!.add(statement.leftId);
  }
  const visited = new Set<string>();
  let components = 0;
  for (const person of adjacency.keys()) {
    if (visited.has(person)) continue;
    components += 1;
    const stack = [person];
    visited.add(person);
    while (stack.length > 0) {
      const current = stack.pop()!;
      for (const neighbour of adjacency.get(current) ?? []) {
        if (!visited.has(neighbour)) {
          visited.add(neighbour);
          stack.push(neighbour);
        }
      }
    }
  }
  return components;
}

function difficultyFor(question: GeneratedBlrCp007EditorialV3Question): BlrCp007V3Difficulty {
  if (FOUNDATION_PROTOTYPES.has(question.sourcePrototypeId)) return "EASY";
  const decisiveLinkCount = decisiveSteps(question).length;
  if (
    decisiveLinkCount >= 3 ||
    (question.sourcePrototypeId === "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT" && decisiveLinkCount >= 2) ||
    (question.sourcePrototypeId === "BLR-CP007-PROT-VALIDITY-INCORRECT-DERIVED" && decisiveLinkCount >= 2)
  ) return "HARD";
  return "MEDIUM";
}

function dispositionFor(question: GeneratedBlrCp007EditorialV3Question): BlrCp007V4Disposition {
  if (question.qlId === "BLR-QL-034") return "REMEDIATION_HOLD";
  if (FOUNDATION_PROTOTYPES.has(question.sourcePrototypeId)) return "FOUNDATION_PRACTICE";
  return "RELEASE_CANDIDATE";
}

function recommendedUseFor(
  disposition: BlrCp007V4Disposition,
  difficulty: BlrCp007V3Difficulty,
): BlrCp007V4RecommendedUse {
  if (disposition === "REMEDIATION_HOLD") return "NOT_ELIGIBLE";
  if (disposition === "FOUNDATION_PRACTICE") return "GUIDED_PRACTICE";
  return difficulty === "HARD" ? "ADVANCED_PRACTICE" : "STANDARD_MOCK";
}

function activeBlockers(
  question: GeneratedBlrCp007EditorialV3Question,
  components: number | undefined,
): string[] {
  const blockers: string[] = [];
  if (question.qlId === "BLR-QL-034" && (components ?? 0) > 1) {
    blockers.push("DISCONNECTED_CANDIDATE_NETWORK");
    blockers.push("QL034_COHERENT_NETWORK_REMODEL_PENDING");
  }
  blockers.push("HUMAN_EDITORIAL_APPROVAL_PENDING");
  return blockers;
}

export function remodelBlrCp007EditorialV4Question(
  sourceQuestion: GeneratedBlrCp007EditorialV3Question,
): GeneratedBlrCp007EditorialV4Question {
  const question = remapNeutralWordCodes(sourceQuestion);
  const difficulty = difficultyFor(question);
  const disposition = dispositionFor(question);
  const recommendedUse = recommendedUseFor(disposition, difficulty);
  const components = componentCount(question);
  const blockers = activeBlockers(question, components);
  const options = question.options.map((option) => ({
    ...option,
    studentExplanation: optionExplanation(question, option),
  }));
  const optionAnalysis = question.explanation.optionAnalysis.map((analysis, index) => ({
    ...analysis,
    explanation: options[index]!.studentExplanation,
  }));
  const promptPlacement = question.delivery.mode === "SHARED_SET" ? "SET_HEADER" : "ITEM";
  const stem = stemFor(question);
  const v4EditorialFingerprint = fingerprint({
    source: question.metadata.semanticFingerprint,
    stem,
    codeKey: question.codeKey,
    options: options.map((option) => option.text),
  });
  const decisiveLinkCount = decisiveSteps(question).length;
  const reasoningDepth = Math.max(decisiveLinkCount, question.completedStatements.length);

  return {
    ...question,
    keyStyle: question.keyStyle === "LETTER" ? "LETTER" : "SYMBOL",
    itemId: question.itemId.replace("-V3-", "-V4-"),
    stem,
    options,
    delivery: {
      ...question.delivery,
      promptPlacement,
      renderSharedPromptOnce: question.delivery.mode === "SHARED_SET",
    },
    explanation: {
      ...question.explanation,
      steps: explanationSteps(question),
      conclusion: conclusionFor(question),
      shortcut: shortcutFor(question),
      commonTrap: trapFor(question),
      optionAnalysis,
    },
    reviewProof: {
      ...question.reviewProof,
      questionId: question.reviewProof.questionId.replace("-V3-", "-V4-"),
      difficulty,
      reviewerNote: "Editorial V4 exam-readiness remediation candidate; QL-034 remains held for coherent-network reconstruction and all content remains subject to human approval.",
    },
    metadata: {
      ...question.metadata,
      difficulty,
      v4RuntimeVersion: BLR_CP007_EDITORIAL_V4_RUNTIME_VERSION,
      v4ReviewVersion: BLR_CP007_EDITORIAL_V4_REVIEW_VERSION,
      v4EditorialStatus: "EXAM_READINESS_REMEDIATION_CANDIDATE",
      disposition,
      recommendedUse,
      promptPlacement,
      neutralWordCodesRemoved: true,
      explanationRemodelled: true,
      difficultyRecalibratedByReasoningDepth: true,
      sourceV3SemanticFingerprint: question.metadata.semanticFingerprint,
      v4EditorialFingerprint,
      candidateNetworkComponentCount: components,
      activeEditorialBlockers: blockers,
    },
    v4ReviewProof: {
      datasetVersion: BLR_CP007_EDITORIAL_V4_REVIEW_VERSION,
      sourceDatasetVersion: "BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V3",
      disposition,
      recommendedUse,
      promptPlacement,
      reasoningDepth,
      decisiveLinkCount,
      candidateNetworkComponentCount: components,
      activeEditorialBlockers: blockers,
      humanReviewRequired: true,
    },
  };
}

export function generateBlrCp007EditorialV4Bank(): readonly GeneratedBlrCp007EditorialV4Question[] {
  return generateBlrCp007EditorialV3FinalBank().map(remodelBlrCp007EditorialV4Question);
}

function countBy<T extends string>(values: readonly T[]): Record<T, number> {
  return values.reduce((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {} as Record<T, number>);
}

function maximumRepeat(values: readonly (string | undefined)[]): number {
  const counts = countBy(values.filter((value): value is string => Boolean(value)));
  return Math.max(0, ...Object.values(counts));
}

export function buildBlrCp007EditorialV4Telemetry(
  bank = generateBlrCp007EditorialV4Bank(),
): BlrCp007EditorialV4Telemetry {
  const itemIds = bank.map((question) => question.itemId);
  const duplicateStemCount = bank.length - new Set(bank.map((question) => question.stem)).size;
  const repeatedStepConclusionCount = bank.filter((question) =>
    question.explanation.steps.some((step) => step.trim() === question.explanation.conclusion.trim()),
  ).length;
  const sharedSetIds = new Set(bank.flatMap((question) =>
    question.delivery.mode === "SHARED_SET" && question.delivery.setId ? [question.delivery.setId] : [],
  ));
  const colourTokenOccurrences = bank.reduce((count, question) => {
    const matches = JSON.stringify(question).match(COLOUR_TOKENS);
    return count + (matches?.length ?? 0);
  }, 0);
  const dispositionCounts = countBy(bank.map((question) => question.metadata.disposition));

  if (new Set(itemIds).size !== itemIds.length) {
    throw new Error("BLR-CP-007 V4 item IDs must remain unique.");
  }

  return {
    recordCount: bank.length,
    qlCounts: countBy(bank.map((question) => question.qlId)),
    keyStyleCounts: countBy(bank.map((question) => question.keyStyle)),
    difficultyCounts: {
      EASY: bank.filter((question) => question.metadata.difficulty === "EASY").length,
      MEDIUM: bank.filter((question) => question.metadata.difficulty === "MEDIUM").length,
      HARD: bank.filter((question) => question.metadata.difficulty === "HARD").length,
    },
    dispositionCounts: {
      FOUNDATION_PRACTICE: dispositionCounts.FOUNDATION_PRACTICE ?? 0,
      RELEASE_CANDIDATE: dispositionCounts.RELEASE_CANDIDATE ?? 0,
      REMEDIATION_HOLD: dispositionCounts.REMEDIATION_HOLD ?? 0,
    },
    recommendedUseCounts: {
      GUIDED_PRACTICE: bank.filter((question) => question.metadata.recommendedUse === "GUIDED_PRACTICE").length,
      STANDARD_MOCK: bank.filter((question) => question.metadata.recommendedUse === "STANDARD_MOCK").length,
      ADVANCED_PRACTICE: bank.filter((question) => question.metadata.recommendedUse === "ADVANCED_PRACTICE").length,
      NOT_ELIGIBLE: bank.filter((question) => question.metadata.recommendedUse === "NOT_ELIGIBLE").length,
    },
    sharedSetCount: sharedSetIds.size,
    sharedSetQuestionCount: bank.filter((question) => question.delivery.mode === "SHARED_SET").length,
    standaloneQuestionCount: bank.filter((question) => question.delivery.mode === "STANDALONE").length,
    neutralWordCodeQuestions: bank.filter((question) => question.keyStyle === ("NEUTRAL_WORD" as never)).length,
    colourTokenOccurrences,
    releaseCandidateCount: dispositionCounts.RELEASE_CANDIDATE ?? 0,
    foundationPracticeCount: dispositionCounts.FOUNDATION_PRACTICE ?? 0,
    remediationHoldCount: dispositionCounts.REMEDIATION_HOLD ?? 0,
    ql034DisconnectedNetworkCount: bank.filter((question) =>
      question.qlId === "BLR-QL-034" && (question.metadata.candidateNetworkComponentCount ?? 0) > 1,
    ).length,
    maximumExactShortcutRepeat: maximumRepeat(bank.map((question) => question.explanation.shortcut)),
    maximumExactTrapRepeat: maximumRepeat(bank.map((question) => question.explanation.commonTrap)),
    duplicateStemCount,
    repeatedStepConclusionCount,
    humanReviewRequired: true,
  };
}
