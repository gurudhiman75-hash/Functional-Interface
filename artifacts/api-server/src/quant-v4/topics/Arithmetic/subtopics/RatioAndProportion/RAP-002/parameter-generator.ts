import ranges from "./variable-ranges.library.json";
import { alignChainRatios, alignThreeChainRatios, pick, simplifyRatio, stableBucket } from "./math";
import { getRap002QuestionLanguageIds, getRap002RegistryEntry } from "./library";
import { RAP_002_ARCHETYPE_ID, type Rap002CanonicalProblemId, type Rap002DifficultyBand, type Rap002ParameterInput, type Rap002Parameters, type Rap002Variables } from "./types";

const RATIO_TERMS = (ranges as any).ratioTerms as Record<Rap002DifficultyBand, number[]>;
const SCENARIO_POOLS = {
  neutral: [
    ["A", "B", "C", "D"],
    ["Group A", "Group B", "Group C", "Group D"],
  ],
  people: [
    ["boys", "girls", "teachers", "staff"],
    ["students", "teachers", "parents", "staff"],
  ],
  partition: [
    ["A", "B", "C", "D"],
    ["Partner A", "Partner B", "Partner C", "Partner D"],
    ["Group A", "Group B", "Group C", "Group D"],
  ],
  work: [
    ["Team A", "Team B", "Team C", "Team D"],
    ["Group A", "Group B", "Group C", "Group D"],
  ],
  speed: [
    ["Train A", "Train B", "Train C", "Train D"],
    ["Runner A", "Runner B", "Runner C", "Runner D"],
    ["Cyclist A", "Cyclist B", "Cyclist C", "Cyclist D"],
  ],
} as const;

function pickDifficulty(seed: string): Rap002DifficultyBand {
  return (["Medium", "Hard"] as const)[stableBucket(seed, 2)]!;
}

function pickQl(cpId: Rap002CanonicalProblemId, seed: string, requested?: string) {
  if (requested) return requested;
  const ids = getRap002QuestionLanguageIds(cpId);
  return ids[stableBucket(`${seed}:ql`, ids.length)]!;
}

function ratioTerm(difficulty: Rap002DifficultyBand, seed: string) {
  const base = pick(RATIO_TERMS[difficulty], seed);
  const spread = difficulty === "Hard" ? 18 : difficulty === "Medium" ? 14 : 8;
  return base + stableBucket(`${seed}:spread`, spread) + seedSerialOffset(seed, 23);
}

function seedSerialOffset(seed: string, modulo: number) {
  const values = [...seed.matchAll(/:(\d+)/g)].map((match) => Number(match[1]));
  // A count:1 generation appends its item index (:0). Use the caller's
  // preceding diversification index when present.
  const last = values.at(-1);
  const value = last === 0 && values.length > 1 ? values.at(-2) : last;
  return Number.isFinite(value) ? value % modulo : 0;
}

function seedIndexParity(seed: string, fallbackSalt: string) {
  const match = seed.match(/:(\d+)$/);
  if (match) return Number(match[1]) % 2;
  return stableBucket(`${seed}:${fallbackSalt}`, 2);
}

function diversifyFixedVariables(seed: string, variables: Rap002Variables) {
  const factor = 1 + (seedSerialOffset(seed, 997) % 97);
  if (factor === 1) return variables;
  return Object.fromEntries(Object.entries(variables).map(([key, value]) => [
    key,
    typeof value === "number" && !/percent/i.test(key) ? value * factor : value,
  ]));
}

function scaledPick(values: readonly number[], seed: string, spread = 12) {
  return pick(values, seed) + stableBucket(`${seed}:spread`, spread) + seedSerialOffset(seed, 17);
}

function scenarioEntitySet(kind: keyof typeof SCENARIO_POOLS, seed: string) {
  return pick([...SCENARIO_POOLS[kind]], `${seed}:scenario:${kind}`);
}

