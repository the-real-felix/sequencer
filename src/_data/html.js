/**
 * @file HTML rendering utilities.
 *
 * @todo When Eleventy v1.0.0 is released, migrate these functions
 * to {@link https://www.11ty.dev/docs/data-global-custom/ custom global data}.
 */

const {
    composeHtmlAttribute,
    composeHtmlAttributes,
    composeHtmlClassAttribute,
} = require('../_utils/helpers.js');

module.exports = {
    attr:  composeHtmlAttribute,
    attrs: composeHtmlAttributes,
    class: composeHtmlClassAttribute,
};
