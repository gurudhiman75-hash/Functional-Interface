import type {
  CanonicalNumberSystemProblem,
  NumberSystemAliasFamilyId,
  NumberSystemAnswerUnit,
  NumberSystemArchetype,
  NumberSystemFamilyId,
  NumberSystemLocalizedText,
  NumberSystemMotifFactory,
  NumberSystemPreferredSolutionMethod,
  NumberSystemSolverKind,
  NumberSystemSolverModel,
} from "./number-system-types";
import { inlineMath } from "../utils/quant-math-delimiters";
import {
  auditNumberSystemExplanationStyle,
  buildNumberSystemExplanation,
} from "./number-system-explanation-builder";

export const NUMBER_SYSTEM_FAMILY_IDS = [
  "ns_missing_digit_single_rule",
  "ns_missing_digit_multi_rule",
  "ns_reverse_divisibility",
  "ns_divisibility_multi_condition",
  "ns_divisibility_range_count",
  "ns_large_expression_divisibility",
  "ns_divisibility_lcm_bridge",
  "ns_hidden_divisor_deduction",
  "ns_prime_factorization",
  "ns_hidden_prime_exponent",
  "ns_prime_composite_deduction",
  "ns_factor_count_basic",
  "ns_factor_count_constraint",
  "ns_exact_divisor_count",
  "ns_odd_even_divisor_count",
  "ns_sum_of_divisors",
  "ns_product_of_divisors",
  "ns_hcf_lcm_relation",
  "ns_three_number_hcf_lcm",
  "ns_hidden_hcf",
  "ns_hidden_lcm",
  "ns_fraction_hcf_lcm",
  "ns_hcf_lcm_word_problem",
  "ns_schedule_alignment",
  "ns_minimum_common_multiple",
  "ns_remainder_after_division",
  "ns_remainder_after_power",
  "ns_modular_cycle",
  "ns_nested_remainder",
  "ns_remainder_pattern",
  "ns_remainder_reconstruction",
  "ns_remainder_factor_hybrid",
  "ns_remainder_range_count",
  "ns_unit_digit_cycle",
  "ns_last_two_digits",
  "ns_last_three_digits",
  "ns_expression_last_digit",
  "ns_power_tower_digit",
  "ns_cycle_length_detection",
  "ns_sum_of_digits",
  "ns_number_of_digits",
  "ns_digit_interchange",
  "ns_digit_formation",
  "ns_digit_constraints",
  "ns_unknown_digit_equation",
  "ns_digit_sum_reconstruction",
  "ns_consecutive_digit_number",
  "ns_trailing_zeroes",
  "ns_highest_power_dividing",
  "ns_factorial_divisibility",
  "ns_factorial_remainder",
  "ns_factorial_factor_count",
  "ns_modular_arithmetic",
  "ns_cyclic_pattern",
  "ns_prime_remainder_hybrid",
  "ns_factor_hcf_hybrid",
  "ns_hidden_number_theory",
  "ns_multi_cluster_reasoning",
  "ns_least_number_constraint",
  "ns_greatest_number_constraint",
  "ns_minimum_addition",
  "ns_minimum_subtraction",
  "ns_minimum_multiplier",
  "ns_minimum_divisor",
  "ns_smallest_divisible_number",
  "ns_largest_valid_number",
  "ns_range_optimization",
  "ns_multi_condition_optimization",
  "ns_perfect_square_completion",
  "ns_perfect_cube_completion",
  "ns_least_square_multiple",
  "ns_least_cube_multiple",
  "ns_square_factor_constraint",
  "ns_cube_factor_constraint",
  "ns_square_remainder_hybrid",
  "ns_square_divisibility_hybrid",
  "ns_square_factor_count_hybrid",
  "ns_hidden_number_reconstruction",
  "ns_hidden_divisor_reconstruction",
  "ns_hidden_exponent_reconstruction",
  "ns_hidden_factorization_reconstruction",
  "ns_hidden_square_reconstruction",
  "ns_multi_condition_reconstruction",
  "ns_reverse_number_theory",
  "ns_prime_hcf_lcm_optimization",
  "ns_digit_divisibility_reconstruction",
  "ns_remainder_constraint_optimization",
  "ns_factor_count_square_hidden",
  "ns_prime_exact_divisor_optimization",
  "ns_modular_cycle_reconstruction",
  "ns_digit_divisibility_hcf_verification",
] as const satisfies readonly NumberSystemFamilyId[];

export const NUMBER_SYSTEM_TODO_FAMILY_IDS = {
  aliasesHidden: ["ns_two_missing_digits_divisibility"],
} as const;

export const NUMBER_SYSTEM_ALIAS_FAMILY_MAP: Partial<Record<NumberSystemAliasFamilyId, NumberSystemFamilyId>> = {
  ns_missing_digit_divisibility: "ns_missing_digit_single_rule",
  ns_last_digit_power: "ns_unit_digit_cycle",
  ns_last_two_digits_power: "ns_last_two_digits",
  ns_hcf_lcm_product_relation: "ns_hcf_lcm_relation",
  ns_trailing_zeros_factorial: "ns_trailing_zeroes",
  ns_highest_power_in_factorial: "ns_highest_power_dividing",
};

export const NUMBER_SYSTEM_STEM_TEMPLATE_COVERAGE: Record<string, number> = {
  divisibility: 8,
  prime: 7,
  hcf_lcm: 8,
  remainder: 8,
  last_digit: 7,
  digit_logic: 8,
  factorial: 7,
  advanced: 7,
  optimization: 10,
  perfect_power: 9,
  reconstruction: 9,
  elite_hybrid: 10,
};

type Locale = "en" | "hi" | "pa";
type Cluster =
  | "divisibility"
  | "prime"
  | "hcf_lcm"
  | "remainder"
  | "last_digit"
  | "digit_logic"
  | "factorial"
  | "advanced"
  | "optimization"
  | "perfect_power"
  | "reconstruction"
  | "elite_hybrid";
type NumberSystemExamMode = "ssc" | "banking" | "punjab_state" | "pyq_plus" | "elite";
type NumberSystemSituation = {
  id: string;
  label: string;
  stemArchetype: string;
  shortcutPatternId: string;
  topologyDepth: number;
  examModes: NumberSystemExamMode[];
  distractorFamily: string;
};
type Spec = {
  family: NumberSystemFamilyId;
  cluster: Cluster;
  kind: NumberSystemSolverKind;
  method: NumberSystemPreferredSolutionMethod;
  archetype: NumberSystemArchetype;
  difficulty: "easy" | "medium" | "hard";
  unit: NumberSystemAnswerUnit;
};
type Draft = {
  stem: NumberSystemLocalizedText;
  model: NumberSystemSolverModel;
  variables: Record<string, unknown>;
  hiddenVariables: Record<string, unknown>;
  derivedVariables: Record<string, unknown>;
  answerUnit: NumberSystemAnswerUnit;
  principle: NumberSystemLocalizedText;
  formula: string;
  steps: Array<{ key: string; text: NumberSystemLocalizedText; math?: string; value?: number | string }>;
  shortcut: NumberSystemLocalizedText;
  traps: string[];
  answerLabel?: string;
  situation?: NumberSystemSituation;
};

function situationTuple(tuple: readonly unknown[]): NumberSystemSituation {
  return {
    id: String(tuple[0]),
    label: String(tuple[1]),
    stemArchetype: String(tuple[2]),
    shortcutPatternId: String(tuple[3]),
    topologyDepth: Number(tuple[4]),
    examModes: (tuple[5] as NumberSystemExamMode[] | undefined) ?? ["ssc"],
    distractorFamily: String(tuple[6]),
  };
}

const BASE_SITUATIONS: Record<Cluster, readonly NumberSystemSituation[]> = {
  divisibility: [
    ["missing-digit-rule", "Missing digit via divisibility rule", "constraint", "digit-rule-completion", 2, ["ssc", "banking", "punjab_state"], "wrong digit rule"],
    ["simultaneous-divisibility", "Simultaneous divisibility checks", "multi-condition", "paired-rule-filter", 3, ["ssc", "punjab_state"], "missed second condition"],
    ["range-multiple-count", "Counting multiples in a range", "range counting", "quotient-floor-difference", 3, ["ssc", "banking"], "endpoint inclusion error"],
    ["remainder-constrained-digit", "Digit from remainder condition", "reverse remainder", "target-residue", 4, ["ssc", "pyq_plus"], "wrong target residue"],
    ["lcm-divisibility-bridge", "Divisibility through LCM bridge", "hybrid", "lcm-rule-combine", 4, ["ssc", "elite"], "used one divisor only"],
    ["hidden-divisor-deduction", "Hidden divisor deduction", "deduction", "common-difference-divisor", 4, ["ssc", "elite"], "used sum instead of divisor"],
    ["largest-valid-digit", "Largest valid digit", "optimization", "scan-valid-residue", 3, ["ssc", "punjab_state"], "picked smallest valid digit"],
    ["smallest-valid-digit", "Smallest valid digit", "optimization", "least-residue-digit", 3, ["banking", "punjab_state"], "picked largest valid digit"],
    ["checksum-number", "Checksum-like digit validation", "applied code", "checksum-residue", 3, ["banking", "ssc"], "checksum direction error"],
    ["elite-divisibility-chain", "Divisibility chain with hidden constraint", "elite hybrid", "chain-residue-filter", 5, ["elite"], "missed hidden constraint"],
  ].map(situationTuple),
  prime: [
    ["factor-count-plus-one", "Factor count by exponent choices", "rule application", "exponent-plus-one", 2, ["banking", "ssc"], "forgot plus one"],
    ["odd-divisor-filter", "Odd divisor count by removing twos", "filtered count", "drop-power-two", 3, ["ssc", "punjab_state"], "included even divisors"],
    ["sum-divisor-geometric", "Sum of divisors through prime powers", "structured calculation", "sigma-factor-product", 4, ["ssc", "elite"], "missed prime power term"],
    ["product-divisor-pairing", "Product of divisors by pairing", "identity", "n-power-half-count", 4, ["ssc", "elite"], "used count instead of half count"],
    ["hidden-prime-exponent", "Recover hidden prime exponent", "reverse exponent", "factor-count-inversion", 4, ["ssc", "pyq_plus"], "wrong exponent inversion"],
    ["exact-divisor-target", "Exact divisor-count target", "target count", "target-factorization", 4, ["ssc", "elite"], "target split error"],
    ["square-divisor-count", "Perfect-square divisor reasoning", "property check", "odd-factor-count-test", 3, ["ssc", "banking"], "square parity error"],
    ["factor-constraint", "Factor count under a condition", "constraint", "filtered-exponent-choice", 4, ["ssc"], "ignored condition"],
    ["hidden-factor-reconstruction", "Number reconstruction from factors", "reconstruction", "exponent-rebuild", 5, ["elite"], "reconstructed wrong base"],
    ["elite-factor-hybrid", "Factor-HCF hybrid", "elite hybrid", "factor-hcf-bridge", 5, ["elite"], "missed HCF bridge"],
  ].map(situationTuple),
  hcf_lcm: [
    ["bells-synchronization", "Bells or events synchronize", "schedule", "take-lcm", 2, ["banking", "punjab_state"], "used HCF"],
    ["bus-cycle", "Transport cycle alignment", "schedule", "cycle-lcm", 3, ["ssc", "banking"], "added intervals"],
    ["tile-largest-square", "Largest equal tile", "measurement", "dimension-hcf", 3, ["ssc"], "used LCM for tile size"],
    ["rope-cutting", "Rope or plank cutting", "partition", "common-length-hcf", 3, ["punjab_state", "ssc"], "forgot equal pieces"],
    ["machine-maintenance", "Maintenance schedule alignment", "industrial", "maintenance-lcm", 3, ["ssc", "banking"], "first interval only"],
    ["hcf-lcm-product-recovery", "Recover number using HCF-LCM product", "reverse", "product-relation", 4, ["ssc", "pyq_plus"], "inverted product relation"],
    ["three-number-alignment", "Three-number LCM alignment", "multi-condition", "stagewise-lcm", 4, ["ssc"], "stopped after two numbers"],
    ["minimum-common-multiple", "Minimum common multiple above a bound", "optimization", "ceil-lcm-bound", 4, ["ssc", "elite"], "below-bound multiple"],
    ["constraint-number-recovery", "Recover number from HCF/LCM constraints", "reconstruction", "constraint-product", 5, ["elite"], "non-coprime multiplier error"],
    ["elite-hcf-lcm-chain", "HCF-LCM with remainder bridge", "elite hybrid", "hcf-lcm-remainder-bridge", 5, ["elite"], "missed remainder bridge"],
  ].map(situationTuple),
  remainder: [
    ["power-remainder-cycle", "Power remainder cycle", "cycle", "cycle-position", 3, ["ssc", "banking"], "wrong cycle index"],
    ["large-expression-remainder", "Large expression remainder", "expression", "reduce-terms", 4, ["ssc"], "expanded expression"],
    ["nested-remainder", "Nested remainder reduction", "nested", "reduce-inside-out", 4, ["ssc", "elite"], "wrong nesting order"],
    ["serial-remainder", "Serial number remainder", "applied code", "serial-mod", 3, ["banking"], "serial digit omission"],
    ["counter-cycle", "Counter or clock cycle remainder", "cycle application", "counter-mod", 3, ["punjab_state", "banking"], "cycle endpoint error"],
    ["reverse-remainder", "Recover value from remainder", "reverse", "target-residue", 4, ["ssc", "pyq_plus"], "wrong residue class"],
    ["range-remainder-count", "Count values with a remainder", "range count", "residue-floor-count", 4, ["ssc"], "counted multiples only"],
    ["prime-remainder-hybrid", "Prime and remainder hybrid", "hybrid", "prime-mod-bridge", 5, ["elite"], "ignored prime reduction"],
    ["modular-reconstruction", "Number reconstructed from residues", "reconstruction", "residue-rebuild", 5, ["elite"], "nonmatching residue"],
    ["elite-remainder-chain", "Remainder chain with hidden modulus", "elite hybrid", "chain-mod-filter", 5, ["elite"], "wrong hidden modulus"],
  ].map(situationTuple),
  last_digit: [
    ["unit-digit-cycle", "Unit digit cycle", "cycle", "unit-cycle-position", 3, ["banking", "ssc"], "wrong unit cycle"],
    ["last-two-digit-cycle", "Last two digits", "mod 100", "mod100-cycle", 4, ["ssc", "elite"], "used unit digit only"],
    ["last-three-digit-cycle", "Last three digits", "mod 1000", "mod1000-reduction", 4, ["elite"], "wrong modulus"],
    ["power-product-ending", "Product of powers ending digits", "product cycle", "multiply-cycle-results", 4, ["ssc"], "added endings"],
    ["power-tower-ending", "Power tower ending digit", "nested exponent", "tower-exponent-reduction", 5, ["elite"], "used top exponent directly"],
    ["factorial-hybrid-ending", "Factorial hybrid ending", "factorial hybrid", "factorial-zero-check", 5, ["elite"], "ignored trailing zero"],
    ["cycle-reconstruction", "Reconstruct cycle from observed endings", "reconstruction", "cycle-backtrack", 5, ["elite"], "wrong cycle length"],
    ["reverse-ending", "Reverse-engineer exponent from ending", "reverse", "ending-residue-class", 4, ["ssc", "pyq_plus"], "wrong exponent class"],
    ["expression-last-digit", "Expression last digit", "expression", "termwise-ending", 4, ["ssc"], "forgot subtraction mod 10"],
    ["elite-ending-hybrid", "Last digit with remainder bridge", "elite hybrid", "ending-remainder-bridge", 5, ["elite"], "missed bridge residue"],
  ].map(situationTuple),
  digit_logic: [
    ["digit-sum-reconstruction", "Digit sum reconstruction", "digit equation", "digit-sum-equation", 3, ["banking", "punjab_state"], "digit placement error"],
    ["digit-interchange", "Digit interchange difference", "reversal", "nine-times-difference", 3, ["ssc"], "reversed wrong digit"],
    ["number-of-digits", "Number of digits by bounds", "place value", "power-of-ten-bound", 2, ["banking"], "bound inclusion error"],
    ["digit-formation", "Number formation under constraints", "formation", "place-value-build", 3, ["ssc", "punjab_state"], "place-value swap"],
    ["unknown-digit-equation", "Unknown digit equation", "equation", "linear-digit-equation", 4, ["ssc"], "wrong coefficient"],
    ["consecutive-digit-number", "Consecutive digit condition", "constraint", "consecutive-digit-param", 4, ["ssc"], "started sequence wrong"],
    ["digit-divisibility-hybrid", "Digit logic with divisibility", "hybrid", "digit-divisibility-link", 5, ["elite"], "missed divisibility link"],
    ["largest-digit-number", "Largest number from constraints", "optimization", "maximize-place-values", 4, ["ssc"], "maximized wrong place"],
    ["code-number-reconstruction", "Code number reconstruction", "applied code", "code-place-rebuild", 4, ["banking"], "code offset error"],
    ["elite-digit-chain", "Digit constraints with factor count", "elite hybrid", "digit-factor-chain", 5, ["elite"], "missed factor count link"],
  ].map(situationTuple),
  factorial: [
    ["trailing-zero-count", "Trailing zeroes in factorial", "factorial", "floor-fives", 3, ["banking", "ssc"], "missed 25 contribution"],
    ["highest-power-factorial", "Highest power dividing factorial", "legendre", "floor-prime-powers", 3, ["ssc", "punjab_state"], "missed higher prime power"],
    ["factorial-divisibility", "Factorial divisibility test", "divisibility", "compare-prime-exponents", 4, ["ssc"], "checked only one prime"],
    ["factorial-remainder", "Factorial remainder", "factorial modulo", "factorial-mod-bound", 4, ["ssc", "elite"], "ignored modulus threshold"],
    ["factorial-factor-count", "Factor count of factorial divisor", "factor count", "legendre-plus-one", 5, ["elite"], "forgot plus one after Legendre"],
    ["zeroes-after-product", "Zeroes after multiplying factorials", "product factorial", "sum-floor-fives", 4, ["ssc"], "used max not sum"],
    ["minimum-n-for-zeroes", "Minimum n for zeroes", "reverse", "reverse-floor-search", 5, ["elite"], "nonexistent zero count trap"],
    ["highest-power-composite", "Highest composite power in factorial", "composite exponent", "min-prime-exponent-ratio", 5, ["elite"], "used largest exponent"],
    ["factorial-ratio", "Factorial ratio divisibility", "ratio", "subtract-legendre", 5, ["elite"], "added instead of subtracted"],
    ["elite-factorial-chain", "Factorial exponent and remainder chain", "elite hybrid", "legendre-mod-bridge", 5, ["elite"], "missed modular bridge"],
  ].map(situationTuple),
  advanced: [
    ["modular-cycle-hybrid", "Modular cycle hybrid", "hybrid", "reduce-cycle-chain", 5, ["elite"], "wrong reduction order"],
    ["prime-remainder-hybrid", "Prime remainder hybrid", "hybrid", "prime-mod-shortcut", 5, ["elite"], "ignored prime property"],
    ["factor-hcf-hybrid", "Factor-HCF hybrid", "hybrid", "factor-hcf-chain", 5, ["elite"], "factor/HCF swap"],
    ["hidden-number-theory", "Hidden number theory reconstruction", "reconstruction", "constraint-chain-filter", 5, ["elite"], "early candidate trap"],
    ["multi-cluster-reasoning", "Multi-cluster chain", "elite hybrid", "cluster-chain-shortcut", 6, ["elite"], "missed cluster link"],
    ["divisibility-to-remainder", "Divisibility to remainder bridge", "bridge", "divisibility-mod-bridge", 5, ["pyq_plus", "elite"], "wrong bridge direction"],
    ["factor-to-last-digit", "Factor count to last digit", "bridge", "factor-ending-bridge", 5, ["elite"], "used factor count as digit"],
    ["hcf-to-remainder", "HCF to remainder recovery", "bridge", "hcf-residue-bridge", 5, ["elite"], "used LCM instead"],
    ["digit-to-factor-count", "Digit constraint to factor count", "bridge", "digit-factor-filter", 5, ["elite"], "digit-only answer"],
    ["factorial-to-remainder", "Factorial to remainder", "bridge", "legendre-remainder", 5, ["elite"], "missed factorial power"],
  ].map(situationTuple),
  optimization: [
    ["least-bound-multiple", "Least valid number above a bound", "optimization", "ceil-lcm-bound", 4, ["ssc", "punjab_state"], "picked below-bound multiple"],
    ["greatest-bound-multiple", "Greatest valid number below a bound", "optimization", "floor-lcm-bound", 4, ["ssc", "banking"], "picked above-bound multiple"],
    ["minimum-adjustment", "Minimum addition or subtraction", "remainder adjustment", "nearest-residue", 4, ["ssc", "banking"], "used raw remainder"],
    ["minimum-multiplier", "Smallest multiplier to satisfy a factor condition", "prime-exponent repair", "missing-prime-power", 5, ["ssc", "elite"], "missed one prime exponent"],
    ["minimum-divisor", "Smallest divisor to remove excess factors", "prime-exponent trim", "excess-prime-power", 5, ["ssc"], "divided by the target instead"],
    ["range-constraint", "Range optimization with divisor conditions", "range filter", "lcm-floor-ceil", 5, ["ssc", "elite"], "ignored range endpoint"],
    ["multi-condition-bound", "Multiple conditions with one boundary", "multi-condition", "combined-lcm-bound", 5, ["elite"], "used one condition only"],
    ["ssc-number-optimization", "SSC-style least/greatest number", "exam optimization", "residue-to-bound", 5, ["ssc", "pyq_plus"], "wrong residual correction"],
    ["banking-fast-optimization", "Fast clean optimization", "fast arithmetic", "quotient-correction", 4, ["banking"], "off-by-one quotient"],
    ["punjab-traditional-constraint", "Traditional divisor constraint", "traditional", "hcf-lcm-constraint", 4, ["punjab_state"], "HCF/LCM swap"],
  ].map(situationTuple),
  perfect_power: [
    ["square-completion", "Complete a number to a perfect square", "perfect square", "even-exponent-repair", 4, ["ssc", "punjab_state"], "forgot exponent parity"],
    ["cube-completion", "Complete a number to a perfect cube", "perfect cube", "triple-exponent-repair", 4, ["ssc"], "forgot exponent multiple of three"],
    ["least-square-multiple", "Least square multiple", "square multiplier", "square-exponent-fill", 5, ["ssc", "elite"], "used next square only"],
    ["least-cube-multiple", "Least cube multiple", "cube multiplier", "cube-exponent-fill", 5, ["ssc", "elite"], "used next cube only"],
    ["square-factor-condition", "Square factor condition", "factor-square hybrid", "factor-parity-filter", 5, ["elite"], "counted all factors"],
    ["cube-factor-condition", "Cube factor condition", "factor-cube hybrid", "factor-mod-three-filter", 5, ["elite"], "used square rule"],
    ["square-remainder-bridge", "Perfect square with remainder", "remainder hybrid", "square-residue-chain", 5, ["elite"], "missed remainder correction"],
    ["square-divisibility-bridge", "Square divisibility hybrid", "divisibility hybrid", "square-lcm-chain", 5, ["ssc", "elite"], "checked divisibility only"],
    ["square-factor-count-bridge", "Square and factor-count hybrid", "factor count hybrid", "odd-count-square-test", 6, ["elite"], "forgot odd divisor count property"],
  ].map(situationTuple),
  reconstruction: [
    ["hidden-number-bound", "Hidden number from divisor conditions", "reconstruction", "constraint-filter", 5, ["ssc", "elite"], "stopped at first candidate"],
    ["hidden-divisor", "Hidden divisor reconstruction", "reverse divisor", "quotient-remainder-backtrack", 5, ["ssc"], "used quotient as divisor"],
    ["hidden-exponent", "Hidden exponent reconstruction", "reverse exponent", "cycle-position-backtrack", 5, ["banking", "elite"], "wrong cycle class"],
    ["hidden-factorization", "Hidden factorization rebuild", "prime reconstruction", "exponent-rebuild", 5, ["ssc", "elite"], "missed prime base"],
    ["hidden-square", "Hidden square reconstruction", "square reconstruction", "sqrt-bound-check", 5, ["ssc"], "used non-square candidate"],
    ["multi-condition-rebuild", "Multi-condition reconstruction", "multi-condition", "lcm-residue-filter", 6, ["elite"], "ignored one condition"],
    ["reverse-number-theory", "Reverse number-theory chain", "reverse chain", "answer-backtrack", 6, ["elite", "pyq_plus"], "inverted the chain"],
    ["pyq-reconstruction", "PYQ-style reconstruction", "pyq reconstruction", "constraint-verification", 5, ["pyq_plus", "ssc"], "failed verification"],
    ["punjab-reconstruction", "Traditional reconstruction", "traditional reconstruction", "divisor-bound-rebuild", 5, ["punjab_state"], "wrong divisibility condition"],
  ].map(situationTuple),
  elite_hybrid: [
    ["prime-hcf-lcm-optimization", "Prime factors to HCF/LCM optimization", "elite chain", "prime-hcf-lcm-bound", 6, ["elite", "ssc"], "missed HCF/LCM bridge"],
    ["digit-divisibility-reconstruction", "Digit divisibility reconstruction", "elite digit chain", "digit-rule-rebuild", 6, ["elite", "ssc"], "picked invalid digit"],
    ["remainder-constraint-optimization", "Remainder constraint optimization", "elite remainder chain", "residue-lcm-bound", 6, ["elite"], "used wrong residue"],
    ["factor-count-square-hidden", "Factor count to hidden square", "elite factor chain", "factor-count-square", 6, ["elite"], "forgot square divisor property"],
    ["prime-exact-divisor-optimization", "Exact divisor optimization", "elite divisor chain", "exact-divisor-bound", 6, ["elite", "ssc"], "wrong exponent split"],
    ["modular-cycle-reconstruction", "Cycle reconstruction", "elite cycle chain", "cycle-backtrack-verify", 6, ["elite", "banking"], "wrong cycle position"],
    ["digit-hcf-verification", "Digit divisibility with HCF verification", "elite verification", "digit-hcf-check", 6, ["elite", "punjab_state"], "skipped final HCF check"],
    ["multi-cluster-ssc-chain", "SSC multi-cluster chain", "elite SSC chain", "cluster-chain", 6, ["elite", "ssc"], "solved only first cluster"],
    ["banking-pattern-chain", "Banking pattern chain", "elite banking chain", "fast-cycle-chain", 5, ["elite", "banking"], "cycle shortcut error"],
    ["punjab-traditional-chain", "Punjab traditional chain", "elite traditional chain", "traditional-divisor-chain", 5, ["elite", "punjab_state"], "divisor relation error"],
  ].map(situationTuple),
};

