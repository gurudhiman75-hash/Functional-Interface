import {
  LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3,
  LP_001_008_LOCALIZED_GENERATORS_V3,
} from "./lp-001-008-localization-v3.ts";
import type {
  Lp001008LocalizedCaselet,
  Lp001008LocalizedChild,
  Lp001008LocalizedLanguage,
} from "./lp-001-008-localization-v1.ts";

export const LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4 = Object.freeze({
  ...LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3,
  authorityId: "LP_001_008_HI_PA_LOCALIZATION_REVIEW_V4" as const,
  supersedes: LP_001_008_HI_PA_LOCALIZATION_REVIEW_V3.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V4" as const,
  editorialFocus: "LP003_NATIVE_GRAMMAR_AND_LP004_GENDER_NEUTRAL_EXPLANATION_CONSISTENCY" as const,
  localizationFreezeStatus: "NOT_FROZEN" as const,
  questionStudioActivation: "NOT_ENABLED_UNTIL_HUMAN_APPROVAL" as const,
});

const ORDINAL = {
  hi: { 1: "पहले", 2: "दूसरे", 3: "तीसरे", 4: "चौथे", 5: "पाँचवें", 6: "छठे", 7: "सातवें" },
  pa: { 1: "ਪਹਿਲੇ", 2: "ਦੂਜੇ", 3: "ਤੀਜੇ", 4: "ਚੌਥੇ", 5: "ਪੰਜਵੇਂ", 6: "ਛੇਵੇਂ", 7: "ਸੱਤਵੇਂ" },
} as const;

function finalRows(child: Lp001008LocalizedChild): string[][] {
  for (let index = child.explanation.lines.length - 1; index >= 0; index -= 1) {
    const lines = child.explanation.lines[index]!.split("\n").filter((line) => line.trim().startsWith("|"));
    if (lines.length >= 3) return lines.slice(2).map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
  }
  throw new Error(`No final table for ${child.questionId}`);
}

function replaceAllClues(text: string, oldClues: readonly string[], newClues: readonly string[]): string {
  let output = text;
  oldClues.forEach((oldClue, index) => { output = output.split(oldClue).join(newClues[index]!); });
  return output;
}

function lp003ClueText(
  language: Lp001008LocalizedLanguage,
  clue: any,
  label: (box: string) => string,
): string {
  const betweenNoun = (count: number) => language === "hi"
    ? (count === 1 ? "वस्तु है" : "वस्तुएँ हैं")
    : (count === 1 ? "ਵਸਤੂ ਹੈ" : "ਵਸਤੂਆਂ ਹਨ");
  if (language === "hi") {
    if (clue.kind === "ABOVE") return `${label(clue.upper)} ${label(clue.lower)} से ऊपर है।`;
    if (clue.kind === "IMMEDIATELY_ABOVE") return `${label(clue.upper)} ${label(clue.lower)} के ठीक ऊपर है।`;
    if (clue.kind === "BOXES_BETWEEN") return `${label(clue.left)} और ${label(clue.right)} के बीच ठीक ${clue.count} ${betweenNoun(clue.count)}।`;
    if (clue.kind === "NOT_ADJACENT") return `${label(clue.left)} और ${label(clue.right)} एक-दूसरे के पास नहीं हैं।`;
    if (clue.kind === "NOT_POSITION") return `${label(clue.box)} नीचे से ${ORDINAL.hi[clue.position as keyof typeof ORDINAL.hi]} स्थान पर नहीं है।`;
  } else {
    if (clue.kind === "ABOVE") return `${label(clue.upper)}, ${label(clue.lower)} ਤੋਂ ਉੱਪਰ ਹੈ।`;
    if (clue.kind === "IMMEDIATELY_ABOVE") return `${label(clue.upper)}, ${label(clue.lower)} ਦੇ ਠੀਕ ਉੱਪਰ ਹੈ।`;
    if (clue.kind === "BOXES_BETWEEN") return `${label(clue.left)} ਅਤੇ ${label(clue.right)} ਦੇ ਵਿਚਕਾਰ ਠੀਕ ${clue.count} ${betweenNoun(clue.count)}।`;
    if (clue.kind === "NOT_ADJACENT") return `${label(clue.left)} ਅਤੇ ${label(clue.right)} ਨਾਲ-ਨਾਲ ਨਹੀਂ ਹਨ।`;
    if (clue.kind === "NOT_POSITION") return `${label(clue.box)} ਹੇਠਾਂ ਤੋਂ ${ORDINAL.pa[clue.position as keyof typeof ORDINAL.pa]} ਸਥਾਨ 'ਤੇ ਨਹੀਂ ਹੈ।`;
  }
  throw new Error(`Unexpected LP-003 clue kind: ${clue.kind}`);
}

function polishLp003(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  const english = caselet.englishCaselet as any;
  const rows = finalRows(caselet.children[0]!);
  const label = (box: string) => rows[Number(english.assignment[box]) - 1]![1]!;
  const oldClues = [...caselet.learnerFacingClues];
  const normalizeSurface = (text: string) => {
    if (language !== "hi") return text;
    return text
      .replace(/(\S+)ें के बीच/gu, "$1ों के बीच")
      .replace(/(\S+)ाएँ के बीच/gu, "$1ाओं के बीच");
  };
  const rawNewClues = english.clues.map((clue: any) => lp003ClueText(language, clue, label));
  const newClues = rawNewClues.map(normalizeSurface);
  const ordinalize = (text: string) => language === "hi"
    ? text.replace(/नीचे से ([1-7])वें/gu, (_match, value: string) => `नीचे से ${ORDINAL.hi[Number(value) as keyof typeof ORDINAL.hi]}`)
    : text.replace(/ਹੇਠਾਂ ਤੋਂ ([1-7])ਵੇਂ/gu, (_match, value: string) => `ਹੇਠਾਂ ਤੋਂ ${ORDINAL.pa[Number(value) as keyof typeof ORDINAL.pa]}`);
  const polish = (text: string) => normalizeSurface(ordinalize(replaceAllClues(text, oldClues, newClues)));
  return {
    ...caselet,
    scenario: polish(caselet.scenario),
    learnerFacingClues: newClues,
    children: caselet.children.map((child) => ({
      ...child,
      stem: polish(child.stem),
      options: child.options.map(polish),
      answer: polish(child.answer),
      explanation: {
        summary: polish(child.explanation.summary),
        lines: child.explanation.lines.map(polish),
      },
    })),
  };
}

