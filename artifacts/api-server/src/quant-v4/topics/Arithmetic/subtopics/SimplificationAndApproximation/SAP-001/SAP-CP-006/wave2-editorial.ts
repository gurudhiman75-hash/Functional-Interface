import {
  generateSapCp006Wave2,
  type SapCp006Wave2Package,
  type SapCp006Wave2PrototypeId,
} from "./runtime-wave2";

export function generateSapCp006Wave2Editorial(
  prototypeId: SapCp006Wave2PrototypeId,
  seed: number,
): SapCp006Wave2Package {
  const pkg = generateSapCp006Wave2(prototypeId, seed);

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
    generationIdentity: `${pkg.generationIdentity}:EDITORIAL-V1`,
  });
}
