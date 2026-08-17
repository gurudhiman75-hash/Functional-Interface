import type { MensurationQuestionStudioQuestionV2 } from "../mensuration-question-studio-selection-v2";

export const MENSURATION_SIMPLE_SOLUTION_AUTHORITY =
  "MENSURATION-SIMPLE-HUMAN-SOLUTION-V2" as const;

type SimpleExplanation = {
  steps: string[];
  shortcut: string;
  traps: string[];
};

export type MensurationPromptSummaryV1 = {
  given: string;
  asked: string;
};

const QUERY_START = /\b(?:find|determine|calculate|compute|evaluate|obtain|what\s+is|what\s+are|how\s+many|how\s+much)\b/gi;

function stripInternalIds(value: string) {
  return value.replace(/\s*\[[A-Z0-9_:-]{3,}\]\s*/g, " ").trim();
}

function trimSentence(value: string) {
  return value.replace(/^[\s,;:.-]+/, "").replace(/[\s,;:.-]+$/, "").trim();
}

export function splitMensurationPromptV1(stem: string): MensurationPromptSummaryV1 {
  const text = repairWhitespace(stem);
  const matches = [...text.matchAll(QUERY_START)];
  const last = matches.at(-1);
  if (last && typeof last.index === "number" && last.index > 8) {
    const given = trimSentence(text.slice(0, last.index));
    const asked = trimSentence(text.slice(last.index));
    if (given && asked) return { given, asked };
  }

  const sentenceParts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentenceParts.length >= 2) {
    const finalSentence = sentenceParts.at(-1)!;
    if (/^(?:find|determine|calculate|compute|evaluate|obtain|what|how)\b/i.test(finalSentence)) {
      return {
        given: trimSentence(sentenceParts.slice(0, -1).join(" ")),
        asked: trimSentence(finalSentence),
      };
    }
  }

  return {
    given: trimSentence(text),
    asked: "Find the required value",
  };
}

function repairWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function sectionBetween(text: string, start: RegExp, end: RegExp) {
  const startMatch = start.exec(text);
  if (!startMatch || startMatch.index == null) return "";
  const afterStart = text.slice(startMatch.index + startMatch[0].length);
  const endMatch = end.exec(afterStart);
  return endMatch && endMatch.index != null ? afterStart.slice(0, endMatch.index) : afterStart;
}

function removeMath(value: string) {
  return value
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+?\$/g, " ")
    .replace(/\\\([\s\S]*?\\\)/g, " ")
    .replace(/#{1,6}[^\n]*/g, " ")
    .replace(/\*\*/g, " ");
}

function usefulSentences(value: string) {
  return repairWhitespace(removeMath(value))
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => trimSentence(sentence))
    .filter(Boolean)
    .filter((sentence) => !/^picture\b/i.test(sentence))
    .filter((sentence) => !/^here\b/i.test(sentence))
    .filter((sentence) => !/^unit check\b/i.test(sentence))
    .filter((sentence) => !/^(?:the result|the answer)\b/i.test(sentence));
}

function extractMethod(question: MensurationQuestionStudioQuestionV2) {
  const joined = question.explanation.steps.join("\n");
  const ruleSection = sectionBetween(
    joined,
    /###\s*📌[^\n]*(?:\n|$)/,
    /###\s*📝[^\n]*(?:\n|$)/,
  );
  const candidates = usefulSentences(ruleSection);
  if (candidates.length > 0) return candidates.slice(0, 2).join(" ");

  const stepSection = sectionBetween(
    joined,
    /###\s*📝[^\n]*(?:\n|$)/,
    /###\s*(?:💡|⚠️)[^\n]*(?:\n|$)/,
  );
  const fallback = usefulSentences(stepSection).find((sentence) => sentence.length >= 24);
  return fallback ?? "Use the appropriate mensuration relation, substitute the given values, and simplify.";
}

function normalizeMathBody(value: string) {
  let body = value.trim();
  body = body.replace(/^(?:\\text\{[^}]+\}\s*[:\-–—]?\s*)+/g, "").trim();
  body = body.replace(/^[=:;\-–—\s]+/, "").trim();
  return body;
}

function normalizedKey(value: string) {
  return value
    .replace(/\$+/g, "")
    .replace(/\\\(|\\\)/g, "")
    .replace(/\\text\{[^}]+\}/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function addUnique(target: string[], seen: Set<string>, value: string) {
  const cleaned = stripInternalIds(value).trim();
  if (!cleaned) return;
  const key = normalizedKey(cleaned);
  if (!key || seen.has(key)) return;
  seen.add(key);
  target.push(cleaned);
}

function extractDisplayMath(value: string) {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const match of value.matchAll(/\$\$([\s\S]*?)\$\$/g)) {
    const body = normalizeMathBody(match[1] ?? "");
    if (body) addUnique(result, seen, `$$${body}$$`);
  }
  return result;
}

function extractInlineMath(value: string) {
  const result: string[] = [];
  const seen = new Set<string>();
  const withoutDisplay = value.replace(/\$\$[\s\S]*?\$\$/g, " ");
  for (const match of withoutDisplay.matchAll(/\$([^$\n]+?)\$/g)) {
    const body = normalizeMathBody(match[1] ?? "");
    if (body) addUnique(result, seen, `\\(${body}\\)`);
  }
  for (const match of withoutDisplay.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    const body = normalizeMathBody(match[1] ?? "");
    if (body) addUnique(result, seen, `\\(${body}\\)`);
  }
  return result;
}

function extractWorking(question: MensurationQuestionStudioQuestionV2) {
  const joined = question.explanation.steps.join("\n");
  const ruleSection = sectionBetween(
    joined,
    /###\s*📌[^\n]*(?:\n|$)/,
    /###\s*📝[^\n]*(?:\n|$)/,
  );
  const stepSection = sectionBetween(
    joined,
    /###\s*📝[^\n]*(?:\n|$)/,
    /###\s*(?:💡|⚠️)[^\n]*(?:\n|$)/,
  );

  const ruleMath = extractDisplayMath(ruleSection).slice(0, 2);
  const stepMath = extractDisplayMath(stepSection);
  const seen = new Set<string>();
  const values: string[] = [];
  for (const value of [...ruleMath, ...stepMath]) addUnique(values, seen, value);

  if (values.length < 2) {
    for (const value of extractInlineMath(`${ruleSection}\n${stepSection}`)) addUnique(values, seen, value);
  }

  // Keep the governing relation and the full numerical path, but avoid turning
  // the solution back into a long technical worksheet.
  if (values.length <= 9) return values;
  return [...values.slice(0, 2), ...values.slice(-7)];
}

export function buildMensurationSimpleExplanationV1(
  question: MensurationQuestionStudioQuestionV2,
): SimpleExplanation {
  const prompt = splitMensurationPromptV1(question.stem);
  const method = extractMethod(question);
  const working = extractWorking(question);
  const answer = stripInternalIds(question.options[question.correctIndex] ?? question.answer ?? "");

  return {
    steps: [
      `Given: ${prompt.given}`,
      `Asked: ${prompt.asked}`,
      `Method: ${method}`,
      ...working,
      `Answer: ${answer}`,
    ],
    shortcut: "",
    traps: [],
  };
}
