module.exports = (connection, DataTypes) => {
   const schema = {
      name: DataTypes.STRING,
      year: DataTypes.INTEGER,
   }

   const AlbumModel = connection.define('album', schema)
   return AlbumModel
}