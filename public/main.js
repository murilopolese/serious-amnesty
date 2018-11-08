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

let localizeContent = (state, section) => {
    let country = state.data.country || 'international';
    return content[country][section];
}

let initialState = {
    data: {
        name: '',
        lastname: '',
        country: '',
        terms: false
    },
    validated: false
};

let appState = (state, emitter) => {
    state.data = initialState.data;

    emitter.on('validate', () => {
        let validated = true;
        if (!state.data.name) {
            validated = false;
        }
        if (!state.data.lastname) {
            validated = false;
        }
        if (!state.data.country) {
            validated = false;
        }
        if (!state.data.terms) {
            validated = false;
        }
        state.validated = validated;
        emitter.emit('render');
    });

    emitter.on('success', () => {
        emitter.emit('pushState', `/success`);
    });
}

let mainView = (state, emit) => {
    let submitForm = (e) => {
        fetch('/message', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(state.data)
        }).then((r) => r.json())
        .then((res) => {
            emit('success');
        })
        .catch((err) => {
            console.log('error', err);
        });
        return false;
    }

    let onToggleCountry = (e) => {
        let country = e.target.getAttribute('id');
        state.data.country = country;
        emit('validate');
    }

    let onToggleTerms = (e) => {
        state.data.terms = e.target.checked;
        emit('validate');
    }

    let onInputChange = (e) => {
        let field = e.target.getAttribute('name'),
            value = e.target.value;
        state.data[field] = value;
        emit('validate');
    }

    return html`
    <body class="dark-bg">
        <form>
            <div class="container">
                <div class="title">
                    ${localizeContent(state, 'title')}
                </div>
                <div class="description">
                    ${localizeContent(state, 'description')}
                </div>
                <div class="label">LAND / COUNTRY</div>
                <div class="row">
                    <div class="selectable"
                        selected=${state.data.country=='iceland'}
                        onclick=${onToggleCountry}>
                        <div id="iceland" class="text">
                            Iceland
                        </div>
                    </div>
                    <div class="selectable"
                        selected=${state.data.country=='international'}
                        onclick=${onToggleCountry}>
                        <div id="international" class="text">
                            International
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="field">
                        <div class="label no-margin">NAFN / NAME</div>
                        <div class="input">
                            <input
                            type="text"
                            name="name"
                            onkeyup=${onInputChange}
                            value=${state.data.name}>
                        </div>
                    </div>
                    <div class="field">
                        <div class="label no-margin">EFTIRNAFN / LAST NAME</div>
                        <div class="input">
                            <input
                            type="text"
                            name="lastname"
                            onkeyup=${onInputChange}
                            value=${state.data.lastname}>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="toggle">
                        <input
                            class="tgl tgl-ios"
                            id="checkbox"
                            type="checkbox"/
                            checked=${state.data.terms}
                            onchange=${onToggleTerms}>
                        <label class="tgl-btn" for="checkbox"></label>
                    </div>
                    <div class="toggle-description">
                        ${localizeContent(state, 'toggleDescription')}
                    </div>
                </div>

                <button
                    class="call-to-action"
                    disabled=${!state.validated}
                    onclick=${submitForm}>
                    Sign the cases
                </button>

                <div class="disclaimer">
                    ${localizeContent(state, 'disclaimer')}
                </div>

                <div class="logo">
                    <img src="/assets/logo.png" width="170" alt="">
                </div>
            </div>
        </form>
    </body>
    `;

}

let successView = (state, emit) => {
    let onStartOver = (e) => {
        window.location = '/';
    }
    return html`
    <body>
        <div class="container">
            <div class="success-title">
                ${localizeContent(state, 'successTitle').replace(':name', state.data.name)}
            </div>
            <div class="success-description">
                ${localizeContent(state, 'successDescription')}
            </div>
            <div class="success-share">
                <p><strong>${localizeContent(state, 'successShareTitle')}</strong></p>
                <p>
                    ${localizeContent(state, 'successShareDescription')} <strong>#eglysiuppmyrkrid</strong>
                </p>
            </div>
            <a class="start-over" onclick=${onStartOver}>
                Start over
            </a>
        </div>
    </body>
    `;
}

app.use(appState);
app.route('/', mainView);
app.route('/success', successView);
app.mount('body');
