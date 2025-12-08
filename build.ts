import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageJson = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
);

await build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  sourcemap: true,
  external: [
    '@elizaos/core',
    'fs',
    'path',
    'crypto',
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
  ],
});

// Generate types file
writeFileSync(
  'dist/index.d.ts',
  `export * from '../src/index';\nexport { default } from '../src/index';\n`
);

console.log('✅ Plugin Virtue build complete!');

