import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp036ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_2: readonly SciCp036ReviewSpec[] = [
  [
    3,
    "Medium",
    "Why does a metal spoon in hot tea become warm faster than a wooden spoon?",
    "Metal conducts heat more readily",
    [
      "Wood creates heat",
      "Metal has no particles",
      "Tea cannot transfer heat to wood"
    ],
    "Metals generally have much higher thermal conductivity than wood.",
    [
      "METAL-VS-WOOD-CONDUCTION"
    ]
  ],
  [
    3,
    "Medium",
    "Why are shiny surfaces used in some vacuum flasks?",
    "They reduce heat transfer by radiation",
    [
      "They increase conduction",
      "They create convection currents",
      "They absorb all radiation"
    ],
    "Shiny surfaces are poor absorbers and emitters of thermal radiation, reducing radiative heat transfer.",
    [
      "SHINY-SURFACE-RADIATION"
    ]
  ],
  [
    3,
    "Hard",
    "A thermos uses a vacuum between double walls and shiny inner surfaces. Which heat-transfer modes are reduced respectively?",
    "Conduction/convection by the vacuum and radiation by shiny surfaces",
    [
      "Radiation by the vacuum and conduction by shiny surfaces",
      "Only convection in both cases",
      "Only conduction in both cases"
    ],
    "The vacuum removes material needed for conduction and convection, while shiny surfaces reduce radiation.",
    [
      "THERMOS-MODES-INTEGRATED"
    ]
  ],
  [
    4,
    "Easy",
    "A fuse protects an electrical circuit by:",
    "Melting and breaking the circuit when current becomes too large",
    [
      "Increasing current during overload",
      "Storing extra electric charge",
      "Converting AC into DC"
    ],
    "Fuse wire heats up and melts when excessive current flows, opening the circuit.",
    [
      "FUSE-FUNCTION"
    ]
  ],
  [
    4,
    "Easy",
    "The earth wire in a household appliance is used to:",
    "Provide a low-resistance path for fault current to ground",
    [
      "Increase appliance voltage",
      "Carry normal current in place of the live wire",
      "Reduce the frequency of AC"
    ],
    "Earthing helps protect users by directing fault current safely to the ground.",
    [
      "EARTH-WIRE-SAFETY"
    ]
  ],
  [
    4,
    "Medium",
    "Why are household appliances connected in parallel rather than in series?",
    "Each appliance gets the supply voltage and can operate independently",
    [
      "Current must be identical in every appliance",
      "Switching one off should stop all others",
      "Parallel connection lowers all appliance voltages to zero"
    ],
    "Parallel wiring gives each appliance the full supply voltage and independent control.",
    [
      "HOUSEHOLD-PARALLEL"
    ]
  ],
  [
    4,
    "Medium",
    "Why should a wet hand not be used to operate an electrical switch?",
    "Water and dissolved salts can lower skin resistance and increase shock risk",
    [
      "Water always blocks electric current",
      "Wet skin becomes an insulator",
      "The supply voltage becomes zero"
    ],
    "Wet skin conducts better than dry skin, so more current may pass through the body.",
    [
      "WET-HAND-ELECTRIC-SHOCK"
    ]
  ],
  [
    4,
    "Medium",
    "What does an MCB do during an excessive current condition?",
    "It automatically opens the circuit",
    [
      "It increases the voltage",
      "It stores current for later use",
      "It converts electricity into magnetism only"
    ],
    "A miniature circuit breaker trips and disconnects the supply when current exceeds a safe value.",
    [
      "MCB-FUNCTION"
    ]
  ],
  [
    4,
    "Hard",
    "An appliance develops a fault that connects its metal body to the live wire. Why do earthing and a protective breaker together improve safety?",
    "The earth path allows a large fault current that helps the breaker disconnect the supply quickly",
    [
      "Earthing makes the metal body non-conducting",
      "The breaker raises resistance in the user's body",
      "Both systems increase operating voltage"
    ],
    "Earthing provides a low-resistance fault path, and the resulting high current can trigger protective disconnection.",
    [
      "EARTHING-BREAKER-INTEGRATED"
    ]
  ],
  [
    5,
    "Easy",
    "The mirror commonly used as a rear-view mirror in vehicles is:",
    "Convex mirror",
    [
      "Concave mirror",
      "Plane mirror only",
      "Cylindrical mirror"
    ],
    "A convex mirror gives a wide field of view and forms upright, diminished images.",
    [
      "REARVIEW-CONVEX"
    ]
  ],
  [
    5,
    "Easy",
    "A magnifying glass uses a:",
    "Convex lens",
    [
      "Concave lens",
      "Plane mirror",
      "Prism only"
    ],
    "A convex lens can produce a magnified virtual image when the object is within its focal length.",
    [
      "MAGNIFYING-GLASS-CONVEX"
    ]
  ],
  [
    5,
    "Medium",
    "Why are convex mirrors preferred for vehicle rear-view mirrors?",
    "They show a wider area behind the vehicle",
    [
      "They form enlarged real images",
      "They have no focal point",
      "They reverse left and right less than any other mirror"
    ],
    "Convex mirrors provide a wide field of view while keeping images upright.",
    [
      "CONVEX-WIDE-FIELD"
    ]
  ],
  [
    5,
    "Medium",
    "Which lens is used to correct myopia?",
    "Concave lens",
    [
      "Convex lens",
      "Cylindrical mirror",
      "Plane glass only"
    ],
    "A concave lens diverges incoming light so the image can be focused on the retina in a myopic eye.",
    [
      "MYOPIA-CONCAVE-LENS"
    ]
  ],
  [
    5,
    "Medium",
    "Why can a convex lens start a fire when it focuses sunlight on dry paper?",
    "It concentrates solar energy into a small area",
    [
      "It creates energy from nothing",
      "It cools the paper rapidly",
      "It blocks visible light"
    ],
    "Concentrating sunlight raises the temperature at the focus enough to ignite suitable material.",
    [
      "LENS-FOCUS-SUNLIGHT"
    ]
  ],
  [
    5,
    "Hard",
    "A driver wants a mirror that shows more of the road behind, even though objects appear smaller. Which optical property is being used?",
    "A convex mirror forms diminished upright images over a wide field",
    [
      "A concave mirror always gives a wide field",
      "A plane mirror magnifies distant objects",
      "A convex lens reflects light backward"
    ],
    "The wide field and diminished upright image of a convex mirror make it useful for rear viewing.",
    [
      "REARVIEW-PROPERTY-INTEGRATED"
    ]
  ]
] as const;
