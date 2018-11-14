let html = require('choo/html');
let raw = require('choo/html/raw');
let header = require('./header.js');
let progress = require('./progress.js');

module.exports = (state, emit) => {
    emit('showTitle', true);
    emit('setProgress', 3);

    let next = () => {
        emit('validateTerms');
        if (state.validationError.terms === false) {
            fetch('/message', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify(state.data)
            }).then((r) => r.json())
            .then((res) => {
                emit('pushState', '/finished');
            })
            .catch((err) => {
                console.log('error', err);
            });
        } else {
            emit('render');
        }
    }
    let back = () => {
        emit('back');
    }
    let onChange = (e) => {
        emit('setTerms', e.target.checked);
        emit('validateTerms');
        emit('render');
    }
    let error = () => {
        if (state.validationError.terms === true) {
            return 'error';
        }
    }
    let ready = () => {
        if (state.data.terms === true) {
            return 'selected';
        } else {
            return ''
        }
    }
    return html`
<body class="dark-bg">
    ${header(state, emit)}
    <div class="mb-80"></div>
    <!-- FORM -->
    <div class="content">
        <!-- BACK -->
        <div class="mb-60 back" onclick=${back}>
            <img class="back-arrow" src="/assets/back.svg" alt="arrow" /> ${state.content.back}
        </div>
        <!-- QUESTION -->
        <div class="question text-question mb-20">
            <div class="col-left">
                ${state.data.step} <img class="arrow" src="/assets/back.svg" alt="arrow" />
            </div>
            <div class="col-right">
                ${state.content.termsQuestion}
            </div>
        </div>
        <!-- ANSWER -->
        <div class="answer text-question ${error()}">
            <div class="col-left"></div>
            <div class="col-right">
                <label class="input-label text-small">
                    <input type="checkbox"
                        ${state.data.terms?'checked':''}
                        class="input input-checkbox mr-20 ${ready()}"
                        onchange=${onChange}/>
                    <span>${state.content.termsLabel}</span>
                </label>
            </div>
            <div class="col-left"></div>
            <div class="col-right">
                <div class="error-msg">${state.content.termsError}</div>
            </div>
        </div>
        <!-- SIGN THE CASES -->
        <div class="mb-20">
            <div class="btn btn-big center mb-20" onclick=${next}>
                ${state.content.termsButton}
            </div>
        </div>
        <div class="text-center mb-40 text-small">
            ${raw(state.content.termsDisclaimer)}
        </div>
    </div>
    <!-- PROGRESS -->
    ${progress(state, emit)}
</body>
    `;
}
