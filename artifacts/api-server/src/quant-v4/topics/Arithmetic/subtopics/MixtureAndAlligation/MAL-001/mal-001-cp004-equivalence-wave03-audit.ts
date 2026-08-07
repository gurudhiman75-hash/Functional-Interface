import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./foundation/rational";
import { generateMalCp004DiscoveryQuestion } from "./foundation/cp004-discovery-runtime";
import { solveMalCp004 } from "./foundation/cp004-solver";
import {
  MAL_CP004_WAVE03_CANONICAL_OWNER_VERDICT,
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS,
  MAL_CP004_WAVE03_EQUIVALENCE_MATRIX,
  MAL_CP004_WAVE03_SEPARATION_PROOFS,
} from "./foundation/cp004-equivalence-authority-wave03";
import {
  malCp004ComponentState,
  malCp004EvaporationState,
  malCp004FinalConcentrationAfterSolventChange,
  malCp004InitialMassFromMoistureState,
  malCp004InitialTotalFromEvaporation,
  malCp004MoistureState,
  malCp004PureAdditionState,
  malCp004TotalFromComponentAndRate,
  malCp004TotalFromOtherComponentAndRate,
} from "./foundation/cp004-equivalence-proof-wave03";
import { MAL_CP004_WAVE02_SOURCE_GAP_IDS } from "./foundation/cp004-source-authority-wave02";
import { MAL_CP004_DISCOVERY_PROTOTYPE_IDS } from "./foundation/cp004-types";
import { solvePct007 } from "../../Percentage/PCT-007/foundation/solver";
import type {
  Pct007AnswerType,
  Pct007CanonicalProblemId,
  Pct007Parameters,
  Pct007SolveMode,
  Pct007TaskKind,
} from "../../Percentage/PCT-007/foundation/types";
import type { Rational } from "./foundation/types";

function fail(message: string): never {
  throw new Error(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) fail(message);
}

function toNumber(value: Rational): number {
  return Number(value.numerator) / Number(value.denominator);
}

function percentNumber(value: Rational): number {
  return toNumber(value) * 100;
}

function round4(value: number): number {
  return Math.round((value + Number.EPSILON) * 10_000) / 10_000;
}

function assertPctNumber(
  actual: number | null,
  expected: Rational,
  label: string,
  asPercent = false,
): void {
  assert(actual !== null, `${label}: PCT solver returned no numeric answer.`);
  const expectedNumber = round4(
    asPercent ? percentNumber(expected) : toNumber(expected),
  );
  assert(
    Math.abs(actual - expectedNumber) <= 0.0001,
    `${label}: expected ${expectedNumber}, received ${actual}.`,
  );
}

function pctParameters(input: {
  cpId: Pct007CanonicalProblemId;
  taskKind: Pct007TaskKind;
  solveMode: Pct007SolveMode;
  answerType: Pct007AnswerType;
  variables: Record<string, number>;
}): Pct007Parameters {
  return {
    archetypeId: "PCT-007",
    canonicalProblemId: input.cpId,
    questionId: `WAVE03-${input.solveMode}`,
    questionLanguageId: `WAVE03-${input.solveMode}-EN`,
    explanationId: `WAVE03-${input.solveMode}-EX`,
    language: "en",
    difficultyBand: "Medium",
    taskKind: input.taskKind,
    solveMode: input.solveMode,
    answerType: input.answerType,
    requiredVariables: Object.keys(input.variables),
    variables: input.variables,
    sourceTrace: {
      questionLanguageSource: "PCT-007-equivalence-read",
      explanationSource: "PCT-007-equivalence-read",
      variableRangeSource: "PCT-007-equivalence-read",
    },
  };
}

assert(
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length === 10,
  "Expected ten effective CP-004 contracts after closure.",
);
assert(
  MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.length === 20,
  "Expected twenty authorities in the equivalence matrix.",
);
assert(
  MAL_CP004_WAVE03_SEPARATION_PROOFS.length === 4,
  "Expected four explicit separation proofs.",
);
assert(
  new Set(MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS).size === 10,
  "Effective contract IDs are not unique.",
);
assert(
  new Set(MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.map((entry) => entry.authorityId))
    .size === 20,
  "Equivalence authority IDs are not unique.",
);

