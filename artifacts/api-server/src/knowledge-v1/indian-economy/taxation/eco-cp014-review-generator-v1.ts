import type { KnowledgeV1Difficulty } from "../../types";
import { ecoCp014Fact } from "./eco-cp014-facts";
import type { EcoCp014ReviewQuestion } from "./eco-cp014-review-types";

const qlNames: Record<number, string> = {
  1: "Taxation purpose and direct-indirect distinction",
  2: "Progressive proportional and regressive taxation",
  3: "Tax burden shifting and incidence",
  4: "GST history and constitutional foundation",
  5: "Destination-based GST value addition and input credit",
  6: "CGST SGST and UTGST on intra-State supplies",
  7: "IGST and inter-State supplies",
  8: "GST Council and Articles 246A 269A 279A",
  9: "Customs duty basics",
  10: "Income tax and corporation tax",
  11: "Statement evaluation",
  12: "Mixed close taxation distinctions",
};

function difficultyForVariant(ql: number, row: number): KnowledgeV1Difficulty {
  if (ql <= 4) return row < 2 ? "Easy" : row === 2 ? "Medium" : "Hard";
  if (ql <= 8) return row === 0 ? "Easy" : row < 3 ? "Medium" : "Hard";
  if (ql <= 10) return row === 0 ? "Easy" : row === 1 ? "Medium" : "Hard";
  return row === 0 ? "Medium" : "Hard";
}

function sourceBundle(ids: string[]) {
  const facts = ids.map(ecoCp014Fact);
  return {
    sourceIds: [...new Set(facts.flatMap((fact) => fact.sourceIds))],
    sourceFactIds: [...new Set(facts.flatMap((fact) => fact.sourceFactIds))],
  };
}

type Case = {
  stem: string;
  correct: string;
  options: string[];
  explanation: string;
  factIds: string[];
};

