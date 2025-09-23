const Router = require('koa-router');
const { createUser, Loginuser, signout, CompanyMiddleware, requireSignin, CitizenMiddleware } = require('../controllers/authController');
const validateUser = require('../validators/individualValidator');


const router = new Router();

router.post('/register', validateUser,createUser);
router.post('/login',Loginuser);
router.post('/signout',signout);
router.post('/test',CitizenMiddleware,async(ctx)=>
{
    console.log("hello")
});
router.post('/test1',CompanyMiddleware,async(ctx)=>
    {
        console.log("hello")
    });


module.exports = router;