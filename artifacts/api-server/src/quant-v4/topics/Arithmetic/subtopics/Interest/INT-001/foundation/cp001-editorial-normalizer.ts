function capitaliseInitial(value: string): string {
  if (!value) return value;
  return `${value[0]!.toUpperCase()}${value.slice(1)}`;
}

export function normaliseIntCp001EditorialStem(stem: string): string {
  let result = stem.trim();

  result = result.replace(
    /^Using 365 days as one year, determine (.+)\?$/u,
    "Using a 365-day year, what is $1?",
  );
  result = result.replace(/Determine the sum invested\?$/u, "What sum was invested?");
  result = result.replace(/Determine the original sum\?$/u, "What was the original sum?");
  result = result.replace(/Determine the time\?$/u, "How long does this take?");
  result = result.replace(
    /Determine the proportional simple interest for (.+)\?$/u,
    "How much simple interest is earned in $1?",
  );
  result = result.replace(/Determine the (.+)\?$/u, "What is the $1?");

  result = result.replace(
    /the interest becomes (\d+\/\d+) times the principal/iu,
    "the interest equals $1 of the principal",
  );
  result = result.replace(
    /the simple interest is (\d+\/\d+) times the original sum/iu,
    "the simple interest equals $1 of the original sum",
  );
  result = result.replace(
    /the simple interest is (\d+\/\d+) times the principal/iu,
    "the simple interest is $1 of the principal",
  );
  result = result.replace(
    /the interest earned is (\d+\/\d+) times the principal/iu,
    "the interest earned is $1 of the principal",
  );
  result = result.replace(
    /interest equals (\d+\/\d+) times the original sum/iu,
    "interest equals $1 of the original sum",
  );
  result = result.replace(
    /simple interest equal to (\d+\/\d+) times its principal/iu,
    "simple interest equal to $1 of its principal",
  );

  return capitaliseInitial(result);
}
