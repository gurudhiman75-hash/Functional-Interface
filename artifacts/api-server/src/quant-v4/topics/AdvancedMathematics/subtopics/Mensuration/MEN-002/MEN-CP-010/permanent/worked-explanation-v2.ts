import type { MenCp010PermanentEnglishQuestion } from "./runtime-v1";
import { buildMenCp010WorkedExplanation } from "./worked-explanation-v1";

function cleanNumber(value: number) {
  return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, "");
}

function replaceWorkedStep(
  explanation: MenCp010PermanentEnglishQuestion["explanation"],
  body: string,
): MenCp010PermanentEnglishQuestion["explanation"] {
  return {
    ...explanation,
    steps: explanation.steps.map((step) =>
      step.title === "Substitute and calculate" ? { ...step, body } : step,
    ),
  };
}

export function buildMenCp010WorkedExplanationV2(
  q: MenCp010PermanentEnglishQuestion,
  stem: string,
  answer: string,
): MenCp010PermanentEnglishQuestion["explanation"] {
  let explanation = buildMenCp010WorkedExplanation(q, stem, answer);
  const worked = explanation.steps.find((step) => step.title === "Substitute and calculate")?.body ?? "";

  if (
    q.sourceId === "MEN-CP010-PROT-CONICAL-FRUSTUM-VOLUME" ||
    q.sourceId === "MEN-CP010-PROT-CONICAL-FRUSTUM-CSA" ||
    q.sourceId === "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA"
  ) {
    const pi = /Take π = ([0-9]+(?:\/[0-9]+)?|[0-9]+\.[0-9]+)/.exec(stem)?.[1];
    if (pi) explanation = replaceWorkedStep(explanation, worked.replace("π", pi));
  }

  if (q.sourceId === "CP010-D2-APP-SURFACE-COST") {
    const match = /base side (\d+) m and slant height (\d+) m are covered at ₹(\d+) per m²/.exec(stem);
    if (match) {
      explanation = replaceWorkedStep(
        explanation,
        `Lateral area = 2 × ${match[1]} × ${match[2]} m². Cost = (2 × ${match[1]} × ${match[2]}) × ₹${match[3]} = ${answer}.`,
      );
    }
  }

  if (
    q.sourceId === "CP010-D2-SCALE-VOLUME-PERCENT-CHANGE" ||
    q.sourceId === "CP010-D2-SCALE-AREA-PERCENT-CHANGE"
  ) {
    const pct = /becomes (\d+)%/.exec(stem)?.[1];
    if (pct) {
      const k = Number(pct) / 100;
      const power = q.sourceId.includes("VOLUME") ? 3 : 2;
      const factor = k ** power;
      const magnitude = Math.abs((factor - 1) * 100);
      const direction = factor >= 1 ? "increase" : "decrease";
      explanation = replaceWorkedStep(
        explanation,
        `Scale factor k = ${pct}/100 = ${cleanNumber(k)}. ${power === 3 ? "Volume" : "Surface area"} factor = ${cleanNumber(k)}^${power} = ${cleanNumber(factor)}. Hence the percentage ${direction} is ${cleanNumber(magnitude)}%, so the answer is ${answer}.`,
      );
    }
  }

  if (
    q.sourceId === "CP010-D2-RATIO-VOLUME-FROM-LINEAR" ||
    q.sourceId === "CP010-D2-RATIO-AREA-FROM-LINEAR"
  ) {
    const ratio = /linear ratio (\d+):(\d+)/.exec(stem);
    if (ratio) {
      const power = q.sourceId.includes("VOLUME") ? 3 : 2;
      explanation = replaceWorkedStep(
        explanation,
        `Raise both terms of the linear ratio to power ${power}: ${ratio[1]}^${power}:${ratio[2]}^${power} = ${answer} after reduction.`,
      );
    }
  }

  return explanation;
}
