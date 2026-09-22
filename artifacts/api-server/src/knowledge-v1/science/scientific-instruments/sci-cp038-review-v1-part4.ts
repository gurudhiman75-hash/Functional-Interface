import type { KnowledgeV1Difficulty } from "../../types";
export type SciCp038ReviewSpec = readonly [number, KnowledgeV1Difficulty, string, string, readonly [string,string,string], string, readonly string[]];
export const PART_4: readonly SciCp038ReviewSpec[] = [
  [
    8,
    "Medium",
    "Which instrument is used to measure the distance travelled by a vehicle?",
    "Odometer",
    [
      "Speedometer",
      "Altimeter",
      "Barometer"
    ],
    "An odometer records the total distance travelled by a vehicle. A speedometer, in contrast, shows speed at a particular moment. This is why a vehicle dashboard often shows both speed and accumulated distance separately.",
    [
      "ODOMETER-DISTANCE"
    ]
  ],
  [
    8,
    "Medium",
    "A speedometer indicates a vehicle's:",
    "Instantaneous speed",
    [
      "Total distance only",
      "Altitude",
      "Engine temperature only"
    ],
    "A speedometer shows how fast the vehicle is moving at that moment. Distance travelled is recorded separately by the odometer. It changes as the vehicle accelerates or slows down.",
    [
      "SPEEDOMETER-SPEED"
    ]
  ],
  [
    8,
    "Hard",
    "A pilot wants altitude, while a ship navigator wants angular measurements of a star above the horizon. Which instruments are appropriate?",
    "Altimeter and sextant",
    [
      "Barometer and odometer",
      "Compass and hygrometer",
      "Altimeter and speedometer"
    ],
    "An altimeter gives altitude, while a sextant measures celestial angles for navigation. The two instruments solve different position-related problems. One gives vertical position, while the other supports celestial navigation.",
    [
      "ALTIMETER-SEXTANT"
    ]
  ],
  [
    9,
    "Easy",
    "The acidity or alkalinity of a solution can be measured directly with a:",
    "pH meter",
    [
      "Ammeter",
      "Anemometer",
      "Odometer"
    ],
    "A pH meter measures the hydrogen-ion-related electrical potential of a solution and converts it to a pH value. It gives a direct quantitative measure of acidity or alkalinity. Values below 7 are acidic, around 7 neutral and above 7 alkaline under ordinary conditions.",
    [
      "PH-METER"
    ]
  ],
  [
    9,
    "Medium",
    "Which instrument measures relative density or specific gravity of liquids?",
    "Hydrometer",
    [
      "Calorimeter",
      "Galvanometer",
      "Manometer"
    ],
    "A hydrometer floats at different depths depending on liquid density. Its calibrated scale gives relative density or specific gravity. The depth at which it floats depends on the buoyant force from the liquid.",
    [
      "HYDROMETER-DENSITY"
    ]
  ],
  [
    9,
    "Medium",
    "A lactometer is used to check the relative density of:",
    "Milk",
    [
      "Mercury",
      "Petrol only",
      "Air"
    ],
    "A lactometer is a type of hydrometer designed for milk. Density measurements can help detect abnormal dilution, although composition can affect interpretation. A suspicious density can suggest dilution, though density alone cannot prove composition.",
    [
      "LACTOMETER-MILK"
    ]
  ],
  [
    9,
    "Medium",
    "Which instrument estimates the concentration of a coloured solution by measuring light absorption?",
    "Colorimeter",
    [
      "Barometer",
      "Audiometer",
      "Altimeter"
    ],
    "A colorimeter measures how much light of a selected wavelength is absorbed by a coloured solution. Greater absorbance can be related to concentration under suitable conditions. It is especially useful when concentration changes produce predictable changes in colour intensity.",
    [
      "COLORIMETER-CONCENTRATION"
    ]
  ],
  [
    9,
    "Hard",
    "A laboratory needs to compare how strongly a sample absorbs different wavelengths across a broad spectrum. Which instrument is more suitable than a simple colorimeter?",
    "Spectrophotometer",
    [
      "Hydrometer",
      "pH paper",
      "Rain gauge"
    ],
    "A spectrophotometer measures absorbance at selected or scanned wavelengths with greater spectral control. It is therefore suited to detailed wavelength-dependent analysis. This provides more detailed optical information than a basic colour comparison.",
    [
      "SPECTROPHOTOMETER"
    ]
  ],
  [
    9,
    "Hard",
    "A milk-testing lab wants to check density and acidity quantitatively. Which pair is most suitable?",
    "Lactometer and pH meter",
    [
      "Hydrometer and ammeter",
      "Barometer and colorimeter",
      "Lactometer and anemometer"
    ],
    "The lactometer checks milk density, while the pH meter gives a quantitative acidity reading. Together they assess two different properties of the sample. Using both measurements gives more information than either one alone.",
    [
      "MILK-DENSITY-PH"
    ]
  ],
  [
    10,
    "Easy",
    "Which instrument–quantity pair is correct?",
    "Anemometer — wind speed",
    [
      "Hygrometer — air pressure",
      "Barometer — humidity",
      "Ammeter — voltage"
    ],
    "An anemometer measures wind speed. The other quantities are measured by different instruments such as the hygrometer, barometer and voltmeter. Remembering the measured quantity is more useful than memorizing instrument names in isolation.",
    [
      "MATCH-ANEMOMETER"
    ]
  ],
  [
    10,
    "Medium",
    "Which medical instrument–quantity pair is correctly matched?",
    "Sphygmomanometer — blood pressure",
    [
      "Spirometer — brain activity",
      "Audiometer — blood glucose",
      "Ophthalmoscope — lung volume"
    ],
    "A sphygmomanometer measures blood pressure. Spirometers test breathing, audiometers test hearing and ophthalmoscopes examine the eye. Medical instruments are best learned by linking each one to the organ or quantity examined.",
    [
      "MATCH-SPHYGMOMANOMETER"
    ]
  ],
  [
    10,
    "Medium",
    "A researcher needs one instrument for very small biological structures and another for very distant celestial objects. Which pair should be chosen?",
    "Microscope and telescope",
    [
      "Telescope and microscope in reverse use",
      "Spectroscope and barometer",
      "Periscope and hygrometer"
    ],
    "A microscope magnifies very small nearby objects, while a telescope collects light from distant objects. They solve opposite scale problems. The first deals with tiny nearby details; the second with very distant targets.",
    [
      "MICROSCOPE-TELESCOPE"
    ]
  ],
  [
    10,
    "Medium",
    "Which set contains only correctly matched instruments?",
    "Voltmeter—voltage; ammeter—current; ohmmeter—resistance",
    [
      "Ammeter—pressure; voltmeter—humidity; ohmmeter—speed",
      "Barometer—current; hygrometer—voltage; anemometer—resistance",
      "Voltmeter—mass; balance—voltage; thermometer—current"
    ],
    "The voltmeter, ammeter and ohmmeter measure voltage, current and resistance respectively. These are basic electrical measurement instruments. These three quantities are fundamental in basic circuit testing.",
    [
      "ELECTRICAL-INSTRUMENT-SET"
    ]
  ],
  [
    10,
    "Hard",
    "A field team must measure air pressure, wind speed, rainfall and humidity. Which instrument set is complete?",
    "Barometer, anemometer, rain gauge and hygrometer",
    [
      "Altimeter, speedometer, rain gauge and hydrometer",
      "Barometer, wind vane, voltmeter and hygrometer",
      "Anemometer, thermometer, ammeter and rain gauge"
    ],
    "A complete set needs one instrument for each quantity: barometer for pressure, anemometer for wind speed, rain gauge for rainfall and hygrometer for humidity. A complete weather record often combines several instruments rather than relying on one.",
    [
      "FIELD-WEATHER-SET"
    ]
  ],
  [
    10,
    "Hard",
    "A hospital receives four tasks: blood pressure, lung volume, hearing threshold and brain electrical activity. Which sequence of instruments is correct?",
    "Sphygmomanometer → spirometer → audiometer → electroencephalograph",
    [
      "Spirometer → sphygmomanometer → stethoscope → electrocardiograph",
      "Sphygmomanometer → audiometer → spirometer → ophthalmoscope",
      "Barometer → spirometer → audiometer → electroencephalograph"
    ],
    "Blood pressure needs a sphygmomanometer, lung volume a spirometer, hearing threshold an audiometer and brain electrical activity an electroencephalograph. The sequence directly matches the four tasks. This type of mixed question tests whether each instrument is linked to the correct physiological measurement.",
    [
      "HOSPITAL-INSTRUMENT-SEQUENCE"
    ]
  ]
] as const;
