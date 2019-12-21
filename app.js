const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { signUp, login } = require('./controllers/users');
const auth = require('./middlewares/auth.js');

const { PORT = 3001 } = process.env;
const app = express();
app.use(requestLogger); // подключаем логгер запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.get('/', auth, (req, res) => {
  res.send({ message: 'API' });
});

app.post('/signup', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().min(2).required(),
    about: Joi.string().min(2).required(),
    avatar: Joi.string().min(2).required(),
    password: Joi.string().min(2).required(),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(true),
}), signUp);
app.post('/signin', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    email: Joi.string().email().min(2).required(),
    password: Joi.string().min(2).required(),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(true),
}), login);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.listen(PORT, () => {
});
