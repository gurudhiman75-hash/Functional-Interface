import {
  TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW,
  TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW,
  TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW,
} from "./exam-real-review-final-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 exam-realness proof failed: ${message}`);
}

const EN_BANNED = /practice race|selection trial|race report|official timing|college race|sports trial|track event|club race|maintains\s+\d|steady speeds|determine the finish|recorded winning margin|course reconstruction|winning time\.|time handicap|time start|loses?\s+\d+(?:\s+\d+\/\d+)?\s+seconds?\s+in rest time|the result of a .* race is:/i;
const HI_BANNED = /चयन दौड़|समय शून्य|ट्रैक प्रतियोगिता|आधिकारिक|रेस रिपोर्ट|रिकॉर्डेड|अभ्यास दौड़|दूरी-अंतर|जीत-अंतर|समय-अंतर|समय-बढ़त|समय-शुरुआत/i;
const PA_BANNED = /ਚੋਣ ਦੌੜ|ਸਮਾਂ ਸਿਫ਼ਰ|ਅਧਿਕਾਰਿਕ|ਰੇਸ ਰਿਪੋਰਟ|ਅਭਿਆਸ ਦੌੜ|ਦੂਰੀ-ਅੰਤਰ|ਜਿੱਤ-ਅੰਤਰ|ਸਮਾਂ-ਅੰਤਰ|ਸਮਾਂ-ਸ਼ੁਰੂਆਤ/i;

for (const [language, review, banned] of [
  ["en", TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW, EN_BANNED],
  ["hi", TSD_CP010_EXAM_REAL_V2_HINDI_REVIEW, HI_BANNED],
  ["pa", TSD_CP010_EXAM_REAL_V2_PUNJABI_REVIEW, PA_BANNED],
] as const) {
  assert(review.length === 60, `${language}: expected 60 final questions`);
  assert(new Set(review.map((question) => question.stem)).size === 60, `${language}: final review stems are not unique`);
  for (const question of review) {
    assert(!banned.test(question.stem), `${language}/${question.familyId}: synthetic/non-exam phrase remains: ${question.stem}`);
    assert(!question.stem.includes("{scene}"), `${language}/${question.familyId}: unresolved scene placeholder`);
    assert(question.stem.length >= 45, `${language}/${question.familyId}: stem too thin to carry exam semantics`);
    assert(question.stem.length <= 310, `${language}/${question.familyId}: stem became over-narrated`);
  }
}

const enByQl = new Map<string, string[]>();
for (const question of TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW) {
  const stems = enByQl.get(question.qlId) ?? [];
  stems.push(question.stem);
  enByQl.set(question.qlId, stems);
}
for (const [qlId, stems] of enByQl) {
  assert(stems.length === 6, `${qlId}: expected six review families`);
  assert(new Set(stems.map((stem) => stem.replace(/[A-Z][a-z]+|\b[A-C]\b|\b[P-R]\b/g, "NAME").replace(/\d+(?: \d+\/\d+)?/g, "N"))).size >= 5, `${qlId}: structural stem variety is too low`);
}

for (const question of TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW) {
  if (question.qlId === "TSD-QL-117") assert(/ratio|speed/i.test(question.stem), `${question.familyId}: QL117 must ask a speed ratio`);
  if (question.qlId === "TSD-QL-118") assert(/length|distance|long/i.test(question.stem), `${question.familyId}: QL118 must ask race length`);
  if (question.qlId === "TSD-QL-119") assert(/start|dead heat|finish together|reach the post together|equal finish/i.test(question.stem), `${question.familyId}: QL119 handicap/dead-heat semantics not explicit`);
  if (question.qlId === "TSD-QL-120") assert(/beat(?:s)?|winning|finish/i.test(question.stem), `${question.familyId}: QL120 must remain a race-margin conversion`);
  if (question.qlId === "TSD-QL-121") assert(/\bbeat(?:s)?\b/i.test(question.stem), `${question.familyId}: QL121 pairwise race-result language missing`);
  if (question.qlId === "TSD-QL-122") assert(/start|head start/i.test(question.stem), `${question.familyId}: QL122 second-race start must be explicit`);
  if (question.qlId === "TSD-QL-124") assert(/race|beat(?:s)?/i.test(question.stem) && /speed/i.test(question.stem), `${question.familyId}: QL124 two-race speed inference not explicit`);
}

for (const familyId of ["121-A", "121-D"] as const) {
  const question = TSD_CP010_EXAM_REAL_V2_ENGLISH_REVIEW.find((item) => item.familyId === familyId)!;
  assert(/separate/i.test(question.stem), `${familyId}: pairwise outcomes must explicitly be separate races`);
}

console.log("TSD-CP-010 EXAM REALNESS / STEM STYLE V2 PROOF: PASS");
console.log(JSON.stringify({
  locales: ["en", "hi", "pa"],
  questionsPerLocale: 60,
  style: "SSC_BANK_PUNJAB_RESULT_FIRST_LOW_NARRATIVE",
  editorialPass: "MANUAL_POST_CI_POLISH_V2",
  bannedSyntheticPhrases: "ABSENT",
  bannedMachineCompounds: "ABSENT",
  uniqueStemsPerLocale: 60,
  structuralFamiliesPerQl: 6,
}, null, 2));
