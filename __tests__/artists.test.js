/* eslint-disable no-undef */
const { expect } = require('chai')
const request = require('supertest')
const { Artist } = require('../src/models')
const app = require('../src/app')

describe('/artists', () => {

   before(async () => {
      try {
        await Artist.sequelize.sync()
      } catch (err) {
         console.log(err)
      } 
   })

   beforeEach(async () => { // clean up the table before each test to prevent old data messing with our tests
      try {
         await Artist.destroy({ where: {} })
      } catch (err) {
         console.log(err)
      }
   })

   describe('POST /artists', async () => {
      it('creates a new artist in the database', async () => {
         try {
            const response = await request(app).post('/artists').send({
               name: 'Tame Impala',
               genre: 'Rock',
            })

            await expect(response.status).to.equal(201)
            expect(response.body.name).to.equal('Tame Impala');
            const insertedArtistRecords = await Artist.findByPk(response.body.id, { raw: true });
            expect(insertedArtistRecords.name).to.equal('Tame Impala');
            expect(insertedArtistRecords.genre).to.equal('Rock');
         } catch(err) {
         done(err)
         }
      })
   })

   describe('with artists in the database', () => {
      let artists;
      beforeEach((done) => {
         Promise.all([
            Artist.create({ name: 'Tame Impala', genre: 'Rock' }),
            Artist.create({ name: 'Kylie Minogue', genre: 'Pop' }),
            Artist.create({ name: 'Dave Brubeck', genre: 'Jazz' }),
         ]).then((documents) => {
            artists = documents;
            done()
         }) 
      })

      describe('GET /artists', () => {
         it('gets all artists records', (done) => {
            request(app)
               .get('/artists')
               .then((res => {
                 expect(res.status).to.equal(200)
                 expect(res.body.length).to.equal(3)
                 res.body.forEach((artist) => {
                   const expected = artists.find((a) => a.id === artist.id)
                   expect(artist.name).to.equal(expected.name)
                   expect(artist.genre).to.equal(expected.genre)
                  })
                  done()
               }))
               .catch(error => done(error))
         })
      })

      describe('GET /artists/:id', () => {
         it('gets artist record by id', (done) => {
            const artist = artists[0]
            request(app)
               .get(`/artists/${artist.id}`)
               .then((res) => {
                  expect(res.status).to.equal(200)
                  expect(res.body.name).to.equal(artist.name)
                  expect(res.body.genre).to.equal(artist.genre)
                  done()
               })
               .catch(error => done(error))
         })

         it('returns a 404 if the artist does not exist', (done) => {
            request(app)
              .get('/artists/12345')
              .then((res) => {
                expect(res.status).to.equal(404)
                expect(res.body.error).to.equal('Artist not found')
                done()
              })
              .catch(error => done(error))
          })
      })

      describe('PATCH /artists/:id', () => {
        
         it('updates artist genre by id', (done) => {
          const artist = artists[0]
            request(app)
               .patch(`/artists/${artist.id}`)
               .send({ genre: 'Psychedelic Rock' })
               .then(( res => {
                  expect(res.status).to.equal(200)
                  Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
                     expect(updatedArtist.genre).to.equal('Psychedelic Rock')
                     done()
                  })
               }))
               .catch(error => done(error))
         })
         
         it('updates artist name by id', (done) => {
            const artist = artists[0]
            request(app)
               .patch(`/artists/${artist.id}`)
               .send({ name: 'Tame Impaler' })
               .then(( res => {
                  expect(res.status).to.equal(200)
                  Artist.findByPk(artist.id, { raw: true }).then((updatedArtist) => {
                     expect(updatedArtist.name).to.equal('Tame Impaler')
                     done()
                  })
               }))
               .catch(error => done(error))
         })

         it('returns a 404 if the given field to update doesn\'t exist', (done) => {
          const artist = artists[0]
           request(app)
            .patch(`/artists/${artist.id}`)
            .send({ color: 'Purple'})
            .then(res => {
              expect(res.status).to.equal(404)
              expect(res.body.error).to.equal('Artist or field not found')
              expect(res.body.requestedArtist.name).to.equal(artist.name)
              expect(res.body.requestedArtist.genre).to.equal(artist.genre)
              done()
            }).catch(error => done(error))
          })

         it('returns a 404 if the artist does not exist', (done) => {
            request(app)
              .patch('/artists/43252')
              .send({ name: 'Doesn\'t Exist' })
              .then((res) => {
                expect(res.status).to.equal(404)
                expect(res.body.error).to.equal('Artist or field not found')
                expect(res.body.requestedArtist).to.be.null
                done()
              })
              .catch(error => done(error))
          })
      })

      describe('DELETE /artists/:artistId', () => {
         it('deletes artist record by id', (done) => {
            const artist = artists[0]
            request(app)
               .delete(`/artists/${artist.id}`)
               .then((res) => {
                  expect(res.status).to.equal(204)
                  Artist.findByPk(artist.id, { raw: true }).then((deletedArtist) => {
                     expect(deletedArtist).to.equal(null)
                     done()
                  })
               })
               .catch(error => done(error))
         })
         it('returns a 404 if the artist does not exist', (done) => {
            request(app)
              .delete('/artists/43252')
              .then((res) => {
                expect(res.status).to.equal(404)
                expect(res.body.error).to.equal('Artist not found')
                done()
              })
              .catch(error => done(error))
          })
      })
   })
})