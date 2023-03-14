import { Server, Socket } from 'socket.io'
import { getDecks } from '../database'
import { getDecksFromContract } from '../service/random'
import { DecksWithTxHash, DeckWithTxHash, RoomSet, Room } from '../type'
import { deleteNotRemainPlayer, getRoomFromCode, setAllPlayersHandsWhenStart, setAllPlayersHandsWhenTerminate, setAsset, setSocketUserPositionInRoom } from './utils'

export const gameRoomSocket = (io: Server, socket: Socket,
    roomSet: RoomSet, deckStorage: DecksWithTxHash) => {
    socket.on('start game request', async (code: string) => {
        let txHash = ''
        if (deckStorage.length == 0) {
            // the storage is empty
            txHash = await getDecksFromContract()
            console.log(txHash)
            deckStorage = await getDecks(txHash)
        } else {
            txHash = deckStorage[0].txHash
        }
        const gameDeck: DeckWithTxHash | undefined = deckStorage.pop()
        console.log(gameDeck?.deck)
        // console.log(deckStorage);
        if (typeof gameDeck != 'undefined') {
            const winnerPosition: number = setAllPlayersHandsWhenStart(code, roomSet, gameDeck)
            setSocketUserPositionInRoom(code, roomSet, 'start')
            const thisRoom: Room|null = getRoomFromCode(code, roomSet)
            if (thisRoom != null){
                await setAsset(code, roomSet, thisRoom.betAmount, winnerPosition)
            }
            io.to(code).emit('update room', getRoomFromCode(code, roomSet))
            io.emit('update room', getRoomFromCode(code, roomSet))
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
