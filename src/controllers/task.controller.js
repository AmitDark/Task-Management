const Task = require('../models/task.model');


async function createTask(req, res, next) {
try {
const { title, description, assignedTo } = req.body;
const task = await Task.create({ title, description, assignedTo, createdBy: req.user._id });
res.status(201).json(task);
} catch (err) {
next(err);
}
}
async function listTasks(req, res, next) {
try {
const { page = 1, limit = 10, status, search } = req.query;
const filter = {};
if (status) filter.status = status;
if (search) filter.title = { $regex: search, $options: 'i' };
// If not admin, only return user's tasks or tasks assigned to them
if (req.user.role !== 'ADMIN') {
filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
}
const tasks = await Task.find(filter)
.skip((page - 1) * limit)
.limit(Number(limit))
.sort({ createdAt: -1 })
.populate('assignedTo', 'name email');
res.json(tasks);
} catch (err) {
next(err);
}
}


async function getTask(req, res, next) {
try {
const task = await Task.findById(req.params.id).populate('assignedTo', 'name email');
if (!task) return res.status(404).json({ message: 'Not found' });
// authorize
if (req.user.role !== 'ADMIN' && ![String(task.createdBy), String(task.assignedTo)].includes(String(req.user._id))) {
return res.status(403).json({ message: 'Forbidden' });
}
res.json(task);
} catch (err) {
next(err);
}
}


async function updateTask(req, res, next) {
try {
const updates = req.body;
const task = await Task.findById(req.params.id);
if (!task) return res.status(404).json({ message: 'Not found' });
if (req.user.role !== 'ADMIN' && String(task.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
Object.assign(task, updates);
await task.save();
res.json(task);
} catch (err) {
next(err);
}
}


async function deleteTask(req, res, next) {
try {
const task = await Task.findById(req.params.id);
if (!task) return res.status(404).json({ message: 'Not found' });
if (req.user.role !== 'ADMIN' && String(task.createdBy) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
await task.remove();
res.json({ message: 'Deleted' });
} catch (err) {
next(err);
}
}


module.exports = { createTask, listTasks, getTask, updateTask, deleteTask };