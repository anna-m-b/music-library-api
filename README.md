# Music Library API
*A back-end bootcamp project* <br>

This music library API will store information about artists, albums and songs. A CRUD REST API will be implemented to interact with a MySQL database.
 ___

## Project status

Incomplete

---  

### Tech Stack

- Node.js
- Express
- JavaScript 
- Sequelize
- MySQL  
  
---  

## Getting Started

___
## Features

Before trying to update the database make sure both your app and mysql container are running by enetering the following commands into your terminal:

Start your app: `$ npm start`

Start the container: `$ docker container start music_library_mysql`  

<br />

### **Create an entry in the Artists table**

Store an artist in the database by making a POST request to: http://localhost:4000/artists  

Include artist name and genre in the request body in JSON format, e.g.

```
{
  "name": "Philip Glass",
  "genre": "Contemporary Classical"
}
```

You should receive a response like this:

```
{
    "id": 4,
    "name": "Philip Glass",
    "genre": "Contemporary Classical",
    "updatedAt": "2020-12-27T09:25:07.636Z",
    "createdAt": "2020-12-27T09:25:07.636Z"
}
```

Fire up MySQL Workbench, open up the music database and punch in `SELECT * FROM Artists` in the query tab to see your entry in the table.  
  
    
### **Get all entries in the Artists table**

Make a GET request to: http://localhost:4000/artists and you should receive an array of all the entries in the artists table.

