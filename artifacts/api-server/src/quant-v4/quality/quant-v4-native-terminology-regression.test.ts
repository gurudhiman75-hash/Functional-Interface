import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const ROOT = fileURLToPath(new URL("../topics", import.meta.url));

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) files.push(...walk(path));
    else if (stat.isFile() && path.endsWith(".ts")) files.push(path);
  }
  return files;
}

function isLearnerLocalizationSource(path: string) {
  const normalized = path.replaceAll("\\", "/").toLowerCase();
  if (/\.test\.ts$/.test(normalized)) return false;
  if (normalized.includes("/quality/")) return false;
  if (normalized.includes("runtime-human-final") || normalized.includes("runtime-human-review")) return false;
  return normalized.includes("/localization/")
    || normalized.includes("localization-review")
    || normalized.includes("multilingual-builder")
    || normalized.includes("multilingual-runtime")
    || normalized.includes("native-runtime");
}

const defects: { file: string; term: string; excerpt: string }[] = [];
let scannedFiles = 0;

for (const path of walk(ROOT)) {
  if (!isLearnerLocalizationSource(path)) continue;
  scannedFiles += 1;
  const original = readFileSync(path, "utf8");

  // Genuine semantic uses stay valid. The guard targets literal translation
  // where the intended concept is a column, chart value or power expression.
  const content = original
    .replaceAll("प्रकाश स्तंभ", "")
    .replaceAll("लौह स्तंभ", "");

  const patterns: readonly [RegExp, string][] = [
    [/स्तंभ/u, "Hindi literal स्तंभ in learner localization"],
    [/ਸਤੰਭ/u, "Punjabi literal ਸਤੰਭ in learner localization"],
    [/घात-वर्ग समुच्चय/u, "Hindi literal exponent-class compound"],
    [/ਘਾਤ-ਵਰਗ ਸਮੂਹ/u, "Punjabi literal exponent-class compound"],
  ];

  for (const [pattern, label] of patterns) {
    const match = content.match(pattern);
    if (!match || match.index === undefined) continue;
    const start = Math.max(0, match.index - 90);
    const end = Math.min(content.length, match.index + match[0].length + 90);
    defects.push({
      file: relative(ROOT, path).replaceAll("\\", "/"),
      term: label,
      excerpt: content.slice(start, end).replaceAll("\n", " "),
    });
  }
}

assert(scannedFiles > 0, "Native terminology guard did not scan any learner localization sources.");
assert(
  defects.length === 0,
  `Quant V4 learner localization contains literal/native terminology defects:\n${defects.map((d) => `- ${d.file}: ${d.term}: ${d.excerpt}`).join("\n")}`,
);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_NATIVE_TERMINOLOGY_REGRESSION",
  scannedFiles,
  defects: defects.length,
}));
