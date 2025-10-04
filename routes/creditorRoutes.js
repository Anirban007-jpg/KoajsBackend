const Router = require('koa-router');
const { requireSignin, CompanyMiddleware } = require('../controllers/authController');
const validateCreditor = require('../validators/creditor');
const { createCreditor, getCreditors } = require('../controllers/creditor');




const router = new Router();
router.post('/creditor/create', requireSignin, CompanyMiddleware, validateCreditor, createCreditor);
router.get('/creditor/get', requireSignin, getCreditors);


module.exports = router;