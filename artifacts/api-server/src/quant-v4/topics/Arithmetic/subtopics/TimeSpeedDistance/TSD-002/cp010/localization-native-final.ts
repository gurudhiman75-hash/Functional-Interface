import { add, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput } from "./executable-types";
import { TSD_CP010_LOCALIZED_REVIEW } from "./localized-review";

function val(r: Rational) { return toMixedString(r); }
function hiM(r: Rational) { return `${val(r)} मीटर`; }
function hiS(r: Rational) { return `${val(r)} सेकंड`; }
function hiV(r: Rational) { return `${val(r)} मीटर/सेकंड`; }
function paM(r: Rational) { return `${val(r)} ਮੀਟਰ`; }
function paS(r: Rational) { return `${val(r)} ਸਕਿੰਟ`; }
function paV(r: Rational) { return `${val(r)} ਮੀਟਰ/ਸਕਿੰਟ`; }
function idx(familyId: string) { return familyId.charCodeAt(familyId.length - 1) - 65; }

const HI = [
  ["अजय", "विजय", "संजय"], ["रवि", "मोहन", "सोहन"], ["अमन", "करण", "वरुण"],
  ["दीपक", "रोहित", "सुमित"], ["नीरज", "मनीष", "दिनेश"], ["कबीर", "साहिल", "नवीन"],
] as const;
const PA = [
  ["ਅਜੈ", "ਵਿਜੈ", "ਸੰਜੈ"], ["ਰਵੀ", "ਮੋਹਨ", "ਸੋਹਨ"], ["ਅਮਨ", "ਕਰਨ", "ਵਰੁਣ"],
  ["ਦੀਪਕ", "ਰੋਹਿਤ", "ਸੁਮਿਤ"], ["ਨੀਰਜ", "ਮਨੀਸ਼", "ਦਿਨੇਸ਼"], ["ਕਬੀਰ", "ਸਾਹਿਲ", "ਨਵੀਨ"],
] as const;

