import { SEA001_PERMANENT_INACTIVE_LIFECYCLE } from "./permanent/freeze.ts";
import { buildSea001SaturationCorpus, selectManualReviewCorpus } from "./saturation/corpus.ts";
import { SEA001_TRANSLATION_TARGET_LOCALES, assertSea001LocalizationFoundationStillBlocked, sea001CanonicalParityFingerprint } from "./localization/readiness.ts";
import { SEA001_REVIEW_CANONICAL_NAMES } from "./localization/name-pack.ts";
import { sea001LocalizedLearnerSurface } from "./localization/candidate-localizer.ts";
import { buildSea001NativeCandidate } from "./localization/native-input-adapter.ts";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function latinTokens(text: string): readonly string[] { return [...text.matchAll(/[A-Za-z]+(?:'[A-Za-z]+)?/g)].map((match) => match[0]!); }
const mechanicalHindiFragments=["संख्या सीटें से बायाँ को दायाँ","पहला देखें कौन-सा तरीका","क्योंकि का तरीका वह व्यक्ति","केवल स्थिति 1 है बायाँ","केवल स्थिति 2 है बायाँ","नवदीप पर 1 का अंतिम छोर","कौन हैं ठीक अगला पड़ोसी","के लिए हर बायाँ/दायाँ संकेत","चलने पर 2 सीटें घड़ी की दिशा में से","यदि सभी बदलता है उनका मुख-दिशा दिशा","कितने व्यक्ति बीच में बैठे हैं"] as const;
const mechanicalPunjabiFragments=["ਗਿਣਤੀ ਸੀਟਾਂ ਤੋਂ ਖੱਬਾ ਨੂੰ ਸੱਜਾ","ਪਹਿਲਾ ਵੇਖੋ ਕਿਹੜਾ ਤਰੀਕਾ","ਕਿਉਂਕਿ ਦਾ ਤਰੀਕਾ ਉਹ ਵਿਅਕਤੀ","ਸਿਰਫ਼ ਸਥਿਤੀ 1 ਹੈ ਖੱਬਾ","ਸਿਰਫ਼ ਸਥਿਤੀ 2 ਹੈ ਖੱਬਾ","ਨਵਦੀਪ 'ਤੇ 1 ਦਾ ਅੰਤਲੇ ਸਿਰੇ","ਕੌਣ ਹਨ ਬਿਲਕੁਲ ਅਗਲਾ","ਲਈ ਹਰ ਖੱਬਾ/ਸੱਜਾ ਸੰਕੇਤ","ਚੱਲਣ 'ਤੇ 2 ਸੀਟਾਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਤੋਂ","ਜੇ ਸਭ ਬਦਲਦਾ ਹੈ ਉਨ੍ਹਾਂ ਦਾ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ","ਕਿੰਨੇ ਵਿਅਕਤੀ ਵਿਚਕਾਰ ਬੈਠੇ ਹਨ"] as const;
const badHindiOrdinalLocation=/(?:पहला|दूसरा|तीसरा|चौथा|पाँचवाँ|छठा|सातवाँ|आठवाँ|नौवाँ|दसवाँ) स्थान (?:पर|तक)/u;
const badPunjabiOrdinalLocation=/(?:ਪਹਿਲਾ|ਦੂਜਾ|ਤੀਜਾ|ਚੌਥਾ|ਪੰਜਵਾਂ|ਛੇਵਾਂ|ਸੱਤਵਾਂ|ਅੱਠਵਾਂ|ਨੌਵਾਂ|ਦਸਵਾਂ) ਸਥਾਨ (?:'ਤੇ|ਤੱਕ)/u;
const canonicalReview=selectManualReviewCorpus(buildSea001SaturationCorpus(40).caselets,5);
assert(canonicalReview.length===100,`expected 100 canonical review caselets, got ${canonicalReview.length}`);
let localizedCaseletCount=0,localizedChildCount=0,canonicalNameLeakCount=0,residualLatinCount=0,mechanicalTranslationeseCount=0,ordinalGrammarViolationCount=0,singularGenderMarkerCount=0;
const queryContracts=new Set<string>();
for(const locale of SEA001_TRANSLATION_TARGET_LOCALES){
  for(const canonical of canonicalReview){
    const localized=buildSea001NativeCandidate(canonical,locale);
    localizedCaseletCount+=1; localizedChildCount+=localized.children.length;
    assert(localized.locale===locale,`${canonical.caseletId}: localized locale mismatch`);
    assert(localized.canonicalLocale==="en-IN",`${canonical.caseletId}: canonical locale mismatch`);
    assert(localized.canonicalCaseletId===canonical.caseletId,`${canonical.caseletId}: canonical caselet identity mismatch`);
    assert(localized.canonicalParityFingerprint===sea001CanonicalParityFingerprint(canonical),`${canonical.caseletId}: recorded canonical parity mismatch`);
    assert(sea001CanonicalParityFingerprint(localized)===sea001CanonicalParityFingerprint(canonical),`${canonical.caseletId}/${locale}: semantic parity changed`);
    assert(localized.children.length===canonical.children.length,`${canonical.caseletId}/${locale}: child count changed`);
    for(let childIndex=0;childIndex<canonical.children.length;childIndex+=1){
      const source=canonical.children[childIndex]!,candidate=localized.children[childIndex]!; queryContracts.add(source.queryContractId);
      assert(candidate.queryContractId===source.queryContractId,`${canonical.caseletId}/${locale}: query contract changed`);
      assert(candidate.answerType===source.answerType,`${canonical.caseletId}/${locale}: answer type changed`);
      assert(candidate.answerIndex===source.answerIndex,`${canonical.caseletId}/${locale}: answer index changed`);
      assert(JSON.stringify(candidate.answer)===JSON.stringify(source.answer),`${canonical.caseletId}/${locale}: semantic answer changed`);
      assert(candidate.options.length===4,`${canonical.caseletId}/${locale}: option count changed`);
      for(let optionIndex=0;optionIndex<4;optionIndex+=1){const a=source.options[optionIndex]!,b=candidate.options[optionIndex]!;assert(a.semanticFingerprint===b.semanticFingerprint,`${canonical.caseletId}/${locale}: option semantic changed`);assert(a.isCorrect===b.isCorrect,`${canonical.caseletId}/${locale}: option correctness changed`);assert(a.misconceptionId===b.misconceptionId,`${canonical.caseletId}/${locale}: misconception identity changed`);}
    }
    const surface=sea001LocalizedLearnerSurface(localized);
    if(locale==="hi-IN"){
      assert(/[\u0900-\u097F]/u.test(surface),`${canonical.caseletId}: Hindi learner surface lacks Devanagari`);
      for(const fragment of mechanicalHindiFragments) if(surface.includes(fragment)) mechanicalTranslationeseCount+=1;
      if(badHindiOrdinalLocation.test(surface)) ordinalGrammarViolationCount+=1;
      singularGenderMarkerCount+=(surface.match(/ बैठा है/g)??[]).length;
    }else{
      assert(/[\u0A00-\u0A7F]/u.test(surface),`${canonical.caseletId}: Punjabi learner surface lacks Gurmukhi`);
      for(const fragment of mechanicalPunjabiFragments) if(surface.includes(fragment)) mechanicalTranslationeseCount+=1;
      if(badPunjabiOrdinalLocation.test(surface)) ordinalGrammarViolationCount+=1;
      singularGenderMarkerCount+=(surface.match(/ ਬੈਠਾ ਹੈ/g)??[]).length;
    }
    residualLatinCount+=latinTokens(surface).length; for(const name of SEA001_REVIEW_CANONICAL_NAMES) if(new RegExp(`\\b${name}\\b`).test(surface)) canonicalNameLeakCount+=1;
    assert(localized.humanLanguageReviewRequired,`${canonical.caseletId}/${locale}: human language review cannot be skipped`); assert(!localized.productDeliveryUnlocked,`${canonical.caseletId}/${locale}: product delivery cannot unlock`); assert(!localized.productionStagingApproved,`${canonical.caseletId}/${locale}: staging cannot unlock`);
  }
}
assert(localizedCaseletCount===200,`expected 200 localized review caselets, got ${localizedCaseletCount}`); assert(localizedChildCount===800,`expected 800 localized child questions, got ${localizedChildCount}`); assert(canonicalNameLeakCount===0,`native learner text exposes ${canonicalNameLeakCount} canonical Latin names`); assert(residualLatinCount===0,`native learner text exposes ${residualLatinCount} Latin tokens`); assert(mechanicalTranslationeseCount===0,`native learner text exposes ${mechanicalTranslationeseCount} known translationese fragments`); assert(ordinalGrammarViolationCount===0,`native learner text exposes ${ordinalGrammarViolationCount} nominative ordinal location phrases`); assert(singularGenderMarkerCount===0,`native learner text exposes ${singularGenderMarkerCount} gendered singular seating markers`);
assertSea001LocalizationFoundationStillBlocked(); assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered,"Question Studio must remain disabled"); assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionBankWritable,"Question Bank writes must remain disabled"); assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.testEligible,"mock-test eligibility must remain disabled"); assert(!SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable,"public delivery must remain disabled");
console.log("PASS_SEA_001_NATIVE_REVIEW_V2"); console.log("localized caselets",localizedCaseletCount); console.log("localized child questions",localizedChildCount); console.log("semantic parity","200/200"); console.log("query contracts",queryContracts.size); console.log("Latin learner residue",residualLatinCount); console.log("known mechanical translationese",mechanicalTranslationeseCount); console.log("ordinal grammar violations",ordinalGrammarViolationCount); console.log("gendered singular seating markers",singularGenderMarkerCount); console.log("human language review","PENDING"); console.log("Question Studio registered",SEA001_PERMANENT_INACTIVE_LIFECYCLE.questionStudioRegistered); console.log("publicly publishable",SEA001_PERMANENT_INACTIVE_LIFECYCLE.publiclyPublishable);
