import type { DayTimeClue, DayTimePerson, Lp010Child } from "./lp-010.ts";
import type { Lp010LocalizedCaselet, Lp010LocalizedLanguage } from "./lp-010-localization-v1.ts";
import { generateLp010LocalizedBatchV5, LP_010_HI_PA_LOCALIZATION_REVIEW_V5 } from "./lp-010-localization-v5.ts";

export const LP_010_HI_PA_LOCALIZATION_REVIEW_V6 = Object.freeze({
  ...LP_010_HI_PA_LOCALIZATION_REVIEW_V5,
  authorityId: "LP_010_HI_PA_LOCALIZATION_REVIEW_V6" as const,
  supersedes: LP_010_HI_PA_LOCALIZATION_REVIEW_V5.authorityId,
  status: "HUMAN_REVIEW_CANDIDATE_V6" as const,
  editorialFocus: "NATIVE_CASE_GRAMMAR_CLOSEOUT" as const,
});

const PEOPLE: readonly DayTimePerson[] = ["A", "B", "C", "D", "E", "F"];
function withText(clue: DayTimeClue, text: string): DayTimeClue { return { ...clue, text } as DayTimeClue; }
function tail(stem: string): string { return stem.split("\n\n").at(-1) ?? stem; }

function correctedRelationClue(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet, clue: DayTimeClue): DayTimeClue {
  const p = (person: DayTimePerson) => caselet.labels.people[person];
  if (language === "hi") {
    if (clue.kind === "PERSON_TIME") return withText(clue, `${p(clue.person)} का समय ${clue.timeLabel} है।`);
    if (clue.kind === "BEFORE") return withText(clue, `${p(clue.left)} को ${p(clue.right)} से पहले रखा गया है।`);
    if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${p(clue.right)} को ${p(clue.left)} के ठीक बाद रखा गया है।`);
    return clue;
  }
  if (clue.kind === "PERSON_TIME") return withText(clue, `${p(clue.person)} ਦਾ ਸਮਾਂ ${clue.timeLabel} ਹੈ।`);
  if (clue.kind === "BEFORE") return withText(clue, `${p(clue.left)} ਨੂੰ ${p(clue.right)} ਤੋਂ ਪਹਿਲਾਂ ਰੱਖਿਆ ਗਿਆ ਹੈ।`);
  if (clue.kind === "IMMEDIATE_BEFORE") return withText(clue, `${p(clue.right)} ਨੂੰ ${p(clue.left)} ਤੋਂ ਠੀਕ ਬਾਅਦ ਰੱਖਿਆ ਗਿਆ ਹੈ।`);
  return clue;
}

function targetPerson(caselet: Lp010LocalizedCaselet, child: Lp010Child): DayTimePerson | undefined {
  const text = tail(child.stem);
  return PEOPLE.find((person) => text.includes(caselet.englishCaselet.labels.people[person]));
}
function nextTail(language: Lp010LocalizedLanguage, profileId: string): string {
  if (language === "hi") {
    if (profileId === "STUDENT_PRESENTATIONS" || profileId === "RESEARCH_PRESENTATIONS") return "किसकी प्रस्तुति है?";
    if (profileId === "INTERVIEW_SCHEDULE") return "किसका इंटरव्यू है?";
    if (profileId === "TRAINING_DEMOS") return "किसका प्रदर्शन है?";
    if (profileId === "COUNSELLING_APPOINTMENTS") return "किसकी काउंसलिंग है?";
    return "किसकी समीक्षा बैठक है?";
  }
  if (profileId === "STUDENT_PRESENTATIONS" || profileId === "RESEARCH_PRESENTATIONS") return "ਕਿਸ ਦੀ ਪੇਸ਼ਕਾਰੀ ਹੈ?";
  if (profileId === "INTERVIEW_SCHEDULE") return "ਕਿਸ ਦਾ ਇੰਟਰਵਿਊ ਹੈ?";
  if (profileId === "TRAINING_DEMOS") return "ਕਿਸ ਦਾ ਪ੍ਰਦਰਸ਼ਨ ਹੈ?";
  if (profileId === "COUNSELLING_APPOINTMENTS") return "ਕਿਸ ਦੀ ਕਾਊਂਸਲਿੰਗ ਹੈ?";
  return "ਕਿਸ ਦੀ ਸਮੀਖਿਆ ਮੀਟਿੰਗ ਹੈ?";
}
function correctedNextQuestion(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet, englishChild: Lp010Child): string {
  const person = targetPerson(caselet, englishChild)!;
  return language === "hi"
    ? `दिए गए क्रम में ${caselet.labels.people[person]} के ठीक बाद ${nextTail(language, caselet.scenarioProfileId)}`
    : `ਦਿੱਤੇ ਕ੍ਰਮ ਵਿੱਚ ${caselet.labels.people[person]} ਤੋਂ ਠੀਕ ਬਾਅਦ ${nextTail(language, caselet.scenarioProfileId)}`;
}

function polish(language: Lp010LocalizedLanguage, caselet: Lp010LocalizedCaselet): Lp010LocalizedCaselet {
  const oldClues = caselet.clues;
  const clues = oldClues.map((clue) => correctedRelationClue(language, caselet, clue));
  const clueHeading = language === "hi" ? "शर्तें:" : "ਸ਼ਰਤਾਂ:";
  const children = caselet.children.map((child, index) => {
    const currentQuestion = tail(child.stem);
    const englishChild = caselet.englishCaselet.children[index]!;
    const question = child.qlId === "LP-QL-040" ? correctedNextQuestion(language, caselet, englishChild) : currentQuestion;
    const stem = `${caselet.questionSetup}\n\n${clueHeading}\n${clues.map((clue) => `- ${clue.text}`).join("\n")}\n\n${question}`;
    const explanation = {
      ...child.explanation,
      lines: child.explanation.lines.map((line) => {
        let rendered = line;
        for (let clueIndex = 0; clueIndex < oldClues.length; clueIndex += 1) rendered = rendered.split(oldClues[clueIndex]!.text).join(clues[clueIndex]!.text);
        return rendered;
      }),
    };
    return { ...child, stem, explanation };
  });
  return { ...caselet, clues, children };
}

export function generateLp010LocalizedBatchV6(language: Lp010LocalizedLanguage, seed = "lp-010-localization-review-v6", count = 8): Lp010LocalizedCaselet[] {
  return generateLp010LocalizedBatchV5(language, seed, count).map((caselet) => polish(language, caselet));
}
