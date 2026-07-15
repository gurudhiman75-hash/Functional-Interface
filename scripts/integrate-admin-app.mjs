import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const adminDir = path.join(root, 'artifacts', 'admin-app');
const webDir = path.join(root, 'artifacts', 'examtree');

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function replaceRequired(source, search, replacement, label) {
  if (!source.includes(search)) {
    throw new Error(`Unable to update ${label}: expected text was not found.`);
  }
  return source.replace(search, replacement);
}

if (!existsSync(path.join(adminDir, 'src', 'App.tsx'))) {
  throw new Error('Admin source was not copied to artifacts/admin-app.');
}

// Keep the imported application isolated so React 18 and Tailwind 3 can coexist
// safely with the React 19 / Tailwind 4 student application.
const adminPackagePath = path.join(adminDir, 'package.json');
const adminPackage = readJson(adminPackagePath);
adminPackage.name = '@workspace/examtree-admin';
adminPackage.private = true;
adminPackage.scripts = {
  ...adminPackage.scripts,
  dev: 'vite --host 0.0.0.0',
  build: 'tsc -b && vite build',
  typecheck: 'tsc --noEmit -p tsconfig.app.json',
};
adminPackage.dependencies = {
  ...adminPackage.dependencies,
  firebase: '^12.11.0',
};
writeJson(adminPackagePath, adminPackage);

for (const unwanted of ['package-lock.json', 'node_modules', 'dist']) {
  rmSync(path.join(adminDir, unwanted), { recursive: true, force: true });
}

writeFileSync(
  path.join(adminDir, 'vite.config.ts'),
  `import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const rawPort = process.env.ADMIN_PORT ?? '5174';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(\`Invalid ADMIN_PORT value: "\${rawPort}"\`);
}

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/public'),
    emptyOutDir: true,
    sourcemap: true,
  },
  server: {
    host: '0.0.0.0',
    port,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  preview: {
    host: '0.0.0.0',
    port,
  },
});
`,
);

// Mount React Router below /admin while retaining every route from the imported
// application exactly as designed.
const adminAppPath = path.join(adminDir, 'src', 'App.tsx');
let adminApp = readFileSync(adminAppPath, 'utf8');
adminApp = replaceRequired(
  adminApp,
  `\n]);\n\nexport default function App()`,
  `\n], { basename: '/admin' });\n\nexport default function App()`,
  'admin router basename',
);
writeFileSync(adminAppPath, adminApp);

// Reuse the same Firebase client configuration and browser session as ExamTree.
const integrationsDir = path.join(adminDir, 'src', 'integrations');
mkdirSync(integrationsDir, { recursive: true });
copyFileSync(
  path.join(webDir, 'src', 'lib', 'firebase.ts'),
  path.join(integrationsDir, 'firebase.ts'),
);

writeFileSync(
  path.join(integrationsDir, 'ExamTreeAdminGate.tsx'),
  `import { useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from './firebase';

type StoredUser = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

function readStoredUser(): StoredUser | null {
  try {
    return JSON.parse(localStorage.getItem('user') ?? 'null') as StoredUser | null;
  } catch {
    return null;
  }
}

function redirectToAdminLogin() {
  const next = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(\`/login/admin?next=\${next}\`);
}

export function ExamTreeAdminGate({ children }: { children: ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser?.role !== 'admin') {
      redirectToAdminLogin();
      return;
    }

    const auth = getFirebaseAuth();
    if (!auth) {
      // Local UI development may run without Firebase environment values. The
      // API still performs token and permission checks for protected actions.
      setAuthorized(true);
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        redirectToAdminLogin();
        return;
      }
      setAuthorized(true);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verifying ExamTree administrator access…
      </div>
    );
  }

  return authorized ? children : null;
}
`,
);

writeFileSync(
  path.join(adminDir, 'src', 'main.tsx'),
  `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ExamTreeAdminGate } from './integrations/ExamTreeAdminGate';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamTreeAdminGate>
      <App />
    </ExamTreeAdminGate>
  </StrictMode>,
);
`,
);

