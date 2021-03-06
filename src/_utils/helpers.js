/**
 * @file Common helpers.
 */

const {
    isEmpty,
    isNil,
    isString,
} = require('lodash');

/**
 * @link   https://github.com/JedWatson/classnames
 * @param  {...(string|object)} arguments - A token (string) or conditional token pair (object).
 * @return {?string}
 */
function composeTokenList() {
    const tokens = [];
    for (const arg of arguments) {
        if (Array.isArray(arg)) {
            if (arg.length) {
                const subset = composeTokenList(...arg);
                if (subset) {
                    tokens.push(subset);
                }
            }
            continue;
        }

        const argType = typeof arg;

        if (argType === 'string' || argType === 'number') {
            tokens.push(arg);
        } else if (argType === 'object') {
            if (arg.toString !== Object.prototype.toString) {
                tokens.push(arg.toString());
            } else {
                for (const [ key, condition ] of Object.entries(arg)) {
                    if (condition) {
                        tokens.push(key);
                    }
                }
            }
        }
    }

    if (tokens.length) {
        return tokens.join(' ');
    }

    return null;
}

/**
 * @param  {string}  name        The attribute name.
 * @param  {*}       value       The attribute value.
 * @param  {boolean} [condition] The condition to render the attribute.
 * @return {?string}
 */
function composeHtmlAttribute(name, value, condition) {
    if (typeof condition === 'undefined') {
        condition = value;

        if (isNil(condition)) {
            condition = false;
        } else if (isFinite(condition)) {
            condition = true;
        } else if (isString(condition)) {
            condition = true;
        }
    }

    if (condition) {
        if (typeof value === 'boolean') {
            return ` ${name}`;
        } else {
            value = composeTokenList(value);
            if (value !== null) {
                return ` ${name}="${value}"`;
            }
        }
    }

    return null;
}

/**
 * @param  {object} attributes - A map of attribute names and values.
 * @return {?string}
 */
function composeHtmlAttributes(attributes) {
    const attrs = [];
    for (const [ name, value ] of Object.entries(attributes)) {
        const attr = composeHtmlAttribute(name, value);
        if (attr !== null) {
            attrs.push(attr);
        }
    }

    return attrs.join('');
}

/**
 * @param  {...(string)} arguments - A class name (string) or conditional class name (object).
 * @return {?string}
 */
function composeHtmlClassAttribute() {
    const classNames = composeTokenList(...arguments);

    if (classNames !== null) {
        return `class="${classNames}"`;
    }

    return null;
}

module.exports = {
    composeTokenList,
    composeHtmlAttribute,
    composeHtmlAttributes,
    composeHtmlClassAttribute,
};
