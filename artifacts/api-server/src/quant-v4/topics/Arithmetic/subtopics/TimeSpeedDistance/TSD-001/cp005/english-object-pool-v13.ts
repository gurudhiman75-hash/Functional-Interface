export type Cp005V13ObjectTopology = "OPPOSITE_ONE_WAY" | "OPPOSITE_REPEAT" | "SAME_START_RETURN" | "OPPOSITE_HALT";
export type Cp005V13RouteKind = "ROAD" | "RAIL" | "TRACK";

export type Cp005V13ObjectContext = Readonly<{
  id: string;
  topology: Cp005V13ObjectTopology;
  objectFamily: string;
  endpointFamily: string;
  actorA: string;
  actorB: string;
  plural: string;
  routeKind: Cp005V13RouteKind;
  intro: string;
}>;

function ctx(
  id: string,
  topology: Cp005V13ObjectTopology,
  objectFamily: string,
  endpointFamily: string,
  actorLabel: string,
  plural: string,
  routeKind: Cp005V13RouteKind,
  intro: string,
): Cp005V13ObjectContext {
  return Object.freeze({
    id,
    topology,
    objectFamily,
    endpointFamily,
    actorA: `${actorLabel} A`,
    actorB: `${actorLabel} B`,
    plural,
    routeKind,
    intro,
  });
}

const OPPOSITE_ONE_WAY = Object.freeze([
  ctx("OW_INTERCITY_BUS_TERMINALS", "OPPOSITE_ONE_WAY", "INTERCITY_BUS", "TERMINALS", "Bus", "buses", "ROAD", "Bus A and Bus B run between terminals P and Q."),
  ctx("OW_EXPRESS_COACH_TOWNS", "OPPOSITE_ONE_WAY", "EXPRESS_COACH", "TOWNS", "Coach", "coaches", "ROAD", "Coach A and Coach B travel between towns P and Q."),
  ctx("OW_TAXI_CITIES", "OPPOSITE_ONE_WAY", "TAXI", "CITIES", "Taxi", "taxis", "ROAD", "Taxi A and Taxi B use the road joining cities P and Q."),
  ctx("OW_SEDAN_TOWNS", "OPPOSITE_ONE_WAY", "CAR", "TOWNS", "Car", "cars", "ROAD", "Car A and Car B travel between towns P and Q."),
  ctx("OW_DELIVERY_VAN_DEPOTS", "OPPOSITE_ONE_WAY", "DELIVERY_VAN", "DEPOTS", "Delivery van", "delivery vans", "ROAD", "Delivery van A and Delivery van B operate between depots P and Q."),
  ctx("OW_COURIER_VAN_HUBS", "OPPOSITE_ONE_WAY", "COURIER_VAN", "HUBS", "Courier van", "courier vans", "ROAD", "Courier van A and Courier van B travel between hubs P and Q."),
  ctx("OW_PASSENGER_TRAIN_STATIONS", "OPPOSITE_ONE_WAY", "PASSENGER_TRAIN", "STATIONS", "Train", "trains", "RAIL", "Passenger trains A and B run between railway stations P and Q."),
  ctx("OW_EXPRESS_TRAIN_JUNCTIONS", "OPPOSITE_ONE_WAY", "EXPRESS_TRAIN", "JUNCTIONS", "Train", "trains", "RAIL", "Express trains A and B run between junctions P and Q."),
  ctx("OW_MINIBUS_TERMINALS", "OPPOSITE_ONE_WAY", "MINIBUS", "TERMINALS", "Minibus", "minibuses", "ROAD", "Minibus A and Minibus B operate between terminals P and Q."),
  ctx("OW_JEEP_CHECKPOINTS", "OPPOSITE_ONE_WAY", "JEEP", "CHECKPOINTS", "Jeep", "jeeps", "ROAD", "Jeep A and Jeep B travel between checkpoints P and Q."),
  ctx("OW_CARGO_TRUCK_WAREHOUSES", "OPPOSITE_ONE_WAY", "CARGO_TRUCK", "WAREHOUSES", "Truck", "trucks", "ROAD", "Truck A and Truck B travel between warehouses P and Q."),
  ctx("OW_POSTAL_VAN_CENTRES", "OPPOSITE_ONE_WAY", "POSTAL_VAN", "SORTING_CENTRES", "Postal van", "postal vans", "ROAD", "Postal van A and Postal van B run between sorting centres P and Q."),
  ctx("OW_COMPANY_CAR_OFFICES", "OPPOSITE_ONE_WAY", "COMPANY_CAR", "OFFICES", "Company car", "company cars", "ROAD", "Company car A and Company car B travel between offices P and Q."),
  ctx("OW_TRANSPORT_VAN_LOGISTICS", "OPPOSITE_ONE_WAY", "TRANSPORT_VAN", "LOGISTICS_CENTRES", "Transport van", "transport vans", "ROAD", "Transport van A and Transport van B run between logistics centres P and Q."),
] as const);

