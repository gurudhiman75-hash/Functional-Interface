import { COM004_ENGLISH_EDITORIAL_CANDIDATE_V4 } from './com004-english-editorial-candidate-v4';

const sectionNames = [
  'Internet and Internet Service Providers', 'World Wide Web and Internet',
  'Web pages, websites, homepages and hyperlinks', 'Internet services',
  'Browsers, search engines and Web search', 'Browser controls, cache, cookies and history',
  'Uploading and downloading', 'URLs and domain names', 'HTTP and HTTPS',
  'Internet and Web history', 'E-mail addresses and access', 'E-mail fields',
  'E-mail actions and folders', 'E-mail attachments', 'E-mail protocols',
  'Internet-banking services', 'Internet-banking safety',
];

export function renderCom004FullEnglishReviewV4() {
  const lines = [
    '# COM-004 — Complete English Question Review V4',
    '204 questions across 17 sections. This draft revises the remaining 170 questions and retains the 34 questions approved in V3. Each question includes four options, its answer and a simple explanation.',
  ];
  let lastQl = '';
  COM004_ENGLISH_EDITORIAL_CANDIDATE_V4.forEach((q, i) => {
    if (q.qlId !== lastQl) {
      lastQl = q.qlId;
      lines.push(`## ${Number(q.qlId.slice(-3))}. ${sectionNames[Number(q.qlId.slice(-3)) - 1]}`);
    }
    lines.push(`### Q${String(i + 1).padStart(3, '0')}`, `*${q.questionId}*`,
      q.stem,
      q.options.map((o, j) => `${String.fromCharCode(65 + j)}. ${o}`).join('\n\n'),
      `**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.canonicalAnswer}`,
      `**Explanation:** ${q.explanation}`);
  });
  return lines.join('\n\n') + '\n';
}
