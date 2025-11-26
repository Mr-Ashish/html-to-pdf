# n8n Integration Guide

This CLI is designed to work seamlessly with [n8n](https://n8n.io/) using the **Execute Command** node.

## Method 1: Base64 Encoding (Recommended)

This method is the safest as it avoids any shell escaping issues with special characters in your HTML.

### Step 1: Encode HTML in n8n
You can use the built-in **Crypto** node (easiest) or a **Code** node.

**Option A: Using the Crypto Node**
1.  Add a **Crypto** node.
2.  **Action:** Select `Encoding`.
3.  **Type:** Select `Base64`.
4.  **Value:** Click the expression editor and select your HTML input (e.g., `{{ $json.html }}`).
5.  **Property Name:** Enter a name for the output field, e.g., `base64Html`.

**Option B: Using a Code Node**
```javascript
// Assume input item has a property 'html'
const html = items[0].json.html;
const base64Html = Buffer.from(html).toString('base64');
return [{ json: { base64Html } }];
```

### Step 2: Execute Command
Add an **Execute Command** node.

**Command:**
```bash
html-to-pdf --base64 "{{ $json.base64Html }}" --stdout
```
*(Note: Replace `html-to-pdf` with the full path if it's not in your PATH, e.g., `/usr/local/bin/html-to-pdf` or `npx html-to-pdf`)*

**Important Settings:**
1. **Binary Output:** Toggle this **ON** (this is crucial!)
2. **Binary Property:** Enter `data` (or any name you prefer for the PDF file)
3. **Binary Data:** Leave as default

**For Raspberry Pi users, use:**
```bash
html-to-pdf --base64 "{{ $json.base64Html }}" --stdout --executable-path /usr/bin/chromium-browser --no-sandbox
```

### Step 3: Use the PDF
After the Execute Command node runs, you'll have a binary file in `$binary.data` that you can:
*   **Save to disk** using a "Write Binary File" node
*   **Upload to Google Drive** using the Google Drive node
*   **Send via Email** as an attachment
*   **Upload to S3** using the AWS S3 node

**Example: Save to local file**
Add a **Write Binary File** node:
*   **File Name:** `output.pdf` (or use an expression like `{{ $json.filename }}.pdf`)
*   **Binary Property:** `data` (must match the property name from Execute Command)
*   **File Path:** `/path/to/save/output.pdf`

---

## Alternative Method: Convert stdout to Binary (Recommended for older n8n)

If your Execute Command node outputs the PDF to `stdout` as a string (you'll see binary data in the output), use this approach:

### Step 1: Encode HTML (same as above)
Use the Crypto node to create `base64Html`.

### Step 2: Execute Command with --stdout
**Command:**
```bash
html-to-pdf --base64 "{{ $json.base64Html }}" --stdout --executable-path /usr/bin/chromium-browser --no-sandbox
```

**Optional: Save a local copy for debugging**
```bash
html-to-pdf --base64 "{{ $json.base64Html }}" --stdout --save-copy /tmp/debug.pdf --executable-path /usr/bin/chromium-browser --no-sandbox
```
This will output to stdout (for n8n) AND save a copy to `/tmp/debug.pdf` for inspection.

The output will appear in `$json.stdout` as binary string data.

### Step 3: Convert to Binary with Code Node
Add a **Code** node with this JavaScript:

```javascript
// Get the stdout which contains the PDF binary
const pdfData = items[0].json.stdout;

// Convert to binary buffer
const binaryData = Buffer.from(pdfData, 'binary');

// Return as binary data
return items.map(item => {
  return {
    json: item.json,
    binary: {
      data: {
        data: binaryData.toString('base64'),
        mimeType: 'application/pdf',
        fileName: 'output.pdf'
      }
    }
  };
});
```

### Step 4: Use the PDF
Now you have the PDF in `$binary.data` and can:
*   **Write Binary File** node → Save to disk
*   **Google Drive** node → Upload to Drive
*   **Email** node → Send as attachment

---

## Alternative Method: File-Based (If stdout doesn't work)

If your n8n version doesn't have the "Binary Output" option in Execute Command, use this file-based approach:

### Step 1: Encode HTML (same as above)
Use the Crypto node to create `base64Html`.

### Step 2: Execute Command - Save to File
**Command:**
```bash
html-to-pdf --base64 "{{ $json.base64Html }}" -o /tmp/output_{{ $json.id }}.pdf --executable-path /usr/bin/chromium-browser --no-sandbox
```
*(Use a unique filename with `{{ $json.id }}` or timestamp to avoid conflicts)*

### Step 3: Read Binary File
Add a **Read Binary File** node:
*   **File Path:** `/tmp/output_{{ $json.id }}.pdf`
*   **Property Name:** `data`

### Step 4: (Optional) Clean Up
Add another **Execute Command** node to delete the temp file:
```bash
rm /tmp/output_{{ $json.id }}.pdf
```

Now you have the PDF in `$binary.data` and can use it in subsequent nodes!

## Method 2: Stdin Piping (Advanced)

You can pipe HTML directly to the CLI.

*   **Command:**
    ```bash
    echo "{{ $json.html }}" | html-to-pdf --stdout
    ```

> [!WARNING]
> **Shell Escaping:** If your HTML contains double quotes (`"`) or other shell characters, the `echo` command might break. Ensure your HTML is properly escaped if using this method.

## Handling Output

The CLI outputs the raw PDF binary to `stdout` when the `--stdout` flag is used. All logs are sent to `stderr` so they don't corrupt the PDF file.

In n8n, the **Execute Command** node captures `stdout` as the binary data, which you can then pass to:
*   **Google Drive** (Upload file)
*   **Email** (Send attachment)
*   **AWS S3** (Put object)

## Raspberry Pi / Low-Powered Devices

If you're running n8n on a Raspberry Pi or similar ARM device, you **must** use the system-installed Chromium to avoid architecture errors.

### Setup
1.  Install Chromium:
    ```bash
    sudo apt update
    sudo apt install chromium-browser
    ```

2.  Find the path:
    ```bash
    which chromium-browser
    # Usually: /usr/bin/chromium-browser
    ```

### Updated Command
```bash
html-to-pdf --base64 "{{ $json.base64Html }}" --stdout \
  --executable-path /usr/bin/chromium-browser \
  --no-sandbox
```

> [!IMPORTANT]
> The `--executable-path` and `--no-sandbox` flags are **required** on Raspberry Pi to avoid "Failed to launch browser" errors.
