import assert from "node:assert/strict";
import {
  ANA_CP008_ENGLISH_PROTOTYPES,
  renderDirectEnglishPrototype,
  renderOddPairEnglishPrototype,
  type ProvisionalEnglishPrototypeId,
} from "./provisional-language-templates.en";
import {
  renderLocalizedDirectPrototype,
  renderLocalizedOddPairPrototype,
  type ProvisionalMixedLocale,
} from "./provisional-language-templates.localized";

export type ProposedCp008SolveContract =
  | "POSITION_SUM_TO_SCALAR"
  | "POSITION_PRODUCT_TO_SCALAR"
  | "POSITION_SUM_TO_DERIVED_LETTER"
  | "SINGLE_LETTER_POSITION_SQUARE"
  | "INDEPENDENT_LETTER_NUMBER_DELTA"
  | "SHARED_CLUSTER_NUMBER_DELTA"
  | "INDEPENDENT_CLUSTER_VECTOR_DELTA"
  | "EXACT_MULTIPLIER_WITH_LETTER_VECTOR"
  | "DIRECT_CUBE_WITH_LETTER_VECTOR"
  | "PERFECT_SQUARE_BASE_TO_CUBE"
  | "CUBE_ROOT_OF_SUCCESSOR_WITH_VECTOR"
  | "SQUARE_ROOT_OF_SUCCESSOR_WITH_VECTOR"
  | "DIGIT_SUM_SQUARE_SUCCESSOR";

export type ProposedCp008Task = "DIRECT_COMPLETION" | "ODD_PAIR_SELECTION";

export interface ProposedCp008TemplateAllocation {
  prototypeId: ProvisionalEnglishPrototypeId;
  solveContract: ProposedCp008SolveContract;
  qlTemplateKey: string;
  tokenOrder: "NOT_APPLICABLE" | "CLUSTER_FIRST" | "NUMBER_FIRST";
  sourceStatus: "ADMITTED";
  tasks: readonly ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"];
}

