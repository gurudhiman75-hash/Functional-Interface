import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010,
  type SapCp010Package,
} from "./final-runtime";

export interface SapCp010ReviewRecord extends SapCp010Package {
  readonly questionId: string;
}

export function generateSapCp010ReviewRecords(): readonly SapCp010ReviewRecord[] {
  const records: SapCp010ReviewRecord[] = [];
  SAP_CP010_PROTOTYPE_IDS.forEach((prototypeId, modeIndex) => {
    const count = modeIndex < 11 ? 18 : 17;
    for (let seed = 1; seed <= count; seed += 1) {
      const pkg = generateSapCp010(prototypeId, seed);
      records.push(Object.freeze({
        ...pkg,
        questionId: `SAP-CP010-REV-${String(records.length + 1).padStart(3, "0")}`,
      }));
    }
  });
  return Object.freeze(records);
}
