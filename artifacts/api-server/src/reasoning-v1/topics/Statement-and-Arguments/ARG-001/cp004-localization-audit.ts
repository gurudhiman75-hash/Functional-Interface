import { ARG_001_CP004_LOCALIZATION_MANIFEST } from "./cp004-localization-manifest.ts";
import { ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE } from "./cp004-localized-templates.ts";
import { ARG_QL_IDS } from "./types.ts";

export function assertArgCp004ManifestConsistency(): void {
  for (const locale of ["hi-IN", "pa-IN"] as const) {
    const count = ARG_QL_IDS.reduce(
      (total, qlId) => total + ARG_CP004_LOCALIZED_TEMPLATES_BY_LOCALE[locale][qlId].length,
      0,
    );
    if (count !== ARG_001_CP004_LOCALIZATION_MANIFEST.localizedTemplatesPerLocale) {
      throw new Error(`${locale}: manifest expects ${ARG_001_CP004_LOCALIZATION_MANIFEST.localizedTemplatesPerLocale} localized templates, found ${count}`);
    }
  }

  if (ARG_001_CP004_LOCALIZATION_MANIFEST.questionStudioRegistered !== false ||
      ARG_001_CP004_LOCALIZATION_MANIFEST.questionBankWritable !== false ||
      ARG_001_CP004_LOCALIZATION_MANIFEST.testEligible !== false ||
      ARG_001_CP004_LOCALIZATION_MANIFEST.mockEligible !== false ||
      ARG_001_CP004_LOCALIZATION_MANIFEST.publiclyPublishable !== false ||
      ARG_001_CP004_LOCALIZATION_MANIFEST.automaticStudentPublication !== false) {
    throw new Error("ARG-001 CP004 lifecycle boundary drifted open");
  }
}
