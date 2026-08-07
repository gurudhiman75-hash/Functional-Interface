import { readFileSync, writeFileSync } from 'node:fs';

const target = 'artifacts/admin-app/src/pages/content/QuestionStudioLivePage.tsx';
let source = readFileSync(target, 'utf8');

function replaceOnce(label, before, after) {
  const count = source.split(before).length - 1;
  if (count !== 1) {
    throw new Error(`${label}: expected exactly one match, found ${count}`);
  }
  source = source.replace(before, after);
}

replaceOnce(
  'renderer import',
  "import { useQuestionStudio } from '@/features/question-studio/useQuestionStudio';",
  "import { QuestionExplanationDisclosure } from '@/features/question-studio/QuestionExplanationDisclosure';\nimport { useQuestionStudio } from '@/features/question-studio/useQuestionStudio';",
);

replaceOnce(
  'structured option labels',
  `function itemOptions(payload: Record<string, unknown> | null) {\n  const options = payload?.options;\n  return Array.isArray(options)\n    ? options.map((option) => String(option ?? '')).filter(Boolean)\n    : [];\n}`,
  `function itemOptions(payload: Record<string, unknown> | null) {\n  const options = payload?.options;\n  if (!Array.isArray(options)) return [];\n  return options\n    .map((option) => {\n      if (typeof option === 'string') return option.trim();\n      if (typeof option === 'object' && option !== null && !Array.isArray(option)) {\n        const label = (option as Record<string, unknown>).label;\n        return typeof label === 'string' ? label.trim() : '';\n      }\n      return String(option ?? '').trim();\n    })\n    .filter(Boolean);\n}`,
);

replaceOnce(
  'run disclosure button',
  `<button type="button" onClick={() => toggleRun(run.id)} className="rounded-md p-1 hover:bg-muted">\n                          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}\n                        </button>`,
  `<button\n                          type="button"\n                          onClick={() => toggleRun(run.id)}\n                          className="rounded-md p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"\n                          aria-expanded={expanded}\n                          aria-controls={\`question-studio-run-\${run.id}\`}\n                          aria-label={\`\${expanded ? 'Collapse' : 'Expand'} generation run \${run.publicCode}\`}\n                        >\n                          {expanded\n                            ? <ChevronDown className="h-4 w-4" aria-hidden="true" />\n                            : <ChevronRight className="h-4 w-4" aria-hidden="true" />}\n                        </button>`,
);

replaceOnce(
  'run disclosure region',
  `<div className="border-t bg-muted/10">\n                        {items.map((item) => (`,
  `<div\n                        id={\`question-studio-run-\${run.id}\`}\n                        className="border-t bg-muted/10"\n                        aria-label={\`Generated items in \${run.publicCode}\`}\n                      >\n                        {items.map((item) => (`,
);

replaceOnce(
  'remove flat explanation read',
  `  const explanation = firstText(item.payload, ['explanation'], 'No explanation recorded.');\n  const correctIndex = Number(item.payload?.correctIndex ?? item.payload?.correct ?? -1);`,
  `  const correctIndex = Number(item.payload?.correctIndex ?? item.payload?.correct ?? -1);\n  const detailsId = \`question-studio-item-\${item.id}\`;`,
);

replaceOnce(
  'item disclosure button',
  `<button type="button" onClick={onExpanded} className="mt-0.5 rounded-md p-1 hover:bg-muted">\n          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}\n        </button>`,
  `<button\n          type="button"\n          onClick={onExpanded}\n          className="mt-0.5 rounded-md p-1 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"\n          aria-expanded={expanded}\n          aria-controls={detailsId}\n          aria-label={\`\${expanded ? 'Collapse' : 'Expand'} generated item \${item.itemNumber}\`}\n        >\n          {expanded\n            ? <ChevronDown className="h-4 w-4" aria-hidden="true" />\n            : <ChevronRight className="h-4 w-4" aria-hidden="true" />}\n        </button>`,
);

replaceOnce(
  'stem wrapping',
  `<p className="mt-2 text-sm leading-relaxed">{stem}</p>`,
  `<p className="mt-2 max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed [overflow-wrap:anywhere]">{stem}</p>`,
);

replaceOnce(
  'mobile details region',
  `<div className="ml-16 mt-3 grid gap-4 rounded-lg border bg-background p-4 lg:grid-cols-2">`,
  `<div\n          id={detailsId}\n          className="mt-3 grid min-w-0 max-w-full gap-4 rounded-lg border bg-background p-3 sm:ml-16 sm:p-4 xl:grid-cols-2"\n          aria-label={\`Details for generated item \${item.itemNumber}\`}\n        >`,
);

replaceOnce(
  'option wrapping',
  `<div key={\`\${item.id}-\${index}\`} className={cn('rounded-md border px-3 py-2 text-xs', index === correctIndex && 'border-success/40 bg-success/5 text-success')}>\n                    <span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option}\n                  </div>`,
  `<div\n                    key={\`\${item.id}-\${index}\`}\n                    className={cn(\n                      'max-w-full break-words rounded-md border px-3 py-2 text-xs [overflow-wrap:anywhere]',\n                      index === correctIndex && 'border-success/40 bg-success/5 text-success',\n                    )}\n                  >\n                    <span className="mr-2 font-mono font-bold">{String.fromCharCode(65 + index)}.</span>{option}\n                  </div>`,
);

replaceOnce(
  'native explanation renderer',
  `<p className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">{explanation}</p>`,
  `<QuestionExplanationDisclosure payload={item.payload} />`,
);

replaceOnce(
  'mobile metadata grid',
  `<div className="mt-4 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">`,
  `<div className="mt-4 grid min-w-0 grid-cols-1 gap-2 text-[10px] text-muted-foreground sm:grid-cols-2">`,
);

writeFileSync(target, source, 'utf8');
