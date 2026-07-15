import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const webOutput = path.join(root, 'artifacts', 'examtree', 'dist', 'public');
const adminOutput = path.join(root, 'artifacts', 'admin-app', 'dist', 'public');
const adminDestination = path.join(webOutput, 'admin');

if (!existsSync(path.join(webOutput, 'index.html'))) {
  throw new Error('Student application build output is missing. Run build:web first.');
}
if (!existsSync(path.join(adminOutput, 'index.html'))) {
  throw new Error('Admin application build output is missing. Run build:admin first.');
}

rmSync(adminDestination, { recursive: true, force: true });
mkdirSync(adminDestination, { recursive: true });
cpSync(adminOutput, adminDestination, { recursive: true });

console.log(`Admin build copied to ${path.relative(root, adminDestination)}.`);
