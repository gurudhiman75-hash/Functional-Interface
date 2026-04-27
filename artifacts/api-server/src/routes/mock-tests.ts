import { randomUUID } from "crypto";
import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import {
  mockTests,
  mockTestTemplates,
  mockTestQuestions,
  mockTestSections,
  type MockDifficulty,
  type MockSection,
} from "@workspace/db";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";
import { generateQuestions, type GeneratedQuestion } from "../lib/generator.service";

type MockTestSectionInput = {
  section: MockSection;
  topic: string;
  subtopic: string;
  difficulty: MockDifficulty;
  patternIds: string[];
  questionCount: number;
};

type MockTestSectionResult = MockTestSectionInput & {
  id: string;
  orderIndex: number;
  questions: GeneratedQuestion[];
};

type MockTestPayload = {
  id: string;
  name: string;
  sections: MockTestSectionResult[];
  createdAt: string;
  totalQuestions: number;
};

type MockTestTemplatePayload = {
  id: string;
  name: string;
  sections: MockTestSectionInput[];
  createdAt: string;
};

const router: IRouter = Router();

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function autoMockTestName(source?: string) {
  const stamp = new Date().toISOString().replace("T", " ").slice(0, 16);
  return source?.trim() ? source.trim() : `Mock Test ${stamp}`;
}

function normalizeSectionInput(section: MockTestSectionInput): MockTestSectionInput {
  return {
    ...section,
    topic: section.topic.trim(),
    subtopic: section.subtopic.trim(),
    patternIds: Array.isArray(section.patternIds) ? section.patternIds.filter(Boolean) : [],
    questionCount: Math.max(1, Math.floor(section.questionCount)),
  };
}

async function loadTemplateSections(templateId: string): Promise<MockTestSectionInput[]> {
  const [template] = await db
    .select({ sections: mockTestTemplates.sections })
    .from(mockTestTemplates)
    .where(eq(mockTestTemplates.id, templateId))
    .limit(1);
  if (!template) {
    throw new Error("Template not found");
  }
  const rawSections = Array.isArray(template.sections) ? template.sections : [];
  return rawSections.map((section) => normalizeSectionInput(section as MockTestSectionInput));
}

async function ensureGeneratedQuestions(section: MockTestSectionInput, usedKeys: Set<string>) {
  const collected: GeneratedQuestion[] = [];
  let safety = 0;

  while (collected.length < section.questionCount && safety < section.questionCount * 5) {
    const remaining = section.questionCount - collected.length;
    const result = await generateQuestions({
      section: section.section,
      topic: section.topic,
      subtopic: section.subtopic,
      difficulty: section.difficulty,
      patternIds: section.patternIds,
      count: remaining,
      persist: true,
    });

    if (result.questions.length === 0) {
      break;
    }

    let progress = false;
    for (const question of result.questions) {
      const key = normalizeText(question.questionText);
      if (usedKeys.has(key)) {
        continue;
      }
      if (question.id == null) {
        throw new Error("Generated question was not persisted");
      }
      usedKeys.add(key);
      collected.push(question);
      progress = true;
      if (collected.length >= section.questionCount) {
        break;
      }
    }

    if (!progress) {
      break;
    }
    safety += 1;
  }

  if (collected.length === 0) {
    throw new Error(`No questions generated for ${section.section} (${section.topic})`);
  }

  if (collected.length < section.questionCount) {
    throw new Error(
      `Only generated ${collected.length}/${section.questionCount} questions for ${section.section} (${section.topic})`,
    );
  }

  return collected;
}

