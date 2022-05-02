const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const restaurantsData = require('./restaurant.json').results
const mongoose = require('mongoose')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({ extended: true }))
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})
app.get('/', (req, res) => {

  res.render('index', { restaurantsData })
})
app.get("/search", (req, res) => {
  if (!req.query.keywords) {
    return res.redirect("/")
  }
  const keywords = req.query.keywords
  const keyword = req.query.keywords.trim().toLowerCase()

  const filterRestaurantsData = restaurantsData.filter(
    data =>
      data.name.toLowerCase().includes(keyword) ||
      data.category.includes(keyword)
  )
  res.render("index", { restaurantsData: filterRestaurantsData, keywords })
})
app.get("/restaurants/:restaurantId", (req, res) => {
  const { restaurantId } = req.params
  const restaurantData = restaurantsData.find(
    data => data.id === Number(restaurantId)
  )
  res.render("show", { restaurantData })
})
app.use(express.static('public'))
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})