const dispositionCounts = Object.fromEntries(
  [
    "KEEP_OPEN_CONTRACT",
    "MERGE_AS_REPRESENTATION_VARIANT",
    "REFERENCE_EXISTING_CONTRACT",
    "ADD_OPEN_CONTRACT_FROM_COLLISION",
  ].map((disposition) => [
    disposition,
    MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.filter(
      (entry) => entry.disposition === disposition,
    ).length,
  ]),
);
assert(
  dispositionCounts.KEEP_OPEN_CONTRACT === 8 &&
    dispositionCounts.MERGE_AS_REPRESENTATION_VARIANT === 6 &&
    dispositionCounts.REFERENCE_EXISTING_CONTRACT === 5 &&
    dispositionCounts.ADD_OPEN_CONTRACT_FROM_COLLISION === 1,
  `Unexpected disposition counts: ${JSON.stringify(dispositionCounts)}.`,
);

for (const prototypeId of MAL_CP004_DISCOVERY_PROTOTYPE_IDS) {
  assert(
    MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.some(
      (entry) => entry.authorityId === prototypeId,
    ),
    `${prototypeId}: Wave 01 authority is missing from closure.`,
  );
}
for (const gapId of MAL_CP004_WAVE02_SOURCE_GAP_IDS) {
  assert(
    MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.some(
      (entry) => entry.authorityId === gapId,
    ),
    `${gapId}: Wave 02 gap is missing from closure.`,
  );
}
for (const effectiveContractId of MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS) {
  assert(
    MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.some(
      (entry) => entry.effectiveContractId === effectiveContractId,
    ),
    `${effectiveContractId}: effective contract has no authority.`,
  );
}

const pctCp005Entries = MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.filter(
  (entry) => entry.authorityId.startsWith("PCT-007/PCT-CP-005/"),
);
const pctCp006Entries = MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.filter(
  (entry) => entry.authorityId.startsWith("PCT-007/PCT-CP-006/"),
);
assert(pctCp005Entries.length === 5, "Expected five PCT-CP-005 collision modes.");
assert(pctCp006Entries.length === 5, "Expected five PCT-CP-006 collision modes.");
assert(
  MAL_CP004_WAVE03_CANONICAL_OWNER_VERDICT.canonicalOwner === "MAL-CP-004" &&
    !MAL_CP004_WAVE03_CANONICAL_OWNER_VERDICT.percentageMutationInThisWave &&
    !MAL_CP004_WAVE03_CANONICAL_OWNER_VERDICT.permanentQlAllocationInThisWave,
  "Canonical-owner release policy changed.",
);

const totals = [40, 60, 75, 90, 120, 144].map((value) => rational(value));
const componentRates = [
  rational(1, 5),
  rational(1, 4),
  rational(3, 10),
  rational(2, 5),
  rational(1, 2),
  rational(3, 5),
  rational(5, 8),
  rational(3, 4),
];
let componentStateCount = 0;
let pctComponentProofCount = 0;

