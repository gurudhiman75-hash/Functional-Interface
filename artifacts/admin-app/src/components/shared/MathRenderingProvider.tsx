import { useEffect, type ReactNode } from 'react';

type MathJaxRuntime = {
  typesetPromise?: (elements?: Element[]) => Promise<void>;
  typesetClear?: (elements?: Element[]) => void;
  loader?: unknown;
  tex?: unknown;
  options?: unknown;
  startup?: unknown;
};

declare global {
  interface Window {
    MathJax?: MathJaxRuntime;
  }
}

const SCRIPT_ID = 'examtree-mathjax-script';
const SCRIPT_SRC = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-chtml.js';

function configureMathJax() {
  if (window.MathJax) return;
  window.MathJax = {
    loader: { load: ['input/tex', 'output/chtml', '[tex]/ams', '[tex]/boldsymbol'] },
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      packages: { '[+]': ['ams', 'boldsymbol'] },
    },
    options: {
      ignoreHtmlClass: 'tex2jax_ignore',
      processHtmlClass: 'math-only',
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'input', 'select', 'option'],
    },
    startup: { typeset: false },
  };
}

async function typeset(root: Element) {
  const mathJax = window.MathJax;
  if (!mathJax?.typesetPromise) return;
  mathJax.typesetClear?.([root]);
  await mathJax.typesetPromise([root]);
}

export function MathRenderingProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    configureMathJax();
    const root = document.getElementById('root');
    if (!root) return;

    let disposed = false;
    let timer = 0;
    let typesetting = false;
    let rerunRequested = false;

    const observer = new MutationObserver(() => scheduleTypeset());
    const observe = () => observer.observe(root, { childList: true, subtree: true, characterData: true });

    const runTypeset = async () => {
      if (disposed) return;
      if (typesetting) {
        rerunRequested = true;
        return;
      }
      typesetting = true;
      observer.disconnect();
      try {
        await typeset(root);
      } finally {
        typesetting = false;
        if (!disposed) observe();
        if (rerunRequested && !disposed) {
          rerunRequested = false;
          scheduleTypeset();
        }
      }
    };

    function scheduleTypeset() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void runTypeset(), 40);
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.src = SCRIPT_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener('load', scheduleTypeset);
    observe();
    scheduleTypeset();

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      observer.disconnect();
      script?.removeEventListener('load', scheduleTypeset);
    };
  }, []);

  return <div className="math-only contents">{children}</div>;
}
