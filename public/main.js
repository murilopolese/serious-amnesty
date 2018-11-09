let html = require('choo/html'),
    choo = require('choo'),
    app = choo();

let content = {
    international: {
        title: 'LIGHT UP THE DARK',
        description: 'Bring hope and justice to people who suffer human rights violations.\n Experience how you can light up the dark in the lives of those that suffer great\n injustices by having your signature light up the flame in the projection.',
        toggleDescription: 'I want to sign 10 urgent cases of individuals who suffer human rights violations',
        callToAction: 'SIGN THE CASES',
        disclaimer: 'No other personal information but your name will accompany the letter to the appropriate government.',
        successTitle: 'Thank you :name for keeping the flame alive.',
        successDescription: 'Your name will appear in the projection in just a moment.',
        successShareTitle: 'Wait, wait, wait, you’re not done yet...',
        successShareDescription: 'Help us collect more signatures by sharing a photo using ',
        startOver: 'START OVER'
    },
    iceland: {
        title: 'LÝSTU UPP MYRKRIÐ',
        description: 'Krefstu réttlætis fyrir þolendur mannréttindabrota og færðu þeim von með undirskrift þinni. Upplifðu hvernig þú lýsir upp myrkrið í lífi þeirra sem beittir eru órétti með nafn þitt að vopni.',
        toggleDescription: 'Ég vil skrifa undir 10 aðkallandi mál einstaklinga sem sæta mannréttindabrotum.',
        callToAction: 'SIGN THE CASES',
        disclaimer: 'Engar aðrar persónuupplýsingar en nafn þitt munu fylgja bréfinu á viðkomandi stjórnvöld.',
        successTitle: 'Takk fyrir að halda\n loganum lifandi',
        successDescription: 'Nafn þitt mun varpast á kirkjuvegginn eftir augnablik.',
        successShareTitle: 'Bíddu aðeins, þetta er ekki alveg búið',
        successShareDescription: 'Hjálpaðu okkur að safna fleiri undirskriftum með því að deila mynd af þér með myllumerkinu ',
        startOver: 'START OVER'
    }
}

let back = () => {
    history.go(-1);
}

let localizeContent = (state, section) => {
    let country = state.data.country || 'international';
    return content[country][section];
}

let initialState = {
    data: {
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
    state.data = initialState.data;
    state.validationError = initialState.validationError;

    emitter.on('setCountry', (country) => {
        state.data.country = country;
    });
    emitter.on('setName', (name) => {
        state.data.name = name;
    });
    emitter.on('setTerms', (terms) => {
        state.data.terms = terms;
    });
    emitter.on('validateCountry', () => {
        if (state.data.country === '') {
            state.validationError.country = true;
        } else {
            state.validationError.country = false;
        }
        emitter.emit('render');
    });
    emitter.on('validateName', () => {
        if (state.data.name === '') {
            state.validationError.name = true;
        } else {
            state.validationError.name = false;
        }
        emitter.emit('render');
    });
    emitter.on('validateTerms', () => {
        if (state.data.terms === false) {
            state.validationError.terms = true;
        } else {
            state.validationError.terms = false;
        }
        emitter.emit('render');
    });
    emitter.on('reset', () => {
        state.data = initialState.data;
        state.validationError = initialState.validationError;
    })
}

let startView = (state, emit) => {
    let next = () => {
        emit('pushState', '/country');
    }
    return html`
        <body>
            <div>
                Light in the dark
            </div>
            <div onclick=${next}>
                Start
            </div>
        </body>
    `
}

let countryView = (state, emit) => {
    let next = () => {
        emit('validateCountry');
        if (state.validationError.country === false) {
            emit('pushState', '/name');
        }
    }
    let setCountry = (e) => {
        emit('setCountry', e.target.getAttribute('id'));
        emit('validateCountry');
    }
    let errorStyle = () => {
        if (state.validationError.country) {
            return 'background: red';
        } else {
            return 'background: none';
        }
    }
    return html`
        <body>
            <div style="${errorStyle()}">
                Country
            </div>
            <div onclick=${setCountry} id="international" style="${state.data.country==='international'?'background:yellow':'background:none'}">
                International
            </div>
            <div onclick=${setCountry} id="icelandic" style="${state.data.country==='icelandic'?'background:yellow':'background:none'}">
                Icelandic
            </div>
            <div>
                error: ${state.validationError.country}
            </div>
            <div onclick=${back}>
                Back
            </div>
            <div onclick=${next}>
                Next
            </div>
        </body>
    `
}

let nameView = (state, emit) => {
    let next = () => {
        emit('pushState', '/terms');
    }
    return html`
        <body>
            <div>
                Name
            </div>
            <div onclick=${back}>
                Back
            </div>
            <div onclick=${next}>
                Next
            </div>
        </body>
    `
}

let termsView = (state, emit) => {
    let next = () => {
        emit('pushState', '/finished');
    }
    return html`
        <body>
            <div>
                Terms
            </div>
            <div onclick=${back}>
                Back
            </div>
            <div onclick=${next}>
                Next
            </div>
        </body>
    `
}

let finishedView = (state, emit) => {
    let reset = () => {
        emit('reset')
        emit('pushState', '/');
    }
    return html`
        <body>
            <div>
                Finished
            </div>
            <div onclick=${back}>
                Back
            </div>
            <div onclick=${reset}>
                Reset
            </div>
        </body>
    `
}

app.use(appState);
app.route('/', startView);
app.route('/country', countryView);
app.route('/name', nameView);
app.route('/terms', termsView);
app.route('/finished', finishedView);
app.mount('body');
