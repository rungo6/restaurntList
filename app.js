const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')

const bodyParser = require('body-parser')
const methodOverride = require("method-override")
const routes = require('./routes')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(methodOverride("_method"))
app.use(routes)

require('./config/mongoose')


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})