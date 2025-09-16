const Router = require('koa-router');
const { createUser, Loginuser, signout } = require('../controllers/authController');
const validateUser = require('../validators/individualValidator');


const router = new Router();

router.post('/register', validateUser,createUser);
router.post('/login',Loginuser);
router.post('/signout',signout);

module.exports = router;