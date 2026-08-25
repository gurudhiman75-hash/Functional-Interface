import { powerNormalFormKey, type PowerNormalForm } from "./power-normal-form";
import { normalizeRationalPower } from "./power-normal-form";
import type { Rational } from "./rational";
import type { RationalExponent } from "./rational-exponent";

export function equivalentPowerForms(a: PowerNormalForm, b: PowerNormalForm): boolean {
  return powerNormalFormKey(a) === powerNormalFormKey(b);
}

export function equivalentRationalPowers(
  leftBase: Rational,
  leftExponent: RationalExponent,
  rightBase: Rational,
  rightExponent: RationalExponent,
): boolean {
  return equivalentPowerForms(
    normalizeRationalPower(leftBase, leftExponent),
    normalizeRationalPower(rightBase, rightExponent),
  );
}
