import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

export class App {
    app: Application

    configBodyParser = (): void => {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
    }
    constructor() {
        this.app = express()
        this.app.use(cors())
        this.configBodyParser()
    }
} 