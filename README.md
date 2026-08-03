# The Living Syllabus User Guide

| **Resource**                                                                        | **Description**                                                          |
| :---------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **[Living Syllabus Blog](https://thing.rodeo/living-syllabus/)**                    | The main project documentation and philosophy.                           |
| **[Generate](https://ryanncode.github.io/living-syllabus/generate.html)**           | Convert Markdown (.md) and Word Docs (.docx) to clean, styled HTML code. |
| **[Theme Builder](https://ryanncode.github.io/living-syllabus/theme-builder.html)** | Create custom CSS themes for your syllabus components.                   |

## Introduction to the Compiler

The Living Syllabus engine is designed for educators who want beautiful, accessible course materials without fighting the Learning Management System (LMS). You do not need to be a software developer to use this tool.

By writing your content in simple Markdown (`.md`) or Microsoft Word (`.docx`) formats, this engine acts as a compiler. It automatically processes your text, applies modern CSS themes, flattens all variables, and inlines the styles. The resulting HTML snippet is entirely "Canvas-Safe." You can seamlessly copy and paste it into the restrictive Rich Text Editors of Canvas, Blackboard, or Moodle without breaking the platform's global styles or relying on external dependencies like JavaScript.

---

## Setup and Installation

To get started, you will need a basic digital toolkit installed on your machine. We recommend downloading these three standard tools:

1. **VS Code:** A distraction-free text editor. [Download here](https://code.visualstudio.com/).
2. **Pandoc:** The engine that converts text formats. [Download here](https://pandoc.org/installing.html).
3. **Node.js:** The runtime that powers the automation script. [Download here](https://nodejs.org/en/download/).

Once your tools are ready, download this repository (via the green Code button as a ZIP file) and extract it to a folder like `My-Course-Syllabus`.

**You now have the complete setup:**

- `generate.js` (The Engine)
- `build.js` / `Makefile` (The Automation Scripts)
- `/themes` folder (The Style Closet)
- `/content` folder (Your Course Materials)

Open this folder in VS Code, open a new terminal window, and run the following command to install the required dependencies:

```bash
npm install
```

If `npm install` fails or you encounter issues, you can troubleshoot by installing the required packages manually:

```bash
npm init -y
npm install juice node-pandoc postcss postcss-css-variables
npm install --save-dev onchange
```

---

## Building Your Content

You can compile files individually or use the batch builder to process your entire course.

### Individual File Generation

To compile a single file, open your terminal in VS Code and run the command structure: `node generate.js <filename> <theme> [scope_class]`

```bash
# To generate your syllabus with the Modern theme (default scope):
node generate.js syllabus.md modern

# To generate a Word doc assignment with the Academic theme and custom scope:
node generate.js assignment1.docx academic my-custom-scope
```

_What just happened?_ The tool took your input file, applied the chosen theme (cleaning up any CSS variables), and created a new file called `syllabus_modern.html` (or `assignment1_academic.html`). By default, it uses the `.living-syllabus` class to scope styles, ensuring they don't break the rest of the Canvas page.

### The Batch Builder

Our newly updated architecture features a native Node.js cross-platform batch builder (`build.js`), meaning it runs flawlessly on Windows, macOS, and Linux. The build script operates asynchronously for rapid parallel file processing.

The batch builder is pre-configured to handle a **Modular Course Structure** in your `/content` directory, automatically applying specific themes to specific folder types:

- **Syllabus** (`/content/syllabus/`) → **Academic Theme**
- **Assignments** (`/content/assignments/`) → **Paper Theme**
- **Pages** (`/content/pages/`) → **Modern Theme**
- **Announcements** (`/content/announcements/`) → **Brutalist Theme**
- **Discussions** (`/content/discussions/`) → **Simple Theme**

You are free to create new subfolders or add files anywhere in the `/content` directory. Any file not mapped above will default to the Academic theme.

**How to use it:**

- **Build everything:** `npm run build`
- **Multi-Format Output:** `npm run build -- --artifact=both` (Generates standalone PDF and DOCX alongside HTML into the `dist/` directory. You can also specify `=pdf` or `=docx`).

---

## Publishing to Canvas

When your build is complete, you need to publish it:

- Open the newly created HTML file in VS Code.
- Copy **everything** (Ctrl+A, Ctrl+C).
- Go to a Canvas Page -> Switch to **HTML Editor** (`</>` icon bottom right).
- **Paste** the code.
- Click Save.

Remember, you should never edit the HTML code directly in Canvas. If you spot a typo, correct it in your original `.md` or `.docx` file and run the build command again.

## Writing in Microsoft Word

If you or your colleagues prefer writing in Microsoft Word rather than Markdown, the engine natively supports `.docx` files. However, it's critical to treat Word as a structural editor rather than a visual canvas.

Instead of manually highlighting text and making it bold or increasing the font size to create a header, you must use Word's official Heading styles (Heading 1, Heading 2). Avoid using floating elements like Text Boxes or SmartArt, as these cannot be parsed cleanly and will be discarded. For data, stick to simple grid tables without merged cells. Following this strict structural discipline ensures your document survives the conversion into clean, Canvas-ready code.

---

## Advanced Usage and Automation

### The "Watcher" (Live Preview)

_Advanced setup for power users._

This method monitors your files while you work. Whenever you save a file in VS Code, it will instantly trigger the generator. This creates a "live code" experience but requires keeping a terminal window open.

**1. Update your `package.json`**
Add these lines to the `scripts` section of your `package.json` file.

```json
{
    "scripts": {
        "watch": "onchange '*.md' -- node generate.js {{file}} academic",
        "watch:modern": "onchange '*.md' -- node generate.js {{file}} modern"
    }
}
```

**2. How to use it**
Run this command in your terminal:

```bash
npm run watch
```

**Result:**

- You edit `syllabus.md`.
- You press **Ctrl+S**.
- The terminal instantly flashes: `Compiling [syllabus.md] with [ACADEMIC] Theme...`
- `syllabus_academic.html` is updated automatically.

### Theoretical Framework

As you become comfortable with the workflow, explore these advanced methods to understand the "Why" and "How" of the system:

- **Configuration:** Decide on your archival strategy (e.g., Markdown as the source of truth) and pedagogical stance to establish an ethical baseline for your course materials. Choose critical lenses like Minimal Computing and Flat HTML to determine what you build.
- **Engineering:** Understand the limitations of your LMS (the "Walled Garden"). Prepare your `themes/` folder with Classless CSS libraries, and define a typographic pairing and safe color palette that ensures your components remain accessible and resilient.
- **Generation:** Use the `component-blueprints.md` file as a context prompt to instruct an AI co-intelligence partner. Refer to the Syllabus Component Design guide to generate specific widgets using a "Micro-Component" strategy before compiling and publishing your final syllabus.

---

## License

The software and code samples (scripts, HTML, CSS) are available under the **MIT License**. The syllabus content, essays, and documentation text are available under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.
