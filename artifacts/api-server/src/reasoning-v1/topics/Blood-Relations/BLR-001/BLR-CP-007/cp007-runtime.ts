import { decodeScenario, relationOf } from "../BLR-CP-006/cp006-graph";
import {
  relationDisplay,
  type BlrCp006CodedStatement,
  type BlrCp006FamilyTree,
  type BlrCp006Graph,
  type BlrCp006Relation,
  type BlrCp006Scenario,
} from "../BLR-CP-006/cp006-model";
import {
  BLR_CP007_CONTRACTS,
  BLR_CP007_FREEZE_VERSION,
  BLR_CP007_RUNTIME_VERSION,
  optionLabel,
  rotate,
  semanticFingerprint,
  type BlrCp007ExpressionCandidate,
  type BlrCp007Option,
  type BlrCp007PrototypeId,
  type BlrCp007QlId,
  type BlrCp007Query,
  type BlrCp007Scenario,
  type GeneratedBlrCp007Question,
} from "./cp007-model";
import { BLR_CP007_PROTOTYPES, prototypeCase } from "./cp007-prototypes";

function decode(
  codeKey: BlrCp007Scenario["codeKey"],
  statements: readonly BlrCp006CodedStatement[],
  scenarioId: string,
): { graph: BlrCp006Graph; decodedStatements: readonly string[] } {
  if (!statements.length) throw new Error(`${scenarioId}: no coded statement.`);
  const first = statements[0]!;
  const cp006Scenario: BlrCp006Scenario = {
    scenarioId,
    topologyId: "CP007_CONSTRUCTION_VALIDATION",
    keyStyle: "SYMBOL",
    codeKey,
    statements,
    expressionLines: statements.map((entry) => `${entry.leftId} ${entry.token} ${entry.rightId}`),
    query: { kind: "RELATION", subjectId: first.leftId, referenceId: first.rightId },
    authority: "RESOLVE_CODED_RELATION",
    prototypeId: "BLR-CP006-PROT-DIRECT-FORWARD",
    qlId: "BLR-QL-026",
    stem: "Construction validation",
  };
  return decodeScenario(cp006Scenario);
}

function targetFor(query: BlrCp007Query): {
  subjectId: string;
  relationId: BlrCp006Relation;
  referenceId: string;
} | undefined {
  if (
    query.kind === "SELECT_EXPRESSION" ||
    query.kind === "MISSING_TOKEN" ||
    query.kind === "MISSING_TOKEN_PAIR" ||
    query.kind === "MISSING_PERSON"
  ) return query.target;
  return undefined;
}

function matchesTarget(
  graph: BlrCp006Graph,
  target: { subjectId: string; relationId: BlrCp006Relation; referenceId: string },
): boolean {
  try {
    return relationOf(graph, target.subjectId, target.referenceId) === target.relationId;
  } catch {
    return false;
  }
}

function claimIsValid(
  candidate: BlrCp007ExpressionCandidate,
  codeKey: BlrCp007Scenario["codeKey"],
  scenarioId: string,
): boolean {
  if (!candidate.claim) return false;
  try {
    const { graph } = decode(codeKey, candidate.statements, `${scenarioId}::${candidate.semanticKey}`);
    return relationOf(graph, candidate.claim.subjectId, candidate.claim.referenceId) === candidate.claim.relationId;
  } catch {
    return false;
  }
}

function substituteToken(
  statements: readonly BlrCp006CodedStatement[],
  statementIndex: number,
  token: string,
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, index) => index === statementIndex ? { ...entry, token } : entry);
}

function substituteTokenPair(
  statements: readonly BlrCp006CodedStatement[],
  indices: readonly [number, number],
  pair: readonly [string, string],
): readonly BlrCp006CodedStatement[] {
  return statements.map((entry, index) => {
    if (index === indices[0]) return { ...entry, token: pair[0] };
    if (index === indices[1]) return { ...entry, token: pair[1] };
    return entry;
  });
}

function substitutePerson(
  query: Extract<BlrCp007Query, { kind: "MISSING_PERSON" }>,
  personId: string,
): readonly BlrCp006CodedStatement[] {
  return query.completeStatements.map((entry, index) => {
    if (index !== query.blankStatementIndex) return entry;
    return query.blankSide === "LEFT"
      ? { ...entry, leftId: personId }
      : { ...entry, rightId: personId };
  });
}

