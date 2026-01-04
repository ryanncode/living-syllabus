/**
 * THE CLASSLESS CSS TRANSFORMER (The Builder)
 * -------------------------------------------
 * Purpose: Takes a standard "Classless" CSS file and makes it LMS-Safe.
 * 1. Scopes all selectors to a wrapper class (so it doesn't break Canvas UI).
 * 2. Injects University Brand colors.
 * 3. Minifies the output.
 */

const fs = require('fs');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');
const cssnano = require('cssnano');

// --- CONFIGURATION -----------------------------------------
const CONFIG = {
    // 1. Where is the raw CSS coming from? (Download a file and put it here)
    inputFile: './themes/raw_water.css',
    
    // 2. Where should the "Safe" file go?
    outputFile: './themes/safe_water.css',

    // 3. The "Wrapper Class" that protects the LMS
    // Your HTML must be wrapped in <div class="living-syllabus">...</div>
    scopeClass: '.living-syllabus',

    // 4. University Branding (Variable Overrides)
    // These replace the :root variables in the CSS file.
    brandColors: {
        '--background': '#ffffff',         // Force white background
        '--text-main': '#2d3748',          // Dark Grey text
        '--primary': '#003366',            // University Blue (Example)
        '--links': '#cc0000',              // University Red (Example)
        '--focus': 'rgba(0, 51, 102, 0.3)' // Focus ring color
    }
};
// -----------------------------------------------------------

const processCSS = async () => {
    try {
        // 1. Read the Raw CSS
        if (!fs.existsSync(CONFIG.inputFile)) {
            throw new Error(`Input file not found: ${CONFIG.inputFile}`);
        }
        let css = fs.readFileSync(CONFIG.inputFile, 'utf8');

        // 2. Inject Brand Colors (Variable Replacement Strategy)
        // We manually replace the :root definition or specific variable strings.
        console.log('🎨 Injecting Brand Colors...');
        Object.entries(CONFIG.brandColors).forEach(([key, value]) => {
            // Regex matches the variable definition: --variable: value;
            const regex = new RegExp(`${key}:\\s*[^;]+;`, 'g');
            css = css.replace(regex, `${key}: ${value};`);
        });

        // 3. Scope the CSS (The "Canvas Safety" Step)
        // This transforms "h1 { color: red }" into ".living-syllabus h1 { color: red }"
        console.log(`🛡️  Scoping CSS to "${CONFIG.scopeClass}"...`);
        const result = await postcss()
            .use(prefixer({
                prefix: CONFIG.scopeClass,
                transform: function (prefix, selector, prefixedSelector, filePath, rule) {
                    // Special Case: Handle :root and body tags
                    if (selector === 'body' || selector === 'html') {
                        return prefix; // vital: turns "body" into ".living-syllabus"
                    }
                    if (selector === ':root') {
                        return selector; // leave :root alone so variables work globally within scope
                    }
                    return prefixedSelector;
                }
            }))
            .use(cssnano({ preset: 'default' })) // Minify
            .process(css, { from: CONFIG.inputFile, to: CONFIG.outputFile });

        // 4. Save the Result
        fs.writeFileSync(CONFIG.outputFile, result.css);
        console.log(`✅ Success! Safe theme saved to: ${CONFIG.outputFile}`);
        console.log(`   Size: ${(result.css.length / 1024).toFixed(2)} KB`);

    } catch (err) {
        console.error('❌ Build Failed:', err.message);
    }
};

processCSS();