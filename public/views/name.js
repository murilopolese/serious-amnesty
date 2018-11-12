let html = require('choo/html');
let header = require('./header.js');
let progress = require('./progress.js');

module.exports = (state, emit) => {
    emit('showTitle', true);
    emit('setProgress', 2);

    let next = () => {
        emit('validateName');
        if (state.validationError.name === false) {
            emit('pushState', '/terms');
        } else {
            emit('render');
        }
    }
    let back = () => {
        emit('back');
    }
    let onChange = (e) => {
        emit('setName', e.target.value);
        emit('validateName');
        emit('render');
    }
    let error = () => {
        if (state.validationError.name === true) {
            return 'error';
        }
    }
    let ready = () => {
        if (state.data.name !== '' && state.validationError.name === false) {
            return 'selected';
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
                ${state.content.nameQuestion}
            </div>
        </div>
        <!-- ANSWER -->
        <div class="answer text-question mb-40 ${error()}">
            <div class="col-left"></div>
            <div class="col-right">
                <div class="input input-text ${ready()}">
                    <input class="text-question" type="text"
                        value="${state.data.name}"
                        placeholder="${state.content.namePlaceholder}"
                        oninput=${onChange}/>
                    <div class="check"><img src="/assets/right.svg" alt="check"/></div>
                </div>
            </div>
            <div class="col-left"></div>
            <div class="col-right">
                <div class="error-msg">${state.content.nameError}</div>
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
