import { createHash } from "node:crypto";
import { degree } from "../foundation/angle";
import { exactInteger, exactSurd, formatExactPlain } from "../foundation/exact";
import {
  buildSingleDepressionState,
  buildTrg002DiagramEvidence,
  validateTrg002DiagramEvidence,
  validateTrg002DiagramSpec,
  verifyTrg002SpatialState,
  type Trg002SpatialState,
} from "./spatial";
import { buildTrg002MvpQuestion, mvpExplanation, mvpNumberAnswer, mvpPick } from "./mvp-runtime-core";
import type { Trg002ExamRealnessLocale } from "./localization-exam-realness-v2";

export const TRG_002_V4_RIVER_SURFACE_IDS = [
  "TRG-002-QL-092",
  "TRG-002-QL-093",
  "TRG-002-QL-094",
] as const;

const RIVER_IDS = new Set<string>(TRG_002_V4_RIVER_SURFACE_IDS);
const ZERO = exactInteger(0);

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}
function sha256(value: unknown) {
  return createHash("sha256").update(stableJson(value), "utf8").digest("hex");
}

export function isTrg002V4RiverMathOverride(qlId: string) {
  return qlId === "TRG-002-QL-093";
}

export function hasTrg002V4RiverPlatformSupport(state: Trg002SpatialState) {
  return state.observers.every((observer) =>
    state.verticalObjects.some((object) =>
      object.basePointId === observer.groundPointId
      && object.topPointId === observer.eyePointId,
    ),
  );
}

function withRiverPlatformSupport(state: Trg002SpatialState): Trg002SpatialState {
  const verticalObjects = [...state.verticalObjects];
  for (const observer of state.observers) {
    const alreadySupported = verticalObjects.some((object) =>
      object.basePointId === observer.groundPointId
      && object.topPointId === observer.eyePointId,
    );
    if (alreadySupported) continue;
    verticalObjects.push({
      id: `v4-river-platform-${observer.id}`,
      kind: "BUILDING",
      basePointId: observer.groundPointId,
      topPointId: observer.eyePointId,
      height: observer.eyeHeight,
    });
  }
  const { sameSide: _sameSide, ...metadata } = state.metadata;
  return {
    ...state,
    scenario: "RIVER_BANK",
    diagramStrategy: "RIVER_WIDTH",
    verticalObjects,
    metadata: {
      ...metadata,
      notes: [
        ...(state.metadata.notes ?? []),
        "V4 river-platform family: the elevated observer is physically supported on one bank and the requested horizontal distance is the perpendicular bank-to-bank river width.",
      ],
    },
  };
}

export function applyTrg002V4RiverPlatformMigration(question: any) {
  const qlId = String(question.qlId);
  const originalState = question.canonicalSpatialState as Trg002SpatialState;
  const shouldMigrate = RIVER_IDS.has(qlId);
  const state = shouldMigrate && !hasTrg002V4RiverPlatformSupport(originalState)
    ? withRiverPlatformSupport(originalState)
    : originalState;

  const supported = shouldMigrate && hasTrg002V4RiverPlatformSupport(state);
  if (state === originalState) {
    return { question, migrated: false, supported } as const;
  }

  const spatial = verifyTrg002SpatialState(state);
  const diagramEvidence = buildTrg002DiagramEvidence(qlId, state);
  if (!diagramEvidence.solutionDiagram) throw new Error(`${qlId}: V4 river-platform migration lost required solution diagram.`);
  const diagram = validateTrg002DiagramSpec(diagramEvidence.solutionDiagram);
  const diagramPolicy = validateTrg002DiagramEvidence(state, diagramEvidence);
  if (!spatial.valid || !diagram.valid || !diagramPolicy.valid) {
    throw new Error(`${qlId}: V4 river-platform migration failed canonical spatial/diagram validation.`);
  }

  const checks = (question.validation?.checks ?? []).map((check: any) => {
    if (check.name === "SPATIAL_VERIFIED") return { ...check, passed: spatial.valid, message: "V4 river-platform canonical spatial state verified." };
    if (check.name === "SOLUTION_DIAGRAM_VERIFIED") return { ...check, passed: diagram.valid && diagramPolicy.valid, message: "V4 river-platform solution diagram verified." };
    return check;
  });
  const validation = { valid: checks.every((check: any) => check.passed), checks };
  if (!validation.valid) throw new Error(`${qlId}: V4 river-platform migration inherited a failed validation check.`);

  return {
    question: {
      ...question,
      canonicalSpatialState: state,
      solutionDiagram: diagramEvidence.solutionDiagram,
      diagramEvidence,
      verification: {
        ...question.verification,
        spatial,
        diagram,
        diagramPolicy,
      },
      validation,
    },
    migrated: true,
    supported,
  } as const;
}

