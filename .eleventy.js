const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginNavigation = require('@11ty/eleventy-navigation');

const filters = require('./src/_utils/filters.js');
const transforms = [];// require('./src/_utils/transforms.js');
const shortcodes = [];// require('./src/_utils/shortcodes.js');
const helpers = [];// require('./src/_utils/functions.js');

/**
 * @param {@11ty/eleventy~UserConfig}
 */
module.exports = function (config) {
    // Plugins
    config.addPlugin(pluginRss);
    config.addPlugin(pluginNavigation);

    // Filters
    Object.keys(filters).forEach((filterName) => {
        config.addFilter(filterName, filters[filterName]);
    });

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        config.addTransform(transformName, transforms[transformName]);
    });

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        config.addShortcode(shortcodeName, shortcodes[shortcodeName]);
    });

    // Globals
    Object.keys(helpers).forEach((helperName) => {
        config.addGlobalData(helperName, () => helpers[helperName]);
    });

    // Asset Watch Targets
    config.addWatchTarget('./src/_assets');

    // Layouts
    config.addLayoutAlias('base', 'base.njk');
    config.addLayoutAlias('comic', 'comic.njk');
    config.addLayoutAlias('atom.xml', 'atom.xml.njk');
    config.addLayoutAlias('feed.json', 'feed.json.njk');

    // Pass-through files
    config.addPassthroughCopy('src/robots.txt');
    config.addPassthroughCopy('src/site.webmanifest');
    config.addPassthroughCopy({ 'node_modules/reveal.js/dist': 'assets/reveal' });
    config.addPassthroughCopy({ 'src/_assets': 'assets' });
    config.addPassthroughCopy('src/**/images/**/*.gif');
    config.addPassthroughCopy('src/**/images/**/*.jpg');
    config.addPassthroughCopy('src/**/images/**/*.png');
    config.addPassthroughCopy('src/**/script.js');
    config.addPassthroughCopy('src/**/style.css');

    // Deep-Merge
    config.setDataDeepMerge(true);

    // Base Config
    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: '_includes',
            layouts: '_layouts',
            data: '_data',
        },
        templateFormats: [ 'njk', 'md', '11ty.js' ],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
    };
};
