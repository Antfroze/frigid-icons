import ora from 'ora';
import logger from '../utils/logger.js';
import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import { optimize } from 'svgo';
import { writeFile, rm, mkdir } from 'fs/promises';
import colors from '../utils/colors.js';

const URL = 'https://vercel.com/design/icons';

(async function () {
  logger.info(`Generating icons from ${chalk.hex(colors.pink)(URL)}...\n`);

  const spinner = ora({ text: 'Fetching html...', spinner: 'arc' }).start();

  const html = await fetch(URL).then((res) => res.text());

  spinner.succeed();

  spinner.start('Setting up folder...');
  await rm('src/svg', { recursive: true, force: true });
  await mkdir('src/svg');
  spinner.succeed('Created SVG folder.');

  spinner.start('Creating DOM...');
  const document = new JSDOM(html).window.document;
  spinner.succeed();

  spinner.start('Gathering icons...');
  const icons = document.querySelectorAll('.geist-list .icon');
  spinner.succeed();

  const promises = Array.from(icons).map(async (icon) => {
    const name = icon.querySelector('.geist-text')?.textContent;

    if (name == null) {
      spinner.fail(`Failed to find name on component: ${icon}.`);
      return;
    }

    const fileName = toHumpName(name);

    const svg = icon.querySelector('svg');

    if (svg == null) {
      spinner.fail(`Failed to find SVG on component: ${fileName}.`);
      return;
    }

    const optimizedSvgString = optimize(svg.outerHTML).data;
    const svgString = parseSvg(optimizedSvgString);
    await writeFile(`src/svg/${fileName}.svg`, svgString);
  });

  spinner.start('Generating SVGs...');
  await Promise.all(promises);
  spinner.succeed();

  logger.success(
    `\nSuccessfully generated icons from ${chalk.hex(colors.pink)(URL)}!`
  );
})();

function parseSvg(svg) {
  // svg = svg.replace(/-([a-z])(?=[a-z\-]*[=\s/>])/g, (g) => g[1].toUpperCase());
  // svg = replaceAll(svg, ` dataTestid="geist-icon"`, '');
  svg = svg.replaceAll(/ style="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/g, '');
  svg = svg.replaceAll(/ data-testid="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi, '');

  const firstIndex = svg.indexOf('>');

  svg =
    svg.substring(0, firstIndex) +
    ' viewBox="0 0 24 24"' +
    svg.substring(firstIndex, svg.length);
  return svg;
}

function toHumpName(name) {
  return name.replace(/-(\d)/g, '$1');
}
