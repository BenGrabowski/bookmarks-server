function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: 'ESPN', 
            url: 'www.ESPN.com', 
            rating: 4, 
            description: 'Sports News'
        },
        {
            id: 2,
            title: 'Netflix', 
            url: 'www.netflix.com', 
            rating: 4, 
            description: 'Video streaming'
        },
        {
            id: 3,
            title: 'Soundcloud', 
            url: 'www.soundcloud.com', 
            rating: 2, 
            description: 'Music Streaming'
        },
    ]
}

module.exports = {
    makeBookmarksArray,
}