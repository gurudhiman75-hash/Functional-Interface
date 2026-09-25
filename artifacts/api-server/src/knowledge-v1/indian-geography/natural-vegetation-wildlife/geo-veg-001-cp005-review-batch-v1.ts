import {
  GEO_VEG_001_SOURCE_IDS,
  placeGeoVegOptions,
  type GeoVeg001Difficulty,
  type GeoVeg001Question,
} from "./geo-veg-001-review-types";

type RawQuestion = Readonly<{
  qlId: string;
  qlName: string;
  difficulty: GeoVeg001Difficulty;
  stem: string;
  answer: string;
  distractors: readonly string[];
  explanation: string;
  sourceFactIds: readonly string[];
}>;

const RAW: readonly RawQuestion[] = Object.freeze([
  {
    "qlId": "GEO-VEG-001-QL-037",
    "qlName": "Montane vegetation and altitude",
    "difficulty": "Easy",
    "stem": "What is the strongest physical reason vegetation changes with height on a mountain?",
    "answer": "Temperature generally decreases as altitude increases",
    "distractors": [
      "Rainfall always becomes zero with height",
      "Soil type remains identical at every level",
      "Day length changes sharply within a few kilometres"
    ],
    "explanation": "Mountain vegetation changes with altitude because temperature falls as height increases. Moisture and slope also matter, but the temperature gradient is a major control.",
    "sourceFactIds": [
      "MONTANE-ALTITUDE-TEMP"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-037",
    "qlName": "Montane vegetation and altitude",
    "difficulty": "Easy",
    "stem": "A sequence of different forest belts from a mountain base to high slopes is called what kind of pattern?",
    "answer": "Altitudinal zonation of vegetation",
    "distractors": [
      "Tidal zonation",
      "Desert succession",
      "Riverine deposition"
    ],
    "explanation": "Different vegetation belts occur at different elevations because climate changes with height. This vertical arrangement is called altitudinal zonation.",
    "sourceFactIds": [
      "MONTANE-ZONATION"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-037",
    "qlName": "Montane vegetation and altitude",
    "difficulty": "Medium",
    "stem": "Why can a mountain show tropical vegetation at lower levels and temperate vegetation higher up?",
    "answer": "Higher elevations are cooler than the foothills",
    "distractors": [
      "Latitude changes from tropical to polar on the same slope",
      "Higher slopes always receive no rainfall",
      "Mountain soils cannot support tropical plants"
    ],
    "explanation": "Elevation creates a strong temperature gradient over a short horizontal distance. As conditions become cooler, plant communities suited to lower temperatures replace tropical types.",
    "sourceFactIds": [
      "MONTANE-TROPICAL-TEMPERATE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-037",
    "qlName": "Montane vegetation and altitude",
    "difficulty": "Medium",
    "stem": "Which environmental change is most likely as a person climbs from a warm Himalayan foothill to a much higher slope?",
    "answer": "Lower temperature and a shift toward temperate vegetation",
    "distractors": [
      "Higher temperature and denser tropical rainforest everywhere",
      "No climatic change at all",
      "Immediate replacement by mangrove vegetation"
    ],
    "explanation": "Temperature normally falls with altitude, so the vegetation also changes. Temperate and later alpine forms appear as elevation increases.",
    "sourceFactIds": [
      "MONTANE-CLIMB"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-037",
    "qlName": "Montane vegetation and altitude",
    "difficulty": "Medium",
    "stem": "What best explains why montane forests do not form one identical belt from foothill to summit?",
    "answer": "Climate changes progressively with elevation",
    "distractors": [
      "All mountain soils are saline",
      "Tree species are fixed only by longitude",
      "Rainfall is the same at every height"
    ],
    "explanation": "Elevation changes temperature, moisture conditions and the length of the growing season. These gradients create several vegetation belts rather than one uniform forest.",
    "sourceFactIds": [
      "MONTANE-MULTI-BELTS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-037",
    "qlName": "Montane vegetation and altitude",
    "difficulty": "Hard",
    "stem": "Two sites lie on the same Himalayan slope and receive adequate moisture, but the upper site supports temperate trees while the lower site supports subtropical trees. Which factor best explains the contrast?",
    "answer": "The upper site has lower temperatures because of greater altitude",
    "distractors": [
      "The upper site has moved to a different latitude",
      "The lower site must receive snowfall all year",
      "Soil has no influence on either site"
    ],
    "explanation": "Because the sites are on the same slope, latitude is nearly unchanged. The stronger difference is altitude, which lowers temperature and shifts the vegetation toward cooler-climate species.",
    "sourceFactIds": [
      "MONTANE-SAME-SLOPE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-038",
    "qlName": "Wet temperate broadleaf forests",
    "difficulty": "Easy",
    "stem": "In the Himalayas, wet temperate forests are commonly found at about which elevation range?",
    "answer": "About 1,000–2,000 metres",
    "distractors": [
      "Below sea level",
      "Above 5,500 metres only",
      "Only in coastal tidal flats"
    ],
    "explanation": "NCERT places wet temperate forests roughly between 1,000 and 2,000 metres in the Himalayas. The cooler, moist conditions support broadleaf temperate trees.",
    "sourceFactIds": [
      "WET-TEMPERATE-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-038",
    "qlName": "Wet temperate broadleaf forests",
    "difficulty": "Easy",
    "stem": "Which trees are characteristic of Himalayan wet temperate forests around 1,000–2,000 metres?",
    "answer": "Oak and chestnut",
    "distractors": [
      "Cactus and euphorbia",
      "Sundari and mangrove palm",
      "Ebony and mahogany only"
    ],
    "explanation": "Oak and chestnut are common broadleaf trees in the wet temperate belt. They fit cool, moist mountain conditions rather than dry or tidal environments.",
    "sourceFactIds": [
      "WET-TEMPERATE-OAK-CHESTNUT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-038",
    "qlName": "Wet temperate broadleaf forests",
    "difficulty": "Medium",
    "stem": "A Himalayan slope at about 1,500 metres is cool, moist and dominated by broadleaf trees. Which vegetation is most likely?",
    "answer": "Wet temperate forest",
    "distractors": [
      "Tropical thorn scrub",
      "Alpine tundra",
      "Tidal mangrove forest"
    ],
    "explanation": "The elevation and broadleaf composition fit the wet temperate belt. Thorn, alpine and mangrove vegetation require very different climatic settings.",
    "sourceFactIds": [
      "WET-TEMPERATE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-038",
    "qlName": "Wet temperate broadleaf forests",
    "difficulty": "Medium",
    "stem": "Which clue best separates a wet temperate broadleaf belt from the higher conifer belt?",
    "answer": "Oak and chestnut are prominent at the lower temperate level",
    "distractors": [
      "Cactus becomes dominant",
      "Mangrove roots appear in tidal mud",
      "The forest becomes tropical evergreen because of higher altitude"
    ],
    "explanation": "The lower temperate Himalayan belt commonly contains oak and chestnut. Higher elevations increasingly favour conifers such as deodar, fir and spruce.",
    "sourceFactIds": [
      "WET-TEMPERATE-VS-CONIFER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-038",
    "qlName": "Wet temperate broadleaf forests",
    "difficulty": "Medium",
    "stem": "Why can broadleaf temperate forests occur above subtropical forests on Himalayan slopes?",
    "answer": "The higher belt is cooler while still receiving enough moisture",
    "distractors": [
      "Higher elevations are always hotter",
      "Broadleaf trees require desert conditions",
      "Subtropical trees cannot grow below 1,000 metres"
    ],
    "explanation": "With increasing height, temperature falls while moisture may remain adequate. This creates conditions suitable for temperate broadleaf species above the subtropical belt.",
    "sourceFactIds": [
      "WET-TEMPERATE-REASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-038",
    "qlName": "Wet temperate broadleaf forests",
    "difficulty": "Hard",
    "stem": "A mountain transect shows subtropical trees below, oak–chestnut forest around 1,500 metres and conifers still higher. What process creates this sequence?",
    "answer": "Progressive cooling with altitude produces distinct vegetation belts",
    "distractors": [
      "Increasing salinity with height creates all forest zones",
      "Latitude changes rapidly along the mountain slope",
      "Tidal flooding reaches the upper slopes"
    ],
    "explanation": "The sequence reflects altitudinal zonation. As temperature drops with height, plant communities suited to progressively cooler conditions replace one another.",
    "sourceFactIds": [
      "WET-TEMPERATE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-039",
    "qlName": "Temperate conifer forests",
    "difficulty": "Easy",
    "stem": "At roughly 1,500–3,000 metres in the Himalayas, which vegetation becomes important?",
    "answer": "Temperate coniferous forest",
    "distractors": [
      "Tropical thorn scrub",
      "Mangrove forest",
      "Hot desert vegetation"
    ],
    "explanation": "The Himalayan temperate belt between about 1,500 and 3,000 metres supports many conifers. Cooler conditions favour pine, deodar, fir and spruce.",
    "sourceFactIds": [
      "CONIFER-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-039",
    "qlName": "Temperate conifer forests",
    "difficulty": "Easy",
    "stem": "Which tree group is typical of Himalayan temperate conifer forests?",
    "answer": "Pine, deodar, fir and spruce",
    "distractors": [
      "Cactus, babool and euphorbia",
      "Ebony, mahogany and rosewood",
      "Sundari, nipa and tidal grasses"
    ],
    "explanation": "Pine, deodar, fir and spruce are characteristic mountain conifers. Their needle-like foliage is well suited to cool temperate conditions.",
    "sourceFactIds": [
      "CONIFER-SPECIES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-039",
    "qlName": "Temperate conifer forests",
    "difficulty": "Medium",
    "stem": "A Himalayan forest between about 2,000 and 2,500 metres is dominated by deodar and fir. Which forest belt is indicated?",
    "answer": "Temperate coniferous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Dry deciduous forest",
      "Mangrove forest"
    ],
    "explanation": "Deodar and fir are classic temperate conifers of the middle Himalayan slopes. Their altitude and species composition point to the conifer belt.",
    "sourceFactIds": [
      "CONIFER-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-039",
    "qlName": "Temperate conifer forests",
    "difficulty": "Medium",
    "stem": "Why do coniferous trees become more common above the lower temperate broadleaf belt?",
    "answer": "Higher elevations are colder and favour cold-tolerant conifers",
    "distractors": [
      "Rainfall becomes permanently absent",
      "Broadleaf trees can grow only in deserts",
      "Tidal salinity increases with height"
    ],
    "explanation": "As elevation rises, temperatures become lower and winters harsher. Conifers are better adapted to those cool conditions than many lower-elevation broadleaf trees.",
    "sourceFactIds": [
      "CONIFER-COOLER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-039",
    "qlName": "Temperate conifer forests",
    "difficulty": "Medium",
    "stem": "Which feature helps many conifers cope with cool mountain conditions?",
    "answer": "Needle-like leaves that reduce water loss and shed snow easily",
    "distractors": [
      "Very large soft leaves that trap snow",
      "Breathing roots for tidal mud",
      "Fleshy stems for desert water storage"
    ],
    "explanation": "Needle-shaped leaves have a small surface area and can reduce water loss. Their form also allows snow to slide off more easily than from large flat leaves.",
    "sourceFactIds": [
      "CONIFER-NEEDLES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-039",
    "qlName": "Temperate conifer forests",
    "difficulty": "Hard",
    "stem": "Two moist Himalayan belts lie one above the other. The lower one has oak and chestnut, while the upper one has deodar and spruce. What is the most direct explanation?",
    "answer": "The upper belt is colder because of greater altitude",
    "distractors": [
      "The upper belt must have lower latitude",
      "The lower belt is a tidal zone",
      "Soil alone creates the complete change in tree form"
    ],
    "explanation": "Both belts can be moist, but their temperatures differ because of elevation. The cooler upper belt favours conifers, while the lower temperate belt supports broadleaf trees.",
    "sourceFactIds": [
      "CONIFER-BROADLEAF-COMPARE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-040",
    "qlName": "Deodar, fir, spruce and pine identification",
    "difficulty": "Easy",
    "stem": "Which tree is a well-known conifer of the western Himalayas?",
    "answer": "Deodar",
    "distractors": [
      "Sundari",
      "Babool",
      "Mahogany"
    ],
    "explanation": "Deodar is a major Himalayan conifer and an important timber tree. Sundari is mangrove, babool is dry thorn vegetation, and mahogany is tropical evergreen.",
    "sourceFactIds": [
      "DEODAR-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-040",
    "qlName": "Deodar, fir, spruce and pine identification",
    "difficulty": "Easy",
    "stem": "Which pair contains Himalayan conifers?",
    "answer": "Silver fir and spruce",
    "distractors": [
      "Teak and sal",
      "Ebony and mahogany",
      "Acacia and cactus"
    ],
    "explanation": "Silver fir and spruce are conifers of cool Himalayan forests. The other pairs fit deciduous, evergreen or thorn vegetation.",
    "sourceFactIds": [
      "FIR-SPRUCE-PAIR"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-040",
    "qlName": "Deodar, fir, spruce and pine identification",
    "difficulty": "Medium",
    "stem": "A question lists deodar, silver fir and spruce. Which vegetation belt should you identify?",
    "answer": "Himalayan temperate coniferous forest",
    "distractors": [
      "Tropical evergreen forest",
      "Tropical thorn scrub",
      "Mangrove forest"
    ],
    "explanation": "These species are standard indicators of the temperate conifer belt. They grow at elevations where cool conditions favour needle-leaved trees.",
    "sourceFactIds": [
      "CONIFER-CLUSTER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-040",
    "qlName": "Deodar, fir, spruce and pine identification",
    "difficulty": "Medium",
    "stem": "Which tree–vegetation match is correct?",
    "answer": "Deodar — Himalayan temperate forest",
    "distractors": [
      "Sundari — temperate conifer forest",
      "Cactus — wet temperate forest",
      "Mahogany — alpine meadow"
    ],
    "explanation": "Deodar belongs to Himalayan temperate conifer forests. The other matches place species in environments that do not fit their normal vegetation type.",
    "sourceFactIds": [
      "DEODAR-MATCH"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-040",
    "qlName": "Deodar, fir, spruce and pine identification",
    "difficulty": "Medium",
    "stem": "Which species would be least expected in a typical Himalayan temperate conifer belt?",
    "answer": "Sundari",
    "distractors": [
      "Spruce",
      "Silver fir",
      "Deodar"
    ],
    "explanation": "Sundari is a mangrove tree of tidal delta environments. Spruce, silver fir and deodar are characteristic Himalayan conifers.",
    "sourceFactIds": [
      "CONIFER-LEAST"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-040",
    "qlName": "Deodar, fir, spruce and pine identification",
    "difficulty": "Hard",
    "stem": "A forest has deodar, spruce and silver fir, lies above an oak belt and below alpine vegetation. Which conclusion is strongest?",
    "answer": "It occupies the Himalayan temperate conifer zone",
    "distractors": [
      "It is a tropical tidal forest",
      "It is thorn scrub created by low rainfall",
      "It is a lowland evergreen rainforest"
    ],
    "explanation": "The species and vertical position agree with the temperate conifer belt. It lies between lower broadleaf forests and the higher alpine zone.",
    "sourceFactIds": [
      "CONIFER-INTEGRATED"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-041",
    "qlName": "Alpine vegetation above the tree line",
    "difficulty": "Easy",
    "stem": "Above about 3,600 metres in the Himalayas, which vegetation begins to replace temperate forests?",
    "answer": "Alpine vegetation",
    "distractors": [
      "Tropical evergreen forest",
      "Dry deciduous forest",
      "Mangrove forest"
    ],
    "explanation": "At very high elevations, low temperatures shorten the growing season and limit tall tree growth. Alpine shrubs and grasslands become more common.",
    "sourceFactIds": [
      "ALPINE-ALTITUDE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-041",
    "qlName": "Alpine vegetation above the tree line",
    "difficulty": "Easy",
    "stem": "Why do tall forests become scarce at very high Himalayan elevations?",
    "answer": "Cold conditions and a short growing season limit tree growth",
    "distractors": [
      "Rainfall becomes permanently tropical",
      "Tidal flooding covers the slopes",
      "Temperature rises sharply with altitude"
    ],
    "explanation": "Low temperatures, frost and a short growing season make it difficult for tall trees to survive. Vegetation becomes shorter and more cold-tolerant.",
    "sourceFactIds": [
      "ALPINE-TREELINE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-041",
    "qlName": "Alpine vegetation above the tree line",
    "difficulty": "Medium",
    "stem": "Which plants are commonly found in the Himalayan alpine belt?",
    "answer": "Juniper, birch and alpine grasses",
    "distractors": [
      "Mahogany, ebony and rosewood",
      "Cactus, acacia and euphorbia",
      "Sundari and tidal mangroves"
    ],
    "explanation": "Juniper, birch and hardy grasses occur in high-altitude vegetation. They tolerate cold conditions better than tropical or desert plants.",
    "sourceFactIds": [
      "ALPINE-SPECIES"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-041",
    "qlName": "Alpine vegetation above the tree line",
    "difficulty": "Medium",
    "stem": "A Himalayan slope above the conifer belt has short shrubs and grasslands. Which zone is indicated?",
    "answer": "Alpine vegetation",
    "distractors": [
      "Tropical thorn forest",
      "Moist deciduous forest",
      "Mangrove swamp"
    ],
    "explanation": "Short shrubs and grasslands above the conifer belt are classic alpine features. The severe climate restricts tall tree growth.",
    "sourceFactIds": [
      "ALPINE-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-041",
    "qlName": "Alpine vegetation above the tree line",
    "difficulty": "Medium",
    "stem": "What happens to vegetation as one moves above the Himalayan tree line?",
    "answer": "Trees give way to shrubs, grasses and eventually very sparse plants",
    "distractors": [
      "Evergreen rainforest becomes denser",
      "Mangroves appear because altitude increases",
      "Thorn forest becomes a closed canopy"
    ],
    "explanation": "Beyond the tree line, cold and exposure become too severe for normal forest growth. Vegetation becomes progressively lower and sparser.",
    "sourceFactIds": [
      "ALPINE-TREELINE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-041",
    "qlName": "Alpine vegetation above the tree line",
    "difficulty": "Hard",
    "stem": "A high Himalayan site has adequate summer moisture but no tall forest, only low shrubs and grasses. Which factor most directly explains the absence of trees?",
    "answer": "Very low temperature and a short growing season",
    "distractors": [
      "Insufficient latitude change",
      "Excess tropical heat",
      "Tidal salinity in the soil"
    ],
    "explanation": "At great height, cold rather than simple moisture shortage becomes the limiting factor. The growing season is too short for normal forest development.",
    "sourceFactIds": [
      "ALPINE-COLD-LIMIT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-042",
    "qlName": "Alpine meadows and high-altitude use",
    "difficulty": "Easy",
    "stem": "What type of open vegetation is common in the Himalayan alpine zone during the short summer?",
    "answer": "Alpine meadows and grasslands",
    "distractors": [
      "Dense mangrove swamp",
      "Tropical thorn woodland",
      "Lowland evergreen rainforest"
    ],
    "explanation": "High-altitude summers allow grasses and herbs to grow where tall trees cannot. These open alpine meadows form above the forest belts.",
    "sourceFactIds": [
      "ALPINE-MEADOWS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-042",
    "qlName": "Alpine meadows and high-altitude use",
    "difficulty": "Easy",
    "stem": "Why do alpine meadows develop above the upper forest limit?",
    "answer": "The climate is too cold for tall trees but allows seasonal grasses and herbs",
    "distractors": [
      "The land is permanently flooded by tides",
      "Rainfall exceeds tropical rainforest levels everywhere",
      "All mountain soils are too saline for trees"
    ],
    "explanation": "Cold temperatures and a short growing season restrict forest growth. Low grasses and herbs can complete their life cycles during the brief warmer period.",
    "sourceFactIds": [
      "ALPINE-MEADOW-REASON"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-042",
    "qlName": "Alpine meadows and high-altitude use",
    "difficulty": "Medium",
    "stem": "Which vegetation form best fits a high Himalayan summer pasture above the conifer belt?",
    "answer": "Alpine grassland",
    "distractors": [
      "Tropical evergreen forest",
      "Dry deciduous forest",
      "Mangrove vegetation"
    ],
    "explanation": "High summer pastures occur in open alpine grasslands above the main forest belt. The vegetation is low because of severe high-altitude climate.",
    "sourceFactIds": [
      "ALPINE-PASTURE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-042",
    "qlName": "Alpine meadows and high-altitude use",
    "difficulty": "Medium",
    "stem": "What distinguishes an alpine meadow from a temperate conifer forest?",
    "answer": "The meadow is largely treeless and occurs at a higher elevation",
    "distractors": [
      "The meadow has a denser tree canopy",
      "The meadow is a tidal wetland",
      "The meadow is hotter and drier than thorn scrub"
    ],
    "explanation": "Alpine meadows lie above the main tree line and contain grasses and herbs rather than a closed forest canopy. Conifer forests occur lower on the mountain.",
    "sourceFactIds": [
      "ALPINE-MEADOW-VS-CONIFER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-042",
    "qlName": "Alpine meadows and high-altitude use",
    "difficulty": "Medium",
    "stem": "Why can alpine vegetation appear lush for a short period even though the climate is severe?",
    "answer": "Snowmelt and summer warmth briefly provide moisture and suitable temperatures",
    "distractors": [
      "Permanent high temperatures support year-round growth",
      "Tidal water floods the slopes each day",
      "Dry desert winds supply constant moisture"
    ],
    "explanation": "The growing season is short, but melting snow and warmer summer conditions provide a brief window for grasses and flowering herbs to grow rapidly.",
    "sourceFactIds": [
      "ALPINE-SHORT-SUMMER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-042",
    "qlName": "Alpine meadows and high-altitude use",
    "difficulty": "Hard",
    "stem": "A slope has dense conifers at 2,700 metres but open grassland at 3,800 metres. Which combined change best explains the transition?",
    "answer": "Lower temperature and a shorter growing season at the higher site",
    "distractors": [
      "Higher tropical heat and stronger evaporation",
      "Greater tidal flooding and salinity",
      "A sudden shift from mountain soil to desert sand"
    ],
    "explanation": "The higher site is colder and experiences a much shorter season suitable for growth. These conditions suppress tall forest and favour alpine grassland.",
    "sourceFactIds": [
      "ALPINE-2700-3800"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-043",
    "qlName": "Mosses, lichens and highest vegetation",
    "difficulty": "Easy",
    "stem": "Near the highest vegetated Himalayan zones, which simple plant forms become common?",
    "answer": "Mosses and lichens",
    "distractors": [
      "Teak and sal",
      "Mahogany and ebony",
      "Acacia and cactus"
    ],
    "explanation": "Near the upper limit of plant life, severe cold and thin soils restrict larger vegetation. Mosses and lichens can survive under these harsh conditions.",
    "sourceFactIds": [
      "MOSS-LICHEN"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-043",
    "qlName": "Mosses, lichens and highest vegetation",
    "difficulty": "Easy",
    "stem": "What happens to vegetation as elevation approaches the permanent snow zone?",
    "answer": "It becomes very sparse and is reduced to hardy low plants",
    "distractors": [
      "It changes into dense tropical rainforest",
      "It becomes taller and more layered",
      "It turns into mangrove forest"
    ],
    "explanation": "Conditions near the snow line are extremely cold and the growing season is very short. Only hardy low vegetation can persist.",
    "sourceFactIds": [
      "HIGHEST-SPARSE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-043",
    "qlName": "Mosses, lichens and highest vegetation",
    "difficulty": "Medium",
    "stem": "Which clue points to a site near the upper limit of Himalayan vegetation?",
    "answer": "Mosses, lichens and very sparse plant cover",
    "distractors": [
      "Dense teak forest",
      "Closed evergreen hardwood canopy",
      "Acacia scrub with cactus"
    ],
    "explanation": "Mosses and lichens tolerate severe cold and poor soils better than most trees and shrubs. Their dominance signals very high elevation.",
    "sourceFactIds": [
      "MOSS-LICHEN-CLUE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-043",
    "qlName": "Mosses, lichens and highest vegetation",
    "difficulty": "Medium",
    "stem": "Why can lichens survive where many flowering plants cannot?",
    "answer": "They tolerate severe cold and very limited soil development",
    "distractors": [
      "They require deep fertile tropical soil",
      "They depend on daily tidal flooding",
      "They need high summer temperatures all year"
    ],
    "explanation": "Lichens can grow on exposed rock and withstand cold, nutrient-poor conditions. This lets them occupy environments beyond the normal forest limit.",
    "sourceFactIds": [
      "LICHEN-HARDINESS"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-043",
    "qlName": "Mosses, lichens and highest vegetation",
    "difficulty": "Medium",
    "stem": "Which sequence is correct as elevation rises beyond the conifer belt?",
    "answer": "Alpine shrubs and grasses → sparse mosses and lichens → permanent snow",
    "distractors": [
      "Mangroves → thorn scrub → evergreen forest",
      "Deciduous forest → tidal swamp → cactus desert",
      "Evergreen forest → mangroves → alpine conifers"
    ],
    "explanation": "Vegetation becomes shorter and sparser with increasing cold. Near the highest elevations, only simple hardy plants survive before permanent snow dominates.",
    "sourceFactIds": [
      "HIGH-ALTITUDE-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-043",
    "qlName": "Mosses, lichens and highest vegetation",
    "difficulty": "Medium",
    "stem": "A site has almost no soil, severe frost and only lichens on exposed rock. Where is it most likely located?",
    "answer": "Near the upper limit of Himalayan plant life",
    "distractors": [
      "In a tropical evergreen lowland",
      "In a tidal delta",
      "In a moist deciduous plateau"
    ],
    "explanation": "The combination of exposed rock, frost and lichens indicates extreme high-altitude conditions. Larger plants cannot establish under such a short, cold growing season.",
    "sourceFactIds": [
      "LICHEN-ROCK-SCENARIO"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-044",
    "qlName": "Himalayan vegetation sequence",
    "difficulty": "Easy",
    "stem": "Which sequence best follows increasing altitude in the Himalayas?",
    "answer": "Subtropical forest → temperate forest → alpine vegetation",
    "distractors": [
      "Alpine vegetation → tropical forest → mangrove",
      "Mangrove → thorn scrub → conifer forest",
      "Thorn scrub → tidal forest → alpine meadow"
    ],
    "explanation": "As height increases, temperature falls and vegetation shifts from warmer-climate forests to temperate and then alpine forms. This is the standard altitudinal sequence.",
    "sourceFactIds": [
      "HIMALAYAN-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-044",
    "qlName": "Himalayan vegetation sequence",
    "difficulty": "Easy",
    "stem": "Which vegetation belt normally lies above temperate conifer forests?",
    "answer": "Alpine vegetation",
    "distractors": [
      "Tropical thorn forest",
      "Mangrove forest",
      "Lowland evergreen rainforest"
    ],
    "explanation": "The alpine belt begins above the upper forest zone. Its cold climate supports shrubs, grasses and later sparse mosses and lichens.",
    "sourceFactIds": [
      "ABOVE-CONIFER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-044",
    "qlName": "Himalayan vegetation sequence",
    "difficulty": "Medium",
    "stem": "A climber passes oak forest, then deodar–fir forest, then grassland. In which direction is the climber moving?",
    "answer": "Upward to higher elevations",
    "distractors": [
      "Downward toward sea level",
      "Across a tidal delta",
      "Into a hotter desert basin"
    ],
    "explanation": "Oak, conifers and alpine grassland form a typical upward sequence in the Himalayas. Each step reflects cooler conditions at greater elevation.",
    "sourceFactIds": [
      "CLIMBER-SEQUENCE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-044",
    "qlName": "Himalayan vegetation sequence",
    "difficulty": "Medium",
    "stem": "Which order places vegetation from warmer lower slopes to colder higher slopes?",
    "answer": "Broadleaf temperate → coniferous temperate → alpine grassland",
    "distractors": [
      "Alpine grassland → mangrove → thorn scrub",
      "Coniferous temperate → tropical evergreen → mangrove",
      "Thorn scrub → broadleaf temperate → tidal forest"
    ],
    "explanation": "Broadleaf temperate forests occur below much of the conifer belt, and alpine grasslands lie still higher. The sequence follows falling temperature with altitude.",
    "sourceFactIds": [
      "LOW-TO-HIGH"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-044",
    "qlName": "Himalayan vegetation sequence",
    "difficulty": "Medium",
    "stem": "What is the main exam-useful principle behind Himalayan vegetation belts?",
    "answer": "Higher altitude generally brings cooler conditions and different plant communities",
    "distractors": [
      "All mountain vegetation depends only on soil colour",
      "Rainfall has no role in mountain vegetation",
      "Every elevation has the same forest type"
    ],
    "explanation": "Altitude changes temperature and often moisture conditions, producing distinct plant communities. The principle is more important than memorising one exact boundary everywhere.",
    "sourceFactIds": [
      "HIMALAYAN-PRINCIPLE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-044",
    "qlName": "Himalayan vegetation sequence",
    "difficulty": "Medium",
    "stem": "Why should altitude limits for Himalayan vegetation be treated as approximate rather than exact everywhere?",
    "answer": "Slope, aspect, latitude and moisture modify local conditions",
    "distractors": [
      "Elevation is measured differently in each state",
      "Plants ignore temperature completely",
      "Forest belts follow administrative borders"
    ],
    "explanation": "The same elevation can have different exposure, rainfall and local temperatures. These factors shift the exact height at which one vegetation belt changes into another.",
    "sourceFactIds": [
      "ALTITUDE-APPROX"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-045",
    "qlName": "Montane integrated identification",
    "difficulty": "Easy",
    "stem": "A Himalayan forest at about 2,200 metres contains deodar and spruce. Which vegetation type fits?",
    "answer": "Temperate coniferous forest",
    "distractors": [
      "Tropical thorn scrub",
      "Mangrove forest",
      "Tropical evergreen forest"
    ],
    "explanation": "The elevation and conifer species are characteristic of the Himalayan temperate conifer belt. The other choices require dry, tidal or much warmer conditions.",
    "sourceFactIds": [
      "MONTANE-INTEGRATED-EASY"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-045",
    "qlName": "Montane integrated identification",
    "difficulty": "Easy",
    "stem": "A Himalayan site above 3,600 metres has low shrubs and grassland. Which zone is indicated?",
    "answer": "Alpine vegetation",
    "distractors": [
      "Moist deciduous forest",
      "Mangrove forest",
      "Tropical evergreen forest"
    ],
    "explanation": "Above the upper forest belt, cold conditions favour alpine shrubs and grasslands. Tall forest becomes difficult to maintain.",
    "sourceFactIds": [
      "MONTANE-INTEGRATED-ALPINE"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-045",
    "qlName": "Montane integrated identification",
    "difficulty": "Medium",
    "stem": "Which set of clues is internally consistent?",
    "answer": "1,500–3,000 m + cool climate + deodar and fir",
    "distractors": [
      "Tidal mud + deodar + alpine meadow",
      "Below 70 cm rainfall + spruce rainforest",
      "Warm delta + oak–chestnut temperate forest"
    ],
    "explanation": "The altitude, climate and conifer species in the first set fit the Himalayan temperate forest belt. The other sets combine features from incompatible environments.",
    "sourceFactIds": [
      "MONTANE-CONSISTENT"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-045",
    "qlName": "Montane integrated identification",
    "difficulty": "Medium",
    "stem": "A mountain shows oak at lower temperate levels, fir above it and alpine grassland still higher. What does this pattern demonstrate?",
    "answer": "Altitudinal zonation of natural vegetation",
    "distractors": [
      "Tidal succession",
      "Desertification by salinity",
      "River deposition"
    ],
    "explanation": "The plant communities change in an orderly vertical sequence with height. This reflects falling temperature and other climatic changes along the slope.",
    "sourceFactIds": [
      "MONTANE-ZONATION-ID"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-045",
    "qlName": "Montane integrated identification",
    "difficulty": "Medium",
    "stem": "Which change would most likely move the tree line to a lower elevation on an otherwise similar mountain slope?",
    "answer": "Colder local climatic conditions",
    "distractors": [
      "Warmer conditions with a longer growing season",
      "Reduced frost exposure",
      "Longer frost-free season"
    ],
    "explanation": "The tree line marks the upper climatic limit for sustained tree growth. Colder conditions shorten the growing season and can push that limit downslope.",
    "sourceFactIds": [
      "TREE-LINE-LOWER"
    ]
  },
  {
    "qlId": "GEO-VEG-001-QL-045",
    "qlName": "Montane integrated identification",
    "difficulty": "Medium",
    "stem": "A student identifies mangrove forest at 2,500 metres because the area is moist. What key factor makes this identification wrong?",
    "answer": "Mangroves require tidal coastal conditions, not simply moisture",
    "distractors": [
      "Mangroves occur only in deserts",
      "Conifers cannot grow in moist mountains",
      "Altitude never affects vegetation"
    ],
    "explanation": "Moisture alone does not define a vegetation type. Mangroves need saline or brackish tidal environments, while a moist Himalayan site at that height fits temperate montane vegetation.",
    "sourceFactIds": [
      "MONTANE-VS-MANGROVE"
    ]
  }
]);

export const GEO_VEG_001_CP005_REVIEW_BATCH_V1: readonly GeoVeg001Question[] = Object.freeze(
  RAW.map((raw,index)=>{const correctIndex=index%4;return Object.freeze({
    questionId:`GEO-VEG-001-CP005-Q${String(index+1).padStart(3,"0")}`,
    qlId:raw.qlId,qlName:raw.qlName,difficulty:raw.difficulty,stem:raw.stem,
    options:placeGeoVegOptions(raw.answer,raw.distractors,correctIndex),
    correctIndex,canonicalAnswer:raw.answer,explanation:raw.explanation,
    sourceIds:GEO_VEG_001_SOURCE_IDS,sourceFactIds:Object.freeze([...raw.sourceFactIds]),
    reviewOnly:true as const,runtimeRegistered:false as const,
  });})
);

const BANNED=/associated with|described as|in the context of|\bbroadly\b|\bmainly\b|sourceFact|runtimeRegistered|review-only|generator/i;
const TRIVIAL_DISTRACTOR=/currency|population census|political boundary|time zone|magnetic declination|crop price|road density|literacy|mineral price|calendar month|map projection/i;

export function auditGeoVeg001Cp005ReviewBatchV1(){
 const issues:string[]=[];const ids=new Set<string>();const stems=new Set<string>();const explanations=new Set<string>();
 const qlCounts:Record<string,number>={};const difficultyCounts:Record<GeoVeg001Difficulty,number>={Easy:0,Medium:0,Hard:0};const answerPositions=[0,0,0,0];
 for(const q of GEO_VEG_001_CP005_REVIEW_BATCH_V1){
  if(ids.has(q.questionId))issues.push("DUPLICATE_ID:"+q.questionId);ids.add(q.questionId);
  const st=q.stem.replace(/\s+/g," ").trim().toLowerCase();if(stems.has(st))issues.push("DUPLICATE_STEM:"+q.questionId);stems.add(st);
  const ex=q.explanation.replace(/\s+/g," ").trim().toLowerCase();if(explanations.has(ex))issues.push("DUPLICATE_EXPLANATION:"+q.questionId);explanations.add(ex);
  qlCounts[q.qlId]=(qlCounts[q.qlId]??0)+1;difficultyCounts[q.difficulty]+=1;answerPositions[q.correctIndex]+=1;
  if(q.options.length!==4||new Set(q.options).size!==4)issues.push("OPTIONS:"+q.questionId);
  if(q.options[q.correctIndex]!==q.canonicalAnswer)issues.push("ANSWER:"+q.questionId);
  const ds=q.options.filter((_,i)=>i!==q.correctIndex);if(ds.some(o=>TRIVIAL_DISTRACTOR.test(o)))issues.push("TRIVIAL_DISTRACTOR:"+q.questionId);
  if(!q.sourceIds.length||!q.sourceFactIds.length)issues.push("PROVENANCE:"+q.questionId);
  if(!q.reviewOnly||q.runtimeRegistered)issues.push("LIFECYCLE:"+q.questionId);
  const learner=q.stem+"\n"+q.options.join("\n")+"\n"+q.explanation;if(BANNED.test(learner))issues.push("STYLE:"+q.questionId);
  if(q.stem.length<22||q.stem.length>360||!q.stem.trim().endsWith("?"))issues.push("STEM_SHAPE:"+q.questionId);
  if(q.explanation.length<110)issues.push("SHORT_EXPLANATION:"+q.questionId);
 }
 if(GEO_VEG_001_CP005_REVIEW_BATCH_V1.length!==54)issues.push("COUNT:"+GEO_VEG_001_CP005_REVIEW_BATCH_V1.length);
 for(let n=37;n<=45;n++){const id="GEO-VEG-001-QL-"+String(n).padStart(3,"0");if(qlCounts[id]!==6)issues.push("QL_COUNT:"+id+":"+(qlCounts[id]??0));}
 if(difficultyCounts.Easy!==18||difficultyCounts.Medium!==30||difficultyCounts.Hard!==6)issues.push("DIFFICULTY:"+JSON.stringify(difficultyCounts));
 if(answerPositions.join(",")!=="14,14,13,13")issues.push("ANSWER_POSITIONS:"+answerPositions.join(","));
 if(stems.size!==54)issues.push("STEM_COUNT:"+stems.size);if(explanations.size!==54)issues.push("EXPLANATION_COUNT:"+explanations.size);
 return Object.freeze({valid:issues.length===0,issues:Object.freeze(issues),questionCount:GEO_VEG_001_CP005_REVIEW_BATCH_V1.length,stemCount:stems.size,explanationCount:explanations.size,qlCounts:Object.freeze(qlCounts),difficultyCounts:Object.freeze(difficultyCounts),answerPositions:Object.freeze(answerPositions)});
}
