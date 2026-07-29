import fs from "node:fs";
import path from "node:path";

const root = path.resolve(
  "artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/ProfitAndLoss/PNL-001",
);
const cp = path.join(root, "CP-002");

function compactEntryLibrary(file) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const topEntries = Object.entries(data).filter(
    ([key]) => key !== "entries" && key !== "entryCount",
  );
  const lines = ["{"];
  topEntries.forEach(([key, value], index) => {
    const suffix = index === topEntries.length - 1 ? "," : ",";
    lines.push(`  ${JSON.stringify(key)}: ${JSON.stringify(value)}${suffix}`);
  });
  lines.push('  "entries": {');
  const entries = Object.entries(data.entries);
  entries.forEach(([key, value], index) => {
    const suffix = index === entries.length - 1 ? "" : ",";
    lines.push(`    ${JSON.stringify(key)}: ${JSON.stringify(value)}${suffix}`);
  });
  if (Object.hasOwn(data, "entryCount")) {
    lines.push(`  },`);
    lines.push(`  "entryCount": ${JSON.stringify(data.entryCount)}`);
  } else {
    lines.push(`  }`);
  }
  lines.push("}");
  fs.writeFileSync(file, `${lines.join("\n")}\n`);
}

compactEntryLibrary(path.join(cp, "task-registry.library.json"));
for (const language of ["en", "hi", "pa"]) {
  compactEntryLibrary(path.join(cp, `question-language.${language}.json`));
}

for (const file of [
  path.join(root, ".pnl-001-english-editorial-audit.mjs"),
  path.join(root, ".question-studio-integration.test.mjs"),
  path.join(root, ".question-studio-review-runtime.test.mjs"),
  path.join(cp, ".cp002-dynamic-runtime.test.mjs"),
]) {
  fs.rmSync(file, { force: true });
}

console.log(
  JSON.stringify(
    {
      status: "CLEANED",
      compactLibraries: 4,
      removedGeneratedBundles: 4,
    },
    null,
    2,
  ),
);
