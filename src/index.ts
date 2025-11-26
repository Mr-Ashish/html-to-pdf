#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { convertHtmlToPdf } from './converter';

const program = new Command();

program
  .name('html-to-pdf')
  .description('CLI to convert HTML files to PDF using Puppeteer')
  .version('1.0.0')
  .argument('<input-file>', 'Path to the input HTML file')
  .option('-o, --output <path>', 'Path to the output PDF file')
  .option('--executable-path <path>', 'Path to Chrome executable (useful for low powered devices like Raspberry Pi)')
  .option('--no-sandbox', 'Disable sandbox (useful for low powered devices like Raspberry Pi)')
  .action(async (inputFile, options) => {
    try {
      console.log(chalk.blue(`Converting ${inputFile}...`));
      await convertHtmlToPdf(inputFile, options);
      console.log(chalk.green('Conversion complete!'));
    } catch (error: any) {
      console.error(chalk.red('Error converting file:'), error.message);
      process.exit(1);
    }
  });

program.parse();