for (const total of totals) {
  for (const componentRate of componentRates) {
    const state = malCp004ComponentState(total, componentRate);
    const componentSolved = solveMalCp004({
      mode: "COMPONENT_AMOUNT_FROM_CONCENTRATION",
      totalQuantity: total,
      concentration: componentRate,
    });
    assert(
      componentSolved.kind === "COMPONENT_QUANTITY" &&
        equalsRational(componentSolved.value, state.componentAmount),
      "CP-004 component projection disagrees with the canonical state.",
    );
    const rateSolved = solveMalCp004({
      mode: "CONCENTRATION_FROM_COMPONENT_AMOUNT",
      totalQuantity: total,
      componentQuantity: state.componentAmount,
    });
    assert(
      rateSolved.kind === "CONCENTRATION" &&
        equalsRational(rateSolved.value, componentRate),
      "CP-004 concentration projection disagrees with the canonical state.",
    );
    assert(
      equalsRational(
        malCp004TotalFromComponentAndRate(
          state.componentAmount,
          componentRate,
        ),
        total,
      ),
      "Total-from-component inverse failed.",
    );
    assert(
      equalsRational(
        malCp004TotalFromOtherComponentAndRate(
          state.otherComponentAmount,
          componentRate,
        ),
        total,
      ),
      "Total-from-other-component inverse failed.",
    );
    assert(
      equalsRational(
        divideRational(state.componentAmount, total),
        componentRate,
      ),
      "Component-rate round trip failed.",
    );

    const variables = {
      totalValue: toNumber(total),
      componentRate: percentNumber(componentRate),
      value1: toNumber(state.componentAmount),
    };
    assertPctNumber(
      solvePct007(
        pctParameters({
          cpId: "PCT-CP-005",
          taskKind: "mixtureConcentrationBasicApplication",
          solveMode: "findComponentFromTotalAndRate",
          answerType: "AMOUNT",
          variables,
        }),
      ).numericAnswer,
      state.componentAmount,
      "PCT component amount",
    );
    assertPctNumber(
      solvePct007(
        pctParameters({
          cpId: "PCT-CP-005",
          taskKind: "mixtureConcentrationBasicApplication",
          solveMode: "findOtherComponentFromTotalAndRate",
          answerType: "AMOUNT",
          variables,
        }),
      ).numericAnswer,
      state.otherComponentAmount,
      "PCT other component amount",
    );
    assertPctNumber(
      solvePct007(
        pctParameters({
          cpId: "PCT-CP-005",
          taskKind: "mixtureConcentrationBasicApplication",
          solveMode: "findTotalFromComponentAndRate",
          answerType: "AMOUNT",
          variables,
        }),
      ).numericAnswer,
      total,
      "PCT total from component",
    );
    assertPctNumber(
      solvePct007(
        pctParameters({
          cpId: "PCT-CP-005",
          taskKind: "mixtureConcentrationBasicApplication",
          solveMode: "findRateFromComponentAndTotal",
          answerType: "PERCENT",
          variables,
        }),
      ).numericAnswer,
      componentRate,
      "PCT component rate",
      true,
    );
    assertPctNumber(
      solvePct007(
        pctParameters({
          cpId: "PCT-CP-005",
          taskKind: "mixtureConcentrationBasicApplication",
          solveMode: "findTotalFromOtherComponentAndRate",
          answerType: "AMOUNT",
          variables: {
            ...variables,
            value1: toNumber(state.otherComponentAmount),
          },
        }),
      ).numericAnswer,
      total,
      "PCT total from other component",
    );

    componentStateCount += 1;
    pctComponentProofCount += 5;
  }
}

const moistureMasses = [40, 60, 75, 80, 90, 100, 120, 150].map((value) =>
  rational(value),
);
const initialMoistures = [
  rational(1, 2),
  rational(3, 5),
  rational(2, 3),
  rational(3, 4),
  rational(4, 5),
  rational(9, 10),
];
const finalMoistures = [
  rational(1, 10),
  rational(1, 5),
  rational(1, 4),
  rational(2, 5),
  rational(1, 2),
];
let moistureStateCount = 0;
let pctMoistureProofCount = 0;

