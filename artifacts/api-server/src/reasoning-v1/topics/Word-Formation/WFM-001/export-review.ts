import { writeFileSync } from "node:fs";
import { buildWfm001ReviewPack, renderWfm001ReviewMarkdown } from "./review-pack";
import type { WfmLanguage } from "./types";

const language = (process.argv[2] ?? "en-IN") as WfmLanguage;
const outputPath = process.argv[3];
const perDifficulty = Number(process.argv[4] ?? 2);
const markdown = renderWfm001ReviewMarkdown(buildWfm001ReviewPack(language, perDifficulty));

if (outputPath) writeFileSync(outputPath, markdown, "utf8");
else process.stdout.write(markdown);
