import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY } from "./cp015-final-editorial-quality.ts";

type Language = "en" | "hi" | "pa";
type Question = Readonly<Record<string, any>>;
type ReviewItem = Readonly<{
  language: Language;
  qlId: string;
  reviewCell: string;
  question: Question;
}>;
type Payload = Readonly<{
  packageId: string;
  checkpointId: string;
  totalQuestions: number;
  supportedReviewLanguages: readonly Language[];
  items: readonly ReviewItem[];
}>;

const LANGUAGES = Object.freeze(["en", "hi", "pa"] as const);
const REVIEW_JSON = resolve(process.cwd(), "dist", "arg-001-cp015-human-review", "arg-cp015-human-review.json");

const FORBIDDEN_EXPLANATION_FRAGMENTS = Object.freeze([
  "It draws a broad conclusion without enough evidence and does not examine the relevant limits, alternatives or safeguards.",
  "It treats a risk signal or limited experience as sufficient proof and underweights evidence, recovery and proportionate safeguards.",
  "The technology or delivery format alone does not establish better outcomes, fairness or necessity in the stated context.",
  "It treats an implementation assumption as decisive without considering assisted access, fallback routes or actual capacity.",
  "It relies on an unsupported stereotype about people instead of a material service or policy reason.",
  "The stated conclusion goes beyond the mechanism or evidence given in this particular argument.",
  "यह तर्क पर्याप्त साक्ष्य के बिना एक व्यापक निष्कर्ष निकालता है और प्रासंगिक सीमाओं या विकल्पों की जाँच नहीं करता।",
  "यह तर्क जोखिम-संकेत या सीमित अनुभव को पर्याप्त प्रमाण मानकर साक्ष्य और अनुपातिक सुरक्षा की जरूरत को कम आँकता है।",
  "केवल तकनीक या माध्यम का आधुनिक अथवा डिजिटल होना बेहतर परिणाम, निष्पक्षता या आवश्यकता सिद्ध नहीं करता।",
  "यह सहायता, वैकल्पिक पहुँच या वास्तविक क्षमता पर विचार किए बिना एक कार्यान्वयन धारणा को निर्णायक मान लेता है।",
  "यह वास्तविक सेवा या नीति-कारण की जगह लोगों के बारे में असिद्ध रूढ़ धारणा पर निर्भर है।",
  "इस तर्क का निष्कर्ष दिए गए कारण या तंत्र से अधिक व्यापक है और उसी संदर्भ में पर्याप्त रूप से समर्थित नहीं है।",
  "ਇਹ ਦਲੀਲ ਕਾਫ਼ੀ ਸਬੂਤ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ ਅਤੇ ਸੰਬੰਧਿਤ ਹੱਦਾਂ ਜਾਂ ਵਿਕਲਪਾਂ ਦੀ ਜਾਂਚ ਨਹੀਂ ਕਰਦੀ।",
  "ਇਹ ਦਲੀਲ ਜੋਖਮ-ਸੰਕੇਤ ਜਾਂ ਸੀਮਿਤ ਤਜਰਬੇ ਨੂੰ ਕਾਫ਼ੀ ਸਬੂਤ ਮੰਨ ਕੇ ਸਬੂਤ ਅਤੇ ਅਨੁਪਾਤਿਕ ਸੁਰੱਖਿਆ ਦੀ ਲੋੜ ਘੱਟ ਅੰਕਦੀ ਹੈ।",
  "ਕੇਵਲ ਤਕਨਾਲੋਜੀ ਜਾਂ ਮਾਧਿਅਮ ਦਾ ਆਧੁਨਿਕ ਜਾਂ ਡਿਜ਼ਿਟਲ ਹੋਣਾ ਬਿਹਤਰ ਨਤੀਜਾ, ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
  "ਇਹ ਸਹਾਇਤਾ, ਵਿਕਲਪੀ ਪਹੁੰਚ ਜਾਂ ਅਸਲ ਸਮਰੱਥਾ ਵੇਖੇ ਬਿਨਾਂ ਇੱਕ ਲਾਗੂ ਕਰਨ ਵਾਲੀ ਧਾਰਨਾ ਨੂੰ ਫੈਸਲਾਕੁੰਨ ਮੰਨ ਲੈਂਦੀ ਹੈ।",
  "ਇਹ ਅਸਲ ਸੇਵਾ ਜਾਂ ਨੀਤੀ-ਕਾਰਨ ਦੀ ਥਾਂ ਲੋਕਾਂ ਬਾਰੇ ਬਿਨਾਂ ਸਬੂਤ ਦੀ ਧਾਰਨਾ ਉੱਤੇ ਨਿਰਭਰ ਹੈ।",
  "ਇਹ ਦਲੀਲ ਸਹਿਮਤੀ, ਮਕਸਦ ਅਤੇ ਸੁਰੱਖਿਆ ਉਪਾਅ ਵਰਗੀਆਂ ਸੰਬੰਧਿਤ ਸ਼ਰਤਾਂ ਨੂੰ ਢੰਗ ਨਾਲ ਤੋਲਣ ਤੋਂ ਬਿਨਾਂ ਵਿਆਪਕ ਨਤੀਜਾ ਕੱਢਦੀ ਹੈ।",
  "ਇਸ ਦਲੀਲ ਦਾ ਨਤੀਜਾ ਦਿੱਤੇ ਕਾਰਨ ਜਾਂ ਤਰੀਕੇ ਨਾਲੋਂ ਵੱਧ ਵਿਆਪਕ ਹੈ ਅਤੇ ਇਸੇ ਸੰਦਰਭ ਵਿੱਚ ਕਾਫ਼ੀ ਤੌਰ 'ਤੇ ਸਮਰਥਿਤ ਨਹੀਂ ਹੈ।",
]);

