import { equalsRational, type Rational } from "./rational";
import { squareSurdKey, type SquareSurd } from "./square-surd";
import { surdSumKey, type SurdSum } from "./surd-sum";
import { equivalentPowerForms } from "./power-equivalence";
import type { PowerNormalForm } from "./power-normal-form";

export function equivalentRational(a: Rational, b: Rational): boolean {
  return equalsRational(a, b);
}

export function equivalentSquareSurd(a: SquareSurd, b: SquareSurd): boolean {
  return squareSurdKey(a) === squareSurdKey(b);
}

export function equivalentSurdSum(a: SurdSum, b: SurdSum): boolean {
  return surdSumKey(a) === surdSumKey(b);
}

export function equivalentPowerNormalForm(a: PowerNormalForm, b: PowerNormalForm): boolean {
  return equivalentPowerForms(a, b);
}
