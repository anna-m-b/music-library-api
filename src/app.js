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

app.use(express.json())

// ARTISTS

app.post('/artists', createArtist)

app.get('/artists', listArtists)

app.get('/artists/:id', getArtistById)

app.patch('/artists/:id', updateArtist)

app.delete('/artists/:id', deleteArtist)


// ALBUMS

app.post('/artists/:artistId/albums', createAlbum)

app.get('/albums', listAlbums)

app.get('/albums/artist/:artistId', listAlbumsOfArtist)

app.get('/albums/:albumId', getAlbumById)

app.patch('/albums/:albumId', updateAlbum)

app.delete('/albums/:albumId', deleteAlbum)

module.exports = app


