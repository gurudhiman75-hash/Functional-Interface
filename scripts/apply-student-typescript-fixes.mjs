import { readFile, writeFile } from 'node:fs/promises';

async function read(path) {
  return readFile(path, 'utf8');
}

async function write(path, content) {
  await writeFile(path, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

function replaceOnce(content, search, replacement, label) {
  const first = content.indexOf(search);
  if (first < 0) throw new Error(`Missing expected source for ${label}`);
  if (content.indexOf(search, first + search.length) >= 0) {
    throw new Error(`Expected one source occurrence for ${label}`);
  }
  return content.slice(0, first) + replacement + content.slice(first + search.length);
}

function replaceRegexOnce(content, pattern, replacement, label) {
  const matches = [...content.matchAll(new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`))];
  if (matches.length !== 1) throw new Error(`Expected one regex match for ${label}, found ${matches.length}`);
  return content.replace(pattern, replacement);
}

async function updateJson(path, mutate) {
  const value = JSON.parse(await read(path));
  mutate(value);
  await write(path, `${JSON.stringify(value, null, 2)}\n`);
}

await updateJson('artifacts/examtree/package.json', (pkg) => {
  pkg.dependencies ??= {};
  pkg.dependencies['@workspace/api-zod'] = 'workspace:*';
  pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort(([a], [b]) => a.localeCompare(b)));
});

await updateJson('artifacts/admin-app/package.json', (pkg) => {
  pkg.devDependencies['@types/react'] = 'catalog:';
  pkg.devDependencies['@types/react-dom'] = 'catalog:';
});

await updateJson('artifacts/examtree/tsconfig.json', (config) => {
  config.compilerOptions.paths = {
    '@/*': ['./src/*'],
    '@workspace/api-zod': ['../../lib/api-zod/src/index.ts'],
    '@workspace/*': ['../../lib/*/src/index.ts', '../../lib/*'],
  };
});

{
  const path = 'lib/api-zod/src/index.ts';
  let content = await read(path);
  content = replaceOnce(
    content,
    '  section: string;\n  explanation: string | null;',
    '  section: string;\n  topic?: string | null;\n  difficulty?: "Easy" | "Medium" | "Hard" | null;\n  explanation: string | null;',
    'canonical question topic/difficulty',
  );
  content = replaceOnce(
    content,
    '  /** Marks-based score: sum of +marksPerQuestion for correct and -negativeMarks for wrong */\n  actualScore?: number | null;',
    '  /** Marks-based score: sum of +marksPerQuestion for correct and -negativeMarks for wrong */\n  actualScore?: number | null;\n  marksPerQuestion?: number;\n  negativeMarks?: number;',
    'canonical attempt marks',
  );
  content = replaceOnce(
    content,
    '  /** "REAL" | "PRACTICE" — absent/null means legacy row, treated as REAL */\n  attemptType?: "REAL" | "PRACTICE" | null;',
    '  /** "REAL" | "PRACTICE" — absent/null means legacy row, treated as REAL */\n  attemptType?: "REAL" | "PRACTICE" | null;\n  isFirstAttempt?: boolean;\n  originalAttemptId?: string;',
    'canonical attempt metadata',
  );
  content = replaceOnce(
    content,
    '    text: string;\n    options: string[];\n    selected: number | null;',
    '    text: string;\n    options: string[];\n    topic?: string | null;\n    difficulty?: "Easy" | "Medium" | "Hard" | null;\n    textHi?: string | null;\n    textPa?: string | null;\n    optionsHi?: string[] | null;\n    optionsPa?: string[] | null;\n    explanationHi?: string | null;\n    explanationPa?: string | null;\n    selected: number | null;',
    'canonical attempt review metadata',
  );
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/lib/storage.ts';
  let content = await read(path);
  content = replaceOnce(
    content,
    'import type {\n  SeatingDiagramData,\n  SeatingExplanationFlow,\n} from "@workspace/api-zod";',
    'import type {\n  TestAttempt as CanonicalTestAttempt,\n} from "@workspace/api-zod";',
    'storage canonical attempt import',
  );
  content = replaceRegexOnce(
    content,
    /export interface TestAttempt \{[\s\S]*?\n\}\n\nexport interface ActiveTestSession/,
    'export type TestAttempt = CanonicalTestAttempt;\n\ntype LocalAttemptInput = Omit<TestAttempt, "id" | "userId" | "createdAt"> &\n  Partial<Pick<TestAttempt, "id" | "userId" | "createdAt">>;\n\nexport interface ActiveTestSession',
    'storage duplicate attempt declaration',
  );
  content = replaceOnce(
    content,
    'export const addAttempt = (attempt: TestAttempt) => {\n  const attempts = getAttempts();\n  attempts.unshift(attempt);\n  Storage.set("attempts", attempts);\n  if (attempt.attemptType === "REAL") {\n    updateStreak();\n  }\n};',
    'export const addAttempt = (attempt: LocalAttemptInput) => {\n  const normalized: TestAttempt = {\n    ...attempt,\n    id: attempt.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,\n    userId: attempt.userId ?? "local",\n    createdAt: attempt.createdAt ?? new Date().toISOString(),\n  };\n  const attempts = getAttempts();\n  attempts.unshift(normalized);\n  Storage.set("attempts", attempts);\n  if ((normalized.attemptType ?? "REAL") === "REAL") {\n    updateStreak();\n  }\n};',
    'storage local attempt normalization',
  );
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/lib/data.ts';
  let content = await read(path);
  content = replaceOnce(
    content,
    'import {\n  getAdminQuestions,\n  getAdminTests,\n  type TestAttempt,\n} from "@/lib/storage";\nimport type {\n  SeatingDiagramData,\n  SeatingExplanationFlow,\n} from "@workspace/api-zod";',
    'import {\n  getAdminQuestions,\n  getAdminTests,\n} from "@/lib/storage";\nimport type {\n  SeatingDiagramData,\n  SeatingExplanationFlow,\n  TestAttempt as CanonicalTestAttempt,\n} from "@workspace/api-zod";\n\nexport type TestAttempt = CanonicalTestAttempt;',
    'data canonical attempt import and export',
  );
  content = replaceOnce(
    content,
    '  const sections = (test.sections.length\n    ? test.sections\n    : ["General"]\n  ).map((sectionName, sectionIndex) => ({',
    '  const sectionNames: string[] = test.sections.length\n    ? test.sections\n    : ["General"];\n  const sections = sectionNames.map((sectionName, sectionIndex) => ({',
    'data section names typing',
  );
  content = replaceRegexOnce(
    content,
    /export interface TestAttempt \{[\s\S]*?\n\}\n\nexport async function getAnalytics/,
    'export async function getAnalytics',
    'data duplicate attempt declaration',
  );
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/pages/activity.tsx';
  let content = await read(path);
  content = replaceOnce(
    content,
    'function formatDate(value: string) {',
    'function formatDate(value: string | Date) {',
    'activity canonical attempt date',
  );
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/pages/result.tsx';
  let content = await read(path);
  content = replaceOnce(
    content,
    '  textHi?: string;\n  textPa?: string;\n  optionsHi?: string[];\n  optionsPa?: string[];\n  explanationHi?: string;\n  explanationPa?: string;',
    '  textHi?: string | null;\n  textPa?: string | null;\n  optionsHi?: string[] | null;\n  optionsPa?: string[] | null;\n  explanationHi?: string | null;\n  explanationPa?: string | null;',
    'result nullable multilingual review fields',
  );
  content = replaceOnce(
    content,
    '  difficulty?: number | null;',
    '  difficulty?: "Easy" | "Medium" | "Hard" | null;',
    'result canonical difficulty',
  );
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/components/AssignFromBankDialog.tsx';
  let content = await read(path);
  content = replaceOnce(
    content,
    '<Check className="w-4 h-4 text-emerald-500" title="Already in test" />',
    '<Check className="w-4 h-4 text-emerald-500" aria-label="Already in test" />',
    'Lucide accessibility label',
  );
  content = replaceOnce(content, 'content={q.text}', 'content={q.text ?? ""}', 'assign dialog nullable text');
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/components/QuestionBankTab.tsx';
  let content = await read(path);
  content = replaceOnce(content, '<MathText content={q.text} />', '<MathText content={q.text ?? ""} />', 'question bank nullable text');
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/components/seating/ArrangementView.tsx';
  let content = await read(path);
  content = replaceOnce(
    content,
    'function activeLabels(\n  trace: InferenceTraceLike,',
    'function activeLabels(\n  trace: InferenceTraceLike | undefined,',
    'optional inference trace',
  );
  await write(path, content);
}

{
  const path = 'artifacts/examtree/src/lib/export-engine.ts';
  let content = await read(path);
  content = replaceOnce(
    content,
    '  return new Blob([...localParts, ...centralParts, end], {\n    type: MIME_TYPES.docx,\n  });',
    '  const archive = new Uint8Array(offset + centralSize + end.length);\n  let cursor = 0;\n  for (const part of [...localParts, ...centralParts, end]) {\n    archive.set(part, cursor);\n    cursor += part.length;\n  }\n\n  return new Blob([archive.buffer], {\n    type: MIME_TYPES.docx,\n  });',
    'DOCX BlobPart assembly',
  );
  await write(path, content);
}

console.log('Applied asserted student TypeScript baseline fixes.');