function hindiStem(_qlId: string, familyId: string, input: TsdCp010ExecutableInput): string {
  const i = idx(familyId); const [a, b, c] = HI[i]!;
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      if (input.target === "PERCENT_OF_RACE") return `${hiM(input.raceDistance)} की दौड़ में ${a} और ${b} की गतियाँ क्रमशः ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। ${a} की जीत का दूरी-अंतर दौड़ की कुल दूरी का कितने प्रतिशत है?`;
      return [
        `${hiM(input.raceDistance)} की दौड़ में ${a} की गति ${hiV(input.winnerSpeed)} तथा ${b} की ${hiV(input.loserSpeed)} है। ${a}, ${b} को कितने मीटर से हराएगा?`,
        `${a} और ${b} ${hiM(input.raceDistance)} की दौड़ क्रमशः ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} से दौड़ते हैं। ${a} के पहुँचने पर ${b} समाप्ति रेखा से कितनी दूर होगा?`,
        `दो धावक ${hiM(input.raceDistance)} की दौड़ एक साथ शुरू करते हैं। उनकी गतियाँ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। जीत का दूरी-अंतर ज्ञात कीजिए।`,
        `${hiM(input.raceDistance)} की दौड़ में ${a} और ${b} की गतियाँ ${hiV(input.winnerSpeed)} तथा ${hiV(input.loserSpeed)} हैं। ${a} कितने मीटर से जीतेगा?`,
        `${a} ${hiM(input.raceDistance)} की दौड़ ${hiV(input.winnerSpeed)} से और ${b} ${hiV(input.loserSpeed)} से दौड़ता है। दोनों साथ शुरू करें तो ${a} के जीतते समय ${b} कितने मीटर पीछे होगा?`,
        "",
      ][i]!;
    }
    case "finishTimeLeadState": return [
      `${hiM(input.raceDistance)} की दौड़ में ${a} और ${b} की गतियाँ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। ${a}, ${b} को कितने सेकंड से हराएगा?`,
      `${a} और ${b} ${hiM(input.raceDistance)} क्रमशः ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} से तय करते हैं। उनके समयों का अंतर ज्ञात कीजिए।`,
      `दो धावक ${hiM(input.raceDistance)} की समान दूरी ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} की गति से दौड़ते हैं। तेज धावक कितने सेकंड पहले पहुँचेगा?`,
      `${a} ${hiM(input.raceDistance)} की दूरी ${hiV(input.winnerSpeed)} से तय करता है और ${b} वही दूरी ${hiV(input.loserSpeed)} से। ${b}, ${a} के कितने सेकंड बाद पहुँचेगा?`,
      `${hiM(input.raceDistance)} की दौड़ में दोनों एक साथ शुरू करते हैं। उनकी गतियाँ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। जीत का समय-अंतर कितना होगा?`,
      `यदि ${a} और ${b} ${hiM(input.raceDistance)} की दौड़ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} से दौड़ें, तो ${a} कितने समय से जीतेगा?`,
    ][i]!;
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") return [
        `${hiM(input.raceDistance)} की दौड़ में ${a}, ${b} को ${hiM(input.distanceLead)} से हराता है। उनकी गतियों का अनुपात ज्ञात कीजिए।`,
        `${a} के ${hiM(input.raceDistance)} पूरा करने पर ${b} समाप्ति रेखा से ${hiM(input.distanceLead)} पीछे है। ${a}:${b} की गति का अनुपात क्या है?`,
        `${hiM(input.raceDistance)} की दौड़ में ${a} की ${b} पर जीत ${hiM(input.distanceLead)} है। दोनों की गति का अनुपात ज्ञात कीजिए।`,
        "", `${a}, ${b} को ${hiM(input.distanceLead)} से हराता है जबकि दौड़ ${hiM(input.raceDistance)} की है। ${a}:${b} ज्ञात कीजिए।`, "",
      ][i]!;
      const loserTime = add(input.winnerTime, input.timeLead);
      return ["", `${a} दौड़ ${hiS(input.winnerTime)} में पूरी करता है और ${b}, ${hiS(input.timeLead)} बाद पहुँचता है। उनकी गतियों का अनुपात ज्ञात कीजिए।`, "", `एक ही दूरी में ${a} का समय ${hiS(input.winnerTime)} तथा ${b} का ${hiS(loserTime)} है। गति अनुपात ${a}:${b} ज्ञात कीजिए।`, "", `${a} का समय ${hiS(input.winnerTime)} है और ${b} उससे ${hiS(input.timeLead)} अधिक लेता है। ${a}:${b} की गति का अनुपात क्या है?`][i]!;
    }
    case "raceLengthFromLeadEvidence":
      if (input.mode === "DISTANCE_LEAD") return [
        `${a} और ${b} की गतियाँ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। ${a}, ${b} को ${hiM(input.distanceLead)} से हराता है। दौड़ की लंबाई ज्ञात कीजिए।`, "", `${a} ${hiV(input.winnerSpeed)} और ${b} ${hiV(input.loserSpeed)} से दौड़ता है। जीत का दूरी-अंतर ${hiM(input.distanceLead)} है। कुल दूरी क्या है?`, "", `${a} की गति ${hiV(input.winnerSpeed)} तथा ${b} की ${hiV(input.loserSpeed)} है। यदि जीत ${hiM(input.distanceLead)} की हो, तो दौड़ कितनी लंबी है?`, "",
      ][i]!;
      return ["", `${a} और ${b} की गतियाँ ${hiV(input.winnerSpeed)} तथा ${hiV(input.loserSpeed)} हैं। ${a}, ${b} को ${hiS(input.timeLead)} से हराता है। दौड़ की दूरी ज्ञात कीजिए।`, "", `दो धावकों की गतियाँ ${hiV(input.winnerSpeed)} और ${hiV(input.loserSpeed)} हैं। तेज धावक ${hiS(input.timeLead)} पहले पहुँचता है। दौड़ की लंबाई कितनी है?`, "", `${a} ${hiV(input.winnerSpeed)} और ${b} ${hiV(input.loserSpeed)} से दौड़ता है। जीत का समय-अंतर ${hiS(input.timeLead)} है। ट्रैक की लंबाई ज्ञात कीजिए।`][i]!;
    case "deadHeatHandicapState":
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${hiM(input.raceDistance)} की दौड़ में ${a} और ${b} की गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। बराबरी के लिए ${b} को कितने मीटर की शुरुआती बढ़त दी जाए?`, "", `${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से ${hiM(input.raceDistance)} दौड़ते हैं। दोनों साथ समाप्त करें, इसके लिए ${b} को कितने मीटर आगे से शुरू कराया जाए?`, "", `${hiM(input.raceDistance)} की दौड़ में ${a} और ${b} की गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। दौड़ बराबरी पर समाप्त कराने के लिए धीमे धावक ${b} को कितनी शुरुआती दूरी का लाभ दिया जाए?`, "",
      ][i]!;
      return ["", `${hiM(input.raceDistance)} की दौड़ में ${b} पहले शुरू करता है। ${a} और ${b} की गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। दोनों एक ही समय पहुँचें तो ${a} कितने सेकंड देर से शुरू करे?`, "", `${a} तेज धावक है। ${b} समय शून्य पर शुरू करता है। ${hiM(input.raceDistance)} की दौड़ बराबरी पर समाप्त हो, इसके लिए ${a} की शुरुआत कितने सेकंड रोकी जाए?`, "", `${hiM(input.raceDistance)} की दौड़ में ${b} पहले शुरू करता है। दोनों साथ समाप्त करें तो ${a}, जिसकी गति ${hiV(input.fasterSpeed)} है, कितने सेकंड बाद शुरू करे?`][i]!;
    case "leadConversionState":
      if (input.mode === "DISTANCE_TO_TIME") return [
        `${a}, ${b} को ${hiM(input.distanceLead!)} से हराता है। यदि ${b} की गति ${hiV(input.loserSpeed)} है, तो ${a} कितने सेकंड से जीता?`, "", `${a} की जीत ${hiM(input.distanceLead!)} है और ${b} की गति ${hiV(input.loserSpeed)}। यही जीत समय में कितने सेकंड है?`, "", `${a} के पहुँचने पर ${b} को ${hiM(input.distanceLead!)} बाकी है। ${b} ${hiV(input.loserSpeed)} से दौड़ता है। वह कितने सेकंड बाद पहुँचेगा?`, "",
      ][i]!;
      return ["", `${a}, ${b} को ${hiS(input.timeLead!)} से हराता है। यदि ${b} की गति ${hiV(input.loserSpeed)} है, तो जीत का दूरी-अंतर कितना है?`, "", `${a} ${hiS(input.timeLead!)} पहले पहुँचता है और ${b} की गति ${hiV(input.loserSpeed)} है। ${a} कितने मीटर से जीता?`, "", `${b}, ${a} के ${hiS(input.timeLead!)} बाद पहुँचता है और उसकी गति ${hiV(input.loserSpeed)} है। ${a} के पहुँचने पर ${b} कितने मीटर पीछे था?`][i]!;
    case "transitiveRaceComparison": return [
      `${hiM(input.raceDistance)} की अलग-अलग दौड़ों में ${a}, ${b} को ${hiM(input.aBeatsBBy)} से और ${b}, ${c} को ${hiM(input.bBeatsCBy)} से हराता है। ${a}, ${c} को कितने मीटर से हराएगा?`,
      `समान ${hiM(input.raceDistance)} की दो दौड़ों में ${a} की ${b} पर जीत ${hiM(input.aBeatsBBy)} और ${b} की ${c} पर जीत ${hiM(input.bBeatsCBy)} है। ${a} की ${c} पर जीत ज्ञात कीजिए।`,
      `दो स्वतंत्र ${hiM(input.raceDistance)} की दौड़ों में ${a}, ${b} को ${hiM(input.aBeatsBBy)} से तथा ${b}, ${c} को ${hiM(input.bBeatsCBy)} से हराता है। ${a} बनाम ${c} का दूरी-अंतर क्या होगा?`,
      `${a}, ${b} को ${hiM(input.aBeatsBBy)} से और दूसरी समान ${hiM(input.raceDistance)} की दौड़ में ${b}, ${c} को ${hiM(input.bBeatsCBy)} से हराता है। ${a} के पहुँचने पर ${c} कितने मीटर पीछे होगा?`,
      `समान दूरी ${hiM(input.raceDistance)} की दो अलग दौड़ों के परिणाम हैं: ${a} ने ${b} को ${hiM(input.aBeatsBBy)} से और ${b} ने ${c} को ${hiM(input.bBeatsCBy)} से हराया। ${a}, ${c} को कितना हराएगा?`,
      `${hiM(input.raceDistance)} की दो दौड़ों में पहले ${a} ने ${b} को ${hiM(input.aBeatsBBy)} से और फिर ${b} ने ${c} को ${hiM(input.bBeatsCBy)} से हराया। ${a} की ${c} पर जीत कितनी होगी?`,
    ][i]!;
    case "multiOutcomeRaceComparison": return [
      `${a}, ${b} को ${hiM(input.firstRaceDistance)} की दौड़ में ${hiM(input.firstRaceLead)} से हराता है। ${hiM(input.secondRaceDistance)} की दूसरी दौड़ में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} की शुरुआती बढ़त दी जाए, तो ${a} कितने मीटर से जीतेगा?`,
      `${hiM(input.firstRaceDistance)} में ${a}, ${b} को ${hiM(input.firstRaceLead)} से हराता है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${b} ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू करे, तो परिणाम क्या होगा?`,
      `पहली ${hiM(input.firstRaceDistance)} की दौड़ में जीत ${hiM(input.firstRaceLead)} की है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} की शुरुआती बढ़त मिलती है। ${a} का अंतिम दूरी-अंतर ज्ञात कीजिए।`,
      `${a} ने ${b} को ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceLead)} से हराया। दूसरी दौड़ ${hiM(input.secondRaceDistance)} की है और ${b} शुरुआत में ${hiM(input.secondRaceHeadStartForLoser)} आगे है। ${a} कितना जीतेगा?`,
      `पहली दौड़ के परिणाम में ${a}, ${b} से ${hiM(input.firstRaceLead)} आगे रहता है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${b} ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू करता है। जीत का अंतर ज्ञात कीजिए।`,
      `${a} और ${b} की गति नहीं बदलती। ${hiM(input.firstRaceDistance)} में ${a} की जीत ${hiM(input.firstRaceLead)} है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} की शुरुआती बढ़त है। अंतिम अंतर क्या होगा?`,
    ][i]!;
    case "changedRaceOutcomeState":
      if (input.mode === "FASTER_SPEED_CHANGE") return [
        `${hiM(input.raceDistance)} की दौड़ में ${a} की सामान्य गति ${hiV(input.fasterSpeed)} और ${b} की ${hiV(input.slowerSpeed)} है। यदि ${a} की गति बढ़कर ${hiV(input.changedFasterSpeed!)} हो जाए, तो वह कितने मीटर से जीतेगा?`, "", "", `${a} की गति ${hiV(input.fasterSpeed)} से बढ़कर ${hiV(input.changedFasterSpeed!)} हो जाती है, जबकि ${b} ${hiV(input.slowerSpeed)} से दौड़ता है। ${hiM(input.raceDistance)} में नया जीत-अंतर ज्ञात कीजिए।`, "", "",
      ][i]!;
      if (input.mode === "SLOWER_REST") return ["", `${hiM(input.raceDistance)} की दौड़ में ${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से दौड़ते हैं। ${b} कुल ${hiS(input.slowerRestTime!)} रुकता है। ${a} कितने मीटर से जीतेगा?`, "", "", `${a} ${hiV(input.fasterSpeed)} से ${hiM(input.raceDistance)} दौड़ता है। ${b} ${hiV(input.slowerSpeed)} से दौड़ते हुए ${hiS(input.slowerRestTime!)} विश्राम करता है। ${a} के पहुँचने पर ${b} कितना पीछे होगा?`, ""][i]!;
      return ["", "", `${b} ${hiM(input.raceDistance)} की दौड़ समय शून्य पर ${hiV(input.slowerSpeed)} से शुरू करता है। ${a} ${hiV(input.fasterSpeed)} से दौड़ता है लेकिन ${hiS(input.fasterStartDelay!)} देर से शुरू करता है। ${a} की जीत का अंतर ज्ञात कीजिए।`, "", "", `${hiM(input.raceDistance)} की दौड़ में ${b} पहले शुरू करता है और ${a} ${hiS(input.fasterStartDelay!)} देर से। उनकी गतियाँ ${hiV(input.slowerSpeed)} और ${hiV(input.fasterSpeed)} हैं। यदि ${a} जीतता है, तो कितने मीटर से?`][i]!;
    case "runnerStateFromTwoRaceOutcomes": {
      const target = input.target === "FASTER_SPEED" ? a : b;
      return [
        `${a}, ${b} को ${hiM(input.firstRaceDistance)} की दौड़ में ${hiM(input.firstRaceDistanceLead)} से और ${hiM(input.secondRaceDistance)} की दूसरी दौड़ में ${hiS(input.secondRaceTimeLead)} से हराता है। प्रत्येक धावक अपनी स्थिर गति से दौड़ता है। ${target} की गति ज्ञात कीजिए।`,
        `दो दौड़ों में प्रत्येक धावक की अपनी गति नहीं बदलती। ${a} की ${b} पर जीत ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceDistanceLead)} तथा ${hiM(input.secondRaceDistance)} में ${hiS(input.secondRaceTimeLead)} है। ${target} की गति क्या है?`,
        `पहली ${hiM(input.firstRaceDistance)} की दौड़ में ${a}, ${b} को ${hiM(input.firstRaceDistanceLead)} से हराता है। दूसरी ${hiM(input.secondRaceDistance)} में वह ${hiS(input.secondRaceTimeLead)} से जीतता है। दोनों अपनी वही गति रखते हैं। ${target} की गति ज्ञात कीजिए।`,
        `${a} और ${b} की गति दोनों दौड़ों में स्थिर है। ${a}, ${b} को ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceDistanceLead)} और ${hiM(input.secondRaceDistance)} में ${hiS(input.secondRaceTimeLead)} से हराता है। ${target} की गति निकालिए।`,
        `दो धावकों की अपनी-अपनी गति नहीं बदलती। पहली दूरी ${hiM(input.firstRaceDistance)} पर जीत ${hiM(input.firstRaceDistanceLead)} की और दूसरी दूरी ${hiM(input.secondRaceDistance)} पर जीत ${hiS(input.secondRaceTimeLead)} की है। ${target} की गति ज्ञात कीजिए।`,
        `${a} तथा ${b} हर दौड़ में अपनी वही गति रखते हैं। ${a} की जीत ${hiM(input.firstRaceDistance)} में ${hiM(input.firstRaceDistanceLead)} और ${hiM(input.secondRaceDistance)} में ${hiS(input.secondRaceTimeLead)} है। ${target} की गति क्या है?`,
      ][i]!;
    }
  }
}

function punjabiStem(_qlId: string, familyId: string, input: TsdCp010ExecutableInput): string {
  const i = idx(familyId); const [a, b, c] = PA[i]!;
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      if (input.target === "PERCENT_OF_RACE") return `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕ੍ਰਮਵਾਰ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੁੱਲ ਦੌੜ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`;
      return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.winnerSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.loserSpeed)} ਹੈ। ${a}, ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
        `${a} ਅਤੇ ${b} ${paM(input.raceDistance)} ਦੀ ਦੌੜ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ਕਿੰਨੀ ਦੂਰ ਹੋਵੇਗਾ?`,
        `ਦੋ ਧਾਵਕ ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a} ${paM(input.raceDistance)} ਦੀ ਦੌੜ ${paV(input.winnerSpeed)} ਨਾਲ ਅਤੇ ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਨ 'ਤੇ ${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ਕਿੰਨੇ ਮੀਟਰ ਪਿੱਛੇ ਹੋਵੇਗਾ?`, "",
      ][i]!;
    }
    case "finishTimeLeadState": return [
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ${a}, ${b} ਨੂੰ ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਹਰਾਏਗਾ?`,
      `${a} ਅਤੇ ${b} ${paM(input.raceDistance)} ਨੂੰ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਨਾਲ ਤੈਅ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
      `ਦੋ ਧਾਵਕ ${paM(input.raceDistance)} ਦੀ ਇੱਕੋ ਦੂਰੀ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਤੇਜ਼ ਧਾਵਕ ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਪਹੁੰਚੇਗਾ?`,
      `${a} ${paM(input.raceDistance)} ਨੂੰ ${paV(input.winnerSpeed)} ਨਾਲ ਅਤੇ ${b} ਉਹੀ ਦੂਰੀ ${paV(input.loserSpeed)} ਨਾਲ ਤੈਅ ਕਰਦਾ ਹੈ। ${b}, ${a} ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਪਹੁੰਚੇਗਾ?`,
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ਜਿੱਤ ਦਾ ਸਮਾਂ-ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
      `ਜੇ ${a} ਅਤੇ ${b} ${paM(input.raceDistance)} ਦੀ ਦੌੜ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਣ, ਤਾਂ ${a} ਕਿੰਨੇ ਸਮੇਂ ਨਾਲ ਜਿੱਤੇਗਾ?`,
    ][i]!;
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.distanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${a} ਦੇ ${paM(input.raceDistance)} ਪੂਰੇ ਕਰਨ ਵੇਲੇ ${b} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ${paM(input.distanceLead)} ਪਿੱਛੇ ਹੈ। ${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ${paM(input.distanceLead)} ਹੈ। ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`, "", `${a}, ${b} ਨੂੰ ${paM(input.distanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਅਤੇ ਦੌੜ ${paM(input.raceDistance)} ਦੀ ਹੈ। ${a}:${b} ਕੱਢੋ।`, "",
      ][i]!;
      const loserTime = add(input.winnerTime, input.timeLead);
      return ["", `${a} ਦੌੜ ${paS(input.winnerTime)} ਵਿੱਚ ਪੂਰੀ ਕਰਦਾ ਹੈ ਅਤੇ ${b} ${paS(input.timeLead)} ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ। ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`, "", `ਇੱਕੋ ਦੂਰੀ ਲਈ ${a} ਦਾ ਸਮਾਂ ${paS(input.winnerTime)} ਅਤੇ ${b} ਦਾ ${paS(loserTime)} ਹੈ। ${a}:${b} ਦੀ ਰਫ਼ਤਾਰ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`, "", `${a} ਦਾ ਸਮਾਂ ${paS(input.winnerTime)} ਹੈ ਅਤੇ ${b} ਉਸ ਤੋਂ ${paS(input.timeLead)} ਵੱਧ ਲੈਂਦਾ ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੀ ਹੈ?`][i]!;
    }
    case "raceLengthFromLeadEvidence":
      if (input.mode === "DISTANCE_LEAD") return [
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ${a}, ${b} ਨੂੰ ${paM(input.distanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`, "", `${a} ${paV(input.winnerSpeed)} ਅਤੇ ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ${paM(input.distanceLead)} ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`, "", `${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.winnerSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.loserSpeed)} ਹੈ। ਜੇ ਜਿੱਤ ${paM(input.distanceLead)} ਦੀ ਹੋਵੇ ਤਾਂ ਦੌੜ ਕਿੰਨੀ ਲੰਬੀ ਹੈ?`, "",
      ][i]!;
      return ["", `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ${a}, ${b} ਨੂੰ ${paS(input.timeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।`, "", `ਦੋ ਧਾਵਕਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.winnerSpeed)} ਅਤੇ ${paV(input.loserSpeed)} ਹਨ। ਤੇਜ਼ ਧਾਵਕ ${paS(input.timeLead)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕਿੰਨੀ ਹੈ?`, "", `${a} ${paV(input.winnerSpeed)} ਅਤੇ ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਜਿੱਤ ਦਾ ਸਮਾਂ-ਅੰਤਰ ${paS(input.timeLead)} ਹੈ। ਟਰੈਕ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`][i]!;
    case "deadHeatHandicapState":
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ਬਰਾਬਰੀ ਲਈ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਦਿੱਤੀ ਜਾਵੇ?`, "", `${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ${paM(input.raceDistance)} ਦੌੜਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ, ਇਸ ਲਈ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ?`, "", `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ਦੌੜ ਬਰਾਬਰੀ 'ਤੇ ਖਤਮ ਕਰਨ ਲਈ ਹੌਲੇ ਧਾਵਕ ${b} ਨੂੰ ਕਿੰਨੀ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ ਦਾ ਲਾਭ ਦਿੱਤਾ ਜਾਵੇ?`, "",
      ][i]!;
      return ["", `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਪਹੁੰਚਣ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਦੇਰ ਨਾਲ ਸ਼ੁਰੂ ਕਰੇ?`, "", `${a} ਤੇਜ਼ ਧਾਵਕ ਹੈ ਅਤੇ ${b} ਸਮਾਂ ਸਿਫ਼ਰ 'ਤੇ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਬਰਾਬਰੀ 'ਤੇ ਮੁੱਕੇ, ਇਸ ਲਈ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਦੇਰ ਨਾਲ ਸ਼ੁਰੂ ਕਰੇ?`, "", `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰੇ?`][i]!;
    case "leadConversionState":
      if (input.mode === "DISTANCE_TO_TIME") return [
        `${a}, ${b} ਨੂੰ ${paM(input.distanceLead!)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਜਿੱਤਿਆ?`, "", `${a} ਦੀ ਜਿੱਤ ${paM(input.distanceLead!)} ਹੈ ਅਤੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)}। ਇਹੀ ਜਿੱਤ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੇ ਸਕਿੰਟ ਹੈ?`, "", `${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.distanceLead!)} ਬਾਕੀ ਹੈ। ${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਉਹ ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਪਹੁੰਚੇਗਾ?`, "",
      ][i]!;
      return ["", `${a}, ${b} ਨੂੰ ${paS(input.timeLead!)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ ਤਾਂ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`, "", `${a} ${paS(input.timeLead!)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ ਅਤੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤਿਆ?`, "", `${b}, ${a} ਤੋਂ ${paS(input.timeLead!)} ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ ਅਤੇ ਉਸ ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਕਿੰਨੇ ਮੀਟਰ ਪਿੱਛੇ ਸੀ?`][i]!;
    case "transitiveRaceComparison": return [
      `${paM(input.raceDistance)} ਦੀਆਂ ਵੱਖ ਦੌੜਾਂ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਅਤੇ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a}, ${c} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
      `ਇੱਕੋ ${paM(input.raceDistance)} ਦੀਆਂ ਦੋ ਦੌੜਾਂ ਵਿੱਚ ${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ${paM(input.aBeatsBBy)} ਅਤੇ ${b} ਦੀ ${c} ਉੱਤੇ ਜਿੱਤ ${paM(input.bBeatsCBy)} ਹੈ। ${a} ਦੀ ${c} ਉੱਤੇ ਜਿੱਤ ਕੱਢੋ।`,
      `ਦੋ ਅਲੱਗ ${paM(input.raceDistance)} ਦੀਆਂ ਦੌੜਾਂ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਅਤੇ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a} ਅਤੇ ${c} ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੀ ਹੋਵੇਗਾ?`,
      `${a}, ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਅਤੇ ਦੂਜੀ ਇੱਕੋ ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b}, ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ਕਿੰਨਾ ਪਿੱਛੇ ਹੋਵੇਗਾ?`,
      `ਇੱਕੋ ਦੂਰੀ ${paM(input.raceDistance)} ਦੀਆਂ ਦੋ ਵੱਖ ਦੌੜਾਂ ਦੇ ਨਤੀਜੇ ਹਨ: ${a} ਨੇ ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਅਤੇ ${b} ਨੇ ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਇਆ। ${a}, ${c} ਨੂੰ ਕਿੰਨਾ ਹਰਾਏਗਾ?`,
      `${paM(input.raceDistance)} ਦੀਆਂ ਦੋ ਦੌੜਾਂ ਵਿੱਚ ਪਹਿਲਾਂ ${a} ਨੇ ${b} ਨੂੰ ${paM(input.aBeatsBBy)} ਨਾਲ ਅਤੇ ਫਿਰ ${b} ਨੇ ${c} ਨੂੰ ${paM(input.bBeatsCBy)} ਨਾਲ ਹਰਾਇਆ। ${a} ਦੀ ${c} ਉੱਤੇ ਜਿੱਤ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
    ][i]!;
    case "multiOutcomeRaceComparison": return [
      `${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${paM(input.firstRaceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${paM(input.secondRaceDistance)} ਦੀ ਦੂਜੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਮਿਲੇ ਤਾਂ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
      `${paM(input.firstRaceDistance)} ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.firstRaceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰੇ ਤਾਂ ਨਤੀਜਾ ਕੀ ਹੋਵੇਗਾ?`,
      `ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਜਿੱਤ ${paM(input.firstRaceLead)} ਦੀ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਹੈ। ${a} ਦਾ ਅੰਤਲਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
      `${a} ਨੇ ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceLead)} ਨਾਲ ਹਰਾਇਆ। ਦੂਜੀ ਦੌੜ ${paM(input.secondRaceDistance)} ਦੀ ਹੈ ਅਤੇ ${b} ਸ਼ੁਰੂਆਤ ਵਿੱਚ ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਹੈ। ${a} ਕਿੰਨਾ ਜਿੱਤੇਗਾ?`,
      `ਪਹਿਲੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਤੋਂ ${paM(input.firstRaceLead)} ਅੱਗੇ ਰਹਿੰਦਾ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${b} ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
      `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਨਹੀਂ ਬਦਲਦੀਆਂ। ${paM(input.firstRaceDistance)} ਵਿੱਚ ${a} ਦੀ ਜਿੱਤ ${paM(input.firstRaceLead)} ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਹੈ। ਅੰਤਲਾ ਅੰਤਰ ਕੀ ਹੈ?`,
    ][i]!;
    case "changedRaceOutcomeState":
      if (input.mode === "FASTER_SPEED_CHANGE") return [
        `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਆਮ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.slowerSpeed)} ਹੈ। ਜੇ ${a} ਦੀ ਰਫ਼ਤਾਰ ਵੱਧ ਕੇ ${paV(input.changedFasterSpeed!)} ਹੋ ਜਾਵੇ ਤਾਂ ਉਹ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`, "", "", `${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਤੋਂ ਵੱਧ ਕੇ ${paV(input.changedFasterSpeed!)} ਹੋ ਜਾਂਦੀ ਹੈ, ਜਦਕਿ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${paM(input.raceDistance)} ਵਿੱਚ ਨਵਾਂ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`, "", "",
      ][i]!;
      if (input.mode === "SLOWER_REST") return ["", `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${b} ਕੁੱਲ ${paS(input.slowerRestTime!)} ਰੁਕਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`, "", "", `${a} ${paV(input.fasterSpeed)} ਨਾਲ ${paM(input.raceDistance)} ਦੌੜਦਾ ਹੈ। ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਹੋਏ ${paS(input.slowerRestTime!)} ਆਰਾਮ ਕਰਦਾ ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਕਿੰਨਾ ਪਿੱਛੇ ਹੋਵੇਗਾ?`, ""][i]!;
      return ["", "", `${b} ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਸਮਾਂ ਸਿਫ਼ਰ 'ਤੇ ${paV(input.slowerSpeed)} ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ${paV(input.fasterSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ ਪਰ ${paS(input.fasterStartDelay!)} ਦੇਰ ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।`, "", "", `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${a} ${paS(input.fasterStartDelay!)} ਦੇਰ ਨਾਲ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.slowerSpeed)} ਅਤੇ ${paV(input.fasterSpeed)} ਹਨ। ਜੇ ${a} ਜਿੱਤਦਾ ਹੈ ਤਾਂ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ?`][i]!;
    case "runnerStateFromTwoRaceOutcomes": {
      const target = input.target === "FASTER_SPEED" ? a : b;
      return [
        `${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਨਾਲ ਅਤੇ ${paM(input.secondRaceDistance)} ਦੀ ਦੂਜੀ ਦੌੜ ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਹਰ ਧਾਵਕ ਆਪਣੀ ਸਥਿਰ ਰਫ਼ਤਾਰ ਨਾਲ ਦੌੜਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `ਦੋ ਦੌੜਾਂ ਵਿੱਚ ਹਰ ਧਾਵਕ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੀ। ${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਅਤੇ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`,
        `ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistanceLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ਉਹ ${paS(input.secondRaceTimeLead)} ਨਾਲ ਜਿੱਤਦਾ ਹੈ। ਦੋਵੇਂ ਆਪਣੀ ਉਹੀ ਰਫ਼ਤਾਰ ਰੱਖਦੇ ਹਨ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਸਥਿਰ ਹਨ। ${a}, ${b} ਨੂੰ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਅਤੇ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `ਦੋ ਧਾਵਕਾਂ ਦੀ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੀ। ਪਹਿਲੀ ਦੂਰੀ ${paM(input.firstRaceDistance)} 'ਤੇ ਜਿੱਤ ${paM(input.firstRaceDistanceLead)} ਦੀ ਅਤੇ ਦੂਜੀ ਦੂਰੀ ${paM(input.secondRaceDistance)} 'ਤੇ ਜਿੱਤ ${paS(input.secondRaceTimeLead)} ਦੀ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਹਰ ਦੌੜ ਵਿੱਚ ਆਪਣੀ ਉਹੀ ਰਫ਼ਤਾਰ ਰੱਖਦੇ ਹਨ। ${a} ਦੀ ਜਿੱਤ ${paM(input.firstRaceDistance)} ਵਿੱਚ ${paM(input.firstRaceDistanceLead)} ਅਤੇ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${paS(input.secondRaceTimeLead)} ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`,
      ][i]!;
    }
  }
}

export const TSD_CP010_NATIVE_FINAL_REVIEW = Object.freeze(TSD_CP010_LOCALIZED_REVIEW.map((question) => Object.freeze({
  ...question,
  stem: question.language === "hi" ? hindiStem(question.qlId, question.familyId, question.input) : punjabiStem(question.qlId, question.familyId, question.input),
})));

export const TSD_CP010_NATIVE_FINAL_HINDI_REVIEW = Object.freeze(TSD_CP010_NATIVE_FINAL_REVIEW.filter((x) => x.language === "hi"));
export const TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW = Object.freeze(TSD_CP010_NATIVE_FINAL_REVIEW.filter((x) => x.language === "pa"));
