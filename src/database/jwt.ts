import { PrismaClient } from '@prisma/client'
import { jwtDecodeWithHashSecret } from '../hash'
import { DecodedJwtToken } from '../type'
const prisma = new PrismaClient()
export const addJwtToken =
    async (token: string): Promise<boolean> => {
        let result = true
        await prisma.$connect()
        try {
            const jwtToken: { token: string } = { token: token }
            await prisma.jwt.create(
                {
                    data: jwtToken
                }
            )
        } catch (err: unknown) {
            result = false
        }
        await prisma.$disconnect()
        return result
    }
export const getLatestJwtTokenMatchedAddress =
    async (address: string): Promise<string | null> => {
        let result = ''
        let tokens: {token: string}[] = []
       
        await prisma.$connect()
        tokens = await prisma.jwt.findMany()
      
        let lastedExp = 0
        tokens.forEach(token => {
            const decode: DecodedJwtToken | null = jwtDecodeWithHashSecret(token.token)
            if (decode != null && decode.address == address && decode.exp > lastedExp) {
                result = token.token
                lastedExp = decode.exp
            }
        }
        )
        await prisma.$disconnect()
        return result
    }