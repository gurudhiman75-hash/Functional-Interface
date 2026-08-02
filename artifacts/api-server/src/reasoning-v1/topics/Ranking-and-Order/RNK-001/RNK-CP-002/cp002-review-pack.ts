import { createHash } from 'node:crypto';
import { RNK_CP002_AUTHORITY_IDS } from './cp002-authority-runtime';
import {
  generateEnglishReviewedRnkCp002AuthorityQuestion,
} from './cp002-english-reviewed-authority-runtime';

export const RNK_CP002_APPROVED_REVIEW_PROJECTION_SHA256 =
  'e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430';

export function buildRnkCp002EnglishReviewProjection(): readonly unknown[] {
  const projection: unknown[] = [];
  for (const authorityId of RNK_CP002_AUTHORITY_IDS) {
    for (let seed = 0; seed < 6; seed += 1) {
      const question = generateEnglishReviewedRnkCp002AuthorityQuestion(authorityId, seed);
      projection.push({
        authorityId,
        sourcePrototypeId: question.sourcePrototypeId,
        seed,
        contextId: question.contextId,
        difficulty: question.difficulty,
        answerSemantic: question.answerSemantic,
        firstName: question.firstName,
        secondName: question.secondName,
        stem: question.stem,
        options: question.options.map((item, index) => ({
          index,
          label: item.label,
          value: item.value,
          isCorrect: index === question.correctIndex,
          misconceptionId: item.misconceptionId,
          explanation: item.explanation,
        })),
        answer: question.answer,
        explanation: question.explanation,
        mathematicalFingerprint: question.mathematicalFingerprint,
      });
    }
  }
  return projection;
}

export function hashRnkCp002EnglishReviewProjection(): string {
  return createHash('sha256')
    .update(JSON.stringify(buildRnkCp002EnglishReviewProjection()), 'utf8')
    .digest('hex');
}
