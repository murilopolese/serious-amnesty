let html = require('choo/html');
module.exports = (state, emit) => {
    return html`
        <div class="progress">
            <div class="mb-20">${state.content.step} ${state.data.step}/3</div>
            <div class="steps center">
                <div class="step ${state.data.step>0?'active':''}"></div>
                <div class="step ${state.data.step>1?'active':''}"></div>
                <div class="step ${state.data.step>2?'active':''}"></div>
            </div>
        </div>
    `;
}
