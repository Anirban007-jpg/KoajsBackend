const Router = require('koa-router');
const { createJournal } = require('../controllers/journal');
const { requireSignin } = require('../controllers/authController');




const router = new Router();
router.post('/journal', requireSignin, createJournal);


module.exports = router;