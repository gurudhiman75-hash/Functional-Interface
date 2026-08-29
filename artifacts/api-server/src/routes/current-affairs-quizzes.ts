import { Router, type IRouter, type Response } from "express";

import {
  gradeLearnerCurrentAffairsQuiz,
  listPublishedCurrentAffairsQuizzes,
  loadLearnerCurrentAffairsQuiz,
} from "../current-affairs/quiz-delivery-runtime";
import {
  normalizeQuizLanguage,
  type CurrentAffairsQuizGradeInput,
} from "../current-affairs/quiz-delivery-policy";
import {
  listCurrentAffairsLearningAttempts,
  loadCurrentAffairsRevisionQueue,
  submitCurrentAffairsRevision,
  submitTrackedCurrentAffairsQuiz,
} from "../current-affairs/revision-runtime";
import { authenticate } from "../middlewares/auth";

const router: IRouter = Router();
const QUIZ_CODE_PATTERN = /^CA-QZ-(D|W|M)-\d{8}-[A-Z0-9_-]{2,24}-V\d+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim().slice(0, max) : "";
}

function quizCode(value: unknown): string | null {
  const code = text(value, 100).toUpperCase();
  return QUIZ_CODE_PATTERN.test(code) ? code : null;
}

function clientAttemptId(value: unknown): string | null {
  const id = text(value, 80);
  return UUID_PATTERN.test(id) ? id : null;
}

function listLimit(value: unknown): number | null {
  if (value == null || value === "") return 50;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 100 ? parsed : null;
}

function answers(value: unknown): CurrentAffairsQuizGradeInput[] | null {
  if (!Array.isArray(value) || value.length > 200) return null;
  const seen = new Set<string>();
  const result: CurrentAffairsQuizGradeInput[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
    const row = entry as Record<string, unknown>;
    const id = text(row.id, 80);
    if (!UUID_PATTERN.test(id) || seen.has(id)) return null;
    const selectedIndex = row.selectedIndex == null ? null : Number(row.selectedIndex);
    if (selectedIndex !== null && (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex > 7)) {
      return null;
    }
    seen.add(id);
    result.push({ id, selectedIndex });
  }
  return result;
}