const t = (en: string, hi: string, pa: string): NumberSystemLocalizedText => ({ en, hi, pa });
const ascii = (value: string) => value.normalize("NFKC");

function hashText(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function pick<T>(items: readonly T[], seed: string) {
  return items[hashText(seed) % items.length]!;
}
function int(seed: string, min: number, max: number) {
  return min + (hashText(seed) % (max - min + 1));
}
function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}
function primeFactors(n: number) {
  const factors: Record<number, number> = {};
  let value = Math.abs(n);
  for (let p = 2; p * p <= value; p += p === 2 ? 1 : 2) {
    while (value % p === 0) {
      factors[p] = (factors[p] ?? 0) + 1;
      value /= p;
    }
  }
  if (value > 1) factors[value] = (factors[value] ?? 0) + 1;
  return factors;
}
function factorCountFromFactors(factors: Record<number, number>) {
  return Object.values(factors).reduce((acc, exp) => acc * (exp + 1), 1);
}
function sumOfDivisorsFromFactors(factors: Record<number, number>) {
  return Object.entries(factors).reduce((acc, [primeRaw, exp]) => {
    const prime = Number(primeRaw);
    return acc * ((prime ** (exp + 1) - 1) / (prime - 1));
  }, 1);
}
function modPow(base: number, exp: number, mod: number) {
  let result = 1 % mod;
  let b = ((base % mod) + mod) % mod;
  let e = exp;
  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }
  return result;
}
function factorialPrimePower(n: number, p: number) {
  let count = 0;
  for (let div = p; div <= n; div *= p) count += Math.floor(n / div);
  return count;
}
function ceilToMultiple(value: number, divisor: number) {
  return Math.ceil(value / divisor) * divisor;
}
function floorToMultiple(value: number, divisor: number) {
  return Math.floor(value / divisor) * divisor;
}
function factorCompletionMultiplier(n: number, power: 2 | 3) {
  const factors = primeFactors(n);
  return Object.entries(factors).reduce((acc, [primeRaw, exp]) => {
    const missing = (power - (exp % power)) % power;
    return acc * Number(primeRaw) ** missing;
  }, 1);
}
function smallestResidueAtLeast(lower: number, modulus: number, residue: number) {
  const normalized = ((residue % modulus) + modulus) % modulus;
  const first = lower + (((normalized - (lower % modulus)) + modulus) % modulus);
  return first;
}
function rangeResidueCount(start: number, end: number, modulus: number, residue: number) {
  const first = smallestResidueAtLeast(start, modulus, residue);
  if (first > end) return 0;
  return Math.floor((end - first) / modulus) + 1;
}
function squareRootIfSquare(n: number) {
  const root = Math.round(Math.sqrt(n));
  return root * root === n ? root : -1;
}

const SPECS: readonly Spec[] = NUMBER_SYSTEM_FAMILY_IDS.map((family) => {
  const cluster: Cluster =
    family.includes("prime_hcf_lcm") || family.includes("digit_divisibility") || family.includes("factor_count_square") || family.includes("prime_exact") || family.includes("modular_cycle_reconstruction") ? "elite_hybrid" :
    family.includes("least_number") || family.includes("greatest_number") || family.includes("minimum_addition") || family.includes("minimum_subtraction") || family.includes("minimum_multiplier") || family.includes("minimum_divisor") || family.includes("smallest_divisible") || family.includes("largest_valid") || family.includes("range_optimization") || family.includes("multi_condition_optimization") || family.includes("constraint_optimization") ? "optimization" :
    family.includes("perfect_square") || family.includes("perfect_cube") || family.includes("least_square") || family.includes("least_cube") || family.includes("square_") || family.includes("cube_") ? "perfect_power" :
    family.includes("_reconstruction") || family.includes("reverse_number_theory") || family.includes("hidden_number_reconstruction") || family.includes("hidden_divisor_reconstruction") || family.includes("hidden_exponent_reconstruction") || family.includes("hidden_factorization_reconstruction") || family.includes("hidden_square_reconstruction") ? "reconstruction" :
    family.includes("prime") || family.includes("factor_count") || family.includes("divisor") ? "prime" :
    family.includes("hcf") || family.includes("lcm") || family.includes("schedule") || family.includes("common") ? "hcf_lcm" :
    family.includes("remainder") || family.includes("modular") ? "remainder" :
    family.includes("last") || family.includes("unit_digit") || family.includes("cycle") || family.includes("power_tower") ? "last_digit" :
    family.includes("digit") || family.includes("number_of_digits") || family.includes("consecutive") ? "digit_logic" :
    family.includes("factorial") || family.includes("zero") || family.includes("highest_power") ? "factorial" :
    family.includes("hidden") || family.includes("hybrid") || family.includes("multi_cluster") ? "advanced" : "divisibility";
  const kind: NumberSystemSolverKind =
    cluster === "optimization" ? "optimization_constraint" :
    cluster === "perfect_power" ? "perfect_power_completion" :
    cluster === "reconstruction" ? "reconstruction" :
    cluster === "elite_hybrid" ? "elite_hybrid_chain" :
    cluster === "prime" ? "factor_count" :
    cluster === "hcf_lcm" ? "hcf_lcm" :
    cluster === "remainder" ? "remainder" :
    cluster === "last_digit" ? "last_digit" :
    cluster === "digit_logic" ? "digit_logic" :
    cluster === "factorial" ? "factorial" :
    cluster === "advanced" ? "modular_hybrid" :
    family.includes("missing") || family.includes("reverse") ? "missing_digit" : "divisibility_count";
  const method: NumberSystemPreferredSolutionMethod =
    kind === "optimization_constraint" ? "OPTIMIZATION_CONSTRAINT_METHOD" :
    kind === "perfect_power_completion" ? "PERFECT_POWER_COMPLETION_METHOD" :
    kind === "reconstruction" ? "RECONSTRUCTION_METHOD" :
    kind === "elite_hybrid_chain" ? "ELITE_HYBRID_CHAIN_METHOD" :
    kind === "missing_digit" || kind === "divisibility_count" ? "DIVISIBILITY_RULE_METHOD" :
    kind === "factor_count" ? (family.includes("hidden_prime") ? "EXPONENT_TRACKING_METHOD" : "FACTOR_COUNT_METHOD") :
    kind === "hcf_lcm" ? "HCF_LCM_RELATION_METHOD" :
    kind === "last_digit" ? "LAST_DIGIT_CYCLE_METHOD" :
    kind === "factorial" ? (family.includes("zero") ? "TRAILING_ZERO_METHOD" : "HIGHEST_POWER_METHOD") :
    kind === "digit_logic" ? "DIGIT_EQUATION_METHOD" : "MODULAR_CYCLE_METHOD";
  return {
    family,
    cluster,
    kind,
    method,
    archetype:
      cluster === "elite_hybrid" ? "hybrid" :
      cluster === "reconstruction" ? "reconstruction" :
      cluster === "optimization" || cluster === "perfect_power" ? "optimization" :
      family.includes("hidden") || family.includes("reverse") ? "hidden_variable" :
      family.includes("range") || family.includes("minimum") ? "optimization" :
      family.includes("hybrid") || family.includes("multi") ? "hybrid" : "deduction",
    difficulty: cluster === "elite_hybrid" || cluster === "reconstruction" || cluster === "perfect_power" || cluster === "advanced" || family.includes("three") || family.includes("nested") ? "hard" : cluster === "optimization" ? "medium" : cluster === "divisibility" || cluster === "prime" ? "easy" : "medium",
    unit: kind === "missing_digit" ? "digit" : kind === "remainder" || kind === "last_digit" ? "remainder" : kind === "factor_count" ? "count" : "number",
  };
});

function specFor(family: NumberSystemFamilyId) {
  return SPECS.find((spec) => spec.family === family) ?? SPECS[0]!;
}

function situationForSpec(spec: Spec, family: NumberSystemFamilyId, seed: string) {
  const situations = BASE_SITUATIONS[spec.cluster];
  const familyHints = [
    ["missing", "missing"],
    ["range", "range"],
    ["reverse", "reverse"],
    ["hidden", "hidden"],
    ["hybrid", "hybrid"],
    ["three", "three"],
    ["schedule", "schedule"],
    ["minimum", "minimum"],
    ["last_two", "last-two"],
    ["last_three", "last-three"],
    ["power_tower", "tower"],
    ["trailing", "trailing"],
    ["highest", "highest"],
    ["least", "least"],
    ["greatest", "greatest"],
    ["minimum", "minimum"],
    ["square", "square"],
    ["cube", "cube"],
    ["reconstruction", "reconstruction"],
    ["optimization", "optimization"],
  ] as const;
  const hinted = familyHints.find(([needle]) => family.includes(needle))?.[1];
  const filtered = hinted ? situations.filter((situation) => situation.id.includes(hinted) || situation.label.toLowerCase().includes(hinted)) : [];
  return pick(filtered.length > 0 ? filtered : situations, seed);
}

function examModeForSituation(situation: NumberSystemSituation, seed: string) {
  return pick(situation.examModes.length > 0 ? situation.examModes : ["ssc"], seed);
}

function authenticityScores(situation: NumberSystemSituation, difficulty: "easy" | "medium" | "hard") {
  const base = difficulty === "hard" ? 86 : difficulty === "medium" ? 84 : 81;
  const depthBoost = Math.min(8, situation.topologyDepth);
  const scoreFor = (mode: NumberSystemExamMode) => Math.min(98, base + depthBoost + (situation.examModes.includes(mode) ? 6 : -2));
  return {
    ssc: scoreFor("ssc"),
    banking: scoreFor("banking"),
    punjab: scoreFor("punjab_state"),
  };
}

function isEliteSituation(spec: Spec, family: NumberSystemFamilyId, situation: NumberSystemSituation, difficulty: "easy" | "medium" | "hard") {
  return situation.topologyDepth >= 5 || spec.cluster === "advanced" || difficulty === "hard" || family.includes("hybrid") || family.includes("multi_cluster");
}

