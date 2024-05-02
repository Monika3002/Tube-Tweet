# The First Backend Project 

This is the repository for our first backend project. Here, you'll find details about the project's setup, usage, and development tools.

## Controllers 

Controllers are used in this project to handle the business logic. They interact with the model, and render a response to the client.

## Git Ignore Generator

To generate a `.gitignore` file for this project, we used the following tool: [Git Ignore Generator](https://mrkandreev.name/snippets/gitignore-generator/)

## Nodemon

Nodemon is a development tool used in this project. It's a utility that monitors for any changes in your source and automatically restarts your server. It's perfect for development as you don't have to keep stopping and restarting your server every time you make a change.

To install Nodemon as a dev dependency, use the following command:

```bash
npm install --save-dev nodemon

#Prettier
Prettier is a code formatter used in this project. It enforces a consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

how to connect the database. we are using mongodb here
mongodb atlas https://www.mongodb.com/atlas/database
# this are required
dotenv package
mongoose 
express

another required pakages for custom api
cors :CORS(cross origin resource sharing) is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
https://www.npmjs.com/package/cors

cookies-praser:Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
https://www.npmjs.com/package/cookie-parser


install mongoose  aggreate  function npm install mongoose-aggregate-paginate-v2
It is a mongoose plugins : Plugins are a technique for reusing logic in multiple mongoose schemas. A plugin is similar to a method that you can use in your schema and reuse repeatedly over different instances of the schema. The main purpose of plugins is to modify your schemas.


bcrypt  :A library to help you hash passwords.https://www.npmjs.com/package/bcrypt

jwt(json web token) https://www.npmjs.com/package/json-web-token JWT encode and decode for Node.js that can use callbacks or by returning an object {error:, value:}

prehook in middleware


cloudnary : An big contentar organisation from  whicch

// uploading of file is done in two ways multer and express 
Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.

fs (File System) is a core Node.js module that provides an API for interacting with the file system. It allows you to perform operations like reading, writing, updating, and deleting files.The unlink method is one of the methods provided by the fs module. It's used to asynchronously delete a file from the file system.

After that we have  created the routes and controller routes decide whhere to take the control and controller decide what  to do .Wee need to define an app in app.js we also tested this route using postman

AccessToken = short lived authentication
refreshToken = long lived  