import { createHash } from "node:crypto";
import { generateExamRealLocalizedTrg002Question, type Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";
import { TRG_002_V4_SCENARIO_SHELLS, selectTrg002V4ScenarioShell, type Trg002SpatialTopology } from "./exam-readiness-v4-scenario-engine";
import { applyTrg002V4Wave1ScenarioText } from "./exam-readiness-v4-wave1-surface";
import { isTrg002V4CanonicalOverride } from "./exam-readiness-v4-canonical";
import { generateLocalizedTrg002V4CanonicalOverride } from "./exam-readiness-v4-override-localization";
import {
  applyTrg002V4PhysicalSupportMigration,
  TRG_002_V4_ROOFTOP_SURFACE_IDS,
} from "./exam-readiness-v4-physical-support";

type AnyQuestion = Record<string, any>;

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(stableJson(value), "utf8").digest("hex");
}

// V3.2 inherited a historical formatter that could replace the substring "3/2"
// inside an exact expression such as √3/24, producing √1.54. V4 treats exact
// mathematical tokens as protected content. This repair remains as a compatibility
// shield until the historical V2 formatter is retired from the V4 path entirely.
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

function inferTopology(qlId: string, stem: string): Trg002SpatialTopology {
  if (qlId === "TRG-002-QL-005") return "COMPOSITE_VERTICAL";
  if (qlId === "TRG-002-QL-027") return "SHADOW_CHANGE";
  if (qlId === "TRG-002-QL-028") return "SHADOW_COMPARISON";
  if (qlId === "TRG-002-QL-079") return "OBSERVER_BETWEEN_TARGETS";
  if (qlId === "TRG-002-QL-087") return "TWO_VERTICAL_OBJECTS";
  if (/छाया|ਪਰਛਾਂਵ|ਛਾਂ|ਛਾਵ/u.test(stem)) return /दो|ਦੋ/u.test(stem) ? "SHADOW_CHANGE" : "SHADOW_COMPARISON";
  if (/सीढ़ी|ਸੀੜ੍ਹੀ|guy|तार|ਤਾਰ/u.test(stem)) return "SUPPORT_TRIANGLE";
  if (/नदी|ਨਦੀ/u.test(stem)) return "RIVER_WIDTH";
  if (/मस्तूल|ਮਸਤੂਲ|झंडे का डंडा|ਝੰਡੇ ਦੇ ਡੰਡੇ/u.test(stem)) return "COMPOSITE_VERTICAL";
  if (/विपरीत|दोनों ओर|ਉਲਟ|ਦੋਵੇਂ ਪਾਸ/u.test(stem)) return "OPPOSITE_SIDES";
  if (/दो बिंदु|दो स्थान|दो स्थित|ਦੋ ਬਿੰਦੂ|ਦੋ ਥਾਵਾਂ|ਦੋ ਸਥਿਤ/u.test(stem)) return "SAME_SIDE_TWO_POSITIONS";
  if (/छत|ਛੱਤ|बालकनी|ਬਾਲਕਨੀ|पुल|ਪੁਲ|अवलोकन मंच|ਨਿਰੀਖਣ ਮੰਚ/u.test(stem)) return "ELEVATED_OBSERVER";
  if (/दो इमारत|दो मीनार|ਦੋ ਇਮਾਰਤ|ਦੋ ਮੀਨਾਰ/u.test(stem)) return "TWO_VERTICAL_OBJECTS";
  return "SINGLE_RIGHT_TRIANGLE";
}

function canonicalScenarioId(qlId: string) {
  const ids: Record<string, string> = {
    "TRG-002-QL-005": "URBAN_BUILDING_AND_FLAGPOLE",
    "TRG-002-QL-027": "SHADOW_DIFFERENCE_TWO_TIMES",
    "TRG-002-QL-028": "SHADOW_TOWER_DIRECT",
    "TRG-002-QL-079": "ROAD_EQUAL_PILLARS",
    "TRG-002-QL-087": "URBAN_TWO_BUILDINGS",
  };
  return ids[qlId];
}

