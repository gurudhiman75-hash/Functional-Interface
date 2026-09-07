import { createHash } from 'node:crypto';
import { COM004_ENGLISH_CHAPTER_CANDIDATE_V1, type Com004EnglishChapterQuestionV1 } from './com004-english-chapter-candidate-v1';
import { COM004_ENGLISH_FREEZE_AUTHORITY_V1 } from './com004-english-freeze-v1';

type Revision = { stem?: string; explanation: string; answer?: string; distractors?: [string, string, string] };
// Versioned source corrections: never edit the historical V1 freeze in place.
const revisions: Record<string, Revision> = {
  'COM004-EN-W2-006-11': { explanation: 'A third-party cookie is associated with a site other than the one being visited directly, for example through embedded content. A bookmark saves a chosen link; a history entry records navigation; a downloaded file is a transferred resource.' },
  'COM004-EN-W2-008-05': { explanation: 'A domain name is a readable name such as example.org used in an Internet address. In https://example.org/reports, example.org identifies the host, while /reports is the path.' },
  'COM004-EN-W2-008-12': {
    stem: 'The addresses https://example.org/results and https://example.org/notices share which component?',
    answer: 'The domain name example.org', distractors: ['The complete resource path', 'The complete URL', 'The page name results'],
    explanation: 'Both addresses contain the same host, example.org, but their paths are /results and /notices. A shared domain does not make the complete URLs or the resources identical.' },
  'COM004-EN-W3-009-10': {
    stem: 'A site changes its address from http://example.org to https://example.org. Which feature does the new scheme indicate?',
    answer: 'HTTP communication protected using TLS', distractors: ['A change from a website to an e-mail service', 'A guarantee that every claim on the site is true', 'A replacement of the domain name with a search engine'],
    explanation: 'The https scheme indicates HTTP communication protected by TLS. It describes connection protection; the domain remains example.org, and the protocol does not verify the truth of the site’s content.' },
  'COM004-EN-W3-010-08': { stem: 'Which statement about the development of the Internet and the Web is incorrect?', explanation: 'The Internet developed through contributions from many researchers, networks and standards. ARPANET was a precursor network; Tim Berners-Lee is associated with the Web and Ray Tomlinson with early network e-mail.' },
  'COM004-EN-W4-014-07': { explanation: 'Documents and images can be attached to e-mail. The maximum attachment size depends on the mail service and its current policy, so providers need not permit the same size.' },
  'COM004-EN-W4-015-11': {
    stem: 'An e-mail application must send outgoing messages and also access messages stored in a server mailbox. Which pair matches these two tasks?',
    answer: 'SMTP for sending; IMAP for server-mailbox access', distractors: ['IMAP for sending; SMTP for server-mailbox access', 'POP3 for sending; HTTP for server-mailbox access', 'SMTP for both tasks because IMAP only displays websites'],
    explanation: 'SMTP handles outgoing mail submission and transfer. IMAP lets a mail client access and manage messages in a server mailbox. These are complementary roles, so a client may use both protocols.' },
  'COM004-EN-W4-016-05': {
    stem: 'Which group lists services commonly provided through Internet banking?',
    answer: 'Balance inquiry, account statement access and online fund transfer', distractors: ['Balance inquiry, disk formatting and online fund transfer', 'Account statement access, CPU scheduling and bill payment', 'Disk partitioning, browser installation and RAM refresh'],
    explanation: 'Balance inquiry, statement access and supported fund transfers are banking services offered online. Formatting, scheduling and memory refresh manage a computer rather than a bank account.' },
  'COM004-EN-W4-016-06': {
    stem: 'Consider the statements: (1) Internet banking can provide account-information access. (2) Viewing an account balance necessarily transfers money to another account. Which option is correct?',
    explanation: 'Internet banking can show account information such as a balance. Viewing that information is an inquiry, not a fund transfer, so only statement 1 is correct.' },
  'COM004-EN-W4-016-08': {
    stem: 'A customer wants to review deposits and withdrawals over the previous month. Which Internet-banking feature is most suitable?',
    answer: 'Account statement', distractors: ['Change login password', 'Add a transfer beneficiary', 'Edit the browser homepage'],
    explanation: 'An account statement lists transactions during a selected period, allowing the customer to review deposits and withdrawals. Changing a password or adding a beneficiary does not supply that transaction record.' },
  'COM004-EN-W4-016-10': {
    stem: 'Which statement correctly describes Internet banking?',
    answer: 'It provides supported banking services through an online interface', distractors: ['It is a browser used only to display bank advertisements', 'It requires an e-mail attachment for every balance inquiry', 'It means replacing a bank account with browser history'],
    explanation: 'Internet banking provides online access to supported banking functions, including inquiries and transactions. A browser may display the interface, but it is not itself the banking service.' },
  'COM004-EN-W4-016-12': {
    stem: 'Which set correctly matches Internet-banking features with their purposes?',
    answer: 'Balance inquiry — view balance; statement — review account record; fund transfer — move money online',
    distractors: ['Balance inquiry — move money; statement — view password; fund transfer — review account record', 'Balance inquiry — add beneficiary; statement — move money; fund transfer — view balance', 'Balance inquiry — change password; statement — add beneficiary; fund transfer — download browser history'],
    explanation: 'A balance inquiry shows the account balance, a statement records account activity, and a supported fund transfer moves money between accounts. Each feature serves a different banking task.' },
  'COM004-EN-W5-017-11': {
    stem: 'After using Internet banking on a shared computer, which action should a customer take before leaving?',
    answer: 'Sign out of the banking session and avoid leaving saved credentials', distractors: ['Leave the signed-in page open for the next user', 'Save the password in the shared browser for convenience', 'Assume switching to another tab signs out of the account'],
    explanation: 'Signing out ends the active banking session. Saved credentials on a shared device may permit later access, and merely switching tabs does not end the session.' },
};

