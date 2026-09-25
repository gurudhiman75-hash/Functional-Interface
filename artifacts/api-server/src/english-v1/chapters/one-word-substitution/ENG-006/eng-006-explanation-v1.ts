export function explainEng006OneWordV1(answer:string,definition:string){
  const d=definition.trim().replace(/[.]+$/g,"");
  if(/^a person who /i.test(d))return `“${answer}” describes ${d}.`;
  if(/^a person whose /i.test(d))return `“${answer}” describes ${d}.`;
  if(/^a person with /i.test(d))return `“${answer}” describes ${d}.`;
  if(/^a person /i.test(d))return `“${answer}” is the term for ${d}.`;
  if(/^a place /i.test(d))return `“${answer}” is the term for ${d}.`;
  if(/^(the act of|the process of|the practice of|the study of|the science of|the system of|the state of|the condition of|the murder of|the legal right to) /i.test(d))return `“${answer}” refers to ${d}.`;
  return `“${answer}” means ${d}.`;
}
