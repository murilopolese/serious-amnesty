let html = require('choo/html');
let raw = require('choo/html/raw');
let header = require('./header.js');

module.exports = (state, emit) => {
    emit('showTitle', false);
    emit('setProgress', 4);
    let reset = () => {
        emit('reset')
        emit('pushState', '/');
    };

    state.restartInterval = setTimeout(() => {
        reset();
    }, 5000);

    return html`
<body class="light-bg">
    ${header(state, emit)}
    <div class="content">
        <div class="text-huge text-center mb-20">
            ${raw(state.content.thanksMessage.replace(':name:', state.data.name.split(' ')[0]))}
        </div>
        <div class="text-big text-center mb-40">
            ${state.content.projectionMessage}
        </div>
        <div class="grey-box text-center text-big mb-40">
            <strong>${state.content.shareTitle}</strong><br>
            ${state.content.shareCallForAction}
        </div>
        <div class="btn btn-big center" onclick=${reset}>
            ${state.content.startAgainButton}
        </div>
        <br><br><br><br>
    </div>
</body>
    `;
}
