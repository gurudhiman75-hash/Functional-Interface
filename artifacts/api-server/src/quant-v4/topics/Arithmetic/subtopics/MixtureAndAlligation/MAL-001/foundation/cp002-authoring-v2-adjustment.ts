import { divideRational } from "./rational";
import type { MalCp002Context } from "./cp002-context-library";
import type { MalCp002SolveRequest, MalCp002SolveResult } from "./cp002-types";
import type { MalCp002Explanation } from "./cp002-authoring-types";
import {
  componentLabel,
  counterpart,
  displayMath,
  explanationShell,
  inlineMath,
  latexNumber,
  latexText,
  quantityMath,
  ratioMath,
  stateMath,
  stateQuantity,
} from "./cp002-authoring-v2-common";

export function buildTargetAdjustmentExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET" }
  >,
  result: Extract<MalCp002SolveResult, { kind: "ADJUSTMENT_QUANTITY" }>,
  context: MalCp002Context,
): MalCp002Explanation {
  const changed = request.changedComponent;
  const other = counterpart(changed);
  const changedLabel = componentLabel(context, changed);
  const otherLabel = componentLabel(context, other);
  const otherQuantity = stateQuantity(request.initialState, other);
  const initialChanged = stateQuantity(request.initialState, changed);
  const requiredChanged = stateQuantity(result.finalState, changed);
  const changedPart =
    changed === "A"
      ? request.targetRatio.componentAPart
      : request.targetRatio.componentBPart;
  const otherPart =
    other === "A"
      ? request.targetRatio.componentAPart
      : request.targetRatio.componentBPart;
  const onePart = divideRational(otherQuantity, otherPart);
  const action =
    request.adjustmentKind === "ADD" ? "added" : "removed";
  const differenceExpression =
    request.adjustmentKind === "ADD"
      ? `${latexNumber(requiredChanged)}-${latexNumber(initialChanged)}`
      : `${latexNumber(initialChanged)}-${latexNumber(requiredChanged)}`;

  return explanationShell({
    coreConcept: `Since only ${changedLabel} is ${action}, the quantity of ${otherLabel} remains ${quantityMath(
      otherQuantity,
      context,
    )}. Use this amount to calculate the value of one part in the target ratio.`,
    formula: [
      displayMath(
        `\\text{Value of one part}=\\frac{\\text{quantity of ${latexText(
          otherLabel,
        )}}}{\\text{${latexNumber(otherPart)} ratio parts}}`,
      ),
      displayMath(
        `\\text{Amount ${action}}=${
          request.adjustmentKind === "ADD"
            ? "\\text{required quantity}-\\text{initial quantity}"
            : "\\text{initial quantity}-\\text{required quantity}"
        }`,
      ),
    ].join("\n"),
    steps: [
      `Step 1: Since ${otherLabel} is not changed, its quantity remains ${quantityMath(
        otherQuantity,
        context,
      )}.`,
      `Step 2: In the target ratio ${ratioMath(
        request.targetRatio,
      )}, ${otherLabel} represents ${inlineMath(
        `${latexNumber(otherPart)}\\,\\text{${
          otherPart.numerator === otherPart.denominator ? "part" : "parts"
        }}`,
      )}.`,
      `Step 3: Calculate the value of one ratio part: ${displayMath(
        `1\\,\\text{part}=\\frac{${latexNumber(
          otherQuantity,
        )}{\\,\\text{${latexText(
          context.quantityUnit,
        )}}}{${latexNumber(otherPart)}}=${latexNumber(
          onePart,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
      `Step 4: ${changedLabel} represents ${inlineMath(
        `${latexNumber(changedPart)}\\,\\text{${
          changedPart.numerator === changedPart.denominator ? "part" : "parts"
        }}`,
      )}, so its required quantity is ${displayMath(
        `\\text{Required ${latexText(changedLabel)}}=${latexNumber(
          changedPart,
        )}\\times ${latexNumber(onePart)}=${latexNumber(
          requiredChanged,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
      `Step 5: Find the actual amount ${action}: ${displayMath(
        `\\text{Amount ${action}}=${differenceExpression}=${latexNumber(
          result.quantity,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
    ],
    verification: `The final quantities are ${stateMath(
      result.finalState,
      context,
    )}. Their ratio is ${ratioMath(
      result.finalRatio,
    )}, which matches the target ratio.`,
    conclusion: `${quantityMath(
      result.quantity,
      context,
      true,
    )} of ${changedLabel} should be ${action}.`,
    examShortcut:
      request.targetRatio.componentAPart.numerator ===
        request.targetRatio.componentBPart.numerator &&
      request.targetRatio.componentAPart.denominator ===
        request.targetRatio.componentBPart.denominator
        ? `The target ratio is ${ratioMath(
            request.targetRatio,
          )}, so both quantities must be equal. Match ${changedLabel} directly to the ${quantityMath(
            otherQuantity,
            context,
          )} of ${otherLabel}, then take the required difference.`
        : `Treat ${quantityMath(
            otherQuantity,
            context,
          )} of ${otherLabel} as ${inlineMath(
            `${latexNumber(otherPart)}\\,\\text{parts}`,
          )}. One part is ${quantityMath(
            onePart,
            context,
          )}; therefore ${changedLabel} must equal ${quantityMath(
            requiredChanged,
            context,
          )}.`,
    commonTrap: `Do not apply the target ratio to the original total. Adding or removing ${changedLabel} changes the total quantity, while ${otherLabel} remains the same.`,
  });
}

export function buildForwardRatioExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT" }
  >,
  result: Extract<MalCp002SolveResult, { kind: "COMPONENT_RATIO" }>,
  context: MalCp002Context,
): MalCp002Explanation {
  const changed = request.changedComponent;
  const other = counterpart(changed);
  const changedLabel = componentLabel(context, changed);
  const otherLabel = componentLabel(context, other);
  const initialChanged = stateQuantity(request.initialState, changed);
  const finalChanged = stateQuantity(result.finalState, changed);
  const otherQuantity = stateQuantity(result.finalState, other);
  const sign = request.adjustmentKind === "ADD" ? "+" : "-";
  const action = request.adjustmentKind === "ADD" ? "added" : "removed";
  const rawRatio = `${latexNumber(result.finalState.componentA)}:${latexNumber(
    result.finalState.componentB,
  )}`;

  return explanationShell({
    coreConcept: `Only ${changedLabel} is ${action}. The quantity of ${otherLabel} therefore remains ${quantityMath(
      otherQuantity,
      context,
    )}. Update the named item and then simplify the two final quantities.`,
    formula: displayMath(
      `\\text{New quantity}=\\text{initial quantity}${sign}\\text{stated quantity}`,
    ),
    steps: [
      `Step 1: The initial quantities are ${stateMath(
        request.initialState,
        context,
      )}.`,
      `Step 2: Update ${changedLabel}: ${displayMath(
        `\\text{New ${latexText(changedLabel)}}=${latexNumber(
          initialChanged,
        )}${sign}${latexNumber(
          request.adjustmentQuantity,
        )}=${latexNumber(finalChanged)}\\,\\text{${latexText(
          context.quantityUnit,
        )}}`,
      )}`,
      `Step 3: Since no ${otherLabel} is added or removed, its quantity remains ${quantityMath(
        otherQuantity,
        context,
      )}.`,
      `Step 4: Form the ratio in the order asked: ${displayMath(
        `\\text{${latexText(context.componentALabel)}}:\\text{${latexText(
          context.componentBLabel,
        )}}=${rawRatio}=${latexNumber(
          result.ratio.componentAPart,
        )}:${latexNumber(result.ratio.componentBPart)}`,
      )}`,
    ],
    verification: `The updated quantities are ${stateMath(
      result.finalState,
      context,
    )}, and they reduce to ${ratioMath(result.ratio)}.`,
    conclusion: `The new ratio is ${ratioMath(result.ratio)}.`,
    examShortcut: `Change only the ${changedLabel} quantity: ${inlineMath(
      `${latexNumber(initialChanged)}${sign}${latexNumber(
        request.adjustmentQuantity,
      )}=${latexNumber(finalChanged)}`,
    )}. Pair it with the ${quantityMath(
      otherQuantity,
      context,
    )} of ${otherLabel}, which remains the same, and reduce.`,
    commonTrap: `Do not add or subtract the stated quantity from both items. The operation affects ${changedLabel} only.`,
  });
}
