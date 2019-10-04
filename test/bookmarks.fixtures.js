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

function makeMaliciousBookmark() {
    const maliciousBookmark = {
        id: 911,
        title: 'Malicious Bookmark title',
        url: 'www.malicious-article.com <script>Attack</script>',
        rating: 1,
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    }

    const expectedBookmark = {
        ...maliciousBookmark,
        url: 'www.malicious-article.com &lt;script&gt;Attack&lt;/script&gt;',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`

    }

    return {
        maliciousBookmark,
        expectedBookmark
    }
}

module.exports = {
    makeBookmarksArray,
    makeMaliciousBookmark
}