import { toMixedString, type Rational } from "../../TSD-001/foundation/rational";
import type { TsdCp010ExecutableInput } from "./executable-types";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { TSD_CP010_NATIVE_FINAL_HINDI_REVIEW, TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW } from "./localization-native-final";

export type TsdCp010ExamRealLanguage = "en" | "hi" | "pa";

const EN_NAMES = Object.freeze([
  ["A", "B", "C"],
  ["P", "Q", "R"],
  ["Arun", "Bharat", "Chetan"],
  ["Ravi", "Sahil", "Vikas"],
  ["Karan", "Mohan", "Nitin"],
  ["Rohit", "Deepak", "Sumit"],
] as const);

const HI_NAMES = Object.freeze([
  ["A", "B", "C"],
  ["P", "Q", "R"],
  ["अरुण", "भारत", "चेतन"],
  ["रवि", "साहिल", "विकास"],
  ["करण", "मोहन", "नितिन"],
  ["रोहित", "दीपक", "सुमित"],
] as const);

const PA_NAMES = Object.freeze([
  ["A", "B", "C"],
  ["P", "Q", "R"],
  ["ਅਰੁਣ", "ਭਾਰਤ", "ਚੇਤਨ"],
  ["ਰਵੀ", "ਸਾਹਿਲ", "ਵਿਕਾਸ"],
  ["ਕਰਨ", "ਮੋਹਨ", "ਨਿਤਿਨ"],
  ["ਰੋਹਿਤ", "ਦੀਪਕ", "ਸੁਮਿਤ"],
] as const);

function indexOfFamily(familyId: string) {
  const i = familyId.charCodeAt(familyId.length - 1) - 65;
  if (i < 0 || i > 5) throw new Error(`${familyId}: CP010 exam-real family index outside A-F`);
  return i;
}

function value(r: Rational) { return toMixedString(r); }
function metres(r: Rational, language: TsdCp010ExamRealLanguage) {
  return `${value(r)} ${language === "en" ? "m" : language === "hi" ? "मीटर" : "ਮੀਟਰ"}`;
}
function seconds(r: Rational, language: TsdCp010ExamRealLanguage) {
  return `${value(r)} ${language === "en" ? "seconds" : language === "hi" ? "सेकंड" : "ਸਕਿੰਟ"}`;
}
function speed(r: Rational, language: TsdCp010ExamRealLanguage) {
  return `${value(r)} ${language === "en" ? "m/s" : language === "hi" ? "मीटर/सेकंड" : "ਮੀਟਰ/ਸਕਿੰਟ"}`;
}

function names(language: TsdCp010ExamRealLanguage, familyId: string) {
  const i = indexOfFamily(familyId);
  return (language === "en" ? EN_NAMES : language === "hi" ? HI_NAMES : PA_NAMES)[i]!;
}

