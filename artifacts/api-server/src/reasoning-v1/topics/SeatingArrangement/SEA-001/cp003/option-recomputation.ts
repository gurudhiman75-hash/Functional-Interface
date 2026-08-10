import { CircularTopology, personAt, seatIndexOf } from "./topology.ts";
import type { CircularChildQuestion, CircularOption, CircularSemanticValue, PersonId } from "./types.ts";

function pair(left: PersonId, right: PersonId): readonly PersonId[] {
  return [left, right].sort();
}

function sequenceFrom(
  clockwiseOrder: readonly PersonId[],
  referenceIndex: number,
  direction: "CLOCKWISE" | "ANTICLOCKWISE",
  offset = 0,
): readonly PersonId[] {
  const topology = new CircularTopology(clockwiseOrder.length);
  return [1, 2, 3].map((step) => personAt(clockwiseOrder, topology.moveCyclic(referenceIndex, direction, step + offset)));
}

function requireMetadataFlag(option: CircularOption, key: string): boolean {
  return option.recomputation[key] === true;
}

export function recomputeCircularOptionValue(
  question: CircularChildQuestion,
  option: CircularOption,
  clockwiseOrder: readonly PersonId[],
): CircularSemanticValue {
  if (option.isCorrect) return question.answer;

  const parts = question.answerDeterminingFactFingerprint.split(":");
  const topology = new CircularTopology(clockwiseOrder.length);

  switch (question.queryContractId) {
    case "SEA-QC-003": {
      const reference = parts[1];
      const steps = Number(parts[3]);
      if (!reference || !Number.isInteger(steps)) throw new Error(`Invalid QC003 fingerprint: ${question.answerDeterminingFactFingerprint}`);
      const referenceIndex = seatIndexOf(clockwiseOrder, reference);
      if (requireMetadataFlag(option, "treatedLeftAsAnticlockwise")) {
        return personAt(clockwiseOrder, topology.moveRelativeCentre(referenceIndex, "RIGHT", steps));
      }
      if (typeof option.recomputation.steps === "number") {
        return personAt(clockwiseOrder, topology.moveRelativeCentre(referenceIndex, "LEFT", option.recomputation.steps));
      }
      if (requireMetadataFlag(option, "includedReference")) return reference;
      break;
    }
    case "SEA-QC-004": {
      const reference = parts[1];
      const direction = parts[2];
      const steps = Number(parts[3]);
      if (!reference
        || (direction !== "CLOCKWISE" && direction !== "ANTICLOCKWISE")
        || !Number.isInteger(steps)) {
        throw new Error(`Invalid QC004 fingerprint: ${question.answerDeterminingFactFingerprint}`);
      }
      const referenceIndex = seatIndexOf(clockwiseOrder, reference);
      const usedDirection = option.recomputation.usedDirection;
      if (usedDirection === "CLOCKWISE" || usedDirection === "ANTICLOCKWISE") {
        return personAt(clockwiseOrder, topology.moveCyclic(referenceIndex, usedDirection, steps));
      }
      if (typeof option.recomputation.steps === "number") {
        return personAt(clockwiseOrder, topology.moveCyclic(referenceIndex, direction, option.recomputation.steps));
      }
      if (requireMetadataFlag(option, "includedReference")) return reference;
      break;
    }
    case "SEA-QC-006": {
      const reference = parts[1];
      if (!reference) throw new Error(`Invalid QC006 fingerprint: ${question.answerDeterminingFactFingerprint}`);
      const index = seatIndexOf(clockwiseOrder, reference);
      if (option.recomputation.sameArc === "CLOCKWISE") {
        return pair(personAt(clockwiseOrder, index + 1), personAt(clockwiseOrder, index + 2));
      }
      if (option.recomputation.sameArc === "ANTICLOCKWISE") {
        return pair(personAt(clockwiseOrder, index - 1), personAt(clockwiseOrder, index - 2));
      }
      if (requireMetadataFlag(option, "skippedImmediateSeats")) {
        return pair(personAt(clockwiseOrder, index + 2), personAt(clockwiseOrder, index - 2));
      }
      if (requireMetadataFlag(option, "includedReference")) return pair(reference, personAt(clockwiseOrder, index + 1));
      break;
    }
    case "SEA-QC-009": {
      const first = parts[1];
      const second = parts[3];
      if (!first || !second) throw new Error(`Invalid QC009 fingerprint: ${question.answerDeterminingFactFingerprint}`);
      const firstIndex = seatIndexOf(clockwiseOrder, first);
      const secondIndex = seatIndexOf(clockwiseOrder, second);
      const clockwiseCount = topology.countBetween(firstIndex, secondIndex, "CLOCKWISE");
      if (option.recomputation.direction === "ANTICLOCKWISE") return topology.countBetween(firstIndex, secondIndex, "ANTICLOCKWISE");
      if (requireMetadataFlag(option, "includedOneEndpoint")) return clockwiseCount + 1;
      if (requireMetadataFlag(option, "includedBothEndpoints")) return clockwiseCount + 2;
      if (requireMetadataFlag(option, "stoppedEarly")) return Math.max(0, clockwiseCount - 1);
      break;
    }
    case "SEA-QC-010": {
      const reference = parts[1];
      if (!reference) throw new Error(`Invalid QC010 fingerprint: ${question.answerDeterminingFactFingerprint}`);
      const index = seatIndexOf(clockwiseOrder, reference);
      const opposite = topology.oppositeSeatIndex(index);
      if (opposite === null) throw new Error("QC010 cannot be recomputed on an odd circle");
      if (option.recomputation.neighbour === "CLOCKWISE") return personAt(clockwiseOrder, index + 1);
      if (option.recomputation.neighbour === "ANTICLOCKWISE") return personAt(clockwiseOrder, index - 1);
      if (requireMetadataFlag(option, "halfTurnPlusOne")) return personAt(clockwiseOrder, opposite + 1);
      if (requireMetadataFlag(option, "halfTurnMinusOne")) return personAt(clockwiseOrder, opposite - 1);
      break;
    }
    case "SEA-QC-020": {
      const reference = parts[1];
      if (!reference) throw new Error(`Invalid QC020 fingerprint: ${question.answerDeterminingFactFingerprint}`);
      const index = seatIndexOf(clockwiseOrder, reference);
      const correct = sequenceFrom(clockwiseOrder, index, "CLOCKWISE");
      if (option.recomputation.direction === "ANTICLOCKWISE") return sequenceFrom(clockwiseOrder, index, "ANTICLOCKWISE");
      if (requireMetadataFlag(option, "skippedImmediate")) return sequenceFrom(clockwiseOrder, index, "CLOCKWISE", 1);
      if (requireMetadataFlag(option, "includedReference")) return [reference, ...correct.slice(0, 2)];
      if (requireMetadataFlag(option, "reversedOrder")) return [...correct].reverse();
      break;
    }
    default:
      break;
  }

  throw new Error(`Unsupported option recomputation for ${question.queryContractId}: ${JSON.stringify(option.recomputation)}`);
}

export function assertCircularOptionRecomputations(
  question: CircularChildQuestion,
  clockwiseOrder: readonly PersonId[],
): void {
  for (const option of question.options) {
    const recomputed = recomputeCircularOptionValue(question, option, clockwiseOrder);
    if (JSON.stringify(recomputed) !== JSON.stringify(option.semanticValue)) {
      throw new Error(
        `Option recomputation mismatch for ${question.queryContractId}: expected=${JSON.stringify(option.semanticValue)} recomputed=${JSON.stringify(recomputed)}`,
      );
    }
  }
}