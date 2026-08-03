const fs = require('fs');
const path = require('path');
const { buildComponent } = require('./generate.js');

const CONTENT_DIR = path.join(__dirname, 'content');
const DIST_DIR = path.join(__dirname, 'dist');
const DEFAULT_THEME = 'latex';

// Folder to Theme Mapping
const THEME_MAP = {
    'syllabus': 'latex',
    'assignments': 'paper',
    'pages': 'sakura',
    'announcements': 'water',
    'discussions': 'simple'
};

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, "/", file));
        }
    });

    return arrayOfFiles;
}

/**
 * Main build process
 */
async function buildAll() {
    console.log('🚀 Starting Living Syllabus Batch Build...');
    
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`❌ Content directory not found: ${CONTENT_DIR}`);
        return;
    }

    // Parse command line arguments for multi-format options
    const args = process.argv.slice(2);
    const formats = ['html'];
    
    const artifactArg = args.find(arg => arg.startsWith('--artifact='));
    if (artifactArg) {
        const val = artifactArg.split('=')[1].toLowerCase();
        if (val === 'pdf') formats.push('pdf');
        if (val === 'docx') formats.push('docx');
        if (val === 'both') formats.push('pdf', 'docx');
    }
    
    // Backward compatibility
    if (args.includes('--pdf')) formats.push('pdf');
    if (args.includes('--docx')) formats.push('docx');

    const allFiles = getAllFiles(CONTENT_DIR);
    const supportedFiles = allFiles.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.md' || ext === '.docx';
    });

    if (supportedFiles.length === 0) {
        console.log('⚠️ No markdown (.md) or word (.docx) files found in content directory.');
        return;
    }

    // Process all files in parallel
    const buildPromises = supportedFiles.map(inputFile => {
        // Determine relative path to maintain directory structure in dist/
        const relativePath = path.relative(CONTENT_DIR, inputFile);
        const relativeDir = path.dirname(relativePath);
        
        // Output directory is dist/ + relativeDir
        const outputDir = path.join(DIST_DIR, relativeDir);
        
        // Determine theme based on the root folder name inside content/
        const rootFolder = relativePath.split(path.sep)[0];
        const themeName = THEME_MAP[rootFolder] || DEFAULT_THEME;

        return buildComponent({
            inputFile,
            themeName,
            scopeClass: 'living-syllabus',
            outputDir,
            formats
        });
    });

    try {
        await Promise.all(buildPromises);
        console.log('\n✨ Build Complete! All files have been generated in the /dist folder.');
    } catch (err) {
        console.error('\n❌ Build Failed:', err);
    }
}

buildAll();
