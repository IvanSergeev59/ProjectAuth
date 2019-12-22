const routerUser = require('express').Router();
const { getUsers, getUsersId } = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/:userId', getUsersId);
module.exports = routerUser;
