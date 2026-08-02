import {
  addRational,
  divideRational,
  reduceRationalRatio,
} from "./rational";
import type { MalCp002Context } from "./cp002-context-library";
import type {
  MalCp002ComponentId,
  MalCp002Ratio,
  MalCp002SolveRequest,
  MalCp002State,
} from "./cp002-types";
import type { MalCp002Explanation } from "./cp002-authoring-types";
import type { Rational } from "./types";

export function componentLabel(
  context: MalCp002Context,
  component: MalCp002ComponentId,
): string {
  return component === "A"
    ? context.componentALabel
    : context.componentBLabel;
}

export function counterpart(component: MalCp002ComponentId): MalCp002ComponentId {
  return component === "A" ? "B" : "A";
}

export function stateQuantity(
  state: MalCp002State,
  component: MalCp002ComponentId,
): Rational {
  return component === "A" ? state.componentA : state.componentB;
}

export function latexText(value: string): string {
  return value
    .replace(/\\/gu, "\\textbackslash{}")
    .replace(/([#$%&_{}])/gu, "\\$1")
    .replace(/\^/gu, "\\textasciicircum{}")
    .replace(/~/gu, "\\textasciitilde{}");
}

export function latexNumber(value: Rational): string {
  if (value.denominator === 1n) return value.numerator.toString();
  const negative = value.numerator < 0n;
  const numerator = negative ? -value.numerator : value.numerator;
  return `${negative ? "-" : ""}\\frac{${numerator.toString()}}{${value.denominator.toString()}}`;
}

export function inlineMath(value: string): string {
  return `\\(${value}\\)`;
}

export function displayMath(value: string): string {
  return `\\[${value}\\]`;
}

export function quantityMath(
  value: Rational,
  context: MalCp002Context,
  bold = false,
): string {
  const body = `${latexNumber(value)}\\,\\text{${latexText(context.quantityUnit)}}`;
  return inlineMath(bold ? `\\mathbf{${body}}` : body);
}

export function ratioParts(ratio: MalCp002Ratio): readonly [Rational, Rational] {
  return reduceRationalRatio(
    ratio.componentAPart,
    ratio.componentBPart,
  );
}

export function ratioMath(ratio: MalCp002Ratio): string {
  const [first, second] = ratioParts(ratio);
  return inlineMath(`${latexNumber(first)}:${latexNumber(second)}`);
}

export function stateMath(
  state: MalCp002State,
  context: MalCp002Context,
): string {
  return `${inlineMath(
    `\\text{${latexText(context.componentALabel)}}=${latexNumber(
      state.componentA,
    )}\\,\\text{${latexText(context.quantityUnit)}}`,
  )} and ${inlineMath(
    `\\text{${latexText(context.componentBLabel)}}=${latexNumber(
      state.componentB,
    )}\\,\\text{${latexText(context.quantityUnit)}}`,
  )}`;
}

function naturalContainer(context: MalCp002Context): string {
  return context.quantityUnit === "litres" ? "vessel" : "mixture";
}

export function explanationShell(
  values: Omit<MalCp002Explanation, "layoutId" | "sectionTitles">,
): MalCp002Explanation {
  return {
    layoutId: "MAL-CP002-EN-FORMULA-FIRST-DISCOVERY-V1",
    sectionTitles: {
      coreConcept: "📌 Core Concept & Formula",
      steps: "📝 Step-by-Step Solution",
      shortcut: "⚡ 10-Second Exam Shortcut",
      trap: "⚠️ Common Trap & Mistake Warning",
    },
    ...values,
  };
}

export function buildMalCp002Stem(
  request: MalCp002SolveRequest,
  context: MalCp002Context,
): string {
  const container = naturalContainer(context);

  switch (request.mode) {
    case "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET": {
      const changed = componentLabel(context, request.changedComponent);
      const action =
        request.adjustmentKind === "ADD" ? "added" : "removed";
      return `A ${container} contains ${quantityMath(
        request.initialState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityMath(
        request.initialState.componentB,
        context,
      )} of ${context.componentBLabel}. How many ${context.quantityUnit} of ${changed} should be ${action} so that the ratio of ${context.componentALabel} to ${context.componentBLabel} becomes ${ratioMath(
        request.targetRatio,
      )}?`;
    }

    case "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT": {
      const changed = componentLabel(context, request.changedComponent);
      const action =
        request.adjustmentKind === "ADD" ? "added to" : "removed from";
      return `A ${container} contains ${quantityMath(
        request.initialState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityMath(
        request.initialState.componentB,
        context,
      )} of ${context.componentBLabel}. If ${quantityMath(
        request.adjustmentQuantity,
        context,
      )} of ${changed} is ${action} it, what is the new ratio of ${context.componentALabel} to ${context.componentBLabel}?`;
    }

    case "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT": {
      const changed = componentLabel(context, request.changedComponent);
      const action =
        request.adjustmentKind === "ADD" ? "adding" : "removing";
      return `After ${action} ${quantityMath(
        request.adjustmentQuantity,
        context,
      )} of ${changed}, a ${container} contains ${quantityMath(
        request.finalState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityMath(
        request.finalState.componentB,
        context,
      )} of ${context.componentBLabel}. What was the original ratio of ${context.componentALabel} to ${context.componentBLabel}?`;
    }

    case "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO":
      return `A ${container} has a total quantity of ${quantityMath(
        request.totalQuantity,
        context,
      )}. It contains ${context.componentALabel} and ${context.componentBLabel} in the ratio ${ratioMath(
        request.ratio,
      )}. What are their quantities in the same order?`;

    case "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET": {
      const replacement = componentLabel(
        context,
        request.replacementComponent,
      );
      return `A vessel contains ${quantityMath(
        request.initialState.componentA,
        context,
      )} of ${context.componentALabel} and ${quantityMath(
        request.initialState.componentB,
        context,
      )} of ${context.componentBLabel}. A quantity of the well-mixed contents is removed once and replaced with the same quantity of ${replacement}. How many ${context.quantityUnit} should be replaced so that the final ratio of ${context.componentALabel} to ${context.componentBLabel} is ${ratioMath(
        request.targetRatio,
      )}?`;
    }
  }
}
