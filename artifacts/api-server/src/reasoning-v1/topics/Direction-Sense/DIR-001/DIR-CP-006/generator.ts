import { oppositeDirection, turnRight } from "../foundation/directions";
import type { CardinalDirection, Coordinate, Direction } from "../foundation/types";
import {
  DIRECTION_LABELS,
  DIRECTION_PHRASES,
  codeMapFingerprint,
  directionBetween,
  renderCodedChain,
  solveRelationsCanonical,
  symbolForDirection,
  vectorFor,
} from "./code-system";
import { buildCodeMapDiagram, buildCodedMovementDiagram, buildCodedRelationDiagram } from "./coded-direction-diagram";
import {
  independentDirection,
  recoverCodeMapsIndependent,
  recoverMissingOperatorIndependent,
  solveCodedMovementIndependent,
  solveCodedRelationsIndependent,
} from "./independent-solver";
import {
  conclusionOptions,
  correctIndex,
  directionOptions,
  entityOptions,
  equivalentStatementOptions,
  symbolOptions,
} from "./options";
import {
  buildCodeRecoveryScenario,
  buildCodedChainScenario,
  buildCodedEntityScenario,
  buildCodedMovementScenario,
  buildEquivalentStatementScenario,
  buildMissingOperatorScenario,
} from "./scenario-builders";
import {
  decodeMapLines,
  decodeRelationLines,
  renderDirectionStem,
  renderEntityLookupStem,
  renderEquivalentStatementStem,
  renderMapRecoveryStem,
  renderMissingOperatorStem,
  renderMovementStem,
  renderValidConclusionStem,
} from "./question-language.en";
import { dirCp006Ql } from "./task-registry";
import type {
  CodeRecoveryEvidence,
  CodeSymbol,
  CodedDirectionAnswer,
  CodedDirectionDiagramSpec,
  CodedDirectionExplanation,
  CodedDirectionOption,
  CodedRelation,
  DirectionCodeMap,
  GeneratedCodedDirectionQuestion,
} from "./types";

function answerKey(answer: CodedDirectionAnswer): string {
  return JSON.stringify(answer);
}

function difficultyFor(qlId: string, seed: number, relationCount: number): "EASY" | "MEDIUM" | "HARD" {
  if (qlId === "DIR-QL-025" || qlId === "DIR-QL-028") return "HARD";
  if (qlId === "DIR-QL-026") return Math.abs(seed) % 3 === 0 ? "EASY" : "MEDIUM";
  if (qlId === "DIR-QL-024") return Math.abs(seed) % 4 === 0 ? "EASY" : "MEDIUM";
  if (qlId === "DIR-QL-027") return relationCount >= 3 ? "HARD" : "MEDIUM";
  if (relationCount <= 1) return "EASY";
  if (relationCount === 2) return "MEDIUM";
  return "HARD";
}

function baseQuestion(args: {
  readonly qlId: string;
  readonly seed: number;
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly CodedDirectionOption[];
  readonly correctAnswer: CodedDirectionAnswer;
  readonly explanation: CodedDirectionExplanation;
  readonly relationCount: number;
  readonly mappingRecoveredUniquely?: boolean;
}): GeneratedCodedDirectionQuestion {
  const ql = dirCp006Ql(args.qlId);
  const index = correctIndex(args.options);
  if (answerKey(args.options[index].value) !== answerKey(args.correctAnswer)) {
    throw new Error(`${args.qlId} correct option does not match the canonical answer`);
  }
  if (args.stem.includes("\n")) throw new Error(`${args.qlId} stem must remain one paragraph`);
  return {
    qlId: args.qlId,
    checkpointId: "DIR-CP-006",
    ruleId: ql.ruleId,
    seed: args.seed,
    difficulty: difficultyFor(args.qlId, args.seed, args.relationCount),
    stem: args.stem,
    structuredPrompt: args.structuredPrompt,
    options: args.options,
    correctIndex: index,
    correctAnswer: args.correctAnswer,
    explanation: args.explanation,
    metadata: {
      answerDemand: ql.answerDemand,
      activeCodeCount: 4,
      relationCount: args.relationCount,
      solverVerified: true,
      solveMode: null,
      mappingRecoveredUniquely: args.mappingRecoveredUniquely ?? false,
    },
  };
}

