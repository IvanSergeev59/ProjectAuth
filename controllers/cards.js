const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
module.exports.createCards = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ date: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
module.exports.deleteCards = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((cardRemove) => res.send({ data: cardRemove }))
          .catch((err) => res.status(500).send({ message: err }));
      } else {
        res.status(403).send({ message: 'Het nPaB' });
      }
    })
    .catch((err) => {
      if (err.message.indexOf('Cast to ObjectId failed') === 0) {
        res.status(404).send({ message: 'Неправильный id' });
        return;
      }
      res.status(500).send({ message: err });
    });
};
