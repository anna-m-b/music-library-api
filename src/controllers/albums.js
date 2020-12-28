const { Album } = require('../models')
const { Artist } = require('../models')

exports.createAlbum =  (req, res) => {
   Artist.findByPk(req.params.artistId)
      .then(artist => {
         if (!artist) {
            res.status(404).send({ error: 'Artist not found' })
         } else {
            Album.create({ artistName: artist.name,
                           name: req.body.name,
                           year: req.body.year
            })
               .then(album => album.setArtist(artist))
               .then(album => res.status(201).json({ id: album.id }))      
         }
      })
}
