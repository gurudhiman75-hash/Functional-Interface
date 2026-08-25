import { add, divide, multiply, rational, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { generateTsdCp010ExecutableCases } from "./executable-generator";
import { verifyTsdCp010 } from "./executable-verifier";
import type { TsdCp010ExecutableInput, TsdCp010ExecutableSolution } from "./executable-types";
import { TSD_CP010_NATIVE_FINAL_HINDI_REVIEW, TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW } from "./localization-native-final";
import { TSD_CP010_PERMANENT_QL_IDS, type TsdCp010QlId } from "./ql-allocation";

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID = "TSD-002" as const;
export const TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID = "TSD-CP-010" as const;
export const TSD_CP010_STUDIO_CANDIDATE_LANGUAGES = ["en", "hi", "pa"] as const;
export const TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES = ["EASY", "MEDIUM"] as const;
export const TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE = "TSD-CP-010-MULTILINGUAL-REVIEW-CANDIDATE-v5" as const;

export type TsdCp010StudioCandidateLanguage = (typeof TSD_CP010_STUDIO_CANDIDATE_LANGUAGES)[number];
export type TsdCp010StudioCandidateDifficulty = (typeof TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES)[number];

export type TsdCp010StudioCandidateRequest = Readonly<{
  language?: TsdCp010StudioCandidateLanguage;
  qlId?: TsdCp010QlId;
  familyId?: string;
  difficulty?: TsdCp010StudioCandidateDifficulty;
  count?: number;
  seed?: string;
}>;

function value(r: Rational) { return toMixedString(r); }
function metres(r: Rational, language: TsdCp010StudioCandidateLanguage) {
  return `${value(r)} ${language === "hi" ? "मीटर" : language === "pa" ? "ਮੀਟਰ" : "m"}`;
}
function seconds(r: Rational, language: TsdCp010StudioCandidateLanguage) {
  return `${value(r)} ${language === "hi" ? "सेकंड" : language === "pa" ? "ਸਕਿੰਟ" : "seconds"}`;
}
function speed(r: Rational, language: TsdCp010StudioCandidateLanguage) {
  return `${value(r)} ${language === "hi" ? "मीटर/सेकंड" : language === "pa" ? "ਮੀਟਰ/ਸਕਿੰਟ" : "m/s"}`;
}
function answerText(solution: TsdCp010ExecutableSolution, language: TsdCp010StudioCandidateLanguage) {
  if (solution.unit === "RATIO") return `${solution.answer.numerator}:${solution.answer.denominator}`;
  if (solution.unit === "PERCENT") return `${value(solution.answer)}%`;
  if (solution.unit === "METRE") return metres(solution.answer, language);
  if (solution.unit === "SECOND") return seconds(solution.answer, language);
  return speed(solution.answer, language);
}

function finishDistanceLead(input: Extract<TsdCp010ExecutableInput, { authorityKey: "finishDistanceLeadState" }>) {
  return subtract(input.raceDistance, multiply(input.loserSpeed, divide(input.raceDistance, input.winnerSpeed)));
}

function presentationTokens(input: TsdCp010ExecutableInput, language: TsdCp010StudioCandidateLanguage): readonly string[] {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const winnerTime = divide(input.raceDistance, input.winnerSpeed);
      const lead = finishDistanceLead(input);
      return Object.freeze([
        metres(input.raceDistance, language),
        speed(input.winnerSpeed, language),
        speed(input.loserSpeed, language),
        seconds(winnerTime, language),
        metres(lead, language),
        metres(multiply(input.loserSpeed, winnerTime), language),
      ]);
    }
    case "finishTimeLeadState":
      return Object.freeze([
        metres(input.raceDistance, language),
        speed(input.winnerSpeed, language),
        speed(input.loserSpeed, language),
        seconds(divide(input.raceDistance, input.winnerSpeed), language),
        seconds(divide(input.raceDistance, input.loserSpeed), language),
      ]);
    case "raceSpeedRatioState":
      return input.mode === "DISTANCE_LEAD"
        ? Object.freeze([metres(input.raceDistance, language), metres(input.distanceLead, language), metres(subtract(input.raceDistance, input.distanceLead), language)])
        : Object.freeze([seconds(input.winnerTime, language), seconds(input.timeLead, language), seconds(add(input.winnerTime, input.timeLead), language)]);
    case "raceLengthFromLeadEvidence":
      return input.mode === "DISTANCE_LEAD"
        ? Object.freeze([speed(input.winnerSpeed, language), speed(input.loserSpeed, language), metres(input.distanceLead, language)])
        : Object.freeze([speed(input.winnerSpeed, language), speed(input.loserSpeed, language), seconds(input.timeLead, language)]);
    case "deadHeatHandicapState":
      return Object.freeze([metres(input.raceDistance, language), speed(input.fasterSpeed, language), speed(input.slowerSpeed, language)]);
    case "leadConversionState":
      return input.mode === "DISTANCE_TO_TIME"
        ? Object.freeze([speed(input.loserSpeed, language), metres(input.distanceLead!, language)])
        : Object.freeze([speed(input.loserSpeed, language), seconds(input.timeLead!, language)]);
    case "transitiveRaceComparison":
      return Object.freeze([metres(input.raceDistance, language), metres(input.aBeatsBBy, language), metres(input.bBeatsCBy, language)]);
    case "multiOutcomeRaceComparison":
      return Object.freeze([
        metres(input.firstRaceDistance, language),
        metres(input.firstRaceLead, language),
        metres(input.secondRaceDistance, language),
        metres(input.secondRaceHeadStartForLoser, language),
      ]);
    case "changedRaceOutcomeState":
      if (input.mode === "FASTER_SPEED_CHANGE") {
        return Object.freeze([
          metres(input.raceDistance, language),
          speed(input.fasterSpeed, language),
          speed(input.slowerSpeed, language),
          speed(input.changedFasterSpeed!, language),
          speed(subtract(input.changedFasterSpeed!, input.fasterSpeed), language),
        ]);
      }
      if (input.mode === "SLOWER_REST") {
        return Object.freeze([metres(input.raceDistance, language), speed(input.fasterSpeed, language), speed(input.slowerSpeed, language), seconds(input.slowerRestTime!, language)]);
      }
      return Object.freeze([metres(input.raceDistance, language), speed(input.fasterSpeed, language), speed(input.slowerSpeed, language), seconds(input.fasterStartDelay!, language)]);
    case "runnerStateFromTwoRaceOutcomes":
      return Object.freeze([
        metres(input.firstRaceDistance, language),
        metres(input.firstRaceDistanceLead, language),
        metres(input.secondRaceDistance, language),
        seconds(input.secondRaceTimeLead, language),
      ]);
  }
}

