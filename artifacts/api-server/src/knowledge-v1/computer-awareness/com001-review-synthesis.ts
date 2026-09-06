import type {
  Com001ReviewGenerationRequest,
  Com001ReviewQuestion,
} from "./com001-review-types";
import {
  generateCom001Ql001Review,
  generateCom001Ql002Review,
  generateCom001Ql003Review,
  generateCom001Ql004Review,
  generateCom001Ql005Review,
  generateCom001Ql006Review,
  generateCom001Ql009Review,
} from "./com001-simple-review-generator";
import {
  generateCom001Ql007Review,
  generateCom001Ql008Review,
} from "./com001-advanced-review-generator";

const GENERATORS: Record<
  string,
  (seed: string) => Com001ReviewQuestion
> = {
  "COM-001-QL-001": generateCom001Ql001Review,
  "COM-001-QL-002": generateCom001Ql002Review,
  "COM-001-QL-003": generateCom001Ql003Review,
  "COM-001-QL-004": generateCom001Ql004Review,
  "COM-001-QL-005": generateCom001Ql005Review,
  "COM-001-QL-006": generateCom001Ql006Review,
  "COM-001-QL-007": generateCom001Ql007Review,
  "COM-001-QL-008": generateCom001Ql008Review,
  "COM-001-QL-009": generateCom001Ql009Review,
};

export function listCom001ReviewQlIds() {
  return Object.keys(GENERATORS).sort();
}

export function generateCom001ReviewQuestion(
  request: Com001ReviewGenerationRequest,
): Com001ReviewQuestion {
  if (!request.seed.trim()) {
    throw new Error("COM-001 editorial review generation requires an explicit seed");
  }
  const generator = GENERATORS[request.qlId];
  if (!generator) {
    throw new Error(`COM-001 review QL ${request.qlId} is not allocated`);
  }
  return generator(request.seed);
}

export function generateCom001ReviewBatch(
  qlId: string,
  count: number,
  seed: string,
) {
  if (!Number.isInteger(count) || count <= 0 || count > 100) {
    throw new Error("COM-001 review batch count must be between 1 and 100");
  }
  return Array.from({ length: count }, (_, index) =>
    generateCom001ReviewQuestion({
      qlId,
      seed: `${seed}:${index}`,
    }),
  );
}
