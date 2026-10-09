import type { TsdCp011AuthorityKey } from "./source-saturation";

export type TsdCp011Representation = Readonly<{
  representationId: string;
  authorityKey: TsdCp011AuthorityKey;
  evidenceForm: string;
  targetForm: string;
  examContexts: readonly string[];
}>;

export const TSD_CP011_REPRESENTATIONS = Object.freeze([
  { representationId: "CP011-R001", authorityKey: "movingSurfaceTravelState", evidenceForm: "surface length + walking rate + surface rate, same direction", targetForm: "travel time", examContexts: ["ESCALATOR", "MOVING_WALKWAY"] },
  { representationId: "CP011-R002", authorityKey: "movingSurfaceTravelState", evidenceForm: "surface length + walking rate + surface rate, opposite direction", targetForm: "travel time", examContexts: ["ESCALATOR", "MOVING_WALKWAY"] },
  { representationId: "CP011-R003", authorityKey: "movingSurfaceTravelState", evidenceForm: "travel time + person rate + surface rate", targetForm: "surface length", examContexts: ["MOVING_WALKWAY", "CONVEYOR"] },
  { representationId: "CP011-R004", authorityKey: "movingSurfaceTravelState", evidenceForm: "length + travel time + surface rate", targetForm: "person relative rate", examContexts: ["MOVING_WALKWAY", "ESCALATOR"] },
  { representationId: "CP011-R005", authorityKey: "movingSurfaceTravelState", evidenceForm: "length + travel time + person relative rate", targetForm: "surface rate", examContexts: ["MOVING_WALKWAY", "CONVEYOR"] },
  { representationId: "CP011-R006", authorityKey: "movingSurfaceTravelState", evidenceForm: "object/person rate relative to moving belt with declared direction", targetForm: "ground transfer rate or equivalent trip state", examContexts: ["CONVEYOR", "MOVING_WALKWAY"] },

  { representationId: "CP011-R007", authorityKey: "stationaryStepCountState", evidenceForm: "steps walked + person step rate + escalator step rate, same direction", targetForm: "stationary escalator step count", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R008", authorityKey: "stationaryStepCountState", evidenceForm: "steps walked + person step rate + escalator step rate, opposite direction", targetForm: "stationary escalator step count", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R009", authorityKey: "stationaryStepCountState", evidenceForm: "stationary step count + both step rates", targetForm: "steps physically walked", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R010", authorityKey: "stationaryStepCountState", evidenceForm: "stationary steps + walked steps + escalator rate", targetForm: "person step rate", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R011", authorityKey: "stationaryStepCountState", evidenceForm: "stationary steps + walked steps + person rate", targetForm: "escalator step rate", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R012", authorityKey: "stationaryStepCountState", evidenceForm: "visible/physical step count framed through walking and carried steps", targetForm: "missing step-count or rate state", examContexts: ["ESCALATOR"] },

  { representationId: "CP011-R013", authorityKey: "dualEscalatorObservationState", evidenceForm: "same person walks up and down while escalator moves upward", targetForm: "time on stopped escalator", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R014", authorityKey: "dualEscalatorObservationState", evidenceForm: "paired with/against escalator travel times", targetForm: "person-to-escalator rate ratio", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R015", authorityKey: "dualEscalatorObservationState", evidenceForm: "shorter with-motion time and longer against-motion time", targetForm: "stopped-surface equivalent time", examContexts: ["ESCALATOR", "MOVING_WALKWAY"] },
  { representationId: "CP011-R016", authorityKey: "dualEscalatorObservationState", evidenceForm: "two opposite-direction observations on same moving surface", targetForm: "relative-rate inference", examContexts: ["MOVING_WALKWAY", "ESCALATOR"] },
  { representationId: "CP011-R017", authorityKey: "dualEscalatorObservationState", evidenceForm: "paired observation stated as time advantage/disadvantage", targetForm: "stopped time", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R018", authorityKey: "dualEscalatorObservationState", evidenceForm: "paired observation stated without surface length", targetForm: "scale-free rate ratio", examContexts: ["ESCALATOR", "MOVING_WALKWAY"] },

  { representationId: "CP011-R019", authorityKey: "movingSurfaceStateComparison", evidenceForm: "time walking when stopped + time standing when carried", targetForm: "time walking on moving surface", examContexts: ["ESCALATOR", "MOVING_WALKWAY"] },
  { representationId: "CP011-R020", authorityKey: "movingSurfaceStateComparison", evidenceForm: "combined moving time + carried-standing time", targetForm: "stopped walking time", examContexts: ["ESCALATOR", "MOVING_WALKWAY"] },
  { representationId: "CP011-R021", authorityKey: "movingSurfaceStateComparison", evidenceForm: "combined moving time + stopped walking time", targetForm: "standing-carried time", examContexts: ["ESCALATOR", "MOVING_WALKWAY"] },
  { representationId: "CP011-R022", authorityKey: "movingSurfaceStateComparison", evidenceForm: "stopped walking time + carried time", targetForm: "time saved by moving surface", examContexts: ["MOVING_WALKWAY", "ESCALATOR"] },
  { representationId: "CP011-R023", authorityKey: "movingSurfaceStateComparison", evidenceForm: "three-state comparison: stopped, standing, walking", targetForm: "missing state", examContexts: ["ESCALATOR"] },
  { representationId: "CP011-R024", authorityKey: "movingSurfaceStateComparison", evidenceForm: "same fixed length expressed only through alternate travel times", targetForm: "unknown component-rate time state", examContexts: ["MOVING_WALKWAY"] },

  { representationId: "CP011-R025", authorityKey: "wheelRollState", evidenceForm: "wheel circumference + revolutions", targetForm: "linear distance", examContexts: ["WHEEL", "VEHICLE_WHEEL"] },
  { representationId: "CP011-R026", authorityKey: "wheelRollState", evidenceForm: "linear distance + circumference", targetForm: "revolution count", examContexts: ["WHEEL", "VEHICLE_WHEEL"] },
  { representationId: "CP011-R027", authorityKey: "wheelRollState", evidenceForm: "linear distance + revolution count", targetForm: "circumference", examContexts: ["WHEEL"] },
  { representationId: "CP011-R028", authorityKey: "wheelRollState", evidenceForm: "distance + revolutions + declared pi", targetForm: "diameter", examContexts: ["WHEEL", "VEHICLE_WHEEL"] },
  { representationId: "CP011-R029", authorityKey: "wheelRollState", evidenceForm: "distance + revolutions + declared pi", targetForm: "radius", examContexts: ["WHEEL", "VEHICLE_WHEEL"] },
  { representationId: "CP011-R030", authorityKey: "wheelRollState", evidenceForm: "diameter/radius converted to circumference before rolling", targetForm: "distance or revolutions", examContexts: ["WHEEL", "CIRCULAR_OBJECT"] },

  { representationId: "CP011-R031", authorityKey: "wheelRateTranslationState", evidenceForm: "circumference + RPM", targetForm: "linear speed", examContexts: ["WHEEL", "ROTATING_WHEEL"] },
  { representationId: "CP011-R032", authorityKey: "wheelRateTranslationState", evidenceForm: "circumference + linear speed", targetForm: "RPM", examContexts: ["WHEEL", "ROTATING_WHEEL"] },
  { representationId: "CP011-R033", authorityKey: "wheelRateTranslationState", evidenceForm: "circumference + RPM + elapsed time", targetForm: "distance", examContexts: ["VEHICLE_WHEEL"] },
  { representationId: "CP011-R034", authorityKey: "wheelRateTranslationState", evidenceForm: "distance + circumference + RPM", targetForm: "elapsed time", examContexts: ["VEHICLE_WHEEL"] },
  { representationId: "CP011-R035", authorityKey: "wheelRateTranslationState", evidenceForm: "diameter/radius first converted to circumference, then combined with rotational rate", targetForm: "linear-rate state", examContexts: ["WHEEL"] },
  { representationId: "CP011-R036", authorityKey: "wheelRateTranslationState", evidenceForm: "revolutions per unit time stated as a rotational schedule", targetForm: "distance/time/speed consequence", examContexts: ["WHEEL", "ROTATING_WHEEL"] },

  { representationId: "CP011-R037", authorityKey: "twoWheelComparisonState", evidenceForm: "two circumferences over same distance", targetForm: "revolution-count ratio", examContexts: ["TWO_WHEELS"] },
  { representationId: "CP011-R038", authorityKey: "twoWheelComparisonState", evidenceForm: "two wheel sizes over same distance", targetForm: "revolution-count difference", examContexts: ["TWO_WHEELS", "VEHICLE_WHEELS"] },
  { representationId: "CP011-R039", authorityKey: "twoWheelComparisonState", evidenceForm: "radius/diameter ratio under equal travelled distance", targetForm: "inverse revolution ratio", examContexts: ["TWO_WHEELS"] },
  { representationId: "CP011-R040", authorityKey: "twoWheelComparisonState", evidenceForm: "one wheel's revolution count plus both circumferences", targetForm: "other wheel's revolutions", examContexts: ["TWO_WHEELS"] },
  { representationId: "CP011-R041", authorityKey: "twoWheelComparisonState", evidenceForm: "common distance reconstructed from first wheel", targetForm: "second-wheel count difference", examContexts: ["TWO_WHEELS"] },
  { representationId: "CP011-R042", authorityKey: "twoWheelComparisonState", evidenceForm: "equal-distance rolling comparison with declared pi cancelled", targetForm: "relative revolution state", examContexts: ["TWO_WHEELS"] },
] as const satisfies readonly TsdCp011Representation[]);

export const TSD_CP011_REPRESENTATION_STATUS = Object.freeze({
  representations: TSD_CP011_REPRESENTATIONS.length,
  minimumPerAuthority: 6,
  learnerFacingContextDoesNotCreateNewQl: true,
  multiStageSurfaceScheduleHeldForCp012: true,
  pureCircumferenceMeasurementDelegatedToMensuration: true,
  gearPulleyBeltMechanicsExcluded: true,
} as const);