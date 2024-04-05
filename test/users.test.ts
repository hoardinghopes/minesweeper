// test/index.test.ts
import { afterAll, describe, expect, it } from 'bun:test'
import { app } from "../src/index";


const baseUrl = `http://${app.server?.hostname}:${app.server?.port}/api`;

describe('USERS Test suite', () => {
    describe('GET USERS Test suite', () => {

        it('should return 200', async () => {
            const req = new Request(`${baseUrl}/users`);
            const res = await app.fetch(req);
            expect(res.status).toEqual(200);
        });


        it('return a response', async () => {

            const response = await app
                .handle(new Request(`${baseUrl}/users`))
                .then((res) => res.text())

            console.log(response);
            expect(response).toBe('[{"id":1,"name":"test","createdAt":"2024-04-04T16:58:45.000Z"},{"id":2,"name":"mightymai","createdAt":"2024-04-04T16:58:52.000Z"},{"id":3,"name":"shonaVK","createdAt":"2024-04-04T16:58:57.000Z"},{"id":6,"name":"another","createdAt":"2024-04-05T13:46:05.000Z"}]')
        })
    });

});