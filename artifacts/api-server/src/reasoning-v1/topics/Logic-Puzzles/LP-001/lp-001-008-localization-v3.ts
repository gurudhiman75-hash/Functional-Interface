import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2,
  LP_001_008_LOCALIZED_GENERATORS_V2,
} from "./lp-001-008-localization-v2.ts";
import type {
  Lp001008LocalizedCaselet,
  Lp001008LocalizedChild,
  Lp001008LocalizedLanguage,
} from "./lp-001-008-localization-v1.ts";

export const LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3 = Object.freeze({
  ...LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2,
  authorityId: "LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3" as const,
  supersedes: LP_001_008_HI_PA_LOCALIZATION_REVIEW_V2.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V3" as const,
  editorialFocus: "NATIVE_OPTION_TEXT_ORDINALS_LOCATIONS_AND_GENDER_NEUTRAL_SELECTION_COPY" as const,
  localizationFreezeStatus: "NOT_FROZEN" as const,
  questionStudioActivation: "NOT_ENABLED_UNTIL_HUMAN_APPROVAL" as const,
});

const RESIDUE_MAP: Record<Lp001008LocalizedLanguage, ReadonlyArray<readonly [string, string]>> = {
  hi: [
    ["No unit can be identified", "समूह निश्चित नहीं किया जा सकता"],
    ["North section", "उत्तरी खंड"],
    ["South section", "दक्षिणी खंड"],
    ["East section", "पूर्वी खंड"],
    ["West section", "पश्चिमी खंड"],
    ["Yard section", "यार्ड खंड"],
    ["1st", "पहला"], ["2nd", "दूसरा"], ["3rd", "तीसरा"], ["4th", "चौथा"],
    ["5th", "पाँचवाँ"], ["6th", "छठा"], ["7th", "सातवाँ"],
    [" and ", " और "],
  ],
  pa: [
    ["No unit can be identified", "ਸਮੂਹ ਨਿਸ਼ਚਿਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"],
    ["North section", "ਉੱਤਰੀ ਭਾਗ"],
    ["South section", "ਦੱਖਣੀ ਭਾਗ"],
    ["East section", "ਪੂਰਬੀ ਭਾਗ"],
    ["West section", "ਪੱਛਮੀ ਭਾਗ"],
    ["Yard section", "ਯਾਰਡ ਭਾਗ"],
    ["1st", "ਪਹਿਲਾ"], ["2nd", "ਦੂਜਾ"], ["3rd", "ਤੀਜਾ"], ["4th", "ਚੌਥਾ"],
    ["5th", "ਪੰਜਵਾਂ"], ["6th", "ਛੇਵਾਂ"], ["7th", "ਸੱਤਵਾਂ"],
    [" and ", " ਅਤੇ "],
  ],
};

function translateSelectionOption(language: Lp001008LocalizedLanguage, text: string): string {
  let match = text.match(/^Only (.+) is selected among (.+), (.+), (.+)\.$/u);
  if (match) {
    const [, selected, first, second, third] = match;
    return language === "hi"
      ? `${first}, ${second} और ${third} में केवल ${selected} का चयन हुआ है।`
      : `${first}, ${second} ਅਤੇ ${third} ਵਿੱਚ ਕੇਵਲ ${selected} ਦੀ ਚੋਣ ਹੋਈ ਹੈ।`;
  }
  match = text.match(/^(.+) and (.+) are selected, but (.+) is not\.$/u);
  if (match) {
    const [, first, second, third] = match;
    return language === "hi"
      ? `${first} और ${second} का चयन हुआ है, लेकिन ${third} का नहीं।`
      : `${first} ਅਤੇ ${second} ਦੀ ਚੋਣ ਹੋਈ ਹੈ, ਪਰ ${third} ਦੀ ਨਹੀਂ।`;
  }
  match = text.match(/^All three of (.+), (.+), (.+) are selected\.$/u);
  if (match) {
    const [, first, second, third] = match;
    return language === "hi"
      ? `${first}, ${second} और ${third}—तीनों का चयन हुआ है।`
      : `${first}, ${second} ਅਤੇ ${third}—ਤਿੰਨਾਂ ਦੀ ਚੋਣ ਹੋਈ ਹੈ।`;
  }
  match = text.match(/^None of (.+), (.+), (.+) is selected\.$/u);
  if (match) {
    const [, first, second, third] = match;
    return language === "hi"
      ? `${first}, ${second} और ${third} में से किसी का भी चयन नहीं हुआ है।`
      : `${first}, ${second} ਅਤੇ ${third} ਵਿੱਚੋਂ ਕਿਸੇ ਦੀ ਵੀ ਚੋਣ ਨਹੀਂ ਹੋਈ ਹੈ।`;
  }
  return text;
}

function nativeText(language: Lp001008LocalizedLanguage, input: string): string {
  let output = translateSelectionOption(language, input);
  for (const [source, target] of RESIDUE_MAP[language]) output = output.split(source).join(target);
  return output;
}

function nativeChild(language: Lp001008LocalizedLanguage, child: Lp001008LocalizedChild): Lp001008LocalizedChild {
  return {
    ...child,
    stem: nativeText(language, child.stem),
    options: child.options.map((option) => nativeText(language, option)),
    answer: nativeText(language, child.answer),
    explanation: {
      summary: nativeText(language, child.explanation.summary),
      lines: child.explanation.lines.map((line) => nativeText(language, line)),
    },
  };
}

