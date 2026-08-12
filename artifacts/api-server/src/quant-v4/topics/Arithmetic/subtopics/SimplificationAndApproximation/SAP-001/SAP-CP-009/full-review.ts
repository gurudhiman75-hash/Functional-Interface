import {
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009,
  type SapCp009Package,
} from "./runtime-v6";

export interface SapCp009ReviewRecord extends SapCp009Package {
  readonly questionId: string;
}

export function generateSapCp009ReviewRecords(): readonly SapCp009ReviewRecord[] {
  const records: SapCp009ReviewRecord[] = [];
  SAP_CP009_PROTOTYPE_IDS.forEach((prototypeId, modeIndex) => {
    const count = modeIndex < 15 ? 16 : 15;
    for (let seed = 1; seed <= count; seed += 1) {
      const pkg = generateSapCp009(prototypeId, seed);
      records.push(Object.freeze({
        ...pkg,
        questionId: `SAP-CP009-REV-${String(records.length + 1).padStart(3, "0")}`,
      }));
    }
  });
  return Object.freeze(records);
}
