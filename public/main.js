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
        questionCountry: 'What\'s your country?',
        questionName: 'What\'s your name',
        holder: 'Tap here to start typing' ,
        pleaseCountry: 'Please select your country',
        pleaseName: 'Please type your name',
        pleaseSign: 'Please sign the cases',
        startOver: 'START OVER'
    },
    iceland: {
        title: 'LÝSTU UPP MYRKRIÐ',
        description: 'Krefstu réttlætis fyrir þolendur mannréttindabrota og færðu þeim von með undirskrift þinni. Upplifðu hvernig þú lýsir upp myrkrið í lífi þeirra sem beittir eru órétti með nafn þitt að vopni.',
        toggleDescription: 'Ég vil skrifa undir 10 aðkallandi mál einstaklinga sem sæta mannréttindabrotum.',
        callToAction: 'SIGN THE CASES',
        disclaimer: 'Engar aðrar persónuupplýsingar en nafn þitt munu fylgja bréfinu á viðkomandi stjórnvöld.',
        successTitle: 'Takk fyrir :name að halda\n loganum lifandi',
        successDescription: 'Nafn þitt mun varpast á kirkjuvegginn eftir augnablik.',
        successShareTitle: 'Bíddu aðeins, þetta er ekki alveg búið',
        successShareDescription: 'Hjálpaðu okkur að safna fleiri undirskriftum með því að deila mynd af þér með myllumerkinu ',
        questionCountry: 'HVAÐ ER ÞITT LAND // Confirm',
        questionName: 'Hvað heitir þú // Confirm',
        holder: 'Tap here to start typing // in Icelandic ',
        pleaseCountry: 'Please select your country // in Icelandic',
        pleaseName: 'Please type your name // in Icelandic ',
        pleaseSign: 'Please sign the cases // in Icelandic ',
        startOver: 'START OVER'
    }
}

// let back = () => {
//     history.go(-1);
// }

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


let mainView = (state, emit) => {
    let onStart = () => {
        emit('pushState', '/country');
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

    let clickCountry = () => {
        emit('validateCountry');
        if (state.validationError.country === false) {
            emit('pushState', '/name');
        }
    }
    let setCountry = (e) => {
        emit('setCountry', e.target.getAttribute('id'));
        emit('validateCountry');
    }
     let errorCountry = () => {
         if (state.validationError.country ) {
             return 'visibility: visible';
         } else {
            return 'visibility: hidden';
         }
     }
    
    return html`
    <body class="dark-bg">
        <form>
            <div class="container">
                <div class="title">
                    ${localizeContent(state, 'title')}
                </div>
                    <div class="label-one">
                        ${localizeContent(state, 'questionCountry')}
                    </div>
                <div class="row">
                    <div class="selectable"
                        
                        onclick=${setCountry} id="iceland">
                        <div id="iceland" class="text">
                            Iceland
                        </div> 
                    </div>
                    <div class="selectable"
                        
                        onclick=${setCountry} id="international">
                        <div id="international" class="text">
                            International
                        </div>
                    </div>
                </div>
                <div class="label-country" style="${errorCountry()}">
                    ${localizeContent(state, 'pleaseCountry')}
                </div>         
                <a
                    class="next-one"   
                    onclick=${clickCountry}>
                    Next
                </a>
            </div>
        </form>
    </body>
    `;

}

let nameView = (state, emit) => {

    let clickName = () => {
        emit('validateName');
        if (state.validationError.name === false) {
            emit('pushState', '/terms');
        }
    }
    let setName = (e) => {
        emit('setName', e.target.value);
        emit('validateName');
    }
    

    let errorName = () => {
        if (state.validationError.name ) {
            return 'visibility: visible';
        } else {
           return 'visibility: hidden';
        }
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
                        <div class="label-one">${localizeContent(state, 'questionName')}</div>
                        <div class="input">
                            <input
                                type="text"
                                placeholder=${localizeContent(state, 'holder')} 
                                onkeyup=${setName}
                                value=${state.data.name}>
                        </div>
                    </div>
                </div>
                <div class="label-name" style="${errorName()}">
                    ${localizeContent(state, 'pleaseName')}
                </div> 
                <a
                    class="next-one"
                    onclick=${clickName}>
                    Next
                </a>
            </div>
        </form>
    </body>
    `;

}

let termsView = (state, emit) => {
  


    let setTerms = (e) => {
        state.data.terms = e.target.checked;
        state.validated = !state.validated;
        emit('validateTerms');
    }

    let errorTerms = () => {
        if (state.validationError.terms ) {
            return 'visibility: visible';
        } else {
           return 'visibility: hidden';
        }
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
            emit('validateTerms');
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
                    <div class="label-one">SIGN FOR THE CASES</div>
                    <div class="toggle">
                        <input
                            id="toggle-1"
                            type="checkbox"      
                            checked=${state.data.terms} 
                            onchange=${setTerms}>
                        <label for="toggle-1"></label>
                    </div>
                    <div class="toggle-description">
                        ${localizeContent(state, 'toggleDescription')}
                    </div>   
                </div>
                <div class="label-name" style="${errorTerms()}">
                    ${localizeContent(state, 'pleaseSign')}
                </div>
                <button
                    class="call-to-action"
                    disabled=${!state.data.terms}
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

let finishedView = (state, emit) => {
    let onStartOver = () => {
        emit('reset')
        emit('pushState', '/');
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
app.route('/name', nameView);
app.route('/terms', termsView);
app.route('/finished', finishedView);
app.mount('body');