function isRooftopSurface(qlId: string) {
  return (TRG_002_V4_ROOFTOP_SURFACE_IDS as readonly string[]).includes(qlId);
}

export function generateTrg002V4CandidateQuestion(qlId: string, seed: string, locale: Trg002ExamRealnessLocale) {
  const canonicalOverride = isTrg002V4CanonicalOverride(qlId);
  const rawBase: AnyQuestion = canonicalOverride
    ? generateLocalizedTrg002V4CanonicalOverride(qlId, seed, locale)
    : generateExamRealLocalizedTrg002Question(qlId, seed, locale);
  const physicalSupport = applyTrg002V4PhysicalSupportMigration(rawBase);
  const base: AnyQuestion = physicalSupport.question;
  const exactStem = repairHistoricalExactMathArtifact(base.stem);
  const explanation = repairExplanation(base.explanation);
  const explicitScenarioId = canonicalOverride ? canonicalScenarioId(qlId) : undefined;
  const wave1 = canonicalOverride
    ? { stem: exactStem, scenarioTextApplied: true, scenarioId: explicitScenarioId, diagramMigrationRequired: false }
    : applyTrg002V4Wave1ScenarioText(qlId, locale, exactStem);
  const stem = wave1.stem;
  const topology = inferTopology(qlId, stem);
  const selectedScenario = selectTrg002V4ScenarioShell({ qlId, seed, topology });
  const scenario = explicitScenarioId
    ? TRG_002_V4_SCENARIO_SHELLS.find((shell) => shell.id === explicitScenarioId)
    : selectedScenario;
  if (!scenario) throw new Error(`${qlId}: missing explicit V4 scenario shell ${explicitScenarioId}.`);
  if (scenario.topology !== topology) throw new Error(`${qlId}: explicit V4 scenario topology ${scenario.topology} does not match ${topology}.`);

  // A rooftop surface is complete when the canonical eye point is physically bound
  // to a vertical support object. Bridge/river scenarios remain pending because a
  // generic support alone would not depict their scenario semantics honestly.
  const rooftopDiagramAligned = isRooftopSurface(qlId) && physicalSupport.supported;
  const diagramMigrationRequired = wave1.diagramMigrationRequired && !rooftopDiagramAligned;
  const scenarioSurfaceApplied = canonicalOverride || (wave1.scenarioTextApplied && !diagramMigrationRequired);

  const learnerText = [stem, explanation.keyRule, ...explanation.steps.map((s: AnyQuestion) => s.body), explanation.shortcut, ...explanation.traps].join(" ");
  if (/√\d+\.\d+/u.test(learnerText)) throw new Error(`${qlId}:${locale}: V4 forbids decimal radicands in exact learner math.`);

  const v4Fingerprint = sha256({
    qlId,
    seed,
    locale,
    stem,
    explanation,
    topology,
    scenarioId: wave1.scenarioId ?? scenario.id,
    canonicalOverride,
    physicalObserverSupport: physicalSupport.supported,
    diagramMigrationRequired,
  });
  return {
    ...base,
    stem,
    explanation,
    v4ExamReadiness: {
      version: "TRG002_EXAM_READINESS_V4",
      status: "REMEDIATION_IN_PROGRESS" as const,
      canonicalOverride,
      spatialTopology: topology,
      recommendedScenarioShell: wave1.scenarioId ?? scenario.id,
      recommendedScenarioDomain: scenario.domain,
      recommendedVisualStrategy: scenario.visualStrategy,
      scenarioTextApplied: wave1.scenarioTextApplied,
      scenarioSurfaceApplied,
      diagramMigrationRequired,
      physicalObserverSupport: physicalSupport.supported,
      physicalSupportMigratedInV4: physicalSupport.migrated,
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
