require('dotenv').config();
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const key = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';


const Unauthorized = require('../errors/Unauthorized.js');


const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Ошибка авторизации'));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
  return { authorization };
};