function vectorDescription(subject: Coordinate, reference: Coordinate, unit: "steps" | "metres" = "steps"): string {
  const dx = subject.x - reference.x;
  const dy = subject.y - reference.y;
  const amount = (value: number) => unit === "metres"
    ? `${Math.abs(value)} metre${Math.abs(value) === 1 ? "" : "s"}`
    : `${Math.abs(value)} step${Math.abs(value) === 1 ? "" : "s"}`;
  const parts = [
    dx === 0 ? null : `${amount(dx)} ${dx > 0 ? "East" : "West"}`,
    dy === 0 ? null : `${amount(dy)} ${dy > 0 ? "North" : "South"}`,
  ].filter((value): value is string => value !== null);
  return parts.join(" and ");
}

function relationExplanation(
  map: DirectionCodeMap,
  relations: readonly CodedRelation[],
  resultLine: string,
  conclusion: string,
  diagram: CodedDirectionDiagramSpec,
): CodedDirectionExplanation {
  return {
    given: "First decode the four symbols, then place the entities one coded relation at a time.",
    decodeLines: decodeMapLines(map),
    workingLines: decodeRelationLines(relations, map),
    resultLine,
    conclusion,
    diagram,
  };
}

function statement(subject: string, direction: Direction, reference: string): string {
  return `${subject} is ${DIRECTION_PHRASES[direction]} of ${reference}.`;
}

function buildDirectionQuestion(qlId: string, seed: number): GeneratedCodedDirectionQuestion {
  const scenario = buildCodedChainScenario(seed);
  const independentCoordinates = solveCodedRelationsIndependent(scenario.relations, scenario.map);
  const independent = independentDirection(independentCoordinates, scenario.subject, scenario.reference);
  if (independent !== scenario.direction) throw new Error(`Independent coded-chain direction mismatch for seed ${seed}`);
  const options = directionOptions(scenario.direction, seed);
  const result = `${scenario.subject} is reached from ${scenario.reference} by ${vectorDescription(scenario.coordinates[scenario.subject], scenario.coordinates[scenario.reference])}.`;
  return baseQuestion({
    qlId,
    seed,
    stem: renderDirectionStem(scenario.map, scenario.relations, scenario.subject, scenario.reference),
    structuredPrompt: {
      codeMap: scenario.map,
      relations: scenario.relations,
      coordinates: scenario.coordinates,
      query: { subject: scenario.subject, reference: scenario.reference },
    },
    options,
    correctAnswer: { kind: "DIRECTION", direction: scenario.direction },
    explanation: relationExplanation(
      scenario.map,
      scenario.relations,
      result,
      `Therefore, ${scenario.subject} is ${DIRECTION_LABELS[scenario.direction]} of ${scenario.reference}.`,
      buildCodedRelationDiagram(scenario.coordinates, scenario.relations, scenario.map, { queryPair: { subject: scenario.subject, reference: scenario.reference } }),
    ),
    relationCount: scenario.relations.length,
  });
}

function buildEntityQuestion(qlId: string, seed: number): GeneratedCodedDirectionQuestion {
  const scenario = buildCodedEntityScenario(seed);
  const independentCoordinates = solveCodedRelationsIndependent(scenario.relations, scenario.map);
  const matches = scenario.optionEntities.filter((entity) => independentDirection(independentCoordinates, entity, scenario.reference) === scenario.targetDirection);
  if (matches.length !== 1 || matches[0] !== scenario.answerEntity) throw new Error(`Entity lookup is not unique for seed ${seed}`);
  const options = entityOptions(scenario.answerEntity, scenario.optionEntities, seed);
  return baseQuestion({
    qlId,
    seed,
    stem: renderEntityLookupStem(scenario.map, scenario.relations, scenario.targetDirection, scenario.reference),
    structuredPrompt: {
      codeMap: scenario.map,
      relations: scenario.relations,
      coordinates: scenario.coordinates,
      query: { direction: scenario.targetDirection, reference: scenario.reference },
    },
    options,
    correctAnswer: { kind: "ENTITY", entity: scenario.answerEntity },
    explanation: relationExplanation(
      scenario.map,
      scenario.relations,
      `Only ${scenario.answerEntity} lies ${DIRECTION_PHRASES[scenario.targetDirection]} of ${scenario.reference}.`,
      `Therefore, the required person is ${scenario.answerEntity}.`,
      buildCodedRelationDiagram(scenario.coordinates, scenario.relations, scenario.map, { queryPair: { subject: scenario.answerEntity, reference: scenario.reference } }),
    ),
    relationCount: scenario.relations.length,
  });
}

