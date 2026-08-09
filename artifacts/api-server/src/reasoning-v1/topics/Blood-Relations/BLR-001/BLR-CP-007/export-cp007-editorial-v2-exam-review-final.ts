import { readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = resolve(here, "export-cp007-editorial-v2-exam-review.ts");
const temporaryPath = resolve(here, ".export-cp007-editorial-v2-exam-review-final.generated.ts");
const original = readFileSync(sourcePath, "utf8");
const search = `import {\n  buildBlrCp007EditorialV2ExamReviewTelemetry,\n  generateBlrCp007EditorialV2ExamReviewBank,\n} from "./cp007-editorial-v2-exam-review";`;
const replacement = `import {\n  buildBlrCp007EditorialV2ExamReviewFinalTelemetry as buildBlrCp007EditorialV2ExamReviewTelemetry,\n  generateBlrCp007EditorialV2ExamReviewFinalBank as generateBlrCp007EditorialV2ExamReviewBank,\n} from "./cp007-editorial-v2-exam-review-final";`;
if (!original.includes(search)) {
  throw new Error("CP-007 final exporter could not locate the expected exam-review import block.");
}
writeFileSync(temporaryPath, original.replace(search, replacement));
try {
  await import(`${pathToFileURL(temporaryPath).href}?v=${Date.now()}`);
} finally {
  unlinkSync(temporaryPath);
}
