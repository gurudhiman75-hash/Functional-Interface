export type TranslationStatus =
  | "draft"
  | "in_review"
  | "needs_fix"
  | "approved"
  | "rejected"
  | "archived";

export type TranslationIssueSeverity = "error" | "warning";

export type TranslationQualityIssue = {
  code: string;
  severity: TranslationIssueSeverity;
  field: "stem" | "explanation" | "options" | "terminology" | "script" | "metadata";
  message: string;
};

export type TranslationOptionInput = {
  key: string;
  text: string;
  sortOrder: number;
};

export type TranslationDraftInput = {
  stem: string;
  explanation: string;
  options: TranslationOptionInput[];
  reason: string;
};

export type TranslationSource = {
  stem: string;
  explanation: string;
  options: TranslationOptionInput[];
};

export type TranslationTermRule = {
  sourceText: string;
  preferredText: string;
  forbiddenVariants: string[];
};

export type TranslationQualityResult = {
  issues: TranslationQualityIssue[];
  errorCount: number;
  warningCount: number;
  score: number;
  approvable: boolean;
};

export class TranslationOperationsError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 400,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "TranslationOperationsError";
  }
}

const STATUS_SET = new Set<TranslationStatus>([
  "draft",
  "in_review",
  "needs_fix",
  "approved",
  "rejected",
  "archived",
]);

const TRANSITIONS: Record<TranslationStatus, TranslationStatus[]> = {
  draft: ["in_review", "archived"],
  in_review: ["approved", "needs_fix", "rejected", "draft", "archived"],
  needs_fix: ["draft", "in_review", "archived"],
  approved: ["needs_fix", "archived"],
  rejected: ["draft", "in_review", "archived"],
  archived: ["draft"],
};

const MAX_STEM_LENGTH = 20_000;
const MAX_EXPLANATION_LENGTH = 40_000;
const MAX_OPTION_LENGTH = 4_000;
const MAX_REASON_LENGTH = 1_000;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOption(value: unknown, index: number): TranslationOptionInput {
  const record = asRecord(value);
  const key = cleanText(record.key).toUpperCase();
  const text = cleanText(record.text);
  const parsedSortOrder = Number(record.sortOrder);
  return {
    key,
    text,
    sortOrder: Number.isInteger(parsedSortOrder) && parsedSortOrder > 0 ? parsedSortOrder : index + 1,
  };
}

export function normalizeTranslationStatus(value: unknown): TranslationStatus {
  const status = cleanText(value).toLowerCase() as TranslationStatus;
  if (!STATUS_SET.has(status)) {
    throw new TranslationOperationsError("INVALID_TRANSLATION_STATUS", "Unsupported translation status.");
  }
  return status;
}

export function normalizeTranslationDraft(value: unknown): TranslationDraftInput {
  const record = asRecord(value);
  const stem = cleanText(record.stem);
  const explanation = cleanText(record.explanation);
  const reason = cleanText(record.reason);
  const options = Array.isArray(record.options)
    ? record.options.map(cleanOption)
    : [];

  if (!stem || stem.length > MAX_STEM_LENGTH) {
    throw new TranslationOperationsError(
      "INVALID_TRANSLATED_STEM",
      `Translated stem is required and must not exceed ${MAX_STEM_LENGTH} characters.`,
    );
  }
  if (!explanation || explanation.length > MAX_EXPLANATION_LENGTH) {
    throw new TranslationOperationsError(
      "INVALID_TRANSLATED_EXPLANATION",
      `Translated explanation is required and must not exceed ${MAX_EXPLANATION_LENGTH} characters.`,
    );
  }
  if (reason.length < 4 || reason.length > MAX_REASON_LENGTH) {
    throw new TranslationOperationsError(
      "TRANSLATION_REASON_REQUIRED",
      `A change reason of 4-${MAX_REASON_LENGTH} characters is required.`,
    );
  }
  if (options.some((option) => !option.key || !option.text || option.text.length > MAX_OPTION_LENGTH)) {
    throw new TranslationOperationsError(
      "INVALID_TRANSLATED_OPTIONS",
      `Every translated option requires a key and text of at most ${MAX_OPTION_LENGTH} characters.`,
    );
  }
  const keys = options.map((option) => option.key);
  const orders = options.map((option) => option.sortOrder);
  if (new Set(keys).size !== keys.length || new Set(orders).size !== orders.length) {
    throw new TranslationOperationsError(
      "DUPLICATE_TRANSLATED_OPTION",
      "Translated option keys and sort orders must be unique.",
    );
  }
  return { stem, explanation, options, reason };
}

export function assertTranslationTransition(from: string, to: string): void {
  const source = normalizeTranslationStatus(from);
  const target = normalizeTranslationStatus(to);
  if (!TRANSITIONS[source].includes(target)) {
    throw new TranslationOperationsError(
      "TRANSLATION_TRANSITION_NOT_ALLOWED",
      `Translation cannot move from ${source} to ${target}.`,
      409,
      { from: source, to: target },
    );
  }
}

