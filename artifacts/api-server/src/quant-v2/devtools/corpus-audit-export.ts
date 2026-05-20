import { runCorpusAuditExport } from "../corpus-audit/corpus-audit-exporter";
import { CORPUS_AUDIT_PRESETS, isCorpusAuditPresetId } from "../corpus-audit/corpus-audit-presets";
import type { CorpusAuditExportOptions, CorpusAuditPresetId } from "../corpus-audit/corpus-audit-types";

function argValue(name: string) {
  const prefix = `--${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function parseCount() {
  const value = Number(argValue("count") ?? "1000");
  return Number.isFinite(value) ? value : 1000;
}

function parsePreset(): CorpusAuditPresetId | undefined {
  const value = argValue("preset");
  if (!value) return undefined;
  if (isCorpusAuditPresetId(value)) return value;

  throw new Error(
    `Unknown corpus audit preset '${value}'. Available presets: ${CORPUS_AUDIT_PRESETS.map((preset) => preset.id).join(", ")}`,
  );
}

async function main() {
  if (hasFlag("help")) {
    console.log(`Corpus audit export

Usage:
  pnpm corpus:audit -- --count=1000
  pnpm corpus:audit -- --preset=banking_relational_audit --count=5000

Options:
  --count=N              Number of questions to export. Max: 20000.
  --preset=ID            ${CORPUS_AUDIT_PRESETS.map((preset) => preset.id).join(" | ")}
  --out=DIR              Output directory. Defaults to exports/corpus-YYYY-MM-DD-HHmmss.
  --seed=TEXT            Deterministic seed prefix.
  --profile=ID           audit_light | multilingual_review | realism_review | topology_audit | editorial_pdf
  --include-multilingual-explanations Include Hindi/Punjabi explanations even if the profile is light.
  --use-scheduler        Use R7 corpus scheduler for batch balancing.
  --scheduler-profile=ID balanced_mock | ssc_mock | banking_mock | railway_mock | punjab_state_mock
  --no-svg               Exclude SVG payloads from corpus.json.
  --include-full-question Include the complete admin question payload in corpus.json.
`);
    return;
  }

  const options: CorpusAuditExportOptions = {
    count: parseCount(),
    presetId: parsePreset(),
    outDir: argValue("out"),
    seed: argValue("seed"),
    exportProfile: argValue("profile") as any,
    includeMultilingualExplanations: hasFlag(
      "include-multilingual-explanations",
    )
      ? true
      : undefined,
    includeSvg: !hasFlag("no-svg"),
    includeFullQuestion: hasFlag("include-full-question"),
    useScheduler: hasFlag("use-scheduler"),
    schedulerProfile: argValue("scheduler-profile") as any,
  };

  const result = await runCorpusAuditExport(options, (progress) => {
    if (
      progress.generatedCount === options.count ||
      progress.generatedCount % 1000 === 0
    ) {
      console.log(
        `Generated ${progress.generatedCount}/${options.count} samples -> ${progress.outputDir}`,
      );
    }
  });

  console.log("");
  console.log("Corpus audit export completed.");
  console.log(`Output directory: ${result.outputDir}`);
  console.log(`JSON: ${result.files.json}`);
  console.log(`TXT: ${result.files.txt}`);
  console.log(`Summary: ${result.files.summary}`);
  console.log(`Preview: ${result.files.preview}`);
  console.log(`Duration: ${result.durationMs}ms`);
  console.log(
    `Topology families: ${Object.keys(result.summary.topologyDistribution).length}`,
  );
  console.log(
    `Average realism: ${result.summary.realismScores.average}`,
  );
  if (result.summary.exportWarnings.length) {
    console.log("Warnings:");
    for (const warning of result.summary.exportWarnings) {
      console.log(`- ${warning}`);
    }
  }
}

if (process.argv[1]?.endsWith("corpus-audit-export.mjs")) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
