let html = require('choo/html');
let header = require('./header.js');
let progress = require('./progress.js');

module.exports = (state, emit) => {
    emit('showTitle', true);
    emit('setProgress', 1);

    let next = () => {
        emit('validateCountry');
        if (state.validationError.country === false) {
            emit('pushState', '/name');
        } else {
            emit('render');
        }
    }
    let back = () => {
        emit('back');
    }
    let setCountry = (e) => {
        let target = e.target;
        if (target.parentElement.getAttribute('id')) {
            target = target.parentElement;
        }
        emit('setCountry', target.getAttribute('id'));
        emit('validateCountry');
        emit('render');
    }
    let selected = (country) => {
        if (state.data.country === country) {
            return 'selected';
        }
    }
    let error = (country) => {
        if (state.validationError.country === true) {
            return 'error';
        }
    }
    return html`
<body class="dark-bg">
    <!-- HEADER -->
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
                ${state.content.countryQuestion}
            </div>
        </div>
        <!-- ANSWER -->
        <div class="answer text-question mb-40 ${error()}">
            <div class="col-left"></div>
            <div class="col-right">
                <div id="iceland" class="input input-button ${selected('iceland')}" onclick=${setCountry}>
                    <div class="label">A</div>
                    ${state.content.iceland}
                    <div class="check"><img src="/assets/right.svg" alt="check"/></div>
                </div>
                <div id="international" class="input input-button ${selected('international')}" onclick=${setCountry}>
                    <div class="label">B</div>
                    ${state.content.international}
                    <div class="check"><img src="/assets/right.svg" alt="check"/></div>
                </div>
            </div>
            <div class="col-left"></div>
            <div class="col-right">
                <div class="error-msg">${state.content.countryError}</div>
            </div>
        </div>
        <!-- NEXT -->
        <div class="next mb-60">
            <div class="btn btn-next" onclick=${next}>${state.content.next}</div>
        </div>
    </div>
    <!-- PROGRESS -->
    ${progress(state, emit)}
</body>
    `;
}
