import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { PCT_001_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/library";
import { PCT_002_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/library";
import { RAP_001_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/library";

const DIAGNOSTICS_PATH = resolve(
  process.cwd(),
  "tmp/quant-v4-ql-overfragmentation-p1-diagnostics.json",
);

const MAX_QLS_PER_CONTRACT = 4;

const DOCUMENTARY_WORDS = [
  "memo",
  "notice",
  "register",
  "report",
  "record",
  "schedule",
  "ledger",
  "sheet",
  "circular",
  "bulletin",
  "log",
  "timetable",
] as const;

const DOCUMENTARY_PATTERN = new RegExp(
  `\\b(?:${DOCUMENTARY_WORDS.join("|")})\\b`,
  "i",
);

type RegistryLike = {
  questionLanguage: {
    en: Record<string, { families?: Record<string, { template?: string; difficulty?: string }> }>;
  };
  taskRegistry: {
    entries: Record<
      string,
      {
        cpId?: string;
        taskKind?: string;
        answerType?: string;
        requiredVariables?: readonly string[];
      }
    >;
  };
};

type QlRow = {
  packageId: string;
  cpId: string;
  qlId: string;
  taskKind: string;
  answerType: string;
  requiredVariables: string[];
  difficulty: string;
  template: string;
  contractSignature: string;
  normalizedTemplate: string;
  hasDocumentaryWrapper: boolean;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function normalizeTemplate(template: string) {
  return String(template ?? "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function contractSignature(row: Omit<QlRow, "contractSignature" | "normalizedTemplate" | "hasDocumentaryWrapper">) {
  return [
    row.packageId,
    row.cpId,
    row.taskKind,
    row.answerType,
    [...row.requiredVariables].sort().join(","),
    row.difficulty,
  ].join("|");
}

function collectRows(packageId: string, registry: RegistryLike): QlRow[] {
  const rows: QlRow[] = [];

  for (const [cpId, cp] of Object.entries(registry.questionLanguage.en ?? {})) {
    for (const [qlId, entry] of Object.entries(cp?.families ?? {})) {
      const task = registry.taskRegistry.entries[qlId];
      assert(task, `${packageId}:${cpId}:${qlId} is missing a task-registry entry.`);
      assert(task.cpId === cpId, `${packageId}:${qlId} task-registry CP mismatch ${String(task.cpId)} != ${cpId}.`);
      const template = String(entry?.template ?? "").trim();
      assert(template.length > 0, `${packageId}:${cpId}:${qlId} has an empty English template.`);

      const base = {
        packageId,
        cpId,
        qlId,
        taskKind: String(task.taskKind ?? "<missing-task-kind>"),
        answerType: String(task.answerType ?? "<missing-answer-type>"),
        requiredVariables: [...(task.requiredVariables ?? [])].map(String),
        difficulty: String(entry?.difficulty ?? "<missing-difficulty>"),
        template,
      };

      rows.push({
        ...base,
        contractSignature: contractSignature(base),
        normalizedTemplate: normalizeTemplate(template),
        hasDocumentaryWrapper: DOCUMENTARY_PATTERN.test(template),
      });
    }
  }

  return rows;
}

function groupRows(rows: readonly QlRow[], key: (row: QlRow) => string) {
  const groups = new Map<string, QlRow[]>();
  for (const row of rows) {
    const signature = key(row);
    const bucket = groups.get(signature) ?? [];
    bucket.push(row);
    groups.set(signature, bucket);
  }
  return [...groups.entries()].map(([signature, members]) => ({ signature, members }));
}

function packageReport(packageId: string, rows: readonly QlRow[]) {
  const exactTemplateClusters = groupRows(rows, (row) => `${row.cpId}|${row.normalizedTemplate}`)
    .filter((group) => new Set(group.members.map((row) => row.qlId)).size > 1)
    .map((group) => ({
      cpId: group.members[0]!.cpId,
      count: group.members.length,
      qlIds: group.members.map((row) => row.qlId),
      template: group.members[0]!.template,
    }))
    .sort((left, right) => right.count - left.count);

  const contractGroups = groupRows(rows, (row) => row.contractSignature)
    .map((group) => {
      const first = group.members[0]!;
      const documentaryMembers = group.members.filter((row) => row.hasDocumentaryWrapper);
      return {
        cpId: first.cpId,
        taskKind: first.taskKind,
        answerType: first.answerType,
        difficulty: first.difficulty,
        requiredVariables: first.requiredVariables,
        qlCount: group.members.length,
        qlIds: group.members.map((row) => row.qlId),
        uniqueTemplateCount: new Set(group.members.map((row) => row.normalizedTemplate)).size,
        documentaryWrapperCount: documentaryMembers.length,
        documentaryQlIds: documentaryMembers.map((row) => row.qlId),
        examples: group.members.slice(0, 8).map((row) => ({
          qlId: row.qlId,
          template: row.template,
        })),
      };
    })
    .sort((left, right) => right.qlCount - left.qlCount);

  const overfragmentedContracts = contractGroups.filter(
    (group) => group.qlCount > MAX_QLS_PER_CONTRACT,
  );

  const documentaryRows = rows.filter((row) => row.hasDocumentaryWrapper);
  const documentaryWithinOverfragmented = overfragmentedContracts.flatMap((group) =>
    group.documentaryQlIds.map((qlId) => ({
      cpId: group.cpId,
      taskKind: group.taskKind,
      qlId,
    })),
  );

  const violations: string[] = [];
  if (exactTemplateClusters.length > 0) {
    violations.push(`exact_template_duplicate_clusters=${exactTemplateClusters.length}`);
  }
  if (overfragmentedContracts.length > 0) {
    violations.push(
      `mathematical_contract_groups_over_${MAX_QLS_PER_CONTRACT}=${overfragmentedContracts.length}`,
    );
  }

  return {
    packageId,
    qlCount: rows.length,
    mathematicalContractCount: contractGroups.length,
    exactTemplateDuplicateClusters: exactTemplateClusters.length,
    overfragmentedContractCount: overfragmentedContracts.length,
    documentaryWrapperQlCount: documentaryRows.length,
    documentaryQlCountInsideOverfragmentedContracts: documentaryWithinOverfragmented.length,
    violations,
    topExactTemplateDuplicateClusters: exactTemplateClusters.slice(0, 20),
    topOverfragmentedContracts: overfragmentedContracts.slice(0, 30),
    topContractGroups: contractGroups.slice(0, 30),
    documentaryWrapperExamples: documentaryRows.slice(0, 30).map((row) => ({
      cpId: row.cpId,
      qlId: row.qlId,
      taskKind: row.taskKind,
      template: row.template,
    })),
  };
}

function persistDiagnostics(payload: Record<string, unknown>) {
  mkdirSync(dirname(DIAGNOSTICS_PATH), { recursive: true });
  writeFileSync(DIAGNOSTICS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.error(`QUANT_V4_QL_OVERFRAGMENTATION_DIAGNOSTICS=${JSON.stringify(payload)}`);
}

function main() {
  const registries = [
    ["PCT-001", PCT_001_LIBRARY_REGISTRY],
    ["PCT-002", PCT_002_LIBRARY_REGISTRY],
    ["RAP-001", RAP_001_LIBRARY_REGISTRY],
  ] as const;

  const reports = registries.map(([packageId, registry]) =>
    packageReport(packageId, collectRows(packageId, registry as RegistryLike)),
  );

  const violations = reports.flatMap((report) =>
    report.violations.map((violation) => `${report.packageId}:${violation}`),
  );
  const passed = violations.length === 0;

  const result = {
    status: passed
      ? "PASS_QUANT_V4_QL_OVERFRAGMENTATION_P1"
      : "FAIL_QUANT_V4_QL_OVERFRAGMENTATION_P1",
    packages: reports.map((report) => report.packageId),
    policy: {
      maxActiveQlPerMathematicalContract: MAX_QLS_PER_CONTRACT,
      exactDuplicateTemplatesAcrossQlIds: "not allowed",
      documentaryWrappers: "diagnostic; they do not justify a redundant QL",
      contractFields: [
        "package",
        "canonicalProblemId",
        "taskKind",
        "answerType",
        "requiredVariables",
        "difficulty",
      ],
      intent:
        "keep meaningful exam variety while retiring or aliasing superficial QL clones instead of manufacturing surface wording",
    },
    violations,
    reports,
  };

  persistDiagnostics(result);
  console.log(JSON.stringify(result));
  if (!passed) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  const err = error instanceof Error ? error : new Error(String(error));
  persistDiagnostics({
    status: "FAIL_QUANT_V4_QL_OVERFRAGMENTATION_P1",
    message: err.message,
    stack: err.stack ?? null,
  });
  process.exitCode = 1;
}
