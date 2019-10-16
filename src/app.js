const express = require('express');
const path = require('path');
const homeIndex = require('./routes/home/index');
const adminIndex = require('./routes/admin/index');
const {router} = require('./routes/userRoute');
const methodOverride = require('method-override');
const adminPost = require('./routes/admin/posts');
const bodyParser = require('body-parser');
const exhb = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const { formatDate, publicPost, paginate } = require('../helpers/upload');
const categoriesIndex = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');
//const  { passportStrategy } = require('./middleware/middleware');
const passport = require('passport');
require('./db/mongoose');


const app = express();
const port = process.env.PORT

const publicFolder = path.join(__dirname, '../public');

//const viewPath = path.join(__dirname, '../templates/views');

const handleBars = exhb.create({
    extname: '.hbs',
    defaultLayout: 'home',
    helpers: {
        formatDate,
        paginate

    }
});




app.engine('.hbs', handleBars.engine)
app.set('view engine', '.hbs');



app.use(express.static(publicFolder));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride('_method'));


app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,

}));

// Passport

app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.notice = req.flash('notice');
    res.locals.errorMsg = req.flash('errorMsg');
    res.locals.error = req.flash('error');

    next()
})
app.use(router);

app.use(homeIndex);
app.use(adminIndex);
app.use('/admin', adminPost);
app.use(categoriesIndex);
app.use('/admin/comments/', comments)











app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})


