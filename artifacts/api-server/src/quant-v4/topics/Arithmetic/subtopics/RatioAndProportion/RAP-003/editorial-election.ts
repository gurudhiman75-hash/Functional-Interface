import type { Rap003Explanation, Rap003Parameters, Rap003SolverResult } from "./types";

function n(parameters: Rap003Parameters, key: string) {
  return Number(parameters.variables[key]);
}

function s(parameters: Rap003Parameters, key: string, fallback: string) {
  return String(parameters.variables[key] ?? fallback);
}

function answer(solver: Rap003SolverResult) {
  return String(solver.answer).replaceAll("$$", "").trim();
}

function shown(value: number) {
  return String(Math.round(value * 10000) / 10000);
}

function line(text: string, math?: string) {
  return math ? `${text}\n\n$$\\Rightarrow ${math}$$` : text;
}

function result(parameters: Rap003Parameters, lines: string[]): Rap003Explanation {
  return { explanationId: parameters.explanationId, lines };
}

function ratioParts(parameters: Rap003Parameters) {
  const ratioA = n(parameters, "voteRatioA");
  const ratioB = n(parameters, "voteRatioB");
  return { ratioA, ratioB, sum: ratioA + ratioB, difference: Math.abs(ratioA - ratioB) };
}

function turnoutChain(parameters: Rap003Parameters) {
  const totalVoters = n(parameters, "totalVoters");
  const turnoutPercent = n(parameters, "turnoutPercent");
  const validPercent = parameters.variables.validPercent !== undefined ? n(parameters, "validPercent") : 100 - n(parameters, "invalidPercent");
  const polledVotes = totalVoters * turnoutPercent / 100;
  const validVotes = polledVotes * validPercent / 100;
  return { totalVoters, turnoutPercent, validPercent, polledVotes, validVotes };
}

function winnerVotes(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const validVotes = n(parameters, "totalValidVotes");
  const { ratioA, ratioB, sum } = ratioParts(parameters);
  const winnerPart = Math.max(ratioA, ratioB);
  const final = answer(solver);
  return result(parameters, [
    line("Add the two candidate-ratio parts.", `${ratioA}+${ratioB}=${sum}`),
    line("The winner has the larger ratio part.", `\\max(${ratioA},${ratioB})=${winnerPart}`),
    line("Find the value of one vote-ratio part.", `1\\text{ part}=\\frac{${validVotes}}{${sum}}=${shown(validVotes / sum)}`),
    line("Multiply by the winner's ratio part.", `${shown(validVotes / sum)}\\times${winnerPart}=${final}`),
    "All valid votes are divided between the two candidates in the stated ratio.",
    "The winner's and loser's votes together equal the total valid votes.",
    `So, the winner received ${final} votes.`,
  ]);
}

function winningMargin(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const chain = turnoutChain(parameters);
  const { ratioA, ratioB, sum, difference } = ratioParts(parameters);
  const final = answer(solver);
  return result(parameters, [
    line("Calculate the number of polled votes.", `${chain.totalVoters}\\times\\frac{${chain.turnoutPercent}}{100}=${shown(chain.polledVotes)}`),
    line("Calculate the valid votes.", `${shown(chain.polledVotes)}\\times\\frac{${chain.validPercent}}{100}=${shown(chain.validVotes)}`),
    line("The two candidate-ratio parts add to", `${ratioA}+${ratioB}=${sum}`),
    line("Their ratio-part difference is", `|${ratioA}-${ratioB}|=${difference}`),
    line("The winning margin is the same fraction of valid votes.", `${shown(chain.validVotes)}\\times\\frac{${difference}}{${sum}}=${final}`),
    "Invalid votes are excluded before candidate shares are calculated.",
    `So, the winning margin is ${final} votes.`,
  ]);
}

