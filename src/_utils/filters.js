const {
    composeHtmlAttribute,
    composeHtmlAttributes,
} = require('./helpers.js');

const {
    isNil,
    isPlainObject,
} = require('lodash');

const SLIDE_TRANSITION_SPEED_DEFAULT = 'default';
const SLIDE_TRANSITION_SPEED_FAST    = 'fast';
const SLIDE_TRANSITION_SPEED_SLOW    = 'slow';
const SLIDE_TRANSITION_SPEEDS        = [
    SLIDE_TRANSITION_SPEED_DEFAULT,
    SLIDE_TRANSITION_SPEED_FAST,
    SLIDE_TRANSITION_SPEED_SLOW,
];
const SLIDE_TRANSITION_STYLE_NONE    = 'none';
const SLIDE_TRANSITION_STYLE_FADE    = 'fade';
const SLIDE_TRANSITION_STYLE_SLIDE   = 'slide';
const SLIDE_TRANSITION_STYLE_CONVEX  = 'convex';
const SLIDE_TRANSITION_STYLE_CONCAVE = 'concave';
const SLIDE_TRANSITION_STYLE_ZOOM    = 'zoom';
const SLIDE_TRANSITION_STYLES        = [
    SLIDE_TRANSITION_STYLE_NONE,
    SLIDE_TRANSITION_STYLE_FADE,
    SLIDE_TRANSITION_STYLE_SLIDE,
    SLIDE_TRANSITION_STYLE_CONVEX,
    SLIDE_TRANSITION_STYLE_CONCAVE,
    SLIDE_TRANSITION_STYLE_ZOOM,
];
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
 * The context of the iteration.
 *
 * @typedef  Loop
 * @type     {object}
 * @memberof {Nunjucks}
 * @property {number}  index     - The current iteration of the loop (1 indexed).
 * @property {number}  index0    - The current iteration of the loop (0 indexed).
 * @property {number}  revindex  - Number of iterations until the end (1 indexed).
 * @property {number}  revindex0 - Number of iterations until the end (0 based).
 * @property {boolean} first     - Boolean indicating the first iteration.
 * @property {boolean} last      - Boolean indicating the last iteration.
 * @property {boolean} length    - Total number of items.
 */

/**
 * @param  {mixed}  input      - Global settings.
 * @param  {Object} [defaults] - Alternative default settings.
 * @return {Object}
 */
