import { readFileSync, writeFileSync } from 'node:fs';

function patchFile(path, replacements) {
  let content = readFileSync(path, 'utf8');
  for (const { before, after, label } of replacements) {
    if (content.includes(after)) continue;
    if (!content.includes(before)) throw new Error(`${path}: missing patch anchor ${label}`);
    content = content.replace(before, after);
  }
  writeFileSync(path, content, 'utf8');
}

patchFile('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx', [
  {
    label: 'MathText import',
    before: "import { PageHeader } from '@/components/shared/PageHeader';\n",
    after: "import { MathText } from '@/components/shared/MathText';\nimport { PageHeader } from '@/components/shared/PageHeader';\n",
  },
  {
    label: 'generated stem preview',
    before: '<p className="mt-2 text-sm leading-relaxed">{stem}</p>',
    after: '<MathText content={stem} className="mt-2 text-sm leading-relaxed" />',
  },
  {
    label: 'generated options preview',
    before: '<span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option || <span className="italic">Empty option</span>}',
    after: '<span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option ? <MathText content={option} inline className="inline" /> : <span className="italic">Empty option</span>}',
  },
  {
    label: 'generated explanation preview',
    before: '<p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{itemExplanation(item.payload) || \'No explanation recorded.\'}</p>',
    after: '<MathText content={itemExplanation(item.payload) || \'No explanation recorded.\'} className="mt-2 text-xs leading-relaxed text-muted-foreground" />',
  },
  {
    label: 'revision live preview',
    before: '<div className="mt-4 grid gap-3 md:grid-cols-2">{options.map((option, index) => <div key={index} className="flex items-center gap-2"><button type="button" onClick={() => setCorrectIndex(index)} className={cn(\'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-xs font-bold\', correctIndex === index ? \'border-success bg-success/10 text-success\' : \'bg-background text-muted-foreground\')}>{String.fromCharCode(65 + index)}</button><Input value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${String.fromCharCode(65 + index)}`} /></div>)}</div>',
    after: '<div className="mt-4 grid gap-3 md:grid-cols-2">{options.map((option, index) => <div key={index} className="flex items-center gap-2"><button type="button" onClick={() => setCorrectIndex(index)} className={cn(\'flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-xs font-bold\', correctIndex === index ? \'border-success bg-success/10 text-success\' : \'bg-background text-muted-foreground\')}>{String.fromCharCode(65 + index)}</button><Input value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${String.fromCharCode(65 + index)}`} /></div>)}</div><div className="mt-4 rounded-lg border bg-background p-3"><p className="mb-2 text-xs font-semibold">Rendered LaTeX preview</p><MathText content={stem} className="text-sm font-medium" /><div className="mt-3 grid gap-2 md:grid-cols-2">{options.map((option, index) => <div key={`preview-${index}`} className={cn(\'rounded-md border px-3 py-2 text-xs\', correctIndex === index && \'border-success/40 bg-success/5\')}><span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span><MathText content={option || \'—\'} inline className="inline" /></div>)}</div><MathText content={explanation || \'No explanation recorded.\'} className="mt-3 text-xs text-muted-foreground" /></div>',
  },
]);

patchFile('artifacts/admin-app/src/pages/content/QuestionDetailPage.tsx', [
  {
    label: 'MathText import',
    before: "import { PageHeader } from '@/components/shared/PageHeader';\n",
    after: "import { MathText } from '@/components/shared/MathText';\nimport { PageHeader } from '@/components/shared/PageHeader';\n",
  },
  {
    label: 'canonical stem preview',
    before: '<p className="whitespace-pre-wrap text-sm font-medium leading-7">{version.stem}</p>',
    after: '<MathText content={version.stem} className="text-sm font-medium leading-7" />',
  },
  {
    label: 'canonical option preview',
    before: '<p className="text-sm">\n                <span className="font-semibold">{option.key}.</span> {option.text}\n              </p>',
    after: '<div className="min-w-0 text-sm"><span className="mr-2 font-semibold">{option.key}.</span><MathText content={option.text} inline className="inline" /></div>',
  },
  {
    label: 'canonical explanation preview',
    before: '<p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">\n            {version.explanation}\n          </p>',
    after: '<MathText content={version.explanation} className="text-sm leading-7 text-muted-foreground" />',
  },
]);

patchFile('artifacts/admin-app/src/pages/content/QuestionBankWorkspacePage.tsx', [
  {
    label: 'MathText import',
    before: "import { PageHeader } from '@/components/shared/PageHeader';\n",
    after: "import { MathText } from '@/components/shared/MathText';\nimport { PageHeader } from '@/components/shared/PageHeader';\n",
  },
  {
    label: 'desktop bank stem preview',
    before: '<Link to={`/content/questions/${question.id}`} className="line-clamp-2 font-medium leading-5 hover:text-primary">{question.stem}</Link>',
    after: '<Link to={`/content/questions/${question.id}`} className="block line-clamp-2 font-medium leading-5 hover:text-primary"><MathText content={question.stem} /></Link>',
  },
  {
    label: 'mobile bank stem preview',
    before: '<p className="mt-3 line-clamp-3 text-sm font-medium leading-5">{question.stem}</p>',
    after: '<MathText content={question.stem} className="mt-3 line-clamp-3 text-sm font-medium leading-5" />',
  },
]);

console.log('Platform LaTeX rendering patches applied.');
