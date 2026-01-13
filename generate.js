const fs = require('fs');
const path = require('path');
const juice = require('juice');
const pandoc = require('node-pandoc');
const postcss = require('postcss');
const cssVariables = require('postcss-css-variables');

/**
 * Usage: node generate.js <input_file> <theme_name> [scope_class]
 *
 * Examples:
 *   Markdown: node generate.js week1.md academic
 *   Word:     node generate.js syllabus.docx midnight my-custom-scope
 */

const args = process.argv.slice(2);

// Check for help command
if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Usage: node generate.js <input_file> <theme_name> [scope_class]

Arguments:
  input_file    Path to .md or .docx file
  theme_name    Name of the theme (e.g., 'simple', 'academic')
  scope_class   Optional CSS scope class (default: 'living-syllabus')

Examples:
  node generate.js syllabus.md simple
  node generate.js week1.docx academic my-custom-scope
    `);
    process.exit(0);
}

if (args.length < 2) {
    console.error("❌ Error: Please provide both an input file and a theme.");
    console.error("   Usage: node generate.js <file.md|file.docx> <theme> [scope_class]");
    process.exit(1);
}

const inputFile = args[0];
const themeName = args[1];
// Remove leading dot if user provided it (e.g. .my-scope -> my-scope)
const scopeClass = (args[2] || 'living-syllabus').replace(/^\./, '');

// Construct output filename: inputfilename_themename.html
const baseName = path.basename(inputFile, path.extname(inputFile));
const outputFile = `${baseName}_${themeName}.html`;

// Resolve theme file path (root or ./themes/)
let cssFile = `${themeName}.css`;

if (!fs.existsSync(cssFile)) {
    if (fs.existsSync(`./themes/${cssFile}`)) {
         cssFile = `./themes/${cssFile}`;
    } else {
        console.error(`❌ Error: Theme file '${themeName}.css' not found in root or /themes.`);
        process.exit(1);
    }
}

/**
 * Main function to build the styled HTML component.
 * 1. Converts input file (MD/Docx) to HTML.
 * 2. Processes and flattens CSS variables.
 * 3. Inlines CSS into the HTML.
 * 4. Saves the result.
 */
async function buildComponent() {
    console.log(`\n🏗️  Compiling [${inputFile}] with [${themeName.toUpperCase()}] Theme (Scope: .${scopeClass})`);

    if (!fs.existsSync(inputFile)) {
        console.error(`❌ Error: Source file '${inputFile}' not found.`);
        return;
    }

    // --- Step 1: Determine File Type & Converter Args ---
    const fileExt = path.extname(inputFile).toLowerCase();
    let pandocArgs = '';

    if (fileExt === '.md' || fileExt === '.markdown') {
        console.log(`   ...Detected Markdown file. Using Markdown converter...`);
        // Use 'html5' format, prevent wrapping, and wrap headers in <section> or <div> tags (good for styling)
        pandocArgs = '-f markdown -t html5 --wrap=none --section-divs';
    } else if (fileExt === '.docx') {
        console.log(`   ...Detected Word document. Using Docx converter...`);
        pandocArgs = '-f docx -t html5 --wrap=none --section-divs';
    } else {
        console.error(`❌ Error: Unsupported file type '${fileExt}'. Please use .md or .docx`);
        return;
    }

    // --- Step 2: CSS Pre-processing (Flattening) ---
    const rawCss = fs.readFileSync(cssFile, 'utf8');

    // Step 2a: License Extraction
    // Extract comments containing "Theme", "Copyright", or "License" to preserve attribution.
    const licenseMatch = rawCss.match(/\/\*[\s\S]*?(?:Theme|Copyright|License)[\s\S]*?\*\//i);

    let licenseHeader = ``;
    if (licenseMatch) {
        // Strip CSS comment markers (/* and */) to get clean text
        const cleanText = licenseMatch[0].replace(/\/\*!?/, '').replace(/\*\//, '').trim();
        licenseHeader = `<!-- ${cleanText} -->`;
    }
    
    // Step 2b: Sanitization
    // Replace :host with :root for standard CSS compatibility
    // Remove complex data URIs to prevent large file sizes or rendering issues
    let sanitizedCss = rawCss.replace(/:host/g, ':root');
    sanitizedCss = sanitizedCss.replace(/url\("data:[^"]+"\)/g, 'none');

    console.log(`   ...Flattening CSS variables...`);
    let flatCss = '';
    
    try {
        // Flatten variables (custom properties) for inline style compatibility
        const result = await postcss([
            cssVariables({ preserve: false })
        ]).process(sanitizedCss, { from: cssFile, to: undefined });
        flatCss = result.css;
    } catch (err) {
        console.error('❌ CSS Compilation Error:', err);
        return;
    }

    // --- Step 3: Pandoc Conversion (Compiling) ---
    console.log(`   ...Converting Content to HTML...`);
    
    pandoc(inputFile, pandocArgs, (err, htmlContent) => {
        if (err) {
            console.error('❌ Pandoc Error:', err);
            return;
        }

        // --- Step 4: Container Wrapping ---
        const wrappedHtml = `
            <div class="${scopeClass}" style="max-width: 800px; margin: 0 auto; font-family: sans-serif;">
                ${htmlContent}
            </div>
            `;

        // --- Step 5: Inlining (CSS Application) ---
        const finalHtml = juice.inlineContent(wrappedHtml, flatCss, {
            applyStyleTags: true,
            removeStyleTags: true,
            preserveMediaQueries: false, // Disregard media queries for email/canvas safety
            widthElements: ['table', 'td', 'th']
        });

        // --- Step 6: Metadata Stamping ---
        const stamp = `<!-- Generated by Living Syllabus on ${new Date().toISOString()} -->\n\n${licenseHeader}\n\n`;

        fs.writeFileSync(outputFile, stamp + finalHtml);
        console.log(`✅ Success! Component generated: ${outputFile}`);
        console.log(`👉 Next: Open this file, Select All, and Paste into Canvas HTML Editor.`);
    });
}

buildComponent();