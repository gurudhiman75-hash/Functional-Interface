export const ENV_CP021_SOURCES = Object.freeze({
  NIOS_ECOLOGY: "NIOS Principles of Ecology — ecological succession",
  PARIVESH_EIA: "PARIVESH / MoEFCC — EIA Notification, 2006",
  MOEF_PROJECT_ELEPHANT: "MoEFCC — Project Elephant",
  NIOS_MOVEMENTS: "NIOS — major citizen-led environmental movements in India",
  MOEF_NAPCC: "MoEFCC — National Action Plan on Climate Change",
});

export const ENV_CP021_FACTS_V1 = Object.freeze([
  { id:"env-cp021-succession", statement:"Ecological succession is the gradual replacement of one biological community by another over time.", sourceIds:[ENV_CP021_SOURCES.NIOS_ECOLOGY] },
  { id:"env-cp021-primary", statement:"Primary succession begins on a surface where a biological community and developed soil are initially absent.", sourceIds:[ENV_CP021_SOURCES.NIOS_ECOLOGY] },
  { id:"env-cp021-secondary", statement:"Secondary succession begins after disturbance where a previous community existed and soil is generally retained.", sourceIds:[ENV_CP021_SOURCES.NIOS_ECOLOGY] },
  { id:"env-cp021-pioneer", statement:"Pioneer species are the early colonisers of a bare or newly available area during succession.", sourceIds:[ENV_CP021_SOURCES.NIOS_ECOLOGY] },
  { id:"env-cp021-climax", statement:"A climax community is the relatively stable mature community reached late in a classical succession sequence.", sourceIds:[ENV_CP021_SOURCES.NIOS_ECOLOGY] },
  { id:"env-cp021-primary-v-secondary", statement:"Primary succession is generally slower than secondary succession because soil formation may need to begin from bare substrate.", sourceIds:[ENV_CP021_SOURCES.NIOS_ECOLOGY] },

  { id:"env-cp021-eia-purpose", statement:"Environmental Impact Assessment evaluates likely environmental effects of a proposed project before the relevant approval decision.", sourceIds:[ENV_CP021_SOURCES.PARIVESH_EIA] },
  { id:"env-cp021-eia-2006", statement:"India's Environmental Impact Assessment Notification, 2006 was issued on 14 September 2006.", sourceIds:[ENV_CP021_SOURCES.PARIVESH_EIA] },
  { id:"env-cp021-eia-clearance", statement:"The EIA framework links specified projects and activities with prior environmental clearance requirements.", sourceIds:[ENV_CP021_SOURCES.PARIVESH_EIA] },
  { id:"env-cp021-eia-not-monitoring", statement:"EIA is primarily an assessment and clearance-stage process; it is not the same as routine pollution monitoring after a project begins operation.", sourceIds:[ENV_CP021_SOURCES.PARIVESH_EIA] },

  { id:"env-cp021-elephant-launch", statement:"Project Elephant was launched by the Government of India in 1991-92 as a Centrally Sponsored Scheme.", sourceIds:[ENV_CP021_SOURCES.MOEF_PROJECT_ELEPHANT] },
  { id:"env-cp021-elephant-objectives", statement:"Project Elephant focuses on protecting elephants, their habitats and corridors, reducing human-elephant conflict and supporting the welfare of captive elephants.", sourceIds:[ENV_CP021_SOURCES.MOEF_PROJECT_ELEPHANT] },
  { id:"env-cp021-elephant-corridors", statement:"Protecting traditional elephant movement routes and corridors is a core landscape-level conservation concern under Project Elephant.", sourceIds:[ENV_CP021_SOURCES.MOEF_PROJECT_ELEPHANT] },
  { id:"env-cp021-elephant-conflict", statement:"Human-elephant conflict mitigation is an explicit objective of Project Elephant.", sourceIds:[ENV_CP021_SOURCES.MOEF_PROJECT_ELEPHANT] },

  { id:"env-cp021-chipko", statement:"The Chipko movement became known for villagers embracing trees to resist commercial felling in the Himalayan region during the 1970s.", sourceIds:[ENV_CP021_SOURCES.NIOS_MOVEMENTS] },
  { id:"env-cp021-appiko", statement:"The Appiko movement began in Karnataka in 1983 and used tree-protection methods inspired by Chipko.", sourceIds:[ENV_CP021_SOURCES.NIOS_MOVEMENTS] },
  { id:"env-cp021-silent-valley", statement:"The Save Silent Valley movement opposed a hydel project that threatened the tropical evergreen forest ecosystem of Silent Valley in Kerala.", sourceIds:[ENV_CP021_SOURCES.NIOS_MOVEMENTS] },
  { id:"env-cp021-bishnoi", statement:"The Khejarli/Bishnoi tradition is remembered for sacrificing lives to protect khejri trees in Rajasthan.", sourceIds:[ENV_CP021_SOURCES.NIOS_MOVEMENTS] },

  { id:"env-cp021-napcc", statement:"India released the National Action Plan on Climate Change in 2008 as a national framework combining mitigation, adaptation and sustainable-development actions.", sourceIds:[ENV_CP021_SOURCES.MOEF_NAPCC] },
  { id:"env-cp021-eight-missions", statement:"The original NAPCC framework was organised around eight core National Missions.", sourceIds:[ENV_CP021_SOURCES.MOEF_NAPCC] },
  { id:"env-cp021-solar", statement:"The National Solar Mission is one of the original core missions under the NAPCC framework.", sourceIds:[ENV_CP021_SOURCES.MOEF_NAPCC] },
  { id:"env-cp021-water", statement:"The National Water Mission is one of the original core NAPCC missions and addresses water conservation, efficiency and integrated management.", sourceIds:[ENV_CP021_SOURCES.MOEF_NAPCC] },
  { id:"env-cp021-green-india", statement:"The Green India Mission is one of the original core NAPCC missions and focuses on forest and ecosystem-related climate action.", sourceIds:[ENV_CP021_SOURCES.MOEF_NAPCC] },
  { id:"env-cp021-sustainable-habitat", statement:"The National Mission on Sustainable Habitat is one of the original core missions under NAPCC.", sourceIds:[ENV_CP021_SOURCES.MOEF_NAPCC] },
]);

export const ENV_CP021_FACT_BY_ID_V1 = Object.freeze(Object.fromEntries(ENV_CP021_FACTS_V1.map((f) => [f.id, f])) as Record<string, typeof ENV_CP021_FACTS_V1[number]>);
export const ENV_CP021_FACT_IDS_V1 = Object.freeze(ENV_CP021_FACTS_V1.map((f) => f.id));
