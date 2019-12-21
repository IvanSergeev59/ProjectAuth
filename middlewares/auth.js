require('dotenv').config();
const jwt = require('jsonwebtoken');

// const { NODE_ENV, JWT_SECRET } = process.env;
process.env.Key = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : require('../config');


const Unauthorized = require('../errors/Unauthorized.js');


const extractBearerToken = (header) => header.replace('Bearer ', '');
// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Ошибка авторизации'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, process.env.KEY);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