function neutralSelection(language: Lp001008LocalizedLanguage, text: string): string {
  let output = text;
  if (language === "hi") {
    output = output
      .replace(/यदि ([^\n.]+?) चुना जाता है, तो ([^\n.]+?) भी चुना जाता है।/gu, "यदि $1 का चयन होता है, तो $2 का भी चयन होता है।")
      .replace(/([^\n.]+?) और ([^\n.]+?) या तो दोनों चुने जाते हैं या दोनों नहीं।/gu, "$1 और $2—दोनों का चयन होता है या दोनों का नहीं।")
      .replace(/([^\n.]+?) और ([^\n.]+?) दोनों एक साथ नहीं चुने जा सकते।/gu, "$1 और $2—दोनों का एक साथ चयन नहीं हो सकता।")
      .replace(/([^\n.]+?) और ([^\n.]+?) में से ठीक एक चुना जाता है।/gu, "$1 और $2 में से ठीक एक का चयन होता है।")
      .replace(/([^\n.]+?) नहीं चुना जाता(?: है)?।/gu, "$1 का चयन नहीं होता है।")
      .replace(/([^\n.]+?) चुना जाता है।/gu, "$1 का चयन होता है।");
  } else {
    output = output
      .replace(/ਜੇ ([^\n.]+?) ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ, ਤਾਂ ([^\n.]+?) ਵੀ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।/gu, "ਜੇ $1 ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ, ਤਾਂ $2 ਦੀ ਵੀ ਚੋਣ ਹੁੰਦੀ ਹੈ।")
      .replace(/([^\n.]+?) ਅਤੇ ([^\n.]+?) ਜਾਂ ਦੋਵੇਂ ਚੁਣੇ ਜਾਂਦੇ ਹਨ ਜਾਂ ਦੋਵੇਂ ਨਹੀਂ।/gu, "$1 ਅਤੇ $2—ਦੋਵਾਂ ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ ਜਾਂ ਦੋਵਾਂ ਦੀ ਨਹੀਂ।")
      .replace(/([^\n.]+?) ਅਤੇ ([^\n.]+?) ਦੋਵੇਂ ਇਕੱਠੇ ਨਹੀਂ ਚੁਣੇ ਜਾ ਸਕਦੇ।/gu, "$1 ਅਤੇ $2—ਦੋਵਾਂ ਦੀ ਇਕੱਠੇ ਚੋਣ ਨਹੀਂ ਹੋ ਸਕਦੀ।")
      .replace(/([^\n.]+?) ਅਤੇ ([^\n.]+?) ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।/gu, "$1 ਅਤੇ $2 ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ।")
      .replace(/([^\n.]+?) ਨਹੀਂ ਚੁਣਿਆ ਜਾਂਦਾ(?: ਹੈ)?।/gu, "$1 ਦੀ ਚੋਣ ਨਹੀਂ ਹੁੰਦੀ।")
      .replace(/([^\n.]+?) ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ।/gu, "$1 ਦੀ ਚੋਣ ਹੁੰਦੀ ਹੈ।")
      .replaceAll("| ਨਹੀਂ ਚੁਣਿਆ |", "| ਚੋਣ ਨਹੀਂ ਹੋਈ |")
      .replaceAll("| ਚੁਣਿਆ |", "| ਚੋਣ ਹੋਈ |");
  }
  return output;
}

function polishLp004(language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  const polish = (text: string) => neutralSelection(language, text);
  return {
    ...caselet,
    scenario: polish(caselet.scenario),
    learnerFacingClues: caselet.learnerFacingClues.map(polish),
    children: caselet.children.map((child) => ({
      ...child,
      stem: polish(child.stem),
      options: child.options.map(polish),
      answer: polish(child.answer),
      explanation: {
        summary: polish(child.explanation.summary),
        lines: child.explanation.lines.map(polish),
      },
    })),
  };
}

function wrap(packageId: string, language: Lp001008LocalizedLanguage, caselet: Lp001008LocalizedCaselet): Lp001008LocalizedCaselet {
  if (packageId === "LP-003") return polishLp003(language, caselet);
  if (packageId === "LP-004") return polishLp004(language, caselet);
  return caselet;
}

export const LP_001_008_LOCALIZED_GENERATORS_V4 = Object.freeze(Object.fromEntries(
  Object.entries(LP_001_008_LOCALIZED_GENERATORS_V3).map(([packageId, generator]) => [
    packageId,
    (language: Lp001008LocalizedLanguage, seed = `${packageId.toLowerCase()}-localization-v4`, count = 8) =>
      generator(language, seed, count).map((caselet) => wrap(packageId, language, caselet)),
  ]),
) as Record<string, (language: Lp001008LocalizedLanguage, seed?: string, count?: number) => Lp001008LocalizedCaselet[]>);