function votersFromMargin(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const margin = n(parameters, "winningMargin");
  const { ratioA, ratioB, sum, difference } = ratioParts(parameters);
  const validPercent = n(parameters, "validPercent");
  const turnoutPercent = n(parameters, "turnoutPercent");
  const validVotes = margin * sum / difference;
  const polledVotes = validVotes * 100 / validPercent;
  const totalVoters = polledVotes * 100 / turnoutPercent;
  const final = answer(solver);
  return result(parameters, [
    line("The margin corresponds to the difference of the ratio parts.", `${difference}\\text{ parts}=${margin}`),
    line("Recover the total valid votes.", `\\text{valid votes}=${margin}\\times\\frac{${sum}}{${difference}}=${shown(validVotes)}`),
    line("Valid votes are only part of the polled votes.", `\\text{polled votes}=${shown(validVotes)}\\times\\frac{100}{${validPercent}}=${shown(polledVotes)}`),
    line("Polled votes are the turnout fraction of the electorate.", `\\text{total voters}=${shown(polledVotes)}\\times\\frac{100}{${turnoutPercent}}=${shown(totalVoters)}`),
    line("The complete reverse chain is", `${margin}\\rightarrow${shown(validVotes)}\\rightarrow${shown(polledVotes)}\\rightarrow${shown(totalVoters)}`),
    "Each percentage is reversed exactly once.",
    `So, the total number of voters is ${final}.`,
  ]);
}

function loserVotes(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const chain = turnoutChain(parameters);
  const { ratioA, ratioB, sum } = ratioParts(parameters);
  const loserPart = Math.min(ratioA, ratioB);
  const final = answer(solver);
  return result(parameters, [
    line("Calculate the polled votes.", `${chain.totalVoters}\\times\\frac{${chain.turnoutPercent}}{100}=${shown(chain.polledVotes)}`),
    line("Remove invalid votes to obtain valid votes.", `${shown(chain.polledVotes)}\\times\\frac{${chain.validPercent}}{100}=${shown(chain.validVotes)}`),
    line("The loser has the smaller vote-ratio part.", `\\min(${ratioA},${ratioB})=${loserPart}`),
    line("The total candidate-ratio parts are", `${ratioA}+${ratioB}=${sum}`),
    line("Calculate the loser's share.", `${shown(chain.validVotes)}\\times\\frac{${loserPart}}{${sum}}=${final}`),
    "The two candidates' votes add to the valid-vote total.",
    `So, the losing candidate received ${final} votes.`,
  ]);
}

function invalidVotes(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const totalVoters = n(parameters, "totalVoters");
  const turnout = n(parameters, "turnoutPercent");
  const invalidPercent = n(parameters, "invalidPercent");
  const polled = totalVoters * turnout / 100;
  const final = answer(solver);
  return result(parameters, [
    line("Calculate the number of polled votes.", `${totalVoters}\\times\\frac{${turnout}}{100}=${shown(polled)}`),
    line("Invalid-vote percentage is applied to polled votes, not total voters.", `${shown(polled)}\\times\\frac{${invalidPercent}}{100}`),
    line("Evaluate the invalid-vote count.", `${shown(polled)}\\times\\frac{${invalidPercent}}{100}=${final}`),
    "The remaining polled votes are valid votes.",
    line("Valid-vote percentage for checking", `${100}-${invalidPercent}=${100 - invalidPercent}\\%`),
    "Valid and invalid votes together equal all polled votes.",
    `So, the number of invalid votes is ${final}.`,
  ]);
}

function polledFromTurnout(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalVoters");
  const turnout = n(parameters, "turnoutPercent");
  const final = answer(solver);
  return result(parameters, [
    "Turnout percentage is measured against the full electorate.",
    line("Write the turnout fraction.", `\\frac{${turnout}}{100}`),
    line("Multiply by total voters.", `${total}\\times\\frac{${turnout}}{100}`),
    line("Evaluate the product.", `${total}\\times\\frac{${turnout}}{100}=${final}`),
    "The voters who did not turn out are excluded from polled votes.",
    line("Non-voters for checking", `${total}-${final}`),
    `So, the number of polled votes is ${final}.`,
  ]);
}

function validFromInvalid(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const polled = n(parameters, "polledVotes");
  const invalid = n(parameters, "invalidPercent");
  const validPercent = 100 - invalid;
  const final = answer(solver);
  return result(parameters, [
    line("Convert invalid percentage to valid percentage.", `100-${invalid}=${validPercent}\\%`),
    line("Apply the valid percentage to polled votes.", `${polled}\\times\\frac{${validPercent}}{100}`),
    line("Evaluate the product.", `${polled}\\times\\frac{${validPercent}}{100}=${final}`),
    "Invalid votes are removed from the polled-vote total.",
    line("Invalid votes for checking", `${polled}\\times\\frac{${invalid}}{100}`),
    "Valid and invalid votes together equal all polled votes.",
    `So, the number of valid votes is ${final}.`,
  ]);
}

