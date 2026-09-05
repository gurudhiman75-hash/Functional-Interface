import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import {
  COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1,
  runCom003QuestionStudioPreRegistration,
} from "../knowledge-v1/computer-awareness/com003-question-studio-pre-registration-adapter-v1";
import { COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1 } from "../knowledge-v1/computer-awareness/com003-question-studio-pre-registration-freeze-v1";

const router = Router();

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalCount(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error("COM-003 preview count must be a positive integer.");
  return parsed;
}

router.use(authenticate);

router.get(
  "/computer/com003/package",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      generationSystem: "static-knowledge-frozen-corpus",
      activationMode: "READ_ONLY_PRE_REGISTRATION",
      package: COM003_QUESTION_STUDIO_PRE_REGISTRATION_CAPABILITY_V1,
      integrationAuthority: COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1,
      qlCount: 19,
      frozenQuestionsPerLanguage: 228,
      frozenQuestionLanguageArtifacts: 684,
      supportedLanguages: ["en", "hi", "pa"],
      databaseWriteEnabled: false,
      persistenceAllowed: false,
      questionStudioRegistrationStatus: "PRE_REGISTRATION_PREVIEW_ONLY",
      questionStudioDiscoverable: false,
      questionBankWriteEnabled: false,
      testEligible: false,
      publiclyPublishable: false,
      productionReleased: false,
      difficultyFilteringAuthorized: false,
    });
  },
);

router.get(
  "/computer/com003/preview",
  requireAdminPermission("content.generation.read"),
  (req, res) => {
    try {
      const result = runCom003QuestionStudioPreRegistration({
        packageId: "COM-003",
        qlId: asString(req.query.qlId) || undefined,
        cpId: asString(req.query.cpId) || undefined,
        language: asString(req.query.language) || undefined,
        questionLanguageId: asString(req.query.questionLanguageId) || undefined,
        seed: asString(req.query.seed) || "com003-question-studio-read-only-preview",
        count: asOptionalCount(req.query.count),
      });
      res.json({
        ...result,
        integrationAuthority: COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1.authorityId,
        activationMode: "READ_ONLY_PRE_REGISTRATION",
        persistenceAllowed: false,
        questionStudioRegistered: false,
        questionStudioDiscoverable: false,
        questionBankWritable: false,
        testEligible: false,
        publiclyPublishable: false,
        productionReleased: false,
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unable to preview COM-003 frozen questions.",
      });
    }
  },
);

router.get(
  "/computer/com003/status",
  requireAdminPermission("content.generation.read"),
  (_req, res) => {
    res.json({
      packageId: "COM-003",
      chapterTitle: "Office & Productivity Software",
      qlCount: 19,
      englishFrozen: true,
      localizationFrozen: true,
      frozenEnglishQuestionCount: 228,
      frozenHindiQuestionCount: 228,
      frozenPunjabiQuestionCount: 228,
      frozenQuestionLanguageArtifactCount: 684,
      integrationAuthority: COM003_QUESTION_STUDIO_PRE_REGISTRATION_FREEZE_AUTHORITY_V1.authorityId,
      previewConnectionAuthorized: true,
      questionStudioRegistrationStatus: "PRE_REGISTRATION_PREVIEW_ONLY",
      questionStudioRegistered: false,
      questionStudioDiscoverable: false,
      databaseWriteEnabled: false,
      persistenceAllowed: false,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleased: false,
      nextGate: "COM003_QUESTION_STUDIO_READ_ONLY_PREVIEW_CONNECTION_AUDIT_V1",
    });
  },
);

export default router;
