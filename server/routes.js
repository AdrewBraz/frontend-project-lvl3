export default (postData, query='') => ({
    "auth": {
        hostname: 'datorss.com',
        port: 443,
        path: '/api/tokens',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    },
    "search": {
        hostname: 'datorss.com',
        port: 443,
        path: `/api/feeds?q=${query}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    }
})