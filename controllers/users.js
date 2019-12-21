const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const Unauthorized = require('../errors/Unauthorized.js');
const NotFoundError = require('../errors/not-found-err.js');
const BadRequest = require('../errors/bad-request.js');
const InternalServerError = require('../errors/internal-server-error.js');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => {
      if (!user) {
        throw new InternalServerError('Произошла ошибка');
      }
      res.send({ data: user });
    })
    .catch(next);
};
module.exports.getUsersId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new InternalServerError('Пользователя с не существует!');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed') === 0) {
        throw new NotFoundError('Неправильный id');
      }
    })
    .catch(next);
};

module.exports.signUp = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      password: hash,
    }))
    .then((user) => {
      if (!user) {
        throw new BadRequest('Произошла ошибка');
      }
      res.status(201).send({
        _id: user._id,
        email: user.email,
      })
        .catch(next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Произошла ошибка');
      }
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d' }),
      })
        .catch(next);
    });
};