function methodTrap(method: NumberSystemPreferredSolutionMethod) {
  switch (method) {
    case "DIVISIBILITY_RULE_METHOD": return "used memorized rule without verification";
    case "PRIME_FACTORIZATION_METHOD": return "missed a prime factor";
    case "EXPONENT_TRACKING_METHOD": return "tracked exponent of only one prime";
    case "FACTOR_COUNT_METHOD": return "forgot exponent plus one";
    case "HCF_LCM_RELATION_METHOD": return "interchanged HCF and LCM";
    case "MODULAR_CYCLE_METHOD": return "picked wrong cycle position";
    case "LAST_DIGIT_CYCLE_METHOD": return "used exponent directly instead of cycle";
    case "DIGITAL_ROOT_METHOD": return "used digit sum without checking condition";
    case "TRAILING_ZERO_METHOD": return "missed higher powers of five";
    case "HIGHEST_POWER_METHOD": return "missed higher prime powers";
    case "DIGIT_EQUATION_METHOD": return "swapped place-value coefficients";
    case "OPTIMIZATION_CONSTRAINT_METHOD": return "optimized before combining constraints";
    case "PERFECT_POWER_COMPLETION_METHOD": return "missed exponent completion";
    case "RECONSTRUCTION_METHOD": return "accepted candidate without verification";
    case "ELITE_HYBRID_CHAIN_METHOD": return "solved only one stage of the chain";
    default: return "selected arithmetic-neighbor distractor";
  }
}

export function resolveNumberSystemFamily(value?: string): NumberSystemFamilyId | undefined {
  if (NUMBER_SYSTEM_FAMILY_IDS.includes(value as NumberSystemFamilyId)) return value as NumberSystemFamilyId;
  return NUMBER_SYSTEM_ALIAS_FAMILY_MAP[value as NumberSystemAliasFamilyId];
}

function displayFactors(factors: Record<number, number>) {
  return Object.entries(factors).map(([p, e]) => e === 1 ? p : `${p}^{${e}}`).join("\\times ");
}
function optionText(value: number | string, _unit: NumberSystemAnswerUnit) {
  return inlineMath(String(value));
}
function localizedOptions(options: string[]) {
  return { en: options, hi: options, pa: options };
}
function buildOptions(answer: number, unit: NumberSystemAnswerUnit, seed: string) {
  if (!Number.isFinite(answer)) answer = 42;
  const values = new Set<number>([answer]);
  
  let deltas: number[] = [];
  if (unit === "digit") {
    deltas = [1, -1, 2, -2, 3, -3, 4, -4];
  } else if (answer > 100000) {
    deltas = [
      Math.round(answer * 0.1),
      Math.round(answer * 0.25),
      Math.round(answer * 0.5),
      -Math.round(answer * 0.1),
      -Math.round(answer * 0.2),
    ];
  } else if (answer > 1000) {
    deltas = [
      Math.round(answer * 0.1),
      Math.round(answer * 0.2),
      -Math.round(answer * 0.1),
      -Math.round(answer * 0.2),
      10, -10, 20, -20
    ];
  } else if (answer > 100) {
    deltas = [
      Math.round(answer * 0.05),
      Math.round(answer * 0.1),
      -Math.round(answer * 0.05),
      -Math.round(answer * 0.1),
      6, -6, 12, -12
    ];
  } else {
    deltas = [1, -1, 2, -2, 3, -3, 5, -5];
  }

  for (const delta of deltas) {
    if (delta === 0) continue;
    const next = answer + delta;
    if (unit === "digit") {
      if (next >= 0 && next <= 9) values.add(next);
    } else if (next >= 0) {
      values.add(next);
    }
    if (values.size >= 4) break;
  }
  let fallback = 0;
  while (values.size < 4) {
    const nextFallback = unit === "digit" 
      ? fallback++ 
      : answer > 100 
        ? answer + Math.round(answer * 0.15) + fallback++
        : answer + 7 + fallback++;
    if (unit === "digit") {
      if (nextFallback >= 0 && nextFallback <= 9) values.add(nextFallback);
    } else if (nextFallback >= 0) {
      values.add(nextFallback);
    }
  }
  const list = [...values].slice(0, 4);
  const correctValue = list[0]!;
  const shift = hashText(seed) % 4;
  const rotated = list.map((_, index) => list[(index + shift) % list.length]!);
  const correct = rotated.indexOf(correctValue);
  return { options: rotated.map((value) => optionText(value, unit)), correct };
}

function stemVariant(seed: string, variants: readonly NumberSystemLocalizedText[]) {
  return pick(variants, `${seed}:stem-variant`);
}

function remainderCycle(base: number, mod: number) {
  const seen = new Set<number>();
  const cycle: number[] = [];
  let value = 1 % mod;
  for (let step = 1; step <= 24; step += 1) {
    value = (value * (((base % mod) + mod) % mod)) % mod;
    if (seen.has(value)) break;
    seen.add(value);
    cycle.push(value);
  }
  return cycle.length ? cycle : [0];
}

function compactFactors(factors: Record<number, number>) {
  return displayFactors(factors) || "1";
}

export function evaluateNumberSystemSolverModel(model: NumberSystemSolverModel): number | string {
  const i = model.inputs as Record<string, any>;
  switch (model.kind) {
    case "missing_digit": {
      const pattern = String(i.pattern);
      const divisor = Number(i.divisor);
      const mode = String(i.mode ?? "unique");
      const valid: number[] = [];
      for (let digit = pattern.startsWith("x") ? 1 : 0; digit <= 9; digit += 1) {
        const value = Number(pattern.replace("x", String(digit)));
        if (value % divisor === 0) valid.push(digit);
      }
      if (mode === "largest") return Math.max(...valid);
      if (mode === "smallest") return Math.min(...valid);
      if (mode === "count") return valid.length;
      if (mode === "sum") return valid.reduce((a, b) => a + b, 0);
      return valid[0] ?? -1;
    }
    case "divisibility_count":
      return Math.floor(Number(i.end) / Number(i.divisor)) - Math.floor((Number(i.start) - 1) / Number(i.divisor));
    case "factor_count": {
      const factors = primeFactors(Number(i.n));
      if (i.ask === "sum") return sumOfDivisorsFromFactors(factors);
      if (i.ask === "product") {
        const count = factorCountFromFactors(factors);
        return Math.round(Number(i.n) ** (count / 2));
      }
      if (i.ask === "odd") {
        let odd = 1;
        for (const [p, e] of Object.entries(factors)) if (Number(p) !== 2) odd *= e + 1;
        return odd;
      }
      return factorCountFromFactors(factors);
    }
    case "hcf_lcm": {
      if (i.ask === "lcm") return lcm(Number(i.a), Number(i.b));
      if (i.ask === "hcf") return gcd(Number(i.a), Number(i.b));
      if (i.ask === "other") return Math.round((Number(i.hcf) * Number(i.lcm)) / Number(i.known));
      if (i.ask === "three_lcm") return lcm(lcm(Number(i.a), Number(i.b)), Number(i.c));
      return gcd(Number(i.a), Number(i.b));
    }
    case "remainder":
      return modPow(Number(i.base), Number(i.exp), Number(i.mod));
    case "last_digit":
      return modPow(Number(i.base), Number(i.exp), Number(i.mod ?? 10));
    case "digit_logic":
      if (i.ask === "reversal") return 9 * Math.abs(Number(i.tens) - Number(i.ones));
      if (i.ask === "number") return 10 * Number(i.tens) + Number(i.ones);
      if (i.ask === "digits") return String(Math.abs(Number(i.n))).length;
      return Number(i.answer);
    case "factorial":
      if (i.ask === "zeros") return factorialPrimePower(Number(i.n), 5);
      if (i.ask === "power") return factorialPrimePower(Number(i.n), Number(i.p));
      if (i.ask === "remainder") return Number(i.mod) <= Number(i.n) ? 0 : 1;
      return factorCountFromFactors(Object.fromEntries(Object.entries(primeFactors(Number(i.base))).map(([p, e]) => [p, factorialPrimePower(Number(i.n), Number(p)) * e])));
    case "modular_hybrid":
      return modPow(Number(i.base), Number(i.exp), Number(i.mod));
    case "optimization_constraint": {
      const mode = String(i.mode);
      if (mode === "least_multiple_above") return ceilToMultiple(Number(i.lower) + 1, Number(i.lcm));
      if (mode === "greatest_multiple_below") return floorToMultiple(Number(i.upper) - 1, Number(i.lcm));
      if (mode === "minimum_addition") return (Number(i.divisor) - (Number(i.n) % Number(i.divisor))) % Number(i.divisor);
      if (mode === "minimum_subtraction") return Number(i.n) % Number(i.divisor);
      if (mode === "minimum_multiplier") return Number(i.target) / gcd(Number(i.n), Number(i.target));
      if (mode === "minimum_divisor") return Number(i.extraDivisor);
      if (mode === "range_count") return rangeResidueCount(Number(i.start), Number(i.end), Number(i.modulus), Number(i.residue));
      if (mode === "multi_condition") return ceilToMultiple(Number(i.lower) + 1, Number(i.lcm));
      return Number(i.answer);
    }
    case "perfect_power_completion": {
      const mode = String(i.mode);
      const n = Number(i.n);
      const power = Number(i.power) as 2 | 3;
      const multiplier = factorCompletionMultiplier(n, power);
      if (mode === "least_multiple") return n * multiplier;
      if (mode === "factor_count_square") return factorCountFromFactors(primeFactors(n * multiplier));
      if (mode === "remainder_to_square") {
        const modulus = Number(i.modulus);
        const residue = Number(i.residue);
        const lower = Number(i.lower);
        let candidate = smallestResidueAtLeast(lower, modulus, residue);
        while (squareRootIfSquare(candidate) < 0) candidate += modulus;
        return candidate;
      }
      return multiplier;
    }
    case "reconstruction": {
      const mode = String(i.mode);
      if (mode === "number_from_lcm_remainder") return Number(i.lcm) * Number(i.quotient) + Number(i.remainder);
      if (mode === "hidden_divisor") return (Number(i.dividend) - Number(i.remainder)) / Number(i.quotient);
      if (mode === "hidden_exponent") {
        const base = Number(i.base);
        const mod = Number(i.mod);
        const target = Number(i.targetRemainder);
        for (let exp = Number(i.minExp); exp <= Number(i.maxExp); exp += 1) {
          if (modPow(base, exp, mod) === target) return exp;
        }
        return -1;
      }
      if (mode === "hidden_factorization") return Number(i.value);
      if (mode === "hidden_square") return Number(i.root) * Number(i.root);
      return Number(i.answer);
    }
    case "elite_hybrid_chain": {
      const mode = String(i.mode);
      if (mode === "prime_hcf_lcm_optimization") return ceilToMultiple(Number(i.lower) + 1, lcm(Number(i.a), Number(i.b)));
      if (mode === "digit_divisibility_reconstruction") return Number(String(i.pattern).replace("x", String(i.digit)));
      if (mode === "remainder_constraint_optimization") return smallestResidueAtLeast(Number(i.lower), Number(i.modulus), Number(i.residue));
      if (mode === "factor_count_square_hidden") return factorCompletionMultiplier(Number(i.n), 2);
      if (mode === "prime_exact_divisor_optimization") return Number(i.value);
      if (mode === "modular_cycle_reconstruction") return modPow(Number(i.base), Number(i.exp), Number(i.mod));
      if (mode === "digit_divisibility_hcf_verification") return gcd(Number(String(i.pattern).replace("x", String(i.digit))), Number(i.other));
      return Number(i.answer);
    }
  }
}

function divisibilityDraft(spec: Spec, seed: string): Draft {
  if (spec.kind === "missing_digit") {
    const divisor = pick([9, 11, 12, 18], `${seed}:divisor`);
    let pattern = "47x26";
    let model: NumberSystemSolverModel = { kind: "missing_digit", inputs: { pattern, divisor: 9, mode: "unique" } };
    let answer = 8;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const digits = [int(`${seed}:p:${attempt}:0`, 1, 9), int(`${seed}:p:${attempt}:1`, 0, 9), int(`${seed}:p:${attempt}:2`, 0, 9), int(`${seed}:p:${attempt}:3`, 0, 9), int(`${seed}:p:${attempt}:4`, 0, 9)];
      const pos = int(`${seed}:pos:${attempt}`, 1, 3);
      const candidate = digits.map((digit, index) => index === pos ? "x" : String(digit)).join("");
      const candidateModel: NumberSystemSolverModel = { kind: "missing_digit", inputs: { pattern: candidate, divisor, mode: "unique" } };
      const candidateAnswer = Number(evaluateNumberSystemSolverModel(candidateModel));
      const validDigits: number[] = [];
      for (let digit = candidate.startsWith("x") ? 1 : 0; digit <= 9; digit += 1) {
        if (Number(candidate.replace("x", String(digit))) % divisor === 0) validDigits.push(digit);
      }
      if (validDigits.length === 1 && candidateAnswer >= 0 && candidateAnswer <= 9) {
        pattern = candidate;
        model = candidateModel;
        answer = candidateAnswer;
        break;
      }
    }
    const known = pattern.replace("x", "").split("").map(Number).reduce((a, b) => a + b, 0);
    return {
      stem: t(
        `The number \\(${pattern}\\) is divisible by \\(${model.inputs.divisor}\\). What is the value of \\(x\\)?`,
        `संख्या \\(${pattern}\\), \\(${model.inputs.divisor}\\) से विभाज्य है। \\(x\\) का मान क्या है?`,
        `ਸੰਖਿਆ \\(${pattern}\\), \\(${model.inputs.divisor}\\) ਨਾਲ ਭਾਗ ਜਾਂਦੀ ਹੈ। \\(x\\) ਦਾ ਮੁੱਲ ਕੀ ਹੈ?`,
      ),
      model,
      variables: { pattern, divisor: model.inputs.divisor, answerDigit: answer },
      hiddenVariables: { allowedDigits: pattern.startsWith("x") ? [1,2,3,4,5,6,7,8,9] : [0,1,2,3,4,5,6,7,8,9] },
      derivedVariables: { knownDigitSum: known },
      answerUnit: "digit",
      principle: t("Use the divisibility rule that fits the given divisor.", "दिए गए भाजक के अनुसार विभाज्यता नियम लगाएं।", "ਦਿੱਤੇ ਭਾਜਕ ਮੁਤਾਬਕ ਭਾਗਯੋਗਤਾ ਦਾ ਨਿਯਮ ਲਗਾਓ।"),
      formula: "N(x)\\equiv 0\\pmod d",
      steps: [
        { key: "rule", text: t("The missing digit must make the whole number divisible by the given divisor.", "लुप्त अंक ऐसा होना चाहिए कि पूरी संख्या दिए गए भाजक से विभाज्य हो।", "ਗੁੰਮ ਅੰਕ ਐਸਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ ਪੂਰੀ ਸੰਖਿਆ ਦਿੱਤੇ ਭਾਜਕ ਨਾਲ ਭਾਗ ਜਾਵੇ।") },
        { key: "sum", text: t("For the digit-sum check, add the known digits first.", "अंक-योग जांच के लिए पहले ज्ञात अंकों को जोड़ें।", "ਅੰਕ-ਜੋੜ ਜਾਂਚ ਲਈ ਪਹਿਲਾਂ ਪਤਾ ਅੰਕ ਜੋੜੋ।"), math: `${known}+x` },
        { key: "answer", text: t("The digit that satisfies the divisibility check is found.", "जो अंक विभाज्यता जांच को पूरा करता है, वही उत्तर है।", "ਜੋ ਅੰਕ ਭਾਗਯੋਗਤਾ ਜਾਂਚ ਪੂਰੀ ਕਰਦਾ ਹੈ, ਉਹੀ ਉੱਤਰ ਹੈ।"), math: `x=${answer}`, value: answer },
      ],
      shortcut: t(`Try the divisibility rule directly on \\(${pattern}\\); the valid digit is \\(${answer}\\).`, `\\(${pattern}\\) पर सीधे विभाज्यता नियम लगाएं; सही अंक \\(${answer}\\) है।`, `\\(${pattern}\\) ਉੱਤੇ ਸਿੱਧਾ ਭਾਗਯੋਗਤਾ ਨਿਯਮ ਲਗਾਓ; ਸਹੀ ਅੰਕ \\(${answer}\\) ਹੈ।`),
      traps: ["wrong digit sum", "partial divisibility check", "leading zero error"],
    };
  }
  const divisor = pick([6, 8, 9, 12, 15, 18], `${seed}:d`);
  const start = int(`${seed}:start`, 100, 240);
  const end = start + int(`${seed}:span`, 80, 180);
  return {
    stem: t(
      `Between \\(${start}\\) and \\(${end}\\), how many integers are divisible by \\(${divisor}\\)?`,
      `\\(${start}\\) और \\(${end}\\) के बीच कितने पूर्णांक \\(${divisor}\\) से विभाज्य हैं?`,
      `\\(${start}\\) ਅਤੇ \\(${end}\\) ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ \\(${divisor}\\) ਨਾਲ ਭਾਗ ਜਾਂਦੇ ਹਨ?`,
    ),
    model: { kind: "divisibility_count", inputs: { start, end, divisor } },
    variables: { start, end, divisor },
    hiddenVariables: { firstMultiple: Math.ceil(start / divisor) * divisor, lastMultiple: Math.floor(end / divisor) * divisor },
    derivedVariables: {},
    answerUnit: "count",
    principle: t("Count multiples using the first valid multiple and the last valid multiple.", "पहले सही गुणज और आखिरी सही गुणज से गिनती करें।", "ਪਹਿਲੇ ਠੀਕ ਗੁਣਜ ਅਤੇ ਆਖਰੀ ਠੀਕ ਗੁਣਜ ਨਾਲ ਗਿਣਤੀ ਕਰੋ।"),
    formula: "\\left\\lfloor\\frac{R}{d}\\right\\rfloor-\\left\\lfloor\\frac{L-1}{d}\\right\\rfloor",
    steps: [
      { key: "formula", text: t("Multiples up to the upper limit minus multiples before the lower limit gives the count.", "ऊपरी सीमा तक के गुणजों में से निचली सीमा से पहले के गुणज घटाएं।", "ਉੱਪਰੀ ਹੱਦ ਤੱਕ ਦੇ ਗੁਣਜਾਂ ਵਿਚੋਂ ਹੇਠਲੀ ਹੱਦ ਤੋਂ ਪਹਿਲਾਂ ਦੇ ਗੁਣਜ ਘਟਾਓ।") },
      { key: "substitute", text: t("Substitute the range limits.", "सीमाएँ रखें।", "ਹੱਦਾਂ ਰੱਖੋ।"), math: `\\left\\lfloor\\frac{${end}}{${divisor}}\\right\\rfloor-\\left\\lfloor\\frac{${start - 1}}{${divisor}}\\right\\rfloor` },
    ],
    shortcut: t("Use quotient difference instead of listing all numbers.", "सभी संख्याएँ लिखने के बजाय भागफल का अंतर लें।", "ਸਾਰੀਆਂ ਸੰਖਿਆਵਾਂ ਲਿਖਣ ਦੀ ਥਾਂ ਭਾਗਫਲਾਂ ਦਾ ਫਰਕ ਲਵੋ।"),
    traps: ["included endpoint incorrectly", "listed multiples manually", "counted non-multiples"],
  };
}

