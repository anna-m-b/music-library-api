const  { Song } = require('../models')
const  { Artist } = require('../models')
const { Album } = require('../models')

exports.createSong = async (req, res) => {
  try {
    const album = await Album.findByPk(req.params.albumId)
    const artist  = await Artist.findByPk(req.body.artist)
    const song = await Song.create({ name: req.body.name })
    await song.setAlbum(album)
    await song.setArtist(artist)
    res.status(201).json(song)
  } catch(error) {
    console.log('error creating Song', error)
  } 
}

// albumId - params
// artistId - body

// expect(res.body.id).to.equal(songId)
//         expect(res.body.name).to.equal('Solitude Is Bliss')
//         expect(res.body.artistId).to.equal(artist.id)
//         expect(res.body.albumId).to.equal(album.id)