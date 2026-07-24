import type { SemanticFact } from "../foundation/types";
import { relationDefinition } from "./relation-definitions";

const PAIRS: Record<string, readonly (readonly [string, string])[]> = {
  SEM_COUNTRY_CAPITAL: [["India","New Delhi"],["Japan","Tokyo"],["France","Paris"],["Nepal","Kathmandu"],["Bhutan","Thimphu"],["Bangladesh","Dhaka"],["Canada","Ottawa"],["Australia","Canberra"],["Brazil","Brasilia"],["Egypt","Cairo"],["Italy","Rome"],["Thailand","Bangkok"]],
  SEM_STATE_CAPITAL: [["Punjab","Chandigarh"],["Rajasthan","Jaipur"],["Bihar","Patna"],["Assam","Dispur"],["Gujarat","Gandhinagar"],["Odisha","Bhubaneswar"],["Kerala","Thiruvananthapuram"],["Karnataka","Bengaluru"],["Tamil Nadu","Chennai"],["Jharkhand","Ranchi"],["Uttarakhand","Dehradun"],["Himachal Pradesh","Shimla"]],
  SEM_COUNTRY_CURRENCY: [["Japan","Yen"],["United Kingdom","Pound sterling"],["Bangladesh","Taka"],["Nepal","Nepalese rupee"],["India","Indian rupee"],["United States","US dollar"],["China","Renminbi"],["Russia","Ruble"],["Thailand","Baht"],["South Korea","Won"],["Saudi Arabia","Riyal"],["United Arab Emirates","Dirham"]],
  SEM_ANIMAL_YOUNG: [["Lion","Cub"],["Cow","Calf"],["Dog","Puppy"],["Horse","Foal"],["Cat","Kitten"],["Goat","Kid"],["Sheep","Lamb"],["Deer","Fawn"],["Duck","Duckling"],["Hen","Chick"],["Pig","Piglet"],["Kangaroo","Joey"]],
  SEM_MALE_FEMALE: [["Horse","Mare"],["Lion","Lioness"],["Peacock","Peahen"],["Ram","Ewe"],["Bull","Cow"],["Stallion","Mare"],["Tiger","Tigress"],["Fox","Vixen"],["Cock","Hen"],["Drake","Duck"],["Boar","Sow"],["Gander","Goose"]],
  SEM_ANIMAL_SOUND: [["Lion","Roar"],["Snake","Hiss"],["Bee","Buzz"],["Horse","Neigh"],["Dog","Bark"],["Cat","Meow"],["Cow","Moo"],["Sheep","Bleat"],["Duck","Quack"],["Frog","Croak"],["Owl","Hoot"],["Elephant","Trumpet"]],
  SEM_ANIMAL_MOVEMENT: [["Horse","Gallop"],["Snake","Slither"],["Rabbit","Hop"],["Fish","Swim"],["Bird","Fly"],["Kangaroo","Leap"],["Penguin","Waddle"],["Crocodile","Crawl"],["Monkey","Climb"],["Duck","Paddle"],["Eagle","Soar"],["Worm","Creep"]],
  SEM_WORKER_WORKPLACE: [["Doctor","Hospital"],["Teacher","School"],["Judge","Court"],["Farmer","Farm"],["Librarian","Library"],["Chef","Kitchen"],["Mechanic","Workshop"],["Scientist","Laboratory"],["Banker","Bank"],["Sailor","Ship"],["Miner","Mine"],["Pilot","Cockpit"]],
  SEM_WORKER_TOOL: [["Carpenter","Saw"],["Tailor","Needle"],["Painter","Brush"],["Barber","Razor"],["Blacksmith","Hammer"],["Farmer","Plough"],["Surgeon","Scalpel"],["Photographer","Camera"],["Mason","Trowel"],["Gardener","Spade"],["Fisherman","Net"],["Writer","Pen"]],
  SEM_WORKER_PRODUCT: [["Author","Book"],["Potter","Pot"],["Weaver","Cloth"],["Baker","Bread"],["Carpenter","Furniture"],["Cobbler","Shoes"],["Goldsmith","Jewellery"],["Farmer","Crop"],["Sculptor","Statue"],["Tailor","Garment"],["Printer","Newspaper"],["Dairy farmer","Milk"]],
  SEM_INSTRUMENT_MEASUREMENT: [["Thermometer","Temperature"],["Barometer","Atmospheric pressure"],["Ammeter","Electric current"],["Speedometer","Speed"],["Voltmeter","Voltage"],["Hygrometer","Humidity"],["Anemometer","Wind speed"],["Odometer","Distance travelled"],["Altimeter","Altitude"],["Seismograph","Earthquake vibrations"],["Rain gauge","Rainfall"],["Weighing scale","Mass"]],
  SEM_QUANTITY_UNIT: [["Force","Newton"],["Power","Watt"],["Electric current","Ampere"],["Electrical resistance","Ohm"],["Energy","Joule"],["Pressure","Pascal"],["Frequency","Hertz"],["Electric charge","Coulomb"],["Potential difference","Volt"],["Capacitance","Farad"],["Magnetic flux","Weber"],["Inductance","Henry"]],
  SEM_OBJECT_FUNCTION: [["Knife","Cut"],["Pen","Write"],["Key","Unlock"],["Needle","Sew"],["Scissors","Trim"],["Compass","Draw circles"],["Thermometer","Measure temperature"],["Umbrella","Protect from rain"],["Telescope","Observe distant objects"],["Microscope","Magnify small objects"],["Eraser","Remove pencil marks"],["Calculator","Perform calculations"]],
  SEM_PART_WHOLE: [["Page","Book"],["Wheel","Car"],["Petal","Flower"],["Branch","Tree"],["Key","Keyboard"],["Room","House"],["Chapter","Novel"],["Finger","Hand"],["Leaf","Plant"],["Engine","Aeroplane"],["Brick","Wall"],["Link","Chain"]],
  SEM_MEMBER_CLASS: [["Snake","Reptile"],["Whale","Mammal"],["Rose","Flower"],["Copper","Metal"],["Eagle","Bird"],["Shark","Fish"],["Granite","Rock"],["Triangle","Polygon"],["Mercury","Planet"],["Oak","Tree"],["Python","Programming language"],["Violin","String instrument"]],
  SEM_INDIVIDUAL_GROUP: [["Sailor","Crew"],["Player","Team"],["Soldier","Army"],["Singer","Choir"],["Judge","Bench"],["Musician","Orchestra"],["Actor","Cast"],["Director","Board"],["Member","Committee"],["Dancer","Troupe"],["Athlete","Squad"],["Scientist","Research team"]],
  SEM_PRODUCT_MATERIAL: [["Furniture","Wood"],["Glass","Sand"],["Paper","Pulp"],["Tyre","Rubber"],["Brick","Clay"],["Candle","Wax"],["Bread","Flour"],["Cheese","Milk"],["Steel","Iron"],["Rope","Fibre"],["Jewellery","Gold"],["Porcelain","Kaolin"]],
  SEM_PLACE_PURPOSE: [["School","Education"],["Hospital","Medical treatment"],["Library","Reading and reference"],["Court","Adjudication"],["Bank","Financial services"],["Post office","Postal services"],["Fire station","Emergency response"],["Police station","Law enforcement"],["Laboratory","Experimentation"],["Museum","Preservation and exhibition"],["Stadium","Sports"],["Railway station","Rail transport"]],
};