function factorDraft(spec: Spec, seed: string): Draft {
  const ask = spec.family.includes("sum") ? "sum" : spec.family.includes("product") ? "product" : spec.family.includes("odd") ? "odd" : "count";
  const n = ask === "product"
    ? pick([12, 18, 20, 24, 30, 36], `${seed}:n`)
    : (2 ** int(`${seed}:a`, 2, 5)) * (3 ** int(`${seed}:b`, 1, 3)) * (5 ** int(`${seed}:c`, 0, 1));
  const factors = primeFactors(n);
  return {
    stem: stemVariant(seed, [
      t(`After prime factorising \\(${n}\\), what is the ${ask === "sum" ? "sum of all positive divisors" : ask === "product" ? "product of all positive divisors" : ask === "odd" ? "number of odd divisors" : "number of positive divisors"}?`, `\\(${n}\\) का अभाज्य गुणनखंड करने के बाद ${ask === "sum" ? "सभी धनात्मक भाजकों का योग" : ask === "product" ? "सभी धनात्मक भाजकों का गुणनफल" : ask === "odd" ? "विषम भाजकों की संख्या" : "धनात्मक भाजकों की संख्या"} क्या है?`, `\\(${n}\\) ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਕਰਨ ਤੋਂ ਬਾਅਦ ${ask === "sum" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ" : ask === "product" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ" : ask === "odd" ? "ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ" : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ"} ਕੀ ਹੈ?`),
      t(`For the number \\(${n}\\), find the ${ask === "sum" ? "sum of its positive divisors" : ask === "product" ? "product of its positive divisors" : ask === "odd" ? "count of odd divisors" : "count of positive divisors"}?`, `संख्या \\(${n}\\) के लिए ${ask === "sum" ? "धनात्मक भाजकों का योग" : ask === "product" ? "धनात्मक भाजकों का गुणनफल" : ask === "odd" ? "विषम भाजकों की संख्या" : "धनात्मक भाजकों की संख्या"} ज्ञात करें?`, `ਸੰਖਿਆ \\(${n}\\) ਲਈ ${ask === "sum" ? "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ" : ask === "product" ? "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ" : ask === "odd" ? "ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ" : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ"} ਪਤਾ ਕਰੋ?`),
      t(`Using prime powers of \\(${n}\\), find the ${ask === "sum" ? "sum of all its positive divisors" : ask === "product" ? "product of all its positive divisors" : ask === "odd" ? "count of odd divisors" : "count of positive divisors"}.`, `\\(${n}\\) की अभाज्य घातों का उपयोग करके ${ask === "sum" ? "सभी धनात्मक भाजकों का योग ज्ञात करें" : ask === "product" ? "सभी धनात्मक भाजकों का गुणनफल ज्ञात करें" : ask === "odd" ? "विषम भाजकों की संख्या ज्ञात करें" : "धनात्मक भाजकों की कुल संख्या ज्ञात करें"}।`, `\\(${n}\\) ਦੀਆਂ ਅਭਾਜ ਘਾਤਾਂ ਵਰਤ ਕੇ ${ask === "sum" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ ਪਤਾ ਕਰੋ" : ask === "product" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ ਪਤਾ ਕਰੋ" : ask === "odd" ? "ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਗਿਣਤੀ ਪਤਾ ਕਰੋ" : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਕੁਲ ਗਿਣਤੀ ਪਤਾ ਕਰੋ"}।`),
      t(`A number is \\(${n}\\). Based on its prime factorisation, determine the ${ask === "sum" ? "sum of all its positive divisors" : ask === "product" ? "product of all its positive divisors" : ask === "odd" ? "total number of odd divisors" : "total number of positive divisors"}.`, `एक संख्या \\(${n}\\) है। उसके अभाज्य गुणनखंड के आधार पर ${ask === "sum" ? "सभी धनात्मक भाजकों का योग निर्धारित करें" : ask === "product" ? "सभी धनात्मक भाजकों का गुणनफल निर्धारित करें" : ask === "odd" ? "विषम भाजकों की कुल संख्या निर्धारित करें" : "धनात्मक भाजकों की कुल संख्या निर्धारित करें"}।`, `ਇੱਕ ਸੰਖਿਆ \\(${n}\\) ਹੈ। ਇਸ ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਦੇ ਆਧਾਰ ਤੇ ${ask === "sum" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਜੋੜ ਨਿਰਧਾਰਿਤ ਕਰੋ" : ask === "product" ? "ਸਾਰੇ ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦਾ ਗੁਣਨਫਲ ਨਿਰਧਾਰਿਤ ਕਰੋ" : ask === "odd" ? "ਟਾਂਕ ਭਾਜਕਾਂ ਦੀ ਕੁਲ ਗਿਣਤੀ ਨਿਰਧਾਰਿਤ ਕਰੋ" : "ਧਨਾਤਮਕ ਭਾਜਕਾਂ ਦੀ ਕੁਲ ਗਿਣਤੀ ਨਿਰਧਾਰਿਤ ਕਰੋ"}।`),
    ]),
    model: { kind: "factor_count", inputs: { n, ask } },
    variables: { n, ask, factors },
    hiddenVariables: { primeExponents: factors },
    derivedVariables: { factorization: displayFactors(factors) },
    answerUnit: ask === "count" || ask === "odd" ? "count" : "number",
    principle: t("Factor questions become simple after writing prime powers.", "अभाज्य घातों में लिखने के बाद भाजक प्रश्न सरल हो जाते हैं।", "ਅਭਾਜ ਘਾਤਾਂ ਵਿੱਚ ਲਿਖਣ ਤੋਂ ਬਾਅਦ ਭਾਜਕ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਸੌਖੇ ਹੋ ਜਾਂਦੇ ਹਨ।"),
    formula: "\\tau(n)=(a+1)(b+1)\\cdots",
    steps: [
      { key: "factorize", text: t("Write the number as a product of prime powers.", "संख्या को अभाज्य घातों के गुणनफल के रूप में लिखें।", "ਸੰਖਿਆ ਨੂੰ ਅਭਾਜ ਘਾਤਾਂ ਦੇ ਗੁਣਨਫਲ ਵਜੋਂ ਲਿਖੋ।"), math: `${n}=${displayFactors(factors)}` },
      { key: "apply", text: t("Use the exponent rule required by the question.", "प्रश्न के अनुसार घात वाला नियम लगाएं।", "ਪ੍ਰਸ਼ਨ ਮੁਤਾਬਕ ਘਾਤਾਂ ਵਾਲਾ ਨਿਯਮ ਲਗਾਓ।") },
    ],
    shortcut: t("Once prime powers are known, use the exponent pattern directly.", "अभाज्य घातें मिलते ही घातों का पैटर्न सीधे लगाएं।", "ਅਭਾਜ ਘਾਤਾਂ ਮਿਲਦੇ ਹੀ ਘਾਤਾਂ ਦਾ ਪੈਟਰਨ ਸਿੱਧਾ ਲਗਾਓ।"),
    traps: ["forgot plus one rule", "ignored factor 2", "used prime count instead of divisor count"],
  };
}

function hcfDraft(spec: Spec, seed: string): Draft {
  const h0 = pick([6, 8, 9, 12, 15, 18], `${seed}:h`);
  const m = pick([4, 5, 7, 11, 13], `${seed}:m`);
  const n0 = pick([6, 7, 10, 13, 17], `${seed}:n`);
  const a = h0 * m;
  const b = h0 * n0;
  const ask = spec.family.includes("lcm") || spec.family.includes("schedule") || spec.family.includes("minimum") ? "lcm" : spec.family.includes("relation") ? "other" : "hcf";
  const known = a;
  const h = gcd(a, b);
  const l = lcm(a, b);
  return {
    stem: stemVariant(seed, [
      t(
      ask === "other"
        ? `The HCF and LCM of two numbers are \\(${h}\\) and \\(${l}\\). If one number is \\(${known}\\), what is the other number?`
        : `Two cyclic events repeat every \\(${a}\\) and \\(${b}\\) minutes. After how many minutes will they occur together again?`,
      ask === "other"
        ? `दो संख्याओं का HCF और LCM क्रमशः \\(${h}\\) और \\(${l}\\) हैं। यदि एक संख्या \\(${known}\\) है, तो दूसरी संख्या क्या है?`
        : `दो घटनाएँ हर \\(${a}\\) और \\(${b}\\) मिनट में दोहराती हैं। वे फिर साथ कितने मिनट बाद होंगी?`,
      ask === "other"
        ? `ਦੋ ਸੰਖਿਆਵਾਂ ਦਾ HCF ਅਤੇ LCM ਕ੍ਰਮਵਾਰ \\(${h}\\) ਅਤੇ \\(${l}\\) ਹਨ। ਜੇ ਇੱਕ ਸੰਖਿਆ \\(${known}\\) ਹੈ, ਤਾਂ ਦੂਜੀ ਕੀ ਹੈ?`
        : `ਦੋ ਘਟਨਾਵਾਂ ਹਰ \\(${a}\\) ਅਤੇ \\(${b}\\) ਮਿੰਟ ਬਾਅਦ ਦੁਹਰਾਉਂਦੀਆਂ ਹਨ। ਉਹ ਮੁੜ ਇਕੱਠੀਆਂ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਹੋਣਗੀਆਂ?`,
      ),
      t(`Bells ring at intervals of \\(${a}\\) and \\(${b}\\) minutes. After how many minutes will both ring together again?`, `घंटियाँ \\(${a}\\) और \\(${b}\\) मिनट के अंतराल पर बजती हैं। दोनों फिर साथ कितने मिनट बाद बजेंगी?`, `ਘੰਟੀਆਂ \\(${a}\\) ਅਤੇ \\(${b}\\) ਮਿੰਟ ਦੇ ਅੰਤਰ ਤੇ ਵੱਜਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਮੁੜ ਇਕੱਠੀਆਂ ਕਿੰਨੇ ਮਿੰਟ ਬਾਅਦ ਵੱਜਣਗੀਆਂ?`),
      t(`Two buses leave a stand every \\(${a}\\) and \\(${b}\\) minutes. When will they next leave together?`, `दो बसें \\(${a}\\) और \\(${b}\\) मिनट बाद-बाद स्टैंड से चलती हैं। वे अगली बार साथ कब चलेंगी?`, `ਦੋ ਬੱਸਾਂ \\(${a}\\) ਅਤੇ \\(${b}\\) ਮਿੰਟ ਬਾਅਦ ਸਟੈਂਡ ਤੋਂ ਚਲਦੀਆਂ ਹਨ। ਉਹ ਅਗਲੀ ਵਾਰ ਇਕੱਠੀਆਂ ਕਦੋਂ ਚਲਣਗੀਆਂ?`),
      t(`For two numbers \\(${a}\\) and \\(${b}\\), which common multiple is first reached?`, `दो संख्याओं \\(${a}\\) और \\(${b}\\) के लिए पहला साझा गुणज क्या होगा?`, `ਦੋ ਸੰਖਿਆਵਾਂ \\(${a}\\) ਅਤੇ \\(${b}\\) ਲਈ ਪਹਿਲਾ ਸਾਂਝਾ ਗੁਣਜ ਕੀ ਹੋਵੇਗਾ?`),
    ]),
    model: { kind: "hcf_lcm", inputs: ask === "other" ? { ask, hcf: h, lcm: l, known } : { ask: "lcm", a, b } },
    variables: { a, b, hcf: h, lcm: l, ask },
    hiddenVariables: { productRelation: h * l },
    derivedVariables: {},
    answerUnit: "number",
    principle: t("HCF-LCM questions use common factor or common multiple structure.", "HCF-LCM प्रश्नों में साझा गुणनखंड या साझा गुणज की संरचना होती है।", "HCF-LCM ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਸਾਂਝੇ ਗੁਣਨਖੰਡ ਜਾਂ ਸਾਂਝੇ ਗੁਣਜ ਦੀ ਬਣਤਰ ਹੁੰਦੀ ਹੈ।"),
    formula: "a\\times b=\\operatorname{HCF}\\times\\operatorname{LCM}",
    steps: [
      { key: "relation", text: t("Choose HCF for common division and LCM for common repetition.", "साझा विभाजन के लिए HCF और साझा दोहराव के लिए LCM लें।", "ਸਾਂਝੀ ਵੰਡ ਲਈ HCF ਅਤੇ ਸਾਂਝੇ ਦੁਹਰਾਅ ਲਈ LCM ਲਵੋ।") },
      { key: "compute", text: t("Apply the relation with the given values.", "दिए गए मानों से संबंध लगाएं।", "ਦਿੱਤੇ ਮੁੱਲਾਂ ਨਾਲ ਸੰਬੰਧ ਲਗਾਓ।"), math: ask === "other" ? `${h}\\times ${l}=${known}\\times x` : `\\operatorname{LCM}(${a},${b})=${l}` },
    ],
    shortcut: t("For repeat-together questions, take LCM directly.", "साथ दोहराने वाले प्रश्नों में सीधे LCM लें।", "ਇਕੱਠੇ ਦੁਹਰਾਉਣ ਵਾਲੇ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਸਿੱਧਾ LCM ਲਵੋ।"),
    traps: ["used HCF instead of LCM", "inverted product relation", "ignored third condition"],
  };
}

function remainderDraft(spec: Spec, seed: string): Draft {
  const base = pick([2, 3, 7, 11, 13], `${seed}:base`);
  const exp = int(`${seed}:exp`, 23, 97);
  const mod = pick([5, 7, 9, 11, 13], `${seed}:mod`);
  return {
    stem: stemVariant(seed, [
      t(`For \\(${base}^{${exp}}\\), find the remainder on division by \\(${mod}\\) without expansion.`, `घात को फैलाए बिना \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग देने पर शेषफल ज्ञात करें।`, `ਘਾਤ ਨੂੰ ਫੈਲਾਏ ਬਿਨਾਂ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕਿੰਨਾ ਆਵੇਗਾ?`),
      t(`When \\(${base}^{${exp}}\\) is divided by \\(${mod}\\), what remainder is left?`, `\\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग देने पर क्या शेषफल आएगा?`, `\\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕਿਹੜਾ ਬਾਕੀ ਆਵੇਗਾ?`),
      t(`Using cyclic remainders, evaluate the remainder of \\(${base}^{${exp}}\\) modulo \\(${mod}\\).`, `चक्रीय शेषफल से \\(${base}^{${exp}}\\) modulo \\(${mod}\\) का शेषफल निकालें।`, `ਚੱਕਰੀ ਬਾਕੀਆਂ ਨਾਲ \\(${base}^{${exp}}\\) modulo \\(${mod}\\) ਦਾ ਬਾਕੀ ਕੱਢੋ।`),
      t(`Power \\(${base}^{${exp}}\\) is tested modulo \\(${mod}\\). Which remainder is obtained?`, `बड़ी घात \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग दिया गया। शेषफल क्या है?`, `ਵੱਡੀ ਘਾਤ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ। ਬਾਕੀ ਕੀ ਹੈ?`),
    ]),
    model: { kind: "remainder", inputs: { base, exp, mod } },
    variables: { base, exp, mod },
    hiddenVariables: { cycle: "modular power cycle" },
    derivedVariables: { reducedExponent: exp },
    answerUnit: "remainder",
    principle: t("Large powers are handled by modular cycles.", "बड़ी घातों को मॉड्यूलर चक्र से संभालते हैं।", "ਵੱਡੀਆਂ ਘਾਤਾਂ ਨੂੰ ਮਾਡਿਊਲਰ ਚੱਕਰ ਨਾਲ ਹੱਲ ਕਰਦੇ ਹਾਂ।"),
    formula: "a^n\\bmod m",
    steps: [
      { key: "reduce", text: t("First reduce the base modulo the divisor.", "पहले आधार को भाजक के अनुसार घटाएं।", "ਪਹਿਲਾਂ ਆਧਾਰ ਨੂੰ ਭਾਜਕ ਮੁਤਾਬਕ ਘਟਾਓ।"), math: `${base}\\equiv ${base % mod}\\pmod{${mod}}` },
      { key: "cycle", text: t("Use the repeating remainder cycle instead of expanding the power.", "घात फैलाने के बजाय दोहराते शेषफल चक्र का प्रयोग करें।", "ਘਾਤ ਫੈਲਾਉਣ ਦੀ ਥਾਂ ਦੁਹਰਾਉਂਦਾ ਬਾਕੀ ਚੱਕਰ ਵਰਤੋ।") },
    ],
    shortcut: t("Reduce the base first, then use the power cycle position.", "पहले आधार घटाएं, फिर घात-चक्र की स्थिति लें।", "ਪਹਿਲਾਂ ਆਧਾਰ ਘਟਾਓ, ਫਿਰ ਘਾਤ-ਚੱਕਰ ਦੀ ਸਥਿਤੀ ਲਵੋ।"),
    traps: ["wrong cycle position", "expanded power", "used divisor as cycle length"],
  };
}

