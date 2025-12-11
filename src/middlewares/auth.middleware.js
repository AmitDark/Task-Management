const { verifyAccessToken } = require('../utils/token.util');
const User = require('../models/user.model');


async function authenticate(req, res, next) {
try {
const auth = req.headers.authorization;
if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });
const token = auth.split(' ')[1];
const payload = verifyAccessToken(token);
const user = await User.findById(payload.id).select('-password');
if (!user || !user.isActive) return res.status(401).json({ message: 'Unauthorized' });
req.user = user;
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid or expired token' });
}
}


module.exports = authenticate;