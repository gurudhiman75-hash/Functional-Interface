import fs from "node:fs";
import path from "node:path";
import { renderEng002Cp013ReviewMarkdownV1 } from "./eng-002-cp013-review-v1-export";

const output = path.resolve(process.cwd(), "artifacts/api-server/dist/english-v1/ENG-002-CP013-REVIEW-V1.md");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, renderEng002Cp013ReviewMarkdownV1(), "utf8");
console.log(output);
