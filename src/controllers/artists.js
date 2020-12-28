const { Artist } = require('../models')

exports.createArtist = (req, res) => {
   Artist.create(req.body).then(artist => res.status(201).json(artist))
}

exports.listArtists = (req, res) => {
   Artist.findAll().then(artists => res.status(200).json(artists))
}

exports.getArtistById = (req, res) => {
   Artist.findByPk(req.params.id)
   .then(artist => {
      if (artist === null) {
         res.status(404).send({ error: 'Artist not found' })
      } else {
         res.status(200).json(artist)
      }
   })
   .catch(err => console.log(err))
}

exports.updateArtist = async (req, res) => {
   let rowsUpdated;
   if (!req.body.name && req.body.genre) {
      rowsUpdated = await Artist.update({ genre: req.body.genre }, { 
         where: {
               id: req.params.id
            }
         })
   } else if (req.body.name && !req.body.genre) {
      rowsUpdated = await Artist.update({ name: req.body.name }, {
         where: {
            id: req.params.id
         }
       })
   }
       
    if (!rowsUpdated[0]) {
            res.status(404).json({ error: 'Artist not found' })
         } else {
            res.status(200).json({ rowsUpdated: rowsUpdated[0] })
         }
}

exports.deleteArtist = (req, res) => {
   Artist.destroy({ where: { id: req.params.id }})
   .then(rowsDeleted =>{
      if(!rowsDeleted) {
         res.status(404).json({ error: 'Artist not found' })
      } else {
         res.sendStatus(204)
      }
   })
   .catch(err => console.log(err))
}
