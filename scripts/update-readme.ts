import fs from 'fs';
import crypto from 'crypto';

// 1. Read the current version from package.json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8')) as { version: string };
const version = pkg.version;

try {
    // 2. Read the freshly built minified JS file
    const jsFile = fs.readFileSync('./dist/js/sheets-facets.js');

    // 3. Generate the SHA-384 hash and format it as Base64
    const hash = crypto.createHash('sha384').update(jsFile).digest('base64');
    const sri = `sha384-${hash}`;

    // 4. Read the current README.md
    let readme = fs.readFileSync('./README.md', 'utf8');

    // 5. Use Regex to find the existing CDN script tag and replace it
    const scriptRegex = /<script type="module" src="https:\/\/cdn\.jsdelivr\.net\/gh\/Colorado-SIPA\/cms-facets-webapp@v[\d\.]+\/dist\/js\/sheets-facets\.js" integrity="[^"]*" crossorigin="anonymous"><\/script>/g;
    
    const newScriptTag = `<script type="module" src="https://cdn.jsdelivr.net/gh/Colorado-SIPA/cms-facets-webapp@v${version}/dist/js/sheets-facets.js" integrity="${sri}" crossorigin="anonymous"></script>`;

    readme = readme.replace(scriptRegex, newScriptTag);

    // 6. Save the updated README.md
    fs.writeFileSync('./README.md', readme);
    
    console.log(`✅ Success! README.md updated to v${version} with new SRI Hash: ${sri}`);

} catch (error) {
    console.error('❌ Failed to update README.md. Did you run this after the build command?', error);
}