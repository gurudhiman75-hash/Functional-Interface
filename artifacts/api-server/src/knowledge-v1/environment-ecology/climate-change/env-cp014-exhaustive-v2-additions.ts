import type { EnvCp014ReviewQuestion } from "./env-cp014-review-types";

const SOURCE = "MOEFCC-NAPCC-2008";

export const ENV_CP014_EXHAUSTIVE_V2_FACTS = Object.freeze({
  napccYear: "India announced the National Action Plan on Climate Change (NAPCC) in 2008.",
  eightMissions: "The original NAPCC is built around eight national missions covering major mitigation, adaptation and knowledge priorities.",
  solar: "The National Solar Mission promotes solar energy development under the NAPCC framework.",
  efficiency: "The National Mission for Enhanced Energy Efficiency focuses on improving energy efficiency.",
  habitat: "The National Mission on Sustainable Habitat addresses more sustainable urban and habitat development.",
  water: "The National Water Mission focuses on water conservation, management and improved water-use efficiency.",
  himalaya: "The National Mission for Sustaining the Himalayan Ecosystem addresses climate and ecological concerns of the Himalayan region.",
  greenIndia: "The National Mission for a Green India focuses on forest and ecosystem restoration and enhancement of ecosystem services.",
  agriculture: "The National Mission for Sustainable Agriculture addresses climate resilience and sustainability in agriculture.",
  knowledge: "The National Mission on Strategic Knowledge for Climate Change strengthens climate science, knowledge and research capacity.",
} as const);

type Seed = Omit<EnvCp014ReviewQuestion, "questionId" | "chapterId" | "cpId" | "sourceIds" | "reviewOnly" | "runtimeRegistered">;

