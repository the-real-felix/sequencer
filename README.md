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
- `npm run watch` — Will continually rebuild the application as your source files change.
- `npm run dev` — Will run `npm start` and `npm run watch` in parallel.

## Schema Version 1

### Envelope

- `version` — Required. Must be `1`, an integer representing the semantics used in the comic. 
- `information` — Required. A summary of the story.
  - `title` — Required. The name of this story or chapter.
  - `description` — Optional. A description of this story or chapter.
  - `collectionTitle` — Optional. The name of the series or collection of stories.
  - `chapterNumber` — Optional. The position of this chapter in a series or collection of stories.
- `settings` — Required. The configuration options of [reveal.js].
  - `lang` — Required. The primary language of the story. A "language tag" according to BCP47 (such as `fr`, `en-CA`).
  - `width` — Required. The width of the presentation (image) in pixels.
  - `height` — Required. The height of the presentation (image) in pixels.
  - `showFirstFragment` — Optional. Whether to show the first fragment upon entering a slide. If omitted the default is `false`.
  - See [reveal.js website](https://revealjs.com/config/) for additional options.
- `slides` — Required. One or more slides each representing a single page, or panel, of your story.

```json
{
  "version": 1,
  "information": {
    "collectionTitle": "Foobar",
    "chapterNumber": 0,
    "title": "Xyzzy",
    "description": "Itaque rursus eadem ratione…"
  },
  "settings": {
    "lang": "fr",
    "width": 1750,
    "height": 840
  },
  "slides": [
    {
      "background": "…/01.png",
      "fragments": [
        "Quod autem in homine…"
      ]
    }
  ]
}
```

### Slides

- `description` — Optional. The alternative text description of the image.
- `background` — Optional. Zero or more background images.
- `foreground` — Optional. Content centered over your slide.
- `fragments` — Optional. Zero or more incrementally revealed captions and dialogue.
- `showFirstFragment` — Optional. Whether to show the first fragment upon entering a slide, if different from the global attribute.

```json
{
  "background": "…/01.png",
  "fragments": [
    "Quod autem in homine…",
    "Si quicquam extra virtutem habeatur…",
    {
      "kind": "caption",
      "text": "Eadem nunc mea adversum…"
    }
  ]
}
```

```json
{
  "background": {
    "image": "…/01.png"
  }
}
```

```json
{
  "background": [
    "…/01/fond.png",
    "…/01/p3.png",
    "…/01/p2.png",
    "…/01/p1.png"
  ]
}
```

```json
{
  "background": {
    "images": [
      "…/01/fond.png",
      "…/01/p3.png",
      "…/01/p2.png",
      "…/01/p1.png"
    ]
  }
}
```

```json
{
  "background": {
    "color": "red"
  },
  "foreground": {
    "text": "…"
  }
}
```

### Fragments

- `text` — Required. The primary content of the fragment.  
  HTML is accepted, such as:
  - `<b>bold text</b>`
  - `<i>italic text</i>`
- `kind` — Optional. The type of content. If omitted the default kind is `caption`.
  - `caption` represents location, time, speech, narration, or editorial;
  - `description` represents textual alternative of the image, suitable for users who are blind;
  - `dialogue` represents a character speaking. Provides a `tail` that should point to a character.
- `lang` — Optional. The language of the content, if different from the global attribute.
- `label` — Optional. Describes the source of the text such as a narrator or a character.
- `align` — Optional. The alignment of the text. One of `left`, `center`, or `right`. If omitted the default alignment is `left`.
- `position` — Optional. The location of the fragment. One of `top` or `bottom`. If omitted the default position is `top`.
- `tail` — Optional. The tail points from the content to a character or object.
  - `offset` — Required. A length (`960`) or a percentage `50%`.
  - `direction` — Optional. One of `left`, `center`, or `right`. If omitted the default alignment is `left`.

```json
{
  "kind": "caption",
  "text": "Eadem <i>nunc</i> mea adversum…"
}
```

```json
{
  "kind": "description",
  "label": "Homme",
  "text": "*Crac*",
  "position": "bottom"
}
```

```json
{
  "kind": "dialogue",
  "label": "John",
  "text": "Quod autem in <b>homine</b>…",
  "tail": {
    "offset": "35%",
    "direction": "right"
  }
}
```

## Credits

#### Reveal.js

An open source HTML presentation framework.

Created by [Hakim El Hattab][https://hakim.se/] and [contributors](https://github.com/hakimel/reveal.js/graphs/contributors).

### Rollup.js

An open source module bundler for JavaScript.

Created by [Rich Harris](https://github.com/Rich-Harris) and [contributors](https://github.com/rollup/rollup/graphs/contributors).

💬

[BCP47]:     https://tools.ietf.org/html/bcp47
[reveal.js]: https://revealjs.com/
[rollup.js]: https://rollupjs.org/
[serve]:     https://github.com/zeit/serve
