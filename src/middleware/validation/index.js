const { Artist } = require('../../models')
const { Album } = require('../../models')
const { Song } = require('../../models')

exports.checkArtistId = (req, res, next) => {
  Artist.findByPk(req.params.artistId || req.body.artistId)
  .then(artist => {
    if(!artist) {
      res.status(404).send({error: 'Artist not found' })
    } else {
      res.locals.artist = artist
      return next()
    }
  })
}

exports.checkAlbumId = (req, res, next) => {
  Album.findByPk(req.params.albumId)
  .then(album => {
    if(!album) {
      res.status(404).send({error: 'Album not found' })
    } else {
      res.locals.album = album
      return next()
    }
  })
}

exports.checkSongId = (req, res, next) => {
  Song.findByPk(req.params.songId)
  .then(song => {
    if(!song) {
      res.status(404).send({ error: 'Song not found' })
    } else {
      res.locals.song = song
      return next()
    }
  })
}
