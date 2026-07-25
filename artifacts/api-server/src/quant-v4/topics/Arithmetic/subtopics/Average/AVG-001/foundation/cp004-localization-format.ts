import { getAvg001QuestionEntry } from "./library";
import { avg001Cp004PairLexicon } from "./cp004-localization-lexicon";
import type { Avg001Cp004PilotLanguage, Avg001Cp004UnitKind } from "./cp004-localization-lexicon";
import { variant } from "./cp004-localization-values";
import type { Avg001QuestionPackage } from "./types";

function groupIndianDigits(value: string) {
  const match = value.replaceAll(",", "").match(/^(-?)(\d+)(\.\d+)?$/);
  if (!match) return value;
  const [, sign, integer, decimal = ""] = match;
  if (integer.length <= 3) return `${sign}${integer}${decimal}`;
  const lastThree = integer.slice(-3);
  const leading = integer.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}${leading},${lastThree}${decimal}`;
}

function entryUnit(pkg: Avg001QuestionPackage): Avg001Cp004UnitKind {
  return ((getAvg001QuestionEntry(pkg.questionLanguageId) as { unitKind?: Avg001Cp004UnitKind }).unitKind ?? "none");
}

export function contextUnit(pkg: Avg001QuestionPackage): Avg001Cp004UnitKind {
  if (pkg.solveMode === "findGroupCountFromCombinedAverage") {
    return avg001Cp004PairLexicon(variant(pkg), "hi").unit;
  }
  return entryUnit(pkg);
}

export function display(raw: string, unit: Avg001Cp004UnitKind, language: Avg001Cp004PilotLanguage) {
  if (unit === "currency") return `₹${groupIndianDigits(raw)}`;
  if (unit === "marks") return `${raw} ${language === "hi" ? "अंक" : "ਅੰਕ"}`;
  if (unit === "kg") return `${raw} ${language === "hi" ? "किग्रा" : "ਕਿਲੋਗ੍ਰਾਮ"}`;
  if (unit === "years") return `${raw} ${language === "hi" ? "वर्ष" : "ਸਾਲ"}`;
  if (unit === "units") return `${raw} ${language === "hi" ? "इकाइयाँ" : "ਇਕਾਈਆਂ"}`;
  if (unit === "runs") return `${raw} ${language === "hi" ? "रन" : "ਦੌੜਾਂ"}`;
  if (unit === "kmh") return `${raw} ${language === "hi" ? "किमी/घंटा" : "ਕਿਮੀ/ਘੰਟਾ"}`;
  if (unit === "unitsPerHour") return `${raw} ${language === "hi" ? "इकाइयाँ प्रति घंटा" : "ਇਕਾਈਆਂ ਪ੍ਰਤੀ ਘੰਟਾ"}`;
  return raw;
}

export function joined(values: string[], language: Avg001Cp004PilotLanguage) {
  if (values.length < 2) return values[0] ?? "";
  const and = language === "hi" ? " और " : " ਅਤੇ ";
  return `${values.slice(0, -1).join(", ")}${and}${values.at(-1)}`;
}
