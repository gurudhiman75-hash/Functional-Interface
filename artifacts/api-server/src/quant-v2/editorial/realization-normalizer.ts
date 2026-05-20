const DUPLICATE_INTRO_RE = /^([^,.!?]{3,80}),\s+\1\b/iu;

function collapseDuplicateIntro(text: string) {
  return text.replace(DUPLICATE_INTRO_RE, "$1");
}

function collapseRepeatedFragments(text: string) {
  return text
    .replace(/\b(the marked price),\s+\1\b/giu, "$1")
    .replace(/\b(the price),\s+\1\b/giu, "$1")
    .replace(/\b(the quantity),\s+\1\b/giu, "$1")
    .replace(/\b(a quantity),\s+\1\b/giu, "$1");
}

function suppressRealismWrappers(text: string) {
  return text
    .replace(/\bThe price of fuel\b/gu, "Fuel price")
    .replace(/\bthe price of fuel\b/gu, "fuel price")
    .replace(/\bThe price of a household appliance\b/gu, "Appliance price")
    .replace(/\bthe price of the appliance\b/gu, "appliance price")
    .replace(/\bThe unit price\b/gu, "Unit price")
    .replace(/\bthe unit price\b/gu, "unit price")
    .replace(/\bAfter a salary revision,\s+the salary of an employee\b/gu, "Salary")
    .replace(/\bAfter a salary revision,\s+salary\b/gu, "Salary")
    .replace(/\bthe salary of an employee\b/gu, "salary")
    .replace(/\bAfter a warehouse stock reduction,\s*/gu, "")
    .replace(/\bquantity in a mixture tank\b/gu, "quantity");
}

function compactAsk(text: string) {
  return text
    .replace(/Find the total value represented by 100%\./gu, "Find the original quantity.")
    .replace(/Find the percentage change based on the old salary\./gu, "Find the percentage change.")
    .replace(/Find the profit or loss percentage on cost price\./gu, "Find profit or loss percentage.")
    .replace(/By what percent should consumption be reduced\?/gu, "Find the required reduction percentage.")
    .replace(/By what percent should it be increased to restore the original level\?/gu, "Find the required increase percentage.");
}

function cleanupPunctuation(text: string) {
  return text
    .replace(/\s+,/gu, ",")
    .replace(/,\s*,/gu, ",")
    .replace(/\s+\./gu, ".")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

export function normalizeRealizationText(text: string) {
  return cleanupPunctuation(
    compactAsk(
      suppressRealismWrappers(
        collapseRepeatedFragments(collapseDuplicateIntro(text)),
      ),
    ),
  );
}

export function normalizeRealizationBlock(text: string) {
  return text
    .split("\n")
    .map((line) => normalizeRealizationText(line))
    .join("\n");
}
