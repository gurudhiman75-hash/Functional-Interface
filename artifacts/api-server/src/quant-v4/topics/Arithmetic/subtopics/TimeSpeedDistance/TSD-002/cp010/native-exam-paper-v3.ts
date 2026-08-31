import { add, divide, multiply, rational, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput } from "./executable-types";

export type TsdCp010NativeV3Language = "hi" | "pa";

const HI = Object.freeze([
  ["अजय", "विजय", "संजय"], ["रवि", "मोहन", "सोहन"], ["अमन", "करण", "वरुण"],
  ["दीपक", "रोहित", "सुमित"], ["नीरज", "मनीष", "दिनेश"], ["कबीर", "साहिल", "नवीन"],
] as const);
const PA = Object.freeze([
  ["ਅਜੈ", "ਵਿਜੈ", "ਸੰਜੈ"], ["ਰਵੀ", "ਮੋਹਨ", "ਸੋਹਨ"], ["ਅਮਨ", "ਕਰਨ", "ਵਰੁਣ"],
  ["ਦੀਪਕ", "ਰੋਹਿਤ", "ਸੁਮਿਤ"], ["ਨੀਰਜ", "ਮਨੀਸ਼", "ਦਿਨੇਸ਼"], ["ਕਬੀਰ", "ਸਾਹਿਲ", "ਨਵੀਨ"],
] as const);

function familyIndex(familyId: string) {
  const i = familyId.charCodeAt(familyId.length - 1) - 65;
  if (i < 0 || i > 5) throw new Error(`${familyId}: invalid CP010 native V3 family`);
  return i;
}
function value(r: Rational) { return toMixedString(r); }
function hiM(r: Rational) { return `${value(r)} मीटर`; }
function hiS(r: Rational) { return `${value(r)} सेकंड`; }
function hiV(r: Rational) { return `${value(r)} मीटर/सेकंड`; }
function paM(r: Rational) { return `${value(r)} ਮੀਟਰ`; }
function paS(r: Rational) { return `${value(r)} ਸਕਿੰਟ`; }
function paV(r: Rational) { return `${value(r)} ਮੀਟਰ/ਸਕਿੰਟ`; }
function ratioText(a: Rational, b: Rational) { return `${value(a)}:${value(b)}`; }
function capability(aSpeed: Rational, bSpeed: Rational) {
  const distance = multiply(multiply(aSpeed, bSpeed), rational(5));
  return Object.freeze({ distance, aTime: divide(distance, aSpeed), bTime: divide(distance, bSpeed) });
}