function sendError(res: Response, error: unknown, fallback: string) {
  const message = error instanceof Error ? error.message : fallback;
  if (/not found/i.test(message)) {
    res.status(404).json({ error: message, code: "CURRENT_AFFAIRS_QUIZ_NOT_FOUND" });
    return;
  }
  if (/canonical active student account|required before saving/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_STUDENT_PROFILE_REQUIRED" });
    return;
  }
  if (/not currently due|no longer active/i.test(message)) {
    res.status(409).json({ error: message, code: "CURRENT_AFFAIRS_REVISION_NOT_DUE" });
    return;
  }
  if (/invalid|must contain between|submission must contain/i.test(message)) {
    res.status(400).json({ error: message, code: "INVALID_CURRENT_AFFAIRS_QUIZ_REQUEST" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_QUIZ_FAILED" });
}

router.get("/current-affairs/quizzes", async (req, res) => {
  try {
    const limit = listLimit(req.query.limit);
    if (limit == null) {
      res.status(400).json({ error: "Quiz list limit must be between 1 and 100.", code: "INVALID_CURRENT_AFFAIRS_QUIZ_LIMIT" });
      return;
    }
    res.json({ quizzes: await listPublishedCurrentAffairsQuizzes(limit), generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs quizzes");
  }
});

router.get("/current-affairs/quizzes/:code", async (req, res) => {
  try {
    const code = quizCode(req.params.code);
    const languageCode = normalizeQuizLanguage(req.query.language ?? "en");
    if (!code || !languageCode) {
      res.status(400).json({ error: "Choose a valid quiz and language (en, hi or pa).", code: "INVALID_CURRENT_AFFAIRS_QUIZ_REQUEST" });
      return;
    }
    res.json(await loadLearnerCurrentAffairsQuiz(code, languageCode));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs quiz");
  }
});

router.post("/current-affairs/quizzes/:code/grade", async (req, res) => {
  try {
    const code = quizCode(req.params.code);
    const languageCode = normalizeQuizLanguage(req.body?.languageCode ?? "en");
    const submittedAnswers = answers(req.body?.answers);
    if (!code || !languageCode || submittedAnswers == null) {
      res.status(400).json({ error: "Provide a valid quiz, language and bounded answer list.", code: "INVALID_CURRENT_AFFAIRS_QUIZ_SUBMISSION" });
      return;
    }
    res.json(await gradeLearnerCurrentAffairsQuiz({ code, languageCode, answers: submittedAnswers }));
  } catch (error) {
    sendError(res, error, "Unable to grade Current Affairs quiz");
  }
});

router.post("/current-affairs/quizzes/:code/attempts", authenticate, async (req, res) => {
  try {
    const code = quizCode(req.params.code);
    const languageCode = normalizeQuizLanguage(req.body?.languageCode ?? "en");
    const submittedAnswers = answers(req.body?.answers);
    const attemptId = clientAttemptId(req.body?.clientAttemptId);
    const firebaseUid = req.user?.id ?? "";
    if (!code || !languageCode || submittedAnswers == null || !attemptId || !firebaseUid) {
      res.status(400).json({ error: "Provide a valid quiz, clientAttemptId, language and bounded answer list.", code: "INVALID_CURRENT_AFFAIRS_TRACKED_ATTEMPT" });
      return;
    }
    res.status(201).json(await submitTrackedCurrentAffairsQuiz({
      firebaseUid,
      code,
      clientAttemptId: attemptId,
      languageCode,
      answers: submittedAnswers,
    }));
  } catch (error) {
    sendError(res, error, "Unable to save Current Affairs quiz progress");
  }
});

router.get("/current-affairs/revision", authenticate, async (req, res) => {
  try {
    const languageCode = normalizeQuizLanguage(req.query.language ?? "en");
    const limit = listLimit(req.query.limit);
    const firebaseUid = req.user?.id ?? "";
    if (!languageCode || limit == null || !firebaseUid) {
      res.status(400).json({ error: "Choose a valid revision language and limit.", code: "INVALID_CURRENT_AFFAIRS_REVISION_REQUEST" });
      return;
    }
    res.json(await loadCurrentAffairsRevisionQueue({ firebaseUid, languageCode, limit }));
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs revision queue");
  }
});

router.post("/current-affairs/revision/attempts", authenticate, async (req, res) => {
  try {
    const languageCode = normalizeQuizLanguage(req.body?.languageCode ?? "en");
    const submittedAnswers = answers(req.body?.answers);
    const attemptId = clientAttemptId(req.body?.clientAttemptId);
    const firebaseUid = req.user?.id ?? "";
    if (!languageCode || submittedAnswers == null || !attemptId || !firebaseUid) {
      res.status(400).json({ error: "Provide a valid clientAttemptId, language and due revision answers.", code: "INVALID_CURRENT_AFFAIRS_REVISION_ATTEMPT" });
      return;
    }
    res.status(201).json(await submitCurrentAffairsRevision({
      firebaseUid,
      clientAttemptId: attemptId,
      languageCode,
      answers: submittedAnswers,
    }));
  } catch (error) {
    sendError(res, error, "Unable to save Current Affairs revision progress");
  }
});

router.get("/current-affairs/attempts", authenticate, async (req, res) => {
  try {
    const limit = listLimit(req.query.limit);
    const firebaseUid = req.user?.id ?? "";
    if (limit == null || !firebaseUid) {
      res.status(400).json({ error: "Choose a valid attempt-history limit.", code: "INVALID_CURRENT_AFFAIRS_ATTEMPT_HISTORY" });
      return;
    }
    res.json({ attempts: await listCurrentAffairsLearningAttempts({ firebaseUid, limit }), generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load Current Affairs attempt history");
  }
});

export default router;