for (const initialMass of moistureMasses) {
  for (const initialMoistureFraction of initialMoistures) {
    for (const finalMoistureFraction of finalMoistures) {
      if (
        compareRational(
          finalMoistureFraction,
          initialMoistureFraction,
        ) >= 0
      ) {
        continue;
      }
      const state = malCp004MoistureState({
        initialMass,
        initialMoistureFraction,
        finalMoistureFraction,
      });
      const forward = solveMalCp004({
        mode: "FINAL_MASS_FROM_MOISTURE_SHIFT",
        initialMass,
        initialMoistureFraction,
        finalMoistureFraction,
      });
      assert(
        forward.kind === "FINAL_MASS" &&
          equalsRational(forward.value, state.finalMass),
        "CP-004 forward moisture state mismatch.",
      );
      const inverse = solveMalCp004({
        mode: "INITIAL_MASS_FROM_MOISTURE_SHIFT",
        finalMass: state.finalMass,
        initialMoistureFraction,
        finalMoistureFraction,
      });
      assert(
        inverse.kind === "INITIAL_MASS" &&
          equalsRational(inverse.value, initialMass),
        "CP-004 inverse moisture state mismatch.",
      );
      assert(
        equalsRational(
          malCp004InitialMassFromMoistureState({
            finalMass: state.finalMass,
            initialMoistureFraction,
            finalMoistureFraction,
          }),
          initialMass,
        ),
        "Moisture inverse projection failed.",
      );
      assert(
        equalsRational(
          subtractRational(initialMass, state.finalMass),
          state.moistureLost,
        ),
        "Moisture-lost output variant failed.",
      );

      const pctVariables = {
        baseValue: toNumber(initialMass),
        value1: toNumber(state.finalMass),
        waterRate: percentNumber(initialMoistureFraction),
        dryWaterRate: percentNumber(finalMoistureFraction),
      };
      assertPctNumber(
        solvePct007(
          pctParameters({
            cpId: "PCT-CP-006",
            taskKind: "evaporationDryingCompositionApplication",
            solveMode: "findFinalDryWeight",
            answerType: "WEIGHT",
            variables: pctVariables,
          }),
        ).numericAnswer,
        state.finalMass,
        "PCT final dry weight",
      );
      assertPctNumber(
        solvePct007(
          pctParameters({
            cpId: "PCT-CP-006",
            taskKind: "evaporationDryingCompositionApplication",
            solveMode: "findWaterLostAfterDrying",
            answerType: "WEIGHT",
            variables: pctVariables,
          }),
        ).numericAnswer,
        state.moistureLost,
        "PCT water lost",
      );
      assertPctNumber(
        solvePct007(
          pctParameters({
            cpId: "PCT-CP-006",
            taskKind: "evaporationDryingCompositionApplication",
            solveMode: "findInitialWeightFromFinalDryWeight",
            answerType: "WEIGHT",
            variables: pctVariables,
          }),
        ).numericAnswer,
        initialMass,
        "PCT initial wet weight",
      );

      moistureStateCount += 1;
      pctMoistureProofCount += 3;
    }
  }
}

const transformationTotals = [40, 60, 75, 80, 90, 100, 120, 150].map(
  (value) => rational(value),
);
const lowerRates = [
  rational(1, 5),
  rational(1, 4),
  rational(3, 10),
  rational(2, 5),
  rational(1, 2),
];
const higherRates = [
  rational(1, 2),
  rational(3, 5),
  rational(2, 3),
  rational(3, 4),
  rational(4, 5),
];
let evaporationStateCount = 0;
let dilutionStateCount = 0;
let pureAdditionStateCount = 0;
let pctEvaporationProofCount = 0;

for (const initialTotal of transformationTotals) {
  for (const initialConcentration of lowerRates) {
    for (const targetConcentration of higherRates) {
      if (
        compareRational(targetConcentration, initialConcentration) <= 0
      ) {
        continue;
      }
      const evaporation = malCp004EvaporationState({
        initialTotal,
        initialConcentration,
        targetConcentration,
      });
      const solvedEvaporation = solveMalCp004({
        mode: "EVAPORATE_SOLVENT_FOR_TARGET_CONCENTRATION",
        initialTotal,
        initialConcentration,
        targetConcentration,
      });
      assert(
        solvedEvaporation.kind === "SOLVENT_EVAPORATED" &&
          equalsRational(
            solvedEvaporation.value,
            evaporation.evaporatedAmount,
          ),
        "CP-004 evaporation amount mismatch.",
      );
      assert(
        equalsRational(
          malCp004InitialTotalFromEvaporation({
            evaporatedAmount: evaporation.evaporatedAmount,
            initialConcentration,
            targetConcentration,
          }),
          initialTotal,
        ),
        "Initial-total evaporation inverse failed.",
      );
      assert(
        equalsRational(
          malCp004FinalConcentrationAfterSolventChange({
            initialTotal,
            initialConcentration,
            solventChange: evaporation.evaporatedAmount,
            direction: "EVAPORATE",
          }),
          targetConcentration,
        ),
        "Known-evaporation final concentration failed.",
      );

      const pctVariables = {
        baseValue: toNumber(initialTotal),
        oldRate: percentNumber(initialConcentration),
        newRate: percentNumber(targetConcentration),
      };
      assertPctNumber(
        solvePct007(
          pctParameters({
            cpId: "PCT-CP-006",
            taskKind: "evaporationDryingCompositionApplication",
            solveMode: "findFinalVolumeAfterEvaporation",
            answerType: "VOLUME",
            variables: pctVariables,
          }),
        ).numericAnswer,
        evaporation.finalTotal,
        "PCT final volume after evaporation",
      );
      assertPctNumber(
        solvePct007(
          pctParameters({
            cpId: "PCT-CP-006",
            taskKind: "evaporationDryingCompositionApplication",
            solveMode: "findEvaporatedAmount",
            answerType: "VOLUME",
            variables: pctVariables,
          }),
        ).numericAnswer,
        evaporation.evaporatedAmount,
        "PCT evaporated amount",
      );

      const pureAddition = malCp004PureAdditionState({
        initialTotal,
        initialConcentration,
        targetConcentration,
      });
      const solvedPureAddition = solveMalCp004({
        mode: "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION",
        initialTotal,
        initialConcentration,
        targetConcentration,
      });
      assert(
        solvedPureAddition.kind === "PURE_SOLUTE_ADDED" &&
          equalsRational(
            solvedPureAddition.value,
            pureAddition.pureSoluteAdded,
          ),
        "Pure-solute addition projection failed.",
      );
      assert(
        equalsRational(
          divideRational(
            pureAddition.finalSolute,
            pureAddition.finalTotal,
          ),
          targetConcentration,
        ),
        "Pure-addition target concentration failed.",
      );
      assert(
        equalsRational(
          subtractRational(
            pureAddition.finalTotal,
            pureAddition.finalSolute,
          ),
          pureAddition.conservedSolvent,
        ),
        "Pure-addition solvent invariant failed.",
      );

      evaporationStateCount += 1;
      pureAdditionStateCount += 1;
      pctEvaporationProofCount += 2;
    }
  }
}