The controller for this route uses the Sequelize method `findAll()` with no arguments, which returns an array of all entries in the target table. Read about it here: [Sequelize Docs](https://sequelize.org/master/manual/model-querying-finders.html)

  
### **Get one artist by ID**

Make a GET request to: http://localhost:4000/artists/:id but replace `:id` with the ID of the artist you want. 

For example, `http://localhost:4000/artists/1` returns  

```
{
    "id": 1,
    "name": "Tame Impala",
    "genre": "Rock",
    "createdAt": "2020-12-26T19:55:49.000Z",
    "updatedAt": "2020-12-26T19:55:49.000Z"
}
```
If the id can't be found in the database, you will receive an error message:

```
{
    "error": "Artist not found"
}
```  

The controller for this route uses the Sequelize method `findByPk(id)` which returns the entry that matches the given ID. 'Pk' stands for primary key, which is the unique identifier of a database entry. Read about `findByPk` and other 'finders' here: [Sequelize Docs](https://sequelize.org/master/manual/model-querying-finders.html)  
  

### **Update artist name or genre**

To update an artist name, send a PATCH request with the name in the request body to http://localhost:4000/artists/:id

```
{
   "name": "New Name"
}
```

To update the genre, use the same path but send a body with info for the new genre:  
```
{ 
   "genre": "New Genre"
}
```  


If the request is successful you will get  status of 200 and the following response that tells you how many rows have been updated (it should be 1):  
```
{
    "rowsUpdated": 1
}
```  

And if the id sent in the request doesn't match with any entries in the database the response should be:  

```
{
    "error": "Artist not found"
}
```

To fulfill these update requests, the controller calls the Sequelize method (Model.update)[https://sequelize.org/master/manual/model-querying-basics.html#simple-update-queries]


### **Delete an artist**

To delete an artist from the artists table, make a DELETE request to http://localhost:4000/artists/:id with the id of the artist to be deleted.

If it is successful, you should receive a status of 204 (No Content) and the number '1' which represents the number of rows deleted. If the id doesn't match any entry in the artist table, the same error message as above will be sent in the response body, along with status code 404 (Not Found).

Behind the scenes, Sequelize's (Model.destroy)[https://sequelize.org/master/class/lib/model.js~Model.html#static-method-destroy] method does the heavy lifting.

___

### **Create an entry in the albums table**

To insert the information for an album, make a POST request to http://localhost:4000/artists/:artistId/albums with the relevant artist id.

In the body send the album name and year in JSON:


```
{
  "name": "Glassworks",
  "year": "1982"
}
```

If all is well, the response will be the newly created record's id, e.g.

```
{
    "id": 10
}
```

To create multiple album entries for the same artist at once, send an array in the request body:

```
{
  "albums": [{"name":"The Epic","year":2015},{"name":"Heaven and Earth","year":2018},{"name":"The Proclamation","year":2007}]
}
```

A successful request will receive the created entries in the response body:

```
{
    "albums": [
        {
            "id": 11,
            "artistName": "Kamasi Washington",
            "name": "The Epic",
            "year": 2015,
            "updatedAt": "2021-01-01T14:26:11.568Z",
            "createdAt": "2021-01-01T14:26:11.540Z",
            "artistId": 9
        },
        {
            "id": 13,
            "artistName": "Kamasi Washington",
            "name": "Heaven and Earth",
            "year": 2018,
            "updatedAt": "2021-01-01T14:26:11.598Z",
            "createdAt": "2021-01-01T14:26:11.540Z",
            "artistId": 9
        },
        {
            "id": 12,
            "artistName": "Kamasi Washington",
            "name": "The Proclamation",
            "year": 2007,
            "updatedAt": "2021-01-01T14:26:11.595Z",
            "createdAt": "2021-01-01T14:26:11.540Z",
            "artistId": 9
        }
    ]
}
```

You can see that the artist name and artist id have been generated automatically. 

### Setting foreign keys in Sequelize

'artistId' is the foreign key for an album entry. After creating an album entry, `setArtist(artist)` is called on it, Sequelize does its black magic and the field artistId is given the value of the passed artist's id.

This requires setting up when we set up the database in index.js in the models directory. After calling our AlbumModel, we call Sequelize's belongsTo method, which sets a many-to-one relationship between Album and Artist. Many albums can belong to one and only one artist. The first argument passed in is the Artist model which establishes that every album will be associated with an artist and have that artist's id as a foreign key. The second argument defines the field name for the foreign key - 'artist' will become 'artistId' because we use 'as'. You can also do: `foreignKey: 'artistId'` or whatever you'd like to name the field. You can also leave out this parameter and Sequelize will automatically name it.

```
 Album.belongsTo(Artist, {as: 'artist'})
```
---

If you try to create an album entry for a non-existent artist, you'll receive:

```
{
    "error": "Artist not found"
}
```

### **Reading from the albums table**
To get a list of all albums make a GET request to http://localhost:4000/albums and you'll receive an array of all the album entries, e.g.:

```
[
    {
        "id": 1,
        "artistName": "Tame Impala",
        "name": "InnerSpeaker",
        "year": 2010,
        "createdAt": "2021-01-01T14:53:56.000Z",
        "updatedAt": "2021-01-01T14:53:56.000Z",
        "artistId": 10
    },
    {
        "id": 2,
        "artistName": "Philip Glass",
        "name": "Solo Piano",
        "year": 1989,
        "createdAt": "2021-01-01T14:54:02.000Z",
        "updatedAt": "2021-01-01T14:54:03.000Z",
        "artistId": 8
    },
   
    {
        "id": 3,
        "artistName": "Kamasi Washington",
        "name": "The Proclamation",
        "year": 2007,
        "createdAt": "2021-01-01T14:54:08.000Z",
        "updatedAt": "2021-01-01T14:54:08.000Z",
        "artistId": 9
    }
]
```

To get a list of all albums by just one artist, make a GET request passing the artist id as a route parameter to http://localhost:4000/albums/artist/:artistId.

To get a specific album, pass the album id as a route parameter: http://localhost:4000/albums/:albumId


If the artist or album isn't found the usual error message will be returned.

### Updating an album entry

An album name or year can be changed with a PATCH request to http://localhost:4000/albums/:albumId with the relevant album id passed as a route parameter and the change sent in the body:
```
{
  "name": "Changes"
}
```
or:
```
{
  "year": 2015
}
```
If successful the response should be '1': the number of rows that have been updated.

To achieve the update, in the controller, Sequelize's Model.update method is used:
```
Album.update({ name: req.body.name }, {
    where: {
      id: req.params.albumId
    }
  })
```

### Deleting an album entry

Send a DELETE request to http://localhost:4000/albums/:albumId

As with update, a successful request will receive the number of rows updated, that is, 1.

In both cases, an album id without a corresponding record will receive an error message.

