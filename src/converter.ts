import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

interface ConvertOptions {
  output?: string;
  executablePath?: string;
  sandbox?: boolean;
}

export async function convertHtmlToPdf(inputPath: string, options: ConvertOptions) {
  const resolvedInputPath = path.resolve(inputPath);
  
  if (!fs.existsSync(resolvedInputPath)) {
    throw new Error(`Input file not found: ${resolvedInputPath}`);
  }

  const outputPath = options.output 
    ? path.resolve(options.output)
    : resolvedInputPath.replace(/\.html?$/i, '.pdf');

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
    
    // Load the file using the file:// protocol
    await page.goto(`file://${resolvedInputPath}`, {
      waitUntil: 'networkidle0' // Wait for all assets to load
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });
    
  } finally {
    await browser.close();
  }
}
