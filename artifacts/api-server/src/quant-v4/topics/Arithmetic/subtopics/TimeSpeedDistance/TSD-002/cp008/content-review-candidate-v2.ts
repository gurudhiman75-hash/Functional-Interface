import { absRational, equals, multiply, rational, subtract } from "../../TSD-001/foundation/rational";
import { calculationWriter, display, EDITORIAL_REVIEW_LOCK, type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP008_ENGLISH_REVIEW_CASES } from "./english-review-cases";
import { TSD_CP008_RENDERED_ENGLISH_QUESTIONS } from "./english-rendered-review";
import { TSD_CP008_RENDERED_LOCALIZED_QUESTIONS } from "./localized-rendered-review";
import type { TsdCp008ExecutableInput } from "./executable-types";

const KMH_FAMILIES = new Set(["95-A", "95-B", "95-C", "95-D", "95-F", "96-A", "96-C", "98-A", "98-C", "98-E", "99-A", "99-D", "99-F", "100-B", "100-E", "102-A", "102-B", "102-C", "102-D", "103-A", "103-C", "103-F"]);
const labels = {
  distance: ["Total crossing distance", "पार करने की कुल दूरी", "ਪਾਰ ਕਰਨ ਦੀ ਕੁੱਲ ਦੂਰੀ"],
  relative: ["Relative speed", "सापेक्ष चाल", "ਸਾਪੇਖ ਚਾਲ"],
  speedSum: ["Sum of relative speeds", "सापेक्ष चालों का योग", "ਸਾਪੇਖ ਚਾਲਾਂ ਦਾ ਜੋੜ"],
  speedDifference: ["Difference between relative speeds", "सापेक्ष चालों का अंतर", "ਸਾਪੇਖ ਚਾਲਾਂ ਦਾ ਫ਼ਰਕ"],
  time: ["Crossing time", "पार करने का समय", "ਪਾਰ ਕਰਨ ਦਾ ਸਮਾਂ"],
  length: ["Unknown train length", "अज्ञात रेलगाड़ी की लंबाई", "ਅਣਜਾਣ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ"],
  speed: ["Unknown train speed", "अज्ञात रेलगाड़ी की चाल", "ਅਣਜਾਣ ਰੇਲਗੱਡੀ ਦੀ ਚਾਲ"],
  train: ["Train speed", "रेलगाड़ी की चाल", "ਰੇਲਗੱਡੀ ਦੀ ਚਾਲ"],
  observer: ["Observer speed", "प्रेक्षक की चाल", "ਨਿਰੀਖਕ ਦੀ ਚਾਲ"],
  same: ["Relative speed in the same direction", "समान दिशा में सापेक्ष चाल", "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਸਾਪੇਖ ਚਾਲ"],
  opposite: ["Relative speed in opposite directions", "विपरीत दिशाओं में सापेक्ष चाल", "ਉਲਟ ਦਿਸ਼ਾਵਾਂ ਵਿੱਚ ਸਾਪੇਖ ਚਾਲ"],
  aDistance: ["Distance travelled by train A", "रेलगाड़ी A द्वारा तय दूरी", "ਰੇਲਗੱਡੀ A ਵੱਲੋਂ ਤੈਅ ਦੂਰੀ"],
  bDistance: ["Distance travelled by train B", "रेलगाड़ी B द्वारा तय दूरी", "ਰੇਲਗੱਡੀ B ਵੱਲੋਂ ਤੈਅ ਦੂਰੀ"],
  difference: ["Difference between train lengths", "रेलगाड़ियों की लंबाइयों का अंतर", "ਰੇਲਗੱਡੀਆਂ ਦੀਆਂ ਲੰਬਾਈਆਂ ਦਾ ਫ਼ਰਕ"],
  ratio: ["Length ratio minus one", "लंबाइयों का अनुपात घटा एक", "ਲੰਬਾਈਆਂ ਦਾ ਅਨੁਪਾਤ ਘਟਾ ਇੱਕ"],
  aLength: ["Length of train A", "रेलगाड़ी A की लंबाई", "ਰੇਲਗੱਡੀ A ਦੀ ਲੰਬਾਈ"],
  bLength: ["Length of train B", "रेलगाड़ी B की लंबाई", "ਰੇਲਗੱਡੀ B ਦੀ ਲੰਬਾਈ"],
  object: ["Length of the fixed object", "स्थिर वस्तु की लंबाई", "ਅਡੋਲ ਵਸਤੂ ਦੀ ਲੰਬਾਈ"],
  overlap: ["Full containment duration", "पूर्ण समावेशन की अवधि", "ਪੂਰੀ ਤਰ੍ਹਾਂ ਅੰਦਰ ਹੋਣ ਦੀ ਮਿਆਦ"],
} as const;

