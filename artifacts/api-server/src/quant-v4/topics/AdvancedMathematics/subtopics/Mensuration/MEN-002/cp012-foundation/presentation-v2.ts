import { formatExactPlain } from "../foundation/exact";
import type { ExactRational } from "../foundation/types";
import { generateMenCp012Question } from "./runtime";
import type { MenCp012AnswerUnit, MenCp012PrototypeId, MenCp012QuestionPackage } from "./types";

export const MEN_CP_012_PRESENTATION_V2_AUTHORITY = "MEN-CP012-FOUNDATION-PRESENTATION-V2" as const;

function naturalRational(value: ExactRational) {
  if (value.denominator === 1n) return `${value.numerator}`;
  const denominator = Number(value.denominator);
  if ([2, 4, 5, 8, 10, 20, 25, 40, 50, 100].includes(denominator)) {
    const decimal = Number(value.numerator) / denominator;
    if (Number.isFinite(decimal)) return `${decimal}`;
  }
  return formatExactPlain(value);
}

function display(value: ExactRational, unit: MenCp012AnswerUnit) {
  return `${naturalRational(value)} ${unit}`;
}

function polishPlateWording(question: MenCp012QuestionPackage) {
  if (question.prototypeId !== "MEN-CP012-PROT-SLAB-TO-THIN-SHEET-LENGTH") return question;
  return {
    ...question,
    stem: question.stem
      .replace("rolled into a sheet", "rolled into a thinner rectangular plate")
      .replace("new sheet length", "new plate length"),
    explanation: {
      ...question.explanation,
      steps: question.explanation.steps.map((step) => ({
        ...step,
        body: step.body.replace(/sheet/gi, "plate"),
      })),
    },
  };
}

function polishWastageTrap(question: MenCp012QuestionPackage) {
  if (question.prototypeId !== "MEN-CP012-PROT-WASTAGE-INVERSE-CYLINDER-HEIGHT") return question;
  return {
    ...question,
    explanation: {
      ...question.explanation,
      traps: [
        "Compute retained material as 100% minus the stated loss before writing the conservation equation.",
        "Apply the retained fraction to the source material; do not apply the loss percentage directly to the target volume.",
      ],
    },
  };
}

export type MenCp012PresentationV2Question = MenCp012QuestionPackage & {
  presentationAuthority: typeof MEN_CP_012_PRESENTATION_V2_AUTHORITY;
};

export function generateMenCp012QuestionV2(
  prototypeId: MenCp012PrototypeId,
  seed: string,
): MenCp012PresentationV2Question {
  const base = generateMenCp012Question(prototypeId, seed);
  let polished = polishPlateWording(base);
  polished = polishWastageTrap(polished);

  const options = polished.options.map((option) => ({
    ...option,
    display: display(option.value, polished.answerUnit),
  }));
  const answer = display(polished.exactAnswer, polished.answerUnit);

  const result: MenCp012PresentationV2Question = {
    ...polished,
    options,
    answer,
    presentationAuthority: MEN_CP_012_PRESENTATION_V2_AUTHORITY,
  };

  if (result.options[result.correctIndex]?.display !== result.answer) {
    throw new Error(`${prototypeId}/${seed}: presentation V2 answer-display parity failed.`);
  }
  if (new Set(result.options.map((option) => option.display)).size !== 4) {
    throw new Error(`${prototypeId}/${seed}: presentation V2 produced duplicate options.`);
  }
  return result;
}
