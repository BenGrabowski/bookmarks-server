const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
// const { bookmarks } = require('../store')
const BookmarksService = require('../bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksService.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks)
            })
            .catch(next)
    })
    .post(bodyParser, (req, res) => {
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

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res, next) => {
        const { id } = req.params

        const bookmark = bookmarks.find(bookmark => bookmark.id == id)
    
        if (!bookmark) {
            logger.error(`Bookmark with id ${id} not found`)
            res
                .status(404)
                .send('Bookmark not found')
        }

        const knexInstance = req.app.get('db')
        BookmarksService.getById(knexInstance, id)
            .then(bookmark => {
                if(!bookmark) {
                    return res.status(404).json({
                        error: { message: `Bookmark does't exist` }
                    })
                }
                res.json(bookmark)
            })
            .catch(next)
    })
    .delete((req, res) => {
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

module.exports = bookmarksRouter