const express = require('express')

const app = express()

const artistsRouter = require('./routes/artists')
const albumsRouter = require('./routes/albums')
const songsRouter = require('./routes/songs')

app.use(express.json())

app.use('/artists', artistsRouter)
app.use('/albums', albumsRouter)
app.use('/songs',  songsRouter)




module.exports = app
