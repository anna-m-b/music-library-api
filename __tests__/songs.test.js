/* eslint-disable no-undef */
const { expect } = require('chai')
const request = require('supertest')
const { Song, Artist, Album } = require('../src/models') // will look in index.js
const app = require('../src/app')

describe('/songs', () => {
  let artist, album

  before(async () => {
    try {
      await Song.sequelize.sync()
      await Album.sequelize.sync()
      await Artist.sequelize.sync()
    } catch (err) {
       console.log(err)
    } 
 })
  beforeEach(async () => { // clean up the table before each test to prevent old data messing with our tests
    try {
      await Song.destroy({ where: {} })
      await Artist.destroy({ where: {} })
      await Album.destroy({ where: {} })
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Psychedelic Rock'
      })
      album = await Album.create({ 
        name: 'Lonermism',
        year: 2012,
        artistName: 'Tame Impala'
      })
    } catch (err) {
      console.log(err)
    }
  })

  it('creates a new song under an album', (done) => {
    request(app)
      .post(`/album/${album.id}/song`)
      .send({
        artist: artist.id,
        name: 'Solitude Is Bliss',
      })
      .then((res) => {
        expect(res.status).to.equal(201)
        const songId = res.body.id
        expect(res.body.id).to.equal(songId)
        expect(res.body.name).to.equal('Solitude Is Bliss')
        expect(res.body.artistId).to.equal(artist.id)
        expect(res.body.albumId).to.equal(album.id)
        done()
      }).catch(error => done(error))
  })

})
