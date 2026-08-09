import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import {
  relationDisplay,
  type BlrCp006CodeDefinition,
  type BlrCp006CodedStatement,
  type BlrCp006DirectRelation,
  type BlrCp006Graph,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007ExpressionCandidate } from "./cp007-model";
import type { BlrCp007V3Difficulty, BlrCp007V3Option } from "./cp007-editorial-v3-model";
import type { BlrCp007V4RecommendedUse, GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";

export const DIRECT_RELATIONS: readonly BlrCp006DirectRelation[] = [
  "FATHER", "MOTHER", "SON", "DAUGHTER", "BROTHER", "SISTER", "HUSBAND", "WIFE",
] as const;
const SYMBOLS = ["@", "#", "$", "%", "&", "*", "+", "~"] as const;
export const OPTION_LABELS = ["A", "B", "C", "D"] as const;
export const CANDIDATES = ["P", "Q", "R", "S"] as const;

export interface Target {
  subjectId: string;
  relationId: BlrCp006Relation;
  referenceId: string;
}

export interface DirectSpec {
  leftId: string;
  relationId: BlrCp006DirectRelation;
  rightId: string;
}

export function hashText(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function fingerprint(value: unknown): string {
  const text = JSON.stringify(value);
  const first = hashText(text).toString(16).padStart(8, "0");
  const second = hashText(`${text}::v4-wave3`).toString(16).padStart(8, "0");
  return `${first}${second}${second}${first}`;
}

export function rotate<T>(values: readonly T[], amount: number): T[] {
  if (!values.length) return [];
  const offset = ((amount % values.length) + values.length) % values.length;
  return [...values.slice(offset), ...values.slice(0, offset)];
}

export function relationText(relationId: BlrCp006Relation): string {
  return relationDisplay(relationId).toLocaleLowerCase("en-IN");
}

export function targetSentence(target: Target): string {
  return `${target.subjectId} is the ${relationText(target.relationId)} of ${target.referenceId}`;
}

export function statementText(statement: BlrCp006CodedStatement): string {
  return `${statement.leftId} ${statement.token} ${statement.rightId}`;
}

export function codeKeyFor(groupKey: string, relations: readonly BlrCp006DirectRelation[]): readonly BlrCp006CodeDefinition[] {
  const offset = hashText(groupKey) % SYMBOLS.length;
  return relations.map((relationId, index) => ({
    relationId,
    token: SYMBOLS[(index + offset) % SYMBOLS.length]!,
  }));
}

export function fullCodeKey(groupKey: string): readonly BlrCp006CodeDefinition[] {
  return codeKeyFor(groupKey, DIRECT_RELATIONS);
}

export function promptFor(codeKey: readonly BlrCp006CodeDefinition[]): string {
  return `Use these code meanings: ${codeKey.map((entry) =>
    `${entry.token} means “is the ${relationText(entry.relationId)} of”`,
  ).join("; ")}. Read every coded pair from left to right.`;
}

export function tokenFor(codeKey: readonly BlrCp006CodeDefinition[], relationId: BlrCp006DirectRelation): string {
  const entry = codeKey.find((value) => value.relationId === relationId);
  if (!entry) throw new Error(`Missing code symbol for ${relationId}.`);
  return entry.token;
}

export function relationFor(codeKey: readonly BlrCp006CodeDefinition[], token: string): BlrCp006DirectRelation {
  const entry = codeKey.find((value) => value.token === token);
  if (!entry) throw new Error(`Unknown code symbol ${token}.`);
  return entry.relationId;
}

export function remapStatement(
  statement: BlrCp006CodedStatement,
  sourceKey: readonly BlrCp006CodeDefinition[],
  targetKey: readonly BlrCp006CodeDefinition[],
): BlrCp006CodedStatement {
  const relationId = relationFor(sourceKey, statement.token);
  return { ...statement, token: tokenFor(targetKey, relationId) };
}

export function encodeSpecs(
  specs: readonly DirectSpec[],
  codeKey: readonly BlrCp006CodeDefinition[],
): readonly BlrCp006CodedStatement[] {
  return specs.map((spec) => ({
    leftId: spec.leftId,
    token: tokenFor(codeKey, spec.relationId),
    rightId: spec.rightId,
  }));
}

export function evaluate(
  codeKey: readonly BlrCp006CodeDefinition[],
  statements: readonly BlrCp006CodedStatement[],
  target: Target,
  suffix: string,
): { graph: BlrCp006Graph; decodedStatements: readonly string[]; actual?: BlrCp006Relation } {
  const scenario: BlrCp006Scenario = {
    scenarioId: `BLR-CP007-V4-WAVE3-${suffix}`,
    topologyId: "BLR_CP007_V4_WAVE3_VERIFICATION",
    keyStyle: "SYMBOL",
    codeKey,
    statements,
    expressionLines: statements.map(statementText),
    query: { kind: "RELATION", subjectId: target.subjectId, referenceId: target.referenceId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "BLR CP-007 V4 Wave 3 verification",
  };
  const decoded = decodeScenario(scenario);
  let actual: BlrCp006Relation | undefined;
  try {
    actual = relationOf(decoded.graph, target.subjectId, target.referenceId);
  } catch {
    actual = undefined;
  }
  return { ...decoded, actual };
}

function genderEvidenceForTarget(
  target: Target,
  codeKey: readonly BlrCp006CodeDefinition[],
): BlrCp006CodedStatement | undefined {
  if (["FATHER", "SON"].includes(target.relationId)) {
    return { leftId: target.subjectId, token: tokenFor(codeKey, "HUSBAND"), rightId: "G" };
  }
  if (["MOTHER", "DAUGHTER"].includes(target.relationId)) {
    return { leftId: target.subjectId, token: tokenFor(codeKey, "WIFE"), rightId: "G" };
  }
  return undefined;
}

function appendGenderEvidence(
  question: GeneratedBlrCp007EditorialV4Question,
  statements: readonly BlrCp006CodedStatement[],
  target: Target,
  codeKey: readonly BlrCp006CodeDefinition[],
): readonly BlrCp006CodedStatement[] {
  const needsEvidence = question.sourcePrototypeId.includes("DIRECT-REVERSE") ||
    question.sourcePrototypeId.includes("MISSING-TOKEN-REVERSE");
  if (!needsEvidence) return statements;
  const evidence = genderEvidenceForTarget(target, codeKey);
  return evidence ? [...statements, evidence] : statements;
}

export function optionExplanation(target: Target, actual?: BlrCp006Relation): string {
  return actual
    ? `The coded chain makes ${target.subjectId} the ${relationText(actual)} of ${target.referenceId}, not the ${relationText(target.relationId)}.`
    : `The coded chain does not establish the required relation between ${target.subjectId} and ${target.referenceId}.`;
}

function correctOptionExplanation(target: Target): string {
  return `The decoded chain establishes that ${targetSentence(target)}.`;
}

function optionFromStatements(
  codeKey: readonly BlrCp006CodeDefinition[],
  statements: readonly BlrCp006CodedStatement[],
  target: Target,
  isCorrectAnswerForTask: boolean,
  suffix: string,
): BlrCp007V3Option {
  const decoded = evaluate(codeKey, statements, target, suffix);
  const semanticKey = statements.map((statement) =>
    `${statement.leftId}:${relationFor(codeKey, statement.token)}:${statement.rightId}`,
  ).join("|");
  return {
    text: statements.map(statementText).join("; "),
    semanticKey,
    completedStatements: statements,
    decodedAssertions: decoded.decodedStatements,
    graphValidity: "VALID",
    statementValidity: "NOT_APPLICABLE",
    targetRelationSatisfied: decoded.actual === target.relationId,
    isCorrectAnswerForTask,
    failureCode: isCorrectAnswerForTask ? undefined : "WRONG_RELATION",
    actualRelation: decoded.actual,
    studentExplanation: isCorrectAnswerForTask
      ? correctOptionExplanation(target)
      : optionExplanation(target, decoded.actual),
  };
}

export function queryTarget(question: GeneratedBlrCp007EditorialV4Question): Target | undefined {
  return "target" in question.query ? question.query.target : undefined;
}

export function displayDifficulty(question: GeneratedBlrCp007EditorialV4Question): BlrCp007V3Difficulty {
  if (question.metadata.disposition === "FOUNDATION_PRACTICE") return "EASY";
  if (question.qlId === "BLR-QL-035") {
    return question.sourcePrototypeId.includes("DIRECT")
      ? "EASY"
      : question.sourcePrototypeId.includes("INCORRECT-DERIVED")
        ? "HARD"
        : "MEDIUM";
  }
  if (question.qlId === "BLR-QL-033" && queryTarget(question)?.relationId === "COUSIN") return "HARD";
  if (question.qlId === "BLR-QL-031" && queryTarget(question)?.relationId === "COUSIN") return "HARD";
  return "MEDIUM";
}

export function recommendedUse(
  question: GeneratedBlrCp007EditorialV4Question,
  difficulty: BlrCp007V3Difficulty,
): BlrCp007V4RecommendedUse {
  if (question.metadata.disposition === "FOUNDATION_PRACTICE") return "GUIDED_PRACTICE";
  return difficulty === "HARD" ? "ADVANCED_PRACTICE" : "STANDARD_MOCK";
}

export function changedPositions(
  correct: readonly BlrCp006CodedStatement[],
  candidate: readonly BlrCp006CodedStatement[],
): readonly number[] {
  const positions: number[] = [];
  for (let index = 0; index < correct.length; index += 1) {
    const left = correct[index]!;
    const right = candidate[index]!;
    if (left.leftId !== right.leftId || left.rightId !== right.rightId || left.token !== right.token) positions.push(index);
  }
  return positions;
}

function diversifySelectExpression(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): readonly BlrCp007V3Option[] {
  if (question.query.kind !== "SELECT_EXPRESSION") throw new Error(`${question.itemId}: expected SELECT_EXPRESSION.`);
  const target = question.query.target;
  const sourceCorrect = question.options[question.correctIndex]!;
  const correctStatements = appendGenderEvidence(
    question,
    sourceCorrect.completedStatements.map((statement) =>
      remapStatement(statement, question.codeKey, codeKey),
    ),
    target,
    codeKey,
  );
  const correct = optionFromStatements(codeKey, correctStatements, target, true, `${question.itemId}-SELECT-CORRECT`);
  if (question.sourcePrototypeId.includes("SELECT-DIRECT")) {
    return question.options.map((sourceOption) => {
      const statements = appendGenderEvidence(
        question,
        sourceOption.completedStatements.map((statement) =>
          remapStatement(statement, question.codeKey, codeKey),
        ),
        target,
        codeKey,
      );
      return optionFromStatements(
        codeKey,
        statements,
        target,
        sourceOption.isCorrectAnswerForTask,
        `${question.itemId}-SELECT-DIRECT-${sourceOption.semanticKey}`,
      );
    });
  }

  const candidates = new Map<string, { option: BlrCp007V3Option; changed: readonly number[]; reversed: boolean }>();
  const addCandidate = (statements: readonly BlrCp006CodedStatement[], reversed: boolean, salt: string) => {
    const signature = JSON.stringify(statements);
    if (signature === JSON.stringify(correctStatements) || candidates.has(signature)) return;
    try {
      const option = optionFromStatements(codeKey, statements, target, false, `${question.itemId}-${salt}`);
      if (option.actualRelation === target.relationId) return;
      candidates.set(signature, { option, changed: changedPositions(correctStatements, statements), reversed });
    } catch {
      // Invalid graph mutations are intentionally discarded.
    }
  };

  for (let statementIndex = 0; statementIndex < correctStatements.length; statementIndex += 1) {
    for (const entry of codeKey) {
      if (entry.token === correctStatements[statementIndex]!.token) continue;
      const statements = correctStatements.map((statement, index) =>
        index === statementIndex ? { ...statement, token: entry.token } : { ...statement },
      );
      addCandidate(statements, false, `TOKEN-${statementIndex}-${entry.relationId}`);
    }
    const statements = correctStatements.map((statement, index) =>
      index === statementIndex
        ? { ...statement, leftId: statement.rightId, rightId: statement.leftId }
        : { ...statement },
    );
    addCandidate(statements, true, `REVERSE-${statementIndex}`);
  }

  for (let left = 0; left < correctStatements.length; left += 1) {
    for (let right = left + 1; right < correctStatements.length; right += 1) {
      const statements = correctStatements.map((statement) => ({ ...statement }));
      const leftToken = statements[left]!.token;
      statements[left] = { ...statements[left]!, token: statements[right]!.token };
      statements[right] = { ...statements[right]!, token: leftToken };
      addCandidate(statements, false, `SWAP-${left}-${right}`);
    }
  }

  const pool = [...candidates.values()];
  const selected: typeof pool = [];
  const used = new Set<string>();
  while (selected.length < 3 && pool.length > 0) {
    const covered = new Set(selected.flatMap((value) => [...value.changed]));
    pool.sort((left, right) => {
      const score = (value: typeof pool[number]) =>
        value.changed.filter((index) => !covered.has(index)).length * 20 +
        value.changed.length * 5 +
        (value.reversed ? 4 : 0) +
        (value.option.actualRelation ? 1 : 0);
      return score(right) - score(left);
    });
    const next = pool.shift()!;
    if (used.has(next.option.semanticKey)) continue;
    used.add(next.option.semanticKey);
    selected.push(next);
  }
  if (selected.length !== 3) throw new Error(`${question.itemId}: could not construct three diverse expression distractors.`);
  const wrong = selected.map((value) => value.option);
  let wrongIndex = 0;
  return Array.from({ length: 4 }, (_, index) =>
    index === question.correctIndex ? correct : wrong[wrongIndex++]!,
  );
}

export function remodelQl031(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  if (question.query.kind !== "SELECT_EXPRESSION") throw new Error(`${question.itemId}: expected SELECT_EXPRESSION.`);
  const target = question.query.target;
  const options = diversifySelectExpression(question, codeKey);
  const correct = options[question.correctIndex]!;
  const evaluated = evaluate(codeKey, correct.completedStatements, target, `${question.itemId}-SELECT-FINAL`);
  const candidates: readonly BlrCp007ExpressionCandidate[] = options.map((option) => ({
    text: option.text,
    statements: option.completedStatements,
    semanticKey: option.semanticKey,
  }));
  const steps = correct.decodedAssertions.length === 1
    ? correct.decodedAssertions
    : [...correct.decodedAssertions, `Combining the decisive links shows that ${targetSentence(target)}.`];
  return {
    ...question,
    keyStyle: "SYMBOL",
    codeKey,
    sharedPrompt: promptFor(codeKey),
    query: { kind: "SELECT_EXPRESSION", target, candidates },
    stem: `Which coded expression correctly shows that ${targetSentence(target)}?`,
    options,
    answer: correct.text,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluated.decodedStatements,
    graph: evaluated.graph,
    explanation: {
      ...question.explanation,
      steps,
      conclusion: `Option ${OPTION_LABELS[question.correctIndex]} is correct: ${targetSentence(target)}.`,
      shortcut: correct.completedStatements.length === 1
        ? "Decode the relation and check the left-to-right direction."
        : "Trace the complete chain; do not judge an option from only its first symbol.",
      commonTrap: correct.completedStatements.length === 1
        ? "Do not reverse the two people."
        : "A partly correct chain is still wrong if any link changes direction or relation.",
      optionAnalysis: options.map((option, index) => ({
        optionLabel: OPTION_LABELS[index]!,
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
    },
  };
}

export function remodelQl032(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  if (question.query.kind !== "MISSING_TOKEN") throw new Error(`${question.itemId}: expected MISSING_TOKEN.`);
  const target = question.query.target;
  const options = question.options.map((sourceOption) => {
    const statements = appendGenderEvidence(
      question,
      sourceOption.completedStatements.map((statement) =>
        remapStatement(statement, question.codeKey, codeKey),
      ),
      target,
      codeKey,
    );
    const directRelation = sourceOption.semanticKey as BlrCp006DirectRelation;
    const symbol = tokenFor(codeKey, directRelation);
    const evaluated = evaluate(codeKey, statements, target, `${question.itemId}-TOKEN-${directRelation}`);
    const correct = sourceOption.isCorrectAnswerForTask;
    return {
      ...sourceOption,
      text: symbol,
      completedStatements: statements,
      decodedAssertions: evaluated.decodedStatements,
      targetRelationSatisfied: evaluated.actual === target.relationId,
      actualRelation: evaluated.actual,
      studentExplanation: correct
        ? `${symbol} means “is the ${relationText(directRelation)} of”. With it in the blank, ${targetSentence(target)}.`
        : `${symbol} means “is the ${relationText(directRelation)} of”. ${optionExplanation(target, evaluated.actual)}`,
    };
  });
  const correct = options[question.correctIndex]!;
  const directRelation = correct.semanticKey as BlrCp006DirectRelation;
  const completeStatements = appendGenderEvidence(
    question,
    question.query.completeStatements.map((statement) =>
      remapStatement(statement, question.codeKey, codeKey),
    ),
    target,
    codeKey,
  );
  const expressionLines = completeStatements.map((statement, index) =>
    index === question.query.blankStatementIndex
      ? `${statement.leftId} ? ${statement.rightId}`
      : statementText(statement),
  );
  const evaluated = evaluate(codeKey, correct.completedStatements, target, `${question.itemId}-TOKEN-FINAL`);
  const steps = [...correct.decodedAssertions];
  if (evaluated.actual === target.relationId && directRelation !== target.relationId) {
    steps.push(`Therefore, ${targetSentence(target)}.`);
  }
  return {
    ...question,
    keyStyle: "SYMBOL",
    codeKey,
    sharedPrompt: promptFor(codeKey),
    query: {
      kind: "MISSING_TOKEN",
      completeStatements,
      blankStatementIndex: question.query.blankStatementIndex,
      expressionLines,
      candidateTokens: options.map((option) => option.text),
      target,
    },
    stem: `Which symbol should replace ? so that the coded statements establish that ${targetSentence(target)}?\n\n${expressionLines.join("\n")}`,
    options,
    answer: correct.text,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluated.decodedStatements,
    graph: evaluated.graph,
    explanation: {
      ...question.explanation,
      steps,
      conclusion: `${correct.text} is required; it means “is the ${relationText(directRelation)} of”.`,
      shortcut: "First determine the direct relation needed at the blank, then select its symbol from the key.",
      commonTrap: "Do not confuse the blank symbol’s direct meaning with the final relation produced by the whole chain.",
      optionAnalysis: options.map((option, index) => ({
        optionLabel: OPTION_LABELS[index]!,
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
    },
  };
}

function pairOption(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
  pair: readonly [BlrCp006DirectRelation, BlrCp006DirectRelation],
  correctPair: readonly [BlrCp006DirectRelation, BlrCp006DirectRelation],
  isCorrect: boolean,
  suffix: string,
): BlrCp007V3Option {
  if (question.query.kind !== "MISSING_TOKEN_PAIR") throw new Error(`${question.itemId}: expected MISSING_TOKEN_PAIR.`);
  const statements = question.query.completeStatements.map((sourceStatement, index) => {
    const sourceRelation = relationFor(question.codeKey, sourceStatement.token);
    const relationId = index === question.query.blankStatementIndices[0]
      ? pair[0]
      : index === question.query.blankStatementIndices[1]
        ? pair[1]
        : sourceRelation;
    return {
      leftId: sourceStatement.leftId,
      token: tokenFor(codeKey, relationId),
      rightId: sourceStatement.rightId,
    };
  });
  const target = question.query.target;
  const evaluated = evaluate(codeKey, statements, target, `${question.itemId}-${suffix}`);
  const tokens = [tokenFor(codeKey, pair[0]), tokenFor(codeKey, pair[1])] as const;
  const firstCorrect = pair[0] === correctPair[0];
  const secondCorrect = pair[1] === correctPair[1];
  return {
    text: `${tokens[0]}, ${tokens[1]}`,
    semanticKey: `${pair[0]}|${pair[1]}`,
    completedStatements: statements,
    decodedAssertions: evaluated.decodedStatements,
    graphValidity: "VALID",
    statementValidity: "NOT_APPLICABLE",
    targetRelationSatisfied: evaluated.actual === target.relationId,
    isCorrectAnswerForTask: isCorrect,
    failureCode: isCorrect
      ? undefined
      : firstCorrect
        ? "SECOND_TOKEN_WRONG"
        : secondCorrect
          ? "FIRST_TOKEN_WRONG"
          : "BOTH_TOKENS_WRONG",
    actualRelation: evaluated.actual,
    studentExplanation: isCorrect
      ? `${tokens[0]} means ${relationText(pair[0])} and ${tokens[1]} means ${relationText(pair[1])}; together they establish that ${targetSentence(target)}.`
      : `${tokens[0]} means ${relationText(pair[0])} and ${tokens[1]} means ${relationText(pair[1])}. ${optionExplanation(target, evaluated.actual)}`,
  };
}

function diversifyPairOptions(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): readonly BlrCp007V3Option[] {
  if (question.query.kind !== "MISSING_TOKEN_PAIR") throw new Error(`${question.itemId}: expected MISSING_TOKEN_PAIR.`);
  const sourceCorrect = question.options[question.correctIndex]!;
  const [leftRelation, rightRelation] = sourceCorrect.semanticKey.split("|") as [BlrCp006DirectRelation, BlrCp006DirectRelation];
  const correctPair = [leftRelation, rightRelation] as const;
  const correct = pairOption(question, codeKey, correctPair, correctPair, true, "PAIR-CORRECT");
  const pool: { option: BlrCp007V3Option; firstChanged: boolean; secondChanged: boolean }[] = [];
  for (const first of DIRECT_RELATIONS) {
    for (const second of DIRECT_RELATIONS) {
      if (first === correctPair[0] && second === correctPair[1]) continue;
      try {
        const option = pairOption(question, codeKey, [first, second], correctPair, false, `PAIR-${first}-${second}`);
        if (option.actualRelation === question.query.target.relationId) continue;
        pool.push({
          option,
          firstChanged: first !== correctPair[0],
          secondChanged: second !== correctPair[1],
        });
      } catch {
        // Discard graph-invalid combinations.
      }
    }
  }
  const choose = (predicate: (value: typeof pool[number]) => boolean) => {
    const index = pool.findIndex(predicate);
    if (index < 0) return undefined;
    return pool.splice(index, 1)[0]!;
  };
  const selected = [
    choose((value) => value.firstChanged && value.secondChanged),
    choose((value) => value.firstChanged && !value.secondChanged),
    choose((value) => !value.firstChanged && value.secondChanged),
  ].filter((value): value is typeof pool[number] => Boolean(value));
  while (selected.length < 3 && pool.length > 0) selected.push(pool.shift()!);
  if (selected.length !== 3) throw new Error(`${question.itemId}: could not construct three ordered-pair distractors.`);
  let wrongIndex = 0;
  return Array.from({ length: 4 }, (_, index) =>
    index === question.correctIndex ? correct : selected[wrongIndex++]!.option,
  );
}

export function remodelQl033(
  question: GeneratedBlrCp007EditorialV4Question,
  codeKey: readonly BlrCp006CodeDefinition[],
): GeneratedBlrCp007EditorialV4Question {
  if (question.query.kind !== "MISSING_TOKEN_PAIR") throw new Error(`${question.itemId}: expected MISSING_TOKEN_PAIR.`);
  const target = question.query.target;
  const options = diversifyPairOptions(question, codeKey);
  const correct = options[question.correctIndex]!;
  const completeStatements = question.query.completeStatements.map((statement) =>
    remapStatement(statement, question.codeKey, codeKey),
  );
  const expressionLines = completeStatements.map((statement, index) =>
    question.query.blankStatementIndices.includes(index)
      ? `${statement.leftId} ? ${statement.rightId}`
      : statementText(statement),
  );
  const evaluated = evaluate(codeKey, correct.completedStatements, target, `${question.itemId}-PAIR-FINAL`);
  return {
    ...question,
    keyStyle: "SYMBOL",
    codeKey,
    sharedPrompt: promptFor(codeKey),
    query: {
      kind: "MISSING_TOKEN_PAIR",
      completeStatements,
      blankStatementIndices: question.query.blankStatementIndices,
      expressionLines,
      candidateTokenPairs: options.map((option) => option.text.split(", ") as [string, string]),
      target,
    },
    stem: `Choose the two symbols, in blank order, that make the coded statements establish that ${targetSentence(target)}.\n\n${expressionLines.join("\n")}`,
    options,
    answer: correct.text,
    completedStatements: correct.completedStatements,
    decodedStatements: evaluated.decodedStatements,
    graph: evaluated.graph,
    explanation: {
      ...question.explanation,
      steps: [...correct.decodedAssertions, `Combining the links shows that ${targetSentence(target)}.`],
      conclusion: `${correct.text} is the correct ordered pair of symbols.`,
      shortcut: "Solve each blank separately, then verify the complete relation chain.",
      commonTrap: "Do not swap the first and second blank, and do not accept an option that fixes only one position.",
      optionAnalysis: options.map((option, index) => ({
        optionLabel: OPTION_LABELS[index]!,
        optionText: option.text,
        statementValidity: option.statementValidity,
        isCorrectAnswerForTask: option.isCorrectAnswerForTask,
        failureCode: option.failureCode,
        explanation: option.studentExplanation,
      })),
    },
  };
}
