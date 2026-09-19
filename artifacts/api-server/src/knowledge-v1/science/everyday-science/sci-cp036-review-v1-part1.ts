import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp036ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp036ReviewSpec[] = [
  [
    1,
    "Easy",
    "Why does food cook faster in a pressure cooker?",
    "The higher pressure raises the boiling point of water",
    [
      "The pressure lowers the boiling point of water",
      "The cooker removes all steam",
      "The food receives no heat loss at all"
    ],
    "Higher pressure inside the cooker raises water's boiling point, so food cooks at a temperature above 100°C. Because the cooking liquid becomes hotter before boiling strongly, food softens and cooks in less time.",
    [
      "PRESSURE-COOKER-BOILING-POINT"
    ]
  ],
  [
    1,
    "Easy",
    "At high altitudes, water boils at a lower temperature because atmospheric pressure is:",
    "Lower",
    [
      "Higher",
      "Unchanged everywhere",
      "Zero only at sea level"
    ],
    "Lower atmospheric pressure reduces the boiling point of water. This means boiling can start below 100°C, so the water may be less effective for fast cooking.",
    [
      "ALTITUDE-LOW-PRESSURE-BOILING"
    ]
  ],
  [
    1,
    "Medium",
    "Why may pulses take longer to cook in an open pot at a high-altitude location?",
    "Boiling water is at a lower temperature",
    [
      "Water becomes chemically different",
      "The flame produces no heat",
      "Atmospheric oxygen turns into steam"
    ],
    "At lower atmospheric pressure, water boils at a lower temperature, so cooking proceeds more slowly. The water may be boiling, but it is not as hot as boiling water at sea level.",
    [
      "HIGH-ALTITUDE-COOKING"
    ]
  ],
  [
    1,
    "Medium",
    "Why should a pressure cooker not be opened immediately while it is still highly pressurized?",
    "Hot steam and liquid can escape violently when pressure is released",
    [
      "The food instantly freezes",
      "The metal becomes non-conducting",
      "Air pressure inside becomes zero"
    ],
    "Pressurized steam stores energy and can force hot contents outward if the cooker is opened unsafely. Allowing the pressure to fall first makes opening much safer because the steam is no longer strongly confined.",
    [
      "PRESSURE-COOKER-SAFETY"
    ]
  ],
  [
    1,
    "Medium",
    "Which change would generally make water boil at a higher temperature?",
    "Increasing the pressure above the water",
    [
      "Reducing external pressure",
      "Moving to a higher altitude",
      "Using a wider open pan only"
    ],
    "A higher external pressure requires a higher temperature for vapour pressure to reach the boiling condition. This is the same principle used in a pressure cooker to reach a higher cooking temperature.",
    [
      "PRESSURE-RAISES-BOILING"
    ]
  ],
  [
    1,
    "Hard",
    "Two identical pots contain water, but one is sealed in a working pressure cooker while the other is open. Why can the sealed pot cook food faster even with the same heat source?",
    "Its water and steam can reach a higher equilibrium temperature before boiling vigorously",
    [
      "Its water has a lower specific heat",
      "The sealed pot stops molecular motion",
      "The open pot cannot transfer heat"
    ],
    "The pressure cooker raises pressure and therefore boiling temperature, allowing hotter water and steam to cook food faster. The important point is that the cooker does not simply trap heat; it changes the pressure and therefore the boiling temperature.",
    [
      "PRESSURE-COOKER-INTEGRATED"
    ]
  ],
  [
    2,
    "Easy",
    "Sweating cools the body because sweat:",
    "Absorbs heat while evaporating",
    [
      "Releases heat while freezing",
      "Stops all blood flow",
      "Raises skin temperature"
    ],
    "Evaporation requires latent heat, which is taken from the skin and produces cooling. The fastest-moving water molecules leave the skin as vapour, carrying thermal energy away with them.",
    [
      "SWEAT-EVAPORATIVE-COOLING"
    ]
  ],
  [
    2,
    "Easy",
    "A desert cooler works best when the air is:",
    "Hot and dry",
    [
      "Cold and saturated with moisture",
      "Very humid",
      "Below freezing"
    ],
    "Dry air allows faster evaporation of water, producing stronger evaporative cooling. When the air already contains a lot of moisture, much less water can evaporate and the cooling effect becomes weaker.",
    [
      "DESERT-COOLER-DRY-AIR"
    ]
  ],
  [
    2,
    "Medium",
    "Why does a wet cloth feel cooler when air flows over it?",
    "Moving air increases evaporation",
    [
      "Moving air stops evaporation",
      "Water begins boiling",
      "The cloth becomes a heat source"
    ],
    "Airflow carries away water vapour and increases the rate of evaporation, enhancing cooling. This is why a fan can make damp skin or wet clothes feel cooler even when the air temperature has not changed.",
    [
      "AIRFLOW-EVAPORATION"
    ]
  ],
  [
    2,
    "Medium",
    "What is the basic purpose of the refrigerant in a refrigerator?",
    "To absorb heat inside and release it outside during a cycle",
    [
      "To create cold as a substance",
      "To remove all air from the room",
      "To stop molecular motion in food"
    ],
    "The refrigerant changes pressure and phase so heat is moved from the cool interior to the warmer surroundings. The refrigerator therefore does not create cold; it removes heat from inside the cabinet.",
    [
      "REFRIGERANT-HEAT-TRANSFER"
    ]
  ],
  [
    2,
    "Medium",
    "Why should a refrigerator door not be left open for long?",
    "Warm room air enters and the cooling system must remove extra heat",
    [
      "The refrigerator begins heating only the food",
      "Cold air becomes chemically unstable",
      "The compressor no longer uses electricity"
    ],
    "An open door increases heat entering the cabinet, so the compressor works harder. This increases electricity use and can also make the room slightly warmer because the refrigerator releases heat outside.",
    [
      "REFRIGERATOR-OPEN-DOOR"
    ]
  ],
  [
    2,
    "Hard",
    "A desert cooler gives poor cooling on a very humid day. What is the best explanation?",
    "Humid air accepts less additional water vapour, so evaporation slows",
    [
      "Humidity increases the boiling point enough to stop cooling",
      "Water cannot absorb heat in humid air",
      "Fans stop moving air when humidity is high"
    ],
    "Evaporative cooling depends on evaporation; high humidity reduces the air's capacity to take up more water vapour. So desert coolers are effective in dry climates but much less effective in humid weather.",
    [
      "HUMIDITY-EVAPORATIVE-COOLING"
    ]
  ],
  [
    3,
    "Easy",
    "Woollen clothes keep us warm because wool:",
    "Traps air, which is a poor conductor of heat",
    [
      "Produces heat continuously",
      "Reflects all sunlight",
      "Stops blood circulation"
    ],
    "Air trapped between wool fibres reduces heat loss by conduction and convection. The trapped air slows the movement of heat from the warm body to the cooler surroundings.",
    [
      "WOOL-INSULATION"
    ]
  ],
  [
    3,
    "Easy",
    "A thermos flask is designed to reduce:",
    "Heat transfer",
    [
      "Gravity",
      "Atmospheric pressure",
      "Mass"
    ],
    "Its construction reduces conduction, convection and radiation to keep contents hot or cold. The vacuum, insulating stopper and reflective surfaces each reduce a different route by which heat can move.",
    [
      "THERMOS-HEAT-TRANSFER"
    ]
  ],
  [
    3,
    "Medium",
    "Why are cooking-pan handles often made of plastic or wood?",
    "They are poor conductors of heat",
    [
      "They are better conductors than metal",
      "They increase flame temperature",
      "They melt before heating"
    ],
    "Plastic and wood reduce conduction of heat from the hot pan to the hand. This keeps the handle cooler for longer and makes the utensil safer to hold.",
    [
      "PAN-HANDLE-INSULATOR"
    ]
  ]
] as const;
