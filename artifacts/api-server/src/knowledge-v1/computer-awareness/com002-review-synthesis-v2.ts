import { deterministicIndex, deterministicShuffle } from "../deterministic";
import { assertKnowledgeQuestionValid } from "../question-validation";
import type { KnowledgeFact } from "../types";
import { COM002_EDITORIAL_TARGET_FACTS } from "./com002-editorial-review";
import { generateCom002ReviewQuestion } from "./com002-review-synthesis";
import type { Com002ReviewQuestion } from "./com002-review-types";

function textValue(fact: KnowledgeFact): string {
  if (fact.value.kind !== "text") throw new Error(`${fact.factId} must carry a text value`);
  return fact.value.text.en;
}

function factById(factId: string | null) {
  if (!factId) return null;
  return COM002_EDITORIAL_TARGET_FACTS.find((fact) => fact.factId === factId) ?? null;
}

function unique(items: readonly string[]) {
  return [...new Set(items)];
}

function reposition(question: Com002ReviewQuestion, wrongAnswers: string[], seed: string): Com002ReviewQuestion {
  const correctIndex = deterministicIndex(`${seed}:v2-correct-position`, 4);
  const options = [...wrongAnswers];
  options.splice(correctIndex, 0, question.canonicalAnswer);
  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options,
    correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });
  return { ...question, options, correctIndex };
}

function licensePolarity(value: string): "OPEN_SOURCE" | "PROPRIETARY" | "OTHER" {
  if (/open-source/i.test(value)) return "OPEN_SOURCE";
  if (/proprietary/i.test(value)) return "PROPRIETARY";
  return "OTHER";
}

function patchQl002Attribute(question: Com002ReviewQuestion, seed: string): Com002ReviewQuestion {
  if (question.surfaceMode !== "ATTRIBUTE_TO_OS") return question;
  const target = factById(question.targetFactId);
  if (!target) throw new Error(`${question.questionId}: QL-002 target fact is missing`);
  const targetPolarity = licensePolarity(textValue(target));
  const licenseFacts = COM002_EDITORIAL_TARGET_FACTS.filter((fact) => fact.relation === "license_class");
  const oppositeEntities = unique(
    licenseFacts
      .filter((fact) => licensePolarity(textValue(fact)) !== targetPolarity)
      .map((fact) => fact.entity.label.en),
  );
  const fallback = ["Microsoft Excel", "Google Chrome", "Intel processor", "SQL language"];
  const wrongPool = unique([...oppositeEntities, ...fallback]).filter((entry) => entry !== question.canonicalAnswer);
  const wrongAnswers = deterministicShuffle(wrongPool, `${seed}:ql002-v2-wrong`).slice(0, 3);
  return reposition(question, wrongAnswers, `${seed}:ql002-attribute`);
}

function kernelExplanation(fact: KnowledgeFact) {
  if (fact.factId === "com002-kernel-core") return "The kernel is the core component of an operating system.";
  return `The kernel ${textValue(fact)}.`;
}

function describeFileItem(fact: KnowledgeFact) {
  const entity = fact.entity.label.en;
  const value = textValue(fact);
  if (entity === "File Explorer") {
    return value.startsWith("browse") ? `File Explorer is used to ${value}.` : `File Explorer ${value}.`;
  }
  if (entity === "Folder (directory)") return `A folder (directory) is a ${value}.`;
  if (entity === "File path") return `A file path ${value}.`;
  if (entity === "File") return `A file is a ${value}.`;
  return `${entity} is correctly described as: ${value}.`;
}

function describeExtensionConcept(fact: KnowledgeFact) {
  const entity = fact.entity.label.en;
  const value = textValue(fact);
  if (entity === "File extension") return `A file extension is the ${value}.`;
  return `${entity} ${value}.`;
}

export function generateCom002ReviewQuestionV2(input: { qlId: string; seed: string }): Com002ReviewQuestion {
  let question = generateCom002ReviewQuestion(input);
  const target = factById(question.targetFactId);

  if (input.qlId === "COM-002-QL-001" && question.surfaceMode === "FUNCTION_TO_ENTITY") {
    question = {
      ...question,
      stem: question.stem.replace(
        /manages computer hardware and applications by allocating system resources/g,
        "managing computer hardware and applications by allocating system resources",
      ),
    };
  }

  if (input.qlId === "COM-002-QL-002") {
    question = patchQl002Attribute(question, input.seed);
  }

  if (input.qlId === "COM-002-QL-004" && target) {
    if (target.factId === "com002-kernel-core" && question.surfaceMode === "ROLE_TO_COMPONENT") {
      question = { ...question, stem: "Which component forms the core of an operating system?" };
    }
    question = { ...question, explanation: kernelExplanation(target) };
  }

  if (input.qlId === "COM-002-QL-007" && target) {
    if (question.surfaceMode === "FUNCTION_TO_COMPONENT") {
      question = {
        ...question,
        stem: `Which Windows component or settings area best matches this function or task: ${textValue(target)}?`,
      };
    }
    question = { ...question, explanation: `${target.entity.label.en} ${textValue(target)}.` };
  }

  if (input.qlId === "COM-002-QL-008" && target) {
    question = { ...question, explanation: describeFileItem(target) };
  }

  if (input.qlId === "COM-002-QL-009" && target && question.surfaceMode === "EXTENSION_CONCEPT") {
    question = { ...question, explanation: describeExtensionConcept(target) };
  }

  assertKnowledgeQuestionValid({
    stem: question.stem,
    explanation: question.explanation,
    options: question.options,
    correctIndex: question.correctIndex,
    canonicalAnswer: question.canonicalAnswer,
  });
  return { ...question, questionId: `${question.questionId}-V2` };
}
