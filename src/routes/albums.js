const albumsRouter = require('express').Router()

const { 
  listAlbums, 
  getAlbumById, 
  updateAlbum, 
  deleteAlbum 
} = require('../controllers/albums')

const {
  listSongsOfAlbum,
  createSong
} = require('../controllers/songs')

const { checkAlbumId, checkArtistId } = require('../middleware/validation')

albumsRouter.get('/', listAlbums)

albumsRouter.get('/:albumId', checkAlbumId, getAlbumById)

albumsRouter.patch('/:albumId', checkAlbumId, updateAlbum)

albumsRouter.delete('/:albumId', checkAlbumId, deleteAlbum)

albumsRouter.get('/:albumId/songs', checkAlbumId, listSongsOfAlbum)

albumsRouter.post('/:albumId/songs', checkAlbumId, checkArtistId, createSong)

module.exports = albumsRouter