function tableRows(child: Lp001008LocalizedChild): string[][] {
  for (let index = child.explanation.lines.length - 1; index >= 0; index -= 1) {
    const lines = child.explanation.lines[index]!.split("\n").filter((line) => line.trim().startsWith("|"));
    if (lines.length >= 3) return lines.slice(2).map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
  }
  throw new Error(`No final table for ${child.questionId}`);
}

function selectionClueText(language: Lp001008LocalizedLanguage, clue: any, name: (id: string) => string): string {
  const first = clue.candidate ? name(clue.candidate) : name(clue.first);
  const second = clue.second ? name(clue.second) : "";
  if (language === "hi") {
    if (clue.kind === "MUST_SELECT") return `${first} का चयन होता है।`;
    if (clue.kind === "MUST_NOT_SELECT") return `${first} का चयन नहीं होता है।`;
    if (clue.kind === "TOGETHER") return `${first} और ${second}—दोनों का चयन होता है या दोनों का नहीं।`;
    if (clue.kind === "NOT_TOGETHER") return `${first} और ${second}—दोनों का एक साथ चयन नहीं हो सकता।`;
    if (clue.kind === "EXACTLY_ONE") return `${first} और ${second} में से ठीक एक का चयन होता है।`;
    if (clue.kind === "IF_SELECTED") return `यदि ${first} का चयन होता है, तो ${second} का भी चयन होता है।`;
  } else {
    if (clue.kind === "MUST_SELECT") return `${first} ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ।`;
    if (clue.kind === "MUST_NOT_SELECT") return `${first} ਦੀ ਚੋਣ ਨਹੀਂ ਹੁੰਦੀ।`;
    if (clue.kind === "TOGETHER") return `${first} ਅਤੇ ${second}—ਦੋਵਾਂ ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ ਜਾਂ ਦੋਵਾਂ ਦੀ ਨਹੀਂ।`;
    if (clue.kind === "NOT_TOGETHER") return `${first} ਅਤੇ ${second}—ਦੋਵਾਂ ਦੀ ਇਕੱਠੇ ਚੋਣ ਨਹੀਂ ਹੋ ਸਕਦੀ।`;
    if (clue.kind === "EXACTLY_ONE") return `${first} ਅਤੇ ${second} ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ।`;
    if (clue.kind === "IF_SELECTED") return `ਜੇ ${first} ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ, ਤਾਂ ${second} ਦੀ ਵੀ ਚੋਣ ਹੁੰਦੀ ਹੈ।`;
  }
  throw new Error(`Unexpected LP-004 clue kind: ${clue.kind}`);
}

function polishLp004(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  const english = caselet.englishCaselet as any;
  const rows = tableRows(caselet.children[0]!);
  const localizedName = (candidate: string) => rows[english.candidates.indexOf(candidate)]![0]!;
  const oldClues = [...caselet.learnerFacingClues];
  const newClues = english.clues.map((clue: any) => selectionClueText(language, clue, localizedName));
  const replaceClues = (text: string) => {
    let output = text;
    oldClues.forEach((oldClue, index) => { output = output.split(oldClue).join(newClues[index]!); });
    return nativeText(language, output);
  };
  return {
    ...caselet,
    scenario: nativeText(language, caselet.scenario),
    learnerFacingClues: newClues,
    children: caselet.children.map((child) => {
      const localized = nativeChild(language, child);
      return {
        ...localized,
        explanation: {
          summary: replaceClues(localized.explanation.summary),
          lines: localized.explanation.lines.map(replaceClues),
        },
      };
    }),
  };
}

function polishGeneric(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  return {
    ...caselet,
    scenario: nativeText(language, caselet.scenario),
    learnerFacingClues: caselet.learnerFacingClues.map((clue) => nativeText(language, clue)),
    children: caselet.children.map((child) => nativeChild(language, child)),
  };
}

function wrap(packageId: string, language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  return packageId === "LP-004" ? polishLp004(language, caselet) : polishGeneric(language, caselet);
}

export const LP_001_008_LOCALIZED_GENERATORS_V3 = Object.freeze(Object.fromEntries(
  Object.entries(LP_001_008_LOCALIZED_GENERATORS_V2).map(([packageId, generator]) => [
    packageId,
    (language: Lp001008LocalizedLanguage, seed = `${packageId.toLowerCase()}-localization-v3`, count = 8) =>
      generator(language, seed, count).map((caselet) => wrap(packageId, language, caselet)),
  ]),
) as Record<string, (language: Lp001008LocalizedLanguage, seed?: string, count?: number) => Lp001008LocalizedCaselet[]>);

export function generateLp001LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-001"]!(language, seed, count); }
export function generateLp002LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-002"]!(language, seed, count); }
export function generateLp003LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-003"]!(language, seed, count); }
export function generateLp004LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-004"]!(language, seed, count); }
export function generateLp005LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-005"]!(language, seed, count); }
export function generateLp006LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-006"]!(language, seed, count); }
export function generateLp007LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-007"]!(language, seed, count); }
export function generateLp008LocalizedBatchV3(language: Lp001008LocalizedLanguage, seed?: string, count?: number) { return LP_001_008_LOCALIZED_GENERATORS_V3["LP-008"]!(language, seed, count); }
