export const QUESTION_STUDIO_REFRESH_EVENT = 'question-studio:refresh';

export function notifyQuestionStudioRefresh() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(QUESTION_STUDIO_REFRESH_EVENT));
  }
}
