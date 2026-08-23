import { formatExactPlain } from "../foundation/exact";
import { generateTrg002V4CanonicalQuestion } from "./exam-readiness-v4-canonical";
import { applyTrg002V4PhysicalSupportMigration } from "./exam-readiness-v4-physical-support";
import {
  applyTrg002V4RiverPlatformMigration,
  generateLocalizedTrg002V4RiverQl093,
  isTrg002V4RiverMathOverride,
} from "./exam-readiness-v4-river";
import {
  generateTrg002V4NaturalMeasurementQuestion,
  isTrg002V4NaturalMeasurementOverride,
} from "./exam-readiness-v4-natural-measurements";
import {
  generateTrg002V4ScenarioWave3Question,
  isTrg002V4ScenarioWave3,
} from "./exam-readiness-v4-scenario-wave3";
import {
  generateTrg002V4ScenarioWave4Question,
  isTrg002V4ScenarioWave4,
} from "./exam-readiness-v4-scenario-wave4";

function englishRiverQl093(seed: string) {
  const q: any = generateLocalizedTrg002V4RiverQl093(seed, "hi-IN");
  const observer = q.canonicalSpatialState.observers[0];
  if (!observer) throw new Error("TRG-002-QL-093 V4 English authority: canonical observer missing.");
  const height = formatExactPlain(observer.eyeHeight);
  const width = q.exactAnswer.kind === "NUMBER" ? formatExactPlain(q.exactAnswer.value) : q.answer.replace(/ m$/, "");
  return {
    ...q,
    language: "en" as const,
    stem: `An observation platform on one bank of a river is ${height} m high. From its top, the point directly opposite on the other bank is seen at an angle of depression of 60°. Find the exact width of the river.`,
    explanation: {
      keyRule: "The platform height is the vertical drop and the river width is the horizontal side of the depression triangle.",
      steps: [
        { title: "Given", body: `The platform height is ${height} m. Let the river width be w m.` },
        { title: "Calculation", body: `tan60° = ${height}/w = √3, so w = ${height}/√3 = ${width} m.` },
      ],
      shortcut: "At 60°, river width = vertical platform height/√3.",
      traps: ["The river width is the perpendicular horizontal distance between the banks, not the sloping line of sight."],
    },
  };
}

function englishBridgeQl021(question: any) {
  const observer = question.canonicalSpatialState.observers[0];
  if (!observer) throw new Error("TRG-002-QL-021 V4 English authority: canonical observer missing.");
  const height = formatExactPlain(observer.eyeHeight);
  return {
    ...question,
    language: "en" as const,
    stem: `From the edge of a ${height} m high pedestrian overbridge above a level road, a point on the road is seen at an angle of depression of 45°. Find the horizontal distance from the point directly below the bridge edge to that road point.`,
    explanation: {
      keyRule: "The bridge height is the vertical drop. At a 45° angle of depression, the vertical drop and horizontal run are equal.",
      steps: [
        { title: "Given", body: `Bridge height = ${height} m and angle of depression = 45°.` },
        { title: "Calculation", body: `Let the horizontal distance be d. tan45° = ${height}/d = 1, so d = ${height} m.` },
      ],
      shortcut: "At 45°, the vertical and horizontal legs of the right triangle are equal.",
      traps: ["Do not use the sloping line of sight as the required horizontal road distance."],
    },
  };
}

export function generateTrg002V4EnglishAuthorityQuestion(qlId: string, seed: string) {
  const raw: any = isTrg002V4ScenarioWave4(qlId)
    ? generateTrg002V4ScenarioWave4Question(qlId, seed, "en")
    : isTrg002V4ScenarioWave3(qlId)
      ? generateTrg002V4ScenarioWave3Question(qlId, seed, "en")
      : isTrg002V4NaturalMeasurementOverride(qlId)
        ? generateTrg002V4NaturalMeasurementQuestion(qlId, seed, "en")
        : isTrg002V4RiverMathOverride(qlId)
          ? englishRiverQl093(seed)
          : generateTrg002V4CanonicalQuestion(qlId, seed);

  const physical = applyTrg002V4PhysicalSupportMigration(raw);
  const river = applyTrg002V4RiverPlatformMigration(physical.question);
  return qlId === "TRG-002-QL-021" ? englishBridgeQl021(river.question) : river.question;
}
