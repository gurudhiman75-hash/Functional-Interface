export type Trg002ScenarioDomain =
  | "GROUND"
  | "URBAN"
  | "ROAD"
  | "WATER"
  | "SHADOW"
  | "MOVEMENT"
  | "NATURAL"
  | "SUPPORT"
  | "MULTI_OBJECT";

export type Trg002SpatialTopology =
  | "SINGLE_RIGHT_TRIANGLE"
  | "ELEVATED_OBSERVER"
  | "SAME_SIDE_TWO_POSITIONS"
  | "OPPOSITE_SIDES"
  | "OBSERVER_BETWEEN_TARGETS"
  | "COMPOSITE_VERTICAL"
  | "TWO_VERTICAL_OBJECTS"
  | "SHADOW_CHANGE"
  | "SHADOW_COMPARISON"
  | "SUPPORT_TRIANGLE"
  | "RIVER_WIDTH"
  | "COLLINEAR_MULTI_OBJECT";

export type Trg002ScenarioCapability =
  | "DIRECT_HEIGHT_DISTANCE"
  | "FIND_ANGLE"
  | "FIND_HEIGHT"
  | "FIND_DISTANCE"
  | "TWO_ANGLES"
  | "ELEVATION_DEPRESSION"
  | "MOVING_OBSERVER"
  | "MOVING_TARGET"
  | "EYE_LEVEL"
  | "COMPOSITE_HEIGHT"
  | "EQUAL_HEIGHTS"
  | "SHADOWS"
  | "LADDER_OR_CABLE";

export type Trg002ScenarioShell = Readonly<{
  id: string;
  domain: Trg002ScenarioDomain;
  topology: Trg002SpatialTopology;
  capabilities: readonly Trg002ScenarioCapability[];
  objects: readonly string[];
  visualStrategy: string;
  realismNotes: string;
}>;

