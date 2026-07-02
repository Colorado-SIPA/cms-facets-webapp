import { defineConfig } from 'vite';
import minifyHTML from '@lit-labs/rollup-plugin-minify-html-literals';

export default defineConfig({
    plugins: [
        minifyHTML(),
    ],
    build: {
        // Put the compiled files in a 'dist' folder
        outDir: 'dist',

        // Empty the folder before each build to keep things clean
        emptyOutDir: true,

        // Prevent Vite from creating multiple CSS files
        cssCodeSplit: false,

        rollupOptions: {
            output: {
                // Force predictable filenames for Drupal's libraries.yml
                entryFileNames: 'js/sheets-facets.js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'css/sheets-facets.css';
                    }
                    // Catch-all for images/fonts if you add them later
                    return 'assets/[name].[ext]';
                }
            },
        }
    }
});