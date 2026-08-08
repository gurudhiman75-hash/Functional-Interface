import { evaluateConclusion } from "../foundation/conclusion-evaluator";
import { SeededRandom, stableHash } from "../foundation/prng";
import {
  createComparisonConstraint,
  reverseRelation,
} from "../foundation/relations";
import type {
  ComparisonConstraint,
  ComparisonRelation,
  ConclusionTruth,
} from "../foundation/types";
import { getIneCp006PrototypeContract } from "./contracts";
import {
  buildIneCp006CodeMap,
  renderCodeKey,
  renderCodedConstraint,
  renderCodedExpressions,
} from "./coded-renderer";
import type {
  IneCp006ConclusionMask,
  IneCp006PrototypeId,
  IneCp006Scenario,
} from "./types";
import {
  conclusionMasksForCount,
  truthPatternForConclusionMask,
} from "./conclusion-masks";

const LETTERS = ["A", "B", "C", "D", "P", "Q", "R"] as const;
const RELATIONS: readonly ComparisonRelation[] = [
  "GREATER_THAN",
  "LESS_THAN",
  "EQUAL_TO",
  "GREATER_THAN_OR_EQUAL",
  "LESS_THAN_OR_EQUAL",
];

// Direct one-edge graphs are retained for guided learning only. Exam-practice
// questions rotate through the remaining multi-statement graph families.
const EXAM_BASE_SEEDS = [5, 8, 9, 10, 11, 12, 13, 14, 15] as const;
const EVALUATION_BASE_SEEDS = [5, 8, 9, 11, 12, 13, 14, 15] as const;

function c(
  leftId: string,
  relation: ComparisonRelation,
  rightId: string,
  sourceStatementId: string,
): ComparisonConstraint {
  return createComparisonConstraint(
    leftId,
    relation,
    rightId,
    sourceStatementId,
  );
}

interface BaseGraph {
  baseId: string;
  topologyId: string;
  statements: readonly ComparisonConstraint[];
  query: { leftId: string; rightId: string };
}

