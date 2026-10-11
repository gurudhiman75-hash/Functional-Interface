import { add, compare, divide, rational, subtract, toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import { EDITORIAL_REVIEW_LOCK } from "../../quality-audit/worked-calculation";

export type TimeHeadstartObservations = Readonly<{
  raceDistance: Rational;
  firstHeadstart: Rational;
  secondHeadstart: Rational;
  firstDistanceLead: Rational;
}>;

export function solveTimeHeadstartObservations(input: TimeHeadstartObservations) {
  const zero = rational(0);
  const { raceDistance: distance, firstHeadstart: h1, secondHeadstart: h2, firstDistanceLead: lead } = input;
  if (compare(distance, zero) <= 0 || compare(h1, zero) < 0 || compare(h2, h1) <= 0
    || compare(lead, zero) <= 0 || compare(lead, distance) >= 0) throw new Error("Infeasible time-headstart observations");
  const headstartDifference = subtract(h2, h1);
  const slowerSpeed = divide(lead, headstartDifference);
  const fasterFinishTime = subtract(divide(distance, slowerSpeed), h2);
  if (compare(fasterFinishTime, zero) <= 0) throw new Error("Headstart exceeds the slower runner's full-race time");
  const fasterSpeed = divide(distance, fasterFinishTime);
  if (compare(fasterSpeed, slowerSpeed) <= 0) throw new Error("Faster runner must have the higher speed");
  return Object.freeze({ slowerSpeed, fasterSpeed, fasterFinishTime, headstartDifference });
}

// One source observation and five explicitly authored parameter variants.
const states = [[2000,60,80,200],[400,20,30,50],[800,10,20,80],
  [600,20,40,120],[1000,10,25,120],[300,10,20,60]] as const;
export const TSD_CP010_TIME_HEADSTARTS_REVIEW_V1 = Object.freeze(states.flatMap(([distance,h1,h2,lead], index) => {
  const input = Object.freeze({ raceDistance:rational(distance), firstHeadstart:rational(h1),
    secondHeadstart:rational(h2), firstDistanceLead:rational(lead) });
  const solution = solveTimeHeadstartObservations(input);
  const { fasterSpeed, slowerSpeed, fasterFinishTime: time, headstartDifference: gap } = solution;
  const wrongFirstTime = divide(input.raceDistance, subtract(time, input.firstHeadstart));
  const wrongExtraTime = divide(input.raceDistance, add(time, gap));
  const speeds = [fasterSpeed, slowerSpeed, wrongFirstTime, wrongExtraTime];
  const misconceptions = [null,"SLOWER_SPEED_AS_FASTER","FIRST_HEADSTART_SUBTRACTED_FROM_FAST_TIME","HEADSTART_DIFFERENCE_ADDED_TO_FAST_TIME"] as const;
  const stems = [
    `In a ${distance} m race, runner A gives runner B a ${h1}-second head start and wins by ${lead} m. With an ${h2}-second head start for B, the race ends in a dead heat. Both runners keep the same constant speeds in the two races. What is A's speed?`,
    `${distance} मीटर की दौड़ में धावक A, धावक B को ${h1} सेकंड पहले दौड़ शुरू करने देता है और ${lead} मीटर से जीतता है। B को ${h2} सेकंड पहले शुरू करने देने पर दोनों एक साथ दौड़ पूरी करते हैं। दोनों दौड़ों में प्रत्येक धावक की गति स्थिर और समान रहती है। A की गति कितनी है?`,
    `${distance} ਮੀਟਰ ਦੀ ਦੌੜ ਵਿੱਚ ਦੌੜਾਕ A, ਦੌੜਾਕ B ਨੂੰ ${h1} ਸਕਿੰਟ ਪਹਿਲਾਂ ਦੌੜ ਸ਼ੁਰੂ ਕਰਨ ਦਿੰਦਾ ਹੈ ਅਤੇ ${lead} ਮੀਟਰ ਨਾਲ ਜਿੱਤਦਾ ਹੈ। B ਨੂੰ ${h2} ਸਕਿੰਟ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਨ ਦੇਣ 'ਤੇ ਦੋਵੇਂ ਇਕੱਠੇ ਦੌੜ ਪੂਰੀ ਕਰਦੇ ਹਨ। ਦੋਵਾਂ ਦੌੜਾਂ ਵਿੱਚ ਹਰੇਕ ਦੌੜਾਕ ਦੀ ਰਫ਼ਤਾਰ ਇੱਕਸਾਰ ਅਤੇ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ। A ਦੀ ਰਫ਼ਤਾਰ ਕਿੰਨੀ ਹੈ?`,
  ];
  return (["en","hi","pa"] as const).map((locale,l) => {
    const unit = ["m/s","मी/सेकंड","ਮੀ/ਸਕਿੰਟ"][l];
    const values = speeds.map(speed => `${toMixedString(speed)} ${unit}`);
    const offset = (index+l)%4;
    const options = Object.freeze([...values.slice(offset),...values.slice(0,offset)]);
    const labels = l===0 ? ["Extra head start for B","B's speed","A's race time","A's speed"]
      : l===1 ? ["B को मिला अतिरिक्त समय","B की गति","A का दौड़ का समय","A की गति"]
      : ["B ਨੂੰ ਮਿਲਿਆ ਵਾਧੂ ਸਮਾਂ","B ਦੀ ਰਫ਼ਤਾਰ","A ਦਾ ਦੌੜ ਦਾ ਸਮਾਂ","A ਦੀ ਰਫ਼ਤਾਰ"];
    const seconds = ["seconds","सेकंड","ਸਕਿੰਟ"][l];
    const steps = Object.freeze([
      ["A takes the same time in both races. B covers the first race's remaining distance during the extra head start.",
        "A दोनों दौड़ों में समान समय लेता है। B अतिरिक्त समय में पहली दौड़ की बची हुई दूरी तय करता है।",
        "A ਦੋਵਾਂ ਦੌੜਾਂ ਵਿੱਚ ਇੱਕੋ ਸਮਾਂ ਲੈਂਦਾ ਹੈ। B ਵਾਧੂ ਸਮੇਂ ਵਿੱਚ ਪਹਿਲੀ ਦੌੜ ਦੀ ਬਾਕੀ ਦੂਰੀ ਤੈਅ ਕਰਦਾ ਹੈ।"][l],
      `${labels[0]} = ${h2} − ${h1} = ${toMixedString(gap)} ${seconds}.`,
      `${labels[1]} = ${lead} ÷ ${toMixedString(gap)} = ${toMixedString(slowerSpeed)} ${unit}.`,
      `${labels[2]} = ${distance} ÷ ${toMixedString(slowerSpeed)} − ${h2} = ${toMixedString(time)} ${seconds}.`,
      `${labels[3]} = ${distance} ÷ ${toMixedString(time)} = ${values[0]}.`,
    ]);
    return Object.freeze({ ...EDITORIAL_REVIEW_LOCK, version:"TSD-CP010-TIME-HEADSTARTS-SOURCE-REVIEW-V1",
      familyId:`TSD-CP010-TIME-HEADSTARTS-${index+1}`, locale, input, solution,
      sourceObservation:index===0 ? "ARUN-SHARMA-2018-PDF416-PRINTED-III172-Q16" : "AUTHORED_PARAMETER_VARIANT",
      stem:stems[l], options, answerText:values[0], correctIndex:(4-offset)%4,
      optionMisconceptionIds:Object.freeze([...misconceptions.slice(offset),...misconceptions.slice(0,offset)]),
      explanation:Object.freeze({steps}) });
  });
}));
