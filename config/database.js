if (process.env.NODE_ENV == 'production') {
    module.exports = {
        mongoURI: 'mongodb://<dbuser>:<dbpassword>@ds139817.mlab.com:39817/vidjot-mongo-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/vidjot-dev'
    }
}