function shape(input: TsdCp010ExecutableInput): string {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": return `${input.authorityKey}:${input.target}`;
    case "raceSpeedRatioState": return `${input.authorityKey}:${input.mode}`;
    case "raceLengthFromLeadEvidence": return `${input.authorityKey}:${input.mode}`;
    case "deadHeatHandicapState": return `${input.authorityKey}:${input.mode}`;
    case "leadConversionState": return `${input.authorityKey}:${input.mode}`;
    case "changedRaceOutcomeState": return `${input.authorityKey}:${input.mode}`;
    case "runnerStateFromTwoRaceOutcomes": return `${input.authorityKey}:${input.target}`;
    default: return input.authorityKey;
  }
}

type TokenPair = readonly [from: string, to: string];

function replacementPairs(
  sourceInput: TsdCp010ExecutableInput,
  candidateInput: TsdCp010ExecutableInput,
  sourceSolution: TsdCp010ExecutableSolution,
  candidateSolution: TsdCp010ExecutableSolution,
  language: TsdCp010StudioCandidateLanguage,
): readonly TokenPair[] {
  const sourceTokens = presentationTokens(sourceInput, language);
  const candidateTokens = presentationTokens(candidateInput, language);
  if (sourceTokens.length !== candidateTokens.length) throw new Error("CP010 presentation token shape mismatch");
  const pairs: TokenPair[] = sourceTokens.map((from, index) => [from, candidateTokens[index]!] as const);
  pairs.push([answerText(sourceSolution, language), answerText(candidateSolution, language)] as const);
  return Object.freeze(pairs);
}

