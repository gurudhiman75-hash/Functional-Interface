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

export function buildMenCp009StudentViewV4Final(
  question: MenCp009QuestionV2,
): MenCp009StudentViewV4 {
  const view = buildMenCp009StudentViewV4(question);
  if (!("state" in question)) return view;

  const p = numericPi(question);
  const r = question.state.radius;
  const r2 = r * r;
  const r3 = r2 * r;
  const lines = [...view.explanationLines];

  switch (question.familyId) {
    case "SPHERE_RADIUS_FROM_SURFACE":
    case "SPHERE_DIAMETER_FROM_SURFACE": {
      const given = givenFromStem(view.stem, "surface area");
      lines[2] = `Now substitute the actual values: r² = ${given} ÷ (4 × ${p}) = ${r2}.`;
      break;
    }
    case "SPHERE_RADIUS_FROM_VOLUME":
    case "SPHERE_DIAMETER_FROM_VOLUME": {
      const given = givenFromStem(view.stem, "volume");
      lines[2] = `Now substitute the actual values: r³ = (3 × ${given}) ÷ (4 × ${p}) = ${r3}.`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_CSA": {
      const given = givenFromStem(view.stem, "curved area");
      lines[2] = `Now substitute the actual values: r² = ${given} ÷ (2 × ${p}) = ${r2}.`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_TSA": {
      const given = givenFromStem(view.stem, "total area");
      lines[2] = `Now substitute the actual values: r² = ${given} ÷ (3 × ${p}) = ${r2}.`;
      break;
    }
    case "HEMISPHERE_RADIUS_FROM_VOLUME": {
      const given = givenFromStem(view.stem, "volume");
      lines[2] = `Now substitute the actual values: r³ = (3 × ${given}) ÷ (2 × ${p}) = ${r3}.`;
      break;
    }
    case "SPHERE_PAINTING_COST": {
      const rate = question.state.rate!;
      lines[3] = `Now include the painting rate: cost = (4 × ${p} × ${r}²) × ${rate} = ${view.answer}.`;
      break;
    }
    case "HEMISPHERE_INNER_POLISHING_COST": {
      const rate = question.state.rate!;
      lines[3] = `Now include the polishing rate: cost = (2 × ${p} × ${r}²) × ${rate} = ${view.answer}.`;
      break;
    }
    case "SPHERE_HEMISPHERE_MEASURE_RATIO": {
      lines[2] = /volume/i.test(view.stem)
        ? "4/3 × πr³ : 2/3 × πr³ = 2:1."
        : "4πr² : 3πr² = 4:3.";
      break;
    }
  }

  return { ...view, explanationLines: lines };
}