function baseChainVariables(seed: string, difficulty: Rap002DifficultyBand, entities = scenarioEntitySet("neutral", seed)): Rap002Variables {
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

function addExtendedTarget(seed: string, variables: Rap002Variables, qlId: string): Rap002Variables {
  if (qlId === "RAP-QL-205") {
    return { ...variables, targetPair: "AD", targetPairLabel: `${variables.personA}:${variables.personD}` };
  }
  if (qlId === "RAP-QL-206") {
    return { ...variables, targetPair: "BD", targetPairLabel: `${variables.personB}:${variables.personD}` };
  }
  if (qlId === "RAP-QL-207") {
    return { ...variables, targetPair: "AC", targetPairLabel: `${variables.personA}:${variables.personC}` };
  }
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
  const variables = baseChainVariables(seed, difficulty, scenarioEntitySet("neutral", seed));
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
  const scale = scaledPick([4, 5, 6, 8, 10, 12], `${seed}:scale`);
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
  if (qlId === "RAP-QL-407" || qlId === "RAP-QL-408" || qlId === "RAP-QL-409") {
    const serialScale = 1 + seedSerialOffset(seed, 251);
    const turnoutPercent = pick([60, 70, 75, 80, 85], `${seed}:turnout`);
    const validPercent = pick([90, 92, 95, 96], `${seed}:valid`);
    let voteRatioA = pick([3, 4, 5, 7], `${seed}:voteA`);
    let voteRatioB = pick([2, 3, 4, 5], `${seed}:voteB`);
    if (voteRatioA <= voteRatioB) voteRatioA = voteRatioB + 2;
    const ratioSum = voteRatioA + voteRatioB;
    let voteUnit = pick([100, 200, 250, 400, 500], `${seed}:voteUnit`);
    let totalVoters = ratioSum * voteUnit * 10000 / (turnoutPercent * validPercent);
    while (!Number.isInteger(totalVoters)) {
      voteUnit += 10;
      totalVoters = ratioSum * voteUnit * 10000 / (turnoutPercent * validPercent);
    }
    const marginVotes = (voteRatioA - voteRatioB) * voteUnit;
    return {
      candidateA: "Candidate A",
      candidateB: "Candidate B",
      totalVoters: totalVoters * serialScale,
      turnoutPercent,
      validPercent,
      voteRatioA,
      voteRatioB,
      marginVotes: marginVotes * serialScale,
    };
  }

  const entities = scenarioEntitySet("neutral", seed);
  let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
  let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
  if (ratioA === ratioB) ratioB += 1;

  const scale = scaledPick([8, 10, 12, 15, 20], `${seed}:scale`, 20);
  const initialA = ratioA * scale;
  const initialB = ratioB * scale;
  const totalValue = initialA + initialB;
  const valueAddA = scaledPick([4, 5, 6, 8, 10, 12], `${seed}:addA`);
  const valueAddB = scaledPick([2, 4, 5, 6, 8, 10], `${seed}:addB`);
  const commonAdd = scaledPick([3, 4, 5, 6, 8], `${seed}:commonAdd`);
  const valueRemoveA = Math.min(initialA - 1, scaledPick([2, 3, 4, 5, 6], `${seed}:removeA`));
  const valueRemoveB = Math.min(initialB - 1, scaledPick([2, 4, 5, 6, 8], `${seed}:removeB`));
  const commonRemove = Math.min(initialA, initialB) > 2
    ? Math.min(Math.min(initialA, initialB) - 1, scaledPick([2, 3, 4, 5], `${seed}:commonRemove`))
    : 1;
  const transferValue = Math.min(Math.min(initialA, initialB) - 1, scaledPick([2, 4, 5, 6, 8], `${seed}:transfer`));

  if (qlId === "RAP-QL-405" || qlId === "RAP-QL-416") {
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

  if (qlId === "RAP-QL-417") {
    const finalA = initialA;
    const finalB = initialB - valueRemoveB;
    const [finalRatioA, finalRatioB] = simplifyRatio([finalA, finalB]);
    return {
      personA: entities[0]!,
      personB: entities[1]!,
      finalRatioA,
      finalRatioB,
      valueRemoveB,
      totalValue,
    };
  }

  if (qlId === "RAP-QL-406" || qlId === "RAP-QL-418" || qlId === "RAP-QL-427") {
    const direction = qlId === "RAP-QL-427" ? "B_TO_A" : "A_TO_B";
    const finalA = direction === "A_TO_B" ? initialA - transferValue : initialA + transferValue;
    const finalB = direction === "A_TO_B" ? initialB + transferValue : initialB - transferValue;
    const [finalRatioA, finalRatioB] = simplifyRatio([finalA, finalB]);
    return {
      personA: entities[0]!,
      personB: entities[1]!,
      finalRatioA,
      finalRatioB,
      transferValue,
      totalValue,
      transferDirection: direction,
    };
  }

  if (qlId === "RAP-QL-422") {
    const [finalRatioA, finalRatioB] = simplifyRatio([initialA + commonAdd, initialB + commonAdd]);
    return {
      personA: entities[0]!,
      personB: entities[1]!,
      ratioA,
      ratioB,
      totalValue,
      finalRatioA,
      finalRatioB,
    };
  }

  if (qlId === "RAP-QL-423") {
    const [finalRatioA, finalRatioB] = simplifyRatio([initialA - transferValue, initialB + transferValue]);
    return {
      personA: entities[0]!,
      personB: entities[1]!,
      ratioA,
      ratioB,
      totalValue,
      finalRatioA,
      finalRatioB,
      transferDirection: "A_TO_B",
    };
  }

  if (qlId === "RAP-QL-429") {
    const finalA = initialA + valueAddA;
    const finalB = initialB;
    const [finalRatioA, finalRatioB] = simplifyRatio([finalA, finalB]);
    return {
      personA: entities[0]!,
      personB: entities[1]!,
      finalRatioA,
      finalRatioB,
      valueAddA,
      finalValueA: finalA,
    };
  }

  if (qlId === "RAP-QL-424") {
    return { personA: "boys", personB: "girls", ratioA, ratioB, totalValue, valueAddB };
  }

  if (qlId === "RAP-QL-425") {
    return { personA: "type A items", personB: "type B items", ratioA, ratioB, totalValue, valueRemoveB };
  }

  if (qlId === "RAP-QL-426") {
    return { personA: "Group A", personB: "Group B", ratioA, ratioB, totalValue, transferValue, transferDirection: "B_TO_A" };
  }

  return {
    personA: entities[0]!,
    personB: entities[1]!,
    ratioA,
    ratioB,
    totalValue,
    ...(qlId === "RAP-QL-410" ? { commonAdd } : {}),
    ...(qlId === "RAP-QL-411" ? { commonRemove } : {}),
    ...(qlId === "RAP-QL-412" ? { valueAddA } : {}),
    ...(qlId === "RAP-QL-413" ? { valueRemoveB } : {}),
    ...(qlId === "RAP-QL-414" ? { transferValue, transferDirection: "A_TO_B" } : {}),
    ...(qlId === "RAP-QL-415" ? { transferValue, transferDirection: "B_TO_A" } : {}),
    ...(qlId === "RAP-QL-419" ? { valueAddA, valueRemoveB } : {}),
    ...(qlId === "RAP-QL-420" ? { valueAddA, valueAddB } : {}),
    ...(qlId === "RAP-QL-421" ? { valueRemoveA, valueRemoveB } : {}),
    ...(qlId === "RAP-QL-428" ? { valueRemoveA, valueAddB } : {}),
    ...(qlId === "RAP-QL-401" ? { valueAddA, valueAddB } : {}),
    ...(qlId === "RAP-QL-402" ? { valueAddA, valueRemoveB } : {}),
    ...(qlId === "RAP-QL-403" ? { transferValue, transferDirection: "B_TO_A" } : {}),
    ...(qlId === "RAP-QL-404" ? { transferValue, transferDirection: "A_TO_B" } : {}),
  };
}

function scaleIncomeSavingsCase<T extends { savingsA: number; savingsB: number }>(selected: T, scale: number): T {
  return {
    ...selected,
    savingsA: selected.savingsA * scale,
    savingsB: selected.savingsB * scale,
  };
}

function basePartitionVariables(seed: string, difficulty: Rap002DifficultyBand, qlId: string): Rap002Variables {
  if (qlId === "RAP-QL-507" || qlId === "RAP-QL-508") {
    const serialScale = 1 + seedSerialOffset(seed, 251);
    const cases = [
      { incomeRatioA: 3, incomeRatioB: 2, expRatioA: 5, expRatioB: 3, savingsA: 1000, savingsB: 1000 },
      { incomeRatioA: 4, incomeRatioB: 3, expRatioA: 5, expRatioB: 4, savingsA: 2500, savingsB: 1500 },
      { incomeRatioA: 5, incomeRatioB: 4, expRatioA: 3, expRatioB: 2, savingsA: 4000, savingsB: 5000 },
      { incomeRatioA: 7, incomeRatioB: 5, expRatioA: 4, expRatioB: 3, savingsA: 6000, savingsB: 3000 },
    ];
    return {
      personA: "A",
      personB: "B",
      ...scaleIncomeSavingsCase(pick(cases, `${seed}:incomeCase`), serialScale),
    };
  }

  const entities = scenarioEntitySet("partition", seed);
  let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
  let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
  let subRatioC = ratioTerm(difficulty, `${seed}:subC`);
  let subRatioD = ratioTerm(difficulty, `${seed}:subD`);
  if (ratioA === ratioB) ratioB += 1;
  if (subRatioC === subRatioD) subRatioD += 1;

  const subTotalRatio = subRatioC + subRatioD;
  const mainUnit = subTotalRatio * scaledPick([4, 5, 6, 8, 10], `${seed}:unit`, 14);
  const totalValue = (ratioA + ratioB) * mainUnit;
  const branchPart = qlId === "RAP-QL-502" || qlId === "RAP-QL-504" || qlId === "RAP-QL-506" ? "B" : "A";
  const targetSubPart = qlId === "RAP-QL-502" || qlId === "RAP-QL-504" ? "D" : "C";
  const branchShare = branchPart === "A" ? ratioA * mainUnit : ratioB * mainUnit;
  const thresholdValue = Math.max(1, branchShare - scaledPick([5, 10, 12, 15, 20], `${seed}:thresholdGap`));
  const weightC = scaledPick([2, 3, 4, 5, 6], `${seed}:weightC`, 6);
  const weightD = scaledPick([3, 4, 5, 6, 8], `${seed}:weightD`, 6);

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
  if (qlId === "RAP-QL-607") {
    const offset = seedSerialOffset(seed, 251);
    let speedRatioA = pick([3, 4, 5, 6, 7], `${seed}:speedA`) + offset;
    let speedRatioB = pick([4, 5, 6, 7, 8], `${seed}:speedB`) + offset;
    if (speedRatioA === speedRatioB) speedRatioB += 1;
    const distanceRatioA = pick([1, 2, 3, 4, 5], `${seed}:distanceA`);
    const distanceRatioB = pick([1, 2, 3, 4, 5], `${seed}:distanceB`);
    return { personA: "Vehicle A", personB: "Vehicle B", speedRatioA, speedRatioB, distanceRatioA, distanceRatioB };
  }
  if (qlId === "RAP-QL-608") {
    const offset = seedSerialOffset(seed, 251);
    const raceLength = pick([400, 500, 800, 1000, 1200], `${seed}:raceLength`);
    const leadDistance = pick([20, 40, 50, 80, 100], `${seed}:lead`);
    return { personA: "Runner A", personB: "Runner B", raceLength: raceLength + offset * 10, leadDistance: leadDistance + offset };
  }

  const serial = seedSerialOffset(seed, 251);
  const speedPair = scenarioEntitySet("speed", seed);
  const workPair = scenarioEntitySet("work", seed);

  if (qlId === "RAP-QL-609") {
    const ratioA = pick([3, 4, 5, 6], `${seed}:ratioA`);
    const ratioB = pick([6, 8, 9, 10, 12], `${seed}:ratioB`);
    return { personA: workPair[0]!, personB: workPair[1]!, ratioA, ratioB, valueB: ratioA * (4 + serial) };
  }

  if (qlId === "RAP-QL-610" || qlId === "RAP-QL-613") {
    const ratioA = pick([3, 4, 5, 6, 8], `${seed}:ratioA`) + serial;
    let ratioB = pick([5, 6, 7, 9, 10], `${seed}:ratioB`) + serial;
    if (ratioA === ratioB) ratioB += 1;
    return { personA: qlId === "RAP-QL-613" ? "Pipe A" : workPair[0]!, personB: qlId === "RAP-QL-613" ? "Pipe B" : workPair[1]!, ratioA, ratioB };
  }

  if (qlId === "RAP-QL-611" || qlId === "RAP-QL-616") {
    return {
      personA: "Team A",
      personB: "Team B",
      workerRatioA: pick([3, 4, 5, 6], `${seed}:workerA`) + serial,
      workerRatioB: pick([4, 5, 6, 8], `${seed}:workerB`) + serial,
      efficiencyRatioA: pick([2, 3, 4, 5], `${seed}:effA`),
      efficiencyRatioB: pick([3, 4, 5, 6], `${seed}:effB`),
    };
  }

  if (qlId === "RAP-QL-614" || qlId === "RAP-QL-620") {
    return {
      ...pick([
        { initialWorkers: 20, originalDays: 12, daysWorked: 6, addedWorkers: 10 },
        { initialWorkers: 15, originalDays: 20, daysWorked: 4, addedWorkers: 5 },
        { initialWorkers: 12, originalDays: 16, daysWorked: 4, addedWorkers: 12 },
        { initialWorkers: 18, originalDays: 24, daysWorked: 6, addedWorkers: 9 },
      ], `${seed}:joiningWorkers`),
      workerChangeDirection: "JOIN",
    };
  }

  if (qlId === "RAP-QL-615") {
    return {
      personA: "Team A",
      personB: "Team B",
      workerRatioA: pick([2, 3, 4, 5], `${seed}:workerA`),
      workerRatioB: pick([3, 4, 5, 6], `${seed}:workerB`),
      hoursRatioA: pick([4, 5, 6, 8], `${seed}:hoursA`),
      hoursRatioB: pick([3, 4, 5, 7], `${seed}:hoursB`),
      efficiencyRatioA: pick([2, 3, 5], `${seed}:effA`),
      efficiencyRatioB: pick([3, 4, 6], `${seed}:effB`),
    };
  }

  if (qlId === "RAP-QL-617" || qlId === "RAP-QL-618") {
    const speedRatioA = pick([3, 4, 5, 6, 7], `${seed}:speedA`) + serial;
    let speedRatioB = pick([4, 5, 6, 8, 9], `${seed}:speedB`) + serial;
    if (speedRatioA === speedRatioB) speedRatioB += 1;
    return { personA: speedPair[0]!, personB: speedPair[1]!, speedRatioA, speedRatioB, ...(qlId === "RAP-QL-618" ? { fixedTimeMode: "YES" } : {}) };
  }

  if (qlId === "RAP-QL-621") {
    const initialWorkers = pick([18, 20, 24, 30], `${seed}:initialWorkers`);
    const originalDays = pick([12, 15, 18, 20], `${seed}:originalDays`);
    const daysWorked = pick([3, 4, 5], `${seed}:daysWorked`);
    const remainingWorkers = pick([9, 10, 12, 15], `${seed}:remainingWorkers`);
    return { initialWorkers, originalDays, daysWorked, remainingWorkers, workerChangeDirection: "LEAVE" };
  }

  if (qlId === "RAP-QL-622" || qlId === "RAP-QL-629") {
    return {
      personA: "Team A",
      personB: "Team B",
      workerRatioA: pick([3, 4, 5, 6], `${seed}:workerA`),
      workerRatioB: pick([4, 5, 6, 8], `${seed}:workerB`),
      daysRatioA: pick([5, 6, 8, 9], `${seed}:daysA`),
      daysRatioB: pick([3, 4, 5, 6], `${seed}:daysB`),
    };
  }

  if (qlId === "RAP-QL-623") {
    return {
      personA: "Machine group A",
      personB: "Machine group B",
      machineRatioA: pick([2, 3, 4], `${seed}:machineA`),
      machineRatioB: pick([3, 4, 5], `${seed}:machineB`),
      hoursRatioA: pick([4, 5, 6], `${seed}:hoursA`),
      hoursRatioB: pick([3, 4, 5], `${seed}:hoursB`),
      outputRatioA: pick([5, 6, 8, 9], `${seed}:outputA`),
      outputRatioB: pick([4, 5, 7, 10], `${seed}:outputB`),
    };
  }

  if (qlId === "RAP-QL-624") {
    return pick([
      { menA: 12, daysA: 16, menB: 24 },
      { menA: 10, daysA: 18, menB: 20 },
      { menA: 15, daysA: 20, menB: 25 },
      { menA: 18, daysA: 24, menB: 27 },
    ], `${seed}:menDaysCase`);
  }

  if (qlId === "RAP-QL-625") {
    return {
      baseWorkers: 30,
      baseDays: 20,
      workNumerator: pick([1, 2, 3], `${seed}:num`),
      workDenominator: pick([4, 5, 6], `${seed}:den`),
      targetDays: 10,
    };
  }

  if (qlId === "RAP-QL-626") {
    return {
      personA: "Worker A",
      personB: "Worker B",
      efficiencyRatioA: pick([2, 3, 4, 5], `${seed}:effA`),
      efficiencyRatioB: pick([3, 4, 5, 6], `${seed}:effB`),
      timeRatioA: pick([4, 5, 6], `${seed}:timeA`),
      timeRatioB: pick([3, 4, 5], `${seed}:timeB`),
    };
  }

  if (qlId === "RAP-QL-627") {
    const speedRatioA = pick([3, 4, 5], `${seed}:speedA`) + serial;
    const speedRatioB = speedRatioA + pick([1, 2], `${seed}:speedB`);
    const speedRatioC = speedRatioB + pick([1, 2], `${seed}:speedC`);
    return { personA: "Car A", personB: "Car B", personC: "Car C", speedRatioA, speedRatioB, speedRatioC };
  }

  if (qlId === "RAP-QL-628") {
    return {
      personA: "Machine A",
      personB: "Machine B",
      quantityRatioA: pick([5, 6, 8, 9], `${seed}:qtyA`),
      quantityRatioB: pick([4, 5, 7, 10], `${seed}:qtyB`),
      timeRatioA: pick([3, 4, 5], `${seed}:timeA`),
      timeRatioB: pick([4, 5, 6], `${seed}:timeB`),
    };
  }

  if (qlId === "RAP-QL-630") {
    const efficiencyPartA = pick([2, 3, 4, 5], `${seed}:effPartA`);
    const workerRatioA = pick([2, 3, 4], `${seed}:workerA`);
    const workerRatioB = pick([3, 4, 5], `${seed}:workerB`);
    const hoursRatioA = pick([4, 5, 6], `${seed}:hoursA`);
    const hoursRatioB = pick([2, 3, 4], `${seed}:hoursB`);
    const missing = pick([2, 3, 4, 5, 6], `${seed}:missingEff`);
    const outputRatioA = workerRatioA * hoursRatioA * efficiencyPartA;
    const outputRatioB = workerRatioB * hoursRatioB * missing;
    return { personA: "Team A", personB: "Team B", outputRatioA, outputRatioB, workerRatioA, workerRatioB, hoursRatioA, hoursRatioB, efficiencyPartA };
  }

  const entities = qlId === "RAP-QL-603" || qlId === "RAP-QL-604" || qlId === "RAP-QL-606"
    ? scenarioEntitySet("speed", seed)
    : scenarioEntitySet("work", seed);
  let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
  let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
  if (ratioA === ratioB) ratioB += 1;
  const scale = scaledPick([4, 5, 6, 8, 10, 12], `${seed}:scale`);
  const timeRatioA = ratioTerm(difficulty, `${seed}:timeA`);
  let timeRatioB = ratioTerm(difficulty, `${seed}:timeB`);
  if (timeRatioA === timeRatioB) timeRatioB += 1;

  if (qlId === "RAP-QL-602" || qlId === "RAP-QL-604") {
    const chain = baseChainVariables(seed, difficulty, qlId === "RAP-QL-604" ? scenarioEntitySet("speed", seed) : scenarioEntitySet("work", seed));
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
    ...(qlId === "RAP-QL-601" || qlId === "RAP-QL-603" || qlId === "RAP-QL-612" ? { valueA: ratioB * (scale + seedSerialOffset(seed, 251)) } : {}),
    ...(qlId === "RAP-QL-605" || qlId === "RAP-QL-606" || qlId === "RAP-QL-619" ? { timeRatioA, timeRatioB } : {}),
  };
}

function hasDuplicates(values: readonly number[]) {
  return new Set(values).size !== values.length;
}

function avoidComparisonTies(
  variables: Rap002Variables,
  difficulty: Rap002DifficultyBand,
  qlId: string,
  seed: string,
): Rap002Variables {
  let candidate = { ...variables };
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const three = alignChainRatios(
      [Number(candidate.ratioA1), Number(candidate.ratioB1)],
      [Number(candidate.ratioB2), Number(candidate.ratioC2)],
    );
    const four = candidate.ratioC3 !== undefined
      ? alignThreeChainRatios(
          [Number(candidate.ratioA1), Number(candidate.ratioB1)],
          [Number(candidate.ratioB2), Number(candidate.ratioC2)],
          [Number(candidate.ratioC3), Number(candidate.ratioD3)],
        )
      : [];

    const noTie =
      qlId === "RAP-QL-701"
        ? !hasDuplicates(three)
        : qlId === "RAP-QL-702"
          ? !hasDuplicates(four)
          : qlId === "RAP-QL-703"
            ? three[0] !== three[2]
            : qlId === "RAP-QL-704"
              ? four[1] !== four[3]
              : true;
    if (noTie) return candidate;

    candidate = {
      ...candidate,
      ratioC2: ratioTerm(difficulty, `${seed}:tie-c2:${attempt}`) + attempt + 1,
      ...(candidate.ratioC3 !== undefined
        ? {
            ratioC3: ratioTerm(difficulty, `${seed}:tie-c3:${attempt}`) + attempt + 1,
            ratioD3: ratioTerm(difficulty, `${seed}:tie-d3:${attempt}`) + attempt + 2,
          }
        : {}),
    };
  }
  return candidate;
}

function baseComparisonVariables(seed: string, difficulty: Rap002DifficultyBand, qlId: string): Rap002Variables {
  if (qlId === "RAP-QL-706") {
    let ratioA = ratioTerm(difficulty, `${seed}:ratioA`);
    let ratioB = ratioTerm(difficulty, `${seed}:ratioB`);
    if (ratioA === ratioB) ratioB += 1;
    const multiplier = pick([2, 3, 4, 5], `${seed}:equivalentMultiplier`);
    const makeEquivalent = seedIndexParity(seed, "equivalenceCase") !== 0;
    return {
      ratioA,
      ratioB,
      equivalentA: ratioA * multiplier,
      equivalentB: makeEquivalent ? ratioB * multiplier : ratioB * multiplier + 1,
    };
  }

  const variables = baseChainVariables(seed, difficulty, scenarioEntitySet("neutral", seed));
  let adjustedVariables = variables;
  if (qlId === "RAP-QL-701" || qlId === "RAP-QL-702" || qlId === "RAP-QL-703" || qlId === "RAP-QL-704") {
    adjustedVariables = avoidComparisonTies(variables, difficulty, qlId, seed);
  }
  if (qlId === "RAP-QL-701" || qlId === "RAP-QL-703" || qlId === "RAP-QL-705") {
    const aligned = alignChainRatios(
      [Number(adjustedVariables.ratioA1), Number(adjustedVariables.ratioB1)],
      [Number(adjustedVariables.ratioB2), Number(adjustedVariables.ratioC2)],
    );
    const endpoint = simplifyRatio([aligned[0]!, aligned[2]!]);
    const makeEquivalent = qlId !== "RAP-QL-705" || seedIndexParity(seed, "endpointEquivalenceCase") === 0;
    return {
      personA: adjustedVariables.personA,
      personB: adjustedVariables.personB,
      personC: adjustedVariables.personC,
      ratioA1: adjustedVariables.ratioA1,
      ratioB1: adjustedVariables.ratioB1,
      ratioB2: adjustedVariables.ratioB2,
      ratioC2: adjustedVariables.ratioC2,
      ...(qlId === "RAP-QL-703" ? { comparisonPair: "AC" } : {}),
      ...(qlId === "RAP-QL-705" ? { endpointA: endpoint[0]!, endpointC: makeEquivalent ? endpoint[1]! : endpoint[1]! + 1 } : {}),
    };
  }

  return {
    ...adjustedVariables,
    ...(qlId === "RAP-QL-704" ? { comparisonPair: "BD" } : {}),
  };
}

function phase2FixedVariables(qlId: string): Rap002Variables | undefined {
  const chain = {
    personA: "A",
    personB: "B",
    personC: "C",
    personD: "D",
    ratioA1: 2,
    ratioB1: 3,
    ratioB2: 4,
    ratioC2: 5,
    ratioC3: 2,
    ratioD3: 3,
  };
  const chainNumber = Number(qlId.replace("RAP-QL-", ""));
  if (chainNumber >= 213 && chainNumber <= 228) {
    if (qlId === "RAP-QL-217" || qlId === "RAP-QL-226") {
      return addMissingChainVariables(chain);
    }
    if (qlId === "RAP-QL-214" || qlId === "RAP-QL-216" || qlId === "RAP-QL-220" || qlId === "RAP-QL-222" || qlId === "RAP-QL-224" || qlId === "RAP-QL-225" || qlId === "RAP-QL-228") {
      return { ...chain, targetPair: qlId === "RAP-QL-216" ? "BD" : "AD", targetPairLabel: qlId === "RAP-QL-216" ? "B:D" : "A:D" };
    }
    return chain;
  }

  if (chainNumber >= 307 && chainNumber <= 324) {
    const reverse = {
      personA: "A",
      personB: "B",
      personC: "C",
      ratioA1: 2,
      ratioB1: 3,
      ratioB2: 4,
      ratioC2: 5,
      valueA: 16,
      valueB: 24,
      valueC: 30,
      valueDifference: 14,
      totalValue: 70,
      targetEndpoint: qlId === "RAP-QL-308" || qlId === "RAP-QL-316" || qlId === "RAP-QL-321" ? "A" : "C",
      constraintKind: qlId === "RAP-QL-310" || qlId === "RAP-QL-312" || qlId === "RAP-QL-313" || qlId === "RAP-QL-322" ? "total" : "difference",
    };
    if (qlId === "RAP-QL-307" || qlId === "RAP-QL-308" || qlId === "RAP-QL-315" || qlId === "RAP-QL-319" || qlId === "RAP-QL-320") return reverse;
    if (qlId === "RAP-QL-309" || qlId === "RAP-QL-314" || qlId === "RAP-QL-316" || qlId === "RAP-QL-321" || qlId === "RAP-QL-324") return reverse;
    return reverse;
  }

  if (chainNumber >= 509 && chainNumber <= 526) {
    return {
      personA: "Group A",
      personB: "Group B",
      personC: "Part C",
      personD: "Part D",
      ratioA: 3,
      ratioB: 2,
      subRatioC: 4,
      subRatioD: 1,
      totalValue: 500,
      branchPart: qlId === "RAP-QL-510" || qlId === "RAP-QL-516" || qlId === "RAP-QL-517" ? "B" : "A",
      targetSubPart: qlId === "RAP-QL-509" || qlId === "RAP-QL-522" ? "D" : "C",
      thresholdValue: 200,
      weightC: 5,
      weightD: 2,
    };
  }

  if (chainNumber >= 707 && chainNumber <= 724) {
    if (qlId === "RAP-QL-711" || qlId === "RAP-QL-712" || qlId === "RAP-QL-713" || qlId === "RAP-QL-722") {
      return { ratioA: 3, ratioB: 5, equivalentA: 12, equivalentB: 20 };
    }
    if (qlId === "RAP-QL-718") {
      return { ...chain, endpointA: 8, endpointC: 15 };
    }
    return {
      ...chain,
      comparisonPair: qlId === "RAP-QL-710" || qlId === "RAP-QL-717" ? "BD" : "AC",
      endpointA: 8,
      endpointC: 15,
    };
  }
  return undefined;
}

export function generateRap002Parameters(input: Rap002ParameterInput = {}): Rap002Parameters {
  const cpId = input.canonicalProblemId ?? "RAP-CP-007";
  if (cpId !== "RAP-CP-007" && cpId !== "RAP-CP-008" && cpId !== "RAP-CP-009" && cpId !== "RAP-CP-010" && cpId !== "RAP-CP-011" && cpId !== "RAP-CP-012") throw new Error(`RAP-002 MVP only supports RAP-CP-007 to RAP-CP-012. Received ${cpId}.`);

  const seed = input.seed ?? `RAP-002:${cpId}`;
  const language = input.language ?? "en";

  const qlId = pickQl(cpId, seed, input.questionLanguageId);
  const registry = getRap002RegistryEntry(qlId);
  const difficulty = input.difficultyBand ?? registry.difficulty ?? pickDifficulty(seed);
  const fixedVariables = phase2FixedVariables(qlId);
  let variables = fixedVariables ? diversifyFixedVariables(seed, fixedVariables) : baseChainVariables(seed, difficulty);
  if (!fixedVariables && cpId === "RAP-CP-008") {
    variables = baseReverseChainVariables(seed, difficulty, qlId);
  } else if (!fixedVariables && cpId === "RAP-CP-009") {
    variables = baseTransformationVariables(seed, difficulty, qlId);
  } else if (!fixedVariables && cpId === "RAP-CP-010") {
    variables = basePartitionVariables(seed, difficulty, qlId);
  } else if (!fixedVariables && cpId === "RAP-CP-011") {
    variables = baseInverseVariables(seed, difficulty, qlId);
  } else if (!fixedVariables && cpId === "RAP-CP-012") {
    variables = baseComparisonVariables(seed, difficulty, qlId);
  }

  if (!fixedVariables && cpId === "RAP-CP-007" && registry.taskKind === "extendedChainAlignment") {
    variables = addExtendedTarget(seed, variables, qlId);
  } else if (!fixedVariables && cpId === "RAP-CP-007" && registry.taskKind === "missingChainRatio") {
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
      questionLanguageSource: `question-language.${language}.json`,
      explanationSource: language === "en" ? "explanation.en.json" : `explanation.${language}.json`,
      variableRangeSource: "variable-ranges.library.json",
    },
  };
}
