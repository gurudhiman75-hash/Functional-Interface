export type EcoCp018Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP018_FACTS_V1: EcoCp018Fact[] = [
  { id: "industry-role", label: "Role of industry", explanation: "Industrial development expands manufacturing capacity, employment, value addition and demand for infrastructure and services.", sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"], sourceFactIds: ["industrial-development-role"] },
  { id: "manufacturing", label: "Manufacturing activity", explanation: "Manufacturing converts raw materials or components into finished or semi-finished goods through production processes.", sourceIds: ["MOSPI-IIP-METADATA"], sourceFactIds: ["manufacturing-sector"] },
  { id: "ipr-1956", label: "Industrial Policy Resolution 1956", explanation: "The 1956 industrial-policy framework divided industries among public-sector, mixed-participation and private-sector areas, reflecting India's mixed-economy strategy.", sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"], sourceFactIds: ["ipr-1956-three-categories"] },
  { id: "public-sector-role", label: "Public-sector role", explanation: "Early industrial policy reserved important strategic and basic industries for a major public-sector role while allowing private enterprise in other areas.", sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"], sourceFactIds: ["public-sector-reservation-history"] },
  { id: "nip-1991", label: "New Industrial Policy 1991", explanation: "The 1991 policy reduced industrial controls, abolished licensing for most industries and narrowed public-sector reservation.", sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"], sourceFactIds: ["industrial-policy-1991"] },
  { id: "delicensing", label: "Industrial delicensing", explanation: "Delicensing means removing compulsory industrial licences for most industries, leaving only a limited set subject to licensing.", sourceIds: ["DPIIT-INDUSTRIAL-POLICY-1991"], sourceFactIds: ["licensing-abolished-most-industries"] },
  { id: "msmed-act", label: "MSMED Act 2006", explanation: "The MSMED Act, 2006 created a legal framework covering micro, small and medium enterprises in both manufacturing and services.", sourceIds: ["MSME-MSMED-ACT"], sourceFactIds: ["msmed-act-2006"] },
  { id: "msme-role", label: "MSME economic role", explanation: "MSMEs support entrepreneurship, employment, production, supply chains and regional industrial development.", sourceIds: ["MSME-MSMED-ACT"], sourceFactIds: ["promotion-development-competitiveness"] },
  { id: "iip-definition", label: "Index of Industrial Production", explanation: "IIP is a composite indicator measuring short-term changes in the volume of industrial production relative to a base period.", sourceIds: ["MOSPI-IIP-METADATA"], sourceFactIds: ["iip-definition"] },
  { id: "iip-sectors", label: "IIP sectors", explanation: "India's all-India IIP covers Mining, Manufacturing and Electricity.", sourceIds: ["MOSPI-IIP-METADATA"], sourceFactIds: ["iip-mining-manufacturing-electricity"] },
  { id: "iip-use-categories", label: "IIP use-based categories", explanation: "IIP use-based categories include primary, capital, intermediate, infrastructure/construction, consumer durable and consumer non-durable goods.", sourceIds: ["MOSPI-IIP-METADATA"], sourceFactIds: ["iip-use-based-categories"] },
  { id: "core-eight", label: "Eight Core Industries", explanation: "The Eight Core Industries are coal, crude oil, natural gas, refinery products, fertilisers, steel, cement and electricity.", sourceIds: ["OEA-EIGHT-CORE"], sourceFactIds: ["eight-core-industries-list"] },
  { id: "core-iip-link", label: "Core industries and IIP", explanation: "The Eight Core Industries form an important subset of industrial production and carry substantial weight in IIP.", sourceIds: ["OEA-EIGHT-CORE", "MOSPI-IIP-METADATA"], sourceFactIds: ["core-industries-iip-link"] },
  { id: "industrial-corridor", label: "Industrial corridors", explanation: "Industrial corridors combine manufacturing nodes with transport and logistics infrastructure to support investment and industrial growth.", sourceIds: ["NICDC-INDUSTRIAL-CORRIDORS"], sourceFactIds: ["industrial-corridor-purpose"] },
  { id: "dmic", label: "Delhi-Mumbai Industrial Corridor", explanation: "DMIC was the first major national industrial-corridor project and uses the Western Dedicated Freight Corridor as a transport backbone.", sourceIds: ["NICDC-INDUSTRIAL-CORRIDORS"], sourceFactIds: ["dmic-western-dfc"] },
  { id: "sez-act", label: "Special Economic Zones Act 2005", explanation: "The SEZ Act, 2005 provides for establishment, development and management of SEZs with export promotion as a central objective.", sourceIds: ["COMMERCE-SEZ-ACT-2005"], sourceFactIds: ["sez-act-2005-export-promotion"] },
  { id: "sez-concept", label: "Special Economic Zone", explanation: "An SEZ is a specially governed economic area intended to facilitate trade, investment, production and exports under a defined policy framework.", sourceIds: ["COMMERCE-SEZ-ACT-2005"], sourceFactIds: ["sez-concept"] },
  { id: "make-in-india", label: "Make in India", explanation: "Make in India was launched on 25 September 2014 to promote manufacturing, investment, innovation and job creation in India.", sourceIds: ["PIB-MAKE-IN-INDIA-2014"], sourceFactIds: ["make-in-india-launch-2014", "manufacturing-investment"] },
  { id: "location-factors", label: "Industrial location factors", explanation: "Industrial location is influenced by access to raw materials, power, labour, transport, markets, finance and supporting infrastructure.", sourceIds: ["NICDC-INDUSTRIAL-CORRIDORS"], sourceFactIds: ["industrial-infrastructure-connectivity"] },
  { id: "capital-goods", label: "Capital goods", explanation: "Capital goods are goods used to produce other goods or services, such as industrial machinery and equipment.", sourceIds: ["MOSPI-IIP-METADATA"], sourceFactIds: ["iip-capital-goods"] },
  { id: "intermediate-goods", label: "Intermediate goods", explanation: "Intermediate goods are inputs used in producing other goods before final consumption.", sourceIds: ["MOSPI-IIP-METADATA"], sourceFactIds: ["iip-intermediate-goods"] },
  { id: "consumer-durables", label: "Consumer durables", explanation: "Consumer durable goods are final consumer goods expected to be used repeatedly over time.", sourceIds: ["MOSPI-IIP-METADATA"], sourceFactIds: ["iip-consumer-durables"] },
];

export function ecoCp018Fact(id: string): EcoCp018Fact {
  const fact = ECO_CP018_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-018 fact: ${id}`);
  return fact;
}
