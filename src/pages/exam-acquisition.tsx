import { useParams } from "wouter";

import {
  ExamHubPage,
  ExamPreparationPage,
  ExamSyllabusPage,
  ExamTopicQuestionsPage,
} from "@/components/ExamAcquisitionPages";

export function ConfiguredExamHub({ examSlug }: { examSlug: string }) {
  return <ExamHubPage examSlug={examSlug} />;
}

export function ConfiguredExamPreparation({ examSlug }: { examSlug: string }) {
  return <ExamPreparationPage examSlug={examSlug} />;
}

export function ConfiguredExamSyllabus({ examSlug }: { examSlug: string }) {
  return <ExamSyllabusPage examSlug={examSlug} />;
}

export function ConfiguredExamQuestions({ examSlug }: { examSlug: string }) {
  const params = useParams<{ topicSlug: string }>();
  return <ExamTopicQuestionsPage examSlug={examSlug} topicSlug={params.topicSlug} />;
}