function lastDigitDraft(spec: Spec, seed: string): Draft {
  const base = pick([2, 3, 7, 8, 12, 17, 23], `${seed}:base`);
  const exp = int(`${seed}:exp`, 31, 123);
  const mod = spec.family.includes("two") ? 100 : spec.family.includes("three") ? 1000 : 10;
  return {
    stem: stemVariant(seed, [
      t(`For exponent \\(${exp}\\), what ending ${mod === 10 ? "digit" : mod === 100 ? "two digits" : "three digits"} does \\(${base}^{${exp}}\\) have?`, `\\(${base}^{${exp}}\\) का अंतिम ${mod === 10 ? "अंक" : mod === 100 ? "दो अंक" : "तीन अंक"} क्या है?`, `\\(${base}^{${exp}}\\) ਦਾ ਆਖਰੀ ${mod === 10 ? "ਅੰਕ" : mod === 100 ? "ਦੋ ਅੰਕ" : "ਤਿੰਨ ਅੰਕ"} ਕੀ ਹੈ?`),
      t(`The power \\(${base}^{${exp}}\\) is very large. What are its final ${mod === 10 ? "digit" : mod === 100 ? "two digits" : "three digits"}?`, `\\(${base}^{${exp}}\\) के अंतिम ${mod === 10 ? "अंक" : mod === 100 ? "दो अंक" : "तीन अंक"} ज्ञात करें?`, `\\(${base}^{${exp}}\\) ਦੇ ਆਖਰੀ ${mod === 10 ? "ਅੰਕ" : mod === 100 ? "ਦੋ ਅੰਕ" : "ਤਿੰਨ ਅੰਕ"} ਪਤਾ ਕਰੋ?`),
      t(`When \\(${base}\\) is raised to \\(${exp}\\), what ${mod === 10 ? "digit appears at the end" : mod === 100 ? "two digits appear at the end" : "three digits appear at the end"}?`, `अभिव्यक्ति \\(${base}^{${exp}}\\) का अंतिम ${mod === 10 ? "अंक" : mod === 100 ? "दो अंक" : "तीन अंक"} ज्ञात करें।`, `ਅਭਿਵਿਅਕਤੀ \\(${base}^{${exp}}\\) ਦਾ ਆਖਰੀ ${mod === 10 ? "ਅੰਕ" : mod === 100 ? "ਦੋ ਅੰਕ" : "ਤਿੰਨ ਅੰਕ"} ਪਤਾ ਕਰੋ।`),
      t(`In \\(${base}^{${exp}}\\), determine the final ${mod === 10 ? "digit" : mod === 100 ? "two digits" : "three digits"} without expanding the power.`, `\\(${base}^{${exp}}\\) का अंतिम ${mod === 10 ? "अंक (इकाई अंक)" : mod === 100 ? "दो अंक" : "तीन अंक"} क्या है?`, `\\(${base}^{${exp}}\\) ਦਾ ਆਖਰੀ ${mod === 10 ? "ਅੰਕ (ਇਕਾਈ ਅੰਕ)" : mod === 100 ? "ਦੋ ਅੰਕ" : "ਤਿੰਨ ਅੰਕ"} ਕੀ ਹੈ?`),
    ]),
    model: { kind: "last_digit", inputs: { base, exp, mod } },
    variables: { base, exp, mod },
    hiddenVariables: { cycleModulus: mod },
    derivedVariables: {},
    answerUnit: "remainder",
    principle: t("Last-digit questions depend on the cyclicity of powers.", "अंतिम अंक वाले प्रश्न घातों की चक्रीयता पर निर्भर करते हैं।", "ਆਖਰੀ ਅੰਕ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਘਾਤਾਂ ਦੇ ਚੱਕਰ ਤੇ ਨਿਰਭਰ ਕਰਦੇ ਹਨ।"),
    formula: `a^n\\bmod ${mod}`,
    steps: [
      { key: "cycle", text: t("Identify the power cycle for the required ending digits.", "चाहे गए अंतिम अंकों के लिए घात चक्र पहचानें।", "ਲੋੜੀਂਦੇ ਆਖਰੀ ਅੰਕਾਂ ਲਈ ਘਾਤ ਚੱਕਰ ਪਛਾਣੋ।") },
      { key: "position", text: t("Use the exponent position in that cycle.", "उस चक्र में घात की स्थिति लें।", "ਉਸ ਚੱਕਰ ਵਿੱਚ ਘਾਤ ਦੀ ਸਥਿਤੀ ਲਵੋ।"), math: `(${exp}-1)\\bmod 4+1` },
    ],
    shortcut: t("Only the cycle position matters, not the full power.", "पूरी घात नहीं, केवल चक्र की स्थिति मायने रखती है।", "ਪੂਰੀ ਘਾਤ ਨਹੀਂ, ਸਿਰਫ਼ ਚੱਕਰ ਦੀ ਸਥਿਤੀ ਮਾਇਨੇ ਰੱਖਦੀ ਹੈ।"),
    traps: ["wrong unit digit cycle", "used exponent directly", "ignored last two digit modulus"],
  };
}

function digitDraft(spec: Spec, seed: string): Draft {
  const tens = int(`${seed}:tens`, 3, 8);
  const ones = int(`${seed}:ones`, 1, 9);
  const n = 10 * tens + ones;
  const ask = spec.family.includes("number_of_digits") ? "digits" : spec.family.includes("interchange") ? "reversal" : "number";
  return {
    stem: stemVariant(seed, ask === "digits"
      ? [
          t(`For \\(${n}\\), how many digits are written in its decimal form?`, `संख्या \\(${n}\\) में कितने अंक हैं?`, `ਸੰਖਿਆ \\(${n}\\) ਵਿੱਚ ਕਿੰਨੇ ਅੰਕ ਹਨ?`),
          t(`Count the digits in \\(${n}\\). What is the digit count?`, `\\(${n}\\) में अंकों की गिनती करें। अंक-गिनती क्या है?`, `\\(${n}\\) ਵਿੱਚ ਅੰਕਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ। ਅੰਕ-ਗਿਣਤੀ ਕੀ ਹੈ?`),
          t(`The number \\(${n}\\) is written in decimal form. How many digits does it contain?`, `संख्या \\(${n}\\) दशमलव रूप में लिखी है। इसमें कितने अंक हैं?`, `ਸੰਖਿਆ \\(${n}\\) ਦਸ਼ਮਲਵ ਰੂਪ ਵਿੱਚ ਲਿਖੀ ਹੈ। ਇਸ ਵਿੱਚ ਕਿੰਨੇ ਅੰਕ ਹਨ?`),
          t(`For \\(${n}\\), what is the total number of digits?`, `\\(${n}\\) के लिए कुल कितने अंक हैं?`, `\\(${n}\\) ਲਈ ਕੁੱਲ ਕਿੰਨੇ ਅੰਕ ਹਨ?`),
        ]
      : ask === "reversal"
      ? [
          t(`Digits \\(${tens}\\) and \\(${ones}\\) form a two-digit number. What is the difference between it and its reversed number?`, `अंक \\(${tens}\\) और \\(${ones}\\) एक दो-अंकीय संख्या बनाते हैं। उसका और उलटी संख्या का अंतर क्या है?`, `ਅੰਕ \\(${tens}\\) ਅਤੇ \\(${ones}\\) ਇੱਕ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਬਣਾਉਂਦੇ ਹਨ। ਉਸ ਦਾ ਅਤੇ ਉਲਟੀ ਸੰਖਿਆ ਦਾ ਫਰਕ ਕੀ ਹੈ?`),
          t(`Tens digit \\(${tens}\\) and ones digit \\(${ones}\\) are used in a number. How much does it change when reversed?`, `दहाई अंक \\(${tens}\\) और इकाई अंक \\(${ones}\\) एक संख्या में हैं। उलटने पर वह कितनी बदलेगी?`, `ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਅਤੇ ਇਕਾਈ ਅੰਕ \\(${ones}\\) ਇੱਕ ਸੰਖਿਆ ਵਿੱਚ ਹਨ। ਉਲਟਣ ਤੇ ਇਹ ਕਿੰਨੀ ਬਦਲੇਗੀ?`),
          t(`Number \\(${10 * tens + ones}\\) is reversed by interchanging its digits. What absolute difference is obtained?`, `संख्या \\(${10 * tens + ones}\\) के अंक आपस में बदल दिए जाते हैं। पूर्ण अंतर क्या मिलेगा?`, `ਸੰਖਿਆ \\(${10 * tens + ones}\\) ਦੇ ਅੰਕ ਆਪਸ ਵਿੱਚ ਬਦਲੇ ਜਾਂਦੇ ਹਨ। ਪੂਰਾ ਫਰਕ ਕੀ ਮਿਲੇਗਾ?`),
          t(`With tens \\(${tens}\\) and ones \\(${ones}\\), a two-digit number is written. What difference appears after reversing?`, `दहाई \\(${tens}\\) और इकाई \\(${ones}\\) से दो-अंकीय संख्या लिखी गई। उलटने पर कितना अंतर आएगा?`, `ਦਹਾਈ \\(${tens}\\) ਅਤੇ ਇਕਾਈ \\(${ones}\\) ਨਾਲ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਲਿਖੀ ਗਈ। ਉਲਟਣ ਤੇ ਕਿੰਨਾ ਫਰਕ ਆਵੇਗਾ?`),
        ]
      : [
          t(`Digit sum \\(${tens + ones}\\) with tens digit \\(${tens}\\) identifies which two-digit number?`, `दो-अंकीय संख्या का अंक-योग \\(${tens + ones}\\) और दहाई अंक \\(${tens}\\) ज्ञात हैं। संख्या क्या है?`, `ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਦਾ ਅੰਕ-ਜੋੜ \\(${tens + ones}\\) ਅਤੇ ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਪਤਾ ਹਨ। ਸੰਖਿਆ ਕੀ ਹੈ?`),
          t(`If the digit sum is \\(${tens + ones}\\) and the tens digit is \\(${tens}\\), what number is formed?`, `दो-अंकीय संख्या के लिए अंक-योग \\(${tens + ones}\\) दिया है। यदि दहाई अंक \\(${tens}\\) है, तो संख्या क्या है?`, `ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਲਈ ਅੰਕ-ਜੋੜ \\(${tens + ones}\\) ਦਿੱਤਾ ਹੈ। ਜੇ ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਹੈ, ਤਾਂ ਸੰਖਿਆ ਕੀ ਹੈ?`),
          t(`Tens digit \\(${tens}\\) and digit sum \\(${tens + ones}\\) are fixed. What is the number?`, `मान \\(${tens + ones}\\) किसी दो-अंकीय संख्या के अंकों का योग है। उसका दहाई अंक \\(${tens}\\) है। संख्या ज्ञात करें?`, `ਮੁੱਲ \\(${tens + ones}\\) ਕਿਸੇ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਦੇ ਅੰਕਾਂ ਦਾ ਜੋੜ ਹੈ। ਉਸ ਦਾ ਦਹਾਈ ਅੰਕ \\(${tens}\\) ਹੈ। ਸੰਖਿਆ ਪਤਾ ਕਰੋ?`),
          t(`The tens place has \\(${tens}\\), and all digits add to \\(${tens + ones}\\). Which number is it?`, `अंक-योग \\(${tens + ones}\\) वाली दो-अंकीय संख्या के दहाई स्थान पर \\(${tens}\\) है। वह संख्या कौन-सी है?`, `ਅੰਕ-ਜੋੜ \\(${tens + ones}\\) ਵਾਲੀ ਦੋ ਅੰਕਾਂ ਦੀ ਸੰਖਿਆ ਦੇ ਦਹਾਈ ਥਾਂ ਤੇ \\(${tens}\\) ਹੈ। ਉਹ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ?`),
          t(`Tens digit \\(${tens}\\), digit sum \\(${tens + ones}\\): which two-digit number satisfies both facts?`, `दहाई अंक \\(${tens}\\), अंक-योग \\(${tens + ones}\\): कौन-सी दो-अंकीय संख्या दोनों बातें पूरी करती है?`, `ਦਹਾਈ ਅੰਕ \\(${tens}\\), ਅੰਕ-ਜੋੜ \\(${tens + ones}\\): ਕਿਹੜੀ ਦੋ ਅੰਕਾਂ ਵਾਲੀ ਸੰਖਿਆ ਦੋਵੇਂ ਗੱਲਾਂ ਪੂਰੀ ਕਰਦੀ ਹੈ?`),
        ]),
    model: { kind: "digit_logic", inputs: { tens, ones, n, ask, answer: ask === "number" ? n : Math.abs(n - (10 * ones + tens)) } },
    variables: { tens, ones, n, ask },
    hiddenVariables: { reversed: 10 * ones + tens },
    derivedVariables: { digitSum: tens + ones },
    answerUnit: "number",
    principle: t("Digit questions convert place values into equations.", "अंक वाले प्रश्न स्थान-मूल्य को समीकरण में बदलते हैं।", "ਅੰਕਾਂ ਵਾਲੇ ਪ੍ਰਸ਼ਨ ਸਥਾਨ-ਮੁੱਲ ਨੂੰ ਸਮੀਕਰਨ ਵਿੱਚ ਬਦਲਦੇ ਹਨ।"),
    formula: "N=10a+b",
    steps: [
      { key: "place", text: t("Write the number using tens and ones places.", "संख्या को दहाई और इकाई स्थान से लिखें।", "ਸੰਖਿਆ ਨੂੰ ਦਹਾਈ ਅਤੇ ਇਕਾਈ ਸਥਾਨ ਨਾਲ ਲਿਖੋ।"), math: `N=10\\times ${tens}+${ones}` },
      { key: "finish", text: t("Use the given digit condition to get the asked value.", "दिए गए अंक संबंध से पूछा गया मान निकालें।", "ਦਿੱਤੇ ਅੰਕ ਸੰਬੰਧ ਨਾਲ ਪੁੱਛਿਆ ਮੁੱਲ ਕੱਢੋ।") },
    ],
    shortcut: t("For two digits, use place value directly.", "दो अंकों के लिए स्थान-मूल्य सीधे लगाएं।", "ਦੋ ਅੰਕਾਂ ਲਈ ਸਥਾਨ-ਮੁੱਲ ਸਿੱਧਾ ਲਗਾਓ।"),
    traps: ["reversed digits", "used digit sum as number", "place value error"],
  };
}

function factorialDraft(spec: Spec, seed: string): Draft {
  const ask = spec.family.includes("zero") ? "zeros" : spec.family.includes("remainder") ? "remainder" : "power";
  const n = pick([25, 30, 40, 50, 60, 75], `${seed}:n`);
  const p = ask === "zeros" ? 5 : pick([2, 3, 5], `${seed}:p`);
  return {
    stem: stemVariant(seed, [
      t(
      ask === "zeros"
        ? `How many trailing zeroes are there in \\(${n}!\\)?`
        : `What is the highest power of \\(${p}\\) that divides \\(${n}!\\)?`,
      ask === "zeros"
        ? `\\(${n}!\\) में अंत में कितने शून्य होंगे?`
        : `\\(${n}!\\) को विभाजित करने वाली \\(${p}\\) की सबसे बड़ी घात क्या है?`,
      ask === "zeros"
        ? `\\(${n}!\\) ਦੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਹੋਣਗੇ?`
        : `\\(${n}!\\) ਨੂੰ ਭਾਗ ਕਰਨ ਵਾਲੀ \\(${p}\\) ਦੀ ਸਭ ਤੋਂ ਵੱਡੀ ਘਾਤ ਕੀ ਹੈ?`,
      ),
      t(
        ask === "zeros"
          ? `In \\(${n}!\\), what is the total count of trailing zeroes?`
          : `In \\(${n}!\\), find the exponent of \\(${p}\\) in its prime factorisation?`,
        ask === "zeros"
          ? `\\(${n}!\\) में अंत में कितने शून्य प्राप्त होते हैं?`
          : `\\(${n}!\\) में अभाज्य गुणनखंड \\(${p}\\) की घात ज्ञात करें?`,
        ask === "zeros"
          ? `\\(${n}!\\) ਦੇ ਅੰਤ ਵਿੱਚ ਕਿੰਨੇ ਸਿਫ਼ਰ ਪ੍ਰਾਪਤ ਹੁੰਦੇ ਹਨ?`
          : `\\(${n}!\\) ਵਿੱਚ ਅਭਾਜ ਗੁਣਨਖੰਡ \\(${p}\\) ਦੀ ਘਾਤ ਪਤਾ ਕਰੋ?`
      ),
      t(
        ask === "zeros"
          ? `For the factorial \\(${n}!\\), find the total count of trailing zeroes.`
          : `For the factorial \\(${n}!\\), what count is obtained by tracking prime factor \\(${p}\\)?`,
        ask === "zeros"
          ? `फैक्टोरियल \\(${n}!\\) के लिए, अंत में शून्यों की कुल संख्या ज्ञात करें।`
          : `फैक्टोरियल \\(${n}!\\) में अभाज्य गुणनखंड \\(${p}\\) गिनकर क्या मान मिलेगा?`,
        ask === "zeros"
          ? `ਫੈਕਟੋਰੀਅਲ \\(${n}!\\) ਲਈ, ਅੰਤ ਵਿੱਚ ਸਿਫ਼ਰਾਂ ਦੀ ਕੁਲ ਗਿਣਤੀ ਪਤਾ ਕਰੋ।`
          : `ਫੈਕਟੋਰੀਅਲ \\(${n}!\\) ਵਿੱਚ ਅਭਾਜ ਗੁਣਨਖੰਡ \\(${p}\\) ਗਿਣ ਕੇ ਕਿਹੜਾ ਮੁੱਲ ਮਿਲੇਗਾ?`
      ),
      t(
        ask === "zeros"
          ? `A factorial expression \\(${n}!\\) is given. What is the count of trailing zeroes?`
          : `A factorial expression \\(${n}!\\) is given. What is the exponent of prime factor \\(${p}\\)?`,
        ask === "zeros"
          ? `फैक्टोरियल अभिव्यक्ति \\(${n}!\\) दी है। शून्यों की संख्या क्या है?`
          : `फैक्टोरियल अभिव्यक्ति \\(${n}!\\) दी है। अभाज्य गुणनखंड \\(${p}\\) की घात क्या है?`,
        ask === "zeros"
          ? `ਫੈਕਟੋਰੀਅਲ ਅਭਿਵਿਅਕਤੀ \\(${n}!\\) ਦਿੱਤੀ ਹੈ। ਸਿਫ਼ਰਾਂ ਦੀ ਗਿਣਤੀ ਕੀ ਹੈ?`
          : `ਫੈਕਟੋਰੀਅਲ ਅਭਿਵਿਅਕਤੀ \\(${n}!\\) ਦਿੱਤੀ ਹੈ। ਅਭਾਜ ਗੁਣਨਖੰਡ \\(${p}\\) ਦੀ ਘਾਤ ਕੀ ਹੈ?`
      ),
    ]),
    model: { kind: "factorial", inputs: { n, p, ask } },
    variables: { n, p, ask },
    hiddenVariables: { primePower: p },
    derivedVariables: {},
    answerUnit: "count",
    principle: t("Factorial exponent questions count prime factors inside the factorial.", "फैक्टोरियल घात प्रश्नों में फैक्टोरियल के अंदर अभाज्य गुणनखंड गिने जाते हैं।", "ਫੈਕਟੋਰੀਅਲ ਘਾਤ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਫੈਕਟੋਰੀਅਲ ਦੇ ਅੰਦਰਲੇ ਅਭਾਜ ਗੁਣਨਖੰਡ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।"),
    formula: "\\left\\lfloor\\frac{n}{p}\\right\\rfloor+\\left\\lfloor\\frac{n}{p^2}\\right\\rfloor+\\cdots",
    steps: [
      { key: "count", text: t("Count multiples of the prime, then its higher powers.", "पहले अभाज्य के गुणज, फिर उसकी ऊँची घातों के गुणज गिनें।", "ਪਹਿਲਾਂ ਅਭਾਜ ਦੇ ਗੁਣਜ, ਫਿਰ ਉਸ ਦੀਆਂ ਵੱਡੀਆਂ ਘਾਤਾਂ ਦੇ ਗੁਣਜ ਗਿਣੋ।") },
      { key: "substitute", text: t("Add all quotient terms.", "सभी भागफल पद जोड़ें।", "ਸਾਰੇ ਭਾਗਫਲ ਪਦ ਜੋੜੋ।"), math: `\\left\\lfloor\\frac{${n}}{${p}}\\right\\rfloor+\\left\\lfloor\\frac{${n}}{${p * p}}\\right\\rfloor+\\cdots` },
    ],
    shortcut: t("For trailing zeroes, count factors of 5 in the factorial.", "अंतिम शून्यों के लिए फैक्टोरियल में 5 के गुणनखंड गिनें।", "ਅੰਤਲੇ ਸਿਫ਼ਰਾਂ ਲਈ ਫੈਕਟੋਰੀਅਲ ਵਿੱਚ 5 ਦੇ ਗੁਣਨਖੰਡ ਗਿਣੋ।"),
    traps: ["counted only first quotient", "used factor 2 instead of 5", "forgot higher powers"],
  };
}

