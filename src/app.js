require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const logger = require('./logger')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const bookmarks = require('./store')
const uuid = require('uuid/v4')

const app = express()

const morganOption = (NODE_ENV === 'production') 
? 'tiny'
: 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || apiToken !== authToken.split(' ')[1]) {
        logger.error(`Unauthorized request to path ${req.path}`)
        return res.status(401).json({error: 'Unauthorized request'})
    }
    next()
})

app.get('/bookmarks', (req, res) => {
    res.json(bookmarks)
})

app.get('/bookmarks/:id', (req, res) => {
    const { id } = req.params

    const bookmark = bookmarks.find(bookmark => bookmark.id == id)

    if (!bookmark) {
        logger.error(`Bookmark with id ${id} not found`)
        res
            .status(404)
            .send('Bookmark not found')
    }

    res.json(bookmark)
})

app.post('/bookmarks', (req, res) => {
    const { title, url, rating, description } = req.body

    if (!title) {
        logger.error(`Title is required`)
        res.status(400).send('Invalid data')
    }

    if (!url) {
        logger.error(`Url is required`)
        res.status(400).send('Invalid data')
    }

    if (!rating || Number.isNaN(parseFloat(rating))) {
        logger.error(`Rating is required`)
        res.status(400).send('Invalid data')
    }

    const id = uuid()
    const bookmark = {
        id,
        title,
        url,
        rating,
        description
    }

    bookmarks.push(bookmark)
    
    logger.info(`Bookmark with id ${id} created`)

    res
        .status(201)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json(bookmark)
})

app.delete('/bookmarks/:id', (req, res) => {
    const { id } = req.params
    
    const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id)
    
    if (bookmarkIndex === -1) {
        logger.error(`Bookmark with id ${id} not found`)
        res.status(404).send('Bookmark not found')
    }
    bookmarks.splice(bookmarkIndex, 1)
    
    logger.info(`Bookmark with id ${id} deleted`)
    
    res.status(204).end()   
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: {message: 'server error'} }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app