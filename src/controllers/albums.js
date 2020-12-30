const { Album } = require('../models')
const { Artist } = require('../models')

exports.createAlbum =  (req, res) => {
  Artist.findByPk(req.params.artistId)
    .then(artist => {
      if (!artist) {
        res.status(404).send({ error: 'Artist not found' })
      } else if (req.body.albums) {
        Promise.all(
          req.body.albums.map(album => {
            return Album.create({ artistName: artist.name,
            name: album.name,
            year: album.year
          })
          .then(album => album.setArtist(artist))
          .catch(error => console.error(error))
          })
        ) 
        .then(albums => res.status(201).json({albums}))
        .catch(error => console.error(error))
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

exports.listAlbums = (req, res) => {
    Album.findAll().then(albums => res.status(200).json(albums))
    .catch(err => console.log(err))  
}

exports.listAlbumsOfArtist = (req, res) => {
  console.log(req.params.artistId)
  Album.findAll({where: { artistId: req.params.artistId}})
  .then(albums => res.status(200).json(albums))
  .catch(err => console.log(err))
}


