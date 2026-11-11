/**
 * Release guard.
 *
 * The whole point of v4 is that the published bundle no longer reaches for the
 * private @instantsys-labs scope — the fx engine is vendored into
 * projects/clove-form-builder/src/lib/vendor/. This fails the build if that
 * ever regresses, and also if the bundle imports something the package does not
 * declare as a peer/dependency.
 *
 * Run after `ng build clove-form-builder`:
 *   node scripts/verify-no-instantsys.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist/clove-form-builder';
const FESM = join(DIST, 'fesm2022');

const bundles = readdirSync(FESM).filter((f) => f.endsWith('.mjs'));
if (bundles.length === 0) {
  console.error(`No .mjs bundle found in ${FESM}. Did you run "ng build clove-form-builder"?`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(DIST, 'package.json'), 'utf8'));
const declared = new Set([
  ...Object.keys(manifest.peerDependencies ?? {}),
  ...Object.keys(manifest.dependencies ?? {}),
]);

// Real module specifiers only. Matching the bare string would also hit the
// explanatory comments that legitimately mention @instantsys-labs.
const SPECIFIER = /(?:\bfrom\s*|\bimport\s*\(\s*|^\s*import\s+)['"]([^'"]+)['"]/gm;

let failed = false;

for (const file of bundles) {
  const source = readFileSync(join(FESM, file), 'utf8');
  const imported = new Set();
  for (const [, spec] of source.matchAll(SPECIFIER)) {
    if (spec.startsWith('.')) continue;
    imported.add(spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]);
  }

  const instantsys = [...imported].filter((p) => p.startsWith('@instantsys-labs'));
  const undeclared = [...imported].filter((p) => !declared.has(p)).sort();

  console.log(`\n${file}`);
  console.log(`  imports    : ${[...imported].sort().join(', ')}`);

  if (instantsys.length) {
    console.error(`::error::${file} still imports ${instantsys.join(', ')}`);
    failed = true;
  } else {
    console.log('  instantsys : none ✓');
  }

  if (undeclared.length) {
    console.error(`::error::${file} imports packages not declared in package.json: ${undeclared.join(', ')}`);
    failed = true;
  } else {
    console.log('  undeclared : none ✓');
  }
}

if (failed) process.exit(1);
console.log('\nBundle check passed.');
