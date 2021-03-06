/* eslint-disable global-require */
import 'codemirror/mode/meta.js';
import CodeMirror from 'codemirror';

export default {
    namespaced: true,
    state: {
        modes: CodeMirror.modeInfo,
        selectedMode: '',
        options: {
            mode: '',
            theme: 'dracula',
            indentUnit: 4,
            tabSize: 4,
            styleActiveLine: true,
            lineWrapping: true,
            lineNumbers: true,
            autofocus: true,
            cursorScrollMargin: 75,
        },
        themes: [
            { text: '3024 Day', value: '3024-day' },
            { text: '3024 Night', value: '3024-night' },
            { text: 'abcdef', value: 'abcdef' },
            { text: 'Ambiance Mobile', value: 'ambiance-mobile' },
            { text: 'Ambiance', value: 'ambiance' },
            { text: 'Base16 Dark', value: 'base16-dark' },
            { text: 'Base16 Light', value: 'base16-light' },
            { text: 'Bespin', value: 'bespin' },
            { text: 'Blackboard', value: 'blackboard' },
            { text: 'Cobalt', value: 'cobalt' },
            { text: 'Colorforth', value: 'colorforth' },
            { text: 'Darcula', value: 'darcula' },
            { text: 'Dracula', value: 'dracula' },
            { text: 'Duotone Dark', value: 'duotone-dark' },
            { text: 'Duotone Light', value: 'duotone-light' },
            { text: 'Eclipse', value: 'eclipse' },
            { text: 'Elegant', value: 'elegant' },
            { text: 'Erlang Dark', value: 'erlang-dark' },
            { text: 'Gruvbox Dark', value: 'gruvbox-dark' },
            { text: 'Hopscotch', value: 'hopscotch' },
            { text: 'Icecoder', value: 'icecoder' },
            { text: 'Idea', value: 'idea' },
            { text: 'Isotope', value: 'isotope' },
            { text: 'Lesser Dark', value: 'lesser-dark' },
            { text: 'Liquibyte', value: 'liquibyte' },
            { text: 'Lucario', value: 'lucario' },
            { text: 'Material Darker', value: 'material-darker' },
            { text: 'Material Ocean', value: 'material-ocean' },
            { text: 'Material Palenight', value: 'material-palenight' },
            { text: 'Material', value: 'material' },
            { text: 'Mbo', value: 'mbo' },
            { text: 'MDN like', value: 'mdn-like' },
            { text: 'Midnight', value: 'midnight' },
            { text: 'Monokai', value: 'monokai' },
            { text: 'Moxer', value: 'moxer' },
            { text: 'Neat', value: 'neat' },
            { text: 'Neo', value: 'neo' },
            { text: 'Night', value: 'night' },
            { text: 'Nord', value: 'nord' },
            { text: 'Oceanic Next', value: 'oceanic-next' },
            { text: 'Panda Syntax', value: 'panda-syntax' },
            { text: 'Paraiso Dark', value: 'paraiso-dark' },
            { text: 'Paraiso Light', value: 'paraiso-light' },
            { text: 'Pastel on Dark', value: 'pastel-on-dark' },
            { text: 'Railscasts', value: 'railscasts' },
            { text: 'Rubyblue', value: 'rubyblue' },
            { text: 'Seti', value: 'seti' },
            { text: 'Shadowfox', value: 'shadowfox' },
            { text: 'Solarized', value: 'solarized' },
            { text: 'SSMS', value: 'ssms' },
            { text: 'The Matrix', value: 'the-matrix' },
            { text: 'Tomorrow Night Bright', value: 'tomorrow-night-bright' },
            { text: 'Tomorrow Night Eighties', value: 'tomorrow-night-eighties' },
            { text: 'Twilight', value: 'twilight' },
            { text: 'Vibrant Ink', value: 'vibrant-ink' },
            { text: 'Xq Dark', value: 'xq-dark' },
            { text: 'Xq Light', value: 'xq-light' },
            { text: 'Yeti', value: 'yeti' },
            { text: 'Yonce', value: 'yonce' },
            { text: 'Zenburn', value: 'zenburn' },
        ],
    },
    mutations: {
        setTheme(state, theme) {
            state.options.theme = theme;
        },
        setMode(state, mode) {
            state.options.mode = mode;
        },
        setSelectedMode(state, name) {
            state.selectedMode = name;
        },
        setLineWrapping(state, value) {
            state.options.lineWrapping = value;
        },
    },
    actions: {
        async setTheme({ commit }, theme) {
            await require(`codemirror/theme/${theme}.css`);
            commit('setTheme', theme);
        },
        async setMode({ commit }, value) {
            const filename = (/.+\.(?<ext>[^.]+)$/u).exec(value);
            let mode = '';

            const info = filename
                ? CodeMirror.findModeByExtension(filename.groups.ext)
                : CodeMirror.findModeByMIME(value);

            if (info) {
                ({ mode } = info);
                commit('setSelectedMode', info.mime);
            }

            if (!mode) {
                commit('setSelectedMode', 'text/plain');
            } else if ('null' !== mode) {
                await require(`codemirror/mode/${mode}/${mode}.js`);
            }

            commit('setMode', mode ? mode : null);
        },
        setLineWrapping({ commit }, value) {
            commit('setLineWrapping', value);
        },
    },
    getters: {
        options: state => state.options,
        themes: state => state.themes,
        modes: state => state.modes,
        selectedMode: state => state.selectedMode,
    },
};
