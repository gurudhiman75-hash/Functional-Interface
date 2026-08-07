export function assertCount(value: bigint, label: string): bigint { if (value < 0n) throw new Error(`${label} must be non-negative`); return value; }
export function assertSelectionFeasible(population: number, selection: number): void {
  if (!Number.isInteger(population) || !Number.isInteger(selection) || population < 0 || selection < 0 || selection > population) {
    throw new Error(`Infeasible selection ${selection} from ${population}`);
  }
}
