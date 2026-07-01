import { metadata as Q021 } from "./Q021/metadata";
import { metadata as Q022 } from "./Q022/metadata";
import { metadata as Q023 } from "./Q023/metadata";
import { metadata as Q024 } from "./Q024/metadata";
import { metadata as Q025 } from "./Q025/metadata";
import { metadata as Q026 } from "./Q026/metadata";
import { metadata as Q027 } from "./Q027/metadata";
import { metadata as Q028 } from "./Q028/metadata";
import { metadata as Q029 } from "./Q029/metadata";
import { metadata as Q030 } from "./Q030/metadata";
import { metadata as Q031 } from "./Q031/metadata";
import { metadata as Q032 } from "./Q032/metadata";
import { metadata as Q033 } from "./Q033/metadata";
import { metadata as Q034 } from "./Q034/metadata";
import { metadata as Q035 } from "./Q035/metadata";
import { metadata as Q036 } from "./Q036/metadata";
import { metadata as Q037 } from "./Q037/metadata";
import { metadata as Q038 } from "./Q038/metadata";
import { metadata as Q039 } from "./Q039/metadata";
import { metadata as Q040 } from "./Q040/metadata";
import { metadata as Q041 } from "./Q041/metadata";
import { metadata as Q042 } from "./Q042/metadata";
import { metadata as Q043 } from "./Q043/metadata";
import { metadata as Q044 } from "./Q044/metadata";
import { metadata as Q045 } from "./Q045/metadata";
import { metadata as Q046 } from "./Q046/metadata";
import { metadata as Q047 } from "./Q047/metadata";
import { metadata as Q048 } from "./Q048/metadata";
import { metadata as Q049 } from "./Q049/metadata";
import { metadata as Q050 } from "./Q050/metadata";
import { metadata as Q051 } from "./Q051/metadata";
import { metadata as Q052 } from "./Q052/metadata";
import { metadata as Q053 } from "./Q053/metadata";
import { metadata as Q054 } from "./Q054/metadata";
import { metadata as Q055 } from "./Q055/metadata";
import { metadata as Q056 } from "./Q056/metadata";
import { metadata as Q057 } from "./Q057/metadata";
import { metadata as Q058 } from "./Q058/metadata";
import { metadata as Q059 } from "./Q059/metadata";
import { metadata as Q060 } from "./Q060/metadata";
import type {
  QuestionPackageId,
  QuestionPackageMetadata,
} from "./types";

export const PCT_001_QUESTION_PACKAGE_REGISTRY = [
  Q021, Q022, Q023, Q024, Q025,
  Q026, Q027, Q028, Q029, Q030,
  Q031, Q032, Q033, Q034, Q035,
  Q036, Q037, Q038, Q039, Q040,
  Q041, Q042, Q043, Q044, Q045,
  Q046, Q047, Q048, Q049, Q050,
  Q051, Q052, Q053, Q054, Q055,
  Q056, Q057, Q058, Q059, Q060,
] as const satisfies readonly QuestionPackageMetadata[];

const BY_ID = new Map(
  PCT_001_QUESTION_PACKAGE_REGISTRY.map((metadata) => [
    metadata.questionId,
    metadata,
  ]),
);

export function getQuestionPackageMetadata(
  questionId: QuestionPackageId,
): QuestionPackageMetadata {
  const metadata = BY_ID.get(questionId);
  if (!metadata) {
    throw new Error(`Unregistered PCT-001 question package: ${questionId}`);
  }
  return metadata;
}

