import { Application } from 'express'
import {App, authEndpoint} from './endpoint'

const app: Application = new App().app

authEndpoint(app)
