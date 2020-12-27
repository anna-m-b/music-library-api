const express = require('express')

const app = express()

const { create, list, getArtistById, update} = require('./controllers/artists')

app.use(express.json())

app.post('/artists', create)

app.get('/artists', list)

app.get('/artists/:id', getArtistById)

app.patch('/artists/:id', update)

module.exports = app


