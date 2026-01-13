const fs = require('fs');
const postcss = require('postcss');
const prefixer = require('postcss-prefix-selector');
const cssnano = require('cssnano');

const CONFIG = {
    inputFile: './themes/raw_water.css',
    outputFile: './themes/safe_water.css',
    scopeClass: '.living-syllabus',
    brandColors: {
        '--background': '#ffffff',
        '--text-main': '#2d3748',
        '--primary': '#003366',
        '--links': '#cc0000',
        '--focus': 'rgba(0, 51, 102, 0.3)'
    }
};

const processCSS = async () => {
    try {
        if (!fs.existsSync(CONFIG.inputFile)) {
            throw new Error(`Input file not found: ${CONFIG.inputFile}`);
        }
        let css = fs.readFileSync(CONFIG.inputFile, 'utf8');

        // License Extraction
        const licenseMatch = css.match(/\/\*[\s\S]*?(?:Theme|Copyright|License)[\s\S]*?\*\//i);
        let licenseHeader = ``;
        
        if (licenseMatch) {
            // Preserve the license comment as is for the CSS output
            licenseHeader = licenseMatch[0];
        }

        // Inject Brand Colors
        console.log('🎨 Injecting Brand Colors...');
        Object.entries(CONFIG.brandColors).forEach(([key, value]) => {
            const regex = new RegExp(`${key}:\\s*[^;]+;`, 'g');
            css = css.replace(regex, `${key}: ${value};`);
        });

        // Scope the CSS
        console.log(`🛡️  Scoping CSS to "${CONFIG.scopeClass}"...`);
        const result = await postcss()
            .use(prefixer({
                prefix: CONFIG.scopeClass,
                transform: function (prefix, selector, prefixedSelector, filePath, rule) {
                    if (selector === 'body' || selector === 'html') {
                        return prefix;
                    }
                    if (selector === ':root') {
                        return selector;
                    }
                    return prefixedSelector;
                }
            }))
            .use(cssnano({ preset: 'default' }))
            .process(css, { from: CONFIG.inputFile, to: CONFIG.outputFile });

        // Save the Result with License Header
        const finalCss = licenseHeader ? `${licenseHeader}\n${result.css}` : result.css;
        fs.writeFileSync(CONFIG.outputFile, finalCss);
        
        console.log(`✅ Success! Safe theme saved to: ${CONFIG.outputFile}`);
        console.log(`   Size: ${(finalCss.length / 1024).toFixed(2)} KB`);

    } catch (err) {
        console.error('❌ Build Failed:', err.message);
    }
};

processCSS();