function countOccurrences(text: string, token: string) {
  if (!token) return 0;
  let count = 0;
  let cursor = 0;
  while (cursor <= text.length - token.length) {
    const at = text.indexOf(token, cursor);
    if (at < 0) break;
    count += 1;
    cursor = at + token.length;
  }
  return count;
}

function replaceOccurrences(text: string, token: string, targets: readonly string[]): string | undefined {
  const occurrences = countOccurrences(text, token);
  if (occurrences === 0) return text;
  const uniqueTargets = new Set(targets);
  if (uniqueTargets.size === 1) return text.split(token).join(targets[0]!);
  if (occurrences !== targets.length) return undefined;

  let out = "";
  let cursor = 0;
  for (const target of targets) {
    const at = text.indexOf(token, cursor);
    if (at < 0) return undefined;
    out += text.slice(cursor, at) + target;
    cursor = at + token.length;
  }
  out += text.slice(cursor);
  return out;
}

function rebind(text: string, pairs: readonly TokenPair[]): string | undefined {
  const grouped = new Map<string, string[]>();
  for (const [from, to] of pairs) {
    const targets = grouped.get(from) ?? [];
    targets.push(to);
    grouped.set(from, targets);
  }

  let value = text;
  const groups = [...grouped.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, targets] of groups) {
    const next = replaceOccurrences(value, from, targets);
    if (next === undefined) return undefined;
    value = next;
  }
  return value;
}

