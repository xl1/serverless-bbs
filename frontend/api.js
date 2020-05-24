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
    get() {
        return fetch('./data/posts.ndjson').then(r => r.text()).then(parse);
    },
    post(obj) {
        return fetch('/api/post', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(obj),
        }).then(r => r.text()).then(parse);
    }
};
