import {
  decodeScenario,
  genderOf,
} from "./BLR-CP-006/cp006-graph";
import {
  relationDisplay,
  semanticFingerprint,
  type BlrCp006CodeDefinition,
  type BlrCp006DirectRelation,
  type BlrCp006Scenario,
} from "./BLR-CP-006/cp006-model";
import {
  validateReasoningNoveltyCandidateV1,
  type ReasoningNoveltyAxisV1,
} from "../../../shared/reasoning-novelty-governance-v1";

export const BLR_001_CONTROLLED_NOVELTY_DISCOVERY_V1 =
  "BLR_001_CONTROLLED_NOVELTY_DISCOVERY_V1" as const;

const TOKENS = ["@", "#", "%", "&"] as const;
const NAMES = [
  "Aman", "Beena", "Charan", "Deepa", "Farhan", "Gita", "Harish", "Isha",
  "Karan", "Leena", "Mohan", "Neha", "Om", "Pooja", "Ravi", "Simran",
] as const;

const PATTERNS = [
  ["SON", "DAUGHTER", "SON", "DAUGHTER", "DAUGHTER"],
  ["DAUGHTER", "SON", "DAUGHTER", "SON", "SON"],
  ["SON", "DAUGHTER", "DAUGHTER", "DAUGHTER", "SON"],
] as const satisfies readonly (readonly BlrCp006DirectRelation[])[];

function rotated<T>(values: readonly T[], offset: number): T[] {
  if (!values.length) return [];
  const n = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(n), ...values.slice(0, n)];
}

function personNames(seed: number): readonly [string, string, string, string, string, string] {
  const start = Math.abs(seed * 3) % NAMES.length;
  const selected = Array.from({ length: 6 }, (_, index) => NAMES[(start + index * 5) % NAMES.length]!);
  if (new Set(selected).size !== selected.length) {
    throw new Error("BLR controlled-novel name selection must produce six distinct names.");
  }
  return selected as unknown as readonly [string, string, string, string, string, string];
}

function tokenFor(
  codeKey: readonly BlrCp006CodeDefinition[],
  relationId: BlrCp006DirectRelation,
): string {
  const entry = codeKey.find((candidate) => candidate.relationId === relationId);
  if (!entry) throw new Error("Missing coded token for " + relationId + ".");
  return entry.token;
}

function countFemaleGrandchildren(
  graph: ReturnType<typeof decodeScenario>["graph"],
  referenceId: string,
): number {
  const children = graph.parents
    .filter((edge) => edge.parentId === referenceId)
    .map((edge) => edge.childId);
  const grandchildren = graph.parents
    .filter((edge) => children.includes(edge.parentId))
    .map((edge) => edge.childId);
  return [...new Set(grandchildren)].filter(
    (personId) => genderOf(graph, personId) === "FEMALE",
  ).length;
}

export interface BlrControlledNovelCodedCountCandidateV1 {
  readonly candidateId: string;
  readonly provenance: "CONTROLLED_NOVEL";
  readonly noveltyAxes: readonly ReasoningNoveltyAxisV1[];
  readonly parentQlIds: readonly ["BLR-QL-013", "BLR-QL-026"];
  readonly seed: number;
  readonly sharedPrompt: string;
  readonly stem: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly semanticFingerprint: string;
  readonly solverAgreement: true;
  readonly permanentQlAllocated: false;
  readonly nextAvailableQl: "BLR-QL-036";
  readonly questionStudioNoveltyMixActivated: false;
  readonly humanReviewRequired: true;
  readonly falsePyqAttribution: false;
  readonly decodedStatements: readonly string[];
  readonly femaleGrandchildIds: readonly string[];
}

