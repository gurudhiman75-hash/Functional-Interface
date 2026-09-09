import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import {
  curateDefaultQuestionLanguageIds,
  DEFAULT_MAX_QLS_PER_MATHEMATICAL_CONTRACT,
  SYNTHETIC_DOCUMENTARY_WRAPPER_PATTERN,
} from "../common/default-question-language-pool";
import { PCT_001_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/library";
import {
  getSelectableQuestionLanguageIds as getPct001SelectableQuestionLanguageIds,
} from "../topics/Arithmetic/subtopics/Percentage/PCT-001/parameter-generator";
import { runPct001Pipeline } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/pipeline";
import { PCT_002_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/library";
import {
  getSelectableQuestionLanguageIds as getPct002SelectableQuestionLanguageIds,
} from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator";
import { runPct002Pipeline } from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/pipeline";
import { RAP_001_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/library";
import {
  getSelectableQuestionLanguageIds as getRap001SelectableQuestionLanguageIds,
} from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/parameter-generator";
import { runRap001Pipeline } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/pipeline";

const DIAGNOSTICS_PATH = resolve(
  process.cwd(),
  "tmp/quant-v4-ql-overfragmentation-p1-diagnostics.json",
);

const MAX_QLS_PER_CONTRACT = DEFAULT_MAX_QLS_PER_MATHEMATICAL_CONTRACT;

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

type PackageAdapter = {
  packageId: string;
  registry: RegistryLike;
  getSelectable: (cpId: string) => string[];
  runExplicit: (cpId: string, qlId: string) => { questionLanguageId: string };
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

function contractSignature(
  row: Omit<QlRow, "contractSignature" | "normalizedTemplate" | "hasDocumentaryWrapper">,
) {
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
      assert(
        task.cpId === cpId,
        `${packageId}:${qlId} task-registry CP mismatch ${String(task.cpId)} != ${cpId}.`,
      );
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
        hasDocumentaryWrapper: SYNTHETIC_DOCUMENTARY_WRAPPER_PATTERN.test(template),
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

function qlMetadata(row: QlRow) {
  return {
    taskKind: row.taskKind,
    answerType: row.answerType,
    requiredVariables: row.requiredVariables,
    difficulty: row.difficulty,
    template: row.template,
  };
}

function runtimeLegacyRows(rows: readonly QlRow[], getSelectable: (cpId: string) => string[]) {
  const selectableIds = new Set<string>();
  for (const cpId of new Set(rows.map((row) => row.cpId))) {
    for (const qlId of getSelectable(cpId)) selectableIds.add(qlId);
  }
  return rows.filter((row) => selectableIds.has(row.qlId));
}

function curatedDefaultRows(rows: readonly QlRow[]) {
  const selectedIds = new Set<string>();
  for (const group of groupRows(rows, (row) => row.cpId)) {
    const rowById = new Map(group.members.map((row) => [row.qlId, row] as const));
    const curatedIds = curateDefaultQuestionLanguageIds(
      group.members.map((row) => row.qlId),
      (qlId) => {
        const row = rowById.get(qlId);
        assert(row, `Missing QL metadata for ${qlId}.`);
        return qlMetadata(row);
      },
    );
    curatedIds.forEach((qlId) => selectedIds.add(qlId));
  }
  return rows.filter((row) => selectedIds.has(row.qlId));
}

function contractSummaries(rows: readonly QlRow[]) {
  return groupRows(rows, (row) => row.contractSignature)
    .map((group) => {
      const first = group.members[0]!;
      const documentaryMembers = group.members.filter((row) => row.hasDocumentaryWrapper);
      return {
        signature: group.signature,
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
}

function exactTemplateClusters(rows: readonly QlRow[]) {
  return groupRows(rows, (row) => `${row.cpId}|${row.normalizedTemplate}`)
    .filter((group) => new Set(group.members.map((row) => row.qlId)).size > 1)
    .map((group) => ({
      cpId: group.members[0]!.cpId,
      count: group.members.length,
      qlIds: group.members.map((row) => row.qlId),
      template: group.members[0]!.template,
    }))
    .sort((left, right) => right.count - left.count);
}

function buildPackageAudit(adapter: PackageAdapter) {
  const registryRows = collectRows(adapter.packageId, adapter.registry);
  const legacyRows = runtimeLegacyRows(registryRows, adapter.getSelectable);
  const defaultRows = curatedDefaultRows(legacyRows);
  const defaultIdSet = new Set(defaultRows.map((row) => row.qlId));
  const suppressedRows = legacyRows.filter((row) => !defaultIdSet.has(row.qlId));

  const legacyContracts = contractSummaries(legacyRows);
  const defaultContracts = contractSummaries(defaultRows);
  const defaultExactDuplicates = exactTemplateClusters(defaultRows);
  const defaultOverfragmented = defaultContracts.filter(
    (contract) => contract.qlCount > MAX_QLS_PER_CONTRACT,
  );
  const legacyOverfragmented = legacyContracts.filter(
    (contract) => contract.qlCount > MAX_QLS_PER_CONTRACT,
  );

  const defaultContractSet = new Set(defaultContracts.map((contract) => contract.signature));
  const missingDefaultContracts = legacyContracts.filter(
    (contract) => !defaultContractSet.has(contract.signature),
  );

  const legacyByContract = new Map(
    groupRows(legacyRows, (row) => row.contractSignature).map((group) => [
      group.signature,
      group.members,
    ] as const),
  );
  const avoidableDocumentaryDefaults = defaultRows.filter((row) => {
    if (!row.hasDocumentaryWrapper) return false;
    const legacyMembers = legacyByContract.get(row.contractSignature) ?? [];
    return legacyMembers.some((member) => !member.hasDocumentaryWrapper);
  });

  const violations: string[] = [];
  if (defaultExactDuplicates.length > 0) {
    violations.push(`default_exact_template_duplicate_clusters=${defaultExactDuplicates.length}`);
  }
  if (defaultOverfragmented.length > 0) {
    violations.push(
      `default_mathematical_contract_groups_over_${MAX_QLS_PER_CONTRACT}=${defaultOverfragmented.length}`,
    );
  }
  if (missingDefaultContracts.length > 0) {
    violations.push(`legacy_contracts_missing_from_default_pool=${missingDefaultContracts.length}`);
  }
  if (avoidableDocumentaryDefaults.length > 0) {
    violations.push(
      `avoidable_documentary_wrappers_in_default_pool=${avoidableDocumentaryDefaults.length}`,
    );
  }

  return {
    adapter,
    suppressedRows,
    report: {
      packageId: adapter.packageId,
      registryEnglishQlCount: registryRows.length,
      runtimeLegacySelectableQlCount: legacyRows.length,
      activeDefaultQlCount: defaultRows.length,
      retiredFromDefaultCount: suppressedRows.length,
      runtimeLegacyMathematicalContractCount: legacyContracts.length,
      activeDefaultMathematicalContractCount: defaultContracts.length,
      legacyOverfragmentedContractCount: legacyOverfragmented.length,
      defaultOverfragmentedContractCount: defaultOverfragmented.length,
      defaultExactTemplateDuplicateClusters: defaultExactDuplicates.length,
      legacyDocumentaryWrapperQlCount: legacyRows.filter((row) => row.hasDocumentaryWrapper).length,
      activeDefaultDocumentaryWrapperQlCount: defaultRows.filter((row) => row.hasDocumentaryWrapper).length,
      avoidableDocumentaryWrapperDefaults: avoidableDocumentaryDefaults.length,
      missingDefaultContractCount: missingDefaultContracts.length,
      violations,
      topLegacyOverfragmentedContracts: legacyOverfragmented.slice(0, 30),
      topDefaultContracts: defaultContracts.slice(0, 30),
      topDefaultExactTemplateDuplicateClusters: defaultExactDuplicates.slice(0, 20),
      suppressedQlExamples: suppressedRows.slice(0, 40).map((row) => ({
        cpId: row.cpId,
        qlId: row.qlId,
        taskKind: row.taskKind,
        difficulty: row.difficulty,
        template: row.template,
      })),
      activeDocumentaryWrapperExamples: defaultRows
        .filter((row) => row.hasDocumentaryWrapper)
        .slice(0, 20)
        .map((row) => ({ cpId: row.cpId, qlId: row.qlId, template: row.template })),
    },
  };
}

function persistDiagnostics(payload: Record<string, unknown>) {
  mkdirSync(dirname(DIAGNOSTICS_PATH), { recursive: true });
  writeFileSync(DIAGNOSTICS_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.error(`QUANT_V4_QL_OVERFRAGMENTATION_DIAGNOSTICS=${JSON.stringify(payload)}`);
}

function main() {
  const adapters: PackageAdapter[] = [
    {
      packageId: "PCT-001",
      registry: PCT_001_LIBRARY_REGISTRY as RegistryLike,
      getSelectable: (cpId) => getPct001SelectableQuestionLanguageIds(cpId as never, "en"),
      runExplicit: (cpId, qlId) =>
        runPct001Pipeline(cpId as never, {
          language: "en",
          questionLanguageId: qlId,
          seed: `ql-overfragmentation:legacy:${qlId}`,
        }),
    },
    {
      packageId: "PCT-002",
      registry: PCT_002_LIBRARY_REGISTRY as RegistryLike,
      getSelectable: (cpId) => getPct002SelectableQuestionLanguageIds(cpId as never, "en"),
      runExplicit: (cpId, qlId) =>
        runPct002Pipeline(cpId as never, {
          language: "en",
          questionLanguageId: qlId,
          seed: `ql-overfragmentation:legacy:${qlId}`,
        }),
    },
    {
      packageId: "RAP-001",
      registry: RAP_001_LIBRARY_REGISTRY as RegistryLike,
      getSelectable: (cpId) => getRap001SelectableQuestionLanguageIds(cpId as never, "en"),
      runExplicit: (cpId, qlId) =>
        runRap001Pipeline(cpId as never, {
          language: "en",
          questionLanguageId: qlId,
          seed: `ql-overfragmentation:legacy:${qlId}`,
        }),
    },
  ];

  const packageAudits = adapters.map(buildPackageAudit);

  const legacyResolutionChecks = packageAudits.map(({ adapter, suppressedRows }) => {
    const candidate = suppressedRows[0];
    assert(candidate, `${adapter.packageId} has no suppressed legacy QL to verify.`);
    const generated = adapter.runExplicit(candidate.cpId, candidate.qlId);
    assert(
      generated.questionLanguageId === candidate.qlId,
      `${adapter.packageId} explicit legacy QL ${candidate.qlId} resolved to ${generated.questionLanguageId}.`,
    );
    return {
      packageId: adapter.packageId,
      cpId: candidate.cpId,
      requestedLegacyQlId: candidate.qlId,
      resolvedQlId: generated.questionLanguageId,
      preserved: true,
    };
  });

  const reports = packageAudits.map(({ report }) => report);
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
      exactDuplicateTemplatesAcrossActiveQlIds: "not allowed",
      legacyIds: "remain addressable but do not all participate in random/default generation",
      documentaryWrappers:
        "cannot occupy a default slot when the same mathematical contract has a clean alternative",
      contractFields: [
        "package",
        "canonicalProblemId",
        "taskKind",
        "answerType",
        "requiredVariables",
        "difficulty",
      ],
      coverageRule: "every runtime-selectable legacy mathematical contract keeps at least one default QL",
      intent:
        "keep meaningful exam variety while removing superficial clone waves from default generation",
    },
    violations,
    legacyResolutionChecks,
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
