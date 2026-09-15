export type EcoCp014Fact = {
  id: string;
  label: string;
  explanation: string;
  sourceIds: string[];
  sourceFactIds: string[];
};

export const ECO_CP014_FACTS_V1: EcoCp014Fact[] = [
  {
    id: "direct-tax",
    label: "Direct tax",
    explanation: "A direct tax is imposed directly on the income or profits of the person or entity liable to pay it; personal income tax and corporation tax are standard examples.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["direct-tax-income-corporation"],
  },
  {
    id: "indirect-tax",
    label: "Indirect tax",
    explanation: "An indirect tax is imposed on transactions or supplies and its burden can generally be passed through prices; GST and customs duties are standard examples.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX", "CBIC-GST-ABOUT", "CBIC-CUSTOMS-ACT-S12"],
    sourceFactIds: ["indirect-tax-gst-customs"],
  },
  {
    id: "progressive-tax",
    label: "Progressive tax",
    explanation: "Under progressive taxation, the tax rate rises as the taxable income or tax base rises, so higher-income taxpayers face a higher rate.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["progressive-income-tax"],
  },
  {
    id: "proportional-tax",
    label: "Proportional tax",
    explanation: "Under proportional taxation, the same tax rate applies across different levels of the tax base, so tax paid rises in proportion to the base.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["proportional-rate"],
  },
  {
    id: "regressive-tax",
    label: "Regressive tax",
    explanation: "A regressive tax structure takes a larger share of income from lower-income taxpayers than from higher-income taxpayers even if the statutory tax per transaction is the same.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["regressive-concept"],
  },
  {
    id: "tax-impact-incidence",
    label: "Tax impact and incidence",
    explanation: "Tax impact refers to the person on whom a tax is initially imposed, while tax incidence refers to the person who ultimately bears the economic burden after any shifting.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["tax-burden-shifting"],
  },
  {
    id: "gst-launch",
    label: "GST launch",
    explanation: "Goods and Services Tax was introduced in India from 1 July 2017 after the Constitution (One Hundred and First Amendment) Act, 2016 created the constitutional framework for GST.",
    sourceIds: ["CBIC-101-AMENDMENT", "CBIC-GST-ABOUT", "GST-COUNCIL-ARTICLE-279A"],
    sourceFactIds: ["gst-101st-amendment", "gst-1-july-2017"],
  },
  {
    id: "gst-destination",
    label: "Destination-based consumption tax",
    explanation: "GST is destination-based: tax revenue is intended to accrue to the jurisdiction where goods or services are consumed rather than where they originate.",
    sourceIds: ["CBIC-GST-ABOUT"],
    sourceFactIds: ["gst-destination-consumption"],
  },
  {
    id: "gst-value-addition",
    label: "Tax on value addition",
    explanation: "GST taxes value addition through the production and distribution chain, with credit for eligible tax paid at earlier stages so cascading is reduced.",
    sourceIds: ["CBIC-GST-ABOUT"],
    sourceFactIds: ["gst-value-addition-itc"],
  },
  {
    id: "input-tax-credit",
    label: "Input Tax Credit",
    explanation: "Input Tax Credit allows eligible tax paid on business inputs to be credited against output tax liability, helping ensure tax falls mainly on value added.",
    sourceIds: ["CBIC-GST-ABOUT", "CBIC-GST-DESIGN"],
    sourceFactIds: ["gst-itc-setoff"],
  },
  {
    id: "dual-gst",
    label: "Dual GST model",
    explanation: "India follows a dual GST model in which the Centre and States levy GST concurrently on a common supply base within their constitutional powers.",
    sourceIds: ["CBIC-GST-DESIGN", "CBIC-101-AMENDMENT"],
    sourceFactIds: ["dual-gst-centre-states"],
  },
  {
    id: "intra-state-gst",
    label: "CGST plus SGST or UTGST",
    explanation: "For a taxable intra-State supply, Central GST and State GST are generally levied together; in relevant Union Territories, UTGST operates in place of SGST.",
    sourceIds: ["CBIC-GST-DESIGN"],
    sourceFactIds: ["intra-state-cgst-sgst-utgst"],
  },
  {
    id: "inter-state-igst",
    label: "IGST on inter-State supply",
    explanation: "Inter-State supplies are subject to Integrated GST, with Article 269A providing for levy and collection by the Government of India and apportionment between the Union and States.",
    sourceIds: ["CBIC-GST-DESIGN", "CBIC-101-AMENDMENT"],
    sourceFactIds: ["inter-state-igst", "article-269a-apportionment"],
  },
  {
    id: "article-246a",
    label: "Article 246A",
    explanation: "Article 246A gives Parliament and State Legislatures power to make GST laws, while Parliament has exclusive power for GST on inter-State supplies.",
    sourceIds: ["CBIC-101-AMENDMENT"],
    sourceFactIds: ["article-246a-gst-power"],
  },
  {
    id: "article-269a",
    label: "Article 269A",
    explanation: "Article 269A deals with GST on inter-State trade or commerce and provides for levy and collection by the Government of India with apportionment between the Union and States.",
    sourceIds: ["CBIC-101-AMENDMENT"],
    sourceFactIds: ["article-269a-igst"],
  },
  {
    id: "article-279a",
    label: "Article 279A",
    explanation: "Article 279A provides for the GST Council, a constitutional joint forum of the Union and States that makes recommendations on important GST matters.",
    sourceIds: ["GST-COUNCIL-ARTICLE-279A", "CBIC-101-AMENDMENT"],
    sourceFactIds: ["article-279a-gst-council"],
  },
  {
    id: "gst-council-composition",
    label: "GST Council composition",
    explanation: "The GST Council is chaired by the Union Finance Minister and includes the Union Minister of State in charge of Revenue or Finance and the finance/taxation minister or nominee of each State.",
    sourceIds: ["GST-COUNCIL-ARTICLE-279A"],
    sourceFactIds: ["gst-council-members"],
  },
  {
    id: "customs-duty",
    label: "Customs duty",
    explanation: "Customs duty is an indirect tax levied under customs law on goods imported into or exported from India, subject to the applicable tariff law.",
    sourceIds: ["CBIC-CUSTOMS-ACT-S12", "NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["customs-import-export-goods"],
  },
  {
    id: "income-tax",
    label: "Income tax",
    explanation: "Personal income tax is a direct tax because the legal liability is imposed directly on the income of the taxpayer.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["income-tax-direct"],
  },
  {
    id: "corporation-tax",
    label: "Corporation tax",
    explanation: "Corporation tax is a direct tax on company profits and is borne by the company as the taxpayer under the tax law.",
    sourceIds: ["NCERT-GOVT-BUDGET-TAX"],
    sourceFactIds: ["corporation-tax-direct"],
  },
];

export function ecoCp014Fact(id: string): EcoCp014Fact {
  const fact = ECO_CP014_FACTS_V1.find((row) => row.id === id);
  if (!fact) throw new Error(`Unknown ECO-CP-014 fact: ${id}`);
  return fact;
}
