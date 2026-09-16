export const envCp015Facts = {
  sourceVerificationDate: "2026-09-16",
  sourceBaseline: [
    "India Code — Environment (Protection) Act, 1986",
    "India Code — Water (Prevention and Control of Pollution) Act, 1974",
    "India Code — Air (Prevention and Control of Pollution) Act, 1981",
    "India Code — Wild Life (Protection) Act, 1972",
    "India Code — Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980",
    "India Code — Biological Diversity Act, 2002",
    "India Code — National Green Tribunal Act, 2010",
    "Central Pollution Control Board mandate pages",
  ],
  acts: {
    environmentProtection1986: {
      year: 1986,
      purpose: "protection and improvement of the environment",
      keyAuthority: "Central Government",
      stableConcepts: [
        "broad umbrella environmental law",
        "Central Government may take measures to protect and improve environmental quality",
        "Central Government may issue directions and make rules within the Act's framework",
      ],
    },
    waterAct1974: {
      year: 1974,
      purpose: "prevention and control of water pollution and maintaining or restoring the wholesomeness of water",
      stableConcepts: [
        "provides for pollution-control boards",
        "CPCB and State Boards perform water-pollution functions under the statutory framework",
      ],
    },
    airAct1981: {
      year: 1981,
      purpose: "prevention, control and abatement of air pollution",
      stableConcepts: [
        "assigns air-pollution functions to Central and State Pollution Control Boards",
        "CPCB has apex/nationwide coordination and advisory functions",
        "State Boards plan and implement state-level air-pollution control programmes",
      ],
    },
    wildlifeProtection1972: {
      year: 1972,
      purpose: "protection of wild animals, birds and plants and related ecological security",
      stableConcepts: [
        "principal wildlife-protection statute",
        "contains the legal framework for statutory protected-area categories covered in ENV-CP-009",
      ],
    },
    forestConservation1980: {
      currentShortTitle: "Van (Sanrakshan Evam Samvardhan) Adhiniyam, 1980",
      historicalExamName: "Forest (Conservation) Act, 1980",
      year: 1980,
      purpose: "conservation of forests",
      stableConcepts: [
        "certain forest land is covered by the Act",
        "Central Government prior approval is central to specified dereservation or non-forest-use decisions",
      ],
    },
    biologicalDiversity2002: {
      year: 2002,
      purpose: "conservation of biological diversity, sustainable use and fair and equitable benefit sharing",
      stableConcepts: [
        "three core objectives: conservation, sustainable use, fair and equitable benefit sharing",
        "access and benefit-sharing concepts belong to biodiversity governance",
      ],
    },
    ngtAct2010: {
      year: 2010,
      purpose: "establishment of the National Green Tribunal for effective and expeditious disposal of environmental cases",
      stableConcepts: [
        "environmental protection and conservation of forests and natural resources",
        "enforcement of legal rights relating to environment",
        "relief and compensation for environmental damage",
      ],
    },
  },
  institutions: {
    cpcb: {
      level: "central",
      role: "apex pollution-control board with nationwide planning, coordination, technical guidance and Central Government advisory functions",
    },
    spcb: {
      level: "state",
      role: "state-level pollution-control board that plans and implements pollution-control programmes and advises the State Government",
    },
    ngt: {
      level: "national tribunal",
      role: "specialized tribunal for specified environmental disputes, legal rights, relief and compensation under its statutory jurisdiction",
    },
  },
} as const;

export type EnvCp015Facts = typeof envCp015Facts;
