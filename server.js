/** @format */

const express = require('express');
const app = express();
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const verifyToken = require('./verifyToken');
const generateToken = require('./generateToken');
const JWT = require('jsonwebtoken');
const connectDB = require('./config/db');

const dotenv = require('dotenv');
const PORT = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(flash());
app.use(
  session({
    secret: 'anything',
    resave: false,
    saveUninitialized: false
  })
);
app.use(bodyParser());

app.use(express.json());
app.use(cors());

// // set a cookie
// app.use('/', (req, res, next) => {
//     // check if client sent cookie
//     var cookie = req.cookies.cookieName;
//     if (cookie === undefined) {
//         // no: set a new cookie
//         var randomNumber = Math.random().toString();
//         randomNumber = randomNumber.substring(2, randomNumber.length);
//         res.cookie('cookieName', randomNumber, { maxAge: 900000, httpOnly: true });
//         console.log('cookie created successfully');
//     }
//     else {
//         // yes, cookie was already present
//         console.log('cookie exists', cookie);
//     }
//     next(); // <-- important!
// });

//get home page
//get home page

// define Routes
// app.use('/api/users',require('./routes/api/users'))
// app.use('/api/auth',require('./routes/api/auth'))
// app.use('/api/profile',require('./routes/api/profile'))
// app.use('/api/posts',require('./routes/api/posts'))

app.get('/', verifyToken, (req, res) => {
  res.render('index.ejs', { name: req.body.User });
});
//get login page
app.get('/login', (req, res) => {
  res.render('login.ejs');
});
//get register page
app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.get('/', verifyToken, (req, res) => {
  // User.findOne({ id: User }, 'name email token', (err, docs) => {

  //     res.render('index.ejs', {
  //         user: docs,

  //     })
  // Cookies that have not been signed
  console.log('Cookies: ', req.cookies);

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies);
});

// import Routes
// const authRoute = require('./auth');
const postRoute = require('./routes/api/post');
const userRoute = require('./routes/api/users');
const authRoute = require('./routes/api/auth');
const profileRoute = require('./routes/api/profile');
// dot env init
dotenv.config();

// //connect to DB
connectDB();
// mongoose.connect(process.env.DB_CONNECT,
//     { useUnifiedTopology: true }, () => console.log('Connected to DB!'))

// var User = require('./model/User');

//Middleware
app.use(express.json({ extended: false }));

app.get('/', function(req, res) {
  req.flash('info', 'Welcome');
  res.render('index', {
    title: 'Home'
  });
});
app.get('/addFlash', function(req, res) {
  req.flash('info', 'Flash Message Added');
  res.redirect('/');
});

//route Middlewares
// app.use('/api/user', authRoute);

app.use('/api/post', postRoute);

app.use('/api/users', userRoute);

app.use('/api/auth', authRoute);

app.use('/api/profile', profileRoute);

// // console.log(User.find())
// User.findOne().exec(function (err, docs) {
//     console.log(docs.name)
//     userId = docs.name
//     console.log(userId)
// });

app.listen(5000, () => console.log(`Server started on Port ${PORT}`));
