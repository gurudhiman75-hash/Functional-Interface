import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp040ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp040ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which quantity is measured in joules?",
    "energy",
    [
      "force",
      "power",
      "pressure"
    ],
    "The joule is the SI unit of energy and work. Force is measured in newtons, power in watts and pressure in pascals.",
    "MEGA-JOULE-ENERGY"
  ],
  [
    1,
    "Easy",
    "Acceleration is the rate of change of:",
    "velocity",
    [
      "mass",
      "energy",
      "density"
    ],
    "Acceleration tells how quickly velocity changes with time. Because velocity includes direction, a change in direction can also mean acceleration even if speed stays constant.",
    "MEGA-ACCELERATION"
  ],
  [
    1,
    "Medium",
    "A 2 kg object accelerates at 3 m/s². What net force acts on it?",
    "6 N",
    [
      "1.5 N",
      "5 N",
      "9 N"
    ],
    "Newton's second law gives force as mass multiplied by acceleration. Multiplying 2 kg by 3 m/s² gives a net force of 6 newtons.",
    "MEGA-FMA"
  ],
  [
    1,
    "Medium",
    "Why does a rocket move forward when gases are expelled backward?",
    "Action and reaction forces act in opposite directions",
    [
      "Gravity reverses",
      "Mass becomes zero",
      "Air pushes it only from behind"
    ],
    "Expelled gases are pushed backward, and an equal and opposite force pushes the rocket forward. This illustrates Newton's third law of motion.",
    "MEGA-ROCKET-THIRD-LAW"
  ],
  [
    1,
    "Medium",
    "Which has greater momentum if both move at the same speed?",
    "The object with greater mass",
    [
      "The lighter object",
      "Both always have zero momentum",
      "Momentum does not depend on mass"
    ],
    "Momentum equals mass multiplied by velocity. At the same speed, the object with greater mass therefore has greater momentum.",
    "MEGA-MOMENTUM-MASS"
  ],
  [
    1,
    "Hard",
    "A car and a truck have the same kinetic energy. Which statement can be true?",
    "The lighter car may be moving faster than the truck",
    [
      "They must have the same speed",
      "They must have the same mass",
      "The truck must always be faster"
    ],
    "Kinetic energy depends on both mass and the square of speed. A lighter vehicle can have the same kinetic energy as a heavier one if it moves faster.",
    "MEGA-KE-MASS-SPEED"
  ],
  [
    2,
    "Easy",
    "Pressure in a liquid increases with:",
    "depth",
    [
      "height above the liquid",
      "decreasing density only",
      "surface colour"
    ],
    "Liquid pressure increases with depth because deeper points support a greater column of liquid above them. Density and gravity also affect pressure.",
    "MEGA-LIQUID-PRESSURE"
  ],
  [
    2,
    "Easy",
    "Sound travels fastest among the following in:",
    "steel",
    [
      "air",
      "vacuum",
      "water vapour"
    ],
    "Sound generally travels faster in solids than in gases because particles are more closely coupled. Sound cannot travel through a vacuum at all.",
    "MEGA-SOUND-STEEL"
  ],
  [
    2,
    "Medium",
    "Why does a pressure cooker cook food faster?",
    "The increased pressure raises water's boiling point",
    [
      "Pressure removes heat",
      "The boiling point falls",
      "Steam stops forming"
    ],
    "Higher pressure allows water to boil at a temperature above its normal boiling point. The hotter water and steam cook food more quickly.",
    "MEGA-PRESSURE-COOKER"
  ],
  [
    2,
    "Medium",
    "A concave mirror is useful in a solar cooker because it can:",
    "concentrate sunlight at a focus",
    [
      "spread light over a wider area",
      "form only diminished images",
      "stop radiation"
    ],
    "A concave mirror can bring parallel rays of sunlight toward a focus. Concentrating the radiation in a small region raises temperature.",
    "MEGA-CONCAVE-SOLAR"
  ],
  [
    2,
    "Medium",
    "Why are woollen clothes warm in winter?",
    "They trap air that slows heat loss",
    [
      "Wool creates heat continuously",
      "Wool reflects gravity",
      "Air conducts heat very well"
    ],
    "Wool fibres trap pockets of air, and air is a poor conductor of heat. This reduces the rate at which body heat escapes.",
    "MEGA-WOOL"
  ],
  [
    2,
    "Hard",
    "A metal lid becomes easier to remove after warm water is poured over it. What explains this?",
    "The metal lid expands slightly when heated",
    [
      "The jar shrinks to zero",
      "Warm water removes gravity",
      "Pressure always becomes zero"
    ],
    "Heating causes the metal lid to expand. Even a small expansion can loosen the fit between lid and jar and make opening easier.",
    "MEGA-THERMAL-EXPANSION-LID"
  ],
  [
    3,
    "Easy",
    "The SI unit of electrical resistance is:",
    "ohm",
    [
      "ampere",
      "volt",
      "tesla"
    ],
    "Electrical resistance is measured in ohms. Current is measured in amperes and potential difference in volts.",
    "MEGA-OHM-UNIT"
  ],
  [
    3,
    "Easy",
    "Which device converts electrical energy into mechanical rotation?",
    "electric motor",
    [
      "generator",
      "barometer",
      "thermometer"
    ],
    "An electric motor uses magnetic forces on current-carrying conductors to produce motion. It converts electrical energy into mechanical energy.",
    "MEGA-MOTOR"
  ],
  [
    3,
    "Medium",
    "A transformer works with alternating current because it depends on:",
    "changing magnetic flux",
    [
      "constant magnetic flux only",
      "chemical reaction",
      "sound reflection"
    ],
    "A transformer uses electromagnetic induction. The changing current in one coil produces changing magnetic flux that induces voltage in another coil.",
    "MEGA-TRANSFORMER"
  ]
] as const;
