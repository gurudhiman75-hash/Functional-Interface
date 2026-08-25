import { toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput } from "./executable-types";
import { TSD_CP010_LOCALIZED_REVIEW } from "./localized-review";

const HINDI_REPLACEMENTS: readonly (readonly [string, string])[] = Object.freeze([
  [" की समान गति बनाए रखते हैं", " की अपनी-अपनी गति स्थिर रखते हैं"],
  ["दोनों की गति दोनों दौड़ों में समान रहती है", "प्रत्येक धावक की अपनी गति दोनों दौड़ों में नहीं बदलती"],
  ["धीमे धावक का समय minus तेज धावक का समय", "धीमे धावक के समय में से तेज धावक का समय"],
]);

const PUNJABI_REPLACEMENTS: readonly (readonly [string, string])[] = Object.freeze([
  [" ਦੀ ਇੱਕੋ ਰਫ਼ਤਾਰ ਬਣਾਈ ਰੱਖਦੇ ਹਨ", " ਦੀ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਸਥਿਰ ਰੱਖਦੇ ਹਨ"],
  ["ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ", "ਹਰ ਧਾਵਕ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਬਦਲਦੀ ਨਹੀਂ"],
  ["ਉਸ ਦੀ ਬੜ੍ਹਤ ਪੂਰੀ", "ਉਸ ਦਾ ਜਿੱਤ ਵਾਲਾ ਦੂਰੀ-ਅੰਤਰ ਪੂਰੀ"],
  ["ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਬੜ੍ਹਤ ਨਾਲ", "ਕਿੰਨੇ ਮੀਟਰ ਦੇ ਫਰਕ ਨਾਲ"],
  ["ਦੂਰੀ-ਬੜ੍ਹਤ", "ਦੂਰੀ-ਅੰਤਰ"],
]);

const HI_NAMES = Object.freeze([
  ["अर्जुन", "भारत", "चेतन"], ["कबीर", "मानव", "नवीन"], ["रवि", "साहिल", "दीपक"],
  ["अमन", "विक्रम", "करण"], ["नीरज", "मोहन", "रोहित"], ["रोहित", "दीपक", "सुमित"],
] as const);
const PA_NAMES = Object.freeze([
  ["ਅਰਜੁਨ", "ਭਾਰਤ", "ਚੇਤਨ"], ["ਕਬੀਰ", "ਮਾਨਵ", "ਨਵੀਨ"], ["ਰਵੀ", "ਸਾਹਿਲ", "ਦੀਪਕ"],
  ["ਅਮਨ", "ਵਿਕਰਮ", "ਕਰਨ"], ["ਨੀਰਜ", "ਮੋਹਨ", "ਰੋਹਿਤ"], ["ਰੋਹਿਤ", "ਦੀਪਕ", "ਸੁਮਿਤ"],
] as const);

function clean(text: string, language: "hi" | "pa") {
  const replacements = language === "hi" ? HINDI_REPLACEMENTS : PUNJABI_REPLACEMENTS;
  return replacements.reduce((value, [from, to]) => value.replaceAll(from, to), text);
}
function val(r: Rational) { return toMixedString(r); }
function hiM(r: Rational) { return `${val(r)} मीटर`; }
function hiS(r: Rational) { return `${val(r)} सेकंड`; }
function hiV(r: Rational) { return `${val(r)} मीटर/सेकंड`; }
function paM(r: Rational) { return `${val(r)} ਮੀਟਰ`; }
function paS(r: Rational) { return `${val(r)} ਸਕਿੰਟ`; }
function paV(r: Rational) { return `${val(r)} ਮੀਟਰ/ਸਕਿੰਟ`; }
function familyIndex(familyId: string) { return familyId.charCodeAt(familyId.length - 1) - 65; }

