import { previewTsdCp010StudioCandidate } from "./question-studio-candidate-adapter-exam-real";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 Studio exam-real V2 proof failed: ${message}`);
}

const BANNED = {
  en: /practice race|selection trial|race report|official timing|college race|sports trial|track event|club race|maintains\s+\d|steady speeds|recorded winning margin|course reconstruction|winning time\.|time handicap|time start|loses?\s+\d+(?:\s+\d+\/\d+)?\s+seconds?\s+in rest time|the result of a .* race is:/i,
  hi: /चयन दौड़|समय शून्य|ट्रैक प्रतियोगिता|आधिकारिक|रेस रिपोर्ट|रिकॉर्डेड|अभ्यास दौड़|दूरी-अंतर|जीत-अंतर|समय-अंतर|समय-बढ़त|समय-शुरुआत/i,
  pa: /ਚੋਣ ਦੌੜ|ਸਮਾਂ ਸਿਫ਼ਰ|ਅਧਿਕਾਰਿਕ|ਰੇਸ ਰਿਪੋਰਟ|ਅਭਿਆਸ ਦੌੜ|ਦੂਰੀ-ਅੰਤਰ|ਜਿੱਤ-ਅੰਤਰ|ਸਮਾਂ-ਅੰਤਰ|ਸਮਾਂ-ਸ਼ੁਰੂਆਤ/i,
} as const;

for (const language of ["en", "hi", "pa"] as const) {
  const preview = previewTsdCp010StudioCandidate({ language, count: 471, seed: `exam-real-v2-full-${language}` });
  assert(preview.questions.length === 471, `${language}: expected 471 Studio questions`);
  assert(new Set(preview.questions.map((question) => question.stem)).size === 471, `${language}: duplicate V2 learner stems`);
  for (const question of preview.questions) {
    assert(question.validation.examRealStem, `${language}/${question.familyId}/${question.caseId}: exam-real flag missing`);
    assert(question.validation.manualEditorialPolishV2, `${language}/${question.familyId}/${question.caseId}: V2 editorial flag missing`);
    assert(!BANNED[language].test(question.stem), `${language}/${question.familyId}/${question.caseId}: rejected phrasing remains: ${question.stem}`);
    assert(question.stem.length >= 40 && question.stem.length <= 310, `${language}/${question.familyId}/${question.caseId}: implausible stem length`);
  }
}

console.log("TSD-CP-010 FULL STUDIO EXAM-REAL V2 EDITORIAL PROOF: PASS");
console.log(JSON.stringify({ locales: 3, combinationsPerLocale: 471, multilingualCombinations: 1413, editorialPass: "MANUAL_POST_CI_POLISH_V2", rejectedPhrasing: "ABSENT" }, null, 2));
