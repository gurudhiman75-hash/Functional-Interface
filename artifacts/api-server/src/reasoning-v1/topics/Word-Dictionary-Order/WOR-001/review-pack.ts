import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { WOR_001_PROTOTYPES } from "./prototype-registry";
import { generateWor001Question } from "./runtime";
import type { GeneratedWorQuestion, WorDifficulty, WorLocale } from "./foundation/types";

const reviewDifficulties: readonly WorDifficulty[] = ["EASY", "EASY", "EASY", "MEDIUM", "MEDIUM", "MEDIUM", "MEDIUM", "HARD"];

export function buildWorReviewPack(locale: WorLocale): GeneratedWorQuestion[] {
  return WOR_001_PROTOTYPES.flatMap((prototype, prototypeIndex) =>
    (prototype.hardOnly ? reviewDifficulties.slice(0, 4) : reviewDifficulties).map((difficulty, sampleIndex) =>
      generateWor001Question(prototype.prototypeId, prototypeIndex * 1000 + sampleIndex * 37 + 11, locale, difficulty),
    ),
  );
}

interface ReviewLabels {
  readonly title: string;
  readonly intro: string;
  readonly questions: string;
  readonly prototypes: string;
  readonly difficulty: string;
  readonly optionStandard: string;
  readonly lifecycle: string;
  readonly words: string;
  readonly insertionWord: string;
  readonly order: string;
  readonly answer: string;
  readonly explanation: string;
}

function labelsFor(locale: WorLocale): ReviewLabels {
  if (locale === "hi-IN") {
    return {
      title: "WOR-001 हिंदी परीक्षा-समीक्षा पैक",
      intro: "यह केवल समीक्षा के लिए नियतात्मक प्रश्न-पैक है। सभी भाषाओं में अंग्रेज़ी A–Z शब्द ही तर्क-टोकन रहते हैं। हर प्रश्न में चार विकल्प और स्वतंत्र रूप से सत्यापित उत्तर है। मानवीय संपादकीय स्वीकृति तक स्थायी QL, सार्वजनिक रिलीज़ और Question Studio दृश्यता बंद हैं।",
      questions: "प्रश्न",
      prototypes: "प्रोटोटाइप",
      difficulty: "कठिनाई",
      optionStandard: "विकल्प मानक",
      lifecycle: "जीवनचक्र",
      words: "शब्द",
      insertionWord: "जोड़ा जाने वाला शब्द",
      order: "क्रम",
      answer: "उत्तर",
      explanation: "व्याख्या",
    };
  }
  if (locale === "pa-IN") {
    return {
      title: "WOR-001 ਪੰਜਾਬੀ ਪ੍ਰੀਖਿਆ-ਸਮੀਖਿਆ ਪੈਕ",
      intro: "ਇਹ ਕੇਵਲ ਸਮੀਖਿਆ ਲਈ ਨਿਰਧਾਰਤ ਪ੍ਰਸ਼ਨ-ਪੈਕ ਹੈ। ਹਰ ਭਾਸ਼ਾ ਵਿੱਚ ਅੰਗਰੇਜ਼ੀ A–Z ਸ਼ਬਦ ਹੀ ਤਰਕ ਟੋਕਨ ਰਹਿੰਦੇ ਹਨ। ਹਰ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਚਾਰ ਵਿਕਲਪ ਅਤੇ ਸੁਤੰਤਰ ਤੌਰ 'ਤੇ ਜਾਂਚਿਆ ਹੋਇਆ ਉੱਤਰ ਹੈ। ਮਨੁੱਖੀ ਸੰਪਾਦਕੀ ਮਨਜ਼ੂਰੀ ਤੱਕ ਸਥਾਈ QL, ਜਨਤਕ ਰਿਲੀਜ਼ ਅਤੇ Question Studio ਦਿੱਖ ਬੰਦ ਹਨ।",
      questions: "ਪ੍ਰਸ਼ਨ",
      prototypes: "ਪ੍ਰੋਟੋਟਾਈਪ",
      difficulty: "ਮੁਸ਼ਕਲ ਪੱਧਰ",
      optionStandard: "ਵਿਕਲਪ ਮਿਆਰ",
      lifecycle: "ਜੀਵਨਚੱਕਰ",
      words: "ਸ਼ਬਦ",
      insertionWord: "ਜੋੜਿਆ ਜਾਣ ਵਾਲਾ ਸ਼ਬਦ",
      order: "ਕ੍ਰਮ",
      answer: "ਉੱਤਰ",
      explanation: "ਵਿਆਖਿਆ",
    };
  }
  return {
    title: "WOR-001 English Exam Review Pack",
    intro: "Review-only deterministic prototypes. English A–Z words are logic tokens in every locale. Every question has four options and an independently verified answer. Permanent QLs, public release and Question Studio visibility remain disabled pending human editorial approval.",
    questions: "Questions",
    prototypes: "Prototypes",
    difficulty: "Difficulty",
    optionStandard: "Option standard",
    lifecycle: "Lifecycle",
    words: "Words",
    insertionWord: "Word to insert",
    order: "Order",
    answer: "Answer",
    explanation: "Explanation",
  };
}

