if (process.env.NODE_ENV == 'production') {
    module.exports = {
        mongoURI: 'mongodb://anil:Anil@696@ds139817.mlab.com:39817/vidjot-mongo-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}