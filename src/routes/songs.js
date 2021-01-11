const songsRouter = require('express').Router()

const { 
  createSong,
  listSongs,
  listSongsOfAlbum,
  listSongsOfArtist,
  updateSong,
  deleteSong
} = require('../controllers/songs')

const { checkArtistId, checkAlbumId, checkSongId } = require('../middleware/validation')

songsRouter.post('/albums/:albumId', checkAlbumId, checkArtistId, createSong)

songsRouter.get('/', listSongs)

songsRouter.get('/albums/:albumId', checkAlbumId, listSongsOfAlbum)

songsRouter.get('/artists/:artistId', checkArtistId, listSongsOfArtist)

songsRouter.patch('/:songId', checkSongId, updateSong)

songsRouter.delete('/:songId', checkSongId, deleteSong)

module.exports = songsRouter