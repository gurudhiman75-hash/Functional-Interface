import type { EditorialRealization } from "../../editorial/editorial-types";
import type {
  EditorialIntent,
  EditorialIntentKey,
} from "./editorial-intents";

const EQUATION_LINE_RE =
  /^(?:=\s*)?[-+]?[\d][\d\s().xX*/+\-/%^]*$/u;
const ASSIGNMENT_RE =
  /^(.+?)\s*=\s*([-+]?\d+(?:\.\d+)?(?:% [A-Za-z]+)?)$/u;
const LABEL_ASSIGNMENT_RE = /^(.+?)\s*=$/u;
const SHORTCUT_SHARE_RE =
  /^(\d+(?:\.\d+)?)% (votes|marks|quantity|value|population)\s*=\s*([-+]?\d+(?:\.\d+)?)?$/u;
const SEMANTIC_PERCENT_RESULT_RE =
  /^=\s*(\d+(?:\.\d+)?)% (increase|decrease|reduction|profit|loss)$/u;

const TRANSITION_KEYS: Record<string, EditorialIntentKey> = {
  "Therefore,": "transition.therefore",
  "Hence,": "transition.hence",
  "So,": "transition.so",
  "Thus,": "transition.thus",
  "Accordingly,": "transition.accordingly",
};

function isEquationLine(line: string) {
  return EQUATION_LINE_RE.test(line.trim());
}

function labelKey(label: string): EditorialIntentKey | undefined {
  const normalized = label
    .replace(/[:=]/gu, "")
    .trim()
    .toLowerCase();

  if (/winning margin|margin percentage|vote difference|candidate .*share|candidate share|remaining vote|vote share/u.test(normalized)) {
    return "label.vote_margin";
  }
  if (/^\d+(?:\.\d+)?% votes/u.test(normalized)) {
    return "label.total_votes";
  }
  if (/^\d+(?:\.\d+)?% marks/u.test(normalized)) {
    return "label.maximum_marks";
  }
  if (/^\d+(?:\.\d+)?% (?:quantity|value|population)/u.test(normalized)) {
    return "label.total_value";
  }
  if (/valid votes|effective valid votes|effective votes/u.test(normalized)) {
    return "label.valid_votes";
  }
  if (/total votes|votes polled|winner votes|winner's votes|votes after turnout|voters who voted|voted voters/u.test(normalized)) {
    return "label.total_votes";
  }
  if (/registered voters/u.test(normalized)) {
    return "label.registered_voters";
  }
  if (/pass mark|marks still needed|required marks gap|extra marks|marks gap|marks percentage gap|score difference/u.test(normalized)) {
    return "label.pass_mark_gap";
  }
  if (/maximum marks/u.test(normalized)) {
    return "label.maximum_marks";
  }
  if (/marks already secured|adjusted score/u.test(normalized)) {
    return "label.marks_secured";
  }
  if (/population after (?:growth|increase)/u.test(normalized)) {
    return "label.population_after_growth";
  }
  if (/population after (?:reduction|decrease)/u.test(normalized)) {
    return "label.population_after_reduction";
  }
  if (/final population|population/u.test(normalized)) {
    return "label.final_population";
  }
  if (/male population/u.test(normalized)) {
    return "label.male_population";
  }
  if (/female population/u.test(normalized)) {
    return "label.female_population";
  }
  if (/new price/u.test(normalized)) {
    return "label.new_price";
  }
  if (/new consumption/u.test(normalized)) {
    return "label.new_consumption";
  }
  if (/reduction in consumption|required reduction/u.test(normalized)) {
    return "label.reduction_consumption";
  }
  if (/increase in salary|decrease in salary|salary difference/u.test(normalized)) {
    return "label.salary_difference";
  }
  if (/percentage change|required percentage|change %|decrease percentage/u.test(normalized)) {
    return "label.percentage_change";
  }
  if (/profit amount/u.test(normalized)) {
    return "label.profit_amount";
  }
  if (/loss amount/u.test(normalized)) {
    return "label.loss_amount";
  }
  if (/profit percentage|profit %/u.test(normalized)) {
    return "label.profit_percentage";
  }
  if (/loss percentage|loss %/u.test(normalized)) {
    return "label.loss_percentage";
  }
  if (/value after first change/u.test(normalized)) {
    return "label.value_after_first_change";
  }
  if (/final value|after the change, value|relation index/u.test(normalized)) {
    return "label.final_value";
  }
  if (/remaining value|remaining percentage|remaining part|percentage left/u.test(normalized)) {
    return "label.remaining_value";
  }
  if (/required increase|increase needed|increase percentage/u.test(normalized)) {
    return "label.required_increase";
  }
  if (/total value|full value|original value|total quantity/u.test(normalized)) {
    return "label.total_value";
  }
  if (/unchanged part|unchanged quantity|fixed quantity|water quantity/u.test(normalized)) {
    return "label.unchanged_quantity";
  }
  if (/final mixture/u.test(normalized)) {
    return "label.final_mixture";
  }
  if (/pure component|milk to be added|quantity to add/u.test(normalized)) {
    return "label.quantity_to_add";
  }
  if (/required difference|difference between|difference in shares|difference/u.test(normalized)) {
    return "label.required_difference";
  }
  if (/required value|result/u.test(normalized)) {
    return "label.required_value";
  }

  return undefined;
}

