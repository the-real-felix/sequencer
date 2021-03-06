# Sequencer

A webcomic template, built with [Eleventy] and [Reveal.js].

## Installation

### Development

Clone this repository and install its dependencies:

```bash
git clone https://github.com/the-real-felix/sequencer
cd sequencer
npm install
```

### Production

Upload the contents of the `dist` directory to your web server or point your document root to it.

## Usage

- `npx @11ty/eleventy` — Searches the input `src` directory and compiles any input template files into the ouput `dist` directory.
- `npx @11ty/eleventy --watch` — Automatically runs when input template files change. Useful if you have your own web server.
- `npx @11ty/eleventy --serve` — Boots up a Browsersync web server at `http://localhost:8080/` to apply changes (using `--watch`) and refresh automatically.

See documentation on Eleventy's [command line usage](https://www.11ty.dev/docs/usage/).

## Reference

### Contents

```
comix/
├── dist/
└── src/
    ├── _assets/
    ├── _data/
    ├── _includes/
    ├── _layouts/
    ├── _schemas/
    ├── _stubs/
    ├── _utils/
    ├── <series-title>/
    │   ├── <chapter-title>/
    │   │   ├── images/
    │   │   └── index.njk
    │   ├── <chapter-title>/
    │   │   ├── images/
    │   │   └── index.njk
    │   ├── <series-title>.json
    │   └── index.njk
    ├── <one-shot-title>/
    │   ├── images/
    │   └── index.njk
    ├── 404.njk
    └── index.njk
```

### Story Structure

- `<series-title>.json` — Optional. A JSON [directory data file](https://www.11ty.dev/docs/data-template-dir/) merged with page data. Practical for information shared across all chapters in  series.
- `index.njk` — Required. A Nunjucks template file with JSON or YAML [front matter data](https://www.11ty.dev/docs/data-frontmatter/). The front matter provides the chapter's story (slides). The template body can replace the default layout if a custom design is desired.

### Story Schema (Version 1)

#### Envelope

- `version` — Required. Must be `1`, an integer representing the semantics used in the comic. 
- `lang` — Required. The primary language of the story. A "language tag" according to BCP47 (such as `fr`, `en-CA`).
- `title` — Required. The title of the web page; the name of this story or chapter.
- `description` — Optional. A description of this story or chapter.
- `seriesTitle` — Optional. The name of the series or collection of stories.
- `chapterTitle` — Optional. The name of this story or chapter.
- `chapterNumber` — Optional. The position of this chapter in a series or collection of stories.
- `revealTheme` — Optional. The stylesheet for [reveal.js].
  See [reveal.js website](https://revealjs.com/themes/) for available themes.
- `revealSettings` — Required. The configuration options of [reveal.js].
  - `width` — Required. The width of the presentation (image) in pixels.
  - `height` — Required. The height of the presentation (image) in pixels.
  - `showFirstFragment` — Optional. Whether to show the first fragment upon entering a slide. If omitted the default is `false`.
  - See [reveal.js website](https://revealjs.com/config/) for additional options.
- `slides` — Required. One or more slides each representing a single page, or panel, of your story.

```json
{
  "version": 1,
  "title": "Foobar: Xyzzy",
  "description": "Itaque rursus eadem ratione…",
  "seriesTitle": "Foobar",
  "chapterTitle": "Xyzzy",
  "chapterNumber": 0,
  "revealTheme": "moon",
  "revealSettings": {
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

#### Slides

- `description` — Optional. The alternative text description of the image.
- `background` — Optional. A full page color, zero or more background images.
  - `color` — Optional. A CSS color format, including hex values, keywords, `rgba()`, or `hsl()`.
  - `image` — Optional. The relative file path to the background image.
  - `images` — Optional. An array of relative file paths to one or more background images.
- `foreground` — Optional. Text centered over your slide.
  - `text` — Optional. Text centered over your slide.
- `fragments` — Optional. Zero or more incrementally revealed captions and dialogue.
- `showFirstFragment` — Optional. Whether to show the first fragment upon entering a slide, if different from the global attribute.
- `transition` — Optional. The transition style. If omitted the default style is `none`.
  You can also use different in and out transitions for the same slide by appending `-in` or `-out` to the transition name.
- `transitionSpeed` — Optional. The transition speed. If omitted the default style is `fast`.

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
  ],
  "transition": "fade",
  "transitionSpeed": "slow"
},
{
  "background": "…/02.png",
  "transition": [
    "slide-in",
    "fade-out"
  ],
  "transitionSpeed": "default"
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

#### Fragments

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

#### Eleventy

An open source static site generator.

Created by [Zach Leat][https://zachleat.com/] and [contributors](https://github.com/11ty/eleventy/graphs/contributors).

#### Reveal.js

An open source HTML presentation framework.

Created by [Hakim El Hattab][https://hakim.se/] and [contributors](https://github.com/hakimel/reveal.js/graphs/contributors).

💬

[BCP47]:     https://tools.ietf.org/html/bcp47
[Eleventy]:  https://11ty.dev/
[Reveal.js]: https://revealjs.com/
