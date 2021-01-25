(function () {

    /**
     * Retrieves the deck settings as JSON from a script element.
     *
     * @param  {string} - [selector] The deck settings element.
     * @return {?Object}
     * @throws {SyntaxError} If the string to parse is not valid JSON.
     */
    function getDeckSettingsFromScript(selector)
    {
        const script = document.querySelector(selector || '#c-reveal-settings');
        if (!script || !script.textContent) {
            return null;
        }

        return JSON.parse(script.textContent);
    }

    window.addEventListener('load', () => {
        try {
            if (!Reveal) {
                throw new Error('Reveal.js is missing')
            }

            const settings = getDeckSettingsFromScript();
            Reveal.initialize(settings);
        } catch (error) {
            console.error('[Comix]', error);
        }
    });

})();
