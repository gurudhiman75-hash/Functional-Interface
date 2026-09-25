import type { EcoCp026SourceId } from "./eco-cp026-sources";
export type EcoCp026Fact={id:string;fact:string;sourceIds:EcoCp026SourceId[]};
export const ECO_CP026_FACTS_V1:EcoCp026Fact[]=[
  {id:"nddb-1965",fact:"The National Dairy Development Board was founded in 1965 to promote producer-owned dairy development.",sourceIds:["NDDB-GENESIS"]},
  {id:"operation-flood-1970",fact:"Operation Flood was launched in 1970.",sourceIds:["NDDB-OPERATION-FLOOD"]},
  {id:"operation-flood-phases",fact:"Operation Flood was implemented in three phases and the third phase ended in 1996.",sourceIds:["NDDB-GENESIS","NDDB-OPERATION-FLOOD"]},
  {id:"operation-flood-objectives",fact:"Operation Flood sought to increase milk production, augment rural incomes and provide reasonable prices to consumers.",sourceIds:["NDDB-OPERATION-FLOOD"]},
  {id:"milk-grid",fact:"Operation Flood built a National Milk Grid linking milk producers with urban consumers and reducing seasonal and regional price variation.",sourceIds:["NDDB-OPERATION-FLOOD"]},
  {id:"cooperative-base",fact:"Village milk producers' cooperatives formed the institutional base of Operation Flood.",sourceIds:["NDDB-OPERATION-FLOOD"]},
  {id:"white-revolution",fact:"Operation Flood ushered in India's White Revolution through expansion of cooperative dairying.",sourceIds:["NDDB-GENESIS","NDDB-KURIEN"]},
  {id:"kurien",fact:"Dr. Verghese Kurien was the founder chairman of NDDB and is known as the architect of India's White Revolution.",sourceIds:["NDDB-KURIEN"]},
  {id:"anand-model",fact:"Operation Flood spread the producer-owned cooperative dairy model associated with Anand/Amul to wider milk-sheds.",sourceIds:["NDDB-GENESIS","NDDB-OPERATION-FLOOD"]},
];
