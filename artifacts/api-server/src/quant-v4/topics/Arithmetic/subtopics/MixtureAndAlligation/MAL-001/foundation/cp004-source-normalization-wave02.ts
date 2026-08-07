import {
  addRational,
  divideRational,
  multiplyRational,
  rational,
  subtractRational,
} from "./rational";
import type {
  MalCp004DiscoveryPrototypeId,
  MalCp004SolveRequest,
  MalCp004SolveResult,
} from "./cp004-types";
import type { Rational } from "./types";

export type MalCp004Wave02MatchKind =
  | "DIRECT_TASK_MATCH"
  | "FORMULA_EQUIVALENT_DIRECTION";

export interface MalCp004Wave02NormalizedCase {
  caseId: string;
  sourceId: string;
  prototypeId: MalCp004DiscoveryPrototypeId;
  matchKind: MalCp004Wave02MatchKind;
  request: MalCp004SolveRequest;
  expectedResult: MalCp004SolveResult;
  note: string;
}

export const MAL_CP004_WAVE02_NORMALIZED_CASES:
  readonly MalCp004Wave02NormalizedCase[] = [
    {
      caseId: "MAL-CP004-SRC-CASE-COMPONENT-AMOUNT-EX42",
      sourceId: "RSA-QA-PCT-EX42-PURE-SALT-ADDITION",
      prototypeId:
        "MAL-CP004-PROT-COMPONENT-AMOUNT-FROM-CONCENTRATION",
      matchKind: "FORMULA_EQUIVALENT_DIRECTION",
      request: {
        mode: "COMPONENT_AMOUNT_FROM_CONCENTRATION",
        totalQuantity: rational(30),
        concentration: rational(2, 100),
      },
      expectedResult: {
        kind: "COMPONENT_QUANTITY",
        value: rational(3, 5),
      },
      note:
        "The textbook solution explicitly computes the initial salt amount before solving the pure-addition task.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-PURE-ADDITION-EX42",
      sourceId: "RSA-QA-PCT-EX42-PURE-SALT-ADDITION",
      prototypeId:
        "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
      matchKind: "DIRECT_TASK_MATCH",
      request: {
        mode: "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION",
        initialTotal: rational(30),
        initialConcentration: rational(2, 100),
        targetConcentration: rational(10, 100),
      },
      expectedResult: {
        kind: "PURE_SOLUTE_ADDED",
        value: rational(8, 3),
      },
      note: "Exact MAT-labelled source task and exact answer.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-EVAPORATION-EX43-FORWARD",
      sourceId: "RSA-QA-PCT-EX43-EVAPORATION-ORIGINAL-MASS",
      prototypeId:
        "MAL-CP004-PROT-SOLVENT-EVAPORATION-FOR-TARGET",
      matchKind: "FORMULA_EQUIVALENT_DIRECTION",
      request: {
        mode: "EVAPORATE_SOLVENT_FOR_TARGET_CONCENTRATION",
        initialTotal: rational(75),
        initialConcentration: rational(20, 100),
        targetConcentration: rational(30, 100),
      },
      expectedResult: {
        kind: "SOLVENT_EVAPORATED",
        value: rational(25),
      },
      note:
        "The SSC source asks the inverse initial-total question; substituting its recovered 75 kg state reproduces the stated 25 kg evaporation exactly.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-FINAL-DRY-MASS-Q325",
      sourceId: "RSA-QA-PCT-Q325-FRESH-TO-DRY-MASS",
      prototypeId:
        "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
      matchKind: "DIRECT_TASK_MATCH",
      request: {
        mode: "FINAL_MASS_FROM_MOISTURE_SHIFT",
        initialMass: rational(100),
        initialMoistureFraction: rational(68, 100),
        finalMoistureFraction: rational(20, 100),
      },
      expectedResult: { kind: "FINAL_MASS", value: rational(40) },
      note: "Direct fresh-fruit to dry-fruit mass task.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-INITIAL-FRESH-MASS-Q327",
      sourceId: "RSA-QA-PCT-Q327-DRY-TO-FRESH-MASS",
      prototypeId:
        "MAL-CP004-PROT-INITIAL-MASS-FROM-MOISTURE-SHIFT",
      matchKind: "DIRECT_TASK_MATCH",
      request: {
        mode: "INITIAL_MASS_FROM_MOISTURE_SHIFT",
        finalMass: rational(250),
        initialMoistureFraction: rational(80, 100),
        finalMoistureFraction: rational(10, 100),
      },
      expectedResult: { kind: "INITIAL_MASS", value: rational(1125) },
      note: "Direct MAT-labelled inverse fresh-grape mass task.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-PURE-ADDITION-Q328",
      sourceId: "RSA-QA-PCT-Q328-PURE-GOLD-ADDITION",
      prototypeId:
        "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
      matchKind: "DIRECT_TASK_MATCH",
      request: {
        mode: "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION",
        initialTotal: rational(50),
        initialConcentration: rational(80, 100),
        targetConcentration: rational(90, 100),
      },
      expectedResult: {
        kind: "PURE_SOLUTE_ADDED",
        value: rational(50),
      },
      note: "Direct SNAP-labelled alloy-strengthening task.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-CONCENTRATION-Q330",
      sourceId: "RSA-QA-PCT-Q330-KNOWN-EVAPORATION-STRENGTH",
      prototypeId:
        "MAL-CP004-PROT-CONCENTRATION-FROM-COMPONENT-AMOUNT",
      matchKind: "FORMULA_EQUIVALENT_DIRECTION",
      request: {
        mode: "CONCENTRATION_FROM_COMPONENT_AMOUNT",
        totalQuantity: rational(5),
        componentQuantity: rational(6, 25),
      },
      expectedResult: {
        kind: "CONCENTRATION",
        value: rational(6, 125),
      },
      note:
        "After the stated one-litre evaporation, the final total is 5 litres and the conserved sugar amount is 0.24 litre-equivalent.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-SOLVENT-ADDITION-Q331",
      sourceId: "RSA-QA-PCT-Q331-WATER-ADDITION-TARGET",
      prototypeId:
        "MAL-CP004-PROT-SOLVENT-ADDITION-FOR-TARGET",
      matchKind: "DIRECT_TASK_MATCH",
      request: {
        mode: "ADD_SOLVENT_FOR_TARGET_CONCENTRATION",
        initialTotal: rational(9),
        initialConcentration: rational(50, 100),
        targetConcentration: rational(30, 100),
      },
      expectedResult: { kind: "SOLVENT_ADDED", value: rational(6) },
      note: "Direct target-strength dilution task.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-PURE-ADDITION-Q333",
      sourceId: "RSA-QA-PCT-Q333-PURE-ALCOHOL-ADDITION",
      prototypeId:
        "MAL-CP004-PROT-PURE-SOLUTE-ADDITION-FOR-TARGET",
      matchKind: "DIRECT_TASK_MATCH",
      request: {
        mode: "ADD_PURE_SOLUTE_FOR_TARGET_CONCENTRATION",
        initialTotal: rational(400),
        initialConcentration: rational(15, 100),
        targetConcentration: rational(32, 100),
      },
      expectedResult: {
        kind: "PURE_SOLUTE_ADDED",
        value: rational(100),
      },
      note: "Direct pharmacy-strengthening task.",
    },
    {
      caseId: "MAL-CP004-SRC-CASE-FINAL-DRY-MASS-CAT2001",
      sourceId: "ARUN-QA-CAT2001-FRESH-DRY-GRAPES",
      prototypeId:
        "MAL-CP004-PROT-FINAL-MASS-FROM-MOISTURE-SHIFT",
      matchKind: "DIRECT_TASK_MATCH",
      request: {
        mode: "FINAL_MASS_FROM_MOISTURE_SHIFT",
        initialMass: rational(20),
        initialMoistureFraction: rational(90, 100),
        finalMoistureFraction: rational(20, 100),
      },
      expectedResult: { kind: "FINAL_MASS", value: rational(5, 2) },
      note: "Direct CAT 2001 fresh-grape to dry-grape task.",
    },
  ] as const;

