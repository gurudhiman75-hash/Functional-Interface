import { DeterministicRandom } from "../../../../shared/constraint-core/random.ts";
import { LinearTopology } from "../topology/linear.ts";
import type { LinearSeatingState, SeatingPerson, SeatingBlueprintId } from "../types.ts";

const NAME_POOL = ["Aman", "Bina", "Charan", "Diya", "Eshan", "Farah", "Gagan", "Heena"] as const;

export function generateHiddenLinearState(seed: string, blueprintId: SeatingBlueprintId): LinearSeatingState {
  const random = new DeterministicRandom(`${seed}:${blueprintId}:state`);
  const seatCount = random.integer(5, 8);
  const topology = new LinearTopology(seatCount);
  const selectedNames = random.shuffle(NAME_POOL).slice(0, seatCount);
  const persons: SeatingPerson[] = selectedNames.map((displayName, index) => ({ id: `P${index + 1}`, displayName }));
  const seatOrder = random.shuffle(persons);
  const facing = random.pick(["NORTH", "SOUTH"] as const);
  return {
    topologyKind: "LINEAR_SINGLE_ROW",
    persons,
    seats: topology.seats,
    assignments: seatOrder.map((person, index) => ({ personId: person.id, seatId: topology.seatId(index), facing })),
  };
}
