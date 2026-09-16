import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { renderEng002Cp012ReviewMarkdownV1 } from "./eng-002-cp012-review-v1-export";

const output = resolve(process.argv[2] ?? "artifacts/api-server/dist/english-v1/ENG-002-CP012-REVIEW-V1.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, renderEng002Cp012ReviewMarkdownV1(), "utf8");
console.log(`Materialized ${output}`);