export type MalCp004Wave02GapSolveRequest =
  | {
      mode: "INITIAL_TOTAL_FROM_EVAPORATED_QUANTITY";
      evaporatedQuantity: Rational;
      initialConcentration: Rational;
      finalConcentration: Rational;
    }
  | {
      mode: "FINAL_CONCENTRATION_AFTER_SOLVENT_CHANGE";
      initialTotal: Rational;
      initialConcentration: Rational;
      solventChange: Rational;
      direction: "ADD" | "EVAPORATE";
    };

export interface MalCp004Wave02NormalizedGapCase {
  caseId: string;
  sourceId: string;
  gapId:
    | "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATED-QUANTITY"
    | "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-EVAPORATION"
    | "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-SOLVENT-ADDITION";
  request: MalCp004Wave02GapSolveRequest;
  expectedValue: Rational;
}

export const MAL_CP004_WAVE02_NORMALIZED_GAP_CASES:
  readonly MalCp004Wave02NormalizedGapCase[] = [
    {
      caseId: "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATION-EX43",
      sourceId: "RSA-QA-PCT-EX43-EVAPORATION-ORIGINAL-MASS",
      gapId: "MAL-CP004-GAP-INITIAL-TOTAL-FROM-EVAPORATED-QUANTITY",
      request: {
        mode: "INITIAL_TOTAL_FROM_EVAPORATED_QUANTITY",
        evaporatedQuantity: rational(25),
        initialConcentration: rational(20, 100),
        finalConcentration: rational(30, 100),
      },
      expectedValue: rational(75),
    },
    {
      caseId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-EVAPORATION-Q330",
      sourceId: "RSA-QA-PCT-Q330-KNOWN-EVAPORATION-STRENGTH",
      gapId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-EVAPORATION",
      request: {
        mode: "FINAL_CONCENTRATION_AFTER_SOLVENT_CHANGE",
        initialTotal: rational(6),
        initialConcentration: rational(4, 100),
        solventChange: rational(1),
        direction: "EVAPORATE",
      },
      expectedValue: rational(6, 125),
    },
    {
      caseId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-DILUTION-Q332",
      sourceId: "RSA-QA-PCT-Q332-KNOWN-DILUTION-STRENGTH",
      gapId: "MAL-CP004-GAP-FINAL-CONCENTRATION-AFTER-KNOWN-SOLVENT-ADDITION",
      request: {
        mode: "FINAL_CONCENTRATION_AFTER_SOLVENT_CHANGE",
        initialTotal: rational(5),
        initialConcentration: rational(40, 100),
        solventChange: rational(1),
        direction: "ADD",
      },
      expectedValue: rational(1, 3),
    },
  ] as const;

export function solveMalCp004Wave02GapRequest(
  request: MalCp004Wave02GapSolveRequest,
): Rational {
  switch (request.mode) {
    case "INITIAL_TOTAL_FROM_EVAPORATED_QUANTITY": {
      const concentrationIncrease = subtractRational(
        request.finalConcentration,
        request.initialConcentration,
      );
      return divideRational(
        multiplyRational(
          request.evaporatedQuantity,
          request.finalConcentration,
        ),
        concentrationIncrease,
      );
    }
    case "FINAL_CONCENTRATION_AFTER_SOLVENT_CHANGE": {
      const conservedSolute = multiplyRational(
        request.initialTotal,
        request.initialConcentration,
      );
      const finalTotal =
        request.direction === "ADD"
          ? addRational(request.initialTotal, request.solventChange)
          : subtractRational(request.initialTotal, request.solventChange);
      return divideRational(conservedSolute, finalTotal);
    }
  }
}
