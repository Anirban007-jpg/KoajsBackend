const Router = require('koa-router');


const { requireSignin, CompanyMiddleware } = require('../controllers/authController');
const validateLedger = require('../validators/ledgerValidator');
const { createLedger, getLedgers } = require('../controllers/ledgerController');


const router = new Router();
router.post('/ledger/create', requireSignin, CompanyMiddleware, validateLedger, createLedger);
router.get('/ledger/get', requireSignin, getLedgers);

module.exports = router;