import { add, divide, multiply, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY } from "./english-authoring-final";
import { TSD_CP010_ENGLISH_REVIEW_CASES } from "./english-review-cases";
import type { TsdCp010ExecutableInput, TsdCp010ExecutableSolution } from "./executable-types";

export type TsdCp010ReviewLanguage = "hi" | "pa";

type Names = Readonly<{ first: string; second: string; third: string }>;

const HINDI_NAMES: readonly Names[] = Object.freeze([
  { first: "अर्जुन", second: "भारत", third: "चेतन" },
  { first: "कबीर", second: "मानव", third: "नवीन" },
  { first: "रवि", second: "साहिल", third: "दीपक" },
  { first: "अमन", second: "विक्रम", third: "करण" },
  { first: "नीरज", second: "मोहन", third: "रोहित" },
  { first: "रोहित", second: "दीपक", third: "सुमित" },
]);

const PUNJABI_NAMES: readonly Names[] = Object.freeze([
  { first: "ਅਰਜੁਨ", second: "ਭਾਰਤ", third: "ਚੇਤਨ" },
  { first: "ਕਬੀਰ", second: "ਮਾਨਵ", third: "ਨਵੀਨ" },
  { first: "ਰਵੀ", second: "ਸਾਹਿਲ", third: "ਦੀਪਕ" },
  { first: "ਅਮਨ", second: "ਵਿਕਰਮ", third: "ਕਰਨ" },
  { first: "ਨੀਰਜ", second: "ਮੋਹਨ", third: "ਰੋਹਿਤ" },
  { first: "ਰੋਹਿਤ", second: "ਦੀਪਕ", third: "ਸੁਮਿਤ" },
]);

function value(r: Rational) { return toMixedString(r); }
function metres(r: Rational, language: TsdCp010ReviewLanguage) { return `${value(r)} ${language === "hi" ? "मीटर" : "ਮੀਟਰ"}`; }
function seconds(r: Rational, language: TsdCp010ReviewLanguage) { return `${value(r)} ${language === "hi" ? "सेकंड" : "ਸਕਿੰਟ"}`; }
function speed(r: Rational, language: TsdCp010ReviewLanguage) { return `${value(r)} ${language === "hi" ? "मीटर/सेकंड" : "ਮੀਟਰ/ਸਕਿੰਟ"}`; }
function answerText(solution: TsdCp010ExecutableSolution, language: TsdCp010ReviewLanguage) {
  if (solution.unit === "METRE") return metres(solution.answer, language);
  if (solution.unit === "SECOND") return seconds(solution.answer, language);
  if (solution.unit === "METRE_PER_SECOND") return speed(solution.answer, language);
  if (solution.unit === "PERCENT") return `${value(solution.answer)}%`;
  return `${solution.answer.numerator}:${solution.answer.denominator}`;
}

