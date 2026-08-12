import fs from "node:fs";

const path = "artifacts/api-server/src/quant-v4/topics/Probability/shared/native-source-explanation-mirror.ts";
let value = fs.readFileSync(path, "utf8");
const from = "  assertProbabilityNativeTextValid(nativeLine, language);\n  return nativeLine;";
const to = `  try {\n    assertProbabilityNativeTextValid(nativeLine, language);\n  } catch (error) {\n    throw new Error(\n      \`Probability native explanation audit failed: \${JSON.stringify({ language, sourceLine, nativeLine })}; \${error instanceof Error ? error.message : String(error)}\`,\n    );\n  }\n  return nativeLine;`;
if (!value.includes(to)) {
  if (!value.includes(from)) throw new Error("Could not find native explanation audit assertion.");
  value = value.replace(from, to);
}
fs.writeFileSync(path, value);
console.log("Enabled exact Probability native explanation audit diagnostics.");
