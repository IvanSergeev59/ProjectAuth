const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const { signUp, login } = require('./controllers/users');
// eslint-disable-next-line import/no-extraneous-dependencies
const auth = require('./middlewares/auth.js');

const { PORT = 3000 } = process.env;
const app = express();
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

app.post('/signup', signUp);
app.post('/signin', login);
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.listen(PORT, () => {
});
app.use('/*', (req, res) => {
  res.status('404').send({ message: 'Запрашиваемый ресурс не найден' });
});
