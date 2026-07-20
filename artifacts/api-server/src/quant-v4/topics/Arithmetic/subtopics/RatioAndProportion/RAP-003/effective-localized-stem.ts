import type { Rap003Parameters } from "./types";
import { renderLocalizedRap003PartnershipAgeStem } from "./localized-stem-partnership-age";
import { renderLocalizedRap003IncomeMixtureStem } from "./localized-stem-income-mixture";
import { renderLocalizedRap003ReplacementDenominationStem } from "./localized-stem-replacement-denomination";
import { renderLocalizedRap003RatePopulationStem } from "./localized-stem-rate-population";
import { renderLocalizedRap003ElectionGeometryStem } from "./localized-stem-election-geometry";

export function renderEffectiveLocalizedRap003Stem(parameters: Rap003Parameters) {
  return renderLocalizedRap003PartnershipAgeStem(parameters)
    ?? renderLocalizedRap003IncomeMixtureStem(parameters)
    ?? renderLocalizedRap003ReplacementDenominationStem(parameters)
    ?? renderLocalizedRap003RatePopulationStem(parameters)
    ?? renderLocalizedRap003ElectionGeometryStem(parameters);
}
