const {
    isObject,
    composeHtmlAttribute,
    composeHtmlAttributes,
} = require('./helpers.js');

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
 * @param  {mixed}  input - Global settings.
 * @return {Object}
 */
function parseDeckSettings(input) {
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
function parseSlide(input, settings) {
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
    } else if (settings && (typeof settings.showFirstFragment === 'boolean')) {
        data.showFirstFragment = settings.showFirstFragment;
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

    if (!isObject(input)) {
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
}

/**
 * @param  {number} index      - The fragment index.
 * @param  {Object} slide      - The current slide.
 * @param  {Object} [settings] - The global settings.
 * @return {boolean}
 */
function showSlideFragment(index, slide, settings) {
    return (index < 2) && (slide.showFirstFragment === true);
}

/**
 * @param  {Object} fragment   - The current fragment.
 * @param  {number} [index]    - The current fragment index.
 * @param  {Object} [slide]    - The current slide.
 * @param  {Object} [settings] - The global settings.
 * @return {?string}
 */
function composeSlideFragmentAttributes(fragment, index, slide, settings) {
    const hasIndex = (typeof index === 'number');
    const hasSlide = (typeof slide === 'object');

    const showFragment = hasIndex && hasSlide && showSlideFragment(index, slide, settings);

    const attributes = {
        'class': [
            'panel-caption',
            'panel-caption--wide',
            `panel-caption--${fragment.position}`,
        ],
    };

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
            switch (index) {
                case 0:
                    attributes['class'].push('fade-out');
                    break;
                case 1:
                    attributes['class'].push('current-visible');
                    break;
            }
        } else {
            attributes['class'].push('fade-down');
            attributes['class'].push('fade-in-then-out');
        }
    } else {
        if (!showFragment) {
            attributes['class'].push('fragment');
            attributes['class'].push('fade-down');
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
function composeSlideFragmentTailAttributes(tail, fragment, settings) {
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
    composeSlideFragmentAttributes,
    composeSlideFragmentTailAttributes,
};