function explanationFor(
  input: TsdCp010ExecutableInput,
  solution: TsdCp010ExecutableSolution,
  language: TsdCp010StudioCandidateLanguage,
): Readonly<{ steps: readonly string[]; conclusion: string }> {
  const answer = answerText(solution, language);
  const en = (a: string, b: string) => Object.freeze({ steps: Object.freeze([a, b]), conclusion: `Answer: ${answer}.` });
  const hi = (a: string, b: string) => Object.freeze({ steps: Object.freeze([a, b]), conclusion: `उत्तर: ${answer}।` });
  const pa = (a: string, b: string) => Object.freeze({ steps: Object.freeze([a, b]), conclusion: `ਉੱਤਰ: ${answer}।` });

  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const t = divide(input.raceDistance, input.winnerSpeed);
      const lead = finishDistanceLead(input);
      if (language === "hi") return hi(`तेज धावक का समय ${seconds(t, language)} है; इतने समय में दूसरा धावक ${metres(multiply(input.loserSpeed, t), language)} तय करता है।`, input.target === "PERCENT_OF_RACE" ? `दूरी-अंतर ${metres(lead, language)} को पूरी दौड़ से भाग देकर 100 से गुणा करें।` : `पूरी दूरी में से दूसरे धावक की तय दूरी घटाएँ।`);
      if (language === "pa") return pa(`ਤੇਜ਼ ਧਾਵਕ ਦਾ ਸਮਾਂ ${seconds(t, language)} ਹੈ; ਇਸ ਸਮੇਂ ਵਿੱਚ ਦੂਜਾ ਧਾਵਕ ${metres(multiply(input.loserSpeed, t), language)} ਤੈਅ ਕਰਦਾ ਹੈ।`, input.target === "PERCENT_OF_RACE" ? `ਦੂਰੀ-ਅੰਤਰ ${metres(lead, language)} ਨੂੰ ਪੂਰੀ ਦੌੜ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰੋ।` : `ਪੂਰੀ ਦੂਰੀ ਵਿੱਚੋਂ ਦੂਜੇ ਧਾਵਕ ਦੀ ਤੈਅ ਦੂਰੀ ਘਟਾਓ।`);
      return en(`Winner time is ${seconds(t, language)}; in that time the slower racer covers ${metres(multiply(input.loserSpeed, t), language)}.`, input.target === "PERCENT_OF_RACE" ? `Convert the ${metres(lead, language)} lead to a percentage of the full race.` : `Subtract the slower racer's distance from the full race.`);
    }
    case "finishTimeLeadState": {
      const fast = divide(input.raceDistance, input.winnerSpeed);
      const slow = divide(input.raceDistance, input.loserSpeed);
      if (language === "hi") return hi(`दोनों का समय दूरी ÷ गति से क्रमशः ${seconds(fast, language)} और ${seconds(slow, language)} है।`, `धीमे धावक के समय में से तेज धावक का समय घटाएँ।`);
      if (language === "pa") return pa(`ਦੋਵਾਂ ਦੇ ਸਮੇਂ ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ ਨਾਲ ਕ੍ਰਮਵਾਰ ${seconds(fast, language)} ਅਤੇ ${seconds(slow, language)} ਹਨ।`, `ਹੌਲੇ ਧਾਵਕ ਦੇ ਸਮੇਂ ਵਿੱਚੋਂ ਤੇਜ਼ ਧਾਵਕ ਦਾ ਸਮਾਂ ਘਟਾਓ।`);
      return en(`The finish times are ${seconds(fast, language)} and ${seconds(slow, language)}.`, `Subtract the faster time from the slower time.`);
    }
    case "raceSpeedRatioState":
      if (language === "hi") return hi(input.mode === "DISTANCE_LEAD" ? `एक ही समय में तय दूरियों का अनुपात गति-अनुपात देता है।` : `समान दूरी के लिए गति-अनुपात समय-अनुपात का उलटा होता है।`, `दिए मानों से अनुपात सरल करें।`);
      if (language === "pa") return pa(input.mode === "DISTANCE_LEAD" ? `ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਤੈਅ ਦੂਰੀਆਂ ਦਾ ਅਨੁਪਾਤ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਦਿੰਦਾ ਹੈ।` : `ਇੱਕੋ ਦੂਰੀ ਲਈ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਸਮਿਆਂ ਦੇ ਅਨੁਪਾਤ ਦਾ ਉਲਟ ਹੈ।`, `ਦਿੱਤੇ ਅੰਕਾਂ ਨਾਲ ਅਨੁਪਾਤ ਸਧਾਰਨ ਕਰੋ।`);
      return en(input.mode === "DISTANCE_LEAD" ? `At the same instant, the covered-distance ratio equals the speed ratio.` : `For equal distance, the speed ratio is the inverse finish-time ratio.`, `Simplify the resulting ratio.`);
    case "raceLengthFromLeadEvidence":
      if (language === "hi") return hi(`दौड़ की लंबाई D मानकर दिए दूरी-अंतर या समय-अंतर की समीकरण बनाएं।`, `दोनों स्थिर गतियाँ रखकर D हल करें।`);
      if (language === "pa") return pa(`ਦੌੜ ਦੀ ਲੰਬਾਈ D ਮੰਨ ਕੇ ਦਿੱਤੇ ਦੂਰੀ-ਅੰਤਰ ਜਾਂ ਸਮਾਂ-ਅੰਤਰ ਦੀ ਸਮੀਕਰਨ ਬਣਾਓ।`, `ਦੋਵਾਂ ਸਥਿਰ ਰਫ਼ਤਾਰਾਂ ਨਾਲ D ਕੱਢੋ।`);
      return en(`Let the race length be D and express the stated distance/time lead using D.`, `Substitute both constant speeds and solve for D.`);
    case "deadHeatHandicapState":
      if (language === "hi") return hi(`सामान्य दौड़ में दोनों के पूरा करने के समय/स्थान का अंतर निकालें।`, `यही अंतर शुरुआती दूरी-लाभ या तेज धावक के विलंब के रूप में देने पर दोनों एक साथ पहुँचते हैं।`);
      if (language === "pa") return pa(`ਆਮ ਦੌੜ ਵਿੱਚ ਦੋਵਾਂ ਦੇ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਜਾਂ ਸਥਾਨ ਦਾ ਅੰਤਰ ਕੱਢੋ।`, `ਇਹੀ ਅੰਤਰ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ-ਲਾਭ ਜਾਂ ਤੇਜ਼ ਧਾਵਕ ਦੀ ਦੇਰੀ ਵਜੋਂ ਦੇਣ ਨਾਲ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਦੇ ਹਨ।`);
      return en(`Find the ordinary finish distance/time advantage of the faster racer.`, `Use that exact advantage as the slower racer's head start or the faster racer's delay.`);
    case "leadConversionState":
      if (language === "hi") return hi(`धीमे धावक की बची दूरी और बचे समय का संबंध दूरी = गति × समय है।`, `दिए अंतर को धीमे धावक की गति से बदलें।`);
      if (language === "pa") return pa(`ਹੌਲੇ ਧਾਵਕ ਦੀ ਬਾਕੀ ਦੂਰੀ ਅਤੇ ਬਾਕੀ ਸਮੇਂ ਲਈ ਦੂਰੀ = ਰਫ਼ਤਾਰ × ਸਮਾਂ ਵਰਤੋ।`, `ਦਿੱਤੇ ਅੰਤਰ ਨੂੰ ਹੌਲੇ ਧਾਵਕ ਦੀ ਰਫ਼ਤਾਰ ਨਾਲ ਬਦਲੋ।`);
      return en(`The remaining distance and remaining time are linked by distance = speed × time.`, `Convert the stated lead using the loser's speed.`);
    case "transitiveRaceComparison":
      if (language === "hi") return hi(`पहले A:B और फिर B:C के लिए हारने वाले की तय दूरी को पूरी दौड़ के अंश के रूप में लिखें।`, `दोनों अंश गुणा करके C की स्थिति निकालें और शेष दूरी लें।`);
      if (language === "pa") return pa(`ਪਹਿਲਾਂ A:B ਅਤੇ ਫਿਰ B:C ਲਈ ਹਾਰਨ ਵਾਲੇ ਦੀ ਤੈਅ ਦੂਰੀ ਨੂੰ ਪੂਰੀ ਦੌੜ ਦੇ ਹਿੱਸੇ ਵਜੋਂ ਲਿਖੋ।`, `ਦੋਵੇਂ ਹਿੱਸੇ ਗੁਣਾ ਕਰਕੇ C ਦੀ ਸਥਿਤੀ ਅਤੇ ਬਾਕੀ ਦੂਰੀ ਕੱਢੋ।`);
      return en(`Convert each pairwise result to the loser's covered fraction of the race.`, `Multiply the fractions to locate the third racer when the first racer finishes.`);
    case "multiOutcomeRaceComparison":
      if (language === "hi") return hi(`पहली दौड़ से दोनों धावकों की गति का अनुपात तय करें।`, `उसी अनुपात को दूसरी दूरी पर लगाकर धीमे धावक के शुरुआती लाभ को एक बार जोड़ें।`);
      if (language === "pa") return pa(`ਪਹਿਲੀ ਦੌੜ ਤੋਂ ਦੋਵਾਂ ਧਾਵਕਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਤੈਅ ਕਰੋ।`, `ਉਹੀ ਅਨੁਪਾਤ ਦੂਜੀ ਦੂਰੀ 'ਤੇ ਲਗਾ ਕੇ ਹੌਲੇ ਧਾਵਕ ਦਾ ਸ਼ੁਰੂਆਤੀ ਲਾਭ ਇੱਕ ਵਾਰ ਜੋੜੋ।`);
      return en(`Use race one to determine the constant speed ratio.`, `Apply that ratio in race two and include the slower racer's starting advantage once.`);
    case "changedRaceOutcomeState":
      if (language === "hi") return hi(`केवल बताई गई बदली गति, विश्राम या देर से शुरुआत लागू करें; बाकी गति वही रखें।`, `तेज धावक के पहुँचने के समय दूसरे की तय दूरी निकालकर पूरी दूरी से घटाएँ।`);
      if (language === "pa") return pa(`ਸਿਰਫ਼ ਦਿੱਤੀ ਬਦਲੀ ਰਫ਼ਤਾਰ, ਆਰਾਮ ਜਾਂ ਦੇਰ ਨਾਲ ਸ਼ੁਰੂਆਤ ਲਗਾਓ; ਬਾਕੀ ਰਫ਼ਤਾਰ ਉਹੀ ਰੱਖੋ।`, `ਤੇਜ਼ ਧਾਵਕ ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ਦੂਜੇ ਦੀ ਤੈਅ ਦੂਰੀ ਕੱਢ ਕੇ ਪੂਰੀ ਦੂਰੀ ਵਿੱਚੋਂ ਘਟਾਓ।`);
      return en(`Apply only the declared speed/rest/start change while keeping the other state unchanged.`, `Find the slower racer's position at the faster finish and subtract from the race length.`);
    case "runnerStateFromTwoRaceOutcomes":
      if (language === "hi") return hi(`पहली दौड़ का दूरी-अंतर धीमे/तेज गति का अनुपात देता है।`, `दूसरी दौड़ के समय-अंतर से उस अनुपात का वास्तविक गति-पैमाना निकालें।`);
      if (language === "pa") return pa(`ਪਹਿਲੀ ਦੌੜ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਹੌਲੀ/ਤੇਜ਼ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਦਿੰਦਾ ਹੈ।`, `ਦੂਜੀ ਦੌੜ ਦੇ ਸਮਾਂ-ਅੰਤਰ ਨਾਲ ਉਸ ਅਨੁਪਾਤ ਦੀ ਅਸਲ ਰਫ਼ਤਾਰ ਕੱਢੋ।`);
      return en(`Use race one to get the slower/faster speed ratio.`, `Use race two's absolute time gap to recover the requested speed.`);
  }
}