export function generateBlrControlledNovelCodedCountCandidateV1(
  seed: number,
): BlrControlledNovelCodedCountCandidateV1 {
  if (!Number.isSafeInteger(seed)) {
    throw new Error("BLR controlled-novel seed must be a safe integer.");
  }

  const [reference, childA, childB, grandA, grandB, grandC] = personNames(seed);
  const pattern = PATTERNS[Math.abs(seed) % PATTERNS.length]!;
  const tokenOrder = rotated(TOKENS, Math.floor(Math.abs(seed) / PATTERNS.length) % TOKENS.length);
  const relationOrder = rotated(
    ["SON", "DAUGHTER", "FATHER", "MOTHER"] as const,
    Math.floor(Math.abs(seed) / (PATTERNS.length * TOKENS.length)) % 4,
  );
  const codeKey: readonly BlrCp006CodeDefinition[] = tokenOrder.map((token, index) => ({
    token,
    relationId: relationOrder[index]!,
  }));

  const [childARel, childBRel, grandARel, grandBRel, grandCRel] = pattern;
  const scenario: BlrCp006Scenario = {
    scenarioId: "BLR-NOVEL-CODED-COUNT-" + seed,
    topologyId: "CODED_TWO_GENERATION_FILTERED_COUNT",
    keyStyle: "SYMBOL",
    codeKey,
    statements: [
      { leftId: childA, token: tokenFor(codeKey, childARel), rightId: reference },
      { leftId: childB, token: tokenFor(codeKey, childBRel), rightId: reference },
      { leftId: grandA, token: tokenFor(codeKey, grandARel), rightId: childA },
      { leftId: grandB, token: tokenFor(codeKey, grandBRel), rightId: childA },
      { leftId: grandC, token: tokenFor(codeKey, grandCRel), rightId: childB },
    ],
    expressionLines: [],
    query: {
      kind: "GENDER",
      personId: grandA,
    },
    authority: "DETERMINE_GENDER_FROM_CODED_GRAPH",
    prototypeId: "BLR-CP006-PROT-GENDER-DERIVED",
    qlId: "BLR-QL-028",
    stem: "",
  };

  const decoded = decodeScenario(scenario);
  const solverCount = countFemaleGrandchildren(decoded.graph, reference);
  const expectedCount = [grandA, grandB, grandC].filter(
    (personId) => genderOf(decoded.graph, personId) === "FEMALE",
  ).length;
  if (solverCount !== expectedCount || solverCount < 1 || solverCount > 3) {
    throw new Error(
      "BLR controlled-novel coded-count solvers disagree or produced an unsupported count.",
    );
  }

  const options = ["1", "2", "3", "4"] as const;
  const correctIndex = options.indexOf(String(solverCount) as "1" | "2" | "3" | "4");
  if (correctIndex < 0) {
    throw new Error("BLR controlled-novel answer must be present exactly once in the options.");
  }

  const keyText = codeKey
    .map((entry) => `${entry.token} means “is the ${relationDisplay(entry.relationId).toLocaleLowerCase("en-IN")} of”`)
    .join("; ");
  const codedText = scenario.statements
    .map((statement) => `${statement.leftId} ${statement.token} ${statement.rightId}`)
    .join(", ");

  const sharedPrompt =
    "Use the following code key: " + keyText + ". The coded statements are: " + codedText + ".";
  const stem =
    `How many granddaughters does ${reference} have according to these coded relations?`;

  const noveltyAxes = [
    "MULTI_STAGE_COMPOSITION",
    "VALID_CROSS_FAMILY_COMPOSITION",
    "INFORMATION_DISTRIBUTION",
    "QUERY_DIRECTION",
  ] as const satisfies readonly ReasoningNoveltyAxisV1[];

  validateReasoningNoveltyCandidateV1({
    candidateId: "BLR-NOVEL-CODED-COUNT-" + seed,
    chapterId: "BLR-001",
    qlId: "BLR-QL-013+BLR-QL-026",
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    solverVerified: true,
    uniqueCorrectAnswer: true,
    plausibleDistractors: true,
    examNatural: true,
    falseHistoricalAttribution: false,
    humanReviewRequired: true,
  });

  const femaleGrandchildIds = [grandA, grandB, grandC].filter(
    (personId) => genderOf(decoded.graph, personId) === "FEMALE",
  );

  return {
    candidateId: "BLR-NOVEL-CODED-COUNT-" + seed,
    provenance: "CONTROLLED_NOVEL",
    noveltyAxes,
    parentQlIds: ["BLR-QL-013", "BLR-QL-026"],
    seed,
    sharedPrompt,
    stem,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    semanticFingerprint: semanticFingerprint([
      BLR_001_CONTROLLED_NOVELTY_DISCOVERY_V1,
      ...codeKey.flatMap((entry) => [entry.token, entry.relationId]),
      ...scenario.statements.flatMap((entry) => [entry.leftId, entry.token, entry.rightId]),
      reference,
      solverCount,
    ]),
    solverAgreement: true,
    permanentQlAllocated: false,
    nextAvailableQl: "BLR-QL-036",
    questionStudioNoveltyMixActivated: false,
    humanReviewRequired: true,
    falsePyqAttribution: false,
    decodedStatements: decoded.decodedStatements,
    femaleGrandchildIds,
  };
}
