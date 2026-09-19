import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp040ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp040ReviewSpec[] = [
  [
    3,
    "Medium",
    "Which radiation has the highest frequency among visible light, infrared and ultraviolet?",
    "ultraviolet",
    [
      "infrared",
      "visible light",
      "all have equal frequency"
    ],
    "Ultraviolet radiation has higher frequency than visible light, while infrared has lower frequency. Higher frequency also means higher photon energy.",
    "MEGA-UV-FREQUENCY"
  ],
  [
    3,
    "Medium",
    "A fuse is placed in a circuit mainly to protect against:",
    "excessive current",
    [
      "low humidity",
      "low sound level",
      "weak magnetism"
    ],
    "A fuse wire melts when current becomes dangerously high. Breaking the circuit helps protect wiring and appliances from overheating.",
    "MEGA-FUSE"
  ],
  [
    3,
    "Hard",
    "Why does an electric generator produce current when a coil rotates in a magnetic field?",
    "The magnetic flux through the coil changes",
    [
      "The coil loses mass",
      "The magnet produces chemical energy",
      "Resistance becomes exactly zero"
    ],
    "Rotation changes the magnetic flux linked with the coil. Faraday's law states that changing magnetic flux induces an electromotive force and can drive current.",
    "MEGA-GENERATOR-INDUCTION"
  ],
  [
    4,
    "Easy",
    "The nucleus of an atom contains:",
    "protons and neutrons",
    [
      "electrons only",
      "protons and electrons only",
      "molecules"
    ],
    "The nucleus contains positively charged protons and neutral neutrons. Electrons occupy regions outside the nucleus.",
    "MEGA-NUCLEUS"
  ],
  [
    4,
    "Easy",
    "The periodic table is arranged primarily by increasing:",
    "atomic number",
    [
      "mass number only",
      "neutron number",
      "density"
    ],
    "The modern periodic table is arranged by atomic number, which is the number of protons in the nucleus. This ordering explains periodic chemical patterns.",
    "MEGA-PERIODIC-ATOMIC-NUMBER"
  ],
  [
    4,
    "Medium",
    "Why are noble gases generally less reactive?",
    "Their outer electron shells are stable",
    [
      "They have no electrons",
      "They contain no protons",
      "They are always solids"
    ],
    "Noble gases have stable outer-shell electron arrangements. Because of this, they have little tendency to gain, lose or share electrons.",
    "MEGA-NOBLE-GAS"
  ],
  [
    4,
    "Medium",
    "Which process is oxidation in a basic school-level sense?",
    "Gain of oxygen",
    [
      "Loss of oxygen only",
      "Gain of neutrons",
      "Loss of all electrons"
    ],
    "Oxidation can be described as gain of oxygen or loss of electrons, depending on context. The oxygen-based definition is common in introductory chemistry.",
    "MEGA-OXIDATION"
  ],
  [
    4,
    "Medium",
    "Why does increasing temperature often speed up a chemical reaction?",
    "Particles collide more often and with greater energy",
    [
      "Atoms stop moving",
      "Activation energy becomes impossible",
      "All bonds disappear instantly"
    ],
    "Heating increases particle motion and collision energy. A larger fraction of collisions can then overcome the activation-energy barrier and lead to reaction.",
    "MEGA-TEMP-REACTION-RATE"
  ],
  [
    4,
    "Hard",
    "Two atoms have the same number of protons but different numbers of neutrons. They are:",
    "isotopes of the same element",
    [
      "different elements",
      "ions only",
      "allotropes"
    ],
    "The number of protons determines the element. Different neutron numbers change the mass number without changing elemental identity, producing isotopes.",
    "MEGA-ISOTOPES"
  ],
  [
    5,
    "Easy",
    "A base turns red litmus paper:",
    "blue",
    [
      "green",
      "colourless",
      "redder"
    ],
    "Bases turn red litmus blue, while acids turn blue litmus red. Litmus gives a quick qualitative indication of acidic or basic character.",
    "MEGA-LITMUS-BASE"
  ],
  [
    5,
    "Easy",
    "Which alloy contains iron and carbon as its main components?",
    "steel",
    [
      "brass",
      "bronze",
      "solder"
    ],
    "Steel is an alloy based mainly on iron with carbon and sometimes other elements. Brass is mainly copper and zinc, while bronze is mainly copper and tin.",
    "MEGA-STEEL"
  ],
  [
    5,
    "Medium",
    "Why is stainless steel corrosion resistant?",
    "Chromium forms a protective oxide layer",
    [
      "It contains no iron",
      "It cannot react with oxygen",
      "It is always coated with plastic"
    ],
    "Chromium in stainless steel forms a thin protective oxide layer on the surface. This layer slows further corrosion under normal conditions.",
    "MEGA-STAINLESS-STEEL"
  ],
  [
    5,
    "Medium",
    "Which process converts vegetable oils into more saturated fats using hydrogen?",
    "hydrogenation",
    [
      "fermentation",
      "neutralization",
      "electrolysis only"
    ],
    "Hydrogenation adds hydrogen across some carbon–carbon double bonds. This makes the oil more saturated and can change its physical properties.",
    "MEGA-HYDROGENATION"
  ],
  [
    5,
    "Medium",
    "Why does baking soda help cakes rise?",
    "It can release carbon dioxide gas",
    [
      "It produces nitrogen only",
      "It removes all water",
      "It prevents heating"
    ],
    "Baking soda can produce carbon dioxide during heating or reaction with acids. Gas bubbles expand in the batter and help make the product light and porous.",
    "MEGA-BAKING-SODA"
  ],
  [
    5,
    "Hard",
    "A metal reacts with dilute acid and releases hydrogen gas. Which property best fits the metal?",
    "It is more reactive than hydrogen in the activity series",
    [
      "It must be a noble metal",
      "It is less reactive than hydrogen",
      "It cannot lose electrons"
    ],
    "Metals above hydrogen in the activity series can displace hydrogen from dilute acids. The reaction forms a salt and releases hydrogen gas.",
    "MEGA-METAL-ACID"
  ]
] as const;
