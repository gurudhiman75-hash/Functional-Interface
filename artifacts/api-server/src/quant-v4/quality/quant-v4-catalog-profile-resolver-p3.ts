import type { QuantV4ExamProfileId } from "../common/exam-profile";
import type {
  QuantV4DifficultyCatalogIdentity,
  QuantV4DifficultyProfileResolution,
} from "./quant-v4-empirical-difficulty-telemetry-bridge-p3";

export const QUANT_V4_CATALOG_PROFILE_RESOLVER_AUTHORITY =
  "QUANT-V4-CATALOG-PROFILE-RESOLVER-P3" as const;

export const QUANT_V4_CATALOG_EXAM_CODE_PROFILE_MAP: Readonly<Record<string, QuantV4ExamProfileId>> =
  Object.freeze({
    SSC_CGL_T1: "SSC_CGL_TIER_I",
    SSC_CHSL_T1: "SSC_CGL_CHSL",
    IBPS_PO_PRE: "BANKING_PRELIMS",
    IBPS_CLERK_PRE: "BANKING_PRELIMS",
    PUNJAB_PSSSB_CLERK: "PUNJAB_STATE",
    PUNJAB_EXCISE_INSP: "PUNJAB_STATE",
  });

const EXPECTED_FAMILY: Readonly<Record<QuantV4ExamProfileId, string | null>> = Object.freeze({
  SSC_CGL_TIER_I: "SSC",
  SSC_CGL_CHSL: "SSC",
  SSC_CGL_JSO: "SSC",
  PUNJAB_STATE: "PUNJAB STATE",
  BANKING_PRELIMS: "BANKING",
  BANKING_MAINS: "BANKING",
  GENERIC_PRACTICE: null,
});

function normalized(value: unknown): string {
  return String(value ?? "").trim().toUpperCase();
}

export function resolveQuantV4CatalogExamProfile(
  identity: QuantV4DifficultyCatalogIdentity,
): QuantV4DifficultyProfileResolution {
  const examCode = normalized(identity.examCode);
  const profile = QUANT_V4_CATALOG_EXAM_CODE_PROFILE_MAP[examCode] ?? null;
  if (!profile) {
    return Object.freeze({
      examProfile: null,
      authority: QUANT_V4_CATALOG_PROFILE_RESOLVER_AUTHORITY,
    });
  }

  const expectedFamily = EXPECTED_FAMILY[profile];
  const actualFamily = normalized(identity.examFamilyName || identity.examFamilyCode);
  if (expectedFamily && actualFamily && actualFamily !== expectedFamily) {
    return Object.freeze({
      examProfile: null,
      authority: QUANT_V4_CATALOG_PROFILE_RESOLVER_AUTHORITY,
    });
  }

  return Object.freeze({
    examProfile: profile,
    authority: QUANT_V4_CATALOG_PROFILE_RESOLVER_AUTHORITY,
  });
}
