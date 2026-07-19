export interface RapExplanationLike {
  explanationId: string;
  lines: string[];
}

export interface NaturalizeRapExplanationOptions {
  minimumLines?: number;
}

const DROP_META_LINE = /^(?:why(?: this method works| it applies)?|intermediate interpretation|quick check|check)\s*:/i;
const STRUCTURAL_PREFIX = /^(?:concept|problem|method(?:\s+\d+)?|extraction|step\s+\d+)\s*:\s*/i;
const SUPPORT_PREFIX = /^(?:why(?: this method works| it applies)?|quick check|check)\s*:\s*/i;
const INTERMEDIATE_PREFIX = /^intermediate interpretation\s*:\s*/i;
const GENERIC_NARRATION = /^(?:evaluate the relation with the stated values|reduce the result in the form requested|use the common term or total to fix one ratio unit|the recovered shares add back to the total)\.?$/i;

interface SupportCandidate {
  line: string;
  priority: number;
}

function cleanAnswer(value: string | number) {
  return String(value).replaceAll("$$", "").trim();
}

function cleanMathLabels(line: string) {
  return line
    .replace(/\\text\{Decisive equation\}=/g, "")
    .replace(/\\text\{Calculation\}=/g, "")
    .replace(/\\text\{Answer\}=/g, "");
}

function sentenceCase(value: string) {
  return value.replace(/^([a-z])/, (letter) => letter.toUpperCase());
}

function mathSignature(line: string) {
  const blocks = line.match(/\$\$[\s\S]*?\$\$/g);
  if (!blocks?.length) return "";
  return blocks
    .join("|")
    .replace(/\$\$/g, "")
    .replace(/\\Rightarrow/g, "")
    .replace(/^\\text\{[^}]+\}=/, "")
    .replace(/\\text\{(?:Decisive equation|Calculation|Answer)\}=/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function normalizeText(line: string) {
  return line.replace(/\s+/g, " ").trim().toLowerCase();
}

function supportCandidate(original: string): SupportCandidate | undefined {
  const line = original.trim();
  if (/^why(?: this method works| it applies)?\s*:/i.test(line)) {
    return { line: sentenceCase(line.replace(SUPPORT_PREFIX, "").trim()), priority: 1 };
  }
  if (/^(?:quick check|check)\s*:/i.test(line)) {
    return { line: sentenceCase(line.replace(SUPPORT_PREFIX, "").trim()), priority: 2 };
  }
  if (INTERMEDIATE_PREFIX.test(line)) {
    return {
      line: sentenceCase(line.replace(INTERMEDIATE_PREFIX, "Using these values, ").trim()),
      priority: 3,
    };
  }
  return undefined;
}

function simplifyLine(original: string, answer: string) {
  let line = original.trim();
  if (!line || DROP_META_LINE.test(line)) return "";

  if (/^\$\$\\text\{Answer\}=/.test(line)) {
    return `So, the answer is ${answer}.`;
  }

  if (/^Final answer\s*:/i.test(line)) {
    const remainder = line.replace(/^Final answer\s*:\s*/i, "").trim();
    return `So, ${remainder.replace(/^the\s+/i, "the ")}`;
  }

  if (/^Answer\s*:/i.test(line)) {
    const remainder = line.replace(/^Answer\s*:\s*/i, "").trim();
    return remainder ? `So, ${remainder}` : `So, the answer is ${answer}.`;
  }

  line = cleanMathLabels(line)
    .replace(/^Therefore,\s*/i, "So, ")
    .replace(/^Hence,\s*/i, "So, ");

  const conceptMatch = line.match(/^Concept:\s*this question uses\s+([^\n]+?)(?:\.\s*)?(\n\n|$)/i);
  if (conceptMatch) {
    const method = conceptMatch[1]!.replace(/\.$/, "");
    line = line.replace(conceptMatch[0], `Use the given values to ${method}.${conceptMatch[2] ?? ""}`);
  } else {
    line = line.replace(STRUCTURAL_PREFIX, "");
  }

  const mathStart = line.search(/\n\n(?=\$\$)/);
  const prose = (mathStart >= 0 ? line.slice(0, mathStart) : line).trim();
  if (GENERIC_NARRATION.test(prose)) {
    return mathStart >= 0 ? line.slice(mathStart).trim() : "";
  }

  return sentenceCase(line.trim());
}

/**
 * Removes audit-style headings and repeated boilerplate after the package-specific
 * renderer has produced the mathematically complete explanation. Hindi and Punjabi
 * output is intentionally left untouched until human localization is undertaken.
 */
export function naturalizeEnglishRapExplanation<T extends RapExplanationLike>(
  explanation: T,
  language: string,
  answerValue: string | number,
  options: NaturalizeRapExplanationOptions = {},
): T {
  if (language !== "en") return explanation;

  const answer = cleanAnswer(answerValue);
  const lines: string[] = [];
  const support: SupportCandidate[] = [];
  const seenMath = new Set<string>();
  const seenText = new Set<string>();
  let hasFinalAnswer = false;

  for (const original of explanation.lines) {
    const candidate = supportCandidate(original);
    if (candidate) support.push(candidate);

    const line = simplifyLine(original, answer);
    if (!line) continue;

    const isFinal = /^So,\s/i.test(line);
    const signature = mathSignature(line);
    if (signature && !isFinal) {
      if (seenMath.has(signature)) {
        support.push({ line, priority: 4 });
        continue;
      }
      seenMath.add(signature);
    }

    const textKey = normalizeText(line);
    if (seenText.has(textKey)) continue;
    seenText.add(textKey);

    if (isFinal) hasFinalAnswer = true;
    lines.push(line);
  }

  if (!hasFinalAnswer) {
    lines.push(`So, the answer is ${answer}.`);
  }

  const minimumLines = options.minimumLines ?? 0;
  support.sort((left, right) => left.priority - right.priority);
  while (lines.length < minimumLines && support.length > 0) {
    const candidate = support.shift()!;
    const textKey = normalizeText(candidate.line);
    if (!candidate.line || seenText.has(textKey)) continue;
    const conclusionIndex = lines.findIndex((line) => /^So,\s/i.test(line));
    const insertionIndex = candidate.priority === 1
      ? Math.min(1, lines.length)
      : conclusionIndex >= 0
        ? conclusionIndex
        : lines.length;
    lines.splice(insertionIndex, 0, candidate.line);
    seenText.add(textKey);
  }

  return { ...explanation, lines };
}
