import type { Rational } from "../../foundation/rational";
import { formatExamNumber } from "../../cp003/generation-support";
import { formatNativeDuration } from "../../cp003/localization/native-language-primitives";

export type TsdCp005NativeLanguage = "hi" | "pa";
export type TsdCp005NativePair = Readonly<{ hi: string; pa: string }>;
const pair = (hi: string, pa: string): TsdCp005NativePair => Object.freeze({ hi, pa });
export const pickCp005Native = (language: TsdCp005NativeLanguage, value: TsdCp005NativePair): string => value[language];

export const TSD_CP005_NATIVE_TERMS = Object.freeze({
  METHOD: pair("विधि", "ਵਿਧੀ"), ANSWER: pair("उत्तर", "ਉੱਤਰ"), SPEED: pair("गति", "ਰਫ਼ਤਾਰ"),
  DISTANCE: pair("दूरी", "ਦੂਰੀ"), TIME: pair("समय", "ਸਮਾਂ"), MEETING: pair("मुलाकात", "ਮੁਲਾਕਾਤ"),
  ROUTE: pair("मार्ग", "ਰਸਤਾ"), REST: pair("ठहराव", "ਠਹਿਰਾਅ"), RETURN: pair("वापसी", "ਵਾਪਸੀ"),
  REMAINING: pair("शेष", "ਬਾਕੀ"), COMBINED_SPEED: pair("संयुक्त गति", "ਕੁੱਲ ਰਫ਼ਤਾਰ"),
  MEETING_POINT: pair("मिलने का बिंदु", "ਮਿਲਣ ਦਾ ਬਿੰਦੂ"),
} as const);

export const TSD_CP005_NATIVE_NUMBER_POLICY = Object.freeze({
  digits: "ASCII_0_9", decimalSeparator: ".", speedUnit: "km/h", distanceUnit: "km",
  durationStyle: "EXACT_HOUR_MINUTE_SECOND", ratioStyle: "A:B",
} as const);

export const cp005Num = (value: Rational): string => formatExamNumber(value);
export const cp005Km = (value: Rational): string => `${cp005Num(value)} km`;
export const cp005Speed = (value: Rational): string => `${cp005Num(value)} km/h`;
export const cp005Duration = (value: Rational, language: TsdCp005NativeLanguage): string => formatNativeDuration(value, language);
export const cp005Ratio = (value: Rational): string => `${value.numerator}:${value.denominator}`;

const OBJECTS: Readonly<Record<string, TsdCp005NativePair>> = Object.freeze({
  INTERCITY_BUS: pair("बस", "ਬੱਸ"), EXPRESS_COACH: pair("कोच", "ਕੋਚ"), COACH: pair("कोच", "ਕੋਚ"),
  TAXI: pair("टैक्सी", "ਟੈਕਸੀ"), CAR: pair("कार", "ਕਾਰ"), DELIVERY_VAN: pair("डिलीवरी वैन", "ਡਿਲਿਵਰੀ ਵੈਨ"),
  COURIER_VAN: pair("कूरियर वैन", "ਕੂਰੀਅਰ ਵੈਨ"), PASSENGER_TRAIN: pair("यात्री रेलगाड़ी", "ਯਾਤਰੀ ਰੇਲਗੱਡੀ"),
  EXPRESS_TRAIN: pair("एक्सप्रेस रेलगाड़ी", "ਐਕਸਪ੍ਰੈੱਸ ਰੇਲਗੱਡੀ"), MINIBUS: pair("मिनीबस", "ਮਿਨੀਬੱਸ"),
  JEEP: pair("जीप", "ਜੀਪ"), CARGO_TRUCK: pair("ट्रक", "ਟਰੱਕ"), POSTAL_VAN: pair("डाक वैन", "ਡਾਕ ਵੈਨ"),
  COMPANY_CAR: pair("कंपनी कार", "ਕੰਪਨੀ ਕਾਰ"), TRANSPORT_VAN: pair("परिवहन वैन", "ਟਰਾਂਸਪੋਰਟ ਵੈਨ"),
  SHUTTLE_BUS: pair("शटल बस", "ਸ਼ਟਲ ਬੱਸ"), PATROL_CAR: pair("गश्ती कार", "ਗਸ਼ਤੀ ਕਾਰ"),
  SERVICE_VAN: pair("सेवा वैन", "ਸੇਵਾ ਵੈਨ"), INSPECTION_JEEP: pair("निरीक्षण जीप", "ਜਾਂਚ ਜੀਪ"),
  TEST_CAR: pair("परीक्षण कार", "ਟੈਸਟ ਕਾਰ"), MAINTENANCE_VAN: pair("रखरखाव वैन", "ਮੈਂਟੇਨੈਂਸ ਵੈਨ"),
  SHUTTLE_VAN: pair("शटल वैन", "ਸ਼ਟਲ ਵੈਨ"), UTILITY_VEHICLE: pair("यूटिलिटी वाहन", "ਯੂਟਿਲਿਟੀ ਵਾਹਨ"),
  MOTORCYCLE: pair("मोटरसाइकिल", "ਮੋਟਰਸਾਈਕਲ"), SERVICE_CAR: pair("सेवा कार", "ਸੇਵਾ ਕਾਰ"),
});

