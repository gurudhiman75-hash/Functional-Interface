import path from "node:path";
import process from "node:process";
import { build } from "esbuild";

const [entryPoint, outfile] = process.argv.slice(2);
if (!entryPoint || !outfile) {
  throw new Error(
    "Usage: node bundle-with-canonical-shell.mjs <entry-point> <outfile>",
  );
}

await build({
  entryPoints: [path.resolve(entryPoint)],
  outfile: path.resolve(outfile),
  bundle: true,
  packages: "external",
  platform: "node",
  format: "esm",
  plugins: [
    {
      name: "men-cp011-canonical-spherical-shell",
      setup(context) {
        context.onResolve(
          { filter: /^\.\/spherical-shells$/ },
          (args) => ({
            path: path.join(args.resolveDir, "spherical-shells-canonical.ts"),
          }),
        );
      },
    },
    {
      name: "men-cp011-canonical-ratio-percent",
      setup(context) {
        context.onResolve(
          { filter: /^\.\/ratio-percent$/ },
          (args) => ({
            path: path.join(args.resolveDir, "ratio-percent-canonical.ts"),
          }),
        );
      },
    },
  ],
});