export async function createMockTestFn(input: {
  testName?: string;
  templateId?: string;
  sections?: MockTestSectionInput[];
}): Promise<MockTestPayload> {
  const sectionsInput = Array.isArray(input.sections) ? input.sections : [];
  const sections = sectionsInput.length > 0
    ? sectionsInput.map(normalizeSectionInput)
    : input.templateId
      ? await loadTemplateSections(input.templateId)
      : [];
  if (sections.length === 0) {
    throw new Error("At least one section is required");
  }

  const usedQuestionKeys = new Set<string>();
  const generatedSections: MockTestSectionResult[] = [];
  const createdAt = new Date();
  let totalQuestions = 0;
  const resolvedName = autoMockTestName(input.testName);

  const [mockTestRow] = await db
    .insert(mockTests)
    .values({
      id: randomUUID(),
      name: resolvedName,
      createdAt,
    })
    .returning({ id: mockTests.id, createdAt: mockTests.createdAt });

  for (let index = 0; index < sections.length; index += 1) {
    const section = sections[index];
    if (!section.section || !section.topic || !section.difficulty || !Number.isFinite(section.questionCount) || section.questionCount <= 0) {
      throw new Error("Each section requires section, topic, difficulty, and a positive question count");
    }

    const questions = await ensureGeneratedQuestions(section, usedQuestionKeys);
    const [sectionRow] = await db
      .insert(mockTestSections)
      .values({
        id: randomUUID(),
        mockTestId: mockTestRow.id,
        section: section.section,
        topic: section.topic.trim(),
        subtopic: section.subtopic.trim(),
        difficulty: section.difficulty,
        questionCount: section.questionCount,
        patternIds: section.patternIds,
        orderIndex: index,
      })
      .returning({ id: mockTestSections.id, orderIndex: mockTestSections.orderIndex });

    let orderIndex = totalQuestions;
    for (const question of questions) {
      if (question.id == null) {
        throw new Error("Generated question was not persisted");
      }
      await db.insert(mockTestQuestions).values({
        id: randomUUID(),
        mockTestId: mockTestRow.id,
        mockTestSectionId: sectionRow.id,
        questionId: question.id,
        section: section.section,
        orderIndex,
      });
      orderIndex += 1;
    }

    totalQuestions += questions.length;
    generatedSections.push({
      ...section,
      id: sectionRow.id,
      orderIndex: sectionRow.orderIndex,
      questions,
    });
  }

  return {
    id: mockTestRow.id,
    name: resolvedName,
    sections: generatedSections,
    createdAt: mockTestRow.createdAt.toISOString(),
    totalQuestions,
  };
}

export async function createMockTestTemplateFn(input: {
  name?: string;
  sections: MockTestSectionInput[];
}): Promise<MockTestTemplatePayload> {
  const sections = Array.isArray(input.sections) ? input.sections.map(normalizeSectionInput) : [];
  if (sections.length === 0) {
    throw new Error("At least one section is required");
  }
  const createdAt = new Date();
  const name = autoMockTestName(input.name).replace(/^Mock Test /, "Template ");
  const [row] = await db
    .insert(mockTestTemplates)
    .values({
      id: randomUUID(),
      name,
      sections,
      createdAt,
    })
    .returning({ id: mockTestTemplates.id, name: mockTestTemplates.name, createdAt: mockTestTemplates.createdAt });
  return {
    id: row.id,
    name: row.name,
    sections,
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/templates", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await assertAdmin(req.user.id);
    const rows = await db
      .select()
      .from(mockTestTemplates)
      .orderBy(mockTestTemplates.createdAt);
    return res.json({ templates: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load templates";
    return res.status(400).json({ error: message });
  }
});

router.post("/templates", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await assertAdmin(req.user.id);
    const { name, sections } = req.body as {
      name?: string;
      sections?: MockTestSectionInput[];
    };
    const saved = await createMockTestTemplateFn({
      name,
      sections: Array.isArray(sections) ? sections : [],
    });
    return res.status(201).json(saved);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save template";
    return res.status(400).json({ error: message });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await assertAdmin(req.user.id);

    const { testName, templateId, sections } = req.body as {
      testName?: string;
      templateId?: string;
      sections?: MockTestSectionInput[];
    };

    const saved = await createMockTestFn({
      testName,
      templateId,
      sections: Array.isArray(sections) ? sections : undefined,
    });

    return res.status(201).json(saved);
  } catch (error) {
    if (error instanceof Error && error.message === "forbidden") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const message = error instanceof Error ? error.message : "Could not create mock test";
    return res.status(400).json({ error: message });
  }
});

export default router;
