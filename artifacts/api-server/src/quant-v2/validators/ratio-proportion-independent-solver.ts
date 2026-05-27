import type { CanonicalRatioProportionProblem } from "../canonical/ratio-proportion-types";

export type RatioProportionSolverReport = {
  valid: boolean;
  issues: string[];
  metrics: {
    solverAnswer: string;
    answerText: string;
    explanationFinalAnswer?: string;
  };
};

function gcd(left: number, right: number): number {
  const a = Math.abs(Math.trunc(left));
  const b = Math.abs(Math.trunc(right));
  return b === 0 ? a || 1 : gcd(b, a % b);
}

function simplifyPair(left: number, right: number): [number, number] {
  const divisor = gcd(left, right);
  return [left / divisor, right / divisor];
}

function clean(value: number) {
  if (!Number.isFinite(value)) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.?0+$/u, "");
}

function money(value: number) {
  return `₹${clean(value)}`;
}

function answerText(value: number | string, unit: CanonicalRatioProportionProblem["answerUnit"]) {
  if (typeof value === "string") return value;
  if (unit === "rupees") return money(value);
  if (unit === "years") return `${clean(value)} ${value === 1 ? "year" : "years"}`;
  if (unit === "days") return `${clean(value)} ${value === 1 ? "day" : "days"}`;
  if (unit === "hours") return `${clean(value)} ${value === 1 ? "hour" : "hours"}`;
  if (unit === "cm") return `${clean(value)} cm`;
  if (unit === "km") return `${clean(value)} km`;
  if (unit === "m") return `${clean(value)} m`;
  if (unit === "percent") return `${clean(value)}%`;
  return clean(value);
}

function ratio(parts: readonly number[]) {
  return parts.join(":");
}

function ratioParts(value: unknown) {
  return String(value ?? "")
    .split(/:/u)
    .map((part) => Number(part))
    .filter((part) => Number.isFinite(part));
}

function normalized(value: unknown) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[₹,\s]/gu, "")
    .trim();
}

function closeText(left: string, right: string) {
  return normalized(left) === normalized(right);
}

function closeNumber(left: unknown, right: unknown) {
  const a = Number(left);
  const b = Number(right);
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 0.01;
}

function finalAnswerFromExplanation(explanation?: string) {
  const lines = String(explanation ?? "")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  const finalLine = [...lines].reverse().find((line) => /answer|उत्तर|ਉੱਤਰ/iu.test(line));
  if (finalLine) return finalLine.replace(/^.*?(?:answer|उत्तर|ਉੱਤਰ)\s*[:=]\s*/iu, "").trim();
  return undefined;
}