const OPPOSITE_REPEAT = Object.freeze([
  ctx("RP_SHUTTLE_BUS_TERMINALS", "OPPOSITE_REPEAT", "SHUTTLE_BUS", "TERMINALS", "Shuttle bus", "shuttle buses", "ROAD", "Shuttle bus A and Shuttle bus B operate repeatedly between terminals P and Q."),
  ctx("RP_PATROL_CAR_CHECKPOINTS", "OPPOSITE_REPEAT", "PATROL_CAR", "CHECKPOINTS", "Patrol car", "patrol cars", "ROAD", "Patrol car A and Patrol car B move between checkpoints P and Q."),
  ctx("RP_SERVICE_VAN_DEPOTS", "OPPOSITE_REPEAT", "SERVICE_VAN", "DEPOTS", "Service van", "service vans", "ROAD", "Service van A and Service van B shuttle between depots P and Q."),
  ctx("RP_INSPECTION_JEEP_POSTS", "OPPOSITE_REPEAT", "INSPECTION_JEEP", "INSPECTION_POSTS", "Inspection jeep", "inspection jeeps", "ROAD", "Inspection jeep A and Inspection jeep B move between posts P and Q."),
  ctx("RP_TEST_CAR_MARKERS", "OPPOSITE_REPEAT", "TEST_CAR", "TRACK_MARKERS", "Test car", "test cars", "TRACK", "Test car A and Test car B move on a straight test track between markers P and Q."),
  ctx("RP_COURIER_VAN_HUBS", "OPPOSITE_REPEAT", "COURIER_VAN", "HUBS", "Courier van", "courier vans", "ROAD", "Courier van A and Courier van B shuttle between hubs P and Q."),
  ctx("RP_MINIBUS_TERMINALS", "OPPOSITE_REPEAT", "MINIBUS", "TERMINALS", "Minibus", "minibuses", "ROAD", "Minibus A and Minibus B run repeatedly between terminals P and Q."),
  ctx("RP_MAINTENANCE_VAN_GATES", "OPPOSITE_REPEAT", "MAINTENANCE_VAN", "GATES", "Maintenance van", "maintenance vans", "ROAD", "Maintenance van A and Maintenance van B move between gates P and Q."),
  ctx("RP_POSTAL_VAN_CENTRES", "OPPOSITE_REPEAT", "POSTAL_VAN", "SORTING_CENTRES", "Postal van", "postal vans", "ROAD", "Postal van A and Postal van B run between sorting centres P and Q."),
  ctx("RP_SHUTTLE_VAN_DEPOTS", "OPPOSITE_REPEAT", "SHUTTLE_VAN", "DEPOTS", "Shuttle van", "shuttle vans", "ROAD", "Shuttle van A and Shuttle van B move repeatedly between depots P and Q."),
  ctx("RP_COMPANY_CAR_SITES", "OPPOSITE_REPEAT", "COMPANY_CAR", "WORK_SITES", "Company car", "company cars", "ROAD", "Company car A and Company car B travel between work sites P and Q."),
  ctx("RP_UTILITY_VEHICLE_CHECKPOINTS", "OPPOSITE_REPEAT", "UTILITY_VEHICLE", "CHECKPOINTS", "Utility vehicle", "utility vehicles", "ROAD", "Utility vehicle A and Utility vehicle B move between checkpoints P and Q."),
] as const);

const SAME_START_RETURN = Object.freeze([
  ctx("SR_CAR_TOWNS", "SAME_START_RETURN", "CAR", "TOWNS", "Car", "cars", "ROAD", "Car A and Car B travel from town P towards town Q."),
  ctx("SR_TAXI_CITIES", "SAME_START_RETURN", "TAXI", "CITIES", "Taxi", "taxis", "ROAD", "Taxi A and Taxi B leave city P for city Q."),
  ctx("SR_DELIVERY_VAN_DEPOTS", "SAME_START_RETURN", "DELIVERY_VAN", "DEPOTS", "Delivery van", "delivery vans", "ROAD", "Delivery van A and Delivery van B leave depot P for depot Q."),
  ctx("SR_COURIER_VAN_HUBS", "SAME_START_RETURN", "COURIER_VAN", "HUBS", "Courier van", "courier vans", "ROAD", "Courier van A and Courier van B travel from hub P towards hub Q."),
  ctx("SR_JEEP_CHECKPOINTS", "SAME_START_RETURN", "JEEP", "CHECKPOINTS", "Jeep", "jeeps", "ROAD", "Jeep A and Jeep B leave checkpoint P for checkpoint Q."),
  ctx("SR_MOTORCYCLE_POSTS", "SAME_START_RETURN", "MOTORCYCLE", "POSTS", "Motorcycle", "motorcycles", "ROAD", "Motorcycle A and Motorcycle B travel from post P towards post Q."),
  ctx("SR_MINIBUS_TERMINALS", "SAME_START_RETURN", "MINIBUS", "TERMINALS", "Minibus", "minibuses", "ROAD", "Minibus A and Minibus B leave terminal P for terminal Q."),
  ctx("SR_COACH_TOWNS", "SAME_START_RETURN", "COACH", "TOWNS", "Coach", "coaches", "ROAD", "Coach A and Coach B travel from town P towards town Q."),
  ctx("SR_SERVICE_CAR_CENTRES", "SAME_START_RETURN", "SERVICE_CAR", "SERVICE_CENTRES", "Service car", "service cars", "ROAD", "Service car A and Service car B leave service centre P for centre Q."),
  ctx("SR_TRANSPORT_VAN_WAREHOUSES", "SAME_START_RETURN", "TRANSPORT_VAN", "WAREHOUSES", "Transport van", "transport vans", "ROAD", "Transport van A and Transport van B leave warehouse P for warehouse Q."),
  ctx("SR_POSTAL_VAN_CENTRES", "SAME_START_RETURN", "POSTAL_VAN", "SORTING_CENTRES", "Postal van", "postal vans", "ROAD", "Postal van A and Postal van B travel from sorting centre P towards centre Q."),
  ctx("SR_COMPANY_CAR_OFFICES", "SAME_START_RETURN", "COMPANY_CAR", "OFFICES", "Company car", "company cars", "ROAD", "Company car A and Company car B leave office P for office Q."),
] as const);

