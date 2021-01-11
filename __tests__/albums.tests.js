/* eslint-disable no-undef */
const { expect } = require('chai')
const request = require('supertest')
const { Artist, Album } = require('../src/models')
const app = require('../src/app')

describe('/albums', () => {
   let artist
 
   before(async () => {
     try {
       await Artist.sequelize.sync()
       await Album.sequelize.sync()
     } catch (err) {
       console.log(err)
     }
   })
 
   beforeEach(async () => {
     try {
       await Artist.destroy({ where: {} })
       await Album.destroy({ where: {} })
       artist = await Artist.create({
         name: 'Tame Impala',
         genre: 'Rock',
       })
     } catch (err) {
       console.log(err)
     }
   })
 
   describe('POST /albums/artists/:artistId', () => {
     it('creates a new album for a given artist', (done) => {
       request(app)
         .post(`/albums/artists/${artist.id}`)
         .send({
           name: 'InnerSpeaker',
           year: 2010,
         })
         .then((res) => {
           expect(res.status).to.equal(201)
 
           Album.findByPk(res.body.album.id, { raw: true }).then((album) => {
             expect(album.name).to.equal('InnerSpeaker')
             expect(album.year).to.equal(2010)
             expect(album.artistId).to.equal(artist.id)
             done()
           }).catch(error => done(error))
         }).catch(error => done(error))  
     })

     it('creates multiple albums for a given artist', (done) => {
      const albums = [
        {name: 'InnerSpeaker', year: 2010},
        {name: 'Currents', year: 2015},
        {name: 'Lonerism', year: 2012}
      ]
      request(app)
        .post(`/albums/artists/${artist.id}`)
        .send({ albums })
        .then((res) => {
          expect(res.status).to.equal(201)
          res.body.albums.forEach((resAlbum, i) => {
            expect(resAlbum.name).to.equal(albums[i].name)
            expect(resAlbum.year).to.equal(albums[i].year)
          })
          done()
        })
        .catch(error => done(error))
     })

    it('creates multiple albums for a given artist', (done) => {
      const albums = [
        {name: 'InnerSpeaker', year: 2010},
        {name: 'Currents', year: 2015},
        {name: 'Lonerism', year: 2012}
      ]
      request(app)
        .post(`/albums/artists/${artist.id}`)
        .send({ albums })
        .then((res) => {
          expect(res.status).to.equal(201)
          const album = res.body.albums[1]
            Album.findByPk(album.id, { raw: true }).then((DBalbum) => {
              expect(DBalbum.name).to.equal('Currents')
              expect(DBalbum.year).to.equal(2015)
              expect(DBalbum.artistId).to.equal(artist.id)
              done()
            }).catch(error => done(error))
          })
    })
        
     it('returns a 404 and does not create an album if the artist does not exist', (done) => {
       request(app)
         .post('/albums/artists/1234')
         .send({
           name: 'InnerSpeaker',
           year: 2010,
         })
         .then((res) => {
           expect(res.status).to.equal(404)
           expect(res.body.error).to.equal('Artist not found')
 
           Album.findAll().then((albums) => {
             expect(albums.length).to.equal(0)
             done()
           })
         })
         .catch(error => done(error))
     })
   })

   describe('with albums in the database', () => {
     let albums, artists;
     beforeEach((done) => {
         Promise.all([
            Artist.create({ name: 'Tame Impala', genre: 'Rock' }),
            Artist.create({ name: 'Kylie Minogue', genre: 'Pop' }),
            Artist.create({ name: 'Dave Brubeck', genre: 'Jazz' }),
         ]).then((documents) => {
            artists = documents
            done()
         })
         .catch(error => done(error))
      })

      beforeEach((done) => {
        Promise.all([
          Album.create({ artistName: 'Tame Impala', name: 'Lonerism', year: 2012 }).then(album => album.setArtist(artists[0])),
          Album.create({ artistName: 'Tame Impala', name: 'Currents', year: 2015 }).then(album => album.setArtist(artists[0])),
          Album.create({ artistName: 'Kylie Minogue',  name: 'Disco', year: 2020 }).then(album => album.setArtist(artists[1])),
          Album.create({ artistName: 'Kylie Minogue',  name: 'Kylie', year: 1988 }).then(album => album.setArtist(artists[1]))
        ]).then((documents) => {
          albums = documents
          done()
        })
        .catch(error => done(error))
      })

      describe('GET /albums', () => {
        it('returns a list of all albums', (done) => {
          request(app)
            .get('/albums')
            .then(res => {
              expect(res.status).to.equal(200)
              expect(res.body.length).to.equal(4)
              res.body.forEach(album => {
                const expected = albums.find(a => a.id === album.id)
                expect(album.artistName).to.equal(expected.artistName)
                expect(album.name).to.equal(expected.name)
                expect(album.year).to.equal(expected.year)
                expect(album.artistId).to.equal(expected.artistId)
              })
              done()
            })
            .catch(error => done(error))
        })

        it('returns the album of a given artist by id', (done) => {
          artist = artists[1]
          request(app)
            .get(`/albums/artists/${artist.id}`)
            .then(res => {
              expect(res.status).to.equal(200)
              res.body.forEach(resAlbum => {
                const expected = albums.find(a => a.id === resAlbum.id)
                expect(resAlbum.name).to.equal(expected.name)
                expect(resAlbum.year).to.equal(expected.year)
                expect(resAlbum.artistId).to.equal(expected.artistId)
              })          
              done()
            })
            .catch(error => done(error))
        })

        it('returns a 404 if the artist does not exist', (done) => {
          request(app)
            .get('/albums/artists/12345')
            .then((res) => {
              expect(res.status).to.equal(404)
              expect(res.body.error).to.equal('Artist not found')
              done()
            })
            .catch(error => done(error))
        })
      
        it('gets album record by id', (done) => {
          let album = albums[1]
          request(app)
            .get(`/albums/${album.id}`)
            .then((res) => {
              expect(res.status).to.equal(200)
              expect(res.body.name).to.equal(album.name)
              expect(res.body.year).to.equal(album.year)
              done()
            })
            .catch(error => done(error))
        })

        it('returns a 404 if the album does not exist', (done) => {
          request(app)
            .get('/albums/12345')
            .then((res) => {
              expect(res.status).to.equal(404)
              expect(res.body.error).to.equal('Album not found')
              done()
            })
            .catch(error => done(error))
        })
      })

      describe('PATCH /albums/:id', () => {
        it('updates album name by id', (done) => {
          const album = albums[0]
           request(app)
              .patch(`/albums/${album.id}`)
              .send({ name: 'Lonerist' })
              .then(res => {
                 expect(res.status).to.equal(200)
                 Album.findByPk(album.id, { raw: true }).then(updatedAlbum => {
                    expect(updatedAlbum.name).to.equal('Lonerist')
                    done()
                 }).catch(error => done(error))
              })
        })

        it('updates album year by id', (done) => {
          const album = albums[0]
          request(app)
          .patch(`/albums/${album.id}`)
          .send({ year: 2011 })
          .then(res => {
            expect(res.status).to.equal(200)
            Album.findByPk(album.id,  { raw: true }).then(updatedAlbum => {
              expect(updatedAlbum.year).to.equal(2011)
              done()
            }).catch(error => done(error))
          })
        })

        it('returns a 404 if the given field doesn\'t exist', () => {
          const album = albums[0]
          request(app)
            .patch(`/albums/${album.id}`)
            .send({ price: 15 })
            .then(res => {
              expect(res.status).to.equal(404)
              expect(res.body.error).to.equal('Field(s) not found')
              expect(res.body.requestedAlbum.name).to.equal(album.name)
              expect(res.body.requestedAlbum.year).to.equal(album.year)
              done()
            }).catch(error => done(error))
        })

        it('returns a 404 if the album does not exist', (done) => {
          request(app)
            .patch('/albums/43252')
            .send({ name: 'Doesn\'t Exist' })
            .then((res) => {
              expect(res.status).to.equal(404)
              expect(res.body.error).to.equal('Album not found')
              done()
            })
            .catch(error => done(error))
        })
      })
    

    describe('DELETE /albums/:albumId', () => {
      it('deletes album record by id', (done) => {
         const album = albums[0]
         request(app)
            .delete(`/albums/${album.id}`)
            .then(res => {
               expect(res.status).to.equal(204)
               Album.findByPk(album.id, { raw: true }).then(deletedAlbum => {
                  expect(deletedAlbum).to.equal(null)
                  done()
               })
            })
            .catch(error => done(error))
      })
      
      it('returns a 404 if the album does not exist', (done) => {
         request(app)
           .delete('/albums/43252')
           .then((res) => {
             expect(res.status).to.equal(404)
             expect(res.body.error).to.equal('Album not found')
             done()
           })
           .catch(error => done(error))
       })
    })
  })
})




