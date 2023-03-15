import { RoomSet, Room, Position, Player, User, SocketUser } from '../../type'

export const getPlayerCurrentRoom =
    (socketId: string, roomSet: RoomSet): Room | null => {
        let result: Room | null = null
        const resultWithUndefined: Room | undefined = roomSet.find(room =>
            typeof room.players.find(player =>
                player.socketUser.socketId == socketId) != 'undefined')
        if (typeof resultWithUndefined != 'undefined') {
            result = resultWithUndefined
        }
        return result
    }

export const getPlayerCurrentRoomIndex =
    (socketId: string, roomSet: RoomSet): number => {
        const result: number = roomSet.findIndex(room =>
            typeof room.players.find(player =>
                player.socketUser.socketId == socketId) != 'undefined')
        return result
    }

export const getPlayerCurrentPositionInRoom =
    (socketId: string, roomSet: RoomSet): number => {
        const currentRoom: Room | null = getPlayerCurrentRoom(socketId, roomSet)
        let result = -1
        if (currentRoom != null) {
            result = currentRoom.players.findIndex(player =>
                player.socketUser.socketId == socketId)
        }
        return result
    }

export const deletePlayerFromRoom =
    (socketId: string, roomSet: RoomSet): boolean => {
        let result = false
        const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet)
        const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet)
        if (roomIndex != -1 && playerPosition != -1) {
            roomSet[roomIndex].players.splice(playerPosition, 1)
            result = true
            if (!roomSet[roomIndex].players.length) {
                roomSet.splice(roomIndex, 1)
            }
        }
        return result
    }
export const getRoomFromCode =
    (code: string, roomSet: RoomSet): Room | null => {
        let result: Room | null = null
        const resultWithUndefined: Room | undefined = roomSet.find(room => room.code == code)
        if (typeof resultWithUndefined != 'undefined') {
            result = resultWithUndefined
        }
        return result
    }

export const getRoomIndexFromCode = (code: string, roomSet: RoomSet): number => {
    const result: number = roomSet.findIndex(room => room.code == code)
    return result
}
export const setRoomToGame = (code: string, gameId: string, roomSet: RoomSet): boolean => {
    let result = false
    const roomIndex: number = getRoomIndexFromCode(code, roomSet)
    if (roomIndex != -1) {
        roomSet[roomIndex].gameId = gameId
        result = true
    }
    return result
}

export const setSocketUserPosition =
    (socketId: string, position: Position, roomSet: RoomSet): boolean => {
        let result = false
        const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet)
        const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet)
        if (roomIndex != -1 && playerPosition != -1) {
            roomSet[roomIndex].players[playerPosition].socketUser.position = position
            result = true
        }
        return result
    }
export const getNumberOfPlayers = (code: string, roomSet: RoomSet): number => {
    const room: Room | null = getRoomFromCode(code, roomSet)
    let result = -1
    if (room != null) {
        result = room.players.length
    }
    return result
}

export const setSocketUserPositionWhenChangingRoom =
    (socketId: string, roomSet: RoomSet, when: 'toGameRoom' | 'toWaitingRoom'): boolean => {
        let result = false
        const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet)
        const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet)
        if (roomIndex != -1 && playerPosition != -1) {
            switch (when) {
            case 'toGameRoom':
                roomSet[roomIndex].players[playerPosition].socketUser.position = {
                    location: 'gameRoom',
                    state: 'indie'
                }
                break
            case 'toWaitingRoom':
                roomSet[roomIndex].players[playerPosition].socketUser.position = {
                    location: 'waitingRoom'
                }
                break
            }
            result = true
        }
        return result
    }

export const getPlayer =
    (socketId: string, roomSet: RoomSet): Player | null => {
        let result: Player | null = null
        const roomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet)
        const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet)
        if (roomIndex != -1 && playerPosition != -1) {
            result = roomSet[roomIndex].players[playerPosition]
        }
        return result
    }

export const createPlayer =
    (socketId: string, user: User, code: string, roomSet: RoomSet): boolean => {
        let result = false
        const roomIndex: number = getRoomIndexFromCode(code, roomSet)
        if (roomIndex != -1) {
            const socketUser: SocketUser = {
                socketId: socketId,
                user: user,
                position: {
                    location: 'gameRoom',
                    state: 'indie'
                }
            }
            const numberOfPlayers: number = getNumberOfPlayers(code, roomSet)
            if (numberOfPlayers < 4) {
                const player: Player = {
                    socketUser: socketUser,
                    remain: true
                }
                roomSet[roomIndex].players.push(player)
                result = true
            }
        }
        return result
    }

export const setSocketUserPositionInRoom =
    (code: string, roomSet: RoomSet, when: 'start' | 'terminate'): boolean => {
        let result = false
        const roomIndex: number = getRoomIndexFromCode(code, roomSet)
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet)
        if (roomIndex != -1 && numberOfPlayers >= 1) {
            switch (when) {
            case 'start':
                for (let i = 0; i < numberOfPlayers; i++) {
                    roomSet[roomIndex].players[i].socketUser.position.state = 'inProgress'

                }
                break
            case 'terminate':
                for (let i = 0; i < numberOfPlayers; i++) {
                    roomSet[roomIndex].players[i].socketUser.position.state = 'indie'
                }
                break
            }
            result = true
        }
        return result
    }

export const createNewRoom =
    (code: string, betAmount: number, roomSet: RoomSet): boolean => {
        let result = true
        const roomIndex: number = getRoomIndexFromCode(code, roomSet)
        if (roomIndex != -1) {
            result = false
        } else {
            const newRoom: Room = {
                code: code,
                betAmount: betAmount,
                players: []
            }
            roomSet.push(newRoom)
        }
        return result
    }

export const setPlayerRemain =
    (socketId: string, roomSet: RoomSet, toStatus: boolean): boolean => {
        let result = false
        const playerCurrentRoomIndex: number = getPlayerCurrentRoomIndex(socketId, roomSet)
        const playerPosition: number = getPlayerCurrentPositionInRoom(socketId, roomSet)
        if (playerCurrentRoomIndex != -1 && playerPosition != -1) {
            roomSet[playerCurrentRoomIndex].players[playerPosition].remain = toStatus
            result = true
        }
        return result
    }

export const deleteNotRemainPlayer =
    (code: string, roomSet: RoomSet): boolean[] => {
        const results: boolean[] = []
        const roomIndex: number = getRoomIndexFromCode(code, roomSet)
        const numberOfPlayers: number = getNumberOfPlayers(code, roomSet)
        if (roomIndex != -1 && numberOfPlayers > 0) {
            let reduced = 0
            for (let i = 0; i < numberOfPlayers; i++) {
                if (!roomSet[roomIndex].players[i - reduced].remain) {
                    const socketId: string = roomSet[roomIndex].players[i - reduced].socketUser.socketId
                    deletePlayerFromRoom(socketId, roomSet)
                    reduced += 1
                    results.push(true)
                } else {
                    results.push(false)
                }
            }
        }
        return results
    }
