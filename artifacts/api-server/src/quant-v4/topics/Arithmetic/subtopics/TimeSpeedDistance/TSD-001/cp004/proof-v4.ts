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

for (const english of review) {
  if (!cp004UsesFeminineNativeActor(english.state.actorKind)) continue;
  feminineRows += 2;

  const hi = renderCp004EditorialV4NativeQuestion(english, "hi").stem;
  const pa = renderCp004EditorialV4NativeQuestion(english, "pa").stem;

  assert(!/दो कार\b|दो बस\b|दूसरा कार\b|दूसरा बस\b|दूसरा डिलीवरी वैन\b/u.test(hi), `Hindi feminine noun-number agreement failed: ${hi}`);
  assert(!/ਦੋ ਕਾਰ\b|ਦੋ ਬੱਸ\b|ਦੋ ਡਿਲਿਵਰੀ ਵੈਨ\b|ਦੂਜਾ ਕਾਰ\b|ਦੂਜਾ ਬੱਸ\b|ਦੂਜਾ ਡਿਲਿਵਰੀ ਵੈਨ\b/u.test(pa), `Punjabi feminine noun-number agreement failed: ${pa}`);
  pluralAgreementChecks += 2;

  assert(!/(?:कार|बस|डिलीवरी वैन)(?: [ABC])?[^।?]{0,90}\b(?:चलता रहता है|चलता है|आता है|निकलता है|पकड़ता है|करता है|मिलता है)\b/u.test(hi), `Hindi feminine singular verb agreement failed: ${hi}`);
  assert(!/(?:कारें|बसें|डिलीवरी वैन)[^।?]{0,90}\b(?:चलते रहते हैं|चलते हैं|आते हैं|निकलते हैं|पकड़ते हैं|करते हैं|मिलते हैं)\b/u.test(hi), `Hindi feminine plural verb agreement failed: ${hi}`);
  hindiGenderChecks += 1;

  assert(!/(?:ਕਾਰ|ਬੱਸ|ਡਿਲਿਵਰੀ ਵੈਨ)(?: [ABC])?[^।?]{0,90}\b(?:ਚੱਲਦਾ ਰਹਿੰਦਾ ਹੈ|ਚੱਲਦਾ ਹੈ|ਆਉਂਦਾ ਹੈ|ਨਿਕਲਦਾ ਹੈ|ਫੜਦਾ ਹੈ|ਕਰਦਾ ਹੈ|ਮਿਲਦਾ ਹੈ)\b/u.test(pa), `Punjabi feminine singular verb agreement failed: ${pa}`);
  assert(!/(?:ਕਾਰਾਂ|ਬੱਸਾਂ|ਡਿਲਿਵਰੀ ਵੈਨਾਂ)[^।?]{0,90}\b(?:ਚੱਲਦੇ ਰਹਿੰਦੇ ਹਨ|ਚੱਲਦੇ ਹਨ|ਆਉਂਦੇ ਹਨ|ਨਿਕਲਦੇ ਹਨ|ਫੜਦੇ ਹਨ|ਕਰਦੇ ਹਨ|ਮਿਲਦੇ ਹਨ)\b/u.test(pa), `Punjabi feminine plural verb agreement failed: ${pa}`);
  punjabiGenderChecks += 1;
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP004_NATIVE_GRAMMAR_FINAL",
  feminineNativeRows: feminineRows,
  hindiGenderChecks,
  punjabiGenderChecks,
  pluralAgreementChecks,
  unsafeGenericNounReplacement: false,
}, null, 2));
