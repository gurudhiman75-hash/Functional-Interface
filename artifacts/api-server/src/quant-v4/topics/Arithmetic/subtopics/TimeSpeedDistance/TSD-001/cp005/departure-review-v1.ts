import { add, divide, equals, multiply, rational, type Rational } from "../foundation/rational";
import { calculationWriter, display, EDITORIAL_REVIEW_LOCK, type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q } from "./english-approved-freeze-v13";
import { TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q } from "./localization/native-approved-freeze-v5";

function sqrtExact(v: Rational): Rational {
  const root = (n: bigint) => {
    if (n < 0n) throw new Error("Negative time product");
    if (n < 2n) return n;
    let a = n, b = (a + 1n) / 2n;
    while (b < a) { a = b; b = (a + n / a) / 2n; }
    if (a * a !== n) throw new Error("Non-exact review meeting time");
    return a;
  };
  return rational(root(v.numerator), root(v.denominator));
}
const rows = [
  ...TSD_CP005_APPROVED_ENGLISH_FROZEN_78Q.map(source => ({source, presentation: source, locale: "en-IN" as ReviewLocale})),
  ...TSD_CP005_APPROVED_NATIVE_FROZEN_V5_156Q.map(row => ({source: row.source, presentation: row.presentation, locale: `${row.presentation.language}-IN` as ReviewLocale})),
].filter(row => row.source.permanentQlId === "TSD-QL-061");

export const TSD_CP005_DEPARTURE_REVIEW_V1 = Object.freeze(rows.map(({source, presentation, locale}) => {
  const d = source.input.routeDistance!, ta = source.input.postMeetingTimeA!, tb = source.input.postMeetingTimeB!;
  const w = calculationWriter(locale), f = display;
  const meeting = sqrtExact(multiply(ta, tb));
  const minutesA = f(multiply(ta, rational(60))), minutesB = f(multiply(tb, rational(60)));
  const context = presentation.stem.match(/^.*?[.।]/u)?.[0] ?? "";
  const stem = locale === "en-IN"
    ? `${context} A and B start simultaneously from opposite ends P and Q of a ${f(d)} km route, moving towards each other at constant speeds. After meeting, A takes ${minutesA} minutes to reach Q and B takes ${minutesB} minutes to reach P. What are their speeds, A first?`
    : locale === "hi-IN"
      ? `${context} A और B, ${f(d)} किमी लंबे मार्ग के विपरीत सिरों P और Q से एक ही समय पर एक-दूसरे की ओर स्थिर चालों से चलते हैं। मिलने के बाद A को Q तक पहुँचने में ${minutesA} मिनट और B को P तक पहुँचने में ${minutesB} मिनट लगते हैं। क्रमशः A और B की चालें कितनी हैं?`
      : `${context} A ਅਤੇ B, ${f(d)} ਕਿਮੀ ਲੰਬੇ ਰਸਤੇ ਦੇ ਉਲਟ ਸਿਰਿਆਂ P ਅਤੇ Q ਤੋਂ ਇੱਕੋ ਸਮੇਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਅਟੱਲ ਚਾਲਾਂ ਨਾਲ ਚੱਲਦੇ ਹਨ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ A ਨੂੰ Q ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ${minutesA} ਮਿੰਟ ਅਤੇ B ਨੂੰ P ਤੱਕ ਪਹੁੰਚਣ ਵਿੱਚ ${minutesB} ਮਿੰਟ ਲੱਗਦੇ ਹਨ। ਕ੍ਰਮਵਾਰ A ਅਤੇ B ਦੀਆਂ ਚਾਲਾਂ ਕਿੰਨੀਆਂ ਹਨ?`;
  w.put(["Time before meeting", "मिलने से पहले का समय", "ਮਿਲਣ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਸਮਾਂ"], `√((${f(ta)}) × (${f(tb)}))`, meeting, "h");
  const totalA = w.binary(["A's total journey time", "A की यात्रा का कुल समय", "A ਦੇ ਸਫ਼ਰ ਦਾ ਕੁੱਲ ਸਮਾਂ"], meeting, "+", ta, "h");
  const speedA = w.binary(["Speed of A", "A की चाल", "A ਦੀ ਚਾਲ"], d, "÷", totalA, "km/h");
  const totalB = w.binary(["B's total journey time", "B की यात्रा का कुल समय", "B ਦੇ ਸਫ਼ਰ ਦਾ ਕੁੱਲ ਸਮਾਂ"], meeting, "+", tb, "h");
  const speedB = w.binary(["Speed of B", "B की चाल", "B ਦੀ ਚਾਲ"], d, "÷", totalB, "km/h");
  if (!equals(speedA, source.solution.values![0]!) || !equals(speedB, source.solution.values![1]!)) throw new Error("CP005 departure candidate answer drift");
  const reasoning = locale === "en-IN"
    ? "Let t be the time before meeting, and u and v the speeds of A and B. Their post-meeting journeys give u × tA = v × t and v × tB = u × t. Multiplying and cancelling u × v gives t² = tA × tB."
    : locale === "hi-IN"
      ? "मिलने से पहले का समय t और A तथा B की चालें u और v मानते हैं। मिलने के बाद की यात्राओं से u × tA = v × t और v × tB = u × t मिलते हैं। दोनों को गुणा करके u × v काटने पर t² = tA × tB मिलता है।"
      : "ਮਿਲਣ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਸਮਾਂ t ਅਤੇ A ਤੇ B ਦੀਆਂ ਚਾਲਾਂ u ਤੇ v ਮੰਨਦੇ ਹਾਂ। ਮਿਲਣ ਤੋਂ ਬਾਅਦ ਦੇ ਸਫ਼ਰਾਂ ਤੋਂ u × tA = v × t ਅਤੇ v × tB = u × t ਮਿਲਦੇ ਹਨ। ਦੋਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰਕੇ u × v ਕੱਟਣ 'ਤੇ t² = tA × tB ਮਿਲਦਾ ਹੈ।";
  return Object.freeze({version: "tsd-cp005-departure-review-v1", ...EDITORIAL_REVIEW_LOCK, locale,
    qlId: source.permanentQlId, seed: source.seed, stem, sourceStem: presentation.stem,
    input: source.input, mathematicalFingerprint: source.mathematicalFingerprint,
    options: presentation.options, correctIndex: presentation.correctIndex, answer: presentation.answerText,
    explanation: Object.freeze([reasoning, ...w.steps.map(step => step.text)]), calculations: Object.freeze(w.steps),
    meetingTime: meeting, speeds: Object.freeze([speedA, speedB]),
  });
}));
