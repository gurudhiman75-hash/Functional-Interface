import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp038ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_1: readonly SciCp038ReviewSpec[] = [
  [
    1,
    "Easy",
    "Which instrument is used to measure temperature?",
    "Thermometer",
    [
      "Barometer",
      "Hygrometer",
      "Ammeter"
    ],
    "A thermometer measures temperature. Different thermometers are designed for body temperature, laboratory work or weather observations, but the measured quantity remains temperature.",
    [
      "THERMOMETER-TEMPERATURE"
    ]
  ],
  [
    1,
    "Easy",
    "A clinical thermometer is used to measure:",
    "Human body temperature",
    [
      "Atmospheric pressure",
      "Blood pressure",
      "Humidity"
    ],
    "A clinical thermometer is designed for the narrow temperature range of the human body. It is therefore more suitable for medical use than a general laboratory thermometer.",
    [
      "CLINICAL-THERMOMETER-BODY"
    ]
  ],
  [
    1,
    "Medium",
    "Which instrument is preferred for recording very high temperatures in furnaces without direct contact?",
    "Pyrometer",
    [
      "Clinical thermometer",
      "Barometer",
      "Lactometer"
    ],
    "A pyrometer is used for very high temperatures, especially where direct contact is difficult or unsafe. Many pyrometers estimate temperature from thermal radiation emitted by the hot object.",
    [
      "PYROMETER-HIGH-TEMP"
    ]
  ],
  [
    1,
    "Medium",
    "A maximum–minimum thermometer is useful in weather observation because it records:",
    "The highest and lowest temperatures reached over a period",
    [
      "Only current humidity",
      "Only atmospheric pressure",
      "Only wind direction"
    ],
    "A maximum–minimum thermometer retains the highest and lowest temperatures reached since the last reset. This makes it useful for daily weather records.",
    [
      "MAXMIN-THERMOMETER"
    ]
  ],
  [
    1,
    "Medium",
    "Why does a liquid-in-glass thermometer work?",
    "The liquid expands or contracts with temperature",
    [
      "The liquid becomes magnetic",
      "The glass produces electricity",
      "Air pressure inside becomes zero"
    ],
    "The liquid changes volume as its temperature changes. The calibrated scale converts that expansion or contraction into a temperature reading.",
    [
      "LIQUID-THERMOMETER-PRINCIPLE"
    ]
  ],
  [
    1,
    "Hard",
    "A technician must measure the temperature of molten metal from a safe distance. Which choice is most suitable?",
    "Optical or radiation pyrometer",
    [
      "Clinical thermometer",
      "Mercury barometer",
      "Hydrometer"
    ],
    "Molten metal is far hotter than the range of ordinary thermometers and direct contact may be unsafe. A radiation pyrometer can estimate its temperature remotely from emitted thermal radiation.",
    [
      "MOLTEN-METAL-PYROMETER"
    ]
  ],
  [
    2,
    "Easy",
    "Which instrument measures atmospheric pressure?",
    "Barometer",
    [
      "Hygrometer",
      "Anemometer",
      "Rain gauge"
    ],
    "A barometer measures atmospheric pressure. Changes in barometric pressure are also useful in weather observation because they often accompany changing weather systems.",
    [
      "BAROMETER-PRESSURE"
    ]
  ],
  [
    2,
    "Easy",
    "Humidity in air is measured with a:",
    "Hygrometer",
    [
      "Altimeter",
      "Voltmeter",
      "Calorimeter"
    ],
    "A hygrometer measures the amount of moisture in air. Weather stations use humidity measurements along with temperature, pressure and wind data.",
    [
      "HYGROMETER-HUMIDITY"
    ]
  ],
  [
    2,
    "Medium",
    "Which instrument measures wind speed?",
    "Anemometer",
    [
      "Wind vane",
      "Rain gauge",
      "Barometer"
    ],
    "An anemometer measures wind speed. A wind vane, by contrast, is used to indicate wind direction.",
    [
      "ANEMOMETER-WIND-SPEED"
    ]
  ],
  [
    2,
    "Medium",
    "A wind vane tells a weather observer the:",
    "Direction from which the wind is blowing",
    [
      "Speed of wind",
      "Amount of rainfall",
      "Air humidity"
    ],
    "A wind vane turns with the wind and indicates its direction. It does not measure wind speed, so it is often used together with an anemometer.",
    [
      "WIND-VANE-DIRECTION"
    ]
  ],
  [
    2,
    "Medium",
    "Rainfall at a weather station is measured using a:",
    "Rain gauge",
    [
      "Hygrometer",
      "Barometer",
      "Altimeter"
    ],
    "A rain gauge collects precipitation so its depth can be measured. Rainfall is usually reported as a depth, such as millimetres.",
    [
      "RAIN-GAUGE"
    ]
  ],
  [
    2,
    "Hard",
    "A weather station must record pressure, humidity and wind speed. Which set of instruments is correct?",
    "Barometer, hygrometer and anemometer",
    [
      "Hygrometer, rain gauge and wind vane",
      "Altimeter, barometer and thermometer",
      "Barometer, voltmeter and anemometer"
    ],
    "Pressure is measured by a barometer, humidity by a hygrometer and wind speed by an anemometer. Matching each instrument to its quantity avoids common exam traps.",
    [
      "WEATHER-INSTRUMENT-SET"
    ]
  ],
  [
    3,
    "Easy",
    "Electric current is measured with an:",
    "Ammeter",
    [
      "Voltmeter",
      "Ohmmeter",
      "Galvanometer only"
    ],
    "An ammeter measures electric current in a circuit. It is connected in series so the circuit current passes through the instrument.",
    [
      "AMMETER-CURRENT"
    ]
  ],
  [
    3,
    "Easy",
    "Potential difference is measured using a:",
    "Voltmeter",
    [
      "Ammeter",
      "Hydrometer",
      "Barometer"
    ],
    "A voltmeter measures potential difference between two points. It is connected in parallel across the component whose voltage is being measured.",
    [
      "VOLTMETER-VOLTAGE"
    ]
  ],
  [
    3,
    "Medium",
    "Which instrument is used to measure electrical resistance directly?",
    "Ohmmeter",
    [
      "Ammeter",
      "Wattmeter",
      "Potentiometer only"
    ],
    "An ohmmeter is designed to measure electrical resistance. In modern practice this function is commonly built into a digital multimeter.",
    [
      "OHMMETER-RESISTANCE"
    ]
  ]
] as const;
