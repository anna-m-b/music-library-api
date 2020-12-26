const { Artist } = require('../models')

const createArtist = (req, res) => {
 Artist.create(req.body).then(artist => res.status(201).json(artist))
}

module.exports = {
   createArtist,
}