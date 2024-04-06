// test/index.test.ts
import { describe, expect, it } from 'bun:test'
import { app } from "../src/index";


const baseUrl = `${app.server?.hostname}:${app.server?.port}/api`;

describe('SCORES Test suite', () => {
    describe('GET SCORES Test suite', () => {
        it('should return a list of scores successfully', async () => {
            const req = new Request(`${baseUrl}/scores`);
            const res = await app.fetch(req);
            expect(res.status).toEqual(200);
        });
    });
});