function normalizedComparable(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .trim();
}

function protectedTokens(value: string): string[] {
  const matches = value.match(/\{\{[^{}]+\}\}|\{[^{}]+\}|\b\d+(?:[.,]\d+)*(?:%|°|₹|rs\.?|km|kg|m|cm|hr|hrs|min|mins|sec|secs)?\b/gi) ?? [];
  return matches.map((token) => normalizedComparable(token)).sort();
}

function tokenDifference(source: string[], target: string[]): { missing: string[]; extra: string[] } {
  const sourceCounts = new Map<string, number>();
  const targetCounts = new Map<string, number>();
  source.forEach((token) => sourceCounts.set(token, (sourceCounts.get(token) ?? 0) + 1));
  target.forEach((token) => targetCounts.set(token, (targetCounts.get(token) ?? 0) + 1));
  const missing: string[] = [];
  const extra: string[] = [];
  for (const [token, count] of sourceCounts) {
    const delta = count - (targetCounts.get(token) ?? 0);
    for (let index = 0; index < delta; index += 1) missing.push(token);
  }
  for (const [token, count] of targetCounts) {
    const delta = count - (sourceCounts.get(token) ?? 0);
    for (let index = 0; index < delta; index += 1) extra.push(token);
  }
  return { missing, extra };
}

function scriptRatio(value: string, languageCode: string): number | null {
  const letters = Array.from(value).filter((character) => /\p{L}/u.test(character));
  if (letters.length === 0) return 0;
  const pattern = languageCode === "hi"
    ? /[\u0900-\u097F]/u
    : languageCode === "pa"
      ? /[\u0A00-\u0A7F]/u
      : null;
  if (!pattern) return null;
  return letters.filter((character) => pattern.test(character)).length / letters.length;
}

function includesInsensitive(haystack: string, needle: string): boolean {
  return normalizedComparable(haystack).includes(normalizedComparable(needle));
}

function addTokenIssues(
  issues: TranslationQualityIssue[],
  field: "stem" | "explanation" | "options",
  source: string,
  target: string,
): void {
  const difference = tokenDifference(protectedTokens(source), protectedTokens(target));
  if (difference.missing.length > 0) {
    issues.push({
      code: "PROTECTED_TOKEN_MISSING",
      severity: "error",
      field,
      message: `Protected values missing from ${field}: ${difference.missing.join(", ")}.`,
    });
  }
  if (difference.extra.length > 0) {
    issues.push({
      code: "PROTECTED_TOKEN_ADDED",
      severity: "warning",
      field,
      message: `Additional protected values appear in ${field}: ${difference.extra.join(", ")}.`,
    });
  }
}

