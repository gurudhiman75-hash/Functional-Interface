import type { CaeCausalWorld, CaeProjectionAuthority } from "./types.ts";

const text = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa }) as const;
const node = (id: string, role: "CAUSE" | "INTERMEDIATE" | "EFFECT", temporalOrder: number, en: string, hi: string, pa: string) => ({ id, role, temporalOrder, text: text(en, hi, pa) }) as const;
const edge = (from: string, to: string, strength: "PRIMARY" | "CONTRIBUTING" = "PRIMARY") => ({ from, to, strength }) as const;

/**
 * These worlds are the source of truth. A projection may expose different
 * nodes from one world, but never creates a causal answer from prose alone.
 */
export const CAE_001_CAUSAL_WORLDS = [
  {
    id: "CAE-WORLD-AIRPORT-FOG",
    domain: "TRANSPORT",
    difficultyCeiling: "MEDIUM",
    context: text("Dense fog formed around an airport early in the morning.", "सुबह तड़के हवाई अड्डे के आसपास घना कोहरा छा गया।", "ਸਵੇਰੇ ਤੜਕੇ ਹਵਾਈ ਅੱਡੇ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਘਣੀ ਧੁੰਦ ਛਾ ਗਈ।"),
    nodes: [
      node("fog-dense", "CAUSE", 1, "Dense fog formed around the airport.", "हवाई अड्डे के आसपास घना कोहरा छा गया।", "ਹਵਾਈ ਅੱਡੇ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਘਣੀ ਧੁੰਦ ਛਾ ਗਈ।"),
      node("fog-low-visibility", "INTERMEDIATE", 2, "Visibility around the airport was sharply reduced.", "हवाई अड्डे के आसपास दृश्यता बहुत कम हो गई।", "ਹਵਾਈ ਅੱਡੇ ਦੇ ਆਲੇ-ਦੁਆਲੇ ਦ੍ਰਿਸ਼ਟਤਾ ਬਹੁਤ ਘੱਟ ਹੋ ਗਈ।"),
      node("fog-flight-cancellations", "EFFECT", 3, "Several flights from the airport were cancelled.", "हवाई अड्डे से कई उड़ानें रद्द कर दी गईं।", "ਹਵਾਈ ਅੱਡੇ ਤੋਂ ਕਈ ਉਡਾਣਾਂ ਰੱਦ ਕਰ ਦਿੱਤੀਆਂ ਗਈਆਂ।"),
      node("fog-passenger-rebooking", "EFFECT", 4, "Affected passengers were moved to later flights.", "प्रभावित यात्रियों को बाद की उड़ानों में भेजा गया।", "ਪ੍ਰਭਾਵਿਤ ਯਾਤਰੀਆਂ ਨੂੰ ਬਾਅਦ ਦੀਆਂ ਉਡਾਣਾਂ ਵਿੱਚ ਭੇਜਿਆ ਗਿਆ।"),
    ],
    edges: [edge("fog-dense", "fog-low-visibility"), edge("fog-low-visibility", "fog-flight-cancellations"), edge("fog-flight-cancellations", "fog-passenger-rebooking")],
    sourceMode: "CURATED_ORIGINAL_SCENARIO",
  },
  {
    id: "CAE-WORLD-RAINFALL-RAIL",
    domain: "WEATHER",
    difficultyCeiling: "HARD",
    context: text("Continuous heavy rainfall affected the railway area for three days.", "तीन दिनों तक लगातार तेज वर्षा ने रेलवे क्षेत्र को प्रभावित किया।", "ਤਿੰਨ ਦਿਨਾਂ ਤੱਕ ਲਗਾਤਾਰ ਤੇਜ਼ ਮੀਂਹ ਨੇ ਰੇਲਵੇ ਖੇਤਰ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕੀਤਾ।"),
    nodes: [
      node("rail-heavy-rainfall", "CAUSE", 1, "Continuous heavy rainfall occurred in the railway area.", "रेलवे क्षेत्र में लगातार तेज वर्षा हुई।", "ਰੇਲਵੇ ਖੇਤਰ ਵਿੱਚ ਲਗਾਤਾਰ ਤੇਜ਼ ਮੀਂਹ ਪਿਆ।"),
      node("rail-tracks-waterlogged", "INTERMEDIATE", 2, "Water accumulated on sections of the railway track.", "रेलवे पटरी के कुछ हिस्सों पर पानी जमा हो गया।", "ਰੇਲਵੇ ਪਟੜੀ ਦੇ ਕੁਝ ਹਿੱਸਿਆਂ ਉੱਤੇ ਪਾਣੀ ਇਕੱਠਾ ਹੋ ਗਿਆ।"),
      node("rail-train-slowed", "EFFECT", 3, "Train movement through the affected section slowed down.", "प्रभावित हिस्से से ट्रेनों की आवाजाही धीमी हो गई।", "ਪ੍ਰਭਾਵਿਤ ਹਿੱਸੇ ਵਿੱਚੋਂ ਰੇਲਾਂ ਦੀ ਆਵਾਜਾਈ ਹੌਲੀ ਹੋ ਗਈ।"),
      node("rail-trains-late", "EFFECT", 4, "Several trains arrived late.", "कई ट्रेनें देर से पहुँचीं।", "ਕਈ ਰੇਲਾਂ ਦੇਰ ਨਾਲ ਪਹੁੰਚੀਆਂ।"),
      node("rail-roads-waterlogged", "EFFECT", 2, "Nearby roads became waterlogged.", "आस-पास की सड़कें जलमग्न हो गईं।", "ਨੇੜਲੀਆਂ ਸੜਕਾਂ ਵਿੱਚ ਪਾਣੀ ਭਰ ਗਿਆ।"),
    ],
    edges: [edge("rail-heavy-rainfall", "rail-tracks-waterlogged"), edge("rail-tracks-waterlogged", "rail-train-slowed"), edge("rail-train-slowed", "rail-trains-late"), edge("rail-heavy-rainfall", "rail-roads-waterlogged")],
    sourceMode: "CURATED_ORIGINAL_SCENARIO",
  },
  {
    id: "CAE-WORLD-BRIDGE-METRO",
    domain: "INFRASTRUCTURE",
    difficultyCeiling: "HARD",
    context: text("A major bridge connecting two busy parts of a city was closed for urgent repairs.", "शहर के दो व्यस्त हिस्सों को जोड़ने वाला एक प्रमुख पुल तुरंत मरम्मत के लिए बंद कर दिया गया।", "ਸ਼ਹਿਰ ਦੇ ਦੋ ਰੁੱਝੇ ਹਿੱਸਿਆਂ ਨੂੰ ਜੋੜਨ ਵਾਲਾ ਇੱਕ ਮੁੱਖ ਪੁਲ ਤੁਰੰਤ ਮੁਰੰਮਤ ਲਈ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।"),
    nodes: [
      node("bridge-closed", "CAUSE", 1, "The bridge was closed for urgent repairs.", "पुल को तुरंत मरम्मत के लिए बंद कर दिया गया।", "ਪੁਲ ਨੂੰ ਤੁਰੰਤ ਮੁਰੰਮਤ ਲਈ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।"),
      node("bridge-traffic-diverted", "INTERMEDIATE", 2, "Traffic was diverted through nearby streets.", "यातायात को आस-पास की सड़कों से मोड़ दिया गया।", "ਆਵਾਜਾਈ ਨੂੰ ਨੇੜਲੀਆਂ ਸੜਕਾਂ ਰਾਹੀਂ ਮੋੜ ਦਿੱਤਾ ਗਿਆ।"),
      node("bridge-travel-time-increased", "EFFECT", 3, "Travel time in the area increased.", "क्षेत्र में यात्रा का समय बढ़ गया।", "ਇਲਾਕੇ ਵਿੱਚ ਯਾਤਰਾ ਦਾ ਸਮਾਂ ਵੱਧ ਗਿਆ।"),
      node("bridge-metro-use", "EFFECT", 4, "More commuters started using the metro.", "अधिक यात्रियों ने मेट्रो का उपयोग शुरू किया।", "ਵੱਧ ਯਾਤਰੀਆਂ ਨੇ ਮੈਟਰੋ ਦੀ ਵਰਤੋਂ ਸ਼ੁਰੂ ਕੀਤੀ।"),
    ],
    edges: [edge("bridge-closed", "bridge-traffic-diverted"), edge("bridge-traffic-diverted", "bridge-travel-time-increased"), edge("bridge-travel-time-increased", "bridge-metro-use")],
    sourceMode: "CURATED_ORIGINAL_SCENARIO",
  },
  {
    id: "CAE-WORLD-LANDSLIDE-SUPPLY",
    domain: "WEATHER",
    difficultyCeiling: "HARD",
    context: text("Heavy rainfall affected a hilly supply route to a town.", "तेज वर्षा ने एक कस्बे तक जाने वाले पहाड़ी आपूर्ति मार्ग को प्रभावित किया।", "ਤੇਜ਼ ਮੀਂਹ ਨੇ ਇੱਕ ਕਸਬੇ ਤੱਕ ਜਾਂਦੇ ਪਹਾੜੀ ਸਪਲਾਈ ਰਸਤੇ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕੀਤਾ।"),
    nodes: [
      node("land-heavy-rainfall", "CAUSE", 1, "Heavy rainfall continued in the hills.", "पहाड़ियों में तेज वर्षा जारी रही।", "ਪਹਾੜੀਆਂ ਵਿੱਚ ਤੇਜ਼ ਮੀਂਹ ਜਾਰੀ ਰਿਹਾ।"),
      node("land-landslide", "INTERMEDIATE", 2, "A landslide occurred along the highway.", "राजमार्ग के पास भूस्खलन हुआ।", "ਰਾਜਮਾਰਗ ਦੇ ਨੇੜੇ ਭੂਸਖਲਨ ਹੋਇਆ।"),
      node("land-highway-blocked", "INTERMEDIATE", 3, "The highway was blocked.", "राजमार्ग बंद हो गया।", "ਰਾਜਮਾਰਗ ਬੰਦ ਹੋ ਗਿਆ।"),
      node("land-supply-delayed", "INTERMEDIATE", 4, "Supply vehicles were delayed.", "आपूर्ति वाहन देर से पहुँचे।", "ਸਪਲਾਈ ਵਾਹਨ ਦੇਰ ਨਾਲ ਪਹੁੰਚੇ।"),
      node("land-vegetable-prices", "EFFECT", 5, "Vegetable prices in the town increased.", "कस्बे में सब्जियों के दाम बढ़ गए।", "ਕਸਬੇ ਵਿੱਚ ਸਬਜ਼ੀਆਂ ਦੇ ਭਾਅ ਵੱਧ ਗਏ।"),
    ],
    edges: [edge("land-heavy-rainfall", "land-landslide"), edge("land-landslide", "land-highway-blocked"), edge("land-highway-blocked", "land-supply-delayed"), edge("land-supply-delayed", "land-vegetable-prices")],
    sourceMode: "CURATED_ORIGINAL_SCENARIO",
  },
  {
    id: "CAE-WORLD-INDEPENDENT-EVENTS",
    domain: "MANUFACTURING",
    difficultyCeiling: "MEDIUM",
    context: text("The statements concern separate events in different places.", "कथन अलग-अलग स्थानों पर हुई अलग घटनाओं से संबंधित हैं।", "ਕਥਨ ਵੱਖ-ਵੱਖ ਥਾਵਾਂ ਉੱਤੇ ਹੋਈਆਂ ਵੱਖਰੀਆਂ ਘਟਨਾਵਾਂ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ।"),
    nodes: [
      node("ind-technical-fault", "CAUSE", 1, "A technical fault occurred in a factory machine.", "एक फैक्टरी मशीन में तकनीकी खराबी आ गई।", "ਇੱਕ ਫੈਕਟਰੀ ਮਸ਼ੀਨ ਵਿੱਚ ਤਕਨੀਕੀ ਖਰਾਬੀ ਆ ਗਈ।"),
      node("ind-factory-stopped", "EFFECT", 2, "Production at that factory stopped temporarily.", "उस फैक्टरी का उत्पादन अस्थायी रूप से रुक गया।", "ਉਸ ਫੈਕਟਰੀ ਦਾ ਉਤਪਾਦਨ ਅਸਥਾਈ ਤੌਰ ਤੇ ਰੁਕ ਗਿਆ।"),
      node("ind-heavy-rain", "CAUSE", 1, "Heavy rain fell near a school in another town.", "दूसरे कस्बे के एक स्कूल के पास तेज वर्षा हुई।", "ਦੂਜੇ ਕਸਬੇ ਦੇ ਇੱਕ ਸਕੂਲ ਨੇੜੇ ਤੇਜ਼ ਮੀਂਹ ਪਿਆ।"),
      node("ind-school-closed", "EFFECT", 2, "That school was closed for the day.", "वह स्कूल उस दिन के लिए बंद कर दिया गया।", "ਉਹ ਸਕੂਲ ਉਸ ਦਿਨ ਲਈ ਬੰਦ ਕਰ ਦਿੱਤਾ ਗਿਆ।"),
    ],
    edges: [edge("ind-technical-fault", "ind-factory-stopped"), edge("ind-heavy-rain", "ind-school-closed")],
    sourceMode: "CURATED_ORIGINAL_SCENARIO",
  },
  {
    id: "CAE-WORLD-HEATWAVE-DEMAND",
    domain: "UTILITIES",
    difficultyCeiling: "MEDIUM",
    context: text("A prolonged heatwave affected the town for several days.", "कई दिनों तक कस्बा भीषण गर्मी की लहर से प्रभावित रहा।", "ਕਈ ਦਿਨਾਂ ਤੱਕ ਕਸਬਾ ਭਿਆਨਕ ਗਰਮੀ ਦੀ ਲਹਿਰ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਰਿਹਾ।"),
    nodes: [
      node("heat-heatwave", "CAUSE", 1, "A prolonged heatwave affected the town.", "कस्बा लंबे समय तक गर्मी की लहर से प्रभावित रहा।", "ਕਸਬਾ ਲੰਬੇ ਸਮੇਂ ਤੱਕ ਗਰਮੀ ਦੀ ਲਹਿਰ ਨਾਲ ਪ੍ਰਭਾਵਿਤ ਰਿਹਾ।"),
      node("heat-water-demand", "EFFECT", 2, "Water consumption in the town rose sharply.", "कस्बे में पानी की खपत बहुत बढ़ गई।", "ਕਸਬੇ ਵਿੱਚ ਪਾਣੀ ਦੀ ਖਪਤ ਕਾਫ਼ੀ ਵੱਧ ਗਈ।"),
      node("heat-electricity-demand", "EFFECT", 2, "Demand for electricity rose sharply.", "बिजली की माँग बहुत बढ़ गई।", "ਬਿਜਲੀ ਦੀ ਮੰਗ ਕਾਫ਼ੀ ਵੱਧ ਗਈ।"),
    ],
    edges: [edge("heat-heatwave", "heat-water-demand"), edge("heat-heatwave", "heat-electricity-demand")],
    sourceMode: "CURATED_ORIGINAL_SCENARIO",
  },
  {
    id: "CAE-WORLD-COINCIDENCE",
    domain: "EDUCATION",
    difficultyCeiling: "MEDIUM",
    context: text("Both observations were reported during June, but no shared event is stated.", "दोनों अवलोकन जून में बताए गए, पर कोई साझा घटना नहीं दी गई है।", "ਦੋਵੇਂ ਨਿਰੀਖਣ ਜੂਨ ਵਿੱਚ ਦੱਸੇ ਗਏ, ਪਰ ਕੋਈ ਸਾਂਝੀ ਘਟਨਾ ਨਹੀਂ ਦਿੱਤੀ ਗਈ।"),
    nodes: [
      node("corr-seasonal-rain", "CAUSE", 1, "Seasonal rain began in the city.", "शहर में मौसमी वर्षा शुरू हुई।", "ਸ਼ਹਿਰ ਵਿੱਚ ਮੌਸਮੀ ਮੀਂਹ ਸ਼ੁਰੂ ਹੋਇਆ।"),
      node("corr-umbrella-sales", "EFFECT", 2, "Sales of umbrellas increased.", "छतरियों की बिक्री बढ़ गई।", "ਛਤਰੀਆਂ ਦੀ ਵਿਕਰੀ ਵੱਧ ਗਈ।"),
      node("corr-admission-results", "CAUSE", 1, "Engineering college admission results were announced.", "इंजीनियरिंग कॉलेज प्रवेश के परिणाम घोषित किए गए।", "ਇੰਜੀਨੀਅਰਿੰਗ ਕਾਲਜ ਦਾਖਲੇ ਦੇ ਨਤੀਜੇ ਘੋਸ਼ਿਤ ਕੀਤੇ ਗਏ।"),
      node("corr-admission-count", "EFFECT", 2, "Admissions to engineering colleges increased.", "इंजीनियरिंग कॉलेजों में प्रवेश बढ़ गए।", "ਇੰਜੀਨੀਅਰਿੰਗ ਕਾਲਜਾਂ ਵਿੱਚ ਦਾਖਲੇ ਵੱਧ ਗਏ।"),
    ],
    edges: [edge("corr-seasonal-rain", "corr-umbrella-sales"), edge("corr-admission-results", "corr-admission-count")],
    sourceMode: "CURATED_ORIGINAL_SCENARIO",
  },
] as const satisfies readonly CaeCausalWorld[];

