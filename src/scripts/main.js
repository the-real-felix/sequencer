import Reveal from 'reveal.js';
import panels from './comic.json';

/**
 * @typedef ComicPanel
 * @type {Object}
 *
 * @property {?string}  description - A text description of the frame,
 *     which isn't mandatory but is incredibly useful for accessibility.
 * @property {string[]} captions    - Zero or more captions to display
 *     over the frame. The first caption is visible upon entering the frame.
 *     Subsequent captions are displayed as one navigates the frame.
 * @property {?string}  background  - A background image for the frame.
 * @property {string[]} layers      - Zero or more images stacked
 *     on top of each other.
 */

window.addEventListener('load', function () {
    try {
        const slider = window.document.getElementById('slider');

        if (!slider) {
            throw new ReferenceError('Missing slider');
        }

        if (!panels.length) {
            throw new Error('Missing panels');
        }

        const slidesFragment = new DocumentFragment();

        /**
         * @param {ComicPanel} panel - A panel of the story.
         */
        panels.forEach(function (panel) {
            const slide = document.createElement('section');
            const stack = document.createElement('div');
            stack.classList.add('r-stack');

            if (panel.background) {
                slide.setAttribute('data-background-image', panel.background);
            }

            /**
             * @todo Maybe replace `aria-label` with `aria-details`
             *     to permit complex description of the image.
             */
            if (panel.description) {
                /** APPROACH #1 */
                let img = document.createElement('div');
                img.classList.add('panel-artwork');
                img.setAttribute('role', 'img');
                img.setAttribute('aria-label', panel.description);
                slide.appendChild(img);

                /** APPROACH: #2 */
                // slide.innerHTML += `<div class="panel-artwork" role="img" aria-label="${panel.description}"></div>`;
            }

            /**
             * @todo Configure heights elsewhere?
             */
            if (panel.layers && panel.layers.length) {
                /** APPROACH #1 */
                let layersFragment = new DocumentFragment();
                panel.layers.forEach(function (layer) {
                    let img = document.createElement('img');
                    img.classList.add('panel-artwork-layer');
                    img.loading = 'lazy';
                    img.width = 1750;
                    img.height = 840;
                    img.src = layer;

                    layersFragment.appendChild(img);
                });
                stack.appendChild(layersFragment);

                /** APPROACH: #2 */
                /*
                let layers = panel.layers.reduce(function (layers, layer) {
                    return layers + `<img class="panel-artwork-layer" loading="lazy" src="${layer}" width="1750" height="840" />`;
                }, '');
                stack.innerHTML += layers;
                */
            }

            if (panel.captions && panel.captions.length) {
                /** APPROACH #1 */
                let captionsFragment = new DocumentFragment();
                panel.captions.forEach(function (caption, index) {
                    let box = document.createElement('p');
                    box.className = 'panel-caption panel-caption--top panel-caption--wide';
                    if (panel.captions.length > 1) {
                        box.classList.add('fragment');
                        box.classList.add('fade-down');
                        switch (index) {
                            case 0:
                                box.setAttribute('data-fragment-index', 0);
                                box.classList.add('fade-out');
                                break;
                            case 1:
                                box.setAttribute('data-fragment-index', 0);
                                box.classList.add('current-visible');
                                break;
                            default:
                                box.classList.add('fade-in-then-out');
                                break;
                        }
                    }
                    box.innerHTML = caption;

                    captionsFragment.appendChild(box);
                });
                stack.appendChild(captionsFragment);

                /** APPROACH: #2 */
                /*
                stack.innerHTML += panel.captions.reduce(function (captions, caption, index) {
                    let fragmentIndex = '';
                    let className = 'panel-caption panel-caption--top panel-caption--wide';
                    if (panel.captions.length > 1) {
                        className += ' fragment fade-down';
                        switch (index) {
                            case 0:
                                box.setAttribute('data-fragment-index', 0);
                                fragmentIndex += ' data-fragment-index="0"';
                                className += ' fade-out';
                                break;
                            case 1:
                                box.setAttribute('data-fragment-index', 0);
                                fragmentIndex += ' data-fragment-index="0"';
                                className += ' current-visible';
                                break;
                            default:
                                className += ' fade-in-then-out';
                                break;
                        }
                    }
                    return captions + `<p class="${className}"${fragmentIndex}>${panel.captions.pop()}</p>`;
                }, '');
                */
            }

            slide.appendChild(stack);
            slidesFragment.appendChild(slide);
        });
        slider.appendChild(slidesFragment);

        if (!slider.childElementCount) {
            throw new ReferenceError('Slider is empty');
        }

        Reveal.initialize({
            // Transition
            transition: 'fade',
            transitionSpeed: 'fast',

            // Presentation Size
            embedded: true,
            //center: false,
            width: 1750,
            height: 840,
            margin: 0,
        });
    } catch (error) {
        console.error('[Comix]', error);
    }
});
