const Router = require('koa-router');

const validateUser = require('../validators/individualValidator');
const { requireSignin, CompanyMiddleware } = require('../controllers/authController');
const validateLedger = require('../validators/ledgerValidator');
const { createLedger } = require('../controllers/ledgerController');


const router = new Router();
router.post('/ledger/create', requireSignin, CompanyMiddleware, validateLedger, createLedger);


module.exports = router;