import { loadQuestionPackage } from "./loader";
import { validateQuestionPackage } from "./package-validator";
import { PCT_001_QUESTION_PACKAGE_REGISTRY } from "./registry";
import type {
  QuestionPackageAssetKind,
  QuestionPackageStatus,
} from "./types";

export interface QuestionPackageReport {
  packageCount: number;
  registeredPackages: readonly string[];
  incompletePackages: readonly string[];
  generationReadyPackages: readonly string[];
  statusSummary: Record<QuestionPackageStatus, number>;
  assetCoverage: Record<QuestionPackageAssetKind, number>;
  ownershipSummary: {
    humanOwnedAssetKinds: number;
    systemOwnedEducationalAssetKinds: number;
  };
  missingAssetSummary: Record<QuestionPackageAssetKind, number>;
  fallbackWordingAvailable: false;
  productionWiring: "NONE";
}

const ASSET_KINDS: readonly QuestionPackageAssetKind[] = [
  "stem",
  "variables",
  "explanationPolicies",
  "hints",
  "misconceptions",
  "realism",
  "validation",
];

export async function buildQuestionPackageReport(
  packageRoot: string,
): Promise<QuestionPackageReport> {
  const packages = await Promise.all(
    PCT_001_QUESTION_PACKAGE_REGISTRY.map((metadata) =>
      loadQuestionPackage(metadata, packageRoot),
    ),
  );
  const validations = packages.map((questionPackage) => ({
    questionPackage,
    validation: validateQuestionPackage(questionPackage),
  }));
  const assetCoverage = Object.fromEntries(
    ASSET_KINDS.map((asset) => [
      asset,
      packages.filter((questionPackage) => questionPackage.assets[asset] !== null)
        .length,
    ]),
  ) as Record<QuestionPackageAssetKind, number>;
  const statusSummary = {
    PLACEHOLDER: 0,
    DRAFT: 0,
    REVIEW: 0,
    APPROVED: 0,
    ACTIVE: 0,
  } satisfies Record<QuestionPackageStatus, number>;
  for (const metadata of PCT_001_QUESTION_PACKAGE_REGISTRY) {
    statusSummary[metadata.status] += 1;
  }
  return {
    packageCount: packages.length,
    registeredPackages: packages.map(
      (questionPackage) => questionPackage.metadata.questionId,
    ),
    incompletePackages: validations
      .filter(({ validation }) => !validation.generationReady)
      .map(({ questionPackage }) => questionPackage.metadata.questionId),
    generationReadyPackages: validations
      .filter(({ validation }) => validation.generationReady)
      .map(({ questionPackage }) => questionPackage.metadata.questionId),
    statusSummary,
    assetCoverage,
    ownershipSummary: {
      humanOwnedAssetKinds: 7,
      systemOwnedEducationalAssetKinds: 0,
    },
    missingAssetSummary: Object.fromEntries(
      ASSET_KINDS.map((asset) => [
        asset,
        packages.length - assetCoverage[asset],
      ]),
    ) as Record<QuestionPackageAssetKind, number>,
    fallbackWordingAvailable: false,
    productionWiring: "NONE",
  };
}

