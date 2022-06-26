const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurantlist')

router.get("/", (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurant => res.render("index", { restaurants: restaurant }))
    .catch(err => console.log(err))
})
router.get("/search", (req, res) => {
  Restaurant.find({})
    .lean()
    .then(restaurant => {
      const keyword = req.query.keyword
      const restaurants = restaurant.filter(restaurant => {
        return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
      }
      )
      res.render("index", { restaurants, keyword })
    })
    .catch(err => console.log(err))
})
module.exports = router