function key(value: unknown): string {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

function argumentKey(value: unknown): string {
  return key(value).toLocaleLowerCase("en-IN");
}

function duplicates(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const repeated = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

const payload = JSON.parse(readFileSync(REVIEW_JSON, "utf8")) as Payload;
assert.equal(payload.packageId, "ARG-001");
assert.equal(payload.checkpointId, "ARG-CP-015");
assert.equal(payload.totalQuestions, 216, "CP015 fixed human-review export must contain 216 questions.");
assert.deepEqual(payload.supportedReviewLanguages, LANGUAGES, "CP015 fixed human-review export language set drifted.");
assert.equal(payload.items.length, 216, "CP015 fixed human-review payload item count drifted.");

const metrics: Record<string, unknown> = {};

for (const language of LANGUAGES) {
  const items = payload.items.filter((item) => item.language === language);
  assert.equal(items.length, 72, `${language}: fixed human-review export must contain 72 questions.`);

  const statements = items.map((item) => key(item.question.statement));
  const explanations = items.map((item) => key(item.question.explanation));
  const repeatedStatements = duplicates(statements);
  const repeatedExplanations = duplicates(explanations);

  assert.equal(
    repeatedStatements.length,
    0,
    `${language}: fixed human-review export contains cross-QL repeated statements:\n${repeatedStatements.join("\n")}`,
  );
  assert.equal(
    repeatedExplanations.length,
    0,
    `${language}: fixed human-review export contains cross-QL repeated explanations:\n${repeatedExplanations.join("\n\n")}`,
  );

  let finalizerActivations = 0;
  for (const item of items) {
    const question = item.question;
    const argumentsList = Array.isArray(question.arguments) ? question.arguments as readonly unknown[] : [];
    const argumentKeys = argumentsList.map(argumentKey);
    assert.equal(
      new Set(argumentKeys).size,
      argumentKeys.length,
      `${question.questionId}: fixed human-review item contains duplicate argument text.`,
    );

    const explanation = key(question.explanation);
    for (const forbidden of FORBIDDEN_EXPLANATION_FRAGMENTS) {
      assert.ok(
        !explanation.includes(forbidden),
        `${question.questionId}: fixed human-review explanation contains residual boilerplate: ${forbidden}`,
      );
    }

    if (question.finalEditorialQualityAuthority === ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY) {
      finalizerActivations += 1;
    }
  }

  assert.ok(finalizerActivations >= 5, `${language}: final editorial authority activated too rarely in fixed review export: ${finalizerActivations}.`);
  metrics[language] = Object.freeze({
    questions: items.length,
    uniqueStatements: new Set(statements).size,
    uniqueExplanations: new Set(explanations).size,
    finalizerActivations,
  });
}

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_FIXED_HUMAN_REVIEW_GLOBAL_UNIQUENESS",
  totalQuestions: payload.items.length,
  perLanguage: metrics,
  duplicateArgumentsInsideQuestion: 0,
  residualBoilerplateExplanations: 0,
  authority: ARG_CP015_FINAL_EDITORIAL_QUALITY_AUTHORITY,
}, null, 2));
