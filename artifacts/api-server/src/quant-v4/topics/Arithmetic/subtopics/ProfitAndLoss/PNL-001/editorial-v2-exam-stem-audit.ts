import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { EditorialLibraryFile } from "./foundation/editorial-library";
import {
  hasSyntheticStemLead,
  type EditorialStemLanguage,
} from "./foundation/editorial-v2-exam-stems";

const root = dirname(fileURLToPath(import.meta.url));
const cpFolders = ["CP-001", "CP-002", "CP-003", "CP-004", "CP-005", "CP-006"] as const;
const languages = ["en", "hi", "pa"] as const;

const forbiddenMetaOpenings: Readonly<Record<EditorialStemLanguage, RegExp>> = {
  en: /^(?:During\b|Consider this\b|Use the following information\b|The following commercial records\b|This .+? transaction is described below\b)/u,
  hi: /^(?:.+? से जुड़े एक व्यावहारिक प्रश्न|.+? के एक वास्तविक व्यावसायिक रिकॉर्ड|.+? की मूल्य-निर्धारण स्थिति नीचे|निम्न विवरण .+? से जुड़े एक लेन-देन|.+? के दिए गए आंकड़ों का उपयोग)/u,
  pa: /^(?:.+? ਨਾਲ ਜੁੜੇ ਇੱਕ ਵਿਆਵਹਾਰਿਕ ਪ੍ਰਸ਼ਨ|.+? ਦੇ ਇੱਕ ਅਸਲ ਵਪਾਰਕ ਰਿਕਾਰਡ|.+? ਦੀ ਕੀਮਤ-ਨਿਰਧਾਰਨ ਸਥਿਤੀ ਹੇਠਾਂ|ਹੇਠਾਂ ਦਿੱਤਾ ਵੇਰਵਾ .+? ਨਾਲ ਜੁੜੇ ਇੱਕ ਲੈਣ-ਦੇਣ|.+? ਦੇ ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਦੀ ਵਰਤੋਂ)/u,
};

let totalEntries = 0;
let paragraphEntries = 0;
let structuredEntries = 0;
const violations: string[] = [];
const emptyStemEntries: string[] = [];

for (const cp of cpFolders) {
  for (const language of languages) {
    const path = join(root, cp, `editorial-content.${language}.json`);
    const library = JSON.parse(readFileSync(path, "utf8")) as EditorialLibraryFile;
    for (const [qlId, entry] of Object.entries(library.entries)) {
      totalEntries += 1;
      if (entry.stem.blocks.length === 0) emptyStemEntries.push(`${qlId}:${language}`);
      if (entry.stem.blocks.some((block) => block.type !== "paragraph")) structuredEntries += 1;
      for (const block of entry.stem.blocks) {
        if (block.type !== "paragraph") continue;
        paragraphEntries += 1;
        if (hasSyntheticStemLead(language, block.content) || forbiddenMetaOpenings[language].test(block.content.trim())) {
          violations.push(`${qlId}:${language}:${block.content.slice(0, 120)}`);
        }
      }
    }
  }
}

assert.equal(totalEntries, 558, "The chapter must contain 186 QLs in each of three languages.");
assert.deepEqual(emptyStemEntries, [], `Question stems with no content blocks remain: ${emptyStemEntries.join(", ")}`);
assert.deepEqual(violations, [], `Synthetic question-stem introductions remain:\n${violations.join("\n")}`);

console.log(JSON.stringify({
  ok: true,
  totalEntries,
  paragraphEntries,
  structuredEntries,
  emptyStemEntries: emptyStemEntries.length,
  syntheticLeadViolations: violations.length,
  policy: "Direct questions begin with the commercial facts. Context introductions are reserved for genuine structured representations.",
}, null, 2));
