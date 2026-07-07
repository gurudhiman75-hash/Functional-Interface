import ranges from "./variable-ranges.library.json";
import { alignChainRatios, pick, simplifyRatio, stableBucket } from "./math";
import { getRap002QuestionLanguageIds, getRap002RegistryEntry } from "./library";
import { RAP_002_ARCHETYPE_ID, type Rap002CanonicalProblemId, type Rap002DifficultyBand, type Rap002ParameterInput, type Rap002Parameters, type Rap002Variables } from "./types";

const ENTITY_SETS = (ranges as any).entities as Record<string, string[]>;
const RATIO_TERMS = (ranges as any).ratioTerms as Record<Rap002DifficultyBand, number[]>;

function pickDifficulty(seed: string): Rap002DifficultyBand {
  return (["Medium", "Hard"] as const)[stableBucket(seed, 2)]!;
}

function pickQl(cpId: Rap002CanonicalProblemId, seed: string, requested?: string) {
  if (requested) return requested;
  const ids = getRap002QuestionLanguageIds(cpId);
  return ids[stableBucket(`${seed}:ql`, ids.length)]!;
}

function ratioTerm(difficulty: Rap002DifficultyBand, seed: string) {
  return pick(RATIO_TERMS[difficulty], seed);
}

function entitySet(seed: string) {
  return pick(Object.values(ENTITY_SETS), `${seed}:entities`);
}

function baseChainVariables(seed: string, difficulty: Rap002DifficultyBand): Rap002Variables {
  const entities = entitySet(seed);
  const ratioA1 = ratioTerm(difficulty, `${seed}:a1`);
  const ratioB1 = ratioTerm(difficulty, `${seed}:b1`);
  const ratioB2 = ratioTerm(difficulty, `${seed}:b2`);
  const ratioC2 = ratioTerm(difficulty, `${seed}:c2`);
  const ratioC3 = ratioTerm(difficulty, `${seed}:c3`);
  const ratioD3 = ratioTerm(difficulty, `${seed}:d3`);

  return {
    personA: entities[0]!,
    personB: entities[1]!,
    personC: entities[2]!,
    personD: entities[3]!,
    ratioA1,
    ratioB1,
    ratioB2,
    ratioC2,
    ratioC3,
    ratioD3,
  };
}

function addExtendedTarget(seed: string, variables: Rap002Variables): Rap002Variables {
  const targetPairs = [
    ["AD", `${variables.personA}:${variables.personD}`],
    ["BD", `${variables.personB}:${variables.personD}`],
    ["AC", `${variables.personA}:${variables.personC}`],
  ] as const;
  const [targetPair, targetPairLabel] = pick(targetPairs, `${seed}:targetPair`);
  return { ...variables, targetPair, targetPairLabel };
}

function addMissingChainVariables(variables: Rap002Variables): Rap002Variables {
  const endpoint = simplifyRatio(
    alignChainRatios(
      [Number(variables.ratioA1), Number(variables.ratioB1)],
      [Number(variables.ratioB2), Number(variables.ratioC2)],
    ).filter((_, index) => index !== 1),
  );
  return {
    personA: variables.personA,
    personB: variables.personB,
    personC: variables.personC,
    ratioA1: variables.ratioA1,
    ratioB1: variables.ratioB1,
    ratioB2: variables.ratioB2,
    ratioC2: variables.ratioC2,
    endpointA: endpoint[0]!,
    endpointC: endpoint[1]!,
  };
}

function baseReverseChainVariables(seed: string, difficulty: Rap002DifficultyBand, qlId: string): Rap002Variables {
  const variables = baseChainVariables(seed, difficulty);
  let ratioC2 = Number(variables.ratioC2);
  let aligned = alignChainRatios(
    [Number(variables.ratioA1), Number(variables.ratioB1)],
    [Number(variables.ratioB2), ratioC2],
  );
  if (aligned[0] === aligned[2]) {
    ratioC2 += 1;
    aligned = alignChainRatios(
      [Number(variables.ratioA1), Number(variables.ratioB1)],
      [Number(variables.ratioB2), ratioC2],
    );
  }
  const scale = pick([4, 5, 6, 8, 10, 12], `${seed}:scale`);
  const valueA = aligned[0]! * scale;
  const valueB = aligned[1]! * scale;
  const valueC = aligned[2]! * scale;
  const valueDifference = Math.abs(valueC - valueA);
  const totalValue = valueA + valueB + valueC;

  return {
    personA: variables.personA,
    personB: variables.personB,
    personC: variables.personC,
    ratioA1: variables.ratioA1,
    ratioB1: variables.ratioB1,
    ratioB2: variables.ratioB2,
    ratioC2,
    ...(qlId === "RAP-QL-301" ? { valueA } : {}),
    ...(qlId === "RAP-QL-302" ? { valueC } : {}),
    ...(qlId === "RAP-QL-303" ? { valueB, targetEndpoint: "A" } : {}),
    ...(qlId === "RAP-QL-304" ? { valueB, targetEndpoint: "C" } : {}),
    ...(qlId === "RAP-QL-305" ? { valueDifference, constraintKind: "difference" } : {}),
    ...(qlId === "RAP-QL-306" ? { totalValue, constraintKind: "total" } : {}),
  };
}

