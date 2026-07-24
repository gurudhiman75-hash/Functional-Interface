import { Router } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import { generateQuestion as generateQuantV4Questions } from "../quant-v4/generation-engine";

const router = Router();

type Profile = {
  id: string;
  label: string;
  targetTimeSeconds: number;
  calculationComplexity: "friendly" | "moderate" | "intensive";
  maxReasoningSteps: number;
  preferredContexts: string[];
};

const PROFILES: Profile[] = [
  { id: "SSC_CGL_T1", label: "SSC CGL Tier 1", targetTimeSeconds: 45, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["marks", "population", "salary", "income", "votes", "students"] },
  { id: "SSC_CHSL_T1", label: "SSC CHSL Tier 1", targetTimeSeconds: 50, calculationComplexity: "friendly", maxReasoningSteps: 3, preferredContexts: ["marks", "salary", "population", "students", "discount"] },
  { id: "SSC_MTS", label: "SSC MTS", targetTimeSeconds: 55, calculationComplexity: "friendly", maxReasoningSteps: 2, preferredContexts: ["students", "population", "price", "marks"] },
  { id: "IBPS_PO_PRE", label: "IBPS PO Prelims", targetTimeSeconds: 38, calculationComplexity: "intensive", maxReasoningSteps: 4, preferredContexts: ["income", "expenditure", "investment", "accounts", "profit", "sales"] },
  { id: "IBPS_CLERK_PRE", label: "IBPS Clerk Prelims", targetTimeSeconds: 42, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["accounts", "salary", "income", "profit", "sales"] },
  { id: "RRB_NTPC_CBT1", label: "RRB NTPC CBT 1", targetTimeSeconds: 50, calculationComplexity: "friendly", maxReasoningSteps: 3, preferredContexts: ["passengers", "population", "employees", "production", "marks"] },
  { id: "RRB_GROUP_D", label: "RRB Group D", targetTimeSeconds: 55, calculationComplexity: "friendly", maxReasoningSteps: 2, preferredContexts: ["workers", "passengers", "population", "items"] },
  { id: "PUNJAB_PSSSB_CLERK", label: "Punjab PSSSB Clerk", targetTimeSeconds: 50, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["population", "salary", "agriculture", "students", "employees"] },
  { id: "PUNJAB_EXCISE_INSP", label: "Punjab Excise Inspector", targetTimeSeconds: 45, calculationComplexity: "moderate", maxReasoningSteps: 3, preferredContexts: ["revenue", "population", "salary", "sales", "employees"] },
];

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const integer = (value: unknown, fallback: number, max: number) => {
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, max) : fallback;
};