function englishStem(familyId: string, input: TsdCp010ExecutableInput) {
  const i = indexOfFamily(familyId);
  const [a, b, c] = names("en", familyId);
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const d = metres(input.raceDistance, "en");
      const u = speed(input.winnerSpeed, "en");
      const v = speed(input.loserSpeed, "en");
      if (input.target === "PERCENT_OF_RACE") return [
        `${a} and ${b} run a ${d} race at ${u} and ${v}, respectively. ${a}'s winning margin is what percent of the race distance?`,
        `In a ${d} race, ${a} runs at ${u} and ${b} at ${v}. By what percent of the race length does ${a} beat ${b}?`,
        `${a} and ${b} start together for a ${d} race. Their speeds are ${u} and ${v}. ${a} beats ${b} by what percentage of the race length?`,
        `The speeds of ${a} and ${b} are ${u} and ${v}. In a ${d} race, ${a}'s winning distance is what percent of ${d}?`,
        `${a} runs at ${u} and ${b} at ${v}. If the race is ${d}, find ${a}'s winning margin as a percentage of the race distance.`,
        `In a ${d} race, ${a} and ${b} run at ${u} and ${v}. What percentage of the total distance is ${a}'s winning margin?`,
      ][i]!;
      return [
        `${a} and ${b} run a ${d} race at ${u} and ${v}, respectively. By how many metres does ${a} beat ${b}?`,
        `In a ${d} race, ${a} runs at ${u} and ${b} at ${v}. When ${a} reaches the winning post, how far is ${b} from it?`,
        `${a} can run at ${u} and ${b} at ${v}. If they start together in a ${d} race, by what distance does ${a} win?`,
        `${a} and ${b} start together for a ${d} race. Their speeds are ${u} and ${v}. What distance is left for ${b} when ${a} finishes?`,
        `The speeds of ${a} and ${b} are ${u} and ${v}. Find the distance by which ${a} wins a ${d} race.`,
        `In a ${d} race, ${a} runs at ${u} against ${b} at ${v}. Find ${a}'s winning margin.`,
      ][i]!;
    }
    case "finishTimeLeadState": {
      const d = metres(input.raceDistance, "en");
      const u = speed(input.winnerSpeed, "en");
      const v = speed(input.loserSpeed, "en");
      return [
        `${a} and ${b} run a ${d} race at ${u} and ${v}, respectively. By how many seconds does ${a} beat ${b}?`,
        `In a ${d} race, ${a} runs at ${u} and ${b} at ${v}. Find ${a}'s winning time.`,
        `${a} can run at ${u} and ${b} at ${v}. If both run ${d}, how many seconds before ${b} does ${a} finish?`,
        `${a} and ${b} start together for a ${d} race. Their speeds are ${u} and ${v}. Find the difference in their finishing times.`,
        `The speeds of ${a} and ${b} are ${u} and ${v}. By how many seconds will ${a} win a ${d} race?`,
        `In a ${d} race, ${a} runs at ${u} against ${b} at ${v}. What is the time gap at the finish?`,
      ][i]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") {
        const d = metres(input.raceDistance, "en");
        const lead = metres(input.distanceLead, "en");
        return [
          `In a ${d} race, ${a} beats ${b} by ${lead}. Find the ratio of their speeds, ${a}:${b}.`,
          `${a} beats ${b} by ${lead} in a ${d} race. What is the speed ratio ${a}:${b}?`,
          `When ${a} completes ${d}, ${b} is ${lead} short of the winning post. Find ${a}:${b} in speed.`,
          `In a race of ${d}, ${a} wins over ${b} by ${lead}. The ratio of their speeds is:`,
          `${a} and ${b} start together in a ${d} race. ${a} finishes when ${b} is ${lead} behind. Find their speed ratio.`,
          `${a} beats ${b} by ${lead} over ${d}. Find the ratio of the speed of ${a} to that of ${b}.`,
        ][i]!;
      }
      const t = seconds(input.winnerTime, "en");
      const gap = seconds(input.timeLead, "en");
      return [
        `${a} completes a race in ${t} and beats ${b} by ${gap}. Find the speed ratio ${a}:${b}.`,
        `In the same race, ${a} takes ${t} and ${b} finishes ${gap} later. Find ${a}:${b} in speed.`,
        `${a}'s time for a race is ${t}. ${b} reaches the finish ${gap} after ${a}. What is their speed ratio?`,
        `${a} beats ${b} by ${gap} in a race and takes ${t} to finish it. Find the ratio of their speeds.`,
        `For the same distance, ${a} finishes in ${t} while ${b} is ${gap} slower. Find ${a}:${b}.`,
        `${a} and ${b} cover the same race distance. ${a} takes ${t} and wins by ${gap}. Their speed ratio is:`,
      ][i]!;
    }
    case "raceLengthFromLeadEvidence": {
      const u = speed(input.winnerSpeed, "en");
      const v = speed(input.loserSpeed, "en");
      if (input.mode === "DISTANCE_LEAD") {
        const lead = metres(input.distanceLead, "en");
        return [
          `${a} runs at ${u} and ${b} at ${v}. If ${a} beats ${b} by ${lead}, find the length of the race.`,
          `The speeds of ${a} and ${b} are ${u} and ${v}. ${a} wins by ${lead}. What is the race distance?`,
          `${a} can run at ${u} and ${b} at ${v}. In a race ${a} beats ${b} by ${lead}. Find the length of the race.`,
          `${a} and ${b} start together at ${u} and ${v}. If ${a}'s winning margin is ${lead}, how long is the race?`,
          `In a race, ${a} runs at ${u}, ${b} at ${v}, and ${a} beats ${b} by ${lead}. Find the total distance.`,
          `${a} beats ${b} by ${lead} while their speeds are ${u} and ${v}. Find the distance of the race.`,
        ][i]!;
      }
      const gap = seconds(input.timeLead, "en");
      return [
        `${a} runs at ${u} and ${b} at ${v}. If ${a} beats ${b} by ${gap}, find the length of the race.`,
        `The speeds of ${a} and ${b} are ${u} and ${v}. ${a} finishes ${gap} before ${b}. Find the race distance.`,
        `${a} can run at ${u} and ${b} at ${v}. In a race ${a} wins by ${gap}. How long is the race?`,
        `${a} and ${b} start together at ${u} and ${v}. Their finishing times differ by ${gap}. Find the distance.`,
        `In the same race, ${a} runs at ${u}, ${b} at ${v}, and ${a} reaches the finish ${gap} earlier. Find the race length.`,
        `${a} beats ${b} by ${gap}; their speeds are ${u} and ${v}. Find the distance of the race.`,
      ][i]!;
    }
    case "deadHeatHandicapState": {
      const d = metres(input.raceDistance, "en");
      const u = speed(input.fasterSpeed, "en");
      const v = speed(input.slowerSpeed, "en");
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${a} and ${b} run at ${u} and ${v}. In a ${d} race, how much start should ${a} give ${b} so that both finish together?`,
        `In a ${d} race, ${a}'s speed is ${u} and ${b}'s is ${v}. How many metres ahead should ${b} start for a dead heat?`,
        `${a} runs at ${u} and ${b} at ${v}. What head start should ${b} get in a ${d} race so that neither wins?`,
        `For a ${d} race, the speeds of ${a} and ${b} are ${u} and ${v}. Find the distance start to be given to ${b} for an equal finish.`,
        `${a} is faster than ${b}, with speeds ${u} and ${v}. In a ${d} race, from how many metres ahead should ${b} start so that both reach the post together?`,
        `${a} and ${b} run a ${d} race at ${u} and ${v}. Find the head start in metres that makes the race a dead heat.`,
      ][i]!;
      return [
        `${a} and ${b} run at ${u} and ${v}. In a ${d} race, how many seconds after ${b} should ${a} start so that both finish together?`,
        `In a ${d} race, ${a}'s speed is ${u} and ${b}'s is ${v}. What time start should ${b} get for a dead heat?`,
        `${a} runs at ${u} and ${b} at ${v}. By how many seconds should ${a}'s start be delayed in a ${d} race so that neither wins?`,
        `For a ${d} race, the speeds of ${a} and ${b} are ${u} and ${v}. Find the time handicap to be given against ${a} for an equal finish.`,
        `${a} is faster than ${b}, with speeds ${u} and ${v}. If ${b} starts first, after how many seconds should ${a} start so that both reach the post together?`,
        `${a} and ${b} run a ${d} race at ${u} and ${v}. Find the start delay for ${a} that makes the race a dead heat.`,
      ][i]!;
    }
    case "leadConversionState": {
      const v = speed(input.loserSpeed, "en");
      if (input.mode === "DISTANCE_TO_TIME") {
        const lead = metres(input.distanceLead!, "en");
        return [
          `${a} beats ${b} by ${lead}. If ${b}'s speed is ${v}, by how many seconds does ${a} beat ${b}?`,
          `When ${a} finishes, ${b} is ${lead} behind and runs at ${v}. Find ${a}'s winning time.`,
          `${a}'s winning distance over ${b} is ${lead}. If ${b} runs at ${v}, express the same win in seconds.`,
          `${a} beats ${b} by ${lead}; ${b}'s speed is ${v}. What is the equivalent time lead?`,
          `At ${a}'s finish, ${b} has ${lead} left to cover at ${v}. How many seconds later will ${b} finish?`,
          `${b} is ${lead} short of the post when ${a} wins and is running at ${v}. By how many seconds does ${a} win?`,
        ][i]!;
      }
      const gap = seconds(input.timeLead!, "en");
      return [
        `${a} beats ${b} by ${gap}. If ${b}'s speed is ${v}, by how many metres does ${a} beat ${b}?`,
        `${a} finishes ${gap} before ${b}, who runs at ${v}. Find ${a}'s winning distance.`,
        `${a}'s winning time over ${b} is ${gap}. If ${b} runs at ${v}, express the same win in metres.`,
        `${a} beats ${b} by ${gap}; ${b}'s speed is ${v}. What is the equivalent distance lead?`,
        `When ${a} finishes, ${b} needs another ${gap} at ${v}. How far is ${b} from the post at that instant?`,
        `${b} reaches the finish ${gap} after ${a} and runs at ${v}. By how many metres does ${a} win?`,
      ][i]!;
    }
    case "transitiveRaceComparison": {
      const d = metres(input.raceDistance, "en");
      const x = metres(input.aBeatsBBy, "en");
      const y = metres(input.bBeatsCBy, "en");
      return [
        `${a} beats ${b} by ${x} and ${b} beats ${c} by ${y} in a ${d} race. By how many metres will ${a} beat ${c}?`,
        `In separate ${d} races, ${a} beats ${b} by ${x} and ${b} beats ${c} by ${y}. Find ${a}'s winning margin over ${c}.`,
        `${a} can beat ${b} by ${x} in ${d}, while ${b} can beat ${c} by ${y} over the same distance. How far will ${c} be behind when ${a} finishes?`,
        `In a ${d} race, ${a} beats ${b} by ${x}; ${b} beats ${c} by ${y}. Find the distance by which ${a} beats ${c}.`,
        `${a}, ${b} and ${c} run at fixed speeds. Over ${d}, ${a} beats ${b} by ${x} and ${b} beats ${c} by ${y}. Find the ${a}-${c} winning margin.`,
        `If ${a} beats ${b} by ${x} and ${b} beats ${c} by ${y} in races of ${d}, by what distance does ${a} beat ${c}?`,
      ][i]!;
    }
    case "multiOutcomeRaceComparison": {
      const d1 = metres(input.firstRaceDistance, "en");
      const lead = metres(input.firstRaceLead, "en");
      const d2 = metres(input.secondRaceDistance, "en");
      const start = metres(input.secondRaceHeadStartForLoser, "en");
      return [
        `${a} beats ${b} by ${lead} in a ${d1} race. In a ${d2} race, ${b} is given a start of ${start}. By how many metres does ${a} win?`,
        `In a ${d1} race, ${a} beats ${b} by ${lead}. If they race ${d2} and ${b} starts ${start} ahead, find ${a}'s winning margin.`,
        `${a} can beat ${b} by ${lead} over ${d1}. In a ${d2} race ${a} gives ${b} a start of ${start}. By what distance does ${a} beat ${b}?`,
        `The result of a ${d1} race is: ${a} beats ${b} by ${lead}. For a ${d2} race, ${b} gets a ${start} head start. Find the final margin.`,
        `${a} beats ${b} by ${lead} in ${d1}. Their speeds are unchanged. If ${b} starts ${start} ahead in a ${d2} race, how far ahead is ${a} at the finish?`,
        `In the first race of ${d1}, ${a} beats ${b} by ${lead}. In the second race of ${d2}, ${b} gets ${start} start. Find ${a}'s winning distance.`,
      ][i]!;
    }
    case "changedRaceOutcomeState": {
      const d = metres(input.raceDistance, "en");
      const u = speed(input.fasterSpeed, "en");
      const v = speed(input.slowerSpeed, "en");
      if (input.mode === "FASTER_SPEED_CHANGE") {
        const u2 = speed(input.changedFasterSpeed!, "en");
        return [
          `${a} and ${b} run a ${d} race at ${u} and ${v}. If ${a}'s speed is increased to ${u2}, by how many metres will ${a} beat ${b}?`,
          `In a ${d} race, ${a} normally runs at ${u} and ${b} at ${v}. ${a} now runs at ${u2}. Find the new winning margin.`,
          `${a}'s speed is raised from ${u} to ${u2}, while ${b} continues at ${v}. In a ${d} race, by what distance does ${a} win?`,
          `${a} and ${b} race ${d}. ${b}'s speed is ${v}; ${a}'s speed changes from ${u} to ${u2}. Find ${a}'s winning distance.`,
          `For a ${d} race, ${a} runs at ${u2} instead of ${u}, while ${b} runs at ${v}. By how many metres does ${a} beat ${b}?`,
          `In a ${d} race, ${a}'s speed becomes ${u2} and ${b}'s remains ${v}. Find the distance by which ${a} wins.`,
        ][i]!;
      }
      if (input.mode === "SLOWER_REST") {
        const rest = seconds(input.slowerRestTime!, "en");
        return [
          `${a} and ${b} run a ${d} race at ${u} and ${v}. If ${b} stops for a total of ${rest} during the race, by how many metres does ${a} win?`,
          `In a ${d} race, ${a} runs at ${u} and ${b} at ${v}. ${b} rests for ${rest} in all. Find ${a}'s winning margin.`,
          `${a} and ${b} start together for ${d}. Their speeds are ${u} and ${v}, but ${b} is stationary for ${rest}. By what distance does ${a} win?`,
          `${a} runs a ${d} race at ${u}. ${b} runs at ${v} but stops for ${rest} altogether. Find the winning distance.`,
          `In a ${d} race, ${b} runs at ${v} and loses ${rest} in rest time, while ${a} runs continuously at ${u}. How far does ${a} win by?`,
          `${a} runs at ${u} and ${b} at ${v} over ${d}. If ${b} takes total rest of ${rest}, find ${a}'s winning margin.`,
        ][i]!;
      }
      const delay = seconds(input.fasterStartDelay!, "en");
      return [
        `${a} runs at ${u} and gives ${b}, who runs at ${v}, a start of ${delay} in a ${d} race. ${a} still wins. By how many metres?`,
        `In a ${d} race, ${b} starts ${delay} before ${a}. Their speeds are ${v} and ${u}. Find ${a}'s winning margin.`,
        `${a}'s speed is ${u} and ${b}'s is ${v}. If ${a} starts ${delay} late in a ${d} race and still wins, by what distance does ${a} win?`,
        `${b} gets a ${delay} start in a ${d} race against ${a}. The speeds are ${v} and ${u}. Find the final distance margin.`,
        `In a ${d} race, ${a} runs at ${u} but starts ${delay} after ${b}, who runs at ${v}. How far ahead is ${a} at the finish?`,
        `${a} gives ${b} a time start of ${delay} in a ${d} race. Their speeds are ${u} and ${v}. Find ${a}'s winning distance.`,
      ][i]!;
    }
    case "runnerStateFromTwoRaceOutcomes": {
      const d1 = metres(input.firstRaceDistance, "en");
      const lead = metres(input.firstRaceDistanceLead, "en");
      const d2 = metres(input.secondRaceDistance, "en");
      const gap = seconds(input.secondRaceTimeLead, "en");
      const target = input.target === "FASTER_SPEED" ? a : b;
      return [
        `In a ${d1} race, ${a} beats ${b} by ${lead}. In a ${d2} race, ${a} beats ${b} by ${gap}. Find ${target}'s speed.`,
        `${a} beats ${b} by ${lead} over ${d1} and by ${gap} over ${d2}. If their speeds are unchanged, find the speed of ${target}.`,
        `The same ${a} and ${b} race twice. ${a} wins ${d1} by ${lead} and ${d2} by ${gap}. Find ${target}'s speed.`,
        `In one race of ${d1}, ${a} beats ${b} by ${lead}; in another of ${d2}, ${a} wins by ${gap}. Find the speed of ${target}.`,
        `${a} and ${b} keep the same speeds. ${a} beats ${b} by ${lead} in ${d1} and by ${gap} in ${d2}. What is ${target}'s speed?`,
        `${a} beats ${b} by ${lead} in a ${d1} race. He also beats ${b} by ${gap} in a ${d2} race. Find ${target}'s speed.`,
      ][i]!;
    }
  }
}

