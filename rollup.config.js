import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/scripts/main.js',
    output: {
        file: 'public/dist/comic.js',
        format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        name: 'Comix',
        sourcemap: true
    },
    plugins: [
        resolve(), // tells Rollup how to find reveal.js in node_modules
        json(), // allows Rollup to convert .json files to ES6 modules
        production && terser() // minify, but only in production
    ]
};
