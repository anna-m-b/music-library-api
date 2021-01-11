module.exports = (connection, DataTypes) => {
   const schema = {
      artistName: DataTypes.STRING,
      name: DataTypes.STRING,
      year: DataTypes.INTEGER,
   }

   const AlbumModel = connection.define('album', schema)
   return AlbumModel
}