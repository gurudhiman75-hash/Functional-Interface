import { generateEng002Cp011QuestionV1, type Eng002Cp011QuestionV1, type GenerateEng002Cp011V1Input } from "./eng-002-cp011-v1";

const PARTICIPLE_BY_BASE: Readonly<Record<string, string>> = Object.freeze({
  qualify: "qualified",
  lead: "led",
  handle: "handled",
  back: "backed",
  complete: "completed",
  identify: "identified",
});

function remediateOption(ruleId: Eng002Cp011QuestionV1["metadata"]["ruleId"], option: string) {
  let value = option;

  if (ruleId === "GR-CND-006") {
    value = value.replace(/\bhad\s+(qualify|lead|handle|back|complete|identify)\b/gi, (_match, base: string) => `had ${PARTICIPLE_BY_BASE[base.toLowerCase()] ?? base}`);
    value = value.replace(/\bwould have\s+(qualify|lead|handle|back|complete|identify)\b/gi, (_match, base: string) => `would have ${PARTICIPLE_BY_BASE[base.toLowerCase()] ?? base}`);
  }

  if (ruleId === "GR-CND-007") {
    value = value.replace(/\bwould\s+(completed|identified|handled|backed)\b/gi, (_match, participle: string) => `had ${participle.toLowerCase()}`);
  }

  if (ruleId === "GR-CND-009") {
    value = value.replace(/^(If|if)\s+(.+?)\s+been\s+([A-Za-z]+)(.*)$/i, (_match, ifWord: string, subject: string, participle: string, rest: string) => `${ifWord} ${subject} was ${participle}${rest}`);
  }

  return value.replace(/\s+/g, " ").trim();
}

export function generateEng002Cp011ReviewedQuestionV1(input: GenerateEng002Cp011V1Input): Eng002Cp011QuestionV1 {
  const question = generateEng002Cp011QuestionV1(input);
  const options = question.options.map((option, index) => index === 3 ? option : remediateOption(question.metadata.ruleId, option));
  if (new Set(options.map((option) => option.toLowerCase())).size !== 4) {
    throw new Error(`${question.questionId} produced duplicate options after CP011 editorial remediation`);
  }
  return { ...question, options };
}
