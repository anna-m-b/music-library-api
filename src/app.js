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
        listSongsOfArtist,
        updateSong,
        deleteSong
      } = require('./controllers/songs')

const { checkArtistId, checkAlbumId, checkSongId } = require('./middleware/validation')


app.use(express.json())


// ARTISTS

app.post('/artists', createArtist)

app.get('/artists', listArtists)

app.get('/artists/:artistId', checkArtistId, getArtistById)

app.patch('/artists/:artistId', updateArtist)

app.delete('/artists/:artistId', checkArtistId, deleteArtist)

// ALBUMS

app.post('/artists/:artistId/albums', checkArtistId, createAlbum)

app.get('/albums', listAlbums)

app.get('/albums/artists/:artistId', checkArtistId, listAlbumsOfArtist)

app.get('/albums/:albumId', checkAlbumId, getAlbumById)

app.patch('/albums/:albumId', updateAlbum)

app.delete('/albums/:albumId', checkAlbumId, deleteAlbum)

app.post('/albums/:albumId/songs', checkAlbumId, checkArtistId, createSong)

// SONGS

app.get('/songs', listSongs)

app.get('/songs/albums/:albumId', checkAlbumId, listSongsOfAlbum)

app.get('/songs/artists/:artistId', checkArtistId, listSongsOfArtist)

app.patch('/songs/:songId', checkSongId, updateSong)

app.delete('/songs/:songId', checkSongId, deleteSong)

module.exports = app
