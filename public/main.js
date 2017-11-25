let html = require('choo/html'),
    choo = require('choo'),
    app = choo();

let appState = function(state, emitter) {
    let initialState = {
        data: {
            name: '',
            lastname: '',
            country: '',
            terms: false
        },
        validated: false
    };
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
        e.preventDefault();

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
        e.preventDefault()
        let country = e.path[1] ? e.path[1].getAttribute('id') : '';
        state.data.country = country;
        emit('validate');
    }

    let onToggleTerms = (e) => {
        e.preventDefault()
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
        <form onsubmit=${submitForm}>
            <div class="container">
                <div class="title">
                    Light up the dark
                </div>
                <div class="description">
                    Bring hope and justice to people who suffer human rights violations. <br>
                    Experience how you can light up the dark in the lives of those that suffer great <br>
                    injustices by having your signature light up the flame in the projection.
                </div>
                <div class="label">LAND / COUNTRY</div>
                <div class="row">
                    <div id="iceland"
                        selected=${state.data.country=='iceland'}
                        class="selectable"
                        ontouchstart=${onToggleCountry}>
                        <div class="text">Iceland</div>
                    </div>
                    <div id="international"
                        selected=${state.data.country=='international'}
                        class="selectable"
                        ontouchstart=${onToggleCountry}>
                        <div class="text">International</div>
                    </div>
                </div>
                <div class="row">
                    <div class="field">
                        <div class="label no-margin">NAFN / NAME</div>
                        <div class="input">
                            <input type="text" name="name" onkeyup=${onInputChange} value=${state.data.name}>
                        </div>
                    </div>
                    <div class="field">
                        <div class="label no-margin">EFTIRNAFN / LAST NAME</div>
                        <div class="input">
                            <input type="text" name="lastname" onkeyup=${onInputChange} value=${state.data.lastname}>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="toggle">
                        <input class="tgl tgl-ios" id="checkbox" type="checkbox"/ checked=${state.data.terms} onchange=${onToggleTerms}>
                        <label class="tgl-btn" for="checkbox"></label>
                    </div>
                    <div class="toggle-description">
                        I want to sign 10 urgent cases of individuals who suffer
                        human rights violations
                    </div>
                </div>

                <button class="call-to-action" disabled=${!state.validated}>
                    Sign the cases
                </button>

                <div class="disclaimer">
                    No other personal information but your name will accompany the
                    letter to the appropriate government.
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
    console.log(state);
    return html`
    <body>
        <div class="container">
            <div class="success-title">
                Thank you ${state.data.name} for keeping the flame alive.
            </div>
            <div class="success-description">
                Your name will appear in the projection in just a moment.
            </div>
            <div class="success-share">
                <p><strong>Wait, wait, wait, you’re not done yet...</strong></p>
                <p>
                    Help us collect more signatures by sharing a photo using <strong>#eglysiuppmyrkrid</strong>
                </p>
            </div>
            <a class="call-to-action" href="/">
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