function winnerFromMargin(parameters: Rap003Parameters, solver: Rap003SolverResult, target: "winner" | "loser") {
  const valid = n(parameters, "validVotes");
  const margin = n(parameters, "winningMargin");
  const winner = (valid + margin) / 2;
  const loser = (valid - margin) / 2;
  const final = answer(solver);
  return result(parameters, [
    "Let winner votes be W and loser votes be L.",
    line("Their total is the valid-vote count.", `W+L=${valid}`),
    line("Their difference is the winning margin.", `W-L=${margin}`),
    target === "winner"
      ? line("Add the two equations.", `2W=${valid}+${margin}`)
      : line("Subtract the margin equation from the total equation.", `2L=${valid}-${margin}`),
    target === "winner"
      ? line("Divide by 2.", `W=\\frac{${valid}+${margin}}{2}=${shown(winner)}=${final}`)
      : line("Divide by 2.", `L=\\frac{${valid}-${margin}}{2}=${shown(loser)}=${final}`),
    "The winner and loser counts add to the valid-vote total.",
    `So, the ${target} received ${final} votes.`,
  ]);
}

function threeCandidate(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const valid = n(parameters, "validVotes");
  const ratios = [n(parameters, "voteRatioA"), n(parameters, "voteRatioB"), n(parameters, "voteRatioC")];
  const sum = ratios.reduce((left, right) => left + right, 0);
  const winnerPart = Math.max(...ratios);
  const final = answer(solver);
  return result(parameters, [
    line("Add the three candidate-ratio parts.", `${ratios.join("+")}=${sum}`),
    line("Find the largest ratio part.", `\\max(${ratios.join(",")})=${winnerPart}`),
    line("One ratio part equals", `\\frac{${valid}}{${sum}}=${shown(valid / sum)}`),
    line("Multiply by the winner's part.", `${shown(valid / sum)}\\times${winnerPart}=${final}`),
    "The three candidate vote counts together equal all valid votes.",
    "The largest ratio part identifies the winning candidate.",
    `So, the winning candidate received ${final} votes.`,
  ]);
}

function candidateSharePercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { ratioA, ratioB, sum } = ratioParts(parameters);
  const candidate = s(parameters, "targetCandidate", s(parameters, "candidateA", "Candidate A"));
  const candidateB = s(parameters, "candidateB", "Candidate B");
  const part = candidate === candidateB ? ratioB : ratioA;
  const final = answer(solver);
  return result(parameters, [
    line("Add the two vote-ratio parts.", `${ratioA}+${ratioB}=${sum}`),
    line(`${candidate}'s fraction of valid votes is`, `\\frac{${part}}{${sum}}`),
    line("Convert the fraction to a percentage.", `\\frac{${part}}{${sum}}\\times100`),
    line("Evaluate the percentage.", `\\frac{${part}}{${sum}}\\times100=${final}`),
    "The other candidate receives the remaining percentage.",
    "The two candidate shares total 100% of valid votes.",
    `So, ${candidate}'s vote share is ${final}.`,
  ]);
}

function ratioFromPercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const percentA = n(parameters, "percentA");
  const percentB = n(parameters, "percentB");
  const final = answer(solver);
  return result(parameters, [
    "Candidate vote counts are proportional to their vote-share percentages.",
    line("Write the percentages as a ratio.", `${percentA}:${percentB}`),
    line("Find their common divisor and reduce.", `${percentA}:${percentB}=${final}`),
    "No total vote count is required because only a ratio is asked.",
    line("The two shares for checking add to", `${percentA}+${percentB}=${percentA + percentB}\\%`),
    "Both percentages refer to the same valid-vote total.",
    `So, the candidates' vote ratio is ${final}.`,
  ]);
}

function morePercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalValidVotes");
  const more = n(parameters, "morePercent");
  const ratioA = 100 + more;
  const ratioB = 100;
  const final = answer(solver);
  return result(parameters, [
    "Take the smaller candidate's votes as 100 ratio parts.",
    line("The larger candidate then has", `100+${more}=${ratioA}\\text{ parts}`),
    line("The two vote parts total", `${ratioA}+${ratioB}=${ratioA + ratioB}`),
    line("Find the larger candidate's share.", `${total}\\times\\frac{${ratioA}}{${ratioA + ratioB}}`),
    line("Evaluate the share.", `${total}\\times\\frac{${ratioA}}{${ratioA + ratioB}}=${final}`),
    "This interpretation treats 'more percent' as relative to the smaller candidate's votes.",
    `So, the larger candidate received ${final} votes.`,
  ]);
}

