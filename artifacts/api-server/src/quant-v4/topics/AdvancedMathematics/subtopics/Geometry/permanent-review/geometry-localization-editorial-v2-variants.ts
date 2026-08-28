import { GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_A } from "./geometry-localization-editorial-v2-variants-a";
import { GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_B } from "./geometry-localization-editorial-v2-variants-b";
import { GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_C } from "./geometry-localization-editorial-v2-variants-c";
import { GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_D } from "./geometry-localization-editorial-v2-variants-d";
import type { GeometryPrototypeEditorialVariantsV2 } from "./geometry-localization-editorial-v2-types";

export const GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2 = Object.freeze({
  ...GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_A,
  ...GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_B,
  ...GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_C,
  ...GEO_LOCALIZATION_EDITORIAL_VARIANTS_V2_D,
}) as Readonly<Record<string, GeometryPrototypeEditorialVariantsV2>>;
