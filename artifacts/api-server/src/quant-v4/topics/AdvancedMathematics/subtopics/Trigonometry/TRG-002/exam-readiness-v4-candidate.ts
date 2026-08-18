import { createHash } from "node:crypto";
import { generateExamRealLocalizedTrg002Question, type Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import { selectTrg002V4ScenarioShell, type Trg002SpatialTopology } from "./exam-readiness-v4-scenario-engine";
import { applyTrg002V4Wave1ScenarioText } from "./exam-readiness-v4-wave1-surface";

type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(stableJson(value), "utf8").digest("hex");
}

// V3.2 inherited a historical formatter that could replace the substring "3/2"
// inside an exact expression such as √3/24, producing √1.54. V4 treats exact
// mathematical tokens as protected content. This repair is intentionally narrow
// and accompanied by a hard no-decimal-radicand gate.
function repairHistoricalExactMathArtifact(text: string) {
  return text.replace(/√1\.5(\d+)/g, (_match, trailing: string) => `√3/2${trailing}`);
}

function repairExplanation(explanation: AnyQuestion) {
  return {
    ...explanation,
    keyRule: repairHistoricalExactMathArtifact(explanation.keyRule),
    steps: explanation.steps.map((step: AnyQuestion) => ({ ...step, body: repairHistoricalExactMathArtifact(step.body) })),
    shortcut: repairHistoricalExactMathArtifact(explanation.shortcut),
    traps: explanation.traps.map((trap: string) => repairHistoricalExactMathArtifact(trap)),
  };
}

function inferTopology(stem: string): Trg002SpatialTopology {
  if (/छाया|ਪਰਛਾਂਵ/u.test(stem)) return /दो|ਦੋ/u.test(stem) ? "SHADOW_CHANGE" : "SHADOW_COMPARISON";
  if (/सीढ़ी|ਸੀੜ੍ਹੀ|guy|तार|ਤਾਰ/u.test(stem)) return "SUPPORT_TRIANGLE";
  if (/नदी|ਨਦੀ/u.test(stem)) return "RIVER_WIDTH";
  if (/मस्तूल|ਮਸਤੂਲ|झंडे का डंडा|ਝੰਡੇ ਦੇ ਡੰਡੇ/u.test(stem)) return "COMPOSITE_VERTICAL";
  if (/विपरीत|दोनों ओर|ਉਲਟ|ਦੋਵੇਂ ਪਾਸ/u.test(stem)) return "OPPOSITE_SIDES";
  if (/दो बिंदु|दो स्थान|दो स्थित|ਦੋ ਬਿੰਦੂ|ਦੋ ਥਾਵਾਂ|ਦੋ ਸਥਿਤ/u.test(stem)) return "SAME_SIDE_TWO_POSITIONS";
  if (/छत|ਛੱਤ|बालकनी|ਬਾਲਕਨੀ|पुल|ਪੁਲ|अवलोकन मंच|ਨਿਰੀਖਣ ਮੰਚ/u.test(stem)) return "ELEVATED_OBSERVER";
  if (/दो इमारत|दो मीनार|ਦੋ ਇਮਾਰਤ|ਦੋ ਮੀਨਾਰ/u.test(stem)) return "TWO_VERTICAL_OBJECTS";
  return "SINGLE_RIGHT_TRIANGLE";
}

export function generateTrg002V4CandidateQuestion(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  const base: AnyQuestion = generateExamRealLocalizedTrg002Question(qlId, seed, locale);
  const exactStem = repairHistoricalExactMathArtifact(base.stem);
  const explanation = repairExplanation(base.explanation);
  const wave1 = applyTrg002V4Wave1ScenarioText(qlId, locale, exactStem);
  const stem = wave1.stem;
  const topology = inferTopology(stem);
  const scenario = selectTrg002V4ScenarioShell({ qlId, seed, topology });
  const learnerText = [stem, explanation.keyRule, ...explanation.steps.map((s: AnyQuestion) => s.body), explanation.shortcut, ...explanation.traps].join(" ");
  if (/√\d+\.\d+/u.test(learnerText)) throw new Error(`${qlId}:${locale}: V4 forbids decimal radicands in exact learner math.`);

  const v4Fingerprint = sha256({ qlId, seed, locale, stem, explanation, topology, scenarioId: wave1.scenarioId ?? scenario.id });
  return {
    ...base,
    stem,
    explanation,
    v4ExamReadiness: {
      version: "TRG002_EXAM_READINESS_V4",
      status: "REMEDIATION_IN_PROGRESS" as const,
      spatialTopology: topology,
      recommendedScenarioShell: wave1.scenarioId ?? scenario.id,
      recommendedScenarioDomain: scenario.domain,
      recommendedVisualStrategy: scenario.visualStrategy,
      scenarioTextApplied: wave1.scenarioTextApplied,
      scenarioSurfaceApplied: wave1.scenarioTextApplied && !wave1.diagramMigrationRequired,
      diagramMigrationRequired: wave1.diagramMigrationRequired,
      exactMathProtected: true,
      comprehensiveVisualReviewRequired: true,
      qlRepurposingAllowedInV4Candidate: true,
      frozenEnglishAuthorityMutated: false,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
    },
    v4Fingerprint,
    humanReviewStatus: "PENDING" as const,
    frozen: false,
    freezeEligible: false,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false,
  };
}
