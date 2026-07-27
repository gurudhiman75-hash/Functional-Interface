import { writeFileSync } from "node:fs";

const reportPath = "artifacts/api-server/src/reasoning-v1/topics/Analogy/ANA-001/ANA-CP-008/cp008-english-language-prototype-report.json";

interface EnglishPrototypeDiagnosticReport {
  status: "success" | "failure";
  generatedAt: string;
  errorName?: string;
  errorMessage?: string;
  stack?: string;
}

async function run(): Promise<void> {
  let report: EnglishPrototypeDiagnosticReport;
  try {
    await import("./provisional-language-templates.en.test");
    report = {
      status: "success",
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    const normalized = error instanceof Error ? error : new Error(String(error));
    report = {
      status: "failure",
      generatedAt: new Date().toISOString(),
      errorName: normalized.name,
      errorMessage: normalized.message,
      stack: normalized.stack,
    };
    writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
    throw normalized;
  }

  writeFileSync(reportPath, JSON.stringify(report, null, 2) + "\n", "utf8");
}

void run();
