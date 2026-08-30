import { verifyTsdCp011 } from "./executable-verifier";
import { TSD_CP011_ENGLISH_REVIEW } from "./english-review-final";
import { TSD_CP011_NATIVE_HINDI_REVIEW, TSD_CP011_NATIVE_PUNJABI_REVIEW } from "./native-review-final";
import { TSD_CP011_PROVISIONAL_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-011 native localization proof failed: ${message}`);
}

const DEVANAGARI = /\p{Script=Devanagari}/u;
const GURMUKHI = /\p{Script=Gurmukhi}/u;

assert(TSD_CP011_NATIVE_HINDI_REVIEW.length === 168, "expected 168 Hindi review questions");
assert(TSD_CP011_NATIVE_PUNJABI_REVIEW.length === 168, "expected 168 Punjabi review questions");
assert(TSD_CP011_ENGLISH_REVIEW.length === 168, "expected 168 English parity questions");

for (const [language, questions] of [
  ["hi", TSD_CP011_NATIVE_HINDI_REVIEW],
  ["pa", TSD_CP011_NATIVE_PUNJABI_REVIEW],
] as const) {
  assert(new Set(questions.map((x) => x.familyId)).size === 168, `${language}: family IDs must be unique`);
  assert(new Set(questions.map((x) => x.stem)).size === 168, `${language}: learner stems must be unique`);

  for (const qlId of TSD_CP011_PROVISIONAL_QL_IDS) {
    const localized = questions.filter((x) => x.qlId === qlId);
    assert(localized.length === 24, `${language}/${qlId}: expected 24 families`);
    assert(new Set(localized.map((x) => x.input.target)).size >= 2, `${language}/${qlId}: target variety is too thin`);
    for (const target of new Set(localized.map((x) => x.input.target))) {
      assert(localized.filter((x) => x.input.target === target).length >= 4, `${language}/${qlId}/${target}: target evidence is too thin`);
    }
  }

  for (const question of questions) {
    const english = TSD_CP011_ENGLISH_REVIEW.find((x) => x.familyId === question.familyId);
    assert(english, `${language}/${question.familyId}: English parity family missing`);
    assert(question.qlId === english.qlId, `${language}/${question.familyId}: QL mismatch`);
    assert(question.authorityKey === english.authorityKey, `${language}/${question.familyId}: authority mismatch`);
    assert(question.difficulty === english.difficulty, `${language}/${question.familyId}: difficulty mismatch`);
    assert(question.input === english.input, `${language}/${question.familyId}: executable input parity lost`);
    assert(question.solution === english.solution, `${language}/${question.familyId}: solution parity lost`);
    assert(question.stem.length >= 65, `${language}/${question.familyId}: stem is too thin`);
    assert(question.explanation.steps.length === 2, `${language}/${question.familyId}: explanation must remain two concise steps`);
    assert(!/[A-Za-z]/.test(question.stem), `${language}/${question.familyId}: learner stem contains Latin-script wording`);
    assert(!/\{[A-Za-z0-9]+\}/.test(question.stem), `${language}/${question.familyId}: unresolved placeholder`);
    assert(verifyTsdCp011(question.input, question.solution).accepted, `${language}/${question.familyId}: independent verifier rejected`);

    if (language === "hi") {
      assert(DEVANAGARI.test(question.stem), `${question.familyId}: Devanagari script missing`);
      assert(!GURMUKHI.test(question.stem), `${question.familyId}: Hindi stem contains Gurmukhi letters`);
      assert(!/(एस्केलेटर|वॉकवे|कन्वेयर|आरपीएम)/.test(question.stem), `${question.familyId}: avoidable transliterated jargon remains in Hindi`);
    } else {
      assert(GURMUKHI.test(question.stem), `${question.familyId}: Gurmukhi script missing`);
      assert(!DEVANAGARI.test(question.stem), `${question.familyId}: Punjabi stem contains Devanagari letters`);
      assert(!/(ਐਸਕੇਲੇਟਰ|ਵਾਕਵੇ|ਕਨਵੇਅਰ|ਆਰਪੀਐਮ)/.test(question.stem), `${question.familyId}: avoidable transliterated jargon remains in Punjabi`);
    }
  }
}

for (const [language, questions] of [["hi", TSD_CP011_NATIVE_HINDI_REVIEW], ["pa", TSD_CP011_NATIVE_PUNJABI_REVIEW]] as const) {
  const ql126 = questions.filter((x) => x.qlId === "TSD-QL-126");
  const ql127 = questions.filter((x) => x.qlId === "TSD-QL-127");
  const ql128 = questions.filter((x) => x.qlId === "TSD-QL-128");
  const ql129 = questions.filter((x) => x.qlId === "TSD-QL-129");
  const ql130 = questions.filter((x) => x.qlId === "TSD-QL-130");
  const ql131 = questions.filter((x) => x.qlId === "TSD-QL-131");
  assert(ql126.every((x) => language === "hi" ? /सीढ़/.test(x.stem) : /ਸੀੜ੍ਹ|ਪੌੜ/.test(x.stem)), `${language}/QL126: step/escalator evidence missing`);
  assert(ql127.every((x) => language === "hi" ? /(दिशा|ऊपर|नीचे|विपरीत)/.test(x.stem) : /(ਦਿਸ਼ਾ|ਉੱਪਰ|ਹੇਠਾਂ|ਉਲਟ)/.test(x.stem)), `${language}/QL127: directional pair evidence missing`);
  assert(ql128.every((x) => language === "hi" ? /(रुकी|खड़े|चलती)/.test(x.stem) : /(ਰੁਕੀ|ਖੜ੍ਹੇ|ਚੱਲਦੀ)/.test(x.stem)), `${language}/QL128: alternate surface state missing`);
  assert(ql129.every((x) => language === "hi" ? /(पहिया|पहिए|पहिये)/.test(x.stem) : /ਪਹੀ/.test(x.stem)), `${language}/QL129: wheel evidence missing`);
  assert(ql130.every((x) => language === "hi" ? /(प्रति मिनट|परिधि)/.test(x.stem) : /(ਪ੍ਰਤੀ ਮਿੰਟ|ਘੇਰ)/.test(x.stem)), `${language}/QL130: rotational-rate evidence missing`);
  assert(ql131.every((x) => language === "hi" ? /(दो पहिए|दो पहियों|पहिया क)/.test(x.stem) : /(ਦੋ ਪਹੀ|ਪਹੀਆ ਕ)/.test(x.stem)), `${language}/QL131: two-wheel evidence missing`);
}

console.log("TSD-CP-011 NATIVE HINDI/PUNJABI LOCALIZATION PROOF: PASS");
console.log(JSON.stringify({
  hindiQuestions: TSD_CP011_NATIVE_HINDI_REVIEW.length,
  punjabiQuestions: TSD_CP011_NATIVE_PUNJABI_REVIEW.length,
  familiesPerQl: 24,
  qls: TSD_CP011_PROVISIONAL_QL_IDS.length,
  targetEvidenceFloor: 4,
  latinScriptInLearnerStems: "ABSENT",
  crossScriptLetters: "ABSENT",
  avoidableTranslatedJargon: "ABSENT",
}, null, 2));