function hindiLateQlStem(qlId: string, familyId: string, input: TsdCp010ExecutableInput): string | undefined {
  const i = familyIndex(familyId);
  const [a, b, c] = HI_NAMES[i]!;
  if (qlId === "TSD-QL-119" && input.authorityKey === "deadHeatHandicapState") {
    if (input.mode === "DISTANCE_HANDICAP") {
      return [
        `${hiM(input.raceDistance)} की दौड़ में ${a} की गति ${hiV(input.fasterSpeed)} और ${b} की ${hiV(input.slowerSpeed)} है। ${a} सामान्य शुरुआती रेखा से शुरू करता है। ${b} को कितने मीटर आगे से शुरू कराया जाए ताकि दोनों एक ही समय समाप्ति रेखा पर पहुँचें?`,
        "",
        `${hiM(input.raceDistance)} की दौड़ को बराबरी पर समाप्त कराना है। ${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से दौड़ते हैं। यदि ${a} शून्य मीटर से शुरू करे, तो ${b} का शुरुआती स्थान उससे कितने मीटर आगे होना चाहिए?`,
        "",
        `${a} और ${b} क्रमशः ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} से ${hiM(input.raceDistance)} की दौड़ दौड़ते हैं। धीमे धावक ${b} को कितनी शुरुआती दूरी का लाभ दिया जाए कि दोनों साथ समाप्त करें?`,
        "",
      ][i];
    }
    return [
      "",
      `${hiM(input.raceDistance)} की दौड़ में ${b} समय शून्य पर ${hiV(input.slowerSpeed)} से शुरू करता है। ${a} की गति ${hiV(input.fasterSpeed)} है। ${a} को कितने सेकंड देर से शुरू कराया जाए ताकि दोनों साथ समाप्ति रेखा पर पहुँचें?`,
      "",
      `${a} तेज और ${b} धीमा धावक है; उनकी गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। ${hiM(input.raceDistance)} की दौड़ में ${b} पहले शुरू करता है। ${a} की शुरुआत कितने सेकंड रोकी जाए कि परिणाम बराबरी का हो?`,
      "",
      `${hiM(input.raceDistance)} की दौड़ में ${a} को समय का नुकसान देकर ${b} के साथ बराबरी करानी है। ${a} और ${b} की गतियाँ ${hiV(input.fasterSpeed)} तथा ${hiV(input.slowerSpeed)} हैं। ${b} समय शून्य पर शुरू करे तो ${a} कितने सेकंड बाद शुरू करे?`,
    ][i];
  }
  if (qlId === "TSD-QL-120" && input.authorityKey === "leadConversionState") {
    if (input.mode === "DISTANCE_TO_TIME") return [
      `${a} के समाप्ति रेखा पर पहुँचते समय ${b} को ${hiM(input.distanceLead!)} दौड़ना बाकी है। ${b} की गति ${hiV(input.loserSpeed)} है। ${b}, ${a} से कितने सेकंड बाद पहुँचेगा?`, "",
      `जब ${a} दौड़ पूरी करता है, ${b} समाप्ति रेखा से ${hiM(input.distanceLead!)} पीछे है और ${hiV(input.loserSpeed)} से दौड़ रहा है। इस दूरी-अंतर के बराबर समय-अंतर कितना है?`, "",
      `${a} ने ${b} पर ${hiM(input.distanceLead!)} की अंतिम दूरी-बढ़त बनाई। यदि ${b} की गति ${hiV(input.loserSpeed)} है, तो यही परिणाम समय के रूप में कितने सेकंड की बढ़त है?`, "",
    ][i];
    return ["",
      `${a}, ${b} से ${hiS(input.timeLead!)} पहले समाप्ति रेखा पर पहुँचता है। ${b} की गति ${hiV(input.loserSpeed)} है। ${a} के पहुँचने के क्षण ${b} कितने मीटर पीछे था?`, "",
      `दौड़ का समय-अंतर ${hiS(input.timeLead!)} है और धीमे धावक ${b} की गति ${hiV(input.loserSpeed)} है। इस समय-अंतर को अंतिम दूरी-अंतर में बदलिए।`, "",
      `${b} ${hiV(input.loserSpeed)} से दौड़ता है और ${a} के ${hiS(input.timeLead!)} बाद समाप्ति रेखा पर पहुँचता है। ${a} की जीत का दूरी-अंतर कितना था?`,
    ][i];
  }
  if (qlId === "TSD-QL-121" && input.authorityKey === "transitiveRaceComparison") {
    return [
      `${hiM(input.raceDistance)} की दो अलग दौड़ों में, ${a} के समाप्त करने पर ${b} को ${hiM(input.aBeatsBBy)} बाकी रहता है; और ${b} के समाप्त करने पर ${c} को ${hiM(input.bBeatsCBy)} बाकी रहता है। सभी की स्थिर गति मानकर, ${a} के समाप्त करने पर ${c} को कितनी दूरी बाकी होगी?`,
      `तीन धावकों की तुलना समान ${hiM(input.raceDistance)} की दौड़ों से की गई। ${a} के जीतते समय ${b} ${hiM(input.aBeatsBBy)} पीछे था, जबकि ${b} के जीतते समय ${c} ${hiM(input.bBeatsCBy)} पीछे था। ${a} और ${c} की दौड़ में अंतिम दूरी-अंतर ज्ञात कीजिए।`,
      `पहली ${hiM(input.raceDistance)} की दौड़ में ${a} के पहुँचने पर ${b} के लिए ${hiM(input.aBeatsBBy)} शेष है। दूसरी समान लंबाई की दौड़ में ${b} के पहुँचने पर ${c} के लिए ${hiM(input.bBeatsCBy)} शेष है। इन दोनों परिणामों से ${a} के मुकाबले ${c} की शेष दूरी ज्ञात कीजिए।`,
      `समान लंबाई की स्वतंत्र दौड़ों के रिकॉर्ड हैं: ${a} के समाप्त करते समय ${b} ${hiM(input.aBeatsBBy)} पीछे, और ${b} के समाप्त करते समय ${c} ${hiM(input.bBeatsCBy)} पीछे। दौड़ की लंबाई ${hiM(input.raceDistance)} है। ${a} के समाप्त करते समय ${c} कहाँ होगा—समाप्ति रेखा से दूरी बताइए।`,
      `${a}, ${b} और ${c} की गतियाँ स्थिर हैं। ${hiM(input.raceDistance)} की दौड़ में ${a} के जीतने पर ${b} को ${hiM(input.aBeatsBBy)} और समान दूसरी दौड़ में ${b} के जीतने पर ${c} को ${hiM(input.bBeatsCBy)} बाकी रहता है। ${a} के जीतने पर ${c} के लिए कितनी दूरी शेष रहेगी?`,
      `${hiM(input.raceDistance)} की समान दूरी पर दो परिणाम दिए हैं: ${a} बनाम ${b} में अंतिम अंतर ${hiM(input.aBeatsBBy)}, और ${b} बनाम ${c} में ${hiM(input.bBeatsCBy)}। प्रत्येक अंतर उस समय मापा गया है जब पहला नामित धावक समाप्ति रेखा पर पहुँचा। ${a} बनाम ${c} का दूरी-अंतर ज्ञात कीजिए।`,
    ][i];
  }
  if (qlId === "TSD-QL-122" && input.authorityKey === "multiOutcomeRaceComparison") {
    return [
      `पहली ${hiM(input.firstRaceDistance)} की दौड़ में ${a} के समाप्त करने पर ${b} को ${hiM(input.firstRaceLead)} बाकी रहता है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${b} शुरुआती रेखा से ${hiM(input.secondRaceHeadStartForLoser)} आगे से और ${a} सामान्य रेखा से शुरू करता है। गतियाँ नहीं बदलतीं। ${a} कितने मीटर से जीतेगा?`,
      `${a} और ${b} की पहली दौड़ ${hiM(input.firstRaceDistance)} की है, जिसमें ${a} के जीतते समय ${b} ${hiM(input.firstRaceLead)} पीछे रहता है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} का शुरुआती दूरी-लाभ मिलता है। दोनों की अपनी गति पहले जैसी है। नया जीत-अंतर ज्ञात कीजिए।`,
      `एक परिणाम से गति-अनुपात तय करें: ${hiM(input.firstRaceDistance)} में ${a} के समाप्त करते समय ${b} के लिए ${hiM(input.firstRaceLead)} बाकी है। अब ${hiM(input.secondRaceDistance)} की नई दौड़ में ${b} को ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू कराया जाता है। ${a} की जीत की दूरी कितनी होगी?`,
      `पहली दौड़ में ${a} ने ${b} को ऐसी स्थिति में छोड़ा कि ${hiM(input.firstRaceDistance)} में ${b} को ${hiM(input.firstRaceLead)} बाकी था। दूसरी दौड़ ${hiM(input.secondRaceDistance)} की है; इस बार ${b} की शुरुआत ${hiM(input.secondRaceHeadStartForLoser)} आगे से है। स्थिर गतियाँ मानकर अंतिम अंतर निकालिए।`,
      `${a} और ${b} की गतियाँ दोनों दौड़ों में नहीं बदलतीं। पहली ${hiM(input.firstRaceDistance)} की दौड़ में अंतिम दूरी-अंतर ${hiM(input.firstRaceLead)} है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में केवल ${b} को ${hiM(input.secondRaceHeadStartForLoser)} का शुरुआती लाभ मिलता है। दूसरी दौड़ का जीत-अंतर ज्ञात कीजिए।`,
      `${hiM(input.firstRaceDistance)} की पहली दौड़ से पता चलता है कि ${a} के पहुँचने पर ${b} ${hiM(input.firstRaceLead)} पीछे है। उसी गति से होने वाली ${hiM(input.secondRaceDistance)} की दूसरी दौड़ में ${b} ${hiM(input.secondRaceHeadStartForLoser)} आगे से शुरू करता है। ${a} यदि जीतता है, तो कितने मीटर से?`,
    ][i];
  }
  if (qlId === "TSD-QL-123" && input.authorityKey === "changedRaceOutcomeState") {
    if (input.mode === "FASTER_SPEED_CHANGE") return [
      `${hiM(input.raceDistance)} की दौड़ में ${a} की गति ${hiV(input.fasterSpeed)} से बदलकर ${hiV(input.changedFasterSpeed!)} हो जाती है; ${b} ${hiV(input.slowerSpeed)} पर ही रहता है। दोनों साथ शुरू करते हैं। नया जीत-अंतर ज्ञात कीजिए।`, "", "",
      `पहले ${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से दौड़ते थे। अब ${hiM(input.raceDistance)} की दौड़ के लिए केवल ${a} अपनी गति ${hiV(input.changedFasterSpeed!)} कर देता है। साथ शुरू करने पर ${a} की नई दूरी-बढ़त कितनी होगी?`, "", "",
    ][i];
    if (input.mode === "SLOWER_REST") return ["",
      `${hiM(input.raceDistance)} की दौड़ में ${a} ${hiV(input.fasterSpeed)} और ${b} ${hiV(input.slowerSpeed)} से एक साथ शुरू करते हैं। ${b} बीच में कुल ${hiS(input.slowerRestTime!)} रुकता है, ${a} लगातार दौड़ता है। ${a} के पहुँचने पर ${b} के लिए कितनी दूरी बाकी होगी?`, "", "",
      `${a} और ${b} की गतियाँ ${hiV(input.fasterSpeed)} और ${hiV(input.slowerSpeed)} हैं। ${hiM(input.raceDistance)} की दौड़ में केवल ${b} कुल ${hiS(input.slowerRestTime!)} विश्राम करता है। ${a} के जीतने का दूरी-अंतर ज्ञात कीजिए।`, "",
    ][i];
    return ["", "",
      `${b} ${hiM(input.raceDistance)} की दौड़ समय शून्य पर ${hiV(input.slowerSpeed)} से शुरू करता है। ${a}, जिसकी गति ${hiV(input.fasterSpeed)} है, ${hiS(input.fasterStartDelay!)} बाद शुरू होता है। यदि ${a} पहले पहुँचता है, तो जीत का दूरी-अंतर ज्ञात कीजिए।`, "", "",
      `${hiM(input.raceDistance)} की दौड़ में ${b} पहले शुरू करता है और ${a} की शुरुआत ${hiS(input.fasterStartDelay!)} देर से होती है। उनकी गतियाँ क्रमशः ${hiV(input.slowerSpeed)} और ${hiV(input.fasterSpeed)} हैं। ${a} के समाप्त करते समय ${b} की शेष दूरी कितनी है?`,
    ][i];
  }
  if (qlId === "TSD-QL-124" && input.authorityKey === "runnerStateFromTwoRaceOutcomes") {
    const target = input.target === "FASTER_SPEED" ? a : b;
    return [
      `पहली ${hiM(input.firstRaceDistance)} की दौड़ में ${a} के पहुँचने पर ${b} को ${hiM(input.firstRaceDistanceLead)} बाकी है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${a}, ${b} से ${hiS(input.secondRaceTimeLead)} पहले पहुँचता है। दोनों हर दौड़ साथ शुरू करते हैं और प्रत्येक धावक की अपनी गति नहीं बदलती। ${target} की गति ज्ञात कीजिए।`,
      `${a} और ${b} की दो दौड़ों का रिकॉर्ड है। ${hiM(input.firstRaceDistance)} में ${a} के जीतने पर ${b} ${hiM(input.firstRaceDistanceLead)} पीछे है; ${hiM(input.secondRaceDistance)} में ${a} का समय-अंतर ${hiS(input.secondRaceTimeLead)} है। दोनों की अपनी-अपनी गति दोनों दौड़ों में स्थिर है। ${target} की गति निकालिए।`,
      `पहली दौड़ की लंबाई ${hiM(input.firstRaceDistance)} है और ${a} के समाप्त करने पर ${b} के लिए ${hiM(input.firstRaceDistanceLead)} शेष है। दूसरी दौड़ ${hiM(input.secondRaceDistance)} की है, जिसमें ${a} ${hiS(input.secondRaceTimeLead)} पहले पहुँचता है। हर धावक अपनी वही गति रखता है। ${target} की गति क्या है?`,
      `दोनों दौड़ों में ${a} और ${b} एक साथ शुरू करते हैं तथा किसी की गति नहीं बदलती। पहली ${hiM(input.firstRaceDistance)} की दौड़ का अंतिम दूरी-अंतर ${hiM(input.firstRaceDistanceLead)} है; दूसरी ${hiM(input.secondRaceDistance)} की दौड़ का अंतिम समय-अंतर ${hiS(input.secondRaceTimeLead)} है। ${target} की गति ज्ञात कीजिए।`,
      `${a} और ${b} के स्थिर गति वाले दो परिणाम दिए हैं: ${hiM(input.firstRaceDistance)} पर दूरी-अंतर ${hiM(input.firstRaceDistanceLead)}, और ${hiM(input.secondRaceDistance)} पर ${a} का समय-लाभ ${hiS(input.secondRaceTimeLead)}। दोनों बार शुरुआत साथ होती है। ${target} की गति निकालिए।`,
      `पहली दौड़ में ${a} के ${hiM(input.firstRaceDistance)} पूरा करने पर ${b} ${hiM(input.firstRaceDistanceLead)} पीछे है। दूसरी ${hiM(input.secondRaceDistance)} की दौड़ में ${a}, ${b} से ${hiS(input.secondRaceTimeLead)} पहले पहुँचता है। प्रत्येक धावक की अपनी गति दोनों दौड़ों में समान रहती है। ${target} की गति ज्ञात कीजिए।`,
    ][i];
  }
  return undefined;
}

