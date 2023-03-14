import { Application } from 'express'
import { App } from './app'
import request, { Response } from 'supertest'
const app: Application = new App().app
describe('Transaction endpoint tests', () => {
    test('To get verify token test', async () => {
        const response: Response =
            await request(app).post('/get-verify-token')
        console.log(response)
        expect(response).toBeTruthy()

    })
})