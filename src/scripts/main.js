import Reveal from 'reveal.js';
//import deck from '../comics/bulbe-oignon-chapter-1.json';
import deck from '../comics/panache-xxii-chapter-0.json';

const FRAGMENT_KIND_DIALOGUE     = 'dialogue';
const FRAGMENT_KIND_CAPTION      = 'caption';
const FRAGMENT_KIND_DESCRIPTION  = 'description';
const FRAGMENT_KINDS             = [
    FRAGMENT_KIND_DIALOGUE,
    FRAGMENT_KIND_CAPTION,
    FRAGMENT_KIND_DESCRIPTION,
];
const FRAGMENT_POSITION_TOP      = 'top';
const FRAGMENT_POSITION_BOTTOM   = 'bottom';
const FRAGMENT_POSITIONS         = [
    FRAGMENT_POSITION_TOP,
    FRAGMENT_POSITION_BOTTOM,
];
const FRAGMENT_TEXT_ALIGN_LEFT   = 'left';
const FRAGMENT_TEXT_ALIGN_CENTER = 'center';
const FRAGMENT_TEXT_ALIGN_RIGHT  = 'right';
const FRAGMENT_TEXT_ALIGNMENTS   = [
    FRAGMENT_TEXT_ALIGN_LEFT,
    FRAGMENT_TEXT_ALIGN_CENTER,
    FRAGMENT_TEXT_ALIGN_RIGHT,
];
const FRAGMENT_TAIL_DIR_LEFT     = 'left';
const FRAGMENT_TAIL_DIR_CENTER   = 'center';
const FRAGMENT_TAIL_DIR_RIGHT    = 'right';
const FRAGMENT_TAIL_DIRECTIONS   = [
    FRAGMENT_TAIL_DIR_LEFT,
    FRAGMENT_TAIL_DIR_CENTER,
    FRAGMENT_TAIL_DIR_RIGHT,
];

/**
 * Determines whether the passed value is an `Object`.
 *
 * @link    https://github.com/jonschlinkert/is-plain-object
 * @author  Jon Schlinkert.
 * @license MIT
 * @return  {boolean}
 */
