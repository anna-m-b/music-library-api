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

### **Create an entry in the database**

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

The controller for this route uses the Sequelize method `findByPk(id)` which returns the entry that matches the given ID. 'Pk' stands for primary key. Read about it here: [Sequelize Docs](https://sequelize.org/master/manual/model-querying-finders.html)  
  

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


If the request is successful you will get the following response that tells you how many rows have been updated (it should be 1):  
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

To fulfill these update requests, in the controller we use the Sequelize method (Model.update)[https://sequelize.org/master/manual/model-querying-basics.html#simple-update-queries]

___