function evidenceText(evidence: CodeRecoveryEvidence): string {
  const chain = evidence.displayEntities.map((entity, index) => index < evidence.symbols.length ? `${entity} ${evidence.symbols[index]}` : entity).join(" ");
  return `${chain} gives ${DIRECTION_LABELS[evidence.resultDirection]} from ${evidence.displayEntities[evidence.displayEntities.length - 1]} to ${evidence.displayEntities[0]}.`;
}

function buildMapRecoveryQuestion(qlId: string, seed: number): GeneratedCodedDirectionQuestion {
  const scenario = buildCodeRecoveryScenario(seed);
  const recovered = recoverCodeMapsIndependent(scenario.evidence);
  if (recovered.length !== 1 || codeMapFingerprint(recovered[0]) !== codeMapFingerprint(scenario.map)) {
    throw new Error(`Independent map recovery is not unique for seed ${seed}`);
  }
  const options = symbolOptions(scenario.answerSymbol, seed, "WRONG_RECOVERED_CODE");
  return baseQuestion({
    qlId,
    seed,
    stem: renderMapRecoveryStem(scenario.evidence, scenario.targetDirection),
    structuredPrompt: {
      evidence: scenario.evidence,
      targetDirection: scenario.targetDirection,
      recoveredCodeMap: scenario.map,
    },
    options,
    correctAnswer: { kind: "CODE_SYMBOL", symbol: scenario.answerSymbol },
    explanation: {
      given: "The four symbols form a one-to-one map to North, East, South and West.",
      decodeLines: scenario.evidence.map(evidenceText),
      workingLines: [
        "Check each evidence chain against the possible one-to-one maps.",
        `Only one map satisfies every chain: ${decodeMapLines(scenario.map).join(" ")}`,
      ],
      resultLine: `${scenario.answerSymbol} is the symbol mapped to ${DIRECTION_LABELS[scenario.targetDirection]}.`,
      conclusion: `Therefore, the correct symbol is ${scenario.answerSymbol}.`,
      diagram: buildCodeMapDiagram(scenario.map, scenario.evidence),
    },
    relationCount: scenario.evidence.reduce((sum, evidence) => sum + evidence.symbols.length, 0),
    mappingRecoveredUniquely: true,
  });
}

function buildEquivalentQuestion(qlId: string, seed: number): GeneratedCodedDirectionQuestion {
  const scenario = buildEquivalentStatementScenario(seed);
  if (scenario.map[scenario.answerSymbol] !== scenario.direction) throw new Error("Equivalent statement map mismatch");
  const options = equivalentStatementOptions(scenario.map, scenario.subject, scenario.reference, scenario.direction, seed);
  const referencePoint = { x: 0, y: 0 };
  const vector = vectorFor(scenario.direction);
  const coordinates = { [scenario.reference]: referencePoint, [scenario.subject]: vector };
  const relation: CodedRelation = { subject: scenario.subject, symbol: scenario.answerSymbol, reference: scenario.reference };
  const answerStatement = `${scenario.subject} ${scenario.answerSymbol} ${scenario.reference}`;
  return baseQuestion({
    qlId,
    seed,
    stem: renderEquivalentStatementStem(scenario.map, scenario.subject, scenario.reference, scenario.direction),
    structuredPrompt: {
      codeMap: scenario.map,
      targetRelation: { subject: scenario.subject, reference: scenario.reference, direction: scenario.direction },
    },
    options,
    correctAnswer: { kind: "CODED_STATEMENT", statement: answerStatement },
    explanation: {
      given: "Keep the grammar fixed: subject symbol reference.",
      decodeLines: decodeMapLines(scenario.map),
      workingLines: [
        `${scenario.subject} must remain before the symbol because it is the subject.`,
        `${scenario.answerSymbol} is the symbol for ${DIRECTION_LABELS[scenario.direction]}.`,
      ],
      resultLine: `The matching coded statement is ${answerStatement}.`,
      conclusion: `Therefore, choose ${answerStatement}.`,
      diagram: buildCodedRelationDiagram(coordinates, [relation], scenario.map, { queryPair: { subject: scenario.subject, reference: scenario.reference }, title: "Equivalent coded statement" }),
    },
    relationCount: 1,
  });
}