const dilutionInitialRates = [
  rational(1, 3),
  rational(2, 5),
  rational(1, 2),
  rational(3, 5),
  rational(2, 3),
  rational(3, 4),
];
const dilutionTargets = [
  rational(1, 5),
  rational(1, 4),
  rational(3, 10),
  rational(1, 3),
  rational(2, 5),
  rational(1, 2),
];

for (const initialTotal of transformationTotals) {
  for (const initialConcentration of dilutionInitialRates) {
    for (const targetConcentration of dilutionTargets) {
      if (
        compareRational(targetConcentration, initialConcentration) >= 0
      ) {
        continue;
      }
      const solved = solveMalCp004({
        mode: "ADD_SOLVENT_FOR_TARGET_CONCENTRATION",
        initialTotal,
        initialConcentration,
        targetConcentration,
      });
      assert(solved.kind === "SOLVENT_ADDED", "Wrong dilution solve kind.");
      assert(
        equalsRational(
          malCp004FinalConcentrationAfterSolventChange({
            initialTotal,
            initialConcentration,
            solventChange: solved.value,
            direction: "ADD",
          }),
          targetConcentration,
        ),
        "Known-solvent-addition final concentration failed.",
      );
      const initialSolute = multiplyRational(
        initialTotal,
        initialConcentration,
      );
      const finalTotal = divideRational(initialSolute, targetConcentration);
      assert(
        equalsRational(
          subtractRational(finalTotal, initialTotal),
          solved.value,
        ),
        "Dilution final-total projection failed.",
      );
      dilutionStateCount += 1;
    }
  }
}

assert(componentStateCount === 48, "Unexpected component-state count.");
assert(moistureStateCount >= 200, "Moisture proof grid is too small.");
assert(evaporationStateCount >= 180, "Evaporation proof grid is too small.");
assert(dilutionStateCount >= 150, "Dilution proof grid is too small.");
assert(
  pureAdditionStateCount === evaporationStateCount,
  "Pure-addition proof grid does not match the strengthening grid.",
);
assert(pctComponentProofCount === componentStateCount * 5, "PCT-CP-005 proof count mismatch.");
assert(pctMoistureProofCount === moistureStateCount * 3, "PCT moisture proof count mismatch.");
assert(pctEvaporationProofCount === evaporationStateCount * 2, "PCT evaporation proof count mismatch.");

let compatibilityQuestionCount = 0;
for (const prototypeId of MAL_CP004_DISCOVERY_PROTOTYPE_IDS) {
  for (let index = 0; index < 25; index += 1) {
    const question = generateMalCp004DiscoveryQuestion(
      prototypeId,
      `cp004-wave03-compatibility:${prototypeId}:${index}`,
    );
    assert(
      question.validation.ok,
      `${prototypeId}/${index}: ${question.validation.errors.join("; ")}`,
    );
    assert(question.permanentQlId === null, "Permanent QL leaked in Wave 03.");
    assert(
      !question.active &&
        !question.publiclyPublishable &&
        !question.questionStudioDiscoverable &&
        !question.questionBankWritable &&
        !question.testEligible,
      "A discovery product flag became enabled in Wave 03.",
    );
    compatibilityQuestionCount += 1;
  }
}
assert(compatibilityQuestionCount === 175, "Compatibility count mismatch.");

