const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

// GET      >>>     Working
router.get('/', (req, res) => {
  Users.get(req.query)
  .then(users => {
    res.status(200)
      .json(users)
  })
  .catch(err => {
    console.log('error message', err)
    res.status(500)
      .json({ message: 'error message' })
  })
});

// GET      >>>     Working
router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(user => {
    if (user) {
      res.status(200)
        .json(user)
    } else {
      res.status(404)
        .json({ message: 'The user with the specified ID does not exist' })
    }
  })
  .catch(err => {
    console.log('error message', err)
    res.status(500)
      .json({ message: 'error message' })
  })
});

// GET-sub      >>>     Working
router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(posts => {
    if (posts) {
      res.status(200)
        .json(posts)
    } else {
      res.status(404)
        .json({ message: 'The user with the specified ID does not exist' })
    }
  })
  .catch(err => {
    console.log('error message', err)
    res.status(500)
      .json({ message: 'error message' })
  })
});

//    POST      >>>     Working
router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    if (user) {
      res.status(201)
        .json(user)
    } else {
      res.status(400)
        .json({ message: 'Please provide required information for the user' })
    }
  })
  .catch(err => {
    console.log('error message', err)
    res.status(500)
      .json({ message: 'error message' })
  })
});

//    POST      >>>     Working
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const text = req.body
  if (text) {
    Posts.insert(req.body)
    .then(post => {
      if (post) {
        res.status(201)
          .json(post)
      } else {
        res.status(404)
          .json({ message: 'The user with the specified ID does not exist' })
      }
    })
    .catch(err => {
      console.log('error message', err)
      res.status(500)
        .json({ message: 'Error posting new post' })
    })
  } else {
    res.status(400)
      .json({ message: 'Please provide text for the post'})
  }
});

//        PUT      >>>     Working
router.put('/:id', validateUserId, (req, res) => {
  const changes = req.body
  const {name} = req.body
  if (name) {
    Users.update(req.params.id, changes)
    .then(user => {
      if (user) {
        res.status(200)
          .json(user)
      } else {
        res.status(404)
          .json({ message: 'The user with the specified ID does not exist' })
      }
    })
    .catch(err => {
      res.status(500)
        .json({ message: 'The user information could not be modified' })
    })
  } else {
    res.status(400)
      .json({ message: 'Please provide name for the user' })
  }
});

//            DELETE      >>>     Working
router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(count => {
    if (count > 0) {
      res.status(200)
        .json({ message: 'The user has been removed' })
    } else {
      res.status(404)
        .json({ message: 'The user wuth the specified ID does not exist' })
    }
  })
  .catch(err => {
    console.log('Error with DELETE', err)
    res.status(500)
      .json({ message: 'The user could not be deleted' })
  })
});


//custom middleware
function validateUserId(req, res, next) {
  Users.getById(req.params.id)
  .then(res => {
    if (res) {
      req.user = res
      next()
    } else {
      res.status(404)
        .json({ message: 'You shall not pass!' })
    };
  })
  .catch(err => {
    console.log('Error with validateUserId middleware')
    res.status(500)
      .json({ message: 'Error obtaining user ID' })
  })
};

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400)
      .json({ message: 'Missing user data' })
  } else if (!req.body.name) {
    res.status(400)
      .json({ message: 'missing required name field' })
  } else {
    req.user = req.body
    next()
  }
};

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400)
      .json({ message: 'Missing post data' })
  } else if (!req.body.text) {
    res.status(400)
      .json({ message: 'missing required text field' })
  } else {
    next()
  }
};

// middleware
// router.use(validateUser());
// router.use(validateUserId);
router.use(validatePost);

module.exports = router;
