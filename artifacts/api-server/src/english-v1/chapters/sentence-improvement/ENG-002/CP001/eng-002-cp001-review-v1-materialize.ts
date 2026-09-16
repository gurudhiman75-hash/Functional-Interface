import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { renderEng002Cp001ReviewMarkdownV1 } from "./eng-002-cp001-review-v1-export";

const outputPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(process.cwd(), "dist/english-v1/ENG-002-CP001-REVIEW-V1.md");

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, renderEng002Cp001ReviewMarkdownV1(), "utf8");
console.log(`Materialized ENG-002 CP001 review Markdown at ${outputPath}`);
