let html = require('choo/html'),
    choo = require('choo'),
    app = choo();

let content = {
    international: {
        title: 'LIGHT UP THE DARK',
        description: 'Bring hope and justice to people who suffer human rights violations.\n Light up the dark by having your signature light up the flame in the projection',
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
        country: '',
        terms: false
    },
    validated: false
};




let appState = (state, emitter) => {
    state.data = initialState.data;

    emitter.on('validateCountry', () => {
        if(state.data.country){  
            emitter.emit('render')
            }
        })

    emitter.on('confirmCountry', () => {
        emitter.emit('pushState', `/names`);
    });

    emitter.on('validateNames', () => {
        if(state.data.name) {
            emitter.emit('render')
            }   
        })

    emitter.on('confirmNames', () => {
        emitter.emit('pushState', `/sign`);
    });
    
    emitter.on('validateSign', () => {
            emitter.emit('render')
        })

    emitter.on('confirmSign', () => {
        if(state.data.terms) {
            emitter.emit('pushState', `/success`);
        }      
    });
}


let mainView = (state, emit) => {

    let onStart = (e) => {
        window.location = '/country';
    }

    return html`
    <body class="dark-bg">
        <form>
            <div class="container">
                
                <div class="title-one">
                    ${localizeContent(state, 'title')}
                </div>
                <div class="description-one">
                    ${localizeContent(state, 'description')}
                </div>
                <a class="start-one" onclick=${onStart}>
                Start
                </a>
            </div>
        </form>
    </body>
    `;

}

let countryView = (state, emit) => {

    let onToggleCountry = (e) => {
        let country = e.target.getAttribute('id');
        state.data.country = country;
        emit('validateCountry');
    }
    let clickCountry = () => {
        emit('confirmCountry');
    }
    
 
    return html`
    <body class="dark-bg">
        <form>
            <div class="container">
                <div class="title">
                    ${content.international.title}
                </div>
                <div class="label">What's your country?</div>
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
                <div class="label-country">
                    <p style="visibility: ${state.data.country== '' ? 'visible' : 'hidden'}"> Please select your country </p>
                </div>         
                <a
                    class="next-one" 
                    style="visibility: ${state.data.country!== '' ? 'visible' : 'hidden'}"
                    onclick=${clickCountry}>
                    Next
                </a>
            </div>
        </form>
    </body>
    `;

}

let namesView = (state, emit) => {

    let onInputChange = (e) => {
        let field = e.target.getAttribute('name'),
            value = e.target.value;
        state.data[field] = value;
        emit('validateNames');
    }
    let clickNames = () => {
        emit('confirmNames');
    }

    return html`
    <body class="dark-bg">
        <form>
            <div class="container">
                <div class="title">
                    ${localizeContent(state, 'title')}
                </div>
                <div class="row">
                    <div class="field">
                        <div class="label">What\'s your name</div>
                        <div class="input">
                            <input
                            type="text"
                            name="name"
                            placeholder="Tap here to start typing"
                            onkeyup=${onInputChange}
                            value=${state.data.name}>
                        </div>
                        <div class="label-names">Please type your name</div> 
                    </div>
                </div>
                <a
                    class="next-one"
                    style="visibility: ${state.data.name!== '' ? 'visible' : 'hidden'}"
                    onclick=${clickNames}>
                    Next
                </a>
            </div>
        </form>
    </body>
    `;

}
let signView = (state, emit) => {
  

    let onToggleTerms = (e) => {
        state.data.terms = e.target.checked;
        state.validated = !state.validated;
        emit('validateSign');
    }

      let submitForm = (e) => {
        fetch('/message', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(state.data)
        }).then((r) => r.json())
        .then((res) => {
            emit('confirmSign');
        })
        .catch((err) => {
            console.log('error', err);
        });
        return false;
    }

    return html`
    <body class="dark-bg">
        <form>
            <div class="container">
                <div class="title">
                    ${localizeContent(state, 'title')}
                </div>
                <div class="row">
                        <div class="label">SIGN FOR THE CASES</div>
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
            <a class="start-end" onclick=${onStartOver}>
                Start Again
            </a>
        </div>
    </body>
    `;
}

app.use(appState);
app.route('/', mainView);
app.route('/country', countryView);
app.route('/names', namesView);
app.route('/sign', signView);
app.route('/success', successView);
app.mount('body');