function marginPercent(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const { ratioA, ratioB, sum, difference } = ratioParts(parameters);
  const final = answer(solver);
  return result(parameters, [
    line("Add the candidate-ratio parts.", `${ratioA}+${ratioB}=${sum}`),
    line("Find the ratio-part difference.", `|${ratioA}-${ratioB}|=${difference}`),
    line("Margin as a fraction of valid votes is", `\\frac{${difference}}{${sum}}`),
    line("Convert this fraction to a percentage.", `\\frac{${difference}}{${sum}}\\times100=${final}`),
    "The actual valid-vote total cancels in this ratio calculation.",
    "The percentage is measured against valid votes, not total voters.",
    `So, the margin is ${final} of valid votes.`,
  ]);
}

function electorateFromCandidate(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const candidateVotes = n(parameters, "candidateVotes");
  const ratioA = n(parameters, "candidateRatioA");
  const ratioB = n(parameters, "candidateRatioB");
  const validPercent = n(parameters, "validPercent");
  const turnout = n(parameters, "turnoutPercent");
  const validVotes = candidateVotes * (ratioA + ratioB) / ratioA;
  const polled = validVotes * 100 / validPercent;
  const electorate = polled * 100 / turnout;
  const final = answer(solver);
  return result(parameters, [
    line("Recover total valid votes from the candidate's ratio share.", `${candidateVotes}\\times\\frac{${ratioA + ratioB}}{${ratioA}}=${shown(validVotes)}`),
    line("Reverse the valid-vote percentage.", `${shown(validVotes)}\\times\\frac{100}{${validPercent}}=${shown(polled)}`),
    line("Reverse the turnout percentage.", `${shown(polled)}\\times\\frac{100}{${turnout}}=${shown(electorate)}`),
    line("The reverse chain is", `${candidateVotes}\\rightarrow${shown(validVotes)}\\rightarrow${shown(polled)}\\rightarrow${shown(electorate)}`),
    "The candidate's votes are first expanded to all valid votes.",
    "Each later percentage is reversed exactly once.",
    `So, the total electorate is ${final}.`,
  ]);
}

function marketShare(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalMarket");
  const ratioA = n(parameters, "shareRatioA");
  const ratioB = n(parameters, "shareRatioB");
  const winnerPart = Math.max(ratioA, ratioB);
  const final = answer(solver);
  return result(parameters, [
    line("Add the market-share ratio parts.", `${ratioA}+${ratioB}=${ratioA + ratioB}`),
    line("The larger brand has", `${winnerPart}\\text{ parts}`),
    line("One ratio part of the market equals", `\\frac{${total}}{${ratioA + ratioB}}=${shown(total / (ratioA + ratioB))}`),
    line("Multiply by the leading brand's parts.", `${shown(total / (ratioA + ratioB))}\\times${winnerPart}=${final}`),
    "The two brands' values together equal the complete market value.",
    "This is a market-value calculation, not a vote count.",
    `So, the leading brand's market value is ${final}.`,
  ]);
}

function surveyShare(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalResponses");
  const yes = n(parameters, "yesRatio");
  const no = n(parameters, "noRatio");
  const final = answer(solver);
  return result(parameters, [
    line("Add the response-ratio parts.", `${yes}+${no}=${yes + no}`),
    line("One response-ratio part equals", `\\frac{${total}}{${yes + no}}=${shown(total / (yes + no))}`),
    line("Yes responses correspond to", `${yes}\\text{ parts}`),
    line("Calculate the yes responses.", `${shown(total / (yes + no))}\\times${yes}=${final}`),
    "Yes and no responses together equal all recorded responses.",
    "The response ratio refers to counts, not percentages of another subset.",
    `So, the number of yes responses is ${final}.`,
  ]);
}

function nota(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const total = n(parameters, "totalVoters");
  const turnout = n(parameters, "turnoutPercent");
  const nota = n(parameters, "notaPercent");
  const polled = total * turnout / 100;
  const final = answer(solver);
  return result(parameters, [
    line("Find the number of polled votes.", `${total}\\times\\frac{${turnout}}{100}=${shown(polled)}`),
    "NOTA percentage is applied to the polled-vote total.",
    line("Calculate NOTA votes.", `${shown(polled)}\\times\\frac{${nota}}{100}`),
    line("Evaluate the result.", `${shown(polled)}\\times\\frac{${nota}}{100}=${final}`),
    "Voters who did not turn out cannot cast a NOTA vote.",
    "All NOTA votes are included among polled votes.",
    `So, the number of NOTA votes is ${final}.`,
  ]);
}