function modularDraft(spec: Spec, seed: string): Draft {
  const base = pick([7, 11, 17, 19], `${seed}:base`);
  const exp = int(`${seed}:exp`, 35, 120);
  const mod = pick([9, 13, 17, 19], `${seed}:mod`);
  return {
    stem: stemVariant(seed, [
      t(`A number leaves the same remainder as \\(${base}^{${exp}}\\) when divided by \\(${mod}\\). What is that remainder?`, `एक संख्या \\(${mod}\\) से भाग देने पर \\(${base}^{${exp}}\\) जैसा ही शेषफल देती है। वह शेषफल क्या है?`, `ਇੱਕ ਸੰਖਿਆ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ \\(${base}^{${exp}}\\) ਵਰਗਾ ਹੀ ਬਾਕੀ ਦਿੰਦੀ ਹੈ। ਉਹ ਬਾਕੀ ਕੀ ਹੈ?`),
      t(`The expression \\(${base}^{${exp}}\\) is reduced modulo \\(${mod}\\). What remainder is obtained?`, `अभिव्यक्ति \\(${base}^{${exp}}\\) को modulo \\(${mod}\\) में घटाया गया। क्या शेषफल मिलेगा?`, `ਅਭਿਵਿਅਕਤੀ \\(${base}^{${exp}}\\) ਨੂੰ modulo \\(${mod}\\) ਵਿੱਚ ਘਟਾਇਆ ਗਿਆ। ਕਿਹੜਾ ਬਾਕੀ ਮਿਲੇਗਾ?`),
      t(`Using modular arithmetic, find the remainder of \\(${base}^{${exp}}\\) on division by \\(${mod}\\).`, `मॉड्यूलर अंकगणित से \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग देने पर शेषफल निकालें।`, `ਮਾਡਿਊਲਰ ਗਣਿਤ ਨਾਲ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੱਢੋ।`),
      t(`For \\(${base}^{${exp}}\\), use the cycle modulo \\(${mod}\\). What remainder is left?`, `पूरी घात निकाले बिना \\(${base}^{${exp}}\\) modulo \\(${mod}\\) में क्या शेषफल छोड़ेगा?`, `ਪੂਰੀ ਘਾਤ ਕੱਢੇ ਬਿਨਾਂ \\(${base}^{${exp}}\\) modulo \\(${mod}\\) ਵਿੱਚ ਕਿੰਨਾ ਬਾਕੀ ਛੱਡੇਗਾ?`),
      t(`Reduce the power \\(${base}^{${exp}}\\) by its remainder pattern. What is the remainder on division by \\(${mod}\\)?`, `\\(${base}^{${exp}}\\) को उसके शेषफल पैटर्न से घटाएं। \\(${mod}\\) से भाग देने पर शेषफल क्या होगा?`, `\\(${base}^{${exp}}\\) ਨੂੰ ਉਸ ਦੇ ਬਾਕੀ ਪੈਟਰਨ ਨਾਲ ਘਟਾਓ। \\(${mod}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ ਕੀ ਹੋਵੇਗਾ?`),
      t(`A large power \\(${base}^{${exp}}\\) is divided by \\(${mod}\\). What remainder should be written?`, `बड़ी घात \\(${base}^{${exp}}\\) को \\(${mod}\\) से भाग दिया गया। कौन-सा शेषफल लिखा जाएगा?`, `ਵੱਡੀ ਘਾਤ \\(${base}^{${exp}}\\) ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ। ਕਿਹੜਾ ਬਾਕੀ ਲਿਖਿਆ ਜਾਵੇਗਾ?`),
      t(`For exponent \\(${exp}\\), the powers of \\(${base}\\) repeat in remainders modulo \\(${mod}\\). What remainder appears?`, `exponent \\(${exp}\\) के लिए \\(${base}\\) की घातों के शेषफल modulo \\(${mod}\\) में दोहराते हैं। कौन-सा शेषफल आएगा?`, `exponent \\(${exp}\\) ਲਈ \\(${base}\\) ਦੀਆਂ ਘਾਤਾਂ ਦੇ ਬਾਕੀ modulo \\(${mod}\\) ਵਿੱਚ ਦੁਹਰਾਂਦੇ ਹਨ। ਕਿਹੜਾ ਬਾਕੀ ਆਵੇਗਾ?`),
      t(`Cycle position \\(${exp}\\) is needed for powers of \\(${base}\\) modulo \\(${mod}\\). What is the remainder?`, `\\(${base}\\) की घातों को modulo \\(${mod}\\) में देखने पर cycle position \\(${exp}\\) चाहिए। शेषफल क्या है?`, `\\(${base}\\) ਦੀਆਂ ਘਾਤਾਂ ਨੂੰ modulo \\(${mod}\\) ਵਿੱਚ ਵੇਖਣ ਤੇ cycle position \\(${exp}\\) ਚਾਹੀਦੀ ਹੈ। ਬਾਕੀ ਕੀ ਹੈ?`),
    ]),
    model: { kind: "modular_hybrid", inputs: { base, exp, mod } },
    variables: { base, exp, mod },
    hiddenVariables: { reducedBase: base % mod },
    derivedVariables: {},
    answerUnit: "remainder",
    principle: t("Hybrid number-theory questions reduce the expression before calculating.", "हाइब्रिड संख्या-पद्धति प्रश्नों में गणना से पहले अभिव्यक्ति घटाई जाती है।", "ਹਾਈਬ੍ਰਿਡ ਨੰਬਰ ਸਿਸਟਮ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਹਿਸਾਬ ਤੋਂ ਪਹਿਲਾਂ ਅਭਿਵਿਅਕਤੀ ਘਟਾਈ ਜਾਂਦੀ ਹੈ।"),
    formula: "a^n\\equiv r\\pmod m",
    steps: [
      { key: "reduce", text: t("Reduce the base and use the cycle of remainders.", "आधार घटाकर शेषफलों का चक्र लगाएं।", "ਆਧਾਰ ਘਟਾ ਕੇ ਬਾਕੀਆਂ ਦਾ ਚੱਕਰ ਲਗਾਓ।"), math: `${base}\\equiv ${base % mod}\\pmod{${mod}}` },
      { key: "position", text: t("Use the exponent position to identify the final remainder.", "अंतिम शेषफल के लिए घात की स्थिति पहचानें।", "ਅੰਤਿਮ ਬਾਕੀ ਲਈ ਘਾਤ ਦੀ ਸਥਿਤੀ ਪਛਾਣੋ।") },
    ],
    shortcut: t("Never expand the power; reduce and cycle.", "घात कभी न फैलाएं; घटाएं और चक्र लगाएं।", "ਘਾਤ ਕਦੇ ਨਾ ਫੈਲਾਓ; ਘਟਾਓ ਅਤੇ ਚੱਕਰ ਲਗਾਓ।"),
    traps: ["expanded expression", "wrong modular cycle", "ignored reduction"],
  };
}

function optimizationDraft(spec: Spec, seed: string): Draft {
  const divisors = [6, 8, 9, 12, 15, 18, 20, 24, 30, 36];
  const a = pick(divisors, `${seed}:a`);
  const b = pick(divisors.filter((value) => value !== a), `${seed}:b`);
  const combined = lcm(a, b);
  const family = spec.family;
  let model: NumberSystemSolverModel;
  let stem: NumberSystemLocalizedText;
  let variables: Record<string, unknown>;
  let hiddenVariables: Record<string, unknown>;
  let formula = "N\\equiv r\\pmod m";
  if (family.includes("greatest") || family.includes("largest_valid")) {
    const upper = combined * int(`${seed}:q`, 9, 19) + int(`${seed}:gap`, 7, combined - 1);
    model = { kind: "optimization_constraint", inputs: { mode: "greatest_multiple_below", upper, lcm: combined } };
    const answer = evaluateNumberSystemSolverModel(model);
    stem = stemVariant(seed, [
      t(`What is the greatest number less than \\(${upper}\\) that is divisible by both \\(${a}\\) and \\(${b}\\)?`, `\\(${upper}\\) से छोटी सबसे बड़ी संख्या कौन-सी है जो \\(${a}\\) और \\(${b}\\) दोनों से विभाज्य हो?`, `\\(${upper}\\) ਤੋਂ ਛੋਟੀ ਸਭ ਤੋਂ ਵੱਡੀ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ ਜੋ \\(${a}\\) ਅਤੇ \\(${b}\\) ਦੋਵਾਂ ਨਾਲ ਭਾਗ ਜਾਂਦੀ ਹੈ?`),
      t(`Find the largest integer below \\(${upper}\\) which satisfies divisibility by \\(${a}\\) and \\(${b}\\).`, `\\(${upper}\\) से कम वह सबसे बड़ा पूर्णांक ज्ञात करें जो \\(${a}\\) और \\(${b}\\) दोनों से विभाज्य है।`, `\\(${upper}\\) ਤੋਂ ਘੱਟ ਉਹ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ ਕੱਢੋ ਜੋ \\(${a}\\) ਅਤੇ \\(${b}\\) ਦੋਵਾਂ ਨਾਲ ਭਾਗ ਜਾਂਦਾ ਹੈ।`),
    ]);
    variables = { upper, a, b, lcm: combined, answer };
    hiddenVariables = { boundary: upper, commonDivisor: combined };
  } else if (family.includes("minimum_addition")) {
    const divisor = pick([9, 11, 12, 18, 24, 36], `${seed}:d`);
    const n = divisor * int(`${seed}:q`, 17, 41) + int(`${seed}:r`, 2, divisor - 2);
    model = { kind: "optimization_constraint", inputs: { mode: "minimum_addition", n, divisor } };
    const answer = evaluateNumberSystemSolverModel(model);
    stem = stemVariant(seed, [
      t(`What least number should be added to \\(${n}\\) so that the result is divisible by \\(${divisor}\\)?`, `\\(${n}\\) में कौन-सी न्यूनतम संख्या जोड़ी जाए ताकि परिणाम \\(${divisor}\\) से विभाज्य हो?`, `\\(${n}\\) ਵਿੱਚ ਸਭ ਤੋਂ ਘੱਟ ਕਿਹੜੀ ਸੰਖਿਆ ਜੋੜੀ ਜਾਵੇ ਤਾਂ ਜੋ ਨਤੀਜਾ \\(${divisor}\\) ਨਾਲ ਭਾਗ ਜਾਵੇ?`),
      t(`A number \\(${n}\\) is to be made divisible by \\(${divisor}\\). What is the minimum addition required?`, `संख्या \\(${n}\\) को \\(${divisor}\\) से विभाज्य बनाना है। न्यूनतम जोड़ कितना होगा?`, `ਸੰਖਿਆ \\(${n}\\) ਨੂੰ \\(${divisor}\\) ਨਾਲ ਭਾਗਯੋਗ ਬਣਾਉਣਾ ਹੈ। ਘੱਟੋ-ਘੱਟ ਜੋੜ ਕਿੰਨਾ ਹੋਵੇਗਾ?`),
    ]);
    variables = { n, divisor, answer };
    hiddenVariables = { remainder: n % divisor };
  } else if (family.includes("minimum_subtraction")) {
    const divisor = pick([9, 11, 12, 18, 24, 36], `${seed}:d`);
    const n = divisor * int(`${seed}:q`, 19, 43) + int(`${seed}:r`, 2, divisor - 2);
    model = { kind: "optimization_constraint", inputs: { mode: "minimum_subtraction", n, divisor } };
    const answer = evaluateNumberSystemSolverModel(model);
    stem = stemVariant(seed, [
      t(`What least number should be subtracted from \\(${n}\\) so that the result is divisible by \\(${divisor}\\)?`, `\\(${n}\\) में से कौन-सी न्यूनतम संख्या घटाई जाए ताकि परिणाम \\(${divisor}\\) से विभाज्य हो?`, `\\(${n}\\) ਵਿੱਚੋਂ ਸਭ ਤੋਂ ਘੱਟ ਕਿਹੜੀ ਸੰਖਿਆ ਘਟਾਈ ਜਾਵੇ ਤਾਂ ਜੋ ਨਤੀਜਾ \\(${divisor}\\) ਨਾਲ ਭਾਗ ਜਾਵੇ?`),
      t(`The number \\(${n}\\) has to be reduced to a multiple of \\(${divisor}\\). What is the minimum subtraction?`, `\\(${n}\\) को \\(${divisor}\\) के गुणज तक घटाना है। न्यूनतम घटाव कितना है?`, `\\(${n}\\) ਨੂੰ \\(${divisor}\\) ਦੇ ਗੁਣਜ ਤੱਕ ਘਟਾਉਣਾ ਹੈ। ਘੱਟੋ-ਘੱਟ ਘਟਾਓ ਕਿੰਨਾ ਹੈ?`),
    ]);
    variables = { n, divisor, answer };
    hiddenVariables = { remainder: n % divisor };
  } else if (family.includes("minimum_multiplier")) {
    const target = pick([72, 90, 120, 144, 180, 240], `${seed}:target`);
    const n = target / pick([2, 3, 4, 5, 6], `${seed}:miss`);
    model = { kind: "optimization_constraint", inputs: { mode: "minimum_multiplier", n, target } };
    const answer = evaluateNumberSystemSolverModel(model);
    stem = t(`By what least number should \\(${n}\\) be multiplied so that the product is divisible by \\(${target}\\)?`, `\\(${n}\\) को किस न्यूनतम संख्या से गुणा किया जाए ताकि गुणनफल \\(${target}\\) से विभाज्य हो?`, `\\(${n}\\) ਨੂੰ ਸਭ ਤੋਂ ਘੱਟ ਕਿਹੜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਵੇ ਤਾਂ ਜੋ ਗੁਣਨਫਲ \\(${target}\\) ਨਾਲ ਭਾਗ ਜਾਵੇ?`);
    variables = { n, target, answer };
    hiddenVariables = { missingPrimePowers: primeFactors(Number(answer)) };
  } else if (family.includes("minimum_divisor")) {
    const target = pick([12, 18, 24, 30, 36], `${seed}:target`);
    const extraDivisor = pick([2, 3, 4, 5, 6], `${seed}:extra`);
    const quotient = target * int(`${seed}:q`, 5, 12);
    const n = quotient * extraDivisor;
    model = { kind: "optimization_constraint", inputs: { mode: "minimum_divisor", n, target, extraDivisor } };
    const answer = evaluateNumberSystemSolverModel(model);
    stem = t(`The number \\(${n}\\) is divided by the least possible divisor so that the quotient is still a multiple of \\(${target}\\). What is that divisor?`, `\\(${n}\\) को सबसे छोटे संभव भाजक से भाग देना है ताकि भागफल अभी भी \\(${target}\\) का गुणज रहे। वह भाजक क्या है?`, `\\(${n}\\) ਨੂੰ ਸਭ ਤੋਂ ਛੋਟੇ ਸੰਭਵ ਭਾਜਕ ਨਾਲ ਭਾਗਣਾ ਹੈ ਤਾਂ ਜੋ ਭਾਗਫਲ ਹਾਲੇ ਵੀ \\(${target}\\) ਦਾ ਗੁਣਜ ਰਹੇ। ਉਹ ਭਾਜਕ ਕੀ ਹੈ?`);
    variables = { n, target, answer };
    hiddenVariables = { quotientAfterDivision: quotient };
  } else if (family.includes("range_optimization")) {
    const modulus = combined;
    const residue = pick([1, 5, 7, 11, 13], `${seed}:res`) % modulus;
    const start = modulus * int(`${seed}:s`, 5, 8) + residue;
    const end = start + modulus * int(`${seed}:span`, 5, 10) + Math.floor(modulus / 2);
    model = { kind: "optimization_constraint", inputs: { mode: "range_count", start, end, modulus, residue } };
    const answer = evaluateNumberSystemSolverModel(model);
    stem = t(`How many integers between \\(${start}\\) and \\(${end}\\) leave remainder \\(${residue}\\) when divided by \\(${modulus}\\)?`, `\\(${start}\\) और \\(${end}\\) के बीच कितने पूर्णांक \\(${modulus}\\) से भाग देने पर शेष \\(${residue}\\) छोड़ते हैं?`, `\\(${start}\\) ਅਤੇ \\(${end}\\) ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਪੂਰਨ ਅੰਕ \\(${modulus}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ \\(${residue}\\) ਛੱਡਦੇ ਹਨ?`);
    variables = { start, end, modulus, residue, answer };
    hiddenVariables = { firstValid: smallestResidueAtLeast(start, modulus, residue) };
    formula = "N\\equiv r\\pmod m";
  } else {
    const lower = combined * int(`${seed}:q`, 8, 18) + int(`${seed}:gap`, 1, combined - 1);
    model = { kind: "optimization_constraint", inputs: { mode: "multi_condition", lower, lcm: combined, divisors: [a, b] } };
    const answer = evaluateNumberSystemSolverModel(model);
    stem = stemVariant(seed, [
      t(`What is the least number greater than \\(${lower}\\) that is divisible by both \\(${a}\\) and \\(${b}\\)?`, `\\(${lower}\\) से बड़ी सबसे छोटी संख्या कौन-सी है जो \\(${a}\\) और \\(${b}\\) दोनों से विभाज्य हो?`, `\\(${lower}\\) ਤੋਂ ਵੱਡੀ ਸਭ ਤੋਂ ਛੋਟੀ ਸੰਖਿਆ ਕਿਹੜੀ ਹੈ ਜੋ \\(${a}\\) ਅਤੇ \\(${b}\\) ਦੋਵਾਂ ਨਾਲ ਭਾਗ ਜਾਂਦੀ ਹੈ?`),
      t(`Find the smallest integer above \\(${lower}\\) which is a common multiple of \\(${a}\\) and \\(${b}\\).`, `\\(${lower}\\) से ऊपर \\(${a}\\) और \\(${b}\\) का सबसे छोटा सामान्य गुणज ज्ञात करें।`, `\\(${lower}\\) ਤੋਂ ਉੱਪਰ \\(${a}\\) ਅਤੇ \\(${b}\\) ਦਾ ਸਭ ਤੋਂ ਛੋਟਾ ਸਾਂਝਾ ਗੁਣਜ ਕੱਢੋ।`),
    ]);
    variables = { lower, a, b, lcm: combined, answer };
    hiddenVariables = { combinedCondition: combined };
  }
  return {
    stem,
    model,
    variables,
    hiddenVariables,
    derivedVariables: { method: "combine constraints before optimizing" },
    answerUnit: spec.unit,
    principle: t("Optimization questions first combine number conditions, then move to the nearest valid boundary.", "अनुकूलन प्रश्नों में पहले संख्या-शर्तें मिलाते हैं, फिर निकटतम मान्य सीमा लेते हैं।", "ਅਨੁਕੂਲਨ ਪ੍ਰਸ਼ਨਾਂ ਵਿੱਚ ਪਹਿਲਾਂ ਸੰਖਿਆ-ਸ਼ਰਤਾਂ ਮਿਲਾਈਆਂ ਜਾਂਦੀਆਂ ਹਨ, ਫਿਰ ਨੇੜਲੀ ਵੈਧ ਹੱਦ ਲਈ ਜਾਂਦੀ ਹੈ।"),
    formula,
    steps: [
      { key: "combine", text: t("Combine the divisibility or residue conditions before choosing the boundary value.", "सीमा मान चुनने से पहले विभाज्यता या शेषफल शर्तें मिलाएँ।", "ਹੱਦ ਵਾਲਾ ਮੁੱਲ ਚੁਣਨ ਤੋਂ ਪਹਿਲਾਂ ਭਾਗਯੋਗਤਾ ਜਾਂ ਬਾਕੀ ਦੀਆਂ ਸ਼ਰਤਾਂ ਮਿਲਾਓ।") },
      { key: "boundary", text: t("Move to the nearest valid number that satisfies all conditions.", "ऐसी निकटतम मान्य संख्या लें जो सभी शर्तें पूरी करे।", "ਉਹ ਨੇੜਲੀ ਵੈਧ ਸੰਖਿਆ ਲਵੋ ਜੋ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀ ਕਰੇ।") },
    ],
    shortcut: t("Use LCM or residue correction first; then apply ceiling or floor once.", "पहले LCM या शेषफल-सुधार लें; फिर ceiling या floor एक बार लगाएँ।", "ਪਹਿਲਾਂ LCM ਜਾਂ ਬਾਕੀ-ਸੁਧਾਰ ਲਵੋ; ਫਿਰ ceiling ਜਾਂ floor ਇੱਕ ਵਾਰ ਲਗਾਓ।"),
    traps: ["used one condition only", "boundary off by one", "raw remainder taken as answer"],
  };
}

