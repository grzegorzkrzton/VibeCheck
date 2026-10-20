import { createHash } from 'node:crypto';
import { mkdir, readFile, realpath, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(scriptPath), '..');
const repositoryRoot = path.dirname(projectRoot);

// These are the released extension files, copied without transforming their contents.
const runtimeAssets = [
  ['extension/toolbar/bundle.min.js', 'demo/vendor/vibecheck.js'],
  ['extension/toolbar/bundle.css', 'demo/vendor/vibecheck.css'],
  ...['inspector', 'guides', 'accessibility', 'text'].map(name => [
    `extension/tuts/${name}.gif`, `demo/vendor/tuts/${name}.gif`,
  ]),
  ...['figtree-400.woff2', 'figtree-500.woff2', 'figtree-600.woff2', 'figtree-700.woff2', 'OFL.txt'].map(name => [
    `design-system/fonts/figtree/${name}`, `fonts/figtree/${name}`,
  ]),
];

export const publicDemoFiles = [
  'demo/index.html', 'demo/demo.css', 'demo/preview.js',
  ...runtimeAssets.map(([, destination]) => destination),
];

export async function syncDemo() {
  const provenance = [];
  for (const [source, destination] of runtimeAssets) {
    const sourcePath = path.join(repositoryRoot, source);
    if (await realpath(sourcePath) !== sourcePath || !(await stat(sourcePath)).isFile()) {
      throw new Error(`The extension demo requires a regular source file: ${source}`);
    }
    const bytes = await readFile(sourcePath);
    const destinationPath = path.join(projectRoot, destination);
    const destinationDirectory = path.dirname(destinationPath);
    await mkdir(destinationDirectory, { recursive: true });
    if (await realpath(destinationDirectory) !== destinationDirectory) {
      throw new Error(`Generated demo asset directories cannot be symlinks: ${destination}`);
    }
    // Refuse an existing symlink before writing a generated file.
    try {
      if (await realpath(destinationPath) !== destinationPath) {
        throw new Error(`Generated demo assets cannot be symlinks: ${destination}`);
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    await writeFile(destinationPath, bytes);
    provenance.push({
      source,
      destination,
      sha256: createHash('sha256').update(bytes).digest('hex'),
      bytes: bytes.length,
    });
  }

  // Local review metadata only: the server and production build omit this file.
  await writeFile(path.join(projectRoot, 'demo/vendor/provenance.json'), `${JSON.stringify({
    schemaVersion: 1,
    description: 'Unmodified extension runtime and canonical assets used by the landing-page demo.',
    files: provenance,
  }, null, 2)}\n`);
  console.log(`Synced ${runtimeAssets.length} unmodified VibeCheck runtime assets for the live demo.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) {
  syncDemo().catch(error => {
    console.error(`Demo sync failed: ${error.message}`);
    process.exitCode = 1;
  });
}
