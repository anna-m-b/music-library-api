const { Artist } = require('../models')

exports.createArtist = (req, res) => {
   Artist.create(req.body).then(artist => res.status(201).json(artist))
   .catch(error => console.error('error in createArtist', error))
}

exports.listArtists = (req, res) => {
   Artist.findAll().then(artists => res.status(200).json(artists))
   .catch(error => console.error('error in listArtists', error))
}

exports.getArtistById = (req, res) => {
    res.status(200).json(res.locals.artist)
}

exports.updateArtist = (req, res) => {
  const requestedArtist = res.locals.artist
  Artist.update(req.body, { where: { id: req.params.artistId } })
  .then(rowsUpdated => {
    if (!rowsUpdated[0]) {
        res.status(404).json({ error: 'Field(s) given not found', requestedArtist })
      } else {
        res.status(200).json({ updatedArtist: requestedArtist })
      }
  })
  .catch(error => console.error('error in updateAritst', error))
}

exports.deleteArtist = (req, res) => {
   Artist.destroy({ where: { id: req.params.artistId }})
   .then((rowsDeleted) => res.status(204).json({ rowsDeleted }))
   .catch(error => console.error('error in deleteArtist', error))
}
