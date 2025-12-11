require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { initRedis } = require('./config/redis');
const logger = require('./utils/logger');


const PORT = process.env.PORT || 4000;


async function start() {
await connectDB(process.env.MONGO_URI);
initRedis(process.env.REDIS_URL);
app.listen(PORT, () => logger.info(`Server listening on port ${PORT}`));
}


start().catch(err => {
logger.error('Failed to start', err);
process.exit(1);
});