const OPPOSITE_HALT = Object.freeze([
  ctx("HL_BUS_TERMINALS", "OPPOSITE_HALT", "INTERCITY_BUS", "TERMINALS", "Bus", "buses", "ROAD", "Bus A and Bus B operate between terminals P and Q."),
  ctx("HL_COACH_TERMINALS", "OPPOSITE_HALT", "COACH", "TERMINALS", "Coach", "coaches", "ROAD", "Coach A and Coach B travel between terminals P and Q."),
  ctx("HL_PASSENGER_TRAIN_STATIONS", "OPPOSITE_HALT", "PASSENGER_TRAIN", "STATIONS", "Train", "trains", "RAIL", "Passenger trains A and B run between terminal stations P and Q."),
  ctx("HL_EXPRESS_TRAIN_STATIONS", "OPPOSITE_HALT", "EXPRESS_TRAIN", "STATIONS", "Train", "trains", "RAIL", "Express trains A and B operate between stations P and Q."),
  ctx("HL_SHUTTLE_BUS_TERMINALS", "OPPOSITE_HALT", "SHUTTLE_BUS", "TERMINALS", "Shuttle bus", "shuttle buses", "ROAD", "Shuttle bus A and Shuttle bus B run between terminals P and Q."),
  ctx("HL_SERVICE_VAN_DEPOTS", "OPPOSITE_HALT", "SERVICE_VAN", "DEPOTS", "Service van", "service vans", "ROAD", "Service van A and Service van B operate between depots P and Q."),
  ctx("HL_PATROL_CAR_CHECKPOINTS", "OPPOSITE_HALT", "PATROL_CAR", "CHECKPOINTS", "Patrol car", "patrol cars", "ROAD", "Patrol car A and Patrol car B move between checkpoints P and Q."),
  ctx("HL_COURIER_VAN_HUBS", "OPPOSITE_HALT", "COURIER_VAN", "HUBS", "Courier van", "courier vans", "ROAD", "Courier van A and Courier van B run between hubs P and Q."),
  ctx("HL_MAINTENANCE_VAN_GATES", "OPPOSITE_HALT", "MAINTENANCE_VAN", "GATES", "Maintenance van", "maintenance vans", "ROAD", "Maintenance van A and Maintenance van B move between gates P and Q."),
  ctx("HL_MINIBUS_TERMINALS", "OPPOSITE_HALT", "MINIBUS", "TERMINALS", "Minibus", "minibuses", "ROAD", "Minibus A and Minibus B operate between terminals P and Q."),
  ctx("HL_TRANSPORT_VAN_WAREHOUSES", "OPPOSITE_HALT", "TRANSPORT_VAN", "WAREHOUSES", "Transport van", "transport vans", "ROAD", "Transport van A and Transport van B run between warehouses P and Q."),
  ctx("HL_POSTAL_VAN_CENTRES", "OPPOSITE_HALT", "POSTAL_VAN", "SORTING_CENTRES", "Postal van", "postal vans", "ROAD", "Postal van A and Postal van B operate between sorting centres P and Q."),
] as const);

export const TSD_CP005_V13_OBJECT_POOLS = Object.freeze({
  OPPOSITE_ONE_WAY,
  OPPOSITE_REPEAT,
  SAME_START_RETURN,
  OPPOSITE_HALT,
});

export const TSD_CP005_V13_OBJECT_CONTEXT_POOL = Object.freeze([
  ...OPPOSITE_ONE_WAY,
  ...OPPOSITE_REPEAT,
  ...SAME_START_RETURN,
  ...OPPOSITE_HALT,
]);