export const ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS: readonly ProposedCp008TemplateAllocation[] = [
  { prototypeId: "PROTO_POSITION_SUM_TO_NUMBER", solveContract: "POSITION_SUM_TO_SCALAR", qlTemplateKey: "POSITION_SUM_TO_NUMBER", tokenOrder: "NOT_APPLICABLE", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_POSITION_PRODUCT_TO_NUMBER", solveContract: "POSITION_PRODUCT_TO_SCALAR", qlTemplateKey: "POSITION_PRODUCT_TO_NUMBER", tokenOrder: "NOT_APPLICABLE", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_POSITION_SUM_TO_LETTER", solveContract: "POSITION_SUM_TO_DERIVED_LETTER", qlTemplateKey: "POSITION_SUM_TO_LETTER", tokenOrder: "NOT_APPLICABLE", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_SINGLE_LETTER_POSITION_SQUARE", solveContract: "SINGLE_LETTER_POSITION_SQUARE", qlTemplateKey: "SINGLE_LETTER_POSITION_SQUARE", tokenOrder: "NOT_APPLICABLE", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_INDEPENDENT_LETTER_NUMBER_DELTA", solveContract: "INDEPENDENT_LETTER_NUMBER_DELTA", qlTemplateKey: "INDEPENDENT_LETTER_NUMBER_DELTA", tokenOrder: "NOT_APPLICABLE", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_SHARED_CLUSTER_NUMBER_DELTA", solveContract: "SHARED_CLUSTER_NUMBER_DELTA", qlTemplateKey: "SHARED_CLUSTER_NUMBER_DELTA", tokenOrder: "CLUSTER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_INDEPENDENT_CLUSTER_VECTOR_DELTA", solveContract: "INDEPENDENT_CLUSTER_VECTOR_DELTA", qlTemplateKey: "INDEPENDENT_CLUSTER_VECTOR_DELTA", tokenOrder: "CLUSTER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_EXACT_MULTIPLIER_CLUSTER_FIRST", solveContract: "EXACT_MULTIPLIER_WITH_LETTER_VECTOR", qlTemplateKey: "EXACT_MULTIPLIER_CLUSTER_FIRST", tokenOrder: "CLUSTER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_EXACT_MULTIPLIER_NUMBER_FIRST", solveContract: "EXACT_MULTIPLIER_WITH_LETTER_VECTOR", qlTemplateKey: "EXACT_MULTIPLIER_NUMBER_FIRST", tokenOrder: "NUMBER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_DIRECT_CUBE_CLUSTER_FIRST", solveContract: "DIRECT_CUBE_WITH_LETTER_VECTOR", qlTemplateKey: "DIRECT_CUBE_CLUSTER_FIRST", tokenOrder: "CLUSTER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_SQUARE_TO_CUBE_CLUSTER_FIRST", solveContract: "PERFECT_SQUARE_BASE_TO_CUBE", qlTemplateKey: "SQUARE_TO_CUBE_CLUSTER_FIRST", tokenOrder: "CLUSTER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST", solveContract: "CUBE_ROOT_OF_SUCCESSOR_WITH_VECTOR", qlTemplateKey: "CUBE_ROOT_SUCCESSOR_CLUSTER_FIRST", tokenOrder: "CLUSTER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST", solveContract: "SQUARE_ROOT_OF_SUCCESSOR_WITH_VECTOR", qlTemplateKey: "SQUARE_ROOT_SUCCESSOR_NUMBER_FIRST", tokenOrder: "NUMBER_FIRST", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
  { prototypeId: "PROTO_DIGIT_SUM_SQUARE_SUCCESSOR", solveContract: "DIGIT_SUM_SQUARE_SUCCESSOR", qlTemplateKey: "DIGIT_SUM_SQUARE_SUCCESSOR", tokenOrder: "NOT_APPLICABLE", sourceStatus: "ADMITTED", tasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"] },
];

const locales = ["hi-IN", "pa-IN"] as const satisfies readonly ProvisionalMixedLocale[];
const codingGrammar = /\b(?:coded as|code for|encode|decode|coding language|symbol substitution)\b/i;
const internalText = /ANA-QL|ANA-CP|PROTO_|MIXED_|permanentQlId|publiclyPublishable/i;

assert.equal(ANA_CP008_ENGLISH_PROTOTYPES.length, 14, "Expected 14 approved language prototypes.");
assert.equal(ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.length, 14, "Expected 14 proposed multilingual QL-template families.");
assert.deepEqual(
  new Set(ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.map((entry) => entry.prototypeId)),
  new Set(ANA_CP008_ENGLISH_PROTOTYPES.map((entry) => entry.prototypeId)),
  "Every approved prototype must have exactly one allocation row.",
);
assert.equal(new Set(ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.map((entry) => entry.qlTemplateKey)).size, 14,
  "Every proposed QL-template family must be structurally distinct.");
assert.equal(new Set(ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.map((entry) => entry.solveContract)).size, 13,
  "The proposal must derive 13 student solve contracts.");

const proposedTaskUnits = ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.flatMap((entry) =>
  entry.tasks.map((task) => ({ prototypeId: entry.prototypeId, qlTemplateKey: entry.qlTemplateKey, task })),
);
assert.equal(proposedTaskUnits.length, 28, "The proposal must derive 28 source-eligible task units.");
assert.equal(new Set(proposedTaskUnits.map((entry) => `${entry.qlTemplateKey}|${entry.task}`)).size, 28,
  "Proposed task-unit signatures must be unique.");

const multiplierRows = ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.filter((entry) =>
  entry.solveContract === "EXACT_MULTIPLIER_WITH_LETTER_VECTOR",
);
assert.equal(multiplierRows.length, 2, "Exact multiplier must have cluster-first and number-first templates.");
assert.equal(new Set(multiplierRows.map((entry) => entry.solveContract)).size, 1,
  "Both exact-multiplier token orders must share one solve contract.");
assert.equal(new Set(multiplierRows.map((entry) => entry.qlTemplateKey)).size, 2,
  "Both exact-multiplier token orders require separate QL templates.");
assert.deepEqual(new Set(multiplierRows.map((entry) => entry.tokenOrder)), new Set(["CLUSTER_FIRST", "NUMBER_FIRST"]));

for (const definition of ANA_CP008_ENGLISH_PROTOTYPES) {
  const allocation = ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.find((entry) => entry.prototypeId === definition.prototypeId);
  assert.ok(allocation, `Missing allocation for ${definition.prototypeId}.`);
  assert.deepEqual(definition.taskEligibility, ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"]);
  assert.equal(allocation.tokenOrder, definition.tokenOrderDecision,
    `${definition.prototypeId} token-order decision differs from the approved prototype.`);

  const direct = renderDirectEnglishPrototype(definition.prototypeId);
  const odd = renderOddPairEnglishPrototype(definition.prototypeId);
  assert.equal(direct.metadata.permanentQlId, null);
  assert.equal(odd.metadata.permanentQlId, null);
  assert.equal(codingGrammar.test(direct.stem), false, `${definition.prototypeId} direct stem uses Coding-Decoding grammar.`);
  assert.equal(codingGrammar.test(odd.stem), false, `${definition.prototypeId} odd-pair stem uses Coding-Decoding grammar.`);
  assert.equal(internalText.test(`${direct.stem} ${odd.stem}`), false, `${definition.prototypeId} leaks internal text.`);
  assert.ok(direct.explanation.sourceDemonstration.length >= 12);
  assert.ok(direct.explanation.targetApplication.length >= 12);
  assert.equal(odd.options.length, 4);
  assert.ok(odd.correctIndex >= 0 && odd.correctIndex < 4);

  for (const locale of locales) {
    const localizedDirect = renderLocalizedDirectPrototype(definition.prototypeId, locale);
    const localizedOdd = renderLocalizedOddPairPrototype(definition.prototypeId, locale);
    assert.deepEqual(localizedDirect.correctAnswer, direct.correctAnswer,
      `${definition.prototypeId}/${locale}: direct answer differs from English.`);
    assert.equal(localizedOdd.correctIndex, odd.correctIndex,
      `${definition.prototypeId}/${locale}: odd-pair correct index differs from English.`);
    assert.deepEqual(localizedOdd.options, odd.options,
      `${definition.prototypeId}/${locale}: odd-pair options differ from English.`);
    assert.equal(codingGrammar.test(localizedDirect.stem), false,
      `${definition.prototypeId}/${locale}: direct stem uses Coding-Decoding grammar.`);
    assert.equal(codingGrammar.test(localizedOdd.stem), false,
      `${definition.prototypeId}/${locale}: odd-pair stem uses Coding-Decoding grammar.`);
    assert.equal(internalText.test(`${localizedDirect.stem} ${localizedOdd.stem}`), false,
      `${definition.prototypeId}/${locale}: student text leaks internal identifiers.`);
  }
}

const summary = {
  status: "ALLOCATION_PROPOSAL_VALIDATED",
  permanentIdsAssigned: 0,
  approvedPrototypeFamilies: ANA_CP008_ENGLISH_PROTOTYPES.length,
  proposedSolveContracts: new Set(ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.map((entry) => entry.solveContract)).size,
  proposedQlTemplateFamilies: ANA_CP008_PROPOSED_TEMPLATE_ALLOCATIONS.length,
  proposedTaskUnits: proposedTaskUnits.length,
  admittedTasks: ["DIRECT_COMPLETION", "ODD_PAIR_SELECTION"],
  deferredTasks: ["EQUIVALENT_PAIR_SELECTION", "INVERSE_COMPLETION", "DOUBLE_MISSING_COMPLETION", "DUAL_ANALOGY_COMPLETION"],
  tokenOrderDecision: "Exact multiplier shares one solve contract but uses separate cluster-first and number-first QL templates.",
};

console.log(JSON.stringify(summary, null, 2));
