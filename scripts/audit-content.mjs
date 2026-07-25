import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const locales = ['ar', 'en', 'es', 'ur'];
const collections = [
  {
    name: 'articles',
    metadata: 'lib/articles.ts',
    directories: ['', 'content/articles'],
  },
  {
    name: 'research',
    metadata: 'lib/research.ts',
    directories: ['research'],
  },
  {
    name: 'khawatir',
    metadata: 'lib/khawatir.ts',
    directories: ['khawatir'],
  },
  {
    name: 'qa',
    metadata: 'lib/qa.ts',
    directories: ['qa'],
  },
];

function metadataSlugs(file) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  return [
    ...source.matchAll(/^\s+slug:\s*['"`]([^'"`]+)['"`],?$/gm),
  ].map((match) => match[1]);
}

function locateMarkdown(slug, locale, directories) {
  for (const directory of directories) {
    const file = path.join(
      root,
      directory,
      `${slug}.${locale}.md`
    );
    if (fs.existsSync(file) && fs.statSync(file).size > 0) {
      return path.relative(root, file);
    }
  }
  return null;
}

let missingTotal = 0;

for (const collection of collections) {
  const slugs = metadataSlugs(collection.metadata);
  console.log(`${collection.name}: ${slugs.length} items`);

  for (const locale of locales) {
    const missing = slugs.filter(
      (slug) => !locateMarkdown(slug, locale, collection.directories)
    );
    missingTotal += missing.length;
    const present = slugs.length - missing.length;
    const detail = missing.length ? ` — missing: ${missing.join(', ')}` : '';
    console.log(`  ${locale}: ${present}/${slugs.length}${detail}`);
  }
}

console.log(`missing localized bodies: ${missingTotal}`);

if (process.argv.includes('--strict') && missingTotal > 0) {
  process.exitCode = 1;
}