function buildQl093Canonical(seed: string) {
  const k = mvpPick(seed, "v4-river-093-k", [4, 5, 6] as const);
  const platformHeight = exactInteger(3 * k);
  const width = exactSurd(k, 3);
  const state = buildSingleDepressionState({
    horizontal: width,
    angle: degree(60),
    observerEyeHeight: platformHeight,
    targetHeight: ZERO,
    units: "m",
  });
  state.scenario = "RIVER_BANK";
  state.diagramStrategy = "RIVER_WIDTH";
  state.verticalObjects.push({
    id: "river-observation-platform",
    kind: "BUILDING",
    basePointId: "observer-ground",
    topPointId: "observer-eye",
    height: platformHeight,
  });
  const { sameSide: _sameSide, ...metadata } = state.metadata;
  state.metadata = {
    ...metadata,
    notes: [
      ...(state.metadata.notes ?? []),
      "V4 QL093: platform height is an ordinary measured integer; the exact surd appears only in the derived river width.",
      "The target is the point directly opposite on the other bank, so the requested horizontal separation is the river width.",
    ],
  };

  return buildTrg002MvpQuestion({
    qlId: "TRG-002-QL-093",
    cpId: "TRG-CP-010",
    lockedFamily: "RIVER_WIDTH_HORIZONTAL_SEPARATION",
    solveMode: "findRiverWidthFromNaturalPlatformHeightAt60DegreeDepression",
    seed,
    difficulty: "Medium",
    target: "LENGTH",
    stem: `An observation platform on one bank of a river is ${formatExactPlain(platformHeight)} m high. From its top, the point directly opposite on the other bank is seen at an angle of depression of 60°. Find the exact width of the river.`,
    state,
    correct: mvpNumberAnswer(width),
    wrong: [
      { value: mvpNumberAnswer(platformHeight), misconceptionId: "RETURNED_PLATFORM_HEIGHT" },
      { value: mvpNumberAnswer(exactInteger(k)), misconceptionId: "DIVIDED_BY_THREE_INSTEAD_OF_SQRT3" },
      { value: mvpNumberAnswer(exactSurd(3 * k, 3)), misconceptionId: "MULTIPLIED_BY_SQRT3_INSTEAD_OF_DIVIDING" },
    ],
    explanation: mvpExplanation(
      "The platform height is the vertical drop and the river width is the horizontal side of the depression triangle.",
      [
        `Given platform height = ${formatExactPlain(platformHeight)} m. Let the river width be w m.`,
        `tan60° = ${formatExactPlain(platformHeight)}/w = √3, so w = ${formatExactPlain(platformHeight)}/√3 = ${formatExactPlain(width)} m.`,
      ],
      "Use the perpendicular horizontal distance between the two banks, not the sloping line of sight.",
    ),
  });
}

