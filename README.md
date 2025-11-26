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
| `--executable-path <path>` | Path to a specific Chrome/Chromium executable. |
| `--no-sandbox` | Disables the sandbox. Required for some Linux environments and Docker. |
| `-h, --help` | Display help information. |

## License

ISC
