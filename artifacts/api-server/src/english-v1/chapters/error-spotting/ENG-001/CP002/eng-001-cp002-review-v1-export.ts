import type {
  Eng001QlId,
  Eng001Question,
  EnglishDifficulty,
  TenseRuleId,
} from "../../../../core/types";
import { TENSE_SEQUENCE_RULE_BY_ID } from "../../../../grammar/tenses-sequence";
import { CP002_TENSE_DOMAINS_V1, type TenseDomainV1 } from "./cp002-semantic-catalog-v1";
import {
  buildEng001Cp002CandidateV1,
  ENG001_CP002_V1_NO_ERROR_RULE_IDS,
  rulesForDifficultyCp002V1,
  semanticDomainOfCp002V1,
} from "./cp002-patterns-v1";
import { generateEng001Cp002QuestionV1 } from "./eng-001-cp002-v1";

export interface Eng001Cp002ReviewItemV1 {
  difficulty: EnglishDifficulty;
  domain: TenseDomainV1;
  ruleId: TenseRuleId;
  qlId: Eng001QlId;
  question: Eng001Question;
}

const QL_SEQUENCE: readonly Eng001QlId[] = [
  "ENG-001-QL001",
  "ENG-001-QL002",
  "ENG-001-QL007",
] as const;

function qlForSlot(slot: number, ruleId: TenseRuleId): Eng001QlId {
  const proposed = QL_SEQUENCE[slot % QL_SEQUENCE.length]!;
  if (proposed === "ENG-001-QL007" && !ENG001_CP002_V1_NO_ERROR_RULE_IDS.includes(ruleId)) {
    return slot % 2 === 0 ? "ENG-001-QL001" : "ENG-001-QL002";
  }
  return proposed;
}

function selectDifficultyReview(difficulty: EnglishDifficulty): Eng001Cp002ReviewItemV1[] {
  const rules = rulesForDifficultyCp002V1(difficulty);
  const usedDomains = new Set<TenseDomainV1>();
  const items: Eng001Cp002ReviewItemV1[] = [];

  for (let slot = 0; slot < CP002_TENSE_DOMAINS_V1.length; slot += 1) {
    const ruleId = rules[slot % rules.length]!;
    const qlId = qlForSlot(slot, ruleId);
    let selected: Eng001Cp002ReviewItemV1 | null = null;

    for (let nonce = 0; nonce < 10_000; nonce += 1) {
      const seed = `cp002-review-v1:${difficulty}:${slot}:${nonce}`;
      const candidate = buildEng001Cp002CandidateV1({
        ruleId,
        difficulty,
        seed: `${seed}:${ruleId}`,
      });
      const domain = semanticDomainOfCp002V1(candidate);
      if (!domain || usedDomains.has(domain)) continue;
      const question = generateEng001Cp002QuestionV1({
        seed,
        difficulty,
        ruleId,
        qlId,
      });
      selected = { difficulty, domain, ruleId, qlId, question };
      break;
    }

    if (!selected) {
      throw new Error(`Unable to select unique ${difficulty} domain for review slot ${slot + 1}.`);
    }
    usedDomains.add(selected.domain);
    items.push(selected);
  }

  if (usedDomains.size !== CP002_TENSE_DOMAINS_V1.length) {
    throw new Error(`${difficulty} review covers ${usedDomains.size} domains instead of ${CP002_TENSE_DOMAINS_V1.length}.`);
  }
  return items;
}

export function buildEng001Cp002ReviewV1(): Record<EnglishDifficulty, Eng001Cp002ReviewItemV1[]> {
  return {
    easy: selectDifficultyReview("easy"),
    medium: selectDifficultyReview("medium"),
    hard: selectDifficultyReview("hard"),
  };
}

function sentenceLine(question: Eng001Question): string {
  return question.segments
    .map((segment, index) => `${String.fromCharCode(65 + index)}. ${segment}`)
    .join(" / ");
}

function optionsLine(question: Eng001Question): string {
  return question.options
    .map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`)
    .join(" | ");
}

function titleCase(difficulty: EnglishDifficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

export function renderEng001Cp002ReviewV1(): string {
  const review = buildEng001Cp002ReviewV1();
  const lines: string[] = [
    "# ENG-001 CP002 — Tenses and Sequence of Tenses — Review V1",
    "",
    "Status: `REVIEW_CANDIDATE_V1__NOT_QUESTION_STUDIO_REGISTERED__HUMAN_REVIEW_PENDING`",
    "",
    "This frozen review contains 60 deterministic questions: 20 Easy, 20 Medium and 20 Hard. Each difficulty section covers all 20 semantic domains exactly once. Questions remain review-only and are not registered in Question Studio.",
    "",
  ];

  for (const difficulty of ["easy", "medium", "hard"] as const) {
    lines.push(`## ${titleCase(difficulty)} — 20 questions`, "");
    review[difficulty].forEach((item, index) => {
      const q = item.question;
      const answer = q.options[q.correctOptionIndex]!;
      const rule = TENSE_SEQUENCE_RULE_BY_ID[item.ruleId];
      lines.push(
        `### ${titleCase(difficulty).charAt(0)}${String(index + 1).padStart(2, "0")} — ${item.domain}`,
        "",
        `- **QL:** \`${item.qlId}\``,
        `- **Rule:** \`${item.ruleId}\` — ${rule.name.replace(/_/g, " ")}`,
        `- **Instruction:** ${q.stem}`,
        `- **Sentence:** ${sentenceLine(q)}`,
        `- **Options:** ${optionsLine(q)}`,
        `- **Answer:** ${String.fromCharCode(65 + q.correctOptionIndex)} — ${answer}`,
        `- **Explanation:** ${q.explanation}`,
        "",
      );
    });
  }

  return `${lines.join("\n").trim()}\n`;
}
