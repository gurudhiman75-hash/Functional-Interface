import { describe, expect, it } from "vitest";
import { listQuestionStudioPackages } from "../engine-registry";
import {
  POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1,
  knowledgeV1Pol001QuestionStudioAdapterV1,
} from "./knowledge-v1-pol001-adapter-v1";

describe("POL-001 Question Studio review-only registration", () => {
  it("registers one enabled 27-CP Polity package", () => {
    const pkg = POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
    expect(pkg.packageId).toBe("POL-001");
    expect(pkg.engineId).toBe("knowledge-v1");
    expect(pkg.enabled).toBe(true);
    expect(pkg.cpIds).toHaveLength(27);
    expect(new Set(pkg.cpIds).size).toBe(27);
    expect(pkg.supportedLanguages).toEqual(["en"]);
  });

  it("keeps the standard review-only safety boundary", () => {
    const pkg = POL_001_STANDARD_REVIEW_ONLY_PACKAGE_V1;
    expect(pkg.lifecycleStage).toBe("REVIEW_ONLY");
    expect(pkg.questionBankWritable).toBe(false);
    expect(pkg.testEligible).toBe(false);
    expect(pkg.mockTestEligible).toBe(false);
    expect(pkg.publiclyPublishable).toBe(false);
    expect(pkg.automaticStudentPublication).toBe(false);
    expect(pkg.productionReleaseAuthorized).toBe(false);
  });

  it("generates deterministic mixed English review questions without repeats", async () => {
    const request = {
      packageId: POL_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      language: "en" as const,
      difficulty: "Mixed" as const,
      count: 30,
      seed: "pol001-runtime-contract",
    };
    const first = await knowledgeV1Pol001QuestionStudioAdapterV1.generate(request);
    const second = await knowledgeV1Pol001QuestionStudioAdapterV1.generate(request);
    expect(first.questions).toHaveLength(30);
    expect(first.questions.map((q) => q.questionId)).toEqual(second.questions.map((q) => q.questionId));
    expect(new Set(first.questions.map((q) => q.questionId)).size).toBe(30);
    for (const question of first.questions as any[]) {
      expect(question.packageId).toBe("POL-001");
      expect(question.reviewOnly).toBe(true);
      expect(question.runtimeRegistered).toBe(true);
      expect(question.questionBankWritable).toBe(false);
      expect(question.testEligible).toBe(false);
    }
  });

  it("supports CP selectors", async () => {
    const result = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
      packageId: "POL-001",
      patternId: "POL-CP-027",
      count: 5,
      seed: "pol001-cp027",
    });
    expect(result.questions).toHaveLength(5);
    expect(new Set((result.questions as any[]).map((q) => q.cpId))).toEqual(new Set(["POL-CP-027"]));
  });

  it("supports QL selectors and difficulty filtering", async () => {
    const ql = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
      packageId: "POL-001",
      patternId: "POL-027-QL-020",
      count: 4,
      seed: "pol001-cp027-ql020",
    });
    expect(ql.questions).toHaveLength(4);
    expect(new Set((ql.questions as any[]).map((q) => q.qlId))).toEqual(new Set(["POL-027-QL-020"]));

    const hard = await knowledgeV1Pol001QuestionStudioAdapterV1.generate({
      packageId: "POL-001",
      difficulty: "Hard",
      count: 10,
      seed: "pol001-hard",
    });
    expect(hard.questions).toHaveLength(10);
    expect(new Set((hard.questions as any[]).map((q) => q.difficulty))).toEqual(new Set(["Hard"]));
  });

  it("rejects unsupported language and unknown selectors", async () => {
    await expect(
      knowledgeV1Pol001QuestionStudioAdapterV1.generate({ packageId: "POL-001", language: "hi" }),
    ).rejects.toThrow(/English only/i);
    await expect(
      knowledgeV1Pol001QuestionStudioAdapterV1.generate({ packageId: "POL-001", patternId: "POL-CP-999" }),
    ).rejects.toThrow(/Unknown POL-001 selector/i);
  });

  it("is exposed exactly once by the composite Question Studio registry", () => {
    const matches = listQuestionStudioPackages().filter((pkg) => pkg.packageId === "POL-001");
    expect(matches).toHaveLength(1);
  });
});
