import { INT_CP001_FINAL_REGISTRY } from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import { generateIntCp001ApprovedV2LocalizedQuestion } from "./cp001-localized-runtime-v2-approved";
import {
  generateIntCp001ReadableEnglishQuestion,
  generateIntCp001ReadableLocalizedQuestion,
} from "./cp001-readable-stem-runtime";
import { stripMath } from "./cp001-localization-foundation";
import type { IntCp001ReadableLanguage } from "./cp001-readable-stem-release";

function words(value: string): number {
  return stripMath(value).trim().split(/\s+/u).filter(Boolean).length;
}

const languages: readonly IntCp001ReadableLanguage[] = ["en", "hi", "pa"];
const totals = Object.fromEntries(languages.map((language) => [language, {
  approvedWords: 0,
  candidateWords: 0,
  approvedCharacters: 0,
  candidateCharacters: 0,
  shorterOrEqual: 0,
  qls: {} as Record<string, {
    approvedWords: number;
    candidateWords: number;
    approvedCharacters: number;
    candidateCharacters: number;
  }>,
}])) as Record<IntCp001ReadableLanguage, {
  approvedWords: number;
  candidateWords: number;
  approvedCharacters: number;
  candidateCharacters: number;
  shorterOrEqual: number;
  qls: Record<string, {
    approvedWords: number;
    candidateWords: number;
    approvedCharacters: number;
    candidateCharacters: number;
  }>;
}>;

for (const entry of INT_CP001_FINAL_REGISTRY) {
  for (let index = 0; index < 80; index += 1) {
    const seed = `readable-stem-${index}`;
    const approved = {
      en: generateIntCp001FinalEditorialV3Question(entry.qlId, seed),
      hi: generateIntCp001ApprovedV2LocalizedQuestion(entry.qlId, seed, "hi"),
      pa: generateIntCp001ApprovedV2LocalizedQuestion(entry.qlId, seed, "pa"),
    } as const;
    const candidate = {
      en: generateIntCp001ReadableEnglishQuestion(entry.qlId, seed),
      hi: generateIntCp001ReadableLocalizedQuestion(entry.qlId, seed, "hi"),
      pa: generateIntCp001ReadableLocalizedQuestion(entry.qlId, seed, "pa"),
    } as const;

    for (const language of languages) {
      const a = approved[language].stem;
      const c = candidate[language].stem;
      const bucket = totals[language];
      const ql = bucket.qls[entry.qlId] ?? {
        approvedWords: 0,
        candidateWords: 0,
        approvedCharacters: 0,
        candidateCharacters: 0,
      };
      ql.approvedWords += words(a);
      ql.candidateWords += words(c);
      ql.approvedCharacters += a.length;
      ql.candidateCharacters += c.length;
      bucket.qls[entry.qlId] = ql;
      bucket.approvedWords += words(a);
      bucket.candidateWords += words(c);
      bucket.approvedCharacters += a.length;
      bucket.candidateCharacters += c.length;
      bucket.shorterOrEqual += c.length <= a.length ? 1 : 0;
    }
  }
}

console.log(JSON.stringify(Object.fromEntries(languages.map((language) => {
  const bucket = totals[language];
  return [language, {
    approvedWords: bucket.approvedWords,
    candidateWords: bucket.candidateWords,
    wordChangePercent: Number((((bucket.candidateWords / bucket.approvedWords) - 1) * 100).toFixed(2)),
    approvedCharacters: bucket.approvedCharacters,
    candidateCharacters: bucket.candidateCharacters,
    characterChangePercent: Number((((bucket.candidateCharacters / bucket.approvedCharacters) - 1) * 100).toFixed(2)),
    shorterOrEqual: bucket.shorterOrEqual,
    qls: Object.fromEntries(Object.entries(bucket.qls).map(([qlId, ql]) => [qlId, {
      ...ql,
      wordChangePercent: Number((((ql.candidateWords / ql.approvedWords) - 1) * 100).toFixed(2)),
      characterChangePercent: Number((((ql.candidateCharacters / ql.approvedCharacters) - 1) * 100).toFixed(2)),
    }])),
  }];
})), null, 2));
