const express = require('express')

const app = express()

const { createArtist } = require('./controllers/artists')

app.use(express.json())

app.get('/', (req, res) => {
   res.send('Hello World')
})

app.post('/artists', createArtist)

module.exports = app


