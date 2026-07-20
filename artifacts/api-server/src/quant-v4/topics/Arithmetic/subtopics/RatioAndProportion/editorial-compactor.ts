export interface CompactRapExplanationLike {
  explanationId: string;
  lines: string[];
}

export interface CompactRapExplanationOptions {
  maxMeaningfulLines?: number;
  padToLength?: number;
}

const SINGULAR_UNITS: Record<string, string> = {
  years: "year",
  months: "month",
  hours: "hour",
  days: "day",
  minutes: "minute",
  seconds: "second",
  litres: "litre",
  liters: "liter",
  votes: "vote",
  voters: "voter",
  coins: "coin",
  items: "item",
  units: "unit",
  metres: "metre",
  meters: "meter",
  kilometres: "kilometre",
  kilometers: "kilometer",
};

const SUPPORT_ONLY_PROSE = /^(?:quick check|check|for checking|the distributable amount|the resulting partner shares|the resulting values|the calculated values|the calculated value satisfies|the aligned chain satisfies|the aligned values now|the rate-time product remains|read the (?:pair|four-part|full)|compare the aligned|no monetary unit is needed|no total vote count is required|the other candidate|the actual valid-vote total cancels|voters who did not turn out|all nota votes|margin, valid votes|valid votes are a subset|polled votes are a subset|the two percentage directions|the vessel volume stays|the water quantity is the rest|the remaining profit goes|the recovered shares|the partner shares together|both savings use|the two savings add|the two candidate shares total|the three candidate vote counts together|the response ratio refers|yes and no responses together|each later percentage|the candidate's votes are first expanded|this is the amount left|this interpretation treats|the larger expenditure produces|the equal expenditure is subtracted|the income ratio only splits|both expenditures are included|the question asks for combined income|the calculated expenditures add|the percentage is measured|substitution gives|the calculated values reproduce|the resulting incomes and expenditures reproduce)/i;

const CHECK_MATH_PROSE = /^(?:quick check|check|for checking|verify|the reverse chain is|the .* for checking|the two .* add to|the .* together equal|the .* reproduces)/i;

function polishSingularUnits(line: string) {
  return line.replace(
    /\b1\s+(years|months|hours|days|minutes|seconds|litres|liters|votes|voters|coins|items|units|metres|meters|kilometres|kilometers)\b/gi,
    (_match, unit: string) => `1 ${SINGULAR_UNITS[unit.toLowerCase()] ?? unit}`,
  );
}

function prosePart(line: string) {
  const index = line.indexOf("\n\n$$");
  return (index >= 0 ? line.slice(0, index) : line).trim();
}

function hasMath(line: string) {
  return /\$\$|\\frac|\\times|\\div|=/.test(line);
}

function isFinal(line: string) {
  return /^(?:so|therefore|hence),/i.test(line.trim());
}

function mathSignature(line: string) {
  return (line.match(/\$\$[\s\S]*?\$\$/g) ?? [])
    .join("|")
    .replace(/\$\$|\\Rightarrow|\s+/g, "")
    .toLowerCase();
}

function uniqueLines(lines: string[]) {
  const seenText = new Set<string>();
  const seenMath = new Set<string>();
  return lines.filter((line) => {
    const textKey = line.replace(/\s+/g, " ").trim().toLowerCase();
    if (!textKey || seenText.has(textKey)) return false;
    const signature = mathSignature(line);
    if (signature && seenMath.has(signature)) return false;
    seenText.add(textKey);
    if (signature) seenMath.add(signature);
    return true;
  });
}

/**
 * Keeps the actual arithmetic and contextual answer while removing verification
 * chatter and repeated instructional prose. Empty padding preserves legacy
 * package tests; Question Studio and review exports filter empty lines.
 */
export function compactEnglishRapExplanation<T extends CompactRapExplanationLike>(
  explanation: T,
  language: string,
  options: CompactRapExplanationOptions = {},
): T {
  if (language !== "en") return explanation;

  const maxMeaningful = Math.max(3, options.maxMeaningfulLines ?? 6);
  const padToLength = Math.max(maxMeaningful, options.padToLength ?? 7);
  const source = uniqueLines(explanation.lines.map((line) => polishSingularUnits(line.trim())).filter(Boolean));
  const final = [...source].reverse().find(isFinal);
  const candidates = source.filter((line) => line !== final && !isFinal(line));

  const mathLines = candidates.filter((line) => {
    if (!hasMath(line)) return false;
    return !CHECK_MATH_PROSE.test(prosePart(line));
  });
  const proseLines = candidates.filter((line) => {
    if (hasMath(line)) return false;
    return !SUPPORT_ONLY_PROSE.test(prosePart(line));
  });

  const selected = new Set<string>();
  const intro = proseLines[0];
  if (intro) selected.add(intro);

  const mathBudget = maxMeaningful - (final ? 1 : 0) - selected.size;
  for (const line of mathLines.slice(0, Math.max(1, mathBudget))) selected.add(line);

  if (selected.size + (final ? 1 : 0) < 3) {
    for (const line of candidates) {
      selected.add(line);
      if (selected.size + (final ? 1 : 0) >= 3) break;
    }
  }

  const meaningful = candidates.filter((line) => selected.has(line));
  if (final) meaningful.push(final);
  const compacted = meaningful.slice(0, maxMeaningful);

  while (compacted.length < padToLength) compacted.push("");
  return { ...explanation, lines: compacted };
}