function hindi(familyId: string, input: TsdCp010ExecutableInput): string {
  const i = familyIndex(familyId); const [a, b, c] = HI[i]!;
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      if (input.target === "PERCENT_OF_RACE") return `${a} ${hiM(cap.distance)} को ${hiS(cap.aTime)} में और ${b} उसी दूरी को ${hiS(cap.bTime)} में दौड़ता है। ${hiM(input.raceDistance)} की दौड़ में ${a} की जीत कुल दूरी का कितने प्रतिशत होगी?`;
      return [
        `${a} ${hiM(cap.distance)} को ${hiS(cap.aTime)} में और ${b} ${hiS(cap.bTime)} में दौड़ता है। ${hiM(input.raceDistance)} की दौड़ में ${a}, ${b} को कितने मीटर से हराएगा?`,
        `${hiM(cap.distance)} दौड़ने में ${a} को ${hiS(cap.aTime)} और ${b} को ${hiS(cap.bTime)} लगते हैं। ${hiM(input.raceDistance)} की दौड़ में जीत का अंतर ज्ञात कीजिए।`,
        `समान ${hiM(cap.distance)} दूरी के लिए ${a} का समय ${hiS(cap.aTime)} और ${b} का ${hiS(cap.bTime)} है। ${hiM(input.raceDistance)} की दौड़ में ${a} के पहुँचने पर ${b} कितने मीटर पीछे होगा?`,
        `${a} और ${b} की गतियों का अनुपात ${ratioText(input.winnerSpeed, input.loserSpeed)} है। ${hiM(input.raceDistance)} की दौड़ में ${a} कितने मीटर से जीतेगा?`,
        `${a}:${b} की गति का अनुपात ${ratioText(input.winnerSpeed, input.loserSpeed)} है। यदि दौड़ ${hiM(input.raceDistance)} की हो, तो ${a} की जीत कितने मीटर की होगी?`,
        "",
      ][i]!;
    }
    case "finishTimeLeadState": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      return [
        `${a} ${hiM(cap.distance)} को ${hiS(cap.aTime)} में और ${b} ${hiS(cap.bTime)} में दौड़ता है। ${hiM(input.raceDistance)} की दौड़ में ${a}, ${b} को कितने सेकंड से हराएगा?`,
        `${hiM(cap.distance)} के लिए ${a} का समय ${hiS(cap.aTime)} और ${b} का ${hiS(cap.bTime)} है। ${hiM(input.raceDistance)} की दौड़ में दोनों के समय का अंतर ज्ञात कीजिए।`,
        `समान ${hiM(cap.distance)} दूरी ${a} ${hiS(cap.aTime)} में तथा ${b} ${hiS(cap.bTime)} में तय करता है। ${hiM(input.raceDistance)} में ${a} कितने सेकंड पहले पहुँचेगा?`,
        `${a}:${b} की गति का अनुपात ${ratioText(input.winnerSpeed, input.loserSpeed)} है। ${hiM(input.raceDistance)} की दौड़ में जीत का समय ज्ञात कीजिए।`,
        `दो धावकों की गति का अनुपात ${ratioText(input.winnerSpeed, input.loserSpeed)} है। ${hiM(input.raceDistance)} में तेज धावक कितने सेकंड से जीतेगा?`,
        `${a} की गति ${hiV(input.winnerSpeed)} और ${b} की ${hiV(input.loserSpeed)} है। ${hiM(input.raceDistance)} की दौड़ में समय का अंतर कितना होगा?`,
      ][i]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") return [
        `${hiM(input.raceDistance)} की दौड़ में ${a}, ${b} को ${hiM(input.distanceLead)} से हराता है। उनकी गतियों का अनुपात ज्ञात कीजिए।`,
        `${a}, ${b} को ${hiM(input.distanceLead)} से हराता है जबकि दौड़ ${hiM(input.raceDistance)} की है। ${a}:${b} की गति का अनुपात क्या है?`,
        `${a} के ${hiM(input.raceDistance)} पूरा करने पर ${b} समाप्ति रेखा से ${hiM(input.distanceLead)} पीछे है। गति अनुपात ज्ञात कीजिए।`,
        `${hiM(input.raceDistance)} की दौड़ में ${a} की ${b} पर जीत ${hiM(input.distanceLead)} है। उनकी गतियों का अनुपात क्या है?`,
        `${a} और ${b} साथ शुरू करते हैं। ${a} ${hiM(input.raceDistance)} पूरा करता है और ${b} ${hiM(input.distanceLead)} पीछे रहता है। ${a}:${b} ज्ञात कीजिए।`,
        `${a}, ${b} को ${hiM(input.raceDistance)} में ${hiM(input.distanceLead)} से हराता है। ${a} की गति : ${b} की गति ज्ञात कीजिए।`,
      ][i]!;
      const loserTime = add(input.winnerTime, input.timeLead);
      return [
        `${a} दौड़ ${hiS(input.winnerTime)} में पूरी करता है और ${b} को ${hiS(input.timeLead)} से हराता है। उनकी गतियों का अनुपात ज्ञात कीजिए।`,
        `${a} का समय ${hiS(input.winnerTime)} है और ${b} ${hiS(input.timeLead)} बाद पहुँचता है। ${a}:${b} की गति का अनुपात क्या है?`,
        `एक ही दूरी में ${a} का समय ${hiS(input.winnerTime)} तथा ${b} का ${hiS(loserTime)} है। गति अनुपात ज्ञात कीजिए।`,
        `${a}, ${b} को ${hiS(input.timeLead)} से हराता है और स्वयं ${hiS(input.winnerTime)} लेता है। दोनों की गति का अनुपात क्या है?`,
        `समान दूरी के लिए ${a} ${hiS(input.winnerTime)} लेता है और ${b} उससे ${hiS(input.timeLead)} अधिक। ${a}:${b} ज्ञात कीजिए।`,
        `${a} ${hiS(input.winnerTime)} में पहुँचता है; ${b} को ${hiS(input.timeLead)} अधिक लगते हैं। गति अनुपात ज्ञात कीजिए।`,
      ][i]!;
    }
    case "raceLengthFromLeadEvidence": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      if (input.mode === "DISTANCE_LEAD") return [
        `${a} ${hiM(cap.distance)} को ${hiS(cap.aTime)} में और ${b} ${hiS(cap.bTime)} में दौड़ता है। यदि ${a}, ${b} को ${hiM(input.distanceLead)} से हराता है, तो दौड़ की लंबाई ज्ञात कीजिए।`,
        `${a}:${b} की गति का अनुपात ${ratioText(input.winnerSpeed, input.loserSpeed)} है। ${a} की जीत ${hiM(input.distanceLead)} है। दौड़ की दूरी ज्ञात कीजिए।`,
        `${hiM(cap.distance)} के लिए ${a} और ${b} के समय ${hiS(cap.aTime)} और ${hiS(cap.bTime)} हैं। एक दौड़ में ${a} ${hiM(input.distanceLead)} से जीतता है। कुल दूरी कितनी है?`,
        `${a} ${hiV(input.winnerSpeed)} और ${b} ${hiV(input.loserSpeed)} से दौड़ता है। ${a} ${hiM(input.distanceLead)} से जीतता है। दौड़ की लंबाई क्या है?`,
        `${a}:${b} की गति का अनुपात ${ratioText(input.winnerSpeed, input.loserSpeed)} और जीत ${hiM(input.distanceLead)} की है। कुल दूरी ज्ञात कीजिए।`,
        `${a} की गति ${hiV(input.winnerSpeed)} तथा ${b} की ${hiV(input.loserSpeed)} है। ${a} की जीत ${hiM(input.distanceLead)} हो तो दौड़ कितनी लंबी है?`,
      ][i]!;
      return [
        `${a} ${hiM(cap.distance)} को ${hiS(cap.aTime)} में और ${b} ${hiS(cap.bTime)} में दौड़ता है। यदि ${a}, ${b} को ${hiS(input.timeLead)} से हराता है, तो दौड़ की दूरी ज्ञात कीजिए।`,
        `${a} की गति ${hiV(input.winnerSpeed)} और ${b} की ${hiV(input.loserSpeed)} है। ${a} ${hiS(input.timeLead)} पहले पहुँचता है। दौड़ की लंबाई ज्ञात कीजिए।`,
        `${hiM(cap.distance)} के लिए ${a} और ${b} के समय ${hiS(cap.aTime)} और ${hiS(cap.bTime)} हैं। एक दौड़ में जीत का समय ${hiS(input.timeLead)} है। कुल दूरी क्या है?`,
        `दो धावकों की गतियाँ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। उनके पहुँचने के समय में ${hiS(input.timeLead)} का अंतर है। दौड़ की दूरी ज्ञात कीजिए।`,
        `${a}:${b} की गति का अनुपात ${ratioText(input.winnerSpeed, input.loserSpeed)} है। ${a} ${hiS(input.timeLead)} से जीतता है। दौड़ की लंबाई कितनी है?`,
        `${a}, ${b} को ${hiS(input.timeLead)} से हराता है। उनकी गतियाँ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। दौड़ कितनी लंबी है?`,
      ][i]!;
    }
    case "deadHeatHandicapState": {
      const cap = capability(input.fasterSpeed, input.slowerSpeed);
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${a} ${hiM(cap.distance)} को ${hiS(cap.aTime)} में और ${b} ${hiS(cap.bTime)} में दौड़ता है। ${hiM(input.raceDistance)} की दौड़ बराबरी पर समाप्त हो, तो ${b} को कितने मीटर आगे से शुरू कराया जाए?`,
        `${hiM(cap.distance)} के लिए ${a} और ${b} के समय ${hiS(cap.aTime)} और ${hiS(cap.bTime)} हैं। ${hiM(input.raceDistance)} की दौड़ में ${b} को कितनी शुरुआती दूरी दी जाए कि दोनों साथ पहुँचें?`,
        `${a}:${b} की गति का अनुपात ${ratioText(input.fasterSpeed, input.slowerSpeed)} है। ${hiM(input.raceDistance)} की दौड़ में बराबरी के लिए ${b} को कितने मीटर आगे से शुरू कराया जाए?`,
        `${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से दौड़ता है। ${hiM(input.raceDistance)} में दोनों साथ पहुँचें, इसके लिए ${b} को कितनी दूरी की बढ़त दी जाए?`,
        `${hiM(input.raceDistance)} की दौड़ में गति अनुपात ${ratioText(input.fasterSpeed, input.slowerSpeed)} है। बराबरी के लिए धीमे धावक को कितने मीटर की शुरुआती बढ़त चाहिए?`,
        `${a} तेज और ${b} धीमा है। उनकी गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। ${hiM(input.raceDistance)} में दोनों साथ पहुँचें तो ${b} कितने मीटर आगे से शुरू करे?`,
      ][i]!;
      return [
        `${a} ${hiM(cap.distance)} को ${hiS(cap.aTime)} में और ${b} ${hiS(cap.bTime)} में दौड़ता है। ${hiM(input.raceDistance)} की दौड़ बराबरी पर हो, तो ${b}, ${a} से कितने सेकंड पहले शुरू करे?`,
        `${hiM(cap.distance)} के लिए ${a} और ${b} के समय ${hiS(cap.aTime)} और ${hiS(cap.bTime)} हैं। ${hiM(input.raceDistance)} में दोनों साथ पहुँचें तो ${a} कितने सेकंड देर से शुरू करे?`,
        `${a}:${b} की गति का अनुपात ${ratioText(input.fasterSpeed, input.slowerSpeed)} है। ${hiM(input.raceDistance)} की दौड़ में बराबरी के लिए ${a} की शुरुआत कितने सेकंड रोकी जाए?`,
        `${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से दौड़ता है। ${hiM(input.raceDistance)} में दोनों साथ पहुँचें तो ${a} कितने सेकंड बाद शुरू करे?`,
        `${hiM(input.raceDistance)} की दौड़ में गति अनुपात ${ratioText(input.fasterSpeed, input.slowerSpeed)} है। धीमे धावक को कितने सेकंड पहले शुरू कराया जाए?`,
        `${b} पहले शुरू करता है। ${a} और ${b} की गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। ${hiM(input.raceDistance)} की दौड़ बराबरी पर हो तो ${a} कितने सेकंड बाद शुरू करे?`,
      ][i]!;
    }
    case "leadConversionState":
      if (input.mode === "DISTANCE_TO_TIME") return [
        `${a}, ${b} को ${hiM(input.distanceLead!)} से हराता है। यदि ${b} की गति ${hiV(input.loserSpeed)} है, तो ${a} कितने सेकंड से जीता?`,
        `${a} की ${b} पर जीत ${hiM(input.distanceLead!)} की है और ${b} की गति ${hiV(input.loserSpeed)} है। यही जीत समय में कितनी है?`,
        `${a} के पहुँचने पर ${b} समाप्ति रेखा से ${hiM(input.distanceLead!)} पीछे है और ${hiV(input.loserSpeed)} से दौड़ रहा है। ${b} कितने सेकंड बाद पहुँचेगा?`,
        `${a}, ${b} को ${hiM(input.distanceLead!)} से हराता है। ${b} ${hiV(input.loserSpeed)} से दौड़ता है। इस दूरी को तय करने में उसे कितना समय लगेगा?`,
        `${a} के जीतते समय ${b} को ${hiM(input.distanceLead!)} बाकी है। उसकी गति ${hiV(input.loserSpeed)} है। जीत का समय ज्ञात कीजिए।`,
        `${a}, ${b} को ${hiM(input.distanceLead!)} से हराता है और ${b} की गति ${hiV(input.loserSpeed)} है। बराबर समय-अंतर कितने सेकंड है?`,
      ][i]!;
      return [
        `${a}, ${b} को ${hiS(input.timeLead!)} से हराता है। यदि ${b} ${hiV(input.loserSpeed)} से दौड़ता है, तो जीत कितने मीटर की है?`,
        `${a}, ${b} से ${hiS(input.timeLead!)} पहले पहुँचता है। ${b} की गति ${hiV(input.loserSpeed)} है। ${a} के पहुँचने पर ${b} कितने मीटर पीछे था?`,
        `${b}, ${a} के ${hiS(input.timeLead!)} बाद पहुँचता है और उसकी गति ${hiV(input.loserSpeed)} है। ${a} की जीत कितने मीटर की है?`,
        `${a} की ${b} पर जीत ${hiS(input.timeLead!)} की है। ${b} की गति ${hiV(input.loserSpeed)} हो तो इसे मीटर में व्यक्त कीजिए।`,
        `${a} ${hiS(input.timeLead!)} से जीतता है जबकि ${b} ${hiV(input.loserSpeed)} से दौड़ता है। ${a} के पहुँचने पर ${b} के लिए कितनी दूरी बाकी थी?`,
        `${b}, ${a} के पहुँचने के बाद ${hiS(input.timeLead!)} और दौड़ता है तथा उसकी गति ${hiV(input.loserSpeed)} है। ${a} कितने मीटर से जीता?`,
      ][i]!;
    case "transitiveRaceComparison": return [
      `${hiM(input.raceDistance)} की अलग-अलग दौड़ों में ${a}, ${b} को ${hiM(input.aBeatsBBy)} से और ${b}, ${c} को ${hiM(input.bBeatsCBy)} से हराता है। ${a}, ${c} को कितने मीटर से हराएगा?`,
      `${a}, ${b} को ${hiM(input.aBeatsBBy)} से हराता है और समान ${hiM(input.raceDistance)} की दूसरी दौड़ में ${b}, ${c} को ${hiM(input.bBeatsCBy)} से। ${a} की ${c} पर जीत ज्ञात कीजिए।`,
      `${hiM(input.raceDistance)} की दौड़ में ${a}, ${b} को ${hiM(input.aBeatsBBy)} की शुरुआत दे सकता है और ${b}, ${c} को ${hiM(input.bBeatsCBy)} की। ${a}, ${c} को कितनी शुरुआत दे सकता है?`,
      `दो अलग ${hiM(input.raceDistance)} की दौड़ों के परिणाम हैं: ${a} ने ${b} को ${hiM(input.aBeatsBBy)} से और ${b} ने ${c} को ${hiM(input.bBeatsCBy)} से हराया। ${a} के पहुँचने पर ${c} कितना पीछे होगा?`,
      `${a}, ${b}, ${c} स्थिर गति से दौड़ते हैं। ${hiM(input.raceDistance)} में ${a}, ${b} को ${hiM(input.aBeatsBBy)} और ${b}, ${c} को ${hiM(input.bBeatsCBy)} से हराता है। ${a} की ${c} पर जीत ज्ञात कीजिए।`,
      `यदि ${hiM(input.raceDistance)} की दौड़ों में ${a}, ${b} को ${hiM(input.aBeatsBBy)} और ${b}, ${c} को ${hiM(input.bBeatsCBy)} से हराता है, तो ${a}, ${c} को कितने मीटर से हराएगा?`,
    ][i]!;
    case "multiOutcomeRaceComparison": return [
      `${a}, ${b} को ${hiM(input.firstRaceDistance)} की दौड़ में ${hiM(input.firstRaceLead)} से हराता है। ${hiM(input.secondRaceDistance)} की दौड़ में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू कराया जाए, तो ${a} कितने मीटर से जीतेगा?`,
      `${hiM(input.firstRaceDistance)} में ${a}, ${b} को ${hiM(input.firstRaceLead)} से हराता है। यदि दूसरी दौड़ ${hiM(input.secondRaceDistance)} की हो और ${b} ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू करे, तो परिणाम क्या होगा?`,
      `${a}, ${b} को ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceLead)} की शुरुआत दे सकता है। ${hiM(input.secondRaceDistance)} में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} की शुरुआत मिले तो कौन कितने मीटर से जीतेगा?`,
      `${a} ने ${b} को ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceLead)} से हराया। ${hiM(input.secondRaceDistance)} की दूसरी दौड़ में ${b} ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू करता है। ${a} की जीत ज्ञात कीजिए।`,
      `पहली ${hiM(input.firstRaceDistance)} की दौड़ में ${b} ${hiM(input.firstRaceLead)} से हारता है। दूसरी ${hiM(input.secondRaceDistance)} में उसे ${hiM(input.secondRaceHeadStartForLoser)} की शुरुआती बढ़त मिलती है। ${a} कितने मीटर से जीतेगा?`,
      `${a}, ${b} को ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceLead)} से हराता है। ${hiM(input.secondRaceDistance)} में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू कराया जाता है। ${a} के पहुँचने पर दोनों में कितनी दूरी होगी?`,
    ][i]!;
    case "changedRaceOutcomeState": {
      if (input.mode === "FASTER_SPEED_CHANGE") return [
        `${hiM(input.raceDistance)} की दौड़ में ${a} की गति ${hiV(input.fasterSpeed)} और ${b} की ${hiV(input.slowerSpeed)} है। यदि ${a} की गति बढ़कर ${hiV(input.changedFasterSpeed!)} हो जाए तो वह कितने मीटर से जीतेगा?`,
        `${a} की गति ${hiV(input.fasterSpeed)} से बढ़कर ${hiV(input.changedFasterSpeed!)} हो जाती है; ${b} ${hiV(input.slowerSpeed)} से दौड़ता है। ${hiM(input.raceDistance)} में जीत ज्ञात कीजिए।`,
        `${hiM(input.raceDistance)} में ${a} अब ${hiV(input.changedFasterSpeed!)} से और ${b} ${hiV(input.slowerSpeed)} से दौड़ता है। ${a} की जीत कितनी होगी?`,
        `${a} सामान्यतः ${hiV(input.fasterSpeed)} से दौड़ता है लेकिन पूरी ${hiM(input.raceDistance)} दौड़ ${hiV(input.changedFasterSpeed!)} से दौड़ता है। ${b} ${hiV(input.slowerSpeed)} से दौड़ता है। जीत ज्ञात कीजिए।`,
        `${hiM(input.raceDistance)} की दौड़ में ${a} ${hiV(input.fasterSpeed)} के स्थान पर ${hiV(input.changedFasterSpeed!)} से दौड़ता है; ${b} ${hiV(input.slowerSpeed)} से। परिणाम ज्ञात कीजिए।`,
        `${a} की नई गति ${hiV(input.changedFasterSpeed!)} और ${b} की ${hiV(input.slowerSpeed)} है। ${hiM(input.raceDistance)} में ${a} कितने मीटर से जीतेगा?`,
      ][i]!;
      if (input.mode === "SLOWER_REST") return [
        `${hiM(input.raceDistance)} की दौड़ में ${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से दौड़ते हैं। ${b} कुल ${hiS(input.slowerRestTime!)} रुकता है। ${a} कितने मीटर से जीतेगा?`,
        `${a} ${hiM(input.raceDistance)} में ${hiV(input.fasterSpeed)} से लगातार दौड़ता है; ${b} ${hiV(input.slowerSpeed)} से दौड़ते हुए ${hiS(input.slowerRestTime!)} रुकता है। जीत ज्ञात कीजिए।`,
        `${hiM(input.raceDistance)} की दौड़ में ${b} कुल ${hiS(input.slowerRestTime!)} रुकता है। दौड़ते समय ${a} और ${b} की गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। ${a} के पहुँचने पर ${b} कितना पीछे होगा?`,
        `${a} और ${b} ${hiM(input.raceDistance)} में ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} से दौड़ते हैं। ${b} ${hiS(input.slowerRestTime!)} विश्राम करता है। जीत का अंतर ज्ञात कीजिए।`,
        `${b} ${hiV(input.slowerSpeed)} से दौड़ता है लेकिन ${hiS(input.slowerRestTime!)} रुकता है; ${a} ${hiV(input.fasterSpeed)} से बिना रुके दौड़ता है। ${hiM(input.raceDistance)} में ${a} कितने मीटर से जीतेगा?`,
        `${a} ${hiM(input.raceDistance)} को ${hiV(input.fasterSpeed)} से दौड़ता है। ${b} ${hiV(input.slowerSpeed)} से दौड़ते हुए ${hiS(input.slowerRestTime!)} रुकता है। ${a} के जीतने पर ${b} समाप्ति से कितनी दूर होगा?`,
      ][i]!;
      return [
        `${hiM(input.raceDistance)} की दौड़ में ${b} पहले ${hiV(input.slowerSpeed)} से शुरू करता है। ${a}, ${hiV(input.fasterSpeed)} से दौड़ते हुए ${hiS(input.fasterStartDelay!)} बाद शुरू करता है और फिर भी जीतता है। जीत कितने मीटर की है?`,
        `${b}, ${a} से ${hiS(input.fasterStartDelay!)} पहले ${hiM(input.raceDistance)} की दौड़ शुरू करता है। उनकी गतियाँ ${hiV(input.slowerSpeed)} और ${hiV(input.fasterSpeed)} हैं। ${a} कितने मीटर से जीतेगा?`,
        `${a}, ${b} को ${hiS(input.fasterStartDelay!)} की समय-बढ़त देता है। ${hiM(input.raceDistance)} में उनकी गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। ${a} की जीत ज्ञात कीजिए।`,
        `${hiM(input.raceDistance)} में ${a} ${hiV(input.fasterSpeed)} से दौड़ता है पर ${b} से ${hiS(input.fasterStartDelay!)} बाद शुरू करता है। ${b} की गति ${hiV(input.slowerSpeed)} है। यदि ${a} जीतता है तो कितने मीटर से?`,
        `${b} को ${a} से ${hiS(input.fasterStartDelay!)} पहले शुरू करने दिया जाता है। ${hiM(input.raceDistance)} में गतियाँ ${hiV(input.slowerSpeed)} और ${hiV(input.fasterSpeed)} हैं। अंतिम अंतर ज्ञात कीजिए।`,
        `${a} ${hiS(input.fasterStartDelay!)} देर से शुरू करता है लेकिन ${hiV(input.fasterSpeed)} से दौड़ता है; ${b} ${hiV(input.slowerSpeed)} से। ${hiM(input.raceDistance)} में ${a} कितने मीटर से जीतेगा?`,
      ][i]!;
    }
    case "runnerStateFromTwoRaceOutcomes": {
      const target = input.target === "FASTER_SPEED" ? a : b;
      return [
        `${a}, ${b} को ${hiM(input.firstRaceDistance)} की दौड़ में ${hiM(input.firstRaceDistanceLead)} से और ${hiM(input.secondRaceDistance)} की दौड़ में ${hiS(input.secondRaceTimeLead)} से हराता है। ${target} की गति ज्ञात कीजिए।`,
        `${hiM(input.firstRaceDistance)} में ${a}, ${b} को ${hiM(input.firstRaceDistanceLead)} से और ${hiM(input.secondRaceDistance)} में ${hiS(input.secondRaceTimeLead)} से हराता है। दोनों की अपनी गति नहीं बदलती। ${target} की गति क्या है?`,
        `वही दो धावक दो दौड़ें दौड़ते हैं। ${a} पहली ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceDistanceLead)} और दूसरी ${hiM(input.secondRaceDistance)} में ${hiS(input.secondRaceTimeLead)} से जीतता है। ${target} की गति ज्ञात कीजिए।`,
        `${a} और ${b} अपनी-अपनी गति स्थिर रखते हैं। ${a}, ${b} को ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceDistanceLead)} तथा ${hiM(input.secondRaceDistance)} में ${hiS(input.secondRaceTimeLead)} से हराता है। ${target} की गति ज्ञात कीजिए।`,
        `पहली ${hiM(input.firstRaceDistance)} की दौड़ में ${a} की जीत ${hiM(input.firstRaceDistanceLead)} और दूसरी ${hiM(input.secondRaceDistance)} में ${hiS(input.secondRaceTimeLead)} है। ${target} की गति ज्ञात कीजिए।`,
        `${a}, ${b} को ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceDistanceLead)} से हराता है। ${hiM(input.secondRaceDistance)} में ${a}, ${hiS(input.secondRaceTimeLead)} पहले पहुँचता है। गति नहीं बदलती। ${target} की गति क्या है?`,
      ][i]!;
    }
  }
}

function punjabi(familyId: string, input: TsdCp010ExecutableInput): string {
  const i = familyIndex(familyId); const [a, b, c] = PA[i]!;
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      if (input.target === "PERCENT_OF_RACE") return `${a} ${paM(cap.distance)} ਨੂੰ ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ਉਹੀ ਦੂਰੀ ${paS(cap.bTime)} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਜਿੱਤ ਕੁੱਲ ਦੂਰੀ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`;
      return [
        `${a} ${paM(cap.distance)} ਨੂੰ ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ${paS(cap.bTime)} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
        `${paM(cap.distance)} ਦੌੜਨ ਲਈ ${a} ਨੂੰ ${paS(cap.aTime)} ਅਤੇ ${b} ਨੂੰ ${paS(cap.bTime)} ਲੱਗਦੇ ਹਨ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ${paM(cap.distance)} ਦੂਰੀ ਲਈ ${a} ਦਾ ਸਮਾਂ ${paS(cap.aTime)} ਅਤੇ ${b} ਦਾ ${paS(cap.bTime)} ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਕਿੰਨੇ ਮੀਟਰ ਪਿੱਛੇ ਹੋਵੇਗਾ?`,
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.winnerSpeed, input.loserSpeed)} ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.winnerSpeed, input.loserSpeed)} ਹੈ। ਜੇ ਦੌੜ ${paM(input.raceDistance)} ਦੀ ਹੋਵੇ ਤਾਂ ${a} ਦੀ ਜਿੱਤ ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਹੋਵੇਗੀ?`,
        "",
      ][i]!;
    }
    case "finishTimeLeadState": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      return [
        `${a} ${paM(cap.distance)} ਨੂੰ ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ${paS(cap.bTime)} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਹਰਾਏਗਾ?`,
        `${paM(cap.distance)} ਲਈ ${a} ਦਾ ਸਮਾਂ ${paS(cap.aTime)} ਅਤੇ ${b} ਦਾ ${paS(cap.bTime)} ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਦੋਵਾਂ ਦੇ ਸਮੇਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `ਇੱਕੋ ${paM(cap.distance)} ਦੂਰੀ ${a} ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ${paS(cap.bTime)} ਵਿੱਚ ਤੈਅ ਕਰਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਪਹੁੰਚੇਗਾ?`,
        `${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.winnerSpeed, input.loserSpeed)} ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਜਿੱਤ ਦਾ ਸਮਾਂ ਕੱਢੋ।`,
        `ਦੋ ਧਾਵਕਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.winnerSpeed, input.loserSpeed)} ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਤੇਜ਼ ਧਾਵਕ ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.winnerSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.loserSpeed)} ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਸਮੇਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      ][i]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.distanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${paM(input.distanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਅਤੇ ਦੌੜ ${paM(input.raceDistance)} ਦੀ ਹੈ। ${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `${a} ਦੇ ${paM(input.raceDistance)} ਪੂਰੇ ਕਰਨ ਵੇਲੇ ${b} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ${paM(input.distanceLead)} ਪਿੱਛੇ ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ${paM(input.distanceLead)} ਹੈ। ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `${a} ਅਤੇ ${b} ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${a} ${paM(input.raceDistance)} ਪੂਰਾ ਕਰਦਾ ਹੈ ਅਤੇ ${b} ${paM(input.distanceLead)} ਪਿੱਛੇ ਰਹਿੰਦਾ ਹੈ। ${a}:${b} ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${paM(input.raceDistance)} ਵਿੱਚ ${paM(input.distanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a} ਦੀ ਰਫ਼ਤਾਰ : ${b} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
      ][i]!;
      const loserTime = add(input.winnerTime, input.timeLead);
      return [
        `${a} ਦੌੜ ${paS(input.winnerTime)} ਵਿੱਚ ਪੂਰੀ ਕਰਦਾ ਹੈ ਅਤੇ ${b} ਨੂੰ ${paS(input.timeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${a} ਦਾ ਸਮਾਂ ${paS(input.winnerTime)} ਹੈ ਅਤੇ ${b} ${paS(input.timeLead)} ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ। ${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `ਇੱਕੋ ਦੂਰੀ ਵਿੱਚ ${a} ਦਾ ਸਮਾਂ ${paS(input.winnerTime)} ਅਤੇ ${b} ਦਾ ${paS(loserTime)} ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${paS(input.timeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਅਤੇ ਖੁਦ ${paS(input.winnerTime)} ਲੈਂਦਾ ਹੈ। ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `ਇੱਕੋ ਦੂਰੀ ਲਈ ${a} ${paS(input.winnerTime)} ਲੈਂਦਾ ਹੈ ਅਤੇ ${b} ਉਸ ਤੋਂ ${paS(input.timeLead)} ਵੱਧ। ${a}:${b} ਕੱਢੋ।`,
        `${a} ${paS(input.winnerTime)} ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ; ${b} ਨੂੰ ${paS(input.timeLead)} ਵੱਧ ਲੱਗਦੇ ਹਨ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
      ][i]!;
    }
    case "raceLengthFromLeadEvidence": {
      const cap = capability(input.winnerSpeed, input.loserSpeed);
      if (input.mode === "DISTANCE_LEAD") return [
        `${a} ${paM(cap.distance)} ਨੂੰ ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ${paS(cap.bTime)} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ਜੇ ${a}, ${b} ਨੂੰ ${paM(input.distanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਤਾਂ ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
        `${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.winnerSpeed, input.loserSpeed)} ਹੈ। ${a} ਦੀ ਜਿੱਤ ${paM(input.distanceLead)} ਹੈ। ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        `${paM(cap.distance)} ਲਈ ${a} ਅਤੇ ${b} ਦੇ ਸਮੇਂ ${paS(cap.aTime)} ਅਤੇ ${paS(cap.bTime)} ਹਨ। ਇੱਕ ਦੌੜ ਵਿੱਚ ${a} ${paM(input.distanceLead)} ਨਾਲ ਜਿੱਤਦਾ ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`,
        `${a} ${paV(input.winnerSpeed)} ਅਤੇ ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${a} ${paM(input.distanceLead)} ਨਾਲ ਜਿੱਤਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੀ ਹੈ?`,
        `${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.winnerSpeed, input.loserSpeed)} ਅਤੇ ਜਿੱਤ ${paM(input.distanceLead)} ਦੀ ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕੱਢੋ।`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.winnerSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.loserSpeed)} ਹੈ। ${a} ਦੀ ਜਿੱਤ ${paM(input.distanceLead)} ਹੋਵੇ ਤਾਂ ਦੌੜ ਕਿੰਨੀ ਲੰਬੀ ਹੈ?`,
      ][i]!;
      return [
        `${a} ${paM(cap.distance)} ਨੂੰ ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ${paS(cap.bTime)} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ਜੇ ${a}, ${b} ਨੂੰ ${paS(input.timeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਤਾਂ ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.winnerSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.loserSpeed)} ਹੈ। ${a} ${paS(input.timeLead)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
        `${paM(cap.distance)} ਲਈ ${a} ਅਤੇ ${b} ਦੇ ਸਮੇਂ ${paS(cap.aTime)} ਅਤੇ ${paS(cap.bTime)} ਹਨ। ਇੱਕ ਦੌੜ ਵਿੱਚ ਜਿੱਤ ਦਾ ਸਮਾਂ ${paS(input.timeLead)} ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕੀ ਹੈ?`,
        `ਦੋ ਧਾਵਕਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਪਹੁੰਚਣ ਦੇ ਸਮੇਂ ਵਿੱਚ ${paS(input.timeLead)} ਦਾ ਅੰਤਰ ਹੈ। ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        `${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.winnerSpeed, input.loserSpeed)} ਹੈ। ${a} ${paS(input.timeLead)} ਨਾਲ ਜਿੱਤਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕਿੰਨੀ ਹੈ?`,
        `${a}, ${b} ਨੂੰ ${paS(input.timeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ਦੌੜ ਕਿੰਨੀ ਲੰਬੀ ਹੈ?`,
      ][i]!;
    }
    case "deadHeatHandicapState": {
      const cap = capability(input.fasterSpeed, input.slowerSpeed);
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${a} ${paM(cap.distance)} ਨੂੰ ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ${paS(cap.bTime)} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਬਰਾਬਰੀ 'ਤੇ ਮੁੱਕੇ ਤਾਂ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ?`,
        `${paM(cap.distance)} ਲਈ ${a} ਅਤੇ ${b} ਦੇ ਸਮੇਂ ${paS(cap.aTime)} ਅਤੇ ${paS(cap.bTime)} ਹਨ। ${paM(input.raceDistance)} ਵਿੱਚ ${b} ਨੂੰ ਕਿੰਨੀ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਦਿੱਤੀ ਜਾਵੇ ਕਿ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ?`,
        `${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.fasterSpeed, input.slowerSpeed)} ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਬਰਾਬਰੀ ਲਈ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ?`,
        `${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ, ਇਸ ਲਈ ${b} ਨੂੰ ਕਿੰਨੀ ਦੂਰੀ ਦੀ ਬੜ੍ਹਤ ਦਿੱਤੀ ਜਾਵੇ?`,
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${ratioText(input.fasterSpeed, input.slowerSpeed)} ਹੈ। ਬਰਾਬਰੀ ਲਈ ਹੌਲੇ ਧਾਵਕ ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਚਾਹੀਦੀ ਹੈ?`,
        `${a} ਤੇਜ਼ ਅਤੇ ${b} ਹੌਲਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ${paM(input.raceDistance)} ਵਿੱਚ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ ਤਾਂ ${b} ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰੇ?`,
      ][i]!;
      return [
        `${a} ${paM(cap.distance)} ਨੂੰ ${paS(cap.aTime)} ਵਿੱਚ ਅਤੇ ${b} ${paS(cap.bTime)} ਵਿੱਚ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਬਰਾਬਰੀ 'ਤੇ ਹੋਵੇ ਤਾਂ ${b}, ${a} ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰੇ?`,
        `${paM(cap.distance)} ਲਈ ${a} ਅਤੇ ${b} ਦੇ ਸਮੇਂ ${paS(cap.aTime)} ਅਤੇ ${paS(cap.bTime)} ਹਨ। ${paM(input.raceDistance)} ਵਿੱਚ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਦੇਰ ਨਾਲ ਸ਼ੁਰੂ ਕਰੇ?`,
        `${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ${ratioText(input.fasterSpeed, input.slowerSpeed)} ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਬਰਾਬਰੀ ਲਈ ${a} ਦੀ ਸ਼ੁਰੂਆਤ ਕਿੰਨੇ ਸਕਿੰਟ ਰੋਕੀ ਜਾਵੇ?`,
        `${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰੇ?`,
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${ratioText(input.fasterSpeed, input.slowerSpeed)} ਹੈ। ਹੌਲੇ ਧਾਵਕ ਨੂੰ ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ?`,
        `${b} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਬਰਾਬਰੀ 'ਤੇ ਹੋਵੇ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰੇ?`,
      ][i]!;
    }
    case "leadConversionState":
      if (input.mode === "DISTANCE_TO_TIME") return [
        `${a}, ${b} ਨੂੰ ${paM(input.distanceLead!)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਜਿੱਤਿਆ?`,
        `${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ${paM(input.distanceLead!)} ਦੀ ਹੈ ਅਤੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ਇਹੀ ਜਿੱਤ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੀ ਹੈ?`,
        `${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ${paM(input.distanceLead!)} ਪਿੱਛੇ ਹੈ ਅਤੇ ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜ ਰਿਹਾ ਹੈ। ${b} ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਪਹੁੰਚੇਗਾ?`,
        `${a}, ${b} ਨੂੰ ${paM(input.distanceLead!)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਇਸ ਦੂਰੀ ਨੂੰ ਤੈਅ ਕਰਨ ਵਿੱਚ ਉਸਨੂੰ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
        `${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.distanceLead!)} ਬਾਕੀ ਹੈ। ਉਸਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ਜਿੱਤ ਦਾ ਸਮਾਂ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${paM(input.distanceLead!)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਅਤੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ਬਰਾਬਰ ਸਮਾਂ ਕਿੰਨੇ ਸਕਿੰਟ ਹੈ?`,
      ][i]!;
      return [
        `${a}, ${b} ਨੂੰ ${paS(input.timeLead!)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ ਤਾਂ ਜਿੱਤ ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਹੈ?`,
        `${a}, ${b} ਤੋਂ ${paS(input.timeLead!)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਕਿੰਨੇ ਮੀਟਰ ਪਿੱਛੇ ਸੀ?`,
        `${b}, ${a} ਤੋਂ ${paS(input.timeLead!)} ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ ਅਤੇ ਉਸਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ${a} ਦੀ ਜਿੱਤ ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਹੈ?`,
        `${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ${paS(input.timeLead!)} ਦੀ ਹੈ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੋਵੇ ਤਾਂ ਇਸਨੂੰ ਮੀਟਰਾਂ ਵਿੱਚ ਲਿਖੋ।`,
        `${a} ${paS(input.timeLead!)} ਨਾਲ ਜਿੱਤਦਾ ਹੈ ਜਦਕਿ ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਸੀ?`,
        `${b}, ${a} ਦੇ ਪਹੁੰਚਣ ਤੋਂ ਬਾਅਦ ${paS(input.timeLead!)} ਹੋਰ ਦੌੜਦਾ ਹੈ ਅਤੇ ਉਸਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤਿਆ?`,
      ][i]!;
    case "transitiveRaceComparison": return [
      `${paM(input.raceDistance)} ਦੀਆਂ ਵੱਖ ਦੌੜਾਂ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਅਤੇ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a}, ${c} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
      `${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਅਤੇ ਇੱਕੋ ${paM(input.raceDistance)} ਦੀ ਦੂਜੀ ਦੌੜ ਵਿੱਚ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ। ${a} ਦੀ ${c} ਉੱਤੇ ਜਿੱਤ ਕੱਢੋ।`,
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਦੀ ਸ਼ੁਰੂਆਤ ਦੇ ਸਕਦਾ ਹੈ ਅਤੇ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਦੀ। ${a}, ${c} ਨੂੰ ਕਿੰਨੀ ਸ਼ੁਰੂਆਤ ਦੇ ਸਕਦਾ ਹੈ?`,
      `ਦੋ ਵੱਖ ${paM(input.raceDistance)} ਦੀਆਂ ਦੌੜਾਂ ਦੇ ਨਤੀਜੇ ਹਨ: ${a} ਨੇ ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਅਤੇ ${b} ਨੇ ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਇਆ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ਕਿੰਨਾ ਪਿੱਛੇ ਹੋਵੇਗਾ?`,
      `${a}, ${b}, ${c} ਸਥਿਰ ਰਫ਼ਤਾਰ ਨਾਲ ਦੌੜਦੇ ਹਨ। ${paM(input.raceDistance)} ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਅਤੇ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a} ਦੀ ${c} ਉੱਤੇ ਜਿੱਤ ਕੱਢੋ।`,
      `ਜੇ ${paM(input.raceDistance)} ਦੀਆਂ ਦੌੜਾਂ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਅਤੇ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਤਾਂ ${a}, ${c} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
    ][i]!;
    case "multiOutcomeRaceComparison": return [
      `${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${paM(input.firstRaceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ ਤਾਂ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
      `${paM(input.firstRaceDistance)} ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.firstRaceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ਦੂਜੀ ਦੌੜ ${paM(input.secondRaceDistance)} ਦੀ ਹੋਵੇ ਅਤੇ ${b} ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰੇ ਤਾਂ ਨਤੀਜਾ ਕੀ ਹੋਵੇਗਾ?`,
      `${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceLead)} ਦੀ ਸ਼ੁਰੂਆਤ ਦੇ ਸਕਦਾ ਹੈ। ${paM(input.secondRaceDistance)} ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਦੀ ਸ਼ੁਰੂਆਤ ਮਿਲੇ ਤਾਂ ਕੌਣ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
      `${a} ਨੇ ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceLead)} ਨਾਲ ਹਰਾਇਆ। ${paM(input.secondRaceDistance)} ਦੀ ਦੂਜੀ ਦੌੜ ਵਿੱਚ ${b} ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ਦੀ ਜਿੱਤ ਕੱਢੋ।`,
      `ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ${paM(input.firstRaceLead)} ਨਾਲ ਹਾਰਦਾ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ਉਸਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਮਿਲਦੀ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
      `${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${paM(input.secondRaceDistance)} ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਂਦਾ ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ਦੋਵਾਂ ਵਿੱਚ ਕਿੰਨੀ ਦੂਰੀ ਹੋਵੇਗੀ?`,
    ][i]!;
    case "changedRaceOutcomeState": {
      if (input.mode === "FASTER_SPEED_CHANGE") return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.slowerSpeed)} ਹੈ। ਜੇ ${a} ਦੀ ਰਫ਼ਤਾਰ ਵੱਧ ਕੇ ${paV(input.changedFasterSpeed!)} ਹੋ ਜਾਵੇ ਤਾਂ ਉਹ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਤੋਂ ਵੱਧ ਕੇ ${paV(input.changedFasterSpeed!)} ਹੋ ਜਾਂਦੀ ਹੈ; ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਜਿੱਤ ਕੱਢੋ।`,
        `${paM(input.raceDistance)} ਵਿੱਚ ${a} ਹੁਣ ${paV(input.changedFasterSpeed!)} ਨਾਲ ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${a} ਦੀ ਜਿੱਤ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
        `${a} ਆਮ ਤੌਰ 'ਤੇ ${paV(input.fasterSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ ਪਰ ਪੂਰੀ ${paM(input.raceDistance)} ਦੌੜ ${paV(input.changedFasterSpeed!)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਜਿੱਤ ਕੱਢੋ।`,
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${paV(input.fasterSpeed)} ਦੀ ਥਾਂ ${paV(input.changedFasterSpeed!)} ਨਾਲ ਦੌੜਦਾ ਹੈ; ${b} ${paV(input.slowerSpeed)} ਨਾਲ। ਨਤੀਜਾ ਕੱਢੋ।`,
        `${a} ਦੀ ਨਵੀਂ ਰਫ਼ਤਾਰ ${paV(input.changedFasterSpeed!)} ਅਤੇ ${b} ਦੀ ${paV(input.slowerSpeed)} ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
      ][i]!;
      if (input.mode === "SLOWER_REST") return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${b} ਕੁੱਲ ${paS(input.slowerRestTime!)} ਰੁਕਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a} ${paM(input.raceDistance)} ਵਿੱਚ ${paV(input.fasterSpeed)} ਨਾਲ ਲਗਾਤਾਰ ਦੌੜਦਾ ਹੈ; ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਹੋਏ ${paS(input.slowerRestTime!)} ਰੁਕਦਾ ਹੈ। ਜਿੱਤ ਕੱਢੋ।`,
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਕੁੱਲ ${paS(input.slowerRestTime!)} ਰੁਕਦਾ ਹੈ। ਦੌੜਦੇ ਸਮੇਂ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਕਿੰਨਾ ਪਿੱਛੇ ਹੋਵੇਗਾ?`,
        `${a} ਅਤੇ ${b} ${paM(input.raceDistance)} ਵਿੱਚ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${b} ${paS(input.slowerRestTime!)} ਆਰਾਮ ਕਰਦਾ ਹੈ। ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ ਪਰ ${paS(input.slowerRestTime!)} ਰੁਕਦਾ ਹੈ; ${a} ${paV(input.fasterSpeed)} ਨਾਲ ਬਿਨਾਂ ਰੁਕੇ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a} ${paM(input.raceDistance)} ਨੂੰ ${paV(input.fasterSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਹੋਏ ${paS(input.slowerRestTime!)} ਰੁਕਦਾ ਹੈ। ${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ਅੰਤ ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਹੋਵੇਗਾ?`,
      ][i]!;
      return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਪਹਿਲਾਂ ${paV(input.slowerSpeed)} ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a}, ${paV(input.fasterSpeed)} ਨਾਲ ਦੌੜਦੇ ਹੋਏ ${paS(input.fasterStartDelay!)} ਬਾਅਦ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ਫਿਰ ਵੀ ਜਿੱਤਦਾ ਹੈ। ਜਿੱਤ ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਹੈ?`,
        `${b}, ${a} ਤੋਂ ${paS(input.fasterStartDelay!)} ਪਹਿਲਾਂ ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.slowerSpeed)} ਅਤੇ ${paV(input.fasterSpeed)} ਹਨ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a}, ${b} ਨੂੰ ${paS(input.fasterStartDelay!)} ਦੀ ਸਮੇਂ ਦੀ ਬੜ੍ਹਤ ਦਿੰਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ${a} ਦੀ ਜਿੱਤ ਕੱਢੋ।`,
        `${paM(input.raceDistance)} ਵਿੱਚ ${a} ${paV(input.fasterSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ ਪਰ ${b} ਤੋਂ ${paS(input.fasterStartDelay!)} ਬਾਅਦ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.slowerSpeed)} ਹੈ। ਜੇ ${a} ਜਿੱਤਦਾ ਹੈ ਤਾਂ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ?`,
        `${b} ਨੂੰ ${a} ਤੋਂ ${paS(input.fasterStartDelay!)} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਨ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਰਫ਼ਤਾਰਾਂ ${paV(input.slowerSpeed)} ਅਤੇ ${paV(input.fasterSpeed)} ਹਨ। ਅੰਤਲਾ ਅੰਤਰ ਕੱਢੋ।`,
        `${a} ${paS(input.fasterStartDelay!)} ਦੇਰ ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਪਰ ${paV(input.fasterSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ; ${b} ${paV(input.slowerSpeed)} ਨਾਲ। ${paM(input.raceDistance)} ਵਿੱਚ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
      ][i]!;
    }
    case "runnerStateFromTwoRaceOutcomes": {
      const target = input.target === "FASTER_SPEED" ? a : b;
      return [
        `${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਨਾਲ ਅਤੇ ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${paM(input.firstRaceDistance)} ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistanceLead)} ਨਾਲ ਅਤੇ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੋਵੇਂ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੇ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`,
        `ਉਹੀ ਦੋ ਧਾਵਕ ਦੋ ਦੌੜਾਂ ਦੌੜਦੇ ਹਨ। ${a} ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਅਤੇ ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਨਾਲ ਜਿੱਤਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਸਥਿਰ ਰੱਖਦੇ ਹਨ। ${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਅਤੇ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਜਿੱਤ ${paM(input.firstRaceDistanceLead)} ਅਤੇ ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${paM(input.secondRaceDistance)} ਵਿੱਚ ${a}, ${paS(input.secondRaceTimeLead)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੀ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`,
      ][i]!;
    }
  }
}

export function renderTsdCp010NativeExamPaperStemV3(language: TsdCp010NativeV3Language, familyId: string, input: TsdCp010ExecutableInput) {
  return language === "hi" ? hindi(familyId, input) : punjabi(familyId, input);
}
