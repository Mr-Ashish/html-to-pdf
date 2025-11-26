#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { convertHtmlToPdf } from './converter';

const program = new Command();

program
  .name('html-to-pdf')
  .description('CLI to convert HTML files to PDF using Puppeteer')
  .version('1.0.0')
  .argument('[input-file]', 'Path to the input HTML file')
  .option('-o, --output <path>', 'Path to the output PDF file')
  .option('--base64 <string>', 'Base64 encoded HTML content')
  .option('--stdout', 'Output PDF to stdout (suppresses logs)')
  .option('--save-copy <path>', 'Save a local copy when using --stdout')
  .option('--executable-path <path>', 'Path to Chrome executable (useful for low powered devices like Raspberry Pi)')
  .option('--no-sandbox', 'Disable sandbox (useful for low powered devices like Raspberry Pi)')
  .action(async (inputFile, options) => {
    try {
      // Suppress logs if outputting to stdout to avoid corrupting the PDF binary
      const log = options.stdout ? console.error : console.log;

      let htmlContent: string | undefined;

      if (!inputFile) {
        if (options.base64) {
          htmlContent = Buffer.from(options.base64, 'base64').toString('utf-8');
        } else {
          // Read from stdin
          if (!process.stdin.isTTY) {
             htmlContent = await new Promise((resolve, reject) => {
                let data = '';
                process.stdin.on('data', chunk => data += chunk);
                process.stdin.on('end', () => resolve(data));
                process.stdin.on('error', reject);
             });
          }
        }
      }

      if (!inputFile && !htmlContent) {
        console.error(chalk.red('Error: No input provided. Specify a file, use --base64, or pipe HTML to stdin.'));
        process.exit(1);
      }

      if (!options.stdout) {
        log(chalk.blue(`Converting...`));
      }

      const result = await convertHtmlToPdf(inputFile, {
        ...options,
        htmlContent
      });

      if (options.stdout && result) {
        // If save-copy is specified, write to file first
        if (options.saveCopy) {
          const fs = require('fs');
          const path = require('path');
          const savePath = path.resolve(options.saveCopy);
          fs.writeFileSync(savePath, result);
        }
        // Then output to stdout
        process.stdout.write(result);
      } else if (!options.stdout) {
        log(chalk.green('Conversion complete!'));
      }
    } catch (error: any) {
      console.error(chalk.red('Error converting file:'), error.message);
      process.exit(1);
    }
  });

program.parse();
