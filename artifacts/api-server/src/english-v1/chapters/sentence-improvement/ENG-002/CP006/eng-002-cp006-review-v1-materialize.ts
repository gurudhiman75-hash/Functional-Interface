import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { renderEng002Cp006ReviewMarkdownV1 } from "./eng-002-cp006-review-v1-export";

const output = resolve(process.argv[2] ?? "artifacts/api-server/dist/english-v1/ENG-002-CP006-REVIEW-V1.md");
await mkdir(dirname(output), { recursive: true });
await writeFile(output, renderEng002Cp006ReviewMarkdownV1(), "utf8");
console.log(`Materialized ${output}`);
