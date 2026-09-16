import type { EnglishDifficulty, SvaRuleId } from "../../../../core/types";
import { generateEng002Cp001QuestionV1, type Eng002Cp001QuestionV1 } from "./eng-002-cp001-v1";

export interface Eng002Cp001ReviewItemV1 {
  difficulty: EnglishDifficulty;
  question: Eng002Cp001QuestionV1;
}

const REVIEW_RULE_ORDER: Record<EnglishDifficulty, readonly SvaRuleId[]> = {
  easy: ["GR-SVA-001", "GR-SVA-002", "GR-SVA-003"],
  medium: ["GR-SVA-002", "GR-SVA-003", "GR-SVA-004", "GR-SVA-005", "GR-SVA-006", "GR-SVA-007", "GR-SVA-008", "GR-SVA-009", "GR-SVA-010"],
  hard: ["GR-SVA-004", "GR-SVA-005", "GR-SVA-006", "GR-SVA-007", "GR-SVA-008", "GR-SVA-009", "GR-SVA-010"],
};

function buildDifficultySlice(difficulty: EnglishDifficulty, count = 20): Eng002Cp001ReviewItemV1[] {
  const rules = REVIEW_RULE_ORDER[difficulty];
  const items: Eng002Cp001ReviewItemV1[] = [];
  const seenSentences = new Set<string>();
  const domainCounts = new Map<string, number>();

  for (let attempt = 0; items.length < count && attempt < 5_000; attempt += 1) {
    const ruleId = rules[attempt % rules.length]!;
    const noImprovement = items.length % 4 === 3;
    const question = generateEng002Cp001QuestionV1({
      difficulty,
      ruleId,
      noImprovement,
      seed: `eng002-cp001-review-v1:${difficulty}:${attempt}`,
    });
    if (seenSentences.has(question.sentence)) continue;

    const currentDomainCount = domainCounts.get(question.metadata.semanticDomain) ?? 0;
    const unusedDomainExists = domainCounts.size < 20;
    if (unusedDomainExists && currentDomainCount > 0 && attempt < 2_000) continue;

    seenSentences.add(question.sentence);
    domainCounts.set(question.metadata.semanticDomain, currentDomainCount + 1);
    items.push({ difficulty, question });
  }

  if (items.length !== count) {
    throw new Error(`ENG-002 CP001 review export produced ${items.length}/${count} ${difficulty} questions`);
  }
  return items;
}

export function buildEng002Cp001ReviewV1(): Eng002Cp001ReviewItemV1[] {
  return (["easy", "medium", "hard"] as const).flatMap((difficulty) => buildDifficultySlice(difficulty, 20));
}

function renderSentence(question: Eng002Cp001QuestionV1): string {
  return question.segments
    .map((segment, index) => index === question.targetIndex ? `<u>${segment}</u>` : segment)
    .join(" ")
    .replace(/\s+([,.!?;:])/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function renderEng002Cp001ReviewMarkdownV1(): string {
  const lines: string[] = [
    "# ENG-002-CP001 — Sentence Improvement: Subject–Verb Agreement — Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__HUMAN_REVIEW_PENDING__NOT_QUESTION_STUDIO_REGISTERED`",
    "",
    "Format: one underlined target, three replacement choices, plus `No improvement`. The grammar source is the validated ENG-001 SVA layer; ENG-002 owns only the sentence-improvement transformation and distractor surface.",
    "",
    "Review focus: exam-like wording, unique best replacement, plausible distractors, useful explanations, Easy/Medium/Hard separation, and natural no-improvement cases.",
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
