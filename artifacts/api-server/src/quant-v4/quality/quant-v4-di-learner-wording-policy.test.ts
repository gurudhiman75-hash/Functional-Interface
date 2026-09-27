import { readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const root = "artifacts/api-server/src/quant-v4/topics/DataInterpretation";
const activeSourceName = /(?:set-v2|task-builders(?:-v\d+)?|localization-review-v1)\.ts$/u;
const banned = /nearest whole|rounded? to the nearest|round to the nearest|give the nearest whole|to the nearest whole|निकटतम पूर्ण|पूर्णांकित(?: कीजिए)?|ਨਜ਼ਦੀਕੀ ਪੂਰੇ|ਨਜ਼ਦੀਕੀ ਪੂਰੀ|ਨਜ਼ਦੀਕੀ ਪੂਰਾ|ਗੋਲ ਕਰੋ/iu;

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const scanned: string[] = [];
const failures: Array<{ file: string; sample: string }> = [];

for (const file of walk(root)) {
  if (!file.endsWith(".ts") || file.endsWith(".test.ts")) continue;
  if (!activeSourceName.test(basename(file))) continue;
  scanned.push(file);
  const source = readFileSync(file, "utf8");
  const match = source.match(banned);
  if (match) {
    const start = Math.max(0, (match.index ?? 0) - 90);
    const end = Math.min(source.length, (match.index ?? 0) + match[0].length + 90);
    failures.push({ file, sample: source.slice(start, end).replace(/\s+/gu, " ") });
  }
}

assert(scanned.length >= 18, `DI wording policy scanned only ${scanned.length} active source files.`);
assert(failures.length === 0, `DI learner-facing rounding directives remain:\n${failures.map((item) => `- ${item.file}: ${item.sample}`).join("\n")}`);

console.log(JSON.stringify({
  status: "PASS_QUANT_V4_DI_LEARNER_WORDING_POLICY",
  scannedFiles: scanned.length,
  bannedRoundingDirectives: 0,
}));
