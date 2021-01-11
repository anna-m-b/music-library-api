const albumsRouter = require('express').Router()

const { 
  createAlbum, 
  listAlbums, 
  listAlbumsOfArtist, 
  getAlbumById, 
  updateAlbum, 
  deleteAlbum 
} = require('../controllers/albums')

const { checkArtistId, checkAlbumId } = require('../middleware/validation')

albumsRouter.post('/artists/:artistId', checkArtistId, createAlbum)

albumsRouter.get('/', listAlbums)

albumsRouter.get('/artists/:artistId', checkArtistId, listAlbumsOfArtist)

albumsRouter.get('/:albumId', checkAlbumId, getAlbumById)

albumsRouter.patch('/:albumId', checkAlbumId, updateAlbum)

albumsRouter.delete('/:albumId', checkAlbumId, deleteAlbum)

module.exports = albumsRouter