const totalExactStateCount =
  componentStateCount +
  moistureStateCount +
  evaporationStateCount +
  dilutionStateCount +
  pureAdditionStateCount;
const totalPctRuntimeProofCount =
  pctComponentProofCount + pctMoistureProofCount + pctEvaporationProofCount;

const outputDirectory = resolve(process.cwd(), "dist/quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = resolve(
  outputDirectory,
  "mal-cp004-wave03-equivalence-closure.json",
);
const markdownPath = resolve(
  outputDirectory,
  "mal-cp004-wave03-equivalence-closure.md",
);

const effectiveContractSummary = Object.fromEntries(
  MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.map((effectiveContractId) => [
    effectiveContractId,
    MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.filter(
      (entry) => entry.effectiveContractId === effectiveContractId,
    ),
  ]),
);

writeFileSync(
  jsonPath,
  `${JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE03_EQUIVALENCE_CLOSURE",
      authorityCount: MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.length,
      effectiveContractCount: MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length,
      dispositionCounts,
      pctCp005CollisionModeCount: pctCp005Entries.length,
      pctCp006CollisionModeCount: pctCp006Entries.length,
      componentStateCount,
      moistureStateCount,
      evaporationStateCount,
      dilutionStateCount,
      pureAdditionStateCount,
      totalExactStateCount,
      totalPctRuntimeProofCount,
      compatibilityQuestionCount,
      permanentQlCount: 0,
      percentageMutationPerformed: false,
      productFlagsEnabled: false,
      canonicalOwnerVerdict: MAL_CP004_WAVE03_CANONICAL_OWNER_VERDICT,
      separationProofs: MAL_CP004_WAVE03_SEPARATION_PROOFS,
      effectiveContractSummary,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const markdown = [
  "# MAL-CP-004 Wave 03 — Mathematical Equivalence Closure",
  "",
  `Authorities reviewed: **${MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.length}**`,
  `Effective contracts: **${MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length}**`,
  `PCT-CP-005 collision modes: **${pctCp005Entries.length}**`,
  `PCT-CP-006 collision modes: **${pctCp006Entries.length}**`,
  `Exact rational states: **${totalExactStateCount}**`,
  `Actual PCT runtime comparisons: **${totalPctRuntimeProofCount}**`,
  `Discovery compatibility questions: **${compatibilityQuestionCount}**`,
  "Permanent QLs: **0**",
  "",
  "## Effective contracts",
  "",
  ...MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.flatMap(
    (effectiveContractId) => [
      `### ${effectiveContractId}`,
      "",
      ...MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.filter(
        (entry) => entry.effectiveContractId === effectiveContractId,
      ).map(
        (entry) =>
          `- ${entry.authorityId} → ${entry.disposition} (${entry.outputVariant})`,
      ),
      "",
    ],
  ),
  "## Separation proofs",
  "",
  ...MAL_CP004_WAVE03_SEPARATION_PROOFS.map(
    (proof) => `- ${proof.left} ≠ ${proof.right}: ${proof.reason}`,
  ),
  "",
];
writeFileSync(markdownPath, `${markdown.join("\n")}\n`, "utf8");

console.log(
  JSON.stringify(
    {
      status: "PASS_MAL_CP004_WAVE03_EQUIVALENCE_CLOSURE",
      authorityCount: MAL_CP004_WAVE03_EQUIVALENCE_MATRIX.length,
      effectiveContractCount: MAL_CP004_WAVE03_EFFECTIVE_CONTRACT_IDS.length,
      dispositionCounts,
      pctCp005CollisionModeCount: pctCp005Entries.length,
      pctCp006CollisionModeCount: pctCp006Entries.length,
      totalExactStateCount,
      totalPctRuntimeProofCount,
      compatibilityQuestionCount,
      permanentQlCount: 0,
      percentageMutationPerformed: false,
      productFlagsEnabled: false,
    },
    null,
    2,
  ),
);
