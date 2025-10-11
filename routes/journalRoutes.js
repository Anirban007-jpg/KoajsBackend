const Router = require('koa-router');
const { createJournal } = require('../controllers/journal');




const router = new Router();
router.post('/journal', createJournal);


module.exports = router;