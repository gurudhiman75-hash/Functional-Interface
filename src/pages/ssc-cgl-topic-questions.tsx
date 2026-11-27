import { useParams } from "wouter";

import { ExamTopicQuestionsPage } from "@/components/ExamAcquisitionPages";

export default function SscCglTopicQuestions() {
  const params = useParams<{ topicSlug: string }>();
  return <ExamTopicQuestionsPage examSlug="ssc-cgl" topicSlug={params.topicSlug} />;
}
