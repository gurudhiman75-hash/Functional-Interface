import type { SapCp006Option, SapCp006Package, SapCp006PrototypeId } from "./runtime";
import { generateSapCp006Editorial as generateV2 } from "./editorial-runtime-v2";

function independentFourWayCorrectIndex(seed: number): number {
  // Use a Latin-cycle placement rule. Within each four consecutive seeds all
  // four answer positions occur, and the mapping shifts by one position in the
  // next block. This prevents seed % 4 mathematical states from being locked to
  // a single answer position while preserving exact 100/100/100/100 balance
  // over seeds 1..400.
  const zeroBased = seed - 1;
  const withinBlock = zeroBased % 4;
  const block = Math.floor(zeroBased / 4);
  return (withinBlock + block) % 4;
}

function repositionCorrectOption(base: SapCp006Package, seed: number, marker: string): SapCp006Package {
  const correctIndex = independentFourWayCorrectIndex(seed);
  const correct = base.options.find((option) => option.isCorrect);
  if (!correct) throw new Error(`${marker}: package has no correct option.`);
  const wrong = base.options.filter((option) => !option.isCorrect);
  if (wrong.length !== 3) throw new Error(`${marker}: package must contain exactly three distractors.`);
  const options = [...wrong];
  options.splice(correctIndex, 0, correct);
  return Object.freeze({
    ...base,
    options: Object.freeze(options),
    correctIndex,
    generationIdentity: `${base.generationIdentity}:${marker}:OPTION-POS-${correctIndex}`,
  });
}

function orderingPermutationIndex(seed: number): number {
  // Use a state distinct from the answer-position cycle. The multiplier is
  // coprime to 24, so the 24 label permutations are exercised repeatedly.
  const zeroBased = seed - 1;
  return (zeroBased * 7 + Math.floor(zeroBased / 4) * 5) % 24;
}

function permutationForIndex(index: number): readonly number[] {
  const pool = [0, 1, 2, 3];
  const result: number[] = [];
  const factorials = [6, 2, 1, 1];
  let remaining = ((index % 24) + 24) % 24;
  for (let position = 0; position < 4; position += 1) {
    const block = factorials[position]!;
    const poolIndex = Math.floor(remaining / block);
    remaining %= block;
    result.push(pool.splice(poolIndex, 1)[0]!);
  }
  return Object.freeze(result);
}

function decimalFromHundredths(value: number): string {
  return `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
}

function orderingOptions(
  answer: string,
  orderedLabels: readonly string[],
  correctIndex: number,
): readonly SapCp006Option[] {
  const reverse = [...orderedLabels].reverse().join(" < ");
  const swapMiddle = [orderedLabels[0]!, orderedLabels[2]!, orderedLabels[1]!, orderedLabels[3]!].join(" < ");
  const firstPairSwap = [orderedLabels[1]!, orderedLabels[0]!, orderedLabels[2]!, orderedLabels[3]!].join(" < ");
  const correct: SapCp006Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This ordering matches the exact hundredth values after all four representations are converted to the same scale.",
  });
  const wrong: readonly SapCp006Option[] = Object.freeze([
    Object.freeze({
      value: reverse,
      isCorrect: false,
      misconceptionId: "ORDER_REVERSED",
      analysis: "This lists the exact values from greatest to least even though the question explicitly asks for increasing order.",
    }),
    Object.freeze({
      value: swapMiddle,
      isCorrect: false,
      misconceptionId: "MIDDLE_VALUES_SWAPPED",
      analysis: "The smallest and largest values are placed correctly, but the two middle exact values are compared in the wrong order.",
    }),
    Object.freeze({
      value: firstPairSwap,
      isCorrect: false,
      misconceptionId: "FIRST_PAIR_SWAPPED",
      analysis: "This reverses the two smallest exact values while leaving the remaining positions unchanged, so the sequence is not increasing.",
    }),
  ]);
  const options = [...wrong];
  options.splice(correctIndex, 0, correct);
  return Object.freeze(options);
}

function remodelOrderingPackage(base: SapCp006Package, seed: number): SapCp006Package {
  const sourceData = base.oracle.data;
  const sortedValues = [sourceData.aVal!, sourceData.bVal!, sourceData.cVal!, sourceData.dVal!].sort((a, b) => a - b);
  const permutationIndex = orderingPermutationIndex(seed);
  const permutation = permutationForIndex(permutationIndex);
  const assigned = permutation.map((index) => sortedValues[index]!);
  const [aVal, bVal, cVal, dVal] = assigned;
  const labels = ["A", "B", "C", "D"] as const;
  const valueByLabel = new Map<string, number>(labels.map((label, index) => [label, assigned[index]!]));
  const orderedLabels = [...labels].sort((left, right) => valueByLabel.get(left)! - valueByLabel.get(right)!);
  const answer = orderedLabels.join(" < ");
  const correctIndex = independentFourWayCorrectIndex(seed);
  const options = orderingOptions(answer, orderedLabels, correctIndex);
  const tableWrapper = seed % 2 === 1;
  const dPercent = dVal! - 10;

  const stem = tableWrapper
    ? [
        "The following small table gives four exact values:",
        `A | ${aVal}/100`,
        `B | ${bVal}%`,
        `C | ${decimalFromHundredths(cVal!)}`,
        `D | ${dPercent}% + 0.10`,
        "Arrange A, B, C and D in increasing order.",
      ].join("\n")
    : `Arrange in increasing order: A = ${aVal}/100, B = ${bVal}%, C = ${decimalFromHundredths(cVal!)}, D = ${dPercent}% + 0.10.`;

  const oracleData = Object.freeze({
    ...sourceData,
    aVal: aVal!,
    bVal: bVal!,
    cVal: cVal!,
    dVal: dVal!,
    permutationIndex,
    ...(tableWrapper ? { tableWrapper: 1 } : {}),
  });

  return Object.freeze({
    ...base,
    stem,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: base.explanation.coreConcept,
      steps: Object.freeze([
        `Convert all four entries to hundredths: A=${aVal}/100, B=${bVal}/100, C=${cVal}/100 and D=${dVal}/100.`,
        `Sort the exact numerators ${aVal}, ${bVal}, ${cVal} and ${dVal}; this gives ${answer}.`,
      ]),
      finalAnswer: `Therefore, the increasing order is ${answer}.`,
      verification: Object.freeze([
        `The four exact hundredth numerators are A=${aVal}, B=${bVal}, C=${cVal} and D=${dVal}.`,
        `Independent sorting of those four integers reproduces ${answer}.`,
      ]),
    }),
    oracle: Object.freeze({ ...base.oracle, data: oracleData }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem, answer, data: oracleData }),
    generationIdentity: `${base.generationIdentity}:ORDER-PERM-${permutationIndex}:OPTION-POS-${correctIndex}:${tableWrapper ? "TABLE" : "INLINE"}`,
  });
}

export function generateSapCp006Editorial(
  prototypeId: SapCp006PrototypeId,
  seed: number,
): SapCp006Package {
  const base = generateV2(prototypeId, seed);
  if (prototypeId === "SAP-CP006-PROT-ORDER-MIXED-REPRESENTATIONS") {
    return remodelOrderingPackage(base, seed);
  }
  if (prototypeId === "SAP-CP006-PROT-STATEMENT-COMBINATION") {
    return repositionCorrectOption(base, seed, "STATEMENT-COMBINATION-DECOUPLED");
  }
  return base;
}