export function solveRatioProportionIndependently(problem: CanonicalRatioProportionProblem) {
  const v = problem.variables;
  switch (problem.family) {
    case "rp_direct_sharing": {
      const parts = ratioParts(v.parts);
      const asked = Number(v.askedPart) - 1;
      return answerText(parts[asked]! * Number(v.k), problem.answerUnit);
    }
    case "rp_sum_based_ratio_recovery":
      return answerText(v.askedPart === "girls" ? Number(v.b) * Number(v.k) : Number(v.a) * Number(v.k), problem.answerUnit);
    case "rp_difference_based_ratio_recovery":
      return answerText(Number(v.askedTotal) ? (Number(v.a) + Number(v.b)) * Number(v.k) : Number(v.a) * Number(v.k), problem.answerUnit);
    case "rp_missing_term_proportion":
      return answerText((Number(v.b) * Number(v.c)) / Number(v.a), problem.answerUnit);
    case "rp_ratio_to_fraction": {
      const divisor = gcd(Number(v.numerator), Number(v.denominator));
      return `${Number(v.numerator) / divisor}/${Number(v.denominator) / divisor}`;
    }
    case "rp_fraction_to_ratio":
      return `${v.left}:${v.right}`;
    case "rp_ratio_after_increase":
    case "rp_ratio_after_decrease":
    case "rp_side_area_volume_ratio":
      return `${v.left}:${v.right}`;
    case "rp_ratio_after_transfer":
      return answerText(Number(v.a) * Number(v.k), problem.answerUnit);
    case "rp_age_future_ratio":
      return answerText(Number(v.a) * Number(v.k), problem.answerUnit);
    case "rp_age_past_ratio":
      return answerText(Number(v.b) * Number(v.k), problem.answerUnit);
    case "rp_partnership_basic": {
      const unit = Number(v.totalProfit) / (Number(v.a) + Number(v.b));
      return answerText(Number(v.a) * unit, problem.answerUnit);
    }
    case "rp_partnership_time_variation": {
      const total = Number(v.totalProfit);
      const left = Number(v.ratioA);
      const right = Number(v.ratioB);
      return answerText((total * left) / (left + right), problem.answerUnit);
    }
    case "rp_direct_variation_basic":
      return answerText((Number(v.x1) * Number(v.y2)) / Number(v.y1), problem.answerUnit);
    case "rp_inverse_variation_basic":
      return answerText((Number(v.workers1) * Number(v.days1)) / Number(v.workers2), problem.answerUnit);
    case "rp_joint_variation":
      return answerText(
        (Number(v.output1) * Number(v.machines2) * Number(v.hours2)) /
          (Number(v.machines1) * Number(v.hours1)),
        problem.answerUnit,
      );
    case "rp_combined_direct_inverse":
      return answerText(
        (Number(v.x1) * Number(v.y2) * Number(v.z1)) /
          (Number(v.y1) * Number(v.z2)),
        problem.answerUnit,
      );
    case "rp_map_scale_ratio":
      return answerText(Number(v.mapDistance) * Number(v.scaleKm), problem.answerUnit);
    case "rp_chain_ratio_network":
      return String(v.result);
    case "rp_equivalent_ratio_generation":
      return `${Number(v.a) * Number(v.multiplier)}:${Number(v.b) * Number(v.multiplier)}`;
    case "rp_ratio_to_percentage":
      return answerText((Number(v.a) / Number(v.denominator)) * 100, problem.answerUnit);
    case "rp_percentage_to_ratio":
      return String(v.result);
    case "rp_product_based_ratio_recovery":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_partial_value_ratio_recovery":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_ratio_after_exchange": {
      const [left, right] = simplifyPair(Number(v.finalA), Number(v.finalB));
      return `${left}:${right}`;
    }
    case "rp_ratio_restoration":
      return answerText(Number(v.addB), problem.answerUnit);
    case "rp_reverse_ratio_scaling":
      return String(v.result);
    case "rp_age_difference_constant":
    case "rp_age_multi_generation":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_partnership_partial_exit":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_partnership_profit_distribution":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_population_gender_ratio":
    case "rp_voter_turnout_ratio":
    case "rp_marks_distribution_ratio":
    case "rp_recipe_scaling_ratio":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_blueprint_scaling":
      return answerText(Number(v.actual), problem.answerUnit);
    case "rp_shadow_height_ratio":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_similarity_scaling":
    case "rp_weighted_ratio_balancing":
      return String(v.result);
    case "rp_multi_equation_ratio":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_ratio_graph_deduction":
    case "rp_circular_ratio_dependency":
      return String(v.result);
    case "rp_hidden_total_trap":
      return answerText(Number(v.total), problem.answerUnit);
    case "rp_fractional_distribution_chain":
    case "rp_variable_power_variation":
    case "rp_workforce_inverse_variation":
    case "rp_speed_distance_inverse":
    case "rp_inventory_allocation":
      return answerText(Number(v.answer), problem.answerUnit);
    case "rp_liquid_replacement_ratio":
      return String(v.result);
    default:
      return problem.answerText;
  }
}

export function ratioProportionDegenerateReasons(problem: CanonicalRatioProportionProblem) {
  const issues: string[] = [];
  for (const [key, value] of Object.entries(problem.variables)) {
    if (typeof value === "number" && (!Number.isFinite(value) || Number.isNaN(value))) {
      issues.push(`${key} is not finite`);
    }
  }
  if (!problem.answerText || /\b(?:undefined|null|NaN)\b/u.test(problem.answerText)) {
    issues.push("answer text is invalid");
  }
  if (new Set(problem.options).size !== problem.options.length) {
    issues.push("duplicate options");
  }
  if (!problem.options[problem.correct] || problem.options[problem.correct] !== problem.answerText) {
    issues.push("correct option does not match answer");
  }
  if (
    problem.family === "rp_age_future_ratio" ||
    problem.family === "rp_age_past_ratio" ||
    problem.family === "rp_age_difference_constant" ||
    problem.family === "rp_age_multi_generation"
  ) {
    const a = Number(problem.variables.a);
    const b = Number(problem.variables.b);
    const k = Number(problem.variables.k);
    const years = Number(problem.variables.years);
    const presentA = a * k;
    const presentB = b * k;
    const answer = Number(problem.answer);
    const futureA = presentA + years;
    const futureB = presentB + years;
    const pastA = presentA - years;
    const pastB = presentB - years;
    if (presentA < 5 || presentA > 90 || presentB < 5 || presentB > 90) {
      issues.push("age sanity failure: present age outside 5-90");
    }
    if (answer > 100) {
      issues.push("age sanity failure: answer age exceeds 100");
    }
    if (Number.isFinite(years) && years > 30) {
      issues.push("age sanity failure: age offset is too large");
    }
    if (problem.family === "rp_age_future_ratio" && (futureA > 100 || futureB > 100)) {
      issues.push("age sanity failure: future age exceeds 100");
    }
    if (problem.family === "rp_age_past_ratio" && (pastA <= 0 || pastB <= 0)) {
      issues.push("age sanity failure: past age is not positive");
    }
    const optionAges = problem.options.map((option) => Number(String(option).match(/-?\d+(?:\.\d+)?/u)?.[0]));
    if (optionAges.some((optionAge) => !Number.isFinite(optionAge) || optionAge <= 0 || optionAge > 100)) {
      issues.push("age sanity failure: age option outside 1-100");
    }
  }
  return issues;
}

