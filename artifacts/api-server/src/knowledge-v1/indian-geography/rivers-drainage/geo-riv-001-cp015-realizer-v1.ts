import { GEO_RIV_001_CP007_PROJECTED_FACTS_V1 } from "./geo-riv-001-cp007-facts";
import { GEO_RIV_001_CP010_PROJECT_ROWS_V1 } from "./geo-riv-001-cp010-facts";
import { GEO_RIV_001_CP011_BASIN_ROWS_V1 } from "./geo-riv-001-cp011-facts";
import { GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1 } from "./geo-riv-001-cp012-facts";
import { GEO_RIV_001_CP013_ROWS_V1 } from "./geo-riv-001-cp013-facts";
import type { GeoRiv001Cp015ReviewQuestion } from "./geo-riv-001-cp015-review-types";

const RIVER_VALUE_RELATIONS = new Set([
  "main_tributary_of",
  "tributary_of",
  "principal_tributary_of",
  "tributary_of_brahmaputra_system",
  "headstream_of",
  "source_stream_of",
  "left_bank_tributary_of",
  "right_bank_tributary_of",
  "joins_river",
  "joins_mainstream",
]);

const EXTRA_EXAM_ALIASES = [
  "Kaveri",
  "Tsangpo",
  "Jamuna",
  "Karnali",
  "Narayani",
  "Siang",
  "Dihang",
] as const;

const PROPER_NOUN_SUFFIXES = ["Dam", "Reservoir", "Project", "Sagar", "Kund"] as const;

function formedByComponents() {
  return GEO_RIV_001_CP007_PROJECTED_FACTS_V1.flatMap((fact) => {
    if (fact.relation !== "formed_by") return [];
    const raw = fact.value.kind === "text"
      ? fact.value.text.en
      : fact.value.kind === "entity_ref"
        ? fact.value.label.en
        : "";
    return raw.split(/\s*,\s*|\s*\+\s*|\s+and\s+/i).map((part) => part.trim()).filter(Boolean);
  });
}

export const GEO_RIV_001_CP015_RIVER_DISPLAY_NAMES_V1 = Object.freeze(
  [...new Set([
    ...GEO_RIV_001_CP007_PROJECTED_FACTS_V1.flatMap((fact) => {
      const names = [fact.entity.label.en];
      if (RIVER_VALUE_RELATIONS.has(fact.relation) && fact.value.kind === "entity_ref") names.push(fact.value.label.en);
      return names;
    }),
    ...formedByComponents(),
    ...GEO_RIV_001_CP010_PROJECT_ROWS_V1.map((row) => row.river),
    ...GEO_RIV_001_CP011_BASIN_ROWS_V1.flatMap((row) => [row.river, row.parentRiver]),
    ...GEO_RIV_001_CP012_CITY_RIVER_ROWS_V1.map((row) => row.river),
    ...GEO_RIV_001_CP013_ROWS_V1.map((row) => row.river),
    ...EXTRA_EXAM_ALIASES,
  ])]
    .filter((name) => name && !/^River\s+/i.test(name))
    .sort((a, b) => b.length - a.length),
);

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function naturalizeProtectedNames(input: string) {
  let output = input;
  for (const name of GEO_RIV_001_CP015_RIVER_DISPLAY_NAMES_V1) {
    const escaped = escapeRegExp(name);
    output = output
      .replace(new RegExp(`\\bRiver ${escaped} system\\b`, "g"), `${name} river system`)
      .replace(new RegExp(`\\bRiver ${escaped} Basin\\b`, "g"), `${name} Basin`);
    for (const suffix of PROPER_NOUN_SUFFIXES) {
      output = output.replace(new RegExp(`\\bRiver ${escaped} ${suffix}\\b`, "g"), `${name} ${suffix}`);
    }
  }
  return output;
}

export function geoRiv001Cp015DisplayRiverNames(input: string) {
  let output = input;
  const placeholders = new Map<string, string>();

  GEO_RIV_001_CP015_RIVER_DISPLAY_NAMES_V1.forEach((name, index) => {
    const escaped = escapeRegExp(name);
    const token = `__CP015_RIVER_${index}__`;
    const pattern = new RegExp(
      `(?<!River\\s)(?<![A-Za-z])${escaped}(?![A-Za-z])(?!\\s+(?:river\\s+system|system|Basin|basin|tributary|tributaries|Dam|Reservoir|Project|Sagar|Kund))`,
      "g",
    );
    if (pattern.test(output)) {
      pattern.lastIndex = 0;
      output = output.replace(pattern, token);
      placeholders.set(token, name);
    }
  });

  for (const [token, name] of placeholders) output = output.replaceAll(token, `River ${name}`);
  output = output
    .replace(/\b(?:the|The) River /g, "River ")
    .replace(/\bRiver ([A-Za-z]+) River\b/g, "River $1");
  return naturalizeProtectedNames(output);
}

export function realizeGeoRiv001Cp015QuestionV1(question: GeoRiv001Cp015ReviewQuestion): GeoRiv001Cp015ReviewQuestion {
  const options = question.options.map(geoRiv001Cp015DisplayRiverNames);
  const canonicalAnswer = geoRiv001Cp015DisplayRiverNames(question.canonicalAnswer);
  const correctIndex = options.indexOf(canonicalAnswer);
  if (correctIndex < 0) throw new Error(`CP015 realization lost keyed answer for ${question.questionId}`);
  return {
    ...question,
    stem: geoRiv001Cp015DisplayRiverNames(question.stem),
    options,
    correctIndex,
    canonicalAnswer,
    explanation: geoRiv001Cp015DisplayRiverNames(question.explanation),
  };
}

export function geoRiv001Cp015BareRiverName(text: string) {
  let clean = text;
  for (const name of GEO_RIV_001_CP015_RIVER_DISPLAY_NAMES_V1) {
    clean = clean
      .replaceAll(`River ${name}`, "")
      .replaceAll(`${name} river system`, "")
      .replaceAll(`${name} system`, "")
      .replaceAll(`${name} Basin`, "")
      .replaceAll(`${name} basin`, "")
      .replaceAll(`${name} tributary`, "")
      .replaceAll(`${name} tributaries`, "");
    for (const suffix of PROPER_NOUN_SUFFIXES) clean = clean.replaceAll(`${name} ${suffix}`, "");
  }
  for (const name of GEO_RIV_001_CP015_RIVER_DISPLAY_NAMES_V1) {
    const escaped = escapeRegExp(name);
    if (new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`).test(clean)) return name;
  }
  return null;
}