const SCIENCE_RELATIONS = new Set(["SEM_INSTRUMENT_MEASUREMENT", "SEM_QUANTITY_UNIT"]);
const LANGUAGE_RELATIONS = new Set(["SEM_ANIMAL_SOUND", "SEM_ANIMAL_MOVEMENT", "SEM_OBJECT_FUNCTION"]);

function fillTemplate(template: string, left: string, right: string): string {
  return template.replace("{left}", left).replace("{right}", right);
}

export const ANA_CP001_FACTS: readonly SemanticFact[] = Object.entries(PAIRS).flatMap(
  ([relation, pairs], relationIndex) => {
    const definition = relationDefinition(relation);
    return pairs.map(([left, right], pairIndex) => {
      const predicate = fillTemplate(definition.predicateTemplate, left, right);
      return {
        id: `ANA-SF-${String(relationIndex * 12 + pairIndex + 1).padStart(3, "0")}`,
        left,
        right,
        relation,
        direction: "FORWARD" as const,
        predicate,
        explanation: predicate,
        answerCategory: definition.answerCategory,
        sourceCategory: definition.sourceCategory,
        difficulty: pairIndex < 5 ? "EASY" as const : pairIndex < 10 ? "MEDIUM" as const : "HARD" as const,
        locale: "en-IN" as const,
        examSuitability: ["SSC", "BANKING", "PUNJAB"] as const,
        version: "2.0.0",
        status: "CURATED" as const,
        verifiedAt: "2026-07-24",
        sourceType: SCIENCE_RELATIONS.has(relation)
          ? "STANDARD_SCIENCE" as const
          : LANGUAGE_RELATIONS.has(relation)
            ? "STANDARD_LANGUAGE" as const
            : "STABLE_GENERAL_KNOWLEDGE" as const,
        factRisk: relation === "SEM_COUNTRY_CAPITAL" || relation === "SEM_STATE_CAPITAL" || relation === "SEM_COUNTRY_CURRENCY"
          ? "MEDIUM" as const
          : "LOW" as const,
        editorialNote: left === "Punjab" ? "Chandigarh serves as the capital of both Punjab and Haryana and is a Union Territory." : undefined,
      };
    });
  },
);