/** Each projection selects a different learner task from a canonical world. */
export const CAE_001_PROJECTION_AUTHORITIES = [
  { id: "CAE-PROJ-001-FOG-DIRECT", checkpointId: "CAE-CP-001", qlId: "CAE-QL-001", kind: "DIRECT_RELATIONSHIP", worldId: "CAE-WORLD-AIRPORT-FOG", difficulty: "EASY", displayedNodeIds: ["fog-low-visibility", "fog-flight-cancellations"], expectedRelationship: "FIRST_DIRECT_CAUSES_SECOND" },
  { id: "CAE-PROJ-002-RAIL-REVERSE", checkpointId: "CAE-CP-001", qlId: "CAE-QL-001", kind: "DIRECT_RELATIONSHIP", worldId: "CAE-WORLD-RAINFALL-RAIL", difficulty: "MEDIUM", displayedNodeIds: ["rail-trains-late", "rail-train-slowed"], expectedRelationship: "SECOND_DIRECT_CAUSES_FIRST" },
  { id: "CAE-PROJ-003-HEAT-COMMON", checkpointId: "CAE-CP-002", qlId: "CAE-QL-002", kind: "COMMON_OR_INDEPENDENT", worldId: "CAE-WORLD-HEATWAVE-DEMAND", difficulty: "MEDIUM", displayedNodeIds: ["heat-water-demand", "heat-electricity-demand"], expectedRelationship: "COMMON_CAUSE" },
  { id: "CAE-PROJ-004-INDEPENDENT-CAUSES", checkpointId: "CAE-CP-002", qlId: "CAE-QL-002", kind: "COMMON_OR_INDEPENDENT", worldId: "CAE-WORLD-INDEPENDENT-EVENTS", difficulty: "MEDIUM", displayedNodeIds: ["ind-technical-fault", "ind-heavy-rain"], expectedRelationship: "INDEPENDENT_CAUSES" },
  { id: "CAE-PROJ-005-INDEPENDENT-EFFECTS", checkpointId: "CAE-CP-002", qlId: "CAE-QL-002", kind: "COMMON_OR_INDEPENDENT", worldId: "CAE-WORLD-INDEPENDENT-EVENTS", difficulty: "MEDIUM", displayedNodeIds: ["ind-factory-stopped", "ind-school-closed"], expectedRelationship: "INDEPENDENT_EFFECTS" },
  { id: "CAE-PROJ-006-PROBABLE-CAUSE", checkpointId: "CAE-CP-003", qlId: "CAE-QL-003", kind: "PROBABLE_CAUSE", worldId: "CAE-WORLD-RAINFALL-RAIL", difficulty: "MEDIUM", displayedNodeIds: [], targetNodeId: "rail-train-slowed", correctNodeId: "rail-tracks-waterlogged", candidateNodeIds: ["rail-tracks-waterlogged", "rail-roads-waterlogged", "rail-trains-late", "bridge-closed"], distractorRoles: { "rail-roads-waterlogged": "WEAK_CAUSE", "rail-trains-late": "REVERSE_CAUSATION", "bridge-closed": "UNRELATED_EVENT" } },
  { id: "CAE-PROJ-007-PROBABLE-EFFECT", checkpointId: "CAE-CP-004", qlId: "CAE-QL-004", kind: "PROBABLE_EFFECT", worldId: "CAE-WORLD-RAINFALL-RAIL", difficulty: "MEDIUM", displayedNodeIds: [], targetNodeId: "rail-heavy-rainfall", correctNodeId: "rail-tracks-waterlogged", candidateNodeIds: ["rail-tracks-waterlogged", "rail-trains-late", "bridge-metro-use", "ind-school-closed"], distractorRoles: { "rail-trains-late": "INDIRECTNESS_CONFUSION", "bridge-metro-use": "UNRELATED_EVENT", "ind-school-closed": "WRONG_SCOPE" } },
  { id: "CAE-PROJ-008-COMPETING-EXPLANATION", checkpointId: "CAE-CP-005", qlId: "CAE-QL-005", kind: "COMPETING_EXPLANATION", worldId: "CAE-WORLD-BRIDGE-METRO", difficulty: "HARD", displayedNodeIds: [], targetNodeId: "bridge-metro-use", correctNodeId: "bridge-closed", candidateNodeIds: ["bridge-closed", "rail-roads-waterlogged", "ind-technical-fault", "corr-admission-results"], distractorRoles: { "rail-roads-waterlogged": "WEAK_CAUSE", "ind-technical-fault": "UNRELATED_EVENT", "corr-admission-results": "UNRELATED_EVENT" } },
  { id: "CAE-PROJ-009-INDIRECT-CHAIN", checkpointId: "CAE-CP-006", qlId: "CAE-QL-006", kind: "INDIRECT_CAUSAL_CHAIN", worldId: "CAE-WORLD-LANDSLIDE-SUPPLY", difficulty: "HARD", displayedNodeIds: ["land-heavy-rainfall", "land-vegetable-prices"], expectedRelationship: "INDIRECT_FIRST_CAUSES_SECOND" },
  { id: "CAE-PROJ-010-CORRELATION", checkpointId: "CAE-CP-007", qlId: "CAE-QL-007", kind: "CORRELATION_CHECK", worldId: "CAE-WORLD-COINCIDENCE", difficulty: "MEDIUM", displayedNodeIds: ["corr-umbrella-sales", "corr-admission-count"], expectedRelationship: "INDEPENDENT_EFFECTS" },
  { id: "CAE-PROJ-011-MULTI-SEQUENCE", checkpointId: "CAE-CP-008", qlId: "CAE-QL-008", kind: "MULTI_EVENT_SEQUENCE", worldId: "CAE-WORLD-BRIDGE-METRO", difficulty: "HARD", displayedNodeIds: ["bridge-closed", "bridge-traffic-diverted", "bridge-travel-time-increased", "bridge-metro-use"], sequenceNodeIds: ["bridge-closed", "bridge-traffic-diverted", "bridge-travel-time-increased", "bridge-metro-use"] },
  { id: "CAE-PROJ-012-MISSING-LINK", checkpointId: "CAE-CP-009", qlId: "CAE-QL-009", kind: "MISSING_CAUSAL_LINK", worldId: "CAE-WORLD-RAINFALL-RAIL", difficulty: "HARD", displayedNodeIds: ["rail-heavy-rainfall", "rail-train-slowed"], targetNodeId: "rail-train-slowed", missingLinkNodeId: "rail-tracks-waterlogged", candidateNodeIds: ["rail-tracks-waterlogged", "rail-roads-waterlogged", "rail-trains-late", "fog-low-visibility"], distractorRoles: { "rail-roads-waterlogged": "WRONG_SCOPE", "rail-trains-late": "TEMPORAL_VIOLATION", "fog-low-visibility": "UNRELATED_EVENT" } },
] as const satisfies readonly CaeProjectionAuthority[];
