import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A1 } from "./geometry-localization-editorial-v2-a1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A2 } from "./geometry-localization-editorial-v2-a2";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B1 } from "./geometry-localization-editorial-v2-b1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B2 } from "./geometry-localization-editorial-v2-b2";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B3 } from "./geometry-localization-editorial-v2-b3";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C1 } from "./geometry-localization-editorial-v2-c1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C2 } from "./geometry-localization-editorial-v2-c2";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C3 } from "./geometry-localization-editorial-v2-c3";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D1 } from "./geometry-localization-editorial-v2-d1";
import { GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D2 } from "./geometry-localization-editorial-v2-d2";

export {
  type GeometryReviewLocaleV2,
  type GeometryEditorialTemplateV2,
  type GeometryPrototypeEditorialTemplateV2,
} from "./geometry-localization-editorial-v2-types";
export { GEO_LOCALIZATION_OPTION_TRANSLATIONS_V2 } from "./geometry-localization-options-v2";

export const GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2 = Object.freeze({
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_A2,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B2,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_B3,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C2,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_C3,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D1,
  ...GEO_LOCALIZATION_EDITORIAL_TEMPLATES_V2_D2,
});
