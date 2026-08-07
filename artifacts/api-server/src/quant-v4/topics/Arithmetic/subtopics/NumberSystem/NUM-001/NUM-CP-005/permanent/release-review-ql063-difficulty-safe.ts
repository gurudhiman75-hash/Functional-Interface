import { asNumber } from "./english-remediation-common";

export function applyNumCp005Ql063DifficultySafe(source, result) {
  const n = asNumber(source.hiddenState.integerValue, "integerValue");
  const visible = asNumber(source.hiddenState.visiblePartner, "visiblePartner");
  const answer = Number(result.canonicalAnswer);
  const easyByZeroCancellation = n % 10 === 0 && visible % 10 === 0 && answer <= 1_000;
  const easyBySmallDivision = n <= 10_000 && visible <= 100 && answer <= 1_000;

  return {
    ...result,
    difficulty: easyByZeroCancellation || easyBySmallDivision ? "EASY" : result.difficulty,
  };
}
