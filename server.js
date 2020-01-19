const mongoose = require('mongoose')
const express = require('express')
const app = express();

const dotenv = require('dotenv')
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
//get login page

app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'kyle' })
})
//get login page
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
//get register page
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

//post
app.post('/register', (req, res) => {

})
app.post('/login', (req, res) => {

})
// import Routes
const authRoute = require('./auth')
const postRoute = require('./routes/post')
// dot env init
dotenv.config()

//connect to DB
mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true }, () => console.log('Connected to DB!'))

//Middleware
app.use(express.json());


//route Middlewares
app.use('/api/user', authRoute)

app.use('/api/post', postRoute)



app.listen(3000, () => console.log(`Server started on Port ${PORT}`))