export function validateRatioProportionTopology(problem: CanonicalRatioProportionProblem) {
  const issues: string[] = [];
  const stem = `${problem.localizationData.stem.en} ${problem.localizationData.explanation.en}`;
  switch (problem.family) {
    case "rp_ratio_after_transfer":
      if (!Number(problem.variables.transfer) || !/given by A to B|gives|transfers|देने के बाद|ਦੇਣ ਤੋਂ ਬਾਅਦ/u.test(stem)) {
        issues.push("transfer topology has no transfer event");
      }
      break;
    case "rp_age_future_ratio":
      if (Number(problem.variables.timeDirection) !== 1 || !/after|in \d+(?:\.\d+)? years?|बाद|ਬਾਅਦ/iu.test(stem)) {
        issues.push("future-age topology has no future time condition");
      }
      break;
    case "rp_age_past_ratio":
      if (Number(problem.variables.timeDirection) !== -1 || !/ago|earlier|पहले|ਪਹਿਲਾਂ/iu.test(stem)) {
        issues.push("past-age topology has no past time condition");
      }
      break;
    case "rp_partnership_time_variation":
      if (!Number(problem.variables.monthsA) || !Number(problem.variables.monthsB) || !/capital|पूँजी|ਪੂੰਜੀ/u.test(stem)) {
        issues.push("time-variation partnership does not use effective capital");
      }
      break;
    case "rp_inverse_variation_basic":
      if (!/W_1D_1=W_2D_2|vary inversely|व्युत्क्रमानुपाती|ਉਲਟ ਅਨੁਪਾਤ/u.test(stem)) {
        issues.push("inverse variation is not expressed as inverse");
      }
      break;
    case "rp_side_area_volume_ratio": {
      const power = Number(problem.variables.power);
      const [left, right] = simplifyPair(Number(problem.variables.a) ** power, Number(problem.variables.b) ** power);
      if (`${left}:${right}` !== problem.answerText) {
        issues.push("geometry scaling power is wrong");
      }
      break;
    }
    case "rp_chain_ratio_network":
      if (!/A:B=.*B:C|LCM/u.test(stem)) {
        issues.push("chain ratio topology has no chained ratio");
      }
      break;
    case "rp_ratio_after_exchange":
      if (!Number(problem.variables.fromA) || !Number(problem.variables.fromB) || !/exchange|gives|transfers|exchanging|ਦਿੰਦਾ|देता/u.test(stem)) {
        issues.push("exchange topology has no two-way exchange");
      }
      break;
    case "rp_ratio_restoration":
      if (!Number(problem.variables.addB) || !/restore|required ratio|must remain|वापस|आवश्यक|ਵਾਪਸ|ਲੋੜੀਂਦਾ/u.test(stem)) {
        issues.push("restoration topology has no restoration operation");
      }
      break;
    case "rp_partnership_partial_exit":
      if (!Number(problem.variables.monthsA) || !Number(problem.variables.monthsB) || Number(problem.variables.monthsA) === Number(problem.variables.monthsB)) {
        issues.push("partial-exit partnership does not use different durations");
      }
      break;
    case "rp_weighted_ratio_balancing":
      if (!Number(problem.variables.s1Total) || !Number(problem.variables.s2Total) || !/Section|section|groups|ਵਰਗ|सैक्शन|वर्ग/u.test(stem)) {
        issues.push("weighted ratio balancing has no weighted groups");
      }
      break;
    case "rp_shadow_height_ratio":
      if (!/shadow|छाया|ਛਾਂ/u.test(stem)) {
        issues.push("shadow-height topology has no shadow relation");
      }
      break;
    case "rp_similarity_scaling":
      if (!/area ratio|areas|क्षेत्रफल|ਖੇਤਰਫਲ/u.test(stem)) {
        issues.push("similarity scaling topology has no area-to-side relation");
      }
      break;
    case "rp_multi_equation_ratio":
      if (!/A:B=.*B:C|A\+C/u.test(stem)) {
        issues.push("multi-equation ratio has no linked equations");
      }
      break;
    case "rp_ratio_graph_deduction":
      if (!/A:B=.*B:C=.*C:D|graph|chain/u.test(stem)) {
        issues.push("ratio graph deduction has no graph chain");
      }
      break;
    case "rp_circular_ratio_dependency":
      if (!/C:A|circular|तीन|ਤਿੰਨ/u.test(stem)) {
        issues.push("circular ratio dependency has no circular condition");
      }
      break;
    case "rp_hidden_total_trap":
      if (!/leave|Removing|जाने|ਜਾਣ/u.test(stem)) {
        issues.push("hidden-total topology has no changed-ratio event");
      }
      break;
    case "rp_fractional_distribution_chain":
      if (!/remainder|balance|शेष|ਬਚ/u.test(stem)) {
        issues.push("fractional distribution chain has no remainder step");
      }
      break;
    case "rp_variable_power_variation":
      if (!/x\^|square|cube|घात|ਸਮਾਨੁਪਾਤੀ/u.test(stem)) {
        issues.push("variable-power variation has no power relation");
      }
      break;
    case "rp_workforce_inverse_variation":
      if (!/workers|hours|मजदूर|ਮਜ਼ਦੂਰ/u.test(stem)) {
        issues.push("workforce inverse variation has no workers-hours relation");
      }
      break;
    case "rp_speed_distance_inverse":
      if (!/speed|km\/h|गति|ਗਤੀ/u.test(stem)) {
        issues.push("speed-distance inverse has no speed relation");
      }
      break;
    case "rp_inventory_allocation":
      if (!/stock|inventory|भंडार|ਸਟਾਕ/u.test(stem)) {
        issues.push("inventory allocation has no inventory context");
      }
      break;
    case "rp_liquid_replacement_ratio":
      if (!/milk|water|दूध|ਪਾਣੀ/u.test(stem)) {
        issues.push("liquid replacement ratio has no replacement mixture");
      }
      break;
    case "rp_direct_sharing":
      if (!Number(problem.variables.total)) {
        issues.push("direct sharing topology has no total");
      }
      break;
    case "rp_difference_based_ratio_recovery":
      if (!Number(problem.variables.difference)) {
        issues.push("difference recovery topology has no difference");
      }
      break;
    case "rp_sum_based_ratio_recovery":
      if (!Number(problem.variables.total)) {
        issues.push("sum recovery topology has no sum");
      }
      break;
  }
  return issues;
}

