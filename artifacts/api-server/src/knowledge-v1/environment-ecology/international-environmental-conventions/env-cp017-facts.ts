export type EnvCp017FactRow = {
  id: string;
  label: string;
  statement: string;
  sourceIds: readonly string[];
};

const RAMSAR = "RAMSAR-OFFICIAL";
const CITES = "CITES-OFFICIAL";
const CMS = "CMS-OFFICIAL";
const CBD = "CBD-OFFICIAL";
const UNFCCC = "UNFCCC-OFFICIAL";
const OZONE = "UNEP-OZONE-SECRETARIAT";
const BASEL = "BASEL-OFFICIAL";
const STOCKHOLM = "STOCKHOLM-OFFICIAL";
const MINAMATA = "MINAMATA-OFFICIAL";

export const ENV_CP017_FACT_ROWS_V1: readonly EnvCp017FactRow[] = Object.freeze([
  { id:"env-cp017-ramsar-purpose", label:"Ramsar purpose", statement:"The Convention on Wetlands provides the framework for conservation and wise use of wetlands and their resources", sourceIds:[RAMSAR] },
  { id:"env-cp017-ramsar-year-place", label:"Ramsar adoption", statement:"The Convention on Wetlands was adopted in Ramsar, Iran, in 1971", sourceIds:[RAMSAR] },
  { id:"env-cp017-ramsar-list", label:"Ramsar List", statement:"Parties designate suitable wetlands for the List of Wetlands of International Importance, commonly called the Ramsar List", sourceIds:[RAMSAR] },

  { id:"env-cp017-cites-purpose", label:"CITES purpose", statement:"CITES aims to ensure that international trade in specimens of wild animals and plants does not threaten their survival", sourceIds:[CITES] },
  { id:"env-cp017-cites-year-place", label:"CITES adoption", statement:"CITES was adopted in Washington, D.C., in 1973 and is also associated with the name Washington Convention", sourceIds:[CITES] },
  { id:"env-cp017-cites-appendices", label:"CITES appendices", statement:"CITES regulates international wildlife trade through three Appendices with different levels and forms of trade control", sourceIds:[CITES] },

  { id:"env-cp017-cms-purpose", label:"CMS purpose", statement:"CMS provides an international framework for conservation of migratory species of wild animals", sourceIds:[CMS] },
  { id:"env-cp017-cms-bonn", label:"CMS Bonn Convention", statement:"CMS was negotiated in Bonn in 1979 and is also known as the Bonn Convention", sourceIds:[CMS] },
  { id:"env-cp017-cms-appendices", label:"CMS appendices", statement:"CMS Appendix I covers endangered migratory species and Appendix II covers migratory species that need or would significantly benefit from international agreements", sourceIds:[CMS] },

  { id:"env-cp017-cbd-year", label:"CBD adoption", statement:"The Convention on Biological Diversity was opened for signature at the 1992 Rio Earth Summit", sourceIds:[CBD] },
  { id:"env-cp017-cbd-objectives", label:"CBD objectives", statement:"CBD has three objectives: conservation of biological diversity, sustainable use of its components, and fair and equitable sharing of benefits from genetic resources", sourceIds:[CBD] },
  { id:"env-cp017-cbd-scope", label:"CBD scope", statement:"CBD is a broad biodiversity framework covering conservation, sustainable use and access-and-benefit-sharing concepts", sourceIds:[CBD] },

  { id:"env-cp017-unfccc-year", label:"UNFCCC adoption", statement:"The United Nations Framework Convention on Climate Change was adopted in 1992 and entered into force in 1994", sourceIds:[UNFCCC] },
  { id:"env-cp017-unfccc-framework", label:"UNFCCC framework", statement:"UNFCCC is the framework convention under which later climate agreements including the Kyoto Protocol and Paris Agreement were developed", sourceIds:[UNFCCC] },
  { id:"env-cp017-unfccc-climate", label:"UNFCCC subject", statement:"UNFCCC provides the international framework for addressing climate change and greenhouse-gas emissions", sourceIds:[UNFCCC] },

  { id:"env-cp017-kyoto-year", label:"Kyoto adoption", statement:"The Kyoto Protocol was adopted in Kyoto, Japan, in 1997 and entered into force in 2005", sourceIds:[UNFCCC] },
  { id:"env-cp017-kyoto-role", label:"Kyoto role", statement:"The Kyoto Protocol operationalized UNFCCC by setting agreed greenhouse-gas emission limitation and reduction commitments for industrialized countries and economies in transition", sourceIds:[UNFCCC] },
  { id:"env-cp017-kyoto-distinction", label:"Kyoto distinction", statement:"Kyoto used differentiated binding emission targets for specified developed-country parties rather than the Paris system of nationally determined contributions for all parties", sourceIds:[UNFCCC] },

  { id:"env-cp017-paris-year", label:"Paris adoption", statement:"The Paris Agreement was adopted at COP21 in Paris in 2015 and entered into force in 2016", sourceIds:[UNFCCC] },
  { id:"env-cp017-paris-temperature", label:"Paris temperature goal", statement:"The Paris Agreement aims to hold warming well below 2 degrees Celsius above pre-industrial levels while pursuing efforts to limit warming to 1.5 degrees Celsius", sourceIds:[UNFCCC] },
  { id:"env-cp017-paris-ndc", label:"Paris NDC system", statement:"The Paris Agreement uses nationally determined contributions, with parties communicating climate actions under the agreement", sourceIds:[UNFCCC] },

  { id:"env-cp017-vienna-year", label:"Vienna Convention", statement:"The Vienna Convention for the Protection of the Ozone Layer was adopted in 1985 as the framework agreement for international ozone protection", sourceIds:[OZONE] },
  { id:"env-cp017-montreal-year", label:"Montreal Protocol", statement:"The Montreal Protocol on Substances that Deplete the Ozone Layer was adopted in 1987 and controls ozone-depleting substances", sourceIds:[OZONE] },
  { id:"env-cp017-ozone-distinction", label:"Vienna versus Montreal", statement:"The Vienna Convention provides the cooperative framework, while the Montreal Protocol contains control measures for ozone-depleting substances", sourceIds:[OZONE] },
  { id:"env-cp017-kigali", label:"Kigali Amendment", statement:"The Kigali Amendment to the Montreal Protocol provides for a phasedown of hydrofluorocarbons, which are greenhouse gases but not major ozone-depleting substances", sourceIds:[OZONE] },

  { id:"env-cp017-basel-year", label:"Basel adoption", statement:"The Basel Convention on hazardous and other wastes was adopted in Basel, Switzerland, in 1989 and entered into force in 1992", sourceIds:[BASEL] },
  { id:"env-cp017-basel-purpose", label:"Basel purpose", statement:"The Basel Convention addresses generation, management, transboundary movement and disposal of hazardous and other wastes", sourceIds:[BASEL] },
  { id:"env-cp017-basel-toxic-trade", label:"Basel toxic trade", statement:"A central concern behind the Basel Convention was control of international movement and dumping of hazardous wastes", sourceIds:[BASEL] },

  { id:"env-cp017-stockholm-year", label:"Stockholm adoption", statement:"The Stockholm Convention on Persistent Organic Pollutants was adopted in Stockholm in 2001 and entered into force in 2004", sourceIds:[STOCKHOLM] },
  { id:"env-cp017-stockholm-purpose", label:"Stockholm purpose", statement:"The Stockholm Convention protects human health and the environment from persistent organic pollutants", sourceIds:[STOCKHOLM] },
  { id:"env-cp017-pops", label:"Persistent organic pollutants", statement:"POPs persist for long periods, can travel widely, accumulate in organisms and can harm human health and the environment", sourceIds:[STOCKHOLM] },

  { id:"env-cp017-minamata-year", label:"Minamata adoption", statement:"The Minamata Convention on Mercury was adopted in Japan in 2013 and entered into force in 2017", sourceIds:[MINAMATA] },
  { id:"env-cp017-minamata-purpose", label:"Minamata purpose", statement:"The Minamata Convention is the global treaty addressing mercury and risks to human health and the environment from mercury pollution", sourceIds:[MINAMATA] },
  { id:"env-cp017-minamata-name", label:"Minamata name", statement:"The convention is named after Minamata, the Japanese city associated with severe mercury poisoning", sourceIds:[MINAMATA] },
]);

export const ENV_CP017_FACT_IDS_V1 = new Set(ENV_CP017_FACT_ROWS_V1.map((row) => row.id));
export const ENV_CP017_FACT_BY_ID_V1 = new Map(ENV_CP017_FACT_ROWS_V1.map((row) => [row.id, row] as const));