function hindiStem(input: TsdCp010ExecutableInput, v: number, n: Names): string {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      if (input.target === "PERCENT_OF_RACE") {
        return `${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} की गति ${speed(input.winnerSpeed, "hi")} और ${n.second} की गति ${speed(input.loserSpeed, "hi")} है। दोनों एक साथ शुरू करते हैं। जब ${n.first} समाप्ति रेखा पर पहुँचता है, तब उसकी बढ़त पूरी दौड़ की लंबाई का कितने प्रतिशत है?`;
      }
      const variants = [
        `${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} और ${n.second} क्रमशः ${speed(input.winnerSpeed, "hi")} और ${speed(input.loserSpeed, "hi")} की समान गति बनाए रखते हैं। दोनों एक साथ शुरू करते हैं। जब ${n.first} समाप्ति रेखा पर पहुँचता है, तब ${n.second} के लिए कितनी दूरी बाकी होती है?`,
        `${n.first} और ${n.second} ${metres(input.raceDistance, "hi")} की सीधी दौड़ एक साथ शुरू करते हैं। उनकी गतियाँ ${speed(input.winnerSpeed, "hi")} और ${speed(input.loserSpeed, "hi")} हैं। ${n.first} के दौड़ पूरी करते समय ${n.second} समाप्ति रेखा से कितने मीटर पीछे होगा?`,
        `${metres(input.raceDistance, "hi")} की ट्रैक दौड़ में ${n.first} ${speed(input.winnerSpeed, "hi")} और ${n.second} ${speed(input.loserSpeed, "hi")} से दौड़ते हैं। शुरुआत एक साथ होती है। ${n.first} कितने मीटर की बढ़त से जीतता है?`,
        `एक ${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} की गति ${speed(input.winnerSpeed, "hi")} तथा ${n.second} की गति ${speed(input.loserSpeed, "hi")} है। ${n.first} के समाप्ति रेखा पार करते ही ${n.second} की समाप्ति रेखा से दूरी ज्ञात कीजिए।`,
        `दो धावक ${n.first} और ${n.second} ${metres(input.raceDistance, "hi")} की दौड़ एक साथ शुरू करते हैं। उनकी स्थिर गतियाँ ${speed(input.winnerSpeed, "hi")} और ${speed(input.loserSpeed, "hi")} हैं। जीत का दूरी-अंतर ज्ञात कीजिए।`,
        "",
      ];
      return variants[v]!;
    }
    case "finishTimeLeadState": {
      const variants = [
        `${n.first} और ${n.second} ${metres(input.raceDistance, "hi")} की दौड़ क्रमशः ${speed(input.winnerSpeed, "hi")} और ${speed(input.loserSpeed, "hi")} से दौड़ते हैं। दोनों एक साथ शुरू करते हैं। ${n.first}, ${n.second} से कितने सेकंड पहले समाप्ति रेखा पर पहुँचेगा?`,
        `${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} की गति ${speed(input.winnerSpeed, "hi")} और ${n.second} की ${speed(input.loserSpeed, "hi")} है। दोनों के समाप्ति समयों का अंतर ज्ञात कीजिए।`,
        `एक ट्रैक प्रतियोगिता की लंबाई ${metres(input.raceDistance, "hi")} है। ${n.first} ${speed(input.winnerSpeed, "hi")} और ${n.second} ${speed(input.loserSpeed, "hi")} की गति से दौड़ते हैं। ${n.first} के पहुँचने के कितने सेकंड बाद ${n.second} पहुँचेगा?`,
        `${n.first} ${metres(input.raceDistance, "hi")} की दूरी ${speed(input.winnerSpeed, "hi")} से तय करता है, जबकि ${n.second} वही दूरी ${speed(input.loserSpeed, "hi")} से तय करता है। समाप्ति समयों का अंतर कितना है?`,
        `${n.first} और ${n.second} एक साथ ${metres(input.raceDistance, "hi")} की दौड़ शुरू करते हैं। उनकी गतियाँ ${speed(input.winnerSpeed, "hi")} और ${speed(input.loserSpeed, "hi")} हैं। जीत का समय-अंतर ज्ञात कीजिए।`,
        `${metres(input.raceDistance, "hi")} की चयन दौड़ में ${n.first} ${speed(input.winnerSpeed, "hi")} और ${n.second} ${speed(input.loserSpeed, "hi")} से दौड़ता है। दोनों के समाप्ति रेखा तक पहुँचने के समय में कितने सेकंड का अंतर होगा?`,
      ];
      return variants[v]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") {
        const loserCovered = subtract(input.raceDistance, input.distanceLead);
        const variants = [
          `${metres(input.raceDistance, "hi")} की दौड़ में जब ${n.first} समाप्ति रेखा पर पहुँचता है, तब ${n.second} के लिए ${metres(input.distanceLead, "hi")} दूरी बाकी होती है। दोनों ने एक साथ शुरू किया और समान गति बनाए रखी। ${n.first}:${n.second} की गति का अनुपात ज्ञात कीजिए।`,
          `${n.first} और ${n.second} एक साथ दौड़ शुरू करते हैं। ${n.first} ${metres(input.raceDistance, "hi")} पूरा कर लेता है, जबकि उसी समय ${n.second} ${metres(loserCovered, "hi")} ही तय कर पाया है। उनकी गतियों का अनुपात ज्ञात कीजिए।`,
          `${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} के जीतते समय ${n.second} समाप्ति रेखा से ${metres(input.distanceLead, "hi")} पीछे है। स्थिर गति मानते हुए ${n.first}:${n.second} ज्ञात कीजिए।`,
          "",
          `${n.first} के ${metres(input.raceDistance, "hi")} पूरा करने तक ${n.second} को अभी ${metres(input.distanceLead, "hi")} दौड़ना बाकी है। दोनों की शुरुआत एक साथ हुई थी। गति अनुपात ज्ञात कीजिए।`,
          "",
        ];
        return variants[v]!;
      }
      const loserTime = add(input.winnerTime, input.timeLead);
      const variants = ["", `${n.first} दौड़ ${seconds(input.winnerTime, "hi")} में पूरी करता है और ${n.second}, ${seconds(input.timeLead, "hi")} बाद समाप्ति रेखा पर पहुँचता है। दोनों समान दूरी दौड़ते हैं। ${n.first}:${n.second} की गति का अनुपात ज्ञात कीजिए।`, "", `एक ही दूरी की दौड़ में ${n.first} का समय ${seconds(input.winnerTime, "hi")} और ${n.second} का समय ${seconds(loserTime, "hi")} है। गति अनुपात ${n.first}:${n.second} ज्ञात कीजिए।`, "", `${n.first} और ${n.second} समान दूरी दौड़ते हैं। ${n.first} ${seconds(input.winnerTime, "hi")} में पहुँचता है और ${n.second} उससे ${seconds(input.timeLead, "hi")} देर से पहुँचता है। दोनों की गति का अनुपात ज्ञात कीजिए।`];
      return variants[v]!;
    }
    case "raceLengthFromLeadEvidence": {
      if (input.mode === "DISTANCE_LEAD") {
        const variants = [
          `${n.first} ${speed(input.winnerSpeed, "hi")} और ${n.second} ${speed(input.loserSpeed, "hi")} से दौड़ते हैं। दोनों एक साथ शुरू करते हैं और जब ${n.first} समाप्ति रेखा पर पहुँचता है, तब ${n.second} के लिए ${metres(input.distanceLead, "hi")} बाकी है। दौड़ की लंबाई ज्ञात कीजिए।`,
          "",
          `एक दौड़ में ${n.first} की गति ${speed(input.winnerSpeed, "hi")} और ${n.second} की ${speed(input.loserSpeed, "hi")} है। ${n.first} के जीतते समय ${n.second} समाप्ति रेखा से ${metres(input.distanceLead, "hi")} पीछे है। पूरी दौड़ कितनी लंबी है?`,
          "",
          `अज्ञात लंबाई की दौड़ में ${n.first} ${speed(input.winnerSpeed, "hi")} और ${n.second} ${speed(input.loserSpeed, "hi")} से दौड़ते हैं। अंतिम दूरी-अंतर ${metres(input.distanceLead, "hi")} है। दौड़ की लंबाई ज्ञात कीजिए।`,
          "",
        ];
        return variants[v]!;
      }
      const variants = ["", `${n.first} की गति ${speed(input.winnerSpeed, "hi")} और ${n.second} की गति ${speed(input.loserSpeed, "hi")} है। एक ही दौड़ में ${n.first}, ${n.second} से ${seconds(input.timeLead, "hi")} पहले पहुँचता है। दौड़ की लंबाई ज्ञात कीजिए।`, "", `दो धावक ${n.first} और ${n.second} क्रमशः ${speed(input.winnerSpeed, "hi")} और ${speed(input.loserSpeed, "hi")} से एक अज्ञात दूरी दौड़ते हैं। समाप्ति समयों का अंतर ${seconds(input.timeLead, "hi")} है। दूरी ज्ञात कीजिए।`, "", `अज्ञात लंबाई की दौड़ में ${n.first} ${speed(input.winnerSpeed, "hi")} और ${n.second} ${speed(input.loserSpeed, "hi")} से दौड़ते हैं। ${n.first} के पहुँचने के ${seconds(input.timeLead, "hi")} बाद ${n.second} पहुँचता है। दौड़ की लंबाई ज्ञात कीजिए।`];
      return variants[v]!;
    }
    case "deadHeatHandicapState": {
      if (input.mode === "DISTANCE_HANDICAP") {
        return `${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} की गति ${speed(input.fasterSpeed, "hi")} और ${n.second} की ${speed(input.slowerSpeed, "hi")} है। यदि ${n.first} सामान्य शुरुआती रेखा से शुरू करे, तो ${n.second} को शुरुआती रेखा से कितने मीटर आगे से शुरू कराया जाए ताकि दोनों एक ही समय समाप्ति रेखा पर पहुँचें?`;
      }
      return `${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} ${speed(input.fasterSpeed, "hi")} और ${n.second} ${speed(input.slowerSpeed, "hi")} से दौड़ते हैं। ${n.second} समय शून्य पर शुरू करता है। ${n.first} को कितने सेकंड बाद शुरू कराया जाए ताकि दोनों एक ही समय समाप्ति रेखा पर पहुँचें?`;
    }
    case "leadConversionState": {
      if (input.mode === "DISTANCE_TO_TIME") {
        return `${n.first} के समाप्ति रेखा पर पहुँचने के समय ${n.second} के लिए ${metres(input.distanceLead!, "hi")} दूरी बाकी है। ${n.second} की गति ${speed(input.loserSpeed, "hi")} है। ${n.second}, ${n.first} के कितने सेकंड बाद दौड़ पूरी करेगा?`;
      }
      return `${n.first} समाप्ति रेखा पर ${n.second} से ${seconds(input.timeLead!, "hi")} पहले पहुँचता है। ${n.second} की गति ${speed(input.loserSpeed, "hi")} है। ${n.first} के पहुँचने के समय ${n.second} समाप्ति रेखा से कितनी दूरी पीछे होगा?`;
    }
    case "transitiveRaceComparison":
      return `समान ${metres(input.raceDistance, "hi")} की अलग-अलग दौड़ों में, ${n.first} के समाप्ति रेखा पर पहुँचने पर ${n.second} के लिए ${metres(input.aBeatsBBy, "hi")} बाकी रहता है; और ${n.second} के समाप्ति रेखा पर पहुँचने पर ${n.third} के लिए ${metres(input.bBeatsCBy, "hi")} बाकी रहता है। सभी की गति स्थिर है। ${n.first} के समाप्ति रेखा पर पहुँचने पर ${n.third} के लिए कितनी दूरी बाकी होगी?`;
    case "multiOutcomeRaceComparison":
      return `पहली ${metres(input.firstRaceDistance, "hi")} की दौड़ में ${n.first} के जीतने पर ${n.second} के लिए ${metres(input.firstRaceLead, "hi")} दूरी बाकी रहती है। दूसरी ${metres(input.secondRaceDistance, "hi")} की दौड़ में ${n.second} को शुरुआती रेखा से ${metres(input.secondRaceHeadStartForLoser, "hi")} आगे से शुरू कराया जाता है और ${n.first} सामान्य रेखा से शुरू करता है। दोनों की गति पहले जैसी रहती है। दूसरी दौड़ में ${n.first} कितने मीटर से जीतेगा?`;
    case "changedRaceOutcomeState": {
      if (input.mode === "FASTER_SPEED_CHANGE") return `${metres(input.raceDistance, "hi")} की दौड़ में पहले ${n.first} की गति ${speed(input.fasterSpeed, "hi")} और ${n.second} की ${speed(input.slowerSpeed, "hi")} थी। अब ${n.first} अपनी गति ${speed(input.changedFasterSpeed!, "hi")} कर देता है, जबकि ${n.second} की गति वही रहती है। दोनों एक साथ शुरू करते हैं। नई जीत की दूरी ज्ञात कीजिए।`;
      if (input.mode === "SLOWER_REST") return `${metres(input.raceDistance, "hi")} की दौड़ में ${n.first} ${speed(input.fasterSpeed, "hi")} और ${n.second} ${speed(input.slowerSpeed, "hi")} से दौड़ते हैं। दोनों साथ शुरू करते हैं, लेकिन ${n.second} रास्ते में कुल ${seconds(input.slowerRestTime!, "hi")} रुकता है; ${n.first} नहीं रुकता। ${n.first} के पहुँचने पर ${n.second} के लिए कितनी दूरी बाकी होगी?`;
      return `${metres(input.raceDistance, "hi")} की दौड़ में ${n.second} समय शून्य पर ${speed(input.slowerSpeed, "hi")} से शुरू करता है। ${n.first}, जिसकी गति ${speed(input.fasterSpeed, "hi")} है, ${seconds(input.fasterStartDelay!, "hi")} बाद शुरू करता है। यदि ${n.first} फिर भी पहले पहुँचता है, तो उसकी जीत की दूरी ज्ञात कीजिए।`;
    }
    case "runnerStateFromTwoRaceOutcomes":
      return `पहली ${metres(input.firstRaceDistance, "hi")} की दौड़ में ${n.first} के समाप्ति रेखा पर पहुँचने पर ${n.second} के लिए ${metres(input.firstRaceDistanceLead, "hi")} दूरी बाकी रहती है। दूसरी ${metres(input.secondRaceDistance, "hi")} की दौड़ में दोनों एक साथ शुरू करते हैं और ${n.first}, ${n.second} से ${seconds(input.secondRaceTimeLead, "hi")} पहले पहुँचता है। दोनों की गति दोनों दौड़ों में समान रहती है। ${input.target === "FASTER_SPEED" ? n.first : n.second} की गति ज्ञात कीजिए।`;
  }
}

