import { describe, expect, it } from "vitest";
import { listQuestionStudioPackages } from "../engine-registry";
import {
  ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  ECO_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  knowledgeV1Eco001QuestionStudioAdapterV1,
} from "./knowledge-v1-eco001-adapter-v1";

describe("ECO-001 Question Studio multilingual review-only registration", () => {
  it("registers one enabled 23-CP trilingual Economy package", () => {
    const pkg = ECO_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
    expect(pkg.packageId).toBe("ECO-001");
    expect(pkg.engineId).toBe("knowledge-v1");
    expect(pkg.enabled).toBe(true);
    expect(pkg.cpIds).toHaveLength(23);
    expect(new Set(pkg.cpIds).size).toBe(23);
    expect(pkg.supportedLanguages).toEqual(["en", "hi", "pa"]);
    expect(pkg.metadata?.questionsPerLanguage).toBe(1008);
    expect(pkg.metadata?.multilingualSurfaceCount).toBe(3024);
    expect(pkg.metadata?.multilingualContentFrozen).toBe(true);
  });

  it("keeps the registration inside the standard review-only safety boundary", () => {
    const pkg = ECO_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
    expect(pkg.lifecycleStage).toBe("REVIEW_ONLY");
    expect(pkg.questionBankWritable).toBe(false);
    expect(pkg.testEligible).toBe(false);
    expect(pkg.mockTestEligible).toBe(false);
    expect(pkg.publiclyPublishable).toBe(false);
    expect(pkg.automaticStudentPublication).toBe(false);
    expect(pkg.productionReleaseAuthorized).toBe(false);
  });

  it.each(["en", "hi", "pa"] as const)(
    "generates deterministic %s review questions without repeats",
    async (language) => {
      const request = {
        packageId: ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        language,
        difficulty: "Mixed" as const,
        count: 20,
        seed: "eco001-runtime-contract",
      };
      const first = await knowledgeV1Eco001QuestionStudioAdapterV1.generate(request);
      const second = await knowledgeV1Eco001QuestionStudioAdapterV1.generate(request);
      expect(first.questions).toHaveLength(20);
      expect(first.questions.map((q) => q.questionId)).toEqual(second.questions.map((q) => q.questionId));
      expect(new Set(first.questions.map((q) => q.questionId)).size).toBe(20);
      for (const question of first.questions as any[]) {
        expect(question.packageId).toBe("ECO-001");
        expect(question.language).toBe(language);
        expect(question.locale).toBe(language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN");
        expect(question.reviewOnly).toBe(true);
        expect(question.runtimeRegistered).toBe(true);
        expect(question.questionBankWritable).toBe(false);
        expect(question.testEligible).toBe(false);
      }
    },
  );

  it("preserves the same semantic draw across English, Hindi and Punjabi", async () => {
    const request = {
      packageId: "ECO-001",
      difficulty: "Mixed" as const,
      count: 30,
      seed: "eco001-cross-locale-draw",
    };
    const en = await knowledgeV1Eco001QuestionStudioAdapterV1.generate({ ...request, language: "en" });
    const hi = await knowledgeV1Eco001QuestionStudioAdapterV1.generate({ ...request, language: "hi" });
    const pa = await knowledgeV1Eco001QuestionStudioAdapterV1.generate({ ...request, language: "pa" });
    const sourceIds = (result: any) => result.questions.map((q: any) => q.sourceQuestionId);
    expect(sourceIds(hi)).toEqual(sourceIds(en));
    expect(sourceIds(pa)).toEqual(sourceIds(en));
  });

  it("supports CP selectors in native languages", async () => {
    const result = await knowledgeV1Eco001QuestionStudioAdapterV1.generate({
      packageId: "ECO-001",
      patternId: "ECO-CP-004",
      language: "hi",
      count: 5,
      seed: "eco001-cp004",
    });
    expect(result.questions).toHaveLength(5);
    expect(new Set((result.questions as any[]).map((q) => q.cpId))).toEqual(new Set(["ECO-CP-004"]));
    expect((result.questions as any[]).every((q) => q.locale === "hi-IN")).toBe(true);
  });

  it("supports difficulty filtering in Punjabi", async () => {
    const result = await knowledgeV1Eco001QuestionStudioAdapterV1.generate({
      packageId: "ECO-001",
      language: "pa",
      difficulty: "Hard",
      count: 10,
      seed: "eco001-hard",
    });
    expect(result.questions).toHaveLength(10);
    expect(new Set((result.questions as any[]).map((q) => q.difficulty))).toEqual(new Set(["Hard"]));
    expect((result.questions as any[]).every((q) => q.locale === "pa-IN")).toBe(true);
  });

  it("rejects unknown selectors", async () => {
    await expect(
      knowledgeV1Eco001QuestionStudioAdapterV1.generate({ packageId: "ECO-001", patternId: "ECO-CP-999" }),
    ).rejects.toThrow(/Unknown ECO-001 selector/i);
  });

  it("is exposed exactly once by the composite Question Studio registry", () => {
    const matches = listQuestionStudioPackages().filter((pkg) => pkg.packageId === "ECO-001");
    expect(matches).toHaveLength(1);
  });
});
