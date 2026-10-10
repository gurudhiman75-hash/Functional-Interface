import type { ReactNode } from "react";
import { MathJaxContext } from "better-react-mathjax";

const MATH_JAX_CONFIG = {
  loader: { load: ["input/tex", "output/chtml", "[tex]/ams", "[tex]/boldsymbol"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
    packages: { "[+]": ["ams", "boldsymbol"] },
  },
  options: { ignoreHtmlClass: "tex2jax_ignore", processHtmlClass: "math-only" },
};

export default function MathJaxRouteProvider({ children }: { children: ReactNode }) {
  return (
    <MathJaxContext version={3} config={MATH_JAX_CONFIG}>
      {children}
    </MathJaxContext>
  );
}
