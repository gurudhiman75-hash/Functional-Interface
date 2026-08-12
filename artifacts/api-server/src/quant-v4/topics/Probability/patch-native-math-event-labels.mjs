import fs from "node:fs";

const root = "artifacts/api-server/src/quant-v4/topics/Probability";
const mirrorPath = `${root}/shared/native-source-explanation-mirror.ts`;
const testPath = `${root}/multilingual-runtime.test.ts`;
const workflowPath = ".github/workflows/validate-prb-multilingual-foundation.yml";

let mirror = fs.readFileSync(mirrorPath, "utf8");
const importAnchor = `import { naturalizeProbabilityExplanationBody } from "./native-source-explanation-naturalizer";\n`;
const newImport = `import {\n  canonicalizeProbabilityExplanationMathSegment,\n  localizeProbabilityExplanationMathSegment,\n} from "./native-math-event-labels";\n`;
if (!mirror.includes(newImport)) {
  if (!mirror.includes(importAnchor)) throw new Error("mirror import anchor missing");
  mirror = mirror.replace(importAnchor, importAnchor + newImport);
}
mirror = mirror.replace(
  `function protectMath(value: string): { text: string; math: string[] } {`,
  `function protectMath(value: string, language: ProbabilityNativeLanguage): { text: string; math: string[] } {`,
);
mirror = mirror.replace(
  `      const index = math.push(token) - 1;`,
  `      const index = math.push(localizeProbabilityExplanationMathSegment(token, language)) - 1;`,
);
mirror = mirror.replace(
  `  const protectedLine = protectMath(sourceLine);`,
  `  const protectedLine = protectMath(sourceLine, language);`,
);
const oldParity = `  if (mathSegments(sourceLine).join("\\u0000") !== mathSegments(nativeLine).join("\\u0000")) {\n    throw new Error(\`Probability native explanation changed English-authority MathJax: \${sourceLine}\`);\n  }`;
const newParity = `  const canonicalNativeMath = mathSegments(nativeLine).map((segment) =>\n    canonicalizeProbabilityExplanationMathSegment(segment, language));\n  if (mathSegments(sourceLine).join("\\u0000") !== canonicalNativeMath.join("\\u0000")) {\n    throw new Error(\`Probability native explanation changed English-authority MathJax semantics: \${sourceLine}\`);\n  }`;
if (!mirror.includes(newParity)) {
  if (!mirror.includes(oldParity)) throw new Error("mirror parity anchor missing");
  mirror = mirror.replace(oldParity, newParity);
}
fs.writeFileSync(mirrorPath, mirror);

let test = fs.readFileSync(testPath, "utf8");
const testImportAnchor = `import type { ProbabilityQuestion } from "./shared/types";\n`;
const testImport = `import { canonicalizeProbabilityExplanationMathSegment } from "./shared/native-math-event-labels";\n`;
if (!test.includes(testImport)) {
  if (!test.includes(testImportAnchor)) throw new Error("test import anchor missing");
  test = test.replace(testImportAnchor, testImportAnchor + testImport);
}
const oldTestParity = `    assert.deepEqual(\n      mathSegments(nativeLine),\n      mathSegments(englishLine),\n      \`\${source.questionLanguageId}/\${language}: MathJax changed at line \${index + 1}\`,\n    );`;
const newTestParity = `    assert.deepEqual(\n      mathSegments(nativeLine).map((segment) => canonicalizeProbabilityExplanationMathSegment(segment, language)),\n      mathSegments(englishLine),\n      \`\${source.questionLanguageId}/\${language}: MathJax semantics changed at line \${index + 1}\`,\n    );`;
if (!test.includes(newTestParity)) {
  if (!test.includes(oldTestParity)) throw new Error("test parity anchor missing");
  test = test.replace(oldTestParity, newTestParity);
}
fs.writeFileSync(testPath, test);

let workflow = fs.readFileSync(workflowPath, "utf8");
const wfAnchor = `      - name: Validate ML-05 multilingual runtime parity\n        run: npx -y tsx artifacts/api-server/src/quant-v4/topics/Probability/multilingual-runtime.test.ts\n`;
const wfStep = `      - name: Validate native math event labels\n        run: npx -y tsx artifacts/api-server/src/quant-v4/topics/Probability/native-math-event-labels.test.ts\n`;
if (!workflow.includes(wfStep)) {
  if (!workflow.includes(wfAnchor)) throw new Error("workflow anchor missing");
  workflow = workflow.replace(wfAnchor, wfAnchor + wfStep);
}
fs.writeFileSync(workflowPath, workflow);
console.log("Materialized closed native math event-label localization.");
