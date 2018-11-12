let html = require('choo/html');
let raw = require('choo/html/raw');
let header = require('./header.js');

module.exports = (state, emit) => {
    emit('showTitle', false);
    let next = () => {
        emit('pushState', '/country');
    }
    return html`
        <body class="dark-bg">
            ${header(state, emit)}
            <div class="mb-80"></div>
            <div class="content text-center">
                <div class="text-huge mb-20">
                    ${state.content.title}
                </div>
                <div class="mb-80 text-dark-grey">
                    ${raw(state.content.description)}
                </div>
                <div class="btn btn-big center" onclick=${next}>
                    ${state.content.start}
                </div>
            </div>
        </body>
    `;
}
