const { Artist } = require('../models')

exports.createArtist = (req, res) => {
   Artist.create(req.body).then(artist => res.status(201).json(artist))
}

exports.listArtists = (req, res) => {
   Artist.findAll().then(artists => res.status(200).json(artists))
}

exports.getArtistById = (req, res) => {
    res.status(200).json(res.locals.artist)
}

exports.updateArtist = async (req, res) => {
  const rowsUpdated = await Artist.update(req.body, { where: { id: req.params.artistId } }) 
  const requestedArtist = await Artist.findByPk(req.params.artistId)
  if (!rowsUpdated[0]) {
    res.status(404).json({ error: 'Artist or field not found', requestedArtist })
  } else {
    res.status(200).json({ updatedArtist: requestedArtist })
  }
}

exports.deleteArtist = (req, res) => {
   Artist.destroy({ where: { id: req.params.artistId }})
   .then(() => res.sendStatus(204))
   .catch(err => console.log(err))
}
