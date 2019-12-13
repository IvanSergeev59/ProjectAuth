const routerCard = require('express').Router();
const { getCards, createCards, deleteCards } = require('../controllers/cards');

routerCard.get('/', getCards);
routerCard.post('/', createCards);
routerCard.delete('/:cardId', deleteCards);
module.exports = routerCard;
