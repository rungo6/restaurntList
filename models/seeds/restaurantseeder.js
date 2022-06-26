if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Restaurant = require('../restaurant')
const RestaurantList = require('./restaurant.json').results
const db = require('../../config/mongoose')
const MongoClient = require('mongodb').MongoClient
const User = require('../user.js')
const users = require('./users.json')
const bcrypt = require('bcryptjs')


const url = process.env.MONGODB_URI
MongoClient.connect(url, function (err, db) {
  if (err) throw err
  console.log('Database created!')
  db.close()
})


db.once('open', () => {
  Array.from(users, userdata => {
    bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(userdata.password, salt))
      .then(hash => User.create({ name: userdata.name, email: userdata.email, password: hash }))
      .then(user => {
        const userId = user._id
        RestaurantList.forEach(data => {
          if (userdata.restaurantId.includes(data.id)) {
            data.userId = userId
            return Restaurant.create(data)
          }
        })
      })
  })

  console.log('restaurantSeeder add success')
})

setTimeout(function () {
  process.exit()
}, 2500)