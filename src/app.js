const express = require('express')

const app = express()

const { createArtist, 
        listArtists, 
        getArtistById, 
        updateArtist, 
        deleteArtist 
      } = require('./controllers/artists')
      
const { createAlbum, 
        listAlbums, 
        listAlbumsOfArtist, 
        getAlbumById, 
        updateAlbum, 
        deleteAlbum 
      } = require('./controllers/albums')

const { createSong,
      } = require('./controllers/songs')

const { checkParamsArtistId } = require('./middleware/validation')
const { logging } = require('./middleware/logging')

app.use(express.json())
// app.use(logging)


// ARTISTS

app.post('/artists', createArtist)

app.get('/artists', listArtists)

app.get('/artists/:artistId', checkParamsArtistId, getArtistById)

app.patch('/artists/:artistId', updateArtist)

app.delete('/artists/:artistId', checkParamsArtistId, deleteArtist)

// ALBUMS

app.post('/artist/:artistId/albums', checkParamsArtistId, createAlbum)

app.get('/albums', listAlbums)

app.get('/albums/artist/:artistId', checkParamsArtistId, listAlbumsOfArtist)

app.get('/albums/:albumId', getAlbumById)

app.patch('/albums/:albumId', updateAlbum)

app.delete('/albums/:albumId', deleteAlbum)

// SONGS

app.post('/album/:albumId/song', createSong)

module.exports = app


