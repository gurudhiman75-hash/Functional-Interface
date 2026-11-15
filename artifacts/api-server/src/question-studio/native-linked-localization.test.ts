import assert from "node:assert/strict";
import test from "node:test";
import {
  assertNativeEnglishSourceParity,
  assertNativeLocalizedAnswerParity,
  nativeLocalizedQuestion,
} from "./native-linked-localization";

import { runMal001QuestionStudioPipeline } from "../quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-adapter";

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

test("registered MAL-001 chapter reuses its existing tri-language generator through the universal registry", async () => {
  const identity={
    packageId:"MAL-001",
    canonicalProblemId:"MAL-CP-001",
    questionLanguageId:"MAL-QL-005",
    seed:"mal-001-multilingual:MAL-QL-005:0",
  };
  const en=await nativeLocalizedQuestion(identity,"en");
  for(const language of ["hi","pa"] as const) {
    const localized=await nativeLocalizedQuestion(identity,language);
    assertNativeLocalizedAnswerParity(en,localized);
    assert.notEqual(localized.stem,en.stem);
  }
});

test("MAL-001 replays an exact saved batch child seed without adding another suffix", async () => {
  const identity = {
    packageId: "MAL-001",
    canonicalProblemId: "MAL-CP-002",
    questionLanguageId: "MAL-QL-021",
    difficulty: "Medium",
    // Shape of a real version-1 persisted standard batch child (the terminal
    // :CP:index segment is already part of the *question* seed).
    seed: "qs-async:example:SSC_CGL_T1:chapter-mix:Medium:slot:1:MAL-CP-002:1",
  };
  const direct = runMal001QuestionStudioPipeline("MAL-CP-002", {
    seed:identity.seed, questionLanguageId:"MAL-QL-021", difficulty:"Medium", language:"en",
  });
  const persistedSource = {
    stem:direct.stem,
    options:[...direct.options],
    explanation:(direct.explanation.lines ?? []).join("\n\n"),
    correctIndex:direct.correctIndex,
  };
  const reconstructed = await nativeLocalizedQuestion(identity, "en");
  assert.doesNotThrow(() => assertNativeEnglishSourceParity(persistedSource, reconstructed));
  for (const language of ["hi", "pa"] as const) {
    const variant = await nativeLocalizedQuestion(identity, language);
    assertNativeLocalizedAnswerParity(persistedSource, variant);
    assert.notEqual(variant.stem, persistedSource.stem);
  }
});