function buildConclusionQuestion(qlId: string, seed: number): GeneratedCodedDirectionQuestion {
  const scenario = buildCodedChainScenario(seed + 16);
  const independentCoordinates = solveCodedRelationsIndependent(scenario.relations, scenario.map);
  const correctDirection = independentDirection(independentCoordinates, scenario.subject, scenario.reference);
  if (correctDirection === "SAME_POSITION" || correctDirection !== scenario.direction) throw new Error("Conclusion scenario direction mismatch");
  const correct = statement(scenario.subject, scenario.direction, scenario.reference);
  const reversed = statement(scenario.subject, oppositeDirection(scenario.direction), scenario.reference);
  const orderTrap = statement(scenario.reference, scenario.direction, scenario.subject);
  const quadrantTrap = statement(scenario.subject, turnRight(scenario.direction), scenario.reference);
  const options = conclusionOptions(correct, [reversed, orderTrap, quadrantTrap], seed);
  return baseQuestion({
    qlId,
    seed,
    stem: renderValidConclusionStem(scenario.map, scenario.relations),
    structuredPrompt: {
      codeMap: scenario.map,
      relations: scenario.relations,
      coordinates: scenario.coordinates,
      conclusionCandidates: options.map((option) => option.label),
      correctConclusion: { subject: scenario.subject, reference: scenario.reference, direction: scenario.direction },
    },
    options,
    correctAnswer: { kind: "CONCLUSION", statement: correct },
    explanation: relationExplanation(
      scenario.map,
      scenario.relations,
      `${scenario.subject} lies ${DIRECTION_PHRASES[scenario.direction]} of ${scenario.reference}; the other statements reverse the relation, use the wrong quadrant, or use the wrong pair.`,
      `Therefore, the valid conclusion is: ${correct}`,
      buildCodedRelationDiagram(scenario.coordinates, scenario.relations, scenario.map, { queryPair: { subject: scenario.subject, reference: scenario.reference }, title: "Check the coded conclusion" }),
    ),
    relationCount: scenario.relations.length,
  });
}

function candidateResultLine(
  relations: readonly CodedRelation[],
  hiddenIndex: number,
  symbol: CodeSymbol,
  map: DirectionCodeMap,
  subject: string,
  reference: string,
): string {
  const candidate = relations.map((relation, index) => index === hiddenIndex ? { ...relation, symbol } : relation);
  const solved = solveRelationsCanonical(candidate, map);
  try {
    const direction = directionBetween(solved.coordinates, subject, reference);
    return `${symbol} gives ${DIRECTION_LABELS[direction]}.`;
  } catch {
    return `${symbol} makes the endpoints coincide.`;
  }
}

function buildMissingOperatorQuestion(qlId: string, seed: number): GeneratedCodedDirectionQuestion {
  const scenario = buildMissingOperatorScenario(seed);
  const satisfying = recoverMissingOperatorIndependent(
    scenario.relations,
    scenario.hiddenIndex,
    scenario.subject,
    scenario.reference,
    scenario.targetDirection,
    scenario.map,
  );
  if (satisfying.length !== 1 || satisfying[0] !== scenario.answerSymbol) throw new Error(`Independent missing-operator recovery failed for seed ${seed}`);
  const options = symbolOptions(scenario.answerSymbol, seed, "WRONG_CHAIN_OPERATOR");
  return baseQuestion({
    qlId,
    seed,
    stem: renderMissingOperatorStem(scenario.map, scenario.relations, scenario.hiddenIndex, scenario.subject, scenario.reference, scenario.targetDirection),
    structuredPrompt: {
      codeMap: scenario.map,
      relations: scenario.relations,
      hiddenIndex: scenario.hiddenIndex,
      targetRelation: { subject: scenario.subject, reference: scenario.reference, direction: scenario.targetDirection },
    },
    options,
    correctAnswer: { kind: "CODE_SYMBOL", symbol: scenario.answerSymbol },
    explanation: {
      given: "Decode the known symbols, then test the four possible symbols only at the missing position.",
      decodeLines: decodeMapLines(scenario.map),
      workingLines: (["@", "#", "%", "&"] as const).map((symbol) => candidateResultLine(scenario.relations, scenario.hiddenIndex, symbol, scenario.map, scenario.subject, scenario.reference)),
      resultLine: `Only ${scenario.answerSymbol} makes ${scenario.subject} ${DIRECTION_PHRASES[scenario.targetDirection]} of ${scenario.reference}.`,
      conclusion: `Therefore, ? should be replaced by ${scenario.answerSymbol}.`,
      diagram: buildCodedRelationDiagram(scenario.coordinates, scenario.relations, scenario.map, { queryPair: { subject: scenario.subject, reference: scenario.reference }, title: "Completed coded chain" }),
    },
    relationCount: scenario.relations.length,
  });
}