const seeds: Seed[] = [
  { qlId:"ENV-014-V2-QL-013", qlName:"NAPCC fundamentals", difficulty:"Easy", stem:"India announced the National Action Plan on Climate Change in:", options:["2008","1992","2015","2021"], correctIndex:0, canonicalAnswer:"2008", explanation:"India announced the National Action Plan on Climate Change in 2008 as a national framework covering major climate mitigation and adaptation priorities.", sourceFactIds:["napccYear"] },
  { qlId:"ENV-014-V2-QL-013", qlName:"NAPCC fundamentals", difficulty:"Easy", stem:"How many national missions formed the original core of the NAPCC?", options:["Six","Eight","Ten","Twelve"], correctIndex:1, canonicalAnswer:"Eight", explanation:"The original NAPCC framework set out eight national missions covering energy, water, forests, agriculture, habitat, the Himalaya and climate knowledge.", sourceFactIds:["eightMissions"] },
  { qlId:"ENV-014-V2-QL-013", qlName:"NAPCC fundamentals", difficulty:"Medium", stem:"Which statement best describes the NAPCC?", options:["It is only a wildlife-reserve list","It is a framework combining major mitigation and adaptation priorities","It deals only with ozone depletion","It is a pollution-control tribunal"], correctIndex:1, canonicalAnswer:"It is a framework combining major mitigation and adaptation priorities", explanation:"NAPCC is broader than a single sector. Its missions cover mitigation, adaptation, natural resources and the knowledge base needed for climate action.", sourceFactIds:["eightMissions"] },
  { qlId:"ENV-014-V2-QL-013", qlName:"NAPCC fundamentals", difficulty:"Hard", stem:"Which pair correctly links the NAPCC with its structure?", options:["2008—eight national missions","1972—four national missions","1986—one pollution mission","2010—only renewable-energy missions"], correctIndex:0, canonicalAnswer:"2008—eight national missions", explanation:"The stable exam fact is that India announced NAPCC in 2008 and its original core consists of eight national missions spanning several climate-action areas.", sourceFactIds:["napccYear","eightMissions"] },

  { qlId:"ENV-014-V2-QL-014", qlName:"NAPCC mission matching", difficulty:"Easy", stem:"Which NAPCC mission directly focuses on solar energy?", options:["National Solar Mission","National Water Mission","Green India Mission","Strategic Knowledge Mission"], correctIndex:0, canonicalAnswer:"National Solar Mission", explanation:"The National Solar Mission is the NAPCC mission dedicated to expanding the role of solar energy in India's energy transition.", sourceFactIds:["solar"] },
  { qlId:"ENV-014-V2-QL-014", qlName:"NAPCC mission matching", difficulty:"Easy", stem:"Which NAPCC mission is mainly concerned with improving energy efficiency?", options:["National Mission for Sustainable Agriculture","National Mission for Enhanced Energy Efficiency","National Mission on Sustainable Habitat","National Water Mission"], correctIndex:1, canonicalAnswer:"National Mission for Enhanced Energy Efficiency", explanation:"The National Mission for Enhanced Energy Efficiency focuses on using energy more efficiently and reducing energy intensity through efficiency measures.", sourceFactIds:["efficiency"] },
  { qlId:"ENV-014-V2-QL-014", qlName:"NAPCC mission matching", difficulty:"Medium", stem:"Which mission is correctly matched with its main field?", options:["Green India Mission—forest and ecosystem restoration","National Water Mission—wildlife trade control","Solar Mission—tiger monitoring","Sustainable Habitat Mission—ozone treaty enforcement"], correctIndex:0, canonicalAnswer:"Green India Mission—forest and ecosystem restoration", explanation:"Green India Mission addresses forests, restoration and ecosystem services. The other options mix unrelated institutions or environmental subjects.", sourceFactIds:["greenIndia"] },
  { qlId:"ENV-014-V2-QL-014", qlName:"NAPCC mission matching", difficulty:"Hard", stem:"Which set contains only original NAPCC missions?", options:["Solar Mission, Water Mission, Green India Mission","Project Tiger, Project Elephant, Green India Mission","Ramsar Mission, Solar Mission, Water Mission","Clean Ganga Mission, Tiger Mission, Habitat Mission"], correctIndex:0, canonicalAnswer:"Solar Mission, Water Mission, Green India Mission", explanation:"The National Solar Mission, National Water Mission and National Mission for a Green India are all part of the original eight-mission NAPCC structure.", sourceFactIds:["solar","water","greenIndia"] },

  { qlId:"ENV-014-V2-QL-015", qlName:"Applied NAPCC identification", difficulty:"Medium", stem:"Improving climate resilience in farming is most directly linked with which NAPCC mission?", options:["National Mission for Sustainable Agriculture","National Solar Mission","National Water Mission only","National Mission on Strategic Knowledge only"], correctIndex:0, canonicalAnswer:"National Mission for Sustainable Agriculture", explanation:"The agriculture mission addresses sustainability and climate resilience in farming systems, including adaptation to climate-related stresses.", sourceFactIds:["agriculture"] },
  { qlId:"ENV-014-V2-QL-015", qlName:"Applied NAPCC identification", difficulty:"Medium", stem:"Climate research and knowledge capacity are most directly covered by the:", options:["National Mission for a Green India","National Mission on Strategic Knowledge for Climate Change","National Solar Mission","National Water Mission"], correctIndex:1, canonicalAnswer:"National Mission on Strategic Knowledge for Climate Change", explanation:"The Strategic Knowledge mission strengthens climate-science understanding, research networks and the knowledge base needed for informed climate action.", sourceFactIds:["knowledge"] },
  { qlId:"ENV-014-V2-QL-015", qlName:"Applied NAPCC identification", difficulty:"Medium", stem:"Urban sustainability under NAPCC is most closely linked with the:", options:["National Mission on Sustainable Habitat","National Mission for Sustainable Agriculture","National Solar Mission only","National Mission for Sustaining the Himalayan Ecosystem"], correctIndex:0, canonicalAnswer:"National Mission on Sustainable Habitat", explanation:"The Sustainable Habitat mission is the NAPCC mission most directly concerned with improving sustainability in urban and built-environment systems.", sourceFactIds:["habitat"] },
  { qlId:"ENV-014-V2-QL-015", qlName:"Applied NAPCC identification", difficulty:"Hard", stem:"Which pair is incorrectly matched?", options:["Water Mission—water-use efficiency","Himalayan Ecosystem Mission—Himalayan climate and ecology","Strategic Knowledge Mission—climate research","Green India Mission—control of wildlife trade"], correctIndex:3, canonicalAnswer:"Green India Mission—control of wildlife trade", explanation:"Green India Mission focuses on forests, restoration and ecosystem services. Wildlife-trade enforcement belongs to a different institutional and legal domain.", sourceFactIds:["water","himalaya","knowledge","greenIndia"] },
];

export const ENV_CP014_EXHAUSTIVE_V2_QUESTIONS: EnvCp014ReviewQuestion[] = seeds.map((seed, i) => ({
  ...seed,
  questionId: `ENV-CP014-V2-AUDIT-${String(i + 1).padStart(3, "0")}`,
  chapterId: "ENV-001",
  cpId: "ENV-CP-014",
  sourceIds: [SOURCE],
  reviewOnly: true,
  runtimeRegistered: false,
}));