function baseTransformationVariables(seed: string, difficulty: Rap002DifficultyBand, qlId: string): Rap002Variables {
  const entities = entitySet(seed);
  let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
  let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
  if (ratioA === ratioB) ratioB += 1;

  const scale = pick([8, 10, 12, 15, 20], `${seed}:scale`);
  const initialA = ratioA * scale;
  const initialB = ratioB * scale;
  const totalValue = initialA + initialB;
  const valueAddA = pick([4, 5, 6, 8, 10, 12], `${seed}:addA`);
  const valueAddB = pick([2, 4, 5, 6, 8, 10], `${seed}:addB`);
  const valueRemoveB = Math.min(initialB - 1, pick([2, 4, 5, 6, 8], `${seed}:removeB`));
  const transferValue = Math.min(Math.min(initialA, initialB) - 1, pick([2, 4, 5, 6, 8], `${seed}:transfer`));

  if (qlId === "RAP-QL-405") {
    const finalA = initialA + valueAddA;
    const finalB = initialB;
    const [finalRatioA, finalRatioB] = simplifyRatio([finalA, finalB]);
    return {
      personA: entities[0]!,
      personB: entities[1]!,
      finalRatioA,
      finalRatioB,
      valueAddA,
      originalTotal: totalValue,
    };
  }

  if (qlId === "RAP-QL-406") {
    const finalA = initialA - transferValue;
    const finalB = initialB + transferValue;
    const [finalRatioA, finalRatioB] = simplifyRatio([finalA, finalB]);
    return {
      personA: entities[0]!,
      personB: entities[1]!,
      finalRatioA,
      finalRatioB,
      transferValue,
      totalValue,
      transferDirection: "A_TO_B",
    };
  }

  return {
    personA: entities[0]!,
    personB: entities[1]!,
    ratioA,
    ratioB,
    totalValue,
    ...(qlId === "RAP-QL-401" ? { valueAddA, valueAddB } : {}),
    ...(qlId === "RAP-QL-402" ? { valueAddA, valueRemoveB } : {}),
    ...(qlId === "RAP-QL-403" ? { transferValue, transferDirection: "B_TO_A" } : {}),
    ...(qlId === "RAP-QL-404" ? { transferValue, transferDirection: "A_TO_B" } : {}),
  };
}

function basePartitionVariables(seed: string, difficulty: Rap002DifficultyBand, qlId: string): Rap002Variables {
  const entities = entitySet(seed);
  let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
  let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
  let subRatioC = ratioTerm(difficulty, `${seed}:subC`);
  let subRatioD = ratioTerm(difficulty, `${seed}:subD`);
  if (ratioA === ratioB) ratioB += 1;
  if (subRatioC === subRatioD) subRatioD += 1;

  const subTotalRatio = subRatioC + subRatioD;
  const mainUnit = subTotalRatio * pick([4, 5, 6, 8, 10], `${seed}:unit`);
  const totalValue = (ratioA + ratioB) * mainUnit;
  const branchPart = qlId === "RAP-QL-502" || qlId === "RAP-QL-504" || qlId === "RAP-QL-506" ? "B" : "A";
  const targetSubPart = qlId === "RAP-QL-502" || qlId === "RAP-QL-504" ? "D" : "C";
  const branchShare = branchPart === "A" ? ratioA * mainUnit : ratioB * mainUnit;
  const thresholdValue = Math.max(1, branchShare - pick([5, 10, 12, 15, 20], `${seed}:thresholdGap`));
  const weightC = pick([2, 3, 4, 5, 6], `${seed}:weightC`);
  const weightD = pick([3, 4, 5, 6, 8], `${seed}:weightD`);

  return {
    personA: entities[0]!,
    personB: entities[1]!,
    personC: entities[2]!,
    personD: entities[3]!,
    ratioA,
    ratioB,
    subRatioC,
    subRatioD,
    totalValue,
    branchPart,
    targetSubPart,
    ...(qlId === "RAP-QL-503" || qlId === "RAP-QL-504" ? { thresholdValue } : {}),
    ...(qlId === "RAP-QL-505" || qlId === "RAP-QL-506" ? { weightC, weightD } : {}),
  };
}

