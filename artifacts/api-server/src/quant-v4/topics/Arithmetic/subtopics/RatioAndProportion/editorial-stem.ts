const SINGULAR_UNITS: Record<string, string> = {
  litres: "litre",
  liters: "liter",
  years: "year",
  months: "month",
  hours: "hour",
  days: "day",
  votes: "vote",
  coins: "coin",
  workers: "worker",
  students: "student",
  metres: "metre",
  meters: "meter",
  kilometres: "kilometre",
  kilometers: "kilometer",
};

function capitalizeSentenceStarts(value: string) {
  return value
    .replace(/^([a-z])/, (match) => match.toUpperCase())
    .replace(/([.!?]\s+)([a-z])/g, (_match, punctuation: string, letter: string) => `${punctuation}${letter.toUpperCase()}`);
}

/** Applies small grammar corrections after variables have been rendered. */
export function polishEnglishRapStem(stem: string, language: string) {
  if (language !== "en") return stem;
  let result = stem.trim();

  result = result.replace(
    /\b1\s+(litres|liters|years|months|hours|days|votes|coins|workers|students|metres|meters|kilometres|kilometers)\b/gi,
    (_match, unit: string) => `1 ${SINGULAR_UNITS[unit.toLowerCase()] ?? unit}`,
  );

  result = result.replace(/\b(\d+)\s+(Rs\.\s*\d+)\s+coin\b/g, (_match, countText: string, denomination: string) => {
    const count = Number(countText);
    return `${countText} ${denomination} ${count === 1 ? "coin" : "coins"}`;
  });

  result = result
    .replace(/^Class has\b/, "A class has")
    .replace(/^School has\b/, "A school has")
    .replace(/^Family has\b/, "A family has");

  return capitalizeSentenceStarts(result).replace(/\s{2,}/g, " ");
}
