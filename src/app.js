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
        listSongs,
        listSongsOfAlbum,
        listSongsOfArtist
      } = require('./controllers/songs')

const { checkArtistId, checkAlbumId } = require('./middleware/validation')


app.use(express.json())


// ARTISTS

app.post('/artists', createArtist)

app.get('/artists', listArtists)

app.get('/artists/:artistId', checkArtistId, getArtistById)

app.patch('/artists/:artistId', updateArtist)

app.delete('/artists/:artistId', checkArtistId, deleteArtist)

// ALBUMS

app.post('/artist/:artistId/albums', checkArtistId, createAlbum)

app.get('/albums', listAlbums)

app.get('/albums/artist/:artistId', checkArtistId, listAlbumsOfArtist)

app.get('/albums/:albumId', checkAlbumId, getAlbumById)

app.patch('/albums/:albumId', updateAlbum)

app.delete('/albums/:albumId', checkAlbumId, deleteAlbum)

app.post('/album/:albumId/song', checkAlbumId, checkArtistId, createSong)

// SONGS

app.get('/songs', listSongs)

app.get('/songs/album/:albumId', checkAlbumId, listSongsOfAlbum)

app.get('/songs/artist/:artistId', checkArtistId, listSongsOfArtist)

module.exports = app
