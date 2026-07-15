import { readFileSync, writeFileSync } from 'node:fs';

function patchFile(file, patches) {
  let source = readFileSync(file, 'utf8');
  for (const { search, replacement, label } of patches) {
    if (!source.includes(search)) {
      throw new Error(`Unable to apply ${label} in ${file}: expected source was not found.`);
    }
    source = source.replace(search, replacement);
  }
  writeFileSync(file, source);
}

patchFile('artifacts/admin-app/src/pages/content/QuestionStudioLivePage.tsx', [
  {
    label: 'ES2020-compatible status formatting',
    search: `  return status.replaceAll('_', ' ').replace(/\\b\\w/g, (letter) => letter.toUpperCase());`,
    replacement: `  return status.replace(/_/g, ' ').replace(/\\b\\w/g, (letter: string) => letter.toUpperCase());`,
  },
]);

patchFile('artifacts/examtree/src/pages/login.tsx', [
  {
    label: 'admin login mode detection',
    search: `  const isAdminMode = false;`,
    replacement: `  const isAdminMode = location.startsWith('/login/admin');`,
  },
  {
    label: 'admin-aware post-login routing',
    search: `  const routeAfterAuth = (role?: string) => {\n    if (nextPath) {\n      setLocation(decodeURIComponent(nextPath));\n    } else {\n      setLocation(role === "admin" ? "/admin" : "/dashboard");\n    }\n  };`,
    replacement: `  const routeAfterAuth = (role?: string) => {\n    if (isAdminMode && role && role !== "admin") {\n      toast({\n        title: "Admin access only",\n        description: "This account is not authorized for the ExamTree admin console.",\n        variant: "destructive",\n      });\n      setLocation("/dashboard");\n      return;\n    }\n\n    const destination = nextPath\n      ? decodeURIComponent(nextPath)\n      : role === "admin"\n        ? "/admin/"\n        : "/dashboard";\n\n    if (destination === "/admin" || destination.startsWith("/admin/")) {\n      window.location.assign(destination === "/admin" ? "/admin/" : destination);\n      return;\n    }\n    setLocation(destination);\n  };`,
  },
  {
    label: 'admin development session role',
    search: `          role: "student",`,
    replacement: `          role: isAdminMode ? "admin" : "student",`,
  },
]);

patchFile('artifacts/api-server/src/routes/admin-question-studio.ts', [
  {
    label: 'parent run status derivation',
    search: `        const runStatus = total > 0 && approved === total\n          ? "approved"\n          : approved > 0 || rejected > 0\n            ? "partially_approved"\n            : needsFix > 0\n              ? "review"\n              : "review";`,
    replacement: `        const runStatus = total > 0 && approved === total\n          ? "approved"\n          : approved > 0\n            ? "partially_approved"\n            : "review";`,
  },
]);

console.log('Admin release corrections applied.');
