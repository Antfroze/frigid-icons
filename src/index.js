import chalk from 'chalk';
import generateComponents from './scripts/generateComponents.js';
import logger from './utils/logger.js';
import colors from './utils/colors.js';

(async function main() {
  logger.info(`Compiling ${chalk.hex(colors.blue)('Frigid Icons')}.\n`);
  await generateComponents();
  logger.success(
    `\nSuccessfully compiled ${chalk.hex(colors.blue)('Frigid Icons')}!`
  );
})();
