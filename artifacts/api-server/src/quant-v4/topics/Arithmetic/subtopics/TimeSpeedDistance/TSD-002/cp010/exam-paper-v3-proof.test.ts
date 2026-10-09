import {
  TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,
  TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,
  TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW,
} from "./exam-paper-review-final-v3-all";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 official-paper V3 proof failed: ${message}`);
}

const EN_SYNTHETIC = /practice race|selection trial|race report|official timing|college race|sports trial|track event|club race|recorded winning margin|course reconstruction|determine the finish|maintains?\s+\d|steady speeds?/i;
const HI_SYNTHETIC = /चयन दौड़|ट्रैक प्रतियोगिता|आधिकारिक|रेस रिपोर्ट|रिकॉर्डेड|अभ्यास दौड़|दूरी-अंतर|जीत-अंतर|समय-अंतर|समय-बढ़त|समय शून्य/i;
const PA_SYNTHETIC = /ਚੋਣ ਦੌੜ|ਅਧਿਕਾਰਿਕ|ਰੇਸ ਰਿਪੋਰਟ|ਅਭਿਆਸ ਦੌੜ|ਦੂਰੀ-ਅੰਤਰ|ਜਿੱਤ-ਅੰਤਰ|ਸਮਾਂ-ਅੰਤਰ|ਸਮਾਂ ਸਿਫ਼ਰ/i;

for (const [language, review, banned] of [
  ["en", TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, EN_SYNTHETIC],
  ["hi", TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW, HI_SYNTHETIC],
  ["pa", TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW, PA_SYNTHETIC],
] as const) {
  assert(review.length === 60, `${language}: expected 60 questions`);
  assert(new Set(review.map((q) => q.stem)).size === 60, `${language}: stems are not unique`);
  for (const q of review) {
    assert(q.stem.trim().length >= 45, `${language}/${q.familyId}: stem too short`);
    assert(q.stem.length <= 320, `${language}/${q.familyId}: stem over-narrated`);
    assert(!banned.test(q.stem), `${language}/${q.familyId}: synthetic phrase remains: ${q.stem}`);
  }
}

const byQl = <T extends { qlId: string; stem: string }>(review: readonly T[], qlId: string) => review.filter((q) => q.qlId === qlId);

for (const qlId of ["TSD-QL-115", "TSD-QL-116", "TSD-QL-118", "TSD-QL-119"] as const) {
  const en = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, qlId);
  const hi = byQl(TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW, qlId);
  const pa = byQl(TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW, qlId);
  assert(en.length === 6 && hi.length === 6 && pa.length === 6, `${qlId}: missing six-family parity`);

  const enPaperForms = en.filter((q) => /can run|take(?:s)? .*seconds|speed ratio|in speed is|start|dead heat|finish together/i.test(q.stem)).length;
  const hiPaperForms = hi.filter((q) => /सेकंड में|समय .*सेकंड|अनुपात|आगे से शुरू|शुरुआती|बराबरी|साथ पहुँच/i.test(q.stem)).length;
  const paPaperForms = pa.filter((q) => /ਸਕਿੰਟ ਵਿੱਚ|ਸਮਾਂ .*ਸਕਿੰਟ|ਅਨੁਪਾਤ|ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ|ਸ਼ੁਰੂਆਤੀ|ਬਰਾਬਰੀ|ਇਕੱਠੇ ਪਹੁੰਚ/i.test(q.stem)).length;
  assert(enPaperForms >= 4, `${qlId}: English still over-relies on raw-speed drills (${enPaperForms}/6 paper forms)`);
  assert(hiPaperForms >= 4, `${qlId}: Hindi still over-relies on raw-speed drills (${hiPaperForms}/6 paper forms)`);
  assert(paPaperForms >= 4, `${qlId}: Punjabi still over-relies on raw-speed drills (${paPaperForms}/6 paper forms)`);
}

const en115 = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, "TSD-QL-115");
const en116 = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, "TSD-QL-116");
const en119 = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, "TSD-QL-119");
const en121 = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, "TSD-QL-121");
const en122 = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, "TSD-QL-122");
const en124 = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, "TSD-QL-124");

assert(en115.filter((q) => /can run|take(?:s)? .*seconds|speed.*ratio|in speed is/i.test(q.stem)).length >= 5, "QL115 needs capability/ratio-led paper representations");
assert(en116.filter((q) => /can run|take(?:s)? .*seconds|speed ratio|in speed is/i.test(q.stem)).length >= 5, "QL116 needs capability/ratio-led paper representations");
assert(en119.every((q) => /start|dead heat|finish together|equal finish|neither wins/i.test(q.stem)), "QL119 must use conventional start/dead-heat language");
assert(en121.every((q) => /beat|start/i.test(q.stem)), "QL121 must remain pairwise race-result language");
assert(en122.every((q) => /start/i.test(q.stem)), "QL122 must state the second-race start explicitly");
assert(en124.every((q) => /beat|win/i.test(q.stem) && /speed/i.test(q.stem)), "QL124 must be two-race result evidence asking speed");

function normalized(stem: string) {
  return stem
    .replace(/\b(?:A|B|C|P|Q|R|Arun|Bharat|Chetan|Ravi|Sahil|Vikas|Karan|Mohan|Nitin|Rohit|Deepak|Sumit)\b/g, "NAME")
    .replace(/\d+(?: \d+\/\d+)?/g, "N");
}
for (const qlId of ["TSD-QL-115","TSD-QL-116","TSD-QL-117","TSD-QL-118","TSD-QL-119","TSD-QL-120","TSD-QL-121","TSD-QL-122","TSD-QL-123","TSD-QL-124"] as const) {
  const stems = byQl(TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW, qlId).map((q) => normalized(q.stem));
  assert(new Set(stems).size >= 5, `${qlId}: structural diversity below five forms`);
}

console.log("TSD-CP-010 OFFICIAL-PAPER REPRESENTATION V3 PROOF: PASS");
console.log(JSON.stringify({
  locales: ["en", "hi", "pa"],
  questionsPerLocale: 60,
  style: "SSC_BANK_PUNJAB_OFFICIAL_PAPER_RACE_LANGUAGE",
  representationPolicy: "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE",
  earlyQlPaperRepresentationFloor: "4_OF_6_PER_LOCALE",
  englishQl115CapabilityRatioForms: en115.filter((q) => /can run|take(?:s)? .*seconds|speed.*ratio|in speed is/i.test(q.stem)).length,
  englishQl116CapabilityRatioForms: en116.filter((q) => /can run|take(?:s)? .*seconds|speed ratio|in speed is/i.test(q.stem)).length,
  syntheticFiller: "ABSENT",
  uniqueStemsPerLocale: 60,
}, null, 2));
