import type { Rap002Parameters } from "./types";
import { renderLocalizedRap002Stem } from "./localized-stem";
import { renderLocalizedRap002WorkStem } from "./localized-work-stems";

export function renderEffectiveLocalizedRap002Stem(parameters: Rap002Parameters) {
  return renderLocalizedRap002WorkStem(parameters) ?? renderLocalizedRap002Stem(parameters);
}