function alternativeSolutions(solution: TsdCp010ExecutableSolution): readonly TsdCp010ExecutableSolution[] {
  if (solution.unit === "RATIO") {
    const n = solution.answer.numerator;
    const d = solution.answer.denominator;
    return Object.freeze([
      Object.freeze({ ...solution, answer: rational(n + d, d) }),
      Object.freeze({ ...solution, answer: rational(n, n + d) }),
      Object.freeze({ ...solution, answer: rational(n + 2n * d, d) }),
    ]);
  }
  return Object.freeze([1, 2, 3].map((delta) => Object.freeze({ ...solution, answer: add(solution.answer, rational(delta)) })));
}

function hash(value: string) {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function optionsFor(solution: TsdCp010ExecutableSolution, language: TsdCp010StudioCandidateLanguage, seed: string) {
  const values = [answerText(solution, language), ...alternativeSolutions(solution).map((x) => answerText(x, language))];
  if (new Set(values).size !== 4) throw new Error(`CP010 candidate options are not unique for ${answerText(solution, language)}`);
  const correct = values[0]!;
  const shift = hash(seed) % 4;
  const options = values.map((_value, index) => values[(index + shift) % 4]!);
  return Object.freeze({ options: Object.freeze(options), correctIndex: options.indexOf(correct) });
}

type ReviewSource = Readonly<{
  qlId: string;
  familyId: string;
  difficulty: "EASY" | "MEDIUM";
  representation: string;
  stem: string;
  input: TsdCp010ExecutableInput;
  solution: TsdCp010ExecutableSolution;
}>;

function sources(language: TsdCp010StudioCandidateLanguage): readonly ReviewSource[] {
  if (language === "hi") return TSD_CP010_NATIVE_FINAL_HINDI_REVIEW as readonly ReviewSource[];
  if (language === "pa") return TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW as readonly ReviewSource[];
  return TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW as readonly ReviewSource[];
}

function qlForAuthority(authorityKey: TsdCp010ExecutableInput["authorityKey"]): TsdCp010QlId {
  const source = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.find((question) => question.input.authorityKey === authorityKey);
  if (!source) throw new Error(`${authorityKey}: CP010 QL mapping missing`);
  return source.qlId as TsdCp010QlId;
}

const EXECUTABLE_CASES = generateTsdCp010ExecutableCases();

function allCompatible(language: TsdCp010StudioCandidateLanguage) {
  const out: Array<Readonly<{
    qlId: TsdCp010QlId;
    familyId: string;
    caseId: string;
    difficultyBand: "EASY" | "MEDIUM";
    representation: string;
    language: TsdCp010StudioCandidateLanguage;
    locale: "en-IN" | "hi-IN" | "pa-IN";
    stem: string;
    answer: string;
    explanation: Readonly<{ steps: readonly string[]; conclusion: string }>;
    input: TsdCp010ExecutableInput;
    solution: TsdCp010ExecutableSolution;
  }>> = [];

  for (const source of sources(language)) {
    for (const candidate of EXECUTABLE_CASES) {
      if (candidate.authorityKey !== source.input.authorityKey) continue;
      if (shape(candidate.input) !== shape(source.input)) continue;
      const verification = verifyTsdCp010(candidate.input, candidate.expected);
      if (!verification.accepted) continue;
      const pairs = replacementPairs(source.input, candidate.input, source.solution, candidate.expected, language);
      const stem = rebind(source.stem, pairs);
      if (stem === undefined) continue;
      out.push(Object.freeze({
        qlId: qlForAuthority(candidate.authorityKey),
        familyId: source.familyId,
        caseId: candidate.caseId,
        difficultyBand: source.difficulty,
        representation: source.representation,
        language,
        locale: language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN",
        stem,
        answer: answerText(candidate.expected, language),
        explanation: explanationFor(candidate.input, candidate.expected, language),
        input: candidate.input,
        solution: candidate.expected,
      }));
    }
  }

  const keys = new Set<string>();
  const stems = new Set<string>();
  const deduped: typeof out = [];
  for (const item of out) {
    const key = `${item.familyId}:${item.caseId}`;
    if (keys.has(key)) throw new Error(`${language}/${key}: duplicate CP010 family-case combination`);
    keys.add(key);
    if (stems.has(item.stem)) continue;
    stems.add(item.stem);
    deduped.push(item);
  }
  return Object.freeze(deduped);
}

const ALL_BY_LANGUAGE = Object.freeze(Object.fromEntries(
  TSD_CP010_STUDIO_CANDIDATE_LANGUAGES.map((language) => [language, allCompatible(language)]),
) as Record<TsdCp010StudioCandidateLanguage, ReturnType<typeof allCompatible>>);

export const TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE = ALL_BY_LANGUAGE.en.length;
export const TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS = TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE * 3;

if (ALL_BY_LANGUAGE.hi.length !== ALL_BY_LANGUAGE.en.length || ALL_BY_LANGUAGE.pa.length !== ALL_BY_LANGUAGE.en.length) {
  throw new Error(`CP010 Studio multilingual capacity mismatch: en=${ALL_BY_LANGUAGE.en.length}, hi=${ALL_BY_LANGUAGE.hi.length}, pa=${ALL_BY_LANGUAGE.pa.length}`);
}
if (TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE < 400) {
  throw new Error(`CP010 Studio capacity fell below quality floor: ${TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE}/locale`);
}

export const TSD_CP010_STUDIO_CANDIDATE_PACKAGE = Object.freeze({
  packageId: TSD_CP010_STUDIO_CANDIDATE_PACKAGE_ID,
  checkpointId: TSD_CP010_STUDIO_CANDIDATE_CHECKPOINT_ID,
  runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
  permanentQlIds: TSD_CP010_PERMANENT_QL_IDS,
  supportedLanguages: TSD_CP010_STUDIO_CANDIDATE_LANGUAGES,
  supportedDifficulties: TSD_CP010_STUDIO_CANDIDATE_DIFFICULTIES,
  compatibleCombinationsPerLocale: TSD_CP010_STUDIO_COMPATIBLE_COMBINATIONS_PER_LOCALE,
  deterministicMultilingualCombinations: TSD_CP010_STUDIO_MULTILINGUAL_COMBINATIONS,
  sourceStatus: "MULTILINGUAL_REVIEW_CANDIDATE" as const,
  questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
  questionStudioStagingStatus: "DISABLED_PENDING_PRODUCT_OWNER_APPROVAL" as const,
  routeMounted: false as const,
  productionSelectorVisible: false as const,
  persistenceAllowed: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  mockTestEligible: false as const,
  automaticStudentPublication: false as const,
  optionPolicy: "EXACTLY_FOUR_UNIQUE_OPTIONS" as const,
  verificationPolicy: "EXACT_SOLVER_PLUS_INDEPENDENT_VERIFIER" as const,
  variationPolicy: "HUMAN_FAMILY_X_SEMANTICALLY_COMPATIBLE_EXECUTABLE_CASE" as const,
  numericRebindingPolicy: "OCCURRENCE_AWARE_EQUAL_SOURCE_VALUE_SAFE" as const,
  duplicateStemPolicy: "DROP_DUPLICATE_RENDERED_STEM" as const,
});

function shuffled<T>(items: readonly T[], seed: string) {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let index = out.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [out[index], out[swapIndex]] = [out[swapIndex]!, out[index]!];
  }
  return out;
}