export const TRG_002_V4_SCENARIO_SHELLS: readonly Trg002ScenarioShell[] = [
  { id:"GROUND_TOWER", domain:"GROUND", topology:"SINGLE_RIGHT_TRIANGLE", capabilities:["DIRECT_HEIGHT_DISTANCE","FIND_ANGLE","FIND_HEIGHT","FIND_DISTANCE"], objects:["tower","observer"], visualStrategy:"ground-single-vertical", realismNotes:"Classic direct observation; distance must be horizontal." },
  { id:"GROUND_MONUMENT", domain:"GROUND", topology:"SINGLE_RIGHT_TRIANGLE", capabilities:["DIRECT_HEIGHT_DISTANCE","FIND_ANGLE","FIND_HEIGHT","FIND_DISTANCE"], objects:["monument","observer"], visualStrategy:"ground-single-vertical", realismNotes:"Use ordinary integer/decimal physical givens." },
  { id:"GROUND_CHIMNEY", domain:"GROUND", topology:"SINGLE_RIGHT_TRIANGLE", capabilities:["FIND_ANGLE","FIND_HEIGHT","FIND_DISTANCE"], objects:["chimney","observer"], visualStrategy:"ground-single-vertical", realismNotes:"Industrial structure; no eye-level correction unless explicitly stated." },
  { id:"GROUND_ELECTRIC_POLE", domain:"GROUND", topology:"SINGLE_RIGHT_TRIANGLE", capabilities:["FIND_ANGLE","FIND_HEIGHT","FIND_DISTANCE"], objects:["electric pole","observer"], visualStrategy:"ground-single-vertical", realismNotes:"Natural for short/medium heights." },
  { id:"GROUND_FLAGPOLE", domain:"GROUND", topology:"SINGLE_RIGHT_TRIANGLE", capabilities:["FIND_ANGLE","FIND_HEIGHT","FIND_DISTANCE"], objects:["flagpole","observer"], visualStrategy:"ground-single-vertical", realismNotes:"Avoid confusing pole height with flag dimensions." },

  { id:"URBAN_ROOFTOP_TO_TOWER", domain:"URBAN", topology:"ELEVATED_OBSERVER", capabilities:["TWO_ANGLES","ELEVATION_DEPRESSION","FIND_HEIGHT","FIND_DISTANCE"], objects:["building","tower"], visualStrategy:"elevated-observer-two-rays", realismNotes:"Observer height must be physically supported by the building." },
  { id:"URBAN_BALCONY_TO_POLE", domain:"URBAN", topology:"ELEVATED_OBSERVER", capabilities:["ELEVATION_DEPRESSION","FIND_HEIGHT","FIND_DISTANCE"], objects:["balcony","pole"], visualStrategy:"elevated-observer-two-rays", realismNotes:"State balcony/eye height explicitly." },
  { id:"URBAN_BUILDING_AND_MAST", domain:"URBAN", topology:"COMPOSITE_VERTICAL", capabilities:["COMPOSITE_HEIGHT","TWO_ANGLES","FIND_HEIGHT","FIND_DISTANCE"], objects:["building","mast"], visualStrategy:"composite-building-mast", realismNotes:"Show building and mast as distinct vertical segments." },
  { id:"URBAN_BUILDING_AND_FLAGPOLE", domain:"URBAN", topology:"COMPOSITE_VERTICAL", capabilities:["COMPOSITE_HEIGHT","TWO_ANGLES","FIND_HEIGHT"], objects:["building","flagpole"], visualStrategy:"composite-building-mast", realismNotes:"Answer may be pole-only or total height; wording must distinguish them." },
  { id:"URBAN_TWO_BUILDINGS", domain:"URBAN", topology:"TWO_VERTICAL_OBJECTS", capabilities:["TWO_ANGLES","ELEVATION_DEPRESSION","FIND_HEIGHT","FIND_DISTANCE"], objects:["building A","building B"], visualStrategy:"two-buildings-horizontal-separation", realismNotes:"Distance means horizontal distance between bases unless stated otherwise." },

  { id:"ROAD_EQUAL_PILLARS", domain:"ROAD", topology:"OBSERVER_BETWEEN_TARGETS", capabilities:["TWO_ANGLES","EQUAL_HEIGHTS","FIND_HEIGHT","FIND_DISTANCE"], objects:["pillar A","pillar B","road point"], visualStrategy:"road-equal-pillars-intermediate", realismNotes:"Exam-real opposite sides of roadway; total road width/separation can be given." },
  { id:"ROAD_TWO_SIDES_TOWER_CARS", domain:"ROAD", topology:"OPPOSITE_SIDES", capabilities:["TWO_ANGLES","FIND_DISTANCE","MOVING_TARGET"], objects:["tower","car A","car B"], visualStrategy:"tower-opposite-side-targets", realismNotes:"Cars/points must be on a straight road through the tower base." },
  { id:"ROAD_CAR_APPROACHES_TOWER", domain:"ROAD", topology:"SAME_SIDE_TWO_POSITIONS", capabilities:["TWO_ANGLES","MOVING_OBSERVER","FIND_DISTANCE"], objects:["car","tower"], visualStrategy:"same-side-two-positions", realismNotes:"Give distance travelled or time/speed; positions remain collinear." },
  { id:"ROAD_CAR_RECEDES_POLE", domain:"ROAD", topology:"SAME_SIDE_TWO_POSITIONS", capabilities:["TWO_ANGLES","MOVING_OBSERVER","FIND_DISTANCE"], objects:["car","pole"], visualStrategy:"same-side-two-positions", realismNotes:"Farther point must have smaller elevation angle." },
  { id:"ROAD_PERSON_BETWEEN_TOWERS", domain:"ROAD", topology:"OBSERVER_BETWEEN_TARGETS", capabilities:["TWO_ANGLES","FIND_HEIGHT","FIND_DISTANCE"], objects:["tower A","tower B","observer"], visualStrategy:"observer-between-two-verticals", realismNotes:"Useful for equal/different heights and total separation constraints." },

  { id:"WATER_LIGHTHOUSE_SHIP", domain:"WATER", topology:"ELEVATED_OBSERVER", capabilities:["ELEVATION_DEPRESSION","FIND_DISTANCE","FIND_HEIGHT"], objects:["lighthouse","ship"], visualStrategy:"lighthouse-sea-target", realismNotes:"Horizontal sea-level distance from lighthouse base to ship." },
  { id:"WATER_SHIP_APPROACHES_LIGHTHOUSE", domain:"WATER", topology:"SAME_SIDE_TWO_POSITIONS", capabilities:["TWO_ANGLES","MOVING_TARGET","FIND_DISTANCE"], objects:["lighthouse","ship"], visualStrategy:"lighthouse-two-ship-positions", realismNotes:"Natural changing angle of depression/elevation scenario." },
  { id:"WATER_TWO_BOATS_OPPOSITE", domain:"WATER", topology:"OPPOSITE_SIDES", capabilities:["TWO_ANGLES","FIND_DISTANCE"], objects:["lighthouse","boat A","boat B"], visualStrategy:"lighthouse-opposite-boats", realismNotes:"Explicitly state boats are on opposite sides along one straight line." },
  { id:"WATER_BRIDGE_RIVER_WIDTH", domain:"WATER", topology:"RIVER_WIDTH", capabilities:["ELEVATION_DEPRESSION","FIND_DISTANCE"], objects:["bridge","river banks"], visualStrategy:"river-two-banks", realismNotes:"Diagram must depict both banks/water; width is perpendicular bank-to-bank distance." },
  { id:"WATER_CLIFF_BOAT", domain:"WATER", topology:"ELEVATED_OBSERVER", capabilities:["ELEVATION_DEPRESSION","FIND_DISTANCE"], objects:["cliff","boat"], visualStrategy:"cliff-sea-target", realismNotes:"Cliff height is a natural support for elevated observation." },

  { id:"SHADOW_TOWER_DIRECT", domain:"SHADOW", topology:"SHADOW_COMPARISON", capabilities:["SHADOWS","FIND_HEIGHT","FIND_ANGLE"], objects:["tower","shadow"], visualStrategy:"vertical-shadow-ray", realismNotes:"Solar elevation angle and shadow length form a right triangle." },
  { id:"SHADOW_DIFFERENCE_TWO_TIMES", domain:"SHADOW", topology:"SHADOW_CHANGE", capabilities:["SHADOWS","TWO_ANGLES","FIND_HEIGHT","FIND_DISTANCE"], objects:["tower","two shadow endpoints"], visualStrategy:"two-shadow-endpoints", realismNotes:"Give difference between shadow lengths rather than both lengths." },
  { id:"SHADOW_UNFINISHED_TOWER", domain:"SHADOW", topology:"SHADOW_CHANGE", capabilities:["SHADOWS","TWO_ANGLES","FIND_HEIGHT"], objects:["tower","extension","shadow"], visualStrategy:"tower-extension-shadow", realismNotes:"Height is increased until angle/shadow condition changes." },
  { id:"SHADOW_EQUAL_OBJECTS", domain:"SHADOW", topology:"SHADOW_COMPARISON", capabilities:["SHADOWS","EQUAL_HEIGHTS","FIND_DISTANCE","FIND_HEIGHT"], objects:["two vertical objects","shadows"], visualStrategy:"two-object-shadow-comparison", realismNotes:"Useful for ratios/equal-height constraints." },

  { id:"MOVE_PERSON_TOWARD_TOWER", domain:"MOVEMENT", topology:"SAME_SIDE_TWO_POSITIONS", capabilities:["TWO_ANGLES","MOVING_OBSERVER","FIND_DISTANCE"], objects:["person","tower"], visualStrategy:"same-side-two-positions", realismNotes:"Canonical movement form; should not dominate the chapter." },
  { id:"MOVE_PERSON_AWAY_FROM_BUILDING", domain:"MOVEMENT", topology:"SAME_SIDE_TWO_POSITIONS", capabilities:["TWO_ANGLES","MOVING_OBSERVER","FIND_DISTANCE"], objects:["person","building"], visualStrategy:"same-side-two-positions", realismNotes:"Angles must decrease as observer moves away." },
  { id:"MOVE_VEHICLE_TIME_SPEED", domain:"MOVEMENT", topology:"SAME_SIDE_TWO_POSITIONS", capabilities:["TWO_ANGLES","MOVING_OBSERVER","FIND_DISTANCE"], objects:["vehicle","tower","speed/time"], visualStrategy:"same-side-two-positions", realismNotes:"Converts travel time/speed into horizontal movement before trig." },

  { id:"NATURAL_TREE_OBSERVER", domain:"NATURAL", topology:"SINGLE_RIGHT_TRIANGLE", capabilities:["FIND_HEIGHT","FIND_DISTANCE","FIND_ANGLE"], objects:["tree","observer"], visualStrategy:"ground-single-vertical", realismNotes:"Use plausible tree heights and ordinary measurements." },
  { id:"NATURAL_HILL_VIEWPOINT", domain:"NATURAL", topology:"ELEVATED_OBSERVER", capabilities:["ELEVATION_DEPRESSION","FIND_DISTANCE"], objects:["hill viewpoint","ground target"], visualStrategy:"cliff-ground-target", realismNotes:"Observation height must be specified geometrically, not as a floating point." },

  { id:"SUPPORT_LADDER_WALL", domain:"SUPPORT", topology:"SUPPORT_TRIANGLE", capabilities:["LADDER_OR_CABLE","FIND_HEIGHT","FIND_DISTANCE","FIND_ANGLE"], objects:["ladder","wall"], visualStrategy:"ladder-wall", realismNotes:"Use lower end/top end terminology; angle may be with ground or wall." },
  { id:"SUPPORT_GUY_WIRE_POLE", domain:"SUPPORT", topology:"SUPPORT_TRIANGLE", capabilities:["LADDER_OR_CABLE","FIND_HEIGHT","FIND_DISTANCE","FIND_ANGLE"], objects:["pole","guy wire","ground anchor"], visualStrategy:"guy-wire-pole", realismNotes:"Wire length is hypotenuse; anchor distance is horizontal." },

  { id:"MULTI_PERSON_TREE_BUILDING", domain:"MULTI_OBJECT", topology:"COLLINEAR_MULTI_OBJECT", capabilities:["TWO_ANGLES","FIND_HEIGHT","FIND_DISTANCE","EYE_LEVEL"], objects:["observer","tree","building"], visualStrategy:"collinear-three-object", realismNotes:"Use visibility/alignment constraints only when explicitly stated." },
  { id:"MULTI_TWO_TOWERS_SAME_SIDE", domain:"MULTI_OBJECT", topology:"TWO_VERTICAL_OBJECTS", capabilities:["TWO_ANGLES","FIND_HEIGHT","FIND_DISTANCE"], objects:["tower A","tower B","observer"], visualStrategy:"two-towers-same-side", realismNotes:"Distances to both bases must be unambiguous." },
  { id:"MULTI_TOWER_AND_POLE", domain:"MULTI_OBJECT", topology:"TWO_VERTICAL_OBJECTS", capabilities:["TWO_ANGLES","FIND_HEIGHT","FIND_DISTANCE","EQUAL_HEIGHTS"], objects:["tower","pole","observer"], visualStrategy:"two-vertical-objects", realismNotes:"Supports comparison/ratio/equal-angle forms." },
  { id:"MULTI_OBSERVER_EYE_LEVEL", domain:"MULTI_OBJECT", topology:"SINGLE_RIGHT_TRIANGLE", capabilities:["EYE_LEVEL","FIND_HEIGHT","FIND_DISTANCE","FIND_ANGLE"], objects:["observer","building"], visualStrategy:"eye-level-single-target", realismNotes:"Separate eye height from vertical rise to target." },
  { id:"MULTI_ROOF_TO_BASE_AND_TOP", domain:"MULTI_OBJECT", topology:"ELEVATED_OBSERVER", capabilities:["ELEVATION_DEPRESSION","TWO_ANGLES","FIND_HEIGHT","FIND_DISTANCE"], objects:["building A","building B"], visualStrategy:"roof-base-top-two-rays", realismNotes:"One ray to base and one to top; horizontal separation is shared." },
] as const;

