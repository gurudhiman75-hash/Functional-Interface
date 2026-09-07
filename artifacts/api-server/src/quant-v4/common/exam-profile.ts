export type QuantV4OptionCount = 4 | 5;

export type QuantV4ExamFamily = "SSC" | "BANKING" | "GENERIC";

export type QuantV4ExamProfileId =
  | "SSC_CGL_TIER_I"
  | "SSC_CGL_CHSL"
  | "SSC_CGL_JSO"
  | "BANKING_PRELIMS"
  | "BANKING_MAINS"
  | "GENERIC_PRACTICE";

export interface QuantV4ExamProfileContract {
  id: QuantV4ExamProfileId;
  family: QuantV4ExamFamily;
  optionCount: QuantV4OptionCount;
  deliveryStyle: "SSC_OBJECTIVE" | "BANKING_OBJECTIVE" | "GENERIC_OBJECTIVE";
}

export const QUANT_V4_EXAM_PROFILE_CONTRACTS: Readonly<Record<QuantV4ExamProfileId, QuantV4ExamProfileContract>> = Object.freeze({
  SSC_CGL_TIER_I: Object.freeze({
    id: "SSC_CGL_TIER_I",
    family: "SSC",
    optionCount: 4,
    deliveryStyle: "SSC_OBJECTIVE",
  }),
  SSC_CGL_CHSL: Object.freeze({
    id: "SSC_CGL_CHSL",
    family: "SSC",
    optionCount: 4,
    deliveryStyle: "SSC_OBJECTIVE",
  }),
  SSC_CGL_JSO: Object.freeze({
    id: "SSC_CGL_JSO",
    family: "SSC",
    optionCount: 4,
    deliveryStyle: "SSC_OBJECTIVE",
  }),
  BANKING_PRELIMS: Object.freeze({
    id: "BANKING_PRELIMS",
    family: "BANKING",
    optionCount: 5,
    deliveryStyle: "BANKING_OBJECTIVE",
  }),
  BANKING_MAINS: Object.freeze({
    id: "BANKING_MAINS",
    family: "BANKING",
    optionCount: 5,
    deliveryStyle: "BANKING_OBJECTIVE",
  }),
  GENERIC_PRACTICE: Object.freeze({
    id: "GENERIC_PRACTICE",
    family: "GENERIC",
    optionCount: 4,
    deliveryStyle: "GENERIC_OBJECTIVE",
  }),
});

export function getQuantV4ExamProfileContract(profileId: QuantV4ExamProfileId): QuantV4ExamProfileContract {
  const profile = QUANT_V4_EXAM_PROFILE_CONTRACTS[profileId];
  if (!profile) throw new Error(`Unknown Quant V4 exam profile: ${String(profileId)}`);
  return profile;
}

export function getQuantV4OptionCount(profileId: QuantV4ExamProfileId): QuantV4OptionCount {
  return getQuantV4ExamProfileContract(profileId).optionCount;
}

export function assertQuantV4OptionCount(profileId: QuantV4ExamProfileId, actual: number, source: string): void {
  const expected = getQuantV4OptionCount(profileId);
  if (actual !== expected) {
    throw new Error(`${source} exposes ${actual} options for ${profileId}; central Quant V4 contract requires ${expected}.`);
  }
}
