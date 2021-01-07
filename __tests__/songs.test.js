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
  beforeEach(async () => { 
    try {
      await Song.destroy({ where: {} })
      await Artist.destroy({ where: {} })
      await Album.destroy({ where: {} })
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Psychedelic Rock'
      })
      album = await Album.create({ 
        name: 'Lonerism',
        year: 2012,
        artistName: 'Tame Impala'
      })
    } catch (err) {
      console.log(err)
    }
  })

  describe('/POST song', () => {
    it('creates a new song under an album and returns records in place of foreign keys ', (done) => {
      request(app)
        .post(`/album/${album.id}/song`)
        .send({
          artistId: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(201)
          expect(res.body.name).to.equal('Solitude Is Bliss')
          expect(res.body.artistId).to.equal(artist.id)
          expect(res.body.albumId).to.equal(album.id)
          expect(res.body.artist.name).to.equal('Tame Impala')
          expect(res.body.album.name).to.equal('Lonerism')
          done()
        }).catch(error => done(error))
    })

    it('returns a 404 if album does not exist', (done) => {
      request(app)
        .post('/album/32423/song')
        .send({
          artistId: artist.id,
          name: 'Solitude Is Bliss',
        })
        .then((res) => {
          expect(res.status).to.equal(404)
          expect(res.body.error).to.equal('Album not found')
          done()
        }).catch(error => done(error))
    })

    it('returns a 404 if artist does not exist', (done) => {
      request(app)
        .post(`/album/${album.id}/song`)
        .send({
          artistId: 4343,
          name: 'Solitude Is Bliss'
        })
        .then((res) => { 
          expect(res.status).to.equal(404)
          expect(res.body.error).to.equal('Artist not found')
          done()
        }).catch(error => done(error))
    })
  })

  describe('with songs in the database', () => {
    let songs
    beforeEach((done) => {
      Promise.all([
        Song.create({ name: 'Solitude Is Bliss', artistId: artist.id, albumId: album.id }),
        Song.create({ name: 'Be Above It', artistId: artist.id, albumId: album.id }),
        Song.create({ name: 'Apocalypse Dreams', artistId: artist.id, albumId: album.id })
      ])
      .then(documents => {
        songs = documents
        done()
      })
    })

    it('lists all songs', (done) => {
      request(app)
      .get('/songs')
      .then(res => {
        expect(res.status).to.equal(200)
        res.body.songs.forEach(song => {
          const expected = songs.find(s => s.id === song.id)
          expect(song.name).to.equal(expected.name)
        })
        done()
      }).catch(error => done(error))
    })

    it('lists all songs on a given album', (done) => {
      request(app)
      .get(`/songs/album/${album.id}`)
      .then(res => {
        expect(res.status).to.equal(200)
        expect(res.body.album).to.equal(album.name)
        res.body.songs.forEach(song => {
          const expected = songs.find(s => s.id === song.id)
          expect(song.name).to.equal(expected.name)
        })
        done()
      }).catch(error => done(error))
    })

    it('returns a 404 if album does not exist', (done) => {
      request(app)
      .get('/songs/album/32342')
      .then(res => {
        expect(res.status).to.equal(404)
        expect(res.body.error).to.equal('Album not found')
        done()
      }).catch(error => done(error))
    })

    it('lists all songs of a given artist', (done) => {
      request(app)
      .get(`/songs/artist/${artist.id}`)
      .then(res => {
        expect(res.status).to.equal(200)
        expect(res.body.artist).to.equal(artist.name)
        res.body.songs.forEach(song => {
          const expected = songs.find(s => s.id === song.id)
          expect(song.name).to.equal(expected.name)
        })
        done()
      }).catch(error => done(error))
    })

    it('returns a 404 if artist does not exist', (done) => {
      request(app)
      .get('/songs/artist/32342')
      .then(res => {
        expect(res.status).to.equal(404)
        expect(res.body.error).to.equal('Artist not found')
        done()
      }).catch(error => done(error))
    })
  
  
  })


  

})
