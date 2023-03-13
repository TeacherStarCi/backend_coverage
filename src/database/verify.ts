import { PrismaClient } from '@prisma/client'
import { VerifyToken } from '../type'

const prisma = new PrismaClient()
export const addVerify = async (token: string): Promise<boolean> => {
    let result = true
    await prisma.$connect()
    try {
        const verifiedToken: VerifyToken = {
            token: token,
            available: true
        }
        await prisma.verify.create({
            data: verifiedToken
        }
        )
    }
    catch (err: unknown) {
        result = false
    }
    await prisma.$disconnect()
    return result
}

export const setVerifyAvailable =
    async (token: string, toAvailable: boolean): Promise<boolean> => {
        let result = true
        await prisma.$connect()
        try {
            const verifyToken: VerifyToken = await prisma.verify.findFirstOrThrow({
                where: {
                    token: token, available: !toAvailable
                }
            })
            verifyToken.available = toAvailable
            await prisma.verify.update({
                where: {
                    token: verifyToken.token
                }, data: {
                    available: verifyToken.available
                }
            })
        }
        catch (err: unknown) {
            result = false
        }
        await prisma.$disconnect()
        return result
    }

export const checkVerifyToken =
    async (token: string): Promise<boolean> => {
        let result = true
        await prisma.$connect()
        try {
            await prisma.verify.findFirstOrThrow({
                where: {
                    token: token,
                    available: true
                }
            }
            )
        }
        catch (err: unknown) {
            result = false
        }
        await prisma.$disconnect()
        return result
    }
