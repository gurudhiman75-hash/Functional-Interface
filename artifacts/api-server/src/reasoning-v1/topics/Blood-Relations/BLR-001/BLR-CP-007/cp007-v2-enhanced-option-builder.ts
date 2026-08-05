import { relationOf } from "../BLR-CP-006/cp006-graph";
import type {
  BlrCp006CodedStatement,
  BlrCp006Relation,
} from "../BLR-CP-006/cp006-model";
import type { BlrCp007Scenario } from "./cp007-model";
import {
  buildBlrCp007V2Options,
  decodeBlrCp007V2,
} from "./cp007-v2-option-builder";
import {
  shuffled,
  type BlrCp007V2FailureCode,
  type BlrCp007V2Option,
} from "./cp007-v2-model";

function substitutePair(
  statements: readonly BlrCp006CodedStatement[],
  indices: readonly [number, number],
  tokens: readonly [string, string],
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, index) => {
    if (index === indices[0]) return { ...entry, token: tokens[0] };
    if (index === indices[1]) return { ...entry, token: tokens[1] };
    return entry;
  });
}

function actualRelation(
  scenario: BlrCp007Scenario,
  statements: readonly BlrCp006CodedStatement[],
  suffix: string,
): {
  decodedStatements: readonly string[];
  relation?: BlrCp006Relation;
} | undefined {
  if (scenario.query.kind !== "MISSING_TOKEN_PAIR") return undefined;
  try {
    const decoded = decodeBlrCp007V2(scenario, statements, suffix);
    let relation: BlrCp006Relation | undefined;
    try {
      relation = relationOf(
        decoded.graph,
        scenario.query.target.subjectId,
        scenario.query.target.referenceId,
      );
    } catch {
      relation = undefined;
    }
    return { decodedStatements: decoded.decodedStatements, relation };
  } catch {
    return undefined;
  }
}

function targetDerivedPairOptions(
  scenario: BlrCp007Scenario,
): BlrCp007V2Option[] {
  if (scenario.query.kind !== "MISSING_TOKEN_PAIR") {
    throw new Error(`${scenario.scenarioId}: target-derived pair has wrong query kind.`);
  }
  const required = [
    scenario.query.completeStatements[scenario.query.blankStatementIndices[0]]!.token,
    scenario.query.completeStatements[scenario.query.blankStatementIndices[1]]!.token,
  ] as const;
  const rows: {
    tokens: readonly [string, string];
    statements: readonly BlrCp006CodedStatement[];
    decodedStatements: readonly string[];
    actualRelation?: BlrCp006Relation;
    targetSatisfied: boolean;
  }[] = [];
  for (const first of scenario.codeKey) {
    for (const second of scenario.codeKey) {
      const tokens = [first.token, second.token] as const;
      const statements = substitutePair(
        scenario.query.completeStatements,
        scenario.query.blankStatementIndices,
        tokens,
      );
      const evaluated = actualRelation(
        scenario,
        statements,
        `TARGET_PAIR_${first.token}_${second.token}`,
      );
      if (!evaluated) continue;
      rows.push({
        tokens,
        statements,
        decodedStatements: evaluated.decodedStatements,
        actualRelation: evaluated.relation,
        targetSatisfied: evaluated.relation === scenario.query.target.relationId,
      });
    }
  }
  const correctRows = rows.filter((row) => row.targetSatisfied);
  if (correctRows.length !== 1) {
    throw new Error(
      `${scenario.scenarioId}: target-derived pair requires one semantic answer, got ${correctRows.length}: ${correctRows
        .map((row) => `${row.tokens[0]},${row.tokens[1]}`)
        .join(" | ")}.`,
    );
  }
  const correct = correctRows[0]!;
  if (correct.tokens[0] !== required[0] || correct.tokens[1] !== required[1]) {
    throw new Error(`${scenario.scenarioId}: authored pair does not match unique target solution.`);
  }
  const wrongs = shuffled(
    rows.filter((row) => !row.targetSatisfied),
    `${scenario.scenarioId}|target-derived-pair-wrongs`,
  );
  const selected: typeof wrongs = [];
  const preferred = [
    wrongs.find(
      (row) => row.tokens[0] === required[1] && row.tokens[1] === required[0],
    ),
    wrongs.find(
      (row) => row.tokens[0] !== required[0] && row.tokens[1] === required[1],
    ),
    wrongs.find(
      (row) => row.tokens[0] === required[0] && row.tokens[1] !== required[1],
    ),
  ];
  for (const row of [...preferred, ...wrongs]) {
    if (!row || selected.includes(row)) continue;
    selected.push(row);
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) {
    throw new Error(`${scenario.scenarioId}: insufficient graph-valid target-derived distractors.`);
  }

  return [correct, ...selected].map((row) => {
    const isCorrect = row === correct;
    const firstWrong = row.tokens[0] !== required[0];
    const secondWrong = row.tokens[1] !== required[1];
    const failureCode: BlrCp007V2FailureCode | undefined = isCorrect
      ? undefined
      : row.tokens[0] === required[1] && row.tokens[1] === required[0]
        ? "TOKENS_SWAPPED"
        : firstWrong && secondWrong
          ? "BOTH_TOKENS_WRONG"
          : firstWrong
            ? "FIRST_TOKEN_WRONG"
            : "SECOND_TOKEN_WRONG";
    return {
      text: `${row.tokens[0]}, ${row.tokens[1]}`,
      semanticKey: `TARGET_PAIR_${row.tokens[0]}_${row.tokens[1]}`,
      isCorrect,
      failureCode,
      graphValidity: "VALID" as const,
      targetSatisfied: row.targetSatisfied,
      decodedAssertions: row.decodedStatements,
      actualRelation: row.actualRelation,
      statements: row.statements,
      completionValue: {
        kind: "TOKEN_PAIR" as const,
        tokens: row.tokens,
      },
    };
  });
}

export function buildBlrCp007V2EnhancedOptions(
  scenario: BlrCp007Scenario,
): BlrCp007V2Option[] {
  if (
    scenario.topologyId.startsWith("V2_TARGET_DERIVED_") &&
    scenario.query.kind === "MISSING_TOKEN_PAIR"
  ) {
    return targetDerivedPairOptions(scenario);
  }
  return buildBlrCp007V2Options(scenario);
}
