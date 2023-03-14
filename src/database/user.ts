
import { PrismaClient, user } from '@prisma/client'
import { Transaction, User } from '../type'
import { getTransaction } from './transaction'
const prisma: PrismaClient = new PrismaClient()

export const addUser = async (user: User): Promise<boolean> => {
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

export const getUser = async (address: string): Promise<User | null> => {
    let result: User | null = null
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

export const updateUser = async (user: User): Promise<void> => {
    await prisma.$connect()
    await prisma.user.update(
        {
            where: {
                address: user.address
            },
            data: {
                username: user.username,
                asset: user.asset
            }
        }
    )
    await prisma.$disconnect()
}
export const getUserWithTransaction = async (address: string): Promise<User | null> => {
    let result: User | null = null
    await prisma.$connect()
    const sample: user | null = await prisma.user.findUnique(
        {
            where: {
                address: address
            }
        }
    )
    if (sample != null) {
        let username = ''
        if (sample.username != null) {
            username = sample.username
        }
        const prismaDeposits: Transaction[] = await getTransaction(sample.address, 'deposit')
        const prismaWithdraws: Transaction[] = await getTransaction(sample.address, 'withdraw')
        result = {
            address: sample.address,
            username: username,
            asset: sample.asset,
            deposits: prismaDeposits,
            withdraws: prismaWithdraws
        }
    }
    await prisma.$disconnect()
    return result
}