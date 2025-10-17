const Router = require('koa-router');
const { requireSignin } = require('../controllers/authController');
const { createbank, getBanks, updateBank } = require('../controllers/bank');



const router = new Router();
router.post('/bank/create', requireSignin, CompanyMiddleware, createbank);
router.get('/bank/get', requireSignin, getBanks);
router.put('/bank/update', requireSignin, updateBank);


module.exports = router;