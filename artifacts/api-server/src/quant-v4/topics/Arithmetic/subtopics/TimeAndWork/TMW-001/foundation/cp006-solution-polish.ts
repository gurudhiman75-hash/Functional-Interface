import type { TmwCp006Parameters, TmwCp006RegistryEntry, TmwCp006Solution } from "./cp006-types";

export function polishTmwCp006Solution(entry:TmwCp006RegistryEntry,p:TmwCp006Parameters,solution:TmwCp006Solution):TmwCp006Solution{
  if(entry.solveMode!=="findCompletionWithBatchWorkerAdditions")return solution;
  return {
    ...solution,
    formulaLatex:solution.formulaLatex.replace("(n-1)b","(n-1)d"),
    workedLatex:solution.workedLatex.map(step=>step.replace("\\text{resource-days}",`\\text{${p.context.resourceTimeUnit}}`)),
  };
}
