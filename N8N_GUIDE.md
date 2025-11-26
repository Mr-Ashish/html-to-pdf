# n8n Integration Guide

This CLI is designed to work seamlessly with [n8n](https://n8n.io/) using the **Execute Command** node.

## Method 1: Base64 Encoding (Recommended)

This method is the safest as it avoids any shell escaping issues with special characters in your HTML.

### Step 1: Encode HTML in n8n
Use a **Crypto** node or a **Code** node to Base64 encode your HTML string.

**Using a Code Node:**
```javascript
// Assume input item has a property 'html'
const html = items[0].json.html;
const base64Html = Buffer.from(html).toString('base64');
return [{ json: { base64Html } }];
```

### Step 2: Execute Command
Add an **Execute Command** node.

*   **Command:**
    ```bash
    html-to-pdf --base64 "{{ $json.base64Html }}" --stdout
    ```
    *(Note: Replace `html-to-pdf` with the full path to the executable if it's not in your PATH, e.g., `/usr/local/bin/html-to-pdf`)*

*   **Output:**
    *   Enable **"Output as Binary"**.
    *   **Property Name:** `data` (or whatever you prefer).
    *   **MIME Type:** `application/pdf`.

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
