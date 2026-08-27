import { previewTsdCp010StudioCandidate } from "./question-studio-candidate-adapter-exam-real";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 Studio official-paper V3 proof failed: ${message}`);
}

const BANNED = {
  en: /practice race|selection trial|race report|official timing|college race|sports trial|track event|club race|recorded winning margin|course reconstruction|determine the finish|maintains?\s+\d|steady speeds?/i,
  hi: /चयन दौड़|ट्रैक प्रतियोगिता|आधिकारिक|रेस रिपोर्ट|रिकॉर्डेड|अभ्यास दौड़|दूरी-अंतर|जीत-अंतर|समय-अंतर|समय-बढ़त|समय शून्य/i,
  pa: /ਚੋਣ ਦੌੜ|ਅਧਿਕਾਰਿਕ|ਰੇਸ ਰਿਪੋਰਟ|ਅਭਿਆਸ ਦੌੜ|ਦੂਰੀ-ਅੰਤਰ|ਜਿੱਤ-ਅੰਤਰ|ਸਮਾਂ-ਅੰਤਰ|ਸਮਾਂ ਸਿਫ਼ਰ/i,
} as const;

for (const language of ["en", "hi", "pa"] as const) {
  const preview = previewTsdCp010StudioCandidate({ language, count: 471, seed: `official-paper-v3-full-${language}` });
  assert(preview.questions.length === 471, `${language}: expected 471 Studio questions`);
  assert(new Set(preview.questions.map((q) => q.stem)).size === 471, `${language}: duplicate V3 learner stems`);
  for (const question of preview.questions) {
    assert(question.validation.examRealStem, `${language}/${question.familyId}/${question.caseId}: exam-real flag missing`);
    assert(question.validation.officialPaperRepresentationV3, `${language}/${question.familyId}/${question.caseId}: official-paper V3 flag missing`);
    assert(question.validation.rawSpeedDrillAvoidedWhereRaceRepresentationExists, `${language}/${question.familyId}/${question.caseId}: raw-speed guard missing`);
    assert(!BANNED[language].test(question.stem), `${language}/${question.familyId}/${question.caseId}: rejected phrasing remains: ${question.stem}`);
    assert(question.stem.length >= 40 && question.stem.length <= 330, `${language}/${question.familyId}/${question.caseId}: implausible stem length`);
  }

  for (const qlId of ["TSD-QL-115", "TSD-QL-116", "TSD-QL-118", "TSD-QL-119"] as const) {
    const group = preview.questions.filter((q) => q.qlId === qlId);
    assert(group.length > 0, `${language}/${qlId}: no Studio questions`);
    const paperLike = group.filter((q) => language === "en"
      ? /can run|take(?:s)? .*seconds|speed ratio|in speed is|start|dead heat|finish together/i.test(q.stem)
      : language === "hi"
        ? /सेकंड में|समय .*सेकंड|अनुपात|आगे से शुरू|शुरुआती|बराबरी|साथ पहुँच/i.test(q.stem)
        : /ਸਕਿੰਟ ਵਿੱਚ|ਸਮਾਂ .*ਸਕਿੰਟ|ਅਨੁਪਾਤ|ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ|ਸ਼ੁਰੂਆਤੀ|ਬਰਾਬਰੀ|ਇਕੱਠੇ ਪਹੁੰਚ/i.test(q.stem)).length;
    assert(paperLike / group.length >= 0.6, `${language}/${qlId}: paper-style representation share too low (${paperLike}/${group.length})`);
  }
}

console.log("TSD-CP-010 FULL STUDIO OFFICIAL-PAPER V3 PROOF: PASS");
console.log(JSON.stringify({
  locales: 3,
  combinationsPerLocale: 471,
  multilingualCombinations: 1413,
  representationPolicy: "CAPABILITY_BEATS_BY_START_RATIO_TWO_RACE_EVIDENCE",
  earlyQlPaperStyleShareFloor: 0.6,
  rejectedPhrasing: "ABSENT",
}, null, 2));