const isObject = function (o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

/**
 * @param  {mixed}  input - Global settings.
 * @return {Object}
 */
const parseDeckSettings = function (input) {
    const data = {
        // Transition
        transition: 'fade',
        transitionSpeed: 'fast',

        // Presentation Size
        embedded: true,
        //center: false,
        margin: 0,

        // Fragment
        showFirstFragment: false,
        fragmentPosition: FRAGMENT_POSITION_TOP,
    };

    if (!isObject(input)) {
        return data;
    }

    if (typeof input.showFirstFragment !== 'boolean') {
        delete input.showFirstFragment;
    }

    if (
        (typeof input.fragmentPosition !== 'string') ||
        (FRAGMENT_POSITIONS.indexOf(input.fragmentPosition) < 0)
    ) {
        delete input.fragmentPosition;
    }

    return Object.assign(data, input);
}

/**
 * @param  {mixed}  input      - A slide variable.
 * @param  {Object} [settings] - Optional global settings.
 * @return {Object}
 */
const parseSlide = function (input, settings) {
    const data = {
        description:       null,
        background:        null,
        foreground:        null,
        fragments:         [],
        showFirstFragment: null,
    };

    if (!input) {
        return data;
    }

    if (typeof input.description === 'string') {
        data.description = input.description;
    }

    if (
        typeof input.background === 'string' ||
        Array.isArray(input.background) ||
        isObject(input.background)
    ) {
        data.background = input.background;
    }

    if (
        typeof input.foreground === 'string' ||
        isObject(input.foreground)
    ) {
        data.foreground = input.foreground;
    }

    if (Array.isArray(input.fragments)) {
        data.fragments = input.fragments;
    }

    if (typeof input.showFirstFragment === 'boolean') {
        data.showFirstFragment = input.showFirstFragment;
    } else if (typeof settings.showFirstFragment === 'boolean') {
        data.showFirstFragment = settings.showFirstFragment;
    }

    return data;
};

/**
 * @param  {mixed}  input      - A slide background variable.
 * @param  {Object} [settings] - Optional global settings.
 * @return {Object}
 */
const parseSlideBackground = function (input, settings) {
    const data = {
        color:  null,
        images: [],
    };

    if (!input) {
        return data;
    }

    if (typeof input === 'string') {
        data.images.push(input);
        return data;
    }

    if (Array.isArray(input)) {
        data.images = input;
        return data;
    }

    if (!isObject(input)) {
        return data;
    }

    if (typeof input.color === 'string') {
        data.color = input.color;
    }

    if (typeof input.image === 'string') {
        data.images.push(input.image);
        return data;
    }

    if (Array.isArray(input.images)) {
        data.images = input.images;
    }

    return data;
};

/**
 * @param  {mixed}  input      - A slide foreground variable.
 * @param  {Object} [settings] - Optional global settings.
 * @return {Object}
 */
const parseSlideForeground = function (input, settings) {
    const data = {
        text: null,
    };

    if (!input) {
        return data;
    }

    if (typeof input === 'string') {
        data.text = input;
        return data;
    }

    if (!isObject(input)) {
        return data;
    }

    if (typeof input.text === 'string') {
        data.text = input.text;
    }

    return data;
};

/**
 * @param  {mixed}  input      - A slide fragment variable.
 * @param  {Object} [settings] - Optional global settings.
 * @return {Object}
 */
const parseSlideFragment = function (input, settings) {
    const data = {
        kind:     FRAGMENT_KIND_CAPTION,
        position: FRAGMENT_POSITION_TOP,
        align:    FRAGMENT_TAIL_DIR_LEFT,
        label:    null,
        text:     null,
        lang:     null,
        tail:     {
            offset:    null,
            direction: FRAGMENT_TAIL_DIR_LEFT,
        },
    };

    if (typeof settings.fragmentPosition === 'string') {
        data.position = settings.fragmentPosition;
    }

    if (!input) {
        return data;
    }

    if (typeof input === 'string') {
        data.text = input;
        return data;
    }

    if (!isObject(input)) {
        return data;
    }

    if (
        (typeof input.kind === 'string') &&
        (FRAGMENT_KINDS.indexOf(input.kind) > -1)
    ) {
        data.kind = input.kind;
    }

    if (
        (typeof input.align === 'string') &&
        (FRAGMENT_TEXT_ALIGNMENTS.indexOf(input.align) > -1)
    ) {
        data.align = input.align;
    }

    if (
        (typeof input.position === 'string') &&
        (FRAGMENT_POSITIONS.indexOf(input.position) > -1)
    ) {
        data.position = input.position;
    }

    if (data.kind === FRAGMENT_KIND_DIALOGUE) {
        if (!isObject(input.tail)) {
            input.tail = {
                offset: input.tail,
            };
        }

        if (
            (typeof input.tail.offset === 'string') ||
            (typeof input.tail.offset === 'number')
        ) {
            data.tail.offset = input.tail.offset;
        }

        if (
            (typeof input.tail.direction === 'string') &&
            (FRAGMENT_TAIL_DIRECTIONS.indexOf(input.tail.direction) > -1)
        ) {
            data.tail.direction = input.tail.direction;
        }
    }

    if (typeof input.label === 'string') {
        data.label = input.label;
    }

    if (typeof input.text === 'string') {
        data.text = input.text;
    }

    if (
        (typeof input.lang === 'string') &&
        (input.lang !== deck.settings.lang)
    ) {
        data.lang = input.lang;
    }

    return data;
};

/**
 * @param  {number} index      - The fragment index.
 * @param  {Object} slide      - The current slide.
 * @param  {Object} [settings] - The global settings.
 * @return {boolean}
 */
const showSlideFragment = function (index, slide, settings) {
    return (index < 2) && (slide.showFirstFragment === true);
};

window.addEventListener('load', function () {
    try {
        const $slider = window.document.getElementById('slider');

        if (!$slider) {
            throw new ReferenceError('Missing slider');
        }

        if (
            !deck.information ||
            !deck.information.title
        ) {
            throw new Error('Missing information');
        }

        if (
            !deck.settings ||
            !deck.settings.lang ||
            !deck.settings.width ||
            !deck.settings.height
        ) {
            throw new Error('Missing settings');
        }

        const settings = parseDeckSettings(deck.settings);

        if (
            !Array.isArray(deck.slides) ||
            !deck.slides.length
        ) {
            throw new Error('Missing slides');
        }

        if (deck.information.collectionTitle) {
            window.document.title = deck.information.collectionTitle + ' — ' + deck.information.title;
        } else {
            window.document.title = deck.information.title;
        }

        window.document.documentElement.lang = settings.lang;

        const $slides = new DocumentFragment();

        /**
         * @param {Object} slide      - A deck slide that represents a panel of the story.
         * @param {number} slideIndex - The current index in the array.
         */
        deck.slides.forEach(function (slide, slideIndex) {
            slide = parseSlide(slide, settings);
            //console.group('Slide:', slideIndex);
            //console.log(slide);

            const $slide = document.createElement('section');
            $slide.setAttribute('aria-label', `Page ${(slideIndex + 1)}`);

            if (slide.background) {
                const background = parseSlideBackground(slide.background, settings);

                if (background.color) {
                    $slide.setAttribute('data-background-color', background.color);
                }

                /*if (background.images.length) {
                    let image = background.images.shift();
                    $slide.setAttribute('data-background-image', image);
                }*/

                if (background.images.length) {
                    const $stack = document.createElement('div');
                    $stack.classList.add('panel-artwork');
                    $stack.classList.add('r-stack');
                    $stack.setAttribute('role', 'img');

                    if (slide.description) {
                        $stack.setAttribute('aria-label', slide.description);
                    }

                    background.images.forEach(function (image) {
                        const $img = document.createElement('img');
                        $img.classList.add('panel-artwork-layer');
                        $img.setAttribute('role', 'presentation');
                        $img.loading = 'lazy';
                        $img.width   = settings.width;
                        $img.height  = settings.height;
                        $img.src     = image;
                        $img.alt     = '';

                        $stack.appendChild($img);
                    });

                    $slide.appendChild($stack);
                }
            }

            /**
             * @todo Maybe replace `aria-label` with `aria-details`
             *     to permit complex description of the image.
             */
            /*
            if (slide.description) {
                const $img = document.createElement('div');
                $img.classList.add('panel-artwork-reference');
                $img.setAttribute('role', 'img');
                $img.setAttribute('aria-label', slide.description);
                $slide.appendChild($img);
            }*/

            if (slide.fragments && slide.fragments.length) {
                const $fragments = document.createElement('div');
                $fragments.className = 'panel-captions';

                slide.fragments.forEach(function (fragment, fragIndex) {
                    fragment = parseSlideFragment(fragment, settings);
                    let showFragment = showSlideFragment(fragIndex, slide, settings);
                    //console.group('Fragment:', fragIndex, showFragment);
                    //console.log(fragment);

                    const $fragment = document.createElement('p');
                    $fragment.className = 'panel-caption panel-caption--wide';
                    $fragment.classList.add(`panel-caption--${fragment.position}`);

                    if (fragment.align) {
                        $fragment.classList.add(`text-${fragment.align}`);
                    }

                    if (fragment.kind) {
                        $fragment.setAttribute('data-fragment-kind', fragment.kind);
                    }

                    if (fragment.lang) {
                        $fragment.lang = fragment.lang;
                    }

                    if (slide.fragments.length > 1) {
                        $fragment.classList.add('fragment');

                        if (showFragment) {
                            $fragment.setAttribute('data-fragment-index', 0);

                            /**
                             * This switch statement is needed to correctly
                             * display the first fragment on changing slides
                             * and to fade between fragments.
                             */
                            switch (fragIndex) {
                                case 0:
                                    $fragment.classList.add('fade-out');
                                    break;
                                case 1:
                                    $fragment.classList.add('current-visible');
                                    break;
                            }
                        } else {
                            $fragment.classList.add('fade-down');
                            $fragment.classList.add('fade-in-then-out');
                        }
                    } else {
                        if (!showFragment) {
                            $fragment.classList.add('fragment');
                            $fragment.classList.add('fade-down');
                        }
                    }

                    if (fragment.text) {
                        $fragment.innerHTML = fragment.text;
                    }

                    if (fragment.tail.offset && fragment.tail.direction) {
                        const $tail = document.createElement('span');
                        $tail.className  = `panel-tail panel-tail--${fragment.tail.direction}`;
                        $tail.style.left = fragment.tail.offset;
                        $fragment.appendChild($tail);
                    }

                    $fragments.appendChild($fragment);
                    //console.groupEnd();
                });
                // $stack.appendChild($fragments);
                $slide.appendChild($fragments);
            }

            if (slide.foreground) {
                const foreground = parseSlideForeground(slide.foreground, settings);

                if (foreground.text) {
                    const $text = document.createElement('p');
                    $text.innerHTML = foreground.text;

                    $slide.appendChild($text);
                }
            }

            // $slide.appendChild($stack);
            $slides.appendChild($slide);
            //console.groupEnd();
        });
        $slider.appendChild($slides);

        if (!$slider.childElementCount) {
            throw new ReferenceError('Slider is empty');
        }

        Reveal.initialize(settings);
    } catch (error) {
        console.error('[Comix]', error);
    }
});
