import {
  generateSapCp006Wave2,
  type SapCp006Wave2Package,
  type SapCp006Wave2PrototypeId,
} from "./runtime-wave2";

function independentFourWayCorrectIndex(seed: number): number {
  const zeroBased = seed - 1;
  const withinBlock = zeroBased % 4;
  const block = Math.floor(zeroBased / 4);
  return (withinBlock + block) % 4;
}

function decoupleOptionPlacement(pkg: SapCp006Wave2Package, seed: number): SapCp006Wave2Package {
  const correctIndex = independentFourWayCorrectIndex(seed);
  const correct = pkg.options.find((option) => option.isCorrect);
  if (!correct) throw new Error(`${pkg.prototypeId}: package has no correct option.`);
  const wrong = pkg.options.filter((option) => !option.isCorrect);
  if (wrong.length !== 3) throw new Error(`${pkg.prototypeId}: package must contain exactly three distractors.`);
  const options = [...wrong];
  options.splice(correctIndex, 0, correct);
  return Object.freeze({
    ...pkg,
    options: Object.freeze(options),
    correctIndex,
    generationIdentity: `${pkg.generationIdentity}:DECOUPLED-OPTION-POS-${correctIndex}`,
  });
}

export function generateSapCp006Wave2Editorial(
  prototypeId: SapCp006Wave2PrototypeId,
  seed: number,
): SapCp006Wave2Package {
  const base = generateSapCp006Wave2(prototypeId, seed);
  const pkg = decoupleOptionPlacement(base, seed);

  if (prototypeId !== "SAP-CP006-PROT-MISSING-MIXED-DIVIDEND") return pkg;

  const d = pkg.oracle.data;
  const steps = Object.freeze([
    `Remove the known terms ${d.value} and ${d.percentValue}. The remaining quotient is ${d.quotient}.`,
    `Multiply the quotient ${d.quotient} by the fixed divisor ${d.divisor}; the missing dividend is ${pkg.canonicalAnswer}.`,
  ]);
  const verification = Object.freeze([
    `Dividing ${pkg.canonicalAnswer} by ${d.divisor} gives the required quotient ${d.quotient}.`,
    `Adding the known values ${d.value} and ${d.percentValue} then reproduces the target ${d.target}.`,
  ]);

  return Object.freeze({
    ...pkg,
    explanation: Object.freeze({
      ...pkg.explanation,
      steps,
      verification,
    }),
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V2`,
  });
}
