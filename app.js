const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const usePassport = require('./config/passport')
const session = require('express-session')
const res = require('express/lib/response')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const methodOverride = require("method-override")
const routes = require('./routes')
require('./config/mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(methodOverride("_method"))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

usePassport(app)

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  next()
})

app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error')
  next()
})

app.use(routes)


app.listen(PORT, () => {
  console.log(`Express is listening on localhost:${PORT}`)
})