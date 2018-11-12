let html = require('choo/html');
let choo = require('choo');
let app = choo();
let startView = require('./views/start.js');
let countryView = require('./views/country.js');
let nameView = require('./views/name.js');
let termsView = require('./views/terms.js');
let finishedView = require('./views/finished.js');
let content = require('./content.js');

let initialState = {
    data: {
        headerTitle: false,
        step: 0,
        name: '',
        country: '',
        terms: false
    },
    validationError: {
        name: false,
        country: false,
        terms: false
    }
};

let appState = (state, emitter) => {
    emitter.emit('pushState', '/');
    state.data = initialState.data;
    state.validationError = initialState.validationError;
    state.content = content[state.data.country || 'international'];

    emitter.on('back', () => {
        history.go(-1);
    });
    emitter.on('setCountry', (country) => {
        state.data.country = country;
        state.content = content[state.data.country || 'international'];
    });
    emitter.on('setName', (name) => {
        state.data.name = name;
    });
    emitter.on('setTerms', (terms) => {
        state.data.terms = terms;
    });
    emitter.on('setProgress', (progress) => {
        state.data.step = progress;
    });
    emitter.on('showTitle', (showTitle) => {
        state.data.showTitle = showTitle;
    });
    emitter.on('validateCountry', () => {
        if (state.data.country === '') {
            state.validationError.country = true;
        } else {
            state.validationError.country = false;
        }
    });
    emitter.on('validateName', () => {
        if (state.data.name === '') {
            state.validationError.name = true;
        } else {
            state.validationError.name = false;
        }
    });
    emitter.on('validateTerms', () => {
        if (state.data.terms === false) {
            state.validationError.terms = true;
        } else {
            state.validationError.terms = false;
        }
    });
    emitter.on('reset', () => {
        state.data = {
            headerTitle: false,
            step: 0,
            name: '',
            country: '',
            terms: false
        };
        state.validationError = {
            name: false,
            country: false,
            terms: false
        };
        state.content = content[state.data.country || 'international'];
    });
};

app.use(appState);
app.route('/', startView);
app.route('/country', countryView);
app.route('/name', nameView);
app.route('/terms', termsView);
app.route('/finished', finishedView);
app.mount('body');
