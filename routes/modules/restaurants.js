const express = require('express')
const router = express.Router()
const restaurant = require('../../models/restaurantlist')

router.get('/new/newcontent', (req, res) => {
  res.render('newcontent')
})

router.get('/:restaurant_id', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id
  restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => { res.render('content', { restaurants: restaurant }) })
    .catch(error => console.log(error))
})

router.get('/:restaurant_id/edit', (req, res) => {
  const _id = req.params.restaurant_id
  const userId = req.user._id
  restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => { res.render('edit', { restaurants: restaurant }) })
    .catch(error => console.log(error))
})

router.post('/create', (req, res) => {
  const userId = req.user._id
  const reqbody = req.body
  return restaurant.create({ ...reqbody, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.put('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  return restaurant.findOneAndUpdate({ _id, userId }, req.body)
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.delete('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  return restaurant.findOneAndDelete({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router