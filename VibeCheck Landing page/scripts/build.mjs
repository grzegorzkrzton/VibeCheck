import { cp, mkdir, readdir, rename, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicDemoFiles, syncDemo } from './sync-demo.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'dist');
const temporaryRoot = path.join(projectRoot, `.dist-${process.pid}`);
const publicFiles = [
  'index.html', 'styles.css', 'app.js', 'src/exercise-state.mjs', 'src/ui-icons.mjs',
  'assets/fonts/OFL.txt', 'assets/ASSET-LICENSES.txt',
  ...publicDemoFiles,
];
const assetExtensions = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.avif',
  '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.mp3', '.ogg', '.wav',
]);

async function collectAssets(directory = 'assets') {
  const result = [];
  const entries = await readdir(path.join(projectRoot, directory), { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const relativePath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Public assets cannot be symlinks: ${relativePath}`);
    if (entry.isDirectory()) result.push(...await collectAssets(relativePath));
    else if (entry.isFile() && assetExtensions.has(path.extname(entry.name).toLowerCase())) result.push(relativePath);
  }
  return result;
}

try {
  await syncDemo();
  for (const relativePath of publicFiles) {
    const file = await stat(path.join(projectRoot, relativePath));
    if (!file.isFile()) throw new Error(`Required public file is missing: ${relativePath}`);
  }
  const assets = await collectAssets();
  if (assets.length === 0) throw new Error('Add the landing page assets before building.');
  const files = [...publicFiles, ...assets];
  await rm(temporaryRoot, { recursive: true, force: true });
  await mkdir(temporaryRoot, { recursive: true });
  for (const relativePath of files) {
    const destination = path.join(temporaryRoot, relativePath);
    await mkdir(path.dirname(destination), { recursive: true });
    await cp(path.join(projectRoot, relativePath), destination, { dereference: false });
  }
  await rm(outputRoot, { recursive: true, force: true });
  await rename(temporaryRoot, outputRoot);
  console.log(`Built ${files.length} public files into dist/. Facilitator notes, tests, scripts, and project metadata are excluded.`);
} catch (error) {
  await rm(temporaryRoot, { recursive: true, force: true });
  console.error(`Build failed: ${error.message}`);
  process.exitCode = 1;
}