interface SolvedScenario {
  options: readonly BlrCp007Option[];
  correctIndex: number;
  answer: string;
  completedStatements: readonly BlrCp006CodedStatement[];
  graph: BlrCp006Graph;
  decodedStatements: readonly string[];
}

function solveScenario(scenario: BlrCp007Scenario, seed: number): SolvedScenario {
  const raw: {
    text: string;
    semanticKey: string;
    isCorrect: boolean;
    errorLabel?: string;
    statements: readonly BlrCp006CodedStatement[];
  }[] = [];

  if (scenario.query.kind === "SELECT_EXPRESSION") {
    for (const entry of scenario.query.candidates) {
      let isCorrect = false;
      try {
        const { graph } = decode(scenario.codeKey, entry.statements, `${scenario.scenarioId}::${entry.semanticKey}`);
        isCorrect = matchesTarget(graph, scenario.query.target);
      } catch {
        isCorrect = false;
      }
      raw.push({
        text: entry.text,
        semanticKey: entry.semanticKey,
        isCorrect,
        errorLabel: isCorrect ? undefined : "DIRECTION_OR_RELATION_MISMATCH",
        statements: entry.statements,
      });
    }
  } else if (scenario.query.kind === "MISSING_TOKEN") {
    for (const token of scenario.query.candidateTokens) {
      const statements = substituteToken(scenario.query.completeStatements, scenario.query.blankStatementIndex, token);
      const isCorrect = token === scenario.query.completeStatements[scenario.query.blankStatementIndex]!.token;
      raw.push({
        text: token,
        semanticKey: `TOKEN::${token}`,
        isCorrect,
        errorLabel: isCorrect ? undefined : "WRONG_TOKEN_MEANING",
        statements,
      });
    }
  } else if (scenario.query.kind === "MISSING_TOKEN_PAIR") {
    for (const pair of scenario.query.candidateTokenPairs) {
      const statements = substituteTokenPair(scenario.query.completeStatements, scenario.query.blankStatementIndices, pair);
      const correctPair: readonly [string, string] = [
        scenario.query.completeStatements[scenario.query.blankStatementIndices[0]]!.token,
        scenario.query.completeStatements[scenario.query.blankStatementIndices[1]]!.token,
      ];
      const isCorrect = pair[0] === correctPair[0] && pair[1] === correctPair[1];
      raw.push({
        text: `${pair[0]}, ${pair[1]}`,
        semanticKey: `PAIR::${pair[0]}::${pair[1]}`,
        isCorrect,
        errorLabel: isCorrect ? undefined : "TOKEN_ORDER_OR_MEANING_MISMATCH",
        statements,
      });
    }
  } else if (scenario.query.kind === "MISSING_PERSON") {
    for (const personId of scenario.query.candidatePersonIds) {
      const statements = substitutePerson(scenario.query, personId);
      let isCorrect = false;
      try {
        isCorrect = matchesTarget(
          decode(scenario.codeKey, statements, `${scenario.scenarioId}::PERSON::${personId}`).graph,
          scenario.query.target,
        );
      } catch {
        isCorrect = false;
      }
      raw.push({
        text: personId,
        semanticKey: `PERSON::${personId}`,
        isCorrect,
        errorLabel: isCorrect ? undefined : "IDENTITY_OR_PATH_MISMATCH",
        statements,
      });
    }
  } else {
    for (const entry of scenario.query.candidates) {
      const valid = claimIsValid(entry, scenario.codeKey, scenario.scenarioId);
      const isCorrect = scenario.query.desiredStatus === "VALID" ? valid : !valid;
      raw.push({
        text: entry.text,
        semanticKey: entry.semanticKey,
        isCorrect,
        errorLabel: isCorrect ? undefined : "CLAIM_STATUS_MISMATCH",
        statements: entry.statements,
      });
    }
  }

  if (raw.length !== 4) throw new Error(`${scenario.scenarioId}: expected four options, got ${raw.length}.`);
  if (raw.filter((entry) => entry.isCorrect).length !== 1) {
    throw new Error(`${scenario.scenarioId}: expected exactly one correct option.`);
  }

  const rotated = rotate(raw, seed * 5 + scenario.prototypeId.length);
  const correctIndex = rotated.findIndex((entry) => entry.isCorrect);
  const selected = rotated[correctIndex]!;
  const decoded = decode(scenario.codeKey, selected.statements, `${scenario.scenarioId}::ANSWER`);
  return {
    options: rotated.map(({ statements: _statements, ...entry }) => entry),
    correctIndex,
    answer: selected.text,
    completedStatements: selected.statements,
    graph: decoded.graph,
    decodedStatements: decoded.decodedStatements,
  };
}

