import chalk from 'chalk';
import ora from 'ora';

import fs from 'fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises';
import { cwd } from 'process';
import { join } from 'path';
import getMetadata from '../utils/metadata.js';
import parseSvg from '../utils/parseSvg.js';
import {
  createComponent,
  createIndexEntry,
  createTypeIndexEntry
} from '../templates/index.js';
import colors from '../utils/colors.js';

const ROOT_DIR = cwd();
const DIST_DIR = join(ROOT_DIR, 'dist');
const COMPONENTS_DIR = join(DIST_DIR, 'components');
const TYPES_DIR = join(DIST_DIR, 'types');
const INDEX_PATH = join(COMPONENTS_DIR, 'index.js');
const TYPE_INDEX_PATH = join(TYPES_DIR, 'index.d.ts');

const noop = () => {};
const spinner = ora({
  text: `Clearing previous build files...`,
  spinner: 'arc'
});

export default async function generateComponents() {
  spinner.start();
  await cleanPrevBuild();
  spinner.succeed();

  spinner.start('Placing types files...');
  await placeTypes();
  spinner.succeed();

  spinner.start(`Generating ${chalk.hex(colors.orange)('Svelte Components')}`);
  await generate();
  spinner.succeed();
}

async function cleanPrevBuild() {
  await rm(DIST_DIR, { recursive: true, force: true });
  await mkdir(DIST_DIR);
  await mkdir(COMPONENTS_DIR);
  await mkdir(TYPES_DIR);
}

async function placeTypes() {
  const files = await readdir('src/types');

  const promises = Array.from(files).map(async (file, i) => {
    const content = await readFile(`src/types/${file}`, 'utf-8');

    writeFile(join(TYPES_DIR, file), content);
  });

  await Promise.all(promises);
}

async function generate() {
  const files = await readdir('src/svg');

  const importStatement = `import Icon from './icon'\nimport IconFilled from './icon-filled'\n\n`;
  await fs.writeFile(TYPE_INDEX_PATH, importStatement, noop);

  const promises = Array.from(files).map(async (file, i) => {
    const metaData = getMetadata(file);

    if (metaData == null) {
      spinner.fail(`Failed to get MetaData for file: ${file}`);
      return;
    }

    const content = await readFile(`src/svg/${file}`, 'utf-8');
    const svg = parseSvg(content, metaData.filled);
    const component = createComponent(svg, metaData.filled);

    const indexEntry = createIndexEntry(metaData.componentName);
    await fs.appendFile(INDEX_PATH, indexEntry, noop);

    const typeIndexEntry = createTypeIndexEntry(metaData);
    await fs.appendFileSync(TYPE_INDEX_PATH, typeIndexEntry);

    spinner.text = `Completed Generating ${
      metaData.componentName
    } (${Math.round((i / (files.length - 1)) * 100)}%)`;

    const componentPath = join(
      COMPONENTS_DIR,
      `${metaData.componentName}.svelte`
    );
    await writeFile(componentPath, component, noop);
  });

  await Promise.all(promises);
}