export function evaluateTranslationQuality(input: {
  source: TranslationSource;
  target: TranslationSource;
  languageCode: string;
  terms?: TranslationTermRule[];
}): TranslationQualityResult {
  const languageCode = input.languageCode.trim().toLowerCase();
  const issues: TranslationQualityIssue[] = [];
  const source = input.source;
  const target = input.target;

  if (!target.stem.trim()) {
    issues.push({ code: "STEM_EMPTY", severity: "error", field: "stem", message: "Translated stem is empty." });
  }
  if (!target.explanation.trim()) {
    issues.push({ code: "EXPLANATION_EMPTY", severity: "error", field: "explanation", message: "Translated explanation is empty." });
  }
  if (/\b(?:todo|tbd|translate(?:d)?\s+later|placeholder)\b/i.test(`${target.stem} ${target.explanation}`)) {
    issues.push({
      code: "EDITORIAL_PLACEHOLDER",
      severity: "error",
      field: "metadata",
      message: "Translation still contains an editorial placeholder.",
    });
  }

  addTokenIssues(issues, "stem", source.stem, target.stem);
  addTokenIssues(issues, "explanation", source.explanation, target.explanation);

  const sourceOptions = new Map(source.options.map((option) => [option.key, option]));
  const targetOptions = new Map(target.options.map((option) => [option.key, option]));
  if (sourceOptions.size !== targetOptions.size) {
    issues.push({
      code: "OPTION_COUNT_MISMATCH",
      severity: "error",
      field: "options",
      message: `Expected ${sourceOptions.size} translated options but found ${targetOptions.size}.`,
    });
  }
  for (const [key, sourceOption] of sourceOptions) {
    const targetOption = targetOptions.get(key);
    if (!targetOption) {
      issues.push({
        code: "OPTION_KEY_MISSING",
        severity: "error",
        field: "options",
        message: `Translated option ${key} is missing.`,
      });
      continue;
    }
    if (!targetOption.text.trim()) {
      issues.push({
        code: "OPTION_TEXT_EMPTY",
        severity: "error",
        field: "options",
        message: `Translated option ${key} is empty.`,
      });
    }
    if (sourceOption.sortOrder !== targetOption.sortOrder) {
      issues.push({
        code: "OPTION_ORDER_MISMATCH",
        severity: "error",
        field: "options",
        message: `Translated option ${key} changed its source order.`,
      });
    }
    addTokenIssues(issues, "options", sourceOption.text, targetOption.text);
  }

  if (languageCode !== "en") {
    if (normalizedComparable(source.stem) === normalizedComparable(target.stem)) {
      issues.push({
        code: "SOURCE_STEM_COPIED",
        severity: "error",
        field: "stem",
        message: "Target stem is identical to the English source.",
      });
    }
    const targetComposite = [target.stem, target.explanation, ...target.options.map((option) => option.text)].join(" ");
    const ratio = scriptRatio(targetComposite, languageCode);
    if (ratio !== null && ratio < 0.35) {
      issues.push({
        code: "TARGET_SCRIPT_LOW",
        severity: "warning",
        field: "script",
        message: `Only ${Math.round(ratio * 100)}% of target letters use the expected script.`,
      });
    }
  }

  const sourceComposite = [source.stem, source.explanation, ...source.options.map((option) => option.text)].join(" ");
  const targetComposite = [target.stem, target.explanation, ...target.options.map((option) => option.text)].join(" ");
  for (const term of input.terms ?? []) {
    if (!term.sourceText.trim() || !includesInsensitive(sourceComposite, term.sourceText)) continue;
    if (term.preferredText.trim() && !includesInsensitive(targetComposite, term.preferredText)) {
      issues.push({
        code: "PREFERRED_TERM_MISSING",
        severity: "warning",
        field: "terminology",
        message: `Preferred translation “${term.preferredText}” is missing for “${term.sourceText}”.`,
      });
    }
    const forbidden = term.forbiddenVariants.find((variant) => variant.trim() && includesInsensitive(targetComposite, variant));
    if (forbidden) {
      issues.push({
        code: "FORBIDDEN_TERM_USED",
        severity: "error",
        field: "terminology",
        message: `Forbidden terminology variant “${forbidden}” is present.`,
      });
    }
  }

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.length - errorCount;
  const score = Math.max(0, 100 - errorCount * 20 - warningCount * 5);
  return {
    issues,
    errorCount,
    warningCount,
    score,
    approvable: errorCount === 0,
  };
}

export function languageCodesFromSettings(value: unknown): string[] {
  const settings = asRecord(value);
  const candidates = Array.isArray(settings.languageCodes)
    ? settings.languageCodes
    : typeof settings.languageCode === "string"
      ? [settings.languageCode]
      : ["en"];
  const codes = candidates
    .map((candidate) => cleanText(candidate).toLowerCase())
    .filter((candidate) => /^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/.test(candidate));
  return Array.from(new Set(codes.length > 0 ? codes : ["en"]));
}

export function resolveRequestedLanguage(input: {
  settings: unknown;
  requested: unknown;
}): { requestedLanguage: string; availableLanguages: string[] } {
  const availableLanguages = languageCodesFromSettings(input.settings);
  const requested = cleanText(input.requested).toLowerCase();
  const requestedLanguage = requested || availableLanguages[0] || "en";
  if (!availableLanguages.includes(requestedLanguage)) {
    throw new TranslationOperationsError(
      "TEST_LANGUAGE_UNAVAILABLE",
      `Language ${requestedLanguage} is not available for this test.`,
      409,
      { requestedLanguage, availableLanguages },
    );
  }
  return { requestedLanguage, availableLanguages };
}

export function normalizeLanguageConfiguration(value: unknown): {
  name: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  scriptCode: string | null;
  isActive: boolean;
  fallbackLanguageId: string | null;
  reason: string;
} {
  const record = asRecord(value);
  const name = cleanText(record.name);
  const nativeName = cleanText(record.nativeName);
  const direction = cleanText(record.direction).toLowerCase() === "rtl" ? "rtl" : "ltr";
  const scriptCode = cleanText(record.scriptCode) || null;
  const fallbackLanguageId = cleanText(record.fallbackLanguageId) || null;
  const reason = cleanText(record.reason);
  if (!name || !nativeName) {
    throw new TranslationOperationsError("LANGUAGE_NAMES_REQUIRED", "Language and native names are required.");
  }
  if (scriptCode && !/^[A-Za-z]{4}$/.test(scriptCode)) {
    throw new TranslationOperationsError("INVALID_SCRIPT_CODE", "Script code must be a four-letter ISO 15924 code.");
  }
  if (reason.length < 4 || reason.length > MAX_REASON_LENGTH) {
    throw new TranslationOperationsError("LANGUAGE_REASON_REQUIRED", "A language change reason of 4-1000 characters is required.");
  }
  return {
    name,
    nativeName,
    direction,
    scriptCode,
    isActive: Boolean(record.isActive),
    fallbackLanguageId,
    reason,
  };
}
