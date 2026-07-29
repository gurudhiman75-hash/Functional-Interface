import type { MenCp007PermanentPackage } from "../permanent/types";

export type MenCp007ApprovedEnglishPackage = Omit<
  MenCp007PermanentPackage,
  "editorialStatus" | "reviewStatus"
> & {
  releaseId: "MEN-CP007-EN-v1-APPROVED";
  editorialStatus: "APPROVED";
  reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
  approvalProvenance: "GROUPED_MANUAL_AND_EXECUTABLE_AUDIT_UNDER_PRODUCT_OWNER_DIRECTIVE";
  approvalValidation: {
    valid: boolean;
    checks: Array<{ name: string; passed: boolean; message: string }>;
  };
};