function parseDeckSettings(input, defaults) {
    const data = defaults || {
        // Transition
        transition: SLIDE_TRANSITION_STYLE_NONE,
        transitionSpeed: SLIDE_TRANSITION_SPEED_FAST,

        // Presentation Size
        embedded: true,
        //center: false,
        margin: 0,

        // Fragment
        showFirstFragment: false,
        fragmentPosition: FRAGMENT_POSITION_TOP,
    };

    if (!isPlainObject(input)) {
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
function parseSlide(input, settings) {
    const data = {
        description:       null,
        background:        null,
        foreground:        null,
        fragments:         [],
        showFirstFragment: null,
        transition:        null,
        transitionSpeed:   null,
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
        isPlainObject(input.background)
    ) {
        data.background = parseSlideBackground(input.background);
    }

    if (
        typeof input.foreground === 'string' ||
        isPlainObject(input.foreground)
    ) {
        data.foreground = parseSlideForeground(input.foreground);
    }

    if (Array.isArray(input.fragments)) {
        data.fragments = input.fragments.map(parseSlideFragment);
    }

    if (typeof input.showFirstFragment === 'boolean') {
        data.showFirstFragment = input.showFirstFragment;
    } else if (settings && (typeof settings.showFirstFragment === 'boolean')) {
        data.showFirstFragment = settings.showFirstFragment;
    }

    if (typeof input.transition === 'string') {
        input.transition = input.transition.split(/\s+/).slice(0, 2);
    }

    if (Array.isArray(input.transition)) {
        let filterTransition;

        if (input.transition.length === 2) {
            const styles = SLIDE_TRANSITION_STYLES.join('|');
            const regex  = new RegExp(`^(${styles})(-(in|out))?$`);

            filterTransition = (transition) => {
                return regex.test(transition);
            };
        } else {
            filterTransition = (transition) => {
                return SLIDE_TRANSITION_STYLES.includes(transition);
            };
        }

        data.transition = input.transition.filter(filterTransition).join(' ');
    }

    if (
        (typeof input.transitionSpeed === 'string') &&
        SLIDE_TRANSITION_SPEEDS.includes(input.transitionSpeed)
    ) {
        data.transitionSpeed = input.transitionSpeed;
    }

    return data;
}

/**
 * @param  {mixed}  input      - A slide background variable.
 * @param  {Object} [settings] - Optional global settings.
 * @return {Object}
 */
function parseSlideBackground(input, settings) {
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

    if (!isPlainObject(input)) {
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
}

/**
 * @param  {mixed}  input      - A slide foreground variable.
 * @param  {Object} [settings] - Optional global settings.
 * @return {Object}
 */
function parseSlideForeground(input, settings) {
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

    if (!isPlainObject(input)) {
        return data;
    }

    if (typeof input.text === 'string') {
        data.text = input.text;
    }

    return data;
}

/**
 * @param  {mixed}  input      - A slide fragment variable.
 * @param  {Object} [settings] - Optional global settings.
 * @return {Object}
 */
function parseSlideFragment(input, settings) {
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

    if (settings && (typeof settings.fragmentPosition === 'string')) {
        data.position = settings.fragmentPosition;
    }

    if (!input) {
        return data;
    }

    if (typeof input === 'string') {
        data.text = input;
        return data;
    }

    if (!isPlainObject(input)) {
        return data;
    }

    if (
        (typeof input.kind === 'string') &&
        FRAGMENT_KINDS.includes(input.kind)
    ) {
        data.kind = input.kind;
    }

    if (
        (typeof input.align === 'string') &&
        FRAGMENT_TEXT_ALIGNMENTS.includes(input.align)
    ) {
        data.align = input.align;
    }

    if (
        (typeof input.position === 'string') &&
        FRAGMENT_POSITIONS.includes(input.position)
    ) {
        data.position = input.position;
    }

    if (data.kind === FRAGMENT_KIND_DIALOGUE) {
        if (!isPlainObject(input.tail)) {
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
            FRAGMENT_TAIL_DIRECTIONS.includes(input.tail.direction)
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
}

/**
 * @param  {number} index      - The fragment index (0 indexed).
 * @param  {Object} slide      - The current slide.
 * @param  {Object} [settings] - The global settings.
 * @return {boolean}
 */
function showSlideFragment(index, slide, settings) {
    return (index < 2) && (slide.showFirstFragment === true);
}

/**
 * @param  {Object} slide      - The current slide.
 * @param  {Loop}   [loop]     - The context of the iteration.
 * @param  {Object} [settings] - The global settings.
 * @return {?string}
 */
function composeHtmlAttributesForSlide(slide, loop, settings) {
    const attributes = {
        'class': [],
    };

    if (slide.transition) {
        attributes['data-transition'] = slide.transition;
    }

    if (slide.transitionSpeed) {
        attributes['data-transition-speed'] = slide.transitionSpeed;
    }

    if (slide?.background?.color) {
        attributes['data-transition-speed'] = slide.background.color;
    }

    if (loop.index) {
        attributes['aria-label'] = `Page ${loop.index}`;
    }

    return composeHtmlAttributes(attributes);
}

/**
 * @param  {Object} slide      - The current slide.
 * @param  {Object} [settings] - The global settings.
 * @return {?string}
 */
function composeHtmlAttributesForSlideBackground(slide, settings) {
    const attributes = {
        'class': [
            'panel-artwork',
            'r-stack',
        ],
        'role': 'img',
    };

    if (slide.description) {
        attributes['aria-label'] = slide.description;
    }

    return composeHtmlAttributes(attributes);
}

/**
 * @param  {string} image      - The current image path.
 * @param  {Object} [slide]    - The current slide.
 * @param  {Object} [settings] - The global settings.
 * @return {?string}
 */
function composeHtmlAttributesForSlideBackgroundImage(image, slide, settings) {
    if (!image) {
        return null;
    }

    const attributes = {
        'class':   [ 'panel-artwork-layer' ],
        'role':    'presentation',
        'loading': 'lazy',
        'src':     image,
        'alt':     '',
    };

    if (settings.width) {
        attributes['width'] = settings.width;
    }

    if (settings.height) {
        attributes['height'] = settings.height;
    }

    return composeHtmlAttributes(attributes);
}

/**
 * @param  {Object} fragment   - The current fragment.
 * @param  {Loop}   [loop]     - The context of the iteration.
 * @param  {Object} [slide]    - The current slide.
 * @param  {Object} [settings] - The global settings.
 * @return {?string}
 */
function composeHtmlAttributesForSlideFragment(fragment, loop, slide, settings) {
    const hasIndex = (typeof loop === 'object') && (typeof loop.index0 === 'number');
    const hasSlide = (typeof slide === 'object');

    const showFragment = hasIndex && hasSlide && showSlideFragment(loop.index0, slide, settings);

    const attributes = {
        'class': [
            'panel-caption',
            'panel-caption--wide',
        ],
    };

    if (fragment.position) {
        attributes['class'].push(`panel-caption--${fragment.position}`);
    }

    if (fragment.align) {
        attributes['class'].push(`text-${fragment.align}`);
    }

    if (fragment.kind) {
        attributes['data-fragment-kind'] = fragment.kind;
    }

    if (fragment.lang) {
        attributes['lang'] = fragment.lang;
    }

    if (hasIndex && hasSlide && slide.fragments.length > 1) {
        attributes['class'].push('fragment');

        if (showFragment) {
            attributes['data-fragment-index'] = 0;

            /**
             * This switch statement is needed to correctly
             * display the first fragment on changing slides
             * and to fade between fragments.
             */
            switch (loop.index0) {
                case 0:
                    attributes['class'].push('first-visible');
                    attributes['class'].push('fade-out');
                    break;
                case 1:
                    attributes['class'].push('fade-down');
                    attributes['class'].push('fade-in-then-out');
                    break;
            }
        } else {
            attributes['class'].push('fade-down');
            attributes['class'].push('fade-in-then-out');
        }
    } else {
        if (showFragment) {
            attributes['class'].push('first-visible');
        } else {
            attributes['class'].push('fragment');
            attributes['class'].push('fade-down');
            attributes['class'].push('fade-in-then-out');
        }
    }

    return composeHtmlAttributes(attributes);
}

/**
 * @param  {Object} tail       - The fragment tail.
 * @param  {Object} [fragment] - The related fragment.
 * @param  {Object} [settings] - The global settings.
 * @return {?string}
 */
function composeHtmlAttributesForSlideFragmentTail(tail, fragment, settings) {
    if ( ! tail.direction || isNil(tail.offset) ) {
        return null;
    }

    const attributes = {
        'role': 'presentation',
        'class': [
            'panel-tail',
            `panel-tail--${tail.direction}`,
        ],
        'style': `left: ${tail.offset};`,
    };

    return composeHtmlAttributes(attributes);
}

module.exports = {
    parseDeckSettings,
    parseSlide,
    parseSlideBackground,
    parseSlideForeground,
    parseSlideFragment,
    showSlideFragment,
    composeHtmlAttributesForSlide,
    composeHtmlAttributesForSlideBackground,
    composeHtmlAttributesForSlideBackgroundImage,
    composeHtmlAttributesForSlideFragment,
    composeHtmlAttributesForSlideFragmentTail,
};
