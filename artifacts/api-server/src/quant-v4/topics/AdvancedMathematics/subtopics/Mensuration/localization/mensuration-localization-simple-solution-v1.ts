import type { MensurationQuestionStudioQuestionV2 } from "../mensuration-question-studio-selection-v2";

export const MENSURATION_SIMPLE_SOLUTION_AUTHORITY =
  "MENSURATION-SIMPLE-HUMAN-SOLUTION-V1" as const;

type SimpleExplanation = {
  steps: string[];
  shortcut: string;
  traps: string[];
};

const STRUCTURE_STOP_MARKERS = [
  "### 💡",
  "### ⚠️",
  "Exam Speed Shortcut",
  "Common Traps",
] as const;

function stripInternalIds(value: string) {
  return value.replace(/\s*\[[A-Z0-9_:-]{3,}\]\s*/g, " ").trim();
}

function coreExplanationText(question: MensurationQuestionStudioQuestionV2) {
  const joined = question.explanation.steps.join("\n");
  let stop = joined.length;
  for (const marker of STRUCTURE_STOP_MARKERS) {
    const index = joined.indexOf(marker);
    if (index >= 0) stop = Math.min(stop, index);
  }
  return joined.slice(0, stop);
}

function normalizeMathBody(value: string) {
  let body = value.trim();
  // Drop only leading prose labels. Formula variables and unit \text{...}
  // fragments later in the expression remain untouched.
  body = body.replace(/^(?:\\text\{[^}]+\}\s*[:\-–—]?\s*)+/g, "").trim();
  body = body.replace(/^[=:;\-–—\s]+/, "").trim();
  return body;
}

function normalizedKey(value: string) {
  return value
    .replace(/\$+/g, "")
    .replace(/\\\(|\\\)/g, "")
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

function extractDelimitedMath(core: string) {
  const values: string[] = [];
  const seen = new Set<string>();

  for (const match of core.matchAll(/\$\$([\s\S]*?)\$\$/g)) {
    const body = normalizeMathBody(match[1] ?? "");
    if (body) addUnique(values, seen, `$$${body}$$`);
  }

  const withoutDisplay = core.replace(/\$\$[\s\S]*?\$\$/g, " ");
  for (const match of withoutDisplay.matchAll(/\$([^$\n]+?)\$/g)) {
    const body = normalizeMathBody(match[1] ?? "");
    if (body) addUnique(values, seen, `\\(${body}\\)`);
  }

  const withoutDollarMath = withoutDisplay.replace(/\$[^$\n]+?\$/g, " ");
  for (const match of withoutDollarMath.matchAll(/\\\(([\s\S]*?)\\\)/g)) {
    const body = normalizeMathBody(match[1] ?? "");
    if (body) addUnique(values, seen, `\\(${body}\\)`);
  }

  return values;
}

function cleanPlainCandidate(value: string) {
  let line = stripInternalIds(value)
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+\.\s+\*\*[^*]+\*\*\s*/, "")
    .replace(/^#{1,6}\s+/, "")
    .trim();
  if (!line) return "";

  const dash = Math.max(line.lastIndexOf(" — "), line.lastIndexOf(" – "));
  if (dash >= 0) {
    const right = line.slice(dash + 3).trim();
    if (/[=×÷π√²³%]/.test(right)) line = right;
  }

  line = line
    .replace(/^(?:Substitute(?: the values)?|Calculate|Calculation|Use|Apply|Write|Choose the formula|Putting the values into the formula gives|So|Thus|Hence|Therefore)\s*[:—-]?\s*/i, "")
    .trim();

  return line;
}

function extractPlainMath(core: string) {
  const stripped = core
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+?\$/g, " ")
    .replace(/\\\([\s\S]*?\\\)/g, " ");
  const values: string[] = [];
  const seen = new Set<string>();

  for (const rawLine of stripped.split(/\n+/)) {
    const line = cleanPlainCandidate(rawLine);
    if (!line || /^#{1,6}/.test(line)) continue;

    const sentences = line.split(/(?<=[.!?])\s+/);
    for (const sentence of sentences) {
      const candidate = cleanPlainCandidate(sentence);
      if (!candidate) continue;
      if (!/[=×÷π√²³%]/.test(candidate) && !/\b\d+\s*:\s*\d+\b/.test(candidate)) continue;
      if (/^(?:Unit check|Check the result|Check the logic|Interpret the result|The result is)/i.test(candidate)) continue;
      if (!candidate.includes("=") && /^(?:the|so the|therefore the)\s+/i.test(candidate)) continue;
      addUnique(values, seen, candidate.replace(/\s+/g, " "));
    }
  }

  return values;
}

function chooseCompactWorking(values: string[]) {
  if (values.length <= 8) return values;
  return [...values.slice(0, 4), ...values.slice(-4)];
}

export function buildMensurationSimpleExplanationV1(
  question: MensurationQuestionStudioQuestionV2,
): SimpleExplanation {
  const core = coreExplanationText(question);
  const delimited = extractDelimitedMath(core);
  const plain = extractPlainMath(core);
  const seen = new Set<string>();
  const working: string[] = [];

  const sourceValues = delimited.length >= 3 ? delimited : [...delimited, ...plain];
  for (const value of sourceValues) addUnique(working, seen, value);

  const compact = chooseCompactWorking(working);
  const answer = stripInternalIds(question.options[question.correctIndex] ?? question.answer ?? "");
  const steps = compact.length > 0 ? [...compact, `Answer: ${answer}`] : [`Answer: ${answer}`];

  return {
    steps,
    shortcut: "",
    traps: [],
  };
}
