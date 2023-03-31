import { Server, Socket } from 'socket.io'
import { DisconnectReason } from 'socket.io/dist/socket'
import { Player, RoomSet, Room } from '../type'
import { deletePlayerFromRoom, getPlayer, getPlayerCurrentRoom, getRoomFromCode, setPlayerRemain } from './utils'

export const disconnectSocket = (io: Server, socket: Socket, roomSet: RoomSet) => {
    socket.on('disconnect', (reason: DisconnectReason) => {
        // print reason
        console.log(reason)
        const player: Player | null = getPlayer(socket.id, roomSet)
        const room: Room | null = getPlayerCurrentRoom(socket.id, roomSet)
        if (player == null || room == null) return
        const code: string = room.code
        switch (player.socketUser.position.location) {
        case 'gameRoom':
            // if player in a room, but not start a game
            if (player.socketUser.position.state == 'indie') {
                deletePlayerFromRoom(socket.id, roomSet)
                io.emit('update room set', roomSet)
            } else {
                // if player in a room, and in a game
                setPlayerRemain(socket.id, roomSet, false)
                io.to(code).emit('update room', getRoomFromCode(code, roomSet))
            }
            break
        case 'waitingRoom':

            break
        }
        
    }
    )
}