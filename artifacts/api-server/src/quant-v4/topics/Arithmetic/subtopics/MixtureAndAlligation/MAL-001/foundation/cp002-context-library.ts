export type MalCp002QuantityUnit = "kg" | "litres";

export interface MalCp002Context {
  contextId: string;
  actor: string;
  container: string;
  componentALabel: string;
  componentBLabel: string;
  quantityUnit: MalCp002QuantityUnit;
  domain:
    | "MILK_WATER"
    | "ALLOY"
    | "FOOD_GRADE"
    | "BEVERAGE_BLEND"
    | "FUEL_BLEND"
    | "OIL_BLEND"
    | "CONSTRUCTION_MIX"
    | "GRAIN_BLEND"
    | "COFFEE_BLEND"
    | "JUICE_BLEND";
}

/**
 * Contexts diversify learner transfer without creating separate task
 * identities. Only one of twelve entries is milk-water, keeping the source
 * pool safely below the chapter's 22% milk-water context cap.
 */
export const MAL_CP002_CONTEXT_LIBRARY: readonly MalCp002Context[] = [
  {
    contextId: "CP002-CTX-MILK-WATER",
    actor: "A dairy vendor",
    container: "can",
    componentALabel: "milk",
    componentBLabel: "water",
    quantityUnit: "litres",
    domain: "MILK_WATER",
  },
  {
    contextId: "CP002-CTX-COPPER-ZINC",
    actor: "An alloy maker",
    container: "batch",
    componentALabel: "copper",
    componentBLabel: "zinc",
    quantityUnit: "kg",
    domain: "ALLOY",
  },
  {
    contextId: "CP002-CTX-RICE-GRADES",
    actor: "A grain merchant",
    container: "lot",
    componentALabel: "Grade A rice",
    componentBLabel: "Grade B rice",
    quantityUnit: "kg",
    domain: "FOOD_GRADE",
  },
  {
    contextId: "CP002-CTX-TEA-VARIETIES",
    actor: "A tea seller",
    container: "blend",
    componentALabel: "Assam tea",
    componentBLabel: "Darjeeling tea",
    quantityUnit: "kg",
    domain: "BEVERAGE_BLEND",
  },
  {
    contextId: "CP002-CTX-PETROL-ETHANOL",
    actor: "A fuel technician",
    container: "tank",
    componentALabel: "petrol",
    componentBLabel: "ethanol",
    quantityUnit: "litres",
    domain: "FUEL_BLEND",
  },
  {
    contextId: "CP002-CTX-DIESEL-KEROSENE",
    actor: "A depot worker",
    container: "tank",
    componentALabel: "diesel",
    componentBLabel: "kerosene",
    quantityUnit: "litres",
    domain: "FUEL_BLEND",
  },
  {
    contextId: "CP002-CTX-MUSTARD-SUNFLOWER-OIL",
    actor: "An oil packer",
    container: "drum",
    componentALabel: "mustard oil",
    componentBLabel: "sunflower oil",
    quantityUnit: "litres",
    domain: "OIL_BLEND",
  },
  {
    contextId: "CP002-CTX-CEMENT-SAND",
    actor: "A site supervisor",
    container: "dry batch",
    componentALabel: "cement",
    componentBLabel: "sand",
    quantityUnit: "kg",
    domain: "CONSTRUCTION_MIX",
  },
  {
    contextId: "CP002-CTX-WHEAT-BARLEY",
    actor: "A mill operator",
    container: "grain lot",
    componentALabel: "wheat",
    componentBLabel: "barley",
    quantityUnit: "kg",
    domain: "GRAIN_BLEND",
  },
  {
    contextId: "CP002-CTX-COFFEE-CHICORY",
    actor: "A coffee roaster",
    container: "blend",
    componentALabel: "coffee",
    componentBLabel: "chicory",
    quantityUnit: "kg",
    domain: "COFFEE_BLEND",
  },
  {
    contextId: "CP002-CTX-APPLE-GRAPE-JUICE",
    actor: "A beverage maker",
    container: "vessel",
    componentALabel: "apple juice",
    componentBLabel: "grape juice",
    quantityUnit: "litres",
    domain: "JUICE_BLEND",
  },
  {
    contextId: "CP002-CTX-RED-YELLOW-LENTILS",
    actor: "A pulse merchant",
    container: "lot",
    componentALabel: "red lentils",
    componentBLabel: "yellow lentils",
    quantityUnit: "kg",
    domain: "FOOD_GRADE",
  },
] as const;

export function getMalCp002ContextById(contextId: string): MalCp002Context {
  const context = MAL_CP002_CONTEXT_LIBRARY.find(
    (entry) => entry.contextId === contextId,
  );
  if (!context) throw new Error(`Unknown MAL-CP-002 context: ${contextId}.`);
  return context;
}