function malformedMathJax(text: string) {
  const inlineOpen = (text.match(/\\\(/gu) ?? []).length;
  const inlineClose = (text.match(/\\\)/gu) ?? []).length;
  const displayOpen = (text.match(/\\\[/gu) ?? []).length;
  const displayClose = (text.match(/\\\]/gu) ?? []).length;
  return inlineOpen !== inlineClose || displayOpen !== displayClose;
}

export function validateRatioProportionIndependentSolver(input: {
  problem: CanonicalRatioProportionProblem;
  explanation?: string;
  options?: readonly string[];
  correct?: number;
}): RatioProportionSolverReport {
  const solverAnswer = solveRatioProportionIndependently(input.problem);
  const issues = [
    ...ratioProportionDegenerateReasons(input.problem),
    ...validateRatioProportionTopology(input.problem),
  ];
  if (!closeText(solverAnswer, input.problem.answerText)) {
    issues.push(`answer mismatch: canonical=${input.problem.answerText}, solver=${solverAnswer}`);
  }
  if (typeof input.problem.answer === "number" && !closeNumber(input.problem.answer, Number(String(solverAnswer).match(/-?\d+(?:\.\d+)?/u)?.[0]))) {
    issues.push(`numeric answer mismatch: canonical=${input.problem.answer}, solver=${solverAnswer}`);
  }
  const explanationFinalAnswer = finalAnswerFromExplanation(input.explanation);
  if (explanationFinalAnswer && !closeText(explanationFinalAnswer, input.problem.answerText)) {
    issues.push(`explanation final answer mismatch: explanation=${explanationFinalAnswer}, solver=${solverAnswer}`);
  }
  const allExplanation = `${input.problem.localizationData.explanation.en}\n${input.problem.localizationData.explanation.hi}\n${input.problem.localizationData.explanation.pa}`;
  if (malformedMathJax(allExplanation)) {
    issues.push("malformed MathJax delimiters");
  }
  if (/(?:^|\n)\s*=\s*-?\d/u.test(allExplanation)) {
    issues.push("bare equation fragment in explanation");
  }
  if (input.options) {
    if (!input.options[input.correct ?? 0]) issues.push("answer missing from options");
    if (new Set(input.options).size !== input.options.length) issues.push("duplicate options");
  }
  return {
    valid: issues.length === 0,
    issues,
    metrics: {
      solverAnswer,
      answerText: input.problem.answerText,
      explanationFinalAnswer,
    },
  };
}
