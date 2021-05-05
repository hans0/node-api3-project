const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const Users = require('./users-model');
const Posts = require('../posts/posts-model');
// The middleware functions also need to be required
const {
  logger,
  validateUserId, 
  validateUser,
  validatePost
} = require('../middleware/middleware.js');


const router = express.Router();


router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get(req.query)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(next);
});


router.get('/:id',  validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.json(req.user);
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Users.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next);
    // equivalent to this
    // .catch(error => next(error) )

});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Users.update(req.params.id, req.body)
    .then(rowsChanged => { //eslint-disable-line
      return Users.getById(req.params.id);
    })
    .then(upatedUser => {
      res.status(200).json(upatedUser)
    })
    .catch(next);
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  try {
    await Users.remove(req.params.id)
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const posts = await Users.getUserPosts(req.params.id)
    res.status(200).json(posts);
  } catch(err){
    next(err);
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  try {
    const newPost = await Posts.insert({
      user_id: req.params.id,
      text: req.text
    });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => { //  eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: 'something tragic insides posts router happened',
    message: err.message,
    stack: err.stack,
  })
})

// do not forget to export the router
module.exports = router;
