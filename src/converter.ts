import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

interface ConvertOptions {
  output?: string;
  executablePath?: string;
  sandbox?: boolean;
  htmlContent?: string;
}

export async function convertHtmlToPdf(input: string | undefined, options: ConvertOptions): Promise<Buffer | void> {
  let htmlContent = options.htmlContent;
  let resolvedInputPath: string | undefined;

  // If input is a file path, read it or prepare to load it
  if (input) {
    resolvedInputPath = path.resolve(input);
    if (!fs.existsSync(resolvedInputPath)) {
      throw new Error(`Input file not found: ${resolvedInputPath}`);
    }
  }

  const launchOptions: any = {
    headless: true,
    args: []
  };

  if (options.executablePath) {
    launchOptions.executablePath = options.executablePath;
  }

  if (options.sandbox === false) {
    launchOptions.args.push('--no-sandbox', '--disable-setuid-sandbox');
  }

  const browser = await puppeteer.launch(launchOptions);
  
  try {
    const page = await browser.newPage();
    
    if (htmlContent) {
      // Load content directly
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });
    } else if (resolvedInputPath) {
      // Load the file using the file:// protocol
      await page.goto(`file://${resolvedInputPath}`, {
        waitUntil: 'networkidle0'
      });
    } else {
      throw new Error('No input file or HTML content provided');
    }

    const pdfOptions: any = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    };

    if (options.output) {
      pdfOptions.path = path.resolve(options.output);
      await page.pdf(pdfOptions);
    } else {
      // Return buffer if no output path specified
      return Buffer.from(await page.pdf(pdfOptions));
    }
    
  } finally {
    await browser.close();
  }
}
