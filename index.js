const http = require('http');

const app = require('./src/app');
const { PORT } = require('./src/utils/config');
const logger = require('./src/utils/logger');

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
