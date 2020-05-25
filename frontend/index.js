//@ts-check
//@ts-ignore
import { html, render } from 'https://unpkg.com/lit-html?module';
import { api } from './api.js';

const state = {
    name: localStorage.getItem('name') || '',
    /** @type {import('./api.js').Post[]} */
    posts: [],
};

async function main() {
    $form.render();
    state.posts = await api.get();
    $posts.render();
}

async function submit(ev) {
    ev.preventDefault();

    const form = /** @type {HTMLFormElement} */(document.getElementById('form'));
    const formData = new FormData(form);
    const name = formData.get('name').toString();
    const content = formData.get('content').toString();

    if (!name || !content) return;

    const button = /** @type {HTMLInputElement} */(document.getElementById('form__submit'));
    button.disabled = true;

    state.posts = await api.post({ name, content }).finally(() => button.disabled = false);
    $posts.render();
    localStorage.setItem('name', name);
    form.reset();
    $form.render();
}

const $form = {
    render() {
        render(this.template(), document.getElementById('form-placeholder'));
    },
    template: () => html`
<form id="form" class="form" @submit=${ submit }>
    <label>おなまえ</label>
    <input name="name" class="form__name" maxlength="100" value=${ state.name }>
    <label>メッセージ</label>
    <textarea name="content" class="form__content" maxlength="1400"></textarea>
    <button id="form__submit" class="form__submit" @click=${ submit }>送信する</button>
</form>`
};

const $posts = {
    render() {
        render(this.template(), document.getElementById('posts-placeholder'));
    },
    template: () => html`${
        state.posts.map(({ name, content, date }, i) => html`
<article class="post">
    <span class="post__index">[${ i + 1 }]</span>
    <span class="post__name">${ name }</span>
    <time class="post__time" datetime=${ date }>${ new Date(date).toLocaleString() }</time>
    <div class="post__content">${ content }</div>
</article>
        `).reverse()
    }`
};

main().catch(console.error);