export const COM004_ENGLISH_CHAPTER_V2 = Object.freeze(COM004_ENGLISH_CHAPTER_CANDIDATE_V1.map(source => {
  const revision = revisions[source.questionId];
  const answer = revision?.answer ?? source.canonicalAnswer;
  const options = revision?.distractors ? [...revision.distractors] : [...source.options];
  if (revision?.distractors) options.splice(source.correctIndex, 0, answer);
  return Object.freeze({ ...source, stem: revision?.stem ?? source.stem, explanation: revision?.explanation ?? source.explanation, canonicalAnswer: answer, options: Object.freeze(options) as unknown as string[] });
}));
export const COM004_ENGLISH_REVISION_V2 = Object.freeze({
  authorityId: 'COM-004-ENGLISH-EDITORIAL-REVISION-V2',
  predecessor: COM004_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  revisedQuestionIds: Object.freeze(Object.keys(revisions)),
  questionCount: COM004_ENGLISH_CHAPTER_V2.length,
  sha256: createHash('sha256').update(JSON.stringify(COM004_ENGLISH_CHAPTER_V2)).digest('hex'),
  sourceMutationPolicy: 'SOURCE_GENERATOR_ONLY',
});
export function auditCom004EnglishChapterV2(questions: readonly Com004EnglishChapterQuestionV1[] = COM004_ENGLISH_CHAPTER_V2) {
  const issues: string[] = [];
  const ids = new Set<string>(), stems = new Set<string>();
  if (questions.length !== 204) issues.push('CHAPTER_COUNT');
  for (const q of questions) {
    if (ids.has(q.questionId)) issues.push(`DUPLICATE_ID:${q.questionId}`);
    if (stems.has(q.stem.trim().toLowerCase())) issues.push(`DUPLICATE_STEM:${q.questionId}`);
    ids.add(q.questionId); stems.add(q.stem.trim().toLowerCase());
    if (q.options.length !== 4 || new Set(q.options.map(v => v.trim().toLowerCase())).size !== 4) issues.push(`OPTIONS:${q.questionId}`);
    if (!Number.isInteger(q.correctIndex) || q.options[q.correctIndex] !== q.canonicalAnswer) issues.push(`ANSWER:${q.questionId}`);
    if (/COM-00\d|\bQL\b|\bcorpus\b|awareness boundary|learner task|belongs? (?:outside|to.*chapter)/i.test([q.stem,...q.options,q.explanation].join(' '))) issues.push(`INTERNAL_COPY:${q.questionId}`);
    if (!q.explanation.trim() || !q.stem.trim()) issues.push(`EMPTY_COPY:${q.questionId}`);
    const source = COM004_ENGLISH_CHAPTER_CANDIDATE_V1.find(s => s.questionId === q.questionId);
    if (!source || source.qlId !== q.qlId || source.correctIndex !== q.correctIndex || JSON.stringify(source.sourceCandidateIds) !== JSON.stringify(q.sourceCandidateIds)) issues.push(`SOURCE_BINDING:${q.questionId}`);
  }
  for (const ql of COM004_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds) if (questions.filter(q => q.qlId === ql).length !== 12) issues.push(`QL_COUNT:${ql}`);
  return { valid: issues.length === 0, issues, questionCount: questions.length, qlCount: 17 };
}