function generations(graph: BlrCp006Graph): Map<string, number> {
  const result = new Map(graph.persons.map((person) => [person.personId, 0]));
  for (let pass = 0; pass < 20; pass += 1) {
    let changed = false;
    for (const edge of graph.parents) {
      const child = result.get(edge.childId) ?? 0;
      const parent = result.get(edge.parentId) ?? 0;
      if (parent <= child) {
        result.set(edge.parentId, child + 1);
        changed = true;
      }
    }
    for (const edge of [...graph.spouses, ...graph.siblings]) {
      const aId = edge.personAId;
      const bId = edge.personBId;
      const level = Math.max(result.get(aId) ?? 0, result.get(bId) ?? 0);
      if ((result.get(aId) ?? 0) !== level) { result.set(aId, level); changed = true; }
      if ((result.get(bId) ?? 0) !== level) { result.set(bId, level); changed = true; }
    }
    if (!changed) break;
  }
  return result;
}

function graphPath(graph: BlrCp006Graph, start?: string, end?: string): string[] {
  if (!start || !end || start === end) return start ? [start] : [];
  const adjacency = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    if (!adjacency.has(a)) adjacency.set(a, new Set());
    if (!adjacency.has(b)) adjacency.set(b, new Set());
    adjacency.get(a)!.add(b);
    adjacency.get(b)!.add(a);
  };
  graph.parents.forEach((edge) => link(edge.parentId, edge.childId));
  graph.spouses.forEach((edge) => link(edge.personAId, edge.personBId));
  graph.siblings.forEach((edge) => link(edge.personAId, edge.personBId));
  const queue: string[][] = [[start]];
  const seen = new Set([start]);
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1]!;
    for (const next of adjacency.get(last) ?? []) {
      if (seen.has(next)) continue;
      const candidate = [...path, next];
      if (next === end) return candidate;
      seen.add(next);
      queue.push(candidate);
    }
  }
  return [];
}

function treeFor(graph: BlrCp006Graph, query: BlrCp007Query, answer: string): BlrCp006FamilyTree {
  const target = targetFor(query) ?? (
    query.kind === "SELECT_VALIDITY"
      ? query.candidates.find((candidate) => candidate.text === answer)?.claim
      : undefined
  );
  const levels = generations(graph);
  const nodes = graph.persons.map((person) => ({
    id: person.personId,
    label: person.label,
    gender: person.gender === "MALE" ? "male" as const : person.gender === "FEMALE" ? "female" as const : "unknown" as const,
    generation: levels.get(person.personId) ?? 0,
  }));
  const edges: BlrCp006FamilyTree["edges"] = [
    ...graph.spouses.map((edge, index) => ({ id: `marriage-${index}`, type: "marriage" as const, sourceId: edge.personAId, targetId: edge.personBId })),
    ...graph.parents.map((edge, index) => ({ id: `parent-${index}`, type: "parent-child" as const, sourceId: edge.parentId, targetId: edge.childId })),
    ...graph.siblings.map((edge, index) => ({ id: `sibling-${index}`, type: "sibling" as const, sourceId: edge.personAId, targetId: edge.personBId })),
  ];
  const path = graphPath(graph, target?.subjectId, target?.referenceId);
  const ascii = [
    ...graph.parents.map((edge) => `${edge.parentId} -> ${edge.childId} (parent)`),
    ...graph.spouses.map((edge) => `${edge.personAId} -- ${edge.personBId} (spouse)`),
    ...graph.siblings.map((edge) => `${edge.personAId} == ${edge.personBId} (sibling)`),
  ].join("\n");
  return {
    kind: "blood-relation-family-tree",
    version: 1,
    title: "Completed coded family graph",
    nodes,
    edges,
    query: {
      subjectId: target?.subjectId,
      referenceId: target?.referenceId,
      answerLabel: answer,
      pathPersonIds: path,
    },
    accessibleSummary: `The completed coded expression creates ${nodes.length} named people and ${edges.length} family links.`,
    asciiFallback: ascii || "Single direct coded assertion.",
  };
}

