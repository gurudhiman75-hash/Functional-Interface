import { readFileSync, writeFileSync } from 'node:fs';

const file = 'artifacts/admin-app/src/pages/content/QuestionStudioLivePage.tsx';
let source = readFileSync(file, 'utf8');

function replaceRequired(search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Unable to apply ${label}: expected source was not found.`);
  }
  source = source.replace(search, replacement);
}

replaceRequired(
  "import { useEffect, useMemo, useState } from 'react';",
  "import { useEffect, useMemo, useState, type ReactNode } from 'react';",
  'ReactNode import',
);

replaceRequired(
  `  const activePackage = enabledPackages.find((entry) => entry.packageId === packageId);\n  const supportedLanguages = activePackage?.supportedLanguages.length\n    ? activePackage.supportedLanguages\n    : ['en'];`,
  `  const activePackage = enabledPackages.find((entry) => entry.packageId === packageId);\n  const supportedLanguages = useMemo(\n    () => activePackage?.supportedLanguages.length\n      ? activePackage.supportedLanguages\n      : ['en'],\n    [activePackage],\n  );`,
  'stable supported languages',
);

replaceRequired(
  `    for (const { run, item } of allItems) {\n      if (item.status === 'unreviewed') values.unreviewed += 1;\n      if (item.status === 'needs_fix') values.needsFix += 1;\n      if (item.status === 'approved') values.approved += 1;\n      if (item.status === 'rejected') values.rejected += 1;\n      values.actualCostPaise += run.actualCostPaise ?? 0;\n    }\n    return values;\n  }, [allItems, dashboard.runs.length]);`,
  `    for (const { item } of allItems) {\n      if (item.status === 'unreviewed') values.unreviewed += 1;\n      if (item.status === 'needs_fix') values.needsFix += 1;\n      if (item.status === 'approved') values.approved += 1;\n      if (item.status === 'rejected') values.rejected += 1;\n    }\n    values.actualCostPaise = dashboard.runs.reduce(\n      (total, run) => total + (run.actualCostPaise ?? 0),\n      0,\n    );\n    return values;\n  }, [allItems, dashboard.runs]);`,
  'run cost accounting',
);

source = source.replaceAll('React.ReactNode', 'ReactNode');
writeFileSync(file, source);
console.log('Final live Question Studio polish applied.');
