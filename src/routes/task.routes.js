const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/task.controller');
const authenticate = require('../middlewares/auth.middleware');


router.use(authenticate);
router.post('/', taskCtrl.createTask);
router.get('/', taskCtrl.listTasks);
router.get('/:id', taskCtrl.getTask);
router.put('/:id', taskCtrl.updateTask);
router.delete('/:id', taskCtrl.deleteTask);


module.exports = router;