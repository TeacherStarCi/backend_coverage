import { PrismaClient, publickey } from '@prisma/client'

const prisma = new PrismaClient()

export const addPublicKey = async (browserToken: string, publicKey: string) => {
    let result = true
    await prisma.$connect()
    try {
        const data: publickey = { browserToken, publicKey }
        await prisma.publickey.create(
            {
                data: data
            }
        )
    } catch (err: unknown) {
        result = false
    }
    await prisma.$disconnect()
    return result
}
export const getPublicKey = async (broswerToken: string): Promise<string | null> => {
    let result: string | null = null
    await prisma.$connect()
    const data = await prisma.publickey.findUnique(
        {
            where: {
                browserToken: broswerToken
            }
        }
    )
    if (data != null){
        result = data.publicKey
    }
    await prisma.$disconnect()
    return result
}