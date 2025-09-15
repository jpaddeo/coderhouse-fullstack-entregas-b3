import express from 'express';
import mongoose from 'mongoose';

import CONFIG from './utils/config.js';

import mockRoutes from './routes/mocks.router.js';
import userRoutes from './routes/users.router.js';
import petRoutes from './routes/pets.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(CONFIG.MONGODB_URI || 'mongodb://localhost:27017/mydb', {})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

app.use('/api/mocks', mockRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);

app.get('/api/status', (req, res) => {
  res.json({
    message: 'API funcionando correctamente',
    timestamp: new Date().getTime(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(CONFIG.PORT, () => {
  console.log(`Servidor corriendo en puerto ${CONFIG.PORT}`);
});

export default app;
