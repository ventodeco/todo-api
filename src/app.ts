import express, { Request, Response } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './routes/index';

const app = express()
const PORT = 1234

const {
    MONGODB_ATLAS_USERNAME,
    MONGODB_ATLAS_PASSWORD,
    MONGODB_ATLAS_DBNAME
} = process.env

const uri = `mongodb+srv://${MONGODB_ATLAS_USERNAME}:${MONGODB_ATLAS_PASSWORD}@cluster0.xxki8.mongodb.net/${MONGODB_ATLAS_DBNAME}?retryWrites=true&w=majority`

const options = { useNewUrlParser: true, useUnifiedTopology: true }

app.use(cors())

app.use(router)

mongoose.set('useFindAndModify', true)
mongoose.connect(uri, options)
    .then(() => {
        app.listen(PORT, () => {
            console.info(`App listening at http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        throw error
    })