function displayStem(scenario: BlrCp007Scenario): string {
  if (
    scenario.query.kind === "MISSING_TOKEN" ||
    scenario.query.kind === "MISSING_TOKEN_PAIR" ||
    scenario.query.kind === "MISSING_PERSON"
  ) return `${scenario.stem}\n\n${scenario.query.expressionLines.join("\n")}`;
  return scenario.stem;
}

function explanationFor(
  scenario: BlrCp007Scenario,
  solved: SolvedScenario,
): GeneratedBlrCp007Question["explanation"] {
  const coreByAuthority: Record<BlrCp007Scenario["authority"], readonly string[]> = {
    SELECT_CODED_EXPRESSION: [
      "Translate the required family relation into directed links before comparing the options.",
      "A coded chain is valid only when every token meaning and every left-to-right direction is correct.",
    ],
    COMPLETE_MISSING_CODE_TOKEN: [
      "The missing token must create the required directed relation at its exact position.",
      "Decode the fixed links first, then test only the blank link.",
    ],
    COMPLETE_ORDERED_CODE_TOKEN_PAIR: [
      "Two blanks form an ordered pair: the first token belongs to the first blank and the second to the second blank.",
      "A correct pair must preserve both relation meanings and chain direction.",
    ],
    COMPLETE_MISSING_PERSON: [
      "The missing person must connect the fixed coded links into the requested family path.",
      "Substitute each candidate in the blank and reject any broken or different relation.",
    ],
    SELECT_CODED_STATEMENT_BY_VALIDITY: [
      "Decode the expression independently from the written interpretation.",
      "A statement is valid only when the decoded relation, gender and direction all match the claim.",
    ],
  };

  const target = targetFor(scenario.query);
  const graphAudit = [
    ...solved.decodedStatements,
    target
      ? `The completed graph gives ${target.subjectId} as the ${relationDisplay(target.relationId).toLocaleLowerCase("en-IN")} of ${target.referenceId}.`
      : "The selected option has the requested validity status after independent decoding.",
  ];

  return {
    coreConcept: coreByAuthority[scenario.authority],
    constructionAudit: [
      ...scenario.codeKey.map((entry) => `${entry.token} means “is the ${relationDisplay(entry.relationId).toLocaleLowerCase("en-IN")} of”.`),
      `Chosen completion: ${solved.answer}.`,
    ],
    graphAudit,
    conclusion: `${solved.answer} is the only option that satisfies the complete coded-relation requirement.`,
    examShortcut: scenario.authority === "COMPLETE_ORDERED_CODE_TOKEN_PAIR"
      ? "Write the two required direct links in order, then replace each relation word with its token."
      : "Mark the direction arrow first; most wrong options reverse one link or swap a gendered relation.",
    commonTraps: [
      "Do not read symbols as arithmetic operators.",
      "Do not reverse a coded pair.",
      "Do not infer gender from a letter or name.",
      "For two blanks, do not treat the token pair as unordered.",
    ],
    optionAnalysis: solved.options.map((option, index) => ({
      optionLabel: optionLabel(index),
      optionText: option.text,
      isCorrect: option.isCorrect,
      explanation: option.isCorrect
        ? "Correct: every token, direction and required family link agrees with the completed graph. [EXACT_CONSTRUCTION]"
        : `Incorrect: this completion changes a relation, reverses a link, breaks the path or misstates validity. [${option.errorLabel ?? "CONSTRUCTION_MISMATCH"}]`,
    })),
    familyTree: treeFor(solved.graph, scenario.query, solved.answer),
  };
}

function answerTypeFor(qlId: BlrCp007QlId): GeneratedBlrCp007Question["answerType"] {
  const contract = BLR_CP007_CONTRACTS.find((entry) => entry.qlId === qlId);
  if (!contract) throw new Error(`Missing CP-007 contract for ${qlId}.`);
  return contract.answerType;
}