function endingKey(label: string): EditorialIntentKey {
  const key = labelKey(label);
  if (key === "label.total_votes") {
    return "ending.total_votes";
  }
  if (key === "label.maximum_marks") {
    return "ending.maximum_marks";
  }
  if (key === "label.final_population") {
    return "ending.final_population";
  }
  if (
    key === "label.percentage_change" ||
    key === "label.profit_percentage" ||
    key === "label.loss_percentage" ||
    key === "label.reduction_consumption" ||
    key === "label.required_increase"
  ) {
    return "ending.required_percentage";
  }
  return "ending.required_value";
}

function narrationIntent(line: string): EditorialIntent | undefined {
  const trimmed = line.trim();
  const increase = /^After a ([\d.]+)% increase:?$/u.exec(trimmed);
  if (increase) {
    return {
      key: "narration.after_increase",
      kind: "narration",
      sourceText: line,
      fallbackText: line,
      params: { percent: increase[1]! },
    };
  }
  const decrease = /^After a ([\d.]+)% decrease:?$/u.exec(trimmed);
  if (decrease) {
    return {
      key: "narration.after_decrease",
      kind: "narration",
      sourceText: line,
      fallbackText: line,
      params: { percent: decrease[1]! },
    };
  }
  const priceIncrease = /^After a ([\d.]+)% price increase:?$/u.exec(trimmed);
  if (priceIncrease) {
    return {
      key: "narration.after_price_increase",
      kind: "narration",
      sourceText: line,
      fallbackText: line,
      params: { percent: priceIncrease[1]! },
    };
  }

  const narrationMap: Array<[RegExp, EditorialIntentKey]> = [
    [/^For the same expenditure:?$/u, "narration.same_expenditure"],
    [/^Water quantity remains unchanged\.$/u, "narration.water_unchanged"],
    [/^(?:The )?(?:fixed|unchanged) (?:part|quantity) remains:?$/iu, "narration.fixed_quantity_unchanged"],
    [/^For the target mixture:?$/u, "narration.target_mixture"],
    [/^After a \d+(?:\.\d+)?% reduction, the remaining value is:?$/u, "narration.remaining_value"],
    [/^After a \d+(?:\.\d+)?% reduction, percentage left is:?$/u, "narration.remaining_value"],
    [/^(?:So, )?100% is:?$/u, "narration.full_value"],
    [/^Therefore, the original value is:?$/u, "narration.original_value"],
    [/^So,$/u, "narration.shortcut_so"],
    [/^Together, they give:?$/u, "narration.combined_difference"],
    [/^Direct relation:?$/u, "narration.direct_relation"],
    [/^Using the percentage relation:?$/u, "narration.percentage_relation"],
    [/^Apply the next relation:?$/u, "narration.percentage_relation"],
    [/^Convert the given relation:?$/u, "narration.percentage_relation"],
    [/^Value after this relation:?$/u, "narration.percentage_relation"],
    [/^After adding the bonus:?$/u, "narration.after_bonus"],
    [/^Now compare it with 100:?$/u, "narration.direct_relation"],
    [/^Let the original value be 100:?$/u, "narration.original_value"],
  ];

  for (const [pattern, key] of narrationMap) {
    if (pattern.test(trimmed)) {
      return {
        key,
        kind: "narration",
        sourceText: line,
        fallbackText: line,
      };
    }
  }

  return undefined;
}

