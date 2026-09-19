type StemQuestion = {
  questionId: string;
  stem: string;
};

const DATABASE_STEM = /^Article\s+(\d+[A-Z]?)\s+(?:mainly\s+)?deals with:$/i;

const templates = [
  (article:string) => `Which subject is covered under Article ${article} of the Constitution?`,
  (article:string) => `Article ${article} of the Constitution primarily concerns which of the following?`,
  (article:string) => `Which of the following is provided by Article ${article} of the Constitution?`,
  (article:string) => `What is the main constitutional subject of Article ${article}?`,
] as const;

function templateIndex(questionId:string):number {
  const match=questionId.match(/(\d{3})$/);
  return match ? Number(match[1]) % templates.length : 0;
}

export function applyPolityFinalEditorialStemPass<T extends StemQuestion>(question:T):T {
  const match=question.stem.match(DATABASE_STEM);
  if(!match) return question;
  const article=match[1];
  return {
    ...question,
    stem: templates[templateIndex(question.questionId)](article),
  };
}

export function hasDatabaseStylePolityStem(stem:string):boolean {
  return DATABASE_STEM.test(stem);
}
