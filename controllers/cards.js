const Card = require('../models/card');
const InternalServerError = require('../errors/internal-server-error.js');
const NotFoundError = require('../errors/not-found-err.js');
const Unauthorized = require('../errors/Unauthorized.js');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        throw new InternalServerError('Произошла ошибка');
      }
      res.send({ data: card });
    })
    .catch(next);
};
module.exports.createCards = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      if (!card) {
        throw new InternalServerError('Произошла ошибка');
      }
      res.status(201).send({ date: card })
        .catch(next);
    });
};


module.exports.deleteCards = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardRemove) => res.send({ data: cardRemove }))
          .catch((err) => res.status(500).send({ message: err }));
      } else {
        return next(new Unauthorized('Нет прав'));
      }
    })
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed') === 0) {
        return next(new NotFoundError('Неправильный id'));
      }
      return next(new InternalServerError('Произошла ошибка'));
    });
};
