import assert from "node:assert/strict";
import test from "node:test";
import {
  assertNativeEnglishSourceParity,
  assertNativeLocalizedAnswerParity,
  nativeLocalizedQuestion,
} from "./native-linked-localization";

import { evaluateTranslationQuality } from "../lib/admin-translation-operations";
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

test("released MAL-001 native generated answers pass editorial quality gate for one-click approval", async () => {
  const identity={
    packageId:"MAL-001",canonicalProblemId:"MAL-CP-002",questionLanguageId:"MAL-QL-021",
    difficulty:"Medium",seed:"qs-async:regression:SSC_CGL_T1:chapter-mix:Medium:slot:1:MAL-CP-002:0",
  };
  const source=await nativeLocalizedQuestion(identity,"en");
  const asOptions=(options:string[])=>options.map((text,index)=>({
    key:String.fromCharCode(65+index),text,sortOrder:index+1,
  }));
  for(const language of ["hi","pa"] as const){
    const target=await nativeLocalizedQuestion(identity,language);
    assertNativeLocalizedAnswerParity(source,target);
    const quality=evaluateTranslationQuality({
      source:{stem:source.stem,explanation:source.explanation,options:asOptions(source.options)},
      target:{stem:target.stem,explanation:target.explanation,options:asOptions(target.options)},
      languageCode:language,
    });
    assert.equal(quality.approvable,true,language+" generated localization rejected: "+JSON.stringify(quality.issues));
  }
});

test("SAP batch snapshots replay the selected source seed and save both languages", async () => {
  const { generateQuestion } = await import("../quant-v4/question-studio-generation-engine");
  const { prepareNativeReviewBatch } = await import("./persisted-native-review");
  const batch = await generateQuestion({
    packageId: "SAP", language: "en", count: 4,
    seed: "sap-native-review-regression", difficulty: "Medium",
  });
  const snapshots = await prepareNativeReviewBatch(batch.questions as Record<string, unknown>[]);
  assert.equal(snapshots.length, 4);
  for (const snapshot of snapshots) {
    assert.deepEqual(snapshot?.variants.map(({ language, status }) => [language, status]),
      [["hi", "verified"], ["pa", "verified"]]);
  }
});

test("grouped review batches preserve the generated English identity across all three languages", async () => {
  const { executeUniversalStudioCompute } = await import("./universal-executor");
  const { readPersistedNativeSnapshot, nativeSourceQuestion } = await import("./persisted-native-review-format");
  const { canonicalEnqueueRequest } = await import("./async-enqueue-contract");
  const { computeInputFromQueuedSnapshot } = await import("./async-task-receiver-snapshot");
  const cases = [
    { packageId: "TRG-001", engineId: "quant-v4", difficulty: "Mixed" },
    { packageId: "DIR-001", engineId: "reasoning-v1", difficulty: "Medium" },
    { packageId: "CAE-001", engineId: "reasoning-v1", difficulty: "Medium" },
    { packageId: "CAL-001", engineId: "reasoning-v1", difficulty: "Medium" },
    { packageId: "OPS-001", engineId: "reasoning-v1", difficulty: "Mixed" },
  ] as const;
  for (const input of cases) {
    const count = 6;
    const queued = canonicalEnqueueRequest({
      request: { ...input, count, language: "en", nativeGroupedReview: true,
        exam: "SSC_CGL_T1", seed: "chapter-parity-20261127" },
      count,
      selectedCpIds: [],
    });
    const workerInput = computeInputFromQueuedSnapshot({ ...queued, queueVersion: 1 });
    assert.equal(workerInput.request.nativeGroupedReview, true);
    const batch = await executeUniversalStudioCompute(workerInput);
    assert.equal(batch.questions.length, count);
    for (const question of batch.questions) {
      const label = input.packageId + " " + String(question.questionId);
      const snapshot = readPersistedNativeSnapshot(question);
      assert.deepEqual(snapshot?.variants.map(v => [v.language, v.status]),
        [["hi", "verified"], ["pa", "verified"]], label);
      assertNativeEnglishSourceParity(nativeSourceQuestion(question), await nativeLocalizedQuestion(question, "en"));
      for (const variant of snapshot!.variants) {
        assert.equal(variant.status, "verified", label);
        assertNativeLocalizedAnswerParity(nativeSourceQuestion(question), variant);
        assert.deepEqual(await nativeLocalizedQuestion(question, variant.language), {
          stem: variant.stem, explanation: variant.explanation, options: variant.options, correctIndex: variant.correctIndex,
        }, label);
      }
    }
  }
});

test("CAE-001 checkpoints support grouped Mixed while unsupported explicit difficulty stays actionable", async () => {
  const { executeUniversalStudioCompute } = await import("./universal-executor");
  const { readPersistedNativeSnapshot } = await import("./persisted-native-review-format");
  const request = {
    packageId: "CAE-001", engineId: "reasoning-v1", count: 2,
    language: "en", nativeGroupedReview: true, seed: "cae-scoped-difficulty",
  } as const;
  const selectedCpIds = ["CAE-CP-001", "CAE-CP-002"];
  const batch = await executeUniversalStudioCompute({
    request: { ...request, difficulty: "Mixed" }, count: 2, selectedCpIds,
  });
  assert.deepEqual(batch.questions.map(q => q.cpId), selectedCpIds);
  for (const question of batch.questions) {
    assert.deepEqual(readPersistedNativeSnapshot(question)?.variants.map(v => v.status), ["verified", "verified"]);
  }
  await assert.rejects(
    executeUniversalStudioCompute({ request: { ...request, difficulty: "Medium" }, count: 2, selectedCpIds }),
    { code: "QUESTION_STUDIO_CHECKPOINT_DIFFICULTY_UNAVAILABLE", statusCode: 422 },
  );
});


test("scoped Mixed batches respect Trigonometry difficulty and replay audited OPS templates", async () => {
  const { executeUniversalStudioCompute } = await import("./universal-executor");
  const { readPersistedNativeSnapshot } = await import("./persisted-native-review-format");
  for (const [packageId, engineId, selectedCpIds] of [
    ["TRG-001", "quant-v4", ["TRG-CP-001", "TRG-CP-002", "TRG-CP-003", "TRG-CP-004", "TRG-CP-005", "TRG-CP-006"]],
    ["OPS-001", "reasoning-v1", ["OPS-CP-005"]],
  ] as const) {
    for (const cpId of selectedCpIds) {
      const batch = await executeUniversalStudioCompute({
        request: { packageId, engineId, difficulty: "Mixed", count: 2, language: "en",
          nativeGroupedReview: true, exam: "SSC_CGL_T1", seed: "chapter-parity-20261127" },
        count: 2,
        selectedCpIds: [cpId],
      });
      assert.equal(batch.questions.length, 2, cpId);
      for (const question of batch.questions) {
        assert.equal(question.canonicalProblemId, cpId);
        assert.deepEqual(readPersistedNativeSnapshot(question)?.variants.map(v => v.status),
          ["verified", "verified"], cpId + " " + String(question.questionId));
      }
    }
  }
});
