
import { PrismaClient, user } from '@prisma/client'
import { User } from '../type'
const prisma: PrismaClient = new PrismaClient()

export const createUser = async (user: User): Promise<boolean> => {
    let result = true
    await prisma.$connect()
    try {
        const data: user = {
            address: user.address,
            username: user.username,
            asset: user.asset
        }
        await prisma.user.create({
            data: data
        }
        )
    } catch (err: unknown) {
        result = false
    }
    await prisma.$disconnect()
    return result
}

export const getUser = async (address: string): Promise<User|null> => {
    let result: User|null = null
    await prisma.$connect()
    result = await prisma.user.findUnique(
        {
            where: {
                address: address
            }
        }
    )
    await prisma.$disconnect()
    return result
}

