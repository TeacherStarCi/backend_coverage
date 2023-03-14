import { getUser, updateUser } from '../../database'
import { getCardFromIndex, getHandRank, getHandState } from '../../service/game'
import { Card, DeckWithTxHash, Hand, HandState, RoomSet, User } from '../../type'
import { getNumberOfPlayers, getRoomIndexFromCode } from './room'

export const setAllPlayersHandsWhenStart =
    (code: string, roomSet: RoomSet, deck: DeckWithTxHash): number => {
        const roomIndex: number = getRoomIndexFromCode(code, roomSet)
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet)
        let maxRank = -1
        let playerIndexHasMaxRank = -1
        if (roomIndex != -1 && numberOfPlayers > 0) {
            for (let i = 0; i < numberOfPlayers; i++) {
                const firstCard: Card | null = getCardFromIndex(deck.deck[3 * i].cardPosition)
                const secondCard: Card | null = getCardFromIndex(deck.deck[3 * i + 1].cardPosition)
                const thirdCard: Card | null = getCardFromIndex(deck.deck[3 * i + 2].cardPosition)
                if (firstCard != null
                    && secondCard != null
                    && thirdCard != null) {
                    const cards: Card[] = [firstCard, secondCard, thirdCard]
                    const handRank: number = getHandRank(cards)
                    if (handRank > maxRank) {
                        maxRank = handRank
                        playerIndexHasMaxRank = i
                    }
                    const result: HandState | null = getHandState(cards)
                    if (result != null) {
                        const hand: Hand = {
                            cards: cards,
                            result: result,
                            isWinner: false
                        }
                        roomSet[roomIndex].players[i].hand = hand
                    }
                }
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            roomSet[roomIndex].players[playerIndexHasMaxRank].hand!.isWinner = true
        }
        return playerIndexHasMaxRank
    }

export const setAllPlayersHandsWhenTerminate
    = (code: string, roomSet: RoomSet): void => {

        const roomIndex: number = getRoomIndexFromCode(code, roomSet)
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet)

        if (roomIndex != -1 && numberOfPlayers != -1) {
            if (numberOfPlayers > 0) {
                for (let i = 0; i < numberOfPlayers; i++) {
                    roomSet[roomIndex].players[i].hand = undefined
                }
            }
        }
    }

export const setAsset =
    async (code: string, roomSet: RoomSet, betAmount: number, winnerPosition: number): Promise<boolean> => {
        const result = false
        const roomIndex: number = getRoomIndexFromCode(code, roomSet)
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet)
        if (roomIndex != -1
            && numberOfPlayers > 0
            && winnerPosition >= 0
            && winnerPosition < numberOfPlayers
            && betAmount >= 0) {
            const winnerAddress: string = roomSet[roomIndex].players[winnerPosition].socketUser.user.address
            roomSet[roomIndex].players[winnerPosition].socketUser.user.asset += 2.7 * betAmount
            const loserAddresses: string[] = []
            for (let i = 0; i < numberOfPlayers; i++) {
                if (i != winnerPosition) {
                    loserAddresses.push(roomSet[roomIndex].players[i].socketUser.user.address)
                    roomSet[roomIndex].players[i].socketUser.user.asset -= betAmount
                }
            }
            const winner: User | null = await getUser(winnerAddress)
            if (winner != null) {
                winner.asset += (0.9 * (numberOfPlayers - 1)) * betAmount
                await updateUser(winner)
            }
            const losers: User[] = []
            for (const loserAddress of loserAddresses) {
                const loser: User | null = await getUser(loserAddress)
                if (loser != null) {
                    losers.push(loser)
                }
            }
            for (const loser of losers) {
                loser.asset -= betAmount
                await updateUser(loser)
            }

        }
        return result
    } 