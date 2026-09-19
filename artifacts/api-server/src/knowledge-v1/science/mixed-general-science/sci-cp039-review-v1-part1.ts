import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp039ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp039ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which SI unit is used for force?",
    "newton",
    [
      "joule",
      "watt",
      "pascal"
    ],
    "Force is measured in newtons in the SI system. One newton is the force needed to accelerate a mass of one kilogram by one metre per second squared. The newton is defined from the relationship between mass and acceleration.",
    [
      "MIX-FORCE-UNIT"
    ]
  ],
  [
    1,
    "Easy",
    "A body moving at constant speed in a straight line has:",
    "constant velocity",
    [
      "zero distance",
      "increasing mass",
      "zero time"
    ],
    "Velocity includes both speed and direction. If both remain unchanged, the velocity is constant even though the body continues moving. Changing direction would change velocity even if the speed stayed the same.",
    [
      "MIX-CONSTANT-VELOCITY"
    ]
  ],
  [
    1,
    "Medium",
    "Why does a passenger tend to move forward when a moving bus stops suddenly?",
    "The body tends to maintain its state of motion due to inertia",
    [
      "Gravity suddenly increases",
      "The passenger loses mass",
      "The bus pulls the passenger forward"
    ],
    "Inertia makes the passenger's body tend to continue moving when the bus stops. This is an everyday example of Newton's first law of motion. This same idea explains why seat belts are important during sudden stops.",
    [
      "MIX-INERTIA-BUS"
    ]
  ],
  [
    1,
    "Medium",
    "A machine does 600 J of work in 3 s. Its power is:",
    "200 W",
    [
      "1800 W",
      "603 W",
      "0.005 W"
    ],
    "Power is work divided by time. Dividing 600 joules by 3 seconds gives 200 watts, so the machine transfers energy at 200 joules per second. Using SI units keeps work, time and power calculations consistent.",
    [
      "MIX-POWER-CALC"
    ]
  ],
  [
    1,
    "Medium",
    "Which statement about weight is correct?",
    "Weight depends on gravitational acceleration",
    [
      "Weight and mass are always identical",
      "Weight is measured in kilograms",
      "Weight cannot change with location"
    ],
    "Weight is the gravitational force on a body and equals mass multiplied by gravitational acceleration. Mass stays constant, but weight can change when gravity changes. This distinction explains why astronauts keep their mass but can have different weight.",
    [
      "MIX-WEIGHT-G"
    ]
  ],
  [
    1,
    "Hard",
    "A cyclist doubles speed while mass stays constant. What happens to kinetic energy?",
    "It becomes four times as large",
    [
      "It doubles",
      "It becomes half",
      "It stays unchanged"
    ],
    "Kinetic energy is proportional to the square of speed. Doubling speed gives four times the kinetic energy, which is why higher speed greatly increases braking demand. The square relationship makes speed especially important in road safety.",
    [
      "MIX-KE-SPEED"
    ]
  ],
  [
    2,
    "Easy",
    "Heat from the Sun reaches Earth by:",
    "radiation",
    [
      "conduction",
      "convection through space",
      "evaporation"
    ],
    "Radiation can transfer energy through a vacuum, unlike conduction and convection which require matter. This is how solar energy crosses space to Earth. Conduction and convection cannot carry heat through empty space.",
    [
      "MIX-SUN-RADIATION"
    ]
  ],
  [
    2,
    "Easy",
    "Pitch of a sound is determined chiefly by its:",
    "frequency",
    [
      "amplitude",
      "speed only",
      "loudness"
    ],
    "Frequency tells how many vibrations occur each second. Higher frequency is heard as higher pitch, while amplitude is more closely related to loudness. This distinction helps separate pitch questions from loudness questions.",
    [
      "MIX-PITCH-FREQUENCY"
    ]
  ],
  [
    2,
    "Medium",
    "Why does a metal spoon become hot quickly in tea?",
    "Metal conducts heat efficiently",
    [
      "Metal creates heat",
      "Tea stops convection",
      "Wood inside the spoon expands"
    ],
    "Metals transfer thermal energy quickly through conduction. Their free electrons help energy move through the material faster than in poor conductors such as wood. That is why metal handles can become hot much faster than wooden ones.",
    [
      "MIX-METAL-CONDUCTION"
    ]
  ],
  [
    2,
    "Medium",
    "Which mirror is used in vehicle rear-view mirrors?",
    "convex mirror",
    [
      "concave mirror",
      "plane mirror only",
      "parabolic mirror"
    ],
    "A convex mirror forms upright, diminished images and provides a wide field of view. That wider view lets drivers see more of the road behind them. The smaller image is accepted because the driver gains a wider view.",
    [
      "MIX-REARVIEW-MIRROR"
    ]
  ],
  [
    2,
    "Medium",
    "An echo is produced by:",
    "reflection of sound",
    [
      "refraction of light",
      "absorption of sound",
      "electromagnetic induction"
    ],
    "An echo is a reflected sound heard separately from the original sound. A sufficiently distant reflecting surface creates the time delay needed to hear it distinctly. The delay between original and reflected sound makes the echo recognizable.",
    [
      "MIX-ECHO"
    ]
  ],
  [
    2,
    "Hard",
    "Why does a desert cooler work better on a dry day than on a humid day?",
    "Dry air allows faster evaporation of water",
    [
      "Dry air has no molecules",
      "Humidity increases fan speed",
      "Water boils at room temperature"
    ],
    "Evaporative cooling depends on water changing into vapour and taking heat from the surroundings. Dry air can accept more water vapour, so evaporation and cooling are stronger. That is why evaporative coolers are much less effective during humid weather.",
    [
      "MIX-DESERT-COOLER"
    ]
  ],
  [
    3,
    "Easy",
    "Electric current is measured using an:",
    "ammeter",
    [
      "voltmeter",
      "barometer",
      "hygrometer"
    ],
    "An ammeter measures the current flowing through a circuit. It is connected in series so the same current passes through the instrument. A voltmeter, in contrast, is connected in parallel across a component.",
    [
      "MIX-AMMETER"
    ]
  ],
  [
    3,
    "Easy",
    "The magnetic effect of electric current was demonstrated by:",
    "Hans Christian Oersted",
    [
      "Dmitri Mendeleev",
      "Edward Jenner",
      "Robert Hooke"
    ],
    "Oersted observed that a current-carrying wire deflected a compass needle. This experiment clearly connected electricity with magnetism. This observation became an important step toward understanding electromagnetism.",
    [
      "MIX-OERSTED"
    ]
  ],
  [
    3,
    "Medium",
    "Why are household appliances connected in parallel?",
    "Each gets the supply voltage and can work independently",
    [
      "All must carry identical current",
      "One switch should control every appliance",
      "Parallel circuits have no resistance"
    ],
    "Parallel connection gives each appliance the full supply voltage. It also allows one appliance to be switched off without interrupting the others. Independent operation is one major reason parallel wiring is used in homes.",
    [
      "MIX-HOUSEHOLD-PARALLEL"
    ]
  ]
] as const;