export const TRG_002_V4_SCENARIO_POLICY = {
  minimumShells: 36,
  minimumDomains: 8,
  minimumTopologies: 10,
  recommendedScenariosPerCoreArchetype: 3,
  allowSurdPhysicalGivenByDefault: false,
  requirePhysicalSupportForElevatedObserver: true,
  requireExplicitDistanceKindWhenAmbiguous: true,
  requireScenarioAwareDiagram: true,
} as const;

function hash32(value: string) {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function selectTrg002V4ScenarioShell(args: {
  qlId: string;
  seed: string;
  topology: Trg002SpatialTopology;
  requiredCapabilities?: readonly Trg002ScenarioCapability[];
}) {
  const required = new Set(args.requiredCapabilities ?? []);
  const compatible = TRG_002_V4_SCENARIO_SHELLS.filter((shell) =>
    shell.topology === args.topology && [...required].every((capability) => shell.capabilities.includes(capability)),
  );
  if (!compatible.length) throw new Error(`${args.qlId}: no V4 scenario shell for topology ${args.topology}.`);
  return compatible[hash32(`${args.qlId}|${args.seed}|${args.topology}`) % compatible.length];
}

export function assertTrg002V4ScenarioCatalog() {
  const ids = new Set(TRG_002_V4_SCENARIO_SHELLS.map((shell) => shell.id));
  if (ids.size !== TRG_002_V4_SCENARIO_SHELLS.length) throw new Error("TRG-002 V4 scenario IDs must be unique.");
  const domains = new Set(TRG_002_V4_SCENARIO_SHELLS.map((shell) => shell.domain));
  const topologies = new Set(TRG_002_V4_SCENARIO_SHELLS.map((shell) => shell.topology));
  if (TRG_002_V4_SCENARIO_SHELLS.length < TRG_002_V4_SCENARIO_POLICY.minimumShells) throw new Error("TRG-002 V4 scenario catalog is too thin.");
  if (domains.size < TRG_002_V4_SCENARIO_POLICY.minimumDomains) throw new Error("TRG-002 V4 scenario domain breadth is too thin.");
  if (topologies.size < TRG_002_V4_SCENARIO_POLICY.minimumTopologies) throw new Error("TRG-002 V4 spatial topology breadth is too thin.");
  return { shells: TRG_002_V4_SCENARIO_SHELLS.length, domains: domains.size, topologies: topologies.size } as const;
}
