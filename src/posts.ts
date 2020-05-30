import { Octokit } from '@octokit/rest';
import { Context, HttpRequest } from '@azure/functions';
import { HttpResponse, err, raw } from './response';

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const repository = process.env.GITHUB_REPOSITORY;
if (!repository) throw new Error('GITHUB_REPOSITORY not set up');
const [owner, repo] = repository.split('/');
const fileParams = { owner, repo, path: 'frontend/data/posts.ndjson' };

export default async function (context: Context, req: HttpRequest) {
    context.res = (req.method === 'GET')
        ? await get()
        : await post(req);
}

async function get(): Promise<HttpResponse<Buffer>> {
    const { data } = await octokit.repos.getContents(fileParams);
    const buffer = Buffer.from(data.content, data.encoding as any);
    return raw(buffer);
}

async function post(req: HttpRequest): Promise<HttpResponse<Buffer>> {
    const { name, content } = req.body;

    if (typeof(name) !== 'string' || name.length > 100) {
        return err(400, 'invalid name');
    }
    if (typeof(content) !== 'string' || content.length > 1400) {
        return err(400, 'invalid content');
    }

    const newLine = JSON.stringify({
        name,
        content,
        date: new Date().toISOString(),
    });
    const { data } = await octokit.repos.getContents(fileParams);
    const buffer = Buffer.concat([
        Buffer.from(data.content, data.encoding as any),
        Buffer.from('\n' + newLine, 'utf-8'),
    ]);

    try {
        await octokit.repos.createOrUpdateFile({
            ...fileParams,
            message: 'update post.ndjson',
            content: buffer.toString('base64'),
            sha: data.sha,
            committer: {
                name: 'bbs user',
                email: 'nouser@example.com'
            },
        });
    } finally {
        // TODO catch conflict error
    }

    return raw(buffer);
};