export function cp008WorkedCalculations(input: TsdCp008ExecutableInput, familyId: string, locale: ReviewLocale) {
  const w = calculationWriter(locale), b = w.binary;
  if (KMH_FAMILIES.has(familyId)) {
    for (const [key, value] of Object.entries(input)) {
      if (!/speed/i.test(key) || typeof value !== "object" || !("numerator" in value)) continue;
      const name = key === "observerSpeed" ? ["Observer", "प्रेक्षक", "ਨਿਰੀਖਕ"] : key === "otherSpeed" ? ["Other train", "दूसरी रेलगाड़ी", "ਦੂਜੀ ਰੇਲਗੱਡੀ"] : key === "speedB" || key === "slowerSpeed" ? ["Train B", "रेलगाड़ी B", "ਰੇਲਗੱਡੀ B"] : ["Train A", "रेलगाड़ी A", "ਰੇਲਗੱਡੀ A"];
      w.put([`${name[0]} speed in m/s`, `${name[1]} की चाल मीटर/सेकंड में`, `${name[2]} ਦੀ ਚਾਲ ਮੀਟਰ/ਸਕਿੰਟ ਵਿੱਚ`], `(${display(multiply(value, rational(18, 5)))}) × 5/18`, value, "m/s");
    }
  }
  let result;
  switch (input.authorityKey) {
    case "oppositeDirectionTrainCrossingTime":
    case "sameDirectionTrainCrossingTime": {
      const d = b(labels.distance, input.lengthA, "+", input.lengthB, "m");
      const r = input.authorityKey === "oppositeDirectionTrainCrossingTime"
        ? b(labels.relative, input.speedA, "+", input.speedB, "m/s")
        : b(labels.relative, input.fasterSpeed, "−", input.slowerSpeed, "m/s");
      result = b(labels.time, d, "÷", r, "s"); break;
    }
    case "relativeSpeedFromTrainCrossing": {
      const d = b(labels.distance, input.lengthA, "+", input.lengthB, "m");
      result = b(labels.relative, d, "÷", input.crossingTime, "m/s"); break;
    }
    case "trainLengthFromTrainCrossingEvidence": {
      const r = b(labels.relative, input.speedA, input.direction === "OPPOSITE" ? "+" : "−", input.speedB, "m/s");
      const d = b(labels.distance, r, "×", input.crossingTime, "m");
      result = b(labels.length, d, "−", input.knownLength, "m"); break;
    }
    case "trainSpeedFromTrainCrossingEvidence": {
      const d = b(labels.distance, input.lengthA, "+", input.lengthB, "m");
      const r = b(labels.relative, d, "÷", input.crossingTime, "m/s");
      result = b(labels.speed, r, input.direction === "OPPOSITE" ? "−" : "+", input.otherSpeed, "m/s"); break;
    }
    case "movingObserverTrainCrossingTime": {
      const r = b(labels.relative, input.trainSpeed, input.direction === "OPPOSITE" ? "+" : "−", input.observerSpeed, "m/s");
      result = b(labels.time, input.trainLength, "÷", r, "s"); break;
    }
    case "trainObserverStateFromCrossingTimes": {
      const same = b(labels.same, input.trainLength, "÷", input.sameDirectionTime, "m/s");
      const opposite = b(labels.opposite, input.trainLength, "÷", input.oppositeDirectionTime, "m/s");
      const combined = b(input.target === "TRAIN_SPEED" ? labels.speedSum : labels.speedDifference, opposite, input.target === "TRAIN_SPEED" ? "+" : "−", same, "m/s");
      result = b(input.target === "TRAIN_SPEED" ? labels.train : labels.observer, combined, "÷", rational(2), "m/s"); break;
    }
    case "sharedFixedObjectTwoTrainEvidence": {
      const da = b(labels.aDistance, input.speedA, "×", input.crossingTimeA, "m");
      const db = b(labels.bDistance, input.speedB, "×", input.crossingTimeB, "m");
      const difference = b(labels.difference, da, "−", db, "m");
      const factor = b(labels.ratio, input.lengthRatioAtoB, "−", rational(1), "");
      const lb = b(labels.bLength, difference, "÷", factor, "m");
      result = input.target === "TRAIN_A_LENGTH"
        ? b(labels.aLength, lb, "×", input.lengthRatioAtoB, "m")
        : b(labels.object, db, "−", lb, "m"); break;
    }
    case "fullContainmentOverlapDuration": {
      const difference = w.put(labels.difference, `|(${display(input.lengthA)}) − (${display(input.lengthB)})|`, absRational(subtract(input.lengthA, input.lengthB)), "m");
      const r = b(labels.relative, input.speedA, input.direction === "OPPOSITE" ? "+" : "−", input.speedB, "m/s");
      result = b(labels.overlap, difference, "÷", r, "s"); break;
    }
  }
  return Object.freeze({ result, steps: Object.freeze(w.steps) });
}

