import {
  addRational,
  divideRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import {
  MAL_CP005_ALLOWED_DISPLAY_DENOMINATORS_V2,
  MAL_CP005_CHEAPER_CONTEXTS_V2,
  MAL_CP005_NATURAL_RATIOS_V2,
  MAL_CP005_QUANTITY_SCALES_V2,
  MAL_CP005_TARGET_PROFITS_V2,
} from "./cp005-exam-ready-v2-data";
import {
  HUNDRED_V2,
  hashV2,
  type MalCp005CheaperCommercialStateV2,
} from "./cp005-exam-ready-v2-core";
import type { Rational } from "./types";

interface CompatibleCheaperBaseState {
  contextIndex: number;
  purePart: Rational;
  adulterantPart: Rational;
  targetProfitPercent: Rational;
  averageCost: Rational;
  sellingRate: Rational;
}

function displayDenominatorAllowed(value: Rational): boolean {
  return MAL_CP005_ALLOWED_DISPLAY_DENOMINATORS_V2.has(
    Number(value.denominator),
  );
}

const COMPATIBLE_CHEAPER_BASE_STATES: readonly CompatibleCheaperBaseState[] = (() => {
  const result: CompatibleCheaperBaseState[] = [];
  for (
    let contextIndex = 0;
    contextIndex < MAL_CP005_CHEAPER_CONTEXTS_V2.length;
    contextIndex += 1
  ) {
    const context = MAL_CP005_CHEAPER_CONTEXTS_V2[contextIndex]!;
    const pureUnitCost = rational(context.pureUnitCost);
    const adulterantUnitCost = rational(context.adulterantUnitCost);
    for (const [pureNumerator, adulterantNumerator] of MAL_CP005_NATURAL_RATIOS_V2) {
      const purePart = rational(pureNumerator);
      const adulterantPart = rational(adulterantNumerator);
      const totalPart = addRational(purePart, adulterantPart);
      const averageCost = divideRational(
        addRational(
          multiplyRational(purePart, pureUnitCost),
          multiplyRational(adulterantPart, adulterantUnitCost),
        ),
        totalPart,
      );
      if (!displayDenominatorAllowed(averageCost)) continue;
      for (const targetSpec of MAL_CP005_TARGET_PROFITS_V2) {
        const targetProfitPercent = rational(
          targetSpec.numerator,
          targetSpec.denominator,
        );
        const sellingRate = divideRational(
          multiplyRational(
            averageCost,
            addRational(HUNDRED_V2, targetProfitPercent),
          ),
          HUNDRED_V2,
        );
        if (!displayDenominatorAllowed(sellingRate)) continue;
        result.push({
          contextIndex,
          purePart,
          adulterantPart,
          targetProfitPercent,
          averageCost,
          sellingRate,
        });
      }
    }
  }
  if (result.length < 1000) {
    throw new Error(
      `Cheaper-profit compatibility pool is unexpectedly small: ${result.length}.`,
    );
  }
  return result;
})();

export function cheaperProfitStateFromPoolV2(
  seed: string,
): MalCp005CheaperCommercialStateV2 {
  const base =
    COMPATIBLE_CHEAPER_BASE_STATES[
      hashV2(`${seed}:compatible-cheaper-base`) %
        COMPATIBLE_CHEAPER_BASE_STATES.length
    ]!;
  const context = MAL_CP005_CHEAPER_CONTEXTS_V2[base.contextIndex]!;
  const scale = rational(
    MAL_CP005_QUANTITY_SCALES_V2[
      hashV2(`${seed}:compatible-cheaper-scale`) %
        MAL_CP005_QUANTITY_SCALES_V2.length
    ]!,
  );
  const pureQuantity = multiplyRational(base.purePart, scale);
  const adulterantQuantity = multiplyRational(base.adulterantPart, scale);
  const pureUnitCost = rational(context.pureUnitCost);
  const adulterantUnitCost = rational(context.adulterantUnitCost);
  const ratioKey = `${rationalKey(base.purePart)}:${rationalKey(
    base.adulterantPart,
  )}`;
  const commercialKey = `${context.product}|${context.adulterant}|${ratioKey}|${rationalKey(
    base.targetProfitPercent,
  )}`;
  return {
    context,
    purePart: base.purePart,
    adulterantPart: base.adulterantPart,
    scale,
    pureQuantity,
    adulterantQuantity,
    pureUnitCost,
    adulterantUnitCost,
    targetProfitPercent: base.targetProfitPercent,
    averageCost: base.averageCost,
    sellingRate: base.sellingRate,
    stateKey: `CHEAPER-COMMERCIAL-POOL|${commercialKey}|${rationalKey(
      scale,
    )}`,
    siblingStateKey: `CHEAPER-COMMERCIAL|${commercialKey}`,
  };
}

export const MAL_CP005_COMPATIBLE_CHEAPER_PROFIT_STATE_COUNT =
  COMPATIBLE_CHEAPER_BASE_STATES.length *
  MAL_CP005_QUANTITY_SCALES_V2.length;
