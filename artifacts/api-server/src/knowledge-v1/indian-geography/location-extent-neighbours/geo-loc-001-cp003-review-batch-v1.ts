import {
  GEO_LOC_001_SOURCE_IDS,
  placeGeoLocOptions,
  type GeoLoc001Difficulty,
  type GeoLoc001Question,
} from "./geo-loc-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoLoc001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const CP003_SOURCE_IDS = Object.freeze([
  ...GEO_LOC_001_SOURCE_IDS,
  "IMD-RASHTRIYA-PANCHANG-IST",
  "NCS-IST-UTC-OFFSET",
] as const);

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-LOC-001-QL-019",
    "qlName": "Standard Meridian — 82°30'E",
    "difficulty": "Easy",
    "stem": "Which longitude is used as the Standard Meridian of India?",
    "answer": "82°30'E",
    "distractors": [
      "68°7'E",
      "97°25'E",
      "23°30'N"
    ],
    "explanation": "India uses 82°30'E as its Standard Meridian. Time based on this longitude is followed as Indian Standard Time across the country.",
    "sourceFactIds": [
      "IST-STANDARD-MERIDIAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-019",
    "qlName": "Standard Meridian — 82°30'E",
    "difficulty": "Easy",
    "stem": "Indian Standard Time is based on the local time of which meridian?",
    "answer": "82°30'E",
    "distractors": [
      "75°E",
      "90°E",
      "0°"
    ],
    "explanation": "The local time at 82°30'E provides the basis for Indian Standard Time. Using one reference meridian avoids different official times across India's long east–west extent.",
    "sourceFactIds": [
      "IST-MERIDIAN-BASIS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-019",
    "qlName": "Standard Meridian — 82°30'E",
    "difficulty": "Medium",
    "stem": "Why is 82°30'E important for timekeeping in India?",
    "answer": "It provides the reference longitude for IST",
    "distractors": [
      "It is India's westernmost longitude",
      "It is the Tropic of Cancer",
      "It marks the Equator"
    ],
    "explanation": "82°30'E is the national reference meridian for standard time. It is a longitude, not a latitude or an extreme edge of the mainland.",
    "sourceFactIds": [
      "IST-MERIDIAN-PURPOSE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-019",
    "qlName": "Standard Meridian — 82°30'E",
    "difficulty": "Medium",
    "stem": "Which value is a longitude used for national time rather than a latitude?",
    "answer": "82°30'E",
    "distractors": [
      "23°30'N",
      "8°4'N",
      "37°6'N"
    ],
    "explanation": "The E suffix identifies 82°30'E as a longitude, and India uses it for standard time. The other values are latitudes used in questions on India's north–south position.",
    "sourceFactIds": [
      "IST-LONGITUDE-IDENTIFICATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-019",
    "qlName": "Standard Meridian — 82°30'E",
    "difficulty": "Medium",
    "stem": "A map marks a north–south line at 82°30'E across India. What does this line represent?",
    "answer": "The Standard Meridian of India",
    "distractors": [
      "The Tropic of Cancer",
      "The Equator",
      "India's eastern coastline"
    ],
    "explanation": "Meridians run north–south and are measured as longitudes. The meridian at 82°30'E is used as India's standard-time reference.",
    "sourceFactIds": [
      "IST-MAP-MERIDIAN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-019",
    "qlName": "Standard Meridian — 82°30'E",
    "difficulty": "Medium",
    "stem": "Which change would alter the reference longitude used for IST?",
    "answer": "Changing India's Standard Meridian from 82°30'E",
    "distractors": [
      "Changing the Tropic of Cancer",
      "Changing India's coastline length",
      "Changing the north–south distance"
    ],
    "explanation": "IST is tied to the chosen standard meridian at 82°30'E. Latitude, coastline length and mainland dimensions do not determine the reference longitude for standard time.",
    "sourceFactIds": [
      "IST-REFERENCE-DEPENDENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-020",
    "qlName": "Mirzapur reference and central meridian",
    "difficulty": "Easy",
    "stem": "India's Standard Meridian passes through which place?",
    "answer": "Mirzapur in Uttar Pradesh",
    "distractors": [
      "Jaipur in Rajasthan",
      "Ahmedabad in Gujarat",
      "Guwahati in Assam"
    ],
    "explanation": "The 82°30'E Standard Meridian passes through Mirzapur in Uttar Pradesh. This is the standard textbook location used to identify India's time-reference meridian.",
    "sourceFactIds": [
      "IST-MIRZAPUR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-020",
    "qlName": "Mirzapur reference and central meridian",
    "difficulty": "Easy",
    "stem": "Mirzapur, used as a reference in questions on IST, is in which state?",
    "answer": "Uttar Pradesh",
    "distractors": [
      "Madhya Pradesh",
      "Rajasthan",
      "Bihar"
    ],
    "explanation": "Mirzapur is in Uttar Pradesh and lies on the 82°30'E Standard Meridian. Its name is commonly paired with India's standard-time reference.",
    "sourceFactIds": [
      "IST-MIRZAPUR-UP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-020",
    "qlName": "Mirzapur reference and central meridian",
    "difficulty": "Medium",
    "stem": "Which place–longitude combination is used for Indian Standard Time?",
    "answer": "Mirzapur — 82°30'E",
    "distractors": [
      "Ahmedabad — 68°7'E",
      "Kanyakumari — 23°30'N",
      "Guwahati — 97°25'E"
    ],
    "explanation": "Mirzapur in Uttar Pradesh lies on 82°30'E, India's Standard Meridian. The other figures refer to different geographic limits or reference lines.",
    "sourceFactIds": [
      "IST-MIRZAPUR-LONGITUDE-PAIR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-020",
    "qlName": "Mirzapur reference and central meridian",
    "difficulty": "Medium",
    "stem": "Why is Mirzapur frequently mentioned with Indian Standard Time?",
    "answer": "The Standard Meridian at 82°30'E passes through it",
    "distractors": [
      "It is India's easternmost city",
      "It lies on the Equator",
      "It is India's southernmost point"
    ],
    "explanation": "Mirzapur is used because the 82°30'E standard meridian passes through the area. Its importance here comes from longitude and timekeeping, not from an extreme-point location.",
    "sourceFactIds": [
      "IST-MIRZAPUR-REASON"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-020",
    "qlName": "Mirzapur reference and central meridian",
    "difficulty": "Medium",
    "stem": "A question gives Mirzapur as a clue. Which geography fact is most likely being tested?",
    "answer": "India's Standard Meridian",
    "distractors": [
      "India's western coastline",
      "The Tropic of Cancer",
      "The southernmost point of India"
    ],
    "explanation": "Mirzapur is the familiar place clue for 82°30'E, the Standard Meridian of India. Extreme-point and coastline questions use different locations.",
    "sourceFactIds": [
      "IST-MIRZAPUR-CLUE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-020",
    "qlName": "Mirzapur reference and central meridian",
    "difficulty": "Medium",
    "stem": "If a map places Mirzapur on India's standard-time meridian, which longitude should be marked?",
    "answer": "82°30'E",
    "distractors": [
      "23°30'N",
      "68°7'E",
      "97°25'E"
    ],
    "explanation": "Mirzapur is used to locate India's 82°30'E Standard Meridian. The answer must therefore be a longitude, not the Tropic of Cancer or an extreme longitude.",
    "sourceFactIds": [
      "IST-MIRZAPUR-MAP"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-021",
    "qlName": "IST as one national standard time",
    "difficulty": "Easy",
    "stem": "What is the standard clock time followed across India called?",
    "answer": "Indian Standard Time",
    "distractors": [
      "Local Solar Time",
      "Greenwich Local Time",
      "Indian Seasonal Time"
    ],
    "explanation": "India follows Indian Standard Time, or IST, as a common national clock time. Local solar time can vary from place to place because longitude changes.",
    "sourceFactIds": [
      "IST-NAME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-021",
    "qlName": "IST as one national standard time",
    "difficulty": "Easy",
    "stem": "Why is a common standard time useful for a country as wide as India?",
    "answer": "It keeps official time uniform across different longitudes",
    "distractors": [
      "It makes sunrise occur everywhere together",
      "It removes longitude differences",
      "It changes India's geographic position"
    ],
    "explanation": "Local solar time varies with longitude, which would create different clock times from east to west. A common standard time keeps administration, transport and daily schedules uniform.",
    "sourceFactIds": [
      "IST-UNIFORM-OFFICIAL-TIME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-021",
    "qlName": "IST as one national standard time",
    "difficulty": "Medium",
    "stem": "Two Indian cities have different local solar times. What happens to their official clock time?",
    "answer": "Both follow the same IST",
    "distractors": [
      "Each uses a separate national time zone",
      "Only the eastern city follows IST",
      "Only the western city follows IST"
    ],
    "explanation": "Differences in local solar time do not create separate official time zones within India. Both cities use the same Indian Standard Time.",
    "sourceFactIds": [
      "IST-SAME-OFFICIAL-TIME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-021",
    "qlName": "IST as one national standard time",
    "difficulty": "Medium",
    "stem": "Which statement separates local solar time from IST?",
    "answer": "Local solar time varies with longitude, while IST is one national reference time",
    "distractors": [
      "Both change every degree across India",
      "IST varies with altitude",
      "Local solar time is identical at all longitudes"
    ],
    "explanation": "Local solar time depends on a place's longitude and therefore differs across the country. IST uses one selected meridian so official clocks remain uniform.",
    "sourceFactIds": [
      "IST-VS-LOCAL-SOLAR"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-021",
    "qlName": "IST as one national standard time",
    "difficulty": "Medium",
    "stem": "A railway timetable lists one time standard for stations from Gujarat to Arunachal Pradesh. Which time is being used?",
    "answer": "Indian Standard Time",
    "distractors": [
      "Each station's local solar time",
      "Greenwich Mean Time only",
      "A separate eastern time zone"
    ],
    "explanation": "National timetables use IST rather than changing with local solar time at each station. This gives one consistent official time across India.",
    "sourceFactIds": [
      "IST-TIMETABLE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-021",
    "qlName": "IST as one national standard time",
    "difficulty": "Medium",
    "stem": "What problem would arise if every Indian longitude used its own official local time?",
    "answer": "Schedules would vary continuously from east to west",
    "distractors": [
      "Latitude would change",
      "The coastline would become longer",
      "The Tropic of Cancer would shift"
    ],
    "explanation": "Local time changes gradually with longitude. Using each local time officially would make national schedules unnecessarily complicated, which is why a standard time is used.",
    "sourceFactIds": [
      "IST-NEED-FOR-STANDARDIZATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-022",
    "qlName": "IST and UTC/GMT offset (+5:30)",
    "difficulty": "Easy",
    "stem": "How far ahead of UTC is Indian Standard Time?",
    "answer": "5 hours 30 minutes",
    "distractors": [
      "4 hours 30 minutes",
      "5 hours",
      "6 hours 30 minutes"
    ],
    "explanation": "IST is UTC+5:30. This means Indian Standard Time is five hours and thirty minutes ahead of Coordinated Universal Time.",
    "sourceFactIds": [
      "IST-UTC-OFFSET"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-022",
    "qlName": "IST and UTC/GMT offset (+5:30)",
    "difficulty": "Easy",
    "stem": "Which expression correctly represents Indian Standard Time?",
    "answer": "UTC + 5:30",
    "distractors": [
      "UTC − 5:30",
      "UTC + 2:00",
      "UTC − 2:00"
    ],
    "explanation": "Indian Standard Time is five hours and thirty minutes ahead of UTC. The plus sign is important because India lies east of the Greenwich reference meridian.",
    "sourceFactIds": [
      "IST-UTC-NOTATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-022",
    "qlName": "IST and UTC/GMT offset (+5:30)",
    "difficulty": "Medium",
    "stem": "If it is 06:00 UTC, what is the corresponding IST?",
    "answer": "11:30",
    "distractors": [
      "00:30",
      "10:30",
      "12:30"
    ],
    "explanation": "IST is 5 hours 30 minutes ahead of UTC. Adding 5:30 to 06:00 gives 11:30 IST.",
    "sourceFactIds": [
      "IST-UTC-CONVERSION-0600"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-022",
    "qlName": "IST and UTC/GMT offset (+5:30)",
    "difficulty": "Medium",
    "stem": "If it is 18:00 IST, what is the corresponding UTC?",
    "answer": "12:30 UTC",
    "distractors": [
      "23:30 UTC",
      "13:30 UTC",
      "11:30 UTC"
    ],
    "explanation": "To convert IST to UTC, subtract 5 hours 30 minutes. Subtracting 5:30 from 18:00 gives 12:30 UTC.",
    "sourceFactIds": [
      "IST-UTC-CONVERSION-1800"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-022",
    "qlName": "IST and UTC/GMT offset (+5:30)",
    "difficulty": "Medium",
    "stem": "Why is IST ahead of UTC rather than behind it?",
    "answer": "India lies east of the Greenwich meridian",
    "distractors": [
      "India lies west of Greenwich",
      "India lies on the Equator",
      "India lies in the Southern Hemisphere"
    ],
    "explanation": "Local time becomes later as one moves eastward from Greenwich. India lies east of the Prime Meridian, so IST is ahead of UTC.",
    "sourceFactIds": [
      "IST-AHEAD-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-022",
    "qlName": "IST and UTC/GMT offset (+5:30)",
    "difficulty": "Hard",
    "stem": "At 23:30 UTC on Monday, what is the date and time in IST?",
    "answer": "05:00 on Tuesday",
    "distractors": [
      "18:00 on Monday",
      "05:00 on Monday",
      "04:00 on Tuesday"
    ],
    "explanation": "Adding 5 hours 30 minutes to 23:30 gives 05:00 after midnight. The clock therefore moves into Tuesday in India.",
    "sourceFactIds": [
      "IST-UTC-DATE-CHANGE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-023",
    "qlName": "Longitude–time relation: 1° = 4 minutes",
    "difficulty": "Easy",
    "stem": "A difference of 1° in longitude corresponds to about how much difference in local solar time?",
    "answer": "4 minutes",
    "distractors": [
      "1 minute",
      "15 minutes",
      "60 minutes"
    ],
    "explanation": "Earth rotates 360° in about 24 hours, so it turns 15° in one hour. Dividing 60 minutes by 15 gives about 4 minutes of time for each degree of longitude.",
    "sourceFactIds": [
      "LONGITUDE-TIME-ONE-DEGREE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-023",
    "qlName": "Longitude–time relation: 1° = 4 minutes",
    "difficulty": "Easy",
    "stem": "Two places differ by 2° of longitude. About how much do their local solar times differ?",
    "answer": "8 minutes",
    "distractors": [
      "2 minutes",
      "4 minutes",
      "30 minutes"
    ],
    "explanation": "Each degree of longitude corresponds to about four minutes of local solar time. A 2° difference therefore produces about 8 minutes.",
    "sourceFactIds": [
      "LONGITUDE-TIME-TWO-DEGREES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-023",
    "qlName": "Longitude–time relation: 1° = 4 minutes",
    "difficulty": "Medium",
    "stem": "What local-time difference is produced by 5° of longitude?",
    "answer": "20 minutes",
    "distractors": [
      "5 minutes",
      "10 minutes",
      "25 minutes"
    ],
    "explanation": "At roughly four minutes per degree, 5° × 4 minutes equals 20 minutes. The eastern location would be ahead by this amount.",
    "sourceFactIds": [
      "LONGITUDE-TIME-FIVE-DEGREES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-023",
    "qlName": "Longitude–time relation: 1° = 4 minutes",
    "difficulty": "Medium",
    "stem": "Two places have a local-time difference of 40 minutes. About how many degrees of longitude separate them?",
    "answer": "10°",
    "distractors": [
      "4°",
      "20°",
      "40°"
    ],
    "explanation": "One degree corresponds to about four minutes. Dividing 40 minutes by 4 minutes per degree gives a longitude difference of about 10°.",
    "sourceFactIds": [
      "LONGITUDE-TIME-40MIN"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-023",
    "qlName": "Longitude–time relation: 1° = 4 minutes",
    "difficulty": "Medium",
    "stem": "A town 3° east of another town will have local solar time approximately how much ahead?",
    "answer": "12 minutes",
    "distractors": [
      "3 minutes",
      "7 minutes",
      "18 minutes"
    ],
    "explanation": "The time difference is about four minutes for each degree of longitude. Three degrees to the east therefore makes local solar time about 12 minutes ahead.",
    "sourceFactIds": [
      "LONGITUDE-TIME-THREE-DEG-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-023",
    "qlName": "Longitude–time relation: 1° = 4 minutes",
    "difficulty": "Hard",
    "stem": "Place A is at 75°E and Place B at 82°E. If A's local time is 10:00, what is B's approximate local time?",
    "answer": "10:28",
    "distractors": [
      "09:32",
      "10:07",
      "10:42"
    ],
    "explanation": "B is 7° east of A, giving 7 × 4 = 28 minutes of time difference. Eastern places are ahead, so B's local time is about 10:28.",
    "sourceFactIds": [
      "LONGITUDE-TIME-75E-82E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-024",
    "qlName": "15° longitude = 1 hour",
    "difficulty": "Easy",
    "stem": "A difference of 15° in longitude corresponds to about how much local-time difference?",
    "answer": "1 hour",
    "distractors": [
      "15 minutes",
      "30 minutes",
      "2 hours"
    ],
    "explanation": "Earth rotates about 15° in one hour. Therefore two places 15° apart in longitude differ by about one hour in local solar time.",
    "sourceFactIds": [
      "LONGITUDE-TIME-15-DEG"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-024",
    "qlName": "15° longitude = 1 hour",
    "difficulty": "Easy",
    "stem": "How many degrees of longitude correspond to a two-hour local-time difference?",
    "answer": "30°",
    "distractors": [
      "2°",
      "15°",
      "60°"
    ],
    "explanation": "Fifteen degrees of longitude corresponds to one hour. A two-hour difference therefore corresponds to about 30°.",
    "sourceFactIds": [
      "LONGITUDE-TIME-2H-DEGREES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-024",
    "qlName": "15° longitude = 1 hour",
    "difficulty": "Medium",
    "stem": "Places X and Y differ by 45° of longitude. About how much do their local solar times differ?",
    "answer": "3 hours",
    "distractors": [
      "45 minutes",
      "1 hour",
      "4 hours"
    ],
    "explanation": "At 15° per hour, a 45° longitude difference gives 45 ÷ 15 = 3 hours. The eastern place would be ahead by that amount.",
    "sourceFactIds": [
      "LONGITUDE-TIME-45-DEG"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-024",
    "qlName": "15° longitude = 1 hour",
    "difficulty": "Medium",
    "stem": "A place is 30° east of another place. What is the approximate local-time difference?",
    "answer": "2 hours ahead",
    "distractors": [
      "30 minutes ahead",
      "1 hour ahead",
      "2 hours behind"
    ],
    "explanation": "Thirty degrees equals two groups of 15°, and each 15° represents about one hour. Since the place is east, its local solar time is about two hours ahead.",
    "sourceFactIds": [
      "LONGITUDE-TIME-30DEG-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-024",
    "qlName": "15° longitude = 1 hour",
    "difficulty": "Medium",
    "stem": "Which longitude difference would produce about a 30-minute local-time difference?",
    "answer": "7.5°",
    "distractors": [
      "15°",
      "30°",
      "2°"
    ],
    "explanation": "One hour corresponds to 15°, so half an hour corresponds to half of 15°. That gives a longitude difference of about 7.5°.",
    "sourceFactIds": [
      "LONGITUDE-TIME-30MIN-DEGREES"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-024",
    "qlName": "15° longitude = 1 hour",
    "difficulty": "Hard",
    "stem": "It is 09:00 local solar time at 60°E. What is the approximate local solar time at 90°E?",
    "answer": "11:00",
    "distractors": [
      "07:00",
      "09:30",
      "10:00"
    ],
    "explanation": "The longitude difference is 30°, equal to two hours. Since 90°E lies east of 60°E, its local solar time is two hours ahead, or about 11:00.",
    "sourceFactIds": [
      "LONGITUDE-TIME-60E-90E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-025",
    "qlName": "Eastern places are ahead in local solar time",
    "difficulty": "Easy",
    "stem": "Which place has the later local solar time: one farther east or one farther west?",
    "answer": "The place farther east",
    "distractors": [
      "The place farther west",
      "Both always have identical local time",
      "Latitude alone decides it"
    ],
    "explanation": "Earth rotates from west to east, so places farther east encounter the Sun's daily position earlier. Their local solar time is therefore ahead of places farther west.",
    "sourceFactIds": [
      "LOCAL-TIME-EAST-AHEAD"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-025",
    "qlName": "Eastern places are ahead in local solar time",
    "difficulty": "Easy",
    "stem": "If Town B lies east of Town A, how does B's local solar time compare with A's?",
    "answer": "B is ahead of A",
    "distractors": [
      "B is behind A",
      "Both must be identical",
      "B's time depends only on altitude"
    ],
    "explanation": "Local solar time increases eastward with longitude. A town to the east therefore has a later local solar time than a town to the west.",
    "sourceFactIds": [
      "LOCAL-TIME-EAST-VS-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-025",
    "qlName": "Eastern places are ahead in local solar time",
    "difficulty": "Medium",
    "stem": "Sunrise is generally experienced earlier by local solar time in eastern India than in western India. Which factor explains this?",
    "answer": "Difference in longitude",
    "distractors": [
      "Difference in national currency",
      "Difference in coastline length",
      "Difference in state population"
    ],
    "explanation": "Eastern locations are at greater east longitudes and reach the Sun's daily positions earlier. Longitude, not administrative or demographic differences, explains the local-time shift.",
    "sourceFactIds": [
      "LOCAL-TIME-SUNRISE-LONGITUDE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-025",
    "qlName": "Eastern places are ahead in local solar time",
    "difficulty": "Medium",
    "stem": "Town P is at 70°E and Town Q at 90°E. Which town is ahead in local solar time?",
    "answer": "Town Q",
    "distractors": [
      "Town P",
      "Both are identical",
      "Neither has local solar time"
    ],
    "explanation": "Town Q lies 20° farther east than Town P. Eastern longitudes are ahead in local solar time, so Q's local time is later.",
    "sourceFactIds": [
      "LOCAL-TIME-70E-90E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-025",
    "qlName": "Eastern places are ahead in local solar time",
    "difficulty": "Medium",
    "stem": "A traveller moves westward across India. What happens to local solar time?",
    "answer": "It becomes earlier",
    "distractors": [
      "It becomes later",
      "It remains fixed by longitude",
      "It changes only with latitude"
    ],
    "explanation": "Moving west means moving to smaller east longitudes. Local solar time becomes earlier as one travels westward, even though official clocks continue to show IST.",
    "sourceFactIds": [
      "LOCAL-TIME-WESTWARD"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-025",
    "qlName": "Eastern places are ahead in local solar time",
    "difficulty": "Hard",
    "stem": "Two towns follow the same IST, but Town X is 12° east of Town Y. Which statement is correct?",
    "answer": "X's local solar time is about 48 minutes ahead of Y",
    "distractors": [
      "X's IST is 48 minutes ahead",
      "Y's local solar time is 48 minutes ahead",
      "Their local solar times must be identical"
    ],
    "explanation": "Twelve degrees of longitude gives about 12 × 4 = 48 minutes. Official IST remains the same, but the eastern town X has local solar time about 48 minutes ahead.",
    "sourceFactIds": [
      "LOCAL-TIME-EAST-12DEG"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-026",
    "qlName": "Gujarat–Arunachal local-time difference",
    "difficulty": "Easy",
    "stem": "What is the approximate local-time difference between Gujarat and Arunachal Pradesh?",
    "answer": "Two hours",
    "distractors": [
      "Thirty minutes",
      "One hour",
      "Four hours"
    ],
    "explanation": "India's east–west extent produces an approximate two-hour difference in local solar time between Gujarat and Arunachal Pradesh. Official clocks in both places still follow IST.",
    "sourceFactIds": [
      "GUJARAT-ARUNACHAL-TWO-HOURS"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-026",
    "qlName": "Gujarat–Arunachal local-time difference",
    "difficulty": "Easy",
    "stem": "Which state has the earlier local solar time: Gujarat or Arunachal Pradesh?",
    "answer": "Gujarat",
    "distractors": [
      "Arunachal Pradesh",
      "Both are always identical",
      "Neither uses local solar time"
    ],
    "explanation": "Gujarat lies farther west, so its local solar time is earlier. Arunachal Pradesh lies much farther east and is roughly two hours ahead in local solar time.",
    "sourceFactIds": [
      "GUJARAT-EARLIER-LOCAL-TIME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-026",
    "qlName": "Gujarat–Arunachal local-time difference",
    "difficulty": "Medium",
    "stem": "Why can sunrise occur much earlier in Arunachal Pradesh than in Gujarat while official clocks show the same time?",
    "answer": "Longitude changes local solar time, but both states use IST",
    "distractors": [
      "Arunachal Pradesh uses a separate national time zone",
      "Gujarat lies in another hemisphere",
      "IST changes with altitude"
    ],
    "explanation": "Arunachal Pradesh lies much farther east, so the Sun's daily cycle is earlier there in local solar time. Both states nevertheless use the same official IST.",
    "sourceFactIds": [
      "GUJARAT-ARUNACHAL-SUNRISE-IST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-026",
    "qlName": "Gujarat–Arunachal local-time difference",
    "difficulty": "Medium",
    "stem": "The Gujarat–Arunachal local-time contrast is mainly evidence of India's large extent in which direction?",
    "answer": "East to west",
    "distractors": [
      "North to south",
      "Vertical altitude",
      "Ocean depth"
    ],
    "explanation": "The time difference arises because Gujarat and Arunachal Pradesh are widely separated in longitude. Longitude measures east–west position, so the contrast reflects India's east–west extent.",
    "sourceFactIds": [
      "GUJARAT-ARUNACHAL-EAST-WEST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-026",
    "qlName": "Gujarat–Arunachal local-time difference",
    "difficulty": "Medium",
    "stem": "If local noon occurs earlier in Arunachal Pradesh than Gujarat, which state lies farther east?",
    "answer": "Arunachal Pradesh",
    "distractors": [
      "Gujarat",
      "Both lie on the same longitude",
      "The comparison cannot be made"
    ],
    "explanation": "Eastern places reach local noon earlier by local solar time. Arunachal Pradesh is east of Gujarat, matching the observed time difference.",
    "sourceFactIds": [
      "GUJARAT-ARUNACHAL-EAST-INFERENCE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-026",
    "qlName": "Gujarat–Arunachal local-time difference",
    "difficulty": "Hard",
    "stem": "If Gujarat's local solar time is about 08:00, what would the textbook two-hour approximation suggest for Arunachal Pradesh?",
    "answer": "About 10:00",
    "distractors": [
      "About 06:00",
      "About 08:30",
      "About 12:00"
    ],
    "explanation": "Arunachal Pradesh is about two hours ahead of Gujarat in local solar time. Adding two hours to 08:00 gives an approximate local time of 10:00.",
    "sourceFactIds": [
      "GUJARAT-ARUNACHAL-TIME-APPLICATION"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-027",
    "qlName": "Mixed IST / longitude-time calculations",
    "difficulty": "Easy",
    "stem": "A place 5° east of another place is ahead in local solar time by about how much?",
    "answer": "20 minutes",
    "distractors": [
      "5 minutes",
      "10 minutes",
      "1 hour"
    ],
    "explanation": "Each degree of longitude represents about four minutes of local solar time. Five degrees east therefore gives 5 × 4 = 20 minutes ahead.",
    "sourceFactIds": [
      "MIXED-IST-5DEG-EAST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-027",
    "qlName": "Mixed IST / longitude-time calculations",
    "difficulty": "Easy",
    "stem": "Which calculation converts 10:00 UTC to IST?",
    "answer": "Add 5 hours 30 minutes",
    "distractors": [
      "Subtract 5 hours 30 minutes",
      "Add 2 hours",
      "Subtract 30 minutes"
    ],
    "explanation": "IST is UTC+5:30. Therefore converting from UTC to IST requires adding five hours and thirty minutes.",
    "sourceFactIds": [
      "MIXED-UTC-TO-IST-RULE"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-027",
    "qlName": "Mixed IST / longitude-time calculations",
    "difficulty": "Medium",
    "stem": "It is 10:00 local solar time at 75°E. What is the approximate local solar time at 82.5°E?",
    "answer": "10:30",
    "distractors": [
      "09:30",
      "10:07",
      "11:00"
    ],
    "explanation": "The longitude difference is 7.5°, which equals about 30 minutes of time. Since 82.5°E is east of 75°E, its local solar time is about 10:30.",
    "sourceFactIds": [
      "MIXED-75E-82_5E"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-027",
    "qlName": "Mixed IST / longitude-time calculations",
    "difficulty": "Medium",
    "stem": "At 12:00 UTC, what time does an Indian clock following IST show?",
    "answer": "17:30",
    "distractors": [
      "06:30",
      "12:30",
      "18:00"
    ],
    "explanation": "Indian Standard Time is five hours and thirty minutes ahead of UTC. Adding 5:30 to 12:00 gives 17:30 IST.",
    "sourceFactIds": [
      "MIXED-UTC-NOON-IST"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-027",
    "qlName": "Mixed IST / longitude-time calculations",
    "difficulty": "Medium",
    "stem": "Two places differ by 22.5° in longitude. What is their approximate local-time difference?",
    "answer": "1 hour 30 minutes",
    "distractors": [
      "22.5 minutes",
      "45 minutes",
      "2 hours 15 minutes"
    ],
    "explanation": "Fifteen degrees corresponds to one hour, and 7.5° adds another 30 minutes. A 22.5° difference therefore gives about 1 hour 30 minutes.",
    "sourceFactIds": [
      "MIXED-22_5-DEG-TIME"
    ]
  },
  {
    "qlId": "GEO-LOC-001-QL-027",
    "qlName": "Mixed IST / longitude-time calculations",
    "difficulty": "Hard",
    "stem": "Place A is 10° west of the Standard Meridian. When the local solar time at 82°30'E is 12:00, what is A's approximate local solar time?",
    "answer": "11:20",
    "distractors": [
      "12:40",
      "11:50",
      "10:40"
    ],
    "explanation": "Ten degrees of longitude corresponds to about 40 minutes. A lies west of the Standard Meridian, so its local solar time is earlier: about 11:20.",
    "sourceFactIds": [
      "MIXED-WEST-OF-STANDARD-MERIDIAN"
    ]
  }
]);

export const GEO_LOC_001_CP003_REVIEW_BATCH_V1: readonly GeoLoc001Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-LOC-001-CP003-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: placeGeoLocOptions(raw.answer, raw.distractors, correctIndex),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: CP003_SOURCE_IDS,
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED = /associated with|best describes|described as|in the context of|\bbroad(?:ly)?\b|\bmainly\b|given in NCERT|\bNCERT\b|\btextbook\b|stated mainland|which pair correctly|which statement correctly|which option gives|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR = /currency|literacy rate|stock market|crop price|movie|sports team|bank rate|tax slab/i;

export function auditGeoLoc001Cp003ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoLoc001Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];

  for (const q of GEO_LOC_001_CP003_REVIEW_BATCH_V1) {
    if (ids.has(q.questionId)) issues.push("DUPLICATE_ID:" + q.questionId);
    ids.add(q.questionId);
    const stem = q.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(stem)) issues.push("DUPLICATE_STEM:" + q.questionId);
    stems.add(stem);
    const exp = q.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(exp)) issues.push("DUPLICATE_EXPLANATION:" + q.questionId);
    explanations.add(exp);
    qlCounts[q.qlId] = (qlCounts[q.qlId] ?? 0) + 1;
    difficultyCounts[q.difficulty] += 1;
    answerPositions[q.correctIndex] += 1;
    if (q.options.length !== 4 || new Set(q.options).size !== 4) issues.push("OPTIONS:" + q.questionId);
    if (q.options[q.correctIndex] !== q.canonicalAnswer) issues.push("ANSWER:" + q.questionId);
    if (!q.sourceIds.length || !q.sourceFactIds.length) issues.push("PROVENANCE:" + q.questionId);
    if (!q.reviewOnly || q.runtimeRegistered) issues.push("LIFECYCLE:" + q.questionId);
    const distractors = q.options.filter((_, i) => i !== q.correctIndex);
    if (distractors.some((option) => TRIVIAL_DISTRACTOR.test(option))) issues.push("TRIVIAL_DISTRACTOR:" + q.questionId);
    const learnerText = q.stem + "\n" + q.options.join("\n") + "\n" + q.explanation;
    if (BANNED.test(learnerText)) issues.push("STYLE:" + q.questionId);
    if (q.stem.length < 20 || q.stem.length > 300 || !q.stem.trim().endsWith("?")) issues.push("STEM_SHAPE:" + q.questionId);
    if (q.explanation.length < 115) issues.push("SHORT_EXPLANATION:" + q.questionId);
    if ((q.explanation.match(/[.!?](?:\s|$)/g) ?? []).length < 2) issues.push("EXPLANATION_DEPTH:" + q.questionId);
  }

  if (GEO_LOC_001_CP003_REVIEW_BATCH_V1.length !== 54) issues.push("COUNT:" + GEO_LOC_001_CP003_REVIEW_BATCH_V1.length);
  for (let n = 19; n <= 27; n += 1) {
    const qlId = "GEO-LOC-001-QL-" + String(n).padStart(3, "0");
    if (qlCounts[qlId] !== 6) issues.push("QL_COUNT:" + qlId + ":" + (qlCounts[qlId] ?? 0));
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push("DIFFICULTY:" + JSON.stringify(difficultyCounts));
  if (answerPositions.join(",") !== "14,14,13,13") issues.push("ANSWER_POSITIONS:" + answerPositions.join(","));
  if (stems.size !== 54) issues.push("STEM_COUNT:" + stems.size);
  if (explanations.size !== 54) issues.push("EXPLANATION_COUNT:" + explanations.size);

  return Object.freeze({valid: issues.length === 0,issues:Object.freeze(issues),questionCount:GEO_LOC_001_CP003_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
