//@ts-ignore
/**
 * @typedef {Object} Post
 * @property {string} name
 * @property {string} content
 * @property {string} date
 */

/**
 * @param {string} lines
 * @returns {Post[]}
 */
function parse(lines) {
    return lines.split('\n').filter(Boolean).map(e => JSON.parse(e));
}

export const api = {
    direct() {
        return fetch('./data/posts.ndjson').then(r => r.text()).then(parse);
    },
    get() {
        return fetch('/api/posts').then(r => r.text()).then(parse);
    },
    async post(obj) {
        const r = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(obj),
        });
        if (r.ok) {
            return parse(await r.text())
        } else {
            throw new Error(await r.text())
        }
    }
};
