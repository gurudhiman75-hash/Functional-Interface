import { auditIndianGeoLocalizationV1 } from "./indian-geo-localization-v1";
import { GEO_AGR_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-agr-001-adapter-v1";
import { GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-cli-001-adapter-v1";
import { GEO_HAZ_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-haz-001-adapter-v1";
import { GEO_IND_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-ind-001-adapter-v1";
import { GEO_LND_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-lnd-001-adapter-v1";
import { GEO_LOC_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-loc-001-adapter-v1";
import { GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-min-001-adapter-v1";
import { GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-phy-001-adapter-v1";
import { GEO_PLN_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-pln-001-adapter-v1";
import { GEO_POP_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-pop-001-adapter-v1";
import { GEO_RIV_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-riv-001-adapter-v1";
import { GEO_SOI_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-soi-001-adapter-v1";
import { GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-trn-001-adapter-v1";
import { GEO_VEG_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-veg-001-adapter-v1";
import { GEO_WAT_001_QUESTION_STUDIO_CORPUS_V1 } from "../../question-studio/engines/knowledge-v1-geo-wat-001-adapter-v1";

const PACKAGES = Object.freeze([
  ["GEO-AGR-001", GEO_AGR_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-CLI-001", GEO_CLI_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-HAZ-001", GEO_HAZ_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-IND-001", GEO_IND_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-LND-001", GEO_LND_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-LOC-001", GEO_LOC_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-MIN-001", GEO_MIN_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-PHY-001", GEO_PHY_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-PLN-001", GEO_PLN_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-POP-001", GEO_POP_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-RIV-001", GEO_RIV_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-SOI-001", GEO_SOI_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-TRN-001", GEO_TRN_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-VEG-001", GEO_VEG_001_QUESTION_STUDIO_CORPUS_V1],
  ["GEO-WAT-001", GEO_WAT_001_QUESTION_STUDIO_CORPUS_V1],
] as const);

export function auditIndianGeoLocalizationFamilyV2() {
  const packages = PACKAGES.map(([packageId, corpus]) => {
    const audit = auditIndianGeoLocalizationV1(corpus, packageId);
    return Object.freeze({ packageId, ...audit });
  });

  const total = packages.reduce((acc, item) => {
    acc.canonicalQuestionCount += item.canonicalQuestionCount;
    acc.localizedVersionCount += item.localizedVersionCount;
    acc.hindiStemResidueCount += item.hindiStemResidueCount;
    acc.punjabiStemResidueCount += item.punjabiStemResidueCount;
    acc.hindiOptionResidueCount += item.hindiOptionResidueCount;
    acc.punjabiOptionResidueCount += item.punjabiOptionResidueCount;
    acc.genericExplanationFallbackCount += item.genericExplanationFallbackCount;
    acc.mixedScriptCount += item.mixedScriptCount;
    acc.structuralIssueCount += item.issues.length;
    return acc;
  }, {
    canonicalQuestionCount: 0,
    localizedVersionCount: 0,
    hindiStemResidueCount: 0,
    punjabiStemResidueCount: 0,
    hindiOptionResidueCount: 0,
    punjabiOptionResidueCount: 0,
    genericExplanationFallbackCount: 0,
    mixedScriptCount: 0,
    structuralIssueCount: 0,
  });

  const structuralValid = packages.every((item) => item.structuralValid);
  const qualityReadyForFreeze = packages.every((item) => item.qualityReadyForFreeze);

  return Object.freeze({
    authorityId: "INDIAN-GEO-LOCALIZATION-FAMILY-QA-V2",
    packageCount: packages.length,
    structuralValid,
    qualityReadyForFreeze,
    reviewRequired: !qualityReadyForFreeze,
    packages: Object.freeze(packages),
    totals: Object.freeze(total),
  });
}
