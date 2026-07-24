import type { SemanticFact } from "../foundation/types";

const PAIRS = {
  SEM_COUNTRY_CAPITAL: [["India", "New Delhi"], ["Japan", "Tokyo"], ["France", "Paris"], ["Nepal", "Kathmandu"]],
  SEM_STATE_CAPITAL: [["Punjab", "Chandigarh"], ["Rajasthan", "Jaipur"], ["Bihar", "Patna"], ["Assam", "Dispur"]],
  SEM_COUNTRY_CURRENCY: [["Japan", "Yen"], ["United Kingdom", "Pound sterling"], ["Bangladesh", "Taka"], ["Nepal", "Nepalese rupee"]],
  SEM_ANIMAL_YOUNG: [["Lion", "Cub"], ["Cow", "Calf"], ["Dog", "Puppy"], ["Horse", "Foal"]],
  SEM_MALE_FEMALE: [["Horse", "Mare"], ["Lion", "Lioness"], ["Peacock", "Peahen"], ["Ram", "Ewe"]],
  SEM_ANIMAL_SOUND: [["Lion", "Roar"], ["Snake", "Hiss"], ["Bee", "Buzz"], ["Horse", "Neigh"]],
  SEM_ANIMAL_MOVEMENT: [["Horse", "Gallop"], ["Snake", "Slither"], ["Rabbit", "Hop"], ["Bird", "Fly"]],
  SEM_WORKER_WORKPLACE: [["Doctor", "Hospital"], ["Teacher", "School"], ["Judge", "Court"], ["Farmer", "Farm"]],
  SEM_WORKER_TOOL: [["Carpenter", "Saw"], ["Tailor", "Needle"], ["Painter", "Brush"], ["Barber", "Razor"]],
  SEM_WORKER_PRODUCT: [["Author", "Book"], ["Potter", "Pot"], ["Weaver", "Cloth"], ["Baker", "Bread"]],
  SEM_INSTRUMENT_MEASUREMENT: [["Thermometer", "Temperature"], ["Barometer", "Pressure"], ["Ammeter", "Current"], ["Speedometer", "Speed"]],
  SEM_QUANTITY_UNIT: [["Force", "Newton"], ["Power", "Watt"], ["Current", "Ampere"], ["Resistance", "Ohm"]],
  SEM_OBJECT_FUNCTION: [["Knife", "Cut"], ["Pen", "Write"], ["Key", "Unlock"], ["Needle", "Sew"]],
  SEM_PART_WHOLE: [["Page", "Book"], ["Wheel", "Car"], ["Petal", "Flower"], ["Branch", "Tree"]],
  SEM_MEMBER_CLASS: [["Snake", "Reptile"], ["Whale", "Mammal"], ["Rose", "Flower"], ["Copper", "Metal"]],
  SEM_INDIVIDUAL_GROUP: [["Sailor", "Crew"], ["Player", "Team"], ["Soldier", "Army"], ["Singer", "Choir"]],
  SEM_PRODUCT_MATERIAL: [["Furniture", "Wood"], ["Glass", "Sand"], ["Paper", "Pulp"], ["Tyre", "Rubber"]],
  SEM_PLACE_PURPOSE: [["Court", "Justice"], ["School", "Education"], ["Hospital", "Treatment"], ["Library", "Reading"]],
} as const;

export const ANA_CP001_FACTS: readonly SemanticFact[] = Object.entries(PAIRS).flatMap(
  ([relation, pairs], relationIndex) => pairs.map(([left, right], pairIndex) => ({
    id: `ANA-SF-${String(relationIndex * 4 + pairIndex + 1).padStart(3, "0")}`,
    left, right, relation, direction: "FORWARD" as const,
    explanation: `${left} is related to ${right} by the ${relation} relationship.`,
    locale: "en-IN" as const,
    examSuitability: ["SSC", "BANKING", "PUNJAB"] as const,
    version: "1.0.0", status: "CURATED" as const,
  })),
);