export function generateLocalizedTrg002V4RiverQl093(seed: string, locale: Trg002ExamRealnessLocale) {
  const canonical: any = buildQl093Canonical(seed);
  const observer = canonical.canonicalSpatialState.observers[0];
  if (!observer) throw new Error("TRG-002-QL-093 V4: canonical river observer missing.");
  const height = formatExactPlain(observer.eyeHeight);
  const width = canonical.exactAnswer.kind === "NUMBER" ? formatExactPlain(canonical.exactAnswer.value) : canonical.answer.replace(/ m$/, "");

  const localized = locale === "hi-IN"
    ? {
        stem: `नदी के एक किनारे पर बना अवलोकन मंच ${height} m ऊँचा है। मंच के शीर्ष से दूसरे किनारे के ठीक सामने वाले बिंदु का अवनमन कोण 60° है। नदी की सटीक चौड़ाई ज्ञात कीजिए।`,
        explanation: {
          keyRule: "मंच की ऊँचाई लंबवत दूरी है और नदी की चौड़ाई क्षैतिज दूरी है। इन दोनों पर 60° के अवनमन कोण के साथ tangent लगाएँ।",
          steps: [
            { title: "दिया है", body: `मंच की ऊँचाई ${height} m है। नदी की चौड़ाई w m मानते हैं।` },
            { title: "गणना", body: `tan60° = ${height}/w = √3, इसलिए w = ${height}/√3 = ${width} m।` },
          ],
          shortcut: "60° के लिए चौड़ाई = लंबवत ऊँचाई/√3।",
          traps: ["नदी की चौड़ाई दोनों किनारों के बीच की क्षैतिज दूरी है; दृष्टि-रेखा की लंबाई नहीं।"],
        },
      }
    : {
        stem: `ਨਦੀ ਦੇ ਇੱਕ ਕਿਨਾਰੇ 'ਤੇ ਬਣਿਆ ਨਿਰੀਖਣ ਮੰਚ ${height} m ਉੱਚਾ ਹੈ। ਮੰਚ ਦੀ ਚੋਟੀ ਤੋਂ ਦੂਜੇ ਕਿਨਾਰੇ ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਵਾਲੇ ਬਿੰਦੂ ਦਾ ਨਿਵਾਣ ਕੋਣ 60° ਹੈ। ਨਦੀ ਦੀ ਸਟੀਕ ਚੌੜਾਈ ਕੱਢੋ।`,
        explanation: {
          keyRule: "ਮੰਚ ਦੀ ਉਚਾਈ ਲੰਬਵੀਂ ਦੂਰੀ ਹੈ ਅਤੇ ਨਦੀ ਦੀ ਚੌੜਾਈ ਖਿਤਿਜੀ ਦੂਰੀ ਹੈ। 60° ਦੇ ਨਿਵਾਣ ਕੋਣ ਨਾਲ tangent ਵਰਤੋ।",
          steps: [
            { title: "ਦਿੱਤਾ ਹੈ", body: `ਮੰਚ ਦੀ ਉਚਾਈ ${height} m ਹੈ। ਨਦੀ ਦੀ ਚੌੜਾਈ w m ਮੰਨਦੇ ਹਾਂ।` },
            { title: "ਗਣਨਾ", body: `tan60° = ${height}/w = √3, ਇਸ ਲਈ w = ${height}/√3 = ${width} m।` },
          ],
          shortcut: "60° ਲਈ ਚੌੜਾਈ = ਲੰਬਵੀਂ ਉਚਾਈ/√3।",
          traps: ["ਨਦੀ ਦੀ ਚੌੜਾਈ ਦੋਵੇਂ ਕਿਨਾਰਿਆਂ ਵਿਚਕਾਰ ਖਿਤਿਜੀ ਦੂਰੀ ਹੈ; ਦ੍ਰਿਸ਼ਟੀ-ਰੇਖਾ ਦੀ ਲੰਬਾਈ ਨਹੀਂ।"],
        },
      };

  const fingerprint = sha256({
    qlId: canonical.qlId,
    seed,
    locale,
    stem: localized.stem,
    explanation: localized.explanation,
    canonicalState: canonical.canonicalSpatialState,
  });

  return {
    ...canonical,
    stem: localized.stem,
    explanation: localized.explanation,
    localizationMetadata: {
      version: "TRG002_EXAM_READINESS_V4",
      authority: "V4_RIVER_PLATFORM_OVERRIDE",
      locale,
      humanLanguageReviewRequired: true,
    },
    localizationProof: {
      v4CanonicalOverride: true,
      canonicalSemanticsPreserved: true,
      localizationFingerprint: fingerprint,
      multilingualFreezeGranted: false,
    },
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
