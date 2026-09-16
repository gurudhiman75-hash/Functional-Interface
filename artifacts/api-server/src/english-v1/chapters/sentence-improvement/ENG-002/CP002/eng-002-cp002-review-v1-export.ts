import type { EnglishDifficulty } from "../../../../core/types";
import { rulesForDifficultyCp002V1 } from "../../../error-spotting/ENG-001/CP002/cp002-patterns-v1";
import { generateEng002Cp002QuestionV1, type Eng002Cp002QuestionV1 } from "./eng-002-cp002-v1";

export interface Eng002Cp002ReviewItemV1 {
  difficulty: EnglishDifficulty;
  question: Eng002Cp002QuestionV1;
}

function buildDifficultySlice(difficulty: EnglishDifficulty, count = 20): Eng002Cp002ReviewItemV1[] {
  const rules = rulesForDifficultyCp002V1(difficulty);
  const items: Eng002Cp002ReviewItemV1[] = [];
  const seenSentences = new Set<string>();
  const domainCounts = new Map<string, number>();

  for (let attempt = 0; items.length < count && attempt < 8_000; attempt += 1) {
    const ruleId = rules[attempt % rules.length]!;
    const noImprovement = items.length % 4 === 3;
    const question = generateEng002Cp002QuestionV1({
      difficulty,
      ruleId,
      noImprovement,
      seed: `eng002-cp002-review-v1:${difficulty}:${attempt}`,
    });
    if (seenSentences.has(question.sentence)) continue;

    const currentDomainCount = domainCounts.get(question.metadata.semanticDomain) ?? 0;
    const unusedDomainExists = domainCounts.size < 20;
    if (unusedDomainExists && currentDomainCount > 0 && attempt < 4_000) continue;

    seenSentences.add(question.sentence);
    domainCounts.set(question.metadata.semanticDomain, currentDomainCount + 1);
    items.push({ difficulty, question });
  }

  if (items.length !== count) {
    throw new Error(`ENG-002 CP002 review export produced ${items.length}/${count} ${difficulty} questions`);
  }
  if (domainCounts.size !== 20) {
    throw new Error(`ENG-002 CP002 review export reached only ${domainCounts.size}/20 ${difficulty} semantic domains`);
  }
  return items;
}

export function buildEng002Cp002ReviewV1(): Eng002Cp002ReviewItemV1[] {
  return (["easy", "medium", "hard"] as const).flatMap((difficulty) => buildDifficultySlice(difficulty, 20));
}

function renderSentence(question: Eng002Cp002QuestionV1): string {
  return question.segments
    .map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment)
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderEng002Cp002ReviewMarkdownV1(): string {
  const lines: string[] = [
    "# ENG-002-CP002 — Sentence Improvement: Tenses and Sequence of Tenses — Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "Format: one intact sentence with one underlined tense target, three replacement choices, plus `No improvement` as option D.",
    "",
    "Review focus: exam-grade sentence surface, unique tense answer, natural distractors, very easy concept teaching, Easy/Medium/Hard separation, and natural No-improvement cases.",
    "",
  ];

  let globalIndex = 0;
  for (const difficulty of ["easy", "medium", "hard"] as const) {
    lines.push(`## ${difficulty[0]!.toUpperCase()}${difficulty.slice(1)}`, "");
    const items = buildDifficultySlice(difficulty, 20);
    for (const { question } of items) {
      globalIndex += 1;
      lines.push(
        `### ${globalIndex}. ${question.metadata.ruleId} · ${question.metadata.semanticDomain}${question.metadata.noImprovement ? " · No improvement" : ""}`,
        "",
        question.stem,
        "",
        renderSentence(question),
        "",
        ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
        "",
        `**Answer:** ${String.fromCharCode(65 + question.correctOptionIndex)}`,
        "",
        `**Explanation:** ${question.explanation}`,
        "",
        `Seed: \`${question.metadata.seed}\``,
        "",
      );
    }
  }
  return `${lines.join("\n")}\n`;
}
