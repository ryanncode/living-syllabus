# The Living Syllabus User Guide

| **Resource** | **Description** |
| :--- | :--- |
| **[Living Syllabus Blog](https://thing.rodeo/living-syllabus/)** | The main project documentation and philosophy. |
| **[Word to Canvas Converter](https://ryanncode.github.io/living-syllabus/generate.html)** | Convert Word Docs (.docx) to clean, styled HTML code. |
| **[Theme Builder](https://ryanncode.github.io/living-syllabus/theme-builder.html)** | Create custom CSS themes for your syllabus components. |

## Phase 1: The Setup (Installation & Workflow)

> **Compatibility Note:** While this guide focuses on **Canvas**, this tool produces standard, flat HTML5 that works equally well in **Blackboard**, **Moodle**, **Brightspace (D2L)**, and any other LMS that accepts HTML input.

### 1.1. The "No-Code" Promise

You do not need to be a software developer to use this tool. You are adopting the role of a **Maintainer**.

* **The Author** writes content.
* **The Developer** writes code.
* **The Maintainer** (You) simply runs a pre-built engine that turns content into code.

This workflow replaces the "Canvas Rich Text Editor" with a "Compiler." You write in clean, simple text, and the engine handles 100% of the styling, accessibility, and mobile-responsiveness for you.

### 1.2. The Toolkit

Before you begin, ensure you have these three standard tools installed. They are the "printing press" for your digital syllabus.

1. **VS Code:** A distraction-free text editor. [Download here](https://code.visualstudio.com/).
2. **Pandoc:** The engine that converts text formats. [Download here](https://pandoc.org/installing.html).
3. **Node.js:** The runtime that powers the automation script. [Download here](https://nodejs.org/en/download/).

### 1.3. The Directory Structure

Create a new folder for your course (e.g., `My-Course-Syllabus`). Inside, organize your files exactly like this:

```text
/My-Course-Syllabus
│
├── syllabus.md           <-- YOUR CONTENT (Markdown)
├── week1-quiz.docx       <-- YOUR CONTENT (Word)
│
├── /themes               <-- THE STYLE CLOSET
│   ├── academic.css      (Serif, Ivy League style)
│   └── modern.css        (Sans-serif, Startup style)
│
├── generate.js           <-- THE ENGINE (Script provided below)
│
└── package.json          <-- THE CONFIG (Created automatically)
```

### 1.4. The Script (`generate.js`)

Create a file named `generate.js` in your folder and paste this code. This is the automation engine that "flattens" modern CSS into a format Canvas accepts. It now supports both Markdown (`.md`) and Word (`.docx`) files.

```javascript
const fs = require('fs');
const juice = require('juice');
const pandoc = require('node-pandoc');
const postcss = require('postcss');
const cssVariables = require('postcss-css-variables');
const path = require('path');

// Usage: node generate.js <input_file> <theme_name>
// Example (Markdown): node generate.js week1.md academic
// Example (Word):     node generate.js syllabus.docx midnight

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error("❌ Error: Please provide both an input file and a theme.");
    console.error("   Usage: node generate.js <file.md|file.docx> <theme>");
    process.exit(1);
}

const inputFile = args[0];
const themeName = args[1];

// Generate output name: inputfilename_themename.html
const baseName = path.basename(inputFile, path.extname(inputFile));
const outputFile = `${baseName}_${themeName}.html`;

// Theme Resolution Logic
let cssFile = `${themeName}.css`;
// Check root first, then themes folder
if (!fs.existsSync(cssFile)) {
    if (fs.existsSync(`./themes/${cssFile}`)) {
         cssFile = `./themes/${cssFile}`;
    } else {
        console.error(`❌ Error: Theme file '${themeName}.css' not found in root or /themes.`);
        process.exit(1);
    }
}

async function buildComponent() {
    console.log(`\n🏗️  Compiling [${inputFile}] with [${themeName.toUpperCase()}] Theme`);

    if (!fs.existsSync(inputFile)) {
        console.error(`❌ Error: Source file '${inputFile}' not found.`);
        return;
    }

    // 1. DETERMINE FILE TYPE & CONVERTER ARGS
    const fileExt = path.extname(inputFile).toLowerCase();
    let pandocArgs = '';

    if (fileExt === '.md' || fileExt === '.markdown') {
        console.log(`   ...Detected Markdown file. Using Markdown converter...`);
        // --section-divs adds <section> or <div> wrappers around headers, good for styling
        pandocArgs = '-f markdown -t html5 --wrap=none --section-divs';
    } else if (fileExt === '.docx') {
        console.log(`   ...Detected Word document. Using Docx converter...`);
        pandocArgs = '-f docx -t html5 --wrap=none --section-divs';
    } else {
        console.error(`❌ Error: Unsupported file type '${fileExt}'. Please use .md or .docx`);
        return;
    }

    // 2. CSS PRE-PROCESSING (The "Flattening" Step)
    const rawCss = fs.readFileSync(cssFile, 'utf8');
    
    // Sanitization: Replace :host with :root and neutralize complex data URIs
    let sanitizedCss = rawCss.replace(/:host/g, ':root');
    sanitizedCss = sanitizedCss.replace(/url\("data:[^"]+"\)/g, 'none');

    console.log(`   ...Flattening CSS variables...`);
    let flatCss = '';
    
    try {
        const result = await postcss([
            cssVariables({ preserve: false }) 
        ]).process(sanitizedCss, { from: cssFile, to: undefined });
        flatCss = result.css;
    } catch (err) {
        console.error('❌ CSS Compilation Error:', err);
        return;
    }

    // 3. PANDOC CONVERSION (The "Compiler" Step)
    console.log(`   ...Converting Content to HTML...`);
    
    pandoc(inputFile, pandocArgs, (err, htmlContent) => {
        if (err) {
            console.error('❌ Pandoc Error:', err);
            return;
        }

        // 4. INJECTION (The "Container" Step)
        // Wraps content in a generic canvas-component div for scoping
        const wrappedHtml = `
            <div class="canvas-component" style="max-width: 800px; margin: 0 auto; font-family: sans-serif;">
                ${htmlContent}
            </div>
            `;

        // 5. INLINING (The "Chemical Bonding" Step)
        // Inlines the flattened CSS directly into the HTML style attributes
        const finalHtml = juice.inlineContent(wrappedHtml, flatCss, {
            applyStyleTags: true,
            removeStyleTags: true,
            preserveMediaQueries: false, 
            widthElements: ['table', 'td', 'th'] 
        });

        // 6. FORENSIC STAMPING
        const stamp = `<!-- Generated by Canvas Component Engine on ${new Date().toISOString()} -->\n`;

        fs.writeFileSync(outputFile, stamp + finalHtml);
        console.log(`✅ Success! Component generated: ${outputFile}`);
        console.log(`👉 Next: Open this file, Select All, and Paste into Canvas HTML Editor.`);
    });
}

buildComponent();
```

### 1.5. Initialization

Once your files are in place, open your terminal in VS Code (Terminal -> New Terminal) and run these two commands to install the necessary libraries. We are also installing `onchange` to enable the "Watcher" workflow (see Phase 3).

```bash
npm init -y
npm install juice node-pandoc postcss postcss-css-variables
npm install --save-dev onchange
```

You are now ready to generate.

---

## Phase 2. The Execution (Generate & Publish)

Once your setup is complete, you will repeat these two steps every time you update your content.

### 2.1. The Generation (Compile)

* Open your terminal in VS Code.
* Run the command structure: `node generate.js <filename> <theme>`

**Examples:**

```bash
# To generate your syllabus with the Modern theme:
node generate.js syllabus.md modern

# To generate a Word doc assignment with the Academic theme:
node generate.js assignment1.docx academic
```

* *What just happened?* The tool took your input file, applied the chosen theme (cleaning up any CSS variables), and created a new file called `syllabus_modern.html` (or `assignment1_academic.html`).

### 2.2. The Publication (Paste)
* Open the newly created HTML file in VS Code.
* Copy **everything** (Ctrl+A, Ctrl+C).
* Go to a Canvas Page -> Switch to **HTML Editor** (`</>` icon bottom right).
* **Paste** the code.
* Click Save.

*Note: You never edit the HTML directly. If you need to fix a typo, edit your `.md` or `.docx` file and run the generation command again.*

---

## Phase 3: Automation (The Factory Floor)

As you build out an entire course, running commands manually for every file can become tedious. We recommend the **Batch Builder** method as the primary workflow, allowing you to compile your entire course with a single word.

### Option 1: The "Batch Builder" (Makefile)

*Recommended for most users.*

If you use Linux or macOS, a Makefile is the robust way to handle "builds." This allows you to type `make` to rebuild every file in your folder at once.

**1. Create a file named `Makefile` (no extension)**

```makefile
# Configuration
THEME = academic
GENERATOR = generate.js
SRCS = $(wildcard *.md)
OBJS = $(SRCS:.md=_$(THEME).html)

# The "Phony" targets (commands that aren't files)
.PHONY: all clean help

# Default target: Build everything
all: $(OBJS)

# The Pattern Rule: How to build an .html file from an .md file
%_$(THEME).html: %.md
 @echo "🔨 Building $@ from $<..."
 @node $(GENERATOR) $< $(THEME)

# Clean up generated files
clean:
 @echo "🧹 Cleaning up HTML files..."
 @rm -f *_$(THEME).html

# Help command
help:
 @echo "Usage:"
 @echo "  make        - Build all markdown files using the '$(THEME)' theme"
 @echo "  make clean  - Remove all generated HTML files"
```

**2. How to use it**
* **Build everything:** `make`
* **Build with a different theme:** `make THEME=modern`
* **Clean up:** `make clean`

### Option 2: The "Watcher" (Live Preview)

*Advanced setup for power users.*

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
1. You edit `syllabus.md`.
2. You press **Ctrl+S**.
3. The terminal instantly flashes: `Compiling [syllabus.md] with [ACADEMIC] Theme...`
4. `syllabus_academic.html` is updated automatically.

---

## Appendix: The Microsoft Word "Refinery" Workflow

*Use this workflow if you or your colleagues prefer to write in Microsoft Word.*

The `generate.js` engine now natively supports `.docx` files. However, it is not a magic wand for messy formatting. You must use the **Refinery Strategy** to ensure your Word document acts like code.

### Writing Rules for Word (The "Strict" Protocol)

To ensure your Word document survives the conversion to "Canvas-Ready" code, you must treat Word as a **Structural Editor**, not a visual one.

1. **The "Styles Pane" Mandate:**
   * **Do Not:** Select text and make it **Bold** + Size 18 to create a header.
   * **Do:** You **MUST** use the official **Heading 1**, **Heading 2**, and **Heading 3** buttons. These translate directly to the HTML tags that drive the theme engine.

2. **No "Floating" Elements:**
   * **Do Not:** Use "Text Boxes," "SmartArt," or "Shape" overlays. These will be deleted.
   * **Do:** Type everything in the main body of the page.

3. **Table Discipline:**
   * **Do Not:** Use merged cells or complex nested tables.
   * **Do:** Use simple grid tables for data (Rows and Columns only).

---

## Appendix: Theoretical Framework

*Once you are comfortable with the workflow, explore these modules to understand the "Why" and "How" of the system.*

This design document outlines a complete workflow for generating "Syllabus as Code" components. Follow these steps to build resilient, accessible, and aesthetically modern course materials for Canvas.

**Phase 4: Configuration (The "Why")**
* **Define Your Philosophy:** Review **Module 1**. Decide on your archival strategy (Markdown source) and pedagogical stance (Emancipation/Generosity). This sets the "ethical baseline" for your content.
* **Select Your Constraints:** Review **Module 2** and **Module 3**. Choose your critical lenses (Forensics, Deformance) and infrastructural limits (Minimal Computing, Flat HTML). These choices determine *what* you build.

**Phase 5: Engineering (The "Where")**
* **Prepare the Environment:** Review **Module 4**. Understand the "Walled Garden" of Canvas. Set up your `themes/` folder with Classless CSS libraries (Pico, Simple) and ensure your `generate.js` script is ready for the "Pandoc/Juice" pipeline.
* **Choose Your Aesthetic:** Select a "Typographic Pairing" (e.g., Ivy League vs. Modern SaaS) and a "Safe Color Palette" for your components.

**Phase 6: Generation (The "How")**
* **Run the Agent:** Use **Module 5** as your prompt guide. Instruct the AI to act as a "Co-Intelligence" partner.
* **Generate Components:** Ask the AI to generate specific widgets (Callouts, Tables) using the "Micro-Component" strategy (Atomic Tailwind).
* **Compile & Publish:** Run your build script to fuse the Markdown content, AI widgets, and Global Theme into a single HTML fragment. Paste this result into the Canvas HTML editor.