import type { MenCp009QuestionV2 } from "./runtime";
import {
  buildMenCp009StudentViewV4,
  type MenCp009StudentViewV4,
} from "./student-view-v4";

function numericPi(question: Extract<MenCp009QuestionV2, { piPolicy: unknown }>) {
  return question.piPolicy === "PI_22_OVER_7"
    ? "22/7"
    : question.piPolicy === "PI_3_14"
      ? "3.14"
      : "π";
}

function givenFromStem(stem: string, label: string) {
  const lower = stem.toLowerCase();
  const start = lower.indexOf(label.toLowerCase());
  if (start < 0) return "the given value";
  const tail = stem.slice(start + label.length).trim();
  const dot = tail.indexOf(".");
  return (dot < 0 ? tail : tail.slice(0, dot)).trim();
}

function ratioDisplay(value: string) {
  const match = value.match(/^(-?\d+)(?:\/(\d+))? times$/);
  if (!match) return value;
  return `${match[1]}:${match[2] ?? "1"}`;
}

function percentDisplay(value: string) {
  const match = value.match(/^(-?\d+)\/(\d+)%$/);
  if (!match) return value;
  const numerator = Number(match[1]);
  const denominator = Number(match[2]);
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator === 0) return value;
  const result = numerator / denominator;
  return `${Number.isInteger(result) ? result.toFixed(0) : result.toFixed(6).replace(/0+$/, "").replace(/\.$/, "")}%`;
}

function normalizeDisplay(familyId: string, value: string) {
  if (
    familyId === "SPHERE_SURFACE_RATIO" ||
    familyId === "SPHERE_VOLUME_RATIO" ||
    familyId === "RADIUS_RATIO_FROM_SURFACE_RATIO" ||
    familyId === "RADIUS_RATIO_FROM_VOLUME_RATIO" ||
    familyId === "SPHERE_HEMISPHERE_MEASURE_RATIO"
  ) {
    return ratioDisplay(value);
  }
  if (
    familyId === "SPHERE_SURFACE_PERCENT_CHANGE" ||
    familyId === "SPHERE_VOLUME_PERCENT_CHANGE"
  ) {
    return percentDisplay(value);
  }
  return value;
}

function finalAnswerLine(familyId: string, answer: string) {
  switch (familyId) {
    case "SPHERE_SURFACE_RATIO":
    case "SPHERE_VOLUME_RATIO":
    case "SPHERE_HEMISPHERE_MEASURE_RATIO":
      return `So the required ratio is ${answer}.`;
    case "RADIUS_RATIO_FROM_SURFACE_RATIO":
    case "RADIUS_RATIO_FROM_VOLUME_RATIO":
      return `Therefore, the ratio of the radii is ${answer}.`;
    case "SPHERE_SURFACE_PERCENT_CHANGE":
      return `So the surface area increases by ${answer}.`;
    case "SPHERE_VOLUME_PERCENT_CHANGE":
      return `So the volume increases by ${answer}.`;
    default:
      return null;
  }
}

function naturalStem(baseStem: string, familyId: string) {
  let stem = baseStem
    .replace(/\s*Calculate and mark the correct option\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (familyId === "SPHERE_HEMISPHERE_MEASURE_RATIO") {
    stem = stem
      .replace(/\. Find sphere volume : hemisphere volume\.$/, ". What is sphere volume : hemisphere volume?")
      .replace(/\. Find sphere surface area : hemisphere total area\.$/, ". What is sphere surface area : hemisphere total area?");
  }
  return stem;
}

export function buildMenCp009StudentViewV4Final(
  question: MenCp009QuestionV2,
): MenCp009StudentViewV4 {
  const base = buildMenCp009StudentViewV4(question);
  const stem = naturalStem(base.stem, base.familyId);
  const options = base.options.map((option) => ({
    ...option,
    display: normalizeDisplay(base.familyId, option.display),
  }));
  const answer = normalizeDisplay(base.familyId, base.answer);
  const lines = [...base.explanationLines];
  const replacementFinal = finalAnswerLine(base.familyId, answer);
  if (replacementFinal) lines[lines.length - 1] = replacementFinal;

  if (!("state" in question)) {
    return { ...base, stem, options, answer, explanationLines: lines };
  }

  const p = numericPi(question);
  const r = question.state.radius;
  const r2 = r * r;
  const r3 = r2 * r;

  switch (question.familyId) {
    case "SPHERE_RADIUS_FROM_SURFACE":
    case "SPHERE_DIAMETER_FROM_SURFACE": {
      const given = givenFromStem(stem, "surface area");
      lines[2] = `Now substitute the actual values: r² = ${given} ÷ (4 × ${p}) = ${r2}.`;
      break;
    }
    case "SPHERE_RADIUS_FROM_VOLUME":
    case "SPHERE_DIAMETER_FROM_VOLUME": {
      const given = givenFromStem(stem, "volume");
      lines[2] = `Now substitute the actual values: r³ = (3 × ${given}) ÷ (4 × ${p}) = ${r3}.`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_CSA": {
      const given = givenFromStem(stem, "curved area");
      lines[2] = `Now substitute the actual values: r² = ${given} ÷ (2 × ${p}) = ${r2}.`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_TSA": {
      const given = givenFromStem(stem, "total area");
      lines[2] = `Now substitute the actual values: r² = ${given} ÷ (3 × ${p}) = ${r2}.`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_VOLUME": {
      const given = givenFromStem(stem, "volume");
      lines[2] = `Now substitute the actual values: r³ = (3 × ${given}) ÷ (2 × ${p}) = ${r3}.`;
      break;
    }
    case "SPHERE_PAINTING_COST": {
      const rate = question.state.rate!;
      lines[3] = `Now include the painting rate: cost = (4 × ${p} × ${r}²) × ${rate} = ${answer}.`;
      break;
    }
    case "HEMISPHERE_INNER_POLISHING_COST": {
      const rate = question.state.rate!;
      lines[3] = `Now include the polishing rate: cost = (2 × ${p} × ${r}²) × ${rate} = ${answer}.`;
      break;
    }
    case "SPHERE_SURFACE_RATIO": {
      const other = question.state.secondRadius!;
      lines[2] = `Surface-area ratio = ${r}²:${other}² = ${r * r}:${other * other}.`;
      lines[3] = `Reduce the ratio to get ${answer}.`;
      break;
    }
    case "SPHERE_VOLUME_RATIO": {
      const other = question.state.secondRadius!;
      lines[2] = `Volume ratio = ${r}³:${other}³ = ${r * r * r}:${other * other * other}.`;
      lines[3] = `Reduce the ratio to get ${answer}.`;
      break;
    }
    case "RADIUS_RATIO_FROM_SURFACE_RATIO": {
      const other = question.state.secondRadius!;
      lines[2] = `√(${r * r}:${other * other}) = ${r}:${other}.`;
      lines[3] = `Therefore, the ratio of the radii is ${answer}.`;
      break;
    }
    case "RADIUS_RATIO_FROM_VOLUME_RATIO": {
      const other = question.state.secondRadius!;
      lines[2] = `∛(${r * r * r}:${other * other * other}) = ${r}:${other}.`;
      lines[3] = `Therefore, the ratio of the radii is ${answer}.`;
      break;
    }
    case "SPHERE_HEMISPHERE_MEASURE_RATIO": {
      lines[2] = /volume/i.test(stem)
        ? "4/3 × πr³ : 2/3 × πr³ = 2:1."
        : "4πr² : 3πr² = 4:3.";
      lines[3] = `So the required ratio is ${answer}.`;
      break;
    }
  }

  return { ...base, stem, options, answer, explanationLines: lines };
}
