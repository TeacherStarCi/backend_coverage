import { Server, Socket } from 'socket.io'
import { getUser } from '../database'
import { RoomSet, User } from '../type'
import { createNewRoom, createPlayer, getRoomFromCode } from './utils'

export const waitingRoomSocket = (io: Server, socket: Socket, roomSet: RoomSet) => {
    socket.on('create new room request', async (code: string, betAmount: number, address: string) => {
        const user: User | null = await getUser(address)
        const result: boolean = createNewRoom(code, betAmount, socket.id, roomSet)
        switch (result) {
        case true:
            socket.join(code)
            if (user != null) {
                createPlayer(socket.id, user, code, roomSet)
            }
            io.to(code).emit('update room', getRoomFromCode(code, roomSet))
            break
        case false:
            socket.emit('fail to create new room')
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
            const createPlayerResult: boolean = createPlayer(socket.id, user, code, roomSet)
            switch (createPlayerResult) {
            case true:
                socket.join(code)
                io.to(code).emit('update room', getRoomFromCode(code, roomSet))
                break
            case false:
                socket.emit('fail to join the room')
                break
            }
            console.log(getRoomFromCode(code, roomSet))
        }
    }
    )

}