function freezeDecisionFor(question: GeneratedWorQuestion): "ELIGIBLE_AFTER_EDITORIAL" | "DEFER_SOURCE_GAP" | "INSTANCE_VARIANT_NO_QL" {
  if (question.metadata.allocationDecision === "MERGE_AS_INSTANCE_VARIANT") return "INSTANCE_VARIANT_NO_QL";
  if (question.metadata.sourceEvidenceStatus === "EXPLORATORY_SOURCE_GAP") return "DEFER_SOURCE_GAP";
  return "ELIGIBLE_AFTER_EDITORIAL";
}

function promptLines(question: GeneratedWorQuestion, labels: ReviewLabels): string[] {
  if (question.structuredPrompt.partialSequence) return [`**${labels.order}:** ${question.structuredPrompt.partialSequence.join(" → ")}`];
  if (question.structuredPrompt.presentedSequence) return [`**${labels.order}:** ${question.structuredPrompt.presentedSequence.join(" → ")}`];
  const lines = [`**${labels.words}:** ${question.structuredPrompt.words.join(", ")}`];
  if (question.structuredPrompt.insertionWord) lines.push(`**${labels.insertionWord}:** ${question.structuredPrompt.insertionWord}`);
  return lines;
}

export function renderWorReviewMarkdown(locale: WorLocale, questions = buildWorReviewPack(locale)): string {
  const labels = labelsFor(locale);
  const counts = Object.fromEntries(["EASY", "MEDIUM", "HARD"].map((difficulty) => [difficulty, questions.filter((question) => question.difficulty === difficulty).length]));
  const lines = [
    `# ${labels.title}`,
    "",
    labels.intro,
    "",
    `- ${labels.questions}: ${questions.length}`,
    `- ${labels.prototypes}: ${WOR_001_PROTOTYPES.length}`,
    `- ${labels.difficulty}: EASY ${counts.EASY}, MEDIUM ${counts.MEDIUM}, HARD ${counts.HARD}`,
    `- ${labels.optionStandard}: EXAMTREE_FOUR_OPTION`,
    `- ${labels.lifecycle}: REVIEW_ONLY`,
    "",
  ];
  questions.forEach((question, index) => {
    lines.push(`## ${index + 1}. ${question.checkpointId} / ${question.prototypeId}`, "", question.stem, "", ...promptLines(question, labels), "");
    question.options.forEach((option, optionIndex) => lines.push(`${optionIndex + 1}. ${option.value}`));
    lines.push(
      "",
      `**${labels.answer}:** ${question.correctIndex + 1}. ${question.answer}`,
      "",
      `**${labels.explanation}:** ${question.explanation}`,
      "",
      `<details><summary>Internal review metadata</summary>`,
      "",
      `- Difficulty: ${question.difficulty}`,
      `- Family: ${question.metadata.sourceFamilyId}`,
      `- Canonical order: ${question.metadata.canonicalOrder.join(" → ")}`,
      `- Executable taxonomy: ${question.metadata.allocationDecision}`,
      `- Source evidence: ${question.metadata.sourceEvidenceStatus}`,
      `- Freeze decision: ${freezeDecisionFor(question)}`,
      `- Distractors: ${question.options.map((option) => option.misconceptionId ?? "CORRECT").join(", ")}`,
      "",
      "</details>",
      "",
    );
  });
  return `${lines.join("\n").trimEnd()}\n`;
}

export async function exportWorReviewPacks(outputDirectory: string): Promise<void> {
  await mkdir(outputDirectory, { recursive: true });
  for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
    const language = locale === "en-IN" ? "english" : locale === "hi-IN" ? "hindi" : "punjabi";
    const questions = buildWorReviewPack(locale);
    await writeFile(path.join(outputDirectory, `wor-001-${language}-review.json`), `${JSON.stringify(questions, null, 2)}\n`, "utf8");
    await writeFile(path.join(outputDirectory, `wor-001-${language}-review.md`), renderWorReviewMarkdown(locale, questions), "utf8");
  }
}
