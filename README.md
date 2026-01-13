# The Living Syllabus User Guide

| **Resource** | **Description** |
| :--- | :--- |
| **[Living Syllabus Blog](https://thing.rodeo/living-syllabus/)** | The main project documentation and philosophy. |
| **[Generate](https://ryanncode.github.io/living-syllabus/generate.html)** | Convert Markdown (.md) and Word Docs (.docx) to clean, styled HTML code. |
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

### 1.3. Get the Toolkit (The "Starter Kit")

Instead of creating files manually, download the pre-built engine from this repository.

1. Scroll to the top of this page.
2. Click the green **Code** button.
3. Select **Download ZIP**.
4. Extract the folder to your computer. Rename it to `My-Course-Syllabus`.

**You now have the complete setup:**
* `generate.js` (The Engine)
* `Makefile` (The Automation Script)
* `/themes` folder (The Style Closet)
* `/content` folder (Your Course Materials)

### 1.4. Initialization

Open your `My-Course-Syllabus` folder in VS Code. Open the Terminal (**Terminal** -> **New Terminal**) and run these two commands to turn on the engine:

```bash
npm install
```

*Note: This automatically reads the package.json file included in the kit and installs the necessary tools (Pandoc, Juice, etc.) for you.*

You are now ready to generate.

### 1.5. Troubleshooting

If `npm install` fails or you encounter issues, you can install the required packages manually by running these commands:

```bash
npm init -y
npm install juice node-pandoc postcss postcss-css-variables
npm install --save-dev onchange
```

---

## Phase 2. The Execution (Generate & Publish)

Once your setup is complete, you will repeat these two steps every time you update your content.

### 2.1. The Generation (Compile)

* Open your terminal in VS Code.
* Run the command structure: `node generate.js <filename> <theme> [scope_class]`
* View help instructions: `node generate.js --help`

**Examples:**

```bash
# To generate your syllabus with the Modern theme (default scope):
node generate.js syllabus.md modern

# To generate a Word doc assignment with the Academic theme and custom scope:
node generate.js assignment1.docx academic my-custom-scope
```

* *What just happened?* The tool took your input file, applied the chosen theme (cleaning up any CSS variables), and created a new file called `syllabus_modern.html` (or `assignment1_academic.html`). By default, it uses the `.living-syllabus` class to scope styles, ensuring they don't break the rest of the Canvas page.

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

### Option 3.1: The "Batch Builder" (Makefile)

*Recommended for most users.*

If you use Linux or macOS, a Makefile is the robust way to handle "builds." This allows you to type `make` to rebuild every file in your folder at once.

The included `Makefile` is pre-configured to handle the **Modular Course Structure** in your `/content` folder. It automatically applies specific themes to specific folder types:

* **Syllabus** (`/content/syllabus/`) → **Academic Theme**
* **Assignments** (`/content/assignments/`) → **Paper Theme**
* **Pages** (`/content/pages/`) → **Modern Theme**
* **Announcements** (`/content/announcements/`) → **Brutalist Theme**
* **Discussions** (`/content/discussions/`) → **Simple Theme**

**Customizing Your Workflow:**
You are free to create new subfolders or add files anywhere in the `/content` directory. The Makefile is smart enough to find them. Any file not in one of the specific folders listed above will be automatically compiled using the **Default (Academic) Theme**.

**How to use it:**

* **Build everything:** `make`
* **Clean up:** `make clean`

You can edit the `Makefile` text file directly to change which themes are assigned to which folders.

### Option 3.2: The "Watcher" (Live Preview)

*Advanced setup for power users.*

This method monitors your files while you work. Whenever you save a file in VS Code, it will instantly trigger the generator. This creates a "live code" experience but requires keeping a terminal window open.

**3.2.1. Update your `package.json`**
Add these lines to the `scripts` section of your `package.json` file.

```json
{
  "scripts": {
    "watch": "onchange '*.md' -- node generate.js {{file}} academic",
    "watch:modern": "onchange '*.md' -- node generate.js {{file}} modern"
  }
}
```

**3.2.2. How to use it**
Run this command in your terminal:

```bash
npm run watch
```

**Result:**
* You edit `syllabus.md`.
* You press **Ctrl+S**.
* The terminal instantly flashes: `Compiling [syllabus.md] with [ACADEMIC] Theme...`
* `syllabus_academic.html` is updated automatically.

---

## Appendix: The Microsoft Word "Refinery" Workflow

*Use this workflow if you or your colleagues prefer to write in Microsoft Word.*

The `generate.js` engine now natively supports `.docx` files. However, it is not a magic wand for messy formatting. You must use the **Refinery Strategy** to ensure your Word document acts like code.

### Writing Rules for Word (The "Strict" Protocol)

To ensure your Word document survives the conversion to "Canvas-Ready" code, you must treat Word as a **Structural Editor**, not a visual one.

* **The "Styles Pane" Mandate:**
    * **Do Not:** Select text and make it **Bold** + Size 18 to create a header.
    * **Do:** You **MUST** use the official **Heading 1**, **Heading 2**, and **Heading 3** buttons. These translate directly to the HTML tags that drive the theme engine.

* **No "Floating" Elements:**
    * **Do Not:** Use "Text Boxes," "SmartArt," or "Shape" overlays. These will be deleted.
    * **Do:** Type everything in the main body of the page.

* **Table Discipline:**
    * **Do Not:** Use merged cells or complex nested tables.
    * **Do:** Use simple grid tables for data (Rows and Columns only).

---

## Appendix: Theoretical Framework

*Once you are comfortable with the workflow, explore these advanced methods to understand the "Why" and "How" of the system.*

This design document outlines a complete workflow for generating "Syllabus as Code" components. Follow these steps to build resilient, accessible, and aesthetically modern course materials for Canvas.

**Phase 4: Configuration (The "Why")**
* **Define Your Philosophy:** Decide on your archival strategy (Markdown source) and pedagogical stance (Emancipation/Generosity). This sets the "ethical baseline" for your content.
* **Select Your Constraints:** Choose your critical lenses (Forensics, Deformance) and infrastructural limits (Minimal Computing, Flat HTML). These choices determine *what* you build.

**Phase 5: Engineering (The "Where")**
* **Prepare the Environment:** Understand the "Walled Garden" of Canvas. Set up your `themes/` folder with Classless CSS libraries (Pico, Simple) and ensure your `generate.js` script is ready for the "Pandoc/Juice" pipeline.
* **Choose Your Aesthetic:** Select a "Typographic Pairing" (e.g., Ivy League vs. Modern SaaS) and a "Safe Color Palette" for your components.

**Phase 6: Generation (The "How")**
* **Run the Agent:** Use the `component-blueprints.md` file as a context prompt to instruct the AI to act as a "Co-Intelligence" partner.
* **Generate Components:** Refer to the **[Syllabus Component Design](https://thing.rodeo/syllabus-component-design/)** guide to generate specific widgets (Callouts, Tables) using the "Micro-Component" strategy.
* **Compile & Publish:** Utilize the **[Syllabus Theme Builder](https://thing.rodeo/syllabus-theme-builder/)** to finalize your aesthetic, then run your build script to fuse the Markdown content and Global Theme into a single HTML fragment. Paste this result into the Canvas HTML editor.

---

## License

* The software and code samples (scripts, HTML, CSS) are available under the **MIT License**.
* The syllabus content, essays, and documentation text are available under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.