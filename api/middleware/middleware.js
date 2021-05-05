const Users = require('../users/users-model');
const Posts = require('../posts/posts-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  // logs to the console the following information about each request: request method, request url, and a timestamp
  console.log(`
    ${req.method} ${req.originalUrl}
    ${new Date().toLocaleString()}
  `);
  next();
}

async function validateUserId(req, res, next) {
  // this middleware will be used for all user endpoints that include an id parameter in the url (ex: /api/users/:id and it should check the database to make sure there is a user with that id.
  // if the id parameter is valid, store the user object as req.user and allow the request to continue
  // if the id parameter does not match any user id in the database, respond with status 404 and { message: "user not found" }
  // DO YOUR MAGIC
  try {
    const user =  await Users.getById(req.params.id);
    if (!user) {
      res.status(404).json({
        message: `User with id ${req.params.id} not found.`
      })
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
}

async function validateUser (req, res, next) {
  // validateUser validates the body on a request to create or update a user
  // if the request body lacks the required name field, respond with status 400 and { message: "missing required name field" }
  // DO YOUR MAGIC
  if (!req.body.name || req.body.name.trim().length === 0){
    res.status(400).json({ 
      message: "missing required name field" 
    });
    return;
  }
  Users.insert(req.body)
    .then(user => {
      res.status(200).json(user);
      next(user);
    })
    .catch(error => {
      console.log(error);
      next(error);
    })
}

function validatePost(req, res, next) {
  // validatePost validates the body on a request to create a new post
  // if the request body lacks the required text field, respond with status 400 and { message: "missing required text field" }
  if (!req.body.text){
    res.status(400).json({ 
      message: "missing required text field" 
    });
    return;
  }
  // DO YOUR MAGIC
  // Post

}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId, 
  validateUser,
  validatePost
};