const routerCard = require('express').Router();
// eslint-disable-next-line import/no-unresolved
const { celebrate, Joi } = require('celebrate');
const { getCards, createCards, deleteCards } = require('../controllers/cards');

routerCard.get('/', getCards);
routerCard.post('/', celebrate({
  // валидируем параметры
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().min(2).required(),
  }),
  headers: Joi.object().keys({
    'content-type': 'application/json',
  }).unknown(true),
}), createCards);
routerCard.delete('/:cardId', deleteCards);
module.exports = routerCard;
