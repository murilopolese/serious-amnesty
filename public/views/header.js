let html = require('choo/html');
module.exports = (state, emit) => {
    return html`
        <div class="header">
            <div class="amnesty-logo">
                <img src="/assets/logo.svg" alt="amnesty-logo"/>
            </div>
            <div class="title">
                ${state.data.showTitle?state.content.title:''}
            </div>
            <div class="bref-logo">
                <img src="/assets/bref.svg" alt="bref-logo"/>
            </div>
        </div>
    `;
}