const ENDPOINTS: Readonly<Record<string, TsdCp005NativePair>> = Object.freeze({
  TERMINALS: pair("टर्मिनल", "ਟਰਮੀਨਲ"), TOWNS: pair("नगर", "ਕਸਬਾ"), CITIES: pair("शहर", "ਸ਼ਹਿਰ"),
  DEPOTS: pair("डिपो", "ਡਿਪੋ"), HUBS: pair("हब", "ਹੱਬ"), STATIONS: pair("रेलवे स्टेशन", "ਰੇਲਵੇ ਸਟੇਸ਼ਨ"),
  JUNCTIONS: pair("जंक्शन", "ਜੰਕਸ਼ਨ"), CHECKPOINTS: pair("चेकपोस्ट", "ਚੈਕਪੋਸਟ"),
  WAREHOUSES: pair("गोदाम", "ਗੋਦਾਮ"), SORTING_CENTRES: pair("छँटाई केंद्र", "ਛਾਂਟ ਕੇਂਦਰ"),
  OFFICES: pair("कार्यालय", "ਦਫ਼ਤਰ"), LOGISTICS_CENTRES: pair("लॉजिस्टिक्स केंद्र", "ਲਾਜਿਸਟਿਕਸ ਕੇਂਦਰ"),
  INSPECTION_POSTS: pair("निरीक्षण चौकी", "ਜਾਂਚ ਚੌਕੀ"), TRACK_MARKERS: pair("परीक्षण ट्रैक के चिह्न", "ਟੈਸਟ ਟਰੈਕ ਦੇ ਨਿਸ਼ਾਨ"),
  GATES: pair("गेट", "ਗੇਟ"), WORK_SITES: pair("कार्यस्थल", "ਕੰਮ ਵਾਲੀ ਥਾਂ"), POSTS: pair("चौकी", "ਚੌਕੀ"),
  SERVICE_CENTRES: pair("सेवा केंद्र", "ਸੇਵਾ ਕੇਂਦਰ"),
});

export function cp005NativeActor(objectFamily: string, body: "A" | "B", language: TsdCp005NativeLanguage): string {
  const value = OBJECTS[objectFamily];
  if (!value) throw new Error(`CP005 native object mapping missing: ${objectFamily}`);
  return `${pickCp005Native(language, value)} ${body}`;
}

export function cp005NativeEndpoint(endpointFamily: string, language: TsdCp005NativeLanguage): string {
  const value = ENDPOINTS[endpointFamily];
  if (!value) throw new Error(`CP005 native endpoint mapping missing: ${endpointFamily}`);
  return pickCp005Native(language, value);
}

export function cp005NativeContextIntro(objectFamily: string, endpointFamily: string, topology: string, language: TsdCp005NativeLanguage): string {
  const a = cp005NativeActor(objectFamily, "A", language);
  const b = cp005NativeActor(objectFamily, "B", language);
  const endpoint = cp005NativeEndpoint(endpointFamily, language);
  if (language === "hi") {
    if (topology === "SAME_START_RETURN") return `${a} और ${b} ${endpoint} P से ${endpoint} Q की ओर चलते हैं।`;
    if (topology === "OPPOSITE_REPEAT") return `${a} और ${b} ${endpoint} P और Q के बीच लगातार आते-जाते हैं।`;
    return `${a} और ${b} ${endpoint} P और Q के बीच चलते हैं।`;
  }
  if (topology === "SAME_START_RETURN") return `${a} ਅਤੇ ${b} ${endpoint} P ਤੋਂ ${endpoint} Q ਵੱਲ ਚਲਦੇ ਹਨ।`;
  if (topology === "OPPOSITE_REPEAT") return `${a} ਅਤੇ ${b} ${endpoint} P ਅਤੇ Q ਵਿਚਕਾਰ ਲਗਾਤਾਰ ਆਉਂਦੇ-ਜਾਂਦੇ ਹਨ।`;
  return `${a} ਅਤੇ ${b} ${endpoint} P ਅਤੇ Q ਵਿਚਕਾਰ ਚਲਦੇ ਹਨ।`;
}

export function localizeCp005Choice(text: string, language: TsdCp005NativeLanguage): string {
  let out = text;
  if (language === "hi") {
    out = out.replace(/\band\b/g, "और").replace(/\bfrom P\b/g, "P से")
      .replace(/\bhours\b/g, "घंटे").replace(/\bhour\b/g, "घंटा")
      .replace(/\bminutes\b/g, "मिनट").replace(/\bminute\b/g, "मिनट")
      .replace(/\bseconds\b/g, "सेकंड").replace(/\bsecond\b/g, "सेकंड")
      .replace(/\bmeetings\b/g, "मुलाकातें").replace(/\bmeeting\b/g, "मुलाकात");
  } else {
    out = out.replace(/\band\b/g, "ਅਤੇ").replace(/\bfrom P\b/g, "P ਤੋਂ")
      .replace(/\bhours\b/g, "ਘੰਟੇ").replace(/\bhour\b/g, "ਘੰਟਾ")
      .replace(/\bminutes\b/g, "ਮਿੰਟ").replace(/\bminute\b/g, "ਮਿੰਟ")
      .replace(/\bseconds\b/g, "ਸਕਿੰਟ").replace(/\bsecond\b/g, "ਸਕਿੰਟ")
      .replace(/\bmeetings\b/g, "ਮੁਲਾਕਾਤਾਂ").replace(/\bmeeting\b/g, "ਮੁਲਾਕਾਤ");
  }
  return out;
}

const PLACEHOLDER = /\{[^}]+\}/u;

/** Staging guard only. Strict script/English checks are applied after the final editorial-polish layer. */
export function assertTsdCp005NativeText(text: string, _language: TsdCp005NativeLanguage, label: string): void {
  if (!text.trim()) throw new Error(`${label}: native text is empty`);
  if (PLACEHOLDER.test(text)) throw new Error(`${label}: unresolved placeholder remains`);
}
