export type GeoCli001Cp009Difficulty = "Easy" | "Medium" | "Hard";

export interface GeoCli001Cp009Question {
  questionId: string;
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp009Difficulty;
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
  reviewOnly: true;
  runtimeRegistered: false;
}

const NCERT = "NCERT-INDIA-PHYSICAL-ENVIRONMENT-CLIMATE";
const IMD = "IMD-ENSO-MONSOON-STATIC";

interface RawQuestion {
  qlId: string;
  qlName: string;
  difficulty: GeoCli001Cp009Difficulty;
  stem: string;
  answer: string;
  distractors: readonly [string, string, string];
  explanation: string;
  sourceIds: readonly string[];
  sourceFactIds: readonly string[];
}

function placeOptions(answer: string, distractors: readonly string[], correctIndex: number): string[] {
  const options = [...distractors];
  options.splice(correctIndex, 0, answer);
  return options;
}

const RAW: readonly RawQuestion[] = Object.freeze([
  // QL073 — western disturbances: origin and route
  { qlId: "GEO-CLI-001-QL-073", qlName: "Western disturbances: origin and route", difficulty: "Easy", stem: "Western disturbances affecting India mainly originate near which region?", answer: "The eastern Mediterranean region", distractors: ["The South China Sea", "The central Indian Ocean", "The Bay of Bengal"], explanation: "Western disturbances are temperate weather systems that approach India from the west after developing around the eastern Mediterranean region.", sourceIds: [NCERT], sourceFactIds: ["WD-ORIGIN-EAST-MEDITERRANEAN"] },
  { qlId: "GEO-CLI-001-QL-073", qlName: "Western disturbances: origin and route", difficulty: "Easy", stem: "Which route best describes western disturbances before they reach northwestern India?", answer: "Mediterranean region → West Asia → Iran-Afghanistan-Pakistan → northwestern India", distractors: ["Bay of Bengal → Myanmar → Assam → Punjab", "Arabian Sea → Sri Lanka → Deccan → Rajasthan", "Tibetan Plateau → Nepal → central India → Gujarat"], explanation: "These systems travel eastward from the Mediterranean region across West Asia, Iran, Afghanistan and Pakistan before entering northwestern India.", sourceIds: [NCERT], sourceFactIds: ["WD-ORIGIN-EAST-MEDITERRANEAN", "WD-EASTWARD-ROUTE"] },
  { qlId: "GEO-CLI-001-QL-073", qlName: "Western disturbances: origin and route", difficulty: "Medium", stem: "Western disturbances generally enter India from which side of the country?", answer: "The west and northwest", distractors: ["The southeast coast", "The northeastern hills", "The southern tip"], explanation: "Their path is eastward from West Asia through Pakistan, so they normally enter India from the western or northwestern side.", sourceIds: [NCERT], sourceFactIds: ["WD-EASTWARD-ROUTE"] },
  { qlId: "GEO-CLI-001-QL-073", qlName: "Western disturbances: origin and route", difficulty: "Medium", stem: "While moving toward India, western disturbances may gain extra moisture from which waters?", answer: "The Caspian Sea and the Persian Gulf", distractors: ["The Red Sea and Lake Baikal", "The South China Sea and Yellow Sea", "The Java Sea and Timor Sea"], explanation: "On their eastward journey, western disturbances can gain additional moisture from the Caspian Sea to the north and the Persian Gulf to the south.", sourceIds: [NCERT], sourceFactIds: ["WD-MOISTURE-CASPIAN-PERSIAN"] },
  { qlId: "GEO-CLI-001-QL-073", qlName: "Western disturbances: origin and route", difficulty: "Medium", stem: "A winter cyclone reaches India after crossing Iran, Afghanistan and Pakistan. What is it most likely to be?", answer: "A western disturbance", distractors: ["A tropical easterly wave", "A northeast monsoon depression", "A pre-monsoon thunderstorm"], explanation: "A winter system following this west-to-east route into northwestern India matches the normal path of a western disturbance.", sourceIds: [NCERT], sourceFactIds: ["WD-EASTWARD-ROUTE"] },
  { qlId: "GEO-CLI-001-QL-073", qlName: "Western disturbances: origin and route", difficulty: "Hard", stem: "Consider these statements about western disturbances:\nI. They approach India from the west.\nII. Many originate around the eastern Mediterranean.\nIII. They can gain moisture from the Caspian Sea and Persian Gulf.\nWhich statements are correct?", answer: "I, II and III", distractors: ["I and II only", "II and III only", "I and III only"], explanation: "All three statements match the usual origin and route of western disturbances that affect northwestern India during winter.", sourceIds: [NCERT], sourceFactIds: ["WD-ORIGIN-EAST-MEDITERRANEAN", "WD-EASTWARD-ROUTE", "WD-MOISTURE-CASPIAN-PERSIAN"] },

  // QL074 — winter rain and rabi
  { qlId: "GEO-CLI-001-QL-074", qlName: "Western disturbances: winter rain and rabi crops", difficulty: "Easy", stem: "Western disturbances bring most of their winter rain to which part of India?", answer: "Northwestern India", distractors: ["The Malabar coast", "The Coromandel coast", "The eastern Deccan"], explanation: "Western disturbances mainly affect northwestern India, where they interrupt the otherwise dry winter weather with light rainfall.", sourceIds: [NCERT], sourceFactIds: ["WD-NW-INDIA-WINTER-RAIN"] },
  { qlId: "GEO-CLI-001-QL-074", qlName: "Western disturbances: winter rain and rabi crops", difficulty: "Easy", stem: "Which crop season benefits greatly from winter rain brought by western disturbances?", answer: "Rabi season", distractors: ["Kharif season only", "Zaid season only", "Plantation season"], explanation: "The winter rainfall is usually small in amount, but it supplies useful soil moisture to rabi crops such as wheat.", sourceIds: [NCERT], sourceFactIds: ["WD-RABI-BENEFIT"] },
  { qlId: "GEO-CLI-001-QL-074", qlName: "Western disturbances: winter rain and rabi crops", difficulty: "Medium", stem: "Which group commonly receives winter rain from western disturbances?", answer: "Punjab, Haryana, Delhi and western Uttar Pradesh", distractors: ["Tamil Nadu, Kerala, coastal Karnataka and Goa", "Assam, Meghalaya, Nagaland and Mizoram", "Odisha, coastal Andhra Pradesh, Telangana and Chhattisgarh"], explanation: "The main plains affected by western disturbances include Punjab, Haryana, Delhi and western Uttar Pradesh in northwestern India.", sourceIds: [NCERT], sourceFactIds: ["WD-NW-INDIA-WINTER-RAIN"] },
  { qlId: "GEO-CLI-001-QL-074", qlName: "Western disturbances: winter rain and rabi crops", difficulty: "Medium", stem: "Why is the small amount of winter rain from western disturbances important in northwestern India?", answer: "It provides useful moisture for rabi crops", distractors: ["It starts the southwest monsoon", "It ends the retreating monsoon", "It creates the summer heat low"], explanation: "Although the rainfall is usually modest, it is agriculturally valuable because rabi crops grow during the cool season and need moisture.", sourceIds: [NCERT], sourceFactIds: ["WD-RABI-BENEFIT"] },
  { qlId: "GEO-CLI-001-QL-074", qlName: "Western disturbances: winter rain and rabi crops", difficulty: "Medium", stem: "A light winter shower over Punjab after several dry days is most likely linked to which system?", answer: "A western disturbance", distractors: ["The southwest monsoon branch", "A tropical cyclone from the Andaman Sea", "A local mango shower"], explanation: "Punjab is usually dry in winter, but western disturbances periodically bring light rain to the northwestern plains.", sourceIds: [NCERT], sourceFactIds: ["WD-NW-INDIA-WINTER-RAIN"] },
  { qlId: "GEO-CLI-001-QL-074", qlName: "Western disturbances: winter rain and rabi crops", difficulty: "Hard", stem: "Consider these statements:\nI. Western disturbances can bring winter rain to northwestern India.\nII. This rain is often useful for rabi crops.\nIII. The rainfall is usually very heavy across all of India.\nWhich statements are correct?", answer: "I and II only", distractors: ["I only", "II and III only", "I, II and III"], explanation: "Western disturbances can give useful winter rain to the northwest, but this rain is generally limited rather than very heavy across the whole country.", sourceIds: [NCERT], sourceFactIds: ["WD-NW-INDIA-WINTER-RAIN", "WD-RABI-BENEFIT"] },

  // QL075 — Himalayan snowfall
  { qlId: "GEO-CLI-001-QL-075", qlName: "Western disturbances: Himalayan snowfall", difficulty: "Easy", stem: "In the Himalayas, western disturbances often produce which form of winter precipitation?", answer: "Snowfall", distractors: ["Only drizzle", "Hail throughout the year", "Monsoon cloudbursts"], explanation: "At colder Himalayan elevations, precipitation from western disturbances commonly falls as snow rather than rain during winter.", sourceIds: [NCERT], sourceFactIds: ["WD-HIMALAYAN-SNOW"] },
  { qlId: "GEO-CLI-001-QL-075", qlName: "Western disturbances: Himalayan snowfall", difficulty: "Easy", stem: "Winter snowfall from western disturbances helps sustain Himalayan rivers mainly during which later season?", answer: "Summer", distractors: ["Autumn only", "Early winter only", "The retreating monsoon only"], explanation: "Snow stored in the Himalayas during winter melts later and helps maintain river flow during the warmer summer months.", sourceIds: [NCERT], sourceFactIds: ["WD-HIMALAYAN-SNOW", "WD-SNOW-SUSTAINS-RIVERS"] },
  { qlId: "GEO-CLI-001-QL-075", qlName: "Western disturbances: Himalayan snowfall", difficulty: "Medium", stem: "Why can the same western disturbance cause rain in the plains but snow in the Himalayas?", answer: "Higher Himalayan elevations are much colder", distractors: ["The Himalayas receive no moisture", "Plains are always below freezing", "Snow forms only near the sea"], explanation: "Temperature falls with elevation, so a moisture-bearing winter system may produce rain over lower plains and snow over colder mountain areas.", sourceIds: [NCERT], sourceFactIds: ["WD-HIMALAYAN-SNOW"] },
  { qlId: "GEO-CLI-001-QL-075", qlName: "Western disturbances: Himalayan snowfall", difficulty: "Medium", stem: "Which sequence correctly links western disturbances with Himalayan river flow?", answer: "Winter disturbance → snowfall → later snowmelt → summer river flow", distractors: ["Winter disturbance → heat wave → glacier growth → drought", "Summer monsoon → winter snowfall → autumn cyclone → river freeze", "Western disturbance → coastal cyclone → desert rain → tidal flow"], explanation: "Western disturbances add winter snow to the Himalayas, and later melting of this snow supports river flow during summer.", sourceIds: [NCERT], sourceFactIds: ["WD-HIMALAYAN-SNOW", "WD-SNOW-SUSTAINS-RIVERS"] },
  { qlId: "GEO-CLI-001-QL-075", qlName: "Western disturbances: Himalayan snowfall", difficulty: "Medium", stem: "A western disturbance passes across northern India. Where is snowfall most likely?", answer: "The Himalayan region", distractors: ["The Thar Desert plains", "The Konkan coast", "The coastal plains of Odisha"], explanation: "The Himalayan region is cold enough in winter for precipitation from western disturbances to fall as snow at many elevations.", sourceIds: [NCERT], sourceFactIds: ["WD-HIMALAYAN-SNOW"] },
  { qlId: "GEO-CLI-001-QL-075", qlName: "Western disturbances: Himalayan snowfall", difficulty: "Hard", stem: "Consider these statements about western-disturbance precipitation:\nI. It may fall as rain over northwestern plains.\nII. It may fall as snow in the Himalayas.\nIII. Himalayan snow can support river flow in summer.\nWhich statements are correct?", answer: "I, II and III", distractors: ["I and II only", "II and III only", "I and III only"], explanation: "All three are linked effects of western disturbances: plains can receive rain, mountains can receive snow, and later snowmelt helps feed Himalayan rivers.", sourceIds: [NCERT], sourceFactIds: ["WD-NW-INDIA-WINTER-RAIN", "WD-HIMALAYAN-SNOW", "WD-SNOW-SUSTAINS-RIVERS"] },

  // QL076 — westerly jet and WD steering
  { qlId: "GEO-CLI-001-QL-076", qlName: "Westerly jet and western disturbances", difficulty: "Easy", stem: "Which upper-air current helps steer western disturbances toward India in winter?", answer: "The westerly jet stream", distractors: ["The tropical easterly jet", "The Somali low-level jet only", "The northeast trade wind at the surface"], explanation: "The winter westerly jet stream in the upper atmosphere helps guide western disturbances eastward toward the Indian region.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-STEERS-WD"] },
  { qlId: "GEO-CLI-001-QL-076", qlName: "Westerly jet and western disturbances", difficulty: "Easy", stem: "During winter, the westerly jet lies mainly on which side of the Himalayas over India?", answer: "South of the Himalayas", distractors: ["Far south of Sri Lanka", "Only over the Bay of Bengal", "Only north of the Arctic Circle"], explanation: "In winter the westerly jet occupies a position over the north Indian plain, south of the Himalayas.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WINTER-POSITION"] },
  { qlId: "GEO-CLI-001-QL-076", qlName: "Westerly jet and western disturbances", difficulty: "Medium", stem: "Why are western disturbances and the westerly jet often studied together?", answer: "The jet helps steer these disturbances eastward", distractors: ["The jet creates ocean tides", "The disturbances permanently reverse the jet", "Both are surface sea breezes"], explanation: "Western disturbances travel within the broader westerly upper-air flow, and the jet helps guide their movement toward northern India.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-STEERS-WD"] },
  { qlId: "GEO-CLI-001-QL-076", qlName: "Westerly jet and western disturbances", difficulty: "Medium", stem: "A winter upper-air map shows a strong westerly current south of the Himalayas. Which weather system may it help guide?", answer: "Western disturbances", distractors: ["Retreating-monsoon cyclones", "Mango showers", "Loo winds"], explanation: "A strong winter westerly jet south of the Himalayas is linked with the eastward movement of western disturbances into northern India.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WINTER-POSITION", "WESTERLY-JET-STEERS-WD"] },
  { qlId: "GEO-CLI-001-QL-076", qlName: "Westerly jet and western disturbances", difficulty: "Medium", stem: "Which pair is correctly matched for the Indian winter?", answer: "Westerly jet — steering of western disturbances", distractors: ["Easterly jet — steering of Mediterranean winter cyclones", "Loo — Himalayan snowfall", "Sea breeze — rabi rainfall over Punjab"], explanation: "The westerly jet is the relevant upper-air flow for the eastward passage of western disturbances affecting northern India in winter.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-STEERS-WD"] },
  { qlId: "GEO-CLI-001-QL-076", qlName: "Westerly jet and western disturbances", difficulty: "Hard", stem: "Consider these statements:\nI. The westerly jet lies south of the Himalayas in winter.\nII. It helps guide western disturbances.\nIII. It is the main surface wind of the northeast monsoon.\nWhich statements are correct?", answer: "I and II only", distractors: ["I only", "II and III only", "I, II and III"], explanation: "The first two statements are correct. The westerly jet is an upper-air current, not the main surface wind of the northeast monsoon.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WINTER-POSITION", "WESTERLY-JET-STEERS-WD"] },

  // QL077 — seasonal westerly-jet shift
  { qlId: "GEO-CLI-001-QL-077", qlName: "Seasonal shift of the westerly jet", difficulty: "Easy", stem: "What happens to the westerly jet over north India before the summer monsoon becomes established?", answer: "It withdraws from south of the Himalayas", distractors: ["It strengthens over the same winter position", "It becomes a surface sea breeze", "It shifts to the equator and stops"], explanation: "Before the summer monsoon develops fully, the westerly jet withdraws from its winter position south of the Himalayas.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WITHDRAWAL"] },
  { qlId: "GEO-CLI-001-QL-077", qlName: "Seasonal shift of the westerly jet", difficulty: "Easy", stem: "The withdrawal of the westerly jet from north India is linked with the seasonal shift of which zone?", answer: "The ITCZ", distractors: ["The polar ice edge", "The subtropical ocean gyre", "The local land-sea breeze front"], explanation: "The seasonal northward shift of the ITCZ and withdrawal of the westerly jet are both parts of the atmospheric reorganisation before the monsoon.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WITHDRAWAL", "ITCZ-JET-SEASONAL-LINK"] },
  { qlId: "GEO-CLI-001-QL-077", qlName: "Seasonal shift of the westerly jet", difficulty: "Medium", stem: "Which change marks the transition from the winter upper-air pattern toward the summer monsoon pattern?", answer: "Withdrawal of the westerly jet from south of the Himalayas", distractors: ["Permanent strengthening of winter high pressure", "Expansion of winter fog over all India", "Southward movement of the ITCZ into July"], explanation: "The winter westerly jet must withdraw from its position south of the Himalayas as the summer circulation pattern takes over.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WITHDRAWAL"] },
  { qlId: "GEO-CLI-001-QL-077", qlName: "Seasonal shift of the westerly jet", difficulty: "Medium", stem: "Why is the seasonal movement of the westerly jet important for the Indian monsoon?", answer: "Its withdrawal is part of the circulation change that allows the summer monsoon pattern to develop", distractors: ["It directly heats the Arabian Sea surface", "It creates all monsoon rainfall by itself", "It prevents the ITCZ from moving north"], explanation: "The jet's withdrawal accompanies the northward shift of the tropical circulation and helps mark the change from winter to monsoon conditions.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WITHDRAWAL", "ITCZ-JET-SEASONAL-LINK"] },
  { qlId: "GEO-CLI-001-QL-077", qlName: "Seasonal shift of the westerly jet", difficulty: "Medium", stem: "Which event normally comes before the tropical easterly jet is established over India?", answer: "Withdrawal of the westerly jet from the region", distractors: ["The retreat of the northeast monsoon from Tamil Nadu", "The arrival of western disturbances in January", "Formation of winter frost over Punjab"], explanation: "The easterly jet becomes established only after the westerly jet has withdrawn from its winter position over northern India.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WITHDRAWAL", "EASTERLY-JET-AFTER-WESTERLY"] },
  { qlId: "GEO-CLI-001-QL-077", qlName: "Seasonal shift of the westerly jet", difficulty: "Hard", stem: "Consider these statements:\nI. The westerly jet has a winter position south of the Himalayas.\nII. It withdraws as summer monsoon circulation develops.\nIII. The easterly jet sets in before this withdrawal.\nWhich statements are correct?", answer: "I and II only", distractors: ["I only", "II and III only", "I, II and III"], explanation: "The winter position and later withdrawal are correct. The easterly jet sets in after, not before, the westerly jet withdraws.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WINTER-POSITION", "WESTERLY-JET-WITHDRAWAL", "EASTERLY-JET-AFTER-WESTERLY"] },

  // QL078 — tropical easterly jet
  { qlId: "GEO-CLI-001-QL-078", qlName: "Tropical easterly jet and monsoon burst", difficulty: "Easy", stem: "Which upper-air current is linked with the burst of the southwest monsoon over India?", answer: "The tropical easterly jet", distractors: ["The winter westerly jet", "The polar night jet only", "The local valley breeze"], explanation: "The tropical easterly jet becomes established in the summer circulation and is linked with the burst of the southwest monsoon over India.", sourceIds: [NCERT], sourceFactIds: ["EASTERLY-JET-MONSOON-BURST"] },
  { qlId: "GEO-CLI-001-QL-078", qlName: "Tropical easterly jet and monsoon burst", difficulty: "Easy", stem: "The tropical easterly jet sets in over India roughly along which latitude?", answer: "15°N", distractors: ["45°N", "60°N", "5°S"], explanation: "The easterly jet is described as setting in near 15°N after the westerly jet has withdrawn from the region.", sourceIds: [NCERT], sourceFactIds: ["EASTERLY-JET-15N"] },
  { qlId: "GEO-CLI-001-QL-078", qlName: "Tropical easterly jet and monsoon burst", difficulty: "Medium", stem: "When does the tropical easterly jet become established over India?", answer: "After the westerly jet withdraws", distractors: ["Before the winter westerly jet arrives", "Only during the retreating monsoon", "Only after the northeast monsoon ends in January"], explanation: "The seasonal sequence places the easterly jet after the withdrawal of the westerly jet from its winter position.", sourceIds: [NCERT], sourceFactIds: ["EASTERLY-JET-AFTER-WESTERLY"] },
  { qlId: "GEO-CLI-001-QL-078", qlName: "Tropical easterly jet and monsoon burst", difficulty: "Medium", stem: "Which sequence best matches the upper-air change linked with monsoon onset?", answer: "Westerly jet withdraws → easterly jet sets in → monsoon burst", distractors: ["Easterly jet ends → westerly jet strengthens → monsoon begins", "Western disturbance arrives → easterly jet disappears → monsoon bursts", "Westerly jet remains fixed → ITCZ moves south → monsoon begins"], explanation: "The sequence is withdrawal of the winter westerly jet, establishment of the easterly jet and development of monsoon conditions.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WITHDRAWAL", "EASTERLY-JET-AFTER-WESTERLY", "EASTERLY-JET-MONSOON-BURST"] },
  { qlId: "GEO-CLI-001-QL-078", qlName: "Tropical easterly jet and monsoon burst", difficulty: "Medium", stem: "An easterly upper-air current appears near 15°N after the winter jet withdraws. What seasonal change does this indicate?", answer: "The onset phase of the southwest monsoon", distractors: ["The peak of the cold weather season", "The retreat of the monsoon from Rajasthan", "The arrival of western disturbances"], explanation: "An easterly jet near 15°N after westerly-jet withdrawal is a characteristic upper-air feature linked with the monsoon onset phase.", sourceIds: [NCERT], sourceFactIds: ["EASTERLY-JET-15N", "EASTERLY-JET-MONSOON-BURST"] },
  { qlId: "GEO-CLI-001-QL-078", qlName: "Tropical easterly jet and monsoon burst", difficulty: "Hard", stem: "Consider these statements about the tropical easterly jet:\nI. It appears after the westerly jet withdraws.\nII. It is found near 15°N.\nIII. It is linked with the burst of the monsoon.\nWhich statements are correct?", answer: "I, II and III", distractors: ["I and II only", "II and III only", "I and III only"], explanation: "All three statements describe the seasonal tropical easterly jet that develops over India during the monsoon onset period.", sourceIds: [NCERT], sourceFactIds: ["EASTERLY-JET-AFTER-WESTERLY", "EASTERLY-JET-15N", "EASTERLY-JET-MONSOON-BURST"] },

  // QL079 — Southern Oscillation
  { qlId: "GEO-CLI-001-QL-079", qlName: "Southern Oscillation basics", difficulty: "Easy", stem: "The Southern Oscillation is commonly tracked using pressure differences between which two places?", answer: "Tahiti and Darwin", distractors: ["Delhi and Mumbai", "Peru and Sri Lanka", "Tokyo and Singapore"], explanation: "A standard measure of the Southern Oscillation uses the sea-level pressure difference between Tahiti in the Pacific and Darwin in northern Australia.", sourceIds: [NCERT], sourceFactIds: ["SO-TAHITI-DARWIN"] },
  { qlId: "GEO-CLI-001-QL-079", qlName: "Southern Oscillation basics", difficulty: "Easy", stem: "Darwin, used in measuring the Southern Oscillation, is located in which country?", answer: "Australia", distractors: ["Peru", "India", "South Africa"], explanation: "Darwin is in northern Australia and is one of the two reference locations used with Tahiti for the Southern Oscillation pressure difference.", sourceIds: [NCERT], sourceFactIds: ["SO-TAHITI-DARWIN"] },
  { qlId: "GEO-CLI-001-QL-079", qlName: "Southern Oscillation basics", difficulty: "Medium", stem: "What atmospheric quantity is compared between Tahiti and Darwin for the Southern Oscillation?", answer: "Air pressure", distractors: ["Annual snowfall", "River discharge", "Soil moisture"], explanation: "The Southern Oscillation is monitored through changes in atmospheric pressure, commonly represented by the pressure difference between Tahiti and Darwin.", sourceIds: [NCERT], sourceFactIds: ["SO-TAHITI-DARWIN"] },
  { qlId: "GEO-CLI-001-QL-079", qlName: "Southern Oscillation basics", difficulty: "Medium", stem: "Why is the Southern Oscillation relevant to the Indian monsoon?", answer: "It is one large-scale climate signal used in assessing monsoon behaviour", distractors: ["It directly creates every monsoon depression", "It controls only Himalayan snowfall", "It is a local sea breeze along the Indian coast"], explanation: "The Southern Oscillation is a large-scale tropical pressure pattern considered among the indicators used to understand and forecast monsoon behaviour.", sourceIds: [NCERT], sourceFactIds: ["SO-MONSOON-INDICATOR"] },
  { qlId: "GEO-CLI-001-QL-079", qlName: "Southern Oscillation basics", difficulty: "Medium", stem: "Which pair is correctly matched?", answer: "Southern Oscillation — Tahiti-Darwin pressure difference", distractors: ["Southern Oscillation — Delhi-Chennai temperature difference", "Western disturbance — Peru coastal warming", "Tropical easterly jet — Caspian Sea pressure difference"], explanation: "The Tahiti-Darwin pressure contrast is a standard way to represent the atmospheric part of the Southern Oscillation.", sourceIds: [NCERT], sourceFactIds: ["SO-TAHITI-DARWIN"] },
  { qlId: "GEO-CLI-001-QL-079", qlName: "Southern Oscillation basics", difficulty: "Medium", stem: "A climate index uses opposite pressure changes between Tahiti and Darwin. Which phenomenon does it represent?", answer: "The Southern Oscillation", distractors: ["The Indian Ocean Dipole", "The western disturbance cycle", "The local monsoon trough only"], explanation: "Opposite pressure changes across the tropical Pacific between Tahiti and Darwin are the classic atmospheric signal of the Southern Oscillation.", sourceIds: [NCERT], sourceFactIds: ["SO-TAHITI-DARWIN"] },

  // QL080 — El Nino / ENSO
  { qlId: "GEO-CLI-001-QL-080", qlName: "El Niño and ENSO basics", difficulty: "Easy", stem: "El Niño is marked by unusual warming in which part of the Pacific Ocean?", answer: "The central and eastern equatorial Pacific", distractors: ["The northern Arabian Sea", "The western Mediterranean Sea", "The Bay of Bengal only"], explanation: "El Niño is the warm phase of ENSO and involves unusual warming across the central and eastern equatorial Pacific Ocean.", sourceIds: [NCERT, IMD], sourceFactIds: ["ENSO-ELNINO-PACIFIC-WARMING"] },
  { qlId: "GEO-CLI-001-QL-080", qlName: "El Niño and ENSO basics", difficulty: "Easy", stem: "The coastal waters linked with the classic El Niño warming lie mainly off which country?", answer: "Peru", distractors: ["India", "Japan", "Madagascar"], explanation: "The traditional description of El Niño focuses on unusually warm water appearing off the coast of Peru in the eastern Pacific.", sourceIds: [NCERT], sourceFactIds: ["ENSO-PERU-WARMING"] },
  { qlId: "GEO-CLI-001-QL-080", qlName: "El Niño and ENSO basics", difficulty: "Medium", stem: "What does ENSO combine into one coupled climate phenomenon?", answer: "Pacific Ocean temperature changes and atmospheric pressure/circulation changes", distractors: ["Only Himalayan snowfall and river flow", "Only Indian Ocean tides and sea breezes", "Only Mediterranean cyclones and jet streams"], explanation: "ENSO links changes in tropical Pacific sea-surface temperatures with changes in the overlying atmospheric pressure and circulation.", sourceIds: [IMD], sourceFactIds: ["ENSO-COUPLED-OCEAN-ATMOSPHERE"] },
  { qlId: "GEO-CLI-001-QL-080", qlName: "El Niño and ENSO basics", difficulty: "Medium", stem: "How should the El Niño–Indian monsoon relationship be stated most accurately?", answer: "El Niño can influence monsoon rainfall, but the relationship is not one-to-one", distractors: ["Every El Niño produces an Indian drought", "El Niño has no connection with Indian monsoon variability", "Every El Niño produces above-normal monsoon rain"], explanation: "El Niño is an important influence on Indian monsoon variability, but it does not determine the monsoon outcome by itself in every year.", sourceIds: [IMD], sourceFactIds: ["ENSO-INDIA-MONSOON-NONDETERMINISTIC"] },
  { qlId: "GEO-CLI-001-QL-080", qlName: "El Niño and ENSO basics", difficulty: "Medium", stem: "Why is El Niño monitored during Indian monsoon forecasting?", answer: "It can alter large-scale tropical circulation that influences the monsoon", distractors: ["It fixes the exact date of every cyclone", "It directly measures rainfall over Punjab", "It is the only factor controlling the monsoon"], explanation: "El Niño changes tropical Pacific ocean-atmosphere circulation, which can influence the large-scale conditions affecting Indian monsoon rainfall.", sourceIds: [NCERT, IMD], sourceFactIds: ["ENSO-COUPLED-OCEAN-ATMOSPHERE", "ENSO-INDIA-MONSOON-NONDETERMINISTIC"] },
  { qlId: "GEO-CLI-001-QL-080", qlName: "El Niño and ENSO basics", difficulty: "Medium", stem: "Which statement best describes ENSO in relation to India?", answer: "It is a Pacific ocean-atmosphere phenomenon that can influence Indian monsoon variability", distractors: ["It is a local winter cyclone over northwestern India", "It is a surface wind found only over Tamil Nadu", "It is the rain-shadow effect east of the Western Ghats"], explanation: "ENSO develops in the tropical Pacific, but its large-scale atmospheric effects can extend far enough to influence year-to-year monsoon variability over India.", sourceIds: [NCERT, IMD], sourceFactIds: ["ENSO-COUPLED-OCEAN-ATMOSPHERE", "ENSO-INDIA-MONSOON-NONDETERMINISTIC"] },

  // QL081 — integrated
  { qlId: "GEO-CLI-001-QL-081", qlName: "Integrated western disturbances, jets and ENSO", difficulty: "Easy", stem: "Which system is correctly linked with winter rain over Punjab?", answer: "Western disturbances", distractors: ["Tropical easterly jet alone", "El Niño alone", "The southwest monsoon trough in January"], explanation: "Winter rain over Punjab is a typical effect of western disturbances moving into northwestern India from the west.", sourceIds: [NCERT], sourceFactIds: ["WD-NW-INDIA-WINTER-RAIN"] },
  { qlId: "GEO-CLI-001-QL-081", qlName: "Integrated western disturbances, jets and ENSO", difficulty: "Easy", stem: "Which upper-air change is linked with the burst of the southwest monsoon?", answer: "The easterly jet becomes established after the westerly jet withdraws", distractors: ["The westerly jet stays fixed south of the Himalayas", "Western disturbances become tropical cyclones", "The Southern Oscillation becomes a local sea breeze"], explanation: "The summer transition involves withdrawal of the westerly jet and establishment of the tropical easterly jet, which is linked with the monsoon burst.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-WITHDRAWAL", "EASTERLY-JET-MONSOON-BURST"] },
  { qlId: "GEO-CLI-001-QL-081", qlName: "Integrated western disturbances, jets and ENSO", difficulty: "Medium", stem: "Which set correctly matches the phenomenon with its main role?", answer: "Western disturbance—winter rain; westerly jet—steering; ENSO—large-scale monsoon influence", distractors: ["Western disturbance—summer sea breeze; westerly jet—Tamil Nadu cyclone; ENSO—Himalayan snowfall", "Western disturbance—El Niño warming; westerly jet—rabi crop; ENSO—local dust storm", "Western disturbance—monsoon burst; westerly jet—Peru current; ENSO—western Rajasthan rain shadow"], explanation: "The three links separate a winter weather system, the upper-air current that helps guide it, and a Pacific climate influence on monsoon variability.", sourceIds: [NCERT, IMD], sourceFactIds: ["WD-NW-INDIA-WINTER-RAIN", "WESTERLY-JET-STEERS-WD", "ENSO-INDIA-MONSOON-NONDETERMINISTIC"] },
  { qlId: "GEO-CLI-001-QL-081", qlName: "Integrated western disturbances, jets and ENSO", difficulty: "Medium", stem: "A forecast discusses Tahiti-Darwin pressure, while a winter bulletin tracks Mediterranean cyclones. Which two phenomena are involved?", answer: "Southern Oscillation and western disturbances", distractors: ["Tropical easterly jet and sea breeze", "Loo and mango showers", "Rain shadow and retreating monsoon only"], explanation: "Tahiti-Darwin pressure relates to the Southern Oscillation, while Mediterranean-origin winter cyclones affecting India are western disturbances.", sourceIds: [NCERT], sourceFactIds: ["SO-TAHITI-DARWIN", "WD-ORIGIN-EAST-MEDITERRANEAN"] },
  { qlId: "GEO-CLI-001-QL-081", qlName: "Integrated western disturbances, jets and ENSO", difficulty: "Medium", stem: "Which sequence best follows India's seasonal upper-air change from winter toward monsoon onset?", answer: "Westerly jet with western disturbances → westerly jet withdraws → easterly jet develops", distractors: ["Easterly jet with western disturbances → easterly jet withdraws → winter begins", "ENSO forms over India → western disturbance moves to Peru → monsoon begins", "Westerly jet strengthens permanently → ITCZ moves south → monsoon bursts"], explanation: "Winter western disturbances are linked with the westerly jet; before monsoon onset that jet withdraws and the tropical easterly jet becomes established.", sourceIds: [NCERT], sourceFactIds: ["WESTERLY-JET-STEERS-WD", "WESTERLY-JET-WITHDRAWAL", "EASTERLY-JET-AFTER-WESTERLY"] },
  { qlId: "GEO-CLI-001-QL-081", qlName: "Integrated western disturbances, jets and ENSO", difficulty: "Medium", stem: "Which conclusion is correct when comparing western disturbances and ENSO?", answer: "Western disturbances are regional winter systems, while ENSO is a large-scale Pacific ocean-atmosphere influence", distractors: ["Both are local winds of the Thar Desert", "Both originate in the eastern Mediterranean", "Both directly produce the monsoon burst over India"], explanation: "Western disturbances are travelling winter weather systems affecting northern India, whereas ENSO is a tropical Pacific ocean-atmosphere pattern with wider climate influence.", sourceIds: [NCERT, IMD], sourceFactIds: ["WD-ORIGIN-EAST-MEDITERRANEAN", "ENSO-COUPLED-OCEAN-ATMOSPHERE"] },
]);

