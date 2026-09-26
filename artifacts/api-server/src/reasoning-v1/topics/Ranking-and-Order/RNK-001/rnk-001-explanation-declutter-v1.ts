export const RNK_001_EXPLANATION_DECLUTTER_VERSION =
  "RNK_001_EXPLANATION_DECLUTTER_V1" as const;

export type RnkExplanationLocale = "en-IN" | "hi-IN" | "pa-IN" | string;

export interface RnkExplanationDeclutterInput {
  readonly explanation: unknown;
  readonly qlId: string;
  readonly locale?: RnkExplanationLocale;
  readonly answer?: string;
}

const SIMPLE_PRESENTATION_MAX_QL = 35;

function qlNumber(qlId: string): number {
  const match = /^RNK-QL-(\d{3})$/u.exec(qlId);
  return match ? Number(match[1]) : 0;
}

function cleanWhitespace(value: string): string {
  return value.replace(/\s+/gu, " ").trim();
}

function stripPresentationPrefix(value: string): string {
  return cleanWhitespace(value)
    .replace(/^(?:given facts?|given|now apply the relevant rule|apply the relevant rule|using the rule)\s*[:：]\s*/iu, "")
    .replace(/^(?:दिए गए तथ्य|दिया गया|अब संबंधित नियम लगाएँ|संबंधित नियम लगाएँ)\s*[:：]\s*/u, "")
    .replace(/^(?:ਦਿੱਤੇ ਤੱਥ|ਦਿੱਤਾ ਗਿਆ|ਹੁਣ ਸੰਬੰਧਿਤ ਨਿਯਮ ਲਗਾਓ|ਸੰਬੰਧਿਤ ਨਿਯਮ ਲਗਾਓ)\s*[:：]\s*/u, "");
}

function normalizedForComparison(value: string): string {
  return cleanWhitespace(value)
    .toLocaleLowerCase("en")
    .replace(/[\s.,;:!?।'"`()\[\]{}*_\-–—]+/gu, "")
    .replace(/−/gu, "-");
}

function isTrivialConclusion(value: string, answer?: string): boolean {
  const text = cleanWhitespace(value);
  const conclusionLead = /^(?:therefore|hence|thus|so(?:\s+the)?|the required answer is|the answer is|इसलिए|अतः|इस प्रकार|इससे सही उत्तर|ਇਸ ਲਈ|ਇਸ ਕਰਕੇ|ਅਤੇ ਇਸ ਲਈ|ਸਹੀ ਉੱਤਰ)(?:\s|[:：]|$)/iu;
  if (!conclusionLead.test(text)) return false;

  const compact = normalizedForComparison(text);
  if (answer && compact.includes(normalizedForComparison(answer))) return true;

  return /(?:correct answer|required answer|correct option|सही उत्तर|आवश्यक उत्तर|सही विकल्प|ਲੋੜੀਂਦਾ ਉੱਤਰ|ਸਹੀ ਉੱਤਰ|ਸਹੀ ਵਿਕਲਪ)/iu.test(text)
    && text.length < 180;
}

function uniqueLines(values: readonly string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];
  for (const raw of values) {
    const value = stripPresentationPrefix(raw);
    if (!value) continue;
    const key = normalizedForComparison(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(value);
  }
  return output;
}

function arrayOfStrings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

function compactStringExplanation(value: string, answer?: string): string {
  const lines = value
    .split(/\n+/u)
    .map(stripPresentationPrefix)
    .filter(Boolean)
    .filter((line) => !isTrivialConclusion(line, answer));
  return uniqueLines(lines).join("\n").trim() || cleanWhitespace(value);
}

function isConclusionEquivalent(value: string, conclusion: string): boolean {
  if (!conclusion) return false;
  const line = normalizedForComparison(value);
  const finalLine = normalizedForComparison(conclusion)
    .replace(/^(?:therefore|hence|thus|so)/u, "");
  if (!line || !finalLine) return false;
  return line === finalLine || line === normalizedForComparison(conclusion);
}

function objectExplanation(
  record: Record<string, unknown>,
  qlId: string,
  answer?: string,
): string {
  const number = qlNumber(qlId);
  const simplePresentation = number > 0 && number <= SIMPLE_PRESENTATION_MAX_QL;

  const mentalPicture = typeof record.mentalPicture === "string"
    ? stripPresentationPrefix(record.mentalPicture)
    : "";
  const keyRule = typeof record.keyRule === "string"
    ? stripPresentationPrefix(record.keyRule)
    : "";
  const conclusion = typeof record.conclusion === "string"
    ? stripPresentationPrefix(record.conclusion)
    : "";
  const steps = [
    ...arrayOfStrings(record.steps),
    ...arrayOfStrings(record.stepByStepSolution),
  ]
    .map(stripPresentationPrefix)
    .filter(Boolean)
    .filter((line) => !isTrivialConclusion(line, answer))
    .filter((line) => !isConclusionEquivalent(line, conclusion));

  const shortcut = typeof record.examSpeedShortcut === "string"
    ? stripPresentationPrefix(record.examSpeedShortcut)
    : "";
  const optionAnalysis = arrayOfStrings(record.optionAnalysis)
    .map(stripPresentationPrefix)
    .filter(Boolean)
    .filter((line) => !isTrivialConclusion(line, answer));

  const core: string[] = [];
  if (mentalPicture && !simplePresentation) core.push(mentalPicture);
  if (keyRule && !isConclusionEquivalent(keyRule, conclusion)) core.push(keyRule);
  core.push(...steps);

  if (simplePresentation) {
    // Basic ranking questions already show the answer separately. Their old learner
    // surface repeated the same calculation in shortcut, option analysis and conclusion.
    // Keep the rule and actual working, but drop any step that is merely the source
    // conclusion repeated without a "Therefore" prefix.
    return uniqueLines(core).join("\n").trim();
  }

  // Advanced uncertainty/equality questions often carry witness orders or decisive
  // relation chains. Preserve those. Only use shortcut/option analysis as fallback
  // evidence when the main proof is otherwise too thin.
  const coreUnique = uniqueLines(core);
  if (coreUnique.length < 2 && shortcut) coreUnique.push(shortcut);
  if (coreUnique.length < 2) {
    for (const line of uniqueLines(optionAnalysis)) {
      coreUnique.push(line);
      if (coreUnique.length >= 3) break;
    }
  }
  return uniqueLines(coreUnique).join("\n").trim();
}

export function declutterRnkExplanation(input: RnkExplanationDeclutterInput): string {
  const { explanation, qlId, answer } = input;
  if (typeof explanation === "string") {
    return compactStringExplanation(explanation, answer);
  }
  if (!explanation || typeof explanation !== "object") {
    return cleanWhitespace(String(explanation ?? ""));
  }

  const rendered = objectExplanation(explanation as Record<string, unknown>, qlId, answer);
  if (rendered) return rendered;

  return cleanWhitespace(JSON.stringify(explanation));
}
