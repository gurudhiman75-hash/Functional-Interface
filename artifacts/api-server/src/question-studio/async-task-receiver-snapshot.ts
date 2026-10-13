// Take a queued run's canonical compute input from Neon, not from an
// unauthenticated HTTP request. Pure field allowlist prevents the saved
// actor UID, timestamps or arbitrary metadata crossing to the worker.
import type {UniversalStudioComputeInput} from "./universal-executor";

export class QuestionStudioTaskSnapshotError extends Error {
  constructor(public readonly code:string,message:string) {
    super(message);
    this.name="QuestionStudioTaskSnapshotError";
  }
}

export function computeInputFromQueuedSnapshot(snapshot:unknown):UniversalStudioComputeInput {
  if(!snapshot||typeof snapshot!=="object"||Array.isArray(snapshot)){
    throw new QuestionStudioTaskSnapshotError("TASK_SNAPSHOT_INVALID","Queued run snapshot missing");
  }
  const x=snapshot as Record<string,unknown>;
  if(x.queueVersion!==1 || !x.request ||
     typeof x.request!=="object"||Array.isArray(x.request) ||
     !Number.isInteger(x.count)||(x.count as number)<1||(x.count as number)>50 ||
     !Array.isArray(x.selectedCpIds)){
    throw new QuestionStudioTaskSnapshotError("TASK_SNAPSHOT_INVALID","Queued run snapshot is invalid");
  }
  const request=x.request as Record<string,unknown>;
  if(typeof request.packageId!=="string" ||typeof request.engineId!=="string" ||
     request.count!==x.count){
    throw new QuestionStudioTaskSnapshotError("TASK_SNAPSHOT_INVALID","Queued run request is inconsistent");
  }
  return {
    request:request as UniversalStudioComputeInput["request"],
    count:x.count as number,
    selectedCpIds:x.selectedCpIds as string[],
    examProfileId:x.examProfileId,
    difficultyPreset:x.difficultyPreset,
    difficultyDistribution:x.difficultyDistribution,
    forwardLegacyExamProfile:x.forwardLegacyExamProfile as boolean|undefined,
    difficultyFilterSupported:x.difficultyFilterSupported as boolean|undefined,
  };
}
