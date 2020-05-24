import { Context, HttpRequest } from '@azure/functions';

export default async function (context: Context, req: HttpRequest) {
    context.res = {
        body: process.env
    };
};
