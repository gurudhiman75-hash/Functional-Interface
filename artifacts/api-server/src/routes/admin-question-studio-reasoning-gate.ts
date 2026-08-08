import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import { listQuantV4Packages } from "../quant-v4/generation-engine";
import {
  getReasoningV1GenerationBlock,
  listQuestionStudioPackagesWithReasoning,
} from "../reasoning-v1/question-studio-registry";

const router = Router();

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

router.get(
  "/capabilities",
  authenticate,
  requireAdminPermission("content.generation.read"),
  async (_req, res) => {
    try {
      const packages = listQuestionStudioPackagesWithReasoning(
        listQuantV4Packages(),
      ).map((pkg) => ({
        packageId: String(pkg.packageId),
        topic: String(pkg.topic),
        subtopic: String(pkg.subtopic),
        label: String(pkg.label),
        enabled: Boolean(pkg.enabled),
        cpIds: Array.isArray(pkg.cpIds) ? pkg.cpIds.map(String) : [],
        supportedLanguages: Array.isArray(pkg.supportedLanguages)
          ? pkg.supportedLanguages.map(String)
          : ["en"],
        runtimeMode: asString((pkg as any).runtimeMode) || undefined,
        supportedRuntimeModes: Array.isArray(
          (pkg as any).supportedRuntimeModes,
        )
          ? (pkg as any).supportedRuntimeModes.map(String)
          : [],
        dynamicCandidateCpIds: Array.isArray(
          (pkg as any).dynamicCandidateCpIds,
        )
          ? (pkg as any).dynamicCandidateCpIds.map(String)
          : [],
        questionBankStatus:
          asString((pkg as any).questionBankStatus) || undefined,
        testEligibility: asString((pkg as any).testEligibility) || undefined,
        publiclyPublishable:
          typeof (pkg as any).publiclyPublishable === "boolean"
            ? (pkg as any).publiclyPublishable
            : undefined,
        generationAllowed:
          typeof (pkg as any).generationAllowed === "boolean"
            ? (pkg as any).generationAllowed
            : undefined,
        persistenceAllowed:
          typeof (pkg as any).persistenceAllowed === "boolean"
            ? (pkg as any).persistenceAllowed
            : undefined,
        approvalAllowed:
          typeof (pkg as any).approvalAllowed === "boolean"
            ? (pkg as any).approvalAllowed
            : undefined,
        freezeState: asString((pkg as any).freezeState) || undefined,
        freezeVersion: asString((pkg as any).freezeVersion) || undefined,
        runtimeVersion: asString((pkg as any).runtimeVersion) || undefined,
        permanentQlRange: (pkg as any).permanentQlRange ?? undefined,
        permanentQuestionCount:
          typeof (pkg as any).permanentQuestionCount === "number"
            ? (pkg as any).permanentQuestionCount
            : undefined,
        projectionSha256:
          asString((pkg as any).projectionSha256) || undefined,
        localizationStatus:
          asString((pkg as any).localizationStatus) || undefined,
        screenReaderValidation:
          asString((pkg as any).screenReaderValidation) || undefined,
      }));

      res.json({
        generationSystem: "quant-v4",
        generationSystems: ["quant-v4", "reasoning-v1"],
        capabilityRegistryVersion: "QUESTION_STUDIO_CAPABILITY_REGISTRY_V1",
        packages,
        difficulties: ["Easy", "Medium", "Hard"],
        languages: ["en", "hi", "pa"],
        maxBatchSize: 50,
      });
    } catch (error) {
      console.error("Question Studio capability registry failed", error);
      res.status(500).json({ error: "Unable to load generation capabilities" });
    }
  },
);

router.post(
  "/runs",
  authenticate,
  requireAdminPermission("content.generation.run"),
  (req, res, next) => {
    const block = getReasoningV1GenerationBlock({
      packageId: req.body?.packageId,
      patternId: req.body?.patternId,
      topic: req.body?.topic,
      subtopic: req.body?.subtopic,
    });

    if (!block) {
      next();
      return;
    }

    res.status(block.statusCode).json(block.body);
  },
);

export default router;
