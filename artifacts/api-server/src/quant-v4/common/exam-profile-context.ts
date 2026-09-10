import { AsyncLocalStorage } from "node:async_hooks";

import {
  getQuantV4ExamProfileContract,
  type QuantV4ExamProfileContract,
  type QuantV4ExamProfileId,
} from "./exam-profile";

const examProfileStorage = new AsyncLocalStorage<QuantV4ExamProfileId>();

export function getCurrentQuantV4ExamProfileId(): QuantV4ExamProfileId | undefined {
  return examProfileStorage.getStore();
}

export function getCurrentQuantV4ExamProfileContract():
  | QuantV4ExamProfileContract
  | undefined {
  const profileId = getCurrentQuantV4ExamProfileId();
  return profileId ? getQuantV4ExamProfileContract(profileId) : undefined;
}

export function withQuantV4ExamProfileContext<T>(
  profileId: QuantV4ExamProfileId | undefined,
  callback: () => T,
): T {
  if (!profileId) return callback();
  getQuantV4ExamProfileContract(profileId);
  return examProfileStorage.run(profileId, callback);
}