function baseGraphFor(seed: number): BaseGraph {
  const bases: readonly BaseGraph[] = [
    {
      baseId: "DIRECT_STRICT",
      topologyId: "DIRECT_STRICT",
      statements: [c("E1", "GREATER_THAN", "E2", "S1")],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "DIRECT_INCLUSIVE",
      topologyId: "DIRECT_INCLUSIVE",
      statements: [c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1")],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "STRICT_CHAIN",
      topologyId: "TWO_EDGE_STRICT_CHAIN",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
    {
      baseId: "MIXED_CHAIN",
      topologyId: "INCLUSIVE_STRICT_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
    {
      baseId: "EQUALITY_BRIDGE",
      topologyId: "EQUALITY_BRIDGE",
      statements: [
        c("E1", "EQUAL_TO", "E2", "S1"),
        c("E2", "LESS_THAN_OR_EQUAL", "E3", "S2"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
    {
      baseId: "WEAK_CHAIN",
      topologyId: "THREE_EDGE_WEAK_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "GREATER_THAN_OR_EQUAL", "E4", "S3"),
      ],
      query: { leftId: "E1", rightId: "E4" },
    },
    {
      baseId: "SHARED_UPPER",
      topologyId: "SHARED_UPPER_FREE_ENDPOINTS",
      statements: [
        c("E3", "GREATER_THAN", "E1", "S1"),
        c("E3", "GREATER_THAN", "E2", "S2"),
      ],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "DISCONNECTED",
      topologyId: "DISCONNECTED_COMPONENTS",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E3", "LESS_THAN", "E4", "S2"),
      ],
      query: { leftId: "E2", rightId: "E3" },
    },
    {
      baseId: "LONG_STRICT",
      topologyId: "FOUR_EDGE_MIXED_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "GREATER_THAN", "E4", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
      ],
      query: { leftId: "E1", rightId: "E5" },
    },
    {
      baseId: "LONG_WEAK",
      topologyId: "FOUR_EDGE_WEAK_CHAIN",
      statements: [
        c("E1", "LESS_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "EQUAL_TO", "E3", "S2"),
        c("E3", "LESS_THAN_OR_EQUAL", "E4", "S3"),
        c("E4", "EQUAL_TO", "E5", "S4"),
      ],
      query: { leftId: "E1", rightId: "E5" },
    },
    {
      baseId: "CONVERGING",
      topologyId: "CONVERGING_BRANCH",
      statements: [
        c("E1", "GREATER_THAN", "E3", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "GREATER_THAN", "E1", "S3"),
      ],
      query: { leftId: "E1", rightId: "E2" },
    },
    {
      baseId: "CHAIN_WITH_SIDE",
      topologyId: "CHAIN_WITH_IRRELEVANT_EDGE",
      statements: [
        c("E1", "GREATER_THAN", "E2", "S1"),
        c("E2", "GREATER_THAN_OR_EQUAL", "E3", "S2"),
        c("E4", "EQUAL_TO", "E5", "S3"),
      ],
      query: { leftId: "E1", rightId: "E3" },
    },
    {
      baseId: "FIVE_EDGE_MIXED",
      topologyId: "FIVE_EDGE_MIXED_CHAIN",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
        c("E3", "EQUAL_TO", "E4", "S3"),
        c("E4", "GREATER_THAN_OR_EQUAL", "E5", "S4"),
        c("E5", "GREATER_THAN", "E6", "S5"),
      ],
      query: { leftId: "E1", rightId: "E6" },
    },
    {
      baseId: "SIX_EDGE_MIXED",
      topologyId: "SIX_EDGE_MIXED_CHAIN",
      statements: [
        c("E1", "LESS_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "LESS_THAN", "E3", "S2"),
        c("E3", "LESS_THAN_OR_EQUAL", "E4", "S3"),
        c("E4", "EQUAL_TO", "E5", "S4"),
        c("E5", "LESS_THAN", "E6", "S5"),
        c("E6", "LESS_THAN_OR_EQUAL", "E7", "S6"),
      ],
      query: { leftId: "E1", rightId: "E7" },
    },
    {
      baseId: "TWO_CHAINS_WITH_CROSS_LINK",
      topologyId: "TWO_CHAINS_WITH_NECESSARY_CROSS_LINK",
      statements: [
        c("E1", "GREATER_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "GREATER_THAN", "E3", "S2"),
        c("E4", "EQUAL_TO", "E5", "S3"),
        c("E5", "GREATER_THAN_OR_EQUAL", "E6", "S4"),
        c("E3", "GREATER_THAN", "E4", "S5"),
      ],
      query: { leftId: "E1", rightId: "E6" },
    },
    {
      baseId: "TWO_LONG_CHAINS_WITH_CROSS_LINK",
      topologyId: "TWO_LONG_CHAINS_WITH_NECESSARY_CROSS_LINK",
      statements: [
        c("E1", "LESS_THAN_OR_EQUAL", "E2", "S1"),
        c("E2", "LESS_THAN", "E3", "S2"),
        c("E3", "EQUAL_TO", "E4", "S3"),
        c("E5", "LESS_THAN_OR_EQUAL", "E6", "S4"),
        c("E6", "LESS_THAN", "E7", "S5"),
        c("E4", "LESS_THAN_OR_EQUAL", "E5", "S6"),
      ],
      query: { leftId: "E1", rightId: "E7" },
    },
  ];
  return bases[((seed % bases.length) + bases.length) % bases.length]!;
}

function reverseConstraint(entry: ComparisonConstraint): ComparisonConstraint {
  return {
    leftId: entry.rightId,
    relation: reverseRelation(entry.relation),
    rightId: entry.leftId,
    sourceStatementId: entry.sourceStatementId,
  };
}

function reverseGraph(
  statements: readonly ComparisonConstraint[],
): ComparisonConstraint[] {
  return [...statements].reverse().map(reverseConstraint);
}

function canonicalKey(conclusion: ComparisonConstraint): string {
  const reversed =
    conclusion.relation === "LESS_THAN" ||
    conclusion.relation === "LESS_THAN_OR_EQUAL";
  const left = reversed ? conclusion.rightId : conclusion.leftId;
  const right = reversed ? conclusion.leftId : conclusion.rightId;
  const relation =
    conclusion.relation === "LESS_THAN"
      ? "GREATER_THAN"
      : conclusion.relation === "LESS_THAN_OR_EQUAL"
        ? "GREATER_THAN_OR_EQUAL"
        : conclusion.relation;
  return `${left}:${relation}:${right}`;
}

function pairKey(conclusion: ComparisonConstraint): string {
  return [conclusion.leftId, conclusion.rightId].sort().join(":");
}

function conclusionPool(statements: readonly ComparisonConstraint[]) {
  const entities = [
    ...new Set(statements.flatMap((entry) => [entry.leftId, entry.rightId])),
  ].sort();
  const seen = new Set<string>();
  const pool: Array<{
    conclusion: ComparisonConstraint;
    truth: ConclusionTruth;
    directPair: boolean;
    domainSize: number;
  }> = [];
  const directPairs = new Set(statements.map(pairKey));
  for (let i = 0; i < entities.length; i += 1) {
    for (let j = i + 1; j < entities.length; j += 1) {
      for (const relation of RELATIONS) {
        const conclusion = c(entities[i]!, relation, entities[j]!, "C-POOL");
        const key = canonicalKey(conclusion);
        if (seen.has(key)) continue;
        seen.add(key);
        const evaluation = evaluateConclusion(statements, conclusion);
        pool.push({
          conclusion,
          truth: evaluation.truth,
          directPair: directPairs.has(pairKey(conclusion)),
          domainSize: evaluation.pairEvidence.possibleAtomicRelations.length,
        });
      }
    }
  }
  return pool;
}

function selectConclusions(
  statements: readonly ComparisonConstraint[],
  truthPattern: readonly boolean[],
  random: SeededRandom,
): readonly ComparisonConstraint[] {
  const pool = conclusionPool(statements);
  const selected: Array<{
    conclusion: ComparisonConstraint;
    truth: ConclusionTruth;
    directPair: boolean;
    domainSize: number;
  }> = [];
  for (const mustFollow of truthPattern) {
    const usedKeys = new Set(
      selected.map((entry) => canonicalKey(entry.conclusion)),
    );
    const usedPairs = new Set(
      selected.map((entry) => pairKey(entry.conclusion)),
    );
    const matches = pool.filter(
      (entry) =>
        (entry.truth === "DEFINITELY_TRUE") === mustFollow &&
        !usedKeys.has(canonicalKey(entry.conclusion)),
    );
    const available = matches.filter(
      (entry) => !usedPairs.has(pairKey(entry.conclusion)),
    );
    const inferred = available.filter((entry) => !entry.directPair);
    const closeFalseChoices = inferred.filter(
      (entry) => mustFollow || entry.domainSize < 3,
    );
    const candidates =
      closeFalseChoices.length > 0
        ? closeFalseChoices
        : inferred.length > 0
          ? inferred
          : available;
    if (candidates.length === 0)
      throw new Error(
        `No conclusion available for truth pattern ${truthPattern.join("/")}.`,
      );
    selected.push(random.pick(candidates));
  }
  return selected.map((entry, index) => ({
    ...entry.conclusion,
    sourceStatementId: `C${index + 1}`,
  }));
}

function namesFor(
  entityIds: readonly string[],
  random: SeededRandom,
): Readonly<Record<string, string>> {
  const names = random.shuffle(LETTERS).slice(0, entityIds.length);
  return Object.fromEntries(
    entityIds.map((id, index) => [id, names[index]!]),
  ) as Readonly<Record<string, string>>;
}

export function buildIneCp006Scenario(
  prototypeId: IneCp006PrototypeId,
  seed: number,
): IneCp006Scenario {
  const contract = getIneCp006PrototypeContract(prototypeId);
  const random = new SeededRandom(
    seed ^ Number.parseInt(stableHash([prototypeId, "cp006-scenario-v1"]), 16),
  );
  const codeMap = buildIneCp006CodeMap(seed, contract.symbolProfile);
  const examBaseSeeds =
    contract.taskKind === "EVALUATE_CONCLUSIONS"
      ? EVALUATION_BASE_SEEDS
      : EXAM_BASE_SEEDS;
  const baseSeed =
    contract.deliveryProfile === "EXAM_PRACTICE_PROTOTYPE"
      ? examBaseSeeds[
          ((seed % examBaseSeeds.length) + examBaseSeeds.length) %
            examBaseSeeds.length
        ]!
      : seed;
  let base = baseGraphFor(baseSeed);
  if (
    contract.taskKind === "EVALUATE_CONCLUSIONS" &&
    base.statements.length < 2
  )
    base = baseGraphFor(seed + 2);

  let statements = [...base.statements];
  let query: IneCp006Scenario["query"] = base.query;
  let conclusions: readonly ComparisonConstraint[] = [];
  let expectedMask: IneCp006ConclusionMask | undefined;
  let ordinaryRelation: ComparisonConstraint | undefined;

  if (
    contract.taskKind === "DECODE_RELATION" ||
    contract.taskKind === "ENCODE_RELATION"
  ) {
    const relation =
      RELATIONS[
        ((seed % RELATIONS.length) + RELATIONS.length) % RELATIONS.length
      ]!;
    statements = [c("E1", relation, "E2", "S1")];
    query = { leftId: "E1", rightId: "E2" };
    if (contract.taskKind === "ENCODE_RELATION")
      ordinaryRelation = statements[0];
  }

  if (random.int(2) === 1) {
    statements = reverseGraph(statements);
    if (query) query = { leftId: query.rightId, rightId: query.leftId };
    if (ordinaryRelation) ordinaryRelation = statements[0];
  }

  if (contract.taskKind === "EVALUATE_CONCLUSIONS") {
    const conclusionCount: 2 | 3 = statements.length >= 5 ? 3 : 2;
    const masks = conclusionMasksForCount(conclusionCount);
    expectedMask =
      masks[((seed % masks.length) + masks.length) % masks.length]!;
    conclusions = selectConclusions(
      statements,
      truthPatternForConclusionMask(expectedMask, conclusionCount),
      random,
    );
    query = undefined;
  } else if (
    contract.taskKind === "SOLVE_RELATION" &&
    query &&
    random.int(2) === 1
  ) {
    query = { leftId: query.rightId, rightId: query.leftId };
  }

  const entityIds = [
    ...new Set([
      ...statements.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...conclusions.flatMap((entry) => [entry.leftId, entry.rightId]),
      ...(query ? [query.leftId, query.rightId] : []),
    ]),
  ].sort();
  const entityNames = namesFor(entityIds, random);
  const displayedCodedStatements =
    contract.taskKind === "ENCODE_RELATION"
      ? []
      : [renderCodedExpressions(statements, codeMap, entityNames).join("; ")];
  const displayedCodedConclusions = conclusions.map((entry) =>
    renderCodedConstraint(entry, codeMap, entityNames),
  );

  return {
    scenarioId: `${base.baseId}_${contract.taskKind}_${codeMap.mapId}`,
    topologyId:
      contract.taskKind === "DECODE_RELATION" ||
      contract.taskKind === "ENCODE_RELATION"
        ? `DIRECT_${statements[0]!.relation}`
        : base.topologyId,
    taskKind: contract.taskKind,
    codeMap,
    keyEntries: renderCodeKey(codeMap),
    statements,
    displayedCodedStatements,
    query,
    conclusions,
    displayedCodedConclusions,
    ordinaryRelation,
    expectedMask,
    entityNames,
  };
}
