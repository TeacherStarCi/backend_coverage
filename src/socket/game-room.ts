import { Server, Socket } from 'socket.io'
import { getDecks } from '../database'
import { getDecksFromContract } from '../service/random'
import { DecksWithTxHash, DeckWithTxHash, RoomSet, Room } from '../type'
import { checkAsset, deleteNotRemainPlayer, getNumberOfPlayers, getRoomFromCode, setAllPlayersHandsWhenStart, setAllPlayersHandsWhenTerminate, setAsset, setSocketUserPositionInRoom } from './utils'

export const gameRoomSocket = (io: Server, socket: Socket,
    roomSet: RoomSet, deckStorage: DecksWithTxHash) => {
    socket.on('start game request', async (code: string) => {
        const room: Room | null = getRoomFromCode(code, roomSet)
        if (room == null) return
        const betAmount: number = room.betAmount
        const check: boolean = await checkAsset(code, roomSet, betAmount)
        if (!check) {
            io.to(code).emit('throw error', {message: 'a player is lack of money'})
            return
        }
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet)
        if (numberOfPlayers < 2){
            io.to(code).emit('throw error', {message: 'not enough players'})
        }
        let txHash = ''
        if (deckStorage.length == 0) {
            // the storage is empty
            txHash = await getDecksFromContract()
            deckStorage = await getDecks(txHash)
        }
        //  else {
        //     txHash = deckStorage[0].txHash
        // }
        const gameDeck: DeckWithTxHash | undefined = deckStorage.pop()
        if (typeof gameDeck != 'undefined') {
            const winnerPosition: number = setAllPlayersHandsWhenStart(code, roomSet, gameDeck)
            setSocketUserPositionInRoom(code, roomSet, 'start')
            const thisRoom: Room | null = getRoomFromCode(code, roomSet)
            if (thisRoom != null) {
                await setAsset(code, roomSet, thisRoom.betAmount, winnerPosition)
            }
            io.to(code).emit('update room', getRoomFromCode(code, roomSet))
        }
    }
    )
    socket.on('terminate game request', async (code: string) => {
        setAllPlayersHandsWhenTerminate(code, roomSet)
        setSocketUserPositionInRoom(code, roomSet, 'terminate')
        deleteNotRemainPlayer(code, roomSet)
        io.to(code).emit('update room', getRoomFromCode(code, roomSet))
    }
    )

}
