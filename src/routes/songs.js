const songsRouter = require('express').Router()

const { 
  listSongs,
  updateSong,
  deleteSong
} = require('../controllers/songs')

const {  checkSongId } = require('../middleware/validation')


songsRouter.get('/', listSongs)

songsRouter.patch('/:songId', checkSongId, updateSong)

songsRouter.delete('/:songId', checkSongId, deleteSong)

module.exports = songsRouter