function perfectPowerDraft(spec: Spec, seed: string): Draft {
  const power: 2 | 3 = spec.family.includes("cube") ? 3 : 2;
  const base = pick(power === 2 ? [72, 108, 150, 180, 200, 252, 300] : [72, 108, 135, 192, 250, 360], `${seed}:n`);
  const multiplier = factorCompletionMultiplier(base, power);
  const mode =
    spec.family.includes("least_square") || spec.family.includes("least_cube") ? "least_multiple" :
    spec.family.includes("factor_count") ? "factor_count_square" :
    spec.family.includes("remainder") ? "remainder_to_square" : "completion";
  let model: NumberSystemSolverModel = { kind: "perfect_power_completion", inputs: { mode, n: base, power } };
  let variables: Record<string, unknown> = { n: base, power, multiplier };
  let stem: NumberSystemLocalizedText;
  if (mode === "least_multiple") {
    const answer = base * multiplier;
    stem = t(`What is the least perfect ${power === 2 ? "square" : "cube"} that is divisible by \\(${base}\\)?`, `\\(${base}\\) से विभाज्य सबसे छोटा पूर्ण ${power === 2 ? "वर्ग" : "घन"} कौन-सा है?`, `\\(${base}\\) ਨਾਲ ਭਾਗ ਜਾਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ${power === 2 ? "ਵਰਗ" : "ਘਣ"} ਕਿਹੜਾ ਹੈ?`);
    variables = { ...variables, answer };
  } else if (mode === "factor_count_square") {
    const answer = factorCountFromFactors(primeFactors(base * multiplier));
    stem = t(`The least number that should multiply \\(${base}\\) to make a perfect square is used. How many factors will the resulting square have?`, `\\(${base}\\) को पूर्ण वर्ग बनाने के लिए जिस न्यूनतम संख्या से गुणा किया जाता है, उससे बने वर्ग के कितने भाजक होंगे?`, `\\(${base}\\) ਨੂੰ ਪੂਰਨ ਵਰਗ ਬਣਾਉਣ ਲਈ ਜਿਸ ਘੱਟੋ-ਘੱਟ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ, ਬਣੇ ਵਰਗ ਦੇ ਕਿੰਨੇ ਭਾਜਕ ਹੋਣਗੇ?`);
    variables = { ...variables, answer };
  } else if (mode === "remainder_to_square") {
    const lower = pick([200, 300, 400, 500], `${seed}:lower`);
    const modulus = pick([12, 18, 24], `${seed}:mod`);
    const root = Math.ceil(Math.sqrt(lower / 1.2)) + int(`${seed}:root`, 1, 6);
    const value = root * root;
    const residue = value % modulus;
    model = { kind: "perfect_power_completion", inputs: { mode, n: base, power: 2, lower, modulus, residue } };
    stem = t(`Find the smallest perfect square not less than \\(${lower}\\) which leaves remainder \\(${residue}\\) when divided by \\(${modulus}\\).`, `\\(${lower}\\) से कम न होने वाला सबसे छोटा पूर्ण वर्ग ज्ञात करें जो \\(${modulus}\\) से भाग देने पर शेष \\(${residue}\\) छोड़े।`, `\\(${lower}\\) ਤੋਂ ਘੱਟ ਨਾ ਹੋਣ ਵਾਲਾ ਸਭ ਤੋਂ ਛੋਟਾ ਪੂਰਨ ਵਰਗ ਕੱਢੋ ਜੋ \\(${modulus}\\) ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਬਾਕੀ \\(${residue}\\) ਛੱਡੇ।`);
    variables = { lower, modulus, residue, answer: value };
  } else {
    stem = t(`By what least number should \\(${base}\\) be multiplied to make it a perfect ${power === 2 ? "square" : "cube"}?`, `\\(${base}\\) को पूर्ण ${power === 2 ? "वर्ग" : "घन"} बनाने के लिए किस न्यूनतम संख्या से गुणा करना चाहिए?`, `\\(${base}\\) ਨੂੰ ਪੂਰਨ ${power === 2 ? "ਵਰਗ" : "ਘਣ"} ਬਣਾਉਣ ਲਈ ਸਭ ਤੋਂ ਘੱਟ ਕਿਹੜੀ ਸੰਖਿਆ ਨਾਲ ਗੁਣਾ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?`);
  }
  return {
    stem,
    model,
    variables,
    hiddenVariables: { primeFactors: primeFactors(base), exponentTarget: power },
    derivedVariables: { completionMultiplier: multiplier },
    answerUnit: spec.unit,
    principle: t("A perfect square has even prime exponents; a perfect cube has exponents in multiples of three.", "पूर्ण वर्ग में अभाज्य घातें सम होती हैं; पूर्ण घन में घातें तीन के गुणज होती हैं।", "ਪੂਰਨ ਵਰਗ ਵਿੱਚ ਅਭਾਜ ਘਾਤਾਂ ਜੁੜੀਆਂ ਹੁੰਦੀਆਂ ਹਨ; ਪੂਰਨ ਘਣ ਵਿੱਚ ਘਾਤਾਂ ਤਿੰਨ ਦੇ ਗੁਣਜ ਹੁੰਦੀਆਂ ਹਨ।"),
    formula: power === 2 ? "e\\equiv 0\\pmod 2" : "e\\equiv 0\\pmod 3",
    steps: [
      { key: "factorize", text: t("First write the prime factors and their exponents.", "पहले अभाज्य गुणनखंड और उनकी घातें लिखें।", "ਪਹਿਲਾਂ ਅਭਾਜ ਗੁਣਨਖੰਡ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਘਾਤਾਂ ਲਿਖੋ।") },
      { key: "complete", text: t("Add only the missing powers needed for a perfect power.", "पूर्ण घात बनाने के लिए केवल छूटी हुई घातें जोड़ें।", "ਪੂਰਨ ਘਾਤ ਬਣਾਉਣ ਲਈ ਸਿਰਫ਼ ਘੱਟ ਰਹੀਆਂ ਘਾਤਾਂ ਜੋੜੋ।") },
    ],
    shortcut: t("Prime exponents tell exactly which small multiplier is missing.", "अभाज्य घातें सीधे बताती हैं कि कौन-सा छोटा गुणक छूटा है।", "ਅਭਾਜ ਘਾਤਾਂ ਸਿੱਧਾ ਦੱਸਦੀਆਂ ਹਨ ਕਿ ਕਿਹੜਾ ਛੋਟਾ ਗੁਣਕ ਘੱਟ ਹੈ।"),
    traps: ["used next visible square", "missed exponent parity", "confused square and cube completion"],
  };
}

function reconstructionDraft(spec: Spec, seed: string): Draft {
  const d1 = pick([6, 8, 9, 12, 15, 18], `${seed}:d1`);
  const d2 = pick([10, 12, 14, 16, 20, 24], `${seed}:d2`);
  const common = lcm(d1, d2);
  const quotient = int(`${seed}:q`, 8, 18);
  const remainder = pick([1, 5, 7, 11], `${seed}:r`) % common;
  let model: NumberSystemSolverModel = { kind: "reconstruction", inputs: { mode: "number_from_lcm_remainder", lcm: common, quotient, remainder } };
  let answer = evaluateNumberSystemSolverModel(model);
  let stem: NumberSystemLocalizedText;
  let variables: Record<string, unknown> = { d1, d2, lcm: common, quotient, remainder, answer };
  if (spec.family.includes("hidden_divisor")) {
    const divisor = pick([7, 9, 11, 13], `${seed}:div`);
    const q = int(`${seed}:q2`, 18, 40);
    const r = int(`${seed}:r2`, 1, divisor - 1);
    const dividend = divisor * q + r;
    model = { kind: "reconstruction", inputs: { mode: "hidden_divisor", dividend, quotient: q, remainder: r } };
    answer = evaluateNumberSystemSolverModel(model);
    stem = t(`A number gives quotient \\(${q}\\) and remainder \\(${r}\\) when divided by an unknown divisor. If the number is \\(${dividend}\\), find the divisor.`, `एक संख्या को अज्ञात भाजक से भाग देने पर भागफल \\(${q}\\) और शेष \\(${r}\\) मिलता है। यदि संख्या \\(${dividend}\\) है, तो भाजक ज्ञात करें।`, `ਇੱਕ ਸੰਖਿਆ ਨੂੰ ਅਣਜਾਣ ਭਾਜਕ ਨਾਲ ਭਾਗਣ ਤੇ ਭਾਗਫਲ \\(${q}\\) ਅਤੇ ਬਾਕੀ \\(${r}\\) ਮਿਲਦਾ ਹੈ। ਜੇ ਸੰਖਿਆ \\(${dividend}\\) ਹੈ, ਤਾਂ ਭਾਜਕ ਕੱਢੋ।`);
    variables = { dividend, quotient: q, remainder: r, answer };
  } else if (spec.family.includes("hidden_exponent")) {
    const base = pick([2, 3, 7], `${seed}:base`);
    const mod = pick([7, 9, 11, 13], `${seed}:mod`);
    const exp = int(`${seed}:exp`, 18, 45);
    const targetRemainder = modPow(base, exp, mod);
    model = { kind: "reconstruction", inputs: { mode: "hidden_exponent", base, mod, targetRemainder, minExp: exp - 3, maxExp: exp + 3 } };
    answer = evaluateNumberSystemSolverModel(model);
    stem = t(`For powers of \\(${base}\\) modulo \\(${mod}\\), the remainder is \\(${targetRemainder}\\). Which exponent between \\(${exp - 3}\\) and \\(${exp + 3}\\) gives this remainder?`, `\\(${base}\\) की घातों को \\(${mod}\\) से भाग देने पर शेष \\(${targetRemainder}\\) मिलता है। \\(${exp - 3}\\) और \\(${exp + 3}\\) के बीच कौन-सा घातांक यह शेष देता है?`, `\\(${base}\\) ਦੀਆਂ ਘਾਤਾਂ ਨੂੰ \\(${mod}\\) ਨਾਲ ਭਾਗਣ ਤੇ ਬਾਕੀ \\(${targetRemainder}\\) ਮਿਲਦਾ ਹੈ। \\(${exp - 3}\\) ਅਤੇ \\(${exp + 3}\\) ਵਿਚਕਾਰ ਕਿਹੜਾ ਘਾਤਾਂਕ ਇਹ ਬਾਕੀ ਦਿੰਦਾ ਹੈ?`);
    variables = { base, mod, targetRemainder, minExp: exp - 3, maxExp: exp + 3, answer };
  } else if (spec.family.includes("hidden_square")) {
    const root = int(`${seed}:root`, 18, 35);
    model = { kind: "reconstruction", inputs: { mode: "hidden_square", root } };
    answer = evaluateNumberSystemSolverModel(model);
    stem = t(`A perfect square has square root \\(${root}\\) and also satisfies the given square condition. What is the number?`, `एक पूर्ण वर्ग का वर्गमूल \\(${root}\\) है और वह दी गई वर्ग-शर्त पूरी करता है। संख्या क्या है?`, `ਇੱਕ ਪੂਰਨ ਵਰਗ ਦਾ ਵਰਗਮੂਲ \\(${root}\\) ਹੈ ਅਤੇ ਉਹ ਦਿੱਤੀ ਵਰਗ-ਸ਼ਰਤ ਪੂਰੀ ਕਰਦਾ ਹੈ। ਸੰਖਿਆ ਕੀ ਹੈ?`);
    variables = { root, answer };
  } else if (spec.family.includes("hidden_factorization")) {
    const factors = { 2: int(`${seed}:e2`, 2, 4), 3: int(`${seed}:e3`, 1, 3), 5: 1 };
    const value = Object.entries(factors).reduce((acc, [p, e]) => acc * Number(p) ** e, 1);
    model = { kind: "reconstruction", inputs: { mode: "hidden_factorization", value, factors } };
    answer = value;
    stem = t(`A number has prime factorization \\(2^${factors[2]}\\times3^${factors[3]}\\times5\\). What is the number?`, `किसी संख्या का अभाज्य गुणनखंडन \\(2^${factors[2]}\\times3^${factors[3]}\\times5\\) है। संख्या क्या है?`, `ਕਿਸੇ ਸੰਖਿਆ ਦਾ ਅਭਾਜ ਗੁਣਨਖੰਡਨ \\(2^${factors[2]}\\times3^${factors[3]}\\times5\\) ਹੈ। ਸੰਖਿਆ ਕੀ ਹੈ?`);
    variables = { factors, answer };
  } else {
    stem = stemVariant(seed, [
      t(`A number leaves remainder \\(${remainder}\\) when divided by both \\(${d1}\\) and \\(${d2}\\). If it is the \\(${quotient}\\)-th such number after zero, what is the number?`, `एक संख्या \\(${d1}\\) और \\(${d2}\\) दोनों से भाग देने पर शेष \\(${remainder}\\) छोड़ती है। शून्य के बाद ऐसी \\(${quotient}\\)-वीं संख्या क्या है?`, `ਇੱਕ ਸੰਖਿਆ \\(${d1}\\) ਅਤੇ \\(${d2}\\) ਦੋਵਾਂ ਨਾਲ ਭਾਗਣ ਤੇ ਬਾਕੀ \\(${remainder}\\) ਛੱਡਦੀ ਹੈ। ਸਿਫ਼ਰ ਤੋਂ ਬਾਅਦ ਐਸੀ \\(${quotient}\\)-ਵੀਂ ਸੰਖਿਆ ਕੀ ਹੈ?`),
      t(`Numbers giving remainder \\(${remainder}\\) with divisors \\(${d1}\\) and \\(${d2}\\) follow one common cycle. Find the \\(${quotient}\\)-th positive number in that cycle.`, `\\(${d1}\\) और \\(${d2}\\) पर शेष \\(${remainder}\\) देने वाली संख्याएँ एक सामान्य चक्र बनाती हैं। उस चक्र की \\(${quotient}\\)-वीं धनात्मक संख्या ज्ञात करें।`, `\\(${d1}\\) ਅਤੇ \\(${d2}\\) ਤੇ ਬਾਕੀ \\(${remainder}\\) ਦੇਣ ਵਾਲੀਆਂ ਸੰਖਿਆਵਾਂ ਇੱਕ ਸਾਂਝਾ ਚੱਕਰ ਬਣਾਉਂਦੀਆਂ ਹਨ। ਉਸ ਚੱਕਰ ਦੀ \\(${quotient}\\)-ਵੀਂ ਧਨਾਤਮਕ ਸੰਖਿਆ ਕੱਢੋ।`),
    ]);
  }
  return {
    stem,
    model,
    variables,
    hiddenVariables: { reconstructionBasis: model.inputs },
    derivedVariables: { verificationRequired: true },
    answerUnit: spec.unit,
    principle: t("Reconstruction works backward from constraints and then verifies the candidate.", "पुनर्निर्माण में शर्तों से पीछे चलकर प्रत्याशी बनाते हैं और फिर जाँचते हैं।", "ਪੁਨਰ-ਨਿਰਮਾਣ ਵਿੱਚ ਸ਼ਰਤਾਂ ਤੋਂ ਪਿੱਛੇ ਚੱਲ ਕੇ ਉਮੀਦਵਾਰ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ਫਿਰ ਜਾਂਚਿਆ ਜਾਂਦਾ ਹੈ।"),
    formula: "N=mq+r",
    steps: [
      { key: "translate", text: t("Translate the verbal condition into a number relation.", "वाक्य-शर्त को संख्या-संबंध में बदलें।", "ਵਾਕ-ਸ਼ਰਤ ਨੂੰ ਸੰਖਿਆ-ਸੰਬੰਧ ਵਿੱਚ ਬਦਲੋ।") },
      { key: "verify", text: t("Check the reconstructed value against all given facts.", "बने हुए मान को सभी दी गई बातों से जाँचें।", "ਬਣੇ ਮੁੱਲ ਨੂੰ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਗੱਲਾਂ ਨਾਲ ਜਾਂਚੋ।") },
    ],
    shortcut: t("Backtrack the relation first, then verify once.", "पहले संबंध को उल्टा चलाएँ, फिर एक बार सत्यापन करें।", "ਪਹਿਲਾਂ ਸੰਬੰਧ ਨੂੰ ਉਲਟਾ ਚਲਾਓ, ਫਿਰ ਇੱਕ ਵਾਰ ਜਾਂਚ ਕਰੋ।"),
    traps: ["accepted unverified candidate", "used one condition only", "wrong quotient-remainder relation"],
  };
}

