export type ExplanationQualitySample = {
  packageId: string;
  questionKey: string;
  stem: string;
  explanation: string;
  answer?: string | number;
  options?: readonly string[];
};

export type ExplanationQualityAssessment = {
  semanticSignature: string;
  structuralSignature: string;
  sharedEvidenceNumbers: readonly string[];
  sharedEvidenceTerms: readonly string[];
  optionalSectionIssues: readonly string[];
};

const COMMON_WORDS = new Set([
  "a",
  "an",
  "and",
  "answer",
  "are",
  "as",
  "at",
  "be",
  "by",
  "calculate",
  "find",
  "for",
  "from",
  "given",
  "hence",
  "if",
  "in",
  "is",
  "it",
  "number",
  "of",
  "on",
  "or",
  "required",
  "so",
  "that",
  "the",
  "then",
  "therefore",
  "this",
  "to",
  "using",
  "value",
  "what",
  "when",
  "which",
  "with",
]);

function normalizeUnicode(text: string) {
  return String(text ?? "")
    .normalize("NFKC")
    .replace(/[–—−]/g, "-")
    .replace(/[×·]/g, "*")
    .replace(/÷/g, "/")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractNumbers(text: string): string[] {
  return normalizeUnicode(text).match(/-?\d+(?:\.\d+)?/g) ?? [];
}

function significantTerms(text: string): string[] {
  return normalizeUnicode(text)
    .toLowerCase()
    .replace(/\\[a-z]+/g, " ")
    .replace(/[^a-z]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 4 && !COMMON_WORDS.has(token));
}

/**
 * Normalises values and superficial MathJax/layout noise while retaining the
 * reasoning words and operators. This intentionally catches explanations that
 * are the same pedagogical wrapper with different numbers.
 */
export function semanticExplanationSignature(text: string): string {
  return normalizeUnicode(text)
    .toLowerCase()
    .replace(/₹|\brs\.?\b|\binr\b/g, "<money>")
    .replace(/\\(?:text|mathrm)\{([^}]*)\}/g, "$1")
    .replace(/\\left|\\right/g, "")
    .replace(/\$+/g, " ")
    .replace(/-?\d+(?:\.\d+)?/g, "<n>")
    .replace(/\b(?:option\s*)?[a-e]\b/g, "<option>")
    .replace(/\s+/g, " ")
    .trim();
}

function classifyBlock(block: string): string {
  const compact = normalizeUnicode(block);
  const lower = compact.toLowerCase();
  if (!compact) return "EMPTY";
  if (/^(shortcut|fast method|exam-speed|quick method)\b/.test(lower)) {
    return "SHORTCUT";
  }
  if (/^(trap|common trap|common mistake|mistake)\b/.test(lower)) {
    return "TRAP";
  }
  if (/^(hence|therefore|so)\b/.test(lower)) return "CONCLUSION";

  const hasMathDelimiter = /\$\$|\\\(|\\\[/.test(block);
  const operatorCount = (compact.match(/[=+*/:%<>-]/g) ?? []).length;
  const numberCount = extractNumbers(compact).length;
  if (hasMathDelimiter || operatorCount >= 2 || (operatorCount >= 1 && numberCount >= 2)) {
    return "WORKING";
  }
  return "PROSE";
}

export function structuralExplanationSignature(text: string): string {
  const raw = String(text ?? "").trim();
  if (!raw) return "EMPTY";
  const blocks = raw
    .split(/\n\s*\n|(?<=\$\$)\s*(?=[A-Z])/g)
    .map((block) => block.trim())
    .filter(Boolean);
  return blocks.map(classifyBlock).join(">");
}

function intersect(left: readonly string[], right: readonly string[]) {
  const rightSet = new Set(right.map((value) => value.toLowerCase()));
  return [...new Set(left.filter((value) => rightSet.has(value.toLowerCase())))];
}

function optionalSectionIssues(explanation: string, options: readonly string[]) {
  const issues: string[] = [];
  const blocks = String(explanation ?? "")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lower = block.toLowerCase();
    const isShortcut = /^(shortcut|fast method|exam-speed|quick method)\b/.test(lower);
    const isTrap = /^(trap|common trap|common mistake|mistake)\b/.test(lower);
    if (!isShortcut && !isTrap) continue;

    const body = block.replace(/^[^:]{1,30}:?\s*/, "").trim();
    if (body.split(/\s+/).filter(Boolean).length < 5) {
      issues.push(`${isShortcut ? "shortcut" : "trap"} section is too thin to justify a separate learner-facing block`);
    }

    if (isTrap && options.length) {
      const normalizedBody = normalizeUnicode(body).toLowerCase();
      const referencesDisplayedOption = options.some((option) => {
        const normalizedOption = normalizeUnicode(option).toLowerCase();
        return normalizedOption.length >= 2 && normalizedBody.includes(normalizedOption);
      });
      const referencesMistakeMechanism = /\b(base|denominator|numerator|sign|rate|ratio|percent|percentage|wrong|instead|assum|forget|ignore|reverse|add|subtract|multiply|divide)\w*\b/.test(normalizedBody);
      if (!referencesDisplayedOption && !referencesMistakeMechanism) {
        issues.push("trap section is generic and is not tied to a displayed option or a concrete mistake mechanism");
      }
    }
  }

  return issues;
}

export function assessExplanationQuality(
  sample: ExplanationQualitySample,
): ExplanationQualityAssessment {
  const stemNumbers = extractNumbers(sample.stem);
  const answerNumbers = extractNumbers(String(sample.answer ?? ""));
  const explanationNumbers = extractNumbers(sample.explanation);
  const sharedEvidenceNumbers = intersect(
    explanationNumbers,
    [...stemNumbers, ...answerNumbers],
  );

  const stemTerms = significantTerms(sample.stem);
  const answerTerms = significantTerms(String(sample.answer ?? ""));
  const explanationTerms = significantTerms(sample.explanation);
  const sharedEvidenceTerms = intersect(
    explanationTerms,
    [...stemTerms, ...answerTerms],
  );

  return {
    semanticSignature: semanticExplanationSignature(sample.explanation),
    structuralSignature: structuralExplanationSignature(sample.explanation),
    sharedEvidenceNumbers,
    sharedEvidenceTerms,
    optionalSectionIssues: optionalSectionIssues(
      sample.explanation,
      sample.options ?? [],
    ),
  };
}

export function hasQuestionSpecificEvidence(
  assessment: ExplanationQualityAssessment,
): boolean {
  return (
    assessment.sharedEvidenceNumbers.length > 0 ||
    assessment.sharedEvidenceTerms.length >= 2
  );
}
