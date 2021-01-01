const { request } = require('express')
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
  Album.findAll({where: { artistId: req.params.artistId}})
  .then(albums => {
    if(!albums.length) {
      res.status(404).send({ error: 'Artist not found'})
    } else {
     res.status(200).json(albums)
    }
  })
  .catch(err => console.log(err))
}

exports.getAlbumById = (req, res) => {
  Album.findByPk(req.params.albumId)
   .then(album => {
      if (album === null) {
         res.status(404).send({ error: 'Album not found' })
      } else {
         res.status(200).json(album)
      }
   })
   .catch(err => console.log(err))
}

exports.updateAlbum = async (req, res) => {
  let rowsUpdated
  if(req.body.name){
    rowsUpdated = await Album.update({ name: req.body.name }, {
    where: {
      id: req.params.albumId
    }
  })
  } else if (req.body.year){
    rowsUpdated = await Album.update({ year: req.body.year }, {
      where: {
        id: req.params.albumId
      }
    })
  }

  if(!rowsUpdated[0]){
    res.status(404).send({ error: 'Album not found' })
  } else {
    res.status(200).json({ rowsUpdated: rowsUpdated[0] })
  }
}

exports.deleteAlbum = (req, res) => {
  Album.destroy({ where: { id: req.params.albumId } })
  .then(rowsDeleted => {
  
    if (!rowsDeleted) {
     res.status(404).send({ error: 'Album not found' })
    } else {
     res.status(204).json({ rowsDeleted: rowsDeleted })
    }
  }).catch(error => console.log(error))
}
 


