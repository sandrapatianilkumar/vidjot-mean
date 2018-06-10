//server
const express = require('express');
//template engine
const exphbs = require('express-handlebars');
//mongoose for mongodb models
const mongoose = require('mongoose');
//bodyparser for json
const bodyParser = require('body-parser');

//passport
const passport = require('passport');

//override the form methods 
const methodOverride = require('method-override');

//flash for messages
const flash = require('connect-flash');

//session for express
const session = require('express-session');

//join paths like static folder
const path = require('path');

const app = express();

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//loading passport config
require('./config/passport')(passport);

//db config
const db = require('./config/database');

//map global promises - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose
mongoose.connect(db.mongoURI, {
        // useMongoClient: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
//body parser middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//static folder 
app.use(express.static(path.join(__dirname, 'public')))

//method override middleware
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

//session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
        //cookie: { secure: true }
}));

//passport session and need to put after express session only 
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());

//global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//how middleware works
// app.use((req, res, next) => {
//     req.name = "Sandrapati Anilkumar";
//     next();
// });

//middlebars handlerbars
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


//Index route
app.get('/', (req, res) => {
    //res.send(`INDEX`);
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
});

//About route
app.get('/about', (req, res) => {
    //res.send('ABOUT')
    res.render('about');
})

//use routes
app.use('/ideas', ideas);
app.use('/users', users);
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});