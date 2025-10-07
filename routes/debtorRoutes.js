const Router = require('koa-router');
const validateDebtor = require('../validators/debtor');
const { requireSignin, CompanyMiddleware } = require('../controllers/authController');
const { createDebtor, getDebtors, updateDebtor } = require('../controllers/debtor');




const router = new Router();
router.post('/debtor/create', requireSignin, CompanyMiddleware, validateDebtor, createDebtor);
router.get('/debtor/get', requireSignin, getDebtors);
router.put('/debtor/update', requireSignin, updateDebtor);


module.exports = router;