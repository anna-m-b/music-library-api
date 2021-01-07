module.exports = (connection, DataTypes) => {
   const schema = {
      name: DataTypes.STRING,
      genre: DataTypes.STRING,
   }

   const ArtistModel = connection.define('artist', schema)
   return ArtistModel
}