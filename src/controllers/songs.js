const  { Song } = require('../models')
const  { Artist } = require('../models')
const  { Album } = require('../models')
const album = require('../models/album')

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
    .catch(err => console.err(err))
}

exports.listSongsOfAlbum = (req, res) => {
  const { album } = res.locals
  Song.findAll({ where: { albumId: album.id}})
    .then(songs => res.status(200).json({ album: album.name, songs: songs }))
    .catch(err => console.error(err))
}

exports.listSongsOfArtist = (req, res) => {
  const { artist } = res.locals
  Song.findAll({ where: { artistId: artist.id }})
    .then(songs => res.status(200).json({ artist: artist.name, songs: songs}))
}
