const Router = require('koa-router');
const { createUser } = require('../controllers/authController');
const validateUser = require('../validators/individualValidator');


const router = new Router();

router.post('/register', validateUser,createUser);

module.exports = router;