function hindiStem(familyId: string, input: TsdCp010ExecutableInput) {
  const i = indexOfFamily(familyId);
  const [a, b, c] = names("hi", familyId);
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const d = metres(input.raceDistance, "hi"), u = speed(input.winnerSpeed, "hi"), v = speed(input.loserSpeed, "hi");
      if (input.target === "PERCENT_OF_RACE") return [
        `${d} की दौड़ में ${a} और ${b} की गतियाँ क्रमशः ${u} और ${v} हैं। ${a} की जीत का दूरी-अंतर पूरी दौड़ का कितने प्रतिशत है?`,
        `${a} ${u} और ${b} ${v} से दौड़ते हैं। ${d} की दौड़ में ${a}, ${b} को दौड़ की लंबाई के कितने प्रतिशत से हराता है?`,
        `${a} और ${b} ${d} की दौड़ एक साथ शुरू करते हैं। उनकी गतियाँ ${u} और ${v} हैं। ${a} की जीत का अंतर पूरी दूरी का कितने प्रतिशत है?`,
        `${d} की दौड़ में ${a} की गति ${u} और ${b} की ${v} है। ${a} का जीत-अंतर ${d} का कितने प्रतिशत होगा?`,
        `${a} की गति ${u} और ${b} की ${v} है। ${d} की दौड़ में ${a} की जीत का अंतर प्रतिशत में ज्ञात कीजिए।`,
        `${a} और ${b} ${d} की दौड़ ${u} और ${v} से दौड़ते हैं। जीत का दूरी-अंतर कुल दूरी का कितने प्रतिशत है?`,
      ][i]!;
      return [
        `${d} की दौड़ में ${a} और ${b} की गतियाँ क्रमशः ${u} और ${v} हैं। ${a}, ${b} को कितने मीटर से हराता है?`,
        `${d} की दौड़ में ${a} ${u} और ${b} ${v} से दौड़ता है। ${a} के पहुँचने पर ${b} समाप्ति रेखा से कितनी दूर होगा?`,
        `${a} की गति ${u} और ${b} की ${v} है। दोनों ${d} की दौड़ एक साथ शुरू करें तो ${a} कितने मीटर से जीतेगा?`,
        `${a} और ${b} ${d} की दौड़ एक साथ शुरू करते हैं। उनकी गतियाँ ${u} और ${v} हैं। ${a} के पहुँचने पर ${b} को कितनी दूरी बाकी होगी?`,
        `${a} और ${b} की गतियाँ ${u} और ${v} हैं। ${d} की दौड़ में ${a} की जीत का दूरी-अंतर ज्ञात कीजिए।`,
        `${d} की दौड़ में ${a} ${u} और ${b} ${v} से दौड़ते हैं। ${a} कितने मीटर से जीतता है?`,
      ][i]!;
    }
    case "finishTimeLeadState": {
      const d = metres(input.raceDistance, "hi"), u = speed(input.winnerSpeed, "hi"), v = speed(input.loserSpeed, "hi");
      return [
        `${d} की दौड़ में ${a} और ${b} की गतियाँ ${u} और ${v} हैं। ${a}, ${b} को कितने सेकंड से हराता है?`,
        `${a} ${u} और ${b} ${v} से ${d} की दौड़ दौड़ते हैं। ${a} की समय-बढ़त कितनी है?`,
        `${a} की गति ${u} और ${b} की ${v} है। दोनों ${d} दौड़ें तो ${a}, ${b} से कितने सेकंड पहले पहुँचेगा?`,
        `${a} और ${b} ${d} की दौड़ एक साथ शुरू करते हैं। उनकी गतियाँ ${u} और ${v} हैं। समाप्ति समयों का अंतर ज्ञात कीजिए।`,
        `${a} और ${b} की गतियाँ ${u} और ${v} हैं। ${d} की दौड़ में ${a} कितने सेकंड से जीतेगा?`,
        `${d} की दौड़ में ${a} ${u} और ${b} ${v} से दौड़ते हैं। समाप्ति पर समय-अंतर कितना होगा?`,
      ][i]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") {
        const d = metres(input.raceDistance, "hi"), lead = metres(input.distanceLead, "hi");
        return [
          `${d} की दौड़ में ${a}, ${b} को ${lead} से हराता है। उनकी गतियों का अनुपात ${a}:${b} ज्ञात कीजिए।`,
          `${a}, ${b} को ${d} की दौड़ में ${lead} से हराता है। गति-अनुपात ${a}:${b} क्या है?`,
          `${a} के ${d} पूरा करने पर ${b} को ${lead} दौड़ना बाकी है। ${a}:${b} का गति-अनुपात ज्ञात कीजिए।`,
          `${d} की दौड़ में ${a} की जीत का अंतर ${lead} है। ${a} और ${b} की गतियों का अनुपात ज्ञात कीजिए।`,
          `${a} और ${b} ${d} की दौड़ एक साथ शुरू करते हैं। ${a} के पहुँचने पर ${b} ${lead} पीछे है। गति-अनुपात ज्ञात कीजिए।`,
          `${a}, ${b} को ${d} में ${lead} से हराता है। ${a} की गति : ${b} की गति ज्ञात कीजिए।`,
        ][i]!;
      }
      const t = seconds(input.winnerTime, "hi"), gap = seconds(input.timeLead, "hi");
      return [
        `${a} एक दौड़ ${t} में पूरी करता है और ${b} को ${gap} से हराता है। गति-अनुपात ${a}:${b} ज्ञात कीजिए।`,
        `एक ही दौड़ में ${a} का समय ${t} है और ${b}, ${gap} बाद पहुँचता है। गति-अनुपात ज्ञात कीजिए।`,
        `${a} दौड़ ${t} में पूरी करता है। ${b}, ${a} के ${gap} बाद समाप्ति रेखा पर पहुँचता है। दोनों की गतियों का अनुपात क्या है?`,
        `${a}, ${b} को ${gap} से हराता है और स्वयं ${t} में दौड़ पूरी करता है। गति-अनुपात ज्ञात कीजिए।`,
        `समान दूरी के लिए ${a} का समय ${t} है और ${b} उससे ${gap} अधिक लेता है। ${a}:${b} ज्ञात कीजिए।`,
        `${a} और ${b} समान दूरी दौड़ते हैं। ${a} का समय ${t} है और जीत का समय-अंतर ${gap} है। गति-अनुपात ज्ञात कीजिए।`,
      ][i]!;
    }
    case "raceLengthFromLeadEvidence": {
      const u = speed(input.winnerSpeed, "hi"), v = speed(input.loserSpeed, "hi");
      if (input.mode === "DISTANCE_LEAD") {
        const lead = metres(input.distanceLead, "hi");
        return [
          `${a} की गति ${u} और ${b} की ${v} है। यदि ${a}, ${b} को ${lead} से हराता है, तो दौड़ की लंबाई ज्ञात कीजिए।`,
          `${a} और ${b} की गतियाँ ${u} और ${v} हैं। ${a} की जीत का अंतर ${lead} है। दौड़ की दूरी कितनी है?`,
          `${a} ${u} और ${b} ${v} से दौड़ते हैं। ${a}, ${b} को ${lead} से हराता है। दौड़ की लंबाई ज्ञात कीजिए।`,
          `${a} और ${b} ${u} तथा ${v} से एक साथ दौड़ शुरू करते हैं। ${a} की जीत ${lead} से होती है। दौड़ कितनी लंबी है?`,
          `एक दौड़ में ${a} की गति ${u}, ${b} की ${v} और जीत का दूरी-अंतर ${lead} है। कुल दूरी ज्ञात कीजिए।`,
          `${a}, ${b} को ${lead} से हराता है; उनकी गतियाँ ${u} और ${v} हैं। दौड़ की दूरी ज्ञात कीजिए।`,
        ][i]!;
      }
      const gap = seconds(input.timeLead, "hi");
      return [
        `${a} की गति ${u} और ${b} की ${v} है। यदि ${a}, ${b} को ${gap} से हराता है, तो दौड़ की लंबाई ज्ञात कीजिए।`,
        `${a} और ${b} की गतियाँ ${u} और ${v} हैं। ${a}, ${b} से ${gap} पहले पहुँचता है। दौड़ की दूरी कितनी है?`,
        `${a} ${u} और ${b} ${v} से दौड़ते हैं। ${a} की समय-बढ़त ${gap} है। दौड़ की लंबाई ज्ञात कीजिए।`,
        `${a} और ${b} ${u} तथा ${v} से एक साथ दौड़ शुरू करते हैं। समाप्ति समयों में ${gap} का अंतर है। दूरी ज्ञात कीजिए।`,
        `एक ही दौड़ में ${a} की गति ${u}, ${b} की ${v} है और ${a} ${gap} पहले पहुँचता है। दौड़ की लंबाई ज्ञात कीजिए।`,
        `${a}, ${b} को ${gap} से हराता है; उनकी गतियाँ ${u} और ${v} हैं। दौड़ की दूरी ज्ञात कीजिए।`,
      ][i]!;
    }
    case "deadHeatHandicapState": {
      const d = metres(input.raceDistance, "hi"), u = speed(input.fasterSpeed, "hi"), v = speed(input.slowerSpeed, "hi");
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${a} और ${b} की गतियाँ ${u} और ${v} हैं। ${d} की दौड़ में ${b} को कितने मीटर आगे से शुरू कराया जाए कि दोनों साथ पहुँचें?`,
        `${d} की दौड़ में ${a} की गति ${u} और ${b} की ${v} है। बराबरी के लिए ${b} को कितने मीटर की शुरुआत दी जाए?`,
        `${a} ${u} और ${b} ${v} से दौड़ते हैं। ${d} की दौड़ में ${b} को कितने मीटर आगे से शुरू कराना होगा ताकि कोई न जीते?`,
        `${d} की दौड़ में ${a} और ${b} की गतियाँ ${u} और ${v} हैं। दोनों को एक साथ पहुँचाने के लिए ${b} का शुरुआती लाभ कितना हो?`,
        `${a} की गति ${u} और ${b} की ${v} है। ${d} की दौड़ में ${b} कहाँ से शुरू करे कि दोनों एक साथ समाप्ति रेखा पर पहुँचें?`,
        `${a} और ${b} ${d} की दौड़ ${u} और ${v} से दौड़ते हैं। बराबरी के लिए ${b} को कितने मीटर आगे से शुरू किया जाए?`,
      ][i]!;
      return [
        `${a} और ${b} की गतियाँ ${u} और ${v} हैं। ${d} की दौड़ में ${a}, ${b} से कितने सेकंड बाद शुरू करे कि दोनों साथ पहुँचें?`,
        `${d} की दौड़ में ${a} की गति ${u} और ${b} की ${v} है। बराबरी के लिए ${b} को कितने सेकंड पहले शुरू कराया जाए?`,
        `${a} ${u} और ${b} ${v} से दौड़ते हैं। ${a} की शुरुआत कितने सेकंड देर से हो ताकि ${d} की दौड़ में कोई न जीते?`,
        `${d} की दौड़ में ${a} और ${b} की गतियाँ ${u} और ${v} हैं। बराबरी के लिए ${a} की शुरुआत कितने सेकंड रोकी जाए?`,
        `${a} की गति ${u} और ${b} की ${v} है। यदि ${b} पहले शुरू करे, तो ${a} कितने सेकंड बाद शुरू करे कि दोनों साथ पहुँचें?`,
        `${a} और ${b} ${d} की दौड़ ${u} और ${v} से दौड़ते हैं। बराबरी के लिए ${a} की शुरुआत में कितनी देरी हो?`,
      ][i]!;
    }
    case "leadConversionState": {
      const v = speed(input.loserSpeed, "hi");
      if (input.mode === "DISTANCE_TO_TIME") {
        const lead = metres(input.distanceLead!, "hi");
        return [
          `${a}, ${b} को ${lead} से हराता है। यदि ${b} की गति ${v} है, तो ${a} कितने सेकंड से जीतता है?`,
          `${a} के पहुँचने पर ${b} ${lead} पीछे है और ${v} से दौड़ रहा है। जीत का समय-अंतर ज्ञात कीजिए।`,
          `${a} की ${b} पर जीत का दूरी-अंतर ${lead} है। ${b} की गति ${v} हो तो यही जीत कितने सेकंड की है?`,
          `${a}, ${b} को ${lead} से हराता है; ${b} की गति ${v} है। समतुल्य समय-अंतर कितना है?`,
          `${a} के पहुँचने पर ${b} को ${lead} दौड़ना बाकी है और उसकी गति ${v} है। ${b} कितने सेकंड बाद पहुँचेगा?`,
          `${a} के जीतते समय ${b} समाप्ति रेखा से ${lead} दूर है और ${v} से दौड़ रहा है। ${a} कितने सेकंड से जीतता है?`,
        ][i]!;
      }
      const gap = seconds(input.timeLead!, "hi");
      return [
        `${a}, ${b} को ${gap} से हराता है। यदि ${b} की गति ${v} है, तो ${a} कितने मीटर से जीतता है?`,
        `${a}, ${b} से ${gap} पहले पहुँचता है और ${b} की गति ${v} है। जीत का दूरी-अंतर ज्ञात कीजिए।`,
        `${a} की ${b} पर जीत का समय-अंतर ${gap} है। ${b} की गति ${v} हो तो यही जीत कितने मीटर की है?`,
        `${a}, ${b} को ${gap} से हराता है; ${b} की गति ${v} है। समतुल्य दूरी-अंतर कितना है?`,
        `${a} के पहुँचने पर ${b} को ${gap} और दौड़ना है तथा उसकी गति ${v} है। वह समाप्ति रेखा से कितनी दूर है?`,
        `${b}, ${a} के ${gap} बाद पहुँचता है और ${v} से दौड़ता है। ${a} कितने मीटर से जीतता है?`,
      ][i]!;
    }
    case "transitiveRaceComparison": {
      const d = metres(input.raceDistance, "hi"), x = metres(input.aBeatsBBy, "hi"), y = metres(input.bBeatsCBy, "hi");
      return [
        `${d} की दौड़ में ${a}, ${b} को ${x} से और ${b}, ${c} को ${y} से हराता है। ${a}, ${c} को कितने मीटर से हराएगा?`,
        `${d} की अलग-अलग दौड़ों में ${a}, ${b} को ${x} से तथा ${b}, ${c} को ${y} से हराता है। ${a} की ${c} पर जीत का अंतर ज्ञात कीजिए।`,
        `${a}, ${b} को ${d} में ${x} से हराता है और ${b}, ${c} को उसी दूरी में ${y} से। ${a} के पहुँचने पर ${c} कितना पीछे होगा?`,
        `${d} की दौड़ में ${a}, ${b} को ${x} से हराता है; ${b}, ${c} को ${y} से हराता है। ${a}, ${c} को कितनी दूरी से हराएगा?`,
        `${a}, ${b} और ${c} की गतियाँ नहीं बदलतीं। ${d} में ${a}, ${b} को ${x} से और ${b}, ${c} को ${y} से हराता है। ${a}-${c} जीत-अंतर ज्ञात कीजिए।`,
        `यदि ${a}, ${b} को ${x} से और ${b}, ${c} को ${y} से ${d} की दौड़ में हराता है, तो ${a}, ${c} को कितने मीटर से हराएगा?`,
      ][i]!;
    }
    case "multiOutcomeRaceComparison": {
      const d1 = metres(input.firstRaceDistance, "hi"), lead = metres(input.firstRaceLead, "hi"), d2 = metres(input.secondRaceDistance, "hi"), start = metres(input.secondRaceHeadStartForLoser, "hi");
      return [
        `${d1} की दौड़ में ${a}, ${b} को ${lead} से हराता है। ${d2} की दौड़ में ${b} को ${start} आगे से शुरू कराया जाता है। ${a} कितने मीटर से जीतेगा?`,
        `${a}, ${b} को ${d1} में ${lead} से हराता है। यदि ${d2} की दौड़ में ${b} ${start} आगे से शुरू करे, तो ${a} की जीत का अंतर ज्ञात कीजिए।`,
        `${a}, ${b} को ${d1} की दौड़ में ${lead} से हरा सकता है। ${d2} की दौड़ में ${a}, ${b} को ${start} की शुरुआत देता है। ${a} कितने मीटर से जीतेगा?`,
        `पहली ${d1} की दौड़ में ${a}, ${b} को ${lead} से हराता है। दूसरी ${d2} की दौड़ में ${b} को ${start} आगे से शुरू कराया जाता है। अंतिम अंतर ज्ञात कीजिए।`,
        `${a}, ${b} को ${d1} में ${lead} से हराता है। उनकी गतियाँ नहीं बदलतीं। ${d2} की दौड़ में ${b} ${start} आगे से शुरू करे तो ${a} कितने मीटर से जीतेगा?`,
        `${d1} की पहली दौड़ में ${a}, ${b} को ${lead} से हराता है। ${d2} की दूसरी दौड़ में ${b} को ${start} की शुरुआत मिलती है। ${a} का जीत-अंतर ज्ञात कीजिए।`,
      ][i]!;
    }
    case "changedRaceOutcomeState": {
      const d = metres(input.raceDistance, "hi"), u = speed(input.fasterSpeed, "hi"), v = speed(input.slowerSpeed, "hi");
      if (input.mode === "FASTER_SPEED_CHANGE") {
        const u2 = speed(input.changedFasterSpeed!, "hi");
        return [
          `${a} और ${b} ${d} की दौड़ ${u} और ${v} से दौड़ते हैं। यदि ${a} की गति बढ़कर ${u2} हो जाए, तो ${a} कितने मीटर से जीतेगा?`,
          `${d} की दौड़ में ${a} सामान्यतः ${u} और ${b} ${v} से दौड़ता है। अब ${a} ${u2} से दौड़ता है। नया जीत-अंतर ज्ञात कीजिए।`,
          `${a} की गति ${u} से बढ़कर ${u2} हो जाती है, जबकि ${b} ${v} पर रहता है। ${d} की दौड़ में ${a} कितने मीटर से जीतेगा?`,
          `${a} और ${b} ${d} की दौड़ दौड़ते हैं। ${b} की गति ${v} है और ${a} की गति ${u} से ${u2} हो जाती है। जीत-अंतर ज्ञात कीजिए।`,
          `${d} की दौड़ में ${a} ${u} के स्थान पर ${u2} से और ${b} ${v} से दौड़ता है। ${a}, ${b} को कितने मीटर से हराएगा?`,
          `${d} की दौड़ में ${a} की नई गति ${u2} और ${b} की गति ${v} है। ${a} की जीत का दूरी-अंतर ज्ञात कीजिए।`,
        ][i]!;
      }
      if (input.mode === "SLOWER_REST") {
        const rest = seconds(input.slowerRestTime!, "hi");
        return [
          `${a} और ${b} ${d} की दौड़ ${u} और ${v} से दौड़ते हैं। यदि ${b} कुल ${rest} रुकता है, तो ${a} कितने मीटर से जीतेगा?`,
          `${d} की दौड़ में ${a} ${u} और ${b} ${v} से दौड़ता है। ${b} कुल ${rest} विश्राम करता है। ${a} का जीत-अंतर ज्ञात कीजिए।`,
          `${a} और ${b} ${d} की दौड़ एक साथ शुरू करते हैं। उनकी गतियाँ ${u} और ${v} हैं, पर ${b} कुल ${rest} रुकता है। ${a} कितने मीटर से जीतेगा?`,
          `${a} ${d} की दौड़ ${u} से दौड़ता है। ${b} ${v} से दौड़ता है लेकिन कुल ${rest} रुकता है। जीत का दूरी-अंतर ज्ञात कीजिए।`,
          `${d} की दौड़ में ${b} ${v} से दौड़ता है पर कुल ${rest} रुकता है; ${a} ${u} से लगातार दौड़ता है। ${a} कितने मीटर से जीतेगा?`,
          `${a} ${u} और ${b} ${v} से ${d} दौड़ते हैं। ${b} कुल ${rest} विश्राम करता है। ${a} की जीत का अंतर ज्ञात कीजिए।`,
        ][i]!;
      }
      const delay = seconds(input.fasterStartDelay!, "hi");
      return [
        `${a} ${u} से दौड़ता है और ${b}, जिसकी गति ${v} है, को ${delay} की शुरुआत देता है। ${d} की दौड़ में ${a} फिर भी जीतता है। कितने मीटर से?`,
        `${d} की दौड़ में ${b}, ${a} से ${delay} पहले शुरू करता है। उनकी गतियाँ ${v} और ${u} हैं। ${a} का जीत-अंतर ज्ञात कीजिए।`,
        `${a} की गति ${u} और ${b} की ${v} है। ${d} की दौड़ में ${a} ${delay} देर से शुरू होकर भी जीतता है। कितने मीटर से?`,
        `${d} की दौड़ में ${b} को ${delay} की समय-बढ़त मिलती है। ${b} और ${a} की गतियाँ ${v} और ${u} हैं। अंतिम दूरी-अंतर ज्ञात कीजिए।`,
        `${d} की दौड़ में ${a} ${u} से दौड़ता है लेकिन ${b} के ${delay} बाद शुरू करता है; ${b} ${v} से दौड़ता है। ${a} कितने मीटर से जीतेगा?`,
        `${a}, ${b} को ${delay} की समय-शुरुआत देता है। ${d} की दौड़ में उनकी गतियाँ ${u} और ${v} हैं। ${a} का जीत-अंतर ज्ञात कीजिए।`,
      ][i]!;
    }
    case "runnerStateFromTwoRaceOutcomes": {
      const d1 = metres(input.firstRaceDistance, "hi"), lead = metres(input.firstRaceDistanceLead, "hi"), d2 = metres(input.secondRaceDistance, "hi"), gap = seconds(input.secondRaceTimeLead, "hi");
      const target = input.target === "FASTER_SPEED" ? a : b;
      return [
        `${d1} की दौड़ में ${a}, ${b} को ${lead} से हराता है। ${d2} की दौड़ में ${a}, ${b} को ${gap} से हराता है। ${target} की गति ज्ञात कीजिए।`,
        `${a}, ${b} को ${d1} में ${lead} से और ${d2} में ${gap} से हराता है। दोनों की गतियाँ नहीं बदलतीं। ${target} की गति ज्ञात कीजिए।`,
        `${a} और ${b} दो दौड़ें दौड़ते हैं। ${a}, ${d1} में ${lead} से और ${d2} में ${gap} से जीतता है। ${target} की गति क्या है?`,
        `एक ${d1} की दौड़ में ${a}, ${b} को ${lead} से हराता है; दूसरी ${d2} की दौड़ में ${a} ${gap} से जीतता है। ${target} की गति ज्ञात कीजिए।`,
        `${a} और ${b} की गतियाँ दोनों दौड़ों में समान रहती हैं। ${a}, ${b} को ${d1} में ${lead} से और ${d2} में ${gap} से हराता है। ${target} की गति ज्ञात कीजिए।`,
        `${a}, ${b} को ${d1} की दौड़ में ${lead} से तथा ${d2} की दौड़ में ${gap} से हराता है। ${target} की गति ज्ञात कीजिए।`,
      ][i]!;
    }
  }
}

function punjabiStem(familyId: string, input: TsdCp010ExecutableInput) {
  const i = indexOfFamily(familyId);
  const [a, b, c] = names("pa", familyId);
  switch (input.authorityKey) {
    case "finishDistanceLeadState": {
      const d = metres(input.raceDistance, "pa"), u = speed(input.winnerSpeed, "pa"), v = speed(input.loserSpeed, "pa");
      if (input.target === "PERCENT_OF_RACE") return [
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕ੍ਰਮਵਾਰ ${u} ਅਤੇ ${v} ਹਨ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਪੂਰੀ ਦੌੜ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
        `${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ਦੌੜ ਦੀ ਲੰਬਾਈ ਦੇ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ?`,
        `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ਪੂਰੀ ਦੂਰੀ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ${a} ਦਾ ਜਿੱਤ-ਅੰਤਰ ${d} ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੋਵੇਗਾ?`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ${u} ਅਤੇ ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੁੱਲ ਦੂਰੀ ਦਾ ਕਿੰਨਾ ਪ੍ਰਤੀਸ਼ਤ ਹੈ?`,
      ][i]!;
      return [
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਕ੍ਰਮਵਾਰ ${u} ਅਤੇ ${v} ਹਨ। ${a}, ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ਕਿੰਨਾ ਦੂਰ ਹੋਵੇਗਾ?`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ਦੋਵੇਂ ${d} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਨ ਤਾਂ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ਕਿੰਨੀ ਦੂਰੀ ਬਾਕੀ ਹੋਵੇਗੀ?`,
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤਦਾ ਹੈ?`,
      ][i]!;
    }
    case "finishTimeLeadState": {
      const d = metres(input.raceDistance, "pa"), u = speed(input.winnerSpeed, "pa"), v = speed(input.loserSpeed, "pa");
      return [
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${a}, ${b} ਨੂੰ ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ?`,
        `${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ${d} ਦੀ ਦੌੜ ਦੌੜਦੇ ਹਨ। ${a} ਦਾ ਸਮਾਂ-ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ਦੋਵੇਂ ${d} ਦੌੜਣ ਤਾਂ ${a}, ${b} ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਪਹੁੰਚੇਗਾ?`,
        `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ਪਹੁੰਚਣ ਦੇ ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਅੰਤ 'ਤੇ ਸਮੇਂ ਦਾ ਅੰਤਰ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      ][i]!;
    }
    case "raceSpeedRatioState": {
      if (input.mode === "DISTANCE_LEAD") {
        const d = metres(input.raceDistance, "pa"), lead = metres(input.distanceLead, "pa");
        return [
          `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ${a}:${b} ਕੱਢੋ।`,
          `${a}, ${b} ਨੂੰ ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${a}:${b} ਕੀ ਹੈ?`,
          `${a} ਦੇ ${d} ਪੂਰੇ ਕਰਨ ਵੇਲੇ ${b} ਲਈ ${lead} ਬਾਕੀ ਹੈ। ${a}:${b} ਦਾ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
          `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ${lead} ਹੈ। ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੱਢੋ।`,
          `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ${lead} ਪਿੱਛੇ ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
          `${a}, ${b} ਨੂੰ ${d} ਵਿੱਚ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a} ਦੀ ਰਫ਼ਤਾਰ : ${b} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        ][i]!;
      }
      const t = seconds(input.winnerTime, "pa"), gap = seconds(input.timeLead, "pa");
      return [
        `${a} ਇੱਕ ਦੌੜ ${t} ਵਿੱਚ ਪੂਰੀ ਕਰਦਾ ਹੈ ਅਤੇ ${b} ਨੂੰ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ${a}:${b} ਕੱਢੋ।`,
        `ਇੱਕੋ ਦੌੜ ਵਿੱਚ ${a} ਦਾ ਸਮਾਂ ${t} ਹੈ ਅਤੇ ${b}, ${gap} ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `${a} ਦੌੜ ${t} ਵਿੱਚ ਪੂਰੀ ਕਰਦਾ ਹੈ। ${b}, ${a} ਤੋਂ ${gap} ਬਾਅਦ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਦਾ ਹੈ। ਦੋਵਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਅਨੁਪਾਤ ਕੀ ਹੈ?`,
        `${a}, ${b} ਨੂੰ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਅਤੇ ਆਪ ${t} ਵਿੱਚ ਦੌੜ ਪੂਰੀ ਕਰਦਾ ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
        `ਇੱਕੋ ਦੂਰੀ ਲਈ ${a} ਦਾ ਸਮਾਂ ${t} ਹੈ ਅਤੇ ${b} ਉਸ ਤੋਂ ${gap} ਵੱਧ ਲੈਂਦਾ ਹੈ। ${a}:${b} ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਇੱਕੋ ਦੂਰੀ ਦੌੜਦੇ ਹਨ। ${a} ਦਾ ਸਮਾਂ ${t} ਹੈ ਅਤੇ ਜਿੱਤ ਦਾ ਸਮਾਂ-ਅੰਤਰ ${gap} ਹੈ। ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਕੱਢੋ।`,
      ][i]!;
    }
    case "raceLengthFromLeadEvidence": {
      const u = speed(input.winnerSpeed, "pa"), v = speed(input.loserSpeed, "pa");
      if (input.mode === "DISTANCE_LEAD") {
        const lead = metres(input.distanceLead, "pa");
        return [
          `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ਜੇ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ, ਤਾਂ ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
          `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ${lead} ਹੈ। ਦੌੜ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`,
          `${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
          `${a} ਅਤੇ ${b} ${u} ਅਤੇ ${v} ਨਾਲ ਇਕੱਠੇ ਦੌੜ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${a} ਦੀ ਜਿੱਤ ${lead} ਨਾਲ ਹੁੰਦੀ ਹੈ। ਦੌੜ ਕਿੰਨੀ ਲੰਬੀ ਹੈ?`,
          `ਇੱਕ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u}, ${b} ਦੀ ${v} ਅਤੇ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ${lead} ਹੈ। ਕੁੱਲ ਦੂਰੀ ਕੱਢੋ।`,
          `${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ; ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
        ][i]!;
      }
      const gap = seconds(input.timeLead, "pa");
      return [
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ਜੇ ${a}, ${b} ਨੂੰ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ, ਤਾਂ ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${a}, ${b} ਤੋਂ ${gap} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਦੌੜ ਦੀ ਦੂਰੀ ਕਿੰਨੀ ਹੈ?`,
        `${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${a} ਦਾ ਸਮਾਂ-ਅੰਤਰ ${gap} ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ${u} ਅਤੇ ${v} ਨਾਲ ਇਕੱਠੇ ਦੌੜ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਪਹੁੰਚਣ ਦੇ ਸਮਿਆਂ ਵਿੱਚ ${gap} ਦਾ ਅੰਤਰ ਹੈ। ਦੂਰੀ ਕੱਢੋ।`,
        `ਇੱਕੋ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u}, ${b} ਦੀ ${v} ਹੈ ਅਤੇ ${a} ${gap} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ। ਦੌੜ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ; ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ਦੌੜ ਦੀ ਦੂਰੀ ਕੱਢੋ।`,
      ][i]!;
    }
    case "deadHeatHandicapState": {
      const d = metres(input.raceDistance, "pa"), u = speed(input.fasterSpeed, "pa"), v = speed(input.slowerSpeed, "pa");
      if (input.mode === "DISTANCE_HANDICAP") return [
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ ਕਿ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ਬਰਾਬਰੀ ਲਈ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ?`,
        `${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਨਾ ਹੋਵੇਗਾ ਤਾਂ ਜੋ ਕੋਈ ਨਾ ਜਿੱਤੇ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ਦੋਵਾਂ ਨੂੰ ਇਕੱਠੇ ਪਹੁੰਚਾਉਣ ਲਈ ${b} ਦਾ ਸ਼ੁਰੂਆਤੀ ਦੂਰੀ-ਲਾਭ ਕਿੰਨਾ ਹੋਵੇ?`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਕਿੰਨਾ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰੇ ਕਿ ਦੋਵੇਂ ਇਕੱਠੇ ਅੰਤਲੀ ਰੇਖਾ 'ਤੇ ਪਹੁੰਚਣ?`,
        `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ${u} ਅਤੇ ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਬਰਾਬਰੀ ਲਈ ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕੀਤਾ ਜਾਵੇ?`,
      ][i]!;
      return [
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਤੋਂ ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰੇ ਕਿ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ਬਰਾਬਰੀ ਲਈ ${b} ਨੂੰ ਕਿੰਨੇ ਸਕਿੰਟ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਵੇ?`,
        `${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ${a} ਦੀ ਸ਼ੁਰੂਆਤ ਕਿੰਨੇ ਸਕਿੰਟ ਦੇਰ ਨਾਲ ਹੋਵੇ ਕਿ ${d} ਦੀ ਦੌੜ ਵਿੱਚ ਕੋਈ ਨਾ ਜਿੱਤੇ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ਬਰਾਬਰੀ ਲਈ ${a} ਦੀ ਸ਼ੁਰੂਆਤ ਕਿੰਨੇ ਸਕਿੰਟ ਰੋਕੀ ਜਾਵੇ?`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ਜੇ ${b} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰੇ, ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਸ਼ੁਰੂ ਕਰੇ ਕਿ ਦੋਵੇਂ ਇਕੱਠੇ ਪਹੁੰਚਣ?`,
        `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ${u} ਅਤੇ ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਬਰਾਬਰੀ ਲਈ ${a} ਦੀ ਸ਼ੁਰੂਆਤ ਵਿੱਚ ਕਿੰਨੀ ਦੇਰੀ ਹੋਵੇ?`,
      ][i]!;
    }
    case "leadConversionState": {
      const v = speed(input.loserSpeed, "pa");
      if (input.mode === "DISTANCE_TO_TIME") {
        const lead = metres(input.distanceLead!, "pa");
        return [
          `${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ, ਤਾਂ ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਜਿੱਤਦਾ ਹੈ?`,
          `${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ${lead} ਪਿੱਛੇ ਹੈ ਅਤੇ ${v} ਨਾਲ ਦੌੜ ਰਿਹਾ ਹੈ। ਜਿੱਤ ਦਾ ਸਮਾਂ-ਅੰਤਰ ਕੱਢੋ।`,
          `${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ${lead} ਹੈ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੋਵੇ ਤਾਂ ਇਹੀ ਜਿੱਤ ਕਿੰਨੇ ਸਕਿੰਟ ਦੀ ਹੈ?`,
          `${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ; ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ। ਇਸ ਦੇ ਬਰਾਬਰ ਸਮਾਂ-ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
          `${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ${lead} ਬਾਕੀ ਹੈ ਅਤੇ ਉਸ ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ। ${b} ਕਿੰਨੇ ਸਕਿੰਟ ਬਾਅਦ ਪਹੁੰਚੇਗਾ?`,
          `${a} ਦੇ ਜਿੱਤਣ ਵੇਲੇ ${b} ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ${lead} ਦੂਰ ਹੈ ਅਤੇ ${v} ਨਾਲ ਦੌੜ ਰਿਹਾ ਹੈ। ${a} ਕਿੰਨੇ ਸਕਿੰਟ ਨਾਲ ਜਿੱਤਦਾ ਹੈ?`,
        ][i]!;
      }
      const gap = seconds(input.timeLead!, "pa");
      return [
        `${a}, ${b} ਨੂੰ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ, ਤਾਂ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤਦਾ ਹੈ?`,
        `${a}, ${b} ਤੋਂ ${gap} ਪਹਿਲਾਂ ਪਹੁੰਚਦਾ ਹੈ ਅਤੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ। ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
        `${a} ਦੀ ${b} ਉੱਤੇ ਜਿੱਤ ਦਾ ਸਮਾਂ-ਅੰਤਰ ${gap} ਹੈ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੋਵੇ ਤਾਂ ਇਹੀ ਜਿੱਤ ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਹੈ?`,
        `${a}, ${b} ਨੂੰ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ; ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ। ਇਸ ਦੇ ਬਰਾਬਰ ਦੂਰੀ-ਅੰਤਰ ਕਿੰਨਾ ਹੈ?`,
        `${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${b} ਲਈ ਹੋਰ ${gap} ਦਾ ਸਮਾਂ ਬਾਕੀ ਹੈ ਅਤੇ ਉਸ ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ। ਉਹ ਅੰਤਲੀ ਰੇਖਾ ਤੋਂ ਕਿੰਨਾ ਦੂਰ ਹੈ?`,
        `${b}, ${a} ਤੋਂ ${gap} ਬਾਅਦ ਪਹੁੰਚਦਾ ਹੈ ਅਤੇ ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤਦਾ ਹੈ?`,
      ][i]!;
    }
    case "transitiveRaceComparison": {
      const d = metres(input.raceDistance, "pa"), x = metres(input.aBeatsBBy, "pa"), y = metres(input.bBeatsCBy, "pa");
      return [
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${x} ਨਾਲ ਅਤੇ ${b}, ${c} ਨੂੰ ${y} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a}, ${c} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
        `${d} ਦੀਆਂ ਵੱਖ-ਵੱਖ ਦੌੜਾਂ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${x} ਨਾਲ ਅਤੇ ${b}, ${c} ਨੂੰ ${y} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a} ਦੀ ${c} ਉੱਤੇ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${d} ਵਿੱਚ ${x} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ ਅਤੇ ${b}, ${c} ਨੂੰ ਉਸੇ ਦੂਰੀ ਵਿੱਚ ${y} ਨਾਲ। ${a} ਦੇ ਪਹੁੰਚਣ ਵੇਲੇ ${c} ਕਿੰਨਾ ਪਿੱਛੇ ਹੋਵੇਗਾ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${x} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ; ${b}, ${c} ਨੂੰ ${y} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a}, ${c} ਨੂੰ ਕਿੰਨੀ ਦੂਰੀ ਨਾਲ ਹਰਾਏਗਾ?`,
        `${a}, ${b} ਅਤੇ ${c} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਨਹੀਂ ਬਦਲਦੀਆਂ। ${d} ਵਿੱਚ ${a}, ${b} ਨੂੰ ${x} ਨਾਲ ਅਤੇ ${b}, ${c} ਨੂੰ ${y} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${a}-${c} ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
        `ਜੇ ${a}, ${b} ਨੂੰ ${x} ਨਾਲ ਅਤੇ ${b}, ${c} ਨੂੰ ${y} ਨਾਲ ${d} ਦੀ ਦੌੜ ਵਿੱਚ ਹਰਾਉਂਦਾ ਹੈ, ਤਾਂ ${a}, ${c} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
      ][i]!;
    }
    case "multiOutcomeRaceComparison": {
      const d1 = metres(input.firstRaceDistance, "pa"), lead = metres(input.firstRaceLead, "pa"), d2 = metres(input.secondRaceDistance, "pa"), start = metres(input.secondRaceHeadStartForLoser, "pa");
      return [
        `${d1} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ${start} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਂਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a}, ${b} ਨੂੰ ${d1} ਵਿੱਚ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਜੇ ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ${start} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰੇ, ਤਾਂ ${a} ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${d1} ਦੀ ਦੌੜ ਵਿੱਚ ${lead} ਨਾਲ ਹਰਾ ਸਕਦਾ ਹੈ। ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${start} ਦੀ ਸ਼ੁਰੂਆਤ ਦਿੰਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `ਪਹਿਲੀ ${d1} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੂਜੀ ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ${start} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰਾਇਆ ਜਾਂਦਾ ਹੈ। ਅੰਤਲਾ ਅੰਤਰ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${d1} ਵਿੱਚ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਨਹੀਂ ਬਦਲਦੀਆਂ। ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ${start} ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ ਕਰੇ ਤਾਂ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${d1} ਦੀ ਪਹਿਲੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${d2} ਦੀ ਦੂਜੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ${start} ਦੀ ਸ਼ੁਰੂਆਤ ਮਿਲਦੀ ਹੈ। ${a} ਦਾ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
      ][i]!;
    }
    case "changedRaceOutcomeState": {
      const d = metres(input.raceDistance, "pa"), u = speed(input.fasterSpeed, "pa"), v = speed(input.slowerSpeed, "pa");
      if (input.mode === "FASTER_SPEED_CHANGE") {
        const u2 = speed(input.changedFasterSpeed!, "pa");
        return [
          `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ${u} ਅਤੇ ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਜੇ ${a} ਦੀ ਰਫ਼ਤਾਰ ਵੱਧ ਕੇ ${u2} ਹੋ ਜਾਵੇ, ਤਾਂ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
          `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਆਮ ਤੌਰ 'ਤੇ ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਹੁਣ ${a} ${u2} ਨਾਲ ਦੌੜਦਾ ਹੈ। ਨਵਾਂ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
          `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਤੋਂ ਵੱਧ ਕੇ ${u2} ਹੋ ਜਾਂਦੀ ਹੈ, ਜਦਕਿ ${b} ${v} 'ਤੇ ਰਹਿੰਦਾ ਹੈ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
          `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ਦੌੜਦੇ ਹਨ। ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ ਅਤੇ ${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਤੋਂ ${u2} ਹੋ ਜਾਂਦੀ ਹੈ। ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
          `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${u} ਦੀ ਥਾਂ ${u2} ਨਾਲ ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${a}, ${b} ਨੂੰ ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਹਰਾਏਗਾ?`,
          `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਦੀ ਨਵੀਂ ਰਫ਼ਤਾਰ ${u2} ਅਤੇ ${b} ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
        ][i]!;
      }
      if (input.mode === "SLOWER_REST") {
        const rest = seconds(input.slowerRestTime!, "pa");
        return [
          `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ${u} ਅਤੇ ${v} ਨਾਲ ਦੌੜਦੇ ਹਨ। ਜੇ ${b} ਕੁੱਲ ${rest} ਰੁਕਦਾ ਹੈ, ਤਾਂ ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
          `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${b} ਕੁੱਲ ${rest} ਆਰਾਮ ਕਰਦਾ ਹੈ। ${a} ਦਾ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
          `${a} ਅਤੇ ${b} ${d} ਦੀ ਦੌੜ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ, ਪਰ ${b} ਕੁੱਲ ${rest} ਰੁਕਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
          `${a} ${d} ਦੀ ਦੌੜ ${u} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${b} ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ ਪਰ ਕੁੱਲ ${rest} ਰੁਕਦਾ ਹੈ। ਜਿੱਤ ਦਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
          `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ ਪਰ ਕੁੱਲ ${rest} ਰੁਕਦਾ ਹੈ; ${a} ${u} ਨਾਲ ਲਗਾਤਾਰ ਦੌੜਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
          `${a} ${u} ਅਤੇ ${b} ${v} ਨਾਲ ${d} ਦੌੜਦੇ ਹਨ। ${b} ਕੁੱਲ ${rest} ਆਰਾਮ ਕਰਦਾ ਹੈ। ${a} ਦੀ ਜਿੱਤ ਦਾ ਅੰਤਰ ਕੱਢੋ।`,
        ][i]!;
      }
      const delay = seconds(input.fasterStartDelay!, "pa");
      return [
        `${a} ${u} ਨਾਲ ਦੌੜਦਾ ਹੈ ਅਤੇ ${b}, ਜਿਸ ਦੀ ਰਫ਼ਤਾਰ ${v} ਹੈ, ਨੂੰ ${delay} ਦੀ ਸ਼ੁਰੂਆਤ ਦਿੰਦਾ ਹੈ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ਫਿਰ ਵੀ ਜਿੱਤਦਾ ਹੈ। ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${b}, ${a} ਤੋਂ ${delay} ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${v} ਅਤੇ ${u} ਹਨ। ${a} ਦਾ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
        `${a} ਦੀ ਰਫ਼ਤਾਰ ${u} ਅਤੇ ${b} ਦੀ ${v} ਹੈ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${delay} ਦੇਰ ਨਾਲ ਸ਼ੁਰੂ ਹੋ ਕੇ ਵੀ ਜਿੱਤਦਾ ਹੈ। ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ?`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${b} ਨੂੰ ${delay} ਦੀ ਸਮਾਂ-ਸ਼ੁਰੂਆਤ ਮਿਲਦੀ ਹੈ। ${b} ਅਤੇ ${a} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${v} ਅਤੇ ${u} ਹਨ। ਅੰਤਲਾ ਦੂਰੀ-ਅੰਤਰ ਕੱਢੋ।`,
        `${d} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${u} ਨਾਲ ਦੌੜਦਾ ਹੈ ਪਰ ${b} ਤੋਂ ${delay} ਬਾਅਦ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ; ${b} ${v} ਨਾਲ ਦੌੜਦਾ ਹੈ। ${a} ਕਿੰਨੇ ਮੀਟਰ ਨਾਲ ਜਿੱਤੇਗਾ?`,
        `${a}, ${b} ਨੂੰ ${delay} ਦੀ ਸਮਾਂ-ਸ਼ੁਰੂਆਤ ਦਿੰਦਾ ਹੈ। ${d} ਦੀ ਦੌੜ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ${u} ਅਤੇ ${v} ਹਨ। ${a} ਦਾ ਜਿੱਤ-ਅੰਤਰ ਕੱਢੋ।`,
      ][i]!;
    }
    case "runnerStateFromTwoRaceOutcomes": {
      const d1 = metres(input.firstRaceDistance, "pa"), lead = metres(input.firstRaceDistanceLead, "pa"), d2 = metres(input.secondRaceDistance, "pa"), gap = seconds(input.secondRaceTimeLead, "pa");
      const target = input.target === "FASTER_SPEED" ? a : b;
      return [
        `${d1} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${d1} ਵਿੱਚ ${lead} ਨਾਲ ਅਤੇ ${d2} ਵਿੱਚ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ਦੋਵਾਂ ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਨਹੀਂ ਬਦਲਦੀਆਂ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਦੋ ਦੌੜਾਂ ਦੌੜਦੇ ਹਨ। ${a}, ${d1} ਵਿੱਚ ${lead} ਨਾਲ ਅਤੇ ${d2} ਵਿੱਚ ${gap} ਨਾਲ ਜਿੱਤਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੀ ਹੈ?`,
        `ਇੱਕ ${d1} ਦੀ ਦੌੜ ਵਿੱਚ ${a}, ${b} ਨੂੰ ${lead} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ; ਦੂਜੀ ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${a} ${gap} ਨਾਲ ਜਿੱਤਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a} ਅਤੇ ${b} ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦੀਆਂ ਹਨ। ${a}, ${b} ਨੂੰ ${d1} ਵਿੱਚ ${lead} ਨਾਲ ਅਤੇ ${d2} ਵਿੱਚ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
        `${a}, ${b} ਨੂੰ ${d1} ਦੀ ਦੌੜ ਵਿੱਚ ${lead} ਨਾਲ ਅਤੇ ${d2} ਦੀ ਦੌੜ ਵਿੱਚ ${gap} ਨਾਲ ਹਰਾਉਂਦਾ ਹੈ। ${target} ਦੀ ਰਫ਼ਤਾਰ ਕੱਢੋ।`,
      ][i]!;
    }
  }
}

export function renderTsdCp010ExamRealStem(language: TsdCp010ExamRealLanguage, familyId: string, input: TsdCp010ExecutableInput) {
  return language === "en" ? englishStem(familyId, input) : language === "hi" ? hindiStem(familyId, input) : punjabiStem(familyId, input);
}

export const TSD_CP010_EXAM_REAL_ENGLISH_REVIEW = Object.freeze(
  TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.map((question) => Object.freeze({ ...question, stem: englishStem(question.familyId, question.input) })),
);

export const TSD_CP010_EXAM_REAL_HINDI_REVIEW = Object.freeze(
  TSD_CP010_NATIVE_FINAL_HINDI_REVIEW.map((question) => Object.freeze({ ...question, stem: hindiStem(question.familyId, question.input) })),
);

export const TSD_CP010_EXAM_REAL_PUNJABI_REVIEW = Object.freeze(
  TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW.map((question) => Object.freeze({ ...question, stem: punjabiStem(question.familyId, question.input) })),
);