function reverseTurnout(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const valid = n(parameters, "validVotes");
  const validPercent = n(parameters, "validPercent");
  const total = n(parameters, "totalVoters");
  const polled = valid * 100 / validPercent;
  const turnout = polled * 100 / total;
  const final = answer(solver);
  return result(parameters, [
    line("Reverse the valid-vote percentage to recover polled votes.", `${valid}\\times\\frac{100}{${validPercent}}=${shown(polled)}`),
    line("Turnout percentage equals polled votes divided by total voters.", `\\frac{${shown(polled)}}{${total}}\\times100`),
    line("Evaluate the turnout percentage.", `\\frac{${shown(polled)}}{${total}}\\times100=${shown(turnout)}=${final}`),
    "Valid votes are a subset of polled votes.",
    "Polled votes are a subset of the full electorate.",
    "The two percentage directions are therefore different.",
    `So, the turnout was ${final}.`,
  ]);
}

function marginChain(parameters: Rap003Parameters, solver: Rap003SolverResult) {
  const margin = n(parameters, "winningMargin");
  const ratioA = n(parameters, "voteRatioA");
  const ratioB = n(parameters, "voteRatioB");
  const invalid = n(parameters, "invalidPercent");
  const turnout = n(parameters, "turnoutPercent");
  const sum = ratioA + ratioB;
  const diff = Math.abs(ratioA - ratioB);
  const valid = margin * sum / diff;
  const polled = valid * 100 / (100 - invalid);
  const total = polled * 100 / turnout;
  const final = answer(solver);
  return result(parameters, [
    line("Recover valid votes from the winning margin.", `${margin}\\times\\frac{${sum}}{${diff}}=${shown(valid)}`),
    line("Convert invalid rate to valid-vote rate.", `100-${invalid}=${100 - invalid}\\%`),
    line("Reverse the valid-vote rate to find polled votes.", `${shown(valid)}\\times\\frac{100}{${100 - invalid}}=${shown(polled)}`),
    line("Reverse turnout to find the electorate.", `${shown(polled)}\\times\\frac{100}{${turnout}}=${shown(total)}`),
    line("The reverse chain is", `${margin}\\rightarrow${shown(valid)}\\rightarrow${shown(polled)}\\rightarrow${shown(total)}`),
    "Margin, valid votes, polled votes, and electorate are four different levels.",
    `So, the total number of voters is ${final}.`,
  ]);
}

export function renderRap003ElectionExplanation(
  parameters: Rap003Parameters,
  solver: Rap003SolverResult,
  explanation: Rap003Explanation,
): Rap003Explanation {
  if (parameters.language !== "en") return explanation;
  switch (parameters.taskKind) {
    case "electionWinnerVotes": return winnerVotes(parameters, solver);
    case "electionWinningMargin": return winningMargin(parameters, solver);
    case "electionTotalVotersFromMargin": return votersFromMargin(parameters, solver);
    case "electionLoserVotes": return loserVotes(parameters, solver);
    case "electionInvalidVotes": return invalidVotes(parameters, solver);
    case "electionPolledVotesFromTurnout": return polledFromTurnout(parameters, solver);
    case "electionValidVotesFromInvalidRate": return validFromInvalid(parameters, solver);
    case "electionWinnerFromMarginAndValidVotes": return winnerFromMargin(parameters, solver, "winner");
    case "electionLoserFromMarginAndValidVotes": return winnerFromMargin(parameters, solver, "loser");
    case "electionThreeCandidateSplit": return threeCandidate(parameters, solver);
    case "electionCandidateSharePercent": return candidateSharePercent(parameters, solver);
    case "electionRatioFromVoteSharePercent": return ratioFromPercent(parameters, solver);
    case "electionOneCandidateMorePercent": return morePercent(parameters, solver);
    case "electionMarginAsPercentOfValid": return marginPercent(parameters, solver);
    case "electionTotalElectorateFromCandidateVotes": return electorateFromCandidate(parameters, solver);
    case "marketShareWinner": return marketShare(parameters, solver);
    case "surveyResponseShare": return surveyShare(parameters, solver);
    case "electionNotaInvalidStyle": return nota(parameters, solver);
    case "electionReverseTurnoutFromValidVotes": return reverseTurnout(parameters, solver);
    case "electionMarginDifferenceChain": return marginChain(parameters, solver);
    default: return explanation;
  }
}
