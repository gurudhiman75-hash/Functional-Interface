import { addRational, divideRational, multiplyRational, subtractRational } from "./rational";
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

export function buildReplacementExplanation(
  request: Extract<
    MalCp002SolveRequest,
    { mode: "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET" }
  >,
  result: Extract<
    MalCp002SolveResult,
    { kind: "SINGLE_REPLACEMENT_QUANTITY" }
  >,
  context: MalCp002Context,
): MalCp002Explanation {
  const replacement = request.replacementComponent;
  const other = counterpart(replacement);
  const replacementLabel = componentLabel(context, replacement);
  const otherLabel = componentLabel(context, other);
  const total = addRational(
    request.initialState.componentA,
    request.initialState.componentB,
  );
  const targetOtherPart =
    other === "A"
      ? request.targetRatio.componentAPart
      : request.targetRatio.componentBPart;
  const targetTotalParts = addRational(
    request.targetRatio.componentAPart,
    request.targetRatio.componentBPart,
  );
  const targetOtherQuantity = multiplyRational(
    total,
    divideRational(targetOtherPart, targetTotalParts),
  );
  const initialOtherQuantity = stateQuantity(
    request.initialState,
    other,
  );
  const retainedVolume = subtractRational(total, result.quantity);
  const rightProduct = multiplyRational(
    targetOtherQuantity,
    total,
  );
  const retainedA = subtractRational(
    result.finalState.componentA,
    replacement === "A" ? result.quantity : { numerator: 0n, denominator: 1n },
  );
  const retainedB = subtractRational(
    result.finalState.componentB,
    replacement === "B" ? result.quantity : { numerator: 0n, denominator: 1n },
  );

  return explanationShell({
    coreConcept: `A well-mixed sample contains both items in the vessel's current proportion. Removing ${inlineMath("x")} ${context.quantityUnit} therefore leaves the same fraction of each original item; only then is ${replacementLabel} added back.`,
    formula: displayMath(
      `\\text{Amount of an original item left}=\\text{initial amount}\\times\\frac{V-x}{V}`,
    ),
    steps: [
      `Step 1: Find the vessel total: ${displayMath(
        `V=${latexNumber(
          request.initialState.componentA,
        )}+${latexNumber(request.initialState.componentB)}=${latexNumber(
          total,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
      `Step 2: In the target ratio ${ratioMath(
        request.targetRatio,
      )}, ${otherLabel} must occupy ${inlineMath(
        `\\frac{${latexNumber(targetOtherPart)}}{${latexNumber(
          targetTotalParts,
        )}}`,
      )} of the vessel: ${displayMath(
        `\\text{Target ${latexText(otherLabel)}}=${latexNumber(
          total,
        )}\\times\\frac{${latexNumber(targetOtherPart)}}{${latexNumber(
          targetTotalParts,
        )}}=${latexNumber(
          targetOtherQuantity,
        )}\\,\\text{${latexText(context.quantityUnit)}}`,
      )}`,
      `Step 3: If ${inlineMath("x")} ${context.quantityUnit} is removed, the amount of ${otherLabel} left is ${displayMath(
        `${latexNumber(
          initialOtherQuantity,
        )}\\times\\frac{${latexNumber(total)}-x}{${latexNumber(
          total,
        )}}`,
      )}`,
      `Step 4: Set this equal to the target amount and clear the denominator: ${displayMath(
        `${latexNumber(
          initialOtherQuantity,
        )}(${latexNumber(total)}-x)=${latexNumber(
          targetOtherQuantity,
        )}\\times ${latexNumber(total)}=${latexNumber(rightProduct)}`,
      )}`,
      `Step 5: Solve for the retained volume: ${displayMath(
        `${latexNumber(total)}-x=\\frac{${latexNumber(
          rightProduct,
        )}}{${latexNumber(initialOtherQuantity)}}=${latexNumber(
          retainedVolume,
        )}`,
      )}`,
      `Step 6: Therefore, ${displayMath(
        `x=${latexNumber(total)}-${latexNumber(
          retainedVolume,
        )}=${latexNumber(result.quantity)}\\,\\text{${latexText(
          context.quantityUnit,
        )}}`,
      )}`,
      `Step 7: After removal, the retained quantities are ${quantityMath(
        retainedA,
        context,
      )} of ${context.componentALabel} and ${quantityMath(
        retainedB,
        context,
      )} of ${context.componentBLabel}. Adding back ${quantityMath(
        result.quantity,
        context,
      )} of ${replacementLabel} gives the stated final quantities.`,
    ],
    verification: `The final quantities are ${stateMath(
      result.finalState,
      context,
    )}; they total ${quantityMath(
      total,
      context,
    )} and are in the ratio ${ratioMath(result.finalRatio)}.`,
    conclusion: `${quantityMath(
      result.quantity,
      context,
      true,
    )} should be removed and replaced with the same quantity of ${replacementLabel}.`,
    examShortcut: `Track the item that is not refilled. Its target quantity is determined by the final ratio, so solve ${inlineMath(
      `${latexNumber(
        initialOtherQuantity,
      )}\\frac{${latexNumber(total)}-x}{${latexNumber(
        total,
      )}}=${latexNumber(targetOtherQuantity)}`,
    )} directly.`,
    commonTrap: `Do not subtract the whole removed sample from ${replacementLabel} alone. The removed sample contains both ${context.componentALabel} and ${context.componentBLabel}.`,
  });
}
