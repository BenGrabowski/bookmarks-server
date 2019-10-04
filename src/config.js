module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DB_URL || 'postgresql://postgres@localhost/bookmarks',
    API_TOKEN: process.env.API_TOKEN || '79b9eb76-f9fc-44d1-98a8-d53ac29c77e1'
}