export function compactCp006CaseTeaching(explanation:string):string {
  const paragraphs=explanation.split("\n\n");
  const start=paragraphs.findIndex((paragraph)=>paragraph==="Start with these conditions:"||paragraph==="Start with this condition:");
  if(start<0) return explanation;
  const casesIndex=paragraphs.findIndex((paragraph,index)=>index>start&&/^At this point, \d+ cases are possible:$/.test(paragraph));
  if(casesIndex<0) return explanation;

  const actions=paragraphs.slice(start+1,casesIndex);
  const membershipPattern=/^\d+\. Put .+ in the (?:upper|lower) row\. Keep the exact seat open until another condition fixes it\.$/;
  const membershipCount=actions.filter((paragraph)=>membershipPattern.test(paragraph)).length;
  if(membershipCount<2) return explanation;

  const positional=actions.filter((paragraph)=>!membershipPattern.test(paragraph));
  const compacted=[
    "1. Mark the given upper-row and lower-row groups first. Keep their exact order open.",
    ...positional.map((paragraph,index)=>paragraph.replace(/^\d+\./,`${index+2}.`)),
  ];
  return [...paragraphs.slice(0,start+1),...compacted,...paragraphs.slice(casesIndex)].join("\n\n");
}
