const User = require('../models/user.model');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../utils/token.util');
const { initRedis } = require('../config/redis');


const redis = initRedis(process.env.REDIS_URL);


async function register(req, res, next) {
try {
const { name, email, password } = req.body;
let user = await User.findOne({ email });
if (user) return res.status(400).json({ message: 'Email already registered' });
user = await User.create({ name, email, password });
const accessToken = createAccessToken({ id: user._id, role: user.role });
const refreshToken = createRefreshToken({ id: user._id });
// Store refresh token in Redis with key `refresh:<userId>`
await redis.set(`refresh:${user._id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
res.status(201).json({ accessToken, refreshToken });
} catch (err) {
next(err);
}
}


async function login(req, res, next) {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });
const isMatch = await user.comparePassword(password);
if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
const accessToken = createAccessToken({ id: user._id, role: user.role });
const refreshToken = createRefreshToken({ id: user._id });
await redis.set(`refresh:${user._id}`, refreshToken, 'EX', 7 * 24 * 60 * 60);
res.json({ accessToken, refreshToken });
} catch (err) {
next(err);
}
}


async function refresh(req, res, next) {
try {
const { token } = req.body; // refresh token
if (!token) return res.status(400).json({ message: 'Missing token' });
const payload = verifyRefreshToken(token);
const saved = await redis.get(`refresh:${payload.id}`);
if (!saved || saved !== token) return res.status(401).json({ message: 'Invalid refresh token' });
const accessToken = createAccessToken({ id: payload.id, role: payload.role });
const newRefresh = createRefreshToken({ id: payload.id });
await redis.set(`refresh:${payload.id}`, newRefresh, 'EX', 7 * 24 * 60 * 60);
res.json({ accessToken, refreshToken: newRefresh });
} catch (err) {
next(err);
}
}


async function logout(req, res, next) {
try {
const { userId } = req.body;
if (!userId) return res.status(400).json({ message: 'Missing userId' });
await redis.del(`refresh:${userId}`);
res.json({ message: 'Logged out' });
} catch (err) {
next(err);
}
}


module.exports = { register, login, refresh, logout };