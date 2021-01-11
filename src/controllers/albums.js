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
      })
    ) 
    .then(albums => res.status(201).json({ albums }))
    .catch(error => console.error('error in createAlbum(mulitple)', error))
  } else {
    Album.create({ 
      artistName: artist.name,
      name: req.body.name,
      year: req.body.year
    })
    .then(album => album.setArtist(artist))
    .then(album => res.status(201).json({ album }))
    .catch(error => console.error('error in createAlbum(single)', error))   
  }
}

exports.listAlbums = (req, res) => {
    Album.findAll().then(albums => res.status(200).json(albums))
    .catch(error => console.error('error in listAlbums', error)) 
}

exports.listAlbumsOfArtist = (req, res) => {
  Album.findAll({where: { artistId: req.params.artistId}})
  .then(albums => {
    res.status(200).json(albums)
  })
  .catch(error => console.error('error in listAlbumsOfArtist', error)) 
}

exports.getAlbumById = (req, res) => {
  const { album } = res.locals
  res.status(200).json(album)
}

exports.updateAlbum = (req, res) => {
  Album.update(req.body, { where: { id: req.params.albumId } })
  .then(rowsUpdated => {
    Album.findByPk(req.params.albumId)
    .then(requestedAlbum => {
      if(!rowsUpdated[0]){
        res.status(404).send({ error: 'Field(s) not found', requestedAlbum })
      } else {
        res.status(200).json({ updatedAlbum: requestedAlbum })
      }
    })
  })
  .catch(error => console.error('error in updateAlbum', error)) 
}

exports.deleteAlbum = (req, res) => {
  Album.destroy({ where: { id: req.params.albumId } })
  .then((rowsDeleted) => res.status(204).json({ rowsDeleted }))
  .catch(error => console.error('error in deleteAlbum', error)) 
}