function intent(
  key: EditorialIntentKey,
  kind: EditorialIntent["kind"],
  line: string,
  params?: EditorialIntent["params"],
): EditorialIntent {
  return {
    key,
    kind,
    sourceText: line,
    fallbackText: line,
    params,
  };
}

export function extractEditorialIntents(
  editorial: EditorialRealization,
): EditorialIntent[] {
  return editorial.explanation.split("\n").map((line) => {
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      return intent("layout.blank", "blank", line);
    }
    if (isEquationLine(trimmed)) {
      return intent("equation.universal", "equation", line);
    }
    if (trimmed === "Shortcut:") {
      return intent("shortcut.heading", "shortcut", line);
    }
    const growthPeriod = /^Growth is applied for (\d+(?:\.\d+)?) years\.$/u.exec(trimmed);
    if (growthPeriod) {
      return intent("narration.growth_period", "narration", line, {
        years: growthPeriod[1]!,
      });
    }
    const shortcutShare = SHORTCUT_SHARE_RE.exec(trimmed);
    if (shortcutShare) {
      const noun = shortcutShare[2]!;
      const key =
        noun === "votes"
          ? "shortcut.total_votes"
          : noun === "marks"
            ? "shortcut.total_marks"
            : noun === "population"
              ? "shortcut.final_population"
              : "shortcut.total_value";
      return intent(key, "shortcut", line, {
        percent: shortcutShare[1]!,
        noun,
        value: shortcutShare[3] ?? "",
        suffix: shortcutShare[3] ? "value" : "=",
      });
    }
    if (TRANSITION_KEYS[trimmed]) {
      return intent(TRANSITION_KEYS[trimmed]!, "transition", line);
    }

    const finalAnswer = /^Therefore, the required answer is (.+)$/u.exec(trimmed);
    if (finalAnswer) {
      return intent("ending.final_answer", "ending", line, {
        value: finalAnswer[1]!,
      });
    }
    const semanticPercent = SEMANTIC_PERCENT_RESULT_RE.exec(trimmed);
    if (semanticPercent) {
      return intent("ending.required_percentage", "ending", line, {
        value: `${semanticPercent[1]}%`,
        semantic: semanticPercent[2]!,
        prefix: "=",
      });
    }

    const assignment = ASSIGNMENT_RE.exec(trimmed);
    if (assignment) {
      const label = assignment[1]!;
      const value = assignment[2]!;
      const key = endingKey(label);
      return intent(key, "ending", line, { label, value });
    }

    const labelAssignment = LABEL_ASSIGNMENT_RE.exec(trimmed);
    if (labelAssignment) {
      const key = labelKey(labelAssignment[1]!);
      if (key) {
        return intent(key, "label", line, {
          suffix: "=",
        });
      }
    }

    const label = labelKey(trimmed);
    if (label) {
      return intent(label, "label", line);
    }

    const narration = narrationIntent(line);
    if (narration) {
      return narration;
    }

    return intent("fallback.english", "fallback", line);
  });
}
