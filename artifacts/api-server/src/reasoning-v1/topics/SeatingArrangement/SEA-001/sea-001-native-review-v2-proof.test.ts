import { SEA001_PERMANENT_INACTIVE_LIFECYCLE } from "./permanent/freeze.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { SEA001_TRANSLATION_TARGET_LOCALES, sea001CanonicalParityFingerprint } from "./localization/readiness.ts";
import { SEA001_REVIEW_CANONICAL_NAMES } from "./localization/name-pack.ts";
import { sea001LocalizedLearnerSurface } from "./localization/candidate-localizer.ts";
import { buildSea001NativeReviewV2 } from "./localization/native-review-v2.ts";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function latinTokens(text: string): readonly string[] {
  return [...text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)].map((match) => match[0]!);
}

const bannedHindi = [
  "संख्या सीटें से बायाँ को दायाँ", "पहला देखें कौन-सा तरीका", "क्योंकि का तरीका वह व्यक्ति",
  "केवल स्थिति 1 है बायाँ", "केवल स्थिति 2 है बायाँ", "नवदीप पर 1 का अंतिम छोर",
  "कौन हैं ठीक अगला पड़ोसी", "के लिए हर बायाँ/दायाँ संकेत", "चलने पर 2 सीटें घड़ी की दिशा में से",
  "यदि सभी बदलता है उनका मुख-दिशा दिशा", "कितने व्यक्ति बीच में बैठे हैं",
] as const;
const bannedPunjabi = [
  "ਗਿਣਤੀ ਸੀਟਾਂ ਤੋਂ ਖੱਬਾ ਨੂੰ ਸੱਜਾ", "ਪਹਿਲਾ ਵੇਖੋ ਕਿਹੜਾ ਤਰੀਕਾ", "ਕਿਉਂਕਿ ਦਾ ਤਰੀਕਾ ਉਹ ਵਿਅਕਤੀ",
  "ਸਿਰਫ਼ ਸਥਿਤੀ 1 ਹੈ ਖੱਬਾ", "ਸਿਰਫ਼ ਸਥਿਤੀ 2 ਹੈ ਖੱਬਾ", "ਨਵਦੀਪ 'ਤੇ 1 ਦਾ ਅੰਤਲੇ ਸਿਰੇ",
  "ਕੌਣ ਹਨ ਬਿਲਕੁਲ ਅਗਲਾ", "ਲਈ ਹਰ ਖੱਬਾ/ਸੱਜਾ ਸੰਕੇਤ", "ਚੱਲਣ 'ਤੇ 2 ਸੀਟਾਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਤੋਂ",
  "ਜੇ ਸਭ ਬਦਲਦਾ ਹੈ ਉਨ੍ਹਾਂ ਦਾ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ", "ਕਿੰਨੇ ਵਿਅਕਤੀ ਵਿਚਕਾਰ ਬੈਠੇ ਹਨ",
] as const;

const canonical = selectManualReviewCorpus(buildSea001SaturationCorpus(40).caselets, 5);
assert(canonical.length === 100, `expected 100 canonical caselets, got ${canonical.length}`);

let localizedCaselets=0;
let localizedChildren=0;
let latinResidue=0;
let canonicalNameLeaks=0;
let bannedHits=0;
const setupFingerprints=new Set<string>();
const clueFingerprints=new Set<string>();
const questionFingerprints=new Set<string>();

