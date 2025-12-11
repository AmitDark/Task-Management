const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');


router.use(authenticate, authorize('ADMIN'));


router.get('/users', async (req, res) => {
const users = await User.find().select('-password');
res.json(users);
});


router.delete('/user/:id', async (req, res) => {
await User.findByIdAndDelete(req.params.id);
res.json({ message: 'Deleted' });
});


router.patch('/user/:id/deactivate', async (req, res) => {
const user = await User.findById(req.params.id);
user.isActive = false;
await user.save();
res.json({ message: 'Deactivated' });
});


module.exports = router;