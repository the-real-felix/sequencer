# Sequencer

A webcomic template, built with [reveal.js].

## Installation

### Development

Clone this repository and install its dependencies:

```bash
git clone https://github.com/the-real-felix/sequencer
cd sequencer
npm install
```

### Production

Upload the contents of the `public` directory to your web server or point your document root to it.

## Usage

The `public/index.html` file contains a `<script src="dist/comic.js">` tag, which means we need to create `public/dist/comic.js`. The `rollup.config.js` file tells Rollup how to create this bundle, starting with `src/main.js` and including all its dependencies, including [reveal.js].

- `npm run build` — Builds the application to `public/dist/comic.js`, along with a sourcemap file for debugging.
- `npm start` — Launches a server, using [serve]. Navigate to [localhost:3000](http://localhost:5000).
- `npm run watch` Will continually rebuild the application as your source files change.
- `npm run dev` Will run `npm start` and `npm run watch` in parallel.

## Credits

#### Reveal.js

An open source HTML presentation framework.

Created by [Hakim El Hattab][https://hakim.se/] and [contributors](https://github.com/hakimel/reveal.js/graphs/contributors).

### Rollup.js

An open source module bundler for JavaScript.

Created by [Rich Harris](https://github.com/Rich-Harris) and [contributors](https://github.com/rollup/rollup/graphs/contributors).

💬

[reveal.js]: https://revealjs.com/
[rollup.js]: https://rollupjs.org/
[serve]:     https://github.com/zeit/serve