for (const locale of SEA001_TRANSLATION_TARGET_LOCALES) {
  for (const source of canonical) {
    const localized=buildSea001NativeReviewV2(source,locale);
    localizedCaselets+=1;
    localizedChildren+=localized.children.length;
    assert(localized.locale===locale,`${source.caseletId}/${locale}: locale mismatch`);
    assert(localized.canonicalCaseletId===source.caseletId,`${source.caseletId}/${locale}: canonical identity mismatch`);
    assert(localized.canonicalParityFingerprint===sea001CanonicalParityFingerprint(source),`${source.caseletId}/${locale}: recorded parity mismatch`);
    assert(sea001CanonicalParityFingerprint(localized)===sea001CanonicalParityFingerprint(source),`${source.caseletId}/${locale}: semantic parity changed`);
    assert(localized.children.length===source.children.length,`${source.caseletId}/${locale}: child count changed`);

    for(let i=0;i<source.children.length;i+=1){
      const a=source.children[i]!, b=localized.children[i]!;
      assert(a.queryContractId===b.queryContractId,`${source.caseletId}/${locale}: query contract changed`);
      assert(a.answerIndex===b.answerIndex,`${source.caseletId}/${locale}: answer index changed`);
      assert(JSON.stringify(a.answer)===JSON.stringify(b.answer),`${source.caseletId}/${locale}: answer changed`);
      assert(b.options.length===4,`${source.caseletId}/${locale}: option count changed`);
      for(let j=0;j<4;j+=1){
        assert(a.options[j]!.semanticFingerprint===b.options[j]!.semanticFingerprint,`${source.caseletId}/${locale}: option semantic changed`);
        assert(a.options[j]!.isCorrect===b.options[j]!.isCorrect,`${source.caseletId}/${locale}: option correctness changed`);
        assert(a.options[j]!.misconceptionId===b.options[j]!.misconceptionId,`${source.caseletId}/${locale}: misconception identity changed`);
      }
    }

    const surface=sea001LocalizedLearnerSurface(localized);
    if(locale==="hi-IN") assert(/[\u0900-\u097F]/u.test(surface),`${source.caseletId}: no Devanagari learner surface`);
    else assert(/[\u0A00-\u0A7F]/u.test(surface),`${source.caseletId}: no Gurmukhi learner surface`);

    latinResidue+=latinTokens(surface).length;
    for(const n of SEA001_REVIEW_CANONICAL_NAMES) if(new RegExp(`\\b${n}\\b`).test(surface)) canonicalNameLeaks+=1;
    for(const bad of locale==="hi-IN"?bannedHindi:bannedPunjabi) if(surface.includes(bad)) bannedHits+=1;

    setupFingerprints.add(`${locale}|${localized.setupText}`);
    localized.clueTexts.forEach((text)=>clueFingerprints.add(`${locale}|${text}`));
    localized.children.forEach((child)=>questionFingerprints.add(`${locale}|${child.text}`));

    assert(localized.humanLanguageReviewRequired,`${source.caseletId}/${locale}: human review must remain required`);
    assert(!localized.productDeliveryUnlocked,`${source.caseletId}/${locale}: delivery cannot unlock`);
    assert(!localized.productionStagingApproved,`${source.caseletId}/${locale}: staging cannot unlock`);
  }
}

assert(localizedCaselets===200,`expected 200 localized caselets, got ${localizedCaselets}`);
assert(localizedChildren===800,`expected 800 localized questions, got ${localizedChildren}`);
assert(latinResidue===0,`native V2 learner surface contains ${latinResidue} Latin tokens`);
assert(canonicalNameLeaks===0,`native V2 learner surface contains ${canonicalNameLeaks} canonical name leaks`);
assert(bannedHits===0,`native V2 learner surface contains ${bannedHits} known translationese fragments`);
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered,"Question Studio must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable,"Question Bank writes must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible,"test eligibility must remain disabled");
assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable,"public delivery must remain disabled");

console.log("PASS_SEA_001_NATIVE_REVIEW_V2");
console.log("localized caselets",localizedCaselets);
console.log("localized questions",localizedChildren);
console.log("semantic parity","200/200");
console.log("Latin learner residue",latinResidue);
console.log("canonical name leaks",canonicalNameLeaks);
console.log("known translationese hits",bannedHits);
console.log("distinct native setups",setupFingerprints.size);
console.log("distinct native clues",clueFingerprints.size);
console.log("distinct native questions",questionFingerprints.size);
console.log("human language review","PENDING");
console.log("Question Studio registered",SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered);
