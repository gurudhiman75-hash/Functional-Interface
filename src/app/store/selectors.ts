import { useEffect, useState } from 'react';

import { getPublishedQuestions, type PublishedQuestion } from '@/features/question-bank/api';
import { usePrototypeStore } from './PrototypeStore';
import { dedupeAuditEntries } from './persistence';
import type {
  Question, Test, Package, Order, Coupon, Entitlement,
  Student, SupportRequest, NotificationCampaign, AuditEntry,
  StudentNote, SupportComment, GeneratedBatch, TestDraft, SavedView,
  QuestionVersion, SimilarityResult, GenerationRecipe, ReviewComment,
  Blueprint, TestVersion, TestQAComment,
} from './types';

let publishedQuestionCache: Question[] | null = null;
let publishedQuestionRequest: Promise<Question[]> | null = null;

function taxonomyName(question: PublishedQuestion, nodeType: string): string {
  return question.taxonomy.find((node) => node.nodeType === nodeType)?.name ?? '';
}

function toBuilderQuestion(question: PublishedQuestion): Question {
  const correct = question.options.find((option) => option.isCorrect);
  const publishedDate = question.publishedAt ?? new Date().toISOString();
  return {
    id: question.publicCode,
    stem: question.stem,
    options: question.options.map((option) => ({ id: option.key, text: option.text })),
    correctOption: correct?.key ?? '',
    explanation: question.explanation,
    subject: taxonomyName(question, 'subject'),
    chapter: taxonomyName(question, 'chapter'),
    topic: taxonomyName(question, 'topic'),
    subtopic: taxonomyName(question, 'subtopic'),
    difficulty: question.difficulty === 'Medium' ? 'Moderate' : question.difficulty,
    language: ['English'],
    exam: question.examCode,
    type: question.questionType,
    status: 'Approved',
    source: 'Published Question Bank',
    author: 'ExamTree',
    reviewer: 'Published',
    validationStatus: 'Passed',
    validationScore: 100,
    usageCount: 0,
    studentAccuracy: 0,
    avgResponseSec: 0,
    createdAt: publishedDate.slice(0, 10),
    updatedAt: publishedDate.slice(0, 10),
  };
}

async function loadPublishedQuestionBank(): Promise<Question[]> {
  if (publishedQuestionCache) return publishedQuestionCache;
  if (!publishedQuestionRequest) {
    publishedQuestionRequest = getPublishedQuestions()
      .then((result) => result.questions.map(toBuilderQuestion))
      .then((questions) => {
        publishedQuestionCache = questions;
        return questions;
      })
      .finally(() => {
        publishedQuestionRequest = null;
      });
  }
  return publishedQuestionRequest;
}

export function useQuestions(): Question[] {
  const [questions, setQuestions] = useState<Question[]>(publishedQuestionCache ?? []);

  useEffect(() => {
    let active = true;
    void loadPublishedQuestionBank()
      .then((next) => {
        if (active) setQuestions(next);
      })
      .catch((error) => {
        console.error('Unable to load published Question Bank for Test Builder', error);
        if (active) setQuestions([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return questions;
}

export function useTests(): Test[] {
  return usePrototypeStore().state.tests;
}

export function useTestById(id: string | undefined): Test | undefined {
  const tests = usePrototypeStore().state.tests;
  return id ? tests.find((t) => t.id === id) : undefined;
}

export function useQuestionById(id: string | undefined): Question | undefined {
  const questions = useQuestions();
  return id ? questions.find((q) => q.id === id) : undefined;
}

export function usePackages(): Package[] {
  return usePrototypeStore().state.packages;
}

export function useOrders(): Order[] {
  return usePrototypeStore().state.orders;
}

export function useOrderById(id: string | undefined): Order | undefined {
  const orders = usePrototypeStore().state.orders;
  return id ? orders.find((o) => o.id === id) : undefined;
}

export function useCoupons(): Coupon[] {
  return usePrototypeStore().state.coupons;
}

export function useEntitlements(): Entitlement[] {
  return usePrototypeStore().state.entitlements;
}

export function useEntitlementsByStudent(studentId: string): Entitlement[] {
  return usePrototypeStore().state.entitlements.filter((e) => e.studentId === studentId);
}

export function useStudents(): Student[] {
  return usePrototypeStore().state.students;
}

export function useStudentById(id: string | undefined): Student | undefined {
  const students = usePrototypeStore().state.students;
  return id ? students.find((s) => s.id === id) : undefined;
}

export function useSupportRequests(): SupportRequest[] {
  return usePrototypeStore().state.supportRequests;
}

export function useSupportById(id: string | undefined): SupportRequest | undefined {
  const reqs = usePrototypeStore().state.supportRequests;
  return id ? reqs.find((s) => s.id === id) : undefined;
}

export function useNotifications(): NotificationCampaign[] {
  return usePrototypeStore().state.notifications;
}

export function useAuditLogs(): AuditEntry[] {
  return dedupeAuditEntries(usePrototypeStore().state.auditLogs);
}

export function useAuditByEntity(entityId: string): AuditEntry[] {
  const auditLogs = dedupeAuditEntries(usePrototypeStore().state.auditLogs);
  return auditLogs.filter((a) => a.entityId === entityId || a.entityId.includes(entityId));
}

export function useStudentNotes(studentId: string): StudentNote[] {
  return usePrototypeStore().state.studentNotes[studentId] ?? [];
}

export function useSupportComments(supportId: string): SupportComment[] {
  return usePrototypeStore().state.supportComments[supportId] ?? [];
}

export function useGeneratedBatches(): GeneratedBatch[] {
  return usePrototypeStore().state.generatedBatches;
}

export function useTestDrafts(): Record<string, TestDraft> {
  return usePrototypeStore().state.testDrafts;
}

export function useSavedViews(): SavedView[] {
  return usePrototypeStore().state.savedViews;
}

export function useSavedViewsByPage(page: string): SavedView[] {
  const views = usePrototypeStore().state.savedViews;
  return views.filter((v) => v.page === page);
}

export function useDefaultSavedView(page: string): SavedView | undefined {
  const views = usePrototypeStore().state.savedViews;
  return views.find((v) => v.page === page && v.isDefault);
}

export function useQuestionVersions(questionId: string | undefined): QuestionVersion[] {
  const store = usePrototypeStore();
  if (!questionId) return [];
  return store.state.questionVersions[questionId] ?? [];
}

export function useSimilarityResults(): SimilarityResult[] {
  return usePrototypeStore().state.similarityResults;
}

export function useGenerationRecipes(): GenerationRecipe[] {
  return usePrototypeStore().state.generationRecipes;
}

export function useReviewComments(questionId: string | undefined): ReviewComment[] {
  const store = usePrototypeStore();
  if (!questionId) return [];
  return store.state.reviewComments[questionId] ?? [];
}

export function useBlueprints(): Blueprint[] {
  return usePrototypeStore().state.blueprints;
}

export function useTestVersions(testId: string | undefined): TestVersion[] {
  const store = usePrototypeStore();
  if (!testId) return [];
  return store.state.testVersions[testId] ?? [];
}

export function useTestQAComments(testId: string | undefined): TestQAComment[] {
  const store = usePrototypeStore();
  if (!testId) return [];
  return store.state.testQAComments[testId] ?? [];
}
