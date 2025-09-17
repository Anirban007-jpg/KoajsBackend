const Router = require('koa-router');
const { createUser, Loginuser, signout, CompanyMiddleware, requireSignin } = require('../controllers/authController');
const validateUser = require('../validators/individualValidator');


const router = new Router();

router.post('/register', validateUser,createUser);
router.post('/login',Loginuser);
router.post('/signout',signout);
router.post('/test',requireSignin,CompanyMiddleware, async (ctx) => {
    console.log("say hello")
})

module.exports = router;