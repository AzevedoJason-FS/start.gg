const { Router } = require('express')
const route = Router();
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')

route.post('/api/auth/register', userController.register);
route.post('/api/auth/activation', userController.activate);
route.post('/api/auth/signin', userController.signin);
route.post('/api/auth/access', userController.access);
route.post('/api/auth/forgot_password', userController.forgot)
route.post('/api/auth/reset_password', auth, userController.reset)
route.get('/api/auth/user', auth, userController.info);
route.patch('/api/auth/user_update', auth, userController.update);
route.get('/api/auth/signout', userController.signout);

module.exports = route;