import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { renderEng002Cp005ReviewMarkdownV1 } from "./eng-002-cp005-review-v1-export";

const output = resolve(process.argv[2] ?? "dist/english-v1/ENG-002-CP005-REVIEW-V1.md");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, renderEng002Cp005ReviewMarkdownV1(), "utf8");
console.log(output);