const cases = new Map(TSD_CP008_ENGLISH_REVIEW_CASES.map(row => [row.familyId, row]));
export const TSD_CP008_CONTENT_REVIEW_V2 = Object.freeze([
  ...TSD_CP008_RENDERED_ENGLISH_QUESTIONS.map(row => ({ ...row, locale: "en-IN" as const })),
  ...TSD_CP008_RENDERED_LOCALIZED_QUESTIONS,
].map(row => {
  const source = cases.get(row.familyId);
  if (!source) throw new Error(`${row.familyId}: CP008 source missing`);
  const worked = cp008WorkedCalculations(source.input, row.familyId, row.locale);
  if (!equals(worked.result, source.solution.value)) throw new Error(`${row.familyId}: worked answer mismatch`);
  const rationale = source.input.authorityKey === "sharedFixedObjectTwoTrainEvidence"
    ? ["Each complete crossing covers the train length plus the same fixed-object length. Subtracting the two travelled distances cancels the fixed-object length.", "हर बार पूरी तरह पार करने की दूरी में रेलगाड़ी और उसी स्थिर वस्तु की लंबाई शामिल है। दोनों तय दूरियों को घटाने पर स्थिर वस्तु की लंबाई कट जाती है।", "ਹਰ ਵਾਰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਦੀ ਦੂਰੀ ਵਿੱਚ ਰੇਲਗੱਡੀ ਅਤੇ ਉਸੇ ਅਡੋਲ ਵਸਤੂ ਦੀ ਲੰਬਾਈ ਸ਼ਾਮਲ ਹੈ। ਦੋਵਾਂ ਤੈਅ ਦੂਰੀਆਂ ਨੂੰ ਘਟਾਉਣ 'ਤੇ ਅਡੋਲ ਵਸਤੂ ਦੀ ਲੰਬਾਈ ਕੱਟ ਜਾਂਦੀ ਹੈ।"]
    : source.input.authorityKey === "trainObserverStateFromCrossingTimes"
      ? ["The two relative speeds are train speed minus observer speed and train speed plus observer speed. Their sum is twice the train speed; their difference is twice the observer speed.", "समान दिशा की सापेक्ष चाल रेलगाड़ी की चाल में से प्रेक्षक की चाल घटाने पर मिलती है। विपरीत दिशा की सापेक्ष चाल दोनों चालों का योग है। इन सापेक्ष चालों का योग रेलगाड़ी की चाल का दोगुना और अंतर प्रेक्षक की चाल का दोगुना है।", "ਇੱਕੋ ਦਿਸ਼ਾ ਦੀ ਸਾਪੇਖ ਚਾਲ ਰੇਲਗੱਡੀ ਦੀ ਚਾਲ ਵਿੱਚੋਂ ਨਿਰੀਖਕ ਦੀ ਚਾਲ ਘਟਾਉਣ 'ਤੇ ਮਿਲਦੀ ਹੈ। ਉਲਟ ਦਿਸ਼ਾ ਦੀ ਸਾਪੇਖ ਚਾਲ ਦੋਵਾਂ ਚਾਲਾਂ ਦਾ ਜੋੜ ਹੈ। ਇਨ੍ਹਾਂ ਸਾਪੇਖ ਚਾਲਾਂ ਦਾ ਜੋੜ ਰੇਲਗੱਡੀ ਦੀ ਚਾਲ ਦਾ ਦੁੱਗਣਾ ਅਤੇ ਫ਼ਰਕ ਨਿਰੀਖਕ ਦੀ ਚਾਲ ਦਾ ਦੁੱਗਣਾ ਹੈ।"]
      : source.input.authorityKey === "fullContainmentOverlapDuration"
        ? ["While the shorter train lies entirely within the longer train's lengthwise span, the relative distance covered is the difference between the train lengths.", "छोटी रेलगाड़ी पूरी तरह बड़ी रेलगाड़ी के लंबाई वाले विस्तार के भीतर रहने की अवधि में सापेक्ष दूरी दोनों लंबाइयों का अंतर है।", "ਛੋਟੀ ਰੇਲਗੱਡੀ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਡੀ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ਵਾਲੇ ਫੈਲਾਅ ਦੇ ਅੰਦਰ ਰਹਿਣ ਦੀ ਮਿਆਦ ਵਿੱਚ ਸਾਪੇਖ ਦੂਰੀ ਦੋਵਾਂ ਲੰਬਾਈਆਂ ਦਾ ਫ਼ਰਕ ਹੈ।"]
        : null;
  const note = rationale?.[row.locale === "en-IN" ? 0 : row.locale === "hi-IN" ? 1 : 2];
  return Object.freeze({ ...row, version: "tsd-cp008-content-review-v2", ...EDITORIAL_REVIEW_LOCK,
    input: source.input, sourceSolution: source.solution, sourceExplanation: row.explanation,
    explanation: Object.freeze([...(note ? [note] : []), ...worked.steps.map(step => step.text)]), calculations: worked.steps,
  });
}));
