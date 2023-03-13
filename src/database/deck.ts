import { deck, deckdetail, PrismaClient } from '@prisma/client'
import { getHashedFromCurrentTimestamp } from '../hash'
import { CardPosition, DecksWithTxHash, DeckWithTxHash } from '../type'
const prisma: PrismaClient = new PrismaClient()

export const addDeck = async (deck: DeckWithTxHash): Promise<boolean> => {
    let result = true
    await prisma.$connect()
    try {
        const deckId: string = getHashedFromCurrentTimestamp('deck')
        const deckData: deck = {
            txHash: deck.txHash,
            index: deck.index,
            deckId: deckId
        }
        await prisma.deck.create(
            {
                data: deckData
            }
        )

        if (deck.deck.length > 0) {

            for (const card of deck.deck) {
                const deckDetailData: deckdetail = {
                    deckId: deckId,
                    cardValue: card.cardValue,
                    cardPosition: card.cardPosition
                }
                await prisma.deckdetail.create({
                    data: deckDetailData
                }
                )
            }
        }

    } catch (err: unknown) {
        result = false
    }
    await prisma.$disconnect()
    return result
}

export const addDecks = async (decks: DecksWithTxHash): Promise<boolean[]> => {
    const results: boolean[] = []
    await prisma.$connect()
    if (decks.length > 0) {
        for (const deck of decks) {
            const result = await addDeck(deck)  
            results.push(result)
        }
    }
    await prisma.$disconnect()
    return results
}

export const getDecks = async (txHash: string): Promise<DecksWithTxHash> => {
    const results: DecksWithTxHash = []
    await prisma.$connect()
    const decks: deck[] = await prisma.deck.findMany({
        where: {
            txHash: txHash
        }
    })
    if (decks.length > 0) {
        for (const deck of decks) {
            const deckId: string = deck.deckId
            const deckDetails: deckdetail[] = await prisma.deckdetail.findMany({
                where: {
                    deckId: deckId
                }
            })
            const cards: CardPosition[] = deckDetails.map(deckDetails => {
                return {
                    cardValue: deckDetails.cardValue,
                    cardPosition: deckDetails.cardPosition
                }
            })
            const deckWithTransactionHash: DeckWithTxHash = {
                txHash: txHash,
                index: deck.index,
                deck: cards
            }
            results.push(deckWithTransactionHash)
        }
    }

    await prisma.$disconnect()
    return results
}
