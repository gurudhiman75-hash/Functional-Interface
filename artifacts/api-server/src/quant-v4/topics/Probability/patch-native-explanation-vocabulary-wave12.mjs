import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/multilingual-runtime.ts";
let value = fs.readFileSync(path, "utf8");

value = value.replace(
  'import type { QuantLanguage } from "../contracts";\nimport { PRB_001 } from "./PRB-001";\nimport { PRB_002 } from "./PRB-002";',
  `import {\n  listPrb001QuestionEntries,\n  runPrb001Pipeline,\n  type Prb001CanonicalProblemId,\n} from "./PRB-001";\nimport {\n  listPrb002QuestionEntries,\n  runPrb002Pipeline,\n  type Prb002CanonicalProblemId,\n} from "./PRB-002";`,
);

value = value.replace(
  `import type {\n  ProbabilityPackage,\n  ProbabilityQuestion,\n  ProbabilityVisual,\n  ValidationCheck,\n  ValidationResult,\n} from "./shared/types";`,
  `import type {\n  ProbabilityCanonicalProblemId,\n  ProbabilityGenerationInput,\n  ProbabilityPackageId,\n  ProbabilityQuestion,\n  ProbabilityVisual,\n  ValidationCheck,\n  ValidationResult,\n} from "./shared/types";`,
);

const packageFor = /function packageFor\(packageId: "PRB-001" \| "PRB-002"\): ProbabilityPackage \{[\s\S]*?\n\}\n\n/u;
value = value.replace(packageFor, "");

value = value.replace(
  'function sourceExplanationId(source: ProbabilityQuestion): string {\n  return `${source.questionId}-EXP`;\n}',
  'function sourceExplanationId(source: ProbabilityQuestion): string {\n  return source.explanation.explanationId;\n}',
);

const parityTypeStart = value.indexOf("export interface ProbabilityMultilingualPreview {");
const parityTypeEnd = value.indexOf("type NativeEditorial", parityTypeStart);
if (parityTypeStart < 0 || parityTypeEnd < 0) throw new Error("Could not locate Probability multilingual parity type.");
const parityType = `export interface ProbabilityMultilingualPreview {\n  readonly source: ProbabilityQuestion;\n  readonly presentation: ProbabilityNativePresentation;\n  readonly parity: Readonly<{\n    sourceLanguage: "en";\n    targetLanguage: ProbabilityNativeLanguage;\n    sourceSeed: string;\n    sourceQuestionLanguageId: string;\n    parameterFingerprint: string;\n    mathematicalFingerprint: string;\n    optionPolicy: "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX";\n    answerKeyAuthority: "ENGLISH_RUNTIME";\n    solverAuthority: "ENGLISH_RUNTIME";\n    mockPolicyAuthority: "ENGLISH_RUNTIME";\n    exactOptionsPreserved: true;\n    answerPreserved: true;\n    correctIndexPreserved: true;\n  }>;\n}\n\n`;
value = value.slice(0, parityTypeStart) + parityType + value.slice(parityTypeEnd);

const oldParityReturn = `      sourceParameterFingerprint: source.traceability.parameterFingerprint,\n      sourceMathematicalFingerprint: source.traceability.mathematicalFingerprint,\n      optionPolicy: "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX",\n      answerKeyAuthority: "ENGLISH_RUNTIME",\n      solverAuthority: "ENGLISH_RUNTIME",\n      mockPolicyAuthority: "ENGLISH_RUNTIME",\n      optionsPreserved: true,\n      correctIndexPreserved: true,\n      answerPreserved: true,\n      parameterFingerprintPreserved: true,\n      mathematicalFingerprintPreserved: true,`;
const canonicalParityReturn = `      parameterFingerprint: source.parameterFingerprint,\n      mathematicalFingerprint: source.mathematicalFingerprint,\n      optionPolicy: "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX",\n      answerKeyAuthority: "ENGLISH_RUNTIME",\n      solverAuthority: "ENGLISH_RUNTIME",\n      mockPolicyAuthority: "ENGLISH_RUNTIME",\n      exactOptionsPreserved: true,\n      answerPreserved: true,\n      correctIndexPreserved: true,`;
if (!value.includes(oldParityReturn) && !value.includes(canonicalParityReturn)) {
  throw new Error("Could not locate Probability parity return block.");
}
value = value.replace(oldParityReturn, canonicalParityReturn);

const runStart = value.indexOf("export function runProbabilityNativePreview(");
if (runStart < 0) throw new Error("Could not locate Probability native preview runner.");
const canonicalTail = `export function runProbabilityNativePreview(\n  packageId: ProbabilityPackageId,\n  cpId: ProbabilityCanonicalProblemId,\n  language: ProbabilityNativeLanguage,\n  input: Omit<ProbabilityGenerationInput, "language"> = {},\n): ProbabilityMultilingualPreview {\n  const source = packageId === "PRB-001"\n    ? runPrb001Pipeline(cpId as Prb001CanonicalProblemId, { ...input, language: "en" })\n    : runPrb002Pipeline(cpId as Prb002CanonicalProblemId, { ...input, language: "en" });\n  if (source.packageId !== packageId || source.canonicalProblemId !== cpId) {\n    throw new Error(\`ML-05 source routing mismatch for \${packageId}/\${cpId}.\`);\n  }\n  return renderProbabilityNativePreview(source, language);\n}\n\nexport function listProbabilityMl05QlEntries(): readonly Readonly<{\n  packageId: ProbabilityPackageId;\n  cpId: ProbabilityCanonicalProblemId;\n  qlId: string;\n}>[] {\n  return [\n    ...listPrb001QuestionEntries().map((entry) => ({\n      packageId: "PRB-001" as const,\n      cpId: entry.cpId,\n      qlId: entry.qlId,\n    })),\n    ...listPrb002QuestionEntries().map((entry) => ({\n      packageId: "PRB-002" as const,\n      cpId: entry.cpId,\n      qlId: entry.qlId,\n    })),\n  ];\n}\n`;
value = value.slice(0, runStart) + canonicalTail;

fs.writeFileSync(path, value);
console.log("Restored canonical Probability package routing, fingerprints and parity contract.");
