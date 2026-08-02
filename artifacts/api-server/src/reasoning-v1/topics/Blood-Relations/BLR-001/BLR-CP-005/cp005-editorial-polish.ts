function possessive(name: string): string {
  return name.toLocaleLowerCase("en-IN").endsWith("s") ? `${name}'` : `${name}'s`;
}

export function polishCp005ModelAudit(lines: readonly string[]): string[] {
  return lines.map((source) => {
    let line = source.replace(/\.;/g, ";").replace(/\.\./g, ".");
    const isClaimAudit = /^Model \d+ \(.+?\): true statements? — /.test(line);
    const relationLine = isClaimAudit
      ? null
      : line.match(/^(Model \d+ \(.+?\): )(.+?) is (.+?) of ([^.]+)\.(.*)$/);
    if (relationLine) {
      const [, prefix, subject, relation, reference, suffix] = relationLine;
      line = `${prefix}${subject} is ${possessive(reference)} ${relation.toLocaleLowerCase("en-IN")}.${suffix}`;
    }
    return line;
  });
}
