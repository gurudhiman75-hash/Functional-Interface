import assert from "node:assert/strict";
import test from "node:test";
import {
  assertNativeEnglishSourceParity,
  assertNativeLocalizedAnswerParity,
  nativeLocalizedQuestion,
} from "./native-linked-localization";

const canonical = {
  stem: "What is the average of five numbers?",
  explanation: "Add the numbers and divide by five.",
  options: ["15", "16", "17", "18"],
  correctIndex: 2,
};

test("same-seed native identity rejects unknown chapters rather than translating with AI", async () => {
  await assert.rejects(
    nativeLocalizedQuestion({
      packageId: "UNSUPPORTED-001",
      canonicalProblemId: "UNSUPPORTED-CP-001",
      questionLanguageId: "UNSUPPORTED-QL-001",
      seed: "stable",
    }, "hi"),
    /NATIVE_LOCALIZATION_UNSUPPORTED_LANGUAGE_OR_PACKAGE/,
  );
  await assert.rejects(
    nativeLocalizedQuestion({
      packageId: "AVG-001",
      canonicalProblemId: "AVG-CP-001",
      questionLanguageId: "AVG-QL-001",
    }, "hi"),
    /NATIVE_LOCALIZATION_SOURCE_IDENTITY_MISSING/,
  );
});

test("native English regeneration requires exact source parity", () => {
  assert.doesNotThrow(() => assertNativeEnglishSourceParity(canonical, {...canonical}));
  for (const changed of [
    {...canonical,stem:"A different stem"},
    {...canonical,explanation:"Different explanation"},
    {...canonical,options:[...canonical.options].reverse()},
    {...canonical,correctIndex:1},
  ]) assert.throws(() => assertNativeEnglishSourceParity(canonical,changed),/SOURCE_PARITY_FAILED/);
});

test("native localizations preserve answer index and option structure", () => {
  const localized={...canonical,stem:"पाँच संख्याओं का औसत क्या है?",explanation:"संख्याओं को जोड़ें और पाँच से भाग दें।"};
  assert.doesNotThrow(() => assertNativeLocalizedAnswerParity(canonical,localized));
  for(const changed of [
    {...localized,correctIndex:1},
    {...localized,options:localized.options.slice(0,3)},
    {...localized,options:["15","15","17","18"]},
    {...localized,stem:""},
    {...localized,explanation:""},
  ]) assert.throws(()=>assertNativeLocalizedAnswerParity(canonical,changed),/ANSWER_PARITY_FAILED/);
});

test("existing AVG-001 localized output uses an explicit permanent QL and same question seed", async () => {
  const source = {
    packageId:"AVG-001",
    canonicalProblemId:"AVG-CP-004",
    questionLanguageId:"AVG-QL-255",
    seed:"native-linked-parity:AVG-QL-255:v1",
  };
  const english=await nativeLocalizedQuestion(source,"en");
  for(const language of ["hi","pa"] as const) {
    const translated=await nativeLocalizedQuestion(source,language);
    assertNativeLocalizedAnswerParity(english,translated);
    assert.notEqual(translated.stem,english.stem);
  }
});

test("existing INT-001 localized output uses the same permanent QL and exact seed", async () => {
  const source = {
    packageId: "INT-001",
    canonicalProblemId: "INT-CP-001",
    questionLanguageId: "INT-QL-012:en",
    seed: "native-linked-parity:INT-QL-012:v1",
  };
  const english = await nativeLocalizedQuestion(source, "en");
  for (const language of ["hi", "pa"] as const) {
    const translated = await nativeLocalizedQuestion(source, language);
    assertNativeLocalizedAnswerParity(english, translated);
    assert.notEqual(translated.stem, english.stem);
  }
});
