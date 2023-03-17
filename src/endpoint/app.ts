import express, { Application } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

export class App {
    app: Application

    configBodyParser = (): void => {
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(cors())
    }
    constructor() {
        this.app = express()
        this.configBodyParser()
    }
} 