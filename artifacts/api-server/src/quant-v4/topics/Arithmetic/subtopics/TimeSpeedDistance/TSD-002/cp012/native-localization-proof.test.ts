import { verifyTsdCp012 } from "./executable-verifier";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL, TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";
import { TSD_CP012_PROVISIONAL_QL_IDS, TSD_CP012_QL_LIFECYCLE } from "./ql-allocation";
import { verifyTsdCp012SourceExtension } from "./source-executable-extensions";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-012 native localization proof failed: ${message}`);
}
function shape(stem: string): string {
  return stem.toLowerCase().replace(/\d+(?:\s+\d+\/\d+|\/\d+)?/g, "#").replace(/\s+/g, " ").trim();
}
const DEVANAGARI = /\p{Script=Devanagari}/u;
const GURMUKHI = /\p{Script=Gurmukhi}/u;
const LATIN = /[A-Za-z]/;
const extensionTargets = new Set(["EXACT_TIME_TO_DISTANCE_IN_REPEATING_CYCLE", "DISTANCE_REMAINING_AFTER_STAGES", "CLOSED_ROUTE_OPPOSITE_MEETING_TIME"]);

assert(TSD_CP012_ENGLISH_REVIEW_FINAL.length === 270, "expected 270 English parity questions");
assert(TSD_CP012_NATIVE_HINDI_REVIEW_FINAL.length === 270, "expected 270 Hindi review questions");
assert(TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL.length === 270, "expected 270 Punjabi review questions");

for (const [language, questions] of [["hi", TSD_CP012_NATIVE_HINDI_REVIEW_FINAL], ["pa", TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL]] as const) {
  assert(new Set(questions.map((x) => x.familyId)).size === 270, `${language}: family IDs must be unique`);
  assert(new Set(questions.map((x) => x.stem)).size === 270, `${language}: learner stems must be unique`);

  for (const qlId of TSD_CP012_PROVISIONAL_QL_IDS) {
    const localized = questions.filter((x) => x.qlId === qlId);
    const english = TSD_CP012_ENGLISH_REVIEW_FINAL.filter((x) => x.qlId === qlId);
    assert(localized.length === english.length, `${language}/${qlId}: localized family count must equal English (${english.length})`);
    assert(localized.length === 24 || localized.length === 26, `${language}/${qlId}: unexpected expanded family count ${localized.length}`);
    assert(new Set(localized.map((x) => x.input.target)).size === new Set(english.map((x) => x.input.target)).size, `${language}/${qlId}: target variety drifted from English`);
    assert(new Set(localized.map((x) => shape(x.stem))).size >= 3, `${language}/${qlId}: normalized stem structures are too repetitive`);
  }

  for (const question of questions) {
    const english = TSD_CP012_ENGLISH_REVIEW_FINAL.find((x) => x.familyId === question.familyId);
    assert(english, `${language}/${question.familyId}: English parity family missing`);
    assert(question.qlId === english.qlId, `${language}/${question.familyId}: QL mismatch`);
    assert(question.authorityKey === english.authorityKey, `${language}/${question.familyId}: authority mismatch`);
    assert(question.difficulty === english.difficulty, `${language}/${question.familyId}: difficulty mismatch`);
    assert(question.caseId === english.caseId, `${language}/${question.familyId}: executable case mismatch`);
    assert(question.input === english.input, `${language}/${question.familyId}: executable input parity lost`);
    assert(question.solution === english.solution, `${language}/${question.familyId}: solution parity lost`);
    assert(!LATIN.test(question.stem), `${language}/${question.familyId}: learner stem contains Latin-script wording`);
    assert(!question.explanation.steps.some((step) => LATIN.test(step)), `${language}/${question.familyId}: explanation contains Latin-script wording`);
    assert(!LATIN.test(question.explanation.conclusion), `${language}/${question.familyId}: conclusion contains Latin-script wording`);
    assert(!/\{[A-Za-z0-9_]+\}/.test(question.stem), `${language}/${question.familyId}: unresolved placeholder`);
    assert(question.explanation.steps.length === 2, `${language}/${question.familyId}: explanation must remain two concise steps`);
    assert(question.explanation.steps.every((step) => /[।.!?]$/.test(step.trim())), `${language}/${question.familyId}: explanation contains a sentence fragment`);
    assert(question.explanation.steps.every((step) => !step.includes(question.stem)), `${language}/${question.familyId}: explanation repeats full stem`);

    if (extensionTargets.has(question.input.target)) {
      const result = verifyTsdCp012SourceExtension(question.input as Parameters<typeof verifyTsdCp012SourceExtension>[0], question.solution as Parameters<typeof verifyTsdCp012SourceExtension>[1]);
      assert(result.accepted, `${language}/${question.familyId}: source-extension verifier rejected (${result.reason})`);
    } else {
      const result = verifyTsdCp012(question.input as Parameters<typeof verifyTsdCp012>[0], question.solution);
      assert(result.accepted, `${language}/${question.familyId}: verifier rejected (${result.reason})`);
    }

    if (language === "hi") {
      assert(DEVANAGARI.test(question.stem), `${question.familyId}: Devanagari script missing`);
      assert(!GURMUKHI.test(question.stem), `${question.familyId}: Hindi stem contains Gurmukhi letters`);
      assert(!GURMUKHI.test(question.explanation.steps.join(" ")), `${question.familyId}: Hindi explanation contains Gurmukhi letters`);
    } else {
      assert(GURMUKHI.test(question.stem), `${question.familyId}: Gurmukhi script missing`);
      assert(!DEVANAGARI.test(question.stem), `${question.familyId}: Punjabi stem contains Devanagari letters`);
      assert(!DEVANAGARI.test(question.explanation.steps.join(" ")), `${question.familyId}: Punjabi explanation contains Devanagari letters`);
    }
  }
}

const semanticEvidence = {
  "TSD-QL-132": { hi: /(चरण|चक्र|क्रम)/, pa: /(ਪੜਾਅ|ਚੱਕਰ|ਕ੍ਰਮ)/ },
  "TSD-QL-133": { hi: /(विश्राम|आराम)/, pa: /(ਆਰਾਮ|ਠਹਿਰ)/ },
  "TSD-QL-134": { hi: /(शेष|अंतिम|सीमा|देरी|बदल|न्यूनतम)/, pa: /(ਬਾਕੀ|ਆਖਰੀ|ਸੀਮਾ|ਦੇਰੀ|ਬਦਲ|ਘੱਟੋ-ਘੱਟ)/ },
  "TSD-QL-135": { hi: /(मार्ग|खंड|आयताकार)/, pa: /(ਰਸਤਾ|ਖੰਡ|ਆਇਤਾਕਾਰ)/ },
  "TSD-QL-136": { hi: /(यात्रा|सारणी|छूट|अज्ञात)/, pa: /(ਯਾਤਰਾ|ਸਾਰਣੀ|ਗੁੰਮ|ਅਣਜਾਣ)/ },
  "TSD-QL-137": { hi: /(रेलगाड़ी|स्टेशन|प्रस्थान|पार)/, pa: /(ਰੇਲਗੱਡੀ|ਸਟੇਸ਼ਨ|ਰਵਾਨਗੀ|ਪਾਰ)/ },
  "TSD-QL-138": { hi: /(धारा|नाव|बेड़ा|पकड़)/, pa: /(ਧਾਰਾ|ਕਿਸ਼ਤੀ|ਬੇੜਾ|ਫੜ)/ },
  "TSD-QL-139": { hi: /(वृत्ताकार|दौड़|धावक|बढ़त)/, pa: /(ਗੋਲ|ਦੌੜ|ਅਗਵਾਈ|ਦੌੜਾਕ)/ },
  "TSD-QL-140": { hi: /(चलती|पट्टी|सतह|दिशा)/, pa: /(ਚੱਲਦੀ|ਪੱਟੀ|ਸਤਹ|ਦਿਸ਼ਾ)/ },
  "TSD-QL-141": { hi: /(स्वतंत्र|अज्ञात चाल|धावक)/, pa: /(ਸੁਤੰਤਰ|ਅਣਜਾਣ ਚਾਲ|ਦੌੜਾਕ)/ },
  "TSD-QL-142": { hi: /(पूर्णांक|अनुमत|सभी|संख्या)/, pa: /(ਪੂਰਨ ਅੰਕ|ਮਨਜ਼ੂਰ|ਸਾਰੀਆਂ|ਗਿਣਤੀ)/ },
} as const;
for (const qlId of TSD_CP012_PROVISIONAL_QL_IDS) {
  const hi = TSD_CP012_NATIVE_HINDI_REVIEW_FINAL.filter((x) => x.qlId === qlId);
  const pa = TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL.filter((x) => x.qlId === qlId);
  const evidence = semanticEvidence[qlId];
  assert(hi.every((x) => evidence.hi.test(x.stem)), `hi/${qlId}: authority-defining evidence missing`);
  assert(pa.every((x) => evidence.pa.test(x.stem)), `pa/${qlId}: authority-defining evidence missing`);
}

const hi141 = TSD_CP012_NATIVE_HINDI_REVIEW_FINAL.filter((x) => x.qlId === "TSD-QL-141");
const pa141 = TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL.filter((x) => x.qlId === "TSD-QL-141");
assert(hi141.length === 24 && pa141.length === 24, "TSD-QL-141: expected 24 two-engine families per native locale");
assert(hi141.every((x) => /एक स्वतंत्र निरीक्षण/.test(x.stem) && /दूसरे स्वतंत्र निरीक्षण/.test(x.stem)), "hi/TSD-QL-141: two concrete observations must remain explicit");
assert(pa141.every((x) => /ਇੱਕ ਸੁਤੰਤਰ ਨਿਰੀਖਣ/.test(x.stem) && /ਦੂਜੇ ਸੁਤੰਤਰ ਨਿਰੀਖਣ/.test(x.stem)), "pa/TSD-QL-141: two concrete observations must remain explicit");
assert(hi141.every((x) => !/समीकरण|=/.test(x.stem)), "hi/TSD-QL-141: learner stem must not expose the internal equation model");
assert(pa141.every((x) => !/ਸਮੀਕਰਨ|=/.test(x.stem)), "pa/TSD-QL-141: learner stem must not expose the internal equation model");
assert(hi141.every((x) => /दूरी/.test(x.stem) && /सेकंड/.test(x.stem)), "hi/TSD-QL-141: observable distance/time evidence missing");
assert(pa141.every((x) => /ਦੂਰੀ/.test(x.stem) && /ਸਕਿੰਟ/.test(x.stem)), "pa/TSD-QL-141: observable distance/time evidence missing");

const hi142Sets = TSD_CP012_NATIVE_HINDI_REVIEW_FINAL.filter((x) => x.qlId === "TSD-QL-142" && x.input.target === "VALID_SET");
const pa142Sets = TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL.filter((x) => x.qlId === "TSD-QL-142" && x.input.target === "VALID_SET");
assert(hi142Sets.length === 12 && pa142Sets.length === 12, "TSD-QL-142: expected 12 complete-set MCQ families per native locale");
assert(hi142Sets.every((x) => /कौन-सा सभी मान्य चालों का पूरा समूह/.test(x.stem)), "hi/TSD-QL-142: complete-set stem must be option-selection MCQ wording");
assert(pa142Sets.every((x) => /ਕਿਹੜਾ ਸਾਰੀਆਂ ਮਨਜ਼ੂਰ ਚਾਲਾਂ ਦਾ ਪੂਰਾ ਸਮੂਹ/.test(x.stem)), "pa/TSD-QL-142: complete-set stem must be option-selection MCQ wording");
assert(hi142Sets.every((x) => !/सभी अनुमत चालें लिखिए|पूरा समूह लिखिए/.test(x.stem)), "hi/TSD-QL-142: worksheet-style list instruction leaked back in");
assert(pa142Sets.every((x) => !/ਸਾਰੀਆਂ ਮਨਜ਼ੂਰ ਚਾਲਾਂ ਲਿਖੋ|ਪੂਰਾ ਸਮੂਹ ਲਿਖੋ/.test(x.stem)), "pa/TSD-QL-142: worksheet-style list instruction leaked back in");

assert(TSD_CP012_QL_LIFECYCLE.productOwnerApproved === true, "native frozen review must retain approval");
assert(TSD_CP012_QL_LIFECYCLE.frozen === true, "native frozen review must retain freeze authority");
assert(TSD_CP012_QL_LIFECYCLE.questionStudioRegistered === false, "native freeze must not register Question Studio");
assert(TSD_CP012_QL_LIFECYCLE.questionBankWritable === false, "native freeze must not enable Bank writes");
assert(TSD_CP012_QL_LIFECYCLE.testEligible === false, "native freeze must not enable tests");
assert(TSD_CP012_QL_LIFECYCLE.publiclyPublishable === false, "native freeze must not enable public publishing");

console.log("TSD-CP-012 NATIVE HINDI/PUNJABI LOCALIZATION PROOF: PASS");
console.log(JSON.stringify({
  englishQuestions: TSD_CP012_ENGLISH_REVIEW_FINAL.length,
  hindiQuestions: TSD_CP012_NATIVE_HINDI_REVIEW_FINAL.length,
  punjabiQuestions: TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL.length,
  familiesPerQl: "24_OR_26_TARGET_EXHAUSTIVE",
  qls: TSD_CP012_PROVISIONAL_QL_IDS.length,
  inputSolutionParity: "IDENTICAL_OBJECT_REFERENCES",
  minimumNormalizedStemShapesPerQl: 3,
  ql141LearnerSurface: "NATIVE_CONCRETE_MOTION_OBSERVATIONS",
  ql142SetSurface: "NATIVE_FOUR_OPTION_COMPLETE_SET_MCQ",
  latinScriptInLearnerText: "ABSENT",
  lifecycle: "FROZEN_CONTENT_PRODUCTION_LOCKED",
}, null, 2));
