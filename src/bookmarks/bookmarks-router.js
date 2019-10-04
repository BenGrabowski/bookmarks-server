const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const xss = require('xss')
const BookmarksService = require('../bookmarks-service')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

const sanitizeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: xss(bookmark.url),
    rating: bookmark.rating,
    description: xss(bookmark.description)
})

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        BookmarksService.getAllBookmarks(req.app.get('db'))
            .then(bookmarks => {
                res.json(bookmarks.map(sanitizeBookmark))
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { title, url, rating, description } = req.body
        const newBookmark = { title, url, rating, description }
        const validateFields = { title, url, rating }

        for (const [key, value] of Object.entries(validateFields)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }

        const ratingNum = Number(rating)
        
        if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
            return res.status(400).send({
              error: { message: `'rating' must be a number between 0 and 5` }
            })
          }
    
        // const id = uuid()
        // const bookmark = {
        //     id,
        //     title,
        //     url,
        //     rating,
        //     description
        // }
    
        BookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(sanitizeBookmark(bookmark))
                    logger.info(`Bookmark with id ${bookmark.id} created`)
            })
            .catch(next)
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .all((req, res, next) => {
        BookmarksService.getById(
            req.app.get('db'),
            req.params.id
        )
            .then(bookmark => {
                if (!bookmark) {
                    return res.status(404).json({
                        error: { message: `Bookmark doesn't exist` }
                    })
                }
                res.bookmark = bookmark
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(sanitizeBookmark(res.bookmark))
    })
    .delete((req, res, next) => {
        BookmarksService.deleteBookmark(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })

module.exports = bookmarksRouter