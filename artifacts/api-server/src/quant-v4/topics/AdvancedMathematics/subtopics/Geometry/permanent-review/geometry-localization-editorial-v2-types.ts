export type GeometryReviewLocaleV2 = "hi-IN" | "pa-IN";

export interface GeometryEditorialTemplateV2 {
  readonly sourceMasked: string;
  readonly hi: string;
  readonly pa: string;
}

export interface GeometryPrototypeEditorialTemplateV2 {
  readonly question: GeometryEditorialTemplateV2;
  readonly explanations: readonly GeometryEditorialTemplateV2[];
}

export interface GeometryPrototypeEditorialVariantsV2 {
  readonly questions?: readonly GeometryEditorialTemplateV2[];
  readonly explanationsByLine?: readonly (readonly GeometryEditorialTemplateV2[])[];
}
