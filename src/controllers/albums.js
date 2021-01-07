const { Album } = require('../models')

exports.createAlbum =  (req, res) => {
  const { artist } = res.locals
    if (req.body.albums) {
      Promise.all(
        req.body.albums.map(album => {
          return Album.create({ 
                  artistName: artist.name,
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
      .catch(error => console.error(error))     
    }
}

exports.listAlbums = (req, res) => {
    Album.findAll().then(albums => res.status(200).json(albums))
    .catch(err => console.log(err))  
}

exports.listAlbumsOfArtist = (req, res) => {
  Album.findAll({where: { artistId: req.params.artistId}})
  .then(albums => {
    res.status(200).json(albums)
  })
  .catch(err => console.log(err))
}

exports.getAlbumById = (req, res) => {
  const { album } = res.locals
  res.status(200).json(album)
}

exports.updateAlbum = async (req, res) => {
  const rowsUpdated = await Album.update(req.body, { where: { id: req.params.albumId } })
  const requestedAlbum = await Album.findByPk(req.params.albumId)
  if(!rowsUpdated[0]){
    res.status(404).send({ error: 'Album or field not found', requestedAlbum })
  } else {
    res.status(200).json({ updatedAlbum: requestedAlbum })
  }
}

exports.deleteAlbum = (req, res) => {
  Album.destroy({ where: { id: req.params.albumId } })
  .then((rowsDeleted) => res.status(204).json({ rowsDeleted }))
  .catch(err => console.error(err))
}
 



// updateAlbum