const qlCases: Record<number, Case[]> = {
  1: [
    { stem: "Which of the following is a direct tax?", correct: "Personal income tax", options: ["Personal income tax", "GST", "Customs duty", "Tax collected on a retail supply"], explanation: "Personal income tax is imposed directly on the taxpayer's income. GST and customs duty are indirect taxes linked to supplies or goods.", factIds: ["direct-tax", "income-tax", "indirect-tax"] },
    { stem: "Which feature best distinguishes an indirect tax from a direct tax?", correct: "Its economic burden can generally be passed to another person through the price", options: ["Its economic burden can generally be passed to another person through the price", "It is always imposed only on company profits", "It can never affect consumers", "It is collected only by State Governments"], explanation: "Indirect taxes are commonly collected from one person and passed through prices to another. Direct taxes are imposed directly on the income or profits of the liable taxpayer.", factIds: ["direct-tax", "indirect-tax", "tax-impact-incidence"] },
    { stem: "A tax is imposed directly on a company's profits and the company is legally liable to pay it. How should this tax be classified?", correct: "Direct tax", options: ["Direct tax", "Indirect tax", "Customs duty", "Consumption tax only"], explanation: "A tax imposed directly on company profits is a direct tax. Corporation tax is the standard example of this structure.", factIds: ["direct-tax", "corporation-tax"] },
    { stem: "A shop collects a tax from the buyer as part of the sale price and later deposits it with Government. Which feature of taxation does this illustrate?", correct: "An indirect tax can be shifted through the transaction price", options: ["An indirect tax can be shifted through the transaction price", "A direct tax must always be paid by the buyer", "A progressive tax must be collected at every sale", "Corporation tax is a consumption tax"], explanation: "The seller may be the person responsible for collection, while the buyer bears the tax through the price. That shifting of burden is characteristic of an indirect tax.", factIds: ["indirect-tax", "tax-impact-incidence"] },
  ],
  2: [
    { stem: "In which tax structure does the tax rate rise as taxable income rises?", correct: "Progressive taxation", options: ["Progressive taxation", "Proportional taxation", "Regressive taxation", "Destination taxation"], explanation: "A progressive tax applies a higher rate as the taxable income or base rises. It is used as a redistribution tool in public finance.", factIds: ["progressive-tax"] },
    { stem: "Which tax structure applies the same tax rate to different levels of the tax base?", correct: "Proportional taxation", options: ["Proportional taxation", "Progressive taxation", "Regressive taxation", "Indirect taxation"], explanation: "A proportional tax keeps the rate unchanged across different levels of the tax base. The amount paid rises in proportion to the base.", factIds: ["proportional-tax"] },
    { stem: "A tax takes a larger percentage of income from a low-income household than from a high-income household. Which structure does this describe?", correct: "Regressive taxation", options: ["Regressive taxation", "Progressive taxation", "Proportional taxation", "Destination-based taxation"], explanation: "A regressive structure places a relatively heavier burden on lower incomes. The key is the share of income taken, not simply the rupee amount paid.", factIds: ["regressive-tax"] },
    { stem: "Two taxpayers face the same statutory tax rate, but the tax absorbs a larger share of the poorer taxpayer's income. Which statement is most accurate?", correct: "The burden is regressive even though the statutory rate on the taxed transaction may be the same", options: ["The burden is regressive even though the statutory rate on the taxed transaction may be the same", "The tax is automatically progressive", "The tax is proportional to income by definition", "The tax becomes a direct tax"], explanation: "Regressivity is about the tax burden relative to income. A uniform transaction tax can therefore have a regressive effect across households with different incomes.", factIds: ["regressive-tax", "indirect-tax"] },
  ],
  3: [
    { stem: "What does tax incidence refer to?", correct: "The person who ultimately bears the economic burden of the tax", options: ["The person who ultimately bears the economic burden of the tax", "Only the officer who collects the tax", "The law that creates the tax", "The date on which a return is filed"], explanation: "Tax incidence concerns the final economic burden after any shifting has occurred. It may differ from the person on whom the tax is initially imposed.", factIds: ["tax-impact-incidence"] },
    { stem: "What does the initial impact of a tax refer to?", correct: "The person on whom the tax is first imposed or collected", options: ["The person on whom the tax is first imposed or collected", "The final consumer in every case", "Only the Government receiving the tax", "The tax rate after inflation"], explanation: "Tax impact is the initial point at which the liability or collection falls. Tax incidence is the final economic burden after possible shifting.", factIds: ["tax-impact-incidence"] },
    { stem: "A producer is legally liable to collect a tax but raises the selling price so consumers bear most of the cost. How are impact and incidence separated here?", correct: "Impact is on the producer while incidence is largely on consumers", options: ["Impact is on the producer while incidence is largely on consumers", "Impact and incidence are both necessarily on Government", "Impact is on consumers while incidence is on the tax officer", "No tax shifting has occurred"], explanation: "The producer is the initial collection point, so the impact begins there. Because the price rises, consumers ultimately bear much of the burden, so incidence shifts to them.", factIds: ["tax-impact-incidence", "indirect-tax"] },
    { stem: "Why is tax shifting more closely associated with indirect taxes than with personal income tax?", correct: "Indirect taxes can be embedded in transaction prices, while personal income tax is imposed directly on the taxpayer's income", options: ["Indirect taxes can be embedded in transaction prices, while personal income tax is imposed directly on the taxpayer's income", "Income tax is always paid by retailers", "Indirect taxes are never included in prices", "Personal income tax is an import duty"], explanation: "Indirect taxes can move through the price mechanism from seller to buyer. Personal income tax is imposed directly on the person's income and is not normally shifted through a sale price.", factIds: ["tax-impact-incidence", "indirect-tax", "income-tax"] },
  ],
  4: [
    { stem: "On which date was GST introduced in India?", correct: "1 July 2017", options: ["1 July 2017", "1 April 2016", "8 September 2016", "1 January 2018"], explanation: "GST was rolled out across India from 1 July 2017. The constitutional framework had been created earlier through the 101st Constitutional Amendment in 2016.", factIds: ["gst-launch"] },
    { stem: "Which constitutional amendment created the enabling framework for GST in India?", correct: "Constitution (One Hundred and First Amendment) Act, 2016", options: ["Constitution (One Hundred and First Amendment) Act, 2016", "Constitution (Forty-second Amendment) Act, 1976", "Constitution (Seventy-third Amendment) Act, 1992", "Constitution (Eighty-sixth Amendment) Act, 2002"], explanation: "The 101st Constitutional Amendment created the constitutional GST architecture. GST was then introduced from 1 July 2017.", factIds: ["gst-launch", "article-246a", "article-279a"] },
    { stem: "Which sequence correctly describes the constitutional and operational introduction of GST?", correct: "101st Constitutional Amendment in 2016 followed by GST rollout on 1 July 2017", options: ["101st Constitutional Amendment in 2016 followed by GST rollout on 1 July 2017", "GST rollout in 2015 followed by the constitutional amendment in 2018", "GST Council in 2000 followed by GST rollout in 2001", "Income-tax reform in 2017 followed by GST abolition in 2018"], explanation: "The constitutional amendment came first in 2016. The operational GST regime followed on 1 July 2017.", factIds: ["gst-launch", "article-279a"] },
    { stem: "Why was a constitutional amendment needed before GST could operate in its present dual form?", correct: "It created concurrent GST law-making powers for the Union and States and the constitutional GST institutions", options: ["It created concurrent GST law-making powers for the Union and States and the constitutional GST institutions", "It transferred all taxation powers permanently to local bodies", "It abolished Parliament's role in inter-State taxation", "It converted income tax into GST"], explanation: "The GST framework required a new constitutional allocation of taxing power between Union and States. The amendment inserted provisions such as Articles 246A, 269A and 279A.", factIds: ["article-246a", "article-269a", "article-279a", "gst-launch"] },
  ],
  5: [
    { stem: "Why is GST described as a destination-based tax?", correct: "Revenue is intended to accrue where the goods or services are consumed", options: ["Revenue is intended to accrue where the goods or services are consumed", "Tax is always retained by the producing State", "Only imports are taxed", "The tax is based on the seller's place of birth"], explanation: "GST follows the destination principle. The consuming jurisdiction is the intended destination of the tax revenue rather than the place of origin.", factIds: ["gst-destination"] },
    { stem: "What is the main role of Input Tax Credit under GST?", correct: "It allows eligible tax paid on inputs to be set off against output tax liability", options: ["It allows eligible tax paid on inputs to be set off against output tax liability", "It converts GST into income tax", "It removes all tax from final consumption", "It applies only to customs exports"], explanation: "Input Tax Credit gives credit for eligible tax already paid at earlier stages. This helps tax only the value added at each stage and reduces cascading.", factIds: ["input-tax-credit", "gst-value-addition"] },
    { stem: "A firm pays GST on inputs and later sells its output. Which mechanism prevents the earlier tax from being fully taxed again?", correct: "Input Tax Credit", options: ["Input Tax Credit", "Vote on Account", "Corporation tax rebate by definition", "Customs valuation"], explanation: "Eligible input tax can be credited against output GST liability. This is the core mechanism that supports value-added taxation rather than tax-on-tax cascading.", factIds: ["input-tax-credit", "gst-value-addition"] },
    { stem: "A product is manufactured in one State but finally consumed in another. Which GST principle determines the State-side destination of revenue?", correct: "Destination principle based on the place of consumption", options: ["Destination principle based on the place of consumption", "Origin principle based only on the factory location", "Progressive income-tax principle", "Proportional corporation-tax principle"], explanation: "GST is designed as a destination-based consumption tax. The place of consumption, not merely the place of manufacture, guides the destination of the State component.", factIds: ["gst-destination", "inter-state-igst"] },
  ],
  6: [
    { stem: "Which taxes generally apply together on a taxable intra-State supply?", correct: "CGST and SGST", options: ["CGST and SGST", "IGST only", "Customs duty and income tax", "Corporation tax and IGST"], explanation: "Under India's dual GST model, an intra-State supply generally attracts the Central and State components together. In relevant Union Territories, UTGST operates in place of SGST.", factIds: ["dual-gst", "intra-state-gst"] },
    { stem: "What replaces SGST for an intra-Union-Territory supply where UTGST applies?", correct: "UTGST", options: ["UTGST", "IGST in every case", "Customs duty", "Corporation tax"], explanation: "UTGST is the Union Territory component corresponding to SGST where the UTGST framework applies. It operates alongside CGST on intra-jurisdiction supplies.", factIds: ["intra-state-gst"] },
    { stem: "A taxable supply begins and ends within the same State. Which GST structure is normally used?", correct: "CGST plus SGST", options: ["CGST plus SGST", "IGST only", "Customs duty only", "Income tax plus corporation tax"], explanation: "An intra-State taxable supply generally attracts both CGST and SGST. IGST is the inter-State mechanism.", factIds: ["intra-state-gst", "inter-state-igst"] },
    { stem: "Why is the intra-State GST model called dual rather than purely Central or purely State taxation?", correct: "The Centre and the State levy separate GST components concurrently on the same taxable supply base", options: ["The Centre and the State levy separate GST components concurrently on the same taxable supply base", "Only local bodies levy the tax", "The tax alternates between Centre and State each year", "The buyer chooses which Government receives the whole tax"], explanation: "India's GST design allows concurrent Central and State components on intra-State supplies. That concurrent structure is the essence of the dual GST model.", factIds: ["dual-gst", "intra-state-gst", "article-246a"] },
  ],
  7: [
    { stem: "Which GST is generally levied on an inter-State supply?", correct: "IGST", options: ["IGST", "SGST only", "CGST only", "Corporation tax"], explanation: "Inter-State supplies are handled through Integrated GST. The IGST mechanism preserves credit flow across State borders and allows apportionment between Union and States.", factIds: ["inter-state-igst"] },
    { stem: "Which constitutional Article specifically deals with GST on inter-State trade or commerce?", correct: "Article 269A", options: ["Article 269A", "Article 112", "Article 324", "Article 356"], explanation: "Article 269A addresses GST on inter-State supplies. It provides for levy and collection by the Government of India and apportionment between the Union and States.", factIds: ["article-269a", "inter-state-igst"] },
    { stem: "A seller in one State supplies goods to a buyer in another State. Which tax mechanism is designed for this transaction?", correct: "IGST", options: ["IGST", "Only SGST of the origin State", "Only CGST with no State component", "Personal income tax"], explanation: "A supply across State boundaries is an inter-State supply for GST purposes. IGST is the mechanism designed for such transactions.", factIds: ["inter-state-igst"] },
    { stem: "Which statement best distinguishes IGST from CGST plus SGST?", correct: "IGST applies to inter-State supplies, while CGST plus SGST generally applies to intra-State supplies", options: ["IGST applies to inter-State supplies, while CGST plus SGST generally applies to intra-State supplies", "IGST is a direct tax on salaries", "CGST plus SGST applies only to imports", "IGST and corporation tax are the same levy"], explanation: "The core distinction is the location relationship of the supply. Intra-State supplies use the dual Central-State components, while inter-State supplies use IGST.", factIds: ["intra-state-gst", "inter-state-igst"] },
  ],
  8: [
    { stem: "Which constitutional Article provides for the GST Council?", correct: "Article 279A", options: ["Article 279A", "Article 246", "Article 112", "Article 360"], explanation: "Article 279A establishes the GST Council. The Council is a constitutional forum through which the Union and States make recommendations on GST matters.", factIds: ["article-279a", "gst-council-composition"] },
    { stem: "Who chairs the GST Council?", correct: "Union Finance Minister", options: ["Union Finance Minister", "RBI Governor", "Prime Minister by constitutional requirement", "Chairperson of CBDT"], explanation: "Article 279A makes the Union Finance Minister the Chairperson of the GST Council. State finance or taxation ministers or their nominees are also members.", factIds: ["gst-council-composition"] },
    { stem: "Which Article gives Parliament and State Legislatures power to make laws with respect to GST, subject to the special rule for inter-State supplies?", correct: "Article 246A", options: ["Article 246A", "Article 269A", "Article 279A", "Article 110"], explanation: "Article 246A creates the core GST legislative power for Parliament and States. Parliament has exclusive power under that Article for inter-State GST law-making.", factIds: ["article-246a"] },
    { stem: "Which matching of GST Articles is correct?", correct: "Article 246A—GST law-making power; Article 269A—inter-State GST; Article 279A—GST Council", options: ["Article 246A—GST law-making power; Article 269A—inter-State GST; Article 279A—GST Council", "Article 246A—Annual Financial Statement; Article 269A—income tax; Article 279A—RBI", "Article 246A—customs valuation; Article 269A—corporation tax; Article 279A—Finance Commission", "Article 246A—GST Council; Article 269A—State Budget; Article 279A—Public Account"], explanation: "The three Articles perform distinct functions in the GST architecture. Article 246A allocates law-making power, Article 269A handles inter-State GST, and Article 279A establishes the Council.", factIds: ["article-246a", "article-269a", "article-279a"] },
  ],
  9: [
    { stem: "Which tax is imposed on goods imported into India under customs law?", correct: "Customs duty", options: ["Customs duty", "Personal income tax", "Corporation tax", "Property tax"], explanation: "Customs law provides for duties on imported and, where applicable, exported goods. It is an indirect tax connected with cross-border movement of goods.", factIds: ["customs-duty", "indirect-tax"] },
    { stem: "How should customs duty generally be classified in the direct-indirect tax distinction?", correct: "Indirect tax", options: ["Indirect tax", "Direct tax on personal income", "Direct tax on company profits", "Non-tax revenue"], explanation: "Customs duty is levied on goods moving across the border rather than directly on income or profits. Its burden can be reflected in the price of the goods.", factIds: ["customs-duty", "indirect-tax"] },
    { stem: "An importer pays customs duty and incorporates that cost into the selling price. Which taxation concept is illustrated?", correct: "The burden of an indirect tax can be shifted through price", options: ["The burden of an indirect tax can be shifted through price", "Customs duty becomes a direct income tax", "Tax incidence must remain with the importer", "Corporation tax has replaced customs duty"], explanation: "The importer is the initial payer, but the economic burden can be passed to buyers through a higher price. This illustrates tax shifting and incidence in an indirect tax.", factIds: ["customs-duty", "tax-impact-incidence", "indirect-tax"] },
  ],
  10: [
    { stem: "How is personal income tax generally classified?", correct: "Direct tax", options: ["Direct tax", "Indirect tax", "Customs duty", "GST component"], explanation: "Personal income tax is imposed directly on the taxpayer's income. It is therefore a standard direct-tax example.", factIds: ["income-tax", "direct-tax"] },
    { stem: "How is corporation tax generally classified?", correct: "Direct tax", options: ["Direct tax", "Indirect tax", "GST", "Customs duty"], explanation: "Corporation tax is levied directly on company profits. It therefore belongs to the direct-tax category.", factIds: ["corporation-tax", "direct-tax"] },
    { stem: "Which pair contains only direct taxes?", correct: "Personal income tax and corporation tax", options: ["Personal income tax and corporation tax", "GST and customs duty", "Income tax and GST", "Corporation tax and customs duty"], explanation: "Income tax and corporation tax are direct taxes on income or profits. GST and customs duty are indirect taxes linked to supplies or goods.", factIds: ["income-tax", "corporation-tax", "direct-tax", "indirect-tax"] },
  ],
  11: [
    { stem: "Consider the statements. I. GST is destination-based. II. IGST generally applies to inter-State supplies. Which option is correct?", correct: "Both I and II", options: ["I only", "II only", "Both I and II", "Neither I nor II"], explanation: "Statement I is correct because GST follows the place of consumption. Statement II is also correct because IGST is the inter-State GST mechanism.", factIds: ["gst-destination", "inter-state-igst"] },
    { stem: "Consider the statements. I. Article 246A deals with GST law-making power. II. Article 279A provides for the GST Council. Which option is correct?", correct: "Both I and II", options: ["I only", "II only", "Both I and II", "Neither I nor II"], explanation: "Statement I correctly identifies Article 246A. Statement II correctly identifies Article 279A, so both statements are true.", factIds: ["article-246a", "article-279a"] },
    { stem: "Consider the statements. I. Customs duty is a direct tax on personal income. II. Corporation tax is a direct tax. Which option is correct?", correct: "II only", options: ["I only", "II only", "Both I and II", "Neither I nor II"], explanation: "Statement I is false because customs duty is an indirect tax on cross-border goods. Statement II is correct because corporation tax is imposed directly on company profits.", factIds: ["customs-duty", "corporation-tax", "direct-tax", "indirect-tax"] },
  ],
  12: [
    { stem: "Which combination correctly distinguishes tax type, GST location and constitutional role?", correct: "Income tax—direct; inter-State supply—IGST; GST Council—Article 279A", options: ["Income tax—direct; inter-State supply—IGST; GST Council—Article 279A", "Income tax—indirect; inter-State supply—SGST only; GST Council—Article 112", "Customs duty—direct; intra-State supply—IGST only; GST Council—Article 269A", "Corporation tax—indirect; inter-State supply—CGST plus SGST; GST Council—Article 246"], explanation: "Income tax is direct, IGST is the inter-State GST mechanism, and Article 279A establishes the GST Council. The three distinctions operate at different levels of the tax system.", factIds: ["income-tax", "inter-state-igst", "article-279a"] },
    { stem: "A taxable supply is consumed in State B after originating in State A. Which pair of ideas is most relevant to the GST treatment?", correct: "Destination-based taxation and the inter-State IGST mechanism", options: ["Destination-based taxation and the inter-State IGST mechanism", "Progressive income taxation and SGST of the origin State only", "Corporation tax and Public Account", "Customs duty and Vote on Account"], explanation: "The supply crosses State boundaries, so IGST is the relevant mechanism. Because GST is destination-based, the place of consumption is central to the revenue destination.", factIds: ["gst-destination", "inter-state-igst", "article-269a"] },
    { stem: "Which statement best separates a progressive direct tax from a destination-based indirect tax?", correct: "The first changes the rate with the tax base, while the second allocates consumption-tax revenue toward the place of consumption", options: ["The first changes the rate with the tax base, while the second allocates consumption-tax revenue toward the place of consumption", "Both terms describe the same tax rule", "Progressive taxation applies only to imports", "Destination taxation means the tax rate must rise with income"], explanation: "Progressivity describes how a tax rate changes with the tax base. Destination-based taxation instead describes where consumption-tax revenue is intended to accrue.", factIds: ["progressive-tax", "gst-destination", "direct-tax", "indirect-tax"] },
  ],
};

export const ECO_CP014_REVIEW_V1: EcoCp014ReviewQuestion[] = Object.entries(qlCases).flatMap(([qlKey, rows]) => {
  const ql = Number(qlKey);
  return rows.map((row, index) => {
    const bundle = sourceBundle(row.factIds);
    const target = (ql + index) % 4;
    const options = [...row.options];
    const current = options.indexOf(row.correct);
    [options[current], options[target]] = [options[target], options[current]];
    return {
      questionId: `ECO-CP-014-Q${String(ql).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
      chapterId: "ECO-001",
      cpId: "ECO-CP-014",
      qlId: `ECO-QL-${String(ql).padStart(2, "0")}`,
      qlName: qlNames[ql],
      difficulty: difficultyForVariant(ql, index),
      stem: row.stem,
      options,
      correctIndex: target,
      canonicalAnswer: row.correct,
      explanation: row.explanation,
      ...bundle,
      reviewOnly: true,
      runtimeRegistered: false,
    };
  });
});