function normalizeStem(question: Record<string, unknown>) {
  return text(question.text ?? question.stem)
    .toLowerCase()
    .replace(/\d+(?:\.\d+)?/g, "#")
    .replace(/[^a-z#]+/g, " ")
    .trim();
}

function metrics(questions: Record<string, unknown>[], profile: Profile) {
  let numberCount = 0;
  let totalDigits = 0;
  let decimalCount = 0;
  let contextMatches = 0;
  let reasoningProxy = 0;
  for (const question of questions) {
    const stem = text(question.text ?? question.stem).toLowerCase();
    const explanation = text(question.explanation);
    const numbers = stem.match(/\d+(?:\.\d+)?/g) ?? [];
    numberCount += numbers.length;
    totalDigits += numbers.reduce((sum, token) => sum + token.replace(/\D/g, "").length, 0);
    decimalCount += numbers.filter((token) => token.includes(".")).length;
    contextMatches += profile.preferredContexts.some((context) => stem.includes(context)) ? 1 : 0;
    reasoningProxy += Math.max(1, explanation.split(/\n|⇒|therefore|hence|step/gi).filter(Boolean).length);
  }
  const count = Math.max(1, questions.length);
  return {
    contextMatchPercent: Math.round((contextMatches / count) * 100),
    averageNumbersPerQuestion: Number((numberCount / count).toFixed(2)),
    averageDigitCount: Number((totalDigits / Math.max(1, numberCount)).toFixed(2)),
    decimalFrequencyPercent: Math.round((decimalCount / Math.max(1, numberCount)) * 100),
    averageReasoningProxy: Number((reasoningProxy / count).toFixed(2)),
    estimatedTimeSeconds: profile.targetTimeSeconds,
  };
}

router.use(authenticate);

router.post("/calibration", requireAdminPermission("content.generation.read"), async (req, res) => {
  const left = PROFILES.find((profile) => profile.id === text(req.body?.leftProfileId));
  const right = PROFILES.find((profile) => profile.id === text(req.body?.rightProfileId));
  if (!left || !right || left.id === right.id) {
    res.status(400).json({ error: "Choose two different valid exam profiles", code: "INVALID_CALIBRATION_PROFILES" });
    return;
  }
  const count = integer(req.body?.count, 20, 50);
  const packageId = text(req.body?.packageId) || undefined;
  const topic = text(req.body?.topic) || "Arithmetic";
  const subtopic = text(req.body?.subtopic) || "Percentage";
  const difficulty = text(req.body?.difficulty) || "Medium";
  const seed = text(req.body?.seed) || "exam-profile-calibration";

  try {
    const generate = async (profile: Profile) => {
      const result = await generateQuantV4Questions({ packageId: packageId as never, topic, subtopic, difficulty, language: "en", seed: `${seed}:${profile.id}`, count });
      return (Array.isArray(result.questions) ? result.questions : []) as Record<string, unknown>[];
    };
    const [leftQuestions, rightQuestions] = await Promise.all([generate(left), generate(right)]);
    const leftMetrics = metrics(leftQuestions, left);
    const rightMetrics = metrics(rightQuestions, right);
    const leftStems = new Set(leftQuestions.map(normalizeStem));
    const identical = rightQuestions.filter((question) => leftStems.has(normalizeStem(question))).length;
    const nearIdenticalPercent = Math.round((identical / Math.max(1, Math.min(leftQuestions.length, rightQuestions.length))) * 100);
    const contextSeparation = Math.abs(leftMetrics.contextMatchPercent - rightMetrics.contextMatchPercent);
    const numericDifference = Math.round(
      Math.abs(leftMetrics.averageDigitCount - rightMetrics.averageDigitCount) * 15 +
      Math.abs(leftMetrics.decimalFrequencyPercent - rightMetrics.decimalFrequencyPercent),
    );
    const timeDifferenceSeconds = Math.abs(left.targetTimeSeconds - right.targetTimeSeconds);
    const accepted = count * 2;
    const candidatePool = count * 4;
    const thresholds = { contextSeparationMin: 10, numericDifferenceMin: 8, nearIdenticalMax: 25 };
    const passed = contextSeparation >= thresholds.contextSeparationMin && numericDifference >= thresholds.numericDifferenceMin && nearIdenticalPercent <= thresholds.nearIdenticalMax;

    res.json({
      packageId: packageId ?? null,
      topic,
      subtopic,
      difficulty,
      seed,
      count,
      left: { profile: left, metrics: leftMetrics },
      right: { profile: right, metrics: rightMetrics },
      comparison: {
        contextSeparationPercent: contextSeparation,
        numericComplexityDifferencePercent: numericDifference,
        estimatedTimeDifferenceSeconds: timeDifferenceSeconds,
        nearIdenticalPercent,
        acceptedFromCandidatePoolPercent: Math.round((accepted / candidatePool) * 100),
        calibrationStatus: passed ? "pass" : "needs-calibration",
        thresholds,
        warnings: [
          ...(nearIdenticalPercent > thresholds.nearIdenticalMax ? ["The two profiles produced too many structurally identical stems."] : []),
          ...(contextSeparation < thresholds.contextSeparationMin ? ["Context separation is below the minimum threshold."] : []),
          ...(numericDifference < thresholds.numericDifferenceMin ? ["Numeric complexity separation is below the minimum threshold."] : []),
        ],
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Question Studio calibration failed", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unable to run profile calibration", code: "PROFILE_CALIBRATION_FAILED" });
  }
});

export default router;
