const Router = require('koa-router');
const { createUser, Loginuser } = require('../controllers/authController');
const validateUser = require('../validators/individualValidator');


const router = new Router();

router.post('/register', validateUser,createUser);
outer.post('/login',Loginuser);

module.exports = router;