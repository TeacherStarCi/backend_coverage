import { Application } from 'express'
import {App, transactionEndpoint, authenticationEndpoint} from './endpoint'
import { DecksWithTxHash, RoomSet } from './type'
import http, {Server as HttpServer} from 'http'
import {Server as WebSocketServer} from 'socket.io'
import { disconnectSocket, gameRoomSocket, waitingRoomSocket } from './socket'
const app: Application = new App().app
const httpServer: HttpServer = http.createServer(app)

const io: WebSocketServer = new WebSocketServer(httpServer, {
    cors: {
        origin: '*'
    }
}
)

//resouce
const roomSet: RoomSet = []
const decks: DecksWithTxHash = []

// .env

// tao vi cua server - co menemonic (24 characters - keplr)
// cosmjs connect vao vi 
io.on('connection', (socket) => {
    waitingRoomSocket(io, socket, roomSet)
    disconnectSocket(io, socket, roomSet)
    gameRoomSocket(io, socket, roomSet, decks)
}
)

authenticationEndpoint(app)
transactionEndpoint(app)
httpServer.listen(3001)

