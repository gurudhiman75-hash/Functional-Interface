import { rational } from "./rational";
import type { MalCp002DiscoveryFixture } from "./cp002-types";

const state = (componentA: number, componentB: number) => ({
  componentA: rational(componentA),
  componentB: rational(componentB),
});

const ratio = (componentAPart: number, componentBPart: number) => ({
  componentAPart: rational(componentAPart),
  componentBPart: rational(componentBPart),
});

/**
 * These fixtures prove the current executable frontier in both component
 * directions. They are not a closed QL list and do not freeze solve modes.
 */
export const MAL_CP002_DISCOVERY_FIXTURES:
  readonly MalCp002DiscoveryFixture[] = [
    {
      fixtureId: "CP002-ADD-B-TO-3-2",
      prototypeId: "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET",
        initialState: state(30, 10),
        changedComponent: "B",
        adjustmentKind: "ADD",
        targetRatio: ratio(3, 2),
      },
      expectedFingerprint: "ADJUSTMENT_QUANTITY:10/1:3/1:2/1",
    },
    {
      fixtureId: "CP002-ADD-A-TO-4-5",
      prototypeId: "MAL-CP002-PROT-ADD-COMPONENT-FOR-TARGET-RATIO",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET",
        initialState: state(18, 30),
        changedComponent: "A",
        adjustmentKind: "ADD",
        targetRatio: ratio(4, 5),
      },
      expectedFingerprint: "ADJUSTMENT_QUANTITY:6/1:4/1:5/1",
    },
    {
      fixtureId: "CP002-REMOVE-A-TO-3-2",
      prototypeId: "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET",
        initialState: state(40, 20),
        changedComponent: "A",
        adjustmentKind: "REMOVE",
        targetRatio: ratio(3, 2),
      },
      expectedFingerprint: "ADJUSTMENT_QUANTITY:10/1:3/1:2/1",
    },
    {
      fixtureId: "CP002-REMOVE-B-TO-3-2",
      prototypeId: "MAL-CP002-PROT-REMOVE-COMPONENT-FOR-TARGET-RATIO",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "UNKNOWN_PURE_ADJUSTMENT_TO_TARGET",
        initialState: state(24, 32),
        changedComponent: "B",
        adjustmentKind: "REMOVE",
        targetRatio: ratio(3, 2),
      },
      expectedFingerprint: "ADJUSTMENT_QUANTITY:16/1:3/1:2/1",
    },
    {
      fixtureId: "CP002-RATIO-AFTER-ADD-A",
      prototypeId: "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-ADDITION",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT",
        initialState: state(12, 18),
        changedComponent: "A",
        adjustmentKind: "ADD",
        adjustmentQuantity: rational(6),
      },
      expectedFingerprint: "COMPONENT_RATIO:1/1:1/1",
    },
    {
      fixtureId: "CP002-RATIO-AFTER-ADD-B",
      prototypeId: "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-ADDITION",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT",
        initialState: state(28, 14),
        changedComponent: "B",
        adjustmentKind: "ADD",
        adjustmentQuantity: rational(7),
      },
      expectedFingerprint: "COMPONENT_RATIO:4/1:3/1",
    },
    {
      fixtureId: "CP002-RATIO-AFTER-REMOVE-A",
      prototypeId: "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-REMOVAL",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT",
        initialState: state(35, 20),
        changedComponent: "A",
        adjustmentKind: "REMOVE",
        adjustmentQuantity: rational(5),
      },
      expectedFingerprint: "COMPONENT_RATIO:3/1:2/1",
    },
    {
      fixtureId: "CP002-RATIO-AFTER-REMOVE-B",
      prototypeId: "MAL-CP002-PROT-RATIO-AFTER-COMPONENT-REMOVAL",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "RESULTING_RATIO_AFTER_PURE_ADJUSTMENT",
        initialState: state(18, 30),
        changedComponent: "B",
        adjustmentKind: "REMOVE",
        adjustmentQuantity: rational(6),
      },
      expectedFingerprint: "COMPONENT_RATIO:3/1:4/1",
    },
    {
      fixtureId: "CP002-ORIGINAL-BEFORE-ADD-A",
      prototypeId: "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-ADDITION",
      sourceClass: "INVERSE_CLOSURE",
      request: {
        mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT",
        finalState: state(30, 18),
        changedComponent: "A",
        adjustmentKind: "ADD",
        adjustmentQuantity: rational(6),
      },
      expectedFingerprint: "ORIGINAL_RATIO:4/1:3/1",
    },
    {
      fixtureId: "CP002-ORIGINAL-BEFORE-ADD-B",
      prototypeId: "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-ADDITION",
      sourceClass: "INVERSE_CLOSURE",
      request: {
        mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT",
        finalState: state(20, 25),
        changedComponent: "B",
        adjustmentKind: "ADD",
        adjustmentQuantity: rational(5),
      },
      expectedFingerprint: "ORIGINAL_RATIO:1/1:1/1",
    },
    {
      fixtureId: "CP002-ORIGINAL-BEFORE-REMOVE-A",
      prototypeId: "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-REMOVAL",
      sourceClass: "INVERSE_CLOSURE",
      request: {
        mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT",
        finalState: state(30, 20),
        changedComponent: "A",
        adjustmentKind: "REMOVE",
        adjustmentQuantity: rational(10),
      },
      expectedFingerprint: "ORIGINAL_RATIO:2/1:1/1",
    },
    {
      fixtureId: "CP002-ORIGINAL-BEFORE-REMOVE-B",
      prototypeId: "MAL-CP002-PROT-ORIGINAL-RATIO-BEFORE-REMOVAL",
      sourceClass: "INVERSE_CLOSURE",
      request: {
        mode: "ORIGINAL_RATIO_FROM_FINAL_PURE_ADJUSTMENT",
        finalState: state(18, 24),
        changedComponent: "B",
        adjustmentKind: "REMOVE",
        adjustmentQuantity: rational(6),
      },
      expectedFingerprint: "ORIGINAL_RATIO:3/1:5/1",
    },
    {
      fixtureId: "CP002-COMPONENTS-84-IN-5-2",
      prototypeId: "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO",
        totalQuantity: rational(84),
        ratio: ratio(5, 2),
      },
      expectedFingerprint: "COMPONENT_QUANTITY_PAIR:60/1:24/1",
    },
    {
      fixtureId: "CP002-COMPONENTS-96-IN-3-5",
      prototypeId: "MAL-CP002-PROT-COMPONENTS-FROM-TOTAL-AND-RATIO",
      sourceClass: "LEGACY_V2_RECOVERY",
      request: {
        mode: "COMPONENT_QUANTITIES_FROM_TOTAL_AND_RATIO",
        totalQuantity: rational(96),
        ratio: ratio(3, 5),
      },
      expectedFingerprint: "COMPONENT_QUANTITY_PAIR:36/1:60/1",
    },
    {
      fixtureId: "CP002-SINGLE-REFILL-B-TO-2-1",
      prototypeId: "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO",
      sourceClass: "BOUNDARY_CONSTRUCTION",
      request: {
        mode: "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET",
        initialState: state(27, 9),
        replacementComponent: "B",
        targetRatio: ratio(2, 1),
      },
      expectedFingerprint:
        "SINGLE_REPLACEMENT_QUANTITY:4/1:2/1:1/1",
    },
    {
      fixtureId: "CP002-SINGLE-REFILL-A-TO-1-2",
      prototypeId: "MAL-CP002-PROT-SINGLE-REMOVE-REFILL-FOR-TARGET-RATIO",
      sourceClass: "BOUNDARY_CONSTRUCTION",
      request: {
        mode: "UNKNOWN_SINGLE_REPLACEMENT_TO_TARGET",
        initialState: state(9, 27),
        replacementComponent: "A",
        targetRatio: ratio(1, 2),
      },
      expectedFingerprint:
        "SINGLE_REPLACEMENT_QUANTITY:4/1:1/1:2/1",
    },
  ] as const;