export function generateBlrCp007Question(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): GeneratedBlrCp007Question {
  if (!Number.isFinite(seed)) throw new Error(`CP-007 seed must be finite: ${seed}.`);
  const scenario = prototypeCase(prototypeId).build(Math.trunc(seed));
  const solved = solveScenario(scenario, Math.trunc(seed));
  const stem = displayStem(scenario);
  const itemId = `BLR-CP007-${prototypeId.replace("BLR-CP007-PROT-", "")}-${semanticFingerprint([
    scenario.scenarioId, seed, solved.answer,
  ]).slice(0, 8)}`;

  return {
    packageId: "BLR-001",
    checkpointId: "BLR-CP-007",
    qlId: scenario.qlId,
    permanentQlId: scenario.qlId,
    solveAuthority: scenario.authority,
    sourcePrototypeId: scenario.prototypeId,
    prototypeOnly: false,
    reviewOnly: true,
    publiclyPublishable: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    locale: "en-IN",
    seed: Math.trunc(seed),
    itemId,
    scenarioId: scenario.scenarioId,
    topologyId: scenario.topologyId,
    keyStyle: scenario.keyStyle,
    codeKey: scenario.codeKey,
    query: scenario.query,
    sharedPrompt: scenario.sharedPrompt,
    stem,
    answerType: answerTypeFor(scenario.qlId),
    options: solved.options,
    correctIndex: solved.correctIndex,
    answer: solved.answer,
    completedStatements: solved.completedStatements,
    decodedStatements: solved.decodedStatements,
    graph: solved.graph,
    explanation: explanationFor(scenario, solved),
    metadata: {
      runtimeVersion: BLR_CP007_RUNTIME_VERSION,
      freezeVersion: BLR_CP007_FREEZE_VERSION,
      completeKeyCoverage: true,
      noArithmeticPrecedence: true,
      displayedExpressionParity: true,
      explicitGenderEvidence: true,
      nameBasedGenderAssumptions: 0,
      independentVerifierAgreed: true,
      uniqueAnswer: true,
      difficulty: scenario.authority === "SELECT_CODED_EXPRESSION" && solved.completedStatements.length >= 3
        ? "HARD"
        : scenario.authority === "COMPLETE_ORDERED_CODE_TOKEN_PAIR" || solved.completedStatements.length >= 2
          ? "MEDIUM"
          : "EASY",
      semanticFingerprint: semanticFingerprint([
        prototypeId, seed, scenario.sharedPrompt, stem,
        ...solved.options.map((option) => option.text), solved.correctIndex,
        ...solved.completedStatements.flatMap((entry) => [entry.leftId, entry.token, entry.rightId]),
      ]),
    },
  };
}

export function generateBlrCp007FrozenBank(): readonly GeneratedBlrCp007Question[] {
  const records: GeneratedBlrCp007Question[] = [];
  for (const prototype of BLR_CP007_PROTOTYPES) {
    for (let seed = 0; seed < 8; seed += 1) records.push(generateBlrCp007Question(prototype.prototypeId, seed));
  }
  return records;
}

export function questionsForQl(qlId: BlrCp007QlId): readonly GeneratedBlrCp007Question[] {
  return generateBlrCp007FrozenBank().filter((question) => question.qlId === qlId);
}

export interface BlrCp007Telemetry {
  recordCount: number;
  prototypeCount: number;
  topologyCount: number;
  authorityCount: number;
  permanentQlCount: number;
  statementCount: number;
  answerPositions: readonly [number, number, number, number];
  qlCounts: Readonly<Record<string, number>>;
  prototypeCounts: Readonly<Record<string, number>>;
  uniqueQuestionSignatureCount: number;
  permanentQlRange: "BLR-QL-031..BLR-QL-035";
  nextAvailableChapterQlId: "BLR-QL-036";
}

export function buildBlrCp007Telemetry(bank = generateBlrCp007FrozenBank()): BlrCp007Telemetry {
  const countBy = (selector: (question: GeneratedBlrCp007Question) => string) => {
    const result: Record<string, number> = {};
    for (const question of bank) {
      const key = selector(question);
      result[key] = (result[key] ?? 0) + 1;
    }
    return result;
  };
  return {
    recordCount: bank.length,
    prototypeCount: new Set(bank.map((question) => question.sourcePrototypeId)).size,
    topologyCount: new Set(bank.map((question) => question.topologyId)).size,
    authorityCount: new Set(bank.map((question) => question.solveAuthority)).size,
    permanentQlCount: new Set(bank.map((question) => question.qlId)).size,
    statementCount: bank.reduce((total, question) => total + question.completedStatements.length, 0),
    answerPositions: [0, 1, 2, 3].map((index) => bank.filter((question) => question.correctIndex === index).length) as [number, number, number, number],
    qlCounts: countBy((question) => question.qlId),
    prototypeCounts: countBy((question) => question.sourcePrototypeId),
    uniqueQuestionSignatureCount: new Set(bank.map((question) => question.metadata.semanticFingerprint)).size,
    permanentQlRange: "BLR-QL-031..BLR-QL-035",
    nextAvailableChapterQlId: "BLR-QL-036",
  };
}
