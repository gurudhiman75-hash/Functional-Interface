import { verifyTsdCp010 } from "./executable-verifier";
import { TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW } from "./english-rendered-review-final";
import { TSD_CP010_NATIVE_FINAL_HINDI_REVIEW, TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW } from "./localization-native-final";
import { TSD_CP010_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 localization proof failed: ${message}`);
}

const HI_NAMES = ["अर्जुन", "भारत", "चेतन", "कबीर", "मानव", "नवीन", "रवि", "साहिल", "दीपक", "अमन", "विक्रम", "करण", "नीरज", "मोहन", "रोहित", "सुमित"];
const PA_NAMES = ["ਅਰਜੁਨ", "ਭਾਰਤ", "ਚੇਤਨ", "ਕਬੀਰ", "ਮਾਨਵ", "ਨਵੀਨ", "ਰਵੀ", "ਸਾਹਿਲ", "ਦੀਪਕ", "ਅਮਨ", "ਵਿਕਰਮ", "ਕਰਨ", "ਨੀਰਜ", "ਮੋਹਨ", "ਰੋਹਿਤ", "ਸੁਮਿਤ"];

function signature(text: string, language: "hi" | "pa") {
  let normalized = text.replace(/[0-9]+(?:\s+[0-9]+\/[0-9]+|\/[0-9]+)?/g, "#");
  for (const name of language === "hi" ? HI_NAMES : PA_NAMES) normalized = normalized.replaceAll(name, "नाम");
  return normalized.replace(/\s+/g, " ").trim();
}

assert(TSD_CP010_NATIVE_FINAL_HINDI_REVIEW.length === 60, "expected 60 Hindi review questions");
assert(TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW.length === 60, "expected 60 Punjabi review questions");
assert(TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.length === 60, "expected 60 English parity questions");

for (const [language, questions] of [
  ["hi", TSD_CP010_NATIVE_FINAL_HINDI_REVIEW],
  ["pa", TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW],
] as const) {
  assert(new Set(questions.map((q) => q.familyId)).size === 60, `${language}: family IDs must be unique`);
  assert(new Set(questions.map((q) => q.stem)).size === 60, `${language}: rendered stems must be unique`);
  for (const qlId of TSD_CP010_PERMANENT_QL_IDS) {
    const localized = questions.filter((q) => q.qlId === qlId);
    assert(localized.length === 6, `${language}/${qlId}: expected six families`);
    assert(new Set(localized.map((q) => signature(q.stem, language))).size === 6, `${language}/${qlId}: structural stem variety is too thin`);
  }

  for (const question of questions) {
    const english = TSD_CP010_FINAL_RENDERED_ENGLISH_REVIEW.find((x) => x.familyId === question.familyId);
    assert(english, `${language}/${question.familyId}: English parity family missing`);
    assert(question.qlId === english.qlId, `${language}/${question.familyId}: QL mismatch`);
    assert(question.difficulty === english.difficulty, `${language}/${question.familyId}: difficulty mismatch`);
    assert(question.input.authorityKey === english.input.authorityKey, `${language}/${question.familyId}: authority mismatch`);
    assert(question.stem.length >= 70, `${language}/${question.familyId}: stem is too thin`);
    assert(question.explanation.steps.length >= 2, `${language}/${question.familyId}: explanation is too thin`);
    assert(!/[A-Za-z]/.test(question.stem), `${language}/${question.familyId}: learner stem contains Latin-script wording`);
    assert(!/\{[A-Za-z0-9]+\}/.test(question.stem), `${language}/${question.familyId}: unresolved placeholder`);
    assert(verifyTsdCp010(question.input, question.solution).accepted, `${language}/${question.familyId}: independent verifier rejected`);
    if (question.solution.unit === "PERCENT") {
      assert(question.solution.answer.denominator === 1n, `${language}/${question.familyId}: percentage answer must be an integer`);
    }
    if (language === "hi") {
      assert(/[\u0900-\u097F]/.test(question.stem), `${question.familyId}: Hindi script missing`);
      assert(!/[\u0A00-\u0A7F]/.test(question.stem), `${question.familyId}: Hindi stem contains Gurmukhi`);
      assert(!/(डेड\s*हीट|हेड\s*स्टार्ट|फिनिश|हैंडिकैप|\bलीड\b)/i.test(question.stem), `${question.familyId}: rejected translated race jargon remains in Hindi`);
    } else {
      assert(/[\u0A00-\u0A7F]/.test(question.stem), `${question.familyId}: Punjabi script missing`);
      assert(!/[\u0900-\u0963\u0966-\u097F]/.test(question.stem), `${question.familyId}: Punjabi stem contains Devanagari letters or digits`);
      assert(!/(ਡੈੱਡ|ਹੈੱਡ|ਫਿਨਿਸ਼|ਹੈਂਡੀਕੈਪ|ਲੀਡ)/.test(question.stem), `${question.familyId}: rejected translated race jargon remains in Punjabi`);
    }
  }
}

for (const language of ["hi", "pa"] as const) {
  const questions = language === "hi" ? TSD_CP010_NATIVE_FINAL_HINDI_REVIEW : TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW;
  const ql119 = questions.filter((q) => q.qlId === "TSD-QL-119");
  const ql121 = questions.filter((q) => q.qlId === "TSD-QL-121");
  const ql122 = questions.filter((q) => q.qlId === "TSD-QL-122");
  const ql123 = questions.filter((q) => q.qlId === "TSD-QL-123");
  const ql124 = questions.filter((q) => q.qlId === "TSD-QL-124");
  assert(ql119.every((q) => language === "hi" ? /(एक ही समय|बराबरी|साथ समाप्त)/.test(q.stem) : /(ਇੱਕੋ ਸਮੇਂ|ਬਰਾਬਰੀ|ਇਕੱਠੇ)/.test(q.stem)), `${language}/QL119: dead-heat equality must be explicit`);
  assert(ql119.every((q) => language === "hi" ? /(शुरुआती|समय शून्य|पहले शुरू|आगे से शुरू|शून्य मीटर)/.test(q.stem) : /(ਸ਼ੁਰੂਆਤੀ|ਸਮਾਂ ਸਿਫ਼ਰ|ਪਹਿਲਾਂ ਸ਼ੁਰੂ|ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ|ਸਿਫ਼ਰ ਮੀਟਰ)/.test(q.stem)), `${language}/QL119: start advantage/delay must be explicit`);
  assert(ql121.every((q) => language === "hi" ? /(अलग|स्वतंत्र|दो|समान|दूसरी)/.test(q.stem) : /(ਵੱਖ|ਅਲੱਗ|ਦੋ|ਇੱਕੋ|ਦੂਜੀ)/.test(q.stem)), `${language}/QL121: pairwise race separation must be explicit`);
  assert(ql122.every((q) => language === "hi" ? /(शुरुआती|आगे से शुरू|शुरुआत[^।?]*आगे)/.test(q.stem) : /(ਸ਼ੁਰੂਆਤੀ|ਅੱਗੇ ਤੋਂ ਸ਼ੁਰੂ|ਸ਼ੁਰੂਆਤ[^।?]*ਅੱਗੇ)/.test(q.stem)), `${language}/QL122: second-race head start must be explicit`);
  assert(ql123.filter((q) => q.input.authorityKey === "changedRaceOutcomeState" && q.input.mode === "FASTER_START_DELAY").every((q) => language === "hi" ? /(पहले शुरू|समय शून्य|देर से)/.test(q.stem) : /(ਪਹਿਲਾਂ ਸ਼ੁਰੂ|ਸਮਾਂ ਸਿਫ਼ਰ|ਦੇਰ ਨਾਲ)/.test(q.stem)), `${language}/QL123: delayed-start chronology must be explicit`);
  assert(ql124.every((q) => language === "hi" ? /(गति नहीं बदलती|गति नहीं बदलता|स्थिर|वही गति|अपनी गति)/.test(q.stem) : /(ਰਫ਼ਤਾਰ ਨਹੀਂ ਬਦਲਦੀ|ਸਥਿਰ|ਉਹੀ ਰਫ਼ਤਾਰ|ਆਪਣੀ ਰਫ਼ਤਾਰ)/.test(q.stem)), `${language}/QL124: each runner's speed invariance must be explicit`);
}

console.log("TSD-CP-010 NATIVE HINDI/PUNJABI LOCALIZATION PROOF: PASS");
console.log(JSON.stringify({
  hindiQuestions: TSD_CP010_NATIVE_FINAL_HINDI_REVIEW.length,
  punjabiQuestions: TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW.length,
  qlsPerLocale: TSD_CP010_PERMANENT_QL_IDS.length,
  familiesPerQl: 6,
  structuralSignaturesPerQl: 6,
  rejectedRaceJargon: "ABSENT",
  ambiguityGuards: ["QL119_DEAD_HEAT", "QL121_TRANSITIVE", "QL122_HEAD_START", "QL123_DELAY", "QL124_SPEED_INVARIANCE"],
  percentagePresentation: "INTEGER_ONLY",
}, null, 2));
