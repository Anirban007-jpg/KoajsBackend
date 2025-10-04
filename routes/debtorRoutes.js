const Router = require('koa-router');
const validateDebtor = require('../validators/debtor');
const { requireSignin, CompanyMiddleware } = require('../controllers/authController');
const { createDebtor, getDebtors } = require('../controllers/debtor');




const router = new Router();
router.post('/debtor/create', requireSignin, CompanyMiddleware, validateDebtor, createDebtor);
router.get('/debtor/get', requireSignin, getDebtors);


module.exports = router;