function baseInverseVariables(seed: string, difficulty: Rap002DifficultyBand, qlId: string): Rap002Variables {
  const entities = entitySet(seed);
  let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
  let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
  if (ratioA === ratioB) ratioB += 1;
  const scale = pick([4, 5, 6, 8, 10, 12], `${seed}:scale`);
  const timeRatioA = ratioTerm(difficulty, `${seed}:timeA`);
  let timeRatioB = ratioTerm(difficulty, `${seed}:timeB`);
  if (timeRatioA === timeRatioB) timeRatioB += 1;

  if (qlId === "RAP-QL-602" || qlId === "RAP-QL-604") {
    const chain = baseChainVariables(seed, difficulty);
    const aligned = alignChainRatios(
      [Number(chain.ratioA1), Number(chain.ratioB1)],
      [Number(chain.ratioB2), Number(chain.ratioC2)],
    );
    return {
      personA: chain.personA,
      personB: chain.personB,
      personC: chain.personC,
      ratioA1: chain.ratioA1,
      ratioB1: chain.ratioB1,
      ratioB2: chain.ratioB2,
      ratioC2: chain.ratioC2,
      ...(qlId === "RAP-QL-602" ? { valueA: aligned[2]! * scale } : { valueC: aligned[0]! * scale }),
    };
  }

  return {
    personA: entities[0]!,
    personB: entities[1]!,
    ratioA,
    ratioB,
    ...(qlId === "RAP-QL-601" || qlId === "RAP-QL-603" ? { valueA: ratioB * scale } : {}),
    ...(qlId === "RAP-QL-605" || qlId === "RAP-QL-606" ? { timeRatioA, timeRatioB } : {}),
  };
}

function baseComparisonVariables(seed: string, difficulty: Rap002DifficultyBand, qlId: string): Rap002Variables {
  if (qlId === "RAP-QL-706") {
    let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
    let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
    if (ratioA === ratioB) ratioB += 1;
    const multiplier = pick([2, 3, 4, 5], `${seed}:equivalentMultiplier`);
    return {
      ratioA,
      ratioB,
      equivalentA: ratioA * multiplier,
      equivalentB: ratioB * multiplier,
    };
  }

  const variables = baseChainVariables(seed, difficulty);
  if (qlId === "RAP-QL-701" || qlId === "RAP-QL-703" || qlId === "RAP-QL-705") {
    const aligned = alignChainRatios(
      [Number(variables.ratioA1), Number(variables.ratioB1)],
      [Number(variables.ratioB2), Number(variables.ratioC2)],
    );
    const endpoint = simplifyRatio([aligned[0]!, aligned[2]!]);
    return {
      personA: variables.personA,
      personB: variables.personB,
      personC: variables.personC,
      ratioA1: variables.ratioA1,
      ratioB1: variables.ratioB1,
      ratioB2: variables.ratioB2,
      ratioC2: variables.ratioC2,
      ...(qlId === "RAP-QL-703" ? { comparisonPair: "AC" } : {}),
      ...(qlId === "RAP-QL-705" ? { endpointA: endpoint[0]!, endpointC: endpoint[1]! } : {}),
    };
  }

  return {
    ...variables,
    ...(qlId === "RAP-QL-704" ? { comparisonPair: "BD" } : {}),
  };
}

export function generateRap002Parameters(input: Rap002ParameterInput = {}): Rap002Parameters {
  const cpId = input.canonicalProblemId ?? "RAP-CP-007";
  if (cpId !== "RAP-CP-007" && cpId !== "RAP-CP-008" && cpId !== "RAP-CP-009" && cpId !== "RAP-CP-010" && cpId !== "RAP-CP-011" && cpId !== "RAP-CP-012") throw new Error(`RAP-002 MVP only supports RAP-CP-007 to RAP-CP-012. Received ${cpId}.`);

  const seed = input.seed ?? `RAP-002:${cpId}`;
  const language = input.language ?? "en";
  if (language !== "en") throw new Error("RAP-002 MVP currently supports English generation only.");

  const qlId = pickQl(cpId, seed, input.questionLanguageId);
  const registry = getRap002RegistryEntry(qlId);
  const difficulty = input.difficultyBand ?? registry.difficulty ?? pickDifficulty(seed);
  let variables = baseChainVariables(seed, difficulty);
  if (cpId === "RAP-CP-008") {
    variables = baseReverseChainVariables(seed, difficulty, qlId);
  } else if (cpId === "RAP-CP-009") {
    variables = baseTransformationVariables(seed, difficulty, qlId);
  } else if (cpId === "RAP-CP-010") {
    variables = basePartitionVariables(seed, difficulty, qlId);
  } else if (cpId === "RAP-CP-011") {
    variables = baseInverseVariables(seed, difficulty, qlId);
  } else if (cpId === "RAP-CP-012") {
    variables = baseComparisonVariables(seed, difficulty, qlId);
  }

  if (cpId === "RAP-CP-007" && registry.taskKind === "extendedChainAlignment") {
    variables = addExtendedTarget(seed, variables);
  } else if (cpId === "RAP-CP-007" && registry.taskKind === "missingChainRatio") {
    variables = addMissingChainVariables(variables);
  }

  return {
    archetypeId: RAP_002_ARCHETYPE_ID,
    canonicalProblemId: cpId,
    questionId: `${cpId}:${qlId}:${seed}`,
    questionLanguageId: qlId,
    explanationId: registry.explanationId,
    language,
    difficultyBand: difficulty,
    taskKind: registry.taskKind,
    answerType: registry.answerType,
    requiredVariables: registry.requiredVariables,
    variables,
    sourceTrace: {
      questionLanguageSource: "question-language.en.json",
      explanationSource: "explanation.en.json",
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}
