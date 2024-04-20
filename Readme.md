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