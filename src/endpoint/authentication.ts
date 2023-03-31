import { Application, Request, Response } from 'express'
import { addJwtToken, addUser, getUser, getLatestJwtTokenMatchedAddress, getUserWithTransaction } from '../database'
import { addPublicKey } from '../database/publicKey'
import { jwtDecodeWithHashSecret, jwtSignWithHashSecret } from '../hash'
import { DecodedJwtToken, User } from '../type'

export const authenticationEndpoint = (app: Application) => {
    app.post('/session-validate', async (request: Request, response: Response): Promise<void> => {
        let responseBody: { status: true, user: User, token: string } | { status: false, error: string } = { status: false, error: '' }
        try {
            const requestBody: { token: string } = request.body
            const token: string = requestBody.token
            const decode: DecodedJwtToken | null = jwtDecodeWithHashSecret(token)
            if (decode == null) {
                const address = decode.address
                const exp = decode.exp
                const lastedToken: string | null = await getLatestJwtTokenMatchedAddress(address)
                if (lastedToken != null) {
                    const currentTime: number = Date.now()
                    if (exp * 1000 < currentTime) {
                        responseBody = { status: false, error: 'Token is expired' }
                        throw new Error()
                    }
                    //session validate
                    const user: User | null = await getUser(address)
                    if (user != null) {
                        const newToken: string = jwtSignWithHashSecret(address, 60*60)
                        responseBody = {
                            status: true,
                            user: user,
                            token: newToken
                        }
                        await addJwtToken(newToken)
                    }
                }
            }
        }
        finally {
            response.json(responseBody)
        }
    })

    app.post('/sign-in', async (request: Request, response: Response): Promise<void> => {
        let responseBody: { status: true, user: User, token: string } | {status: false, error: string} = {status: false, error: ''}
        try {
            const requestBody:
                {
                    address: string,
                    username: string
                }
                = request.body
            const address = requestBody.address
            const username = requestBody.username
            let user: User | null = await getUserWithTransaction(address)
            if (user == null) {
                //if not, create new user
                user = {
                    address: address,
                    username: username,
                    asset: 0
                }
                await addUser(user)
            }
            const token: string = jwtSignWithHashSecret(address, 60)
            await addJwtToken(token)
            responseBody = {
                status: true,
                user: user,
                token: token
            }
        }
        finally {
            response.json(responseBody)
        }
    }
    )
    app.post('/update-public-key', async (request: Request, response: Response): Promise<void> => {
        const responseBody: { status: true } = { status: true }
        try {
            const requestBody:
                {
                    browserToken: string,
                    publicKey: string
                }
                = request.body
            const browserToken = requestBody.browserToken
            const publicKey = requestBody.publicKey 
            console.log(browserToken)
            console.log(publicKey)
            await addPublicKey(browserToken, publicKey)
        }
        finally {
            response.json(responseBody)
        }
    }
    )
} 