function punjabiLateQlStem(qlId: string, familyId: string, input: TsdCp010ExecutableInput): string | undefined {
  const i = familyIndex(familyId);
  const [a, b, c] = PA_NAMES[i]!;
  if (qlId === "TSD-QL-119" && input.authorityKey === "deadHeatHandicapState") {
    if (input.mode === "DISTANCE_HANDICAP") return [
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਅਤੇ ${b} ਦੀ ${paV(input.slowerSpeed)} ਹੈ। ${a} ਆਮ ਸ਼ੁਰੂਆਤੀ ਰੇਖਾ ਤੋਂ ਦੌੜਦਾ ਹੈ। ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ ਤਾਂ ਜੋ ਦੋਵੇਂ ਇੱਕੋ ਸਮੇਂ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ?`, "",
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਨੂੰ ਬਰਾਬਰੀ 'ਤੇ ਖਤਮ ਕਰਾਉਣਾ ਹੈ। ${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਜੇ ${a} ਸਿਫ਼ਰ ਮੀਟਰ ਤੋਂ ਸ਼ੁਰੂ ਕਰੇ, ਤਾਂ ${b} ਦਾ ਸ਼ੁਰੂਆਤੀ ਸਥਾਨ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਹੋਵੇ?`, "",
      `${a} ਅਤੇ ${b} ਕ੍ਰਮਵਾਰ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਨਾਲ ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਦੌੜਦੇ ਹਨ। ਹੌਲੇ ਧਾਵਕ ${b} ਨੂੰ ਕਿੰਨਾ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ-ਲਾਭ ਦਿੱਤਾ ਜਾਵੇ ਕਿ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ?`, "",
    ][i];
    return ["",
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਸਮਾਂ ਸਿਫ਼ਰ 'ਤੇ ${paV(input.slowerSpeed)} ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਹੈ। ${a} ਨੂੰ ਕਿੰਨੇ ਸਕਿੰਟ ਦੇਰ ਨਾਲ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ ਤਾਂ ਜੋ ਦੋਵੇਂ ਇਕੱਠੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ?`, "",
      `${a} ਤੇਜ਼ ਅਤੇ ${b} ਹੌਲਾ ਧਾਵਕ ਹੈ; ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ਦੀ ਸ਼ੁਰੂਆਤ ਕਿੰਨੇ ਸਕਿੰਟ ਰੋਕੀ ਜਾਵੇ ਕਿ ਨਤੀਜਾ ਬਰਾਬਰੀ ਦਾ ਹੋਵੇ?`, "",
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਨੂੰ ਸਮੇਂ ਦੀ ਦੇਰੀ ਦੇ ਕੇ ${b} ਨਾਲ ਬਰਾਬਰੀ ਕਰਾਉਣੀ ਹੈ। ${b} ਸਮਾਂ ਸਿਫ਼ਰ 'ਤੇ ਸ਼ੁਰੂ ਕਰੇ ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰੇ? ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ।`,
    ][i];
  }
  if (qlId === "TSD-QL-120" && input.authorityKey === "leadConversionState") {
    if (input.mode === "DISTANCE_TO_TIME") return [
      `${a} ਦੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.distanceLead!)} ਦੂਰੀ ਬਾਕੀ ਹੈ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ${b}, ${a} ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਪਹੁੰਚੇਗਾ?`, "",
      `ਜਦੋਂ ${a} ਦੌੜ ਪੂਰੀ ਕਰਦਾ ਹੈ, ${b} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ${paM(input.distanceLead!)} ਪਿੱਛੇ ਹੈ ਅਤੇ ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜ ਰਿਹਾ ਹੈ। ਇਸ ਦੂਰੀ-ਅੰਤਰ ਦੇ ਬਰਾਬਰ ਸਮਾਂ-ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`, "",
      `${a} ਦੀ ਅੰਤਲੀ ਦੂਰੀ ਦੀ ਜਿੱਤ ${paM(input.distanceLead!)} ਹੈ। ਜੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ, ਤਾਂ ਇਹੀ ਨਤੀਜਾ ਸਮੇਂ ਵਿੱਚ ਕਿੰਨੇ ਸਕਿੰਟ ਦੀ ਜਿੱਤ ਹੈ?`, "",
    ][i];
    return ["",
      `${a}, ${b} ਤੋਂ ${paS(input.timeLead!)} ਪਹਿਲਾਂ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਕਿੰਨੇ ਮੀਟਰ ਪਿੱਛੇ ਸੀ?`, "",
      `ਦੌੜ ਦਾ ਸਮਾਂ-ਅੰਤਰ ${paS(input.timeLead!)} ਹੈ ਅਤੇ ਹੌਲੇ ਧਾਵਕ ${b} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.loserSpeed)} ਹੈ। ਇਸ ਸਮਾਂ-ਅੰਤਰ ਨੂੰ ਅੰਤਲੇ ਦੂਰੀ-ਅੰਤਰ ਵਿੱਚ ਬਦਲੋ।`, "",
      `${b} ${paV(input.loserSpeed)} ਨਾਲ ਦੌੜਦਾ ਹੈ ਅਤੇ ${a} ਤੋਂ ${paS(input.timeLead!)} ਬਾਅਦ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕਿੰਨਾ ਸੀ?`,
    ][i];
  }
  if (qlId === "TSD-QL-121" && input.authorityKey === "transitiveRaceComparison") {
    return [
      `${paM(input.raceDistance)} ਦੀਆਂ ਦੋ ਵੱਖ ਦੌੜਾਂ ਵਿੱਚ, ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.aBeatsBBy)} ਬਾਕੀ ਰਹਿੰਦਾ ਹੈ; ਅਤੇ ${b} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ਲਈ ${paM(input.bBeatsCBy)} ਬਾਕੀ ਰਹਿੰਦਾ ਹੈ। ਸਥਿਰ ਰਫ਼ਤਾਰਾਂ ਨਾਲ, ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੋਵੇਗੀ?`,
      `ਤਿੰਨ ਧਾਵਕਾਂ ਦੀ ਤੁਲਨਾ ਇੱਕੋ ${paM(input.raceDistance)} ਦੀਆਂ ਦੌੜਾਂ ਨਾਲ ਕੀਤੀ ਗਈ। ${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ${paM(input.aBeatsBBy)} ਪਿੱਛੇ ਸੀ ਅਤੇ ${b} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${c} ${paM(input.bBeatsCBy)} ਪਿੱਛੇ ਸੀ। ${a} ਅਤੇ ${c} ਦੀ ਦੌੜ ਦਾ ਅੰਤਲਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
      `ਪਹਿਲੀ ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.aBeatsBBy)} ਬਾਕੀ ਹੈ। ਦੂਜੀ ਇੱਕੋ ਲੰਬਾਈ ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ਲਈ ${paM(input.bBeatsCBy)} ਬਾਕੀ ਹੈ। ${a} ਦੇ ਮੁਕਾਬਲੇ ${c} ਦੀ ਬਾਕੀ ਦੂਰੀ ਕੱਢੋ।`,
      `ਇੱਕੋ ਲੰਬਾਈ ਦੀਆਂ ਅਲੱਗ ਦੌੜਾਂ ਦੇ ਨਤੀਜੇ ਹਨ: ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ${paM(input.aBeatsBBy)} ਪਿੱਛੇ ਅਤੇ ${b} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ${paM(input.bBeatsCBy)} ਪਿੱਛੇ। ਦੌੜ ${paM(input.raceDistance)} ਦੀ ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ਕਿੰਨਾ ਪਿੱਛੇ ਹੋਵੇਗਾ?`,
      `${a}, ${b} ਅਤੇ ${c} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਸਥਿਰ ਹਨ। ${paM(input.raceDistance)} ਵਿੱਚ ${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.aBeatsBBy)} ਅਤੇ ਹੋਰ ਇੱਕੋ ਦੂਰੀ ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${c} ਲਈ ${paM(input.bBeatsCBy)} ਬਾਕੀ ਹੈ। ${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${c} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਰਹੇਗੀ?`,
      `${paM(input.raceDistance)} ਦੀ ਇੱਕੋ ਦੂਰੀ 'ਤੇ ਦੋ ਨਤੀਜੇ ਦਿੱਤੇ ਹਨ: ${a} ਮੁਕਾਬਲੇ ${b} ਵਿੱਚ ਅੰਤਲਾ ਅੰਤਰ ${paM(input.aBeatsBBy)}, ਅਤੇ ${b} ਮੁਕਾਬਲੇ ${c} ਵਿੱਚ ${paM(input.bBeatsCBy)}। ਹਰ ਅੰਤਰ ਉਸ ਵੇਲੇ ਮਾਪਿਆ ਗਿਆ ਹੈ ਜਦੋਂ ਪਹਿਲਾ ਧਾਵਕ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ। ${a} ਮੁਕਾਬਲੇ ${c} ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
    ][i];
  }
  if (qlId === "TSD-QL-122" && input.authorityKey === "multiOutcomeRaceComparison") {
    return [
      `ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.firstRaceLead)} ਬਾਕੀ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਅਤੇ ${a} ਆਮ ਸ਼ੁਰੂਆਤੀ ਰੇਖਾ ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਰਫ਼ਤਾਰਾਂ ਨਹੀਂ ਬਦਲਦੀਆਂ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
      `${a} ਅਤੇ ${b} ਦੀ ਪਹਿਲੀ ਦੌੜ ${paM(input.firstRaceDistance)} ਦੀ ਹੈ, ਜਿਸ ਵਿੱਚ ${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ${paM(input.firstRaceLead)} ਪਿੱਛੇ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਦਾ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ-ਲਾਭ ਮਿਲਦਾ ਹੈ। ਦੋਵਾਂ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਪਹਿਲਾਂ ਵਰਗੀ ਹੈ। ਨਵਾਂ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
      `ਪਹਿਲੀ ਦੌੜ ਦਾ ਨਤੀਜਾ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਤੈਅ ਕਰਦਾ ਹੈ: ${paM(input.firstRaceDistance)} ਵਿੱਚ ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.firstRaceLead)} ਬਾਕੀ ਹੈ। ਹੁਣ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਂਦਾ ਹੈ। ${a} ਦੀ ਜਿੱਤ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੋਵੇਗੀ?`,
      `ਪਹਿਲੀ ਦੌੜ ਵਿੱਚ ${a} ਦੇ ${paM(input.firstRaceDistance)} ਪੂਰੇ ਕਰਨ ਵੇਲੇ ${b} ਲਈ ${paM(input.firstRaceLead)} ਬਾਕੀ ਸੀ। ਦੂਜੀ ਦੌੜ ${paM(input.secondRaceDistance)} ਦੀ ਹੈ ਅਤੇ ${b} ਦੀ ਸ਼ੁਰੂਆਤ ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਹੈ। ਸਥਿਰ ਰਫ਼ਤਾਰਾਂ ਨਾਲ ਅੰਤਲਾ ਅੰਤਰ ਕੱਢੋ।`,
      `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਨਹੀਂ ਬਦਲਦੀਆਂ। ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਦਾ ਅੰਤਲਾ ਅੰਤਰ ${paM(input.firstRaceLead)} ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ਸਿਰਫ਼ ${b} ਨੂੰ ${paM(input.secondRaceHeadStartForLoser)} ਦਾ ਸ਼ੁਰੂਆਤੀ ਲਾਭ ਮਿਲਦਾ ਹੈ। ਦੂਜੀ ਦੌੜ ਦਾ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
      `ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਤੋਂ ਪਤਾ ਲੱਗਦਾ ਹੈ ਕਿ ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ${paM(input.firstRaceLead)} ਪਿੱਛੇ ਹੈ। ਉਹੀ ਰਫ਼ਤਾਰਾਂ ਨਾਲ ${paM(input.secondRaceDistance)} ਦੀ ਦੂਜੀ ਦੌੜ ਵਿੱਚ ${b} ${paM(input.secondRaceHeadStartForLoser)} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a} ਜੇ ਜਿੱਤਦਾ ਹੈ ਤਾਂ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ?`,
    ][i];
  }
  if (qlId === "TSD-QL-123" && input.authorityKey === "changedRaceOutcomeState") {
    if (input.mode === "FASTER_SPEED_CHANGE") return [
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਤੋਂ ਬਦਲ ਕੇ ${paV(input.changedFasterSpeed!)} ਹੋ ਜਾਂਦੀ ਹੈ; ${b} ${paV(input.slowerSpeed)} 'ਤੇ ਹੀ ਰਹਿੰਦਾ ਹੈ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਨਵਾਂ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`, "", "",
      `ਪਹਿਲਾਂ ${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਦੌੜਦੇ ਸਨ। ਹੁਣ ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਲਈ ਸਿਰਫ਼ ${a} ਆਪਣੀ ਰਫ਼ਤਾਰ ${paV(input.changedFasterSpeed!)} ਕਰ ਲੈਂਦਾ ਹੈ। ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਨ 'ਤੇ ${a} ਦੀ ਨਵੀਂ ਜਿੱਤ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`, "", "",
    ][i];
    if (input.mode === "SLOWER_REST") return ["",
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${paV(input.fasterSpeed)} ਅਤੇ ${b} ${paV(input.slowerSpeed)} ਨਾਲ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${b} ਵਿਚਕਾਰ ਕੁੱਲ ${paS(input.slowerRestTime!)} ਰੁਕਦਾ ਹੈ, ${a} ਲਗਾਤਾਰ ਦੌੜਦਾ ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੈ?`, "", "",
      `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.fasterSpeed)} ਅਤੇ ${paV(input.slowerSpeed)} ਹਨ। ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ਸਿਰਫ਼ ${b} ਕੁੱਲ ${paS(input.slowerRestTime!)} ਆਰਾਮ ਕਰਦਾ ਹੈ। ${a} ਦੇ ਜਿੱਤਣ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`, "",
    ][i];
    return ["", "",
      `${b} ${paM(input.raceDistance)} ਦੀ ਦੌੜ ਸਮਾਂ ਸਿਫ਼ਰ 'ਤੇ ${paV(input.slowerSpeed)} ਨਾਲ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${a}, ਜਿਸ ਦੀ ਰਫ਼ਤਾਰ ${paV(input.fasterSpeed)} ਹੈ, ${paS(input.fasterStartDelay!)} ਬਾਅਦ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ। ਜੇ ${a} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ ਤਾਂ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`, "", "",
      `${paM(input.raceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${a} ਦੀ ਸ਼ੁਰੂਆਤ ${paS(input.fasterStartDelay!)} ਦੇਰ ਨਾਲ ਹੁੰਦੀ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${paV(input.slowerSpeed)} ਅਤੇ ${paV(input.fasterSpeed)} ਹਨ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੈ?`,
    ][i];
  }
  if (qlId === "TSD-QL-124" && input.authorityKey === "runnerStateFromTwoRaceOutcomes") {
    const target = input.target === "FASTER_SPEED" ? a : b;
    return [
      `ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.firstRaceDistanceLead)} ਬਾਕੀ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਵਿੱਚ ${a}, ${b} ਤੋਂ ${paS(input.secondRaceTimeLead)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਦੋਵੇਂ ਹਰ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ ਅਤੇ ਹਰ ਧਾਵਕ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੀ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
      `${a} ਅਤੇ ${b} ਦੀਆਂ ਦੋ ਦੌੜਾਂ ਦੇ ਨਤੀਜੇ ਹਨ। ${paM(input.firstRaceDistance)} ਵਿੱਚ ${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ${paM(input.firstRaceDistanceLead)} ਪਿੱਛੇ ਹੈ; ${paM(input.secondRaceDistance)} ਵਿੱਚ ${a} ਦਾ ਸਮਾਂ-ਅੰਤਰ ${paS(input.secondRaceTimeLead)} ਹੈ। ਦੋਵਾਂ ਦੀ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਸਥਿਰ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
      `ਪਹਿਲੀ ਦੌੜ ${paM(input.firstRaceDistance)} ਦੀ ਹੈ ਅਤੇ ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${paM(input.firstRaceDistanceLead)} ਬਾਕੀ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${paS(input.secondRaceTimeLead)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਹਰ ਧਾਵਕ ਆਪਣੀ ਉਹੀ ਰਫ਼ਤਾਰ ਰੱਖਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`,
      `ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ${a} ਅਤੇ ${b} ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ ਅਤੇ ਕਿਸੇ ਦੀ ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੀ। ਪਹਿਲੀ ${paM(input.firstRaceDistance)} ਦੀ ਦੌੜ ਦਾ ਅੰਤਲਾ ਦੂਰੀ-ਅੰਤਰ ${paM(input.firstRaceDistanceLead)} ਹੈ; ਦੂਜੀ ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਦਾ ਸਮਾਂ-ਅੰਤਰ ${paS(input.secondRaceTimeLead)} ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
      `${a} ਅਤੇ ${b} ਦੇ ਸਥਿਰ-ਰਫ਼ਤਾਰ ਵਾਲੇ ਦੋ ਨਤੀਜੇ ਹਨ: ${paM(input.firstRaceDistance)} 'ਤੇ ਦੂਰੀ-ਅੰਤਰ ${paM(input.firstRaceDistanceLead)}, ਅਤੇ ${paM(input.secondRaceDistance)} 'ਤੇ ${a} ਦਾ ਸਮਾਂ-ਲਾਭ ${paS(input.secondRaceTimeLead)}। ਦੋਵੇਂ ਵਾਰ ਸ਼ੁਰੂਆਤ ਇਕੱਠੀ ਹੁੰਦੀ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
      `ਪਹਿਲੀ ਦੌੜ ਵਿੱਚ ${a} ਦੇ ${paM(input.firstRaceDistance)} ਪੂਰੇ ਕਰਨ ਵੇਲੇ ${b} ${paM(input.firstRaceDistanceLead)} ਪਿੱਛੇ ਹੈ। ਦੂਜੀ ${paM(input.secondRaceDistance)} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਤੋਂ ${paS(input.secondRaceTimeLead)} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਹਰ ਧਾਵਕ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
    ][i];
  }
  return undefined;
}

export const TSD_CP010_NATIVE_FINAL_REVIEW = Object.freeze(
  TSD_CP010_LOCALIZED_REVIEW.map((question) => {
    const override = question.language === "hi"
      ? hindiLateQlStem(question.qlId, question.familyId, question.input)
      : punjabiLateQlStem(question.qlId, question.familyId, question.input);
    return Object.freeze({
      ...question,
      stem: clean(override ?? question.stem, question.language),
      explanation: Object.freeze({
        steps: Object.freeze(question.explanation.steps.map((step) => clean(step, question.language))),
        conclusion: clean(question.explanation.conclusion, question.language),
      }),
    });
  }),
);

export const TSD_CP010_NATIVE_FINAL_HINDI_REVIEW = Object.freeze(TSD_CP010_NATIVE_FINAL_REVIEW.filter((x) => x.language === "hi"));
export const TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW = Object.freeze(TSD_CP010_NATIVE_FINAL_REVIEW.filter((x) => x.language === "pa"));
