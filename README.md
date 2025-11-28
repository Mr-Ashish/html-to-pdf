# HTML to PDF CLI

A lightweight, robust CLI tool to convert HTML files to PDF using [Puppeteer](https://pptr.dev/). 

Designed for standard environments and optimized for **low-powered devices** (like Raspberry Pi) and serverless workflows.

## Features

- 🚀 **High Fidelity:** Uses Headless Chrome for perfect rendering of modern CSS/JS.
- ⚡ **Lightweight:** Minimal dependencies.
- 🍓 **IoT Ready:** Special flags for Raspberry Pi and other ARM devices.
- 🔧 **Configurable:** Customize margins, format, and more.

## Installation

```bash
npm install -g htm-to-pdf
```

## Usage

### Basic Conversion

```bash
html-to-pdf input.html -o output.pdf
```

**Auto-generated filenames:**
If you don't specify `-o`, the PDF will be saved to `output/output_TIMESTAMP.pdf`:
```bash
html-to-pdf input.html
# Creates: output/output_2025-11-28_13-45-30.pdf
```

### Get Output Path (for n8n workflows)

```bash
html-to-pdf input.html --print-path
# Outputs only: /path/to/output/output_2025-11-28_13-45-30.pdf
```

This is perfect for n8n Execute Command nodes - you get just the file path in stdout, which you can then pass to a Read Binary File node.

### Cleanup Generated Files

```bash
./cleanup.sh
```

This removes all generated PDFs from the `output` directory.

### On Low-Powered Devices (e.g., Raspberry Pi)

To save resources on devices like the Raspberry Pi, it is recommended to use the system-installed Chromium instead of the bundled one.

1.  **Install Chromium:**
    ```bash
    sudo apt install chromium-browser
    ```

2.  **Run with flags:**
    ```bash
    html-to-pdf input.html \
      --executable-path /usr/bin/chromium-browser \
      --no-sandbox
    ```

### Options

| Option | Description |
| :--- | :--- |
| `-o, --output <path>` | Path to the output PDF file. Defaults to input filename with `.pdf` extension. |
| `--base64 <string>` | Base64 encoded HTML content (useful for n8n workflows). |
| `--stdout` | Output PDF to stdout instead of file (useful for piping to other commands). |
| `--save-copy <path>` | Save a local copy when using `--stdout` (useful for debugging n8n workflows). |
| `--print-path` | Print the output file path to stdout (useful for n8n workflows with Read Binary File). |
| `--executable-path <path>` | Path to a specific Chrome/Chromium executable. |
| `--no-sandbox` | Disables the sandbox. Required for some Linux environments and Docker. |
| `-h, --help` | Display help information. |

## n8n Integration

This tool is optimized for n8n workflows. You can pass HTML via Base64 or Stdin and receive the binary PDF output.

👉 **[Read the n8n Integration Guide](./N8N_GUIDE.md)**

## License

ISC
