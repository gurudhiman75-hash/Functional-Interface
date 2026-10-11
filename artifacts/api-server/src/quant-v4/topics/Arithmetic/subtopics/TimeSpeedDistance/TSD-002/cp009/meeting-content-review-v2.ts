import { add, divide, multiply, rational, subtract, toMixedString } from "../../TSD-001/foundation/rational";
import { TSD_CP009_ENGLISH_REVIEW_CASES } from "./english-review-cases";
import { TSD_CP009_LOCALIZED_REVIEW_CASES } from "./localized-review-cases";

/** Editorial candidates only. Frozen renderers and release identities remain authoritative. */
export const TSD_CP009_MEETING_CONTENT_REVIEW_V2 = Object.freeze(
  (["en-IN", "hi-IN", "pa-IN"] as const).flatMap((locale) => {
    const cases = locale === "en-IN" ? TSD_CP009_ENGLISH_REVIEW_CASES : TSD_CP009_LOCALIZED_REVIEW_CASES;
    return cases.filter((row) => row.input.authorityKey === "mediumShiftedMeetingPoint").map((source) => {
      const input = source.input;
      if (input.authorityKey !== "mediumShiftedMeetingPoint") throw new Error("Meeting authority required");
      const u = multiply(input.fromUpstreamBodySpeed, rational(18, 5));
      const v = multiply(input.fromDownstreamBodySpeed, rational(18, 5));
      const c = multiply(input.mediumSpeed, rational(18, 5));
      const d = divide(input.routeDistance, rational(1000));
      const downstream = add(u, c), upstream = subtract(v, c);
      const closing = add(downstream, upstream), time = divide(d, closing);
      const meeting = multiply(downstream, time);
      const f = toMixedString;
      const stem = locale === "en-IN"
        ? `Two boats start simultaneously towards each other from opposite ends of a ${f(d)} km river stretch. Boat A starts at the upstream end and has a still-water speed of ${f(u)} km/h. Boat B starts at the downstream end and has a still-water speed of ${f(v)} km/h. The current flows downstream at ${f(c)} km/h. How far from the upstream end do they meet?`
        : locale === "hi-IN"
          ? `${f(d)} किमी लंबे नदी मार्ग के दोनों सिरों से दो नावें एक ही समय पर एक-दूसरे की ओर चलती हैं। नाव A ऊपरी सिरे से चलती है और शांत जल में उसकी चाल ${f(u)} किमी/घंटा है। नाव B निचले सिरे से चलती है और शांत जल में उसकी चाल ${f(v)} किमी/घंटा है। धारा ऊपरी सिरे से निचले सिरे की ओर ${f(c)} किमी/घंटा की चाल से बहती है। वे ऊपरी सिरे से कितनी दूरी पर मिलेंगी?`
          : `${f(d)} ਕਿਮੀ ਲੰਬੇ ਦਰਿਆਈ ਰਸਤੇ ਦੇ ਦੋਵਾਂ ਸਿਰਿਆਂ ਤੋਂ ਦੋ ਕਿਸ਼ਤੀਆਂ ਇੱਕੋ ਸਮੇਂ ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੀਆਂ ਹਨ। ਕਿਸ਼ਤੀ A ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਚੱਲਦੀ ਹੈ ਅਤੇ ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਉਸ ਦੀ ਚਾਲ ${f(u)} ਕਿਮੀ/ਘੰਟਾ ਹੈ। ਕਿਸ਼ਤੀ B ਹੇਠਲੇ ਸਿਰੇ ਤੋਂ ਚੱਲਦੀ ਹੈ ਅਤੇ ਸ਼ਾਂਤ ਪਾਣੀ ਵਿੱਚ ਉਸ ਦੀ ਚਾਲ ${f(v)} ਕਿਮੀ/ਘੰਟਾ ਹੈ। ਧਾਰਾ ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਹੇਠਲੇ ਸਿਰੇ ਵੱਲ ${f(c)} ਕਿਮੀ/ਘੰਟਾ ਦੀ ਚਾਲ ਨਾਲ ਵਗਦੀ ਹੈ। ਉਹ ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਕਿੰਨੀ ਦੂਰੀ 'ਤੇ ਮਿਲਣਗੀਆਂ?`;
      const labels = locale === "en-IN"
        ? ["Boat A ground speed", "Boat B ground speed", "Closing speed", "Meeting time", "Distance from upstream end"]
        : locale === "hi-IN"
          ? ["नाव A की वास्तविक चाल", "नाव B की वास्तविक चाल", "सापेक्ष चाल", "मिलने का समय", "ऊपरी सिरे से दूरी"]
          : ["ਕਿਸ਼ਤੀ A ਦੀ ਅਸਲ ਚਾਲ", "ਕਿਸ਼ਤੀ B ਦੀ ਅਸਲ ਚਾਲ", "ਸਾਪੇਖ ਚਾਲ", "ਮਿਲਣ ਦਾ ਸਮਾਂ", "ਉੱਪਰਲੇ ਸਿਰੇ ਤੋਂ ਦੂਰੀ"];
      const speedUnit = locale === "en-IN" ? "km/h" : locale === "hi-IN" ? "किमी/घंटा" : "ਕਿਮੀ/ਘੰਟਾ";
      const distanceUnit = locale === "en-IN" ? "km" : locale === "hi-IN" ? "किमी" : "ਕਿਮੀ";
      const timeUnit = locale === "en-IN" ? "h" : locale === "hi-IN" ? "घंटे" : "ਘੰਟੇ";
      const explanation = Object.freeze([
        `${labels[0]}: ${f(u)} + ${f(c)} = ${f(downstream)} ${speedUnit}`,
        `${labels[1]}: ${f(v)} − ${f(c)} = ${f(upstream)} ${speedUnit}`,
        `${labels[2]}: ${f(downstream)} + ${f(upstream)} = ${f(closing)} ${speedUnit}`,
        `${labels[3]}: ${f(d)} ÷ ${f(closing)} = ${f(time)} ${timeUnit}`,
        `${labels[4]}: ${f(downstream)} × ${f(time)} = ${f(meeting)} ${distanceUnit}`,
      ]);
      return Object.freeze({
        version: "tsd-cp009-meeting-content-review-v2", reviewStatus: "UNAPPROVED_CONTENT_REVIEW_CANDIDATE",
        locale, qlId: source.qlId, familyId: source.familyId, input, sourceSolution: source.solution,
        stem, explanation, answer: `${f(meeting)} ${distanceUnit}`,
        calculation: Object.freeze({ downstream, upstream, closing, time, meeting }),
        contentApproved: false, frozen: false, registered: false, persistence: false,
        bank: false, test: false, mock: false, public: false,
      });
    });
  }),
);
