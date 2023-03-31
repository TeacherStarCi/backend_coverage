import { RoomSet } from '../../type'
import {
    getPlayerCurrentRoom, getPlayerCurrentRoomIndex, getNumberOfPlayers, getPlayer, getRoomFromCode, getRoomIndexFromCode,
    setPlayerRemain, setRoomToGame, setSocketUserPosition, setSocketUserPositionInRoom, setSocketUserPositionWhenChangingRoom, getPlayerCurrentPositionInRoom,
    createNewRoom, createPlayer,
    deleteNotRemainPlayer, deletePlayerFromRoom
} from './room'
describe('Room utils tests', () => {
    const roomSet: RoomSet =
        [
            {
                code: 'room1',
                betAmount: 100,
                players: [{
                    socketUser: {
                        socketId: '1',
                        user: {
                            address: 'star1',
                            username: 'nhoc_ddd',
                            asset: 20
                        },
                        position: {
                            location: 'waitingRoom'
                        },

                    },
                    remain: true
                },
                {
                    socketUser: {
                        socketId: '2',
                        user: {
                            address: '1',
                            username: 'nhoc_ddd',
                            asset: 20
                        },
                        position: {
                            location: 'waitingRoom'
                        }
                    },
                    remain: false
                },
                {
                    socketUser: {
                        socketId: '3',
                        user: {
                            address: 'sta3',
                            username: 'nhoc_ddd',
                            asset: 20
                        },
                        position: {
                            location: 'waitingRoom'
                        }
                    },
                    remain: false
                },
                {
                    socketUser: {
                        socketId: '4',
                        user: {
                            address: 'sta4',
                            username: 'nhoc_ddd',
                            asset: 20
                        },
                        position: {
                            location: 'waitingRoom'
                        }
                    },
                    remain: true
                }
                ]
            },
            {
                code: 'room2',
                betAmount: 100,
                players: []
            },
            {
                code: 'room3',
                betAmount: 100,
                players: [
                    {
                        socketUser: {
                            socketId: '5',
                            user: {
                                address: 'sta4',
                                username: 'nhoc_ddd',
                                asset: 20
                            },
                            position: {
                                location: 'waitingRoom'
                            }
                        },
                        remain: true
                    } 
                ]
            }
        ]
    test('To get player current room function test', () => {
        // case true socket id
        expect(getPlayerCurrentRoom('1', roomSet)).not.toBeNull()
        //case wrong socket id
        expect(getPlayerCurrentRoom('sample', roomSet)).toBeNull()
    })
    test('To get player current room index function test', () => {
        // case true socket id
        expect(getPlayerCurrentRoomIndex('1', roomSet)).toBe(0)
        // case wrong socket id
        expect(getPlayerCurrentRoomIndex('sample', roomSet)).toBe(-1)
    }
    )
    test('To get number of players function test', () => {
        // case true room set
        expect(getNumberOfPlayers('room1', roomSet)).toBe(4)
        // case wrong room set
        expect(getPlayerCurrentRoomIndex('sample', roomSet)).toBe(-1)
    }
    )
    test('To get players function test', () => {
        // case true socket id
        expect(getPlayer('1', roomSet)).not.toBeNull()
        // case wrong socket id
        expect(getPlayer('sample', roomSet)).toBeNull()
    }
    )
    test('To get room from code function test', () => {
        // case true room code
        expect(getRoomFromCode('room1', roomSet)).not.toBeNull()
        // case wrong room code
        expect(getRoomFromCode('sample', roomSet)).toBeNull()
    })
    test('To get room index from code function test', () => {
        // case true room code
        expect(getRoomIndexFromCode('room1', roomSet)).toBe(0)
        // case wrong room code
        expect(getRoomIndexFromCode('sample', roomSet)).toBe(-1)
    })
    test('To set player remain function test', () => {
        const roomClone: RoomSet = structuredClone(roomSet)
        const success: boolean = setPlayerRemain('1', roomClone, false)
        // wrong, do nothing
        const failure: boolean = setPlayerRemain('sample', roomSet, false)
        const playerPosition: number = getPlayerCurrentPositionInRoom('1', roomClone)
        // test if set successfully
        expect(roomClone[0].players[playerPosition].remain).toBeFalsy()
        expect(success).toBeTruthy()
        expect(failure).toBeFalsy()
    }
    )
    test('To set room to game function test', () => {
        const roomClone: RoomSet = structuredClone(roomSet)
        const success:boolean = setRoomToGame('room1', 'abcxyz', roomClone)
        // wrong, do nothing
        const failure: boolean = setRoomToGame('room1 sample', 'abcxyz', roomClone)
        // test if set successfully
        expect(roomClone[0].gameId).toBe('abcxyz')
        // test return
        expect(success).toBeTruthy()
        expect(failure).toBeFalsy()
    })
    test('To set socket user position function test', () => {
        const roomClone: RoomSet = structuredClone(roomSet)
        const success: boolean = setSocketUserPosition('1', { location: 'waitingRoom' }, roomClone)
        // wrong, do nothing
        const failure: boolean = setSocketUserPosition('sample', { location: 'waitingRoom' }, roomClone)
        const playerPosition: number = getPlayerCurrentPositionInRoom('1', roomClone)
        // test if set successfully
        expect(roomClone[0].players[playerPosition].socketUser.position).toEqual({ location: 'waitingRoom' })
        expect(success).toBeTruthy()
        expect(failure).toBeFalsy()
    }
    )
    test('To set socket user position in room function test', () => {
        const roomClone: RoomSet = structuredClone(roomSet)
        const success:boolean = setSocketUserPositionInRoom('room1', roomClone, 'terminate')
        const successOtherCase:boolean = setSocketUserPositionInRoom('room1', roomClone, 'start')
        // wrong, do nothing
        const failure: boolean = setSocketUserPositionInRoom('sample', roomClone, 'terminate')
        const playerPosition: number = getPlayerCurrentPositionInRoom('1', roomClone)
        // test if set successfully
        expect(roomClone[0].players[playerPosition].socketUser.position).toEqual( {location: 'gameRoom' , state:'inProgress'} )
        expect(success).toBeTruthy()
        expect(successOtherCase).toBeTruthy()
        expect(failure).toBeFalsy()
    }
    )
    test('To set socket user position when changing room', () => {
        const roomClone: RoomSet = structuredClone(roomSet)
        const success: boolean = setSocketUserPositionWhenChangingRoom('1', roomClone, 'toWaitingRoom')
        const successOtherCase: boolean = setSocketUserPositionWhenChangingRoom('2', roomClone, 'toGameRoom')
        // wrong, do nothing
        const failure: boolean = setSocketUserPositionWhenChangingRoom('sample', roomClone, 'toWaitingRoom')
        const playerPosition: number = getPlayerCurrentPositionInRoom('1', roomClone)
        // test if set successfully
        expect(roomClone[0].players[playerPosition].socketUser.position.location).toEqual('waitingRoom')
        expect(success).toBeTruthy()
        expect(successOtherCase).toBeTruthy()
        expect(failure).toBeFalsy()
    }
    )
    // test('To create new room function test', () => {
    //     const roomClone: RoomSet = structuredClone(roomSet)
    //     const success: boolean = createNewRoom('starcii', 100, roomClone)
    //     const failure: boolean = createNewRoom('starcii', -1, roomClone)
    //     const roomIndex: number = getRoomIndexFromCode('starcii', roomClone)
    //     // test if create successfully
    //     expect(roomClone[roomIndex]).not.toBeNull()
    //     // test return result
    //     expect(success).toBeTruthy()
    //     expect(failure).toBeFalsy()
    // })
    // test('To create new player function test', () => {
    //     const roomClone: RoomSet = structuredClone(roomSet)
    //     const success: boolean = createPlayer('12', { address: 'sample', username: 'sample', asset: 0 }, 'room2', roomClone)
    //     const failure: boolean = createPlayer('12', { address: 'sample', username: 'sample', asset: 0 }, 'wrong room', roomClone)
    //     const playerIndex: number = getPlayerCurrentPositionInRoom('12', roomClone)
    //     // test if create successfully
    //     expect(playerIndex).toBe(0)
    //     // test return result
    //     expect(success).toBeTruthy()
    //     expect(failure).toBeFalsy()
    // }
    // )
    test('To delete player from room function test', () => {
        const roomClone: RoomSet = structuredClone(roomSet)
        const success: boolean = deletePlayerFromRoom('1', roomClone)
        const successThenDeleteRoom: boolean = deletePlayerFromRoom('5', roomClone)
        const failure: boolean = deletePlayerFromRoom('sample', roomClone)
        // test delete
        const playerIndex: number = getPlayerCurrentPositionInRoom('1', roomClone)
        expect(playerIndex).toBe(-1)
        // test return result
        expect(success).toBeTruthy()
        expect(successThenDeleteRoom).toBeTruthy()
        expect(failure).toBeFalsy()
    }
    )
    test('To delete not remain player function test', () => {
        const roomClone: RoomSet = structuredClone(roomSet)
        const success: boolean[] = deleteNotRemainPlayer('room1', roomClone)
        const failure: boolean[] = deleteNotRemainPlayer('sample', roomClone)
        // test delete
        const firstPlayerIndex: number = getPlayerCurrentPositionInRoom('2', roomClone)
        const secondPlayerIndex: number = getPlayerCurrentPositionInRoom('3', roomClone)
        expect(firstPlayerIndex).toBe(-1)
        expect(secondPlayerIndex).toBe(-1)
        // test return result
        expect(success).toEqual([false,true,true,false])
        expect(failure).toEqual([])
    }
    )
}
)