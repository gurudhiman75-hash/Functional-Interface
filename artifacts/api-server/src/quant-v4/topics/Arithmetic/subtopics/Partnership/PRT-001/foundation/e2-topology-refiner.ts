import { normalizeRatio, rational, subtractRational } from "./math";
import { formatPrt001Duration } from "./parameter-generator";
import { createPrt001Random } from "./random";
import { solvePrt001State } from "./solver";
import type { Prt001PilotParameters } from "./types";

/**
 * The initial E2 relational three-partner examples intentionally used clean
 * equal effective contributions. That is useful as one exam pattern but not
 * enough same-QL mathematical diversity. Vary only C's stated duration across
 * a curated integer-month band and recompute the derived profit ratio.
 */
export function refinePrt001E2Topology(
  parameters: Prt001PilotParameters,
): Prt001PilotParameters {
  if (
    parameters.questionLanguageId !== "PRT-QL-049" &&
    parameters.questionLanguageId !== "PRT-QL-050"
  ) {
    return parameters;
  }

  const partnerC = parameters.state.partners[2];
  if (!partnerC) throw new Error("E2 relational refinement requires partner C");
  const firstSegment = partnerC.capitalSegments[0];
  if (!firstSegment) throw new Error("E2 relational refinement requires C segment");

  const random = createPrt001Random(`${parameters.seed}:e2-relational-topology`);
  const durationC = random.pick([6, 8, 9, 10, 12]);
  const refinedPartnerC = {
    ...partnerC,
    capitalSegments: [
      {
        ...firstSegment,
        start: rational(0),
        end: rational(durationC),
      },
    ],
  };
  const state = {
    ...parameters.state,
    partners: [
      parameters.state.partners[0]!,
      parameters.state.partners[1]!,
      refinedPartnerC,
    ],
  };
  const solution = solvePrt001State(state);
  const ratio = normalizeRatio(
    solution.timeline.weights.map((item) => item.effectiveCapital),
  );
  const renderedDurationC = formatPrt001Duration(
    subtractRational(
      refinedPartnerC.capitalSegments[0]!.end,
      refinedPartnerC.capitalSegments[0]!.start,
    ),
    parameters.language,
  );

  return {
    ...parameters,
    state,
    renderVariables: {
      ...parameters.renderVariables,
      durationC: renderedDurationC,
      profitRatioA: ratio[0]!.toString(),
      profitRatioB: ratio[1]!.toString(),
      profitRatioC: ratio[2]!.toString(),
    },
  };
}
