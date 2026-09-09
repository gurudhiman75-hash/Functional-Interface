import {
  curateDefaultQuestionLanguageIds,
  type DefaultQuestionLanguageMetadata,
} from "../common/default-question-language-pool";
import { PCT_001_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/library";
import { getSelectableQuestionLanguageIds as getPct001Selectable } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/parameter-generator";
import { runPct001Pipeline } from "../topics/Arithmetic/subtopics/Percentage/PCT-001/pipeline";
import { PCT_002_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/library";
import { getSelectableQuestionLanguageIds as getPct002Selectable } from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/parameter-generator";
import { runPct002Pipeline } from "../topics/Arithmetic/subtopics/Percentage/PCT-002/foundation/pipeline";
import { RAP_001_LIBRARY_REGISTRY } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/library";
import { getSelectableQuestionLanguageIds as getRap001Selectable } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/parameter-generator";
import { runRap001Pipeline } from "../topics/Arithmetic/subtopics/RatioAndProportion/RAP-001/pipeline";

type RegistryLike = {
  questionLanguage: {
    en: Record<string, { families?: Record<string, { template?: string; difficulty?: string }> }>;
  };
  taskRegistry: {
    entries: Record<
      string,
      {
        taskKind?: string;
        answerType?: string;
        requiredVariables?: readonly string[];
      }
    >;
  };
};

type Adapter = {
  packageId: string;
  registry: RegistryLike;
  getSelectable: (cpId: string) => string[];
  runDefault: (cpId: string, seed: string) => { questionLanguageId: string };
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function curatedIdsForCp(adapter: Adapter, cpId: string) {
  const cp = adapter.registry.questionLanguage.en[cpId];
  assert(cp?.families, `${adapter.packageId}:${cpId} has no English QL families.`);
  const selectable = adapter.getSelectable(cpId);

  return curateDefaultQuestionLanguageIds(selectable, (qlId): DefaultQuestionLanguageMetadata => {
    const entry = cp.families![qlId];
    const task = adapter.registry.taskRegistry.entries[qlId];
    assert(entry, `${adapter.packageId}:${cpId}:${qlId} missing English QL entry.`);
    assert(task, `${adapter.packageId}:${cpId}:${qlId} missing task entry.`);
    return {
      taskKind: String(task.taskKind ?? "<missing-task-kind>"),
      answerType: String(task.answerType ?? "<missing-answer-type>"),
      requiredVariables: [...(task.requiredVariables ?? [])].map(String),
      difficulty: String(entry.difficulty ?? "<missing-difficulty>"),
      template: String(entry.template ?? ""),
    };
  });
}

function main() {
  const adapters: Adapter[] = [
    {
      packageId: "PCT-001",
      registry: PCT_001_LIBRARY_REGISTRY as RegistryLike,
      getSelectable: (cpId) => getPct001Selectable(cpId as never, "en"),
      runDefault: (cpId, seed) => runPct001Pipeline(cpId as never, { language: "en", seed }),
    },
    {
      packageId: "PCT-002",
      registry: PCT_002_LIBRARY_REGISTRY as RegistryLike,
      getSelectable: (cpId) => getPct002Selectable(cpId as never, "en"),
      runDefault: (cpId, seed) => runPct002Pipeline(cpId as never, { language: "en", seed }),
    },
    {
      packageId: "RAP-001",
      registry: RAP_001_LIBRARY_REGISTRY as RegistryLike,
      getSelectable: (cpId) => getRap001Selectable(cpId as never, "en"),
      runDefault: (cpId, seed) => runRap001Pipeline(cpId as never, { language: "en", seed }),
    },
  ];

  const results: Array<{
    packageId: string;
    cpId: string;
    curatedQlCount: number;
    sampledQuestions: number;
    sampledQlIds: string[];
  }> = [];

  for (const adapter of adapters) {
    for (const cpId of Object.keys(adapter.registry.questionLanguage.en)) {
      const curatedIds = curatedIdsForCp(adapter, cpId);
      assert(curatedIds.length > 0, `${adapter.packageId}:${cpId} has an empty curated default pool.`);
      const curatedSet = new Set(curatedIds);
      const sampledQlIds = new Set<string>();

      for (let index = 0; index < 4; index += 1) {
        const generated = adapter.runDefault(
          cpId,
          `ql-default-containment:${adapter.packageId}:${cpId}:${index}`,
        );
        sampledQlIds.add(generated.questionLanguageId);
        assert(
          curatedSet.has(generated.questionLanguageId),
          `${adapter.packageId}:${cpId} default runtime escaped curated pool with ${generated.questionLanguageId}.`,
        );
      }

      results.push({
        packageId: adapter.packageId,
        cpId,
        curatedQlCount: curatedIds.length,
        sampledQuestions: 4,
        sampledQlIds: [...sampledQlIds],
      });
    }
  }

  const sampledQuestions = results.reduce((sum, result) => sum + result.sampledQuestions, 0);
  console.log(
    JSON.stringify({
      status: "PASS_QUANT_V4_QL_DEFAULT_RUNTIME_CONTAINMENT_P1",
      sampledQuestions,
      cpCount: results.length,
      results,
    }),
  );
}

main();
