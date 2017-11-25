let html = require('choo/html'),
    choo = require('choo'),
    app = choo();

let appState = function(state, emitter) {
    let initialState = {
        data: {
            name: '',
            email: '',
            country: ''
        },
        validated: false,
        errors: {
            name: '',
            email: '',
            country: '',
            connection: ''
        }
    };
    state.errors = initialState.errors;
    state.data = initialState.data;
    emitter.on('loadData', (data) => {
        state.data = data;
    });
    emitter.on('validate', () => {
        let validated = true;
        if (!state.data.name) {
            state.errors.name = 'Please fill in your name.';
            validated = false;
        } else {
            state.errors.name = '';
        }
        if (!state.data.email) {
            state.errors.email = 'Please fill in your email.';
            validated = false;
        } else {
            state.errors.email = '';
        }
        if (!state.data.country) {
            state.errors.country = 'Please pick a country.';
            validated = false;
        } else {
            state.errors.country = '';
        }
        state.validated = validated;

        emitter.emit('render');
    });
    emitter.on('error', (data) => {
        state.errors[data.element] = data.message;
        emitter.emit('render');
    });
    emitter.on('success', () => {
        state.errors = initialState.errors;
        emitter.emit('render');
        window.location = '/success';
    });
}

let mainView = (state, emit) => {
    let submitForm = (e) => {
        e.preventDefault();
        let formData = new FormData(e.currentTarget),
            data = {
                name: formData.get('name'),
                email: formData.get('email'),
                country: formData.get('country')
            };

        emit('loadData', data);
        emit('validate');

        if(!state.validated) {
            return false;
        }

        fetch('/message', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(data)
        }).then((r) => r.json())
        .then((res) => {
            emit('success');
        })
        .catch((err) => {
            emit('error', 'connection', 'Connection lost.')
        });
        return false;
    }
    return html`
        <body>
            <form onsubmit=${submitForm}>
                <p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value="${state.data.name}" />
                </p>
                <p>${state.errors.name}</p>
                <p>
                    <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value="${state.data.email}" />
                </p>
                <p>${state.errors.email}</p>
                <p>
                    <select name="country">
                        <option value="">Pick a country</option>
                        <option value="IS" selected="${state.data.country=='IS'}">Iceland</option>
                        <option value="VE" selected="${state.data.country=='VE'}">Venezuela</option>
                        <option value="SW" selected="${state.data.country=='SW'}">Sweden</option>
                        <option value="BR" selected="${state.data.country=='BR'}">Brazil</option>
                        <option value="DE" selected="${state.data.country=='GE'}">Germany</option>
                    </select>
                </p>
                <p>${state.errors.country}</p>
                <p><button>Submit</button></p>
                <p>${state.errors.connection}</p>
            </form>
        </body>
    `;
}

let successView = (state, emit) => {
    return html`
    <body>
        <div>
            <h1>Thank you!</h1>
            <p><a href="/">Go back</a></p>
        </div>
    </body>
    `;
}

// app.use(appState);
// app.route('/', mainView);
// app.route('/success', successView);
// app.mount('body');
