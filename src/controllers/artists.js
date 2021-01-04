const { Artist } = require('../models')

exports.createArtist = (req, res) => {
   Artist.create(req.body).then(artist => res.status(201).json(artist))
}

exports.listArtists = (req, res) => {
   Artist.findAll().then(artists => res.status(200).json(artists))
}

exports.getArtistById = (req, res) => {
   Artist.findByPk(req.params.id)
   .then(artist => {
      if (artist === null) {
         res.status(404).send({ error: 'Artist not found' })
      } else {
         res.status(200).json(artist)
      }
   })
   .catch(err => console.log(err))
}

exports.updateArtist = async (req, res) => {
  const rowsUpdated = await Artist.update(req.body, { where: { id: req.params.id } }) 
  const requestedArtist = await Artist.findByPk(req.params.id)
  if (!rowsUpdated[0]) {
    res.status(404).json({ error: 'Artist or field not found', requestedArtist })
  } else {
    res.status(200).json({ updatedArtist: requestedArtist })
  }
}

exports.deleteArtist = (req, res) => {
   Artist.destroy({ where: { id: req.params.id }})
   .then(rowsDeleted =>{
      if(!rowsDeleted) {
         res.status(404).json({ error: 'Artist not found' })
      } else {
         res.sendStatus(204)
      }
   })
   .catch(err => console.log(err))
}
