const artistsRouter = require('express').Router()

const { 
  createArtist, 
  listArtists, 
  getArtistById, 
  updateArtist, 
  deleteArtist 
} = require('../controllers/artists')

const { checkArtistId } = require('../middleware/validation')

artistsRouter.post('/', createArtist)

artistsRouter.get('/', listArtists)

artistsRouter.get('/:artistId', checkArtistId, getArtistById)

artistsRouter.patch('/:artistId', checkArtistId, updateArtist)

artistsRouter.delete('/:artistId', checkArtistId, deleteArtist)

module.exports = artistsRouter