import { add, multiply, parseNumericLiteral } from "./exact";
import type { SapCp003Option, SapCp003Package } from "./types";

function sanitiseDecimalFractionBracketDistractor(pkg: SapCp003Package): SapCp003Package {
  if (
    pkg.prototypeId !== "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION"
    || !pkg.generationIdentity.includes("MIXED_BRACKET_TIMES_QUANTITY")
  ) return pkg;

  const match = pkg.stem.match(/^Evaluate \(([0-9.]+) \+ (\d+\/\d+)\) × (\d+)\.$/);
  if (!match) throw new Error(`${pkg.prototypeId}/${pkg.seed}: could not read the visible bracket frame.`);
  const decimal = parseNumericLiteral(match[1]!)!;
  const fraction = parseNumericLiteral(match[2]!)!;
  const quantity = parseNumericLiteral(match[3]!)!;
  const visibleWrongValue = add(multiply(decimal, quantity), fraction);
  const visibleWrongText = visibleWrongValue.d === 1n
    ? visibleWrongValue.n.toString()
    : Number(visibleWrongValue.n) / Number(visibleWrongValue.d) % 1 === 0
      ? (Number(visibleWrongValue.n) / Number(visibleWrongValue.d)).toString()
      : `${visibleWrongValue.n}/${visibleWrongValue.d}`;

  const options: readonly SapCp003Option[] = Object.freeze(pkg.options.map((option) =>
    option.misconceptionId === "MULTIPLIER_APPLIED_TO_DECIMAL_ONLY"
      ? Object.freeze({
        ...option,
        value: visibleWrongText,
        analysis: `The multiplier ${match[3]} was applied only to ${match[1]}, while ${match[2]} remained outside the product.`,
      })
      : option,
  ));
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  if (!optionUniquenessPassed) {
    throw new Error(`${pkg.prototypeId}/${pkg.seed}: visible bracket distractor duplicates another option.`);
  }
  return Object.freeze({
    ...pkg,
    options,
    validation: Object.freeze({
      ...pkg.validation,
      optionUniquenessPassed,
      ok: pkg.validation.ok && optionUniquenessPassed,
    }),
  });
}

export function applySapCp003StructuralVariantsV5(pkg: SapCp003Package): SapCp003Package {
  return sanitiseDecimalFractionBracketDistractor(pkg);
}
