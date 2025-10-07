const Router = require('koa-router');


const { requireSignin, CompanyMiddleware } = require('../controllers/authController');
const validateLedger = require('../validators/ledgerValidator');
const { createLedger, getLedgers, updateClosingBalanceLedgers, getSpecificLedger } = require('../controllers/ledgerController');


const router = new Router();
router.post('/ledger/create', requireSignin, CompanyMiddleware, validateLedger, createLedger);
router.get('/ledger/get', requireSignin, getLedgers);
router.get('/ledger/get/specific', requireSignin, getSpecificLedger);
router.put('/ledger/updateclosingbalance', requireSignin, updateClosingBalanceLedgers);

module.exports = router;