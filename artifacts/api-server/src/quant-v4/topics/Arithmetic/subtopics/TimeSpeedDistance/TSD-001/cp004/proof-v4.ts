import "./proof-v3";
import { renderCp004EditorialV4NativeQuestion } from "./native-v4";
import { cp004UsesFeminineNativeActor } from "./native-grammar";
import { generateCp004EditorialV3EnglishReviewCorpus } from "./runtime-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const review = generateCp004EditorialV3EnglishReviewCorpus();
let feminineRows = 0;
let hindiGenderChecks = 0;
let punjabiGenderChecks = 0;
let pluralAgreementChecks = 0;
let unicodeBoundaryChecks = 0;
let futureAgreementChecks = 0;
const END = "(?=\\s|[।,?]|$)";

for (const english of review) {
  if (!cp004UsesFeminineNativeActor(english.state.actorKind)) continue;
  feminineRows += 2;

  const hi = renderCp004EditorialV4NativeQuestion(english, "hi").stem;
  const pa = renderCp004EditorialV4NativeQuestion(english, "pa").stem;

  const hiBadNoun = new RegExp(`दो कार${END}|दो बस${END}|दूसरा कार${END}|दूसरा बस${END}|दूसरा डिलीवरी वैन${END}`, "u");
  const paBadNoun = new RegExp(`ਦੋ ਕਾਰ${END}|ਦੋ ਬੱਸ${END}|ਦੋ ਡਿਲਿਵਰੀ ਵੈਨ${END}|ਦੂਜਾ ਕਾਰ${END}|ਦੂਜਾ ਬੱਸ${END}|ਦੂਜਾ ਡਿਲਿਵਰੀ ਵੈਨ${END}`, "u");
  assert(!hiBadNoun.test(hi), `Hindi feminine noun-number agreement failed: ${hi}`);
  assert(!paBadNoun.test(pa), `Punjabi feminine noun-number agreement failed: ${pa}`);
  pluralAgreementChecks += 2;
  unicodeBoundaryChecks += 2;

  assert(!/(?:कार|बस|डिलीवरी वैन)(?: [ABC])?[^।?]{0,100}(?:चलता रहता है|चलता है|आता है|निकलता है|पकड़ता है|करता है|मिलता है)/u.test(hi), `Hindi feminine singular verb agreement failed: ${hi}`);
  assert(!/(?:कारें|बसें|डिलीवरी वैन)[^।?]{0,100}(?:चलते रहते हैं|चलते हैं|आते हैं|निकलते हैं|पकड़ते हैं|करते हैं|मिलते हैं)/u.test(hi), `Hindi feminine plural verb agreement failed: ${hi}`);
  assert(!/(?:चल रहे एक (?:कार|बस|डिलीवरी वैन)|चल रहे (?:कार|बस|डिलीवरी वैन)|बढ़ रहे हैं|जाते हैं|चलते रहें)/u.test(hi), `Hindi feminine participle/plural agreement failed: ${hi}`);
  assert(!/(?:कार|बस|डिलीवरी वैन)(?: [ABC])?[^।?]{0,120}(?:पकड़ेगा|तय करेगा)/u.test(hi), `Hindi feminine future agreement failed: ${hi}`);
  assert(!/(?:दोनों|वे)[^।?]{0,100}(?:मिलेंगे|होंगे)/u.test(hi), `Hindi feminine plural future agreement failed: ${hi}`);
  assert(!/पहले की गति|दूसरे की गति|दूसरे की (?=\d)|दूसरे को/u.test(hi), `Hindi feminine pronoun/adjective agreement failed: ${hi}`);
  hindiGenderChecks += 1;
  futureAgreementChecks += 1;

  assert(!/(?:ਕਾਰ|ਬੱਸ|ਡਿਲਿਵਰੀ ਵੈਨ)(?: [ABC])?[^।?]{0,100}(?:ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ|ਚੱਲਦਾ ਹੈ|ਆਉਂਦਾ ਹੈ|ਨਿਕਲਦਾ ਹੈ|ਫੜਦਾ ਹੈ|ਕਰਦਾ ਹੈ|ਮਿਲਦਾ ਹੈ)/u.test(pa), `Punjabi feminine singular verb agreement failed: ${pa}`);
  assert(!/(?:ਕਾਰਾਂ|ਬੱਸਾਂ|ਡਿਲਿਵਰੀ ਵੈਨਾਂ)[^।?]{0,100}(?:ਚੱਲਦੇ ਰਹਿੰਦੇ ਹਨ|ਚੱਲਦੇ ਹਨ|ਆਉਂਦੇ ਹਨ|ਨਿਕਲਦੇ ਹਨ|ਫੜਦੇ ਹਨ|ਕਰਦੇ ਹਨ|ਮਿਲਦੇ ਹਨ)/u.test(pa), `Punjabi feminine plural verb agreement failed: ${pa}`);
  assert(!/(?:ਚੱਲ ਰਹੇ ਇੱਕ (?:ਕਾਰ|ਬੱਸ|ਡਿਲਿਵਰੀ ਵੈਨ)|ਚੱਲ ਰਹੇ (?:ਕਾਰ|ਬੱਸ|ਡਿਲਿਵਰੀ ਵੈਨ)|ਚੱਲ ਰਹੇ ਹਨ|ਆ ਰਹੇ ਹਨ|ਜਾਂਦੇ ਹਨ|ਚੱਲਦੇ ਰਹਿਣ)/u.test(pa), `Punjabi feminine participle/plural agreement failed: ${pa}`);
  assert(!/(?:ਕਾਰ|ਬੱਸ|ਡਿਲਿਵਰੀ ਵੈਨ)(?: [ABC])?[^।?]{0,120}(?:ਫੜੇਗਾ|ਤੈਅ ਕਰੇਗਾ)/u.test(pa), `Punjabi feminine future agreement failed: ${pa}`);
  assert(!/(?:ਦੋਵੇਂ|ਉਹ)[^।?]{0,100}(?:ਮਿਲਣਗੇ|ਹੋਣਗੇ)/u.test(pa), `Punjabi feminine plural future agreement failed: ${pa}`);
  assert(!/ਪਹਿਲੇ ਦੀ ਰਫ਼ਤਾਰ|ਦੂਜੇ ਦੀ ਰਫ਼ਤਾਰ|ਦੂਜੇ ਦੀ (?=\d)|ਦੂਜੇ ਨੂੰ/u.test(pa), `Punjabi feminine pronoun/adjective agreement failed: ${pa}`);
  punjabiGenderChecks += 1;
  futureAgreementChecks += 1;
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_NATIVE_GRAMMAR_FINAL",
  feminineNativeRows: feminineRows,
  hindiGenderChecks,
  punjabiGenderChecks,
  pluralAgreementChecks,
  unicodeBoundaryChecks,
  futureAgreementChecks,
  unsafeGenericNounReplacement: false,
}, null, 2));