export const GEO_CLI_001_CP009_REVIEW_BATCH_V1: readonly GeoCli001Cp009Question[] = Object.freeze(
  RAW.map((raw, index) => {
    const correctIndex = index % 4;
    return Object.freeze({
      questionId: `GEO-CLI-001-CP009-Q${String(index + 1).padStart(3, "0")}`,
      qlId: raw.qlId,
      qlName: raw.qlName,
      difficulty: raw.difficulty,
      stem: raw.stem,
      options: Object.freeze(placeOptions(raw.answer, raw.distractors, correctIndex)),
      correctIndex,
      canonicalAnswer: raw.answer,
      explanation: raw.explanation,
      sourceIds: Object.freeze([...raw.sourceIds]),
      sourceFactIds: Object.freeze([...raw.sourceFactIds]),
      reviewOnly: true as const,
      runtimeRegistered: false as const,
    });
  }),
);

const BANNED_LEARNER_TEXT = /sourceFact|review-only|runtimeRegistered|generator|qualification gate|truth authority|\bNCERT\b|\bIMD\b/i;
const BANNED_STEM_TEXT = /associated with|described as|in the context of|with reference to the above|what is a key feature|which is correct\?|which statement is correct\?|what broad effect can it have|which climate control best explains/i;

export function auditGeoCli001Cp009ReviewBatchV1() {
  const issues: string[] = [];
  const ids = new Set<string>();
  const stems = new Set<string>();
  const semantics = new Set<string>();
  const explanations = new Set<string>();
  const qlCounts: Record<string, number> = {};
  const difficultyCounts: Record<GeoCli001Cp009Difficulty, number> = { Easy: 0, Medium: 0, Hard: 0 };
  const answerPositions = [0, 0, 0, 0];
  const hardAnswers = new Set<string>();
  let statementStemCount = 0;

  for (const question of GEO_CLI_001_CP009_REVIEW_BATCH_V1) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    const normalizedStem = question.stem.replace(/\s+/g, " ").trim().toLowerCase();
    if (stems.has(normalizedStem)) issues.push(`DUPLICATE_STEM:${question.questionId}`);
    stems.add(normalizedStem);
    const semantic = `${normalizedStem}::${question.canonicalAnswer.toLowerCase()}`;
    if (semantics.has(semantic)) issues.push(`DUPLICATE_SEMANTIC:${question.questionId}`);
    semantics.add(semantic);
    const normalizedExplanation = question.explanation.replace(/\s+/g, " ").trim().toLowerCase();
    if (explanations.has(normalizedExplanation)) issues.push(`DUPLICATE_EXPLANATION:${question.questionId}`);
    explanations.add(normalizedExplanation);
    qlCounts[question.qlId] = (qlCounts[question.qlId] ?? 0) + 1;
    difficultyCounts[question.difficulty] += 1;
    answerPositions[question.correctIndex] += 1;
    if (question.difficulty === "Hard") hardAnswers.add(question.canonicalAnswer);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.sourceIds.length || !question.sourceFactIds.length) issues.push(`PROVENANCE:${question.questionId}`);
    if (!question.reviewOnly || question.runtimeRegistered) issues.push(`LIFECYCLE:${question.questionId}`);
    if (question.explanation.length < 60) issues.push(`SHORT_EXPLANATION:${question.questionId}`);
    if (question.stem.length < 28) issues.push(`SHORT_STEM:${question.questionId}`);
    if (question.stem.length > 220) issues.push(`LONG_STEM:${question.questionId}`);
    if (!question.stem.trim().endsWith("?")) issues.push(`NON_QUESTION_STEM:${question.questionId}`);
    if (BANNED_STEM_TEXT.test(question.stem)) issues.push(`NON_EXAM_STEM:${question.questionId}`);
    if (/^Consider these statements/i.test(question.stem)) statementStemCount += 1;
    const learnerText = `${question.stem}\n${question.options.join("\n")}\n${question.explanation}`;
    if (BANNED_LEARNER_TEXT.test(learnerText)) issues.push(`LEARNER_TEXT:${question.questionId}`);
  }

  if (GEO_CLI_001_CP009_REVIEW_BATCH_V1.length !== 54) issues.push(`COUNT:${GEO_CLI_001_CP009_REVIEW_BATCH_V1.length}`);
  if (stems.size !== 54) issues.push(`STEM_COUNT:${stems.size}`);
  if (semantics.size !== 54) issues.push(`SEMANTIC_COUNT:${semantics.size}`);
  if (explanations.size !== 54) issues.push(`EXPLANATION_COUNT:${explanations.size}`);
  if (statementStemCount > 10) issues.push(`STATEMENT_STEM_OVERUSE:${statementStemCount}`);
  for (let i = 73; i <= 81; i += 1) {
    const qlId = `GEO-CLI-001-QL-${String(i).padStart(3, "0")}`;
    if (qlCounts[qlId] !== 6) issues.push(`QL_COUNT:${qlId}:${qlCounts[qlId] ?? 0}`);
  }
  if (difficultyCounts.Easy !== 18 || difficultyCounts.Medium !== 30 || difficultyCounts.Hard !== 6) issues.push(`DIFFICULTY:${JSON.stringify(difficultyCounts)}`);
  if (answerPositions.join(",") !== "14,14,13,13") issues.push(`ANSWER_POSITIONS:${answerPositions.join(",")}`);
  if (hardAnswers.size < 3) issues.push(`HARD_ANSWER_VARIETY:${hardAnswers.size}`);

  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
    questionCount: GEO_CLI_001_CP009_REVIEW_BATCH_V1.length,
    stemCount: stems.size,
    semanticCount: semantics.size,
    explanationCount: explanations.size,
    qlCounts: Object.freeze(qlCounts),
    difficultyCounts: Object.freeze(difficultyCounts),
    answerPositions: Object.freeze(answerPositions),
    hardAnswerVariety: hardAnswers.size,
    statementStemCount,
  });
}
