import { Server, Socket } from 'socket.io'
import { getUser } from '../database'
import { RoomSet, User } from '../type'
import { createNewRoom, createPlayer, deletePlayerFromRoom, generateRandomAvailableCode } from './utils'

export const waitingRoomSocket = (io: Server, socket: Socket, roomSet: RoomSet) => {
    socket.on('create new room request', async (betAmount: number, address: string) => {
        const code: string | null = generateRandomAvailableCode(roomSet)
        if (code == null) {
            socket.emit('full of rooms')
            return
        }
        const user: User | null = await getUser(address)
        const result: boolean = createNewRoom(code, address, betAmount, roomSet)
        switch (result) {
        case true:
            if (user != null) {
                const state = createPlayer(socket.id, user, code, roomSet)
                if (state == 'signed somewhere') {
                    socket.emit('fail to create new room due to signed somewhere')
                } else {
                    socket.join(code)
                    socket.emit('success to join the room')
                    io.emit('update room set', roomSet)
                }
            }
            break
        case false:
            socket.emit('fail to create new room due to signed somewhere')
            break
        }
    }
    )
    socket.on('show available room request', () => {
        io.emit('update room set', roomSet)
    })

    socket.on('join an existed room request', async (code: string, address: string) => {
        const user: User | null = await getUser(address)
        if (user != null) {
            const createPlayerResult = createPlayer(socket.id, user, code, roomSet)
            switch (createPlayerResult) {
            case 'success':
                socket.join(code)
                io.emit('update room set', roomSet)
                socket.emit('success to join the room')
                console.log(roomSet)
                break
            case 'max players':
                socket.emit('fail to join the room due to max player')
                break

            case 'signed somewhere':
                socket.emit('fail to join the room due to signed somewhere')
                break
            case null:
                break
            }

        }
    }
    )
    socket.on('leave a room request', () => {
        deletePlayerFromRoom(socket.id, roomSet)
        io.emit('update room set', roomSet)
    }
    )

}