writeFileSync(
  path.join(adminDir, '.env.example'),
  `VITE_API_URL=/api
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
`,
);

// A client-side navigation to /admin must perform a full document load so the
// Firebase rewrite can serve the dedicated admin application bundle.
const webAppPath = path.join(webDir, 'src', 'App.tsx');
let webApp = readFileSync(webAppPath, 'utf8');
webApp = webApp.replace(
  /const Admin = lazy\([\s\S]*?const AdminGenerator = lazy\([\s\S]*?;\n/,
  `function AdminRedirect({ to = '/admin/' }: { to?: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);
  return <RouteSkeleton />;
}
`,
);
webApp = replaceRequired(
  webApp,
  `<Route path="/admin" component={() => renderRoute(Admin)} />`,
  `<Route path="/admin" component={() => <AdminRedirect />} />`,
  'student /admin route',
);
webApp = webApp.replace(
  /<Route path="\/admin\/generator"[\s\S]*?\/>/,
  `<Route path="/admin/generator" component={() => <AdminRedirect to="/admin/content/studio" />} />`,
);
writeFileSync(webAppPath, webApp);

const rootPackagePath = path.join(root, 'package.json');
const rootPackage = readJson(rootPackagePath);
rootPackage.scripts = {
  ...rootPackage.scripts,
  'dev:admin': 'pnpm --dir artifacts/admin-app dev',
  'build:admin': 'pnpm --dir artifacts/admin-app build',
  'typecheck:admin': 'pnpm --dir artifacts/admin-app typecheck',
  'test:admin': 'pnpm --dir artifacts/admin-app test',
  'build:hosting': 'pnpm run build:web && pnpm run build:admin && node scripts/assemble-hosting.mjs',
  'deploy:web': 'pnpm run build:hosting && pnpm dlx firebase-tools deploy --only hosting --project sarbedutech',
  'preview:web': 'pnpm run build:hosting && pnpm dlx firebase-tools hosting:channel:deploy preview --project sarbedutech',
};
writeJson(rootPackagePath, rootPackage);

const firebasePath = path.join(root, 'firebase.json');
const firebase = readJson(firebasePath);
const hosting = Array.isArray(firebase.hosting)
  ? firebase.hosting.find((entry) => entry.public === 'artifacts/examtree/dist/public')
  : firebase.hosting;
if (!hosting) throw new Error('Unable to locate ExamTree Firebase hosting configuration.');
const existingRewrites = (hosting.rewrites ?? []).filter(
  (rewrite) => rewrite.source !== '**' && rewrite.source !== '/admin' && rewrite.source !== '/admin/**',
);
hosting.rewrites = [
  { source: '/admin', destination: '/admin/index.html' },
  { source: '/admin/**', destination: '/admin/index.html' },
  ...existingRewrites,
  { source: '**', destination: '/index.html' },
];
writeJson(firebasePath, firebase);

writeFileSync(
  path.join(root, 'docs', 'admin-panel-integration.md'),
  `# ExamTree admin panel integration

The complete Admin Prototype frontend is vendored into \`artifacts/admin-app\` and served from \`/admin/\` on the same Firebase Hosting site as the student application.

## Source pin

- Repository: \`gurudhiman75-hash/Admin-Prototyoe\`
- Branch: \`main\`
- Imported commit: \`81144ae5c7d3c0156af95141bfdf4c150e6d11dc\`

## Boundaries

- \`artifacts/examtree\` remains the student-facing application.
- \`artifacts/admin-app\` owns all \`/admin/**\` routes.
- Firebase authentication state is shared by origin; the admin shell also requires the stored ExamTree role to be \`admin\`.
- Backend APIs remain responsible for token verification and authorization.
- The old \`admin.tsx\` and \`admin-generator.tsx\` files are retained temporarily for rollback, but active routing redirects to the new application.

## Commands

- \`pnpm run dev:admin\`
- \`pnpm run typecheck:admin\`
- \`pnpm run build:admin\`
- \`pnpm run build:hosting\`
`,
);

console.log('Admin application integration normalization completed.');
