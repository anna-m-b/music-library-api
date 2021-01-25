const artistsRouter = require('express').Router()

const { 
  createArtist, 
  listArtists, 
  getArtistById, 
  updateArtist, 
  deleteArtist 
} = require('../controllers/artists')

const {
  createAlbum,
  listAlbumsOfArtist
} = require('../controllers/albums')

const {
  listSongsOfArtist
} = require('../controllers/songs')

const { checkArtistId } = require('../middleware/validation')

artistsRouter.post('/', createArtist)

artistsRouter.get('/', listArtists)

artistsRouter.get('/:artistId', checkArtistId, getArtistById)

artistsRouter.patch('/:artistId', checkArtistId, updateArtist)

artistsRouter.delete('/:artistId', checkArtistId, deleteArtist)

artistsRouter.post('/:artistId/albums', checkArtistId, createAlbum)

artistsRouter.get('/:artistId/albums', checkArtistId, listAlbumsOfArtist)

artistsRouter.get('/:artistId/songs', checkArtistId, listSongsOfArtist)

module.exports = artistsRouter