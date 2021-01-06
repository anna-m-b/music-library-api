const { Artist } = require('../../models')

exports.checkParamsArtistId = (req, res, next) => {
  Artist.findByPk(req.params.artistId)
  .then(artist => {
    if(!artist) {
      res.status(404).send({error: 'Artist not found' })
    } else {
      res.locals.artist = artist
      return next()
    }
  })
}
