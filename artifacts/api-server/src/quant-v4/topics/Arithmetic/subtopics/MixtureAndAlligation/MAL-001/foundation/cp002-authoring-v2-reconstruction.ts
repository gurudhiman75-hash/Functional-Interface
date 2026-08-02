import { addRational, divideRational } from "./rational";
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
  ratioParts,
  stateMath,
  stateQuantity,
} from "./cp002-authoring-v2-common";

export function buildOriginalRatioExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT" }
  >,
  result: Extract<MalCp002SolveResult, { kind: "ORIGINAL_RATIO" }>,
  context: MalCp002Context,
): MalCp002Explanation {
  const changed = request.changedComponent;
  const other = counterpart(changed);
  const changedLabel = componentLabel(context, changed);
  const otherLabel = componentLabel(context, other);
  const finalChanged = stateQuantity(request.finalState, changed);
  const originalChanged = stateQuantity(result.originalState, changed);
  const otherQuantity = stateQuantity(result.originalState, other);
  const undoSign = request.adjustmentKind === "ADD" ? "-" : "+";
  const previousAction =
    request.adjustmentKind === "ADD" ? "addition" : "removal";

  return explanationShell({
    coreConcept: `Reverse the stated ${previousAction} on ${changedLabel}. No amount of ${otherLabel} was involved, so its final quantity is also its original quantity.`,
    formula: displayMath(
      `\\text{Original ${latexText(
        changedLabel,
      )}}=\\text{final ${latexText(
        changedLabel,
      )}}${undoSign}\\text{stated quantity}`,
    ),
    steps: [
      `Step 1: The final quantities are ${stateMath(
        request.finalState,
        context,
      )}.`,
      `Step 2: Reverse the ${previousAction}: ${displayMath(
        `\\text{Original ${latexText(changedLabel)}}=${latexNumber(
          finalChanged,
        )}${undoSign}${latexNumber(
          request.adjustmentQuantity,
        )}=${latexNumber(originalChanged)}\\,\\text{${latexText(
          context.quantityUnit,
        )}}`,
      )}`,
      `Step 3: The original quantity of ${otherLabel} is still ${quantityMath(
        otherQuantity,
        context,
      )}.`,
      `Step 4: Form and simplify the original ratio: ${displayMath(
        `${latexNumber(result.originalState.componentA)}:${latexNumber(
          result.originalState.componentB,
        )}=${latexNumber(result.ratio.componentAPart)}:${latexNumber(
          result.ratio.componentBPart,
        )}`,
      )}`,
    ],
    verification: `Repeating the stated ${previousAction} on the reconstructed original quantities gives ${stateMath(
      request.finalState,
      context,
    )}.`,
    conclusion: `The original ratio was ${ratioMath(result.ratio)}.`,
    examShortcut: `Undo the operation on ${changedLabel} only: ${inlineMath(
      `${latexNumber(finalChanged)}${undoSign}${latexNumber(
        request.adjustmentQuantity,
      )}=${latexNumber(originalChanged)}`,
    )}. Then reduce the reconstructed pair.`,
    commonTrap: `The final ratio is not the original ratio. First reverse the change made to ${changedLabel}.`,
  });
}

export function buildComponentPairExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO" }
  >,
  result: Extract<
    MalCp002SolveResult,
    { kind: "COMPONENT_QUANTITY_PAIR" }
  >,
  context: MalCp002Context,
): MalCp002Explanation {
  const [aPart, bPart] = ratioParts(request.ratio);
  const totalParts = addRational(aPart, bPart);
  const onePart = divideRational(request.totalQuantity, totalParts);

  return explanationShell({
    coreConcept: `The total quantity is divided into ${inlineMath(
      `${latexNumber(totalParts)}\\,\\text{equal ratio parts}`,
    )}. Find one part first, then multiply by the number of parts belonging to each item.`,
    formula: [
      displayMath(
        `\\text{One part}=\\frac{\\text{total quantity}}{\\text{sum of ratio parts}}`,
      ),
      displayMath(
        `\\text{Item quantity}=\\text{its ratio parts}\\times\\text{one part}`,
      ),
    ].join("\n"),
    steps: [
      `Step 1: Add the ratio parts: ${displayMath(
        `\\text{Total parts}=${latexNumber(aPart)}+${latexNumber(
          bPart,
        )}=${latexNumber(totalParts)}`,
      )}`,
      `Step 2: Find one part: ${displayMath(
        `1\\,\\text{part}=\\frac{${latexNumber(
          request.totalQuantity,
        )}}{${latexNumber(totalParts)}}=${latexNumber(
          onePart,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
      `Step 3: Find ${context.componentALabel}: ${displayMath(
        `\\text{${latexText(context.componentALabel)}}=${latexNumber(
          aPart,
        )}\\times ${latexNumber(onePart)}=${latexNumber(
          result.componentAQuantity,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
      `Step 4: Find ${context.componentBLabel}: ${displayMath(
        `\\text{${latexText(context.componentBLabel)}}=${latexNumber(
          bPart,
        )}\\times ${latexNumber(onePart)}=${latexNumber(
          result.componentBQuantity,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
    ],
    verification: `${displayMath(
      `${latexNumber(result.componentAQuantity)}+${latexNumber(
        result.componentBQuantity,
      )}=${latexNumber(request.totalQuantity)}`,
    )} and the two quantities are in the ratio ${ratioMath(request.ratio)}.`,
    conclusion: `${context.componentALabel} is ${quantityMath(
      result.componentAQuantity,
      context,
      true,
    )} and ${context.componentBLabel} is ${quantityMath(
      result.componentBQuantity,
      context,
      true,
    )}.`,
    examShortcut: `Add the ratio parts once, divide the total once, and multiply that one-part value by each ratio term.`,
    commonTrap: `The ratio terms are only relative parts. They must be scaled to the stated total before they can be reported as quantities.`,
  });
}