function eliteHybridDraft(spec: Spec, seed: string): Draft {
  const family = spec.family;
  let model: NumberSystemSolverModel;
  let stem: NumberSystemLocalizedText;
  let variables: Record<string, unknown>;
  if (family.includes("digit_divisibility")) {
    const digit = pick([2, 4, 6, 8], `${seed}:digit`);
    const pattern = `4${digit}x${pick([2, 6], `${seed}:end`)}`;
    const completed = Number(pattern.replace("x", String(digit)));
    model = { kind: "elite_hybrid_chain", inputs: { mode: "digit_divisibility_reconstruction", pattern, digit } };
    stem = t(`In the number \\(${pattern}\\), the missing digit is chosen so that the completed number satisfies the digit rule and divisibility check. What completed number is obtained?`, `संख्या \\(${pattern}\\) में लुप्त अंक ऐसा चुना जाता है कि पूरी संख्या अंक-नियम और विभाज्यता जाँच पूरी करे। पूरी संख्या क्या बनेगी?`, `ਸੰਖਿਆ \\(${pattern}\\) ਵਿੱਚ ਗੁੰਮ ਅੰਕ ਐਸਾ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ ਕਿ ਪੂਰੀ ਸੰਖਿਆ ਅੰਕ-ਨਿਯਮ ਅਤੇ ਭਾਗਯੋਗਤਾ ਜਾਂਚ ਪੂਰੀ ਕਰੇ। ਪੂਰੀ ਸੰਖਿਆ ਕੀ ਬਣੇਗੀ?`);
    variables = { pattern, digit, answer: completed };
  } else if (family.includes("factor_count_square")) {
    const n = pick([72, 108, 180, 200, 300], `${seed}:n`);
    const multiplier = factorCompletionMultiplier(n, 2);
    model = { kind: "elite_hybrid_chain", inputs: { mode: "factor_count_square_hidden", n } };
    stem = t(`A number \\(${n}\\) must first be made a perfect square by the least multiplier. What is that multiplier?`, `संख्या \\(${n}\\) को पहले न्यूनतम गुणक से पूर्ण वर्ग बनाना है। वह गुणक क्या है?`, `ਸੰਖਿਆ \\(${n}\\) ਨੂੰ ਪਹਿਲਾਂ ਘੱਟੋ-ਘੱਟ ਗੁਣਕ ਨਾਲ ਪੂਰਨ ਵਰਗ ਬਣਾਉਣਾ ਹੈ। ਉਹ ਗੁਣਕ ਕੀ ਹੈ?`);
    variables = { n, multiplier, answer: multiplier };
  } else if (family.includes("modular_cycle")) {
    const base = pick([3, 7, 11], `${seed}:base`);
    const exp = int(`${seed}:exp`, 41, 99);
    const mod = pick([13, 17, 19], `${seed}:mod`);
    model = { kind: "elite_hybrid_chain", inputs: { mode: "modular_cycle_reconstruction", base, exp, mod } };
    stem = t(`A remainder chain reduces to \\(${base}^{${exp}}\\) modulo \\(${mod}\\). What final remainder is obtained?`, `एक शेषफल-श्रृंखला \\(${base}^{${exp}}\\) modulo \\(${mod}\\) तक घटती है। अंतिम शेषफल क्या है?`, `ਇੱਕ ਬਾਕੀ-ਕੜੀ \\(${base}^{${exp}}\\) modulo \\(${mod}\\) ਤੱਕ ਘਟਦੀ ਹੈ। ਅੰਤਿਮ ਬਾਕੀ ਕੀ ਹੈ?`);
    variables = { base, exp, mod, answer: modPow(base, exp, mod) };
  } else if (family.includes("hcf_verification")) {
    const digit = pick([2, 4, 6, 8], `${seed}:digit`);
    const pattern = `36x${digit}`;
    const other = pick([18, 24, 36], `${seed}:other`);
    model = { kind: "elite_hybrid_chain", inputs: { mode: "digit_divisibility_hcf_verification", pattern, digit, other } };
    stem = t(`After replacing \\(x\\) in \\(${pattern}\\), verify it with \\(${other}\\) using HCF. What HCF is obtained?`, `\\(${pattern}\\) में \\(x\\) रखने के बाद उसे \\(${other}\\) के साथ HCF से जाँचा जाता है। HCF कितना मिलेगा?`, `\\(${pattern}\\) ਵਿੱਚ \\(x\\) ਰੱਖਣ ਤੋਂ ਬਾਅਦ ਇਸਨੂੰ \\(${other}\\) ਨਾਲ HCF ਰਾਹੀਂ ਜਾਂਚਿਆ ਜਾਂਦਾ ਹੈ। HCF ਕਿੰਨਾ ਮਿਲੇਗਾ?`);
    variables = { pattern, digit, other, answer: gcd(Number(pattern.replace("x", String(digit))), other) };
  } else if (family.includes("remainder_constraint")) {
    const modulus = pick([18, 24, 30, 36], `${seed}:mod`);
    const residue = pick([5, 7, 11, 13], `${seed}:res`) % modulus;
    const lower = modulus * int(`${seed}:low`, 10, 22) + 1;
    model = { kind: "elite_hybrid_chain", inputs: { mode: "remainder_constraint_optimization", modulus, residue, lower } };
    stem = t(`Find the least number not less than \\(${lower}\\) that leaves remainder \\(${residue}\\) on division by \\(${modulus}\\).`, `\\(${lower}\\) से कम न होने वाली सबसे छोटी संख्या ज्ञात करें जो \\(${modulus}\\) से भाग देने पर शेष \\(${residue}\\) छोड़ती है।`, `\\(${lower}\\) ਤੋਂ ਘੱਟ ਨਾ ਹੋਣ ਵਾਲੀ ਸਭ ਤੋਂ ਛੋਟੀ ਸੰਖਿਆ ਕੱਢੋ ਜੋ \\(${modulus}\\) ਨਾਲ ਭਾਗਣ ਤੇ ਬਾਕੀ \\(${residue}\\) ਛੱਡਦੀ ਹੈ।`);
    variables = { modulus, residue, lower, answer: smallestResidueAtLeast(lower, modulus, residue) };
  } else if (family.includes("prime_exact")) {
    const value = pick([72, 108, 144, 180, 216], `${seed}:value`);
    model = { kind: "elite_hybrid_chain", inputs: { mode: "prime_exact_divisor_optimization", value } };
    stem = t(`A number is rebuilt from exact prime-power choices and the smallest valid value is \\(${value}\\). What is that value?`, `अभाज्य-घात विकल्पों से संख्या बनती है और सबसे छोटा मान \\(${value}\\) है। वह मान क्या है?`, `ਅਭਾਜ-ਘਾਤ ਚੋਣਾਂ ਤੋਂ ਸੰਖਿਆ ਬਣਦੀ ਹੈ ਅਤੇ ਸਭ ਤੋਂ ਛੋਟਾ ਮੁੱਲ \\(${value}\\) ਹੈ। ਉਹ ਮੁੱਲ ਕੀ ਹੈ?`);
    variables = { value, answer: value };
  } else {
    const a = pick([12, 18, 24], `${seed}:a`);
    const b = pick([20, 30, 36], `${seed}:b`);
    const lower = lcm(a, b) * int(`${seed}:q`, 5, 11) + 1;
    model = { kind: "elite_hybrid_chain", inputs: { mode: "prime_hcf_lcm_optimization", a, b, lower } };
    stem = t(`Prime factors of \\(${a}\\) and \\(${b}\\) are used to form their common cycle. What is the least common-cycle number greater than \\(${lower}\\)?`, `\\(${a}\\) और \\(${b}\\) के अभाज्य गुणनखंडों से सामान्य चक्र बनता है। \\(${lower}\\) से बड़ा सबसे छोटा सामान्य-चक्र मान क्या है?`, `\\(${a}\\) ਅਤੇ \\(${b}\\) ਦੇ ਅਭਾਜ ਗੁਣਨਖੰਡਾਂ ਨਾਲ ਸਾਂਝਾ ਚੱਕਰ ਬਣਦਾ ਹੈ। \\(${lower}\\) ਤੋਂ ਵੱਡਾ ਸਭ ਤੋਂ ਛੋਟਾ ਸਾਂਝਾ-ਚੱਕਰ ਮੁੱਲ ਕੀ ਹੈ?`);
    variables = { a, b, lower, lcm: lcm(a, b), answer: evaluateNumberSystemSolverModel(model) };
  }
  return {
    stem,
    model,
    variables,
    hiddenVariables: { chainStages: ["transform", "combine", "optimize", "verify"] },
    derivedVariables: { topologyDepth: 6 },
    answerUnit: spec.unit,
    principle: t("Elite hybrids chain two or more number-system ideas before the final answer.", "एलीट हाइब्रिड अंतिम उत्तर से पहले दो या अधिक संख्या-पद्धति विचारों को जोड़ते हैं।", "ਐਲੀਟ ਹਾਈਬ੍ਰਿਡ ਅੰਤਿਮ ਉੱਤਰ ਤੋਂ ਪਹਿਲਾਂ ਦੋ ਜਾਂ ਵੱਧ ਨੰਬਰ-ਸਿਸਟਮ ਵਿਚਾਰਾਂ ਨੂੰ ਜੋੜਦੇ ਹਨ।"),
    formula: "stage_1\\to stage_2\\to answer",
    steps: [
      { key: "stage-one", text: t("Resolve the first number-theory condition.", "पहली संख्या-सिद्धांत शर्त हल करें।", "ਪਹਿਲੀ ਨੰਬਰ-ਥਿਊਰੀ ਸ਼ਰਤ ਹੱਲ ਕਰੋ।") },
      { key: "stage-two", text: t("Use that result in the second condition and verify.", "उस परिणाम को दूसरी शर्त में लगाकर सत्यापित करें।", "ਉਸ ਨਤੀਜੇ ਨੂੰ ਦੂਜੀ ਸ਼ਰਤ ਵਿੱਚ ਲਗਾ ਕੇ ਜਾਂਚੋ।") },
    ],
    shortcut: t("Do not solve clusters separately; carry the reduced result into the next condition.", "क्लस्टरों को अलग-अलग न छोड़ें; घटे हुए परिणाम को अगली शर्त में ले जाएँ।", "ਕਲੱਸਟਰਾਂ ਨੂੰ ਵੱਖਰਾ ਨਾ ਛੱਡੋ; ਘਟੇ ਨਤੀਜੇ ਨੂੰ ਅਗਲੀ ਸ਼ਰਤ ਵਿੱਚ ਲੈ ਜਾਓ।"),
    traps: ["solved only one stage", "missed verification", "used raw intermediate result"],
  };
}

function createDraft(spec: Spec, seed: string): Draft {
  if (spec.cluster === "optimization") return optimizationDraft(spec, seed);
  if (spec.cluster === "perfect_power") return perfectPowerDraft(spec, seed);
  if (spec.cluster === "reconstruction") return reconstructionDraft(spec, seed);
  if (spec.cluster === "elite_hybrid") return eliteHybridDraft(spec, seed);
  if (spec.cluster === "prime") return factorDraft(spec, seed);
  if (spec.cluster === "hcf_lcm") return hcfDraft(spec, seed);
  if (spec.cluster === "remainder") return remainderDraft(spec, seed);
  if (spec.cluster === "last_digit") return lastDigitDraft(spec, seed);
  if (spec.cluster === "digit_logic") return digitDraft(spec, seed);
  if (spec.cluster === "factorial") return factorialDraft(spec, seed);
  if (spec.cluster === "advanced") return modularDraft(spec, seed);
  return divisibilityDraft(spec, seed);
}

export const NUMBER_SYSTEM_MOTIF_FACTORIES = Object.fromEntries(
  NUMBER_SYSTEM_FAMILY_IDS.map((family) => [family, ((input) => createNumberSystemProblem({ ...input, family })) as NumberSystemMotifFactory]),
) as Record<NumberSystemFamilyId, NumberSystemMotifFactory>;

export function createNumberSystemProblem(input: {
  seed: string;
  runId: string;
  difficulty: "easy" | "medium" | "hard";
  family?: NumberSystemFamilyId | NumberSystemAliasFamilyId;
}): CanonicalNumberSystemProblem {
  const family = resolveNumberSystemFamily(input.family) ?? pick(NUMBER_SYSTEM_FAMILY_IDS, `${input.seed}:family:${input.difficulty}`);
  const spec = specFor(family);
  const draft = createDraft(spec, `${input.seed}:${family}`);
  const answer = evaluateNumberSystemSolverModel(draft.model);
  const numericAnswer = typeof answer === "number" ? answer : Number(String(answer).match(/-?\d+/u)?.[0] ?? 0);
  const { options, correct } = buildOptions(numericAnswer, draft.answerUnit, `${input.seed}:options:${family}`);
  const answerText = options[correct]!;
  const optionLabel = `(${String.fromCharCode(65 + correct)})`;
  const builtExplanation = buildNumberSystemExplanation({
    model: draft.model,
    family,
    answer,
    answerText,
    optionLabel,
  });
  const styleAudit = auditNumberSystemExplanationStyle({
    explanation: builtExplanation.full,
    shortcut: builtExplanation.shortcut,
  });
  if (!styleAudit.valid) {
    throw new Error(`Number System V2 explanation style audit failed for ${family}: ${styleAudit.issues.join("; ")}`);
  }
  const explanation = builtExplanation.full;
  const difficulty = input.difficulty === "hard" || spec.difficulty === "hard" ? "hard" : input.difficulty === "easy" && spec.difficulty === "easy" ? "easy" : "medium";
  const situation = draft.situation ?? situationForSpec(spec, family, `${input.seed}:${family}:situation`);
  const examMode = examModeForSituation(situation, `${input.seed}:${family}:exam-mode`);
  const authenticity = authenticityScores(situation, difficulty);
  const eliteTier = isEliteSituation(spec, family, situation, difficulty);
  const complexity: CanonicalNumberSystemProblem["complexity"] = eliteTier ? "elite" : difficulty === "hard" ? "advanced" : difficulty;
  const reasoningStepCount = Math.max(3, draft.steps.length + (difficulty === "hard" ? 2 : 1), situation.topologyDepth);
  const questionTrivialityScore = Math.max(0.04, Math.min(0.14, 0.17 - situation.topologyDepth * 0.018 - (eliteTier ? 0.015 : 0)));
  const realismScore = Math.min(98, Math.round((authenticity.ssc + authenticity.banking + authenticity.punjab) / 3 + (examMode === "elite" ? 2 : 0)));
  const familyDiversityBucket = `${spec.cluster}:${spec.method}`;
  const situationDiversityBucket = `${spec.cluster}:${situation.id}`;
  const numericSignature = Object.entries(draft.variables).map(([key, value]) => `${key}:${Array.isArray(value) ? value.join(",") : typeof value === "object" ? JSON.stringify(value) : String(value)}`).join("|");
  const problem: CanonicalNumberSystemProblem = {
    id: `number-system:${family}:${hashText(`${input.seed}:${family}`)}`,
    topic: "number-system",
    motifId: family,
    family,
    topologyId: family,
    subtype: family,
    category: "number_system",
    archetype: spec.archetype,
    principle: draft.principle,
    formulaModel: draft.formula,
    preferredSolutionMethod: spec.method,
    entities: draft.variables,
    relationships: [spec.method],
    constraints: ["no direct drill", "solver backed", "single correct answer"],
    hiddenVariables: draft.hiddenVariables,
    derivedVariables: draft.derivedVariables,
    target: "answer",
    reasoningDepth: reasoningStepCount,
    questionTrivialityScore,
    realismScore,
    qualityMetadata: {
      cluster: spec.cluster,
      templateCoverage: NUMBER_SYSTEM_STEM_TEMPLATE_COVERAGE[spec.cluster],
      situationId: situation.id,
      situationLabel: situation.label,
      stemArchetype: situation.stemArchetype,
      shortcutPatternId: situation.shortcutPatternId,
      topologyDepth: situation.topologyDepth,
      examMode,
      examModes: situation.examModes,
      eliteTier,
      familyDiversityBucket,
      situationDiversityBucket,
      authenticity,
      distractorFamily: situation.distractorFamily,
    },
    variables: draft.variables,
    stemData: {
      stemSkeleton: family,
      preferredSolutionMethod: spec.method,
      examSituation: situation.label,
      stemArchetype: situation.stemArchetype,
      shortcutPatternId: situation.shortcutPatternId,
    },
    solverModel: draft.model,
    answer,
    answerText,
    answerUnit: draft.answerUnit,
    options,
    correct,
    difficulty,
    complexity,
    topology: { family: "number_system", variant: family },
    traps: [...new Set([...draft.traps, situation.distractorFamily, methodTrap(spec.method)])],
    distractors: options.filter((_, index) => index !== correct),
    explanationSteps: builtExplanation.steps,
    conceptExplanation: t("", "", ""),
    stepwiseExplanation: builtExplanation.stepwise,
    shortcutExplanation: builtExplanation.shortcut,
    localizationData: {
      stem: draft.stem,
      explanation,
      options: localizedOptions(options),
    },
    auditMeta: {
      seed: input.seed,
      runId: input.runId,
      familyId: family,
      topologyId: family,
      situationId: situation.id,
      stemArchetype: situation.stemArchetype,
      shortcutPatternId: situation.shortcutPatternId,
      topologyDepth: situation.topologyDepth,
      eliteTier,
      familyDiversityBucket,
      situationDiversityBucket,
      sscAuthenticityScore: authenticity.ssc,
      bankingAuthenticityScore: authenticity.banking,
      punjabAuthenticityScore: authenticity.punjab,
      stemSkeleton: family,
      numericSignature,
      solverAnswer: String(answer),
      explanationFinalAnswer: String(answer),
      difficultyReason: `${spec.cluster} ${spec.method}`,
      realismScore,
      trapTypes: [...new Set([...draft.traps, situation.distractorFamily, methodTrap(spec.method)])],
      preferredSolutionMethod: spec.method,
      questionTrivialityScore,
      reasoningStepCount,
    },
  };
  return problem;
}