export function previewTsdCp010StudioCandidate(request: TsdCp010StudioCandidateRequest = {}) {
  const language = request.language ?? "en";
  const count = Math.max(1, Math.floor(request.count ?? 5));
  const seed = request.seed ?? "cp010-studio-candidate";
  const selected = ALL_BY_LANGUAGE[language].filter((question) =>
    (!request.qlId || question.qlId === request.qlId) &&
    (!request.familyId || question.familyId === request.familyId) &&
    (!request.difficulty || question.difficultyBand === request.difficulty));
  if (!selected.length) throw new Error("No CP010 review-candidate combinations match the requested filters.");
  if (count > selected.length) throw new Error(`Requested ${count} questions but only ${selected.length} unique CP010 candidate combinations match the filters.`);

  const questions = shuffled(selected, `${seed}:${language}`).slice(0, count).map((source, index) => {
    const verification = verifyTsdCp010(source.input, source.solution);
    if (!verification.accepted) throw new Error(`${source.familyId}/${source.caseId}: independent verifier rejected Studio candidate`);
    const optionModel = optionsFor(source.solution, language, `${seed}:${source.familyId}:${source.caseId}:${index}`);
    return Object.freeze({
      questionId: `TSD-CP010-${language}-${source.familyId}-${source.caseId.split("-").at(-1)}-${hash(`${seed}:${index}`).toString(16)}`,
      canonicalItemId: `TSD-CP010-${source.familyId}-${source.caseId.split("-").at(-1)}`,
      questionLanguageId: `TSD-CP010-${source.familyId}-${source.caseId.split("-").at(-1)}-${language}`,
      ...source,
      options: optionModel.options,
      correctIndex: optionModel.correctIndex,
      runtimeMode: TSD_CP010_STUDIO_CANDIDATE_RUNTIME_MODE,
      reviewStatus: "REVIEW_CANDIDATE_NOT_APPROVED" as const,
      questionStudioRegistrationStatus: "NOT_REGISTERED" as const,
      persistenceAllowed: false as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      validation: Object.freeze({ exactSolverBacked: true, independentVerifierAccepted: true, fourUniqueOptions: true, semanticShapeCompatible: true, occurrenceAwareRebinding: true }),
    });
  });

  return Object.freeze({
    package: TSD_CP010_STUDIO_CANDIDATE_PACKAGE,
    request: Object.freeze({ ...request, language, count, seed }),
    availableCombinationsUnderFilters: selected.length,
    questions: Object.freeze(questions),
  });
}
