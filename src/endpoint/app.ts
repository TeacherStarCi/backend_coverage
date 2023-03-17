import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors, { CorsOptions } from 'cors'

export class App {
    app: Application

    configBodyParser = (): void => {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        const corsOptions: CorsOptions = {
            origin: 'abc.com'
        }
        this.app.use(cors(corsOptions))
    }
    constructor() {
        this.app = express()
        this.configBodyParser()
    }
} 