function punjabiStem(input: TsdCp010ExecutableInput, v: number, n: Names): string {
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      if (input.target === "PERCENT_OF_RACE") return `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.loserSpeed, "pa")} ਹੈ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਜਦੋਂ ${n.first} ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ, ਉਸ ਦੀ ਬੜ੍ਹਤ ਪੂਰੀ ਦੌੜ ਦੀ ਲੰਬਾਈ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`;
      const variants = [
        `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਅਤੇ ${n.second} ਕ੍ਰਮਵਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${speed(input.loserSpeed, "pa")} ਦੀ ਇੱਕੋ ਰਫ਼ਤਾਰ ਬਣਾਈ ਰੱਖਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਜਦੋਂ ${n.first} ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ, ${n.second} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੁੰਦੀ ਹੈ?`,
        `${n.first} ਅਤੇ ${n.second} ${metres(input.raceDistance, "pa")} ਦੀ ਸਿੱਧੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${speed(input.loserSpeed, "pa")} ਹਨ। ${n.first} ਦੇ ਦੌੜ ਪੂਰੀ ਕਰਨ ਵੇਲੇ ${n.second} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ਕਿੰਨੇ ਮੀਟਰ ਪਿੱਛੇ ਹੋਵੇਗਾ?`,
        `${metres(input.raceDistance, "pa")} ਦੀ ਟਰੈਕ ਦੌੜ ਵਿੱਚ ${n.first} ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.loserSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${n.first} ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਬੜ੍ਹਤ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ਦੀ ${speed(input.loserSpeed, "pa")} ਹੈ। ${n.first} ਦੇ ਅੰਤਲੀ ਰੇਖਾ ਪਾਰ ਕਰਦੇ ਹੀ ${n.second} ਦੀ ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ਦੂਰੀ ਕੱਢੋ।`,
        `${n.first} ਅਤੇ ${n.second} ${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਸਥਿਰ ਰਫ਼ਤਾਰਾਂ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${speed(input.loserSpeed, "pa")} ਹਨ। ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
        "",
      ]; return variants[v]!;
    }
    case "finishTimeLeadState": {
      const variants = [
        `${n.first} ਅਤੇ ${n.second} ${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਕ੍ਰਮਵਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${speed(input.loserSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${n.first}, ${n.second} ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚੇਗਾ?`,
        `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ਦੀ ${speed(input.loserSpeed, "pa")} ਹੈ। ਦੋਵਾਂ ਦੇ ਪਹੁੰਚਣ ਦੇ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `ਇੱਕ ਟਰੈਕ ਦੌੜ ਦੀ ਲੰਬਾਈ ${metres(input.raceDistance, "pa")} ਹੈ। ${n.first} ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.loserSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${n.first} ਦੇ ਪਹੁੰਚਣ ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ${n.second} ਪਹੁੰਚੇਗਾ?`,
        `${n.first} ${metres(input.raceDistance, "pa")} ਦੀ ਦੂਰੀ ${speed(input.winnerSpeed, "pa")} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ, ਜਦਕਿ ${n.second} ਇਹੀ ਦੂਰੀ ${speed(input.loserSpeed, "pa")} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ। ਪਹੁੰਚਣ ਦੇ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
        `${n.first} ਅਤੇ ${n.second} ਇਕੱਠੇ ${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${speed(input.loserSpeed, "pa")} ਹਨ। ਜਿੱਤ ਦਾ ਸਮਾਂ-ਅੰਤਰ ਕੱਢੋ।`,
        `${metres(input.raceDistance, "pa")} ਦੀ ਚੋਣ ਦੌੜ ਵਿੱਚ ${n.first} ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.loserSpeed, "pa")} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਅੰਤਲੀ ਰੇਖਾ ਤੱਕ ਪਹੁੰਚਣ ਦੇ ਸਮਿਆਂ ਵਿੱਚ ਕਿੰਨੇ ਸਕਿੰਟ ਦਾ ਅੰਤਰ ਹੋਵੇਗਾ?`,
      ]; return variants[v]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") {
        const loserCovered = subtract(input.raceDistance, input.distanceLead);
        const variants = [
          `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ਜਦੋਂ ${n.first} ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ, ਤਾਂ ${n.second} ਲਈ ${metres(input.distanceLead, "pa")} ਦੂਰੀ ਬਾਕੀ ਹੁੰਦੀ ਹੈ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਹੋਏ ਅਤੇ ਸਥਿਰ ਰਫ਼ਤਾਰ ਨਾਲ ਦੌੜੇ। ${n.first}:${n.second} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
          `${n.first} ਅਤੇ ${n.second} ਇਕੱਠੇ ਦੌੜ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${n.first} ${metres(input.raceDistance, "pa")} ਪੂਰਾ ਕਰ ਲੈਂਦਾ ਹੈ, ਜਦਕਿ ਉਸੇ ਵੇਲੇ ${n.second} ${metres(loserCovered, "pa")} ਹੀ ਤੈਅ ਕਰ ਸਕਿਆ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
          `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${n.second} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ${metres(input.distanceLead, "pa")} ਪਿੱਛੇ ਹੈ। ਸਥਿਰ ਰਫ਼ਤਾਰ ਮੰਨ ਕੇ ${n.first}:${n.second} ਕੱਢੋ।`, "", `${n.first} ਦੇ ${metres(input.raceDistance, "pa")} ਪੂਰੇ ਕਰਨ ਤੱਕ ${n.second} ਲਈ ਹਾਲੇ ${metres(input.distanceLead, "pa")} ਦੌੜਨਾ ਬਾਕੀ ਹੈ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਹੋਏ ਸਨ। ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`, "",
        ]; return variants[v]!;
      }
      const loserTime = add(input.winnerTime, input.timeLead);
      const variants = ["", `${n.first} ਦੌੜ ${seconds(input.winnerTime, "pa")} ਵਿੱਚ ਪੂਰੀ ਕਰਦਾ ਹੈ ਅਤੇ ${n.second}, ${seconds(input.timeLead, "pa")} ਬਾਅਦ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ। ਦੋਵੇਂ ਇੱਕੋ ਦੂਰੀ ਦੌੜਦੇ ਹਨ। ${n.first}:${n.second} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`, "", `ਇੱਕੋ ਦੂਰੀ ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦਾ ਸਮਾਂ ${seconds(input.winnerTime, "pa")} ਅਤੇ ${n.second} ਦਾ ਸਮਾਂ ${seconds(loserTime, "pa")} ਹੈ। ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${n.first}:${n.second} ਕੱਢੋ।`, "", `${n.first} ਅਤੇ ${n.second} ਇੱਕੋ ਦੂਰੀ ਦੌੜਦੇ ਹਨ। ${n.first} ${seconds(input.winnerTime, "pa")} ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ ਅਤੇ ${n.second} ਉਸ ਤੋਂ ${seconds(input.timeLead, "pa")} ਦੇਰ ਨਾਲ ਪਹੁੰਚਦਾ ਹੈ। ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`]; return variants[v]!;
    }
    case "raceLengthFromLeadEvidence": {
      if (input.mode === "DISTANCE_LEAD") {
        const variants = [
          `${n.first} ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.loserSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ ਅਤੇ ਜਦੋਂ ${n.first} ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ, ਤਾਂ ${n.second} ਲਈ ${metres(input.distanceLead, "pa")} ਬਾਕੀ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`, "", `ਇੱਕ ਦੌੜ ਵਿੱਚ ${n.first} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ਦੀ ${speed(input.loserSpeed, "pa")} ਹੈ। ${n.first} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${n.second} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ${metres(input.distanceLead, "pa")} ਪਿੱਛੇ ਹੈ। ਪੂਰੀ ਦੌੜ ਕਿੰਨੀ ਲੰਬੀ ਹੈ?`, "", `ਅਣਜਾਣ ਲੰਬਾਈ ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.loserSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਅੰਤਲਾ ਦੂਰੀ-ਅੰਤਰ ${metres(input.distanceLead, "pa")} ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`, "",
        ]; return variants[v]!;
      }
      const variants = ["", `${n.first} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ਦੀ ${speed(input.loserSpeed, "pa")} ਹੈ। ਇੱਕੋ ਦੌੜ ਵਿੱਚ ${n.first}, ${n.second} ਤੋਂ ${seconds(input.timeLead, "pa")} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`, "", `ਦੋ ਧਾਵਕ ${n.first} ਅਤੇ ${n.second} ਕ੍ਰਮਵਾਰ ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${speed(input.loserSpeed, "pa")} ਨਾਲ ਅਣਜਾਣ ਦੂਰੀ ਦੌੜਦੇ ਹਨ। ਪਹੁੰਚਣ ਦੇ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ${seconds(input.timeLead, "pa")} ਹੈ। ਦੂਰੀ ਕੱਢੋ।`, "", `ਅਣਜਾਣ ਲੰਬਾਈ ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ${speed(input.winnerSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.loserSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${n.first} ਦੇ ਪਹੁੰਚਣ ਤੋਂ ${seconds(input.timeLead, "pa")} ਬਾਅਦ ${n.second} ਪਹੁੰਚਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`]; return variants[v]!;
    }
    case "deadHeatHandicapState":
      return input.mode === "DISTANCE_HANDICAP"
        ? `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.fasterSpeed, "pa")} ਅਤੇ ${n.second} ਦੀ ${speed(input.slowerSpeed, "pa")} ਹੈ। ਜੇ ${n.first} ਆਮ ਸ਼ੁਰੂਆਤੀ ਰੇਖਾ ਤੋਂ ਦੌੜੇ, ਤਾਂ ${n.second} ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਰੇਖਾ ਤੋਂ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ ਤਾਂ ਜੋ ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ?`
        : `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ${speed(input.fasterSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.slowerSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${n.second} ਸਮਾਂ ਸਿਫ਼ਰ 'ਤੇ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${n.first} ਨੂੰ ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ ਤਾਂ ਜੋ ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ?`;
    case "leadConversionState":
      return input.mode === "DISTANCE_TO_TIME"
        ? `${n.first} ਦੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ ਵੇਲੇ ${n.second} ਲਈ ${metres(input.distanceLead!, "pa")} ਦੂਰੀ ਬਾਕੀ ਹੈ। ${n.second} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.loserSpeed, "pa")} ਹੈ। ${n.second}, ${n.first} ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਦੌੜ ਪੂਰੀ ਕਰੇਗਾ?`
        : `${n.first} ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ${n.second} ਤੋਂ ${seconds(input.timeLead!, "pa")} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ${n.second} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.loserSpeed, "pa")} ਹੈ। ${n.first} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${n.second} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ਕਿੰਨੀ ਦੂਰੀ ਪਿੱਛੇ ਹੋਵੇਗਾ?`;
    case "transitiveRaceComparison":
      return `ਇੱਕੋ ${metres(input.raceDistance, "pa")} ਦੀਆਂ ਵੱਖ-ਵੱਖ ਦੌੜਾਂ ਵਿੱਚ, ${n.first} ਦੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ ਵੇਲੇ ${n.second} ਲਈ ${metres(input.aBeatsBBy, "pa")} ਬਾਕੀ ਰਹਿੰਦਾ ਹੈ; ਅਤੇ ${n.second} ਦੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ ਵੇਲੇ ${n.third} ਲਈ ${metres(input.bBeatsCBy, "pa")} ਬਾਕੀ ਰਹਿੰਦਾ ਹੈ। ਸਭ ਦੀ ਰਫ਼ਤਾਰ ਸਥਿਰ ਹੈ। ${n.first} ਦੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ ਵੇਲੇ ${n.third} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੋਵੇਗੀ?`;
    case "multiOutcomeRaceComparison":
      return `ਪਹਿਲੀ ${metres(input.firstRaceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${n.second} ਲਈ ${metres(input.firstRaceLead, "pa")} ਦੂਰੀ ਬਾਕੀ ਰਹਿੰਦੀ ਹੈ। ਦੂਜੀ ${metres(input.secondRaceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.second} ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਰੇਖਾ ਤੋਂ ${metres(input.secondRaceHeadStartForLoser, "pa")} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਂਦਾ ਹੈ ਅਤੇ ${n.first} ਆਮ ਰੇਖਾ ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਪਹਿਲਾਂ ਵਰਗੀ ਰਹਿੰਦੀ ਹੈ। ਦੂਜੀ ਦੌੜ ਵਿੱਚ ${n.first} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`;
    case "changedRaceOutcomeState": {
      if (input.mode === "FASTER_SPEED_CHANGE") return `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ਪਹਿਲਾਂ ${n.first} ਦੀ ਰਫ਼ਤਾਰ ${speed(input.fasterSpeed, "pa")} ਅਤੇ ${n.second} ਦੀ ${speed(input.slowerSpeed, "pa")} ਸੀ। ਹੁਣ ${n.first} ਆਪਣੀ ਰਫ਼ਤਾਰ ${speed(input.changedFasterSpeed!, "pa")} ਕਰ ਲੈਂਦਾ ਹੈ, ਜਦਕਿ ${n.second} ਦੀ ਰਫ਼ਤਾਰ ਉਹੀ ਰਹਿੰਦੀ ਹੈ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਨਵੀਂ ਜਿੱਤ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
      if (input.mode === "SLOWER_REST") return `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ${speed(input.fasterSpeed, "pa")} ਅਤੇ ${n.second} ${speed(input.slowerSpeed, "pa")} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ, ਪਰ ${n.second} ਰਸਤੇ ਵਿੱਚ ਕੁੱਲ ${seconds(input.slowerRestTime!, "pa")} ਰੁਕਦਾ ਹੈ; ${n.first} ਨਹੀਂ ਰੁਕਦਾ। ${n.first} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${n.second} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੋਵੇਗੀ?`;
      return `${metres(input.raceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.second} ਸਮਾਂ ਸਿਫ਼ਰ 'ਤੇ ${speed(input.slowerSpeed, "pa")} ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${n.first}, ਜਿਸ ਦੀ ਰਫ਼ਤਾਰ ${speed(input.fasterSpeed, "pa")} ਹੈ, ${seconds(input.fasterStartDelay!, "pa")} ਬਾਅਦ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਜੇ ${n.first} ਫਿਰ ਵੀ ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ, ਤਾਂ ਉਸ ਦੀ ਜਿੱਤ ਦੀ ਦੂਰੀ ਕੱਢੋ।`;
    }
    case "runnerStateFromTwoRaceOutcomes":
      return `ਪਹਿਲੀ ${metres(input.firstRaceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ${n.first} ਦੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ ਵੇਲੇ ${n.second} ਲਈ ${metres(input.firstRaceDistanceLead, "pa")} ਦੂਰੀ ਬਾਕੀ ਰਹਿੰਦੀ ਹੈ। ਦੂਜੀ ${metres(input.secondRaceDistance, "pa")} ਦੀ ਦੌੜ ਵਿੱਚ ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ ਅਤੇ ${n.first}, ${n.second} ਤੋਂ ${seconds(input.secondRaceTimeLead, "pa")} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ। ${input.target === "FASTER_SPEED" ? n.first : n.second} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`;
  }
}

function localizedExplanation(language: TsdCp010ReviewLanguage, input: TsdCp010ExecutableInput, solution: TsdCp010ExecutableSolution): readonly string[] {
  const answer = answerText(solution, language);
  if (language === "hi") {
    switch (input.authorityKey) {
      case "finishDistanceLeadState": return ["पहले तेज धावक का समाप्ति समय निकालें और उसी समय में दूसरे धावक द्वारा तय दूरी ज्ञात करें।", input.target === "PERCENT_OF_RACE" ? `प्राप्त दूरी-अंतर को पूरी दौड़ से भाग देकर 100 से गुणा करने पर ${answer} मिलता है।` : `पूरी दूरी में से दूसरे धावक की तय दूरी घटाने पर ${answer} मिलता है।`];
      case "finishTimeLeadState": return ["दोनों के लिए समय = दूरी ÷ गति से समाप्ति समय निकालें।", `धीमे धावक का समय minus तेज धावक का समय = ${answer}।`];
      case "raceSpeedRatioState": return ["एक ही दौड़ की समान दूरी/समान समय वाली जानकारी से दोनों गतियों का अनुपात बनाएं।", `अनुपात को सरल करने पर ${answer} मिलता है।`];
      case "raceLengthFromLeadEvidence": return ["दौड़ की लंबाई को अज्ञात मानकर दिए गए दूरी-अंतर या समय-अंतर की समीकरण बनाएं।", `दोनों गतियों को रखकर हल करने पर लंबाई ${answer} है।`];
      case "deadHeatHandicapState": return ["दोनों के सामान्य पूरा करने के समय/स्थान की तुलना करें।", `जो शुरुआती लाभ या विलंब इस अंतर को ठीक-ठीक संतुलित करता है, वह ${answer} है।`];
      case "leadConversionState": return ["यह अंतर धीमे धावक की बची दूरी और बचे समय का संबंध है।", `दूरी = गति × समय लगाने पर समतुल्य अंतर ${answer} है।`];
      case "transitiveRaceComparison": return ["पहली दौड़ से दूसरे धावक की गति का अनुपात और दूसरी से तीसरे का अनुपात निकालें।", `दोनों अनुपात जोड़ने नहीं, गुणा करने हैं; अंतिम दूरी-अंतर ${answer} है।`];
      case "multiOutcomeRaceComparison": return ["पहली दौड़ का परिणाम दोनों की गति का अनुपात तय करता है।", `उसी अनुपात को दूसरी दौड़ में दिए शुरुआती लाभ के साथ लगाने पर जीत का अंतर ${answer} है।`];
      case "changedRaceOutcomeState": return ["बदली हुई गति, रुकने का समय या देर से शुरुआत केवल बताए गए धावक पर लागू करें।", `तेज धावक के पहुँचने के क्षण दूसरे की स्थिति से अंतर ${answer} है।`];
      case "runnerStateFromTwoRaceOutcomes": return ["पहली दौड़ का दूरी-अंतर गति अनुपात देता है।", `दूसरी दौड़ का समय-अंतर उस अनुपात को वास्तविक गति में बदलता है; मांगी गई गति ${answer} है।`];
    }
  }
  switch (input.authorityKey) {
    case "finishDistanceLeadState": return ["ਪਹਿਲਾਂ ਤੇਜ਼ ਧਾਵਕ ਦਾ ਅੰਤਲੀ ਰੇਖਾ ਤੱਕ ਸਮਾਂ ਕੱਢੋ ਅਤੇ ਉਸੇ ਸਮੇਂ ਵਿੱਚ ਦੂਜੇ ਧਾਵਕ ਦੀ ਤੈਅ ਦੂਰੀ ਕੱਢੋ।", input.target === "PERCENT_OF_RACE" ? `ਮਿਲੀ ਦੂਰੀ-ਬੜ੍ਹਤ ਨੂੰ ਪੂਰੀ ਦੌੜ ਨਾਲ ਭਾਗ ਦੇ ਕੇ 100 ਨਾਲ ਗੁਣਾ ਕਰਨ 'ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।` : `ਪੂਰੀ ਦੂਰੀ ਵਿੱਚੋਂ ਦੂਜੇ ਧਾਵਕ ਦੀ ਤੈਅ ਦੂਰੀ ਘਟਾਉਣ 'ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`];
    case "finishTimeLeadState": return ["ਦੋਵਾਂ ਲਈ ਸਮਾਂ = ਦੂਰੀ ÷ ਰਫ਼ਤਾਰ ਨਾਲ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਕੱਢੋ।", `ਹੌਲੇ ਧਾਵਕ ਦਾ ਸਮਾਂ ਘਟਾ ਤੇਜ਼ ਧਾਵਕ ਦਾ ਸਮਾਂ = ${answer}।`];
    case "raceSpeedRatioState": return ["ਇੱਕੋ ਦੌੜ ਦੀ ਦੂਰੀ ਜਾਂ ਸਮੇਂ ਵਾਲੀ ਜਾਣਕਾਰੀ ਤੋਂ ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਬਣਾਓ।", `ਅਨੁਪਾਤ ਸਧਾਰਨ ਕਰਨ 'ਤੇ ${answer} ਮਿਲਦਾ ਹੈ।`];
    case "raceLengthFromLeadEvidence": return ["ਦੌੜ ਦੀ ਲੰਬਾਈ ਨੂੰ ਅਣਜਾਣ ਮੰਨ ਕੇ ਦਿੱਤੇ ਦੂਰੀ-ਅੰਤਰ ਜਾਂ ਸਮਾਂ-ਅੰਤਰ ਦੀ ਸਮੀਕਰਨ ਬਣਾਓ।", `ਦੋਵਾਂ ਰਫ਼ਤਾਰਾਂ ਨਾਲ ਹੱਲ ਕਰਨ 'ਤੇ ਲੰਬਾਈ ${answer} ਹੈ।`];
    case "deadHeatHandicapState": return ["ਦੋਵਾਂ ਦੇ ਆਮ ਪੂਰਾ ਕਰਨ ਦੇ ਸਮੇਂ ਜਾਂ ਸਥਾਨ ਦੀ ਤੁਲਨਾ ਕਰੋ।", `ਜੋ ਸ਼ੁਰੂਆਤੀ ਲਾਭ ਜਾਂ ਦੇਰੀ ਇਸ ਅੰਤਰ ਨੂੰ ਬਿਲਕੁਲ ਸੰਤੁਲਿਤ ਕਰਦੀ ਹੈ, ਉਹ ${answer} ਹੈ।`];
    case "leadConversionState": return ["ਇਹ ਅੰਤਰ ਹੌਲੇ ਧਾਵਕ ਦੀ ਬਾਕੀ ਦੂਰੀ ਅਤੇ ਬਾਕੀ ਸਮੇਂ ਨਾਲ ਜੁੜਿਆ ਹੈ।", `ਦੂਰੀ = ਰਫ਼ਤਾਰ × ਸਮਾਂ ਨਾਲ ਸਮਤੁੱਲ ਅੰਤਰ ${answer} ਹੈ।`];
    case "transitiveRaceComparison": return ["ਪਹਿਲੀ ਦੌੜ ਤੋਂ ਦੂਜੇ ਧਾਵਕ ਦਾ ਅਤੇ ਦੂਜੀ ਦੌੜ ਤੋਂ ਤੀਜੇ ਧਾਵਕ ਦਾ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।", `ਦੋਵੇਂ ਅਨੁਪਾਤ ਜੋੜਣੇ ਨਹੀਂ, ਗੁਣਾ ਕਰਨੇ ਹਨ; ਅੰਤਲਾ ਦੂਰੀ-ਅੰਤਰ ${answer} ਹੈ।`];
    case "multiOutcomeRaceComparison": return ["ਪਹਿਲੀ ਦੌੜ ਦਾ ਨਤੀਜਾ ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਤੈਅ ਕਰਦਾ ਹੈ।", `ਉਹੀ ਅਨੁਪਾਤ ਦੂਜੀ ਦੌੜ ਦੇ ਸ਼ੁਰੂਆਤੀ ਲਾਭ ਨਾਲ ਲਗਾਉਣ 'ਤੇ ਜਿੱਤ ਦਾ ਅੰਤਰ ${answer} ਹੈ।`];
    case "changedRaceOutcomeState": return ["ਬਦਲੀ ਰਫ਼ਤਾਰ, ਰੁਕਣ ਦਾ ਸਮਾਂ ਜਾਂ ਦੇਰ ਨਾਲ ਸ਼ੁਰੂਆਤ ਸਿਰਫ਼ ਦਿੱਤੇ ਧਾਵਕ 'ਤੇ ਲਗਾਓ।", `ਤੇਜ਼ ਧਾਵਕ ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ਦੂਜੇ ਦੀ ਸਥਿਤੀ ਤੋਂ ਅੰਤਰ ${answer} ਹੈ।`];
    case "runnerStateFromTwoRaceOutcomes": return ["ਪਹਿਲੀ ਦੌੜ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਦਿੰਦਾ ਹੈ।", `ਦੂਜੀ ਦੌੜ ਦਾ ਸਮਾਂ-ਅੰਤਰ ਉਸ ਅਨੁਪਾਤ ਨੂੰ ਅਸਲੀ ਰਫ਼ਤਾਰ ਵਿੱਚ ਬਦਲਦਾ ਹੈ; ਮੰਗੀ ਰਫ਼ਤਾਰ ${answer} ਹੈ।`];
  }
}

export const TSD_CP010_LOCALIZED_REVIEW = Object.freeze(
  (["hi", "pa"] as const).flatMap((language) =>
    TSD_CP010_ENGLISH_REVIEW_CASES.map((reviewCase, index) => {
      const ql = TSD_CP010_FINAL_ENGLISH_AUTHORING_REGISTRY.find((x) => x.qlId === reviewCase.qlId);
      if (!ql) throw new Error(`${reviewCase.qlId}: missing final English authority`);
      const family = ql.families.find((x) => x.familyId === reviewCase.familyId);
      if (!family) throw new Error(`${reviewCase.familyId}: missing final family`);
      const variant = Number(reviewCase.familyId.split("-").at(-1)!.charCodeAt(0) - 65);
      const names = (language === "hi" ? HINDI_NAMES : PUNJABI_NAMES)[variant]!;
      const stem = language === "hi" ? hindiStem(reviewCase.input, variant, names) : punjabiStem(reviewCase.input, variant, names);
      if (!stem) throw new Error(`${reviewCase.familyId}/${language}: native stem missing`);
      const explanationSteps = localizedExplanation(language, reviewCase.input, reviewCase.solution);
      const answer = answerText(reviewCase.solution, language);
      return Object.freeze({
        qlId: reviewCase.qlId,
        familyId: reviewCase.familyId,
        difficulty: family.difficulty,
        representation: family.representation,
        language,
        locale: language === "hi" ? "hi-IN" as const : "pa-IN" as const,
        stem,
        answer,
        explanation: Object.freeze({ steps: explanationSteps, conclusion: language === "hi" ? `उत्तर: ${answer}।` : `ਉੱਤਰ: ${answer}।` }),
        input: reviewCase.input,
        solution: reviewCase.solution,
      });
    }),
  ),
);

export const TSD_CP010_HINDI_REVIEW = Object.freeze(TSD_CP010_LOCALIZED_REVIEW.filter((x) => x.language === "hi"));
export const TSD_CP010_PUNJABI_REVIEW = Object.freeze(TSD_CP010_LOCALIZED_REVIEW.filter((x) => x.language === "pa"));
