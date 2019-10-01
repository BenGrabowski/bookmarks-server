const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks.fixtures')

describe.only('Bookmarks Endpoints', () => {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('bookmarks').truncate())

    afterEach('cleanup', () => db('bookmarks').truncate())

    describe('Unauthorized request', () => {
        it('responds with 401 Unauthorized for GET /bookmarks', () => {
            return supertest(app)
                .get('/boomarks')
                .expect(401, { error: 'Unauthorized request' })
        })

        it('responds with 401 Unauthorized for GET /bookmarks/:id', () => {
            const bookmarkArray = makeBookmarksArray();
            const secondBookmark = bookmarkArray[1]
            return supertest(app)
                .get(`/bookmarks/${secondBookmark.id}`)
                .expect(401, { error: 'Unauthorized request' })
        })
    })
    
    describe('GET /boomarks', () => {
        context('Given no bookmarks', () => {
            it('responds with 200 and an empty list', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
        })

        context('Given there are bookmarks in the database', () => {
            const bookmarkArray = makeBookmarksArray()

            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks')
                    .insert(bookmarkArray)
            })

            it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
                return supertest(app)
                    .get('/bookmarks')
                    .expect(200, bookmarkArray)
            })
        })
    })

    describe('GET bookmarks/:id', () => {
        context('Given no bookmarks', () => {
            it(`responds with 404 when book mark doesn't exist`, () => {
                supertest(app)
                    .get(`/bookmarks/123`)
                    .expect(404, { error: { message: `Bookmark doesn't exist` } })
            })
        })

        context(`Given there are bookmarks in the database`, () => {
            const bookmarkArray = makeBookmarksArray()
            
            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks')
                    .insert(bookmarkArray)
            })

            it('responds with 200 and the specified bookmark', () => {
                const bookmarkId = 2
                const expectedBookmark = bookmarkArray[bookmarkId -1]
                return supertest(app)
                    .get(`bookmarks/${bookmarkId}`)
                    .expect(200, expectedBookmark)
            })
        })
    })
})