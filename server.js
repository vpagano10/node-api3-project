const express = require('express');
const helmet = require('helmet');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl}`);
  next();
};

// middleware
server.use(express.json());
server.use(helmet());
server.use(logger);

server.use('/api/posts', postRouter)
server.use('/api/users', userRouter)

module.exports = server;