function movementWorkingLines(steps: readonly { readonly symbol: CodeSymbol; readonly distance: number }[], map: DirectionCodeMap): readonly string[] {
  return steps.map((step, index) => {
    const direction = map[step.symbol];
    const prefix = index === 0 ? "from O" : "from the current position";
    const transition = index === 0 ? "" : "Then ";
    return `${transition}${step.symbol} means ${DIRECTION_LABELS[direction]}, so move ${step.distance} metres ${DIRECTION_LABELS[direction]} ${prefix}.`;
  });
}

function buildMovementQuestion(qlId: string, seed: number): GeneratedCodedDirectionQuestion {
  const scenario = buildCodedMovementScenario(seed);
  const independent = solveCodedMovementIndependent(scenario.steps, scenario.map);
  if (independent.direction !== scenario.direction || independent.endpoint.x !== scenario.endpoint.x || independent.endpoint.y !== scenario.endpoint.y) {
    throw new Error(`Independent coded movement mismatch for seed ${seed}`);
  }
  const options = directionOptions(scenario.direction, seed);
  return baseQuestion({
    qlId,
    seed,
    stem: renderMovementStem(scenario.map, scenario.steps),
    structuredPrompt: {
      codeMap: scenario.map,
      steps: scenario.steps,
      points: scenario.points,
      endpoint: scenario.endpoint,
    },
    options,
    correctAnswer: { kind: "DIRECTION", direction: scenario.direction },
    explanation: {
      given: "Decode each movement symbol before following the sequence from point O.",
      decodeLines: decodeMapLines(scenario.map, true),
      workingLines: movementWorkingLines(scenario.steps, scenario.map),
      resultLine: `After combining the coded movements, the final position is ${vectorDescription(scenario.endpoint, { x: 0, y: 0 }, "metres")} of O.`,
      conclusion: `Therefore, the final position is ${DIRECTION_LABELS[scenario.direction]} of point O.`,
      diagram: buildCodedMovementDiagram(scenario.steps, scenario.points, scenario.map),
    },
    relationCount: scenario.steps.length,
  });
}

export function generateDirCp006Question(qlId: string, seed = 0): GeneratedCodedDirectionQuestion {
  if (!Number.isInteger(seed)) throw new Error(`DIR-CP-006 seed must be an integer, received ${seed}`);
  const ql = dirCp006Ql(qlId);
  switch (ql.answerDemand) {
    case "CODED_RELATION_DIRECTION": return buildDirectionQuestion(qlId, seed);
    case "CODED_ENTITY_LOOKUP": return buildEntityQuestion(qlId, seed);
    case "RECOVER_DIRECTION_CODE_MAP": return buildMapRecoveryQuestion(qlId, seed);
    case "EQUIVALENT_CODED_STATEMENT": return buildEquivalentQuestion(qlId, seed);
    case "VALID_CODED_CONCLUSION": return buildConclusionQuestion(qlId, seed);
    case "MISSING_CODE_OPERATOR": return buildMissingOperatorQuestion(qlId, seed);
    case "CODED_MOVEMENT_ENDPOINT": return buildMovementQuestion(qlId, seed);
  }
}
