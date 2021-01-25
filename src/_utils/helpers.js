/**
 * @file Common helpers.
 */

/**
 * Determines whether the passed value is an `Object`.
 *
 * @link    https://github.com/jonschlinkert/is-plain-object
 * @author  Jon Schlinkert.
 * @license MIT
 * @return  {boolean}
 */
function isObject(o) {
    return Object.prototype.toString.call(o) === '[object Object]';
}

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
    }

    if (condition) {
        if ((typeof value === 'boolean') || value === null) {
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
    isObject,
    composeTokenList,
    composeHtmlAttribute,
    composeHtmlAttributes,
    composeHtmlClassAttribute,
};
