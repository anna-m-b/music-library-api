const  { Song } = require('../models')
const  { Artist } = require('../models')
const  { Album } = require('../models')


exports.createSong = (req, res) => {
  const { album, artist } = res.locals
  Song.create({ name: req.body.name })
  .then(song => {
    song.setAlbum(album)
      .then(() => song.setArtist(artist))
        .then(() => {
          Song.findByPk(song.id, {include: [{ model: Artist, as: 'artist'}, {model: Album, as: 'album'}]})
            .then((songData) => res.status(201).json(songData))
        })
  })
    .catch(error => console.error('error in createSong', error))   
}

exports.listSongs = (req, res) => {
  Song.findAll().then(songs => res.status(200).json({ songs }))
    .catch(error => console.error('error in listSongs', error))
}

exports.listSongsOfAlbum = (req, res) => {
  const { album } = res.locals
  Song.findAll({ where: { albumId: album.id}})
    .then(songs => res.status(200).json({ album: album.name, songs }))
    .catch(error => console.error('error in listSongsOfAlbum', error))
}

exports.listSongsOfArtist = (req, res) => {
  const { artist } = res.locals
  Song.findAll({ where: { artistId: artist.id }})
    .then(songs => res.status(200).json({ artist: artist.name, songs }))
    .catch(error => console.error('error in listSongsOfArtist', error))
}

exports.updateSong = (req, res) => {
  const { songId } = req.params
  Song.update(req.body, { where: { id: songId } })
  .then(() => {
    Song.findByPk(songId, { include: [{ model: Artist, as: 'artist' }, { model: Album, as: 'album' }] })
    .then(song => {
      res.status(200).json(song)
    })
  }).catch(error => console.error('error in updateSong', error))
}

exports.deleteSong = (req, res) => {
  Song.destroy({ where: { id: req.params.songId } })
  .then((rowsDeleted) => {
    res.status(204).json({ rowsDeleted })
  }).catch(error => console.error('error in deleteSong', error))
}