import express from 'express';
import mongoose from 'mongoose';

import CONFIG from './utils/config.js';
import { logger } from './utils/logger.js';

import { logMiddleware } from './middlewares/log.middleware.js';

import docsRoutes from './routes/docs.router.js';
import mockRoutes from './routes/mocks.router.js';
import userRoutes from './routes/users.router.js';
import petRoutes from './routes/pets.router.js';
import adoptionsRoutes from './routes/adoptions.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);

mongoose
  .connect(CONFIG.MONGODB_URI || 'mongodb://localhost:27017/mydb', {})
  .then(() => logger.info('Conectado a MongoDB'))
  .catch((error) => logger.error('Error conectando a MongoDB:', error));

app.use('/api/docs', docsRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionsRoutes);

app.get('/api/status', (_, res) => {
  res.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().getTime(),
  });
});

app.use((err, req, res, __) => {
  req.logger.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(CONFIG.PORT, () => {
  logger.info(`Servidor corriendo en puerto ${CONFIG.PORT}`);
});

export default app;
