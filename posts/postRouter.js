const express = require('express');

const Posts = require('./postDb');

const router = express.Router();

// GET      >>>     Working
router.get('/', (req, res) => {
  Posts.get(req.query)
  .then(posts => {
    res.status(200)
      .json(posts)
  })
  .catch(err => {
    console.log('error message', err)
    res.status(500)
      .json({ message: 'Error getting posts' })
  })
});

// GET      >>>     Working
router.get('/:id', (req, res) => {
  Posts.getById(req.params.id)
  .then(post => {
    if (post) {
      res.status(200)
        .json(post)
    } else {
      res.status(404)
        .json({ message: 'The post with the specified ID does not exist' })
    }
  })
  .catch(err => {
    console.log('error message', err)
    res.status(500)
      .json({ message: 'Post cannot be found'})
  })
});

// PUT      >>>     Working
router.put('/:id', (req, res) => {
  const changes = req.body
  const {text} = req.body
  if (text) {
    Posts.update(req.params.id, changes)
    .then(post => {
      if (post) {
        res.status(200)
          .json(post)
      } else {
        res.status(404)
          .json({ message: 'The post witht the specified ID does not exist' })
      }
    })
    .catch(err => {
      console.log('Error with PUT for posts', err)
      res.status(500)
        .json({ message: 'The post information could not be modified' })
    })
  } else {
    res.status(400)
      .json({ message: 'Please provide text for the post'})
  }
});

// DELETE      >>>     Working
router.delete('/:id', (req, res) => {
  Posts.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200)
        .json({ message: 'Post successfully deleted' })
    } else {
      res.status(404)
        .json({ message: 'The post with the specified ID does not exist' })
    }
  })
  .catch(err => {
    console.log('Error DELETEing post', err)
    res.status(500)
      .json({ message: 'The post could not be deleted' })
  })
});


// custom middleware
function validatePostId(req, res, next) {
  const id = req.headers.id
  if (id && id === 123) {
    next()
  } else {
    res.status(401)
      .json({ message: 'You shall not pass!' })
  };
}

// middleware
router.use(validatePostId);

module.exports = router;
